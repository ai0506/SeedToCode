export type CorpusCase = {
  id: string;
  profile: "core-2027" | "advanced-2027";
  sourceKind: "caie-derived" | "runtime-defined" | "regression";
  source: string;
};

export const TOKENIZER_CASES = [
  {
    id: "LEX-001",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `CONSTANT Whole = -3
CONSTANT Fraction = 4.7
CONSTANT Letter = 'C'
CONSTANT EmptyText = ""
CONSTANT Finished = FALSE
CONSTANT StartDate = 02/01/2028`
  },
  {
    id: "LEX-002",
    profile: "core-2027",
    sourceKind: "regression",
    source: `DECLARE StartDate : DATE
StartDate ← 02/01/2028`
  },
  {
    id: "LEX-003",
    profile: "core-2027",
    sourceKind: "runtime-defined",
    source: `DECLARE StartDate : DATE
StartDate ← 31/02/2028`
  },
  {
    id: "LEX-004",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `DECLARE A : REAL
DECLARE B : REAL
A ← .5
B ← 5.`
  },
  {
    id: "LEX-005",
    profile: "core-2027",
    sourceKind: "runtime-defined",
    source: `OUTPUT "unfinished
OUTPUT "next line"`
  },
  {
    id: "LEX-006",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `// IF ELSE ENDIF DECLARE <-
OUTPUT "// is text"`
  }
] as const satisfies readonly CorpusCase[];

export const EXPRESSION_CASES = [
  {
    id: "EXPR-001",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `OUTPUT 2 + 3 * 4
OUTPUT 17 DIV 5
OUTPUT 17 MOD 5
OUTPUT 5 / 2`
  },
  {
    id: "EXPR-002",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `OUTPUT "Summer" & " " & "Pudding"`
  }
] as const satisfies readonly CorpusCase[];

export const BASIC_STATEMENT_CASES = [
  {
    id: "DECL-001",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `DECLARE Count : INTEGER
Count ← 2
Count ← Count + 1
OUTPUT Count`
  },
  {
    id: "CONST-001",
    profile: "core-2027",
    sourceKind: "regression",
    source: "CONSTANT StartDate = 02/01/2028"
  },
  {
    id: "CONST-002",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `CONSTANT Price = 5
CONSTANT DoublePrice = Price * 2`
  },
  {
    id: "ASSIGN-001",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `DECLARE Score : INTEGER
Score = 50`
  }
] as const satisfies readonly CorpusCase[];

export const SEMANTIC_CASES = [
  {
    id: "ID-002",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `DECLARE CountDown : INTEGER
DECLARE Countdown : INTEGER`
  },
  {
    id: "DECL-002",
    profile: "core-2027",
    sourceKind: "runtime-defined",
    source: "Total ← MissingValue + 1"
  },
  {
    id: "ARRAY-001",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `DECLARE StudentNames : ARRAY[1:30] OF STRING
DECLARE Board : ARRAY[1:3,1:3] OF CHAR
StudentNames[1] ← "Ali"
Board[2,3] ← 'X'
OUTPUT StudentNames[1], Board[2,3]`
  },
  {
    id: "ARRAY-002",
    profile: "core-2027",
    sourceKind: "runtime-defined",
    source: `DECLARE Board : ARRAY[1:3,1:3] OF CHAR
Board[0,1] ← 'X'
Board[1] ← 'O'`
  }
] as const satisfies readonly CorpusCase[];

export const CONTROL_FLOW_CASES = [
  {
    id: "IF-001",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `DECLARE A : INTEGER
DECLARE B : INTEGER
A ← 4
B ← 3
IF A > B THEN
   IF A > 0 THEN
      OUTPUT "positive maximum"
   ENDIF
ELSE
   OUTPUT "not greater"
ENDIF`
  },
  {
    id: "CASE-001",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `DECLARE Mark : INTEGER
Mark ← 55
CASE OF Mark
   0 TO 39 : OUTPUT "low"
   40 TO 69 : OUTPUT "middle"
   OTHERWISE : OUTPUT "high"
ENDCASE`
  },
  {
    id: "CASE-002",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `CASE OF Move
   OTHERWISE : OUTPUT "other"
   'W' : OUTPUT "up"
ENDCASE`
  },
  {
    id: "FOR-001",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `DECLARE Index : INTEGER
FOR Index ← 1 TO 3
   OUTPUT Index
NEXT Index
FOR Index ← 3 TO 1 STEP -1
   OUTPUT Index
NEXT Index
FOR Index ← 3 TO 1
   OUTPUT "never"
NEXT Index`
  },
  {
    id: "FOR-002",
    profile: "core-2027",
    sourceKind: "runtime-defined",
    source: `FOR Row ← 1 TO 3
   OUTPUT Row
NEXT Column`
  },
  {
    id: "LOOP-001",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `DECLARE Count : INTEGER
Count ← 0
REPEAT
   Count ← Count + 1
UNTIL Count >= 1
OUTPUT Count`
  },
  {
    id: "LOOP-002",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `DECLARE Count : INTEGER
Count ← 0
WHILE Count > 0
   OUTPUT "never"
ENDWHILE
OUTPUT "done"`
  }
] as const satisfies readonly CorpusCase[];

export const ROUTINE_CASES = [
  {
    id: "ROUTINE-001",
    profile: "core-2027",
    sourceKind: "regression",
    source: `DECLARE A : INTEGER
DECLARE B : INTEGER
A ← 1
B ← 2
PROCEDURE SWAP(BYREF X : INTEGER, Y : INTEGER)
   DECLARE Temp : INTEGER
   Temp ← X
   X ← Y
   Y ← Temp
ENDPROCEDURE
CALL SWAP(A, B)
OUTPUT A, B`
  },
  {
    id: "ROUTINE-002",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `DECLARE A : INTEGER
A ← 5
PROCEDURE Change(Value : INTEGER)
   Value ← 9
ENDPROCEDURE
CALL Change(A)
OUTPUT A`
  },
  {
    id: "ROUTINE-003",
    profile: "core-2027",
    sourceKind: "regression",
    source: `FUNCTION Adjust(Count : INTEGER, Fee : INTEGER) RETURNS INTEGER
   IF Count = 0 THEN
      RETURN Fee
   ELSE
      RETURN Count + Fee
   ENDIF
ENDFUNCTION
OUTPUT Adjust(13, 7)`
  },
  {
    id: "ROUTINE-004",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `FUNCTION Identity(Value : INTEGER) RETURNS INTEGER
   RETURN Value
ENDFUNCTION
CALL Identity(1)`
  },
  {
    id: "ROUTINE-005",
    profile: "core-2027",
    sourceKind: "runtime-defined",
    source: `PROCEDURE Increment(BYREF Value : INTEGER)
   Value ← Value + 1
ENDPROCEDURE
CALL Increment(5)`
  },
  {
    id: "ROUTINE-006",
    profile: "core-2027",
    sourceKind: "runtime-defined",
    source: `FUNCTION PositiveOnly(Value : INTEGER) RETURNS INTEGER
   IF Value > 0 THEN
      RETURN Value
   ENDIF
ENDFUNCTION`
  }
] as const satisfies readonly CorpusCase[];

export const RECORD_CASES = [
  {
    id: "RECORD-001",
    profile: "core-2027",
    sourceKind: "regression",
    source: `TYPE Packet
   DECLARE Code : CHAR
   DECLARE Bytes : INTEGER
ENDTYPE
DECLARE Message : Packet
Message.Code ← 'Q'
Message.Bytes ← 12
OUTPUT Message.Code`
  }
] as const satisfies readonly CorpusCase[];

export const TEXT_FILE_CASES = [
  {
    id: "FILE-001",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `DECLARE LineOfText : STRING
OPENFILE "Input.txt" FOR READ
OPENFILE "Output.txt" FOR WRITE
WHILE NOT EOF("Input.txt")
   READFILE "Input.txt", LineOfText
   IF LineOfText = "" THEN
      WRITEFILE "Output.txt", "---"
   ELSE
      WRITEFILE "Output.txt", LineOfText
   ENDIF
ENDWHILE
CLOSEFILE "Input.txt"
CLOSEFILE "Output.txt"`
  },
  {
    id: "FILE-002",
    profile: "core-2027",
    sourceKind: "runtime-defined",
    source: `OPENFILE "Input.txt" FOR READ
WRITEFILE "Input.txt", "bad"`
  },
  {
    id: "FILE-003",
    profile: "core-2027",
    sourceKind: "runtime-defined",
    source: `OPENFILE "Output.txt" FOR WRITE
WRITEFILE "Output.txt", "new"
OUTPUT 1 / 0`
  }
] as const satisfies readonly CorpusCase[];

export const FORMAT_CASES = [
  {
    id: "FMT-001",
    profile: "core-2027",
    sourceKind: "caie-derived",
    source: `declare Score : integer
input Score
output Score`
  },
  {
    id: "FMT-002",
    profile: "core-2027",
    sourceKind: "regression",
    source: `IF Ready THEN
  OUTPUT "yes"
ENDIF`
  },
  {
    id: "FMT-003",
    profile: "core-2027",
    sourceKind: "regression",
    source: `OUTPUT "A long first value",
       "an aligned continuation"`
  },
  {
    id: "FMT-004",
    profile: "core-2027",
    sourceKind: "regression",
    source: `OUTPUT "This deliberately long line exists to verify that an editor threshold is not labelled as a Cambridge rule."`
  }
] as const satisfies readonly CorpusCase[];
