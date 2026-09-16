import type { Chapter } from "./types.js";
import type { FeatureId } from "@caie-pseudocode/exercise";

/** Chapter 11 结束时学生已经会的写法。 */
const AFTER_CHAPTER_11: FeatureId[] = [
  "io.output", "io.input", "decl.variable", "misc.comment",
  "type.string", "literal.string", "type.integer", "type.real", "type.char",
  "type.boolean", "type.date", "literal.integer", "literal.real", "literal.char",
  "literal.boolean", "literal.date", "assign.simple", "decl.constant",
  "op.arithmetic", "op.div", "op.mod", "op.relational", "op.and", "op.or", "op.not",
  "select.if", "select.if-else", "select.nested-if",
  "select.case", "select.case-range", "select.case-otherwise",
  "loop.for", "loop.for-step", "loop.while", "loop.repeat", "loop.nested",
  "builtin.length", "builtin.mid", "builtin.right", "builtin.ucase", "builtin.lcase",
  "op.concat", "builtin.int", "builtin.rand",
  "decl.array-1d", "array.index", "decl.array-2d", "array.index-2d",
  "decl.record-type", "record.field-access"
];

/** 12.1 的对照里已经要拿「抄三遍」和「抽成过程」并排，所以过程和 `CALL` 在第一节就放开。 */
const AFTER_12_1: FeatureId[] = [...AFTER_CHAPTER_11, "routine.procedure", "routine.call"];
/** 12.3 引入参数。不写 `BYVAL`/`BYREF` 时默认按值传，所以这一节放开的是 `param.byval`。 */
const AFTER_12_3: FeatureId[] = [...AFTER_12_1, "param.byval"];
/** 12.5 引入 `BYREF`。 */
const AFTER_12_5: FeatureId[] = [...AFTER_12_3, "param.byref"];

export const chapter12: Chapter = {
  id: 12,
  title: "过程",
  level: "AS",
  syllabus: ["§11.3"],
  prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  sections: [
    {
      id: "12.1",
      title: "分解：把一段程序拆成几件事",
      syllabus: ["§11.3"],
      estimatedMinutes: 9,
      taughtFeatures: AFTER_12_1,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "到这里为止写的都是一整段程序，从第一行读到最后一行。程序一长，这种写法开始难受：同一件事要做三遍就得把那几行抄三遍，以后改一处还得记着另外两处也要改。",
            "办法是**分解（decomposition）**：把「做一件事」的那几行单独拿出来，起个名字；需要的时候喊一声名字就行。伪代码里这样一段被起了名字的代码叫一个**过程（procedure）**。",
            "什么时候该抽出一个过程？两个信号：**同一段代码出现了第二遍**，或者**你得先给这几行起个名字才说得清它在干嘛**。第二个信号常常比第一个重要——名字本身就是解释。",
            "拆完之后主程序变成一张目录：先干这个、再干那个，细节各自收在自己的名字底下。这种写法叫**模块化（modularity）**，好处不是程序变短，而是**每次只需要看一小块**。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "把问题分解成子问题、每个子问题做成一个程序模块（过程 / 函数），是写长程序的标准做法（§11.3）。"
            }
          ]
        },
        {
          kind: "comparison",
          title: "同一份输出，抄三遍还是起个名字",
          intro: "一张报表，三处都要画一条分隔线。",
          panes: [
            {
              label: "自然语言",
              language: "natural",
              code: ["显示标题。", "画一条分隔线。", "显示总计。", "画一条分隔线。", "显示结束语。", "画一条分隔线。"].join("\n"),
              note: "「画一条分隔线」这句话说了三遍，但它是同一件事——说的人不会把那条线的样子重复描述三次。"
            },
            {
              label: "抄三遍",
              language: "pseudocode",
              code: [
                'OUTPUT "Report"',
                'OUTPUT "----------"',
                'OUTPUT "Total: 42"',
                'OUTPUT "----------"',
                'OUTPUT "Done"',
                'OUTPUT "----------"'
              ].join("\n"),
              note: "跑起来完全正确。但线要改长一格，就得找齐三处都改；漏一处，三条线里有一条不一样长。"
            },
            {
              label: "抽成一个过程",
              language: "pseudocode",
              code: [
                "PROCEDURE ShowLine()",
                '   OUTPUT "----------"',
                "ENDPROCEDURE",
                'OUTPUT "Report"',
                "CALL ShowLine()",
                'OUTPUT "Total: 42"',
                "CALL ShowLine()",
                'OUTPUT "Done"',
                "CALL ShowLine()"
              ].join("\n"),
              note: "线长什么样只写在一个地方。要改就改那一处，三条线一起变——而且主程序读起来是「标题、线、总计、线、结束语、线」。"
            },
            {
              label: "Python",
              language: "python",
              code: ["def show_line():", '    print("-" * 10)', "", 'print("Report")', "show_line()"].join("\n"),
              note: "Python 的 `def` 就是同一件事：给一段代码起名字，用的时候写名字。区别只在伪代码调用过程时要写 `CALL`。"
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "下面哪一种情况**最**该抽出一个过程？",
          options: [
            {
              key: "A",
              label: "两段长得很像、但做的事完全不同的代码",
              correct: false,
              explanation: "像不等于是同一件事。硬抽成一个过程，以后其中一边要改，就得加参数、加分支，越缠越乱。"
            },
            {
              key: "B",
              label: "只用了一次、但写起来很长的一段计算",
              correct: false,
              explanation: "只用一次也可以抽——如果抽出来能给它起个说得清的名字。但光是「长」本身不是理由，切开而不解释只是把它挪了个地方。"
            },
            {
              key: "C",
              label: "同一段七行的检查，在程序里三个地方原样出现",
              correct: true,
              explanation: "对。重复出现是最硬的信号：抽出来之后要改只改一处，也不会出现「三处里有一处忘了改」。"
            },
            {
              key: "D",
              label: "一句 `OUTPUT`",
              correct: false,
              explanation: "抽出来之后读代码的人还得跳过去看一眼才知道它显示什么，反而比原地写着更难读。"
            }
          ]
        }
      ]
    },
    {
      id: "12.2",
      title: "`PROCEDURE ... ENDPROCEDURE` 与 `CALL`",
      syllabus: ["§11.3"],
      estimatedMinutes: 11,
      taughtFeatures: AFTER_12_1,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "定义一个过程写在 `PROCEDURE` 和 `ENDPROCEDURE` 之间，名字后面**跟一对括号**——哪怕一个参数都没有，这对括号也不能省。中间的几行照常缩进三格。",
            "定义只是「说清这件事怎么做」，它自己不会发生。要它真的发生，得**调用**它：`CALL ShowLine()`，同样带括号。",
            "`CALL` 这个词不能省。伪代码里**过程只能用 `CALL` 调用**——光写 `ShowLine()` 是不行的。（第 13 章的函数正好相反，那种才不写 `CALL`。）",
            "过程定义放在哪儿都能认，放在调用后面也行；但习惯上把过程写在前面、主程序放在最后，读起来是「先认识这几件工具，再看它们怎么被用」。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "过程写成 `PROCEDURE <名字>()` … `ENDPROCEDURE`，以独立语句 `CALL <名字>()` 调用（G§8.1）。"
            }
          ]
        },
        {
          kind: "example",
          title: "一个没有参数的过程",
          fileName: "Example_12_2_a.pseudocode",
          code: [
            "PROCEDURE ShowLine()",
            '   OUTPUT "----------"',
            "ENDPROCEDURE",
            'OUTPUT "Report"',
            "CALL ShowLine()",
            'OUTPUT "Total: 42"',
            "CALL ShowLine()"
          ].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 3, text: "定义。这三行跑起来什么也不显示——它只是把「画一条线」这件事记下来。" },
            { fromLine: 4, toLine: 7, text: "主程序。真正按顺序执行的是这四行；`CALL` 一出现，就跳进去把过程里的内容做一遍再回来。" },
            { fromLine: 5, toLine: 5, text: "`CALL` 和括号都不能少。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["Report", "----------", "Total: 42", "----------"]
          }
        },
        {
          kind: "counterExample",
          title: "两种少写了东西的写法",
          cases: [
            {
              title: "定义时漏了括号",
              code: ["PROCEDURE Greet", '   OUTPUT "Hello"', "ENDPROCEDURE", "CALL Greet()"].join("\n"),
              note: "没有参数也要写 `()`。括号是过程名字的一部分，不是「有参数才加」的装饰。",
              expectDiagnostics: [
                { severity: "error", ruleId: "PROC-001", line: 1, text: "过程名后面要跟一对括号，没有参数也要写。" }
              ]
            },
            {
              title: "调用时漏了 `CALL`",
              code: ["PROCEDURE Greet()", '   OUTPUT "Hello"', "ENDPROCEDURE", "Greet()"].join("\n"),
              note: "光写名字加括号，在伪代码里不算调用过程。这种写法在别的语言里很常见，所以格外容易带进来。",
              expectDiagnostics: [
                { severity: "error", ruleId: "PROC-001", line: 4, text: "调用过程要写成 `CALL 名字()`。" }
              ]
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "上面那段示例，把两句 `CALL ShowLine()` 都删掉，屏幕上会看到什么？",
          options: [
            {
              key: "A",
              label: "`Report` 和 `Total: 42`，没有线",
              correct: true,
              explanation: "对。`PROCEDURE` 那三行只是定义，不写 `CALL` 就一次都不执行。定义和发生是两回事。"
            },
            {
              key: "B",
              label: "两条线，但没有别的",
              correct: false,
              explanation: "反了。定义里的 `OUTPUT` 不会自己执行，倒是主程序那两句一定会执行。"
            },
            {
              key: "C",
              label: "和原来一样",
              correct: false,
              explanation: "如果一样，那 `CALL` 就没有存在的必要了。过程要被调用才会发生。"
            },
            {
              key: "D",
              label: "编辑器会因为过程没被用到而拦下来",
              correct: false,
              explanation: "定义了不用不是错误。写好一个过程暂时还没调用，是很正常的中间状态。"
            }
          ]
        }
      ]
    },
    {
      id: "12.3",
      title: "参数与实参",
      syllabus: ["§11.3"],
      estimatedMinutes: 11,
      taughtFeatures: AFTER_12_3,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "上面那个 `ShowLine` 每次画的线一样长。要让它每次不一样，得在括号里留个口子把值递进去——这个口子叫**参数（parameter）**，写法和 `DECLARE` 一样：名字、冒号、类型。",
            "调用时括号里真正给进去的那个值叫**实参（argument）**。考纲把这两个词分得很清楚：**参数是定义里的那个名字，实参是调用时的那个值**。",
            "参数在过程体里**就是一个已经有值的变量**，不用再 `DECLARE`；它的值来自这一次调用给的实参。同一个过程被调用两次，参数就先后是两个不同的值。",
            "多个参数用逗号隔开，每个都要写类型。实参的**个数、顺序、类型**三样都要对得上——对不上，编辑器在运行前就拦下来。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "实参的数量、顺序和类型必须与参数一致（G§8.1）。parameter 与 argument 在 CAIE 的术语里是两个词，各指一侧，不能混用（§11.3）。"
            }
          ]
        },
        {
          kind: "example",
          title: "把值递进过程里",
          fileName: "Example_12_3_a.pseudocode",
          code: [
            "PROCEDURE ShowLine(Width : INTEGER)",
            "   DECLARE Bar : STRING",
            '   Bar ← ""',
            "   FOR I ← 1 TO Width",
            '      Bar ← Bar & "-"',
            "   NEXT I",
            "   OUTPUT Bar",
            "ENDPROCEDURE",
            "PROCEDURE ShowRow(Label : STRING, Value : INTEGER)",
            '   OUTPUT Label, ": ", Value',
            "ENDPROCEDURE",
            "CALL ShowLine(6)",
            'CALL ShowRow("Total", 42)',
            "CALL ShowLine(3)"
          ].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 1, text: "`Width` 是参数。它在过程体里当变量用，但不需要 `DECLARE`——括号里这一句已经是声明了。" },
            { fromLine: 9, toLine: 9, text: "两个参数，各写各的类型。逗号隔开。" },
            { fromLine: 12, toLine: 14, text: "`6`、`\"Total\"`、`42`、`3` 都是实参。`ShowLine` 被调用两次，`Width` 先是 6 再是 3。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["------", "Total: 42", "---"]
          }
        },
        {
          kind: "counterExample",
          title: "两种对不上的调用",
          cases: [
            {
              title: "少给了一个实参",
              code: [
                "PROCEDURE ShowRow(Label : STRING, Value : INTEGER)",
                '   OUTPUT Label, ": ", Value',
                "ENDPROCEDURE",
                'CALL ShowRow("Total")'
              ].join("\n"),
              note: "定义里有两个参数，调用只给了一个。`Value` 没有值可用，所以这一条运行前就被拦住。",
              expectDiagnostics: [
                { severity: "error", ruleId: "PROC-002", line: 4, text: "这个过程要两个实参，这里只给了一个。" }
              ]
            },
            {
              title: "顺序弄反了",
              code: [
                "PROCEDURE ShowRow(Label : STRING, Value : INTEGER)",
                '   OUTPUT Label, ": ", Value',
                "ENDPROCEDURE",
                'CALL ShowRow(42, "Total")'
              ].join("\n"),
              note: "个数对了，但第一个参数要 `STRING`、第二个要 `INTEGER`，这里正好反着给。**实参是按位置对上去的，不是按名字。**",
              expectDiagnostics: [
                { severity: "error", ruleId: "PROC-002", line: 4, text: "这个位置上的实参类型和参数对不上。" }
              ]
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "`PROCEDURE ShowRow(Label : STRING, Value : INTEGER)` 里，`Label` 和调用时写的 `\"Total\"` 分别叫什么？",
          options: [
            {
              key: "A",
              label: "`Label` 是变量，`\"Total\"` 是常量",
              correct: false,
              explanation: "`Label` 在过程体里确实当变量用，但这不是它在这里的名称；而 `\"Total\"` 只是一个字面量，不是 `CONSTANT`。"
            },
            {
              key: "B",
              label: "两个都叫参数",
              correct: false,
              explanation: "这两样在 CAIE 的术语里是分开的：定义里的名字是参数，调用时给的值另有名字。两边混着说，就没法指清一句话说的是定义那一侧还是调用那一侧。"
            },
            {
              key: "C",
              label: "`Label` 是实参，`\"Total\"` 是参数",
              correct: false,
              explanation: "说反了。定义里的那个名字是参数，调用时递进去的值才是实参。"
            },
            {
              key: "D",
              label: "`Label` 是参数，`\"Total\"` 是实参",
              correct: true,
              explanation: "对。参数（parameter）是定义里留的口子，实参（argument）是每次调用真正塞进去的值。"
            }
          ]
        },
        {
          kind: "task",
          id: "12.3.1",
          title: "三行小条形图",
          statement: "写一段伪代码：定义一个过程，它接受一个名称和一个个数，显示「名称 + 空格 + 那么多个星号」；主程序读入三组名称和个数，每读一组就调用一次这个过程。",
          ioSpec: {
            input: [
              "六行，一组两行：先名称（`STRING`），再个数（`INTEGER`），三组依次读完。每次读取之前都要显示提示语，一字不差：",
              "名称前是 `Enter a label`，个数前是 `Enter a count`"
            ].join("\n"),
            output: ["每读完一组显示一行：", "`<名称> <那么多个星号>`", "名称和星号之间一个空格。个数是 0 时星号一个都没有，那一行就只剩名称和一个空格。"].join("\n")
          },
          constraints: {
            require: [
              {
                feature: "routine.procedure",
                reason: "同一件事要做三遍，正该把它抽成一个有名字的过程。"
              },
              {
                feature: "routine.call",
                reason: "过程定义了还得调用才会发生，而且调用要写 `CALL`。"
              },
              {
                feature: "param.byval",
                reason: "每一组的名称和个数都不一样，得当参数递进过程里。"
              }
            ]
          },
          hints: [
            "过程要两个参数：一个 `STRING` 的名称，一个 `INTEGER` 的个数。",
            "星号用一个 `STRING` 从空串开始接，循环里每次接一个。",
            "读入放在主程序里，过程只负责显示——这样过程才用得上第二次、第三次。"
          ],
          examples: [
            {
              inputs: ["Mon", "3", "Tue", "5", "Wed", "1"],
              outputs: [
                "Enter a label",
                "Enter a count",
                "Mon ***",
                "Enter a label",
                "Enter a count",
                "Tue *****",
                "Enter a label",
                "Enter a count",
                "Wed *"
              ]
            }
          ],
          referenceSolution: [
            "PROCEDURE ShowBar(Label : STRING, Count : INTEGER)",
            "   DECLARE Bar : STRING",
            '   Bar ← ""',
            "   FOR I ← 1 TO Count",
            '      Bar ← Bar & "*"',
            "   NEXT I",
            '   OUTPUT Label, " ", Bar',
            "ENDPROCEDURE",
            "DECLARE Name : STRING",
            "DECLARE Amount : INTEGER",
            "FOR K ← 1 TO 3",
            '   OUTPUT "Enter a label"',
            "   INPUT Name",
            '   OUTPUT "Enter a count"',
            "   INPUT Amount",
            "   CALL ShowBar(Name, Amount)",
            "NEXT K"
          ].join("\n"),
          tests: [
            { id: "t1", kind: "normal", inputs: ["Red", "2", "Green", "4", "Blue", "6"], caseHint: "三组普通的数据，个数各不相同。" },
            { id: "t2", kind: "boundary", inputs: ["Red", "0", "Green", "1", "Blue", "2"], caseHint: "第一组的个数是零，那一行一个星号都不该有。" },
            { id: "t3", kind: "boundary", inputs: ["A", "1", "B", "1", "C", "1"], caseHint: "三组的个数都只有一个。" },
            { id: "t4", kind: "normal", inputs: ["Two words", "3", "X", "2", "Y", "4"], caseHint: "第一组的名称里带空格，要原样显示出来。" },
            { id: "t5", kind: "extreme", inputs: ["Big", "40", "Small", "0", "Mid", "7"], caseHint: "一组的个数相当大，另一组是零。" }
          ]
        }
      ]
    },
    {
      id: "12.4",
      title: "`BYVAL`：过程改的是副本",
      syllabus: ["§11.3"],
      estimatedMinutes: 9,
      taughtFeatures: AFTER_12_3,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "把一个变量当实参递进过程之后，过程里改了它，外面那个变量会跟着变吗？**默认不会。**递进去的是值的一份**副本**，过程改的是副本，外面的原件一动不动。",
            "这种传递方式叫**传值（by value）**，可以在参数前面写上 `BYVAL` 说明白。**不写的时候默认就是 `BYVAL`**，所以前面几节那些参数其实都是传值的。",
            "默认是传值有它的道理：过程只是拿这个值来算点什么，不该顺手把调用者的变量改掉。**调用一个过程之后，自己的变量还是原样**——这件事能靠得住，程序才好读。",
            "数组和记录也一样：整个数组当实参传进去，过程里改哪一格都影响不到外面。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "`BYVAL` / `BYREF` 写在形参前；未写时默认按值传递（G§8.3）。"
            },
            {
              source: "editor",
              text: "数组和记录这种「一份里装了好几样」的值按传值递进去会复制成什么样，Pseudocode Guide 没有规定。本编辑器的做法是整份复制，所以过程里改哪一格，外面的原件都不受影响。"
            }
          ]
        },
        {
          kind: "example",
          title: "里面变了，外面没变",
          fileName: "Example_12_4_a.pseudocode",
          code: [
            "PROCEDURE Bump(BYVAL N : INTEGER)",
            "   N ← N + 100",
            '   OUTPUT "inside: ", N',
            "ENDPROCEDURE",
            "DECLARE Score : INTEGER",
            "Score ← 5",
            "CALL Bump(Score)",
            'OUTPUT "outside: ", Score'
          ].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 1, text: "`BYVAL` 写不写都一样，这里写出来是为了看清楚。" },
            { fromLine: 2, toLine: 3, text: "过程里 `N` 确实变成了 105——改的是那份副本。" },
            { fromLine: 8, toLine: 8, text: "回到主程序，`Score` 还是 5。过程碰不到它。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["inside: 105", "outside: 5"]
          }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "把上面那段里的 `BYVAL` 三个字母删掉（写成 `PROCEDURE Bump(N : INTEGER)`），结果会变吗？",
          options: [
            {
              key: "A",
              label: "编辑器会要求必须写出 `BYVAL` 或 `BYREF`",
              correct: false,
              explanation: "不要求。两个都不写是合法的写法，只是这时的含义固定为传值。"
            },
            {
              key: "B",
              label: "不变，两种写法完全一样",
              correct: true,
              explanation: "对。不写传递方式时默认就是 `BYVAL`，所以这两种写法的行为一模一样。写出来只是更显眼。"
            },
            {
              key: "C",
              label: "会变成传引用，外面的 `Score` 变成 105",
              correct: false,
              explanation: "传引用要显式写 `BYREF`。默认从来不是传引用——不然「调用一下自己的变量就被改了」会防不胜防。"
            },
            {
              key: "D",
              label: "过程里 `N` 会变成未初始化",
              correct: false,
              explanation: "参数进过程时就带着实参的值，两种写法都一样。它从来不需要另外赋值。"
            }
          ]
        }
      ]
    },
    {
      id: "12.5",
      title: "`BYREF`：过程改的是原件",
      syllabus: ["§11.3"],
      estimatedMinutes: 10,
      taughtFeatures: AFTER_12_5,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "有时候你就是要过程去改调用者的变量——最典型的是「把两个变量的值对调」。这时在参数前面写 `BYREF`：递进去的不再是副本，而是**那个变量本身**，过程里改它就是改外面的原件。",
            "这种传递方式叫**传引用（by reference）**。Pseudocode Guide 给的样板正是 `SWAP`：第 10 章那三句借临时变量的交换，抽成过程之后就能对任意两个变量用。",
            "有一条容易漏的规则：**连着的几个参数传递方式相同时，关键字不用重复写**。`(BYREF X : INTEGER, Y : INTEGER)` 里 `Y` **也是** `BYREF`，不是默认的传值。",
            "`BYREF` 的实参必须是个**能被改的东西**——变量、数组的一格、记录的一个字段都行，但写个字面量不行：`CALL Swap(1, 2)` 没有意义，`1` 没有地方可以被改。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "`BYREF` 写在形参前；连续相同传递方式的参数可以省略重复的关键字（G§8.3）。"
            }
          ]
        },
        {
          kind: "example",
          title: "把两个变量对调",
          fileName: "Example_12_5_a.pseudocode",
          code: [
            "PROCEDURE Swap(BYREF A : INTEGER, BYREF B : INTEGER)",
            "   DECLARE Temp : INTEGER",
            "   Temp ← A",
            "   A ← B",
            "   B ← Temp",
            "ENDPROCEDURE",
            "DECLARE P : INTEGER",
            "DECLARE Q : INTEGER",
            "P ← 1",
            "Q ← 2",
            'OUTPUT "before: ", P, " ", Q',
            "CALL Swap(P, Q)",
            'OUTPUT "after: ", P, " ", Q'
          ].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 1, text: "两个都写了 `BYREF`。只写在第一个前面也是同样的意思——第二个会跟着第一个。" },
            { fromLine: 2, toLine: 5, text: "和第 10 章那三句交换一模一样，只是现在它有了名字，对哪两个变量都能用。" },
            { fromLine: 12, toLine: 13, text: "调用之后主程序里的 `P` 和 `Q` 真的换了。这正是 `BYVAL` 做不到的事。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["before: 1 2", "after: 2 1"]
          }
        },
        {
          kind: "counterExample",
          title: "`BYREF` 收不下一个字面量",
          cases: [
            {
              code: ["PROCEDURE Bump(BYREF N : INTEGER)", "   N ← N + 1", "ENDPROCEDURE", "CALL Bump(5)"].join("\n"),
              note: "`BYREF` 的意思是「过程会去改你给的这个东西」。给一个 `5` 就没法往下说了——`5` 不是一个能被改的位置。换成一个变量就行。",
              expectDiagnostics: [
                { severity: "error", ruleId: "PARAM-001", line: 4, text: "`BYREF` 的实参得是一个能被改的变量，不能是写死的值。" }
              ]
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "`PROCEDURE Swap(BYREF A : INTEGER, B : INTEGER)`——只在第一个参数前写了 `BYREF`。`B` 是怎么传的？",
          options: [
            {
              key: "A",
              label: "要看调用时给的是变量还是字面量",
              correct: false,
              explanation: "传递方式在定义里就定死了，和调用时给什么无关；反过来是定义里的 `BYREF` 要求调用时必须给一个能改的东西。"
            },
            {
              key: "B",
              label: "也是传引用",
              correct: true,
              explanation: "对。连着的参数传递方式相同时关键字不用重复写，所以 `B` 跟着 `A` 一起是 `BYREF`。这段 `Swap` 照样能用。"
            },
            {
              key: "C",
              label: "传值，因为它前面没写 `BYREF`",
              correct: false,
              explanation: "「没写就默认传值」只在**前面也没有别的传递方式关键字**时成立。这里 `BYREF` 已经写在同一串参数的前面了。"
            },
            {
              key: "D",
              label: "写法不合法，每个参数都必须写",
              correct: false,
              explanation: "合法。Pseudocode Guide 自己的 `SWAP` 样板就是这么写的。"
            }
          ]
        },
        {
          kind: "task",
          id: "12.5.1",
          title: "小的排前面",
          statement: "写一段伪代码：定义一个过程，它接受两个整数变量，如果前一个比后一个大就把它们对调；主程序读入两个数，调用这个过程，再把它们显示出来。",
          ioSpec: {
            input: ["两行，各一个 `INTEGER`。每次读取之前都要显示提示语，一字不差：", "`Enter a number`"].join("\n"),
            output: ["一行，两个数中间一个空格，小的在前：", "`<小的> <大的>`"].join("\n")
          },
          constraints: {
            require: [
              {
                feature: "param.byref",
                reason: "过程要真的改掉主程序里那两个变量，传副本改不着。"
              },
              {
                feature: "routine.procedure",
                reason: "题目要求把「必要时对调」这件事写成一个有名字的过程。"
              },
              {
                feature: "select.if",
                reason: "已经是小的在前时不该动，只有前一个更大才交换。"
              }
            ]
          },
          hints: [
            "两个参数都要 `BYREF`——只写在第一个前面也算数。",
            "交换还是那三句，借一个临时变量；这个临时变量在过程里 `DECLARE` 就行。",
            "显示放在主程序里，过程只管调整顺序。"
          ],
          examples: [
            {
              inputs: ["9", "4"],
              outputs: ["Enter a number", "Enter a number", "4 9"]
            }
          ],
          referenceSolution: [
            "PROCEDURE SortTwo(BYREF A : INTEGER, BYREF B : INTEGER)",
            "   DECLARE Temp : INTEGER",
            "   IF A > B THEN",
            "      Temp ← A",
            "      A ← B",
            "      B ← Temp",
            "   ENDIF",
            "ENDPROCEDURE",
            "DECLARE X : INTEGER",
            "DECLARE Y : INTEGER",
            'OUTPUT "Enter a number"',
            "INPUT X",
            'OUTPUT "Enter a number"',
            "INPUT Y",
            "CALL SortTwo(X, Y)",
            'OUTPUT X, " ", Y'
          ].join("\n"),
          tests: [
            { id: "t1", kind: "normal", inputs: ["8", "3"], caseHint: "前一个比后一个大，需要对调。" },
            { id: "t2", kind: "normal", inputs: ["3", "8"], caseHint: "本来就是小的在前，不该动它。" },
            { id: "t3", kind: "boundary", inputs: ["7", "7"], caseHint: "两个数一样大。" },
            { id: "t4", kind: "boundary", inputs: ["0", "-1"], caseHint: "一个是零，另一个是负数。" },
            { id: "t5", kind: "extreme", inputs: ["99999", "-99999"], caseHint: "一个极大一个极小，而且顺序是反的。" }
          ]
        }
      ]
    },
    {
      id: "12.6",
      title: "局部变量与作用域",
      syllabus: ["§11.3"],
      estimatedMinutes: 9,
      taughtFeatures: AFTER_12_5,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "在过程里 `DECLARE` 出来的变量叫**局部变量（local variable）**：它只在这个过程里存在，过程一结束就没了，外面看不见也用不了。一个名字能在哪些地方用，这件事叫它的**作用域（scope）**。",
            "局部变量正是过程能独立成一件事的原因。`Swap` 里那个 `Temp` 只属于 `Swap`；别的过程里也叫 `Temp` 没关系，它们互不相干——就像第 11 章里记录的字段名和普通变量名互不相干一样。",
            "在所有过程外面 `DECLARE` 的变量叫**全局变量（global variable）**，过程里能读也能写。但**能改不等于该改**：过程偷偷改全局变量，调用它的人从调用那一行看不出来。要改就把它当 `BYREF` 参数明写在括号里。",
            "如果过程里 `DECLARE` 了一个和全局变量同名的变量，那过程里用的就是自己那个，外面那个不受影响——名字一样，是两个不同的位置。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "局部变量只在它所属的过程或函数里有效，全局变量在整段程序里都有效；一个名字在哪一段代码里算数，就是它的作用域（§11.3）。"
            }
          ]
        },
        {
          kind: "example",
          title: "同名，但是两个不同的位置",
          fileName: "Example_12_6_a.pseudocode",
          code: [
            "DECLARE Total : INTEGER",
            "PROCEDURE Report()",
            "   DECLARE Total : INTEGER",
            "   Total ← 100",
            '   OUTPUT "inside: ", Total',
            "ENDPROCEDURE",
            "Total ← 7",
            "CALL Report()",
            'OUTPUT "outside: ", Total'
          ].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 1, text: "全局变量，主程序和所有过程都看得到。" },
            { fromLine: 3, toLine: 4, text: "过程里又声明了一个同名的。从这一行起，过程内部的 `Total` 指的都是这个局部的。" },
            { fromLine: 9, toLine: 9, text: "过程结束、局部的那个消失，主程序里的 `Total` 仍然是 7。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["inside: 100", "outside: 7"]
          }
        },
        {
          kind: "counterExample",
          title: "在外面用过程里的变量",
          cases: [
            {
              code: [
                "PROCEDURE Report()",
                "   DECLARE Count : INTEGER",
                "   Count ← 3",
                "ENDPROCEDURE",
                "CALL Report()",
                "OUTPUT Count"
              ].join("\n"),
              note: "`Count` 是 `Report` 的局部变量，过程一结束就不存在了。主程序这一行找不到这个名字——**不是它的值不对，是这个名字在这里根本没有意义**。",
              expectDiagnostics: [
                { severity: "error", ruleId: "DECL-002", line: 6, text: "这个名字是在过程里声明的，主程序看不到它。" }
              ]
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "一个过程需要把算出来的结果交回给主程序。下面哪种做法**最**合适？",
          options: [
            {
              key: "A",
              label: "在过程里 `OUTPUT` 出来",
              correct: false,
              explanation: "那是显示给人看，不是交回给程序。主程序拿不到这个值，没法接着拿它去算。"
            },
            {
              key: "B",
              label: "在过程里直接改一个全局变量",
              correct: false,
              explanation: "做得到，但调用那一行看不出它会改什么，读代码的人得翻进过程里才知道。能用参数说清的事不该藏起来。"
            },
            {
              key: "C",
              label: "把结果写成过程里的局部变量，主程序去读它",
              correct: false,
              explanation: "读不到。局部变量随过程一起消失，这个名字在主程序里没有意义。"
            },
            {
              key: "D",
              label: "把用来装结果的变量当 `BYREF` 参数传进去",
              correct: true,
              explanation: "对。调用那一行就写着「这个变量会被它改」，看一眼调用就知道影响到谁。（下一章的函数还有更直接的办法。）"
            }
          ]
        }
      ]
    }
  ],
  chapterTasks: [
    {
      kind: "chapterTask",
      id: "12.T1",
      title: "三个数排好序",
      statement: "写一段伪代码：用过程把三个整数从小到大排好再显示出来。至少写出三个过程——一个负责读一个数，一个负责把两个变量按大小摆正，一个负责把三个数显示出来。主程序只负责按顺序调用它们。",
      ioSpec: {
        input: ["三行，各一个 `INTEGER`。每次读取之前都要显示提示语，一字不差：", "`Enter a number`"].join("\n"),
        output: "三行，每行一个整数，从小到大。"
      },
      suggestedFeatures: [
        "routine.procedure",
        "routine.call",
        "param.byref",
        "param.byval",
        "select.if",
        "io.input",
        "io.output"
      ],
      hints: [
        "「读一个数」和「摆正两个变量」都要改调用者的变量，所以走 `BYREF`；「显示三个数」只是拿来看，`BYVAL` 就够。",
        "三个数排序不用新写算法：把「摆正两个」调用三次就行——先第一二个，再第二三个，最后再第一二个。",
        "主程序应该只剩下几行 `DECLARE` 和一串 `CALL`。"
      ],
      examples: [
        {
          inputs: ["7", "4", "9"],
          outputs: ["Enter a number", "Enter a number", "Enter a number", "4", "7", "9"]
        }
      ],
      referenceSolution: [
        "PROCEDURE ReadNumber(BYREF N : INTEGER)",
        '   OUTPUT "Enter a number"',
        "   INPUT N",
        "ENDPROCEDURE",
        "PROCEDURE SortTwo(BYREF A : INTEGER, BYREF B : INTEGER)",
        "   DECLARE Temp : INTEGER",
        "   IF A > B THEN",
        "      Temp ← A",
        "      A ← B",
        "      B ← Temp",
        "   ENDIF",
        "ENDPROCEDURE",
        "PROCEDURE ShowThree(A : INTEGER, B : INTEGER, C : INTEGER)",
        "   OUTPUT A",
        "   OUTPUT B",
        "   OUTPUT C",
        "ENDPROCEDURE",
        "DECLARE X : INTEGER",
        "DECLARE Y : INTEGER",
        "DECLARE Z : INTEGER",
        "CALL ReadNumber(X)",
        "CALL ReadNumber(Y)",
        "CALL ReadNumber(Z)",
        "CALL SortTwo(X, Y)",
        "CALL SortTwo(Y, Z)",
        "CALL SortTwo(X, Y)",
        "CALL ShowThree(X, Y, Z)"
      ].join("\n"),
      tests: [
        { id: "t1", kind: "normal", inputs: ["5", "1", "3"], caseHint: "三个各不相同的数，顺序是乱的。" },
        { id: "t2", kind: "boundary", inputs: ["1", "2", "3"], caseHint: "读进来的时候本来就已经排好了。" },
        { id: "t3", kind: "boundary", inputs: ["3", "2", "1"], caseHint: "读进来的时候正好完全倒过来。" },
        { id: "t4", kind: "normal", inputs: ["6", "6", "6"], caseHint: "三个数完全一样，一次也不需要对调。" },
        { id: "t5", kind: "extreme", inputs: ["99999", "-99999", "0"], caseHint: "混着极大和极小的值。" }
      ]
    }
  ]
};
