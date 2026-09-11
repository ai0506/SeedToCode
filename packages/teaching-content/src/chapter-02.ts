import type { Chapter } from "./types.js";

/**
 * Chapter 2 — 变量与数据类型（AS）
 * 对应 §10.1、§11.1、Pseudocode Guide §2。
 *
 * 大纲中的九个知识点按依赖关系合成五节：每节都能形成一个完整的动作，
 * 而不是为了逐项对齐目录把一个定义拆成一张薄页面。
 */
export const chapter02: Chapter = {
  id: 2,
  title: "变量与数据类型",
  level: "AS",
  syllabus: ["§10.1", "§11.1", "G§2"],
  prerequisites: [1],
  sections: [
    {
      id: "2.1",
      title: "变量、标识符与声明",
      syllabus: ["§10.1", "G§2.3", "G§2.4"],
      estimatedMinutes: 8,
      taughtFeatures: ["io.output", "io.input", "decl.variable", "misc.comment", "type.string", "literal.string"],
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "上一章的 `INPUT Name` 先把名字读进来，后来 `OUTPUT` 又把它拿出来。中间那个叫 `Name` 的位置，就是**变量（variable）**：它有一个名字，里面放的值可以在程序运行时改变。",
            "给变量起的名字叫**标识符（identifier）**。它必须从字母开始，之后只能用字母、数字或下划线；不能有空格，也不要用带重音的字母。`PlayerName` 可以，`2ndPlayer` 和 `Player Name` 不可以。标识符不区分大小写，所以 `Score` 与 `score` 不能当成两个不同的名字。",
            "在第一次使用变量前，先用**声明（declaration）**告诉读者它叫什么、里面准备放哪种数据：`DECLARE 名字 : 数据类型`。这一步只是准备位置，不是把一个值放进去。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "标识符以字母开头，只能含字母、数字和下划线；它们不区分大小写。变量声明写成 `DECLARE <identifier> : <data type>`（Pseudocode Guide §2.3、§2.4）。"
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "下面哪个名字可以作为标识符？",
          options: [
            { key: "A", label: "2ndPlayer", correct: false, explanation: "不可以。标识符的第一个字符必须是字母，不能从数字开始。" },
            { key: "B", label: "Player Name", correct: false, explanation: "不可以。空格会把它拆成两个部分；标识符中没有空格。" },
            { key: "C", label: "Player_Name2", correct: true, explanation: "可以。它从字母开始，后面只用了字母、下划线和数字。" },
            { key: "D", label: "Player-Name", correct: false, explanation: "不可以。连字符不是标识符允许使用的字符；需要分隔时可以用下划线。" }
          ]
        }
      ]
    },
    {
      id: "2.2",
      title: "六种基本类型",
      syllabus: ["§10.1", "G§2.1"],
      estimatedMinutes: 10,
      taughtFeatures: [
        "io.output", "io.input", "decl.variable", "misc.comment", "type.string", "literal.string",
        "type.integer", "type.real", "type.char", "type.boolean", "type.date"
      ],
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "**数据类型（data type）**说明一个位置可以放什么样的值。它让人一眼看出数据的含义，也让编辑器能阻止把不相配的值混在一起。",
            "`INTEGER` 是整数，`REAL` 可以有小数部分；`CHAR` 恰好是一个字符，`STRING` 是零个或多个字符。`BOOLEAN` 只有 `TRUE` 和 `FALSE` 两种值；`DATE` 表示一个有效的日历日期。",
            "类型不是变量名的一部分。`DECLARE Total : REAL` 的 `Total` 是你取的名字，`REAL` 才是在说明它能保存什么。先分清这两个位置，读声明就不会乱。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "基本数据类型是 `INTEGER`、`REAL`、`CHAR`、`STRING`、`BOOLEAN` 和 `DATE`（Pseudocode Guide §2.1）。"
            }
          ]
        },
        {
          kind: "example",
          title: "把不同的数据放进合适的位置",
          fileName: "Example_2_2_a.pseudocode",
          code: [
            "DECLARE Count : INTEGER",
            "DECLARE Price : REAL",
            "DECLARE Initial : CHAR",
            "DECLARE Message : STRING",
            "DECLARE Finished : BOOLEAN",
            "DECLARE StartDate : DATE",
            'OUTPUT "Enter the count"',
            "INPUT Count",
            "OUTPUT Count"
          ].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 2, text: "数量通常用 `INTEGER`；可能带小数的价格用 `REAL`。" },
            { fromLine: 3, toLine: 4, text: "单个字母用 `CHAR`；一句文字或空文字用 `STRING`。" },
            { fromLine: 5, toLine: 6, text: "只有是或否的状态用 `BOOLEAN`；日历上的日期用 `DATE`。" },
            { fromLine: 7, toLine: 9, text: "输入前先显示提示。这里读入的内容会放进 `INTEGER` 类型的 `Count`。" }
          ],
          sampleRun: { inputs: ["12"], outputs: ["Enter the count", "12"] }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "要保存“这本书是否已经归还”，哪种类型最合适？",
          options: [
            { key: "A", label: "INTEGER", correct: false, explanation: "整数适合数量或计数；这里需要表达的是两种状态，不是一个数。" },
            { key: "B", label: "BOOLEAN", correct: true, explanation: "对。归还或未归还是两种状态，正好用 `TRUE` 或 `FALSE` 表示。" },
            { key: "C", label: "CHAR", correct: false, explanation: "单个字符可以写出 Y 或 N，但那是在用字符代替状态；这里直接用布尔值更贴切。" },
            { key: "D", label: "DATE", correct: false, explanation: "日期可以记录何时归还，但不能单独回答“是否已经归还”。" }
          ]
        }
      ]
    },
    {
      id: "2.3",
      title: "字面量怎样写",
      syllabus: ["G§2.2"],
      estimatedMinutes: 8,
      taughtFeatures: [
        "io.output", "io.input", "decl.variable", "misc.comment", "type.string", "literal.string",
        "type.integer", "type.real", "type.char", "type.boolean", "type.date",
        "literal.integer", "literal.real", "literal.char", "literal.boolean", "literal.date"
      ],
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "直接写在代码里的一个确定值叫**字面量（literal）**。`7` 是整数，`0.5` 是实数；实数的小数点两边都要有数字，所以写 `0.5`，不写 `.5`。",
            "一个 `CHAR` 用单引号包起来，例如 `'A'`；一个 `STRING` 用双引号包起来，例如 `\"Ada\"`。空字符串也可以写，形式是 `\"\"`。引号告诉读者这是文字，不是一个叫 Ada 的变量。",
            "布尔值直接写 `TRUE` 或 `FALSE`。日期通常写成 `dd/mm/yyyy`，例如 `02/01/2028`；不同地方对日期次序的习惯不同，使用时要说明这里采用的格式。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "`CHAR` 用单引号，`STRING` 用双引号，`BOOLEAN` 写成 `TRUE` 或 `FALSE`；`REAL` 的小数点两边都至少有一位数字（Pseudocode Guide §2.2）。"
            }
          ]
        },
        {
          kind: "example",
          title: "同样是文字，引号表示的范围不同",
          fileName: "Example_2_3_a.pseudocode",
          code: [
            "OUTPUT 'A'",
            'OUTPUT "Ada"',
            "OUTPUT TRUE",
            "OUTPUT 02/01/2028"
          ].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 1, text: "`'A'` 是一个字符，所以用单引号。" },
            { fromLine: 2, toLine: 2, text: "`" + '"Ada"' + "` 是多个字符组成的字符串，所以用双引号。" },
            { fromLine: 3, toLine: 4, text: "布尔值不加引号；日期按日、月、年的次序写。" }
          ],
          sampleRun: { inputs: [], outputs: ["A", "Ada", "TRUE", "02/01/2028"] }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "下面哪一个是只含一个字符的 `CHAR` 字面量？",
          options: [
            { key: "A", label: '"A"', correct: false, explanation: "双引号包住的是 `STRING`；即使里面只有一个字符，它的类型仍是字符串。" },
            { key: "B", label: "'A'", correct: true, explanation: "对。单引号包住一个字符，就是 `CHAR` 字面量。" },
            { key: "C", label: "A", correct: false, explanation: "没有引号的 A 会被读作一个名字，不是一个直接写出的字符值。" },
            { key: "D", label: '""', correct: false, explanation: "这是空字符串，里面没有任何字符；它属于 `STRING`，不是 `CHAR`。" }
          ]
        }
      ]
    },
    {
      id: "2.4",
      title: "赋值与初始化",
      syllabus: ["§10.1", "G§2.6"],
      estimatedMinutes: 9,
      taughtFeatures: [
        "io.output", "io.input", "decl.variable", "misc.comment", "type.string", "literal.string",
        "type.integer", "type.real", "type.char", "type.boolean", "type.date",
        "literal.integer", "literal.real", "literal.char", "literal.boolean", "literal.date", "assign.simple"
      ],
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "声明只是准备一个位置；把值放进去要用**赋值（assignment）**。写法是 `名字 ← 值`，箭头表示值从右边放到左边的变量里。这里不能用 `=`；`=` 留给后面 Chapter 3 的比较。",
            "第一次给变量放入一个值叫**初始化（initialisation）**。例如 `Score ← 0` 让一个整数变量从零开始。变量必须先有值，才可以把它拿去 `OUTPUT` 或参与计算；只声明而没有赋值时，里面仍然是空的。",
            "右边的值要和左边变量的数据类型相配。把 `\"Ada\"` 放进 `STRING` 可以；把一段文字放进 `INTEGER` 不行。编辑器会在真正运行前指出这种不相配。"
          ],
          callouts: [
            { source: "CAIE", text: "赋值写成 `<identifier> ← <value>`；左边必须是变量，右边的表达式必须得到相同的数据类型（Pseudocode Guide §2.6）。" },
            { source: "editor", text: "本编辑器不会替没有赋值的变量猜一个默认内容；读取未初始化变量会停止运行并指出位置。" }
          ]
        },
        {
          kind: "example",
          title: "准备位置，再放入起始分数",
          fileName: "Example_2_4_a.pseudocode",
          code: ["DECLARE Score : INTEGER", "Score ← 0", "OUTPUT Score"].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 1, text: "先声明 `Score` 只能保存整数。" },
            { fromLine: 2, toLine: 3, text: "第 2 行完成初始化；因此第 3 行读取它时，已经有一个明确的值。" }
          ],
          sampleRun: { inputs: [], outputs: ["0"] }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "哪一行是在把整数变量 `Count` 初始化为零？",
          options: [
            { key: "A", label: "DECLARE Count : INTEGER", correct: false, explanation: "这行只说明 Count 准备保存整数，还没有把任何整数放进去。" },
            { key: "B", label: "Count = 0", correct: false, explanation: "`=` 不是赋值箭头；本课程的赋值要清楚写出 `←`。" },
            { key: "C", label: "Count ← 0", correct: true, explanation: "对。箭头把右边的整数零放进左边的 Count，正是第一次赋值。" },
            { key: "D", label: "OUTPUT Count", correct: false, explanation: "OUTPUT 是读取并显示现有的值；它不会替变量创建一个值。" }
          ]
        },
        {
          kind: "task",
          id: "2.4.1",
          title: "记录起始积分",
          statement: "写一段伪代码：准备一个保存积分的整数变量，把它的起始值设为零，然后显示一行 `Points: 0`。",
          ioSpec: { input: "没有输入。", output: "一行：`Points: 0`。冒号后有一个空格。" },
          constraints: {
            require: [
              { feature: "assign.simple", reason: "本节练习的是先给变量一个值；只把零直接写进 OUTPUT 不能体现初始化。" },
              { feature: "io.output-variable", reason: "OUTPUT 要显示的是 Points 变量里的值，不能把 \"Points: 0\" 整句写成固定文字。" }
            ]
          },
          hints: [
            "先想清楚：变量里要保存的是一个没有小数的数量。", "把“准备位置”“放入零”“显示结果”按这个顺序写成三步。" ],
          examples: [{ inputs: [], outputs: ["Points: 0"] }],
          starterCode: "DECLARE Points : INTEGER\n",
          referenceSolution: ["DECLARE Points : INTEGER", "Points ← 0", 'OUTPUT "Points: ", Points'].join("\n"),
          tests: [{ id: "t1", kind: "normal", inputs: [], caseHint: "程序不读输入，输出只有一种可能，所以只有这一组。" }]
        }
      ]
    },
    {
      id: "2.5",
      title: "常量与不变的值",
      syllabus: ["G§2.5"],
      estimatedMinutes: 7,
      taughtFeatures: [
        "io.output", "io.input", "decl.variable", "misc.comment", "type.string", "literal.string",
        "type.integer", "type.real", "type.char", "type.boolean", "type.date",
        "literal.integer", "literal.real", "literal.char", "literal.boolean", "literal.date", "assign.simple", "decl.constant"
      ],
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "程序里有些值从开始到结束都不该改变，例如一周的天数。把这种值命名为**常量（constant）**，读代码的人就不用反复猜 `7` 代表什么。",
            "常量写成 `CONSTANT 名字 = 字面量`，并且只能在这里给它一个直接写出的字面量。变量、另一个常量或一段计算都不能放在等号右边；常量一旦写好，后面也不能再赋新值。",
            "判断时很简单：值会随着一次运行而改变，就用变量；它在这段程序中始终代表同一件事，就用常量。两者都要取清楚的名字。"
          ],
          callouts: [
            { source: "CAIE", text: "常量写成 `CONSTANT <identifier> = <value>`，右边只能是字面量；用有意义的名字代替字面量可以让伪代码更易读（Pseudocode Guide §2.5）。" }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "下面哪一种情况最适合用常量？",
          options: [
            { key: "A", label: "玩家本轮得到的分数", correct: false, explanation: "分数会随着输入和计算变化，因此需要一个可重新赋值的变量。" },
            { key: "B", label: "本程序采用的一周天数", correct: true, explanation: "对。在同一次运行中它始终代表同一个固定值，给它一个名字会让代码更清楚。" },
            { key: "C", label: "用户刚刚输入的姓名", correct: false, explanation: "姓名来自输入，每次运行可能不同；它应保存在变量里。" },
            { key: "D", label: "循环中不断累加的总数", correct: false, explanation: "总数会反复改变。常量不能在后面被重新赋值。" }
          ]
        },
        {
          kind: "example",
          title: "用有意义的名字保存固定值",
          fileName: "Example_2_5_a.pseudocode",
          code: ["CONSTANT DaysInWeek = 7", 'OUTPUT "Days: ", DaysInWeek'].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 1, text: "常量在这一行给出名字和固定的字面量值。" },
            { fromLine: 2, toLine: 2, text: "之后可以读取它；名字说明了这里的 7 代表什么。" }
          ],
          sampleRun: { inputs: [], outputs: ["Days: 7"] }
        },
        {
          kind: "counterExample",
          title: "有些错误会在不同阶段被发现",
          cases: [
            {
              title: "把文字放进整数变量",
              code: ["DECLARE Count : INTEGER", 'Count ← "twelve"'].join("\n"),
              note: "第 2 行右边是文字，左边却只能保存整数。编辑器在运行前就能发现这两边不相配。",
              expectDiagnostics: [{ severity: "error", ruleId: "ASSIGN-002", line: 2, text: "这里需要整数，不能把一段文字放进 `Count`。" }]
            },
            {
              title: "重新给常量赋值",
              code: ["CONSTANT DaysInWeek = 7", "DaysInWeek ← 8"].join("\n"),
              note: "第 1 行已经给常量确定了值。第 2 行不能再改变它；这段代码也不会开始运行。",
              expectDiagnostics: [{ severity: "error", ruleId: "ASSIGN-003", line: 2, text: "`DaysInWeek` 是常量，不能在后面重新赋值。" }]
            },
            {
              title: "声明后立刻读取",
              code: ["DECLARE Name : STRING", "OUTPUT Name"].join("\n"),
              note: "这段代码的写法本身没有问题，所以可以开始运行；但 `Name` 还没有内容，运行到第 2 行才会停止。",
              expectRuntimeError: { code: "RT1003", line: 2, text: "`Name` 还没有被赋值，不能显示它的内容。" }
            }
          ]
        }
      ]
    }
  ],
  chapterTasks: [
    {
      kind: "chapterTask",
      id: "2.T1",
      title: "显示一张分数卡",
      statement: "写一段伪代码：用一个常量保存及格线，用一个整数变量保存学生分数，然后显示两行分数卡。",
      ioSpec: { input: "没有输入。", output: "两行：`Pass mark: 50` 和 `Score: 64`，两处冒号后各有一个空格。" },
      suggestedFeatures: ["decl.constant", "decl.variable", "assign.simple", "io.output"],
      hints: ["这两种数的角色不同：及格线固定，学生分数可以换。", "先分别准备固定值和可变位置，再给可变位置放入分数。", "每一行 OUTPUT 都由一段文字和一个保存的值拼起来。"],
      examples: [{ inputs: [], outputs: ["Pass mark: 50", "Score: 64"] }],
      lockedStarterCode: "CONSTANT PassMark = 50",
      starterCode: "",
      referenceSolution: [
        "CONSTANT PassMark = 50",
        "DECLARE Score : INTEGER",
        "Score ← 64",
        'OUTPUT "Pass mark: ", PassMark',
        'OUTPUT "Score: ", Score'
      ].join("\n"),
      tests: [{ id: "t1", kind: "normal", inputs: [], caseHint: "显示固定及格线和已经保存的分数。" }]
    }
  ]
};
