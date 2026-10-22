/// 注入页面的探针脚本。放在 Swift 里而不是单独的 .js：
/// 它们只给原型用，不该出现在打进 App 的 web/ 资源里被页面引用到。
enum ProbeScripts {
    /// 文档开始时挂上，收集页面自己的报错。只挂主框架。
    static let errorCollector = #"""
    (function () {
      var errors = window.__protoErrors = [];
      window.addEventListener('error', function (e) {
        errors.push({ kind: 'error', message: String(e.message), source: e.filename, line: e.lineno });
      });
      window.addEventListener('unhandledrejection', function (e) {
        var r = e.reason;
        errors.push({ kind: 'rejection', message: String(r && r.message || r) });
      });
      // 原生云端桥的请求日志：页面载入期间谁发了什么、拿回什么。CloudClient 在自己的 IIFE 里
      // 捕获了 handler 对象，所以这里包的是那个对象本身的 postMessage。
      try {
        var handler = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.seedtocodeCloud;
        if (handler) {
          var post = handler.postMessage.bind(handler);
          var net = window.__protoNet = [];
          handler.postMessage = function (message) {
            var entry = { t: Math.round(performance.now()), type: message && message.type, method: message && message.method, path: message && message.path };
            net.push(entry);
            return post(message).then(function (reply) {
              entry.reply = reply && (reply.ok ? reply.status + ' ' + String(reply.text).slice(0, 60) : 'fail:' + reply.kind);
              return reply;
            }, function (err) { entry.reply = 'threw ' + err; throw err; });
          };
        }
      } catch (e) {}
      var original = console.error;
      console.error = function () {
        errors.push({ kind: 'console.error', message: Array.prototype.map.call(arguments, String).join(' ') });
        return original.apply(console, arguments);
      };
    })();
    """#

    /// 逐页检查：页面能不能打开、有没有报错、各全局对象是否就位。
    static let pageSummary = #"""
    const globals = ['CAIEStorage', 'AuthStore', 'CloudClient', 'SyncQueue', 'SyncEngine', 'CAIEEngine',
      'CAIERuntime', 'CAIEExercise', 'CAIETeaching', 'CAIEAssignment', 'SAMPLES'];
    return JSON.stringify({
      title: document.title,
      href: location.href,
      errors: window.__protoErrors || [],
      globals: globals.filter(function (name) { return typeof window[name] !== 'undefined'; }),
      cloudConfiguration: window.CloudClient ? CloudClient.configuration() : null,
      bodyTextLength: (document.body && document.body.innerText || '').length,
      // 离线依据：页面载入过的、不是来自 App 包本身的资源。应为空。
      externalResources: performance.getEntriesByType('resource').map(function (e) { return e.name; })
        .filter(function (n) { return n.indexOf(location.origin + '/') !== 0 && n.indexOf('blob:') !== 0 && n.indexOf('data:') !== 0; }),
      stylesheets: Array.prototype.map.call(document.styleSheets, function (s) {
        try { return { href: s.href, rules: s.cssRules.length }; } catch (e) { return { href: s.href, error: String(e) }; }
      })
    });
    """#

    /// 阶段 A 的核心探针，在真实 lab.html 里跑。`remote` 由原生侧传入。
    static let probe = #"""
    const out = { env: {}, checks: {} };
    const timeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout ' + ms + 'ms')), ms))]);
    async function check(name, fn) {
      try { out.checks[name] = { ok: true, value: await timeout(Promise.resolve().then(fn), 15000) }; }
      catch (e) { out.checks[name] = { ok: false, error: String(e && e.message || e) }; }
    }
    function fail(message) { throw new Error(message); }
    function idbRequest(r) { return new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }

    out.env = {
      href: location.href, origin: location.origin, protocol: location.protocol,
      isSecureContext: window.isSecureContext, online: navigator.onLine, userAgent: navigator.userAgent
    };

    // storage.js 第 104 行在没有 randomUUID 时会直接抛错：非安全上下文下 IndexedDB 镜像会静默失败。
    await check('crypto.randomUUID', () => typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : fail('missing'));

    await check('localStorage.launchCounter', () => {
      const key = '__proto.launches';
      const previous = Number(localStorage.getItem(key) || 0);
      localStorage.setItem(key, String(previous + 1));
      return { previous, now: Number(localStorage.getItem(key)) };
    });

    await check('indexedDB.launchCounter', async () => {
      const open = indexedDB.open('__proto_db', 1);
      open.onupgradeneeded = () => open.result.createObjectStore('kv');
      const db = await idbRequest(open);
      const tx = db.transaction('kv', 'readwrite');
      const previous = (await idbRequest(tx.objectStore('kv').get('launches'))) || 0;
      tx.objectStore('kv').put(previous + 1, 'launches');
      await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = () => rej(tx.error); });
      db.close();
      return { previous, now: previous + 1 };
    });

    await check('CAIEStorage.deviceId', () => window.CAIEStorage ? CAIEStorage.deviceId() : fail('CAIEStorage missing'));

    // 真实草稿：第一次启动时按使用者的路径（execCommand 输入）在当前文件末尾加一行标记，
    // 等页面自己的自动保存；之后每次启动检查它还在不在。IndexedDB 镜像只在保存时才建，
    // 所以这一步必须排在 appDatabase 之前。
    await check('editorDraft', async () => {
      const ta = document.getElementById('code');
      if (!ta) fail('#code missing');
      const marker = '// __proto draft marker';
      const presentAtLoad = ta.value.indexOf(marker) >= 0;
      if (!presentAtLoad) {
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
        document.execCommand('insertText', false, '\n' + marker);
        await new Promise((r) => setTimeout(r, 2000));
      }
      const saved = (localStorage.getItem(CAIEStorage.key.editor) || '').indexOf('__proto draft marker') >= 0;
      return { presentAtLoad, savedToLocalStorage: saved, saveState: document.getElementById('saveState').textContent };
    });

    // 应用自己的库：只在它已经存在时打开。不带版本号去 open 一个不存在的库会建出空的 v1，
    // 之后页面按真实 schema 升级时就可能缺 object store——探针不能污染被测对象。
    await check('appDatabase', async () => {
      if (!indexedDB.databases) fail('indexedDB.databases unavailable');
      const list = await indexedDB.databases();
      const found = list.find((d) => d.name === 'caie9618.local');
      if (!found) return { exists: false, databases: list.map((d) => d.name) };
      const db = await idbRequest(indexedDB.open('caie9618.local'));
      const stores = Array.from(db.objectStoreNames);
      let device = null, projects = null;
      if (stores.includes('meta')) device = await idbRequest(db.transaction('meta').objectStore('meta').get('device'));
      if (stores.includes('projects')) projects = await idbRequest(db.transaction('projects').objectStore('projects').count());
      db.close();
      return { exists: true, version: found.version, stores, deviceId: device && device.deviceId, projects };
    });

    await check('cookie', () => {
      document.cookie = '__proto=1; path=/; max-age=31536000';
      return { written: true, readBack: document.cookie.indexOf('__proto=1') >= 0 };
    });

    await check('storageManager', async () => {
      if (!navigator.storage) return { available: false };
      return {
        available: true,
        persisted: navigator.storage.persisted ? await navigator.storage.persisted() : null,
        estimate: navigator.storage.estimate ? await navigator.storage.estimate() : null
      };
    });

    // 共享核心：用 samples.js 里真实的出厂样例，不手抄。
    function runSample(doc, inputs) {
      const queue = inputs.slice();
      let controller;
      controller = CAIERuntime.executeSource(doc.source, {
        profile: 'core-2027',
        virtualFiles: JSON.parse(JSON.stringify(SAMPLES.runtimeFiles)),
        onEvent: (event) => {
          if (event.type === 'input-requested') setTimeout(() => controller.provideInput(queue.length ? queue.shift() : ''), 0);
        }
      });
      const started = performance.now();
      return controller.result.then((r) => ({
        name: doc.name, status: r.status, outputs: r.outputs, steps: r.steps,
        error: r.error ? (r.error.code || r.error.messageKey || JSON.stringify(r.error)) : null,
        fileChangesCommitted: r.fileChangesCommitted, wallMs: Math.round(performance.now() - started)
      }));
    }
    const sampleInputs = { 'Main.pseudocode': ['Ada', '72'] };
    let mainThreadRuns = [];
    await check('runtime.samples.mainThread', async () => {
      if (!window.CAIERuntime || !window.SAMPLES) fail('CAIERuntime or SAMPLES missing');
      mainThreadRuns = [];
      for (const doc of SAMPLES.docs) mainThreadRuns.push(await runSample(doc, sampleInputs[doc.name] || []));
      return mainThreadRuns;
    });

    // Worker 可行性（计划阶段 E 的前置问题）：同一份 runtime bundle 能否在这个来源下进 Worker。
    const bubble = window.SAMPLES && SAMPLES.docs.find((d) => d.name === 'BubbleSort.pseudocode');
    const runtimeUrl = new URL('js/runtime-engine.js', location.href).href;
    const workerSource = [
      'importScripts(' + JSON.stringify(runtimeUrl) + ');',
      'onmessage = async (e) => {',
      '  try {',
      '    const c = CAIERuntime.executeSource(e.data.source, { profile: "core-2027", virtualFiles: e.data.files });',
      '    const r = await c.result;',
      '    postMessage({ status: r.status, outputs: r.outputs, steps: r.steps });',
      '  } catch (err) { postMessage({ error: String(err && err.message || err) }); }',
      '};'
    ].join('\n');
    function runInWorker(worker) {
      return new Promise((resolve, reject) => {
        worker.onmessage = (e) => { worker.terminate(); e.data.error ? reject(new Error(e.data.error)) : resolve(e.data); };
        worker.onerror = (e) => { worker.terminate(); reject(new Error('worker error: ' + (e.message || 'unknown'))); };
        worker.postMessage({ source: bubble.source, files: SAMPLES.runtimeFiles });
      });
    }
    const mainBubble = () => mainThreadRuns.find((r) => r.name === 'BubbleSort.pseudocode');
    await check('worker.blob', async () => {
      if (!bubble) fail('BubbleSort sample missing');
      const url = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }));
      const r = await runInWorker(new Worker(url));
      return { status: r.status, steps: r.steps, sameOutputsAsMainThread: JSON.stringify(r.outputs) === JSON.stringify(mainBubble() && mainBubble().outputs) };
    });

    // 云端：现有 CloudClient 只认页面自己的 http(s) origin。
    await check('cloudClient', () => window.CloudClient
      ? { configuration: CloudClient.configuration(), available: CloudClient.available(), session: CloudClient.session() }
      : fail('CloudClient missing'));
    if (location.protocol === 'https:' || location.protocol === 'http:') {
      await check('sameOrigin./auth/me', async () => {
        const r = await fetch('/auth/me', { credentials: 'include', headers: { accept: 'application/json' } });
        return { status: r.status, contentType: r.headers.get('content-type') };
      });
    } else {
      // 自定义 scheme 页面直接跨源请求线上 API：预期被 CORS 挡住。这正是计划里
      // 「需要原生云端传输」的依据，必须实测而不是推断。
      await check('crossOrigin.remote/health', async () => {
        const r = await fetch(remote + '/health');
        return { status: r.status };
      });
      await check('crossOrigin.remote/auth/me', async () => {
        const r = await fetch(remote + '/auth/me', { credentials: 'include', headers: { accept: 'application/json' } });
        return { status: r.status };
      });
    }

    out.pageErrors = window.__protoErrors || [];
    return JSON.stringify(out);
    """#

    /// 按使用者的输入路径在当前文件末尾加一行（参数 line）。
    static let typeLine = #"""
    const ta = document.getElementById('code');
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
    document.execCommand('insertText', false, '\n' + line);
    return JSON.stringify({ saveState: document.getElementById('saveState').textContent, lineCount: ta.value.split('\n').length });
    """#

    /// 检查若干行（参数 lines）在编辑器和 localStorage 里是否存在。
    static let findLines = #"""
    const ta = document.getElementById('code');
    const stored = localStorage.getItem(CAIEStorage.key.editor) || '';
    const found = {};
    lines.forEach((l) => { found[l] = { editor: ta.value.indexOf(l) >= 0, localStorage: stored.indexOf(l) >= 0 }; });
    return JSON.stringify({ found, saveState: document.getElementById('saveState').textContent, pageErrors: window.__protoErrors || [] });
    """#

    /// 全部可见元素的 rect，按 DOM 路径做键（最近的带 id 祖先起算），两边同一份 HTML 时可逐项对齐。
    static let geometry = #"""
    function key(el) {
      const parts = [];
      while (el && el !== document.body) {
        if (el.id) { parts.unshift('#' + el.id); break; }
        const parent = el.parentElement;
        parts.unshift(el.tagName.toLowerCase() + ':' + Array.prototype.indexOf.call(parent.children, el));
        el = parent;
      }
      return parts.join('>');
    }
    const rects = {};
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) return;
      rects[key(el)] = [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 10) / 10);
    });
    const code = document.getElementById('code');
    return JSON.stringify({
      viewport: [innerWidth, innerHeight, devicePixelRatio],
      bodyFont: getComputedStyle(document.body).fontFamily,
      codeFont: code ? getComputedStyle(code).fontFamily : null,
      count: Object.keys(rects).length,
      rects
    });
    """#

    /// 计划 §8 的基线量具，跑在真实 lab 里。全部只用页面自己的 API 和 execCommand，
    /// 和使用者打字走同一条 input 事件路径；但不经过 NSEvent / 输入法，所以是下限，不是端到端。
    static let performance = #"""
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const raf = () => new Promise((r) => requestAnimationFrame(r));
    const round = (v) => Math.round(v * 10) / 10;
    function stats(a) {
      if (!a.length) return { n: 0 };
      const s = a.slice().sort((x, y) => x - y);
      const at = (p) => round(s[Math.min(s.length - 1, Math.floor(p * s.length))]);
      return { n: a.length, p50: at(0.5), p95: at(0.95), max: round(s[s.length - 1]) };
    }
    const out = {};
    const nav = performance.getEntriesByType('navigation')[0];
    out.navigation = nav ? { domContentLoadedMs: round(nav.domContentLoadedEventEnd), loadMs: round(nav.loadEventEnd) } : null;

    const ta = document.getElementById('code');
    const original = ta.value;
    function replaceAll(text) { ta.focus(); ta.select(); document.execCommand('insertText', false, text); }

    // 1. 长文件下的打字：用自带 BubbleSort 叠到 2000 行左右（含空行、过程、数组，不是手编的单行）。
    const bubble = SAMPLES.docs.find((d) => d.name === 'BubbleSort.pseudocode').source;
    let long = '';
    while (long.split('\n').length < 2000) long += bubble + '\n\n';
    replaceAll(long);
    await sleep(1500);
    out.longDocLines = ta.value.split('\n').length;
    const mid = Math.floor(ta.value.length / 2);
    ta.setSelectionRange(mid, mid);
    const handler = [], toFrame = [];
    for (let i = 0; i < 110; i++) {
      await raf();
      const t0 = performance.now();
      document.execCommand('insertText', false, 'x');
      const t1 = performance.now();
      await raf(); await raf();
      if (i >= 10) { handler.push(t1 - t0); toFrame.push(performance.now() - t0); }
    }
    out.typingLongDoc = { syncHandlerMs: stats(handler), toSecondFrameMs: stats(toFrame) };

    // 2. 滚动：每帧滚 40px，量帧间隔。
    const scroller = ta.closest('.editor-scroll') || ta.parentElement;
    scroller.scrollTop = 0;
    await raf();
    const frames = [];
    let last = performance.now();
    for (let i = 0; i < 150; i++) {
      scroller.scrollTop += 40;
      await raf();
      const now = performance.now();
      frames.push(now - last);
      last = now;
    }
    out.scrollLongDoc = Object.assign(stats(frames), { over20ms: frames.filter((f) => f > 20).length, scroller: scroller.className || scroller.id });

    // 3. 运行中 UI 是否卡：同一段循环，分别走 lab 真实运行路径（含 trace 与事件渲染）、
    //    主线程直调 runtime（无 UI）、Worker。量运行期间主线程的帧间隔。
    const heavy = [
      'DECLARE Total : INTEGER', 'DECLARE i : INTEGER', 'DECLARE j : INTEGER', 'Total <- 0',
      'FOR i <- 1 TO 140', '   FOR j <- 1 TO 140', '      Total <- Total + 1', '   NEXT j', 'NEXT i', 'OUTPUT Total'
    ].join('\n');
    async function sampleFramesWhile(isRunning) {
      const gaps = [];
      let prev = performance.now();
      const started = prev;
      while (isRunning()) {
        await raf();
        const now = performance.now();
        gaps.push(now - prev);
        prev = now;
        if (now - started > 60000) break;
      }
      return { wallMs: Math.round(performance.now() - started), frameGapMs: stats(gaps), over50ms: gaps.filter((g) => g > 50).length };
    }

    replaceAll(heavy);
    await sleep(800);
    const stopBtn = document.getElementById('stopBtn');
    document.getElementById('runBtn').click();
    await sleep(0);
    const labRun = await sampleFramesWhile(() => !stopBtn.hidden);
    labRun.status = document.getElementById('runStatus').textContent;
    labRun.lastOutput = (document.querySelector('#console, .console') || {}).innerText ? document.querySelector('#console, .console').innerText.trim().split('\n').slice(-1)[0] : null;
    out.runLabPath = labRun;

    let done = false, directResult = null;
    CAIERuntime.executeSource(heavy, { profile: 'core-2027' }).result.then((r) => { directResult = r; done = true; });
    out.runMainThreadNoUi = Object.assign(await sampleFramesWhile(() => !done), { status: directResult.status, steps: directResult.steps, outputs: directResult.outputs });

    const runtimeUrl = new URL('js/runtime-engine.js', location.href).href;
    const workerUrl = URL.createObjectURL(new Blob([
      'importScripts(' + JSON.stringify(runtimeUrl) + ');',
      'onmessage = async (e) => { const r = await CAIERuntime.executeSource(e.data, { profile: "core-2027" }).result; postMessage({ status: r.status, steps: r.steps, outputs: r.outputs }); };'
    ], { type: 'text/javascript' }));
    const worker = new Worker(workerUrl);
    let workerResult = null;
    worker.onmessage = (e) => { workerResult = e.data; worker.terminate(); };
    worker.postMessage(heavy);
    out.runWorker = Object.assign(await sampleFramesWhile(() => !workerResult), { result: workerResult });

    // 还原，免得探针把 Main 留成 2000 行。
    replaceAll(original);
    await sleep(800);
    out.pageErrors = window.__protoErrors || [];
    return JSON.stringify(out);
    """#
}
