/*
 * CAIE 9618 Pseudocode 规则基线（阶段 0 的最小可用版本）
 * 来源：pseudocode_guide-9618.pdf（2027 / 2028 / 2029 考试版本）
 * 本文件只描述语言表面元素，不包含任何 UI 逻辑。
 */
window.CAIE = (function () {
  // 结构关键字（Index of symbols and keywords，指南第 30 页）
  const KEYWORDS = [
    'DECLARE', 'CONSTANT', 'TYPE', 'ENDTYPE', 'DEFINE', 'SET', 'OF', 'ARRAY',
    'INPUT', 'OUTPUT',
    'IF', 'THEN', 'ELSE', 'ENDIF',
    'CASE', 'OTHERWISE', 'ENDCASE',
    'FOR', 'TO', 'STEP', 'NEXT',
    'REPEAT', 'UNTIL',
    'WHILE', 'ENDWHILE',
    'PROCEDURE', 'ENDPROCEDURE', 'FUNCTION', 'ENDFUNCTION', 'RETURN', 'RETURNS',
    'CALL', 'BYREF', 'BYVAL',
    'OPENFILE', 'READFILE', 'WRITEFILE', 'CLOSEFILE', 'EOF',
    'READ', 'WRITE', 'APPEND', 'RANDOM', 'SEEK', 'GETRECORD', 'PUTRECORD',
    'CLASS', 'ENDCLASS', 'INHERITS', 'NEW', 'SUPER', 'PUBLIC', 'PRIVATE',
    'AND', 'OR', 'NOT', 'DIV', 'MOD',
    'TRUE', 'FALSE'
  ];

  const TYPES = ['INTEGER', 'REAL', 'CHAR', 'STRING', 'BOOLEAN', 'DATE'];

  // 指南 5.5 / 5.6 给出的内置函数
  const BUILTINS = [
    { name: 'LENGTH', sig: 'LENGTH(ThisString : STRING) RETURNS INTEGER', desc: '返回字符串长度' },
    { name: 'RIGHT', sig: 'RIGHT(ThisString : STRING, x : INTEGER) RETURNS STRING', desc: '返回最右侧 x 个字符' },
    { name: 'MID', sig: 'MID(ThisString : STRING, x : INTEGER, y : INTEGER) RETURNS STRING', desc: '从位置 x 起取 y 个字符' },
    { name: 'LCASE', sig: 'LCASE(ThisChar : CHAR) RETURNS CHAR', desc: '转为小写字符' },
    { name: 'UCASE', sig: 'UCASE(ThisChar : CHAR) RETURNS CHAR', desc: '转为大写字符' },
    { name: 'INT', sig: 'INT(x : REAL) RETURNS INTEGER', desc: '返回 x 的整数部分' },
    { name: 'RAND', sig: 'RAND(x : INTEGER) RETURNS REAL', desc: '返回 0 到 x（不含 x）的随机实数' }
  ];

  // 块结构配对表：用于缩进与未闭合检查
  const BLOCKS = [
    { open: /^IF\b.*\bTHEN\s*$/i, close: /^ENDIF\b/i, name: 'IF', mid: [/^ELSE\s*$/i] },
    { open: /^CASE\s+OF\b/i, close: /^ENDCASE\b/i, name: 'CASE OF', mid: [] },
    { open: /^FOR\b/i, close: /^NEXT\b/i, name: 'FOR', mid: [] },
    { open: /^WHILE\b/i, close: /^ENDWHILE\b/i, name: 'WHILE', mid: [] },
    { open: /^REPEAT\s*$/i, close: /^UNTIL\b/i, name: 'REPEAT', mid: [] },
    { open: /^(PUBLIC\s+|PRIVATE\s+)?PROCEDURE\b/i, close: /^ENDPROCEDURE\b/i, name: 'PROCEDURE', mid: [] },
    { open: /^(PUBLIC\s+|PRIVATE\s+)?FUNCTION\b/i, close: /^ENDFUNCTION\b/i, name: 'FUNCTION', mid: [] },
    { open: /^TYPE\s+[A-Za-z_]\w*\s*$/i, close: /^ENDTYPE\b/i, name: 'TYPE', mid: [] },
    { open: /^CLASS\b/i, close: /^ENDCLASS\b/i, name: 'CLASS', mid: [] }
  ];

  // 结构模板：Ctrl+Space 打开
  const SNIPPETS = [
    { label: 'IF … THEN … ENDIF', body: 'IF <condition> THEN\n@@\nENDIF' },
    { label: 'IF … THEN … ELSE … ENDIF', body: 'IF <condition> THEN\n@@\nELSE\n\nENDIF' },
    { label: 'CASE OF … ENDCASE', body: 'CASE OF <identifier>\n@@\n   OTHERWISE :\nENDCASE' },
    { label: 'FOR … NEXT', body: 'FOR Index ← 1 TO 10\n@@\nNEXT Index' },
    { label: 'WHILE … ENDWHILE', body: 'WHILE <condition>\n@@\nENDWHILE' },
    { label: 'REPEAT … UNTIL', body: 'REPEAT\n@@\nUNTIL <condition>' },
    { label: 'PROCEDURE … ENDPROCEDURE', body: 'PROCEDURE <Name>()\n@@\nENDPROCEDURE' },
    { label: 'FUNCTION … ENDFUNCTION', body: 'FUNCTION <Name>() RETURNS INTEGER\n@@\n   RETURN 0\nENDFUNCTION' },
    { label: 'TYPE … ENDTYPE（记录）', body: 'TYPE <Name>\n@@   DECLARE <Field> : STRING\nENDTYPE' },
    { label: 'DECLARE 变量', body: 'DECLARE <Name> : INTEGER@@' },
    { label: 'DECLARE 一维数组', body: 'DECLARE <Name> : ARRAY[1:10] OF INTEGER@@' },
    { label: '文本文件读取骨架', body: 'OPENFILE "Data.txt" FOR READ\nWHILE NOT EOF("Data.txt")\n@@   READFILE "Data.txt", LineOfText\nENDWHILE\nCLOSEFILE "Data.txt"' }
  ];

  const INDENT = '   '; // 指南 1.2：三空格

  const keywordSet = new Set(KEYWORDS);
  const typeSet = new Set(TYPES);
  const builtinSet = new Set(BUILTINS.map(function (b) { return b.name; }));

  return {
    KEYWORDS: KEYWORDS,
    TYPES: TYPES,
    BUILTINS: BUILTINS,
    BLOCKS: BLOCKS,
    SNIPPETS: SNIPPETS,
    INDENT: INDENT,
    isKeyword: function (w) { return keywordSet.has(w.toUpperCase()); },
    isType: function (w) { return typeSet.has(w.toUpperCase()); },
    isBuiltin: function (w) { return builtinSet.has(w.toUpperCase()); },
    version: 'CAIE 9618 (2027–2029)'
  };
})();
