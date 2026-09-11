import type { Chapter } from "./types.js";
import type { FeatureId } from "@caie-pseudocode/exercise";

/**
 * Chapter 9 结束时学生已经会的写法。
 *
 * 本章不引入任何新语法：线性查找和冒泡排序全部由数组、循环、选择和
 * 一个 BOOLEAN 变量拼出来。所以每一节的闸门都是同一份清单。
 */
const AFTER_CHAPTER_9: FeatureId[] = [
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

export const chapter10: Chapter = {
  id: 10,
  title: "线性查找与冒泡排序",
  level: "AS",
  syllabus: ["§10.2"],
  prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  sections: [
    {
      id: "10.1",
      title: "线性查找",
      syllabus: ["§10.2"],
      estimatedMinutes: 9,
      taughtFeatures: AFTER_CHAPTER_9,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "到目前为止对数组做的事都要把每一格走到：求和、求最大、找出高于平均的。查找不一样——**要找的东西可能在第 1 格，可能在最后一格，也可能根本不在里面**。",
            "最直接的做法就叫**线性查找（linear search）**：从第一格开始，拿它跟要找的值比一比，不是就看下一格，一格一格往下走。「线性」说的就是这条路线——排着队走过去，不跳。",
            "用 `FOR` 就能把这条路线写出来：走遍每一格，相等就报出来。但这样写有个代价——**它非把每一格都走完不可**。要找的东西在第 1 格，后面 99 格照样白比一遍。",
            "而且报出来的不只是「有」。停在哪一格，那个下标本身就是答案的一部分：你多半不只想知道在不在，还想知道在第几格。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "考纲要求在 AS 阶段就能写出并使用线性查找（§10.2）。"
            }
          ]
        },
        {
          kind: "example",
          title: "走遍每一格，比中就报",
          fileName: "Example_10_1_a.pseudocode",
          code: [
            "DECLARE Scores : ARRAY[1:5] OF INTEGER",
            "DECLARE I : INTEGER",
            "DECLARE Target : INTEGER",
            "Scores[1] ← 30",
            "Scores[2] ← 80",
            "Scores[3] ← 45",
            "Scores[4] ← 80",
            "Scores[5] ← 12",
            "Target ← 80",
            "FOR I ← 1 TO 5",
            "   IF Scores[I] = Target THEN",
            '      OUTPUT "Found at ", I',
            "   ENDIF",
            "NEXT I"
          ].join("\n"),
          annotations: [
            { fromLine: 9, toLine: 9, text: "要找的值。把它单独放进一个变量，换个目标只要改这一行。" },
            { fromLine: 10, toLine: 14, text: "从第 1 格走到第 5 格，每一格都跟 `Target` 比一次。" },
            { fromLine: 11, toLine: 13, text: "相等就报出下标。注意这里报完还接着走——`FOR` 不会因为找到了就停。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["Found at 2", "Found at 4"]
          }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "把上面那段里的 `Target` 改成 `99`（数组里没有这个数），运行之后屏幕上会看到什么？",
          options: [
            {
              key: "A",
              label: "什么都没有，程序正常结束",
              correct: true,
              explanation: "对。`IF` 一次都没成立，`OUTPUT` 就一次都没执行。程序跑完了，只是什么也没说——「没找到」和「程序没跑」在屏幕上长得一模一样。"
            },
            {
              key: "B",
              label: "显示 `Found at 0`",
              correct: false,
              explanation: "不会。`OUTPUT` 只写在 `IF` 里面，条件没成立它就不执行，不存在一个「表示没找到」的默认输出。"
            },
            {
              key: "C",
              label: "程序在运行时停下来报错",
              correct: false,
              explanation: "没有任何一步出错：下标始终在 1 到 5 之间，比较也合法。找不到不是错误，只是结果。"
            },
            {
              key: "D",
              label: "编辑器在运行前就拦下来",
              correct: false,
              explanation: "这段代码的写法完全正确。编辑器不知道数组里将来会放什么值，也就无从判断找不找得到。"
            }
          ]
        }
      ]
    },
    {
      id: "10.2",
      title: "找不到的情况怎么写",
      syllabus: ["§10.2"],
      estimatedMinutes: 11,
      taughtFeatures: AFTER_CHAPTER_9,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "上一节那段有两处要补：找到了还接着把剩下的格子走完，而找不到的时候屏幕上一个字都没有。要补这两处，只需要一个 `BOOLEAN` 变量。",
            "这种「记录某件事有没有发生过」的变量叫**标志（flag）**。开始时设成 `FALSE`，一旦比中就改成 `TRUE`。循环结束之后看它一眼，就知道到底找没找到——这句话，屏幕上必须有。",
            "有了标志，循环的条件就写得出来了：`WHILE Found = FALSE AND Position <= 5`——**还没找到、而且还没走完**，才继续走。两个条件里任何一个不成立，循环立刻停。这正是第 5 章说的「次数事先不知道」：走几格取决于数据。",
            "`Position` 停在哪里也是结果的一部分：找到时它停在那一格上，没找到时它已经越过上界。所以**先看标志，再决定 `Position` 能不能拿来用**——顺序反了就会报出一个根本不存在的位置。"
          ]
        },
        {
          kind: "example",
          title: "带标志的线性查找",
          fileName: "Example_10_2_a.pseudocode",
          code: [
            "DECLARE Scores : ARRAY[1:5] OF INTEGER",
            "DECLARE Position : INTEGER",
            "DECLARE Target : INTEGER",
            "DECLARE Found : BOOLEAN",
            "Scores[1] ← 30",
            "Scores[2] ← 80",
            "Scores[3] ← 45",
            "Scores[4] ← 80",
            "Scores[5] ← 12",
            "Target ← 99",
            "Found ← FALSE",
            "Position ← 1",
            "WHILE Found = FALSE AND Position <= 5",
            "   IF Scores[Position] = Target THEN",
            "      Found ← TRUE",
            "   ELSE",
            "      Position ← Position + 1",
            "   ENDIF",
            "ENDWHILE",
            "IF Found = TRUE THEN",
            '   OUTPUT "Found at ", Position',
            "ELSE",
            '   OUTPUT "Not in the list"',
            "ENDIF"
          ].join("\n"),
          annotations: [
            { fromLine: 11, toLine: 12, text: "两个起点：还没找到，从第 1 格开始。这两行少一行，循环第一次就判断不了。" },
            { fromLine: 13, toLine: 13, text: "两个继续条件。找到了，或者走过头了，都停。" },
            { fromLine: 14, toLine: 18, text: "比中就把标志立起来——注意这时**不再加 1**，`Position` 要停在命中的那一格上。没比中才往前走。" },
            { fromLine: 20, toLine: 24, text: "循环之后先看标志。这段 `ELSE` 就是上一节缺的那句话。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["Not in the list"]
          }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "把 `Position ← Position + 1` 从 `ELSE` 里挪出来、放到 `ENDIF` 后面（也就是每一轮都加一），找得到的时候会发生什么？",
          options: [
            {
              key: "A",
              label: "会变成找不到",
              correct: false,
              explanation: "`Found` 照样被设成 `TRUE`，所以走的还是「找到了」那一支，只是报出来的格子不对。"
            },
            {
              key: "B",
              label: "运行时越界停下来",
              correct: false,
              explanation: "多加的那一次发生在循环体的末尾，加完循环就判断条件并退出，不会再拿这个下标去取格子。"
            },
            {
              key: "C",
              label: "报出来的位置比真实位置大一",
              correct: true,
              explanation: "对。比中的那一轮把标志立起来之后又多加了一次，`Position` 已经越过命中的格子。第 3 格命中会报成第 4 格。"
            },
            {
              key: "D",
              label: "结果不变，只是多走一步",
              correct: false,
              explanation: "循环确实立刻就停了，但停下来时 `Position` 的值已经被改过，而这个值正是要报出来的答案。"
            }
          ]
        },
        {
          kind: "task",
          id: "10.2.1",
          title: "在名单里找一个数",
          statement: "写一段伪代码：先读入 6 个整数存进数组，再读入一个要找的数，显示它在数组里的位置；不在里面就说一声。同一个数出现两次时，报**第一次**出现的位置。",
          ioSpec: {
            input: [
              "先六行，各一个 `INTEGER`；再一行，是要找的数。每次读取之前都要显示提示语，一字不差：",
              "前六次是 `Enter a number`，最后一次是 `Enter the number to find`"
            ].join("\n"),
            output: [
              "一行。找到时写成：",
              "`Found at <位置>`",
              "找不到时写成：",
              "`Not found`",
              "`Found at` 和位置之间是一个空格。"
            ].join("\n")
          },
          constraints: {
            require: [
              {
                feature: "decl.array-1d",
                reason: "六个数要先全部存下来，才谈得上在里面找。"
              },
              {
                feature: "loop.while",
                reason: "找到就该停下来，走几格事先不知道——这正是 `WHILE` 的场合。"
              },
              {
                feature: "select.if-else",
                reason: "找到和找不到都要有交代，屏幕上不能什么都不显示。"
              }
            ]
          },
          hints: [
            "用一个 `BOOLEAN` 记住「找到了没有」，循环之前先把它设成 `FALSE`。",
            "循环的继续条件有两个：还没找到，而且还没走过上界。",
            "比中的那一轮不要再让下标往前走，否则报出来的位置会多一格。"
          ],
          examples: [
            {
              inputs: ["30", "80", "45", "80", "12", "7", "45"],
              outputs: [
                "Enter a number",
                "Enter a number",
                "Enter a number",
                "Enter a number",
                "Enter a number",
                "Enter a number",
                "Enter the number to find",
                "Found at 3"
              ]
            }
          ],
          referenceSolution: [
            "DECLARE Values : ARRAY[1:6] OF INTEGER",
            "DECLARE Position : INTEGER",
            "DECLARE Target : INTEGER",
            "DECLARE Found : BOOLEAN",
            "FOR Position ← 1 TO 6",
            '   OUTPUT "Enter a number"',
            "   INPUT Values[Position]",
            "NEXT Position",
            'OUTPUT "Enter the number to find"',
            "INPUT Target",
            "Found ← FALSE",
            "Position ← 1",
            "WHILE Found = FALSE AND Position <= 6",
            "   IF Values[Position] = Target THEN",
            "      Found ← TRUE",
            "   ELSE",
            "      Position ← Position + 1",
            "   ENDIF",
            "ENDWHILE",
            "IF Found = TRUE THEN",
            '   OUTPUT "Found at ", Position',
            "ELSE",
            '   OUTPUT "Not found"',
            "ENDIF"
          ].join("\n"),
          tests: [
            { id: "t1", kind: "normal", inputs: ["5", "9", "2", "8", "4", "1", "8"], caseHint: "要找的数在中间某一格，只出现一次。" },
            { id: "t2", kind: "boundary", inputs: ["5", "9", "2", "8", "4", "1", "5"], caseHint: "要找的数就在第一格。" },
            { id: "t3", kind: "boundary", inputs: ["5", "9", "2", "8", "4", "1", "1"], caseHint: "要找的数在最后一格，要一直走到头才碰到。" },
            { id: "t4", kind: "abnormal", inputs: ["5", "9", "2", "8", "4", "1", "7"], caseHint: "要找的数根本不在这批数里。" },
            { id: "t5", kind: "normal", inputs: ["3", "7", "3", "7", "3", "7", "7"], caseHint: "要找的数出现了好几次，应当报最靠前的那一次。" },
            { id: "t6", kind: "extreme", inputs: ["-99999", "0", "0", "0", "0", "99999", "99999"], caseHint: "一批数里混着很大和很小的值，要找的是最大的那个。" }
          ]
        }
      ]
    },
    {
      id: "10.3",
      title: "冒泡排序的思路",
      syllabus: ["§10.2"],
      estimatedMinutes: 10,
      taughtFeatures: AFTER_CHAPTER_9,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "查找是从一排数里挑一个，排序是把整排重新摆好。**冒泡排序（bubble sort）**的办法出奇地笨：它一次只看**相邻的两格**，前面那格比后面那格大，就把这两个值**交换（swap）**过来。",
            "交换两个格子要**借第三个变量**。直接写 `A ← B` 再写 `B ← A` 是不行的：第一句一执行，A 原来的值就被盖掉了，第二句再写回去，两边就都成了 B。所以先把 A 存进一个临时变量，再腾地方。",
            "从头到尾这样比一遍，叫走了**一趟（pass）**。一趟走完，最大的那个数一定被推到了最后一格——它每次比较都比对方大，于是一路往右挪到头，像气泡一样浮上去，名字就是这么来的。",
            "但一趟只安顿了一个数。剩下的还乱着，所以要再走一趟把第二大的送到倒数第二格，再走一趟送第三大的……下一节就把这些趟数套起来。"
          ]
        },
        {
          kind: "example",
          title: "只走一趟",
          fileName: "Example_10_3_a.pseudocode",
          code: [
            "DECLARE Values : ARRAY[1:5] OF INTEGER",
            "DECLARE J : INTEGER",
            "DECLARE Temp : INTEGER",
            "Values[1] ← 3",
            "Values[2] ← 9",
            "Values[3] ← 1",
            "Values[4] ← 7",
            "Values[5] ← 5",
            "FOR J ← 1 TO 4",
            "   IF Values[J] > Values[J + 1] THEN",
            "      Temp ← Values[J]",
            "      Values[J] ← Values[J + 1]",
            "      Values[J + 1] ← Temp",
            "   ENDIF",
            "NEXT J",
            "FOR J ← 1 TO 5",
            "   OUTPUT Values[J]",
            "NEXT J"
          ].join("\n"),
          annotations: [
            { fromLine: 9, toLine: 9, text: "五格只比四对：第 5 格没有右邻居，所以终点是 4 而不是 5。" },
            { fromLine: 10, toLine: 14, text: "只比相邻的两格。整个冒泡排序就只做这一件事，别的都是重复它。" },
            { fromLine: 11, toLine: 13, text: "三步交换：先把左边的值存起来，再把右边的搬过来，最后把存着的那个放到右边。" },
            { fromLine: 16, toLine: 18, text: "一趟之后的样子：最大的 9 已经在最后一格了，前面几个还乱着。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["3", "1", "7", "5", "9"]
          }
        },
        {
          kind: "counterExample",
          title: "不借临时变量的「交换」",
          cases: [
            {
              code: [
                "DECLARE Values : ARRAY[1:2] OF INTEGER",
                "Values[1] ← 3",
                "Values[2] ← 9",
                "Values[1] ← Values[2]",
                "Values[2] ← Values[1]",
                "OUTPUT Values[1]",
                "OUTPUT Values[2]"
              ].join("\n"),
              note: "两行看着像是把值对调，跑出来却是两个 9。第一行把 `Values[1]` 原来的 3 盖掉了，第二行再取 `Values[1]` 时取到的已经是刚搬进去的 9。**这段代码零提示、跑得完**——只是 3 没了。"
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "一排 6 个数，走完**第一趟**之后，下面哪一件事一定成立？",
          options: [
            {
              key: "A",
              label: "整排已经排好了",
              correct: false,
              explanation: "只有碰巧的时候才会。一趟安顿的是末尾那一个，前面的顺序仍然可能是乱的。"
            },
            {
              key: "B",
              label: "至少发生了一次交换",
              correct: false,
              explanation: "本来就已经排好的一排，走一趟一次也不会换。下一节末尾正是利用这一点提前收工。"
            },
            {
              key: "C",
              label: "最大的那个数已经在最后一格",
              correct: true,
              explanation: "对。最大的数无论从哪一格出发，每一次比较都会赢，于是被一路往右换到头。这是一趟唯一能保证的事。"
            },
            {
              key: "D",
              label: "最小的那个数已经在第一格",
              correct: false,
              explanation: "不一定。小的数每趟最多往左挪一格：它只有在跟左邻居比的那一次才会被换过去。"
            }
          ]
        }
      ]
    },
    {
      id: "10.4",
      title: "写出冒泡排序",
      syllabus: ["§10.2"],
      estimatedMinutes: 11,
      taughtFeatures: AFTER_CHAPTER_9,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "一趟送一个数到位，那就多走几趟：**外层数趟数，内层走一趟**——又是一对嵌套循环，只不过这回内层做的事是比较和交换。",
            "5 个数要走几趟？4 趟。前四趟把最大的四个依次安顿好，剩下的那一个自然就在第一格了——**n 个数最多走 n-1 趟**。",
            "内层的终点每趟都往回缩一格：第 `I` 趟开始时，末尾已经有 `I - 1` 个到位了，不必再碰。写成 `FOR J ← 1 TO 5 - I`，随着趟数递增自动缩短。",
            "为什么是 `5 - I` 而不是 `5`？因为内层比的是 `Values[J]` 和 `Values[J + 1]`：J 走到哪儿，右边那一格就得还在数组里。终点写成 5，第一趟 J 就会走到 5，而 `Values[6]` 根本不存在——程序会在那一行停下来。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "考纲要求在 AS 阶段就能写出并使用冒泡排序（§10.2）。"
            }
          ]
        },
        {
          kind: "example",
          title: "完整的冒泡排序",
          fileName: "Example_10_4_a.pseudocode",
          code: [
            "DECLARE Values : ARRAY[1:5] OF INTEGER",
            "DECLARE I : INTEGER",
            "DECLARE J : INTEGER",
            "DECLARE Temp : INTEGER",
            "Values[1] ← 3",
            "Values[2] ← 9",
            "Values[3] ← 1",
            "Values[4] ← 7",
            "Values[5] ← 5",
            "FOR I ← 1 TO 4",
            "   FOR J ← 1 TO 5 - I",
            "      IF Values[J] > Values[J + 1] THEN",
            "         Temp ← Values[J]",
            "         Values[J] ← Values[J + 1]",
            "         Values[J + 1] ← Temp",
            "      ENDIF",
            "   NEXT J",
            "NEXT I",
            "FOR I ← 1 TO 5",
            "   OUTPUT Values[I]",
            "NEXT I"
          ].join("\n"),
          annotations: [
            { fromLine: 10, toLine: 10, text: "外层只管数趟数：5 个数走 4 趟。`I` 在循环体里不用来取格子，它只是「第几趟」。" },
            { fromLine: 11, toLine: 11, text: "内层的终点跟着趟数缩：第 1 趟比到第 4 对，第 4 趟只比第 1 对。" },
            { fromLine: 12, toLine: 16, text: "和上一节那段一模一样。整个排序的力气全在这五行上。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["1", "3", "5", "7", "9"]
          }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "把内层写成 `FOR J ← 1 TO 5`（忘了减趟数），运行会怎样？",
          options: [
            {
              key: "A",
              label: "第一趟走到最后一对时越界，程序停下来",
              correct: true,
              explanation: "对。`J` 走到 5 时要取 `Values[J + 1]`，也就是第 6 格，而数组只有 5 格。程序停在比较那一行。"
            },
            {
              key: "B",
              label: "排序结果正确，只是多比了几次",
              correct: false,
              explanation: "多比几次本身不影响结果，但这里多出来的那一次要读一个不存在的格子，程序根本走不到最后。"
            },
            {
              key: "C",
              label: "编辑器在运行前就拦下来",
              correct: false,
              explanation: "下标是 `J + 1`，是个算出来的值。要等 `J` 真的取到 5 才知道越界，运行前看不出来。"
            },
            {
              key: "D",
              label: "最后一格会被当成 0 参与比较",
              correct: false,
              explanation: "不存在的格子不会被当成 0。越界就是越界，程序会停下来而不是编一个值出来。"
            }
          ]
        },
        {
          kind: "task",
          id: "10.4.1",
          title: "从小到大排好",
          statement: "写一段伪代码：读入 5 个整数存进数组，用冒泡排序把它们从小到大排好，再一行一个显示出来。",
          ioSpec: {
            input: ["五行，各一个 `INTEGER`。每次读取之前都要显示提示语，一字不差：", "`Enter a number`"].join("\n"),
            output: "五行，每行一个整数，从小到大。"
          },
          constraints: {
            require: [
              {
                feature: "decl.array-1d",
                reason: "要反复回头比较和交换，五个数必须先存成一排。"
              },
              {
                feature: "loop.nested",
                reason: "外层数趟数、内层走一趟，冒泡排序天生是两层循环。"
              },
              {
                feature: "select.if",
                reason: "只有前面那格比后面大的时候才交换，不能每次都换。"
              }
            ]
          },
          hints: [
            "先把读入写完再开始排——排序的两层循环里不该还有 `INPUT`。",
            "交换要借一个临时变量，三句话缺一不可。",
            "内层的终点要随趟数缩短，否则最后一次比较会去读数组外面的格子。"
          ],
          examples: [
            {
              inputs: ["3", "9", "1", "7", "5"],
              outputs: [
                "Enter a number",
                "Enter a number",
                "Enter a number",
                "Enter a number",
                "Enter a number",
                "1",
                "3",
                "5",
                "7",
                "9"
              ]
            }
          ],
          referenceSolution: [
            "DECLARE Values : ARRAY[1:5] OF INTEGER",
            "DECLARE I : INTEGER",
            "DECLARE J : INTEGER",
            "DECLARE Temp : INTEGER",
            "FOR I ← 1 TO 5",
            '   OUTPUT "Enter a number"',
            "   INPUT Values[I]",
            "NEXT I",
            "FOR I ← 1 TO 4",
            "   FOR J ← 1 TO 5 - I",
            "      IF Values[J] > Values[J + 1] THEN",
            "         Temp ← Values[J]",
            "         Values[J] ← Values[J + 1]",
            "         Values[J + 1] ← Temp",
            "      ENDIF",
            "   NEXT J",
            "NEXT I",
            "FOR I ← 1 TO 5",
            "   OUTPUT Values[I]",
            "NEXT I"
          ].join("\n"),
          tests: [
            { id: "t1", kind: "normal", inputs: ["4", "2", "8", "6", "0"], caseHint: "五个各不相同的数，顺序是乱的。" },
            { id: "t2", kind: "boundary", inputs: ["1", "2", "3", "4", "5"], caseHint: "读进来的时候本来就已经排好了。" },
            { id: "t3", kind: "boundary", inputs: ["5", "4", "3", "2", "1"], caseHint: "读进来的时候正好是完全倒过来的。" },
            { id: "t4", kind: "normal", inputs: ["7", "7", "7", "7", "7"], caseHint: "五个数完全一样，一次也不需要交换。" },
            { id: "t5", kind: "extreme", inputs: ["99999", "-99999", "0", "99999", "-1"], caseHint: "混着极大和极小的值，还有重复的。" }
          ]
        }
      ]
    },
    {
      id: "10.5",
      title: "加一个标志，排好了就收工",
      syllabus: ["§10.2"],
      estimatedMinutes: 9,
      taughtFeatures: AFTER_CHAPTER_9,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "上一节那段有个浪费：一排本来就已经排好的数，它照样老老实实走满 4 趟，一次都没换过，也不知道自己该停。",
            "看出来只需要再加一个标志：每趟开始前把 `Swapped` 设成 `FALSE`，一旦发生交换就改成 `TRUE`。一趟走完它还是 `FALSE`，就说明这一趟相邻的每一对都已经是对的——**那整排就已经排好了**，后面的趟一趟都不用走。",
            "于是外层从「走满固定趟数」变成「走到不用再走为止」，`FOR` 也就换成了 `REPEAT`：至少得走一趟（不走怎么知道换不换），走完再判断要不要继续。这正是第 5 章挑循环的判据。",
            "改完之后，最好的情况只走一趟，最坏的情况（完全倒过来）还是 n-1 趟。**同一个算法，快慢取决于数据长什么样**——第 18 章比较算法时还会回到这件事。"
          ]
        },
        {
          kind: "example",
          title: "带标志的冒泡排序",
          fileName: "Example_10_5_a.pseudocode",
          code: [
            "DECLARE Values : ARRAY[1:5] OF INTEGER",
            "DECLARE I : INTEGER",
            "DECLARE J : INTEGER",
            "DECLARE Temp : INTEGER",
            "DECLARE Swapped : BOOLEAN",
            "DECLARE Passes : INTEGER",
            "Values[1] ← 3",
            "Values[2] ← 9",
            "Values[3] ← 1",
            "Values[4] ← 7",
            "Values[5] ← 5",
            "Passes ← 0",
            "REPEAT",
            "   Swapped ← FALSE",
            "   Passes ← Passes + 1",
            "   FOR J ← 1 TO 4",
            "      IF Values[J] > Values[J + 1] THEN",
            "         Temp ← Values[J]",
            "         Values[J] ← Values[J + 1]",
            "         Values[J + 1] ← Temp",
            "         Swapped ← TRUE",
            "      ENDIF",
            "   NEXT J",
            "UNTIL Swapped = FALSE",
            'OUTPUT "Passes: ", Passes',
            "FOR I ← 1 TO 5",
            "   OUTPUT Values[I]",
            "NEXT I"
          ].join("\n"),
          annotations: [
            { fromLine: 14, toLine: 14, text: "清零放在每趟的开头，不能放在 `REPEAT` 之前——那样只有第一趟算数。" },
            { fromLine: 21, toLine: 21, text: "只要换过一次就立起来。它回答的是「这一趟有没有动过」。" },
            { fromLine: 24, toLine: 24, text: "一趟都没换，就说明已经排好，循环到此为止。" },
            { fromLine: 25, toLine: 25, text: "这里把趟数显示出来只是为了看得见；真正在用的程序里不需要这一行。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["Passes: 3", "1", "3", "5", "7", "9"]
          }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "把上面那段里的五个数换成 `1 3 5 7 9`（本来就排好了），`Passes` 会显示几？",
          options: [
            {
              key: "A",
              label: "0",
              correct: false,
              explanation: "`REPEAT` 至少执行一次——不先走一趟，根本无从知道要不要交换。"
            },
            {
              key: "B",
              label: "4",
              correct: false,
              explanation: "4 是上一节那种固定趟数的写法。加了标志之后，走满 4 趟只会发生在最坏的情况。"
            },
            {
              key: "C",
              label: "2",
              correct: false,
              explanation: "不需要第二趟。第一趟结束时标志还是 `FALSE`，`UNTIL` 已经成立，不会再进循环。"
            },
            {
              key: "D",
              label: "1",
              correct: true,
              explanation: "对。第一趟把每一对都比了一遍，一次也没换，`Swapped` 保持 `FALSE`，`UNTIL` 的条件成立，循环就结束了。"
            }
          ]
        }
      ]
    }
  ],
  chapterTasks: [
    {
      kind: "chapterTask",
      id: "10.T1",
      title: "排好再找",
      statement: "写一段伪代码：读入 6 个整数，先把它们从小到大排好并逐行显示，然后读入一个要找的数，在**排好之后**的这排数里查找，显示它的位置；不在里面就说一声。",
      ioSpec: {
        input: [
          "先六行，各一个 `INTEGER`；等六个数排好显示完之后，再读入一行，是要找的数。每次读取之前都要显示提示语，一字不差：",
          "前六次是 `Enter a number`，最后一次是 `Enter the number to find`"
        ].join("\n")
      ,
        output: [
          "先六行，每行一个整数，从小到大。然后一行查找结果：",
          "`Found at <位置>`",
          "或者",
          "`Not found`",
          "位置指的是排好之后的位置。同一个数出现多次时报最靠前的那一次。"
        ].join("\n")
      },
      suggestedFeatures: [
        "decl.array-1d",
        "array.index",
        "loop.for",
        "loop.nested",
        "loop.while",
        "select.if",
        "select.if-else",
        "io.input",
        "io.output"
      ],
      hints: [
        "三段事各写各的：读入、排序、查找。中间不要互相插话。",
        "排序用上一节的两层循环；查找用带标志的 `WHILE`，找到就停。",
        "要找的那个数必须等六个数显示完之后才读——顺序反了，屏幕上的先后就不对。"
      ],
      examples: [
        {
          inputs: ["3", "9", "1", "7", "5", "2", "7"],
          outputs: [
            "Enter a number",
            "Enter a number",
            "Enter a number",
            "Enter a number",
            "Enter a number",
            "Enter a number",
            "1",
            "2",
            "3",
            "5",
            "7",
            "9",
            "Enter the number to find",
            "Found at 5"
          ]
        }
      ],
      referenceSolution: [
        "DECLARE Values : ARRAY[1:6] OF INTEGER",
        "DECLARE I : INTEGER",
        "DECLARE J : INTEGER",
        "DECLARE Temp : INTEGER",
        "DECLARE Target : INTEGER",
        "DECLARE Position : INTEGER",
        "DECLARE Found : BOOLEAN",
        "FOR I ← 1 TO 6",
        '   OUTPUT "Enter a number"',
        "   INPUT Values[I]",
        "NEXT I",
        "FOR I ← 1 TO 5",
        "   FOR J ← 1 TO 6 - I",
        "      IF Values[J] > Values[J + 1] THEN",
        "         Temp ← Values[J]",
        "         Values[J] ← Values[J + 1]",
        "         Values[J + 1] ← Temp",
        "      ENDIF",
        "   NEXT J",
        "NEXT I",
        "FOR I ← 1 TO 6",
        "   OUTPUT Values[I]",
        "NEXT I",
        'OUTPUT "Enter the number to find"',
        "INPUT Target",
        "Found ← FALSE",
        "Position ← 1",
        "WHILE Found = FALSE AND Position <= 6",
        "   IF Values[Position] = Target THEN",
        "      Found ← TRUE",
        "   ELSE",
        "      Position ← Position + 1",
        "   ENDIF",
        "ENDWHILE",
        "IF Found = TRUE THEN",
        '   OUTPUT "Found at ", Position',
        "ELSE",
        '   OUTPUT "Not found"',
        "ENDIF"
      ].join("\n"),
      tests: [
        { id: "t1", kind: "normal", inputs: ["4", "2", "8", "6", "0", "9", "6"], caseHint: "六个各不相同的数，要找的那个在中间。" },
        { id: "t2", kind: "boundary", inputs: ["6", "5", "4", "3", "2", "1", "1"], caseHint: "读进来时完全倒过来，要找的是排好之后的第一个。" },
        { id: "t3", kind: "boundary", inputs: ["1", "2", "3", "4", "5", "6", "6"], caseHint: "读进来时就已经排好，要找的是最后一个。" },
        { id: "t4", kind: "abnormal", inputs: ["4", "2", "8", "6", "0", "9", "7"], caseHint: "要找的数不在这批数里。" },
        { id: "t5", kind: "normal", inputs: ["3", "7", "3", "7", "3", "7", "7"], caseHint: "只有两种值各出现几次，要找的那个有好几份。" },
        { id: "t6", kind: "extreme", inputs: ["99999", "-99999", "0", "0", "99999", "-1", "-99999"], caseHint: "混着极大和极小的值，要找的是最小的那个。" }
      ]
    }
  ]
};
