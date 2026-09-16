import type { Chapter } from "./types.js";
import type { FeatureId } from "@caie-pseudocode/exercise";

/**
 * AS 的收尾章。不引入任何新写法——整章讲的是「拿到一道题之后先做什么」，
 * 用到的语法全部来自 Chapter 1–15。
 */
const AFTER_CHAPTER_15: FeatureId[] = [
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
  "decl.record-type", "record.field-access",
  "routine.procedure", "routine.call", "param.byval", "param.byref",
  "routine.function", "routine.return", "expr.function-call",
  "file.open-read", "file.open-write", "file.open-append",
  "file.read", "file.write", "file.close", "builtin.eof"
];

/** 整章围着同一道题转：5 个学生、姓名 + 分数，要平均分和高于平均分的名单。 */
export const chapter16: Chapter = {
  id: 16,
  title: "综合：从问题到完整程序",
  level: "AS",
  syllabus: ["§9.2", "§12.2"],
  prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  sections: [
    {
      id: "16.1",
      title: "先把题目读明白",
      syllabus: ["§9.2"],
      estimatedMinutes: 9,
      taughtFeatures: AFTER_CHAPTER_15,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "前面十五章教的是**怎么写**。这一章讲的是拿到一道题之后、动手写之前该做什么——因为写不出来的时候，问题往往不在语法上，而在还没想清楚要做什么。",
            "第一步是把题面拆成三样东西：**已知**（给了什么）、**要求**（要交出什么）、**约束**（有什么限制）。三样都写下来，缺哪样一眼就看得见。",
            "本章从头到尾只用一道题：*一个班有 5 个学生，每人有姓名和一个分数。读入这些数据，显示平均分（取整数商），再列出分数高于平均分的学生姓名。* 三样分别是——已知：5 个学生的姓名和分数；要求：平均分一行、高于平均的姓名若干行；约束：人数固定 5 个，平均分取整数商。",
            "**约束最容易漏，而它常常决定整个做法。**「高于平均分」这一条就是：平均分要全部读完才算得出来，而判断又要回头看每一个人——所以数据非存下来不可（第 8 章讲过这件事）。这一句要是没读出来，写到一半才发现得推倒重来。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "算法是一个问题的解，写成一串确定的步骤；问题里用到的每一样数据都要有一个说得清的标识符名（§9.2）。"
            }
          ]
        },
        {
          kind: "comparison",
          title: "同一道题，读到什么程度才算读明白",
          intro: "题面：读入一个房间的长和宽，显示它的面积。",
          panes: [
            {
              label: "只读了个大概",
              language: "natural",
              code: ["「算面积。」", "——那长和宽从哪儿来？算完给谁看？", "写到一半就得停下来回头猜。"].join("\n"),
              note: "不是读得不认真，是没有把题面拆成三样。剩下的两样一直空着，动手的时候才发现。"
            },
            {
              label: "拆成三样",
              language: "natural",
              code: [
                "已知：一个长、一个宽，都从键盘读入。",
                "要求：显示面积，一行。",
                "约束：长和宽都是整数。"
              ].join("\n"),
              note: "三样齐了，代码的形状已经定下来了：两次读入、一次计算、一次显示——也就是下一节的 IPO 三段。"
            },
            {
              label: "写成伪代码",
              language: "pseudocode",
              code: [
                "DECLARE Width : INTEGER",
                "DECLARE Height : INTEGER",
                'OUTPUT "Enter the width"',
                "INPUT Width",
                'OUTPUT "Enter the height"',
                "INPUT Height",
                'OUTPUT "Area: ", Width * Height'
              ].join("\n"),
              note: "一行都不用犹豫——上面那三行已经把该有什么说完了，这里只是换成伪代码的写法。"
            },
            {
              label: "Python",
              language: "python",
              code: ["width = int(input())", "height = int(input())", 'print("Area:", width * height)'].join("\n"),
              note: "换成另一种语言，三样东西一个不变。**读明白题目这一步和用什么语言无关。**"
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "本章那道题里，「列出分数**高于平均分**的学生姓名」这一条，最先影响的是什么决定？",
          options: [
            {
              key: "A",
              label: "用什么名字给变量",
              correct: false,
              explanation: "名字要起好，但这一条约束换成「低于平均分」名字也不用变。它影响的是更靠前的决定。"
            },
            {
              key: "B",
              label: "数据必须先全部存下来，不能边读边算完就扔",
              correct: true,
              explanation: "对。平均分要读完全部才算得出来，而「谁高于它」又要回头看每一个人——第 8 章就是拿这件事说明数组为什么非要不可。"
            },
            {
              key: "C",
              label: "用 `FOR` 还是 `WHILE`",
              correct: false,
              explanation: "循环怎么选由「次数知不知道」决定，这里人数固定是 5，用 `FOR`。这一条约束管的是别的事。"
            },
            {
              key: "D",
              label: "平均分要不要取整",
              correct: false,
              explanation: "取整是另一条约束（题面单独说了「取整数商」），两条各管各的。"
            }
          ]
        }
      ]
    },
    {
      id: "16.2",
      title: "input / process / output 与标识符表",
      syllabus: ["§9.2"],
      estimatedMinutes: 11,
      taughtFeatures: AFTER_CHAPTER_15,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "读明白之后，把题目摆成三段：**输入什么、中间做什么、输出什么**。第 1 章就用过这个说法，现在它成了固定的一步——因为**任何一段程序都装得进这三段**。",
            "本章那道题的三段是：输入 5 组姓名和分数；中间算出总分、再算平均分、再挑出高于平均的人；输出平均分一行、姓名若干行。",
            "接下来给每一样数据起名字，列成一张**标识符表（identifier table）**：名字、类型、它代表什么。这张表是正式的设计产物，不是草稿；它不是格式功课——**名字起不出来，多半是那样东西你还没想清楚**。",
            "起名的老规矩还在（第 2 章）：字母开头、见名知意、别和关键字或内置函数撞（`Length` 这种就不能用，它是内置函数名）。表里一行一样东西，临时的循环变量也算。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "一段伪代码要包含 input、process、output 三段；问题里用到的数据用标识符表列出来（§9.2）。"
            }
          ]
        },
        {
          kind: "example",
          title: "最小的一份 IPO",
          fileName: "Example_16_2_a.pseudocode",
          code: [
            "DECLARE Width : INTEGER",
            "DECLARE Height : INTEGER",
            'OUTPUT "Enter the width"',
            "INPUT Width",
            'OUTPUT "Enter the height"',
            "INPUT Height",
            'OUTPUT "Area: ", Width * Height',
            'OUTPUT "Perimeter: ", 2 * (Width + Height)'
          ].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 2, text: "标识符表落到代码上就是这两行：名字、类型，各代表什么写在名字里。" },
            { fromLine: 3, toLine: 6, text: "input 段。两样输入，各配一句提示。" },
            { fromLine: 7, toLine: 8, text: "process 和 output 挤在同一行了——算式简单的时候可以，复杂了就该先算进一个变量再显示。" }
          ],
          sampleRun: {
            inputs: ["3", "4"],
            outputs: ["Enter the width", "Enter the height", "Area: 12", "Perimeter: 14"]
          }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "列标识符表的时候，下面哪一样**也应该**列进去？",
          options: [
            {
              key: "A",
              label: "每一句 `OUTPUT` 里的提示语",
              correct: false,
              explanation: "提示语是写死在代码里的文字，不是要存起来的数据，没有名字也没有类型。"
            },
            {
              key: "B",
              label: "用到的每一个运算符",
              correct: false,
              explanation: "标识符表登记的是数据，不是运算。运算属于 process 那一段的描述。"
            },
            {
              key: "C",
              label: "程序一共有多少行",
              correct: false,
              explanation: "行数和数据没有关系，而且写着写着就变了。"
            },
            {
              key: "D",
              label: "只在循环里用来数数的那个控制变量",
              correct: true,
              explanation: "对。它也是一份要占地方的数据，也要 `DECLARE`，也要起个说得清的名字。表里一行一样东西，不分重要不重要。"
            }
          ]
        },
        {
          kind: "task",
          id: "16.2.1",
          title: "买票找零",
          statement: "按 IPO 三段写一段伪代码：读入一张票的价格、买了几张、以及付了多少钱（都是整数），显示这次一共多少钱，以及应该找回多少。先想清楚要几个变量、各叫什么——**中间算出来的那个量也要有名字**。",
          ioSpec: {
            input: [
              "三行，各一个 `INTEGER`。每次读取之前都要显示提示语，一字不差，依次是：",
              "`Enter the price`",
              "`Enter the quantity`",
              "`Enter the payment`",
              "保证付的钱不少于总价。"
            ].join("\n"),
            output: [
              "两行：",
              "`Total: <总价>`",
              "`Change: <找零>`",
              "冒号后面都是一个空格。"
            ].join("\n")
          },
          hints: [
            "三样输入各要一个名字，总价也要一个——它是算出来的，但后面两行都用得上。",
            "找零是付的钱减去总价，所以总价要先算出来。"
          ],
          examples: [
            {
              inputs: ["12", "3", "50"],
              outputs: ["Enter the price", "Enter the quantity", "Enter the payment", "Total: 36", "Change: 14"]
            }
          ],
          referenceSolution: [
            "DECLARE Price : INTEGER",
            "DECLARE Quantity : INTEGER",
            "DECLARE Payment : INTEGER",
            "DECLARE Total : INTEGER",
            'OUTPUT "Enter the price"',
            "INPUT Price",
            'OUTPUT "Enter the quantity"',
            "INPUT Quantity",
            'OUTPUT "Enter the payment"',
            "INPUT Payment",
            "Total ← Price * Quantity",
            'OUTPUT "Total: ", Total',
            'OUTPUT "Change: ", Payment - Total'
          ].join("\n"),
          tests: [
            { id: "t1", kind: "normal", inputs: ["8", "4", "40"], caseHint: "买几张，还有找零。" },
            { id: "t2", kind: "boundary", inputs: ["7", "3", "21"], caseHint: "付的钱和总价正好相等。" },
            { id: "t3", kind: "boundary", inputs: ["5", "1", "5"], caseHint: "只买一张，而且不用找零。" },
            { id: "t4", kind: "normal", inputs: ["0", "6", "10"], caseHint: "票价是零。" },
            { id: "t5", kind: "extreme", inputs: ["999", "999", "999999"], caseHint: "价格和数量都很大。" }
          ]
        }
      ]
    },
    {
      id: "16.3",
      title: "分解与结构图",
      syllabus: ["§9.2", "§12.2"],
      estimatedMinutes: 10,
      taughtFeatures: AFTER_CHAPTER_15,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "三段摆好之后，process 那一段往往还是一大块。**分解**就是把这一大块拆成几件各自说得清的事，每件事将来是一个过程或者一个函数（第 12、13 章）。",
            "本章那道题拆成三件：**读入一个班**、**算平均分**、**列出高于平均的人**。三件事各自都能用一句话说清楚，而且各自都能单独检查对不对——这是拆得好不好的判据。",
            "拆完之后画一张**结构图（structure chart）**：上面一个方框是主程序，下面一排方框是拆出来的几件事，箭头上标着它们之间**传的是什么**。这张图既要读得懂，也要画得出，还要能照着它把伪代码的头部倒推出来。",
            "结构图上最值钱的是箭头上那几个名字。它们直接对应参数表：往下传的是实参，往上传的是返回值或者 `BYREF` 参数改回来的东西。**图画对了，过程的头部就已经写好了。**"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "结构图把问题分解成子任务，并标明各模块之间传递的参数；由它可以推出等价的伪代码（§12.2）。"
            }
          ]
        },
        {
          kind: "comparison",
          title: "一张结构图和它对应的头部",
          intro: "本章那道题拆成三件事之后的样子。",
          panes: [
            {
              label: "结构图",
              language: "diagram",
              code: [
                "                    +-------------+",
                "                    |    main     |",
                "                    +-------------+",
                "                           |",
                "        +------------------+------------------+",
                "        |                  |                  |",
                "+---------------+  +---------------+  +---------------+",
                "|   ReadClass   |  |   AverageOf   |  |   ShowAbove   |",
                "+---------------+  +---------------+  +---------------+",
                "    ↑ Form             ↓ Total            ↓ Form",
                "    ↑ Total            ↓ Count            ↓ Mean",
                "                       ↑ average"
              ].join("\n"),
              note: "方框里写的就是将来那几个过程和函数的名字，箭头上写的是参数名。**朝下的箭头是主程序递下去的，朝上的是交回主程序的**——`ReadClass` 要交回班级和总分两样，所以它下面挂着两个朝上的箭头。（图里一律用标识符名，不用中文。）"
            },
            {
              label: "用话说一遍",
              language: "natural",
              code: [
                "主程序要做三件事：",
                "  一、读入一个班（ReadClass）——做完之后要把班级 Form 和总分 Total 交回主程序。",
                "  二、算平均分（AverageOf）——给它总分 Total 和人数 Count，它交回平均分。",
                "  三、列出高于平均的人（ShowAbove）——给它班级 Form 和平均分 Mean，它自己显示，不用交回什么。"
              ].join("\n"),
              note: "每件事后面那半句就是箭头：**「交回」的是朝上的，「给它」的是朝下的**。话说清楚了，图和头部都是照抄。"
            },
            {
              label: "照着图写出来的头部",
              language: "pseudocode",
              code: [
                "TYPE TStudent",
                "   DECLARE Name : STRING",
                "   DECLARE Mark : INTEGER",
                "ENDTYPE",
                "PROCEDURE ReadClass(BYREF Form : ARRAY[1:5] OF TStudent, BYREF Total : INTEGER)",
                "   Total ← 0",
                "ENDPROCEDURE",
                "FUNCTION AverageOf(Total : INTEGER, Count : INTEGER) RETURNS INTEGER",
                "   RETURN Total DIV Count",
                "ENDFUNCTION",
                "PROCEDURE ShowAbove(Form : ARRAY[1:5] OF TStudent, Mean : INTEGER)",
                "   OUTPUT Mean",
                "ENDPROCEDURE"
              ].join("\n"),
              note: "图上的箭头逐条变成了括号里的东西：朝下的成了参数，朝上的成了 `BYREF` 参数或者返回值。三个体先空着，下一节再填——**头部已经定死了，填体的时候不会再动它**。"
            },
            {
              label: "Python",
              language: "python",
              code: ["def read_marks(): ...", "def average_of(total, count): ...", "def show_above(marks, mean): ..."].join("\n"),
              note: "换个语言，图一个字都不用改。结构图说的是「谁调用谁、之间传什么」，和语法无关。"
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "结构图上，从「算平均分」这个方框指向主程序的那个**朝上**的箭头，对应伪代码里的什么？",
          options: [
            {
              key: "A",
              label: "它的返回值",
              correct: true,
              explanation: "对。朝上的箭头是「交回给调用者的东西」；一件事只需要交回一个值，写成函数的返回值最直接。"
            },
            {
              key: "B",
              label: "它的参数",
              correct: false,
              explanation: "参数是主程序递下去的，箭头朝下。方向反了。"
            },
            {
              key: "C",
              label: "它的名字",
              correct: false,
              explanation: "名字写在方框里，不在箭头上。箭头上标的是传的数据。"
            },
            {
              key: "D",
              label: "它被调用了几次",
              correct: false,
              explanation: "结构图不说次数，只说谁调用谁、之间传什么。次数由调用它的那段代码决定。"
            }
          ]
        }
      ]
    },
    {
      id: "16.4",
      title: "逐步求精",
      syllabus: ["§9.2"],
      estimatedMinutes: 10,
      taughtFeatures: AFTER_CHAPTER_15,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "拆出来的每一件事还是一句中文。**逐步求精（stepwise refinement）**就是把这一句话一层一层写细，**细到每一行都能直接换成伪代码为止**。",
            "拿「读入一个班并算出总分」为例。第一层：*读入 5 个学生的姓名和分数，同时把分数加起来。* 第二层：*总分清零；重复 5 次：提示并读姓名、提示并读分数、把这个分数加到总分上。* 到这一层，每一句都对得上一个写法了。",
            "每往下一层，只回答一个问题：**这一句具体怎么做？**别在同一层里既写「重复 5 次」又写 `FOR I ← 1 TO 5`——**一层只说一件事的粒度**，混着写就分不清哪些已经定下来了。",
            "什么时候停？**当每一句都能一对一地换成一行伪代码的时候。**再细就是在写代码了，再粗就还有想不清楚的地方。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "逐步求精是把算法一层层细化，直到细到可以直接编程的程度（§9.2）。"
            }
          ]
        },
        {
          kind: "example",
          title: "第二层写完之后直接换成伪代码",
          fileName: "Example_16_4_a.pseudocode",
          code: [
            "DECLARE Marks : ARRAY[1:5] OF INTEGER",
            "DECLARE Total : INTEGER",
            "Total ← 0",
            "FOR I ← 1 TO 5",
            '   OUTPUT "Enter a mark for student ", I',
            "   INPUT Marks[I]",
            "   Total ← Total + Marks[I]",
            "NEXT I",
            'OUTPUT "Average: ", Total DIV 5'
          ].join("\n"),
          annotations: [
            { fromLine: 3, toLine: 3, text: "对应第二层的「总分清零」。位置在循环之前——第 6 章反复讲过这件事。" },
            { fromLine: 4, toLine: 8, text: "对应「重复 5 次：……」。次数已经知道，所以是 `FOR`。" },
            { fromLine: 7, toLine: 7, text: "对应「把这个分数加到总分上」。一句话换一行，这就是求精该停下来的信号。" }
          ],
          sampleRun: {
            inputs: ["80", "70", "90", "60", "100"],
            outputs: [
              "Enter a mark for student 1",
              "Enter a mark for student 2",
              "Enter a mark for student 3",
              "Enter a mark for student 4",
              "Enter a mark for student 5",
              "Average: 80"
            ]
          }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "逐步求精该在什么时候停下来？",
          options: [
            {
              key: "A",
              label: "当每一句都不超过十个字的时候",
              correct: false,
              explanation: "「把这个班按分数排好」只有九个字，但它离一行伪代码还远着。长短说明不了粒度。"
            },
            {
              key: "B",
              label: "写满三层就停",
              correct: false,
              explanation: "层数由题目的复杂程度决定。简单的一层就够，复杂的四五层也正常，没有固定的数。"
            },
            {
              key: "C",
              label: "当每一句都能一对一换成一行伪代码的时候",
              correct: true,
              explanation: "对。再细就等于在写代码了，再粗就还有句子说不清该怎么做。这是唯一能操作的判据。"
            },
            {
              key: "D",
              label: "当所有变量都起好名字的时候",
              correct: false,
              explanation: "名字在标识符表那一步就起了。名字齐了，句子仍然可能粗得没法直接写。"
            }
          ]
        }
      ]
    },
    {
      id: "16.5",
      title: "从结构化英语和流程图写出伪代码",
      syllabus: ["§9.2"],
      estimatedMinutes: 11,
      taughtFeatures: AFTER_CHAPTER_15,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "求精写出来的那几层，写规整一点就是**结构化英语（structured English）**：用日常的词描述步骤，但缩进和「重复」「如果」这些结构词和伪代码对得上。它比伪代码松，比大白话严。",
            "同样的东西还可以画成**流程图（flowchart）**：一个个方框按执行顺序连起来，判断画成一个有两条出口的菱形，循环就是一条绕回去的线。这两种描述都要能**写成伪代码**。",
            "转写的时候只做一件事：**把结构词换成关键字**。「重复 5 次」换成 `FOR ... TO ... NEXT`，「如果……那么」换成 `IF ... THEN ... ENDIF`，「显示」换成 `OUTPUT`。缩进照抄——它本来就标着谁包着谁。",
            "有一处要留神：**这两种描述里都不写变量声明**。转成伪代码时要自己把 `DECLARE` 补齐——照着标识符表补，一个都不会漏。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "结构化英语描述和流程图都可以转写成伪代码，伪代码也可以反过来画成流程图（§9.2）。本模块只做「读懂并转成伪代码」这个方向。"
            }
          ]
        },
        {
          kind: "comparison",
          title: "同一个算法的三种写法",
          intro: "统计三天里有几天气温低于零度。",
          panes: [
            {
              label: "流程图",
              language: "diagram",
              code: [
                "             ( start )",
                "                 |",
                "          [ Count ← 0 ]",
                "                 |",
                "            [ I ← 1 ]",
                "                 |",
                "     +---------->+",
                "     |           |",
                "     |     < I <= 3 ? >--- no --->[ output Count ]--->( stop )",
                "     |           |",
                "     |          yes",
                "     |           |",
                "     |     [ input Temperature ]",
                "     |           |",
                "     |     < Temperature < 0 ? >--- no ---+",
                "     |           |                        |",
                "     |          yes                       |",
                "     |           |                        |",
                "     |     [ Count ← Count + 1 ]          |",
                "     |           |                        |",
                "     |           +<-----------------------+",
                "     |           |",
                "     |     [ I ← I + 1 ]",
                "     |           |",
                "     +-----------+"
              ].join("\n"),
              note: "方框是一步动作，菱形是判断、两条出口各走一支；最左边那条绕回去的线就是循环。信息和右边那栏一模一样，只是画出来了。"
            },
            {
              label: "结构化英语",
              language: "natural",
              code: [
                "set the count to zero",
                "repeat 3 times",
                "    ask for a temperature and read it",
                "    if the temperature is below zero",
                "        add one to the count",
                "output the count"
              ].join("\n"),
              note: "每一行都对得上一个写法，缩进标出了谁包着谁。缺的只有声明——那几行得自己补。"
            },
            {
              label: "伪代码",
              language: "pseudocode",
              code: [
                "DECLARE Count : INTEGER",
                "DECLARE Temperature : INTEGER",
                "Count ← 0",
                "FOR I ← 1 TO 3",
                '   OUTPUT "Enter a temperature for day ", I',
                "   INPUT Temperature",
                "   IF Temperature < 0 THEN",
                "      Count ← Count + 1",
                "   ENDIF",
                "NEXT I",
                'OUTPUT "Frost days: ", Count'
              ].join("\n"),
              note: "结构词换成关键字、缩进照抄，再把前三行 `DECLARE` 补上。提示语也得自己加——那两栏都没写它。"
            },
            {
              label: "Python",
              language: "python",
              code: [
                "count = 0",
                "for _ in range(3):",
                "    t = int(input())",
                "    if t < 0:",
                "        count += 1",
                'print("Frost days:", count)'
              ].join("\n"),
              note: "同一个算法换第四种写法。**算法和记法是两件事**——这正是第 1 章说过的，为什么要有伪代码这种固定写法。"
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "把结构化英语转成伪代码时，下面哪一样**必须自己补上**？",
          options: [
            {
              key: "A",
              label: "语句的先后顺序",
              correct: false,
              explanation: "顺序正是这两种描述最主要的内容——一个靠行的先后，一个靠箭头。"
            },
            {
              key: "B",
              label: "循环的次数",
              correct: false,
              explanation: "次数在描述里写着（「repeat 3 times」），照抄就行。"
            },
            {
              key: "C",
              label: "变量的声明",
              correct: true,
              explanation: "对。结构化英语和流程图都不写 `DECLARE`，转过来时要照着标识符表把声明补齐。顺带还有 `INPUT` 前的提示语，那两种描述里通常也不写。"
            },
            {
              key: "D",
              label: "判断的条件",
              correct: false,
              explanation: "条件写在「if the temperature is below zero」和菱形里，两边都有，只需要换成符号。"
            }
          ]
        },
        {
          kind: "task",
          id: "16.5.1",
          title: "照着描述写出来",
          statement: [
            "下面是一段结构化英语。把它**原样**转成伪代码（声明和输入提示语要自己补上）：",
            "",
            "`set the count to zero`",
            "`repeat 5 times`",
            "`　　ask for a temperature and read it`",
            "`　　if the temperature is below zero`",
            "`　　　　add one to the count`",
            "`output the count`"
          ].join("\n"),
          ioSpec: {
            input: ["五行，各一个 `INTEGER`。每次读取之前都要显示带天数的提示语：", "`Enter a temperature for day <天数>`"].join("\n"),
            output: ["一行，写成：", "`Frost days: <低于零度的天数>`", "冒号后面一个空格。"].join("\n")
          },
          constraints: {
            require: [
              {
                feature: "loop.for",
                reason: "描述里写着「重复 5 次」，次数事先就知道。"
              },
              {
                feature: "select.if",
                reason: "「如果低于零度」那一句要换成一个判断。"
              }
            ]
          },
          hints: [
            "缩进照抄：描述里缩进的那两行，在伪代码里就在 `FOR` 和 `IF` 里面。",
            "「低于零度」是 `< 0`，不含零——零度那天不算。",
            "描述里没写的两样要自己补：三行 `DECLARE`，还有每次读入前的提示语。"
          ],
          examples: [
            {
              inputs: ["5", "-2", "0", "-7", "12"],
              outputs: [
                "Enter a temperature for day 1",
                "Enter a temperature for day 2",
                "Enter a temperature for day 3",
                "Enter a temperature for day 4",
                "Enter a temperature for day 5",
                "Frost days: 2"
              ]
            }
          ],
          referenceSolution: [
            "DECLARE Count : INTEGER",
            "DECLARE Temperature : INTEGER",
            "Count ← 0",
            "FOR I ← 1 TO 5",
            '   OUTPUT "Enter a temperature for day ", I',
            "   INPUT Temperature",
            "   IF Temperature < 0 THEN",
            "      Count ← Count + 1",
            "   ENDIF",
            "NEXT I",
            'OUTPUT "Frost days: ", Count'
          ].join("\n"),
          tests: [
            { id: "t1", kind: "normal", inputs: ["3", "-1", "-4", "8", "-6"], caseHint: "五天里有几天在零度以下，有几天在零度以上。" },
            { id: "t2", kind: "boundary", inputs: ["0", "0", "0", "0", "0"], caseHint: "五天全是零度——零度不算在零度以下。" },
            { id: "t3", kind: "boundary", inputs: ["-1", "-1", "-1", "-1", "-1"], caseHint: "五天全在零度以下。" },
            { id: "t4", kind: "boundary", inputs: ["1", "1", "1", "1", "1"], caseHint: "五天全在零度以上，一天都不该数上。" },
            { id: "t5", kind: "extreme", inputs: ["-9999", "9999", "0", "-1", "1"], caseHint: "混着极冷和极热的天气，还有正好零度的一天。" }
          ]
        }
      ]
    },
    {
      id: "16.6",
      title: "选数据结构，选控制结构",
      syllabus: ["§9.2", "§10.1"],
      estimatedMinutes: 9,
      taughtFeatures: AFTER_CHAPTER_15,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "求精到某一层，就得回答两个问题：**数据装在什么里？循环用哪一种？**这两个判据前面都给过，这里只是把它们摆到一起用。",
            "**数据结构**：一个值用变量；一串同类型的、一个编号指得准的用一维数组；要两个编号的用二维数组；几样不同类型凑成一份的用记录；很多份这样的用记录数组；要活过这次运行的写文件。本章那道题是「5 个人，每人姓名 + 分数」——**几样不同类型凑成一份、有很多份**，所以是记录数组。",
            "**控制结构**：次数事先知道用 `FOR`；不知道、而且可能一次都不做用 `WHILE`；不知道、但至少做一次用 `REPEAT`；从几条路里挑一条用 `IF` 串接，拿同一个东西比不同的值用 `CASE`。本章那道题人数固定是 5，两处循环都是 `FOR`。",
            "两个判据都有同一句话垫底：**选对了，代码就不用做多余的事。**选错不会立刻报错——用平行数组也能存这个班，只是排序时要记得两个数组一起换（第 11 章）；用 `REPEAT` 读一个可能一行都没有的文件也能写，只是空文件会被多读一次（第 14 章）。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "为一个解法选择并使用合适的数据类型与数据结构，是设计阶段的一部分（§10.1、§10.2）。"
            }
          ]
        },
        {
          kind: "example",
          title: "选定之后，读入那一段的样子",
          fileName: "Example_16_6_a.pseudocode",
          code: [
            "TYPE TStudent",
            "   DECLARE Name : STRING",
            "   DECLARE Mark : INTEGER",
            "ENDTYPE",
            "DECLARE Form : ARRAY[1:5] OF TStudent",
            "DECLARE Total : INTEGER",
            "Total ← 0",
            "FOR I ← 1 TO 5",
            '   OUTPUT "Enter a name for student ", I',
            "   INPUT Form[I].Name",
            '   OUTPUT "Enter a mark for student ", I',
            "   INPUT Form[I].Mark",
            "   Total ← Total + Form[I].Mark",
            "NEXT I",
            'OUTPUT "Average: ", Total DIV 5'
          ].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 5, text: "数据结构的决定落在这五行上：一份是一条记录，五份是一个记录数组。" },
            { fromLine: 8, toLine: 14, text: "控制结构的决定落在这一行上：人数固定，所以是 `FOR`。" },
            { fromLine: 13, toLine: 13, text: "总分边读边加。它不违反「非存下来不可」——存的是每个人的分数，总分只是顺手攒的。" }
          ],
          sampleRun: {
            inputs: ["Ada", "80", "Bob", "70", "Cal", "90", "Dee", "60", "Eve", "100"],
            outputs: [
              "Enter a name for student 1",
              "Enter a mark for student 1",
              "Enter a name for student 2",
              "Enter a mark for student 2",
              "Enter a name for student 3",
              "Enter a mark for student 3",
              "Enter a name for student 4",
              "Enter a mark for student 4",
              "Enter a name for student 5",
              "Enter a mark for student 5",
              "Average: 80"
            ]
          }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "一个程序要一行一行读完一个文件，文件里有几行事先不知道。该用哪种循环？",
          options: [
            {
              key: "A",
              label: "`WHILE ... ENDWHILE`",
              correct: true,
              explanation: "对。次数不知道，而且空文件应该一次都不读——先看条件的循环正好两条都满足，这就是第 14 章那个 `WHILE NOT EOF(...)`。"
            },
            {
              key: "B",
              label: "两层嵌套循环",
              correct: false,
              explanation: "嵌套是给「每一行里还要再走一遍」准备的。一行一行读完只需要一层。"
            },
            {
              key: "C",
              label: "`REPEAT ... UNTIL`",
              correct: false,
              explanation: "它至少做一次。碰上一行都没有的空文件，第一次读就没有行可读，程序会停下来。"
            },
            {
              key: "D",
              label: "`FOR ... TO ... NEXT`",
              correct: false,
              explanation: "`FOR` 要事先写出次数，而这里正是不知道有几行。写死一个数就等于在假设文件有多长。"
            }
          ]
        }
      ]
    },
    {
      id: "16.7",
      title: "写出一个完整解",
      syllabus: ["§9.2", "§12.2"],
      estimatedMinutes: 10,
      taughtFeatures: AFTER_CHAPTER_15,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "前面六步走完，代码基本是抄出来的：结构图上的三个方框变成三个头部，箭头变成参数和返回值，求精的最后一层变成各自的体，标识符表变成 `DECLARE`。",
            "主程序此时应该很短——几行声明加一串调用。**主程序一长，说明有件事没拆出去。**这是检查分解做得好不好最快的办法。",
            "有一处是第 12 章的规矩在起作用：「读入一个班」要把班级和总分都交回主程序，而函数只还一个值，所以它写成过程、两样都走 `BYREF`；「算平均分」只交回一个数，写成函数最省事。",
            "写完别忘了自己跑一遍，而且要专门试**边界**：全班同分时谁都不高于平均，零分和满分混在一起时数字对不对。**这一步谁都替不了你**——前面六步保证的是「想清楚了」，跑一遍才知道「写对了」。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "把问题分解为子问题、做成程序模块（过程 / 函数），再合起来成为一个完整的解（§9.2、§12.2）。"
            }
          ]
        },
        {
          kind: "example",
          title: "本章那道题的完整解",
          fileName: "Example_16_7_a.pseudocode",
          code: [
            "TYPE TStudent",
            "   DECLARE Name : STRING",
            "   DECLARE Mark : INTEGER",
            "ENDTYPE",
            "PROCEDURE ReadClass(BYREF Form : ARRAY[1:5] OF TStudent, BYREF Total : INTEGER)",
            "   Total ← 0",
            "   FOR I ← 1 TO 5",
            '      OUTPUT "Enter a name for student ", I',
            "      INPUT Form[I].Name",
            '      OUTPUT "Enter a mark for student ", I',
            "      INPUT Form[I].Mark",
            "      Total ← Total + Form[I].Mark",
            "   NEXT I",
            "ENDPROCEDURE",
            "FUNCTION AverageOf(Total : INTEGER, Count : INTEGER) RETURNS INTEGER",
            "   RETURN Total DIV Count",
            "ENDFUNCTION",
            "PROCEDURE ShowAbove(Form : ARRAY[1:5] OF TStudent, Mean : INTEGER)",
            "   FOR I ← 1 TO 5",
            "      IF Form[I].Mark > Mean THEN",
            "         OUTPUT Form[I].Name",
            "      ENDIF",
            "   NEXT I",
            "ENDPROCEDURE",
            "DECLARE Group : ARRAY[1:5] OF TStudent",
            "DECLARE Sum : INTEGER",
            "DECLARE Mean : INTEGER",
            "CALL ReadClass(Group, Sum)",
            "Mean ← AverageOf(Sum, 5)",
            'OUTPUT "Average: ", Mean',
            "CALL ShowAbove(Group, Mean)"
          ].join("\n"),
          annotations: [
            { fromLine: 5, toLine: 5, text: "两样都要交回主程序，所以是过程加两个 `BYREF`——结构图上那两个朝上的箭头。" },
            { fromLine: 18, toLine: 18, text: "只往下传，什么都不交回，而且数组是拿来看的，所以用默认的传值。" },
            { fromLine: 25, toLine: 31, text: "主程序只剩七行：三行声明、三次调用、一句显示。拆得对的时候它就该这么短。" }
          ],
          sampleRun: {
            inputs: ["Ada", "80", "Bob", "70", "Cal", "90", "Dee", "60", "Eve", "100"],
            outputs: [
              "Enter a name for student 1",
              "Enter a mark for student 1",
              "Enter a name for student 2",
              "Enter a mark for student 2",
              "Enter a name for student 3",
              "Enter a mark for student 3",
              "Enter a name for student 4",
              "Enter a mark for student 4",
              "Enter a name for student 5",
              "Enter a mark for student 5",
              "Average: 80",
              "Cal",
              "Eve"
            ]
          }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "上面那个完整解里，全班五个人分数完全相同时，屏幕上会有几行？",
          options: [
            {
              key: "A",
              label: "程序会停下来，因为没有人高于平均分",
              correct: false,
              explanation: "一个都挑不出来是完全正常的结果，不是错误。循环走完就结束了。"
            },
            {
              key: "B",
              label: "两行：平均分，加一行「没有人高于平均分」",
              correct: false,
              explanation: "代码里没有这么一句。想要它就得自己加——这也说明为什么写完要照着题目再核一遍输出格式。"
            },
            {
              key: "C",
              label: "六行：平均分一行，五个人各一行",
              correct: false,
              explanation: "条件是「高于平均分」。分数都一样时平均分就等于每个人的分数，谁都不比它高。"
            },
            {
              key: "D",
              label: "一行：只有平均分",
              correct: true,
              explanation: "对。`Form[I].Mark > Mean` 一次都不成立，`ShowAbove` 里一句 `OUTPUT` 都不执行。**这正是写完要专门试的那种边界。**"
            }
          ]
        },
    {
          kind: "task",
              id: "16.7.1",
          title: "及格名单存进文件",
          statement: "写一段伪代码：读入 6 个分数，每读一个就往文件里写一行——及格（50 分及以上）写 `pass`，不及格写 `fail`；六个读完关掉文件，再把文件读回来统计及格和不及格各有几个，显示出来。读文件时不许假设有几行。",
          ioSpec: {
            input: ["六行，各一个 `INTEGER`。每次读取之前都要显示提示语，一字不差：", "`Enter a mark`"].join("\n"),
            output: [
              "读完统计完之后显示两行：",
              "`Passes: <及格个数>`",
              "`Fails: <不及格个数>`",
              "每个冒号后面一个空格。"
            ].join("\n")
          },
          constraints: {
            require: [
              {
                feature: "file.write",
                reason: "判过之后的结果要写进文件，不能只留在变量里。"
              },
              {
                feature: "builtin.eof",
                reason: "题目要求读的时候不许假设文件有几行。"
              },
              {
                feature: "select.if-else",
                reason: "及格和不及格各写一种文字，两条路都要有。"
              }
            ]
              },
          hints: [
            "写的时候次数知道（六个），读的时候不知道——两段用的循环不一样。",
            "写进文件的是 `pass` 或 `fail` 这两段文字；读回来比的也是文字，不是分数。",
            "两个计数只用数一个，另一个减出来就行；写完一定要 `CLOSEFILE` 才读得了。"
          ],
          examples: [
            {
              inputs: ["55", "40", "60", "50", "49", "90"],
              outputs: [
            "Enter a mark",
            "Enter a mark",
            "Enter a mark",
            "Enter a mark",
            "Enter a mark",
            "Enter a mark",
            "Passes: 4",
            "Fails: 2"
              ]
            }
          ],
          referenceSolution: [
            "DECLARE Mark : INTEGER",
            "DECLARE Line : STRING",
            "DECLARE Passes : INTEGER",
            'OPENFILE "Marks.txt" FOR WRITE',
            "FOR I ← 1 TO 6",
            '   OUTPUT "Enter a mark"',
            "   INPUT Mark",
            "   IF Mark >= 50 THEN",
            '      WRITEFILE "Marks.txt", "pass"',
            "   ELSE",
            '      WRITEFILE "Marks.txt", "fail"',
            "   ENDIF",
            "NEXT I",
            'CLOSEFILE "Marks.txt"',
            "Passes ← 0",
            'OPENFILE "Marks.txt" FOR READ',
            'WHILE NOT EOF("Marks.txt")',
            '   READFILE "Marks.txt", Line',
            '   IF Line = "pass" THEN',
            "      Passes ← Passes + 1",
            "   ENDIF",
            "ENDWHILE",
            'CLOSEFILE "Marks.txt"',
            'OUTPUT "Passes: ", Passes',
            'OUTPUT "Fails: ", 6 - Passes'
          ].join("\n"),
          tests: [
            { id: "t1", kind: "normal", inputs: ["71", "32", "88", "45", "50", "63"], caseHint: "及格和不及格都有，掺着来。" },
            { id: "t2", kind: "boundary", inputs: ["50", "50", "50", "50", "50", "50"], caseHint: "六个都正好踩在及格线上——那条线是「及以上」。" },
            { id: "t3", kind: "boundary", inputs: ["49", "49", "49", "49", "49", "49"], caseHint: "六个都差一分，一个都不及格。" },
            { id: "t4", kind: "boundary", inputs: ["100", "100", "100", "100", "100", "100"], caseHint: "六个都满分。" },
            { id: "t5", kind: "extreme", inputs: ["99999", "-99999", "0", "50", "49", "1"], caseHint: "混着大得离谱和很小的负数，还有正好踩线的。" }
          ]
            }
      ]
    }
  ],
  chapterTasks: [
    {
      kind: "chapterTask",
      id: "16.T1",
      title: "借阅统计",
      statement: "按这一章的步骤写一段伪代码：读入 5 本书的书名和借出次数，显示借出总次数、平均次数（取整数商），以及借出次数最多的那本书的书名。保证最多的那本只有一本。先把三样（已知、要求、约束）和标识符表想清楚，再分解、求精、动手。",
      ioSpec: {
        input: [
          "十行，一本书两行：先书名（`STRING`），再借出次数（`INTEGER`），五本依次读完。每次读取之前都要显示提示语，一字不差：",
          "书名前是 `Enter a title for book <编号>`，次数前是 `Enter a loan count for book <编号>`"
        ].join("\n"),
        output: [
          "读完之后显示三行：",
          "`Total loans: <总次数>`",
          "`Average loans: <平均次数>`",
          "`Most borrowed: <书名>`",
          "每个冒号后面一个空格。"
        ].join("\n")
      },
      suggestedFeatures: [
        "decl.record-type",
        "record.field-access",
        "decl.array-1d",
        "routine.procedure",
        "routine.function",
        "routine.call",
        "routine.return",
        "param.byref",
        "param.byval",
        "loop.for",
        "select.if",
        "op.div",
        "io.input",
        "io.output"
      ],
      hints: [
        "书名和次数是同一本书的两样东西——第 11 章说过这种该绑成一份。",
        "「最多的那本」记住它在第几格就够了，书名和次数都能从那一格取到。",
        "读入、找最多、显示，可以各写成一件事；主程序应该只剩几行声明和一串调用。"
      ],
      examples: [
        {
          inputs: ["Dune", "12", "Emma", "3", "Hamlet", "20", "Ivanhoe", "5", "Jaws", "7"],
          outputs: [
            "Enter a title for book 1",
            "Enter a loan count for book 1",
            "Enter a title for book 2",
            "Enter a loan count for book 2",
            "Enter a title for book 3",
            "Enter a loan count for book 3",
            "Enter a title for book 4",
            "Enter a loan count for book 4",
            "Enter a title for book 5",
            "Enter a loan count for book 5",
            "Total loans: 47",
            "Average loans: 9",
            "Most borrowed: Hamlet"
          ]
        }
      ],
      referenceSolution: [
        "TYPE TBook",
        "   DECLARE Title : STRING",
        "   DECLARE Loans : INTEGER",
        "ENDTYPE",
        "PROCEDURE ReadBooks(BYREF Shelf : ARRAY[1:5] OF TBook, BYREF Total : INTEGER)",
        "   Total ← 0",
        "   FOR I ← 1 TO 5",
        '      OUTPUT "Enter a title for book ", I',
        "      INPUT Shelf[I].Title",
        '      OUTPUT "Enter a loan count for book ", I',
        "      INPUT Shelf[I].Loans",
        "      Total ← Total + Shelf[I].Loans",
        "   NEXT I",
        "ENDPROCEDURE",
        "FUNCTION BestOf(Shelf : ARRAY[1:5] OF TBook) RETURNS INTEGER",
        "   DECLARE Best : INTEGER",
        "   Best ← 1",
        "   FOR I ← 2 TO 5",
        "      IF Shelf[I].Loans > Shelf[Best].Loans THEN",
        "         Best ← I",
        "      ENDIF",
        "   NEXT I",
        "   RETURN Best",
        "ENDFUNCTION",
        "DECLARE Books : ARRAY[1:5] OF TBook",
        "DECLARE Total : INTEGER",
        "DECLARE Top : INTEGER",
        "CALL ReadBooks(Books, Total)",
        "Top ← BestOf(Books)",
        'OUTPUT "Total loans: ", Total',
        'OUTPUT "Average loans: ", Total DIV 5',
        'OUTPUT "Most borrowed: ", Books[Top].Title'
      ].join("\n"),
      tests: [
        { id: "t1", kind: "normal", inputs: ["Alpha", "4", "Beta", "9", "Gamma", "2", "Delta", "6", "Sigma", "1"], caseHint: "五本次数各不相同，最多的那本在中间。" },
        { id: "t2", kind: "boundary", inputs: ["Alpha", "9", "Beta", "1", "Gamma", "2", "Delta", "3", "Sigma", "4"], caseHint: "最多的正好是第一本读进来的。" },
        { id: "t3", kind: "boundary", inputs: ["Alpha", "1", "Beta", "2", "Gamma", "3", "Delta", "4", "Sigma", "9"], caseHint: "最多的正好是最后一本读进来的。" },
        { id: "t4", kind: "boundary", inputs: ["Alpha", "0", "Beta", "0", "Gamma", "0", "Delta", "0", "Sigma", "1"], caseHint: "几乎全是零，平均数会被整除截掉。" },
        { id: "t5", kind: "normal", inputs: ["Two words here", "5", "Beta", "5", "Gamma", "5", "Delta", "5", "Sigma", "6"], caseHint: "书名里带空格，其余几本次数完全相同。" },
        { id: "t6", kind: "extreme", inputs: ["Alpha", "99999", "Beta", "0", "Gamma", "0", "Delta", "0", "Sigma", "1"], caseHint: "一本大得离谱，其余几乎是零。" }
      ]
    }
  ]
};
