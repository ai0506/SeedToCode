/*
 * 新建项目时的初始代码文件与运行时数据文件。
 *
 * 这里放的是「打开就能跑、跑出来能看懂」的起步示例，不是开发期的检测用例：
 * 一份基本的输入与判断，一份数组与过程，一份文本文件读写，以及后者要读写的两个文件。
 * 改动这份清单时记得同步下面的 legacy 快照，理由见那里的注释。
 */
window.SAMPLES = (function () {
  const mainDoc = {
    id: 'doc-main',
    name: 'Main.pseudocode',
    source: [
      '// 输入姓名和分数，判断是否及格',
      'CONSTANT PassMark = 50',
      'DECLARE StudentName : STRING',
      'DECLARE Score : INTEGER',
      '',
      'OUTPUT "Please enter the student name"',
      'INPUT StudentName',
      'OUTPUT "Please enter the score"',
      'INPUT Score',
      '',
      'IF Score >= PassMark THEN',
      '   OUTPUT StudentName, " has passed with ", Score',
      'ELSE',
      '   OUTPUT StudentName, " has not passed"',
      'ENDIF'
    ].join('\n')
  };

  const bubbleDoc = {
    id: 'doc-bubble',
    name: 'BubbleSort.pseudocode',
    source: [
      '// 演示：一维数组 + 过程 + 嵌套循环',
      'DECLARE Numbers : ARRAY[1:6] OF INTEGER',
      '',
      'PROCEDURE BubbleSort(BYREF List : ARRAY[1:6] OF INTEGER)',
      '   DECLARE Temp : INTEGER',
      // FOR 的控制变量由 FOR 那一行本身建立，不必事先 DECLARE——Pseudocode Guide
      // §7.1 的例子就没有声明 Row / Column / Index。§2.4 只把显式声明称为 good
      // practice，不是要求。出厂样例是学生看到的第一段代码，别教成「必须声明」。
      '   FOR i ← 1 TO 5',
      '      FOR j ← 1 TO 6 - i',
      '         IF List[j] > List[j + 1] THEN',
      '            Temp ← List[j]',
      '            List[j] ← List[j + 1]',
      '            List[j + 1] ← Temp',
      '         ENDIF',
      '      NEXT j',
      '   NEXT i',
      'ENDPROCEDURE',
      '',
      'Numbers[1] ← 42',
      'Numbers[2] ← 7',
      'Numbers[3] ← 19',
      'Numbers[4] ← 3',
      'Numbers[5] ← 25',
      'Numbers[6] ← 11',
      '',
      'CALL BubbleSort(Numbers)',
      '',
      'FOR Index ← 1 TO 6',
      '   OUTPUT Numbers[Index]',
      'NEXT Index'
    ].join('\n')
  };

  const fileDoc = {
    id: 'doc-file',
    name: 'FileCopy.pseudocode',
    source: [
      '// 演示：文本文件读写（指南 9.1）',
      'DECLARE LineOfText : STRING',
      '',
      'OPENFILE "Names.txt" FOR READ',
      'OPENFILE "Report.txt" FOR WRITE',
      '',
      'WHILE NOT EOF("Names.txt")',
      '   READFILE "Names.txt", LineOfText',
      '   IF LineOfText = "" THEN',
      '      WRITEFILE "Report.txt", "----------"',
      '   ELSE',
      '      WRITEFILE "Report.txt", LineOfText',
      '   ENDIF',
      'ENDWHILE',
      '',
      'CLOSEFILE "Names.txt"',
      'CLOSEFILE "Report.txt"',
      'OUTPUT "Copy finished"'
    ].join('\n')
  };

  // 运行时虚拟数据文件：与 .pseudocode 源文件是两个独立集合
  const namesFile = {
    id: 'rf-names',
    name: 'Names.txt',
    kind: 'text',
    lines: ['Ali', 'Bianca', '', 'Chen', 'Devi']
  };

  const reportFile = {
    id: 'rf-report',
    name: 'Report.txt',
    kind: 'text',
    lines: []
  };

  const docs = [mainDoc, bubbleDoc, fileDoc];
  const runtimeFiles = [namesFile, reportFile];

  /*
   * 出厂样例改过一次：去掉了一份故意写错的 Practice.pseudocode 和一份没有示例
   * 用到的 StudentFile.dat，并把 Main 开头那句只对开发者有意义的注释换成了人话。
   *
   * 但老用户浏览器里存的还是旧的那一份。isPristineProject 靠「和出厂样例逐字相同」
   * 判断一个项目是不是「一个字都没改过」，只认新快照的话，这些人一登录就会被问
   * 「这台设备上有未登录时留下的内容，要并入吗」——他们其实什么都没动过。
   * 所以旧快照也要认。以后再改样例，同样往这里追加一份。
   */
  /* 这一版之前出厂的 BubbleSort：过程里显式声明了 i 和 j。原文冻在这里，
     因为下面两份历史快照都含它，而 bubbleDoc 已经改掉了——直接引用 bubbleDoc
     的话，旧快照会跟着一起变，认不出任何一台老设备。 */
  const legacyBubbleDoc = {
    id: 'doc-bubble',
    name: 'BubbleSort.pseudocode',
    source: [
      '// 演示：一维数组 + 过程 + 嵌套循环',
      'DECLARE Numbers : ARRAY[1:6] OF INTEGER',
      'DECLARE Index : INTEGER',
      '',
      'PROCEDURE BubbleSort(BYREF List : ARRAY[1:6] OF INTEGER)',
      '   DECLARE Temp : INTEGER',
      '   DECLARE i : INTEGER',
      '   DECLARE j : INTEGER',
      '   FOR i ← 1 TO 5',
      '      FOR j ← 1 TO 6 - i',
      '         IF List[j] > List[j + 1] THEN',
      '            Temp ← List[j]',
      '            List[j] ← List[j + 1]',
      '            List[j + 1] ← Temp',
      '         ENDIF',
      '      NEXT j',
      '   NEXT i',
      'ENDPROCEDURE',
      '',
      'Numbers[1] ← 42',
      'Numbers[2] ← 7',
      'Numbers[3] ← 19',
      'Numbers[4] ← 3',
      'Numbers[5] ← 25',
      'Numbers[6] ← 11',
      '',
      'CALL BubbleSort(Numbers)',
      '',
      'FOR Index ← 1 TO 6',
      '   OUTPUT Numbers[Index]',
      'NEXT Index'
    ].join('\n')
  };

  const legacy = [{
    docs: [
      {
        id: 'doc-main',
        name: 'Main.pseudocode',
        source: [
          '// 阶段 3B：输入成绩并执行真实选择结构',
          'CONSTANT PassMark = 50',
          'DECLARE StudentName : STRING',
          'DECLARE Score : INTEGER',
          '',
          'OUTPUT "Please enter the student name"',
          'INPUT StudentName',
          'OUTPUT "Please enter the score"',
          'INPUT Score',
          '',
          'IF Score >= PassMark THEN',
          '   OUTPUT StudentName, " has passed with ", Score',
          'ELSE',
          '   OUTPUT StudentName, " has not passed"',
          'ENDIF'
        ].join('\n')
      },
      legacyBubbleDoc,
      fileDoc,
      {
        id: 'doc-practice',
        name: 'Practice.pseudocode',
        source: [
          '// 演示：故意写错，用来看“问题”面板的三级诊断',
          'declare Counter : INTEGER',
          'Counter = 0',
          '  Counter ← Counter + 1',
          '',
          'if Counter > 0 then',
          '   OUTPUT "Counter is ", Counter',
          '',
          'DECLARE 2Names : STRING',
          'CALL LENGTH("Hello")'
        ].join('\n')
      }
    ],
    runtimeFiles: [
      namesFile,
      reportFile,
      {
        id: 'rf-students',
        name: 'StudentFile.dat',
        kind: 'records',
        recordType: 'StudentRecord',
        records: [
          { LastName: 'Johnson', FirstName: 'Leroy', YearGroup: 6, FormGroup: 'A' },
          { LastName: 'Ahmed', FirstName: 'Sara', YearGroup: 6, FormGroup: 'B' },
          { LastName: 'Watanabe', FirstName: 'Ken', YearGroup: 5, FormGroup: 'A' }
        ]
      }
    ]
  }, {
    /* 上一版出厂的一套：Main 和 FileCopy 就是现在这两份，只有 BubbleSort 里
       多了 DECLARE i / DECLARE j。不认它的话，装了上一版、一个字没动过的人
       一登录就会被问要不要并入。 */
    docs: [mainDoc, legacyBubbleDoc, fileDoc],
    runtimeFiles: [namesFile, reportFile]
  }];

  return { docs: docs, runtimeFiles: runtimeFiles, legacy: legacy };
})();
