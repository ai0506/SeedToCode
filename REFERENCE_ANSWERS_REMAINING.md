# 剩余题目参考答案

本文件覆盖导出答案中没有包含的题目。答案按项目当前 `referenceSolution` 整理；Chapter 15 按题目设计没有伪代码题。

## 7.T1 产品编号

~~~text
DECLARE Code : STRING
DECLARE Grade : CHAR
DECLARE Prefix : STRING
DECLARE Digits : STRING
OUTPUT "Enter the code"
INPUT Code
OUTPUT "Enter the grade"
INPUT Grade
Prefix ← MID(Code, 1, 2)
Digits ← RIGHT(Code, LENGTH(Code) - 2)
OUTPUT "Length: ", LENGTH(Code)
OUTPUT "Prefix: ", Prefix
OUTPUT "Number: ", Digits
OUTPUT "Tag: ", Prefix & "-" & Digits
OUTPUT "Grade: ", UCASE(Grade)
~~~

## 8.2.1 倒着念回去

~~~text
DECLARE Numbers : ARRAY[1:3] OF INTEGER
OUTPUT "Enter a number"
INPUT Numbers[1]
OUTPUT "Enter a number"
INPUT Numbers[2]
OUTPUT "Enter a number"
INPUT Numbers[3]
OUTPUT Numbers[3]
OUTPUT Numbers[2]
OUTPUT Numbers[1]
~~~

## 8.4.1 数一数有几个及格

~~~text
DECLARE Marks : ARRAY[1:5] OF INTEGER
DECLARE I : INTEGER
DECLARE Passed : INTEGER
Passed ← 0
FOR I ← 1 TO 5
   OUTPUT "Enter a mark"
   INPUT Marks[I]
NEXT I
FOR I ← 1 TO 5
   IF Marks[I] >= 50 THEN
      Passed ← Passed + 1
   ENDIF
NEXT I
OUTPUT "Passed: ", Passed
~~~

## 8.T1 一周气温

~~~text
DECLARE Temps : ARRAY[1:7] OF INTEGER
DECLARE I : INTEGER
DECLARE Total : INTEGER
DECLARE Highest : INTEGER
DECLARE Average : INTEGER
DECLARE Above : INTEGER
Total ← 0
Above ← 0
FOR I ← 1 TO 7
   OUTPUT "Enter a temperature"
   INPUT Temps[I]
   Total ← Total + Temps[I]
NEXT I
Highest ← Temps[1]
FOR I ← 2 TO 7
   IF Temps[I] > Highest THEN
      Highest ← Temps[I]
   ENDIF
NEXT I
Average ← Total DIV 7
FOR I ← 1 TO 7
   IF Temps[I] > Average THEN
      Above ← Above + 1
   ENDIF
NEXT I
OUTPUT "Total: ", Total
OUTPUT "Highest: ", Highest
OUTPUT "Average: ", Average
OUTPUT "Above average: ", Above
~~~

## 9.3.1 每行的和

~~~text
DECLARE Grid : ARRAY[1:2, 1:3] OF INTEGER
DECLARE Row : INTEGER
DECLARE Col : INTEGER
DECLARE Sum : INTEGER
FOR Row ← 1 TO 2
   FOR Col ← 1 TO 3
      OUTPUT "Enter a number"
      INPUT Grid[Row, Col]
   NEXT Col
NEXT Row
FOR Row ← 1 TO 2
   Sum ← 0
   FOR Col ← 1 TO 3
      Sum ← Sum + Grid[Row, Col]
   NEXT Col
   OUTPUT "Row ", Row, ": ", Sum
NEXT Row
~~~

## 9.T1 成绩表

~~~text
DECLARE Marks : ARRAY[1:3, 1:2] OF INTEGER
DECLARE Student : INTEGER
DECLARE Subject : INTEGER
DECLARE Total : INTEGER
FOR Student ← 1 TO 3
   FOR Subject ← 1 TO 2
      OUTPUT "Enter a mark"
      INPUT Marks[Student, Subject]
   NEXT Subject
NEXT Student
FOR Student ← 1 TO 3
   Total ← 0
   FOR Subject ← 1 TO 2
      Total ← Total + Marks[Student, Subject]
   NEXT Subject
   OUTPUT "Student ", Student, " total: ", Total
NEXT Student
FOR Subject ← 1 TO 2
   Total ← 0
   FOR Student ← 1 TO 3
      Total ← Total + Marks[Student, Subject]
   NEXT Student
   OUTPUT "Subject ", Subject, " average: ", Total DIV 3
NEXT Subject
~~~

## 10.2.1 在名单里找一个数

~~~text
DECLARE Values : ARRAY[1:6] OF INTEGER
DECLARE Position : INTEGER
DECLARE Target : INTEGER
DECLARE Found : BOOLEAN
FOR Position ← 1 TO 6
   OUTPUT "Enter a number"
   INPUT Values[Position]
NEXT Position
OUTPUT "Enter the number to find"
INPUT Target
Found ← FALSE
Position ← 1
WHILE Found = FALSE AND Position <= 6
   IF Values[Position] = Target THEN
      Found ← TRUE
   ELSE
      Position ← Position + 1
   ENDIF
ENDWHILE
IF Found = TRUE THEN
   OUTPUT "Found at ", Position
ELSE
   OUTPUT "Not found"
ENDIF
~~~

## 10.4.1 从小到大排好

~~~text
DECLARE Values : ARRAY[1:5] OF INTEGER
DECLARE I : INTEGER
DECLARE J : INTEGER
DECLARE Temp : INTEGER
FOR I ← 1 TO 5
   OUTPUT "Enter a number"
   INPUT Values[I]
NEXT I
FOR I ← 1 TO 4
   FOR J ← 1 TO 5 - I
      IF Values[J] > Values[J + 1] THEN
         Temp ← Values[J]
         Values[J] ← Values[J + 1]
         Values[J + 1] ← Temp
      ENDIF
   NEXT J
NEXT I
FOR I ← 1 TO 5
   OUTPUT Values[I]
NEXT I
~~~

## 10.T1 排好再找

~~~text
DECLARE Values : ARRAY[1:6] OF INTEGER
DECLARE I : INTEGER
DECLARE J : INTEGER
DECLARE Temp : INTEGER
DECLARE Target : INTEGER
DECLARE Position : INTEGER
DECLARE Found : BOOLEAN
FOR I ← 1 TO 6
   OUTPUT "Enter a number"
   INPUT Values[I]
NEXT I
FOR I ← 1 TO 5
   FOR J ← 1 TO 6 - I
      IF Values[J] > Values[J + 1] THEN
         Temp ← Values[J]
         Values[J] ← Values[J + 1]
         Values[J + 1] ← Temp
      ENDIF
   NEXT J
NEXT I
FOR I ← 1 TO 6
   OUTPUT Values[I]
NEXT I
OUTPUT "Enter the number to find"
INPUT Target
Found ← FALSE
Position ← 1
WHILE Found = FALSE AND Position <= 6
   IF Values[Position] = Target THEN
      Found ← TRUE
   ELSE
      Position ← Position + 1
   ENDIF
ENDWHILE
IF Found = TRUE THEN
   OUTPUT "Found at ", Position
ELSE
   OUTPUT "Not found"
ENDIF
~~~

## 11.3.1 一个学生的两科成绩

~~~text
TYPE TStudent
   DECLARE Name : STRING
   DECLARE First : INTEGER
   DECLARE Second : INTEGER
ENDTYPE
DECLARE One : TStudent
OUTPUT "Enter a name"
INPUT One.Name
OUTPUT "Enter the first mark"
INPUT One.First
OUTPUT "Enter the second mark"
INPUT One.Second
OUTPUT One.Name, ": ", One.First + One.Second
~~~

## 11.4.1 分数最高的人

~~~text
TYPE TStudent
   DECLARE Name : STRING
   DECLARE Mark : INTEGER
ENDTYPE
DECLARE Form : ARRAY[1:4] OF TStudent
DECLARE I : INTEGER
DECLARE Best : INTEGER
FOR I ← 1 TO 4
   OUTPUT "Enter a name"
   INPUT Form[I].Name
   OUTPUT "Enter a mark"
   INPUT Form[I].Mark
NEXT I
Best ← 1
FOR I ← 2 TO 4
   IF Form[I].Mark > Form[Best].Mark THEN
      Best ← I
   ENDIF
NEXT I
OUTPUT "Top: ", Form[Best].Name, " ", Form[Best].Mark
~~~

## 11.T1 成绩排行榜

~~~text
TYPE TStudent
   DECLARE Name : STRING
   DECLARE Mark : INTEGER
ENDTYPE
DECLARE Form : ARRAY[1:5] OF TStudent
DECLARE Temp : TStudent
DECLARE I : INTEGER
DECLARE J : INTEGER
FOR I ← 1 TO 5
   OUTPUT "Enter a name"
   INPUT Form[I].Name
   OUTPUT "Enter a mark"
   INPUT Form[I].Mark
NEXT I
FOR I ← 1 TO 4
   FOR J ← 1 TO 5 - I
      IF Form[J].Mark < Form[J + 1].Mark THEN
         Temp ← Form[J]
         Form[J] ← Form[J + 1]
         Form[J + 1] ← Temp
      ENDIF
   NEXT J
NEXT I
FOR I ← 1 TO 5
   OUTPUT Form[I].Name, " ", Form[I].Mark
NEXT I
~~~

## 12.3.1 三行小条形图

~~~text
PROCEDURE ShowBar(Label : STRING, Count : INTEGER)
   DECLARE I : INTEGER
   DECLARE Bar : STRING
   Bar ← ""
   FOR I ← 1 TO Count
      Bar ← Bar & "*"
   NEXT I
   OUTPUT Label, " ", Bar
ENDPROCEDURE
DECLARE Name : STRING
DECLARE Amount : INTEGER
DECLARE K : INTEGER
FOR K ← 1 TO 3
   OUTPUT "Enter a label"
   INPUT Name
   OUTPUT "Enter a count"
   INPUT Amount
   CALL ShowBar(Name, Amount)
NEXT K
~~~

## 12.5.1 小的排前面

~~~text
PROCEDURE SortTwo(BYREF A : INTEGER, BYREF B : INTEGER)
   DECLARE Temp : INTEGER
   IF A > B THEN
      Temp ← A
      A ← B
      B ← Temp
   ENDIF
ENDPROCEDURE
DECLARE X : INTEGER
DECLARE Y : INTEGER
OUTPUT "Enter a number"
INPUT X
OUTPUT "Enter a number"
INPUT Y
CALL SortTwo(X, Y)
OUTPUT X, " ", Y
~~~

## 12.T1 三个数排好序

~~~text
PROCEDURE ReadNumber(BYREF N : INTEGER)
   OUTPUT "Enter a number"
   INPUT N
ENDPROCEDURE
PROCEDURE SortTwo(BYREF A : INTEGER, BYREF B : INTEGER)
   DECLARE Temp : INTEGER
   IF A > B THEN
      Temp ← A
      A ← B
      B ← Temp
   ENDIF
ENDPROCEDURE
PROCEDURE ShowThree(A : INTEGER, B : INTEGER, C : INTEGER)
   OUTPUT A
   OUTPUT B
   OUTPUT C
ENDPROCEDURE
DECLARE X : INTEGER
DECLARE Y : INTEGER
DECLARE Z : INTEGER
CALL ReadNumber(X)
CALL ReadNumber(Y)
CALL ReadNumber(Z)
CALL SortTwo(X, Y)
CALL SortTwo(Y, Z)
CALL SortTwo(X, Y)
CALL ShowThree(X, Y, Z)
~~~

## 13.3.1 分数换等第

~~~text
FUNCTION Grade(Mark : INTEGER) RETURNS STRING
   IF Mark >= 80 THEN
      RETURN "A"
   ENDIF
   IF Mark >= 60 THEN
      RETURN "B"
   ENDIF
   IF Mark >= 40 THEN
      RETURN "C"
   ENDIF
   RETURN "F"
ENDFUNCTION
DECLARE Mark : INTEGER
DECLARE I : INTEGER
FOR I ← 1 TO 3
   OUTPUT "Enter a mark"
   INPUT Mark
   OUTPUT Mark, " ", Grade(Mark)
NEXT I
~~~

## 13.5.1 四个数里最大的

~~~text
FUNCTION Bigger(A : INTEGER, B : INTEGER) RETURNS INTEGER
   IF A > B THEN
      RETURN A
   ENDIF
   RETURN B
ENDFUNCTION
DECLARE Best : INTEGER
DECLARE N : INTEGER
DECLARE I : INTEGER
OUTPUT "Enter a number"
INPUT Best
FOR I ← 2 TO 4
   OUTPUT "Enter a number"
   INPUT N
   Best ← Bigger(Best, N)
NEXT I
OUTPUT "Largest: ", Best
~~~

## 13.T1 五科成绩报告

~~~text
FUNCTION Average(Total : INTEGER, Count : INTEGER) RETURNS INTEGER
   RETURN Total DIV Count
ENDFUNCTION
FUNCTION Grade(Mark : INTEGER) RETURNS STRING
   IF Mark >= 80 THEN
      RETURN "A"
   ENDIF
   IF Mark >= 60 THEN
      RETURN "B"
   ENDIF
   IF Mark >= 40 THEN
      RETURN "C"
   ENDIF
   RETURN "F"
ENDFUNCTION
PROCEDURE ShowResult(Value : INTEGER, Letter : STRING)
   OUTPUT "Average: ", Value
   OUTPUT "Grade: ", Letter
ENDPROCEDURE
DECLARE Sum : INTEGER
DECLARE Mark : INTEGER
DECLARE I : INTEGER
DECLARE Mean : INTEGER
Sum ← 0
FOR I ← 1 TO 5
   OUTPUT "Enter a mark"
   INPUT Mark
   Sum ← Sum + Mark
NEXT I
Mean ← Average(Sum, 5)
CALL ShowResult(Mean, Grade(Mean))
~~~

## 14.3.1 存下来再念一遍

~~~text
DECLARE Name : STRING
DECLARE I : INTEGER
OPENFILE "Names.txt" FOR WRITE
FOR I ← 1 TO 3
   OUTPUT "Enter a name"
   INPUT Name
   WRITEFILE "Names.txt", Name
NEXT I
CLOSEFILE "Names.txt"
OPENFILE "Names.txt" FOR READ
FOR I ← 1 TO 3
   READFILE "Names.txt", Name
   OUTPUT Name
NEXT I
CLOSEFILE "Names.txt"
~~~

## 14.5.1 存下来，再编号念一遍

~~~text
DECLARE Line : STRING
DECLARE I : INTEGER
DECLARE Count : INTEGER
OPENFILE "Notes.txt" FOR WRITE
FOR I ← 1 TO 4
   OUTPUT "Enter a line"
   INPUT Line
   WRITEFILE "Notes.txt", Line
NEXT I
CLOSEFILE "Notes.txt"
Count ← 0
OPENFILE "Notes.txt" FOR READ
WHILE NOT EOF("Notes.txt")
   READFILE "Notes.txt", Line
   Count ← Count + 1
   OUTPUT Count, ": ", Line
ENDWHILE
CLOSEFILE "Notes.txt"
~~~

## 14.T1 挑出长名字

~~~text
DECLARE Name : STRING
DECLARE I : INTEGER
DECLARE Count : INTEGER
OPENFILE "Names.txt" FOR WRITE
FOR I ← 1 TO 5
   OUTPUT "Enter a name"
   INPUT Name
   WRITEFILE "Names.txt", Name
NEXT I
CLOSEFILE "Names.txt"
OPENFILE "Names.txt" FOR READ
OPENFILE "Long.txt" FOR WRITE
WHILE NOT EOF("Names.txt")
   READFILE "Names.txt", Name
   IF LENGTH(Name) >= 5 THEN
      WRITEFILE "Long.txt", Name
   ENDIF
ENDWHILE
CLOSEFILE "Names.txt"
CLOSEFILE "Long.txt"
Count ← 0
OPENFILE "Long.txt" FOR READ
WHILE NOT EOF("Long.txt")
   READFILE "Long.txt", Name
   Count ← Count + 1
   OUTPUT Name
ENDWHILE
CLOSEFILE "Long.txt"
OUTPUT "Count: ", Count
~~~

## 16.2.1 房间的面积和周长

~~~text
DECLARE RoomLength : INTEGER
DECLARE RoomWidth : INTEGER
OUTPUT "Enter the length"
INPUT RoomLength
OUTPUT "Enter the width"
INPUT RoomWidth
OUTPUT "Area: ", RoomLength * RoomWidth
OUTPUT "Perimeter: ", 2 * (RoomLength + RoomWidth)
~~~

## 16.5.1 照着描述写出来

~~~text
DECLARE Count : INTEGER
DECLARE Temperature : INTEGER
DECLARE I : INTEGER
Count ← 0
FOR I ← 1 TO 5
   OUTPUT "Enter a temperature"
   INPUT Temperature
   IF Temperature < 0 THEN
      Count ← Count + 1
   ENDIF
NEXT I
OUTPUT "Frost days: ", Count
~~~

## 16.7.1 及格名单存进文件

~~~text
DECLARE Mark : INTEGER
DECLARE I : INTEGER
DECLARE Line : STRING
DECLARE Passes : INTEGER
OPENFILE "Marks.txt" FOR WRITE
FOR I ← 1 TO 6
   OUTPUT "Enter a mark"
   INPUT Mark
   IF Mark >= 50 THEN
      WRITEFILE "Marks.txt", "pass"
   ELSE
      WRITEFILE "Marks.txt", "fail"
   ENDIF
NEXT I
CLOSEFILE "Marks.txt"
Passes ← 0
OPENFILE "Marks.txt" FOR READ
WHILE NOT EOF("Marks.txt")
   READFILE "Marks.txt", Line
   IF Line = "pass" THEN
      Passes ← Passes + 1
   ENDIF
ENDWHILE
CLOSEFILE "Marks.txt"
OUTPUT "Passes: ", Passes
OUTPUT "Fails: ", 6 - Passes
~~~

## 16.T1 借阅统计

~~~text
TYPE TBook
   DECLARE Title : STRING
   DECLARE Loans : INTEGER
ENDTYPE
PROCEDURE ReadBooks(BYREF Shelf : ARRAY[1:5] OF TBook, BYREF Total : INTEGER)
   DECLARE I : INTEGER
   Total ← 0
   FOR I ← 1 TO 5
      OUTPUT "Enter a title"
      INPUT Shelf[I].Title
      OUTPUT "Enter a loan count"
      INPUT Shelf[I].Loans
      Total ← Total + Shelf[I].Loans
   NEXT I
ENDPROCEDURE
FUNCTION BestOf(Shelf : ARRAY[1:5] OF TBook) RETURNS INTEGER
   DECLARE I : INTEGER
   DECLARE Best : INTEGER
   Best ← 1
   FOR I ← 2 TO 5
      IF Shelf[I].Loans > Shelf[Best].Loans THEN
         Best ← I
      ENDIF
   NEXT I
   RETURN Best
ENDFUNCTION
DECLARE Books : ARRAY[1:5] OF TBook
DECLARE Total : INTEGER
DECLARE Top : INTEGER
CALL ReadBooks(Books, Total)
Top ← BestOf(Books)
OUTPUT "Total loans: ", Total
OUTPUT "Average loans: ", Total DIV 5
OUTPUT "Most borrowed: ", Books[Top].Title
~~~

