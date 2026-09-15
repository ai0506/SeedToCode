import type { Chapter } from "./types.js";
import type { FeatureId } from "@caie-pseudocode/exercise";

/** Chapter 7 结束时学生已经会的写法。 */
const AFTER_CHAPTER_7: FeatureId[] = [
  "io.output", "io.input", "decl.variable", "misc.comment",
  "type.string", "literal.string", "type.integer", "type.real", "type.char",
  "type.boolean", "type.date", "literal.integer", "literal.real", "literal.char",
  "literal.boolean", "literal.date", "assign.simple", "decl.constant",
  "op.arithmetic", "op.div", "op.mod", "op.relational", "op.and", "op.or", "op.not",
  "select.if", "select.if-else", "select.nested-if",
  "select.case", "select.case-range", "select.case-otherwise",
  "loop.for", "loop.for-step", "loop.while", "loop.repeat", "loop.nested",
  "builtin.length", "builtin.mid", "builtin.right", "builtin.ucase", "builtin.lcase",
  "op.concat", "builtin.int", "builtin.rand"
];

const AFTER_8_1: FeatureId[] = [...AFTER_CHAPTER_7, "decl.array-1d", "array.index"];

export const chapter08: Chapter = {
  id: 8,
  title: "一维数组",
  level: "AS",
  syllabus: ["§10.2", "G§3"],
  prerequisites: [1, 2, 3, 4, 5, 6, 7],
  sections: [
    {
      id: "8.1",
      title: "为什么需要数组",
      syllabus: ["§10.2", "G§3"],
      estimatedMinutes: 8,
      taughtFeatures: AFTER_8_1,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "要记住三个分数，声明三个变量就行。要记住三十个呢？三十个 `DECLARE`、三十行 `INPUT`，想求个总分还得把三十个名字全写一遍。名字一多，代码就没法写了。",
            "**数组（array）**是一排格子，共用一个名字，用编号区分。`Marks[1]`、`Marks[2]`、`Marks[3]` 全都叫 `Marks`，靠方括号里的数字分开。",
            "这一下就解开了名字的死结：编号是个数字，而数字可以用变量装。`Marks[I]` 里的 `I` 每变一次就指向不同的格子——第 5 章的 `FOR` 正好能把 `I` 从 1 数到 30。**一排格子加一个循环，三十个数和三个数写起来一样长。**",
            "格子里放的东西必须是同一种类型：一个 `ARRAY … OF INTEGER` 的每个格子都是 `INTEGER`，不能有一格塞 `STRING`。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "数组是一组相同类型的数据，用一个标识符和下标访问（§10.2）。"
            }
          ]
        },
        {
          kind: "comparison",
          title: "记住三个分数，两种写法",
          intro: "三个的时候差别不大——请一边看一边想「如果是三十个会怎样」。",
          panes: [
            {
              label: "自然语言",
              language: "natural",
              code: "记下三个分数，然后把它们加起来。",
              note: "人说「三个分数」时，脑子里是一组东西，不是三个各自独立的名字。数组就是把这个「一组」直接写进代码。"
            },
            {
              label: "伪代码 · 三个各自独立的变量",
              language: "pseudocode",
              code: [
                "DECLARE MarkOne : INTEGER",
                "DECLARE MarkTwo : INTEGER",
                "DECLARE MarkThree : INTEGER",
                "MarkOne ← 80",
                "MarkTwo ← 70",
                "MarkThree ← 60",
                'OUTPUT "Total: ", MarkOne + MarkTwo + MarkThree'
              ].join("\n"),
              note: "三个名字，三行赋值，加起来还要把三个名字再写一遍。换成三十个，这段就要写九十行，而且没有任何办法用循环。"
            },
            {
              label: "伪代码 · 一个数组",
              language: "pseudocode",
              code: [
                "DECLARE Marks : ARRAY[1:3] OF INTEGER",
                "Marks[1] ← 80",
                "Marks[2] ← 70",
                "Marks[3] ← 60",
                'OUTPUT "Total: ", Marks[1] + Marks[2] + Marks[3]'
              ].join("\n"),
              note: "一个名字，三个编号。现在把 `3` 改成 `30` 只要改一处——而且编号可以换成变量，那才是真正的好处，8.4 会用上。"
            },
            {
              label: "Python",
              language: "python",
              code: ["marks = [80, 70, 60]", 'print("Total:", marks[0] + marks[1] + marks[2])'].join("\n"),
              note: "同一个想法。Python 的编号从 0 起，而伪代码的上下界由你自己在声明里写明——下一节就讲这个。"
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "为什么说「三十个分数用三十个变量写不了」？",
          options: [
            {
              key: "A",
              label: "因为三十个变量的类型没法统一",
              correct: false,
              explanation: "三十个变量当然可以都声明成 `INTEGER`。数组要求类型统一，反而是它比散变量更严的地方。"
            },
            {
              key: "B",
              label: "因为变量的名字没法用循环生成",
              correct: true,
              explanation: "对。循环能让一个数字变来变去，但没法让变量的**名字**变来变去。数组把「第几个」变成了一个数字，循环才使得上力。"
            },
            {
              key: "C",
              label: "因为伪代码最多只能声明十个变量",
              correct: false,
              explanation: "没有这条限制。三十个 `DECLARE` 完全合法，只是写起来没法收拾。"
            },
            {
              key: "D",
              label: "因为变量存不下那么多数据",
              correct: false,
              explanation: "一个变量存一个数，三十个变量存得下三十个数。问题不在存不存得下，在写不写得动。"
            }
          ]
        }
      ]
    },
    {
      id: "8.2",
      title: "声明、下标、下界与上界",
      syllabus: ["§10.2", "G§3"],
      estimatedMinutes: 10,
      taughtFeatures: AFTER_8_1,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "声明一个数组写成 `DECLARE Marks : ARRAY[1:30] OF INTEGER`。读作：`Marks` 是一排格子，编号从 1 到 30，每个格子里装一个 `INTEGER`。只用一个编号就指得准一个格子的数组叫**一维数组（1D array）**，第 9 章会见到要两个编号的那一种。",
            "方括号里那两个数就是**下界（lower bound）**和**上界（upper bound）**——第一个格子的编号和最后一个格子的编号。**两端都算数**，所以 `ARRAY[1:30]` 一共 30 个格子。",
            "方括号里用来指格子的那个数叫**下标（index）**。`Marks[7]` 的下标是 7。下标必须是 `INTEGER`，可以是字面量，也可以是变量或算式——但不能是 `REAL`，哪怕它正好是个整数值。",
            "CAIE 要求把上下界**写明白**，不能只写个长度。这样做的好处是编号从几开始由你决定：成绩从 1 数到 30 很自然，而要表示 2020 到 2029 这十年，直接写 `ARRAY[2020:2029]` 比自己换算方便得多。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "一维数组声明为 `DECLARE <identifier> : ARRAY[<lower>:<upper>] OF <type>`，上下界都要显式写出，且都包含在内（Pseudocode Guide §3）。"
            }
          ]
        },
        {
          kind: "example",
          title: "一排格子，一个一个放",
          fileName: "Example_8_2_a.pseudocode",
          code: [
            "DECLARE Marks : ARRAY[1:3] OF INTEGER",
            "DECLARE Where : INTEGER",
            "Marks[1] ← 80",
            "Marks[2] ← 70",
            "Where ← 3",
            "Marks[Where] ← 60",
            'OUTPUT "First: ", Marks[1]',
            'OUTPUT "Last: ", Marks[3]',
            'OUTPUT "Total: ", Marks[1] + Marks[2] + Marks[3]'
          ].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 1, text: "下界 1、上界 3，一共三个格子，每格装一个 `INTEGER`。" },
            { fromLine: 5, toLine: 6, text: "下标可以是变量。这一行和 `Marks[3] ← 60` 是同一件事——正因为如此，循环才能派上用场。" },
            { fromLine: 9, toLine: 9, text: "取出来的 `Marks[1]` 就是个普通的 `INTEGER`，能加能比，和别的整数没有两样。" }
          ],
          sampleRun: { inputs: [], outputs: ["First: 80", "Last: 60", "Total: 210"] }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "`DECLARE Years : ARRAY[2020:2029] OF INTEGER` 一共有几个格子？",
          options: [
            {
              key: "A",
              label: "9 个",
              correct: false,
              explanation: "少算了一个。两端都包含，所以是「上界减下界再加一」。"
            },
            {
              key: "B",
              label: "2029 个",
              correct: false,
              explanation: "2029 是最后一个格子的编号，不是格子的数量。下标不一定从 1 开始。"
            },
            {
              key: "C",
              label: "不合法，下界必须是 1",
              correct: false,
              explanation: "下界可以是任何整数。让编号直接就是年份，比自己换算成 1 到 10 省事得多。"
            },
            {
              key: "D",
              label: "10 个",
              correct: true,
              explanation: "对。上下界两端都算数：2029 减 2020 等于 9，再加一就是 10 个格子，编号从 2020 一直到 2029。"
            }
          ]
        },
        {
          kind: "task",
          id: "8.2.1",
          title: "倒着念回去",
          statement: "写一段伪代码：提示并读入三个整数，把它们存进一个数组，然后倒着显示出来——最后读到的先显示。",
          ioSpec: {
            input: ["三行，各一个 `INTEGER`。每次读取之前都要显示提示语，一字不差：", "`Enter a number`"].join("\n"),
            output: "三行，每行一个数，顺序和读进来的相反。"
          },
          constraints: {
            require: [
              {
                feature: "decl.array-1d",
                reason: "三个数要一起存着待会儿再用，这正是一排格子该干的事。"
              },
              {
                feature: "array.index",
                reason: "存进去和取出来都要指明是第几个格子。"
              }
            ]
          },
          hints: [
            "先声明一个装得下三个整数的数组，下界写 1。",
            "读的时候按 1、2、3 存进去，显示的时候按 3、2、1 取出来。"
          ],
          examples: [
            { inputs: ["7", "8", "9"], outputs: ["Enter a number", "Enter a number", "Enter a number", "9", "8", "7"] }
          ],
          referenceSolution: [
            "DECLARE Numbers : ARRAY[1:3] OF INTEGER",
            'OUTPUT "Enter a number"',
            "INPUT Numbers[1]",
            'OUTPUT "Enter a number"',
            "INPUT Numbers[2]",
            'OUTPUT "Enter a number"',
            "INPUT Numbers[3]",
            "OUTPUT Numbers[3]",
            "OUTPUT Numbers[2]",
            "OUTPUT Numbers[1]"
          ].join("\n"),
          tests: [
            { id: "t1", kind: "normal", inputs: ["10", "20", "30"], caseHint: "三个各不相同的数。" },
            { id: "t2", kind: "normal", inputs: ["5", "5", "9"], caseHint: "前两个一样大。" },
            { id: "t3", kind: "boundary", inputs: ["0", "0", "0"], caseHint: "全是零。" },
            { id: "t4", kind: "boundary", inputs: ["-1", "-2", "-3"], caseHint: "全是负数。" },
            { id: "t5", kind: "extreme", inputs: ["999999", "1", "888888"], caseHint: "掺着很大和很小的数。" }
          ]
        }
      ]
    },
    {
      id: "8.3",
      title: "越界与还没放东西的格子",
      syllabus: ["§10.2", "G§3"],
      estimatedMinutes: 9,
      taughtFeatures: AFTER_8_1,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "数组只有声明时说好的那些格子。`ARRAY[1:3]` 没有第 0 格，也没有第 4 格。指一个不存在的格子叫**越界**，程序不会将就着给你一个值，它会停下来。",
            "越界什么时候被发现，取决于下标是什么。**下标写成字面量时，编辑器在运行前就能拦下来**——`Marks[4]` 里的 4 摆在那儿，一看就知道超了。",
            "**下标是变量时就只能等到跑起来**。`Marks[I]` 里的 `I` 是多少，要执行到那一行才知道。循环边界写错一位，前几遍都对，最后一遍才炸——这又是一次「能通过检查不等于能跑完」。",
            "还有一种不是越界但同样会停的情况：格子在范围里，可是**还没往里放过东西**。声明只是划出格子，没有给它们填值，读一个空格子和读一个没赋过值的变量是一回事。"
          ]
        },
        {
          kind: "counterExample",
          title: "三种指错格子的方式",
          cases: [
            {
              title: "下标写死了，运行前就拦下",
              code: ["DECLARE Marks : ARRAY[1:3] OF INTEGER", "Marks[4] ← 90"].join("\n"),
              note: "4 超过了上界 3。这个下标是写死的，编辑器不用跑就知道它不存在。",
              expectDiagnostics: [
                { severity: "error", ruleId: "ARRAY-004", line: 2, text: "第 4 个格子不存在——这个数组只有第 1 到第 3 格。" }
              ]
            },
            {
              title: "下标是变量，跑到那一遍才炸",
              code: [
                "DECLARE Marks : ARRAY[1:3] OF INTEGER",
                "FOR I ← 1 TO 4",
                "   Marks[I] ← I",
                "NEXT I"
              ].join("\n"),
              note: "循环多跑了一遍。前三遍都对，第四遍才越界——编辑器一条提示都没有，因为 `I` 是多少要跑起来才知道。",
              expectRuntimeError: {
                code: "RT1603",
                line: 3,
                text: "循环跑到第 4 遍，可数组只到第 3 格。检查一下循环的终点。"
              }
            },
            {
              title: "格子在，但还是空的",
              code: ["DECLARE Marks : ARRAY[1:3] OF INTEGER", "OUTPUT Marks[2]"].join("\n"),
              note: "第 2 格确实存在，只是从头到尾没往里放过东西。声明只划格子，不填值。",
              expectRuntimeError: {
                code: "RT1003",
                line: 2,
                text: "这个格子还没有值——先给它赋值，或者用 `INPUT` 读一个进去。"
              }
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "`DECLARE A : ARRAY[1:5] OF INTEGER` 之后，哪一种写法编辑器**在运行前就能**发现问题？",
          options: [
            {
              key: "A",
              label: "A[6] ← 1",
              correct: true,
              explanation: "对。6 是写死在代码里的，和上界 5 一比就知道超了，不用跑起来。"
            },
            {
              key: "B",
              label: "A[I] ← 1，而 I 这时候是 6",
              correct: false,
              explanation: "`I` 的值要执行到那一行才知道，所以这种越界只能在运行时发现。"
            },
            {
              key: "C",
              label: "OUTPUT A[3]，而第 3 格还没赋过值",
              correct: false,
              explanation: "第 3 格在范围里，静态检查挑不出毛病；空格子是跑到那一行才停。"
            },
            {
              key: "D",
              label: "三种都能在运行前发现",
              correct: false,
              explanation: "只有下标写死的那一种可以。另外两种都要等程序真的跑到那一行。"
            }
          ]
        }
      ]
    },
    {
      id: "8.4",
      title: "用 `FOR` 遍历数组",
      syllabus: ["§10.2", "G§3"],
      estimatedMinutes: 9,
      taughtFeatures: AFTER_8_1,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "把数组的每个格子从头到尾走一遍，叫**遍历（traverse）**。数组的下标是连续的整数，`FOR` 的控制变量也是连续的整数——两者天生是一对。",
            "写法就是让控制变量从下界数到上界，循环体里用它当下标：`FOR I ← 1 TO 5` 配 `Marks[I]`。循环跑几遍，格子就被碰几次。",
            "**循环的边界要和数组的上下界对上。**数组是 `ARRAY[1:5]`，循环就写 `1 TO 5`；写成 `1 TO 6` 会在最后一遍越界，写成 `1 TO 4` 则会安静地漏掉最后一格——后者更麻烦，因为它不报错，只是结果少了一块。"
          ]
        },
        {
          kind: "example",
          title: "读进来再倒着显示",
          fileName: "Example_8_4_a.pseudocode",
          code: [
            "DECLARE Numbers : ARRAY[1:5] OF INTEGER",
            "FOR I ← 1 TO 5",
            '   OUTPUT "Enter a number"',
            "   INPUT Numbers[I]",
            "NEXT I",
            "FOR I ← 5 TO 1 STEP -1",
            "   OUTPUT Numbers[I]",
            "NEXT I"
          ].join("\n"),
          annotations: [
            { fromLine: 2, toLine: 5, text: "第一遍遍历：从下界数到上界，每遍读一个数放进第 `I` 格。" },
            { fromLine: 6, toLine: 6, text: "第二遍遍历倒着走——起点是上界，终点是下界，配 `STEP -1`（5.2）。" },
            { fromLine: 4, toLine: 4, text: "`INPUT` 的目标可以直接是数组的某一格，不用先读进一个临时变量再搬过去。" }
          ],
          sampleRun: {
            inputs: ["1", "2", "3", "4", "5"],
            outputs: [
              "Enter a number",
              "Enter a number",
              "Enter a number",
              "Enter a number",
              "Enter a number",
              "5",
              "4",
              "3",
              "2",
              "1"
            ]
          }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "数组是 `ARRAY[1:5]`，循环写成 `FOR I ← 1 TO 4` 会怎样？",
          options: [
            {
              key: "A",
              label: "编辑器会拦下来",
              correct: false,
              explanation: "循环少跑一遍完全合法。编辑器没法知道你本来想跑几遍。"
            },
            {
              key: "B",
              label: "第 5 格会自动被当成 0",
              correct: false,
              explanation: "没有这种自动填值。第 5 格只是保持原样——如果从没赋过值，读它反而会让程序停下来。"
            },
            {
              key: "C",
              label: "不报错，但第 5 格被漏掉了",
              correct: true,
              explanation: "对。1 到 4 是合法的下标，程序跑得完，只是最后一格从头到尾没被碰过。这种错比越界难发现——它只是结果少了一块。"
            },
            {
              key: "D",
              label: "运行时越界，程序停下来",
              correct: false,
              explanation: "越界是指了不存在的格子。这里指的格子都存在，只是少指了一个。"
            }
          ]
        },
        {
          kind: "task",
          id: "8.4.1",
          title: "数一数有几个及格",
          statement: "写一段伪代码：提示并读入 5 个分数存进数组，然后数一数其中有几个不低于 50，显示这个数量。",
          ioSpec: {
            input: ["五行，各一个 `INTEGER`。每次读取之前都要显示提示语，一字不差：", "`Enter a mark`"].join("\n"),
            output: "一行，写成 `Passed: <个数>`。冒号后面是一个空格。"
          },
          constraints: {
            require: [
              {
                feature: "decl.array-1d",
                reason: "五个分数要先存下来，才能在读完之后再数一遍。"
              },
              {
                feature: "loop.for",
                reason: "格子的编号是连续的整数，次数一开始就知道，交给计数控制循环最省事。"
              },
              {
                feature: "array.index",
                reason: "存进去和数的时候都要指明是第几格。"
              }
            ]
          },
          hints: [
            "读的时候用一个 `FOR` 从下界走到上界，把读到的数放进第 `I` 格。",
            "数的时候需要一个计数变量，循环开始前先设成 0。",
            "「不低于 50」是一次比较，比出来成立就把计数加一。"
          ],
          examples: [
            {
              inputs: ["40", "60", "50", "20", "90"],
              outputs: [
                "Enter a mark",
                "Enter a mark",
                "Enter a mark",
                "Enter a mark",
                "Enter a mark",
                "Passed: 3"
              ]
            }
          ],
          referenceSolution: [
            "DECLARE Marks : ARRAY[1:5] OF INTEGER",
            "DECLARE Passed : INTEGER",
            "Passed ← 0",
            "FOR I ← 1 TO 5",
            '   OUTPUT "Enter a mark"',
            "   INPUT Marks[I]",
            "NEXT I",
            "FOR I ← 1 TO 5",
            "   IF Marks[I] >= 50 THEN",
            "      Passed ← Passed + 1",
            "   ENDIF",
            "NEXT I",
            'OUTPUT "Passed: ", Passed'
          ].join("\n"),
          tests: [
            { id: "t1", kind: "normal", inputs: ["80", "30", "70", "45", "55"], caseHint: "及格和不及格混在一起。" },
            { id: "t2", kind: "normal", inputs: ["10", "20", "30", "40", "45"], caseHint: "一个都没及格。" },
            { id: "t3", kind: "boundary", inputs: ["50", "50", "50", "50", "50"], caseHint: "全部正好卡在及格线上。" },
            { id: "t4", kind: "boundary", inputs: ["49", "49", "49", "49", "49"], caseHint: "全部差一分。" },
            { id: "t5", kind: "extreme", inputs: ["100", "100", "100", "100", "100"], caseHint: "全部满分。" }
          ]
        }
      ]
    },
    {
      id: "8.5",
      title: "先存下来，才做得到的事",
      syllabus: ["§10.2", "G§3"],
      estimatedMinutes: 10,
      taughtFeatures: AFTER_8_1,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "求和、求最大、计数这三件事，第 5 章不用数组也做得到——边读边加、边读边比、边读边数就行。那数组到底多给了什么？",
            "**它多给了「再看一遍」的能力。**边读边算的东西，读完就丢了；存进数组的数据，想看几遍就看几遍。",
            "有些问题非得看两遍不可。比如「有几天的气温高于平均值」：平均值要等全部读完才算得出来，可判断「高于平均」又要回头看每一天。第一遍读入并求和，算出平均，第二遍再回去数——**没有存下来就没有第二遍**。",
            "求最大值有个细节：起点不要写 0。把第一个格子的值当起点，再从第二格开始比，这样即使全是负数也不会出错。"
          ]
        },
        {
          kind: "example",
          title: "两遍遍历：先算平均，再数超过的",
          fileName: "Example_8_5_a.pseudocode",
          code: [
            "DECLARE Temps : ARRAY[1:4] OF INTEGER",
            "DECLARE Total : INTEGER",
            "DECLARE Average : INTEGER",
            "DECLARE Above : INTEGER",
            "Total ← 0",
            "Above ← 0",
            "Temps[1] ← 18",
            "Temps[2] ← 25",
            "Temps[3] ← 20",
            "Temps[4] ← 21",
            "FOR I ← 1 TO 4",
            "   Total ← Total + Temps[I]",
            "NEXT I",
            "Average ← Total DIV 4",
            "FOR I ← 1 TO 4",
            "   IF Temps[I] > Average THEN",
            "      Above ← Above + 1",
            "   ENDIF",
            "NEXT I",
            'OUTPUT "Average: ", Average',
            'OUTPUT "Above: ", Above'
          ].join("\n"),
          annotations: [
            { fromLine: 11, toLine: 13, text: "第一遍：只管加总。到这里还不知道平均值是多少。" },
            { fromLine: 14, toLine: 14, text: "全部加完才算得出平均值——这就是为什么非要分两遍。" },
            { fromLine: 15, toLine: 19, text: "第二遍：拿着平均值回头再看每一格。数据还在数组里，所以回得去。" }
          ],
          sampleRun: { inputs: [], outputs: ["Average: 21", "Above: 1"] }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "下面哪件事**必须**把数据先存进数组才做得到？",
          options: [
            {
              key: "A",
              label: "找出读到的数里最大的那个",
              correct: false,
              explanation: "边读边比就行：每读一个和目前的最大值比一下，不需要记住所有数。"
            },
            {
              key: "B",
              label: "数出有几个数大于 50",
              correct: false,
              explanation: "50 是事先就知道的门槛，边读边数就行。要是门槛得等读完才算得出来，那就另说了。"
            },
            {
              key: "C",
              label: "数出有几个数高于这一批数的平均值",
              correct: true,
              explanation: "对。平均值要全部读完才算得出来，而判断谁高于它又要回头看每一个数。没存下来就回不去了。"
            },
            {
              key: "D",
              label: "把读到的数全部加起来",
              correct: false,
              explanation: "边读边加就行，加完的数不需要再用第二次。"
            }
          ]
        }
      ]
    }
  ],
  chapterTasks: [
    {
      kind: "chapterTask",
      id: "8.T1",
      title: "一周气温",
      statement: "写一段伪代码：读入一周七天的气温存进数组，然后显示总和、最高值、平均值，以及有几天高于平均值。",
      ioSpec: {
        input: ["七行，各一个 `INTEGER`。每次读取之前都要显示提示语，一字不差：", "`Enter a temperature`"].join("\n"),
        output: [
          "读完之后显示四行：",
          "`Total: <总和>`",
          "`Highest: <最高值>`",
          "`Average: <平均值>`　（取整数商）",
          "`Above average: <高于平均值的天数>`",
          "每个冒号后面都是一个空格。"
        ].join("\n")
      },
      suggestedFeatures: [
        "decl.array-1d",
        "array.index",
        "loop.for",
        "select.if",
        "op.arithmetic",
        "op.div",
        "op.relational",
        "io.input",
        "io.output"
      ],
      hints: [
        "最后那一行是这道题的关键：平均值要等七天全部读完才算得出来，而「高于平均」又要回头看每一天。想清楚这需要走几遍。",
        "求最高值时，起点用第一天的气温，不要用 0——气温是可能低于零的。",
        "总和、最高值、计数各自需要一个变量，都要在对应的循环开始前给好初值。"
      ],
      examples: [
        {
          inputs: ["20", "22", "19", "25", "21", "18", "24"],
          outputs: [
            "Enter a temperature",
            "Enter a temperature",
            "Enter a temperature",
            "Enter a temperature",
            "Enter a temperature",
            "Enter a temperature",
            "Enter a temperature",
            "Total: 149",
            "Highest: 25",
            "Average: 21",
            "Above average: 3"
          ]
        }
      ],
      referenceSolution: [
        "DECLARE Temps : ARRAY[1:7] OF INTEGER",
        "DECLARE Total : INTEGER",
        "DECLARE Highest : INTEGER",
        "DECLARE Average : INTEGER",
        "DECLARE Above : INTEGER",
        "Total ← 0",
        "Above ← 0",
        "FOR I ← 1 TO 7",
        '   OUTPUT "Enter a temperature"',
        "   INPUT Temps[I]",
        "   Total ← Total + Temps[I]",
        "NEXT I",
        "Highest ← Temps[1]",
        "FOR I ← 2 TO 7",
        "   IF Temps[I] > Highest THEN",
        "      Highest ← Temps[I]",
        "   ENDIF",
        "NEXT I",
        "Average ← Total DIV 7",
        "FOR I ← 1 TO 7",
        "   IF Temps[I] > Average THEN",
        "      Above ← Above + 1",
        "   ENDIF",
        "NEXT I",
        'OUTPUT "Total: ", Total',
        'OUTPUT "Highest: ", Highest',
        'OUTPUT "Average: ", Average',
        'OUTPUT "Above average: ", Above'
      ].join("\n"),
      tests: [
        { id: "t1", kind: "normal", inputs: ["15", "18", "21", "17", "19", "22", "16"], caseHint: "一周气温有高有低。" },
        { id: "t2", kind: "boundary", inputs: ["20", "20", "20", "20", "20", "20", "20"], caseHint: "七天一模一样——这时候没有哪天高于平均。" },
        { id: "t3", kind: "boundary", inputs: ["-5", "-3", "-8", "-1", "-6", "-2", "-4"], caseHint: "整周都在零度以下。" },
        { id: "t4", kind: "normal", inputs: ["0", "10", "0", "10", "0", "10", "0"], caseHint: "只有两种值轮流出现。" },
        { id: "t5", kind: "extreme", inputs: ["40", "1", "1", "1", "1", "1", "1"], caseHint: "有一天特别热，把平均值拉高了。" }
      ]
    }
  ]
};
