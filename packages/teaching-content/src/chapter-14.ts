import type { Chapter } from "./types.js";
import type { FeatureId } from "@caie-pseudocode/exercise";

/** Chapter 13 结束时学生已经会的写法。 */
const AFTER_CHAPTER_13: FeatureId[] = [
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
  "routine.function", "routine.return", "expr.function-call"
];

/** 14.1 的对照里已经要把一行文字写进文件，所以写入这一套在第一节就放开。 */
const AFTER_14_1: FeatureId[] = [...AFTER_CHAPTER_13, "file.open-write", "file.write", "file.close"];
/** 14.3 才把写出去的东西读回来。 */
const AFTER_14_3: FeatureId[] = [...AFTER_14_1, "file.open-read", "file.read"];
/** 14.4 引入第三种模式。 */
const AFTER_14_4: FeatureId[] = [...AFTER_14_3, "file.open-append"];
/** 14.5 引入 `EOF`。 */
const AFTER_14_5: FeatureId[] = [...AFTER_14_4, "builtin.eof"];

export const chapter14: Chapter = {
  id: 14,
  title: "文本文件",
  level: "AS",
  syllabus: ["§10.3"],
  prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  sections: [
    {
      id: "14.1",
      title: "为什么需要文件",
      syllabus: ["§10.3"],
      estimatedMinutes: 8,
      taughtFeatures: AFTER_14_1,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "到这里为止，程序里所有的数据——变量、数组、记录——都有同一个毛病：**程序一结束，它们就全没了**。下次再运行，一切从头开始，上次输入的东西一个字都不剩。",
            "要让数据活过一次运行，就得把它写到程序外面去。**文本文件（text file）**是最简单的那种去处：一个有名字的地方，里面是一行一行的文字，程序结束之后它还在。",
            "文本文件只装文字。往里写一个数，写进去的是这个数**写出来的样子**；读回来的也是一行文字，不会自动变回数——这一点后面几节会反复碰到。",
            "用文件的四件事总是这个顺序：**打开、读或写、关掉**。中间那一步做什么由打开时选的方式决定，下面几节一件一件说。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "考纲要求能使用文本文件存储和读取数据（§10.3）。"
            }
          ]
        },
        {
          kind: "comparison",
          title: "记在变量里，还是记到文件里",
          intro: "把一个名字存起来。",
          panes: [
            {
              label: "自然语言",
              language: "natural",
              code: ["记在脑子里：这次谈话结束就忘了。", "写在纸上：明天还能翻出来看。"].join("\n"),
              note: "变量是脑子，文件是纸。差别不在这一刻能不能用，而在下次还在不在。"
            },
            {
              label: "变量",
              language: "pseudocode",
              code: ["DECLARE Best : STRING", 'Best ← "Ada"', "OUTPUT Best"].join("\n"),
              note: "这一次运行里用起来一点问题都没有。但程序一结束，`Best` 就不存在了，下次运行得重新输入一遍。"
            },
            {
              label: "文件",
              language: "pseudocode",
              code: [
                'OPENFILE "Best.txt" FOR WRITE',
                'WRITEFILE "Best.txt", "Ada"',
                'CLOSEFILE "Best.txt"',
                'OUTPUT "Saved"'
              ].join("\n"),
              note: "屏幕上只多了一句 `Saved`，看不见 `Ada`——它不在屏幕上，在 `Best.txt` 里，下次运行还能读出来。"
            },
            {
              label: "Python",
              language: "python",
              code: ['with open("best.txt", "w") as f:', '    f.write("Ada\\n")'].join("\n"),
              note: "三步是一样的：打开、写、关掉。Python 的 `with` 只是把「关掉」这一步自动化了。"
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "下面哪件事**只有**文件做得到，变量和数组做不到？",
          options: [
            {
              key: "A",
              label: "存放不同类型的数据",
              correct: false,
              explanation: "那是记录的活。文本文件反而只认文字，什么进去都变成文字。"
            },
            {
              key: "B",
              label: "把数据显示给用户看",
              correct: false,
              explanation: "显示用 `OUTPUT`。写进文件恰恰是**不**显示——屏幕上看不见它。"
            },
            {
              key: "C",
              label: "一次存很多条数据",
              correct: false,
              explanation: "数组就能做到，而且取用比文件方便得多。条数多不是用文件的理由。"
            },
            {
              key: "D",
              label: "把这次运行输入的东西留给下一次运行用",
              correct: true,
              explanation: "对。程序一结束，变量和数组连同里面的值一起消失；文件留在程序外面，下一次运行还能打开它。"
            }
          ]
        }
      ]
    },
    {
      id: "14.2",
      title: "`OPENFILE`、`WRITEFILE`、`CLOSEFILE`",
      syllabus: ["§10.3"],
      estimatedMinutes: 10,
      taughtFeatures: AFTER_14_1,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "写一个文件要三句话。`OPENFILE \"Names.txt\" FOR WRITE` 打开它：文件名写成一段 `STRING`，`FOR` 后面说明这次要拿它干什么。",
            "`WRITEFILE \"Names.txt\", \"Ada\"` 往里写**一整行**。写完位置自动往下挪一行，所以接着再写一句就是第二行——不用自己管行号。",
            "`CLOSEFILE \"Names.txt\"` 关掉。**每一句都要重复写一遍文件名**，因为程序里可以同时开着好几个文件，每一句都得说清是哪一个。",
            "关掉这一步不能省。文件开着的时候别人（包括这段程序自己）没法再打开它——下一节要把刚写的东西读回来，就必须先关。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "文本文件用 `OPENFILE <文件> FOR READ|WRITE|APPEND` 打开，`WRITEFILE <文件>, <数据>` 写入一行，`CLOSEFILE <文件>` 关闭（G§9.1）。"
            }
          ]
        },
        {
          kind: "example",
          title: "把两个名字写出去",
          fileName: "Example_14_2_a.pseudocode",
          code: [
            'OPENFILE "Names.txt" FOR WRITE',
            'WRITEFILE "Names.txt", "Ada"',
            'WRITEFILE "Names.txt", "Bob"',
            'CLOSEFILE "Names.txt"',
            'OUTPUT "Saved 2 names"'
          ].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 1, text: "`FOR WRITE` 打开的同时就把文件清空了——下一节会看到这一点的后果。" },
            { fromLine: 2, toLine: 3, text: "两句写出两行。位置自己往下走，不用告诉它写第几行。" },
            { fromLine: 5, toLine: 5, text: "屏幕上只有这一句。前四行的成果在文件里，看不见——这正是文件和 `OUTPUT` 的区别。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["Saved 2 names"]
          }
        },
        {
          kind: "counterExample",
          title: "两种漏了 `OPENFILE` 的写法",
          cases: [
            {
              title: "没打开就写",
              code: ['WRITEFILE "Names.txt", "Ada"'].join("\n"),
              note: "文件得先打开才能写。这一条运行前就能查出来——编辑器顺着代码看得到这个文件从头到尾没被打开过。",
              expectDiagnostics: [
                { severity: "error", ruleId: "FILE-003", line: 1, text: "这个文件还没打开，写不进去。" }
              ]
            },
            {
              title: "关了两遍",
              code: [
                'OPENFILE "Names.txt" FOR WRITE',
                'WRITEFILE "Names.txt", "Ada"',
                'CLOSEFILE "Names.txt"',
                'CLOSEFILE "Names.txt"'
              ].join("\n"),
              note: "第一句 `CLOSEFILE` 之后文件已经关了，第二句没有东西可关。多写一句看着无害，但它说明你对「现在这个文件是开着还是关着」记岔了。",
              expectDiagnostics: [
                { severity: "error", ruleId: "FILE-003", line: 4, text: "这个文件已经关掉了，不能再关一次。" }
              ]
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "为什么 `WRITEFILE` 和 `CLOSEFILE` 都要把文件名再写一遍？",
          options: [
            {
              key: "A",
              label: "因为 `OPENFILE` 之后文件名就忘了",
              correct: false,
              explanation: "没忘，文件一直开着。重写文件名是为了指明是哪一个，不是因为它丢了。"
            },
            {
              key: "B",
              label: "因为程序里可以同时开着好几个文件，每一句都得说清是对哪一个",
              correct: true,
              explanation: "对。一边读一个文件一边写另一个是很常见的做法（14.6 就要这么干），所以每一句都得指名道姓。"
            },
            {
              key: "C",
              label: "因为文件名每次都可能不一样",
              correct: false,
              explanation: "同一个文件从打开到关掉当然是同一个名字。能变的是你打开的是哪个文件，不是它中途改名。"
            },
            {
              key: "D",
              label: "只是写法要求，省掉也能跑",
              correct: false,
              explanation: "省不掉。不写文件名这几句就不完整，编辑器会当成写错了。"
            }
          ]
        }
      ]
    },
    {
      id: "14.3",
      title: "`READFILE`：把它读回来",
      syllabus: ["§10.3"],
      estimatedMinutes: 11,
      taughtFeatures: AFTER_14_3,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "读要用 `FOR READ` 打开：`OPENFILE \"Names.txt\" FOR READ`。这种方式不改动文件内容，只是从第 1 行开始往下看。",
            "`READFILE \"Names.txt\", Line` 读**当前这一行**，放进 `Line` 这个变量里，然后位置往下挪一行。下一句 `READFILE` 读到的就是下一行——和写的时候一样，位置自己走。",
            "接收的那个变量**必须是 `STRING`**。文件里装的就是文字，哪怕那一行看起来是个数字，读回来也是一段文字；写成 `INTEGER` 变量接，运行前就被拦下来。",
            "还有一件事值得先记住：**`FOR READ` 打开一个不存在的文件会直接停下来**。所以下面每个例子都是先写再读——这一段程序自己把文件准备好，不指望它本来就在。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "`READFILE <文件>, <变量>` 的目标变量应为 `STRING`（G§9.1）。"
            }
          ]
        },
        {
          kind: "example",
          title: "先写两行，再一行一行读回来",
          fileName: "Example_14_3_a.pseudocode",
          code: [
            'OPENFILE "Names.txt" FOR WRITE',
            'WRITEFILE "Names.txt", "Ada"',
            'WRITEFILE "Names.txt", "Bob"',
            'CLOSEFILE "Names.txt"',
            "DECLARE Line : STRING",
            'OPENFILE "Names.txt" FOR READ',
            'READFILE "Names.txt", Line',
            'OUTPUT "1: ", Line',
            'READFILE "Names.txt", Line',
            'OUTPUT "2: ", Line',
            'CLOSEFILE "Names.txt"'
          ].join("\n"),
          annotations: [
            { fromLine: 1, toLine: 4, text: "先把文件写出来再关掉。不关就读不了——文件同一时刻只能开着一个。" },
            { fromLine: 5, toLine: 5, text: "接收的变量是 `STRING`。这一行写成 `INTEGER` 的话，第 7 行就过不去。" },
            { fromLine: 7, toLine: 9, text: "两句 `READFILE` 读到的是两行不同的内容：位置在第一句之后自己往下走了一行。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["1: Ada", "2: Bob"]
          }
        },
        {
          kind: "counterExample",
          title: "读不出来的两种情况",
          cases: [
            {
              title: "拿 `INTEGER` 变量去接",
              code: [
                "DECLARE N : INTEGER",
                'OPENFILE "Nums.txt" FOR WRITE',
                'WRITEFILE "Nums.txt", 5',
                'CLOSEFILE "Nums.txt"',
                'OPENFILE "Nums.txt" FOR READ',
                'READFILE "Nums.txt", N',
                'CLOSEFILE "Nums.txt"'
              ].join("\n"),
              note: "写进去的 `5` 在文件里已经是文字了。读回来只能进 `STRING`——**文件不记得它原来是个数**，而伪代码里没有把这段文字变回数的办法。",
              expectDiagnostics: [
                { severity: "error", ruleId: "FILE-002", line: 6, text: "读文件只能读进 `STRING` 变量。" }
              ]
            },
            {
              title: "打开一个不存在的文件来读",
              code: [
                "DECLARE Line : STRING",
                'OPENFILE "Ghost.txt" FOR READ',
                'READFILE "Ghost.txt", Line',
                'CLOSEFILE "Ghost.txt"'
              ].join("\n"),
              note: "这段代码本身没有任何写法问题，所以运行前查不出来——要等真的去找这个文件，发现没有，程序才停在打开那一行。",
              expectRuntimeError: {
                code: "RT2005",
                line: 2,
                text: "要读的这个文件不存在，程序停在打开它的那一行。"
              }
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "连着写两句 `READFILE \"Names.txt\", Line`，第二句读到的是什么？",
          options: [
            {
              key: "A",
              label: "还是第 1 行，因为没告诉它往下走",
              correct: false,
              explanation: "位置是自己走的。读完一行之后它就指向下一行了，不需要另外一句去推它。"
            },
            {
              key: "B",
              label: "第 2 行",
              correct: true,
              explanation: "对。`READFILE` 读完当前行之后位置加一，所以连着读就是一行一行往下。写的时候也是同一套规矩。"
            },
            {
              key: "C",
              label: "整个文件的内容拼在一起",
              correct: false,
              explanation: "`READFILE` 一次只读一行，读多少行就得写多少句（或者让循环去写）。"
            },
            {
              key: "D",
              label: "最后一行",
              correct: false,
              explanation: "位置每次只往下挪一格，不会跳到末尾。"
            }
          ]
        },
        {
          kind: "task",
          id: "14.3.1",
          title: "存下来再念一遍",
          statement: "写一段伪代码：读入 3 个名字，逐个写进一个文本文件；写完关掉，再把这个文件打开读回来，一行一个显示出来。文件名自己定。",
          ioSpec: {
            input: ["三行，各一个名字（`STRING`）。每次读取之前都要显示提示语，一字不差：", "`Enter a name`"].join("\n"),
            output: "三行，就是读进来的那三个名字，顺序不变。"
          },
          constraints: {
            require: [
              {
                feature: "file.write",
                reason: "题目要求先把名字写到文件里去，而不是留在变量里。"
              },
              {
                feature: "file.read",
                reason: "显示的内容必须是从文件读回来的，不能直接用刚才输入的变量。"
              },
              {
                feature: "file.close",
                reason: "写完不关，同一个文件就打不开来读。"
              }
            ]
          },
          hints: [
            "三段：`FOR WRITE` 写三行、`CLOSEFILE`、`FOR READ` 读三行。中间那一句不能省。",
            "写和读都可以放在 `FOR` 循环里，因为行数是知道的——正好三行。",
            "接收读到的内容的那个变量必须是 `STRING`。"
          ],
          examples: [
            {
              inputs: ["Ada", "Bob", "Cal"],
              outputs: ["Enter a name", "Enter a name", "Enter a name", "Ada", "Bob", "Cal"]
            }
          ],
          referenceSolution: [
            "DECLARE Name : STRING",
            "DECLARE I : INTEGER",
            'OPENFILE "Names.txt" FOR WRITE',
            "FOR I ← 1 TO 3",
            '   OUTPUT "Enter a name"',
            "   INPUT Name",
            '   WRITEFILE "Names.txt", Name',
            "NEXT I",
            'CLOSEFILE "Names.txt"',
            'OPENFILE "Names.txt" FOR READ',
            "FOR I ← 1 TO 3",
            '   READFILE "Names.txt", Name',
            "   OUTPUT Name",
            "NEXT I",
            'CLOSEFILE "Names.txt"'
          ].join("\n"),
          tests: [
            { id: "t1", kind: "normal", inputs: ["Red", "Green", "Blue"], caseHint: "三个普通的名字。" },
            { id: "t2", kind: "normal", inputs: ["Two words", "X", "Something longer"], caseHint: "有的名字里带空格，有的只有一个字母。" },
            { id: "t3", kind: "boundary", inputs: ["Same", "Same", "Same"], caseHint: "三个名字完全一样，顺序看不出来但行数得对。" },
            { id: "t4", kind: "boundary", inputs: ["A", "B", "C"], caseHint: "三个名字都只有一个字母。" },
            { id: "t5", kind: "extreme", inputs: ["QWERTYUIOPASDFGHJKLZXCVBNM", "Z", "Mixed Case Name"], caseHint: "一个特别长，一个特别短。" }
          ]
        }
      ]
    },
    {
      id: "14.4",
      title: "三种模式：`READ`、`WRITE`、`APPEND`",
      syllabus: ["§10.3"],
      estimatedMinutes: 10,
      taughtFeatures: AFTER_14_4,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "`OPENFILE` 的 `FOR` 后面只有三个词可写，各管一件事。`READ`：从第 1 行开始往下读，一个字都不改。`WRITE`：**打开的一瞬间就把原有内容全部清空**，然后从第 1 行开始写。`APPEND`：保留原有内容，从最后一行的后面接着写。",
            "`WRITE` 那条要特别小心：它不是「准备往里写点东西」，而是「这个文件从现在起重新来过」。想在已有内容后面添一行却写成了 `FOR WRITE`，**原来的东西一句提示都不给就没了**。",
            "选哪个的判据很短：**原来的内容还要不要？**不要就 `WRITE`，要留着就 `APPEND`，只是看看就 `READ`。",
            "模式一旦选定就管住了这次能做什么：`FOR READ` 打开的文件不能 `WRITEFILE`，`FOR WRITE` 打开的不能 `READFILE`。要换着来，就得先 `CLOSEFILE` 再用另一种方式重新打开。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "`WRITEFILE` 仅用于 `WRITE` 或 `APPEND` 模式；同一文件应一次只以一种模式打开（G§9.1）。"
            }
          ]
        },
        {
          kind: "example",
          title: "`APPEND` 留着，`WRITE` 抹掉",
          fileName: "Example_14_4_a.pseudocode",
          code: [
            "DECLARE Line : STRING",
            'OPENFILE "Log.txt" FOR WRITE',
            'WRITEFILE "Log.txt", "first"',
            'CLOSEFILE "Log.txt"',
            'OPENFILE "Log.txt" FOR APPEND',
            'WRITEFILE "Log.txt", "second"',
            'CLOSEFILE "Log.txt"',
            'OPENFILE "Log.txt" FOR READ',
            'READFILE "Log.txt", Line',
            'OUTPUT "after append 1: ", Line',
            'READFILE "Log.txt", Line',
            'OUTPUT "after append 2: ", Line',
            'CLOSEFILE "Log.txt"',
            'OPENFILE "Log.txt" FOR WRITE',
            'WRITEFILE "Log.txt", "third"',
            'CLOSEFILE "Log.txt"',
            'OPENFILE "Log.txt" FOR READ',
            'READFILE "Log.txt", Line',
            'OUTPUT "after write 1: ", Line',
            'CLOSEFILE "Log.txt"'
          ].join("\n"),
          annotations: [
            { fromLine: 5, toLine: 6, text: "`APPEND` 接在后面写。文件现在有两行。" },
            { fromLine: 9, toLine: 12, text: "读出来确实是两行，`first` 还在。" },
            { fromLine: 14, toLine: 15, text: "同样是写一行，这次用 `WRITE`——打开那一瞬间前两行就没了。" },
            { fromLine: 18, toLine: 19, text: "再读，第 1 行已经是 `third`。原来那两行找不回来了。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["after append 1: first", "after append 2: second", "after write 1: third"]
          }
        },
        {
          kind: "counterExample",
          title: "用 `FOR READ` 打开却想往里写",
          cases: [
            {
              code: [
                'OPENFILE "Log.txt" FOR WRITE',
                'CLOSEFILE "Log.txt"',
                'OPENFILE "Log.txt" FOR READ',
                'WRITEFILE "Log.txt", "x"',
                'CLOSEFILE "Log.txt"'
              ].join("\n"),
              note: "打开的方式说了这次只读，那这次就只能读。想写就先关掉、再用 `FOR WRITE` 或 `FOR APPEND` 打开一次。",
              expectDiagnostics: [
                { severity: "error", ruleId: "FILE-003", line: 4, text: "这个文件是按只读方式打开的，写不进去。" }
              ]
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "一个文件里已经有三行。用 `FOR WRITE` 打开它、什么都不写就 `CLOSEFILE`，文件里还剩几行？",
          options: [
            {
              key: "A",
              label: "四行，多出一行空的",
              correct: false,
              explanation: "没写就不会多出行。`WRITEFILE` 才会添行。"
            },
            {
              key: "B",
              label: "编辑器会拦住这种没意义的操作",
              correct: false,
              explanation: "不拦。「打开准备写，结果发现没什么可写」在程序里很正常，编辑器没法判断你是不是真想清空。"
            },
            {
              key: "C",
              label: "三行，因为没写东西进去",
              correct: false,
              explanation: "清空发生在**打开**的那一刻，不是写的时候。一句 `WRITEFILE` 都没有，那三行照样已经没了。"
            },
            {
              key: "D",
              label: "零行",
              correct: true,
              explanation: "对。`FOR WRITE` 一打开就把文件清空。这也是「想添一行却写成 `WRITE`」特别危险的原因——没有任何提示。"
            }
          ]
        }
      ]
    },
    {
      id: "14.5",
      title: "`EOF`：读到哪儿算完",
      syllabus: ["§10.3"],
      estimatedMinutes: 11,
      taughtFeatures: AFTER_14_5,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "上面那些例子都知道文件里有几行，所以用 `FOR` 就够了。可真实的文件通常**不知道有几行**——那是别人写进去的，或者上次运行留下的。",
            "`EOF(\"Names.txt\")` 回答的就是这个问题：当前位置已经越过最后一行了吗？越过了还 `TRUE`，还有行可读就是 `FALSE`。名字来自 **文件末尾（end of file）**。",
            "所以读整个文件的标准写法是 `WHILE NOT EOF(\"Names.txt\")`：还没到末尾就继续读一行。这是第 5 章说的「次数事先不知道」，而且**一行都没有的文件应该一次都不读**——正好是前测循环。",
            "少了这道判断，读到末尾之后再读一句，程序就停在那一行。文件里到底有几行不是你能假设的事，**能读多少行要问 `EOF`，不要靠记**。"
          ],
          callouts: [
            {
              source: "CAIE",
              text: "`EOF(<文件>)` 返回 `BOOLEAN`，用于判断是否已到文件末尾（G§9.1）。"
            }
          ]
        },
        {
          kind: "example",
          title: "读完整个文件，顺便数数有几行",
          fileName: "Example_14_5_a.pseudocode",
          code: [
            "DECLARE Line : STRING",
            "DECLARE Count : INTEGER",
            'OPENFILE "Names.txt" FOR WRITE',
            'WRITEFILE "Names.txt", "Ada"',
            'WRITEFILE "Names.txt", "Bob"',
            'WRITEFILE "Names.txt", "Cal"',
            'CLOSEFILE "Names.txt"',
            "Count ← 0",
            'OPENFILE "Names.txt" FOR READ',
            'WHILE NOT EOF("Names.txt")',
            '   READFILE "Names.txt", Line',
            "   Count ← Count + 1",
            '   OUTPUT Count, ": ", Line',
            "ENDWHILE",
            'CLOSEFILE "Names.txt"',
            'OUTPUT "Total: ", Count'
          ].join("\n"),
          annotations: [
            { fromLine: 10, toLine: 14, text: "循环的条件只看 `EOF`。这段代码不知道也不需要知道文件里有三行——换成三十行它一个字都不用改。" },
            { fromLine: 11, toLine: 11, text: "`READFILE` 在循环体的第一句。位置每读一行就往下走，所以 `EOF` 迟早会变成 `TRUE`。" },
            { fromLine: 16, toLine: 16, text: "行数是数出来的，不是事先知道的。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["1: Ada", "2: Bob", "3: Cal", "Total: 3"]
          }
        },
        {
          kind: "counterExample",
          title: "多读了一行",
          cases: [
            {
              code: [
                "DECLARE Line : STRING",
                'OPENFILE "One.txt" FOR WRITE',
                'WRITEFILE "One.txt", "only"',
                'CLOSEFILE "One.txt"',
                'OPENFILE "One.txt" FOR READ',
                'READFILE "One.txt", Line',
                "OUTPUT Line",
                'READFILE "One.txt", Line',
                "OUTPUT Line",
                'CLOSEFILE "One.txt"'
              ].join("\n"),
              note: "文件里只有一行，却读了两句。第一句好好的，第二句已经没有行可读——**程序会先把第一行显示出来再停下来**，所以屏幕上看得到一部分结果，很容易误以为整段都跑完了。",
              expectRuntimeError: {
                code: "RT2002",
                line: 8,
                text: "已经读到文件末尾了，这一句没有行可读。"
              }
            }
          ]
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "一个刚用 `FOR WRITE` 创建、一行都没写的空文件，用 `FOR READ` 打开之后 `EOF` 是什么？",
          options: [
            {
              key: "A",
              label: "`TRUE`",
              correct: true,
              explanation: "对。所以 `WHILE NOT EOF(...)` 对空文件一次都不会进循环——这正是它该用前测循环而不是 `REPEAT` 的原因。"
            },
            {
              key: "B",
              label: "程序会因为文件是空的而停下来",
              correct: false,
              explanation: "空文件是完全正常的文件，打开它没有任何问题。停下来的是「已经到末尾还硬读一句」。"
            },
            {
              key: "C",
              label: "要看这个文件之前有没有内容",
              correct: false,
              explanation: "`FOR WRITE` 打开的那一刻就把原有内容清空了，所以现在它确实一行都没有。"
            },
            {
              key: "D",
              label: "`FALSE`，要读一次才知道",
              correct: false,
              explanation: "不用读就知道。`EOF` 问的是「当前位置有没有越过最后一行」，空文件一打开就已经越过了。"
            }
          ]
        },
        {
          kind: "task",
          id: "14.5.1",
          title: "存下来，再编号念一遍",
          statement: "写一段伪代码：读入 4 行文字，逐行写进一个文本文件；写完关掉，再用 `EOF` 控制的循环把整个文件读回来，一行一个显示，每行前面加上行号。**不要用 `FOR` 循环去读**——读的时候就当作不知道文件里有几行。",
          ioSpec: {
            input: ["四行文字（`STRING`）。每次读取之前都要显示提示语，一字不差：", "`Enter a line`"].join("\n"),
            output: ["四行，写成：", "`<行号>: <那一行的内容>`", "行号从 1 开始，冒号后面一个空格。"].join("\n")
          },
          constraints: {
            require: [
              {
                feature: "builtin.eof",
                reason: "题目要求读的时候不许假设文件有几行，只能问 `EOF`。"
              },
              {
                feature: "loop.while",
                reason: "一行都没有的文件应该一次都不读，所以要用先看条件的循环。"
              },
              {
                feature: "file.read",
                reason: "显示的内容必须是从文件读回来的。"
              }
            ]
          },
          hints: [
            "写的时候行数是知道的，可以用 `FOR`；读的时候不知道，要用 `WHILE NOT EOF(...)`。",
            "行号用一个从 0 开始的计数变量，每读一行加一。",
            "写完一定要 `CLOSEFILE`，否则同一个文件打不开来读。"
          ],
          examples: [
            {
              inputs: ["red", "green", "blue", "white"],
              outputs: [
                "Enter a line",
                "Enter a line",
                "Enter a line",
                "Enter a line",
                "1: red",
                "2: green",
                "3: blue",
                "4: white"
              ]
            }
          ],
          referenceSolution: [
            "DECLARE Line : STRING",
            "DECLARE I : INTEGER",
            "DECLARE Count : INTEGER",
            'OPENFILE "Notes.txt" FOR WRITE',
            "FOR I ← 1 TO 4",
            '   OUTPUT "Enter a line"',
            "   INPUT Line",
            '   WRITEFILE "Notes.txt", Line',
            "NEXT I",
            'CLOSEFILE "Notes.txt"',
            "Count ← 0",
            'OPENFILE "Notes.txt" FOR READ',
            'WHILE NOT EOF("Notes.txt")',
            '   READFILE "Notes.txt", Line',
            "   Count ← Count + 1",
            '   OUTPUT Count, ": ", Line',
            "ENDWHILE",
            'CLOSEFILE "Notes.txt"'
          ].join("\n"),
          tests: [
            { id: "t1", kind: "normal", inputs: ["one", "two", "three", "four"], caseHint: "四行普通的文字。" },
            { id: "t2", kind: "normal", inputs: ["a b c", "d", "e f", "g h i j"], caseHint: "有的行里带空格，长短不一。" },
            { id: "t3", kind: "boundary", inputs: ["x", "x", "x", "x"], caseHint: "四行内容完全一样，只有行号能区分。" },
            { id: "t4", kind: "boundary", inputs: ["1", "2", "3", "4"], caseHint: "写进去的看着像数字，读回来仍然是文字。" },
            { id: "t5", kind: "extreme", inputs: ["Q", "WERTYUIOPASDFGHJKLZXCVBNM", "e", "R"], caseHint: "一行特别长，其余都只有一个字母。" }
          ]
        }
      ]
    },
    {
      id: "14.6",
      title: "完整处理一个文件",
      syllabus: ["§10.3"],
      estimatedMinutes: 9,
      taughtFeatures: AFTER_14_5,
      blocks: [
        {
          kind: "explanation",
          paragraphs: [
            "真正用得上文件的程序多半长成同一个样子：**读一个文件 → 一行一行处理 → 把结果写进另一个文件**。中间那一步可以是筛选、统计、改写，形状都一样。",
            "关键在于**两个文件同时开着**：一个 `FOR READ`，一个 `FOR WRITE`。每一句 `READFILE` / `WRITEFILE` 都写着自己的文件名，所以互不干扰——这就是 14.2 里说的「每一句都要指名道姓」的用处。",
            "**不要一边读一边往同一个文件里写。**同一个文件同一时刻只能开着一个，而且 `FOR WRITE` 一打开就把你正要读的内容清空了。要改一个文件，做法是「读旧的、写新的」。",
            "最后别忘了两个文件都要 `CLOSEFILE`。写的那个不关，接下来想读它就打不开。"
          ]
        },
        {
          kind: "example",
          title: "把长的那些挑进另一个文件",
          fileName: "Example_14_6_a.pseudocode",
          code: [
            "DECLARE Line : STRING",
            'OPENFILE "In.txt" FOR WRITE',
            'WRITEFILE "In.txt", "ada"',
            'WRITEFILE "In.txt", "bo"',
            'WRITEFILE "In.txt", "cathy"',
            'CLOSEFILE "In.txt"',
            'OPENFILE "In.txt" FOR READ',
            'OPENFILE "Out.txt" FOR WRITE',
            'WHILE NOT EOF("In.txt")',
            '   READFILE "In.txt", Line',
            "   IF LENGTH(Line) >= 3 THEN",
            '      WRITEFILE "Out.txt", Line',
            "   ENDIF",
            "ENDWHILE",
            'CLOSEFILE "In.txt"',
            'CLOSEFILE "Out.txt"',
            'OPENFILE "Out.txt" FOR READ',
            'WHILE NOT EOF("Out.txt")',
            '   READFILE "Out.txt", Line',
            "   OUTPUT Line",
            "ENDWHILE",
            'CLOSEFILE "Out.txt"'
          ].join("\n"),
          annotations: [
            { fromLine: 7, toLine: 8, text: "两个文件同时开着，一个只读一个只写。名字不同，所以互不影响。" },
            { fromLine: 9, toLine: 14, text: "整个处理就这一个循环：读一行、判断、够格的写出去。`EOF` 管的是读的那个文件。" },
            { fromLine: 15, toLine: 16, text: "两个都要关。下面要读 `Out.txt`，不关就打不开。" },
            { fromLine: 17, toLine: 22, text: "把结果念出来只是为了看得见——真正的成果是 `Out.txt` 这个文件。" }
          ],
          sampleRun: {
            inputs: [],
            outputs: ["ada", "cathy"]
          }
        },
        {
          kind: "quiz",
          type: "single-choice",
          prompt: "想把一个文件里的每一行都改成大写再存回去。下面哪种做法可行？",
          options: [
            {
              key: "A",
              label: "先 `FOR READ` 读完全部内容，再 `FOR WRITE` 打开同一个文件写回去",
              correct: false,
              explanation: "这个思路是对的，但得先把读到的内容存进数组之类的地方——读完必须先 `CLOSEFILE`，而文件里的内容在 `FOR WRITE` 打开那一刻就没了。"
            },
            {
              key: "B",
              label: "同时用 `FOR READ` 和 `FOR WRITE` 打开这一个文件，边读边写回去",
              correct: false,
              explanation: "同一个文件同一时刻只能开着一个，这一步就过不去；就算过得去，`FOR WRITE` 一打开就把要读的内容清空了。"
            },
            {
              key: "C",
              label: "读原文件、写一个新文件，处理完再把新文件当作结果",
              correct: true,
              explanation: "对。「读旧的、写新的」是处理文件的标准形状，两个文件同时开着，各干各的。"
            },
            {
              key: "D",
              label: "用 `FOR APPEND` 打开原文件，把大写的行接在后面",
              correct: false,
              explanation: "那样文件里会变成「原来的小写 + 新加的大写」，原来那些一行都没少。"
            }
          ]
        }
      ]
    }
  ],
  chapterTasks: [
    {
      kind: "chapterTask",
      id: "14.T1",
      title: "挑出长名字",
      statement: "写一段伪代码：读入 5 个名字写进一个文本文件；然后把这个文件读回来，把**长度 5 个字符及以上**的名字挑出来写进第二个文件；最后把第二个文件读出来显示，并在末尾报出挑中了几个。读文件时都不许假设有几行。",
      ioSpec: {
        input: ["五行，各一个名字（`STRING`）。每次读取之前都要显示提示语，一字不差：", "`Enter a name`"].join("\n"),
        output: [
          "先是挑中的那些名字，一行一个，顺序和输入时一样；最后一行写成：",
          "`Count: <挑中的个数>`",
          "冒号后面一个空格。一个都没挑中时就只有最后这一行。"
        ].join("\n")
      },
      suggestedFeatures: [
        "file.open-write",
        "file.open-read",
        "file.write",
        "file.read",
        "file.close",
        "builtin.eof",
        "builtin.length",
        "loop.while",
        "select.if",
        "io.input",
        "io.output"
      ],
      hints: [
        "三段：写第一个文件、把第一个筛进第二个、把第二个念出来。每段之间都要把用完的文件关掉。",
        "筛选那一段两个文件同时开着，一个 `FOR READ` 一个 `FOR WRITE`，每一句都写清是哪一个。",
        "个数在念第二个文件的时候顺手数就行，不必在筛选的时候数。"
      ],
      examples: [
        {
          inputs: ["Ada", "Belinda", "Cal", "Dorothy", "Eve"],
          outputs: [
            "Enter a name",
            "Enter a name",
            "Enter a name",
            "Enter a name",
            "Enter a name",
            "Belinda",
            "Dorothy",
            "Count: 2"
          ]
        }
      ],
      referenceSolution: [
        "DECLARE Name : STRING",
        "DECLARE I : INTEGER",
        "DECLARE Count : INTEGER",
        'OPENFILE "Names.txt" FOR WRITE',
        "FOR I ← 1 TO 5",
        '   OUTPUT "Enter a name"',
        "   INPUT Name",
        '   WRITEFILE "Names.txt", Name',
        "NEXT I",
        'CLOSEFILE "Names.txt"',
        'OPENFILE "Names.txt" FOR READ',
        'OPENFILE "Long.txt" FOR WRITE',
        'WHILE NOT EOF("Names.txt")',
        '   READFILE "Names.txt", Name',
        "   IF LENGTH(Name) >= 5 THEN",
        '      WRITEFILE "Long.txt", Name',
        "   ENDIF",
        "ENDWHILE",
        'CLOSEFILE "Names.txt"',
        'CLOSEFILE "Long.txt"',
        "Count ← 0",
        'OPENFILE "Long.txt" FOR READ',
        'WHILE NOT EOF("Long.txt")',
        '   READFILE "Long.txt", Name',
        "   Count ← Count + 1",
        "   OUTPUT Name",
        "ENDWHILE",
        'CLOSEFILE "Long.txt"',
        'OUTPUT "Count: ", Count'
      ].join("\n"),
      tests: [
        { id: "t1", kind: "normal", inputs: ["Alice", "Bo", "Charlie", "Di", "Edward"], caseHint: "长短掺着来，挑中的不止一个。" },
        { id: "t2", kind: "boundary", inputs: ["Anna", "Bob", "Cy", "Dee", "Eli"], caseHint: "一个都够不着长度门槛。" },
        { id: "t3", kind: "boundary", inputs: ["Abcde", "Fghij", "Klmno", "Pqrst", "Uvwxy"], caseHint: "五个名字都正好踩在长度门槛上。" },
        { id: "t4", kind: "normal", inputs: ["Ann", "Two words", "Bo", "Cy", "Di"], caseHint: "挑中的只有一个，而且里面带空格。" },
        { id: "t5", kind: "extreme", inputs: ["A", "QWERTYUIOPASDFGHJKLZXCVBNM", "B", "C", "D"], caseHint: "一个特别长，其余都只有一个字母。" }
      ]
    }
  ]
};
