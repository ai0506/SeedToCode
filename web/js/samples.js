/*
 * 初始源码文档与运行时虚拟文件。
 * 程序运行已交给阶段 4 解释器，本文件不再提供脚本化运行结果。
 */
window.SAMPLES = (function () {
  const docs = [
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
    {
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
    },
    {
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
    },
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
  ];

  // 运行时虚拟数据文件：与 .pseudocode 源文件是两个独立集合
  const runtimeFiles = [
    {
      id: 'rf-names',
      name: 'Names.txt',
      kind: 'text',
      lines: ['Ali', 'Bianca', '', 'Chen', 'Devi']
    },
    {
      id: 'rf-report',
      name: 'Report.txt',
      kind: 'text',
      lines: []
    },
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
  ];

  return { docs: docs, runtimeFiles: runtimeFiles };
})();
