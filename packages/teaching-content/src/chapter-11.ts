import type { Chapter } from "./types.js";
import type { FeatureId } from "@caie-pseudocode/exercise";

/** Chapter 10 结束时学生已经会的写法。Chapter 10 不引入新特征，所以这份清单和 Chapter 9 末尾相同。 */
const AFTER_CHAPTER_10: FeatureId[] = [
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
  "decl.array-1d", "array.index", "decl.array-2d", "array.index-2d"
];

/** 记录在 11.1 就放开：这一节的并排对照里已经要拿它和一堆平行变量比。 */
const AFTER_11_1: FeatureId[] = [...AFTER_CHAPTER_10, "decl.record-type", "record.field-access"];

export const chapter11: Chapter = {
  id: 11,
  title: "记录",
  level: "AS",
  syllabus: ["§10.1"],
  prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  sections: [
    {
      id: "11.1",
      title: "为什么需要记录",
      syllabus: ["§10.1"],
      estimatedMinutes: 9,
      taughtFeatures: AFTER_11_1,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "数组解决的是「同一种东西有很多个」：一排成绩、一排气温。可现实里的一份数据往往是**几样不同的东西凑成的一份**——一个学生有姓名、年级和平均分，一本书有书名、出版年和价格。类型都不一样，数组装不下。",
            "只用变量也能装：`StudentName`、`StudentYear`、`StudentMark` 各来一个。能跑，但这三个名字之间**没有任何关系**——它们属于同一个人这件事只写在前缀里，也就是只写在你心里。传给别人、存进数组、排个序，这层关系随时会散掉。",
            "**记录（record）**就是把这几样绑成一份：先定义一种新的类型，说清这份数据由哪几样组成，然后就能像用 `INTEGER` 一样用它声明变量。组成它的每一样叫一个**字段（field）**。",
            "绑成一份之后，「一个学生」才第一次成为程序里的**一个值**——可以整份赋给另一个变量，可以整份放进数组的一格。下面几节就是这件事的写法。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "记录把若干项数据绑在一个标识符下，各字段可以是不同的数据类型；用 `TYPE … ENDTYPE` 定义（§10.1）。"
            }
          ]
        },
        {
          kind: "comparison",
          title: "同一份数据，三种装法",
          intro: "一个学生的姓名、年级和平均分。三栏说的是同一件事，差别只在「它们是不是一份」。",
          panes: [
            {
              label: "自然语言",
              language: "natural",
              code: [
                "一个学生由三样东西组成：",
                "  姓名（一串文字）",
                "  年级（一个整数）",
                "  平均分（一个小数）",
                "记下 Ada，12 年级，78.5 分。"
              ].join("\n"),
              note: "「由三样东西组成」是一句完整的话，说的是这三样属于同一个人。下面两栏的差别就在于这句话有没有被写进程序里。"
            },
            {
              label: "三个各管各的变量",
              language: "pseudocode",
              code: [
                "DECLARE StudentName : STRING",
                "DECLARE StudentYear : INTEGER",
                "DECLARE StudentMark : REAL",
                'StudentName ← "Ada"',
                "StudentYear ← 12",
                "StudentMark ← 78.5"
              ].join("\n"),
              note: "三个独立的变量。它们属于同一个人这件事只体现在共同的前缀上——程序本身并不知道，所以也帮不上任何忙。"
            },
            {
              label: "一条记录",
              language: "pseudocode",
              code: [
                "TYPE TStudent",
                "   DECLARE Name : STRING",
                "   DECLARE Year : INTEGER",
                "   DECLARE Mark : REAL",
                "ENDTYPE",
                "DECLARE One : TStudent",
                'One.Name ← "Ada"',
                "One.Year ← 12",
                "One.Mark ← 78.5"
              ].join("\n"),
              note: "先说清「学生」是什么，再用它声明变量。`One` 是一个值，不是三个；要多记一个人，再声明一个就行。"
            },
            {
              label: "Python",
              language: "python",
              code: ['one = {"name": "Ada", "year": 12, "mark": 78.5}', 'print(one["name"])'].join("\n"),
              note: "Python 把三样装进一个字典，取的时候用键名。形状和记录一样，只是它不必事先说清有哪几样。"
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "下面哪一批数据**适合**放进一条记录？",
          options: [
            {
              key: "A",
              label: "一句要显示给用户的提示语",
              correct: false,
              explanation: "这只是一个值，一个 `STRING` 变量就够，没有几样东西需要绑在一起。"
            },
            {
              key: "B",
              label: "5 个班各 4 个小组的人数",
              correct: false,
              explanation: "全是人数，类型相同，要指准一个数得说清「第几班第几组」——这是二维数组。"
            },
            {
              key: "C",
              label: "一件商品的编号、名称和单价",
              correct: true,
              explanation: "对。三样东西类型各不相同，却描述的是同一件商品——正是记录要绑的那种一份数据。"
            },
            {
              key: "D",
              label: "一个班 30 个学生的总分",
              correct: false,
              explanation: "三十个同类型的数，一个编号就指得准。这是数组的活，不是记录的。"
            }
          ]
        }
      ]
    },
    {
      id: "11.2",
      title: "`TYPE ... ENDTYPE`：先定义，再使用",
      syllabus: ["§10.1"],
      estimatedMinutes: 10,
      taughtFeatures: AFTER_11_1,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "定义一种记录类型写在 `TYPE` 和 `ENDTYPE` 之间：`TYPE TBook` 起头，中间一行一个字段，`ENDTYPE` 收尾。**字段照样用 `DECLARE` 写**，和声明普通变量的格式一模一样——名字、冒号、类型。",
            "`TYPE ... ENDTYPE` 本身**不产生任何存放数据的地方**。它只是给编辑器一句说明：「以后要是有人说 `TBook`，指的是由书名、出版年、价格三样组成的东西。」真正的地方要等 `DECLARE Current : TBook` 才有。",
            "定义好以后，这个名字就能当类型名用，和 `INTEGER`、`STRING` 站在同一个位置。这也是为什么类型名值得起得一眼能认出来——正式发布的伪代码范例常常给它加个 `T` 开头，本课程跟随这个写法。",
            "字段的类型可以各不相同，这正是记录存在的理由；也可以有多个字段是同一种类型，没人拦着。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "记录类型写成 `TYPE <名字>`、若干行 `DECLARE <字段> : <类型>`、`ENDTYPE`（G§4）。"
            },
            {
              source: "convention",
              text: "Guide 没有规定类型名的写法。给记录类型名加 `T` 开头是范例里常见的做法，本课程统一采用。"
            }
          ]
        },
        {
          kind: "example",
          title: "定义一种类型，再用它声明一个变量",
          fileName: "Example_11_2_a.pseudocode",
          code: [
            "TYPE TBook",
            "   DECLARE Title : STRING",
            "   DECLARE Year : INTEGER",
            "   DECLARE Price : REAL",
            "ENDTYPE",
            "DECLARE Current : TBook",
            'Current.Title ← "Algorithms"',
            "Current.Year ← 2020",
            "Current.Price ← 39.5",
            "OUTPUT Current.Title",
            "OUTPUT Current.Year",
            "OUTPUT Current.Price"
          ].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 5, text: "这五行只是一句说明，跑起来什么也不做，连一个放数据的地方都没建。" },
            { fromLine: 2, toLine: 4, text: "三个字段三种类型。写法和普通的 `DECLARE` 完全一样，只是位置在 `TYPE` 里面。" },
            { fromLine: 6, toLine: 6, text: "到这一行才真正有了一个变量。`TBook` 站的正是 `INTEGER` 平时站的位置。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["Algorithms", "2020", "39.5"]
          }
        },
        {
          kind: "counterExample",
          title: "两种写不成类型的写法",
          cases: [
            {
              title: "忘了 `ENDTYPE`",
              code: ["TYPE TBook", "   DECLARE Title : STRING", "DECLARE Current : TBook"].join("\n"),
              note: "没有 `ENDTYPE`，编辑器就不知道这个类型到哪儿算完，下面那行 `DECLARE` 会被当成又一个字段。提示指回 `TYPE` 那一行——缺的是这一对里的另一半。",
              expectDiagnostics: [
                { severity: "error", ruleId: "UDT-003", line: 1, text: "`TYPE` 起了头就要有 `ENDTYPE` 收尾，提示停在起头那一行。" }
              ]
            },
            {
              title: "字段没写 `DECLARE`",
              code: ["TYPE TBook", "   Title : STRING", "ENDTYPE", "DECLARE Current : TBook"].join("\n"),
              note: "字段不能省掉 `DECLARE`。这里的写法看着像别的语言里的类型标注，但在伪代码里，`TYPE` 里的每一行都是一句完整的声明。",
              expectDiagnostics: [
                { severity: "error", ruleId: "UDT-003", line: 2, text: "字段也要写成 `DECLARE 名字 : 类型`。" }
              ]
            }
          ]
        },
        {
          kind: "quiz",
          type: "fill-blank",
          prompt: "补全这段定义：一种叫 `TPoint` 的记录，有两个 `INTEGER` 字段 `X` 和 `Y`。",
          template: ["__1__ TPoint", "   __2__ X : INTEGER", "   __2__ Y : INTEGER", "__3__"].join("\n"),
          blanks: [
            { index: 1, answer: "TYPE" },
            { index: 2, answer: "DECLARE" },
            { index: 3, answer: "ENDTYPE" }
          ],
          bank: [
            { word: "TYPE", explanation: "起头的关键字，后面跟这种类型的名字。" },
            { word: "DECLARE", explanation: "每一个字段都是一句声明，写法和声明普通变量一样。" },
            { word: "ENDTYPE", explanation: "收尾的关键字，少了它编辑器不知道类型到哪儿算完。" },
            { word: "ENDDECLARE", explanation: "伪代码里没有这个关键字。收尾要和起头配对，起头是 `TYPE`。" },
            { word: "RECORD", explanation: "「记录」是这种类型的叫法，不是关键字。伪代码里起头用的是 `TYPE`。" }
          ]
        }
      ]
    },
    {
      id: "11.3",
      title: "用点号读写字段",
      syllabus: ["§10.1"],
      estimatedMinutes: 11,
      taughtFeatures: AFTER_11_1,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "指一个字段的写法是**变量名、一个点、字段名**：`Current.Title`。点号左边必须是一个记录变量，右边必须是这种类型里真有的字段名——写了个不存在的名字，编辑器在运行前就拦下来。",
            "`Current.Title` 整体就当一个普通变量用：能赋值、能出现在表达式里、能 `INPUT` 进去、能 `OUTPUT` 出来。它是什么类型，看的是定义里那一行写的类型。",
            "字段名**只在它所属的类型里有意义**。`TBook` 里有个字段叫 `Year`，程序里另外声明一个变量也叫 `Year`，两者互不相干——一个要写成 `Current.Year` 才指得到，另一个直接写 `Year`。",
            "声明一个记录变量，只是把几个空位一起摆出来，**每个字段各自还是没有值**。哪个字段没赋值就去读哪个，程序照样会在那一行停下来——和忘了给普通变量赋值是同一回事。"
          ]
        },
        {
          kind: "example",
          title: "同名的字段和变量互不相干",
          fileName: "Example_11_3_a.pseudocode",
          code: [
            "TYPE TBook",
            "   DECLARE Title : STRING",
            "   DECLARE Year : INTEGER",
            "ENDTYPE",
            "DECLARE Year : INTEGER",
            "DECLARE Current : TBook",
            "Year ← 2026",
            'OUTPUT "Enter a title"',
            "INPUT Current.Title",
            "Current.Year ← 2020",
            'OUTPUT Current.Title, " is ", Year - Current.Year, " years old"'
          ].join("\n"),
          annotations: [
            { fromLine: 3, toLine: 5, text: "两个 `Year`：一个是 `TBook` 的字段，一个是独立的变量。它们不冲突，因为指到它们的写法不一样。" },
            { fromLine: 9, toLine: 9, text: "`INPUT` 可以直接读进一个字段，不用先读进临时变量再搬。" },
            { fromLine: 11, toLine: 11, text: "一句里两个 `Year` 都出现了：不带点的是今年，带点的是这本书的出版年。" }
          ],
          sampleRun: {
            inputs: ["Algorithms"],
            outputs: ["Enter a title", "Algorithms is 6 years old"]
          }
        },
        {
          kind: "counterExample",
          title: "两种用不了的字段",
          cases: [
            {
              title: "这个类型里没有这个字段",
              code: ["TYPE TBook", "   DECLARE Title : STRING", "ENDTYPE", "DECLARE Current : TBook", 'Current.Name ← "Algorithms"'].join("\n"),
              note: "`TBook` 里只有 `Title`，没有 `Name`。有哪些字段在定义里写得清清楚楚，所以这一条运行前就能查出来。",
              expectDiagnostics: [
                { severity: "error", ruleId: "UDT-005", line: 5, text: "这个类型里没有叫这个名字的字段。" }
              ]
            },
            {
              title: "字段还没赋值就去读",
              code: [
                "TYPE TBook",
                "   DECLARE Title : STRING",
                "   DECLARE Year : INTEGER",
                "ENDTYPE",
                "DECLARE Current : TBook",
                'Current.Title ← "Algorithms"',
                "OUTPUT Current.Year"
              ].join("\n"),
              note: "`Title` 给了值，`Year` 没给。声明记录只是把空位摆出来，一个字段一个字段地填才算数。",
              expectRuntimeError: {
                code: "RT1003",
                line: 7,
                text: "这个字段还没有值，程序停在读它的那一行。"
              }
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "`TBook` 里有字段 `Year`，程序里另外还声明了一个变量 `Year`。写 `Year ← 2026` 改的是哪一个？",
          options: [
            {
              key: "A",
              label: "两个一起改",
              correct: false,
              explanation: "它们是两个各自独立的存放位置，一句赋值只能改一个。"
            },
            {
              key: "B",
              label: "编辑器会因为重名报错",
              correct: false,
              explanation: "不重名。字段名只在它所属的类型里有意义，不占用程序里普通变量的名字。"
            },
            {
              key: "C",
              label: "那个独立的变量",
              correct: true,
              explanation: "对。不带点号就是那个独立的变量。要改记录里的那个，必须写成 `Current.Year`——点号左边指明了是谁的。"
            },
            {
              key: "D",
              label: "记录里的那个字段",
              correct: false,
              explanation: "指不到。字段永远要经由某个记录变量才指得到，单写字段名不行。"
            }
          ]
        },
        {
          kind: "task",
          id: "11.3.1",
          title: "一个学生的两科成绩",
          statement: "写一段伪代码：定义一种记录类型，一个学生有姓名和两科成绩；读入一个学生的这三样，然后显示他的姓名和两科总分。",
          ioSpec: {
            input: [
              "三行：第一行是姓名（`STRING`），后两行各是一科成绩（`INTEGER`）。每次读取之前都要显示提示语，一字不差：",
              "`Enter a name`、`Enter the first mark`、`Enter the second mark`"
            ].join("\n"),
            output: ["一行，写成：", "`<姓名>: <两科总分>`", "冒号后面是一个空格。"].join("\n")
          },
          constraints: {
            require: [
              {
                feature: "decl.record-type",
                reason: "姓名和两科成绩是同一个人的三样东西，题目要求把它们绑成一份。"
              },
              {
                feature: "record.field-access",
                reason: "绑成一份之后，读写其中任何一样都要经由点号。"
              }
            ]
          },
          hints: [
            "先把 `TYPE ... ENDTYPE` 写完，再 `DECLARE` 一个这种类型的变量。",
            "`INPUT` 可以直接读进字段，不必先读进普通变量再搬过去。",
            "总分不用专门声明一个变量存，直接在 `OUTPUT` 里把两个字段加起来就行。"
          ],
          examples: [
            {
              inputs: ["Ada", "40", "55"],
              outputs: ["Enter a name", "Enter the first mark", "Enter the second mark", "Ada: 95"]
            }
          ],
          referenceSolution: [
            "TYPE TStudent",
            "   DECLARE Name : STRING",
            "   DECLARE First : INTEGER",
            "   DECLARE Second : INTEGER",
            "ENDTYPE",
            "DECLARE One : TStudent",
            'OUTPUT "Enter a name"',
            "INPUT One.Name",
            'OUTPUT "Enter the first mark"',
            "INPUT One.First",
            'OUTPUT "Enter the second mark"',
            "INPUT One.Second",
            'OUTPUT One.Name, ": ", One.First + One.Second'
          ].join("\n"),
          tests: [
            { id: "t1", kind: "normal", inputs: ["Bob", "62", "71"], caseHint: "普通的一个人，两科成绩不一样。" },
            { id: "t2", kind: "boundary", inputs: ["Cal", "0", "0"], caseHint: "两科都是零分。" },
            { id: "t3", kind: "boundary", inputs: ["Dee", "100", "100"], caseHint: "两科都是满分。" },
            { id: "t4", kind: "normal", inputs: ["Eve Marie", "48", "52"], caseHint: "姓名里带空格，显示的时候要原样写出来。" },
            { id: "t5", kind: "extreme", inputs: ["Fay", "-99999", "99999"], caseHint: "一科极小一科极大，加起来正好抵消。" }
          ]
        }
      ]
    },
    {
      id: "11.4",
      title: "记录数组",
      syllabus: ["§10.1"],
      estimatedMinutes: 11,
      taughtFeatures: AFTER_11_1,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "一条记录装一个人，一个班要装三十个。数组要求每一格装同一种东西——记录类型正好也是一种类型，所以 `ARRAY[1:30] OF TStudent` 是合法的，而且是这门课里最常用的组合。",
            "指到某个人的某一样，两步连着写：`Form[2].Name`——先用下标挑出第 2 格，再用点号挑出那一格里的 `Name`。顺序是固定的，下标在前、点号在后。",
            "有了这个组合，前几章学的东西全都用得上：`FOR` 遍历整个数组，`IF` 挑出符合条件的人，第 10 章的冒泡排序甚至可以**整条记录一起交换**——临时变量的类型写成那种记录类型就行。",
            "一格一格填的时候不用先给整格赋一个完整的记录，直接写 `Form[1].Name ← ...` 就可以：每一格天生就是一条各字段都还空着的记录。"
          ],
          callouts: [
            {
              source: "editor",
              text: "数组的一格或记录的一个字段本身是记录时，这一格在第一次用到就已经是一条空记录，可以直接往里面的字段赋值；里面的基本类型字段仍然要各自赋过值才能读。"
            }
          ]
        },
        {
          kind: "example",
          title: "一个班的成绩",
          fileName: "Example_11_4_a.pseudocode",
          code: [
            "TYPE TStudent",
            "   DECLARE Name : STRING",
            "   DECLARE Mark : INTEGER",
            "ENDTYPE",
            "DECLARE Form : ARRAY[1:3] OF TStudent",
            'Form[1].Name ← "Ada"',
            "Form[1].Mark ← 80",
            'Form[2].Name ← "Bob"',
            "Form[2].Mark ← 55",
            'Form[3].Name ← "Cal"',
            "Form[3].Mark ← 91",
            "FOR I ← 1 TO 3",
            "   IF Form[I].Mark >= 60 THEN",
            '      OUTPUT Form[I].Name, " passed"',
            "   ENDIF",
            "NEXT I"
          ].join("\n"),
          annotations: [
            { fromLine: 5, toLine: 5, text: "三格，每格一条 `TStudent`。方括号里的写法和一维数组完全一样，变的只是 `OF` 后面。" },
            { fromLine: 6, toLine: 11, text: "下标在前、点号在后。六行填满三个人的两个字段。" },
            { fromLine: 12, toLine: 16, text: "遍历和判断都是老写法，只是取值的时候多了一截 `.Mark`。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["Ada passed", "Cal passed"]
          }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "`DECLARE Form : ARRAY[1:30] OF TStudent` 之后，要取第 7 个人的 `Mark`，该怎么写？",
          options: [
            {
              key: "A",
              label: "`Form[7].Mark`",
              correct: true,
              explanation: "对。先用下标挑出那一格，再用点号挑出那一格里的字段，顺序是固定的。"
            },
            {
              key: "B",
              label: "`Form.Mark[7]`",
              correct: false,
              explanation: "反了。`Form` 是数组不是记录，点号得先有一条记录才用得上；而 `Mark` 是一个整数，不是一排数。"
            },
            {
              key: "C",
              label: "`Form[7, Mark]`",
              correct: false,
              explanation: "逗号分隔的两个下标是二维数组的写法。这里第二步挑的是字段名，不是另一个方向的编号。"
            },
            {
              key: "D",
              label: "`TStudent[7].Mark`",
              correct: false,
              explanation: "`TStudent` 是类型名，不是存放数据的地方。要取值得从那个真正声明出来的变量 `Form` 开始。"
            }
          ]
        },
        {
          kind: "task",
          id: "11.4.1",
          title: "分数最高的人",
          statement: "写一段伪代码：读入 4 个学生的姓名和成绩，存进一个记录数组，然后显示分数最高的那个人的姓名和分数。保证最高分只有一个人。",
          ioSpec: {
            input: [
              "八行，一个人两行：先姓名（`STRING`），再成绩（`INTEGER`），四个人依次读完。每次读取之前都要显示提示语，一字不差：",
              "姓名前是 `Enter a name`，成绩前是 `Enter a mark`"
            ].join("\n"),
            output: ["一行，写成：", "`Top: <姓名> <分数>`", "冒号后面和姓名后面各一个空格。"].join("\n")
          },
          constraints: {
            require: [
              {
                feature: "decl.record-type",
                reason: "姓名和成绩属于同一个人，必须绑成一份才不会在排序和比较时散掉。"
              },
              {
                feature: "decl.array-1d",
                reason: "四个人要一起存下来，一人一格。"
              },
              {
                feature: "record.field-access",
                reason: "比较用的是成绩，显示用的是姓名，都要经由点号取出来。"
              }
            ]
          },
          hints: [
            "先把读入的循环写完，再开始找最大——两件事不要混在一个循环里。",
            "记住「目前最高的是第几格」，比记住分数本身更好用：姓名和分数都能从那一格取到。",
            "把第 1 格当成起点，从第 2 格开始比就够了。"
          ],
          examples: [
            {
              inputs: ["Ada", "80", "Bob", "55", "Cal", "91", "Dee", "70"],
              outputs: [
                "Enter a name",
                "Enter a mark",
                "Enter a name",
                "Enter a mark",
                "Enter a name",
                "Enter a mark",
                "Enter a name",
                "Enter a mark",
                "Top: Cal 91"
              ]
            }
          ],
          referenceSolution: [
            "TYPE TStudent",
            "   DECLARE Name : STRING",
            "   DECLARE Mark : INTEGER",
            "ENDTYPE",
            "DECLARE Form : ARRAY[1:4] OF TStudent",
            "DECLARE Best : INTEGER",
            "FOR I ← 1 TO 4",
            '   OUTPUT "Enter a name"',
            "   INPUT Form[I].Name",
            '   OUTPUT "Enter a mark"',
            "   INPUT Form[I].Mark",
            "NEXT I",
            "Best ← 1",
            "FOR I ← 2 TO 4",
            "   IF Form[I].Mark > Form[Best].Mark THEN",
            "      Best ← I",
            "   ENDIF",
            "NEXT I",
            'OUTPUT "Top: ", Form[Best].Name, " ", Form[Best].Mark'
          ].join("\n"),
          tests: [
            { id: "t1", kind: "normal", inputs: ["Gil", "61", "Hal", "72", "Ivy", "58", "Jon", "66"], caseHint: "最高分落在中间某个人身上。" },
            { id: "t2", kind: "boundary", inputs: ["Gil", "90", "Hal", "72", "Ivy", "58", "Jon", "66"], caseHint: "最高分就是第一个读进来的人。" },
            { id: "t3", kind: "boundary", inputs: ["Gil", "61", "Hal", "72", "Ivy", "58", "Jon", "88"], caseHint: "最高分是最后一个读进来的人。" },
            { id: "t4", kind: "normal", inputs: ["Gil", "50", "Hal", "50", "Ivy", "50", "Jon", "51"], caseHint: "其余几个人分数完全相同，只有一个人略高。" },
            { id: "t5", kind: "extreme", inputs: ["Gil", "-99999", "Hal", "-99998", "Ivy", "-99997", "Jon", "-99996"], caseHint: "所有人的分数都是很小的负数。" }
          ]
        }
      ]
    },
    {
      id: "11.5",
      title: "记录还是平行数组",
      syllabus: ["§10.1"],
      estimatedMinutes: 8,
      taughtFeatures: AFTER_11_1,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "不用记录也能存一个班：开两个数组，`Names` 和 `Marks`，约定第 `I` 格说的是同一个人。这种做法叫**平行数组（parallel arrays）**——两排东西并排放着，靠下标对齐。",
            "它能跑，但那句「第 `I` 格说的是同一个人」只是个**约定**，程序里没有任何一行写着它。只要有一处让两排的顺序错开——比如排序时只换了 `Marks` 忘了换 `Names`——姓名和分数就对不上了，而且**一条提示都不会有**。",
            "**记录数组（array of records）**把这句约定写进了程序：一个人的姓名和分数在同一格里，换格子的时候只能一起换，想拆都拆不开。再加字段也只改一个地方，而不是再开一个数组、再记一条约定。",
            "判据于是很简单：**这些数据是不是描述同一样东西的不同方面？**是，就用记录；只是碰巧长度一样的两批数，那才是两个各自独立的数组。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "为一个问题挑数据结构时要说得出理由，理由落在这批数据本身的形状上（§10.1、§10.2）。"
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "用平行数组存一个班，排序时只交换了 `Marks` 的两格、忘了交换 `Names`，会怎样？",
          options: [
            {
              key: "A",
              label: "编辑器会拦下来",
              correct: false,
              explanation: "编辑器只看得到两个各自独立的数组，看不出你心里认为它们的第 `I` 格说的是同一个人。"
            },
            {
              key: "B",
              label: "运行时会越界停下来",
              correct: false,
              explanation: "交换只在已有的格子之间搬值，下标一个都没越界。数据错了，但程序没出错。"
            },
            {
              key: "C",
              label: "换成记录数组也一样会出这个问题",
              correct: false,
              explanation: "不一样。记录数组里姓名和分数在同一格，交换整格时它们只能一起走，没有「只换了一半」这种写法。"
            },
            {
              key: "D",
              label: "程序照常跑完，但姓名和分数对不上了",
              correct: true,
              explanation: "对。两个数组各自都是合法的，下标也都在范围里，没有任何一步出错——错的只是那句没写进程序的约定。"
            }
          ]
        }
      ]
    }
  ],
  chapterTasks: [
    {
      kind: "chapterTask",
      id: "11.T1",
      title: "成绩排行榜",
      statement: "写一段伪代码：读入 5 个学生的姓名和成绩，按成绩**从高到低**排好，再一行一个显示出来。成绩相同的两个人，先读进来的排在前面。",
      ioSpec: {
        input: [
          "十行，一个人两行：先姓名（`STRING`），再成绩（`INTEGER`），五个人依次读完。每次读取之前都要显示提示语，一字不差：",
          "姓名前是 `Enter a name`，成绩前是 `Enter a mark`"
        ].join("\n"),
        output: ["五行，每行一个人，写成：", "`<姓名> <分数>`", "姓名和分数之间一个空格，成绩从高到低。"].join("\n")
      },
      suggestedFeatures: [
        "decl.record-type",
        "record.field-access",
        "decl.array-1d",
        "array.index",
        "loop.for",
        "loop.nested",
        "select.if",
        "io.input",
        "io.output"
      ],
      hints: [
        "排序用第 10 章的冒泡排序，只是比较的时候要取 `.Mark`，而且方向和之前相反。",
        "交换的是**整条记录**，不是单个字段——临时变量的类型就写成那种记录类型。",
        "成绩相同就不要交换，这样先读进来的那个自然会留在前面。"
      ],
      examples: [
        {
          inputs: ["Ada", "80", "Bob", "55", "Cal", "91", "Dee", "70", "Eve", "55"],
          outputs: [
            "Enter a name",
            "Enter a mark",
            "Enter a name",
            "Enter a mark",
            "Enter a name",
            "Enter a mark",
            "Enter a name",
            "Enter a mark",
            "Enter a name",
            "Enter a mark",
            "Cal 91",
            "Ada 80",
            "Dee 70",
            "Bob 55",
            "Eve 55"
          ]
        }
      ],
      referenceSolution: [
        "TYPE TStudent",
        "   DECLARE Name : STRING",
        "   DECLARE Mark : INTEGER",
        "ENDTYPE",
        "DECLARE Form : ARRAY[1:5] OF TStudent",
        "DECLARE Temp : TStudent",
        "FOR I ← 1 TO 5",
        '   OUTPUT "Enter a name"',
        "   INPUT Form[I].Name",
        '   OUTPUT "Enter a mark"',
        "   INPUT Form[I].Mark",
        "NEXT I",
        "FOR I ← 1 TO 4",
        "   FOR J ← 1 TO 5 - I",
        "      IF Form[J].Mark < Form[J + 1].Mark THEN",
        "         Temp ← Form[J]",
        "         Form[J] ← Form[J + 1]",
        "         Form[J + 1] ← Temp",
        "      ENDIF",
        "   NEXT J",
        "NEXT I",
        "FOR I ← 1 TO 5",
        '   OUTPUT Form[I].Name, " ", Form[I].Mark',
        "NEXT I"
      ].join("\n"),
      tests: [
        { id: "t1", kind: "normal", inputs: ["Gil", "61", "Hal", "72", "Ivy", "58", "Jon", "66", "Kay", "49"], caseHint: "五个人分数各不相同，读进来的顺序是乱的。" },
        { id: "t2", kind: "boundary", inputs: ["Gil", "90", "Hal", "80", "Ivy", "70", "Jon", "60", "Kay", "50"], caseHint: "读进来的时候已经是从高到低了。" },
        { id: "t3", kind: "boundary", inputs: ["Gil", "50", "Hal", "60", "Ivy", "70", "Jon", "80", "Kay", "90"], caseHint: "读进来的时候正好完全倒过来。" },
        { id: "t4", kind: "normal", inputs: ["Gil", "70", "Hal", "70", "Ivy", "70", "Jon", "70", "Kay", "70"], caseHint: "所有人分数完全相同，谁都不该被换到别人前面去。" },
        { id: "t5", kind: "extreme", inputs: ["Gil", "99999", "Hal", "-99999", "Ivy", "0", "Jon", "-99999", "Kay", "99999"], caseHint: "混着极大和极小的分数，而且两头都有并列的。" }
      ]
    }
  ]
};
