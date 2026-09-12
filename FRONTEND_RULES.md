# 前端硬性规则

适用于 `web/` 下的全部页面。这两条不是风格偏好，是验收条件：**改动提交前要按文末的检查清单逐项过一遍**，做不到的要在 `updates.md` 里写明哪一条没做到、为什么。

其他与这两条无关的细节（配色、字号、文案口吻）不在本文范围内。已经做到的现状记录在 `web/README.md` 的「全局交互原则的落实」，那是描述性的；本文是规范性的，两者冲突以本文为准。

---

## 第 1 条 · 界面稳定性

> **一次交互只允许改变被操作对象自身的外观。页面上其他任何元素的位置和尺寸必须保持不变。**

点一个按钮、切一个标签、展开一段内容、收到一条错误提示——除了被操作的那个东西本身，屏幕上不该有第二样东西挪动、变大、变小或者错位。人一旦发现界面会自己动，就不敢再随便点了。

### 1.1 允许用来做反馈的属性

只有这四个：

| 属性 | 用途 |
|---|---|
| `background` / `background-color` | 悬停、选中、按下 |
| `color` | 状态字色 |
| `box-shadow` | 选中边线（`inset`）、焦点环 |
| `opacity` | 出现与消失、禁用态 |

动效只用 `opacity` 和 `transform`，时长 0.12–0.17s。

### 1.2 明确禁止

- **用 `border` 宽度表示选中。** 1px → 2px 会把元素撑大 2px，整行跟着挪。用 `box-shadow: inset 0 0 0 1.5px var(--accent)`。
- **用 `font-weight` 表示选中。** 中文和英文加粗后宽度都会变，一组标签来回切就在抖。用底色和字色区分。
- **用 `outline` 以外的方式做焦点环，或者让焦点环挤压相邻元素。** 用 `box-shadow`。
- **靠删除/插入 DOM 节点来切换显隐。** 节点一走，后面的东西全部上移。见 1.3。
- **让文字长度决定控件宽度。** 「运行 / 停止」「显示 / 隐藏」「登录 / 处理中…」这类会换文案的按钮必须有固定宽度或固定槽位。数字用 `font-variant-numeric: tabular-nums`。

### 1.3 常驻槽位

会出现也会消失的东西，槽位要一直在：

- 错误提示行：没有错误时也占着行高（`min-height`）。
- 计数、徽标：为 0 或为空时只改 `opacity`，不改 `display`。
- 悬停才出现的行内按钮（重命名、删除）：常驻占位，用 `opacity` 切换。
- 宽度会随内容变的状态文字（保存状态、光标位置、查找计数）：定宽。

### 1.4 滚动

- 所有滚动容器加 `scrollbar-gutter: stable`——滚动条出现时不能把内容挤窄。
- `body` 永远不横向滚动。宽内容（表格、代码块、图）自己在 `overflow-x: auto` 的容器里滚。
- 浮层用 `position: fixed`，打开时背景不位移。
- 查找栏这类临时条浮在内容之上（绝对定位），不把内容往下推。

### 1.5 唯一允许的几何变化：整屏换步

多步流程换到下一步（例如登录页 `你有账号吗 → 你是谁 → 表单`），容器高度确实会变。这是允许的，但必须满足全部三条：

1. 变化**由明确的换步动作触发**，不是悬停、不是聚焦、不是收到一条提示；
2. 高度在旧值和新值之间做一次有界的过渡（150–200ms），**不是瞬间跳变**；
3. 过渡结束把 `height` 交还给内容（`height: ""`），不留定值——否则后续内容撑不开。

参考实现：`web/js/login-page.js` 的 `transition()`。`prefers-reduced-motion: reduce` 下过渡和淡入都要关掉。

**这一条不是松绑。** 同一屏之内的任何变化仍然适用 1.1–1.4：同一个表单里出现一行错误提示，走的是 1.3 的常驻槽位，不是这一条。

---

## 第 2 条 · 不使用浏览器原生交互界面

> **凡是浏览器自己画、样式不受我们控制、各家浏览器长得不一样的界面，一律换成应用内组件。**

原生件的问题不只是丑：它们不跟随主题、在不同浏览器和操作系统上外观和行为都不同、大多不能定制文案、`alert` / `confirm` 还会冻结整个页面。

### 2.1 替换对照表

| 禁止 | 换成 | 现有实现 |
|---|---|---|
| `alert()` | 应用内 Toast 或就地内联错误 | `toast()` |
| `confirm()` | 自定义确认弹框；可撤销的操作优先用「撤销」Toast | `askConfirm()` |
| `prompt()` | 自定义 Modal + 输入框 + 常驻高度的内联校验 | `askText()` |
| `title="..."` 悬浮文字 | 自定义 Tooltip | `data-tip`，`js/tooltip.js` |
| `<select>` | 分段控件（选项 ≤ 4）或自定义下拉列表 | `.login-choice` / `role="radiogroup"` |
| `<input type="date">` | 自定义日期选择器 | `.datepicker`，`web/assign.html` + `js/assign-page.js` |
| `<input type="checkbox">` | `role="switch"` 自定义开关 | `.switch-ctl` |
| `<input type="range">` | 自定义步进器 | 设置里的字号 |
| `<input type="color">` | 自定义色板 | 暂无需求 |
| `<details>` / `<dialog>` | 自定义展开块 / `.dialog` | `.dialog` |
| HTML5 表单校验（`required`、`pattern`、`setCustomValidity`） | 提交时自己校验，错误写进常驻的 `.field-error` | 各表单 |
| `beforeunload` 离开确认 | **不拦截**。改成自动存草稿，让离开没有代价 | 见 2.3 |

### 2.2 唯一例外：`<input type="file">`

浏览器不允许用别的方式打开文件选择器。做法是：`<input type="file" hidden>` 放在页面里，由应用自己的按钮 `.click()` 触发。选择器本身是操作系统画的，这一点没有办法，也不必有办法。

`lab.html` 的 `#importInput` 就是这个形态，符合规则。

### 2.3 关于 `beforeunload`

它弹的是浏览器自己的对话框，文案完全不能改，属于第 2 条禁止之列。正确的做法不是"拦得好看一点"，而是**让离开不需要被拦**：编辑内容自动存本地草稿，回来接着写。

---

## 检查清单

改动涉及 `web/` 下任何页面时，逐项核对：

**稳定性**

- [ ] 每一个新增或改动的交互，都在浏览器里实际点过，确认屏幕上没有第二样东西动
- [ ] 选中态没有用 `border` 宽度，没有用 `font-weight`
- [ ] 会换文案的按钮有固定宽度或固定槽位
- [ ] 新增的错误提示、计数、徽标有常驻槽位
- [ ] 新增的滚动容器有 `scrollbar-gutter: stable`
- [ ] 最窄断点下 `body` 不横向滚动
- [ ] 若引入了换步高度过渡，满足 1.5 的三个条件，且 `prefers-reduced-motion` 下关闭

**原生件**

- [ ] 没有新增 `alert` / `confirm` / `prompt` / `beforeunload`
- [ ] 没有新增 `title=` 属性（改用 `data-tip`）
- [ ] 没有新增 `<select>` / `type="date"` / `type="checkbox"` / `type="range"` / `<details>` / `<dialog>`
- [ ] 没有依赖 HTML5 表单校验

**全局 grep（应当只命中已知豁免项）**

```bash
cd web
grep -rn "\balert(\|\bconfirm(\|\bprompt(\|beforeunload" js/*.js
grep -rno ' title="\|<select\|type="date"\|type="checkbox"\|type="range"\|<details\|<dialog' *.html
grep -rno 'type="file"' *.html   # 只应命中 lab.html 的 #importInput
```

---

## 怎么验稳定性

肉眼看不出 2px 的位移。在浏览器控制台里，**交互前**跑一次：

```js
window.__snap = new Map();
document.querySelectorAll("body *").forEach(function (el) {
   var r = el.getBoundingClientRect();
   window.__snap.set(el, [r.x, r.y, r.width, r.height].map(Math.round).join(","));
});
window.__snap.size;
```

做一次交互（点按钮、切标签、悬停），然后跑：

```js
(function () {
   var moved = [];
   window.__snap.forEach(function (was, el) {
      if (!el.isConnected) return;
      var r = el.getBoundingClientRect();
      var now = [r.x, r.y, r.width, r.height].map(Math.round).join(",");
      if (now !== was) moved.push({ 元素: el.tagName + "." + el.className, 之前: was, 之后: now });
   });
   console.table(moved);
   return moved.length;
})();
```

**合格标准：输出里只有被操作的那个元素和它自己的子元素。** 出现任何第三方元素就是违规。换步过渡（1.5）要在过渡结束之后再量。

---

## 当前已知未达标项

| 位置 | 问题 | 状态 |
|---|---|---|
| `web/classes.html:120` `#taskFilter` | 原生 `<select>` 按题号筛选 | 待修 |
| `web/lab.html:380` `#importInput` | `<input type="file" hidden>` | 符合 2.2 例外，不修 |
