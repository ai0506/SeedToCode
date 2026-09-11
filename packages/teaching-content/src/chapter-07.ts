import type { Chapter } from "./types.js";
import type { FeatureId } from "@caie-pseudocode/exercise";

/** Chapter 6 结束时学生已经会的写法。 */
const AFTER_CHAPTER_6: FeatureId[] = [
  "io.output", "io.input", "decl.variable", "misc.comment",
  "type.string", "literal.string", "type.integer", "type.real", "type.char",
  "type.boolean", "type.date", "literal.integer", "literal.real", "literal.char",
  "literal.boolean", "literal.date", "assign.simple", "decl.constant",
  "op.arithmetic", "op.div", "op.mod", "op.relational", "op.and", "op.or", "op.not",
  "select.if", "select.if-else", "select.nested-if",
  "select.case", "select.case-range", "select.case-otherwise",
  "loop.for", "loop.for-step", "loop.while", "loop.repeat", "loop.nested"
];

const AFTER_7_2: FeatureId[] = [...AFTER_CHAPTER_6, "builtin.length", "builtin.mid", "builtin.right"];
const AFTER_7_3: FeatureId[] = [...AFTER_7_2, "builtin.ucase", "builtin.lcase"];
const AFTER_7_4: FeatureId[] = [...AFTER_7_3, "op.concat"];
const AFTER_7_5: FeatureId[] = [...AFTER_7_4, "builtin.int", "builtin.rand"];

export const chapter07: Chapter = {
  id: 7,
  title: "字符串与内置函数",
  level: "AS",
  syllabus: ["§11.1", "G§5.5", "G§5.6"],
  prerequisites: [1, 2, 3, 4, 5, 6],
  sections: [
    {
      id: "7.1",
      title: "`CHAR` 与 `STRING`：两种文字",
      syllabus: ["§11.1", "G§5.5"],
      estimatedMinutes: 8,
      taughtFeatures: AFTER_CHAPTER_6,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "第 2 章列过六种基本类型，其中有两种是文字。`CHAR` 是**恰好一个字符**，字面量写在单引号里：`'A'`、`'7'`、`' '`。`STRING` 是一串字符，可以是零个、一个或很多个，字面量写在双引号里：`\"A\"`、`\"Hello\"`、`\"\"`。",
            "关键在于：**`\"A\"` 和 `'A'` 不是同一个东西。** 前者是长度为 1 的 `STRING`，后者是 `CHAR`。它们长得一模一样，类型却不同，所以不能互相赋值，也不能直接比较——编辑器会在运行前就拦下来。",
            "这条规矩有点严，但它是有用的：两类函数要的东西不一样。`LENGTH`、`MID`、`RIGHT` 只收 `STRING`，`UCASE`、`LCASE` 只收 `CHAR`。搞清楚手里拿的是哪一种，才知道能对它做什么。",
            "`INPUT` 读进来的是哪一种，由变量的声明决定：`DECLARE C : CHAR` 后面的 `INPUT C` 只接受恰好一个字符，多打一个就会被退回来。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "`CHAR` 用单引号，恰好一个字符；`STRING` 用双引号，长度不限。两者是不同的类型（Pseudocode Guide §5.5）。"
            }
          ]
        },
        {
          kind: "counterExample",
          title: "把长度为 1 的 `STRING` 当成 `CHAR`",
          cases: [
            {
              title: "不能赋过去",
              code: [
                "DECLARE C : CHAR",
                "DECLARE S : STRING",
                'S ← "a"',
                "C ← S",
                "OUTPUT C"
              ].join("\n"),
              note: "编辑器在第 4 行就拦下来。`\"a\"` 里只有一个字母，看着和 `'a'` 没差别，但它的类型是 `STRING`。",
              expectDiagnostics: [
                { severity: "error", ruleId: "ASSIGN-002", line: 4, text: "不能把 `STRING` 赋给 `CHAR`。" }
              ]
            },
            {
              title: "也不能拿来比",
              code: [
                "DECLARE C : CHAR",
                "C ← 'a'",
                'IF C = "a" THEN',
                '   OUTPUT "same"',
                "ENDIF"
              ].join("\n"),
              note: "第 3 行的比较两边一边是 `CHAR` 一边是 `STRING`，类型对不上。要比就两边都用单引号：`C = 'a'`。",
              expectDiagnostics: [
                { severity: "error", ruleId: "OP-003", line: 3, text: "比较的两边类型要对得上，一边 `CHAR` 一边 `STRING` 不行。" }
              ]
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "`DECLARE Letter : CHAR` 之后，哪一行是对的？",
          options: [
            {
              key: "A",
              label: "Letter ← B",
              correct: false,
              explanation: "不加引号的 `B` 会被当成一个变量名，而不是字母 B 本身。"
            },
            {
              key: "B",
              label: "Letter ← 'B'",
              correct: true,
              explanation: "对。单引号、恰好一个字符，这就是一个 `CHAR` 字面量。"
            },
            {
              key: "C",
              label: 'Letter ← "B"',
              correct: false,
              explanation: "双引号里的是 `STRING`，哪怕只有一个字母。`CHAR` 变量只收 `CHAR`。"
            },
            {
              key: "D",
              label: "Letter ← 'AB'",
              correct: false,
              explanation: "单引号里只能放一个字符。两个字符要用双引号，而那就是 `STRING` 了。"
            }
          ]
        }
      ]
    },
    {
      id: "7.2",
      title: "`LENGTH`、`MID`、`RIGHT`：把文字拆开",
      syllabus: ["§11.1", "G§5.6"],
      estimatedMinutes: 10,
      taughtFeatures: AFTER_7_2,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "函数是一段写好的、能算出一个值的东西：你给它一些值，它还你一个值。写法是函数名加圆括号，括号里是要给它的值，比如 `LENGTH(Name)`。算出来的值要用掉——赋给一个变量，或者直接 `OUTPUT`。",
            "这一节的三个函数都在回答「这段文字里有什么」。`LENGTH(S)` 收一个 `STRING`，还你它有几个字符，是 `INTEGER`。`MID(S, Start, Count)` 从第 `Start` 个字符开始取 `Count` 个，还你一个 `STRING`。`RIGHT(S, Count)` 还你最后 `Count` 个字符。",
            "`MID` 的起点**从 1 开始数**，不是从 0。`MID(\"Computer\", 1, 3)` 给出 `\"Com\"`。**Pseudocode Guide 里没有 `LEFT`**——要取开头的几个字符，用 `MID(S, 1, n)`，效果一样；写 `LEFT(...)` 编辑器会说找不到这个名字。",
            "取的范围超出文字本身时，程序会在那一行停下来：`MID(\"abc\", 5, 1)` 从第 5 个字符开始取，可 `\"abc\"` 只有 3 个。这种错静态检查看不出来——起点是多少要跑起来才知道。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "`LENGTH(ThisString : STRING) RETURNS INTEGER`；`MID(ThisString : STRING, x : INTEGER, y : INTEGER) RETURNS STRING`，从第 x 个字符起取 y 个；`RIGHT(ThisString : STRING, x : INTEGER) RETURNS STRING`（Pseudocode Guide §5.6）。"
            }
          ]
        },
        {
          kind: "example",
          title: "拆开一个单词",
          fileName: "Example_7_2_a.pseudocode",
          code: [
            "DECLARE Word : STRING",
            'Word ← "Computer"',
            'OUTPUT "Length: ", LENGTH(Word)',
            'OUTPUT "First three: ", MID(Word, 1, 3)',
            'OUTPUT "Middle two: ", MID(Word, 4, 2)',
            'OUTPUT "Last three: ", RIGHT(Word, 3)'
          ].join("\n"),
          annotations: [
            { fromLine: 3, toLine: 3, text: "`LENGTH` 还回来的是 `INTEGER`，可以直接跟在 `OUTPUT` 的逗号后面显示。" },
            { fromLine: 4, toLine: 4, text: "起点 1、取 3 个，这就是「开头三个字符」的写法。" },
            { fromLine: 5, toLine: 5, text: "起点 4、取 2 个——`C`、`o`、`m` 是第 1、2、3 个，所以第 4 个是 `p`。" },
            { fromLine: 6, toLine: 6, text: "`RIGHT` 从右边数，不用管总长度是多少。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["Length: 8", "First three: Com", "Middle two: pu", "Last three: ter"]
          }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "`MID(\"Pseudocode\", 3, 4)` 的结果是什么？",
          options: [
            {
              key: "A",
              label: "seud",
              correct: false,
              explanation: "这是从第 2 个字符开始取的结果。`MID` 的起点从 1 数起，第 3 个不是 `s`。"
            },
            {
              key: "B",
              label: "udoc",
              correct: false,
              explanation: "这是从第 4 个开始取的。把起点当成「跳过 3 个」就会错一位。"
            },
            {
              key: "C",
              label: "Pseu",
              correct: false,
              explanation: "这是 `MID(S, 1, 4)`，也就是开头四个字符。第二个参数是起点，不是个数。"
            },
            {
              key: "D",
              label: "eudo",
              correct: true,
              explanation: "对。从第 3 个字符开始数：`P` 是 1、`s` 是 2、`e` 是 3。从 `e` 起取 4 个，是 `e`、`u`、`d`、`o`。"
            }
          ]
        },
        {
          kind: "task",
          id: "7.2.1",
          title: "首字母与后缀",
          statement: "写一段伪代码：提示并读入一个单词（保证至少 5 个字符），显示它的长度、开头两个字符和末尾三个字符。",
          ioSpec: {
            input: ["一行，一个 `STRING`。提示语排在读取之前，一字不差：", "`Enter a word`"].join("\n"),
            output: [
              "三行：",
              "`Length: <长度>`",
              "`Head: <开头两个字符>`",
              "`Tail: <末尾三个字符>`",
              "每个冒号后面都是一个空格。"
            ].join("\n")
          },
          constraints: {
            require: [
              { feature: "builtin.length", reason: "长度这一行要的就是这个函数还回来的整数。" },
              { feature: "builtin.mid", reason: "Guide 里没有取左边的函数，开头两个字符只能用它，起点写 1。" },
              { feature: "builtin.right", reason: "末尾三个字符从右边数，用它不需要先算总长度。" }
            ]
          },
          hints: [
            "「开头两个」用 `MID`，起点写 1。",
            "「末尾三个」从右边数，不需要先算长度。"
          ],
          examples: [
            { inputs: ["Tuesday"], outputs: ["Enter a word", "Length: 7", "Head: Tu", "Tail: day"] }
          ],
          referenceSolution: [
            "DECLARE Word : STRING",
            'OUTPUT "Enter a word"',
            "INPUT Word",
            'OUTPUT "Length: ", LENGTH(Word)',
            'OUTPUT "Head: ", MID(Word, 1, 2)',
            'OUTPUT "Tail: ", RIGHT(Word, 3)'
          ].join("\n"),
          tests: [
            { id: "t1", kind: "normal", inputs: ["Monday"], caseHint: "一个普通长度的单词。" },
            { id: "t2", kind: "normal", inputs: ["Computer"], caseHint: "一个长一点的单词。" },
            { id: "t3", kind: "boundary", inputs: ["abcde"], caseHint: "正好是允许的最短长度，开头和末尾几乎要碰上。" },
            { id: "t4", kind: "normal", inputs: ["Pseudocode"], caseHint: "一个更长的单词。" },
            { id: "t5", kind: "extreme", inputs: ["Extraordinarily"], caseHint: "一个非常长的单词。" }
          ]
        }
      ]
    },
    {
      id: "7.3",
      title: "`UCASE` 与 `LCASE`：只认单个字符",
      syllabus: ["§11.1", "G§5.6"],
      estimatedMinutes: 8,
      taughtFeatures: AFTER_7_3,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "这两个函数管大小写：`UCASE` 把字符变成大写，`LCASE` 变成小写。不是字母的字符（数字、空格、标点）原样还回来。",
            "要紧的是它们的类型：**两个函数都只收 `CHAR`，也只还 `CHAR`**。这就是 7.1 那条规矩真正开始起作用的地方——`STRING` 递不进去。",
            "也许你会想：那先用 `MID` 取出一个字符再转不就行了？`MID` 还回来的是 `STRING`，哪怕只取一个字符，所以这条路同样走不通。**在 Guide 的这套函数里，没有办法把一个长度为 1 的 `STRING` 变成 `CHAR`。**",
            "这不是编辑器的限制，是 Pseudocode Guide 就这么定的。实际能用上它们的场合，是手里本来就有一个 `CHAR`：`CHAR` 字面量，或者 `INPUT` 进一个 `CHAR` 变量——比如让用户输入 `Y` 或 `N`，不管他打的是大写还是小写，先统一转成大写再比较。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "`UCASE(ThisChar : CHAR) RETURNS CHAR`；`LCASE(ThisChar : CHAR) RETURNS CHAR`。两者都只处理单个字符（Pseudocode Guide §5.6）。"
            }
          ]
        },
        {
          kind: "counterExample",
          title: "把 `STRING` 递给只收 `CHAR` 的函数",
          cases: [
            {
              title: "直接递一个 `STRING`",
              code: ["DECLARE S : STRING", 'S ← "abc"', "OUTPUT UCASE(S)"].join("\n"),
              note: "`S` 是 `STRING`，而 `UCASE` 要的是 `CHAR`，编辑器在第 3 行拦下来。",
              expectDiagnostics: [
                { severity: "error", ruleId: "BUILTIN-001", line: 3, text: "`UCASE` 只接受 `CHAR`，这里给它的是 `STRING`。" }
              ]
            },
            {
              title: "先用 `MID` 取一个字符也不行",
              code: ["DECLARE S : STRING", 'S ← "abc"', "OUTPUT UCASE(MID(S, 1, 1))"].join("\n"),
              note: "看着像绕开了，其实没有：`MID` 还回来的仍然是 `STRING`，哪怕里面只有一个字符。这条路在 Guide 的函数里是走不通的。",
              expectDiagnostics: [
                { severity: "error", ruleId: "BUILTIN-001", line: 3, text: "`MID` 还回来的是 `STRING`，递不进只收 `CHAR` 的 `UCASE`。" }
              ]
            }
          ]
        },
        {
          kind: "example",
          title: "不管用户打大写还是小写",
          fileName: "Example_7_3_a.pseudocode",
          code: [
            "DECLARE Answer : CHAR",
            'OUTPUT "Continue? Enter Y or N"',
            "INPUT Answer",
            "IF UCASE(Answer) = 'Y' THEN",
            '   OUTPUT "Going on"',
            "ELSE",
            '   OUTPUT "Stopped"',
            "ENDIF"
          ].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 3, text: "`Answer` 声明成 `CHAR`，所以读进来的就是一个字符。" },
            { fromLine: 4, toLine: 4, text: "先转成大写再比，这样 `y` 和 `Y` 都能通过，不用写两个条件。比较两边也都是 `CHAR`。" }
          ],
          sampleRun: { inputs: ["y"], outputs: ["Continue? Enter Y or N", "Going on"] }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "`DECLARE S : STRING` 且 `S ← \"hello\"`，下面哪一行能通过检查？",
          options: [
            {
              key: "A",
              label: "OUTPUT UCASE('h')",
              correct: true,
              explanation: "对。`'h'` 是单引号写的 `CHAR` 字面量，正是 `UCASE` 要的东西。"
            },
            {
              key: "B",
              label: "OUTPUT UCASE(S)",
              correct: false,
              explanation: "`S` 是 `STRING`，而 `UCASE` 只收 `CHAR`。"
            },
            {
              key: "C",
              label: "OUTPUT UCASE(MID(S, 1, 1))",
              correct: false,
              explanation: "看着像绕开了，其实没有：`MID` 还回来的是 `STRING`，哪怕只有一个字符。"
            },
            {
              key: "D",
              label: 'OUTPUT UCASE("h")',
              correct: false,
              explanation: "双引号里的是 `STRING`。这一处差别在这两个函数上是硬性的。"
            }
          ]
        }
      ]
    },
    {
      id: "7.4",
      title: "用 `&` 把文字接起来",
      syllabus: ["§11.1", "G§5.5"],
      estimatedMinutes: 8,
      taughtFeatures: AFTER_7_4,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "`&` 把两段 `STRING` 接成一段：`\"Hello\" & \" \" & \"World\"` 得到 `\"Hello World\"`。这叫**连接（concatenation）**。",
            "它和 `OUTPUT` 的逗号看起来效果差不多，但做的是两件事：`&` 造出**一个新的 `STRING`**，可以赋给变量、继续接、递给函数；`OUTPUT A, B, C` 只是把几个值挨着显示出来，没有造出任何新值。",
            "所以要「显示一句话」两种都行；要「把拼好的东西存起来待会儿用」，只能用 `&`。",
            "`&` 的两边都必须是 `STRING`。`\"n=\" & 5` 是不成立的——5 是 `INTEGER`，编辑器会拦下来。**要显示数字，用 `OUTPUT` 的逗号形式**，那里什么类型都收。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "`&` 是字符串连接运算符，两边都必须是 `STRING`（Pseudocode Guide §5.5）。"
            }
          ]
        },
        {
          kind: "example",
          title: "两种写法各自的用处",
          fileName: "Example_7_4_a.pseudocode",
          code: [
            "DECLARE First : STRING",
            "DECLARE Last : STRING",
            "DECLARE Full : STRING",
            "DECLARE Count : INTEGER",
            'First ← "Ada"',
            'Last ← "Lovelace"',
            "Count ← 2",
            'Full ← First & " " & Last',
            'OUTPUT "Name: ", Full',
            'OUTPUT "Words: ", Count'
          ].join("\n"),
          annotations: [
            { fromLine: 8, toLine: 8, text: "`&` 把三段接成一个新的 `STRING` 存进 `Full`，存下来之后还能再用。" },
            { fromLine: 9, toLine: 9, text: "逗号形式，只负责显示。" },
            { fromLine: 10, toLine: 10, text: "`Count` 是 `INTEGER`，只能走逗号这条路——写成 `\"Words: \" & Count` 会被拦下来。" }
          ],
          sampleRun: { inputs: [], outputs: ["Name: Ada Lovelace", "Words: 2"] }
        },
        {
          kind: "example",
          title: "在循环里接出一行星号",
          fileName: "Example_7_4_b.pseudocode",
          code: [
            "DECLARE I : INTEGER",
            "DECLARE Bar : STRING",
            'Bar ← ""',
            "FOR I ← 1 TO 5",
            '   Bar ← Bar & "*"',
            "NEXT I",
            "OUTPUT Bar"
          ].join("\n"),
          annotations: [
            { fromLine: 3, toLine: 3, text: "从空串开始。不先设空串，`Bar` 就没有值可以接。" },
            { fromLine: 5, toLine: 5, text: "每一遍在原来的基础上接一个星号。" },
            { fromLine: 7, toLine: 7, text: "显示放在循环外面，所以只显示最后接好的那一整条。" }
          ],
          sampleRun: { inputs: [], outputs: ["*****"] }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "`DECLARE N : INTEGER` 且 `N ← 7`，想显示 `Score: 7`，哪一行能通过检查？",
          options: [
            {
              key: "A",
              label: 'OUTPUT "Score: " & "N"',
              correct: false,
              explanation: "这能通过检查，但显示的是 `Score: N` 这几个字母——引号里的 `N` 是文字本身，不是变量的值。"
            },
            {
              key: "B",
              label: 'OUTPUT "Score: " + N',
              correct: false,
              explanation: "`+` 是加法，不是连接。接文字用 `&`，而这里连 `&` 都不该用。"
            },
            {
              key: "C",
              label: 'OUTPUT "Score: ", N',
              correct: true,
              explanation: "对。`OUTPUT` 的逗号形式对类型没有要求，数字直接显示出来。"
            },
            {
              key: "D",
              label: 'OUTPUT "Score: " & N',
              correct: false,
              explanation: "`&` 两边都得是 `STRING`，而 `N` 是 `INTEGER`。"
            }
          ]
        }
      ]
    },
    {
      id: "7.5",
      title: "`INT` 与 `RAND`",
      syllabus: ["§11.1", "G§5.6"],
      estimatedMinutes: 8,
      taughtFeatures: AFTER_7_5,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "除了处理文字，Guide 还给了两个处理数字的函数。`INT(x)` 把一个 `REAL` 变成 `INTEGER`，做法是**直接砍掉小数部分**，不是四舍五入：`INT(7.9)` 是 7，`INT(-7.9)` 是 -7。这正好和第 3 章的 `DIV` 对上——`7 DIV 2` 和 `INT(7 / 2)` 都是 3。",
            "`RAND(x)` 给出一个随机的 `REAL`，范围是 0（含）到 `x`（不含），参数是 `INTEGER`。因为它还回来的是 `REAL`，想要一个随机整数就得配合 `INT`：掷骰子写成 `INT(RAND(6)) + 1`——`RAND(6)` 给 0 到 5.999…，砍掉小数得到 0 到 5，再加 1 就是 1 到 6。",
            "用了 `RAND` 的程序每次跑的结果都不一样，所以这类题目不会去比对具体输出，只会看范围和写法。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "`INT(x : REAL) RETURNS INTEGER`，取整数部分；`RAND(x : INTEGER) RETURNS REAL`，返回 0 到 x 之间的随机实数（Pseudocode Guide §5.6）。"
            }
          ]
        },
        {
          kind: "example",
          title: "取整不是四舍五入",
          fileName: "Example_7_5_a.pseudocode",
          code: [
            "DECLARE A : INTEGER",
            "DECLARE B : INTEGER",
            "DECLARE C : INTEGER",
            "A ← INT(7.9)",
            "B ← INT(7.1)",
            "C ← INT(7 / 2)",
            'OUTPUT "A: ", A',
            'OUTPUT "B: ", B',
            'OUTPUT "C: ", C'
          ].join("\n"),
          annotations: [
            { fromLine: 4, toLine: 5, text: "7.9 和 7.1 砍掉小数都是 7。`INT` 不看小数部分有多大。" },
            { fromLine: 6, toLine: 6, text: "`7 / 2` 是 3.5（第 3 章：`/` 的结果永远是 `REAL`），砍掉小数是 3。" }
          ],
          sampleRun: { inputs: [], outputs: ["A: 7", "B: 7", "C: 3"] }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "想得到一个 1 到 10 之间的随机整数，该怎么写？",
          options: [
            {
              key: "A",
              label: "INT(RAND(10))",
              correct: false,
              explanation: "取整之后是 0 到 9，差了一位——`RAND(10)` 取不到 10，砍掉小数最大只到 9。"
            },
            {
              key: "B",
              label: "INT(RAND(11))",
              correct: false,
              explanation: "范围是 0 到 10，个数对了但起点不对——会出现 0。"
            },
            {
              key: "C",
              label: "INT(RAND(10)) + 1",
              correct: true,
              explanation: "对。`RAND(10)` 给 0 到 9.999…，取整得 0 到 9，加 1 正好是 1 到 10。"
            },
            {
              key: "D",
              label: "RAND(10)",
              correct: false,
              explanation: "`RAND` 还回来的是 `REAL`，比如 3.7；而且它可能接近 0，不到 1。"
            }
          ]
        }
      ]
    },
    {
      id: "7.6",
      title: "函数是表达式的一部分",
      syllabus: ["§11.1", "G§5.6"],
      estimatedMinutes: 7,
      taughtFeatures: AFTER_7_5,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "到这里七个函数都见过了，最后要说清楚它们**放在哪里**。函数调用算出来一个值，所以凡是需要一个值的地方都可以放一个函数调用：赋值的右边、`OUTPUT` 的一项、条件里、循环的终点、另一个函数的参数里、和运算符混在一起。",
            "`RIGHT(Code, LENGTH(Code) - 2)` 值得多看一眼：括号里是一个算式，先算出 `LENGTH(Code) - 2`，再把结果交给 `RIGHT`。**参数不必是写死的数字，可以是任何算得出值的表达式。**反过来，函数调用不能单独成为一条语句——算出来的值没人接着就丢了。",
            "本编辑器实现的就是 Guide 列出的这七个：`LENGTH`、`MID`、`RIGHT`、`UCASE`、`LCASE`、`INT`、`RAND`。别的名字（比如 `LEFT`、`ROUND`）都会被当成没有声明的名称。真题里偶尔会出现 Guide 之外的函数，那种情况下题目会把它的定义一起给出来。"
          ]
        },
        {
          kind: "example",
          title: "函数嵌在各种位置",
          fileName: "Example_7_6_a.pseudocode",
          code: [
            "DECLARE Code : STRING",
            "DECLARE Tail : STRING",
            'Code ← "AB1234"',
            "IF LENGTH(Code) > 4 THEN",
            "   Tail ← RIGHT(Code, LENGTH(Code) - 2)",
            '   OUTPUT "Tail: ", Tail',
            '   OUTPUT "Tail length: ", LENGTH(Tail)',
            "ENDIF"
          ].join("\n"),
          annotations: [
            { fromLine: 4, toLine: 4, text: "函数调用当条件的一半，它算出的 `INTEGER` 再拿去比较。" },
            { fromLine: 5, toLine: 5, text: "`LENGTH(Code) - 2` 先算成 4，再交给 `RIGHT` 当第二个参数。" },
            { fromLine: 7, toLine: 7, text: "对刚算出来的 `Tail` 再调用一次 `LENGTH`。" }
          ],
          sampleRun: { inputs: [], outputs: ["Tail: 1234", "Tail length: 4"] }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "下面哪一行是**不成立**的？",
          options: [
            {
              key: "A",
              label: "LENGTH(Word) 单独占一行",
              correct: true,
              explanation: "对。函数算出了一个值，但没有赋给谁、也没有显示出来，这个值无处可去，所以它不能单独成为一条语句。"
            },
            {
              key: "B",
              label: "FOR I ← 1 TO LENGTH(Word)",
              correct: false,
              explanation: "成立。`LENGTH` 算出 `INTEGER`，正好能当循环的终点。"
            },
            {
              key: "C",
              label: 'IF MID(Code, 1, 1) = "A" THEN',
              correct: false,
              explanation: "成立。`MID` 还回来的是 `STRING`，右边 `\"A\"` 也是 `STRING`，两边类型对得上。"
            },
            {
              key: "D",
              label: "OUTPUT MID(Code, 1, LENGTH(Code) - 2)",
              correct: false,
              explanation: "成立。参数可以是算式，先算完再交给函数。"
            }
          ]
        }
      ]
    }
  ],
  chapterTasks: [
    {
      kind: "chapterTask",
      id: "7.T1",
      title: "产品编号",
      statement: "写一段伪代码：读入一个产品编号和一个等级字母，把编号拆开显示。编号的格式是两个字母加若干数字，保证至少 3 个字符。",
      ioSpec: {
        input: [
          "两行。第一行是产品编号（`STRING`），第二行是等级（`CHAR`，一个字母，大小写都可能）。",
          "两句提示语各自排在它对应的那次读取之前，一字不差：",
          "`Enter the code`",
          "`Enter the grade`"
        ].join("\n"),
        output: [
          "读完之后显示五行：",
          "`Length: <编号的长度>`",
          "`Prefix: <编号的前两个字符>`",
          "`Number: <前两个字符之后的全部内容>`",
          "`Tag: <前缀>-<数字部分>`",
          "`Grade: <等级字母的大写>`",
          "每个冒号后面都是一个空格；`Tag` 那一行的两段中间是一个减号，没有空格。"
        ].join("\n")
      },
      suggestedFeatures: [
        "builtin.length",
        "builtin.mid",
        "builtin.right",
        "builtin.ucase",
        "op.concat",
        "io.input",
        "io.output"
      ],
      hints: [
        "「前两个字符之后的全部内容」有几个字符，取决于编号有多长——先想清楚这个数怎么算出来，再决定用哪个函数取。",
        "`Tag` 那一行要的是一个拼好的 `STRING`，不是三样东西挨着显示。",
        "等级是 `CHAR`，编号是 `STRING`，两者能用的函数不一样，声明的时候就要分清。"
      ],
      examples: [
        {
          inputs: ["AB1234", "a"],
          outputs: [
            "Enter the code",
            "Enter the grade",
            "Length: 6",
            "Prefix: AB",
            "Number: 1234",
            "Tag: AB-1234",
            "Grade: A"
          ]
        }
      ],
      referenceSolution: [
        "DECLARE Code : STRING",
        "DECLARE Grade : CHAR",
        "DECLARE Prefix : STRING",
        "DECLARE Digits : STRING",
        'OUTPUT "Enter the code"',
        "INPUT Code",
        'OUTPUT "Enter the grade"',
        "INPUT Grade",
        "Prefix ← MID(Code, 1, 2)",
        "Digits ← RIGHT(Code, LENGTH(Code) - 2)",
        'OUTPUT "Length: ", LENGTH(Code)',
        'OUTPUT "Prefix: ", Prefix',
        'OUTPUT "Number: ", Digits',
        'OUTPUT "Tag: ", Prefix & "-" & Digits',
        'OUTPUT "Grade: ", UCASE(Grade)'
      ].join("\n"),
      tests: [
        { id: "t1", kind: "normal", inputs: ["XY99", "b"], caseHint: "一个短编号，等级是小写。" },
        { id: "t2", kind: "normal", inputs: ["QR2468", "c"], caseHint: "一个普通长度的编号。" },
        { id: "t3", kind: "boundary", inputs: ["QQ1", "z"], caseHint: "编号短到只剩一位数字。" },
        { id: "t4", kind: "boundary", inputs: ["ZZ12", "A"], caseHint: "等级本来就是大写，转换之后不该变样。" },
        { id: "t5", kind: "extreme", inputs: ["MN1234567890", "q"], caseHint: "一个非常长的编号。" }
      ]
    }
  ]
};
