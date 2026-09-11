"use strict";
var CAIETeaching = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/teaching-content/src/browser.ts
  var browser_exports = {};
  __export(browser_exports, {
    course: () => course
  });

  // packages/teaching-content/src/chapter-01.ts
  var chapter01 = {
    id: 1,
    title: "\u7B97\u6CD5\u3001\u4F2A\u4EE3\u7801\u4E0E\u4E66\u5199\u89C4\u8303",
    level: "AS",
    syllabus: ["\xA79.2", "\xA711.1", "G\xA71"],
    prerequisites: [],
    sections: [
      // ────────────────────────────────────────────────────────── 1.1
      {
        id: "1.1",
        title: "\u7B97\u6CD5\u4E0E\u4F2A\u4EE3\u7801",
        syllabus: ["\xA79.2", "\xA711.1"],
        estimatedMinutes: 8,
        // 字符串字面量在第一个 OUTPUT 示例里已可使用；Chapter 2 才正式讲类型和字面量的规则。
        taughtFeatures: ["io.output", "literal.string"],
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u628A\u300C\u6CE1\u4E00\u676F\u8336\u300D\u8BB2\u7ED9\u4E00\u4E2A\u4ECE\u6CA1\u6CE1\u8FC7\u8336\u7684\u4EBA\u542C\uFF0C\u4F60\u4E0D\u80FD\u53EA\u8BF4\u300C\u6CE1\u4E00\u676F\u8336\u300D\uFF0C\u5F97\u62C6\u5F00\uFF1A\u70E7\u6C34\u3001\u628A\u8336\u53F6\u653E\u8FDB\u676F\u5B50\u3001\u5012\u70ED\u6C34\u3001\u7B49\u4E09\u5206\u949F\u3002\u8FD9\u6837\u4E00\u4E32\u7167\u7740\u505A\u5C31\u80FD\u628A\u4E8B\u60C5\u505A\u5B8C\u7684\u6B65\u9AA4\uFF0C\u5C31\u662F\u4E00\u4E2A**\u7B97\u6CD5\uFF08algorithm\uFF09**\u3002",
              "\u4E00\u4E32\u6B65\u9AA4\u8981\u7B97\u5F97\u4E0A\u7B97\u6CD5\uFF0C\u5F97\u6EE1\u8DB3\u4E09\u4EF6\u4E8B\uFF1A\u6BCF\u4E00\u6B65\u90FD\u660E\u786E\uFF0C\u4E0D\u7559\u300C\u968F\u4FBF\u300D\u300C\u5DEE\u4E0D\u591A\u300D\u7684\u4F59\u5730\uFF1B\u5148\u540E\u987A\u5E8F\u786E\u5B9A\uFF1B\u7167\u7740\u505A\u4E0B\u53BB\u4E00\u5B9A\u4F1A\u7ED3\u675F\u3002",
              "\u4F46\u7528**\u81EA\u7136\u8BED\u8A00\uFF08natural language\uFF09**\u5199\u6B65\u9AA4\u6709\u4E2A\u9EBB\u70E6\uFF1A\u540C\u4E00\u4EF6\u4E8B\u5341\u4E2A\u4EBA\u5341\u79CD\u5199\u6CD5\uFF0C\u800C\u4E14\u300C\u7B49\u4E00\u4F1A\u513F\u300D\u300C\u5DEE\u4E0D\u591A\u300D\u8FD9\u7C7B\u8BF4\u6CD5\u8BFB\u7684\u4EBA\u5404\u6709\u5404\u7684\u7406\u89E3\u3002**\u4F2A\u4EE3\u7801\uFF08pseudocode\uFF09**\u5C31\u662F\u4E3A\u6B64\u89C4\u5B9A\u7684\u4E00\u5957\u56FA\u5B9A\u5199\u6CD5\u2014\u2014\u6BD4\u81EA\u7136\u8BED\u8A00\u4E25\u683C\uFF0C\u6BCF\u79CD\u64CD\u4F5C\u53EA\u6709\u4E00\u79CD\u5199\u6CD5\uFF1B\u53C8\u6BD4\u771F\u5B9E\u7684\u7F16\u7A0B\u8BED\u8A00\u5BBD\u677E\uFF0C\u4E0D\u7528\u7BA1\u5206\u53F7\u3001\u62EC\u53F7\u90A3\u4E9B\u5404\u5BB6\u4E0D\u540C\u7684\u7EC6\u8282\u3002CAIE \u7684\u8FD9\u5957\u5199\u6CD5\u5B9A\u4E49\u5728\u4E00\u4EFD\u53EB Pseudocode Guide \u7684\u6587\u4EF6\u91CC\uFF0C\u672C\u8BFE\u7A0B\u548C\u8FD9\u4E2A\u7F16\u8F91\u5668\u7528\u7684\u90FD\u662F\u5B83\u3002",
              "\u4F2A\u4EE3\u7801\u672C\u6765\u662F\u5199\u7ED9\u4EBA\u770B\u7684\uFF0C\u4E0D\u8981\u6C42\u80FD\u8DD1\u3002\u4F46\u8FD9\u4E2A\u7F16\u8F91\u5668\u53EF\u4EE5\u8FD0\u884C\u5B83\u2014\u2014\u5199\u5B8C\u6309\u8FD0\u884C\u5C31\u80FD\u770B\u5230\u7ED3\u679C\uFF0C\u4E0D\u7528\u731C\u81EA\u5DF1\u5199\u5F97\u5BF9\u4E0D\u5BF9\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u5BF9\u7B97\u6CD5\u7684\u8BF4\u6CD5\u662F\uFF1A\u628A\u4E00\u4E2A\u95EE\u9898\u7684\u89E3\u6CD5\u8868\u8FBE\u6210\u4E00\u4E32\u6709\u660E\u786E\u5B9A\u4E49\u7684\u6B65\u9AA4\uFF08a sequence of defined steps\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u6700\u77ED\u7684\u4E00\u4E2A\u7A0B\u5E8F",
            fileName: "Example_1_1_a.pseudocode",
            code: 'OUTPUT "Hello, world"',
            annotations: [
              {
                fromLine: 1,
                toLine: 1,
                text: "`OUTPUT` \u662F\u300C\u628A\u540E\u9762\u7684\u4E1C\u897F\u663E\u793A\u51FA\u6765\u300D\u3002\u53CC\u5F15\u53F7\u91CC\u7684\u5185\u5BB9\u539F\u6837\u663E\u793A\uFF0C\u5F15\u53F7\u672C\u8EAB\u4E0D\u4F1A\u51FA\u73B0\u3002"
              }
            ],
            sampleRun: { inputs: [], outputs: ["Hello, world"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0B\u9762\u54EA\u4E00\u6BB5\u624D\u7B97\u5F97\u4E0A\u4E00\u4E2A\u7B97\u6CD5\uFF1F",
            options: [
              {
                key: "A",
                label: "\u300C\u505A\u4E00\u676F\u8336\u3002\u300D",
                correct: false,
                explanation: "\u8FD9\u53EA\u8BF4\u4E86\u8981\u4EC0\u4E48\u7ED3\u679C\uFF0C\u6CA1\u8BF4\u600E\u4E48\u505A\u5230\u3002\u7B97\u6CD5\u56DE\u7B54\u7684\u662F\u300C\u600E\u4E48\u505A\u300D\u3002"
              },
              {
                key: "B",
                label: "\u300C1 \u70E7\u6C34\u30022 \u628A\u8336\u53F6\u653E\u8FDB\u676F\u5B50\u30023 \u5012\u5165\u70ED\u6C34\u30024 \u7B49\u4E09\u5206\u949F\u3002\u300D",
                correct: true,
                explanation: "\u56DB\u6B65\u90FD\u660E\u786E\uFF0C\u987A\u5E8F\u786E\u5B9A\uFF0C\u505A\u5B8C\u7B2C 4 \u6B65\u5C31\u7ED3\u675F\u3002\u4E09\u4E2A\u6761\u4EF6\u90FD\u6EE1\u8DB3\u3002"
              },
              {
                key: "C",
                label: "\u300C\u70E7\u6C34\uFF0C\u7136\u540E\u968F\u4FBF\u7B49\u4E00\u4F1A\u513F\uFF0C\u89C9\u5F97\u5DEE\u4E0D\u591A\u4E86\u5C31\u597D\u3002\u300D",
                correct: false,
                explanation: "\u300C\u968F\u4FBF\u300D\u300C\u5DEE\u4E0D\u591A\u300D\u6CA1\u6709\u786E\u5B9A\u7684\u542B\u4E49\uFF0C\u4E24\u4E2A\u4EBA\u7167\u7740\u505A\u4F1A\u5F97\u5230\u4E0D\u540C\u7ED3\u679C\uFF0C\u8FD9\u4E00\u6B65\u6CA1\u88AB\u5B9A\u4E49\u6E05\u695A\u3002"
              },
              {
                key: "D",
                label: "\u300C1 \u5012\u5165\u70ED\u6C34\u30022 \u56DE\u5230\u7B2C 1 \u6B65\u3002\u300D",
                correct: false,
                explanation: "\u6BCF\u6B65\u90FD\u660E\u786E\u3001\u987A\u5E8F\u4E5F\u786E\u5B9A\uFF0C\u4F46\u5B83\u6C38\u8FDC\u4E0D\u4F1A\u7ED3\u675F\u3002\u7B97\u6CD5\u5FC5\u987B\u505C\u5F97\u4E0B\u6765\u3002"
              }
            ]
          }
        ]
      },
      // ────────────────────────────────────────────────────────── 1.2
      {
        id: "1.2",
        title: "\u987A\u5E8F\u3001\u8F93\u5165\u4E0E\u8F93\u51FA",
        syllabus: ["\xA79.2", "\xA711.1"],
        estimatedMinutes: 12,
        taughtFeatures: ["io.output", "literal.string", "io.input", "decl.variable", "type.string"],
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u7A0B\u5E8F\u4ECE\u7B2C\u4E00\u884C\u5F00\u59CB\uFF0C\u4E00\u884C\u4E00\u884C\u5F80\u4E0B\uFF0C\u505A\u5B8C\u4E00\u884C\u624D\u505A\u4E0B\u4E00\u884C\u3002\u8FD9\u79CD\u300C\u6309\u5199\u4E0B\u6765\u7684\u5148\u540E\u987A\u5E8F\u505A\u300D\u53EB**\u987A\u5E8F\uFF08sequence\uFF09**\u3002\u5B83\u7684\u76F4\u63A5\u540E\u679C\u662F\uFF1A\u6362\u6389\u4E24\u884C\u7684\u4F4D\u7F6E\uFF0C\u7ED3\u679C\u5C31\u53D8\u4E86\u3002",
              "\u5149\u9760 `OUTPUT` \u7684\u7A0B\u5E8F\u6BCF\u6B21\u8DD1\u51FA\u6765\u90FD\u4E00\u6837\u3002\u6709\u7528\u7684\u7A0B\u5E8F\u901A\u5E38\u662F\u8FD9\u4E2A\u5F62\u72B6\uFF1A\u5148\u628A\u6570\u636E\u62FF\u8FDB\u6765\uFF0C\u518D\u62FF\u5B83\u505A\u70B9\u4EC0\u4E48\uFF0C\u6700\u540E\u628A\u7ED3\u679C\u7ED9\u51FA\u53BB\u2014\u2014\u8FD9\u4E09\u6BB5\u53EB input\u3001process \u548C output\u3002\u8FD9\u4E00\u7AE0\u7684\u300C\u5904\u7406\u300D\u8FD8\u5F88\u5355\u8584\uFF0C\u57FA\u672C\u4E0A\u5C31\u662F\u628A\u8BFB\u5230\u7684\u4E1C\u897F\u6309\u60F3\u8981\u7684\u683C\u5F0F\u6446\u51FA\u6765\uFF1B\u771F\u6B63\u7684\u5904\u7406\u2014\u2014\u7B97\u672F\u3001\u5224\u65AD\u3001\u91CD\u590D\u2014\u2014\u4ECE Chapter 3 \u5F00\u59CB\u3002",
              "\u62FF\u6570\u636E\u8FDB\u6765\u7528 `INPUT`\uFF0C\u7A0B\u5E8F\u8D70\u5230\u8FD9\u91CC\u4F1A\u505C\u4E0B\u6765\u7B49\u4F60\u8F93\u5165\u3002\u4F46\u5728\u8BFB\u4E4B\u524D\u5F97\u5148\u51C6\u5907\u4E00\u4E2A\u300C\u540D\u5B57\u300D\u6765\u5B58\u653E\u5B83\uFF0C\u7528 `DECLARE \u540D\u5B57 : \u7C7B\u578B`\uFF0C\u5176\u4E2D `STRING` \u8868\u793A\u4E00\u4E32\u6587\u5B57\u3002`DECLARE` \u548C\u7C7B\u578B\u662F Chapter 2 \u7684\u6B63\u9898\uFF0C\u8FD9\u4E00\u8282\u7167\u7740\u8FD9\u4E2A\u5F62\u72B6\u5199\u5C31\u884C\u3002",
              "\u8FD8\u6709\u4E00\u4EF6\u4E8B\uFF1A\u7A0B\u5E8F\u505C\u4E0B\u6765\u7B49\u8F93\u5165\u7684\u65F6\u5019\uFF0C\u5C4F\u5E55\u4E0A\u5982\u679C\u4EC0\u4E48\u90FD\u6CA1\u6709\uFF0C\u7528\u7684\u4EBA\u53EA\u4F1A\u770B\u5230\u5149\u6807\u5728\u95EA\uFF0C\u4E0D\u77E5\u9053\u8BE5\u6253\u4EC0\u4E48\u3002\u6240\u4EE5\u6BCF\u6B21 `INPUT` \u4E4B\u524D\uFF0C\u90FD\u8981\u5148\u8BF4\u4E00\u53E5\u8981\u8F93\u5165\u4EC0\u4E48\u3002",
              "`OUTPUT` \u53EF\u4EE5\u4E00\u6B21\u663E\u793A\u591A\u6837\u4E1C\u897F\uFF0C\u4E2D\u95F4\u7528\u9017\u53F7\u9694\u5F00\uFF1B\u663E\u793A\u65F6\u5B83\u4EEC\u6328\u7740\u8FDE\u8D77\u6765\uFF0C\u9017\u53F7\u672C\u8EAB\u4E0D\u51FA\u73B0\u3002\u60F3\u7559\u7A7A\u683C\u5C31\u5F97\u81EA\u5DF1\u5199\u8FDB\u5F15\u53F7\u91CC\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "`OUTPUT` \u540E\u9762\u53EF\u4EE5\u8DDF\u591A\u4E2A\u503C\uFF0C\u7528\u9017\u53F7\u5206\u9694\uFF0C\u4E00\u6B21\u5168\u90E8\u8F93\u51FA\uFF08Pseudocode Guide \xA75.1\uFF09\u3002"
              },
              {
                source: "convention",
                text: '\u6BCF\u4E00\u4E2A `INPUT` \u4E4B\u524D\uFF0C\u90FD\u5148\u7528\u4E00\u53E5 `OUTPUT` \u8BF4\u660E\u8981\u8F93\u5165\u4EC0\u4E48\uFF0C\u6210\u5BF9\u51FA\u73B0\uFF1A\n`OUTPUT "Enter the name"`\n`INPUT Name`\nPseudocode Guide \u6CA1\u6709\u89C4\u5B9A\u8FD9\u4E00\u6761\uFF0C\u4F46\u6B63\u5F0F\u53D1\u5E03\u7684\u4F2A\u4EE3\u7801\u8303\u4F8B\u4E00\u5F8B\u8FD9\u4E48\u5199\u3002'
              },
              {
                source: "editor",
                text: "\u7A0B\u5E8F\u7B49\u5F85\u8F93\u5165\u65F6\u4F1A\u505C\u5728\u90A3\u4E00\u884C\u5E76\u9AD8\u4EAE\u5B83\uFF1B\u8F93\u5165\u7684\u5185\u5BB9\u8981\u548C `DECLARE` \u65F6\u5199\u7684\u7C7B\u578B\u5BF9\u5F97\u4E0A\uFF0C\u5426\u5219\u4F1A\u8BF7\u4F60\u91CD\u65B0\u8F93\u5165\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u95EE\u540D\u5B57\uFF0C\u7136\u540E\u6253\u62DB\u547C",
            fileName: "Example_1_2_a.pseudocode",
            code: [
              "DECLARE Name : STRING",
              'OUTPUT "What is your name?"',
              "INPUT Name",
              'OUTPUT "Hello, ", Name'
            ].join("\n"),
            annotations: [
              {
                fromLine: 1,
                toLine: 1,
                text: "\u51C6\u5907\u4E00\u4E2A\u53EB `Name` \u7684\u540D\u5B57\uFF0C\u7528\u6765\u5B58\u4E00\u4E32\u6587\u5B57\u3002\u6B64\u523B\u5B83\u8FD8\u662F\u7A7A\u7684\u3002"
              },
              {
                fromLine: 2,
                toLine: 3,
                text: "\u5148\u95EE\u4E00\u53E5\uFF0C\u518D\u505C\u4E0B\u6765\u7B49\u8F93\u5165\u3002\u8FD9\u4E24\u884C\u7684\u987A\u5E8F\u4E0D\u80FD\u6362\u2014\u2014\u5148\u8BFB\u7684\u8BDD\uFF0C\u5C4F\u5E55\u4E0A\u4EC0\u4E48\u90FD\u6CA1\u6709\uFF0C\u4EBA\u4E0D\u77E5\u9053\u8BE5\u8F93\u5165\u4EC0\u4E48\u3002"
              },
              {
                fromLine: 4,
                toLine: 4,
                text: "\u4E00\u6B21\u663E\u793A\u4E24\u6837\u4E1C\u897F\u3002`Hello,` \u540E\u9762\u90A3\u4E2A\u7A7A\u683C\u5199\u5728\u5F15\u53F7\u91CC\uFF1B\u6CA1\u6709\u5B83\uFF0C\u7ED3\u679C\u5C31\u662F `Hello,Ada`\u3002"
              }
            ],
            sampleRun: { inputs: ["Ada"], outputs: ["What is your name?", "Hello, Ada"] }
          },
          {
            kind: "comparison",
            title: "\u540C\u4E00\u4E2A\u7A0B\u5E8F\u7684\u4E09\u79CD\u5199\u6CD5",
            intro: "\u73B0\u5728\u4F60\u80FD\u8BFB\u61C2\u4F2A\u4EE3\u7801\u4E86\uFF0C\u53EF\u4EE5\u56DE\u5934\u770B\u770B\u5B83\u5230\u5E95\u7AD9\u5728\u4EC0\u4E48\u4F4D\u7F6E\uFF1A\u4E00\u8FB9\u662F\u81EA\u7136\u8BED\u8A00\uFF0C\u4E00\u8FB9\u662F\u771F\u5B9E\u7684\u7F16\u7A0B\u8BED\u8A00\u3002",
            panes: [
              {
                label: "\u81EA\u7136\u8BED\u8A00",
                language: "natural",
                code: ["\u5148\u95EE\u7528\u6237\u53EB\u4EC0\u4E48\u540D\u5B57\uFF0C", "\u7B49\u4ED6\u56DE\u7B54\u4E4B\u540E\uFF0C", "\u8DDF\u4ED6\u6253\u4E2A\u62DB\u547C\u3002"].join("\n"),
                note: "\u8BFB\u8D77\u6765\u6700\u8F7B\u677E\uFF0C\u4F46\u300C\u6253\u4E2A\u62DB\u547C\u300D\u5230\u5E95\u663E\u793A\u6210\u4EC0\u4E48\u6837\uFF1F\u6CA1\u8BF4\u3002\u4E09\u4E2A\u4EBA\u7167\u8FD9\u6BB5\u8BDD\u5199\u51FA\u6765\u7684\u7A0B\u5E8F\u4F1A\u662F\u4E09\u4E2A\u6837\u5B50\u3002"
              },
              {
                label: "\u4F2A\u4EE3\u7801",
                language: "pseudocode",
                code: [
                  "DECLARE Name : STRING",
                  'OUTPUT "What is your name?"',
                  "INPUT Name",
                  'OUTPUT "Hello, ", Name'
                ].join("\n"),
                note: "\u6BCF\u4E00\u6B65\u8BE5\u663E\u793A\u4EC0\u4E48\u3001\u8BE5\u8BFB\u4EC0\u4E48\uFF0C\u90FD\u5199\u6B7B\u4E86\uFF0C\u4E0D\u7559\u89E3\u91CA\u7684\u4F59\u5730\uFF1B\u540C\u65F6\u53C8\u53EA\u7528\u4E86\u56DB\u4E2A\u56FA\u5B9A\u8BCD\uFF0C\u6CA1\u6709\u522B\u7684\u8D1F\u62C5\u3002"
              },
              {
                label: "\u771F\u5B9E\u7684\u7F16\u7A0B\u8BED\u8A00\uFF08Python\uFF09",
                language: "python",
                code: ['print("What is your name?")', "name = input()", 'print("Hello, " + name)'].join("\n"),
                note: "\u4E00\u6837\u7CBE\u786E\uFF0C\u4F46\u5939\u5E26\u4E86\u8FD9\u95E8\u8BED\u8A00\u81EA\u5DF1\u7684\u89C4\u77E9\uFF1A\u51FD\u6570\u540D\u5C0F\u5199\u3001\u8981\u52A0\u62EC\u53F7\u3001\u8FDE\u63A5\u6587\u5B57\u7528\u52A0\u53F7\u3001\u4E0D\u7528\u5148\u51C6\u5907\u540D\u5B57\u3002\u6362\u4E00\u95E8\u8BED\u8A00\uFF0C\u8FD9\u4E9B\u89C4\u77E9\u53C8\u5168\u53D8\u4E00\u904D\u2014\u2014\u800C\u7B97\u6CD5\u672C\u8EAB\u6839\u672C\u6CA1\u53D8\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0B\u9762\u8FD9\u6BB5\u4EE3\u7801\u628A\u63D0\u95EE\u653E\u5728\u4E86\u8BFB\u53D6\u4E4B\u540E\u3002\u8FD0\u884C\u5B83\uFF0C\u5C4F\u5E55\u4E0A\u4F1A\u4F9D\u6B21\u53D1\u751F\u4EC0\u4E48\uFF1F",
            code: [
              "DECLARE Name : STRING",
              "INPUT Name",
              'OUTPUT "What is your name?"',
              'OUTPUT "Hello, ", Name'
            ].join("\n"),
            options: [
              {
                key: "A",
                label: "\u7A0B\u5E8F\u4E00\u4E0A\u6765\u5C31\u505C\u4E0B\u7B49\u8F93\u5165\uFF0C\u5C4F\u5E55\u4E0A\u8FD8\u662F\u7A7A\u7684\uFF1B\u8F93\u5165\u5B8C\u624D\u770B\u5230\u90A3\u53E5\u63D0\u95EE\u3002",
                correct: true,
                explanation: "\u5BF9\u3002\u7A0B\u5E8F\u6309\u884C\u5F80\u4E0B\u8D70\uFF1A\u7B2C 2 \u884C\u5148\u505C\u4E0B\u7B49\u8F93\u5165\uFF0C\u6B64\u65F6\u7B2C 3 \u884C\u8FD8\u6CA1\u8F6E\u5230\uFF0C\u5C4F\u5E55\u4E0A\u4EC0\u4E48\u90FD\u6CA1\u6709\u3002\u7B49\u8F93\u5165\u5B8C\uFF0C\u63D0\u95EE\u548C\u95EE\u5019\u624D\u4F9D\u6B21\u51FA\u73B0\u3002"
              },
              {
                key: "B",
                label: "\u5148\u663E\u793A\u63D0\u95EE\uFF0C\u518D\u505C\u4E0B\u7B49\u8F93\u5165\u2014\u2014\u548C\u539F\u6765\u7684\u987A\u5E8F\u4E00\u6837\u3002",
                correct: false,
                explanation: "\u4E0D\u4F1A\u3002\u7A0B\u5E8F\u4E0D\u4F1A\u66FF\u4F60\u628A\u63D0\u95EE\u632A\u5230\u524D\u9762\uFF0C\u5B83\u53EA\u6309\u4F60\u5199\u4E0B\u7684\u5148\u540E\u987A\u5E8F\u6267\u884C\u3002\u7B2C 3 \u884C\u6392\u5728\u7B2C 2 \u884C\u540E\u9762\uFF0C\u5C31\u4E00\u5B9A\u540E\u53D1\u751F\u3002"
              },
              {
                key: "C",
                label: "\u7F16\u8F91\u5668\u4F1A\u62A5\u9519\uFF0C\u56E0\u4E3A\u63D0\u95EE\u5FC5\u987B\u5199\u5728\u8BFB\u53D6\u4E4B\u524D\u3002",
                correct: false,
                explanation: "\u4E0D\u4F1A\u62A5\u9519\u3002\u8FD9\u4E24\u884C\u7684\u987A\u5E8F\u5BF9\u4EE3\u7801\u672C\u8EAB\u6765\u8BF4\u5B8C\u5168\u5408\u6CD5\uFF0C\u7A0B\u5E8F\u7167\u8DD1\u4E0D\u8BEF\u2014\u2014\u53EA\u662F\u8DD1\u51FA\u6765\u7684\u6548\u679C\u5BF9\u4F7F\u7528\u7684\u4EBA\u4E0D\u53CB\u597D\u3002\u8BED\u6CD5\u5BF9\u4E0D\u5BF9\uFF0C\u548C\u597D\u4E0D\u597D\u7528\u662F\u4E24\u56DE\u4E8B\u3002"
              },
              {
                key: "D",
                label: "\u7B2C 4 \u884C\u4F1A\u663E\u793A `Hello, `\uFF0C\u540E\u9762\u662F\u7A7A\u7684\uFF0C\u56E0\u4E3A `Name` \u8FD8\u6CA1\u8BFB\u5230\u3002",
                correct: false,
                explanation: "`Name` \u5728\u7B2C 2 \u884C\u5C31\u5DF2\u7ECF\u8BFB\u5230\u4E86\uFF0C\u7B2C 4 \u884C\u7528\u5B83\u6CA1\u6709\u95EE\u9898\u3002\u771F\u6B63\u522B\u626D\u7684\u662F\u63D0\u95EE\u51FA\u73B0\u5F97\u592A\u665A\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "1.2.1",
            title: "\u95EE\u4E24\u6837\u4E1C\u897F\uFF0C\u62FC\u6210\u4E00\u53E5\u8BDD",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u5148\u63D0\u793A\u5E76\u8BFB\u5165\u4E00\u4E2A\u4EBA\u7684\u540D\u5B57\uFF0C\u518D\u63D0\u793A\u5E76\u8BFB\u5165\u4ED6\u6240\u5728\u7684\u57CE\u5E02\uFF0C\u6700\u540E\u663E\u793A\u4E00\u884C `<\u540D\u5B57> lives in <\u57CE\u5E02>`\u3002",
            ioSpec: {
              input: "\u4E24\u884C\u3002\u7B2C\u4E00\u884C\u662F\u540D\u5B57\uFF0C\u7B2C\u4E8C\u884C\u662F\u57CE\u5E02\uFF0C\u90FD\u662F\u4E00\u4E32\u6587\u5B57\uFF08`STRING`\uFF09\u3002",
              output: [
                "\u4E09\u884C\uFF0C\u4F9D\u6B21\u662F\uFF1A",
                "`Enter the name`\u3000\uFF08\u8BFB\u540D\u5B57\u4E4B\u524D\uFF09",
                "`Enter the city`\u3000\uFF08\u8BFB\u57CE\u5E02\u4E4B\u524D\uFF09",
                "`<\u540D\u5B57> lives in <\u57CE\u5E02>`\u3000\uFF08`lives in` \u524D\u540E\u5404\u4E00\u4E2A\u7A7A\u683C\uFF09",
                "\u4E24\u53E5\u63D0\u793A\u8BED\u8981\u4E00\u5B57\u4E0D\u5DEE\u3002"
              ].join("\n")
            },
            constraints: {
              require: [
                {
                  feature: "io.input",
                  reason: "\u8FD9\u4E00\u8282\u7684\u91CD\u70B9\u662F\u5148\u628A\u6570\u636E\u8BFB\u8FDB\u6765\u518D\u7528\uFF0C\u6240\u4EE5\u540D\u5B57\u548C\u57CE\u5E02\u90FD\u5FC5\u987B\u8BFB\u8FDB\u6765\uFF0C\u4E0D\u80FD\u76F4\u63A5\u5199\u5728 `OUTPUT` \u91CC\u3002"
                }
              ]
            },
            hints: [
              "\u4E00\u5171\u8981\u663E\u793A\u4E09\u884C\u3001\u8BFB\u4E24\u6B21\uFF0C\u800C\u4E14\u63D0\u793A\u8BED\u8981\u6392\u5728\u5B83\u5BF9\u5E94\u7684\u90A3\u6B21\u8BFB\u53D6**\u524D\u9762**\u3002",
              "\u5148\u6309\u987A\u5E8F\u628A\u4E94\u53E5\u8BDD\u6392\u597D\uFF1A\u63D0\u793A\u3001\u8BFB\u3001\u63D0\u793A\u3001\u8BFB\u3001\u6700\u540E\u4E00\u884C\u8F93\u51FA\u3002\u518D\u53BB\u60F3\u6BCF\u53E5\u600E\u4E48\u5199\u3002",
              "\u6700\u540E\u90A3\u4E00\u884C\u8981\u663E\u793A\u4E09\u6837\u4E1C\u897F\uFF1A\u7B2C\u4E00\u4E2A\u540D\u5B57\u3001\u5F15\u53F7\u91CC\u7684 ` lives in `\u3001\u7B2C\u4E8C\u4E2A\u540D\u5B57\u3002\u7A7A\u683C\u5199\u5728\u5F15\u53F7\u91CC\u3002"
            ],
            examples: [
              {
                inputs: ["Ada", "Lagos"],
                outputs: ["Enter the name", "Enter the city", "Ada lives in Lagos"]
              }
            ],
            lockedStarterCode: ["DECLARE Name : STRING", "DECLARE City : STRING"].join("\n"),
            starterCode: "",
            referenceSolution: [
              "DECLARE Name : STRING",
              "DECLARE City : STRING",
              'OUTPUT "Enter the name"',
              "INPUT Name",
              'OUTPUT "Enter the city"',
              "INPUT City",
              'OUTPUT Name, " lives in ", City'
            ].join("\n"),
            tests: [
              {
                id: "t1",
                kind: "normal",
                inputs: ["Chen", "Shanghai"],
                caseHint: "\u4E00\u4E2A\u666E\u901A\u7684\u540D\u5B57\u548C\u4E00\u4E2A\u666E\u901A\u7684\u57CE\u5E02\u3002"
              },
              {
                id: "t2",
                kind: "normal",
                inputs: ["Bianca", "Lisbon"],
                caseHint: "\u6362\u4E00\u7EC4\u540D\u5B57\u548C\u57CE\u5E02\uFF0C\u786E\u8BA4\u7A0B\u5E8F\u4E0D\u662F\u628A\u7B54\u6848\u5199\u6B7B\u7684\u3002"
              },
              {
                id: "t3",
                kind: "boundary",
                inputs: ["A", "B"],
                caseHint: "\u5F53\u540D\u5B57\u548C\u57CE\u5E02\u90FD\u53EA\u6709\u4E00\u4E2A\u5B57\u6BCD\u65F6\u3002"
              },
              {
                id: "t4",
                kind: "extreme",
                inputs: ["Maximiliana Gwendolyn Rosalind", "San Cristobal de las Casas"],
                caseHint: "\u5F53\u540D\u5B57\u548C\u57CE\u5E02\u90FD\u5F88\u957F\u3001\u800C\u4E14\u4E2D\u95F4\u5E26\u7A7A\u683C\u65F6\u3002"
              }
            ]
          }
        ]
      },
      // ────────────────────────────────────────────────────────── 1.3
      {
        id: "1.3",
        title: "\u4E66\u5199\u89C4\u8303\u4E0E\u6CE8\u91CA",
        syllabus: ["G\xA71"],
        estimatedMinutes: 7,
        taughtFeatures: ["io.output", "literal.string", "io.input", "decl.variable", "type.string", "misc.comment"],
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u540C\u4E00\u6BB5\u7A0B\u5E8F\u6709\u5F88\u591A\u79CD\u5199\u6CD5\u90FD\u80FD\u8DD1\uFF0C\u4F46 CAIE \u5BF9\u5B83\u957F\u4EC0\u4E48\u6837\u662F\u6709\u89C4\u5B9A\u7684\u3002\u4E24\u6761\u6700\u5E38\u7528\u5230\u7684\u662F\uFF1A\u56FA\u5B9A\u8BCD\uFF08`OUTPUT`\u3001`INPUT`\u3001`DECLARE`\uFF09\u548C\u7C7B\u578B\u540D\uFF08`STRING`\uFF09\u5168\u90E8\u5927\u5199\uFF1B\u9700\u8981\u7F29\u8FDB\u65F6\u7528\u4E09\u4E2A\u7A7A\u683C\u3002\u4F60\u81EA\u5DF1\u8D77\u7684\u540D\u5B57\u4E0D\u53D7\u5927\u5C0F\u5199\u8FD9\u6761\u7EA6\u675F\uFF0C\u4E60\u60EF\u4E0A\u9996\u5B57\u6BCD\u5927\u5199\u3002",
              "\u8FD9\u4E00\u7AE0\u7684\u7A0B\u5E8F\u6BCF\u884C\u90FD\u9876\u683C\uFF0C\u8FD8\u770B\u4E0D\u51FA\u7F29\u8FDB\u7684\u7528\u5904\uFF1B\u7B49 Chapter 4 \u5199\u5230\u300C\u67D0\u4E9B\u884C\u5C5E\u4E8E\u67D0\u4E2A\u5224\u65AD\u5185\u90E8\u300D\u65F6\uFF0C\u7F29\u8FDB\u5C31\u662F\u4E00\u773C\u770B\u51FA\u5C42\u6B21\u7684\u4F9D\u636E\u3002\u73B0\u5728\u53EA\u8981\u8BB0\u4F4F\uFF1A\u4E0D\u8BE5\u7F29\u8FDB\u7684\u884C\u522B\u968F\u624B\u7F29\u8FDB\u3002",
              "\u4EE3\u7801\u91CC\u53EF\u4EE5\u5199\u7ED9\u4EBA\u770B\u7684\u8BF4\u660E\u6587\u5B57\uFF0C\u53EB**\u6CE8\u91CA\uFF08comment\uFF09**\u3002\u5199\u6CD5\u662F\u4E24\u4E2A\u659C\u6760 `//`\uFF0C\u4ECE\u5B83\u5F00\u59CB\u5230\u884C\u5C3E\u90FD\u662F\u6CE8\u91CA\uFF0C\u5B8C\u5168\u4E0D\u53C2\u4E0E\u6267\u884C\u3002\u6CE8\u91CA\u53EF\u4EE5\u5355\u72EC\u5360\u4E00\u884C\uFF0C\u4E5F\u53EF\u4EE5\u8DDF\u5728\u4EE3\u7801\u540E\u9762\u3002",
              "\u6CE8\u91CA\u8BE5\u5199\u300C\u4E3A\u4EC0\u4E48\u8FD9\u4E48\u505A\u300D\uFF0C\u4E0D\u662F\u628A\u4EE3\u7801\u7FFB\u8BD1\u4E00\u904D\u3002\u5728 `INPUT Name` \u540E\u9762\u5199\u300C\u8BFB\u5165\u540D\u5B57\u300D\u6CA1\u6709\u4EFB\u4F55\u65B0\u4FE1\u606F\uFF1B\u5199\u300C\u8FD9\u91CC\u8981\u7684\u662F\u5168\u540D\uFF0C\u4E0D\u662F\u59D3\u300D\u624D\u6709\u7528\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u5173\u952E\u5B57\u4E0E\u7C7B\u578B\u540D\u7528\u5927\u5199\uFF0C\u7F29\u8FDB\u7528\u4E09\u4E2A\u7A7A\u683C\uFF0C\u6CE8\u91CA\u4EE5 `//` \u5F00\u59CB\u5E76\u4F5C\u7528\u5230\u884C\u5C3E\uFF08Pseudocode Guide \xA71.2\u3001\xA71.3\u3001\xA71.5\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u5E26\u6CE8\u91CA\u7684\u5B8C\u6574\u7A0B\u5E8F",
            fileName: "Example_1_3_a.pseudocode",
            code: [
              "// \u95EE\u51FA\u7528\u6237\u7684\u540D\u5B57\u5E76\u6253\u62DB\u547C",
              "DECLARE Name : STRING",
              'OUTPUT "What is your name?"',
              "INPUT Name          // \u8FD9\u91CC\u4F1A\u505C\u4E0B\u6765\u7B49\u8F93\u5165",
              'OUTPUT "Hello, ", Name'
            ].join("\n"),
            annotations: [
              {
                fromLine: 1,
                toLine: 1,
                text: "\u5355\u72EC\u5360\u4E00\u884C\u7684\u6CE8\u91CA\uFF0C\u8BF4\u660E\u6574\u6BB5\u7A0B\u5E8F\u5728\u505A\u4EC0\u4E48\u3002\u5B83\u4E0D\u4F1A\u88AB\u6267\u884C\uFF0C\u4E5F\u4E0D\u4F1A\u663E\u793A\u51FA\u6765\u3002"
              },
              {
                fromLine: 4,
                toLine: 4,
                text: "\u8DDF\u5728\u4EE3\u7801\u540E\u9762\u7684\u6CE8\u91CA\u3002`INPUT Name` \u7167\u5E38\u6267\u884C\uFF0C`//` \u540E\u9762\u7684\u5185\u5BB9\u88AB\u8DF3\u8FC7\u3002"
              }
            ],
            sampleRun: { inputs: ["Ada"], outputs: ["What is your name?", "Hello, Ada"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u8FD0\u884C\u4E0B\u9762\u8FD9\u6BB5\u4EE3\u7801\uFF0C\u4F1A\u663E\u793A\u4EC0\u4E48\uFF1F",
            code: ['// OUTPUT "One"', 'OUTPUT "Two"'].join("\n"),
            options: [
              {
                key: "A",
                label: "\u53EA\u663E\u793A Two",
                correct: true,
                explanation: "\u5BF9\u3002\u7B2C 1 \u884C\u4EE5 `//` \u5F00\u5934\uFF0C\u6574\u884C\u90FD\u662F\u6CE8\u91CA\uFF0C\u7A0B\u5E8F\u76F4\u63A5\u8DF3\u8FC7\u3002\u7ED9\u4E00\u884C\u4EE3\u7801\u524D\u9762\u52A0 `//`\uFF0C\u5C31\u7B49\u4E8E\u6682\u65F6\u8BA9\u5B83\u4E0D\u751F\u6548\u3002"
              },
              {
                key: "B",
                label: "\u5148\u663E\u793A One\uFF0C\u518D\u663E\u793A Two",
                correct: false,
                explanation: "\u7B2C 1 \u884C\u867D\u7136\u957F\u5F97\u50CF\u4EE3\u7801\uFF0C\u4F46\u524D\u9762\u6709 `//`\uFF0C\u6574\u884C\u90FD\u662F\u7ED9\u4EBA\u770B\u7684\u8BF4\u660E\uFF0C\u4E0D\u4F1A\u88AB\u6267\u884C\u3002"
              },
              {
                key: "C",
                label: "\u53EA\u663E\u793A One",
                correct: false,
                explanation: "\u6B63\u597D\u76F8\u53CD\u3002\u88AB `//` \u6321\u4F4F\u7684\u662F\u7B2C 1 \u884C\uFF0C\u7B2C 2 \u884C\u662F\u666E\u901A\u4EE3\u7801\uFF0C\u4F1A\u7167\u5E38\u6267\u884C\u3002"
              },
              {
                key: "D",
                label: "\u4EC0\u4E48\u90FD\u4E0D\u663E\u793A",
                correct: false,
                explanation: "`//` \u53EA\u5F71\u54CD\u5B83\u6240\u5728\u7684\u90A3\u4E00\u884C\uFF0C\u4E0D\u4F1A\u8BA9\u540E\u9762\u7684\u884C\u4E5F\u5931\u6548\u3002"
              }
            ]
          }
        ]
      },
      // ────────────────────────────────────────────────────────── 1.4
      {
        id: "1.4",
        title: "\u7F16\u8F91\u5668\u7ED9\u4F60\u7684\u4E09\u79CD\u63D0\u793A",
        syllabus: ["G\xA71"],
        estimatedMinutes: 6,
        taughtFeatures: ["io.output", "literal.string", "io.input", "decl.variable", "type.string", "misc.comment"],
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u5199\u4EE3\u7801\u65F6\u7F16\u8F91\u5668\u4F1A\u5728\u65C1\u8FB9\u7ED9\u4F60\u63D0\u793A\u3002\u8FD9\u4E9B\u63D0\u793A\u5206\u4E09\u79CD\uFF0C\u542B\u4E49\u5DEE\u522B\u5F88\u5927\uFF1A**\u9519\u8BEF**\u8868\u793A\u4EE3\u7801\u5199\u5F97\u4E0D\u6210\u7ACB\u3001\u7A0B\u5E8F\u8DD1\u4E0D\u8D77\u6765\uFF0C\u5FC5\u987B\u5148\u6539\uFF1B**\u89C4\u8303\u63D0\u793A**\u8868\u793A\u80FD\u8DD1\u3001\u7ED3\u679C\u4E5F\u5BF9\uFF0C\u53EA\u662F\u5199\u6CD5\u4E0D\u7B26\u5408 CAIE \u7684\u89C4\u5B9A\uFF1B**\u5EFA\u8BAE**\u65E2\u4E0D\u5F71\u54CD\u8FD0\u884C\u4E5F\u4E0D\u662F\u660E\u6587\u89C4\u5B9A\uFF0C\u53EA\u662F\u8FD9\u6837\u5199\u66F4\u6E05\u695A\u3002",
              "\u63D0\u793A\u65C1\u8FB9\u4F1A\u6807\u51FA\u8FD9\u6761\u89C4\u5B9A\u6765\u81EA\u54EA\u91CC\uFF1A\u5199\u7740 CAIE \u7684\uFF0C\u662F\u8003\u7EB2\u6216 Pseudocode Guide \u660E\u786E\u89C4\u5B9A\u7684\uFF1B\u5199\u7740\u7F16\u8F91\u5668\u7EA6\u5B9A\u7684\uFF0C\u662F\u8FD9\u4E2A\u5DE5\u5177\u81EA\u5DF1\u5B9A\u7684\u2014\u2014Cambridge \u6CA1\u6709\u89C4\u5B9A\uFF0C\u4F46\u7A0B\u5E8F\u8981\u8DD1\u5C31\u5F97\u6709\u4E2A\u8BF4\u6CD5\u3002"
            ]
          },
          {
            kind: "counterExample",
            title: "\u9519\u8BEF",
            cases: [{
              code: 'OUTPUT "Hello"\nOUTPUT',
              note: "`OUTPUT` \u540E\u9762\u5FC5\u987B\u8BF4\u660E\u8981\u663E\u793A\u4EC0\u4E48\u3002\u7B2C 2 \u884C\u53EA\u5199\u4E86 `OUTPUT`\uFF0C\u7A0B\u5E8F\u4E0D\u4F1A\u8FD0\u884C\u3002",
              expectDiagnostics: [
                {
                  severity: "error",
                  ruleId: "IO-002",
                  line: 2,
                  text: "`OUTPUT` \u540E\u9762\u7F3A\u5C11\u8981\u663E\u793A\u7684\u5185\u5BB9\u3002"
                }
              ]
            }]
          },
          {
            kind: "counterExample",
            title: "\u89C4\u8303\u63D0\u793A",
            cases: [{
              code: 'output "Hello"',
              note: "\u8FD9\u4E00\u884C\u80FD\u6B63\u5E38\u8FD0\u884C\uFF0C\u663E\u793A `Hello`\u3002\u53EA\u662F `output` \u5E94\u8BE5\u5927\u5199\u2014\u2014\u8FD9\u662F CAIE \u660E\u786E\u89C4\u5B9A\u7684\u5199\u6CD5\u3002",
              expectDiagnostics: [
                {
                  severity: "caie",
                  ruleId: "FMT-004",
                  line: 1,
                  text: "`output` \u5E94\u8BE5\u5199\u6210 `OUTPUT`\u3002"
                }
              ]
            }]
          },
          {
            kind: "counterExample",
            title: "\u5EFA\u8BAE",
            cases: [{
              code: 'OUTPUT "One"\n   OUTPUT "Two"',
              note: "\u4E24\u884C\u90FD\u80FD\u6B63\u5E38\u8FD0\u884C\u3002\u53EA\u662F\u7B2C 2 \u884C\u4E0D\u5C5E\u4E8E\u4EFB\u4F55\u5185\u90E8\u7ED3\u6784\uFF0C\u4E0D\u9700\u8981\u7F29\u8FDB\uFF0C\u9876\u683C\u5199\u66F4\u6E05\u695A\u3002",
              expectDiagnostics: [
                {
                  severity: "hint",
                  ruleId: "FMT-002",
                  line: 2,
                  text: "\u8FD9\u4E00\u884C\u4E0D\u9700\u8981\u7F29\u8FDB\uFF0C\u5EFA\u8BAE\u9876\u683C\u5199\u3002"
                }
              ]
            }]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E09\u79CD\u63D0\u793A\u91CC\uFF0C\u54EA\u4E00\u79CD\u5FC5\u987B\u5148\u6539\u6389\uFF0C\u7A0B\u5E8F\u624D\u80FD\u8FD0\u884C\uFF1F",
            options: [
              {
                key: "A",
                label: "\u9519\u8BEF",
                correct: true,
                explanation: "\u5BF9\u3002\u9519\u8BEF\u610F\u5473\u7740\u7F16\u8F91\u5668\u8BFB\u4E0D\u61C2\u8FD9\u6BB5\u4EE3\u7801\uFF0C\u4E0D\u6539\u5C31\u65E0\u6CD5\u8FD0\u884C\u3002\u53E6\u5916\u4E24\u79CD\u90FD\u4E0D\u963B\u6B62\u8FD0\u884C\u3002"
              },
              {
                key: "B",
                label: "\u89C4\u8303\u63D0\u793A",
                correct: false,
                explanation: "\u5B83\u4E0D\u963B\u6B62\u8FD0\u884C\u2014\u2014\u5173\u952E\u5B57\u5199\u6210\u5C0F\u5199\u7167\u6837\u8DD1\u5F97\u51FA\u7ED3\u679C\u3002\u5B83\u63D0\u9192\u7684\u662F\u5199\u6CD5\u4E0D\u7B26\u5408 CAIE \u7684\u89C4\u5B9A\u3002"
              },
              {
                key: "C",
                label: "\u5EFA\u8BAE",
                correct: false,
                explanation: "\u5EFA\u8BAE\u662F\u4E09\u79CD\u91CC\u6700\u8F7B\u7684\uFF0C\u65E2\u4E0D\u5F71\u54CD\u8FD0\u884C\u4E5F\u4E0D\u662F\u660E\u6587\u89C4\u5B9A\uFF0C\u91C7\u7EB3\u4E0E\u5426\u4F60\u81EA\u5DF1\u51B3\u5B9A\u3002"
              },
              {
                key: "D",
                label: "\u4E09\u79CD\u90FD\u5FC5\u987B\u6539\u6389\u624D\u80FD\u8FD0\u884C",
                correct: false,
                explanation: "\u53EA\u6709\u7B2C\u4E00\u79CD\u4F1A\u6321\u4F4F\u8FD0\u884C\u3002\u628A\u4E09\u79CD\u6DF7\u6210\u4E00\u79CD\u770B\u5F85\uFF0C\u5C31\u5206\u4E0D\u6E05\u300C\u975E\u6539\u4E0D\u53EF\u300D\u548C\u300C\u53EF\u4EE5\u518D\u60F3\u60F3\u300D\u3002"
              }
            ]
          }
        ]
      }
    ],
    // ────────────────────────────────────────────────────── 章末大题
    chapterTasks: [
      {
        kind: "chapterTask",
        id: "1.T1",
        title: "\u505A\u4E00\u5F20\u9009\u8BFE\u786E\u8BA4\u5355",
        statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u4F9D\u6B21\u8BFB\u5165\u5B66\u751F\u7684\u540D\u5B57\u3001\u8981\u62A5\u7684\u79D1\u76EE\u548C\u4E0A\u8BFE\u7684\u6559\u5BA4\uFF0C\u7136\u540E\u663E\u793A\u56DB\u884C\u786E\u8BA4\u5355\u3002\u4EE3\u7801\u8981\u7B26\u5408\u8FD9\u4E00\u7AE0\u8BB2\u8FC7\u7684\u4E66\u5199\u89C4\u8303\uFF0C\u5E76\u4E14\u5E26\u4E0A\u8BF4\u660E\u7528\u7684\u6CE8\u91CA\u3002",
        ioSpec: {
          input: "\u4E09\u884C\u3002\u4F9D\u6B21\u662F\u540D\u5B57\u3001\u79D1\u76EE\u3001\u6559\u5BA4\uFF0C\u90FD\u662F\u4E00\u4E32\u6587\u5B57\uFF08`STRING`\uFF09\u3002",
          output: [
            "\u4E03\u884C\u3002\u4E09\u53E5\u63D0\u793A\u8BED\u5404\u81EA\u6392\u5728\u5B83\u5BF9\u5E94\u7684\u90A3\u6B21\u8BFB\u53D6\u4E4B\u524D\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
            "`Enter the student name`",
            "`Enter the subject`",
            "`Enter the room`",
            "\u4E09\u6837\u90FD\u8BFB\u5B8C\u4E4B\u540E\uFF0C\u518D\u663E\u793A\u8FD9\u56DB\u884C\uFF1A",
            "`Enrolment confirmed`",
            "`Student: <\u540D\u5B57>`",
            "`Subject: <\u79D1\u76EE>`",
            "`Room: <\u6559\u5BA4>`",
            "\u5192\u53F7\u540E\u9762\u90FD\u662F\u4E00\u4E2A\u7A7A\u683C\u3002"
          ].join("\n")
        },
        suggestedFeatures: ["io.input", "io.output", "decl.variable", "misc.comment"],
        hints: [
          "\u5148\u628A\u8FD9\u9053\u9898\u62C6\u6210\u4E09\u6BB5\uFF1A\u8981\u8BFB\u51E0\u6837\u4E1C\u897F\u3001\u8981\u663E\u793A\u51E0\u884C\u3001\u6BCF\u884C\u957F\u4EC0\u4E48\u6837\u3002",
          "\u524D\u534A\u6BB5\u662F\u300C\u63D0\u793A\u2014\u8BFB\u300D\u91CD\u590D\u4E09\u6B21\uFF0C\u540E\u534A\u6BB5\u662F\u56DB\u53E5 `OUTPUT`\u3002\u786E\u8BA4\u5355\u7684\u7B2C\u4E00\u884C\u4E0D\u9700\u8981\u7528\u5230\u8BFB\u8FDB\u6765\u7684\u5185\u5BB9\u3002",
          "\u786E\u8BA4\u5355\u7684\u56DB\u884C\u8981\u7B49\u4E09\u6837\u90FD\u8BFB\u5B8C\u518D\u663E\u793A\uFF1B\u4E0D\u8981\u8BFB\u4E00\u6837\u5C31\u663E\u793A\u4E00\u884C\u3002"
        ],
        examples: [
          {
            inputs: ["Ada", "Computer Science", "B204"],
            outputs: [
              "Enter the student name",
              "Enter the subject",
              "Enter the room",
              "Enrolment confirmed",
              "Student: Ada",
              "Subject: Computer Science",
              "Room: B204"
            ]
          }
        ],
        lockedStarterCode: [
          "DECLARE Name : STRING",
          "DECLARE Subject : STRING",
          "DECLARE Room : STRING"
        ].join("\n"),
        starterCode: "",
        referenceSolution: [
          "// \u8BFB\u5165\u9009\u8BFE\u4FE1\u606F\uFF0C\u8F93\u51FA\u4E00\u5F20\u786E\u8BA4\u5355",
          "DECLARE Name : STRING",
          "DECLARE Subject : STRING",
          "DECLARE Room : STRING",
          'OUTPUT "Enter the student name"',
          "INPUT Name",
          'OUTPUT "Enter the subject"',
          "INPUT Subject",
          'OUTPUT "Enter the room"',
          "INPUT Room",
          'OUTPUT "Enrolment confirmed"',
          'OUTPUT "Student: ", Name',
          'OUTPUT "Subject: ", Subject',
          'OUTPUT "Room: ", Room'
        ].join("\n"),
        tests: [
          {
            id: "t1",
            kind: "normal",
            inputs: ["Chen", "Physics", "A101"],
            caseHint: "\u4E00\u7EC4\u666E\u901A\u7684\u9009\u8BFE\u4FE1\u606F\u3002"
          },
          {
            id: "t2",
            kind: "normal",
            inputs: ["Bianca", "Further Mathematics", "Lab 3"],
            caseHint: "\u5F53\u79D1\u76EE\u540D\u548C\u6559\u5BA4\u540D\u90FD\u7531\u591A\u4E2A\u5355\u8BCD\u7EC4\u6210\u65F6\u3002"
          },
          {
            id: "t3",
            kind: "boundary",
            inputs: ["A", "B", "C"],
            caseHint: "\u5F53\u4E09\u9879\u5185\u5BB9\u90FD\u53EA\u6709\u4E00\u4E2A\u5B57\u6BCD\u65F6\u3002"
          },
          {
            id: "t4",
            kind: "extreme",
            inputs: [
              "Maximiliana Gwendolyn Rosalind",
              "Design and Technology: Product Design",
              "Building C, Second Floor, Room 214"
            ],
            caseHint: "\u5F53\u4E09\u9879\u5185\u5BB9\u90FD\u5F88\u957F\uFF0C\u800C\u4E14\u91CC\u9762\u672C\u8EAB\u5E26\u6807\u70B9\u65F6\u3002"
          }
        ]
      }
    ]
  };

  // packages/teaching-content/src/chapter-02.ts
  var chapter02 = {
    id: 2,
    title: "\u53D8\u91CF\u4E0E\u6570\u636E\u7C7B\u578B",
    level: "AS",
    syllabus: ["\xA710.1", "\xA711.1", "G\xA72"],
    prerequisites: [1],
    sections: [
      {
        id: "2.1",
        title: "\u53D8\u91CF\u3001\u6807\u8BC6\u7B26\u4E0E\u58F0\u660E",
        syllabus: ["\xA710.1", "G\xA72.3", "G\xA72.4"],
        estimatedMinutes: 8,
        taughtFeatures: ["io.output", "io.input", "decl.variable", "misc.comment", "type.string", "literal.string"],
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E0A\u4E00\u7AE0\u7684 `INPUT Name` \u5148\u628A\u540D\u5B57\u8BFB\u8FDB\u6765\uFF0C\u540E\u6765 `OUTPUT` \u53C8\u628A\u5B83\u62FF\u51FA\u6765\u3002\u4E2D\u95F4\u90A3\u4E2A\u53EB `Name` \u7684\u4F4D\u7F6E\uFF0C\u5C31\u662F**\u53D8\u91CF\uFF08variable\uFF09**\uFF1A\u5B83\u6709\u4E00\u4E2A\u540D\u5B57\uFF0C\u91CC\u9762\u653E\u7684\u503C\u53EF\u4EE5\u5728\u7A0B\u5E8F\u8FD0\u884C\u65F6\u6539\u53D8\u3002",
              "\u7ED9\u53D8\u91CF\u8D77\u7684\u540D\u5B57\u53EB**\u6807\u8BC6\u7B26\uFF08identifier\uFF09**\u3002\u5B83\u5FC5\u987B\u4ECE\u5B57\u6BCD\u5F00\u59CB\uFF0C\u4E4B\u540E\u53EA\u80FD\u7528\u5B57\u6BCD\u3001\u6570\u5B57\u6216\u4E0B\u5212\u7EBF\uFF1B\u4E0D\u80FD\u6709\u7A7A\u683C\uFF0C\u4E5F\u4E0D\u8981\u7528\u5E26\u91CD\u97F3\u7684\u5B57\u6BCD\u3002`PlayerName` \u53EF\u4EE5\uFF0C`2ndPlayer` \u548C `Player Name` \u4E0D\u53EF\u4EE5\u3002\u6807\u8BC6\u7B26\u4E0D\u533A\u5206\u5927\u5C0F\u5199\uFF0C\u6240\u4EE5 `Score` \u4E0E `score` \u4E0D\u80FD\u5F53\u6210\u4E24\u4E2A\u4E0D\u540C\u7684\u540D\u5B57\u3002",
              "\u5728\u7B2C\u4E00\u6B21\u4F7F\u7528\u53D8\u91CF\u524D\uFF0C\u5148\u7528**\u58F0\u660E\uFF08declaration\uFF09**\u544A\u8BC9\u8BFB\u8005\u5B83\u53EB\u4EC0\u4E48\u3001\u91CC\u9762\u51C6\u5907\u653E\u54EA\u79CD\u6570\u636E\uFF1A`DECLARE \u540D\u5B57 : \u6570\u636E\u7C7B\u578B`\u3002\u8FD9\u4E00\u6B65\u53EA\u662F\u51C6\u5907\u4F4D\u7F6E\uFF0C\u4E0D\u662F\u628A\u4E00\u4E2A\u503C\u653E\u8FDB\u53BB\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u6807\u8BC6\u7B26\u4EE5\u5B57\u6BCD\u5F00\u5934\uFF0C\u53EA\u80FD\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u4E0B\u5212\u7EBF\uFF1B\u5B83\u4EEC\u4E0D\u533A\u5206\u5927\u5C0F\u5199\u3002\u53D8\u91CF\u58F0\u660E\u5199\u6210 `DECLARE <identifier> : <data type>`\uFF08Pseudocode Guide \xA72.3\u3001\xA72.4\uFF09\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0B\u9762\u54EA\u4E2A\u540D\u5B57\u53EF\u4EE5\u4F5C\u4E3A\u6807\u8BC6\u7B26\uFF1F",
            options: [
              { key: "A", label: "2ndPlayer", correct: false, explanation: "\u4E0D\u53EF\u4EE5\u3002\u6807\u8BC6\u7B26\u7684\u7B2C\u4E00\u4E2A\u5B57\u7B26\u5FC5\u987B\u662F\u5B57\u6BCD\uFF0C\u4E0D\u80FD\u4ECE\u6570\u5B57\u5F00\u59CB\u3002" },
              { key: "B", label: "Player Name", correct: false, explanation: "\u4E0D\u53EF\u4EE5\u3002\u7A7A\u683C\u4F1A\u628A\u5B83\u62C6\u6210\u4E24\u4E2A\u90E8\u5206\uFF1B\u6807\u8BC6\u7B26\u4E2D\u6CA1\u6709\u7A7A\u683C\u3002" },
              { key: "C", label: "Player_Name2", correct: true, explanation: "\u53EF\u4EE5\u3002\u5B83\u4ECE\u5B57\u6BCD\u5F00\u59CB\uFF0C\u540E\u9762\u53EA\u7528\u4E86\u5B57\u6BCD\u3001\u4E0B\u5212\u7EBF\u548C\u6570\u5B57\u3002" },
              { key: "D", label: "Player-Name", correct: false, explanation: "\u4E0D\u53EF\u4EE5\u3002\u8FDE\u5B57\u7B26\u4E0D\u662F\u6807\u8BC6\u7B26\u5141\u8BB8\u4F7F\u7528\u7684\u5B57\u7B26\uFF1B\u9700\u8981\u5206\u9694\u65F6\u53EF\u4EE5\u7528\u4E0B\u5212\u7EBF\u3002" }
            ]
          }
        ]
      },
      {
        id: "2.2",
        title: "\u516D\u79CD\u57FA\u672C\u7C7B\u578B",
        syllabus: ["\xA710.1", "G\xA72.1"],
        estimatedMinutes: 10,
        taughtFeatures: [
          "io.output",
          "io.input",
          "decl.variable",
          "misc.comment",
          "type.string",
          "literal.string",
          "type.integer",
          "type.real",
          "type.char",
          "type.boolean",
          "type.date"
        ],
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "**\u6570\u636E\u7C7B\u578B\uFF08data type\uFF09**\u8BF4\u660E\u4E00\u4E2A\u4F4D\u7F6E\u53EF\u4EE5\u653E\u4EC0\u4E48\u6837\u7684\u503C\u3002\u5B83\u8BA9\u4EBA\u4E00\u773C\u770B\u51FA\u6570\u636E\u7684\u542B\u4E49\uFF0C\u4E5F\u8BA9\u7F16\u8F91\u5668\u80FD\u963B\u6B62\u628A\u4E0D\u76F8\u914D\u7684\u503C\u6DF7\u5728\u4E00\u8D77\u3002",
              "`INTEGER` \u662F\u6574\u6570\uFF0C`REAL` \u53EF\u4EE5\u6709\u5C0F\u6570\u90E8\u5206\uFF1B`CHAR` \u6070\u597D\u662F\u4E00\u4E2A\u5B57\u7B26\uFF0C`STRING` \u662F\u96F6\u4E2A\u6216\u591A\u4E2A\u5B57\u7B26\u3002`BOOLEAN` \u53EA\u6709 `TRUE` \u548C `FALSE` \u4E24\u79CD\u503C\uFF1B`DATE` \u8868\u793A\u4E00\u4E2A\u6709\u6548\u7684\u65E5\u5386\u65E5\u671F\u3002",
              "\u7C7B\u578B\u4E0D\u662F\u53D8\u91CF\u540D\u7684\u4E00\u90E8\u5206\u3002`DECLARE Total : REAL` \u7684 `Total` \u662F\u4F60\u53D6\u7684\u540D\u5B57\uFF0C`REAL` \u624D\u662F\u5728\u8BF4\u660E\u5B83\u80FD\u4FDD\u5B58\u4EC0\u4E48\u3002\u5148\u5206\u6E05\u8FD9\u4E24\u4E2A\u4F4D\u7F6E\uFF0C\u8BFB\u58F0\u660E\u5C31\u4E0D\u4F1A\u4E71\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u57FA\u672C\u6570\u636E\u7C7B\u578B\u662F `INTEGER`\u3001`REAL`\u3001`CHAR`\u3001`STRING`\u3001`BOOLEAN` \u548C `DATE`\uFF08Pseudocode Guide \xA72.1\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u628A\u4E0D\u540C\u7684\u6570\u636E\u653E\u8FDB\u5408\u9002\u7684\u4F4D\u7F6E",
            fileName: "Example_2_2_a.pseudocode",
            code: [
              "DECLARE Count : INTEGER",
              "DECLARE Price : REAL",
              "DECLARE Initial : CHAR",
              "DECLARE Message : STRING",
              "DECLARE Finished : BOOLEAN",
              "DECLARE StartDate : DATE",
              'OUTPUT "Enter the count"',
              "INPUT Count",
              "OUTPUT Count"
            ].join("\n"),
            annotations: [
              { fromLine: 1, toLine: 2, text: "\u6570\u91CF\u901A\u5E38\u7528 `INTEGER`\uFF1B\u53EF\u80FD\u5E26\u5C0F\u6570\u7684\u4EF7\u683C\u7528 `REAL`\u3002" },
              { fromLine: 3, toLine: 4, text: "\u5355\u4E2A\u5B57\u6BCD\u7528 `CHAR`\uFF1B\u4E00\u53E5\u6587\u5B57\u6216\u7A7A\u6587\u5B57\u7528 `STRING`\u3002" },
              { fromLine: 5, toLine: 6, text: "\u53EA\u6709\u662F\u6216\u5426\u7684\u72B6\u6001\u7528 `BOOLEAN`\uFF1B\u65E5\u5386\u4E0A\u7684\u65E5\u671F\u7528 `DATE`\u3002" },
              { fromLine: 7, toLine: 9, text: "\u8F93\u5165\u524D\u5148\u663E\u793A\u63D0\u793A\u3002\u8FD9\u91CC\u8BFB\u5165\u7684\u5185\u5BB9\u4F1A\u653E\u8FDB `INTEGER` \u7C7B\u578B\u7684 `Count`\u3002" }
            ],
            sampleRun: { inputs: ["12"], outputs: ["Enter the count", "12"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u8981\u4FDD\u5B58\u201C\u8FD9\u672C\u4E66\u662F\u5426\u5DF2\u7ECF\u5F52\u8FD8\u201D\uFF0C\u54EA\u79CD\u7C7B\u578B\u6700\u5408\u9002\uFF1F",
            options: [
              { key: "A", label: "INTEGER", correct: false, explanation: "\u6574\u6570\u9002\u5408\u6570\u91CF\u6216\u8BA1\u6570\uFF1B\u8FD9\u91CC\u9700\u8981\u8868\u8FBE\u7684\u662F\u4E24\u79CD\u72B6\u6001\uFF0C\u4E0D\u662F\u4E00\u4E2A\u6570\u3002" },
              { key: "B", label: "BOOLEAN", correct: true, explanation: "\u5BF9\u3002\u5F52\u8FD8\u6216\u672A\u5F52\u8FD8\u662F\u4E24\u79CD\u72B6\u6001\uFF0C\u6B63\u597D\u7528 `TRUE` \u6216 `FALSE` \u8868\u793A\u3002" },
              { key: "C", label: "CHAR", correct: false, explanation: "\u5355\u4E2A\u5B57\u7B26\u53EF\u4EE5\u5199\u51FA Y \u6216 N\uFF0C\u4F46\u90A3\u662F\u5728\u7528\u5B57\u7B26\u4EE3\u66FF\u72B6\u6001\uFF1B\u8FD9\u91CC\u76F4\u63A5\u7528\u5E03\u5C14\u503C\u66F4\u8D34\u5207\u3002" },
              { key: "D", label: "DATE", correct: false, explanation: "\u65E5\u671F\u53EF\u4EE5\u8BB0\u5F55\u4F55\u65F6\u5F52\u8FD8\uFF0C\u4F46\u4E0D\u80FD\u5355\u72EC\u56DE\u7B54\u201C\u662F\u5426\u5DF2\u7ECF\u5F52\u8FD8\u201D\u3002" }
            ]
          }
        ]
      },
      {
        id: "2.3",
        title: "\u5B57\u9762\u91CF\u600E\u6837\u5199",
        syllabus: ["G\xA72.2"],
        estimatedMinutes: 8,
        taughtFeatures: [
          "io.output",
          "io.input",
          "decl.variable",
          "misc.comment",
          "type.string",
          "literal.string",
          "type.integer",
          "type.real",
          "type.char",
          "type.boolean",
          "type.date",
          "literal.integer",
          "literal.real",
          "literal.char",
          "literal.boolean",
          "literal.date"
        ],
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u76F4\u63A5\u5199\u5728\u4EE3\u7801\u91CC\u7684\u4E00\u4E2A\u786E\u5B9A\u503C\u53EB**\u5B57\u9762\u91CF\uFF08literal\uFF09**\u3002`7` \u662F\u6574\u6570\uFF0C`0.5` \u662F\u5B9E\u6570\uFF1B\u5B9E\u6570\u7684\u5C0F\u6570\u70B9\u4E24\u8FB9\u90FD\u8981\u6709\u6570\u5B57\uFF0C\u6240\u4EE5\u5199 `0.5`\uFF0C\u4E0D\u5199 `.5`\u3002",
              '\u4E00\u4E2A `CHAR` \u7528\u5355\u5F15\u53F7\u5305\u8D77\u6765\uFF0C\u4F8B\u5982 `\'A\'`\uFF1B\u4E00\u4E2A `STRING` \u7528\u53CC\u5F15\u53F7\u5305\u8D77\u6765\uFF0C\u4F8B\u5982 `"Ada"`\u3002\u7A7A\u5B57\u7B26\u4E32\u4E5F\u53EF\u4EE5\u5199\uFF0C\u5F62\u5F0F\u662F `""`\u3002\u5F15\u53F7\u544A\u8BC9\u8BFB\u8005\u8FD9\u662F\u6587\u5B57\uFF0C\u4E0D\u662F\u4E00\u4E2A\u53EB Ada \u7684\u53D8\u91CF\u3002',
              "\u5E03\u5C14\u503C\u76F4\u63A5\u5199 `TRUE` \u6216 `FALSE`\u3002\u65E5\u671F\u901A\u5E38\u5199\u6210 `dd/mm/yyyy`\uFF0C\u4F8B\u5982 `02/01/2028`\uFF1B\u4E0D\u540C\u5730\u65B9\u5BF9\u65E5\u671F\u6B21\u5E8F\u7684\u4E60\u60EF\u4E0D\u540C\uFF0C\u4F7F\u7528\u65F6\u8981\u8BF4\u660E\u8FD9\u91CC\u91C7\u7528\u7684\u683C\u5F0F\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "`CHAR` \u7528\u5355\u5F15\u53F7\uFF0C`STRING` \u7528\u53CC\u5F15\u53F7\uFF0C`BOOLEAN` \u5199\u6210 `TRUE` \u6216 `FALSE`\uFF1B`REAL` \u7684\u5C0F\u6570\u70B9\u4E24\u8FB9\u90FD\u81F3\u5C11\u6709\u4E00\u4F4D\u6570\u5B57\uFF08Pseudocode Guide \xA72.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u540C\u6837\u662F\u6587\u5B57\uFF0C\u5F15\u53F7\u8868\u793A\u7684\u8303\u56F4\u4E0D\u540C",
            fileName: "Example_2_3_a.pseudocode",
            code: [
              "OUTPUT 'A'",
              'OUTPUT "Ada"',
              "OUTPUT TRUE",
              "OUTPUT 02/01/2028"
            ].join("\n"),
            annotations: [
              { fromLine: 1, toLine: 1, text: "`'A'` \u662F\u4E00\u4E2A\u5B57\u7B26\uFF0C\u6240\u4EE5\u7528\u5355\u5F15\u53F7\u3002" },
              { fromLine: 2, toLine: 2, text: '`"Ada"` \u662F\u591A\u4E2A\u5B57\u7B26\u7EC4\u6210\u7684\u5B57\u7B26\u4E32\uFF0C\u6240\u4EE5\u7528\u53CC\u5F15\u53F7\u3002' },
              { fromLine: 3, toLine: 4, text: "\u5E03\u5C14\u503C\u4E0D\u52A0\u5F15\u53F7\uFF1B\u65E5\u671F\u6309\u65E5\u3001\u6708\u3001\u5E74\u7684\u6B21\u5E8F\u5199\u3002" }
            ],
            sampleRun: { inputs: [], outputs: ["A", "Ada", "TRUE", "02/01/2028"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0B\u9762\u54EA\u4E00\u4E2A\u662F\u53EA\u542B\u4E00\u4E2A\u5B57\u7B26\u7684 `CHAR` \u5B57\u9762\u91CF\uFF1F",
            options: [
              { key: "A", label: '"A"', correct: false, explanation: "\u53CC\u5F15\u53F7\u5305\u4F4F\u7684\u662F `STRING`\uFF1B\u5373\u4F7F\u91CC\u9762\u53EA\u6709\u4E00\u4E2A\u5B57\u7B26\uFF0C\u5B83\u7684\u7C7B\u578B\u4ECD\u662F\u5B57\u7B26\u4E32\u3002" },
              { key: "B", label: "'A'", correct: true, explanation: "\u5BF9\u3002\u5355\u5F15\u53F7\u5305\u4F4F\u4E00\u4E2A\u5B57\u7B26\uFF0C\u5C31\u662F `CHAR` \u5B57\u9762\u91CF\u3002" },
              { key: "C", label: "A", correct: false, explanation: "\u6CA1\u6709\u5F15\u53F7\u7684 A \u4F1A\u88AB\u8BFB\u4F5C\u4E00\u4E2A\u540D\u5B57\uFF0C\u4E0D\u662F\u4E00\u4E2A\u76F4\u63A5\u5199\u51FA\u7684\u5B57\u7B26\u503C\u3002" },
              { key: "D", label: '""', correct: false, explanation: "\u8FD9\u662F\u7A7A\u5B57\u7B26\u4E32\uFF0C\u91CC\u9762\u6CA1\u6709\u4EFB\u4F55\u5B57\u7B26\uFF1B\u5B83\u5C5E\u4E8E `STRING`\uFF0C\u4E0D\u662F `CHAR`\u3002" }
            ]
          }
        ]
      },
      {
        id: "2.4",
        title: "\u8D4B\u503C\u4E0E\u521D\u59CB\u5316",
        syllabus: ["\xA710.1", "G\xA72.6"],
        estimatedMinutes: 9,
        taughtFeatures: [
          "io.output",
          "io.input",
          "decl.variable",
          "misc.comment",
          "type.string",
          "literal.string",
          "type.integer",
          "type.real",
          "type.char",
          "type.boolean",
          "type.date",
          "literal.integer",
          "literal.real",
          "literal.char",
          "literal.boolean",
          "literal.date",
          "assign.simple"
        ],
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u58F0\u660E\u53EA\u662F\u51C6\u5907\u4E00\u4E2A\u4F4D\u7F6E\uFF1B\u628A\u503C\u653E\u8FDB\u53BB\u8981\u7528**\u8D4B\u503C\uFF08assignment\uFF09**\u3002\u5199\u6CD5\u662F `\u540D\u5B57 \u2190 \u503C`\uFF0C\u7BAD\u5934\u8868\u793A\u503C\u4ECE\u53F3\u8FB9\u653E\u5230\u5DE6\u8FB9\u7684\u53D8\u91CF\u91CC\u3002\u8FD9\u91CC\u4E0D\u80FD\u7528 `=`\uFF1B`=` \u7559\u7ED9\u540E\u9762 Chapter 3 \u7684\u6BD4\u8F83\u3002",
              "\u7B2C\u4E00\u6B21\u7ED9\u53D8\u91CF\u653E\u5165\u4E00\u4E2A\u503C\u53EB**\u521D\u59CB\u5316\uFF08initialisation\uFF09**\u3002\u4F8B\u5982 `Score \u2190 0` \u8BA9\u4E00\u4E2A\u6574\u6570\u53D8\u91CF\u4ECE\u96F6\u5F00\u59CB\u3002\u53D8\u91CF\u5FC5\u987B\u5148\u6709\u503C\uFF0C\u624D\u53EF\u4EE5\u628A\u5B83\u62FF\u53BB `OUTPUT` \u6216\u53C2\u4E0E\u8BA1\u7B97\uFF1B\u53EA\u58F0\u660E\u800C\u6CA1\u6709\u8D4B\u503C\u65F6\uFF0C\u91CC\u9762\u4ECD\u7136\u662F\u7A7A\u7684\u3002",
              '\u53F3\u8FB9\u7684\u503C\u8981\u548C\u5DE6\u8FB9\u53D8\u91CF\u7684\u6570\u636E\u7C7B\u578B\u76F8\u914D\u3002\u628A `"Ada"` \u653E\u8FDB `STRING` \u53EF\u4EE5\uFF1B\u628A\u4E00\u6BB5\u6587\u5B57\u653E\u8FDB `INTEGER` \u4E0D\u884C\u3002\u7F16\u8F91\u5668\u4F1A\u5728\u771F\u6B63\u8FD0\u884C\u524D\u6307\u51FA\u8FD9\u79CD\u4E0D\u76F8\u914D\u3002'
            ],
            callouts: [
              { source: "CAIE", text: "\u8D4B\u503C\u5199\u6210 `<identifier> \u2190 <value>`\uFF1B\u5DE6\u8FB9\u5FC5\u987B\u662F\u53D8\u91CF\uFF0C\u53F3\u8FB9\u7684\u8868\u8FBE\u5F0F\u5FC5\u987B\u5F97\u5230\u76F8\u540C\u7684\u6570\u636E\u7C7B\u578B\uFF08Pseudocode Guide \xA72.6\uFF09\u3002" },
              { source: "editor", text: "\u672C\u7F16\u8F91\u5668\u4E0D\u4F1A\u66FF\u6CA1\u6709\u8D4B\u503C\u7684\u53D8\u91CF\u731C\u4E00\u4E2A\u9ED8\u8BA4\u5185\u5BB9\uFF1B\u8BFB\u53D6\u672A\u521D\u59CB\u5316\u53D8\u91CF\u4F1A\u505C\u6B62\u8FD0\u884C\u5E76\u6307\u51FA\u4F4D\u7F6E\u3002" }
            ]
          },
          {
            kind: "example",
            title: "\u51C6\u5907\u4F4D\u7F6E\uFF0C\u518D\u653E\u5165\u8D77\u59CB\u5206\u6570",
            fileName: "Example_2_4_a.pseudocode",
            code: ["DECLARE Score : INTEGER", "Score \u2190 0", "OUTPUT Score"].join("\n"),
            annotations: [
              { fromLine: 1, toLine: 1, text: "\u5148\u58F0\u660E `Score` \u53EA\u80FD\u4FDD\u5B58\u6574\u6570\u3002" },
              { fromLine: 2, toLine: 3, text: "\u7B2C 2 \u884C\u5B8C\u6210\u521D\u59CB\u5316\uFF1B\u56E0\u6B64\u7B2C 3 \u884C\u8BFB\u53D6\u5B83\u65F6\uFF0C\u5DF2\u7ECF\u6709\u4E00\u4E2A\u660E\u786E\u7684\u503C\u3002" }
            ],
            sampleRun: { inputs: [], outputs: ["0"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u54EA\u4E00\u884C\u662F\u5728\u628A\u6574\u6570\u53D8\u91CF `Count` \u521D\u59CB\u5316\u4E3A\u96F6\uFF1F",
            options: [
              { key: "A", label: "DECLARE Count : INTEGER", correct: false, explanation: "\u8FD9\u884C\u53EA\u8BF4\u660E Count \u51C6\u5907\u4FDD\u5B58\u6574\u6570\uFF0C\u8FD8\u6CA1\u6709\u628A\u4EFB\u4F55\u6574\u6570\u653E\u8FDB\u53BB\u3002" },
              { key: "B", label: "Count = 0", correct: false, explanation: "`=` \u4E0D\u662F\u8D4B\u503C\u7BAD\u5934\uFF1B\u672C\u8BFE\u7A0B\u7684\u8D4B\u503C\u8981\u6E05\u695A\u5199\u51FA `\u2190`\u3002" },
              { key: "C", label: "Count \u2190 0", correct: true, explanation: "\u5BF9\u3002\u7BAD\u5934\u628A\u53F3\u8FB9\u7684\u6574\u6570\u96F6\u653E\u8FDB\u5DE6\u8FB9\u7684 Count\uFF0C\u6B63\u662F\u7B2C\u4E00\u6B21\u8D4B\u503C\u3002" },
              { key: "D", label: "OUTPUT Count", correct: false, explanation: "OUTPUT \u662F\u8BFB\u53D6\u5E76\u663E\u793A\u73B0\u6709\u7684\u503C\uFF1B\u5B83\u4E0D\u4F1A\u66FF\u53D8\u91CF\u521B\u5EFA\u4E00\u4E2A\u503C\u3002" }
            ]
          },
          {
            kind: "task",
            id: "2.4.1",
            title: "\u8BB0\u5F55\u8D77\u59CB\u79EF\u5206",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u51C6\u5907\u4E00\u4E2A\u4FDD\u5B58\u79EF\u5206\u7684\u6574\u6570\u53D8\u91CF\uFF0C\u628A\u5B83\u7684\u8D77\u59CB\u503C\u8BBE\u4E3A\u96F6\uFF0C\u7136\u540E\u663E\u793A\u4E00\u884C `Points: 0`\u3002",
            ioSpec: { input: "\u6CA1\u6709\u8F93\u5165\u3002", output: "\u4E00\u884C\uFF1A`Points: 0`\u3002\u5192\u53F7\u540E\u6709\u4E00\u4E2A\u7A7A\u683C\u3002" },
            constraints: {
              require: [
                { feature: "assign.simple", reason: "\u672C\u8282\u7EC3\u4E60\u7684\u662F\u5148\u7ED9\u53D8\u91CF\u4E00\u4E2A\u503C\uFF1B\u53EA\u628A\u96F6\u76F4\u63A5\u5199\u8FDB OUTPUT \u4E0D\u80FD\u4F53\u73B0\u521D\u59CB\u5316\u3002" },
                { feature: "io.output-variable", reason: 'OUTPUT \u8981\u663E\u793A\u7684\u662F Points \u53D8\u91CF\u91CC\u7684\u503C\uFF0C\u4E0D\u80FD\u628A "Points: 0" \u6574\u53E5\u5199\u6210\u56FA\u5B9A\u6587\u5B57\u3002' }
              ]
            },
            hints: [
              "\u5148\u60F3\u6E05\u695A\uFF1A\u53D8\u91CF\u91CC\u8981\u4FDD\u5B58\u7684\u662F\u4E00\u4E2A\u6CA1\u6709\u5C0F\u6570\u7684\u6570\u91CF\u3002",
              "\u628A\u201C\u51C6\u5907\u4F4D\u7F6E\u201D\u201C\u653E\u5165\u96F6\u201D\u201C\u663E\u793A\u7ED3\u679C\u201D\u6309\u8FD9\u4E2A\u987A\u5E8F\u5199\u6210\u4E09\u6B65\u3002"
            ],
            examples: [{ inputs: [], outputs: ["Points: 0"] }],
            starterCode: "DECLARE Points : INTEGER\n",
            referenceSolution: ["DECLARE Points : INTEGER", "Points \u2190 0", 'OUTPUT "Points: ", Points'].join("\n"),
            tests: [{ id: "t1", kind: "normal", inputs: [], caseHint: "\u7A0B\u5E8F\u4E0D\u8BFB\u8F93\u5165\uFF0C\u8F93\u51FA\u53EA\u6709\u4E00\u79CD\u53EF\u80FD\uFF0C\u6240\u4EE5\u53EA\u6709\u8FD9\u4E00\u7EC4\u3002" }]
          }
        ]
      },
      {
        id: "2.5",
        title: "\u5E38\u91CF\u4E0E\u4E0D\u53D8\u7684\u503C",
        syllabus: ["G\xA72.5"],
        estimatedMinutes: 7,
        taughtFeatures: [
          "io.output",
          "io.input",
          "decl.variable",
          "misc.comment",
          "type.string",
          "literal.string",
          "type.integer",
          "type.real",
          "type.char",
          "type.boolean",
          "type.date",
          "literal.integer",
          "literal.real",
          "literal.char",
          "literal.boolean",
          "literal.date",
          "assign.simple",
          "decl.constant"
        ],
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u7A0B\u5E8F\u91CC\u6709\u4E9B\u503C\u4ECE\u5F00\u59CB\u5230\u7ED3\u675F\u90FD\u4E0D\u8BE5\u6539\u53D8\uFF0C\u4F8B\u5982\u4E00\u5468\u7684\u5929\u6570\u3002\u628A\u8FD9\u79CD\u503C\u547D\u540D\u4E3A**\u5E38\u91CF\uFF08constant\uFF09**\uFF0C\u8BFB\u4EE3\u7801\u7684\u4EBA\u5C31\u4E0D\u7528\u53CD\u590D\u731C `7` \u4EE3\u8868\u4EC0\u4E48\u3002",
              "\u5E38\u91CF\u5199\u6210 `CONSTANT \u540D\u5B57 = \u5B57\u9762\u91CF`\uFF0C\u5E76\u4E14\u53EA\u80FD\u5728\u8FD9\u91CC\u7ED9\u5B83\u4E00\u4E2A\u76F4\u63A5\u5199\u51FA\u7684\u5B57\u9762\u91CF\u3002\u53D8\u91CF\u3001\u53E6\u4E00\u4E2A\u5E38\u91CF\u6216\u4E00\u6BB5\u8BA1\u7B97\u90FD\u4E0D\u80FD\u653E\u5728\u7B49\u53F7\u53F3\u8FB9\uFF1B\u5E38\u91CF\u4E00\u65E6\u5199\u597D\uFF0C\u540E\u9762\u4E5F\u4E0D\u80FD\u518D\u8D4B\u65B0\u503C\u3002",
              "\u5224\u65AD\u65F6\u5F88\u7B80\u5355\uFF1A\u503C\u4F1A\u968F\u7740\u4E00\u6B21\u8FD0\u884C\u800C\u6539\u53D8\uFF0C\u5C31\u7528\u53D8\u91CF\uFF1B\u5B83\u5728\u8FD9\u6BB5\u7A0B\u5E8F\u4E2D\u59CB\u7EC8\u4EE3\u8868\u540C\u4E00\u4EF6\u4E8B\uFF0C\u5C31\u7528\u5E38\u91CF\u3002\u4E24\u8005\u90FD\u8981\u53D6\u6E05\u695A\u7684\u540D\u5B57\u3002"
            ],
            callouts: [
              { source: "CAIE", text: "\u5E38\u91CF\u5199\u6210 `CONSTANT <identifier> = <value>`\uFF0C\u53F3\u8FB9\u53EA\u80FD\u662F\u5B57\u9762\u91CF\uFF1B\u7528\u6709\u610F\u4E49\u7684\u540D\u5B57\u4EE3\u66FF\u5B57\u9762\u91CF\u53EF\u4EE5\u8BA9\u4F2A\u4EE3\u7801\u66F4\u6613\u8BFB\uFF08Pseudocode Guide \xA72.5\uFF09\u3002" }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0B\u9762\u54EA\u4E00\u79CD\u60C5\u51B5\u6700\u9002\u5408\u7528\u5E38\u91CF\uFF1F",
            options: [
              { key: "A", label: "\u73A9\u5BB6\u672C\u8F6E\u5F97\u5230\u7684\u5206\u6570", correct: false, explanation: "\u5206\u6570\u4F1A\u968F\u7740\u8F93\u5165\u548C\u8BA1\u7B97\u53D8\u5316\uFF0C\u56E0\u6B64\u9700\u8981\u4E00\u4E2A\u53EF\u91CD\u65B0\u8D4B\u503C\u7684\u53D8\u91CF\u3002" },
              { key: "B", label: "\u672C\u7A0B\u5E8F\u91C7\u7528\u7684\u4E00\u5468\u5929\u6570", correct: true, explanation: "\u5BF9\u3002\u5728\u540C\u4E00\u6B21\u8FD0\u884C\u4E2D\u5B83\u59CB\u7EC8\u4EE3\u8868\u540C\u4E00\u4E2A\u56FA\u5B9A\u503C\uFF0C\u7ED9\u5B83\u4E00\u4E2A\u540D\u5B57\u4F1A\u8BA9\u4EE3\u7801\u66F4\u6E05\u695A\u3002" },
              { key: "C", label: "\u7528\u6237\u521A\u521A\u8F93\u5165\u7684\u59D3\u540D", correct: false, explanation: "\u59D3\u540D\u6765\u81EA\u8F93\u5165\uFF0C\u6BCF\u6B21\u8FD0\u884C\u53EF\u80FD\u4E0D\u540C\uFF1B\u5B83\u5E94\u4FDD\u5B58\u5728\u53D8\u91CF\u91CC\u3002" },
              { key: "D", label: "\u5FAA\u73AF\u4E2D\u4E0D\u65AD\u7D2F\u52A0\u7684\u603B\u6570", correct: false, explanation: "\u603B\u6570\u4F1A\u53CD\u590D\u6539\u53D8\u3002\u5E38\u91CF\u4E0D\u80FD\u5728\u540E\u9762\u88AB\u91CD\u65B0\u8D4B\u503C\u3002" }
            ]
          },
          {
            kind: "example",
            title: "\u7528\u6709\u610F\u4E49\u7684\u540D\u5B57\u4FDD\u5B58\u56FA\u5B9A\u503C",
            fileName: "Example_2_5_a.pseudocode",
            code: ["CONSTANT DaysInWeek = 7", 'OUTPUT "Days: ", DaysInWeek'].join("\n"),
            annotations: [
              { fromLine: 1, toLine: 1, text: "\u5E38\u91CF\u5728\u8FD9\u4E00\u884C\u7ED9\u51FA\u540D\u5B57\u548C\u56FA\u5B9A\u7684\u5B57\u9762\u91CF\u503C\u3002" },
              { fromLine: 2, toLine: 2, text: "\u4E4B\u540E\u53EF\u4EE5\u8BFB\u53D6\u5B83\uFF1B\u540D\u5B57\u8BF4\u660E\u4E86\u8FD9\u91CC\u7684 7 \u4EE3\u8868\u4EC0\u4E48\u3002" }
            ],
            sampleRun: { inputs: [], outputs: ["Days: 7"] }
          },
          {
            kind: "counterExample",
            title: "\u6709\u4E9B\u9519\u8BEF\u4F1A\u5728\u4E0D\u540C\u9636\u6BB5\u88AB\u53D1\u73B0",
            cases: [
              {
                title: "\u628A\u6587\u5B57\u653E\u8FDB\u6574\u6570\u53D8\u91CF",
                code: ["DECLARE Count : INTEGER", 'Count \u2190 "twelve"'].join("\n"),
                note: "\u7B2C 2 \u884C\u53F3\u8FB9\u662F\u6587\u5B57\uFF0C\u5DE6\u8FB9\u5374\u53EA\u80FD\u4FDD\u5B58\u6574\u6570\u3002\u7F16\u8F91\u5668\u5728\u8FD0\u884C\u524D\u5C31\u80FD\u53D1\u73B0\u8FD9\u4E24\u8FB9\u4E0D\u76F8\u914D\u3002",
                expectDiagnostics: [{ severity: "error", ruleId: "ASSIGN-002", line: 2, text: "\u8FD9\u91CC\u9700\u8981\u6574\u6570\uFF0C\u4E0D\u80FD\u628A\u4E00\u6BB5\u6587\u5B57\u653E\u8FDB `Count`\u3002" }]
              },
              {
                title: "\u91CD\u65B0\u7ED9\u5E38\u91CF\u8D4B\u503C",
                code: ["CONSTANT DaysInWeek = 7", "DaysInWeek \u2190 8"].join("\n"),
                note: "\u7B2C 1 \u884C\u5DF2\u7ECF\u7ED9\u5E38\u91CF\u786E\u5B9A\u4E86\u503C\u3002\u7B2C 2 \u884C\u4E0D\u80FD\u518D\u6539\u53D8\u5B83\uFF1B\u8FD9\u6BB5\u4EE3\u7801\u4E5F\u4E0D\u4F1A\u5F00\u59CB\u8FD0\u884C\u3002",
                expectDiagnostics: [{ severity: "error", ruleId: "ASSIGN-003", line: 2, text: "`DaysInWeek` \u662F\u5E38\u91CF\uFF0C\u4E0D\u80FD\u5728\u540E\u9762\u91CD\u65B0\u8D4B\u503C\u3002" }]
              },
              {
                title: "\u58F0\u660E\u540E\u7ACB\u523B\u8BFB\u53D6",
                code: ["DECLARE Name : STRING", "OUTPUT Name"].join("\n"),
                note: "\u8FD9\u6BB5\u4EE3\u7801\u7684\u5199\u6CD5\u672C\u8EAB\u6CA1\u6709\u95EE\u9898\uFF0C\u6240\u4EE5\u53EF\u4EE5\u5F00\u59CB\u8FD0\u884C\uFF1B\u4F46 `Name` \u8FD8\u6CA1\u6709\u5185\u5BB9\uFF0C\u8FD0\u884C\u5230\u7B2C 2 \u884C\u624D\u4F1A\u505C\u6B62\u3002",
                expectRuntimeError: { code: "RT1003", line: 2, text: "`Name` \u8FD8\u6CA1\u6709\u88AB\u8D4B\u503C\uFF0C\u4E0D\u80FD\u663E\u793A\u5B83\u7684\u5185\u5BB9\u3002" }
              }
            ]
          }
        ]
      }
    ],
    chapterTasks: [
      {
        kind: "chapterTask",
        id: "2.T1",
        title: "\u663E\u793A\u4E00\u5F20\u5206\u6570\u5361",
        statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u7528\u4E00\u4E2A\u5E38\u91CF\u4FDD\u5B58\u53CA\u683C\u7EBF\uFF0C\u7528\u4E00\u4E2A\u6574\u6570\u53D8\u91CF\u4FDD\u5B58\u5B66\u751F\u5206\u6570\uFF0C\u7136\u540E\u663E\u793A\u4E24\u884C\u5206\u6570\u5361\u3002",
        ioSpec: { input: "\u6CA1\u6709\u8F93\u5165\u3002", output: "\u4E24\u884C\uFF1A`Pass mark: 50` \u548C `Score: 64`\uFF0C\u4E24\u5904\u5192\u53F7\u540E\u5404\u6709\u4E00\u4E2A\u7A7A\u683C\u3002" },
        suggestedFeatures: ["decl.constant", "decl.variable", "assign.simple", "io.output"],
        hints: ["\u8FD9\u4E24\u79CD\u6570\u7684\u89D2\u8272\u4E0D\u540C\uFF1A\u53CA\u683C\u7EBF\u56FA\u5B9A\uFF0C\u5B66\u751F\u5206\u6570\u53EF\u4EE5\u6362\u3002", "\u5148\u5206\u522B\u51C6\u5907\u56FA\u5B9A\u503C\u548C\u53EF\u53D8\u4F4D\u7F6E\uFF0C\u518D\u7ED9\u53EF\u53D8\u4F4D\u7F6E\u653E\u5165\u5206\u6570\u3002", "\u6BCF\u4E00\u884C OUTPUT \u90FD\u7531\u4E00\u6BB5\u6587\u5B57\u548C\u4E00\u4E2A\u4FDD\u5B58\u7684\u503C\u62FC\u8D77\u6765\u3002"],
        examples: [{ inputs: [], outputs: ["Pass mark: 50", "Score: 64"] }],
        lockedStarterCode: "CONSTANT PassMark = 50",
        starterCode: "",
        referenceSolution: [
          "CONSTANT PassMark = 50",
          "DECLARE Score : INTEGER",
          "Score \u2190 64",
          'OUTPUT "Pass mark: ", PassMark',
          'OUTPUT "Score: ", Score'
        ].join("\n"),
        tests: [{ id: "t1", kind: "normal", inputs: [], caseHint: "\u663E\u793A\u56FA\u5B9A\u53CA\u683C\u7EBF\u548C\u5DF2\u7ECF\u4FDD\u5B58\u7684\u5206\u6570\u3002" }]
      }
    ]
  };

  // packages/teaching-content/src/chapter-03.ts
  var BASE = [
    "io.output",
    "io.input",
    "decl.variable",
    "misc.comment",
    "type.string",
    "literal.string",
    "type.integer",
    "type.real",
    "type.char",
    "type.boolean",
    "type.date",
    "literal.integer",
    "literal.real",
    "literal.char",
    "literal.boolean",
    "literal.date",
    "assign.simple",
    "decl.constant"
  ];
  var chapter03 = {
    id: 3,
    title: "\u8868\u8FBE\u5F0F\u4E0E\u8FD0\u7B97\u7B26",
    level: "AS",
    syllabus: ["\xA711.1", "G\xA75.2", "G\xA75.3", "G\xA75.4"],
    prerequisites: [1, 2],
    sections: [
      // ────────────────────────────────────────────────────── 3.1
      {
        id: "3.1",
        title: "\u7B97\u672F\u8FD0\u7B97\u4E0E\u4F18\u5148\u7EA7",
        syllabus: ["\xA711.1", "G\xA75.2"],
        estimatedMinutes: 10,
        taughtFeatures: [...BASE, "op.arithmetic"],
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u524D\u4E24\u7AE0\u7684\u7A0B\u5E8F\u53EA\u4F1A\u628A\u8BFB\u5230\u7684\u4E1C\u897F\u539F\u6837\u6446\u51FA\u6765\u3002\u4ECE\u8FD9\u4E00\u7AE0\u8D77\uFF0C\u8D4B\u503C\u7BAD\u5934\u7684\u53F3\u8FB9\u53EF\u4EE5\u662F\u4E00\u6BB5**\u8868\u8FBE\u5F0F\uFF08expression\uFF09**\u2014\u2014\u4E00\u4E2A\u9700\u8981\u7B97\u51FA\u7ED3\u679C\u7684\u5F0F\u5B50\uFF0C\u7B97\u5B8C\u7684\u503C\u624D\u88AB\u653E\u8FDB\u5DE6\u8FB9\u7684\u53D8\u91CF\u3002\u56DB\u5219\u8FD0\u7B97\u7528 `+`\u3001`-`\u3001`*`\u3001`/`\uFF0C\u5199\u6CD5\u548C\u6570\u5B66\u91CC\u4E00\u6837\uFF1A`Total \u2190 Price * Count` \u5148\u628A\u53F3\u8FB9\u7B97\u51FA\u6765\uFF0C\u518D\u628A\u7ED3\u679C\u653E\u8FDB `Total`\u3002",
              "\u7B97\u7684\u987A\u5E8F\u4E5F\u548C\u6570\u5B66\u4E00\u6837\uFF1A\u5148\u4E58\u9664\u540E\u52A0\u51CF\u3002`2 + 3 * 4` \u5F97\u5230 14\uFF0C\u4E0D\u662F 20\u3002\u60F3\u8BA9\u52A0\u6CD5\u5148\u7B97\uFF0C\u5C31\u7528\u62EC\u53F7\uFF1A`(2 + 3) * 4` \u5F97\u5230 20\u3002",
              "\u6709\u4E00\u5904\u548C\u6570\u5B66\u4E0D\u4E00\u6837\uFF0C\u8981\u7279\u522B\u8BB0\u4F4F\uFF1A**`/` \u7684\u7ED3\u679C\u6C38\u8FDC\u662F `REAL`\uFF0C\u54EA\u6015\u9664\u5F97\u5C3D**\u3002`6 / 2` \u5F97\u5230\u7684\u662F `3.0` \u800C\u4E0D\u662F `3`\u3002\u6240\u4EE5 `DECLARE Half : INTEGER` \u4E4B\u540E\u5199 `Half \u2190 6 / 2` \u662F\u4E0D\u6210\u7ACB\u7684\u2014\u2014\u53F3\u8FB9\u662F\u4E2A\u5B9E\u6570\uFF0C\u5DE6\u8FB9\u53EA\u80AF\u6536\u6574\u6570\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u7B97\u672F\u8FD0\u7B97\u7B26\u662F `+`\u3001`-`\u3001`*`\u3001`/`\uFF1B`/` \u7684\u7ED3\u679C\u662F `REAL`\uFF0C\u5373\u4F7F\u4E24\u4E2A\u64CD\u4F5C\u6570\u90FD\u662F\u6574\u6570\u3002\u4E58\u9664\u7684\u4F18\u5148\u7EA7\u9AD8\u4E8E\u52A0\u51CF\uFF0C\u590D\u6742\u7684\u5F0F\u5B50\u5EFA\u8BAE\u7528\u62EC\u53F7\u628A\u987A\u5E8F\u5199\u660E\u767D\uFF08Pseudocode Guide \xA75.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u540C\u6837\u4E09\u4E2A\u6570\uFF0C\u52A0\u62EC\u53F7\u548C\u4E0D\u52A0\u62EC\u53F7\u4E0D\u662F\u4E00\u56DE\u4E8B",
            fileName: "Example_3_1_a.pseudocode",
            code: [
              "DECLARE Plain : INTEGER",
              "DECLARE Grouped : INTEGER",
              "DECLARE Divided : REAL",
              "Plain \u2190 2 + 3 * 4",
              "Grouped \u2190 (2 + 3) * 4",
              "Divided \u2190 6 / 2",
              'OUTPUT "Plain: ", Plain',
              'OUTPUT "Grouped: ", Grouped',
              'OUTPUT "Divided: ", Divided'
            ].join("\n"),
            annotations: [
              { fromLine: 4, toLine: 4, text: "\u5148\u7B97 `3 * 4`\uFF0C\u518D\u52A0 2\u3002" },
              { fromLine: 5, toLine: 5, text: "\u62EC\u53F7\u91CC\u7684\u5148\u7B97\uFF0C\u6240\u4EE5\u662F `5 * 4`\u3002" },
              {
                fromLine: 6,
                toLine: 6,
                text: "`Divided` \u5FC5\u987B\u58F0\u660E\u6210 `REAL`\u3002`6 / 2` \u9664\u5F97\u5C3D\uFF0C\u7ED3\u679C\u4ECD\u7136\u662F\u5B9E\u6570 `3.0`\u3002"
              }
            ],
            sampleRun: { inputs: [], outputs: ["Plain: 14", "Grouped: 20", "Divided: 3.0"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`DECLARE N : INTEGER` \u4E4B\u540E\uFF0C\u54EA\u4E00\u884C\u4F1A\u88AB\u7F16\u8F91\u5668\u62E6\u4E0B\uFF1F",
            options: [
              {
                key: "A",
                label: "N \u2190 2 + 3 * 4",
                correct: false,
                explanation: "\u53EF\u4EE5\u3002\u6574\u6570\u52A0\u6574\u6570\u3001\u6574\u6570\u4E58\u6574\u6570\uFF0C\u7ED3\u679C\u8FD8\u662F\u6574\u6570\uFF0C\u6B63\u597D\u653E\u5F97\u8FDB `INTEGER`\u3002"
              },
              {
                key: "B",
                label: "N \u2190 (10 - 4) * 2",
                correct: false,
                explanation: "\u53EF\u4EE5\u3002\u62EC\u53F7\u53EA\u6539\u53D8\u7B97\u7684\u987A\u5E8F\uFF0C\u4E0D\u6539\u53D8\u7ED3\u679C\u7684\u7C7B\u578B\uFF0C\u7B97\u51FA\u6765\u4ECD\u662F\u6574\u6570\u3002"
              },
              {
                key: "C",
                label: "N \u2190 8 / 2",
                correct: true,
                explanation: "\u5C31\u662F\u8FD9\u4E00\u884C\u3002`/` \u7684\u7ED3\u679C\u6C38\u8FDC\u662F `REAL`\uFF0C`8 / 2` \u5F97\u5230\u7684\u662F `4.0` \u800C\u4E0D\u662F `4`\uFF0C\u653E\u4E0D\u8FDB\u53EA\u6536\u6574\u6570\u7684 `N`\u3002\u8981\u6574\u9664\u5F97\u7528\u4E0B\u4E00\u8282\u7684 `DIV`\u3002"
              },
              {
                key: "D",
                label: "N \u2190 100",
                correct: false,
                explanation: "\u53EF\u4EE5\u3002\u8FD9\u662F\u6700\u666E\u901A\u7684\u4E00\u6B21\u8D4B\u503C\uFF0C\u53F3\u8FB9\u662F\u4E2A\u6574\u6570\u5B57\u9762\u91CF\u3002"
              }
            ]
          }
        ]
      },
      // ────────────────────────────────────────────────────── 3.2
      {
        id: "3.2",
        title: "\u6574\u9664\u4E0E\u4F59\u6570",
        syllabus: ["\xA711.1", "G\xA75.2"],
        estimatedMinutes: 9,
        taughtFeatures: [...BASE, "op.arithmetic", "op.div", "op.mod"],
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E0A\u4E00\u8282\u7559\u4E86\u4E2A\u95EE\u9898\uFF1A\u60F3\u628A 7 \u4E2A\u4EBA\u6309\u6BCF\u8F66 2 \u4EBA\u5206\u7EC4\uFF0C`7 / 2` \u7ED9\u7684\u662F `3.5`\uFF0C\u53EF\u8F66\u6570\u4E0D\u80FD\u662F\u4E09\u8F86\u534A\u3002\u8FD9\u91CC\u8981\u7684\u4E0D\u662F\u7CBE\u786E\u7684\u5546\uFF0C\u800C\u662F**\u6574\u9664**\u7684\u7ED3\u679C\u548C\u5269\u4E0B\u7684\u96F6\u5934\u3002",
              "`DIV` \u7ED9\u51FA\u6574\u6570\u90E8\u5206\uFF0C`MOD` \u7ED9\u51FA\u4F59\u6570\u3002`7 DIV 2` \u662F 3\uFF0C`7 MOD 2` \u662F 1\u2014\u2014\u4E09\u8F86\u8F66\u5750\u6EE1\uFF0C\u8FD8\u5269 1 \u4E2A\u4EBA\u3002\u8FD9\u4E24\u4E2A\u8FD0\u7B97\u7B26\u7684\u5DE6\u53F3\u4E24\u8FB9\u90FD\u5FC5\u987B\u662F `INTEGER`\u3002",
              "`MOD` \u6700\u5E38\u7528\u7684\u5730\u65B9\u662F\u5224\u65AD\u6574\u9664\uFF1A\u4E00\u4E2A\u6570 `MOD 2` \u7B49\u4E8E 0 \u5C31\u662F\u5076\u6570\uFF0C`MOD 5` \u7B49\u4E8E 0 \u5C31\u80FD\u88AB 5 \u6574\u9664\uFF0C\u4E0B\u4E00\u8282\u5C31\u7528\u5F97\u4E0A\u3002\u53E6\u5916\u8981\u8BB0\u4F4F\uFF1A\u9664\u6570\u662F 0 \u65F6 `/`\u3001`DIV`\u3001`MOD` \u90FD\u4F1A\u8BA9\u7A0B\u5E8F\u505C\u4E0B\u6765\uFF0C\u800C\u4E14\u7F16\u8F91\u5668\u4E8B\u5148\u770B\u4E0D\u51FA\u6765\u2014\u20143.5 \u8282\u4F1A\u6F14\u793A\u8FD9\u4EF6\u4E8B\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "`DIV` \u53D6\u6574\u6570\u5546\uFF0C`MOD` \u53D6\u4F59\u6570\uFF08Pseudocode Guide \xA75.2\uFF09\u3002"
              },
              {
                source: "editor",
                text: "\u8D1F\u6570\u600E\u4E48\u7B97\uFF0CPseudocode Guide \u6CA1\u6709\u89C4\u5B9A\u3002\u672C\u7F16\u8F91\u5668\u7684\u505A\u6CD5\u662F\uFF1A`DIV` \u7684\u5546\u5411 0 \u622A\u65AD\uFF0C`MOD` \u7684\u7B26\u53F7\u8DDF\u88AB\u9664\u6570\u4E00\u81F4\u2014\u2014`-7 DIV 2` \u5F97\u5230 -3\uFF0C`-7 MOD 2` \u5F97\u5230 -1\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u628A 7 \u4E2A\u4EBA\u88C5\u8FDB\u6BCF\u8F66 2 \u5EA7\u7684\u8F66",
            fileName: "Example_3_2_a.pseudocode",
            code: [
              "CONSTANT SeatsPerCar = 2",
              "DECLARE People : INTEGER",
              "DECLARE FullCars : INTEGER",
              "DECLARE LeftOver : INTEGER",
              "People \u2190 7",
              "FullCars \u2190 People DIV SeatsPerCar",
              "LeftOver \u2190 People MOD SeatsPerCar",
              'OUTPUT "Full cars: ", FullCars',
              'OUTPUT "Left over: ", LeftOver'
            ].join("\n"),
            annotations: [
              { fromLine: 6, toLine: 6, text: "`DIV` \u53EA\u8981\u6574\u6570\u90E8\u5206\uFF0C\u5C0F\u6570\u88AB\u4E22\u6389\uFF0C\u4E0D\u662F\u56DB\u820D\u4E94\u5165\u3002" },
              { fromLine: 7, toLine: 7, text: "`MOD` \u8981\u7684\u6B63\u662F\u88AB\u4E22\u6389\u7684\u90A3\u90E8\u5206\u2014\u2014\u5750\u4E0D\u6EE1\u4E00\u8F66\u7684\u4EBA\u6570\u3002" }
            ],
            sampleRun: { inputs: [], outputs: ["Full cars: 3", "Left over: 1"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`17 DIV 5` \u548C `17 MOD 5` \u5206\u522B\u5F97\u5230\u4EC0\u4E48\uFF1F",
            options: [
              {
                key: "A",
                label: "3 \u548C 2",
                correct: true,
                explanation: "\u5BF9\u30025 \u88C5\u5F97\u4E0B 3 \u6574\u4EFD\u5171 15\uFF0C\u8FD8\u5269 2\u3002\u6574\u6570\u5546\u662F 3\uFF0C\u4F59\u6570\u662F 2\u3002"
              },
              {
                key: "B",
                label: "3.4 \u548C 2",
                correct: false,
                explanation: "`3.4` \u662F `17 / 5` \u7684\u7ED3\u679C\u3002`DIV` \u53EA\u7ED9\u6574\u6570\u90E8\u5206\uFF0C\u4E0D\u4F1A\u5E26\u5C0F\u6570\u3002"
              },
              {
                key: "C",
                label: "4 \u548C 2",
                correct: false,
                explanation: "`DIV` \u662F\u628A\u5C0F\u6570\u90E8\u5206\u76F4\u63A5\u4E22\u6389\uFF0C\u4E0D\u662F\u56DB\u820D\u4E94\u5165\uFF1B3.4 \u4E22\u6389\u5C0F\u6570\u662F 3\uFF0C\u4E0D\u662F 4\u3002"
              },
              {
                key: "D",
                label: "3 \u548C 3",
                correct: false,
                explanation: "\u4F59\u6570\u662F\u88AB 5 \u88C5\u5B8C\u4E4B\u540E\u5269\u4E0B\u7684\uFF1A17 \u51CF\u53BB 15 \u7B49\u4E8E 2\uFF0C\u4E0D\u662F 3\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "3.2.1",
            title: "\u628A\u79D2\u6570\u6362\u6210\u5206\u548C\u79D2",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u5148\u63D0\u793A\u5E76\u8BFB\u5165\u4E00\u4E2A\u6574\u6570\u79D2\u6570\uFF0C\u7136\u540E\u628A\u5B83\u6362\u7B97\u6210\u6574\u6570\u5206\u949F\u548C\u5269\u4F59\u79D2\u6570\uFF0C\u663E\u793A\u4E00\u884C `<\u5206> min <\u79D2> s`\u3002\u4F8B\u5982\u8BFB\u5165 `100`\uFF0C\u663E\u793A `1 min 40 s`\u3002",
            ioSpec: {
              input: "\u4E00\u884C\uFF0C\u4E00\u4E2A `INTEGER`\u3002",
              output: [
                "\u4E24\u884C\uFF1A",
                "`Enter the seconds`\u3000\uFF08\u8BFB\u4E4B\u524D\uFF09",
                "`<\u5206> min <\u79D2> s`\u3000\uFF08`min` \u548C `s` \u524D\u540E\u5404\u4E00\u4E2A\u7A7A\u683C\uFF09"
              ].join("\n")
            },
            constraints: {
              require: [
                {
                  feature: "op.div",
                  reason: "\u5206\u949F\u6570\u8981\u7684\u662F\u6574\u6570\u5546\uFF0C\u7528 `/` \u4F1A\u5F97\u5230\u5E26\u5C0F\u6570\u7684\u5B9E\u6570\uFF0C\u653E\u4E0D\u8FDB\u6574\u6570\u53D8\u91CF\u3002"
                },
                {
                  feature: "op.mod",
                  reason: "\u5269\u4F59\u79D2\u6570\u6B63\u662F\u6574\u9664\u4E4B\u540E\u5269\u4E0B\u7684\u96F6\u5934\uFF0C\u8FD9\u5C31\u662F `MOD` \u7684\u7528\u5904\u3002"
                }
              ]
            },
            hints: [
              "\u4E00\u5206\u949F\u662F\u516D\u5341\u79D2\u3002\u60F3\u6E05\u695A\u54EA\u4E00\u4E2A\u91CF\u8981\u300C\u6574\u6570\u4EFD\u6570\u300D\uFF0C\u54EA\u4E00\u4E2A\u8981\u300C\u5269\u4E0B\u7684\u300D\u3002",
              "\u5148\u628A\u63D0\u793A\u3001\u8BFB\u5165\u3001\u4E24\u6B21\u8BA1\u7B97\u3001\u8F93\u51FA\u8FD9\u4E94\u6B65\u7684\u987A\u5E8F\u6392\u597D\uFF0C\u518D\u53BB\u60F3\u6BCF\u4E00\u6B65\u600E\u4E48\u5199\u3002",
              "\u6700\u540E\u4E00\u884C\u8981\u663E\u793A\u56DB\u6837\u4E1C\u897F\uFF1A\u5206\u949F\u3001\u5F15\u53F7\u91CC\u7684 ` min `\u3001\u79D2\u6570\u3001\u5F15\u53F7\u91CC\u7684 ` s`\u3002"
            ],
            examples: [{ inputs: ["100"], outputs: ["Enter the seconds", "1 min 40 s"] }],
            starterCode: "DECLARE Seconds : INTEGER\n",
            referenceSolution: [
              "CONSTANT SecondsPerMinute = 60",
              "DECLARE Seconds : INTEGER",
              "DECLARE Minutes : INTEGER",
              "DECLARE Rest : INTEGER",
              'OUTPUT "Enter the seconds"',
              "INPUT Seconds",
              "Minutes \u2190 Seconds DIV SecondsPerMinute",
              "Rest \u2190 Seconds MOD SecondsPerMinute",
              'OUTPUT Minutes, " min ", Rest, " s"'
            ].join("\n"),
            tests: [
              {
                id: "t1",
                kind: "normal",
                inputs: ["95"],
                caseHint: "\u4E00\u4E2A\u65E2\u4E0D\u662F\u6574\u5206\u949F\u3001\u4E5F\u4E0D\u5230\u4E00\u5C0F\u65F6\u7684\u666E\u901A\u79D2\u6570\u3002"
              },
              {
                id: "t2",
                kind: "normal",
                inputs: ["245"],
                caseHint: "\u6362\u4E00\u4E2A\u79D2\u6570\uFF0C\u786E\u8BA4\u7A0B\u5E8F\u4E0D\u662F\u628A\u7B54\u6848\u5199\u6B7B\u7684\u3002"
              },
              {
                id: "t3",
                kind: "boundary",
                inputs: ["0"],
                caseHint: "\u5F53\u79D2\u6570\u6B63\u597D\u662F\u96F6\u65F6\u3002"
              },
              {
                id: "t4",
                kind: "boundary",
                inputs: ["120"],
                caseHint: "\u5F53\u79D2\u6570\u6B63\u597D\u6574\u9664\u3001\u4E00\u79D2\u90FD\u4E0D\u5269\u65F6\u3002"
              },
              {
                id: "t5",
                kind: "extreme",
                inputs: ["86399"],
                caseHint: "\u5F53\u79D2\u6570\u5F88\u5927\u3001\u63A5\u8FD1\u4E00\u6574\u5929\u65F6\u3002"
              }
            ]
          }
        ]
      },
      // ────────────────────────────────────────────────────── 3.3
      {
        id: "3.3",
        title: "\u6BD4\u8F83\u4E0E\u5E03\u5C14\u503C",
        syllabus: ["\xA711.1", "G\xA75.3"],
        estimatedMinutes: 8,
        taughtFeatures: [...BASE, "op.arithmetic", "op.div", "op.mod", "op.relational"],
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u7B97\u672F\u8868\u8FBE\u5F0F\u7B97\u51FA\u6765\u7684\u662F\u6570\uFF0C**\u6BD4\u8F83**\u7B97\u51FA\u6765\u7684\u662F\u300C\u662F\u300D\u6216\u300C\u4E0D\u662F\u300D\u3002\u516D\u4E2A\u6BD4\u8F83\u8FD0\u7B97\u7B26\u662F `=`\u3001`<>`\u3001`<`\u3001`<=`\u3001`>`\u3001`>=`\uFF0C\u5176\u4E2D `<>` \u8868\u793A\u300C\u4E0D\u7B49\u4E8E\u300D\u3002\u6CE8\u610F `=` \u5728\u8FD9\u91CC\u662F\u6BD4\u8F83\u4E0D\u662F\u8D4B\u503C\u2014\u2014\u8D4B\u503C\u4E00\u76F4\u7528 `\u2190`\uFF0C\u8FD9\u4E24\u4E2A\u7B26\u53F7\u5728 CAIE \u7684\u4F2A\u4EE3\u7801\u91CC\u5206\u5DE5\u660E\u786E\u3002",
              "\u6BD4\u8F83\u7684\u7ED3\u679C\u662F\u4E00\u4E2A `BOOLEAN` \u503C\u2014\u2014\u53EA\u53EF\u80FD\u662F `TRUE` \u6216 `FALSE`\u3002\u6240\u4EE5 `Passed \u2190 Score >= 50` \u662F\u5B8C\u5168\u6B63\u5E38\u7684\u4E00\u6B21\u8D4B\u503C\uFF1A\u53F3\u8FB9\u5148\u6BD4\u51FA\u4E00\u4E2A\u5E03\u5C14\u503C\uFF0C\u518D\u653E\u8FDB\u5DE6\u8FB9\u7684\u5E03\u5C14\u53D8\u91CF\u3002",
              "\u6570\u5B66\u91CC\u53EF\u4EE5\u5199 `1 < 2 < 3`\uFF0C\u4F2A\u4EE3\u7801\u91CC\u4E0D\u884C\u3002\u6BD4\u8F83\u53EA\u80FD\u4E24\u4E24\u8FDB\u884C\uFF0C\u8FDE\u7740\u5199\u7F16\u8F91\u5668\u4F1A\u62E6\u4E0B\u6765\u3002\u8981\u8868\u8FBE\u300C\u5728\u4E24\u8005\u4E4B\u95F4\u300D\uFF0C\u5F97\u7528\u4E0B\u4E00\u8282\u7684 `AND` \u628A\u4E24\u4E2A\u6BD4\u8F83\u8FDE\u8D77\u6765\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u6BD4\u8F83\u8FD0\u7B97\u7B26\u662F `=`\u3001`<>`\u3001`<`\u3001`<=`\u3001`>`\u3001`>=`\uFF08Pseudocode Guide \xA75.3\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u6BD4\u51FA\u6765\u7684\u7ED3\u679C\u53EF\u4EE5\u5B58\u8D77\u6765",
            fileName: "Example_3_3_a.pseudocode",
            code: [
              "CONSTANT PassMark = 50",
              "DECLARE Score : INTEGER",
              "DECLARE Passed : BOOLEAN",
              "DECLARE IsEven : BOOLEAN",
              "Score \u2190 64",
              "Passed \u2190 Score >= PassMark",
              "IsEven \u2190 Score MOD 2 = 0",
              'OUTPUT "Passed: ", Passed',
              'OUTPUT "Even: ", IsEven'
            ].join("\n"),
            annotations: [
              {
                fromLine: 6,
                toLine: 6,
                text: "\u53F3\u8FB9\u5148\u6BD4\u51FA `TRUE`\uFF0C\u518D\u7531 `\u2190` \u653E\u8FDB `Passed`\u3002\u4E00\u884C\u91CC\u4E24\u4E2A\u7B26\u53F7\uFF0C\u5206\u5DE5\u4E0D\u540C\u3002"
              },
              {
                fromLine: 7,
                toLine: 7,
                text: "\u5148\u7B97 `Score MOD 2`\uFF0C\u518D\u62FF\u7ED3\u679C\u548C 0 \u6BD4\u3002\u7B97\u672F\u7684\u4F18\u5148\u7EA7\u9AD8\u4E8E\u6BD4\u8F83\uFF0C\u6240\u4EE5\u4E0D\u7528\u52A0\u62EC\u53F7\u3002"
              }
            ],
            sampleRun: { inputs: [], outputs: ["Passed: TRUE", "Even: TRUE"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`DECLARE Ready : BOOLEAN` \u4E4B\u540E\uFF0C\u54EA\u4E00\u884C\u662F\u5BF9\u7684\uFF1F",
            options: [
              {
                key: "A",
                label: "Ready \u2190 3 > 2",
                correct: true,
                explanation: "\u5BF9\u3002\u53F3\u8FB9\u662F\u4E00\u6B21\u6BD4\u8F83\uFF0C\u6BD4\u51FA\u6765\u7684\u662F\u5E03\u5C14\u503C\uFF0C\u6B63\u597D\u653E\u5F97\u8FDB `BOOLEAN` \u53D8\u91CF\u3002"
              },
              {
                key: "B",
                label: "Ready = TRUE",
                correct: false,
                explanation: "\u8FD9\u4E00\u884C\u5728\u505A\u6BD4\u8F83\uFF0C\u4E0D\u662F\u8D4B\u503C\u2014\u2014\u5B83\u7B97\u51FA\u4E00\u4E2A\u5E03\u5C14\u503C\u5C31\u4E22\u6389\u4E86\uFF0C`Ready` \u6CA1\u6709\u4EFB\u4F55\u53D8\u5316\u3002\u8D4B\u503C\u8981\u7528 `\u2190`\u3002"
              },
              {
                key: "C",
                label: "Ready \u2190 1",
                correct: false,
                explanation: "`1` \u662F\u6574\u6570\uFF0C\u4E0D\u662F\u5E03\u5C14\u503C\u3002\u6709\u4E9B\u8BED\u8A00\u7528 1 \u548C 0 \u4EE3\u8868\u771F\u5047\uFF0CCAIE \u7684\u4F2A\u4EE3\u7801\u53EA\u7528 `TRUE` \u548C `FALSE`\u3002"
              },
              {
                key: "D",
                label: "Ready \u2190 0 < 5 < 9",
                correct: false,
                explanation: "\u8FDE\u7740\u5199\u7684\u6BD4\u8F83\u4F1A\u88AB\u62E6\u4E0B\u6765\u3002\u8981\u8868\u8FBE\u300C\u5728\u4E24\u8005\u4E4B\u95F4\u300D\uFF0C\u5F97\u5199\u6210\u4E24\u4E2A\u6BD4\u8F83\u518D\u7528 `AND` \u8FDE\u8D77\u6765\u3002"
              }
            ]
          }
        ]
      },
      // ────────────────────────────────────────────────────── 3.4
      {
        id: "3.4",
        title: "AND\u3001OR\u3001NOT \u4E0E\u62EC\u53F7",
        syllabus: ["\xA711.1", "G\xA75.4"],
        estimatedMinutes: 10,
        taughtFeatures: [
          ...BASE,
          "op.arithmetic",
          "op.div",
          "op.mod",
          "op.relational",
          "op.and",
          "op.or",
          "op.not"
        ],
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E00\u4E2A\u6761\u4EF6\u5E38\u5E38\u4E0D\u6B62\u4E00\u53E5\u8BDD\uFF1A\u300C\u5206\u6570\u53CA\u683C**\u5E76\u4E14**\u51FA\u52E4\u591F\u300D\u300C\u5468\u516D**\u6216\u8005**\u5468\u65E5\u300D\u3002\u628A\u5E03\u5C14\u503C\u7EC4\u5408\u8D77\u6765\u7528\u4E09\u4E2A**\u903B\u8F91\u8FD0\u7B97\u7B26\uFF08logic operator\uFF09**\uFF1A`AND`\u3001`OR`\u3001`NOT`\u3002",
              "`A AND B` \u8981\u4E24\u8FB9\u90FD\u4E3A `TRUE` \u624D\u662F `TRUE`\uFF1B`A OR B` \u53EA\u8981\u6709\u4E00\u8FB9\u4E3A `TRUE` \u5C31\u662F `TRUE`\uFF1B`NOT A` \u628A\u771F\u5047\u53CD\u8FC7\u6765\u3002",
              "\u4E09\u8005\u4E5F\u6709\u4F18\u5148\u7EA7\uFF1A`NOT` \u6700\u9AD8\uFF0C\u5176\u6B21 `AND`\uFF0C\u6700\u540E `OR`\u3002\u6240\u4EE5 `TRUE OR TRUE AND FALSE` \u5148\u7B97 `AND`\uFF0C\u7ED3\u679C\u662F `TRUE`\u3002`NOT` \u6293\u5F97\u6700\u7D27\u4F1A\u5E26\u6765\u4E00\u4E2A\u540E\u679C\u2014\u2014`NOT Score > 50` \u88AB\u7406\u89E3\u6210 `(NOT Score) > 50`\uFF0C\u5148\u5BF9\u4E00\u4E2A\u6570\u53D6\u53CD\uFF0C\u8BB2\u4E0D\u901A\uFF1B\u60F3\u8BF4\u300C\u5206\u6570\u4E0D\u8D85\u8FC7 50\u300D\u5F97\u5199\u6210 `NOT (Score > 50)`\u3002",
              "\u8BB0\u4E0D\u4F4F\u4F18\u5148\u7EA7\u4E0D\u8981\u7D27\uFF0C**\u628A\u60F3\u5148\u7B97\u7684\u90E8\u5206\u7528\u62EC\u53F7\u62EC\u8D77\u6765**\uFF0C\u8BFB\u7684\u4EBA\u4E5F\u7701\u4E8B\u3002Guide \u672C\u8EAB\u5C31\u5EFA\u8BAE\u590D\u6742\u7684\u5F0F\u5B50\u663E\u5F0F\u52A0\u62EC\u53F7\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u903B\u8F91\u8FD0\u7B97\u7B26\u662F `AND`\u3001`OR`\u3001`NOT`\uFF1B\u590D\u6742\u8868\u8FBE\u5F0F\u5EFA\u8BAE\u7528\u62EC\u53F7\u628A\u8FD0\u7B97\u987A\u5E8F\u5199\u660E\u767D\uFF08Pseudocode Guide \xA75.4\u3001\xA75.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u4E24\u4E2A\u6761\u4EF6\u4E00\u8D77\u5224\u65AD",
            fileName: "Example_3_4_a.pseudocode",
            code: [
              "DECLARE Score : INTEGER",
              "DECLARE Attendance : INTEGER",
              "DECLARE Awarded : BOOLEAN",
              "DECLARE Missing : BOOLEAN",
              "Score \u2190 64",
              "Attendance \u2190 92",
              "Awarded \u2190 Score >= 50 AND Attendance >= 90",
              "Missing \u2190 NOT (Attendance >= 90)",
              'OUTPUT "Awarded: ", Awarded',
              'OUTPUT "Missing: ", Missing'
            ].join("\n"),
            annotations: [
              {
                fromLine: 7,
                toLine: 7,
                text: "\u4E24\u4E2A\u6BD4\u8F83\u5404\u81EA\u5148\u7B97\u51FA\u5E03\u5C14\u503C\uFF0C`AND` \u518D\u628A\u5B83\u4EEC\u5408\u8D77\u6765\u3002\u6BD4\u8F83\u7684\u4F18\u5148\u7EA7\u9AD8\u4E8E `AND`\uFF0C\u6240\u4EE5\u8FD9\u91CC\u53EF\u4EE5\u4E0D\u52A0\u62EC\u53F7\u3002"
              },
              {
                fromLine: 8,
                toLine: 8,
                text: "\u8FD9\u91CC\u7684\u62EC\u53F7\u4E0D\u80FD\u7701\u3002\u5199\u6210 `NOT Attendance >= 90` \u4F1A\u5148\u5BF9 `Attendance` \u53D6\u53CD\uFF0C\u8BB2\u4E0D\u901A\u3002"
              }
            ],
            sampleRun: { inputs: [], outputs: ["Awarded: TRUE", "Missing: FALSE"] }
          },
          {
            kind: "counterExample",
            title: "\u4E24\u79CD\u5199\u6CD5\u90FD\u4F1A\u88AB\u62E6\u4E0B",
            cases: [
              {
                title: "\u6BD4\u8F83\u4E0D\u80FD\u8FDE\u7740\u5199",
                code: ["DECLARE Score : INTEGER", "Score \u2190 64", "OUTPUT 0 < Score < 100"].join("\n"),
                note: "\u7B2C 3 \u884C\u60F3\u8BF4\u300CScore \u5728 0 \u548C 100 \u4E4B\u95F4\u300D\uFF0C\u4F46\u6BD4\u8F83\u53EA\u80FD\u4E24\u4E24\u8FDB\u884C\u3002\u8981\u8FDE\u8D77\u6765\u6B63\u662F `AND` \u7684\u7528\u5904\uFF1A`Score > 0 AND Score < 100`\u3002",
                expectDiagnostics: [
                  {
                    severity: "error",
                    ruleId: "OP-003",
                    line: 3,
                    text: "\u5173\u7CFB\u8FD0\u7B97\u4E0D\u80FD\u8FDE\u7EED\u4E66\u5199\uFF0C\u9700\u8981\u62C6\u6210\u4E24\u4E2A\u6BD4\u8F83\u518D\u8FDE\u8D77\u6765\u3002"
                  }
                ]
              },
              {
                title: "`NOT` \u6293\u5F97\u6BD4\u6BD4\u8F83\u66F4\u7D27",
                code: ["DECLARE Score : INTEGER", "Score \u2190 64", "OUTPUT NOT Score > 50"].join("\n"),
                note: "\u7B2C 3 \u884C\u88AB\u7406\u89E3\u6210 `(NOT Score) > 50`\uFF1A\u5148\u5BF9\u4E00\u4E2A\u6570\u53D6\u53CD\uFF0C\u518D\u62FF\u5B83\u548C 50 \u6BD4\uFF0C\u4E24\u6B65\u90FD\u8BB2\u4E0D\u901A\u3002\u52A0\u4E0A\u62EC\u53F7\u5199\u6210 `NOT (Score > 50)` \u5C31\u5BF9\u4E86\u3002",
                expectDiagnostics: [
                  {
                    severity: "error",
                    ruleId: "OP-004",
                    line: 3,
                    text: "`NOT` \u53EA\u80FD\u4F5C\u7528\u5728\u5E03\u5C14\u503C\u4E0A\uFF0C\u8FD9\u91CC\u5B83\u62FF\u5230\u7684\u662F\u4E00\u4E2A\u6570\u3002"
                  }
                ]
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u8981\u8868\u8FBE\u300CScore \u5728 0 \u5230 100 \u4E4B\u95F4\uFF08\u542B\u4E24\u7AEF\uFF09\u300D\uFF0C\u54EA\u4E00\u884C\u662F\u5BF9\u7684\uFF1F",
            options: [
              {
                key: "A",
                label: "0 <= Score <= 100",
                correct: false,
                explanation: "\u6BD4\u8F83\u4E0D\u80FD\u8FDE\u7740\u5199\u3002\u8FD9\u4E00\u884C\u4F1A\u88AB\u62E6\u4E0B\u6765\uFF0C\u4E0A\u4E00\u8282\u7684\u53CD\u4F8B\u5C31\u662F\u5B83\u3002"
              },
              {
                key: "B",
                label: "Score >= 0 AND Score <= 100",
                correct: true,
                explanation: "\u5BF9\u3002\u62C6\u6210\u4E24\u4E2A\u5404\u81EA\u6210\u7ACB\u7684\u6BD4\u8F83\uFF0C\u518D\u7528 `AND` \u8981\u6C42\u540C\u65F6\u6EE1\u8DB3\u3002\u6BD4\u8F83\u7684\u4F18\u5148\u7EA7\u9AD8\u4E8E `AND`\uFF0C\u6240\u4EE5\u4E24\u8FB9\u5404\u81EA\u4F1A\u5148\u7B97\u51FA\u5E03\u5C14\u503C\u3002"
              },
              {
                key: "C",
                label: "Score >= 0 OR Score <= 100",
                correct: false,
                explanation: "`OR` \u53EA\u8981\u4E00\u8FB9\u6210\u7ACB\u5C31\u7B97\u6210\u7ACB\u3002\u4EFB\u4F55\u4E00\u4E2A\u6570\u90FD\u81F3\u5C11\u6EE1\u8DB3\u5176\u4E2D\u4E00\u53E5\uFF0C\u6240\u4EE5\u8FD9\u4E00\u884C\u6C38\u8FDC\u662F `TRUE`\uFF0C\u8D77\u4E0D\u5230\u9650\u5236\u4F5C\u7528\u3002"
              },
              {
                key: "D",
                label: "NOT Score < 0 AND Score <= 100",
                correct: false,
                explanation: "`NOT` \u6293\u5F97\u6BD4\u6BD4\u8F83\u7D27\uFF0C`NOT Score` \u4F1A\u5148\u5BF9\u4E00\u4E2A\u6570\u53D6\u53CD\uFF0C\u8BB2\u4E0D\u901A\u3002\u8981\u5426\u5B9A\u6574\u4E2A\u6BD4\u8F83\u5F97\u5199\u6210 `NOT (Score < 0)`\u3002"
              }
            ]
          }
        ]
      },
      // ────────────────────────────────────────────────────── 3.5
      {
        id: "3.5",
        title: "\u7C7B\u578B\u5FC5\u987B\u5BF9\u5F97\u4E0A",
        syllabus: ["\xA711.1", "\xA710.1"],
        estimatedMinutes: 8,
        taughtFeatures: [
          ...BASE,
          "op.arithmetic",
          "op.div",
          "op.mod",
          "op.relational",
          "op.and",
          "op.or",
          "op.not"
        ],
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u8868\u8FBE\u5F0F\u91CC\u7684\u6BCF\u4E2A\u503C\u90FD\u6709\u7C7B\u578B\uFF0C\u8FD0\u7B97\u7B26\u5BF9\u5B83\u63A5\u53D7\u4EC0\u4E48\u7C7B\u578B\u662F\u6709\u8981\u6C42\u7684\uFF1A`+` `-` `*` `/` \u8981\u6570\uFF0C`DIV` `MOD` \u8981\u6574\u6570\uFF0C`AND` `OR` `NOT` \u8981\u5E03\u5C14\u503C\u3002\u7ED9\u9519\u4E86\u7C7B\u578B\uFF0C\u7F16\u8F91\u5668\u4F1A\u5728\u8FD0\u884C\u524D\u5C31\u62E6\u4E0B\u6765\u3002",
              "\u53EA\u6709\u4E00\u5904\u4F1A\u81EA\u52A8\u8F6C\u6362\uFF1A**\u6574\u6570\u53EF\u4EE5\u5F53\u5B9E\u6570\u7528**\u3002`DECLARE R : REAL` \u4E4B\u540E `R \u2190 3` \u662F\u53EF\u4EE5\u7684\uFF0C\u5B58\u8FDB\u53BB\u7684\u662F `3.0`\u3002",
              "\u53CD\u8FC7\u6765\u4E0D\u884C\u3002`DECLARE N : INTEGER` \u4E4B\u540E `N \u2190 3.5` \u4F1A\u88AB\u62E6\u4E0B\u2014\u2014\u5B9E\u6570\u653E\u8FDB\u6574\u6570\u4F1A\u4E22\u6389\u5C0F\u6570\u90E8\u5206\uFF0C\u8FD9\u79CD\u635F\u5931\u4E0D\u4F1A\u6084\u6084\u53D1\u751F\uFF1B\u771F\u8981\u53D6\u6574\u6570\u90E8\u5206\u5F97\u81EA\u5DF1\u5199\u51FA\u6765\uFF1A`N \u2190 INT(3.5)`\u3002\u8FD9\u6761\u5355\u5411\u7684\u89C4\u5219\u4E5F\u89E3\u91CA\u4E86 3.1 \u8282\u7559\u4E0B\u7684\u95EE\u9898\uFF1A`8 / 2` \u5F97\u5230\u5B9E\u6570 `4.0`\uFF0C\u653E\u4E0D\u8FDB `INTEGER`\uFF0C\u8981\u6574\u9664\u5C31\u7528 `DIV`\u3002"
            ],
            callouts: [
              {
                source: "editor",
                text: "\u7C7B\u578B\u4E0D\u5339\u914D\u662F\u8FD0\u884C\u524D\u5C31\u80FD\u770B\u51FA\u6765\u7684\uFF0C\u7F16\u8F91\u5668\u4F1A\u76F4\u63A5\u62E6\u4F4F\u4E0D\u8BA9\u8FD0\u884C\u3002\u9664\u6570\u4E3A 0 \u4E0D\u4E00\u6837\u2014\u2014\u90A3\u8981\u771F\u7684\u7B97\u5230\u90A3\u4E00\u6B65\u624D\u77E5\u9053\uFF0C\u5C5E\u4E8E\u8FD0\u884C\u65F6\u624D\u4F1A\u51FA\u73B0\u7684\u9519\u8BEF\u3002"
              }
            ]
          },
          {
            kind: "counterExample",
            title: "\u4E24\u79CD\u62E6\u6CD5\uFF0C\u65F6\u673A\u4E0D\u4E00\u6837",
            cases: [
              {
                title: "\u8FD0\u884C\u524D\u5C31\u62E6\u4E0B\uFF1A\u5B9E\u6570\u653E\u4E0D\u8FDB\u6574\u6570",
                code: ["DECLARE Count : INTEGER", "Count \u2190 8 / 2"].join("\n"),
                note: "`8 / 2` \u7684\u7ED3\u679C\u662F `4.0`\uFF0C\u662F\u5B9E\u6570\u3002\u7C7B\u578B\u5BF9\u4E0D\u4E0A\uFF0C\u4E0D\u7528\u8FD0\u884C\u5C31\u80FD\u770B\u51FA\u6765\u3002\u8981\u4E48\u628A `Count` \u58F0\u660E\u6210 `REAL`\uFF0C\u8981\u4E48\u628A `/` \u6362\u6210 `DIV`\u3002",
                expectDiagnostics: [
                  {
                    severity: "error",
                    ruleId: "ASSIGN-002",
                    line: 2,
                    text: "\u53F3\u8FB9\u7B97\u51FA\u6765\u7684\u662F\u5B9E\u6570\uFF0C\u5DE6\u8FB9\u7684\u53D8\u91CF\u53EA\u6536\u6574\u6570\u3002"
                  }
                ]
              },
              {
                title: "\u8FD0\u884C\u5230\u90A3\u4E00\u884C\u624D\u62E6\uFF1A\u9664\u6570\u662F 0",
                code: [
                  "DECLARE Total : INTEGER",
                  "DECLARE Share : INTEGER",
                  "DECLARE People : INTEGER",
                  "Total \u2190 100",
                  "People \u2190 0",
                  "Share \u2190 Total DIV People"
                ].join("\n"),
                note: "\u8FD9\u6BB5\u4EE3\u7801\u7C7B\u578B\u5168\u5BF9\uFF0C\u7F16\u8F91\u5668\u4E00\u6761\u63D0\u793A\u90FD\u6CA1\u6709\u2014\u2014`People` \u662F\u4E2A\u6574\u6570\uFF0C`DIV` \u6536\u6574\u6570\uFF0C\u5B8C\u5168\u5408\u6CD5\u3002\u53EF\u662F\u5B83\u4E00\u8DD1\u5230\u7B2C 6 \u884C\u5C31\u505C\u4E86\uFF1A\u8FD9\u65F6\u624D\u77E5\u9053 `People` \u91CC\u88C5\u7684\u662F 0\u3002**\u80FD\u901A\u8FC7\u68C0\u67E5\u4E0D\u7B49\u4E8E\u80FD\u8DD1\u5B8C\u3002**",
                expectRuntimeError: {
                  code: "RT1301",
                  line: 6,
                  text: "\u9664\u6570\u662F 0\uFF0C\u7A0B\u5E8F\u7B97\u5230\u8FD9\u4E00\u884C\u5C31\u505C\u4E0B\u6765\u4E86\u3002"
                }
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0B\u9762\u56DB\u884C\u91CC\uFF0C\u54EA\u4E00\u884C**\u4E0D\u4F1A**\u88AB\u7F16\u8F91\u5668\u62E6\u4E0B\uFF1F",
            options: [
              {
                key: "A",
                label: "DECLARE R : REAL \u4E4B\u540E\u5199 R \u2190 7",
                correct: true,
                explanation: "\u4E0D\u4F1A\u3002\u6574\u6570\u53EF\u4EE5\u5F53\u5B9E\u6570\u7528\uFF0C`R` \u91CC\u5B58\u7684\u662F `7.0`\u3002\u8FD9\u662F\u552F\u4E00\u4E00\u5904\u81EA\u52A8\u8F6C\u6362\u3002"
              },
              {
                key: "B",
                label: "DECLARE N : INTEGER \u4E4B\u540E\u5199 N \u2190 7 / 2",
                correct: false,
                explanation: "\u4F1A\u88AB\u62E6\u4E0B\u3002`/` \u7684\u7ED3\u679C\u6C38\u8FDC\u662F\u5B9E\u6570\uFF0C`3.5` \u653E\u4E0D\u8FDB\u6574\u6570\u53D8\u91CF\u3002"
              },
              {
                key: "C",
                label: "DECLARE Flag : BOOLEAN \u4E4B\u540E\u5199 Flag \u2190 1",
                correct: false,
                explanation: "\u4F1A\u88AB\u62E6\u4E0B\u3002`1` \u662F\u6574\u6570\uFF0C\u5E03\u5C14\u53D8\u91CF\u53EA\u6536 `TRUE` \u548C `FALSE`\u3002"
              },
              {
                key: "D",
                label: "DECLARE N : INTEGER \u4E4B\u540E\u5199 N \u2190 5 MOD 0",
                correct: false,
                explanation: "\u7C7B\u578B\u4E0A\u6CA1\u95EE\u9898\uFF0C`MOD` \u4E24\u8FB9\u90FD\u662F\u6574\u6570\u2014\u2014\u4F46\u9664\u6570\u662F 0\uFF0C\u7A0B\u5E8F\u4E00\u7B97\u5230\u8FD9\u91CC\u5C31\u4F1A\u505C\u4E0B\u6765\u62A5\u9519\u3002\u8FD9\u4E00\u6761\u4E0D\u662F\u7F16\u8F91\u5668\u62E6\u7684\uFF0C\u662F\u8FD0\u884C\u65F6\u62E6\u7684\u3002"
              }
            ]
          }
        ]
      }
    ],
    // ──────────────────────────────────────────────── 章末大题
    chapterTasks: [
      {
        kind: "chapterTask",
        id: "3.T1",
        title: "\u7B97\u4E00\u5F20\u8D2D\u7269\u5C0F\u7968",
        statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165\u5546\u54C1\u5355\u4EF7\uFF08\u6574\u6570\uFF0C\u5355\u4F4D\u662F\u5206\uFF09\u548C\u6570\u91CF\uFF0C\u7B97\u51FA\u603B\u4EF7\uFF0C\u518D\u5224\u65AD\u662F\u5426\u8FBE\u5230\u514D\u8FD0\u8D39\u7684\u95E8\u69DB\uFF08500 \u5206\uFF09\u3002\u663E\u793A\u4E09\u884C\u5C0F\u7968\u3002",
        ioSpec: {
          input: [
            "\u4E24\u884C\u3002\u7B2C\u4E00\u884C\u662F\u5355\u4EF7\uFF08`INTEGER`\uFF0C\u5355\u4F4D\u5206\uFF09\uFF0C\u7B2C\u4E8C\u884C\u662F\u6570\u91CF\uFF08`INTEGER`\uFF09\u3002",
            "\u4E24\u53E5\u63D0\u793A\u8BED\u5404\u81EA\u6392\u5728\u5B83\u5BF9\u5E94\u7684\u90A3\u6B21\u8BFB\u53D6\u4E4B\u524D\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
            "`Enter the unit price`",
            "`Enter the quantity`"
          ].join("\n"),
          output: [
            "\u8BFB\u5B8C\u4E4B\u540E\u518D\u663E\u793A\u4E09\u884C\uFF1A",
            "`Total: <\u603B\u4EF7>`",
            "`Yuan: <\u5143> Fen: <\u5206>`\u3000\uFF08\u628A\u603B\u4EF7\u6362\u7B97\u6210\u5143\u548C\u5206\uFF09",
            "`Free delivery: <TRUE \u6216 FALSE>`\u3000\uFF08\u603B\u4EF7\u8FBE\u5230 500 \u5206\u7B97\u8FBE\u5230\uFF09",
            "\u6BCF\u4E2A\u5192\u53F7\u540E\u9762\u90FD\u662F\u4E00\u4E2A\u7A7A\u683C\u3002"
          ].join("\n")
        },
        suggestedFeatures: ["op.arithmetic", "op.div", "op.mod", "op.relational", "io.input", "io.output"],
        hints: [
          "\u628A\u8FD9\u5F20\u5C0F\u7968\u62C6\u6210\u4E09\u4EF6\u4E8B\uFF1A\u7B97\u603B\u4EF7\u3001\u628A\u603B\u4EF7\u62C6\u6210\u5143\u548C\u5206\u3001\u5224\u65AD\u591F\u4E0D\u591F\u514D\u8FD0\u8D39\u3002",
          "\u300C\u62C6\u6210\u5143\u548C\u5206\u300D\u548C\u4E0A\u4E00\u8282\u628A\u79D2\u6362\u6210\u5206\u79D2\u662F\u540C\u4E00\u4E2A\u52A8\u4F5C\uFF1A\u4E00\u4E2A\u8981\u6574\u6570\u4EFD\u6570\uFF0C\u4E00\u4E2A\u8981\u5269\u4E0B\u7684\u3002",
          "\u7B2C\u4E09\u884C\u663E\u793A\u7684\u662F\u4E00\u4E2A\u5E03\u5C14\u503C\uFF0C\u6240\u4EE5\u5B83\u53EF\u4EE5\u76F4\u63A5\u7531\u4E00\u6B21\u6BD4\u8F83\u7B97\u51FA\u6765\uFF0C\u4E0D\u9700\u8981\u5224\u65AD\u8BED\u53E5\u3002"
        ],
        examples: [
          {
            inputs: ["120", "3"],
            outputs: [
              "Enter the unit price",
              "Enter the quantity",
              "Total: 360",
              "Yuan: 3 Fen: 60",
              "Free delivery: FALSE"
            ]
          }
        ],
        lockedStarterCode: "CONSTANT FreeDeliveryFrom = 500\n",
        referenceSolution: [
          "CONSTANT FreeDeliveryFrom = 500",
          "// \u8BFB\u5165\u5355\u4EF7\u4E0E\u6570\u91CF\uFF0C\u7B97\u51FA\u603B\u4EF7\u5E76\u5224\u65AD\u662F\u5426\u514D\u8FD0\u8D39",
          "CONSTANT FenPerYuan = 100",
          "DECLARE UnitPrice : INTEGER",
          "DECLARE Quantity : INTEGER",
          "DECLARE Total : INTEGER",
          "DECLARE Yuan : INTEGER",
          "DECLARE Fen : INTEGER",
          "DECLARE FreeDelivery : BOOLEAN",
          'OUTPUT "Enter the unit price"',
          "INPUT UnitPrice",
          'OUTPUT "Enter the quantity"',
          "INPUT Quantity",
          "Total \u2190 UnitPrice * Quantity",
          "Yuan \u2190 Total DIV FenPerYuan",
          "Fen \u2190 Total MOD FenPerYuan",
          "FreeDelivery \u2190 Total >= FreeDeliveryFrom",
          'OUTPUT "Total: ", Total',
          'OUTPUT "Yuan: ", Yuan, " Fen: ", Fen',
          'OUTPUT "Free delivery: ", FreeDelivery'
        ].join("\n"),
        tests: [
          {
            id: "t1",
            kind: "normal",
            inputs: ["115", "3"],
            caseHint: "\u4E00\u7B14\u666E\u901A\u7684\u8BA2\u5355\uFF0C\u603B\u4EF7\u4E0D\u5230\u514D\u8FD0\u8D39\u7684\u95E8\u69DB\u3002"
          },
          {
            id: "t2",
            kind: "normal",
            inputs: ["250", "4"],
            caseHint: "\u603B\u4EF7\u660E\u663E\u8D85\u8FC7\u95E8\u69DB\u7684\u4E00\u7B14\u8BA2\u5355\u3002"
          },
          {
            id: "t3",
            kind: "boundary",
            inputs: ["100", "5"],
            caseHint: "\u603B\u4EF7\u6B63\u597D\u7B49\u4E8E\u514D\u8FD0\u8D39\u7684\u95E8\u69DB\u3002"
          },
          {
            id: "t4",
            kind: "boundary",
            inputs: ["300", "0"],
            caseHint: "\u5F53\u6570\u91CF\u662F\u96F6\u3001\u603B\u4EF7\u4E5F\u662F\u96F6\u65F6\u3002"
          },
          {
            id: "t5",
            kind: "extreme",
            inputs: ["99999", "99"],
            caseHint: "\u5F53\u5355\u4EF7\u548C\u6570\u91CF\u90FD\u5F88\u5927\u65F6\u3002"
          }
        ]
      }
    ]
  };

  // packages/teaching-content/src/chapter-04.ts
  var AFTER_CHAPTER_3 = [
    "io.output",
    "io.input",
    "decl.variable",
    "misc.comment",
    "type.string",
    "literal.string",
    "type.integer",
    "type.real",
    "type.char",
    "type.boolean",
    "type.date",
    "literal.integer",
    "literal.real",
    "literal.char",
    "literal.boolean",
    "literal.date",
    "assign.simple",
    "decl.constant",
    "op.arithmetic",
    "op.div",
    "op.mod",
    "op.relational",
    "op.and",
    "op.or",
    "op.not"
  ];
  var AFTER_4_1 = [...AFTER_CHAPTER_3, "select.if"];
  var AFTER_4_2 = [...AFTER_4_1, "select.if-else"];
  var AFTER_4_3 = [...AFTER_4_2, "select.nested-if"];
  var AFTER_4_4 = [...AFTER_4_3, "select.case"];
  var AFTER_4_5 = [...AFTER_4_4, "select.case-range", "select.case-otherwise"];
  var chapter04 = {
    id: 4,
    title: "\u9009\u62E9",
    level: "AS",
    syllabus: ["\xA711.2", "G\xA76"],
    prerequisites: [1, 2, 3],
    sections: [
      {
        id: "4.1",
        title: "`IF \u2026 THEN \u2026 ENDIF`",
        syllabus: ["\xA711.2", "G\xA76"],
        estimatedMinutes: 8,
        taughtFeatures: AFTER_4_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u524D\u4E09\u7AE0\u7684\u7A0B\u5E8F\uFF0C\u6BCF\u4E00\u884C\u90FD\u4F1A\u6267\u884C\u3002\u4ECE\u4E0A\u5230\u4E0B\u8D70\u4E00\u904D\uFF0C\u4E00\u53E5\u4E0D\u843D\u3002\u4F46\u5F88\u591A\u4E8B\u60C5\u8981\u770B\u60C5\u51B5\u624D\u505A\uFF1A\u4E0B\u96E8\u624D\u5E26\u4F1E\uFF0C\u53CA\u683C\u4E86\u624D\u53D1\u8BC1\u4E66\u3002**\u9009\u62E9\uFF08selection\uFF09**\u5C31\u662F\u8BA9\u4E00\u6BB5\u4EE3\u7801\u53EA\u5728\u6761\u4EF6\u6210\u7ACB\u65F6\u624D\u6267\u884C\u3002",
              "\u5199\u6CD5\u662F `IF <\u6761\u4EF6> THEN`\uFF0C\u63A5\u7740\u5199\u6761\u4EF6\u6210\u7ACB\u65F6\u8981\u505A\u7684\u4E8B\uFF0C\u6700\u540E\u7528 `ENDIF` \u6536\u5C3E\u3002\u8FD9\u91CC\u7684\u6761\u4EF6\u5C31\u662F\u7B2C 3 \u7AE0\u90A3\u79CD\u7B97\u51FA `BOOLEAN` \u7684\u5F0F\u5B50\u2014\u2014`Score >= 50` \u7B97\u51FA\u6765\u662F `TRUE` \u6216 `FALSE`\u3002",
              "\u7B97\u51FA `TRUE`\uFF0C\u5C31\u6267\u884C `THEN` \u548C `ENDIF` \u4E4B\u95F4\u7684\u90E8\u5206\uFF1B\u7B97\u51FA `FALSE`\uFF0C\u8FD9\u4E00\u6574\u6BB5\u5C31\u8DF3\u8FC7\uFF0C\u7A0B\u5E8F\u4ECE `ENDIF` \u540E\u9762\u63A5\u7740\u8D70\u3002",
              "`ENDIF` \u4E0D\u662F\u88C5\u9970\uFF0C\u5B83\u5212\u51FA\u300C\u5F52\u8FD9\u4E2A\u6761\u4EF6\u7BA1\u300D\u7684\u8303\u56F4\u3002\u8303\u56F4\u91CC\u7684\u6BCF\u4E00\u884C\u5F80\u53F3\u7F29\u8FDB\u4E09\u4E2A\u7A7A\u683C\u2014\u2014\u7F29\u8FDB\u5728\u8FD9\u91CC\u7B2C\u4E00\u6B21\u771F\u6B63\u6709\u4E86\u610F\u4E49\uFF1A\u4E00\u773C\u5C31\u80FD\u770B\u51FA\u54EA\u51E0\u884C\u662F\u6709\u6761\u4EF6\u7684\uFF0C\u54EA\u51E0\u884C\u662F\u65E0\u8BBA\u5982\u4F55\u90FD\u4F1A\u6267\u884C\u7684\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u9009\u62E9\u7ED3\u6784\u5199\u4F5C `IF <condition> THEN \u2026 ENDIF`\u3002\u6761\u4EF6\u5FC5\u987B\u662F\u4E00\u4E2A `BOOLEAN` \u8868\u8FBE\u5F0F\uFF0C\u7ED3\u6784\u4F53\u8981\u7F29\u8FDB\uFF08Pseudocode Guide \xA76.1\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u53CA\u683C\u624D\u8BF4\u4E00\u53E5",
            fileName: "Example_4_1_a.pseudocode",
            code: [
              "DECLARE Score : INTEGER",
              'OUTPUT "Enter the score"',
              "INPUT Score",
              "IF Score >= 50 THEN",
              '   OUTPUT "Passed"',
              "ENDIF",
              'OUTPUT "Done"'
            ].join("\n"),
            annotations: [
              { fromLine: 4, toLine: 4, text: "`Score >= 50` \u662F\u4E00\u6B21\u6BD4\u8F83\uFF0C\u5B83\u7684\u7ED3\u679C\u662F `BOOLEAN`\uFF0C\u6B63\u597D\u80FD\u5F53\u6761\u4EF6\u3002" },
              { fromLine: 5, toLine: 5, text: "\u7F29\u8FDB\u4E09\u683C\uFF0C\u8868\u793A\u5B83\u5F52\u4E0A\u9762\u90A3\u4E2A\u6761\u4EF6\u7BA1\u3002" },
              { fromLine: 7, toLine: 7, text: "\u6CA1\u6709\u7F29\u8FDB\uFF0C\u4E0D\u5728 `IF` \u7684\u8303\u56F4\u91CC\u2014\u2014\u4E0D\u7BA1\u53CA\u4E0D\u53CA\u683C\uFF0C\u8FD9\u4E00\u884C\u90FD\u4F1A\u6267\u884C\u3002" }
            ],
            sampleRun: { inputs: ["72"], outputs: ["Enter the score", "Passed", "Done"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u628A\u4E0A\u9762\u90A3\u6BB5\u4EE3\u7801\u7684\u8F93\u5165\u6362\u6210 40\uFF0C\u5C4F\u5E55\u4E0A\u4F9D\u6B21\u663E\u793A\u4EC0\u4E48\uFF1F",
            code: [
              "IF Score >= 50 THEN",
              '   OUTPUT "Passed"',
              "ENDIF",
              'OUTPUT "Done"'
            ].join("\n"),
            options: [
              {
                key: "A",
                label: "\u4EC0\u4E48\u90FD\u6CA1\u6709",
                correct: false,
                explanation: '\u8DF3\u8FC7\u7684\u53EA\u662F `IF` \u7BA1\u7740\u7684\u90A3\u4E00\u884C\u3002`OUTPUT "Done"` \u6CA1\u6709\u7F29\u8FDB\uFF0C\u4E0D\u5F52\u5B83\u7BA1\u3002'
              },
              {
                key: "B",
                label: "\u53EA\u6709 Passed",
                correct: false,
                explanation: "\u6B63\u597D\u53CD\u4E86\uFF1A\u6761\u4EF6\u4E0D\u6210\u7ACB\u65F6\u8DF3\u8FC7\u7684\u6070\u6070\u662F `Passed` \u90A3\u4E00\u884C\u3002"
              },
              {
                key: "C",
                label: "\u53EA\u6709 Done",
                correct: true,
                explanation: '\u5BF9\u3002`40 >= 50` \u7B97\u51FA `FALSE`\uFF0C`THEN` \u548C `ENDIF` \u4E4B\u95F4\u90A3\u4E00\u884C\u88AB\u6574\u4E2A\u8DF3\u8FC7\uFF1B`OUTPUT "Done"` \u4E0D\u5728 `IF` \u7684\u8303\u56F4\u91CC\uFF0C\u7167\u5E38\u6267\u884C\u3002'
              },
              {
                key: "D",
                label: "Passed \u548C Done",
                correct: false,
                explanation: "`Passed` \u53EA\u5728\u6761\u4EF6\u6210\u7ACB\u65F6\u624D\u663E\u793A\u300240 \u4E0D\u5230 50\uFF0C\u6761\u4EF6\u7B97\u51FA\u6765\u662F `FALSE`\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "4.2",
        title: "`ELSE`\uFF1A\u4E24\u6761\u8DEF\u8D70\u4E00\u6761",
        syllabus: ["\xA711.2", "G\xA76"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_4_2,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E0A\u4E00\u8282\u7684\u7A0B\u5E8F\u53EA\u5728\u6761\u4EF6\u6210\u7ACB\u65F6\u505A\u4E00\u4EF6\u4E8B\uFF0C\u4E0D\u6210\u7ACB\u5C31\u4EC0\u4E48\u4E5F\u4E0D\u505A\u3002\u53EF\u73B0\u5B9E\u91CC\u66F4\u5E38\u89C1\u7684\u662F\u300C\u5426\u5219\u2026\u2026\u300D\uFF1A\u53CA\u683C\u5C31\u8BF4 `Passed`\uFF0C**\u5426\u5219**\u8BF4 `Failed`\u3002",
              "`ELSE` \u5C31\u662F\u8FD9\u4E2A\u300C\u5426\u5219\u300D\u3002\u5199\u6CD5\u662F\u5728 `IF` \u7684\u8303\u56F4\u91CC\u5148\u5199\u6210\u7ACB\u65F6\u505A\u7684\u4E8B\uFF0C\u518D\u5199\u4E00\u884C `ELSE`\uFF0C\u540E\u9762\u63A5\u4E0D\u6210\u7ACB\u65F6\u505A\u7684\u4E8B\uFF0C\u6700\u540E\u4ECD\u7136\u7528\u4E00\u4E2A `ENDIF` \u6536\u5C3E\u3002",
              "\u4E24\u6761\u5206\u652F**\u6070\u597D\u8D70\u4E00\u6761**\uFF1A\u4E0D\u4F1A\u4E24\u6761\u90FD\u8D70\uFF0C\u4E5F\u4E0D\u4F1A\u4E24\u6761\u90FD\u4E0D\u8D70\u3002\u6761\u4EF6\u7B97\u51FA `TRUE` \u8D70\u4E0A\u9762\uFF0C\u7B97\u51FA `FALSE` \u8D70\u4E0B\u9762\uFF0C\u8D70\u5B8C\u4E4B\u540E\u90FD\u4ECE `ENDIF` \u4E4B\u540E\u7EE7\u7EED\u3002",
              "\u6574\u4E2A\u7ED3\u6784\u53EA\u6709\u4E00\u4E2A `ENDIF`\uFF0C`ELSE` \u540E\u9762\u4E0D\u9700\u8981\u518D\u5199 `THEN`\uFF0C\u4E5F\u6CA1\u6709 `ENDELSE` \u8FD9\u79CD\u4E1C\u897F\u3002`ELSE` \u81EA\u5DF1\u548C `IF`\u3001`ENDIF` \u5BF9\u9F50\uFF0C\u5F52\u5B83\u7BA1\u7684\u884C\u624D\u7F29\u8FDB\u3002"
            ]
          },
          {
            kind: "comparison",
            title: "\u540C\u4E00\u4EF6\u4E8B\u7684\u4E09\u79CD\u5199\u6CD5",
            intro: "\u540C\u6837\u4E00\u53E5\u300C\u53CA\u683C\u5C31\u8BF4 Passed\uFF0C\u5426\u5219\u8BF4 Failed\u300D\uFF0C\u4E09\u79CD\u8BB0\u6CD5\u5404\u81EA\u628A\u4EC0\u4E48\u5199\u660E\u3001\u4EC0\u4E48\u7559\u7ED9\u8BFB\u8005\u8865\u3002",
            panes: [
              {
                label: "\u81EA\u7136\u8BED\u8A00",
                language: "natural",
                code: "\u5982\u679C\u5206\u6570\u4E0D\u4F4E\u4E8E 50\uFF0C\u5C31\u663E\u793A Passed\uFF0C\u5426\u5219\u663E\u793A Failed\u3002",
                note: "\u300C\u5426\u5219\u300D\u5728\u8FD9\u53E5\u8BDD\u91CC\u53EF\u4EE5\u7701\u7565\u4E0D\u8BF4\uFF0C\u8BFB\u7684\u4EBA\u81EA\u5DF1\u4F1A\u8865\u4E0A\u3002\u7A0B\u5E8F\u4E0D\u4F1A\u81EA\u5DF1\u8865\uFF0C`ELSE` \u5FC5\u987B\u5199\u51FA\u6765\u3002"
              },
              {
                label: "\u4F2A\u4EE3\u7801",
                language: "pseudocode",
                code: [
                  "DECLARE Score : INTEGER",
                  "Score \u2190 55",
                  "IF Score >= 50 THEN",
                  '   OUTPUT "Passed"',
                  "ELSE",
                  '   OUTPUT "Failed"',
                  "ENDIF"
                ].join("\n"),
                note: "\u7ED3\u6784\u7684\u5F00\u5934\u548C\u7ED3\u5C3E\u90FD\u662F\u660E\u5199\u7684\uFF1A`IF` \u5F00\u59CB\uFF0C`ENDIF` \u7ED3\u675F\uFF0C`ELSE` \u628A\u4E2D\u95F4\u5207\u6210\u4E24\u534A\u3002"
              },
              {
                label: "Python",
                language: "python",
                code: ["score = 55", "if score >= 50:", '    print("Passed")', "else:", '    print("Failed")'].join("\n"),
                note: "\u540C\u4E00\u4E2A\u610F\u601D\u3002Python \u7528\u5192\u53F7\u548C\u7F29\u8FDB\u8868\u793A\u8303\u56F4\uFF0C\u6CA1\u6709 `ENDIF`\u2014\u2014\u8303\u56F4\u5230\u54EA\u513F\u7ED3\u675F\u5168\u9760\u7F29\u8FDB\u3002\u4F2A\u4EE3\u7801\u4E24\u6837\u90FD\u8981\uFF1A\u7F29\u8FDB\u7ED9\u4EBA\u770B\uFF0C`ENDIF` \u628A\u8303\u56F4\u5199\u6B7B\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u4E24\u6761\u8DEF",
            fileName: "Example_4_2_a.pseudocode",
            code: [
              "DECLARE Score : INTEGER",
              'OUTPUT "Enter the score"',
              "INPUT Score",
              "IF Score >= 50 THEN",
              '   OUTPUT "Passed"',
              "ELSE",
              '   OUTPUT "Failed"',
              "ENDIF",
              'OUTPUT "Checked"'
            ].join("\n"),
            annotations: [
              { fromLine: 4, toLine: 8, text: "\u4E00\u4E2A\u5B8C\u6574\u7684\u9009\u62E9\u7ED3\u6784\u3002\u4E0D\u7BA1\u8D70\u54EA\u6761\u8DEF\uFF0C\u540E\u9762\u7684 `Checked` \u90FD\u4F1A\u663E\u793A\u3002" },
              { fromLine: 6, toLine: 6, text: "`ELSE` \u81EA\u5DF1\u4E0D\u7F29\u8FDB\uFF0C\u5B83\u548C `IF`\u3001`ENDIF` \u5BF9\u9F50\uFF1B\u5F52\u5B83\u7BA1\u7684\u90A3\u4E00\u884C\u624D\u7F29\u8FDB\u3002" }
            ],
            sampleRun: { inputs: ["50"], outputs: ["Enter the score", "Passed", "Checked"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`A` \u662F 10 \u65F6\uFF0C\u4E0B\u9762\u8FD9\u6BB5\u663E\u793A\u4EC0\u4E48\uFF1F",
            code: ["IF A > 10 THEN", '   OUTPUT "Big"', "ELSE", '   OUTPUT "Small"', "ENDIF"].join("\n"),
            options: [
              {
                key: "A",
                label: "Small",
                correct: true,
                explanation: "\u5BF9\u3002`10 > 10` \u7B97\u51FA `FALSE`\u2014\u2014`>` \u8981\u6C42\u4E25\u683C\u5927\u4E8E\uFF0C\u76F8\u7B49\u4E0D\u7B97\u3002\u6761\u4EF6\u4E0D\u6210\u7ACB\uFF0C\u8D70 `ELSE`\u3002"
              },
              {
                key: "B",
                label: "Big",
                correct: false,
                explanation: "\u8981\u663E\u793A `Big`\uFF0C`A` \u5F97\u6BD4 10 \u5927\u3002\u6B63\u597D\u7B49\u4E8E 10 \u65F6 `>` \u7ED9\u51FA\u7684\u662F `FALSE`\u3002"
              },
              {
                key: "C",
                label: "\u4E24\u4E2A\u90FD\u663E\u793A",
                correct: false,
                explanation: "`ELSE` \u7684\u4E24\u6761\u5206\u652F\u6070\u597D\u8D70\u4E00\u6761\u3002\u8D70\u4E86\u4E0A\u9762\u90A3\u6761\u5C31\u4E0D\u4F1A\u518D\u8D70\u4E0B\u9762\u90A3\u6761\u3002"
              },
              {
                key: "D",
                label: "\u4EC0\u4E48\u90FD\u4E0D\u663E\u793A",
                correct: false,
                explanation: "\u6709 `ELSE` \u65F6\u4E0D\u5B58\u5728\u300C\u4E24\u6761\u90FD\u4E0D\u8D70\u300D\uFF1A\u6761\u4EF6\u7684\u7ED3\u679C\u4E0D\u662F `TRUE` \u5C31\u662F `FALSE`\uFF0C\u603B\u6709\u4E00\u6761\u8981\u8D70\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "4.2.1",
            title: "\u5947\u6570\u8FD8\u662F\u5076\u6570",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u63D0\u793A\u5E76\u8BFB\u5165\u4E00\u4E2A\u6574\u6570\uFF0C\u5224\u65AD\u5B83\u662F\u5947\u6570\u8FD8\u662F\u5076\u6570\u5E76\u663E\u793A\u7ED3\u679C\u3002",
            ioSpec: {
              input: ["\u4E00\u884C\uFF0C\u4E00\u4E2A `INTEGER`\u3002\u63D0\u793A\u8BED\u6392\u5728\u8BFB\u53D6\u4E4B\u524D\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a number`"].join("\n"),
              output: ["\u4E00\u884C\u3002\u5076\u6570\u663E\u793A `Even`\uFF0C\u5947\u6570\u663E\u793A `Odd`\u3002"].join("\n")
            },
            constraints: {
              require: [
                {
                  feature: "select.if-else",
                  reason: "\u5947\u548C\u5076\u628A\u6240\u6709\u6574\u6570\u5206\u6210\u4E24\u534A\uFF0C\u6CA1\u6709\u7B2C\u4E09\u79CD\u53EF\u80FD\uFF0C\u6B63\u662F\u4E24\u6761\u8DEF\u8D70\u4E00\u6761\u3002"
                },
                {
                  feature: "op.mod",
                  reason: "\u5224\u65AD\u80FD\u4E0D\u80FD\u88AB 2 \u6574\u9664\uFF0C\u8981\u770B\u7684\u662F\u4F59\u6570\uFF0C\u8FD9\u5C31\u662F `MOD` \u7684\u7528\u5904\u3002"
                }
              ]
            },
            hints: [
              "\u4E00\u4E2A\u6570\u80FD\u4E0D\u80FD\u88AB 2 \u6574\u9664\uFF0C\u770B\u5B83\u9664\u4EE5 2 \u7684\u4F59\u6570\u5C31\u77E5\u9053\u3002",
              "\u4F59\u6570\u53EA\u6709\u4E24\u79CD\u7ED3\u679C\uFF0C\u6240\u4EE5\u5224\u65AD\u5199\u6210\u4E00\u6B21\u6BD4\u8F83\u5C31\u591F\u4E86\uFF0C\u4E0D\u9700\u8981\u628A\u4E24\u79CD\u60C5\u51B5\u5206\u522B\u5217\u51FA\u6765\u3002"
            ],
            examples: [{ inputs: ["5"], outputs: ["Enter a number", "Odd"] }],
            referenceSolution: [
              "DECLARE Number : INTEGER",
              'OUTPUT "Enter a number"',
              "INPUT Number",
              "IF Number MOD 2 = 0 THEN",
              '   OUTPUT "Even"',
              "ELSE",
              '   OUTPUT "Odd"',
              "ENDIF"
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["7"], caseHint: "\u4E00\u4E2A\u666E\u901A\u7684\u5947\u6570\u3002" },
              { id: "t2", kind: "normal", inputs: ["12"], caseHint: "\u4E00\u4E2A\u666E\u901A\u7684\u5076\u6570\u3002" },
              { id: "t3", kind: "boundary", inputs: ["0"], caseHint: "\u96F6\u2014\u2014\u5B83\u80FD\u88AB\u6574\u9664\u5417\u3002" },
              { id: "t4", kind: "extreme", inputs: ["1000001"], caseHint: "\u4E00\u4E2A\u5F88\u5927\u7684\u6570\u3002" }
            ]
          }
        ]
      },
      {
        id: "4.3",
        title: "\u4E32\u63A5\u4E0E\u5D4C\u5957",
        syllabus: ["\xA711.2", "G\xA76"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_4_3,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E24\u6761\u8DEF\u4E0D\u591F\u7528\u7684\u65F6\u5019\u5F88\u591A\uFF1A\u6210\u7EE9\u8981\u5206 A\u3001Pass\u3001Fail \u4E09\u6863\uFF0C\u5C31\u5F97\u5148\u95EE\u4E00\u6B21\uFF0C\u518D\u5728\u300C\u5426\u5219\u300D\u91CC\u63A5\u7740\u95EE\u3002\u529E\u6CD5\u662F\u628A\u4E0B\u4E00\u4E2A `IF` \u653E\u8FDB `ELSE` \u91CC\uFF0C\u8FD9\u53EB**\u4E32\u63A5**\u3002",
              "\u4E32\u63A5\u7684\u542B\u4E49\u662F\uFF1A\u4E00\u4E32\u6761\u4EF6\u6309\u987A\u5E8F\u8BD5\uFF0C**\u7B2C\u4E00\u4E2A\u6210\u7ACB\u7684\u90A3\u6761\u5C31\u88AB\u8D70\u6389\uFF0C\u540E\u9762\u7684\u4E0D\u518D\u770B**\u300290 \u5206\u5728\u7B2C\u4E00\u4E2A\u6761\u4EF6\u5C31\u505C\u4F4F\u4E86\uFF0C\u6839\u672C\u4E0D\u4F1A\u8D70\u5230\u7B2C\u4E8C\u4E2A\u3002",
              "\u6B63\u56E0\u4E3A\u662F\u6309\u987A\u5E8F\u8BD5\u7684\uFF0C**\u987A\u5E8F\u4E0D\u80FD\u4E71\u6392**\u3002\u5982\u679C\u628A `Score >= 50` \u653E\u5728\u524D\u9762\uFF0C90 \u5206\u4F1A\u5148\u649E\u4E0A\u5B83\u663E\u793A `Pass`\uFF0C`>= 80` \u90A3\u6761\u6C38\u8FDC\u8F6E\u4E0D\u5230\u3002\u5206\u6863\u65F6\u8981\u4E48\u4ECE\u9AD8\u5F80\u4F4E\u6392\uFF0C\u8981\u4E48\u4ECE\u4F4E\u5F80\u9AD8\u6392\uFF0C\u4E0D\u80FD\u4EA4\u9519\u3002",
              "\u6709\u51E0\u4E2A `IF` \u5C31\u8981\u6709\u51E0\u4E2A `ENDIF`\uFF0C\u5B83\u4EEC\u4F1A\u53E0\u5728\u4E00\u8D77\uFF0C\u91CC\u9762\u90A3\u4E2A\u5173\u6389\u91CC\u5C42\uFF0C\u5916\u9762\u90A3\u4E2A\u5173\u6389\u5916\u5C42\uFF1BCAIE \u7684\u4F2A\u4EE3\u7801\u91CC\u6CA1\u6709 `ELSEIF` \u8FD9\u6837\u7684\u5408\u5199\u5F62\u5F0F\uFF0C\u7F29\u8FDB\u4E00\u5C42\u6BD4\u4E00\u5C42\u6DF1\u662F\u6B63\u5E38\u7684\u3002\u8FD8\u6709\u4E00\u79CD**\u5D4C\u5957**\u957F\u5F97\u50CF\u4F46\u610F\u601D\u4E0D\u540C\uFF1A\u628A `IF` \u653E\u8FDB `THEN` \u91CC\uFF0C\u90A3\u8868\u793A\u4E24\u4E2A\u6761\u4EF6\u90FD\u8981\u6210\u7ACB\u624D\u505A\u2014\u2014\u548C\u7B2C 3 \u7AE0\u7684 `AND` \u662F\u4E00\u56DE\u4E8B\uFF0C\u80FD\u7528 `AND` \u5199\u6210\u4E00\u884C\u65F6\u901A\u5E38\u66F4\u6E05\u695A\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u5D4C\u5957\u7684\u9009\u62E9\u7ED3\u6784\u6BCF\u4E00\u5C42\u90FD\u8981\u81EA\u5DF1\u7684 `ENDIF`\uFF0C\u6BCF\u4E00\u5C42\u7684\u7ED3\u6784\u4F53\u5404\u7F29\u8FDB\u4E00\u7EA7\uFF08Pseudocode Guide \xA76.1\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u4E09\u6863\u6210\u7EE9",
            fileName: "Example_4_3_a.pseudocode",
            code: [
              "DECLARE Score : INTEGER",
              'OUTPUT "Enter the score"',
              "INPUT Score",
              "IF Score >= 80 THEN",
              '   OUTPUT "A"',
              "ELSE",
              "   IF Score >= 50 THEN",
              '      OUTPUT "Pass"',
              "   ELSE",
              '      OUTPUT "Fail"',
              "   ENDIF",
              "ENDIF"
            ].join("\n"),
            annotations: [
              { fromLine: 4, toLine: 4, text: "\u5148\u8BD5\u6700\u9AD8\u7684\u90A3\u4E00\u6863\u3002\u6210\u7ACB\u5C31\u8D70\u6389\uFF0C\u4E0B\u9762\u6574\u4E2A `ELSE` \u90FD\u4E0D\u770B\u4E86\u3002" },
              { fromLine: 7, toLine: 7, text: "\u80FD\u8D70\u5230\u8FD9\u91CC\uFF0C\u8BF4\u660E `Score >= 80` \u5DF2\u7ECF\u662F `FALSE` \u4E86\u2014\u2014\u6240\u4EE5\u8FD9\u91CC\u53EA\u9700\u8981\u518D\u95EE\u300C\u591F\u4E0D\u591F 50\u300D\uFF0C\u4E0D\u5FC5\u5199\u6210 `Score >= 50 AND Score < 80`\u3002" },
              { fromLine: 11, toLine: 12, text: "\u4E24\u4E2A `ENDIF`\u3002\u91CC\u5C42\u7684\u5173\u6389\u7B2C 7 \u884C\u90A3\u4E2A `IF`\uFF0C\u5916\u5C42\u7684\u5173\u6389\u7B2C 4 \u884C\u90A3\u4E2A\u3002" }
            ],
            sampleRun: { inputs: ["55"], outputs: ["Enter the score", "Pass"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u628A\u4E0A\u9762\u4E24\u4E2A\u6761\u4EF6\u5BF9\u8C03\uFF0C\u5199\u6210\u300C\u5148\u8BD5 `Score >= 50`\uFF0C`ELSE` \u91CC\u518D\u8BD5 `Score >= 80`\u300D\u3002\u8F93\u5165 90 \u4F1A\u663E\u793A\u4EC0\u4E48\uFF1F",
            options: [
              {
                key: "A",
                label: "A",
                correct: false,
                explanation: "`>= 80` \u88AB\u653E\u8FDB\u4E86 `ELSE` \u91CC\uFF0C\u53EA\u6709\u7B2C\u4E00\u4E2A\u6761\u4EF6\u4E0D\u6210\u7ACB\u65F6\u624D\u8F6E\u5F97\u5230\u5B83\u300290 \u8BA9\u7B2C\u4E00\u4E2A\u6761\u4EF6\u6210\u7ACB\u4E86\u3002"
              },
              {
                key: "B",
                label: "A \u548C Pass \u90FD\u663E\u793A",
                correct: false,
                explanation: "\u4E00\u4E32 `IF \u2026 ELSE` \u53EA\u4F1A\u8D70\u4E00\u6761\u8DEF\u3002\u8D70\u4E86 `THEN` \u5C31\u4E0D\u4F1A\u518D\u8D70 `ELSE`\u3002"
              },
              {
                key: "C",
                label: "Fail",
                correct: false,
                explanation: "`Fail` \u5728\u6700\u91CC\u9762\u7684 `ELSE` \u91CC\uFF0C\u8981\u4E24\u4E2A\u6761\u4EF6\u90FD\u4E0D\u6210\u7ACB\u624D\u8D70\u5F97\u5230\u3002"
              },
              {
                key: "D",
                label: "Pass",
                correct: true,
                explanation: "\u5BF9\u3002\u4E32\u63A5\u662F\u6309\u987A\u5E8F\u8BD5\u7684\uFF1A90 \u649E\u4E0A\u7B2C\u4E00\u4E2A `Score >= 50` \u5C31\u6210\u7ACB\u4E86\uFF0C\u663E\u793A `Pass` \u4E4B\u540E\u6574\u4E2A\u7ED3\u6784\u7ED3\u675F\uFF0C`>= 80` \u90A3\u4E00\u6761\u6839\u672C\u6CA1\u673A\u4F1A\u88AB\u8BD5\u5230\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "4.4",
        title: "`CASE OF`\uFF1A\u4E00\u4E2A\u503C\u5BF9\u4E0A\u591A\u79CD\u60C5\u51B5",
        syllabus: ["\xA711.2", "G\xA76"],
        estimatedMinutes: 8,
        taughtFeatures: AFTER_4_4,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u6709\u4E00\u7C7B\u5224\u65AD\u957F\u5F97\u5F88\u7279\u522B\uFF1A\u6240\u6709\u5206\u652F\u90FD\u5728\u95EE\u540C\u4E00\u4E2A\u53D8\u91CF\uFF0C\u53EA\u662F\u62FF\u5B83\u53BB\u6BD4\u4E0D\u540C\u7684\u503C\u3002\u661F\u671F\u7F16\u53F7\u6709\u4E03\u79CD\u53EF\u80FD\uFF0C\u7528\u4E32\u63A5 `IF` \u5199\u4E0B\u6765\u4F1A\u7F29\u8FDB\u4E03\u5C42\uFF0C\u800C\u4E14 `Day =` \u8981\u91CD\u590D\u4E03\u904D\u3002",
              "`CASE OF` \u5C31\u662F\u4E3A\u8FD9\u79CD\u60C5\u51B5\u51C6\u5907\u7684\u3002\u5199\u6CD5\u662F `CASE OF <\u53D8\u91CF>` \u8D77\u5934\uFF0C\u4E2D\u95F4\u6BCF\u4E00\u884C\u5199\u6210 `<\u503C> : <\u8981\u505A\u7684\u4E8B>`\uFF0C\u6700\u540E\u7528 `ENDCASE` \u6536\u5C3E\u2014\u2014\u628A\u300C\u540C\u4E00\u4E2A\u503C\u7684\u591A\u79CD\u53EF\u80FD\u300D\u6446\u6210\u4E00\u5F20\u8868\u3002",
              "\u7A0B\u5E8F\u4ECE\u4E0A\u5F80\u4E0B\u627E\u7B2C\u4E00\u6761\u5BF9\u5F97\u4E0A\u7684\u6807\u7B7E\uFF0C\u6267\u884C\u5B83\u540E\u9762\u7684\u8BED\u53E5\uFF0C\u7136\u540E**\u6574\u4E2A `CASE` \u5C31\u7ED3\u675F\u4E86**\uFF0C\u4E0D\u4F1A\u7EE7\u7EED\u5F80\u4E0B\u8BD5\u522B\u7684\u6807\u7B7E\u3002",
              "\u5982\u679C\u4E00\u6761\u90FD\u5BF9\u4E0D\u4E0A\uFF0C\u800C\u4E14\u6CA1\u6709\u5199\u4E0B\u4E00\u8282\u8981\u8BB2\u7684 `OTHERWISE`\uFF0C\u90A3\u4E48\u8FD9\u4E2A `CASE` \u4EC0\u4E48\u4E5F\u4E0D\u505A\uFF0C\u7A0B\u5E8F\u4ECE `ENDCASE` \u540E\u9762\u7EE7\u7EED\u3002\u8FD9\u4E0D\u662F\u9519\u8BEF\uFF0C\u4F46\u591A\u534A\u4E0D\u662F\u4F60\u60F3\u8981\u7684\u7ED3\u679C\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "`CASE OF <identifier>` \u5F00\u59CB\uFF0C`ENDCASE` \u7ED3\u675F\uFF1B\u6BCF\u4E2A\u5206\u652F\u5199\u6210 `<\u6807\u7B7E> : <\u8BED\u53E5>`\uFF0C\u6807\u7B7E\u7528\u5B57\u9762\u91CF\uFF08Pseudocode Guide \xA76.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u628A\u6570\u5B57\u53D8\u6210\u661F\u671F\u540D",
            fileName: "Example_4_4_a.pseudocode",
            code: [
              "DECLARE Day : INTEGER",
              'OUTPUT "Enter the day number"',
              "INPUT Day",
              "CASE OF Day",
              '   1 : OUTPUT "Monday"',
              '   2 : OUTPUT "Tuesday"',
              '   3 : OUTPUT "Wednesday"',
              "ENDCASE",
              'OUTPUT "Checked"'
            ].join("\n"),
            annotations: [
              { fromLine: 4, toLine: 4, text: "`CASE OF` \u540E\u9762\u5199\u8981\u62FF\u53BB\u6BD4\u7684\u90A3\u4E2A\u53D8\u91CF\uFF0C\u53EA\u5199\u4E00\u6B21\u3002" },
              { fromLine: 5, toLine: 7, text: "\u6BCF\u4E00\u884C\u662F\u4E00\u4E2A\u5206\u652F\uFF0C\u5192\u53F7\u5DE6\u8FB9\u662F\u6807\u7B7E\uFF0C\u53F3\u8FB9\u662F\u5BF9\u4E0A\u4E4B\u540E\u8981\u505A\u7684\u4E8B\u3002" },
              { fromLine: 9, toLine: 9, text: "\u4E0D\u7BA1\u6709\u6CA1\u6709\u5BF9\u4E0A\uFF0C\u8FD9\u4E00\u884C\u90FD\u4F1A\u6267\u884C\u3002" }
            ],
            sampleRun: { inputs: ["3"], outputs: ["Enter the day number", "Wednesday", "Checked"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u7ED9\u4E0A\u9762\u90A3\u6BB5\u8F93\u5165 9\uFF08\u8FD9\u4E2A `CASE` \u91CC\u6CA1\u6709 9 \u8FD9\u4E2A\u6807\u7B7E\uFF09\u4F1A\u600E\u6837\uFF1F",
            options: [
              {
                key: "A",
                label: "\u4E09\u6761\u5206\u652F\u90FD\u6267\u884C",
                correct: false,
                explanation: "\u6B63\u76F8\u53CD\uFF1A`CASE` \u6700\u591A\u53EA\u6267\u884C\u5BF9\u4E0A\u7684\u90A3\u4E00\u6761\uFF0C\u6267\u884C\u5B8C\u5C31\u7ED3\u675F\u3002"
              },
              {
                key: "B",
                label: "\u53EA\u663E\u793A Checked",
                correct: true,
                explanation: "\u5BF9\u3002\u4E00\u6761\u6807\u7B7E\u90FD\u6CA1\u5BF9\u4E0A\uFF0C\u8FD9\u4E2A `CASE` \u4EC0\u4E48\u4E5F\u4E0D\u505A\uFF0C\u7A0B\u5E8F\u4ECE `ENDCASE` \u540E\u9762\u63A5\u7740\u8D70\u3002"
              },
              {
                key: "C",
                label: "\u7A0B\u5E8F\u505C\u4E0B\u6765\u62A5\u9519",
                correct: false,
                explanation: "\u6CA1\u6709\u5339\u914D\u4E0D\u662F\u9519\u8BEF\u3002\u8981\u8BA9\u300C\u5176\u5B83\u60C5\u51B5\u300D\u4E5F\u6709\u7740\u843D\uFF0C\u5F97\u81EA\u5DF1\u5199 `OTHERWISE`\u3002"
              },
              {
                key: "D",
                label: "\u663E\u793A Monday",
                correct: false,
                explanation: "\u6CA1\u6709\u300C\u5BF9\u4E0D\u4E0A\u5C31\u7528\u7B2C\u4E00\u6761\u300D\u8FD9\u79CD\u89C4\u5219\u3002\u6807\u7B7E\u5FC5\u987B\u771F\u7684\u5BF9\u4E0A\u624D\u4F1A\u6267\u884C\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "4.5",
        title: "\u8303\u56F4\u6807\u7B7E\u4E0E `OTHERWISE`",
        syllabus: ["\xA711.2", "G\xA76"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_4_5,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u6807\u7B7E\u4E0D\u4E00\u5B9A\u662F\u4E00\u4E2A\u5B64\u96F6\u96F6\u7684\u503C\uFF0C\u4E5F\u53EF\u4EE5\u662F\u4E00\u4E2A**\u8303\u56F4**\uFF0C\u7528 `TO` \u8FDE\u8D77\u6765\uFF1A`80 TO 100 :`\u3002\u843D\u5728\u8FD9\u4E2A\u533A\u95F4\u91CC\u7684\u503C\u90FD\u7B97\u5BF9\u4E0A\u3002\u6210\u7EE9\u5206\u6863\u8FD9\u79CD\u4E8B\uFF0C\u7528\u8303\u56F4\u6807\u7B7E\u5199\u51FA\u6765\u6BD4\u4E32\u63A5 `IF` \u77ED\u5F97\u591A\u3002",
              "`OTHERWISE` \u662F\u515C\u5E95\u7684\u90A3\u4E00\u6761\uFF1A\u524D\u9762\u6240\u6709\u6807\u7B7E\u90FD\u6CA1\u5BF9\u4E0A\u65F6\u8D70\u5B83\u3002\u52A0\u4E0A\u5B83\u4E4B\u540E\uFF0C`CASE` \u5C31\u4E0D\u4F1A\u51FA\u73B0\u300C\u4EC0\u4E48\u4E5F\u6CA1\u505A\u300D\u7684\u60C5\u51B5\u4E86\u3002",
              "`OTHERWISE` **\u5FC5\u987B\u653E\u5728\u6700\u540E**\u3002\u8FD9\u662F\u89C4\u5B9A\uFF0C\u4E5F\u8BB2\u5F97\u901A\uFF1A\u5B83\u7684\u610F\u601D\u662F\u300C\u9664\u6B64\u4E4B\u5916\u300D\uFF0C\u800C\u300C\u9664\u6B64\u4E4B\u5916\u300D\u53EA\u6709\u5728\u522B\u7684\u90FD\u5217\u5B8C\u4E4B\u540E\u624D\u6210\u7ACB\u3002\u653E\u9519\u4F4D\u7F6E\u7F16\u8F91\u5668\u4F1A\u76F4\u63A5\u62E6\u4E0B\u6765\u3002",
              "\u8303\u56F4\u6807\u7B7E\u540C\u6837\u662F\u4ECE\u4E0A\u5F80\u4E0B\u8BD5\u7B2C\u4E00\u4E2A\u5BF9\u4E0A\u7684\uFF0C\u6240\u4EE5\u533A\u95F4\u4E0D\u8981\u4E92\u76F8\u91CD\u53E0\u2014\u2014\u91CD\u53E0\u65F6\u540E\u9762\u90A3\u6761\u6C38\u8FDC\u8F6E\u4E0D\u5230\uFF0C\u8FD9\u548C\u4E0A\u4E00\u8282\u4E32\u63A5 `IF` \u7684\u987A\u5E8F\u95EE\u9898\u662F\u540C\u4E00\u56DE\u4E8B\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u6807\u7B7E\u53EF\u4EE5\u5199\u6210 `<\u4E0B\u9650> TO <\u4E0A\u9650>` \u7684\u8303\u56F4\uFF1B`OTHERWISE` \u5206\u652F\u5982\u679C\u5B58\u5728\uFF0C\u5FC5\u987B\u662F\u6700\u540E\u4E00\u4E2A\uFF08Pseudocode Guide \xA76.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u7528\u8303\u56F4\u5206\u6863",
            fileName: "Example_4_5_a.pseudocode",
            code: [
              "DECLARE Score : INTEGER",
              'OUTPUT "Enter the score"',
              "INPUT Score",
              "CASE OF Score",
              '   80 TO 100 : OUTPUT "A"',
              '   50 TO 79 : OUTPUT "Pass"',
              '   OTHERWISE : OUTPUT "Fail"',
              "ENDCASE"
            ].join("\n"),
            annotations: [
              { fromLine: 5, toLine: 6, text: "\u4E24\u4E2A\u533A\u95F4\u63A5\u5728\u4E00\u8D77\u4F46\u4E0D\u91CD\u53E0\u2014\u201479 \u5F52\u7B2C\u4E8C\u6761\uFF0C80 \u5F52\u7B2C\u4E00\u6761\u3002" },
              { fromLine: 7, toLine: 7, text: "`OTHERWISE` \u6536\u4E0B\u5269\u4E0B\u7684\u5168\u90E8\uFF0C\u5305\u62EC 0 \u5230 49\uFF0C\u4E5F\u5305\u62EC 101 \u8FD9\u79CD\u4E0D\u8BE5\u51FA\u73B0\u7684\u503C\u3002" }
            ],
            sampleRun: { inputs: ["73"], outputs: ["Enter the score", "Pass"] }
          },
          {
            kind: "counterExample",
            title: "`OTHERWISE` \u653E\u5728\u4E86\u4E2D\u95F4",
            cases: [
              {
                code: [
                  "DECLARE Score : INTEGER",
                  "Score \u2190 90",
                  "CASE OF Score",
                  '   OTHERWISE : OUTPUT "Fail"',
                  '   80 TO 100 : OUTPUT "A"',
                  "ENDCASE"
                ].join("\n"),
                note: "\u7F16\u8F91\u5668\u5728\u7B2C 5 \u884C\u62E6\u4E0B\u6765\uFF1A`OTHERWISE` \u540E\u9762\u53C8\u8DDF\u4E86\u4E00\u4E2A\u5206\u652F\u3002\u8FD9\u4E00\u6761\u4E0D\u7528\u7B49\u8FD0\u884C\u2014\u2014\u5149\u770B\u7ED3\u6784\u5C31\u77E5\u9053\u90A3\u4E00\u6761\u6C38\u8FDC\u6CA1\u673A\u4F1A\u88AB\u8BD5\u5230\u3002",
                expectDiagnostics: [
                  {
                    severity: "error",
                    ruleId: "CASE-002",
                    line: 5,
                    text: "`OTHERWISE` \u5FC5\u987B\u662F\u6700\u540E\u4E00\u4E2A\u5206\u652F\u3002"
                  }
                ]
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u628A\u793A\u4F8B\u91CC `50 TO 79` \u90A3\u6761\u632A\u5230 `80 TO 100` \u524D\u9762\uFF0C\u8F93\u5165 90 \u4F1A\u663E\u793A\u4EC0\u4E48\uFF1F",
            options: [
              {
                key: "A",
                label: "\u7F16\u8F91\u5668\u4F1A\u62E6\u4E0B\u6765",
                correct: false,
                explanation: "\u5206\u652F\u7684\u5148\u540E\u987A\u5E8F\u6CA1\u6709\u89C4\u5B9A\uFF0C\u53EA\u6709 `OTHERWISE` \u7684\u4F4D\u7F6E\u6709\u89C4\u5B9A\u3002"
              },
              {
                key: "B",
                label: "A",
                correct: true,
                explanation: "\u5BF9\u300290 \u4E0D\u843D\u5728 `50 TO 79` \u91CC\uFF0C\u6240\u4EE5\u7B2C\u4E00\u6761\u4E0D\u6210\u7ACB\uFF0C\u7EE7\u7EED\u5F80\u4E0B\u8BD5\uFF0C\u5BF9\u4E0A\u4E86 `80 TO 100`\u3002\u8FD9\u4E00\u6B21\u8C03\u6362\u987A\u5E8F\u6CA1\u51FA\u95EE\u9898\uFF0C\u662F\u56E0\u4E3A\u4E24\u4E2A\u533A\u95F4\u4E0D\u91CD\u53E0\u2014\u2014\u91CD\u53E0\u65F6\u624D\u4F1A\u51FA\u73B0\u300C\u540E\u9762\u90A3\u6761\u6C38\u8FDC\u8F6E\u4E0D\u5230\u300D\u3002"
              },
              {
                key: "C",
                label: "Pass",
                correct: false,
                explanation: "90 \u4E0D\u5728 50 \u5230 79 \u91CC\u3002\u8303\u56F4\u6807\u7B7E\u8981\u771F\u7684\u843D\u5728\u533A\u95F4\u5185\u624D\u7B97\u5BF9\u4E0A\uFF0C\u987A\u5E8F\u5F71\u54CD\u7684\u662F\u300C\u8C01\u5148\u88AB\u8BD5\u300D\uFF0C\u4E0D\u662F\u300C\u8C01\u80FD\u88AB\u5BF9\u4E0A\u300D\u3002"
              },
              {
                key: "D",
                label: "Fail",
                correct: false,
                explanation: "`OTHERWISE` \u53EA\u5728\u6240\u6709\u6807\u7B7E\u90FD\u6CA1\u5BF9\u4E0A\u65F6\u624D\u8D70\u300290 \u4F1A\u5148\u5BF9\u4E0A\u67D0\u4E00\u6761\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "4.5.1",
            title: "\u661F\u671F\u51E0",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u63D0\u793A\u5E76\u8BFB\u5165\u4E00\u4E2A\u6574\u6570\uFF0C1 \u5230 7 \u5206\u522B\u663E\u793A `Monday` \u5230 `Sunday`\uFF0C\u5176\u5B83\u4EFB\u4F55\u503C\u663E\u793A `Unknown`\u3002",
            ioSpec: {
              input: ["\u4E00\u884C\uFF0C\u4E00\u4E2A `INTEGER`\u3002\u63D0\u793A\u8BED\u6392\u5728\u8BFB\u53D6\u4E4B\u524D\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter the day number`"].join("\n"),
              output: "\u4E00\u884C\uFF0C\u661F\u671F\u540D\u6216\u8005 `Unknown`\u3002"
            },
            constraints: {
              require: [
                {
                  feature: "select.case",
                  reason: "\u4E03\u79CD\u53EF\u80FD\u90FD\u662F\u62FF\u540C\u4E00\u4E2A\u53D8\u91CF\u6BD4\u4E0D\u540C\u7684\u503C\uFF0C\u8FD9\u6B63\u662F `CASE` \u6446\u4E00\u5F20\u8868\u7684\u573A\u5408\u3002"
                },
                {
                  feature: "select.case-otherwise",
                  reason: "\u300C\u5176\u5B83\u4EFB\u4F55\u503C\u300D\u4E0D\u53EF\u80FD\u4E00\u4E2A\u4E2A\u5217\u51FA\u6765\uFF0C\u8981\u4EA4\u7ED9\u515C\u5E95\u7684\u90A3\u4E00\u6761\u3002"
                }
              ],
              forbid: [
                {
                  feature: "select.if",
                  reason: "\u7528\u4E32\u63A5 `IF` \u4E5F\u80FD\u505A\u5BF9\uFF0C\u4F46\u8FD9\u4E00\u9898\u5C31\u662F\u8981\u7EC3 `CASE`\u2014\u2014\u4E03\u79CD\u53EF\u80FD\u7528 `IF` \u4F1A\u5199\u6210\u4E03\u5C42\u3002"
                }
              ]
            },
            hints: [
              "\u4E03\u4E2A\u5206\u652F\u52A0\u4E00\u6761\u515C\u5E95\uFF0C\u4E00\u5171\u516B\u884C\u3002",
              "\u300C\u5176\u5B83\u4EFB\u4F55\u503C\u300D\u5305\u62EC 0\u30018\u3001-3 \u8FD9\u4E9B\uFF0C\u4E0D\u7528\u4E00\u4E2A\u4E2A\u5217\u3002"
            ],
            examples: [{ inputs: ["5"], outputs: ["Enter the day number", "Friday"] }],
            referenceSolution: [
              "DECLARE Day : INTEGER",
              'OUTPUT "Enter the day number"',
              "INPUT Day",
              "CASE OF Day",
              '   1 : OUTPUT "Monday"',
              '   2 : OUTPUT "Tuesday"',
              '   3 : OUTPUT "Wednesday"',
              '   4 : OUTPUT "Thursday"',
              '   5 : OUTPUT "Friday"',
              '   6 : OUTPUT "Saturday"',
              '   7 : OUTPUT "Sunday"',
              '   OTHERWISE : OUTPUT "Unknown"',
              "ENDCASE"
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["3"], caseHint: "\u4E00\u4E2A\u843D\u5728\u5468\u4E2D\u7684\u65E5\u5B50\u3002" },
              { id: "t2", kind: "normal", inputs: ["6"], caseHint: "\u4E00\u4E2A\u843D\u5728\u5468\u672B\u7684\u65E5\u5B50\u3002" },
              { id: "t3", kind: "boundary", inputs: ["1"], caseHint: "\u7F16\u53F7\u91CC\u6700\u5C0F\u7684\u90A3\u4E00\u4E2A\u3002" },
              { id: "t4", kind: "boundary", inputs: ["7"], caseHint: "\u7F16\u53F7\u91CC\u6700\u5927\u7684\u90A3\u4E00\u4E2A\u3002" },
              { id: "t5", kind: "abnormal", inputs: ["0"], caseHint: "\u521A\u597D\u6BD4\u6700\u5C0F\u7684\u8FD8\u5C0F\u4E00\u70B9\uFF0C\u5C5E\u4E8E\u6CA1\u6709\u5B9A\u4E49\u7684\u7F16\u53F7\u3002" },
              { id: "t6", kind: "extreme", inputs: ["999"], caseHint: "\u4E00\u4E2A\u8FDC\u8FDC\u8D85\u51FA\u8303\u56F4\u7684\u7F16\u53F7\u3002" }
            ]
          }
        ]
      },
      {
        id: "4.6",
        title: "`IF` \u8FD8\u662F `CASE`",
        syllabus: ["\xA711.2", "G\xA76"],
        estimatedMinutes: 7,
        taughtFeatures: AFTER_4_5,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E24\u79CD\u7ED3\u6784\u5E38\u5E38\u90FD\u5199\u5F97\u51FA\u6765\uFF0C\u4F46\u5404\u6709\u5404\u987A\u624B\u7684\u573A\u5408\u3002\u5224\u636E\u53EA\u6709\u4E00\u6761\uFF1A**\u770B\u8FD9\u4E9B\u5206\u652F\u662F\u4E0D\u662F\u90FD\u5728\u62FF\u540C\u4E00\u4E2A\u4E1C\u897F\u6BD4\u4E0D\u540C\u7684\u503C\u3002**",
              "\u662F\u7684\u8BDD\u7528 `CASE`\uFF1A\u661F\u671F\u7F16\u53F7\u3001\u83DC\u5355\u9009\u9879\u3001\u6210\u7EE9\u533A\u95F4\u2014\u2014\u4E00\u4E2A\u53D8\u91CF\uFF0C\u591A\u79CD\u53D6\u503C\uFF0C\u4E00\u5F20\u8868\u6446\u5F97\u6E05\u6E05\u695A\u695A\u3002",
              "\u4E0D\u662F\u7684\u8BDD\u7528 `IF`\uFF1A\u6761\u4EF6\u91CC\u7528\u5230\u4E86\u4E24\u4E2A\u4E0D\u540C\u7684\u53D8\u91CF\u3001\u6761\u4EF6\u662F\u51E0\u4E2A\u5224\u65AD\u7528 `AND` / `OR` / `NOT` \u62FC\u8D77\u6765\u7684\u3001\u6216\u8005\u6BCF\u4E2A\u5206\u652F\u6BD4\u7684\u6839\u672C\u4E0D\u662F\u540C\u4E00\u4E2A\u4E1C\u897F\u3002\u8FD9\u4E9B `CASE` \u90FD\u5199\u4E0D\u4E86\u2014\u2014\u5B83\u7684\u6807\u7B7E\u53EA\u80FD\u662F\u503C\u6216\u533A\u95F4\uFF0C\u653E\u4E0D\u8FDB\u4E00\u4E2A\u5B8C\u6574\u7684\u6761\u4EF6\u3002",
              "\u4E24\u79CD\u90FD\u5199\u5F97\u51FA\u6765\u65F6\uFF0C\u9009\u8BFB\u8D77\u6765\u66F4\u6E05\u695A\u7684\u90A3\u4E2A\u3002\u4E09\u6863\u4EE5\u4E0A\u53C8\u90FD\u5728\u6BD4\u540C\u4E00\u4E2A\u53D8\u91CF\uFF0C`CASE` \u4E00\u822C\u4F1A\u77ED\u5F88\u591A\uFF1B\u53EA\u6709\u4E24\u6761\u8DEF\uFF0C`IF \u2026 ELSE` \u66F4\u76F4\u63A5\u3002"
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0B\u9762\u54EA\u79CD\u60C5\u51B5**\u53EA\u80FD**\u7528 `IF`\uFF0C\u4E0D\u80FD\u7528 `CASE`\uFF1F",
            options: [
              {
                key: "A",
                label: "\u6309 1 \u5230 12 \u7684\u6708\u4EFD\u7F16\u53F7\u663E\u793A\u6708\u4EFD\u540D",
                correct: false,
                explanation: "\u540C\u4E00\u4E2A\u53D8\u91CF\u6BD4\u5341\u4E8C\u4E2A\u4E0D\u540C\u7684\u503C\uFF0C`CASE` \u6B63\u5408\u9002\uFF0C\u6BD4\u5341\u4E8C\u5C42 `IF` \u6E05\u695A\u5F97\u591A\u3002"
              },
              {
                key: "B",
                label: "\u6309 0 \u5230 100 \u7684\u5206\u6570\u5206\u6210\u56DB\u6863",
                correct: false,
                explanation: "\u540C\u4E00\u4E2A\u53D8\u91CF\u6BD4\u56DB\u4E2A\u533A\u95F4\uFF0C\u7528\u8303\u56F4\u6807\u7B7E\u7684 `CASE` \u5199\u5F97\u4E0B\u3002"
              },
              {
                key: "C",
                label: "\u6309\u4E09\u4E2A\u5B57\u6BCD\u5206\u522B\u663E\u793A\u4E0D\u540C\u7684\u8BDD",
                correct: false,
                explanation: "\u540C\u4E00\u4E2A\u53D8\u91CF\u6BD4\u4E09\u4E2A\u5B57\u7B26\u5B57\u9762\u91CF\uFF0C`CASE` \u5199\u5F97\u4E0B\u2014\u2014\u6807\u7B7E\u5199\u6210 `'A' :` \u5C31\u884C\u3002"
              },
              {
                key: "D",
                label: "\u5E74\u9F84\u591F 18 \u5C81\u5E76\u4E14\u4E70\u4E86\u7968\u624D\u653E\u884C",
                correct: true,
                explanation: "\u5BF9\u3002\u8FD9\u4E2A\u6761\u4EF6\u7528\u5230\u4E86\u4E24\u4E2A\u4E0D\u540C\u7684\u4E1C\u897F\uFF0C\u8FD8\u5F97\u7528 `AND` \u62FC\u8D77\u6765\u3002`CASE` \u7684\u6807\u7B7E\u53EA\u80FD\u662F\u503C\u6216\u533A\u95F4\uFF0C\u88C5\u4E0D\u4E0B\u4E00\u4E2A\u5B8C\u6574\u7684\u6761\u4EF6\u3002"
              }
            ]
          }
        ]
      }
    ],
    chapterTasks: [
      {
        kind: "chapterTask",
        id: "4.T1",
        title: "\u7535\u5F71\u7968",
        statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165\u89C2\u4F17\u7684\u5E74\u9F84\u548C\u661F\u671F\u51E0\uFF0C\u7B97\u51FA\u7968\u4EF7\uFF0C\u663E\u793A\u4E09\u884C\u7968\u9762\u4FE1\u606F\u3002\u5E74\u9F84\u5206\u6863\u662F\u4E0D\u6EE1 12 \u5C81 `Child` \u7968\u4EF7 20\u300112 \u5230 59 \u5C81 `Adult` \u7968\u4EF7 45\u300160 \u5C81\u53CA\u4EE5\u4E0A `Senior` \u7968\u4EF7 25\uFF1B\u661F\u671F 1 \u5230 5 \u662F `Weekday`\u30016 \u5230 7 \u662F `Weekend`\u3001\u5176\u5B83\u6570\u5B57\u662F `Unknown`\uFF1B`Weekday` \u7684\u7968\u4EF7\u51CF 5\uFF0C\u5176\u4F59\u4E0D\u51CF\u3002",
        ioSpec: {
          input: [
            "\u4E24\u884C\u3002\u7B2C\u4E00\u884C\u662F\u5E74\u9F84\uFF08`INTEGER`\uFF09\uFF0C\u7B2C\u4E8C\u884C\u662F\u661F\u671F\u7F16\u53F7\uFF08`INTEGER`\uFF0C1 \u8868\u793A\u5468\u4E00\uFF0C7 \u8868\u793A\u5468\u65E5\uFF09\u3002",
            "\u4E24\u53E5\u63D0\u793A\u8BED\u5404\u81EA\u6392\u5728\u5B83\u5BF9\u5E94\u7684\u90A3\u6B21\u8BFB\u53D6\u4E4B\u524D\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
            "`Enter the age`",
            "`Enter the day`"
          ].join("\n"),
          output: [
            "\u8BFB\u5B8C\u4E4B\u540E\u663E\u793A\u4E09\u884C\uFF1A",
            "`Age group: <Child \u6216 Adult \u6216 Senior>`",
            "`Day type: <Weekday \u6216 Weekend \u6216 Unknown>`",
            "`Price: <\u7968\u4EF7>`",
            "\u6BCF\u4E2A\u5192\u53F7\u540E\u9762\u90FD\u662F\u4E00\u4E2A\u7A7A\u683C\u3002"
          ].join("\n")
        },
        suggestedFeatures: [
          "select.if",
          "select.if-else",
          "select.nested-if",
          "select.case",
          "select.case-range",
          "select.case-otherwise",
          "op.relational",
          "io.input",
          "io.output"
        ],
        hints: [
          "\u8FD9\u9053\u9898\u91CC\u6709\u4E24\u4E2A\u5224\u65AD\uFF1A\u4E00\u4E2A\u5728\u6BD4\u5E74\u9F84\u533A\u95F4\uFF0C\u4E00\u4E2A\u5728\u6BD4\u661F\u671F\u7F16\u53F7\u3002\u5B83\u4EEC\u9002\u5408\u7684\u7ED3\u6784\u4E0D\u4E00\u6837\uFF0C4.6 \u7684\u5224\u636E\u80FD\u76F4\u63A5\u7528\u4E0A\u3002",
          "\u7968\u4EF7\u5148\u6309\u5E74\u9F84\u5B9A\u597D\uFF0C\u518D\u770B\u8981\u4E0D\u8981\u51CF 5\u2014\u2014\u4E0D\u8981\u8BD5\u56FE\u5728\u4E00\u4E2A\u7ED3\u6784\u91CC\u540C\u65F6\u5904\u7406\u4E24\u4EF6\u4E8B\u3002",
          "\u661F\u671F\u5206\u7C7B\u7684\u7ED3\u679C\u540E\u9762\u8FD8\u8981\u7528\u6765\u51B3\u5B9A\u51CF\u4E0D\u51CF\u4EF7\uFF0C\u6240\u4EE5\u5B83\u5F97\u5B58\u8FDB\u4E00\u4E2A\u53D8\u91CF\uFF0C\u4E0D\u80FD\u53EA\u662F\u663E\u793A\u51FA\u6765\u3002"
        ],
        examples: [
          {
            inputs: ["8", "3"],
            outputs: ["Enter the age", "Enter the day", "Age group: Child", "Day type: Weekday", "Price: 15"]
          }
        ],
        referenceSolution: [
          "DECLARE Age : INTEGER",
          "DECLARE Day : INTEGER",
          "DECLARE Price : INTEGER",
          "DECLARE AgeGroup : STRING",
          "DECLARE DayType : STRING",
          'OUTPUT "Enter the age"',
          "INPUT Age",
          'OUTPUT "Enter the day"',
          "INPUT Day",
          "IF Age < 12 THEN",
          '   AgeGroup \u2190 "Child"',
          "   Price \u2190 20",
          "ELSE",
          "   IF Age < 60 THEN",
          '      AgeGroup \u2190 "Adult"',
          "      Price \u2190 45",
          "   ELSE",
          '      AgeGroup \u2190 "Senior"',
          "      Price \u2190 25",
          "   ENDIF",
          "ENDIF",
          "CASE OF Day",
          '   1 TO 5 : DayType \u2190 "Weekday"',
          '   6 TO 7 : DayType \u2190 "Weekend"',
          '   OTHERWISE : DayType \u2190 "Unknown"',
          "ENDCASE",
          'IF DayType = "Weekday" THEN',
          "   Price \u2190 Price - 5",
          "ENDIF",
          'OUTPUT "Age group: ", AgeGroup',
          'OUTPUT "Day type: ", DayType',
          'OUTPUT "Price: ", Price'
        ].join("\n"),
        tests: [
          { id: "t1", kind: "normal", inputs: ["30", "2"], caseHint: "\u4E00\u4E2A\u6210\u5E74\u4EBA\u5728\u5468\u4E2D\u770B\u7535\u5F71\u3002" },
          { id: "t2", kind: "normal", inputs: ["8", "6"], caseHint: "\u4E00\u4E2A\u5B69\u5B50\u5728\u5468\u672B\u770B\u7535\u5F71\u3002" },
          { id: "t3", kind: "boundary", inputs: ["12", "5"], caseHint: "\u5E74\u9F84\u6B63\u597D\u8E29\u5728\u5B69\u5B50\u548C\u6210\u4EBA\u7684\u5206\u754C\u4E0A\u3002" },
          { id: "t4", kind: "boundary", inputs: ["60", "7"], caseHint: "\u5E74\u9F84\u6B63\u597D\u8E29\u5728\u6210\u4EBA\u548C\u957F\u8005\u7684\u5206\u754C\u4E0A\uFF0C\u800C\u4E14\u662F\u5468\u672B\u7684\u6700\u540E\u4E00\u5929\u3002" },
          { id: "t5", kind: "boundary", inputs: ["11", "1"], caseHint: "\u5E74\u9F84\u5DEE\u4E00\u70B9\u5C31\u5230\u6210\u4EBA\u6863\uFF0C\u65E5\u5B50\u662F\u5468\u4E2D\u7684\u7B2C\u4E00\u5929\u3002" },
          { id: "t6", kind: "abnormal", inputs: ["25", "9"], caseHint: "\u661F\u671F\u7F16\u53F7\u8D85\u51FA\u4E86\u5B9A\u4E49\u7684\u8303\u56F4\u3002" },
          { id: "t7", kind: "extreme", inputs: ["120", "1"], caseHint: "\u4E00\u4E2A\u975E\u5E38\u5927\u7684\u5E74\u9F84\u3002" }
        ]
      }
    ]
  };

  // packages/teaching-content/src/chapter-05.ts
  var AFTER_CHAPTER_4 = [
    "io.output",
    "io.input",
    "decl.variable",
    "misc.comment",
    "type.string",
    "literal.string",
    "type.integer",
    "type.real",
    "type.char",
    "type.boolean",
    "type.date",
    "literal.integer",
    "literal.real",
    "literal.char",
    "literal.boolean",
    "literal.date",
    "assign.simple",
    "decl.constant",
    "op.arithmetic",
    "op.div",
    "op.mod",
    "op.relational",
    "op.and",
    "op.or",
    "op.not",
    "select.if",
    "select.if-else",
    "select.nested-if",
    "select.case",
    "select.case-range",
    "select.case-otherwise"
  ];
  var AFTER_5_1 = [...AFTER_CHAPTER_4, "loop.for"];
  var AFTER_5_2 = [...AFTER_5_1, "loop.for-step"];
  var AFTER_5_3 = [...AFTER_5_2, "loop.while"];
  var AFTER_5_4 = [...AFTER_5_3, "loop.repeat"];
  var chapter05 = {
    id: 5,
    title: "\u4E09\u79CD\u5FAA\u73AF",
    level: "AS",
    syllabus: ["\xA711.2", "G\xA77"],
    prerequisites: [1, 2, 3, 4],
    sections: [
      {
        id: "5.1",
        title: "`FOR \u2026 TO \u2026 NEXT`\uFF1A\u6B21\u6570\u5DF2\u7ECF\u77E5\u9053",
        syllabus: ["\xA711.2", "G\xA77"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_5_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u8981\u628A\u540C\u4E00\u53E5\u8BDD\u663E\u793A\u4E94\u904D\uFF0C\u7167\u6284\u4E94\u884C `OUTPUT` \u4E5F\u505A\u5F97\u5230\u3002\u4F46\u8981\u663E\u793A\u4E00\u767E\u904D\u5462\uFF1F\u8981\u6539\u5176\u4E2D\u4E00\u4E2A\u5B57\u5462\u2014\u2014\u5F97\u6539\u4E00\u767E\u5904\u3002**\u91CD\u590D\uFF08iteration\uFF09**\u8BA9\u540C\u4E00\u6BB5\u4EE3\u7801\u8DD1\u591A\u6B21\uFF0C\u4EE3\u7801\u53EA\u5199\u4E00\u4EFD\u3002",
              "\u6B21\u6570\u4E8B\u5148\u5C31\u77E5\u9053\u7684\u65F6\u5019\u7528 `FOR`\uFF1A\u5199\u6210 `FOR <\u63A7\u5236\u53D8\u91CF> \u2190 <\u8D77\u70B9> TO <\u7EC8\u70B9>`\uFF0C\u4E2D\u95F4\u662F\u8981\u91CD\u590D\u505A\u7684\u4E8B\uFF0C\u6700\u540E\u7528 `NEXT <\u63A7\u5236\u53D8\u91CF>` \u6536\u5C3E\u3002",
              "`FOR I \u2190 1 TO 5` \u7684\u610F\u601D\u662F\uFF1A`I` \u5148\u53D6 1 \u8DD1\u4E00\u904D\u5FAA\u73AF\u4F53\uFF0C\u56DE\u5230 `NEXT` \u65F6 `I` \u52A0 1 \u53D8\u6210 2\uFF0C\u518D\u8DD1\u4E00\u904D\u2026\u2026\u76F4\u5230 `I` \u8D85\u8FC7 5 \u5C31\u505C\u4E0B\u6765\u3002\u8D77\u70B9\u548C\u7EC8\u70B9\u90FD\u7B97\u5728\u5185\uFF0C\u6240\u4EE5 `FOR I \u2190 2 TO 5` \u8DD1\u7684\u662F 2\u30013\u30014\u30015 \u5171\u56DB\u904D\u2014\u2014**\u7EC8\u70B9\u51CF\u8D77\u70B9\u518D\u52A0\u4E00**\u3002",
              "**\u63A7\u5236\u53D8\u91CF\uFF08control variable\uFF09**\u5FC5\u987B\u662F `INTEGER`\uFF0C\u548C\u522B\u7684\u53D8\u91CF\u4E00\u6837\u8981\u5148 `DECLARE`\u3002`NEXT` \u540E\u9762\u91CD\u590D\u5199\u4E00\u904D\u53D8\u91CF\u540D\uFF0C\u4E0D\u5199\u7F16\u8F91\u5668\u4E0D\u4F1A\u62E6\uFF0C\u4F46\u4F1A\u63D0\u9192\u4F60\u8865\u4E0A\uFF0C\u8FD9\u662F CAIE \u7684\u4E66\u5199\u4E60\u60EF\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8BA1\u6570\u63A7\u5236\u5FAA\u73AF\u5199\u4F5C `FOR <identifier> \u2190 <start> TO <end> \u2026 NEXT <identifier>`\u3002\u63A7\u5236\u53D8\u91CF\u5FC5\u987B\u662F `INTEGER`\uFF0C\u8D77\u70B9\u4E0E\u7EC8\u70B9\u90FD\u5305\u542B\u5728\u5185\uFF08Pseudocode Guide \xA77.1\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u4ECE 1 \u6570\u5230 5",
            fileName: "Example_5_1_a.pseudocode",
            code: [
              "DECLARE I : INTEGER",
              "FOR I \u2190 1 TO 5",
              '   OUTPUT "Line ", I',
              "NEXT I",
              'OUTPUT "Done"'
            ].join("\n"),
            annotations: [
              { fromLine: 2, toLine: 2, text: "\u8FD9\u4E00\u884C\u540C\u65F6\u505A\u4E86\u4E09\u4EF6\u4E8B\u2014\u2014\u5B9A\u8D77\u70B9\u3001\u5B9A\u7EC8\u70B9\u3001\u8BF4\u6E05\u695A\u7528\u54EA\u4E2A\u53D8\u91CF\u8BA1\u6570\u3002" },
              { fromLine: 3, toLine: 3, text: "\u5FAA\u73AF\u4F53\u7F29\u8FDB\u4E09\u683C\u3002\u6BCF\u8DD1\u4E00\u904D `I` \u7684\u503C\u90FD\u4E0D\u4E00\u6837\uFF0C\u6240\u4EE5\u4E94\u884C\u8F93\u51FA\u4E92\u4E0D\u76F8\u540C\u3002" },
              { fromLine: 4, toLine: 4, text: "`NEXT I` \u662F\u4E00\u904D\u7684\u7EC8\u70B9\uFF0C\u7A0B\u5E8F\u8D70\u5230\u8FD9\u91CC\u5C31\u56DE\u53BB\u52A0 1 \u518D\u5224\u65AD\u3002" },
              { fromLine: 5, toLine: 5, text: "\u5FAA\u73AF\u7ED3\u675F\u4E4B\u540E\u624D\u6267\u884C\uFF0C\u53EA\u663E\u793A\u4E00\u6B21\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5", "Done"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`FOR I \u2190 3 TO 7` \u7684\u5FAA\u73AF\u4F53\u4E00\u5171\u6267\u884C\u51E0\u904D\uFF1F",
            options: [
              {
                key: "A",
                label: "5 \u904D",
                correct: true,
                explanation: "\u5BF9\u3002`I` \u4F9D\u6B21\u53D6 3\u30014\u30015\u30016\u30017\uFF0C\u4E24\u7AEF\u90FD\u5305\u542B\uFF0C\u6240\u4EE5\u662F\u300C\u7EC8\u70B9\u51CF\u8D77\u70B9\u518D\u52A0\u4E00\u300D\u3002"
              },
              {
                key: "B",
                label: "4 \u904D",
                correct: false,
                explanation: "\u8D77\u70B9\u548C\u7EC8\u70B9\u90FD\u7B97\u5728\u5185\uFF0C\u522B\u5FD8\u4E86\u52A0\u4E00\uFF1A7 \u51CF 3 \u662F 4\uFF0C\u4F46 3\u30014\u30015\u30016\u30017 \u4E00\u5171\u662F\u4E94\u4E2A\u6570\u3002"
              },
              {
                key: "C",
                label: "7 \u904D",
                correct: false,
                explanation: "7 \u662F\u7EC8\u70B9\uFF0C\u4E0D\u662F\u6B21\u6570\u3002\u8D77\u70B9\u4E0D\u662F 1 \u7684\u65F6\u5019\uFF0C\u6B21\u6570\u548C\u7EC8\u70B9\u4E0D\u662F\u4E00\u56DE\u4E8B\u3002"
              },
              {
                key: "D",
                label: "3 \u904D",
                correct: false,
                explanation: "3 \u662F\u8D77\u70B9\uFF0C\u5B83\u51B3\u5B9A\u4ECE\u54EA\u513F\u5F00\u59CB\u6570\uFF0C\u4E0D\u51B3\u5B9A\u6570\u591A\u5C11\u4E2A\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "5.1.1",
            title: "\u8FDE\u52A0",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u63D0\u793A\u5E76\u8BFB\u5165\u4E00\u4E2A\u6B63\u6574\u6570 `N`\uFF0C\u7B97\u51FA 1 \u52A0\u5230 `N` \u7684\u548C\u5E76\u663E\u793A\u3002",
            ioSpec: {
              input: ["\u4E00\u884C\uFF0C\u4E00\u4E2A `INTEGER`\u3002\u63D0\u793A\u8BED\u6392\u5728\u8BFB\u53D6\u4E4B\u524D\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a number`"].join("\n"),
              output: "\u4E00\u884C\uFF0C\u5199\u6210 `Sum: <\u548C>`\u3002\u5192\u53F7\u540E\u9762\u662F\u4E00\u4E2A\u7A7A\u683C\u3002"
            },
            constraints: {
              require: [
                {
                  feature: "loop.for",
                  reason: "\u8981\u52A0\u591A\u5C11\u4E2A\u6570\uFF0C\u8BFB\u8FDB `N` \u7684\u90A3\u4E00\u523B\u5C31\u5DF2\u7ECF\u77E5\u9053\u4E86\uFF0C\u8FD9\u6B63\u662F\u8BA1\u6570\u63A7\u5236\u5FAA\u73AF\u7684\u573A\u5408\u3002"
                }
              ],
              forbid: [
                {
                  feature: "loop.while",
                  reason: "\u6B21\u6570\u5DF2\u77E5\u65F6\u7528\u5B83\u5C31\u5F97\u81EA\u5DF1\u7BA1\u8BA1\u6570\u5668\u7684\u4E09\u4EF6\u4E8B\uFF0C\u8FD9\u4E00\u9898\u8981\u7EC3\u7684\u662F\u628A\u4E09\u4EF6\u4E8B\u4EA4\u7ED9 `FOR`\u3002"
                }
              ]
            },
            hints: [
              "\u9700\u8981\u4E00\u4E2A\u53D8\u91CF\u4E00\u8DEF\u6512\u7740\u548C\uFF0C\u5FAA\u73AF\u5F00\u59CB\u4E4B\u524D\u8981\u5148\u628A\u5B83\u8BBE\u6210 0\u3002",
              "\u5FAA\u73AF\u4F53\u91CC\u6BCF\u4E00\u904D\u505A\u7684\u4E8B\u90FD\u4E00\u6837\uFF1A\u628A\u5F53\u524D\u7684\u63A7\u5236\u53D8\u91CF\u52A0\u8FDB\u90A3\u4E2A\u53D8\u91CF\u91CC\u3002",
              "\u663E\u793A\u653E\u5728\u5FAA\u73AF\u5916\u9762\uFF0C\u4E0D\u7136\u4F1A\u663E\u793A\u5F88\u591A\u904D\u3002"
            ],
            examples: [{ inputs: ["4"], outputs: ["Enter a number", "Sum: 10"] }],
            referenceSolution: [
              "DECLARE Number : INTEGER",
              "DECLARE I : INTEGER",
              "DECLARE Sum : INTEGER",
              "Sum \u2190 0",
              'OUTPUT "Enter a number"',
              "INPUT Number",
              "FOR I \u2190 1 TO Number",
              "   Sum \u2190 Sum + I",
              "NEXT I",
              'OUTPUT "Sum: ", Sum'
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["5"], caseHint: "\u4E00\u4E2A\u5F88\u5C0F\u7684\u6570\u3002" },
              { id: "t2", kind: "normal", inputs: ["10"], caseHint: "\u4E00\u4E2A\u666E\u901A\u5927\u5C0F\u7684\u6570\u3002" },
              { id: "t3", kind: "boundary", inputs: ["1"], caseHint: "\u5FAA\u73AF\u53EA\u8BE5\u8DD1\u4E00\u904D\u7684\u90A3\u4E2A\u6570\u3002" },
              { id: "t4", kind: "boundary", inputs: ["0"], caseHint: "\u5FAA\u73AF\u4E00\u904D\u90FD\u4E0D\u8BE5\u8DD1\u7684\u90A3\u4E2A\u6570\u3002" },
              { id: "t5", kind: "extreme", inputs: ["1000"], caseHint: "\u4E00\u4E2A\u4F1A\u8DD1\u5F88\u591A\u904D\u7684\u6570\u3002" }
            ]
          }
        ]
      },
      {
        id: "5.2",
        title: "`STEP`\uFF1A\u4E0D\u662F\u6BCF\u6B21\u90FD\u52A0 1",
        syllabus: ["\xA711.2", "G\xA77"],
        estimatedMinutes: 8,
        taughtFeatures: AFTER_5_2,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "`FOR` \u9ED8\u8BA4\u6BCF\u8DD1\u5B8C\u4E00\u904D\u628A\u63A7\u5236\u53D8\u91CF\u52A0 1\u3002\u60F3\u6362\u4E2A\u589E\u91CF\uFF0C\u5728\u540E\u9762\u52A0 `STEP`\uFF1A`FOR I \u2190 0 TO 100 STEP 10` \u8BA9 `I` \u53D6 0\u300110\u300120\u2026\u2026100\uFF0C\u4E00\u5171\u5341\u4E00\u904D\u3002",
              "`STEP` \u4E5F\u53EF\u4EE5\u662F\u8D1F\u6570\uFF0C\u8FD9\u65F6\u5C31\u662F\u5012\u7740\u6570\uFF1A`FOR I \u2190 5 TO 1 STEP -1` \u53D6 5\u30014\u30013\u30012\u30011\u3002\u5012\u7740\u6570\u65F6\u8D77\u70B9\u5FC5\u987B\u6BD4\u7EC8\u70B9\u5927\uFF0C\u800C\u4E14 `STEP` \u5FC5\u987B\u662F\u8D1F\u7684\uFF0C\u4E24\u8005\u8981\u914D\u5957\u3002",
              "\u5982\u679C\u5199\u6210 `FOR I \u2190 10 TO 1` \u800C\u5FD8\u4E86 `STEP -1`\uFF0C\u7A0B\u5E8F\u4E0D\u4F1A\u62A5\u9519\uFF0C\u4F46\u5FAA\u73AF\u4F53**\u4E00\u904D\u90FD\u4E0D\u4F1A\u6267\u884C**\u2014\u2014`I` \u4E00\u5F00\u59CB\u5C31\u662F 10\uFF0C\u5DF2\u7ECF\u8D85\u8FC7\u7EC8\u70B9 1 \u4E86\u3002\u8FD9\u79CD\u5FAA\u73AF\u7684\u7279\u70B9\u662F\u5B89\u9759\u5730\u4EC0\u4E48\u90FD\u6CA1\u505A\u3002`STEP 0` \u5219\u4F1A\u88AB\u7F16\u8F91\u5668\u76F4\u63A5\u62E6\u4E0B\u6765\uFF1A\u589E\u91CF\u662F 0 \u610F\u5473\u7740\u63A7\u5236\u53D8\u91CF\u6C38\u8FDC\u4E0D\u53D8\u3002",
              "\u8FD8\u6709\u4E00\u6761\uFF1A**\u5FAA\u73AF\u4F53\u91CC\u4E0D\u8981\u53BB\u6539\u63A7\u5236\u53D8\u91CF**\u3002`I` \u5F52 `FOR` \u7BA1\uFF0C\u5B83\u6BCF\u4E00\u904D\u52A0\u591A\u5C11\u3001\u4EC0\u4E48\u65F6\u5019\u505C\uFF0C\u90FD\u7531\u7B2C\u4E00\u884C\u90A3\u4E09\u4E2A\u6570\u51B3\u5B9A\u3002\u60F3\u8DF3\u7740\u8D70\u5C31\u7528 `STEP`\uFF0C\u522B\u81EA\u5DF1\u52A0\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "`STEP <increment>` \u6307\u5B9A\u6BCF\u904D\u7684\u589E\u91CF\uFF0C\u53EF\u6B63\u53EF\u8D1F\uFF0C\u9ED8\u8BA4\u4E3A 1\uFF08Pseudocode Guide \xA77.1\uFF09\u3002"
              },
              {
                source: "editor",
                text: "`STEP 0` \u5728\u8FD0\u884C\u524D\u5C31\u4F1A\u88AB\u62E6\u4E0B\uFF1B\u5728\u5FAA\u73AF\u4F53\u5185\u4FEE\u6539\u63A7\u5236\u53D8\u91CF\u7684\u7A0B\u5E8F\u80FD\u901A\u8FC7\u68C0\u67E5\uFF0C\u4F46\u4F1A\u5728\u90A3\u4E00\u884C\u505C\u6B62\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u5012\u6570",
            fileName: "Example_5_2_a.pseudocode",
            code: [
              "DECLARE I : INTEGER",
              "FOR I \u2190 5 TO 1 STEP -1",
              "   OUTPUT I",
              "NEXT I",
              'OUTPUT "Go"'
            ].join("\n"),
            annotations: [
              { fromLine: 2, toLine: 2, text: "\u8D77\u70B9 5 \u6BD4\u7EC8\u70B9 1 \u5927\uFF0C\u914D `STEP -1` \u624D\u8D70\u5F97\u8D77\u6765\u3002" },
              { fromLine: 3, toLine: 3, text: "\u6BCF\u904D\u663E\u793A\u5F53\u524D\u7684 `I`\uFF0C\u6240\u4EE5\u662F 5\u30014\u30013\u30012\u30011\u3002" }
            ],
            sampleRun: { inputs: [], outputs: ["5", "4", "3", "2", "1", "Go"] }
          },
          {
            kind: "counterExample",
            title: "\u5728\u5FAA\u73AF\u4F53\u91CC\u6539\u63A7\u5236\u53D8\u91CF",
            cases: [
              {
                code: [
                  "DECLARE I : INTEGER",
                  "FOR I \u2190 1 TO 3",
                  "   OUTPUT I",
                  "   I \u2190 I + 1",
                  "NEXT I"
                ].join("\n"),
                note: "\u8FD9\u6BB5\u4EE3\u7801\u7C7B\u578B\u5168\u5BF9\u3001\u7ED3\u6784\u5B8C\u6574\uFF0C\u7F16\u8F91\u5668\u4E00\u6761\u63D0\u793A\u90FD\u6CA1\u6709\u3002\u4F46\u5B83\u8DD1\u5230\u7B2C 4 \u884C\u5C31\u4F1A\u505C\uFF1A\u63A7\u5236\u53D8\u91CF\u5F52 `FOR` \u7BA1\uFF0C\u7A0B\u5E8F\u4E0D\u5141\u8BB8\u5728\u5FAA\u73AF\u4F53\u91CC\u52A8\u5B83\u3002**\u80FD\u901A\u8FC7\u68C0\u67E5\u4E0D\u7B49\u4E8E\u80FD\u8DD1\u5B8C\u3002**",
                expectRuntimeError: {
                  code: "RT1503",
                  line: 4,
                  text: "\u63A7\u5236\u53D8\u91CF\u7531 `FOR` \u90A3\u4E00\u884C\u51B3\u5B9A\u600E\u4E48\u53D8\uFF0C\u5FAA\u73AF\u4F53\u91CC\u4E0D\u80FD\u518D\u6539\u5B83\u3002"
                }
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`FOR I \u2190 10 TO 1`\uFF08\u6CA1\u5199 `STEP`\uFF09\u7684\u5FAA\u73AF\u4F53\u4F1A\u6267\u884C\u51E0\u904D\uFF1F",
            options: [
              {
                key: "A",
                label: "10 \u904D",
                correct: false,
                explanation: "10 \u662F\u8D77\u70B9\u4E0D\u662F\u6B21\u6570\uFF0C\u800C\u4E14\u8FD9\u4E2A\u5FAA\u73AF\u7684\u65B9\u5411\u672C\u8EAB\u5C31\u4E0D\u5BF9\u3002"
              },
              {
                key: "B",
                label: "1 \u904D",
                correct: false,
                explanation: "\u6CA1\u6709\u300C\u81F3\u5C11\u8DD1\u4E00\u904D\u300D\u8FD9\u56DE\u4E8B\u3002`FOR` \u5728\u6BCF\u4E00\u904D\u5F00\u59CB\u524D\u90FD\u5148\u68C0\u67E5\uFF0C\u7B2C\u4E00\u6B21\u68C0\u67E5\u5C31\u6CA1\u901A\u8FC7\u3002"
              },
              {
                key: "C",
                label: "\u7F16\u8F91\u5668\u4F1A\u62E6\u4E0B\u6765",
                correct: false,
                explanation: "\u8FD9\u6BB5\u4EE3\u7801\u5408\u6CD5\uFF0C\u53EA\u662F\u4EC0\u4E48\u4E5F\u6CA1\u505A\u3002\u88AB\u62E6\u7684\u662F `STEP 0`\uFF0C\u4E0D\u662F\u65B9\u5411\u5199\u53CD\u3002"
              },
              {
                key: "D",
                label: "0 \u904D",
                correct: true,
                explanation: "\u5BF9\u3002\u9ED8\u8BA4\u589E\u91CF\u662F 1\uFF0C`I` \u4E00\u5F00\u59CB\u5C31\u662F 10\uFF0C\u5DF2\u7ECF\u8D85\u8FC7\u7EC8\u70B9 1\uFF0C\u5FAA\u73AF\u4F53\u4E00\u904D\u90FD\u4E0D\u6267\u884C\u3002\u8981\u5012\u7740\u6570\u5F97\u5199 `STEP -1`\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "5.3",
        title: "`WHILE \u2026 ENDWHILE`\uFF1A\u5148\u770B\u6761\u4EF6",
        syllabus: ["\xA711.2", "G\xA77"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_5_3,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "`FOR` \u7684\u524D\u63D0\u662F\u6B21\u6570\u4E8B\u5148\u77E5\u9053\u3002\u53EF\u6709\u4E9B\u4E8B\u6CA1\u6CD5\u4E8B\u5148\u77E5\u9053\u8981\u505A\u591A\u5C11\u904D\uFF1A\u4E00\u76F4\u8BFB\u6570\u5B57\u76F4\u5230\u8BFB\u5230\u67D0\u4E2A\u503C\u3001\u4E00\u76F4\u95EE\u76F4\u5230\u7B54\u5BF9\u3002\u8FD9\u65F6\u5019\u7528 `WHILE`\uFF1A\u5199 `WHILE <\u6761\u4EF6>`\uFF0C\u4E2D\u95F4\u662F\u5FAA\u73AF\u4F53\uFF0C\u6700\u540E\u7528 `ENDWHILE` \u6536\u5C3E\u3002",
              "**\u6BCF\u4E00\u904D\u5F00\u59CB\u4E4B\u524D\u5148\u770B\u6761\u4EF6**\uFF1A\u6210\u7ACB\u5C31\u8FDB\u53BB\u8DD1\u4E00\u904D\uFF0C\u8DD1\u5B8C\u56DE\u5230\u5F00\u5934\u518D\u770B\u4E00\u6B21\uFF1B\u4E0D\u6210\u7ACB\u5C31\u8DF3\u8FC7\u6574\u4E2A\u5FAA\u73AF\uFF0C\u4ECE `ENDWHILE` \u540E\u9762\u7EE7\u7EED\u3002",
              "\u56E0\u4E3A\u6761\u4EF6\u5728\u524D\u9762\uFF0C`WHILE` **\u53EF\u80FD\u4E00\u904D\u90FD\u4E0D\u6267\u884C**\u2014\u2014\u7B2C\u4E00\u6B21\u68C0\u67E5\u5C31\u4E0D\u6210\u7ACB\u7684\u8BDD\uFF0C\u5FAA\u73AF\u4F53\u4E00\u6B21\u90FD\u4E0D\u4F1A\u8DD1\u3002\u8FD9\u4E0D\u662F\u6BDB\u75C5\uFF0C\u6070\u6070\u662F\u5B83\u6709\u7528\u7684\u5730\u65B9\uFF1A\u300C\u4E00\u4E2A\u6570\u90FD\u6CA1\u6709\u300D\u672C\u6765\u5C31\u8BE5\u662F\u5408\u6CD5\u7684\u60C5\u51B5\u3002",
              "\u6761\u4EF6\u91CC\u7528\u5230\u7684\u4E1C\u897F\uFF0C\u5FAA\u73AF\u4F53\u91CC\u5FC5\u987B\u6709\u529E\u6CD5\u8BA9\u5B83\u53D8\uFF0C\u5426\u5219\u6761\u4EF6\u6C38\u8FDC\u6210\u7ACB\uFF0C\u7A0B\u5E8F\u4F1A\u4E00\u76F4\u8DD1\u4E0B\u53BB\u3002\u4E00\u79CD\u5E38\u89C1\u7684\u5199\u6CD5\u662F**\u54E8\u5175\uFF08sentinel\uFF09**\uFF1A\u7EA6\u5B9A\u4E00\u4E2A\u7279\u6B8A\u503C\u8868\u793A\u300C\u5230\u6B64\u4E3A\u6B62\u300D\u3002\u8981\u5728\u8FDB\u5165\u5FAA\u73AF\u524D\u5148\u8BFB\u4E00\u6B21\uFF0C\u5FAA\u73AF\u4F53\u7684\u6700\u540E\u518D\u8BFB\u4E00\u6B21\uFF0C\u8FD9\u6837\u6761\u4EF6\u6BCF\u6B21\u90FD\u662F\u62FF\u6700\u65B0\u8BFB\u5230\u7684\u503C\u53BB\u5224\u65AD\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u524D\u6D4B\u5FAA\u73AF\uFF08pre-condition loop\uFF09\u5199\u4F5C `WHILE <condition> \u2026 ENDWHILE`\u3002CAIE \u7684\u5199\u6CD5\u91CC `WHILE` \u540E\u9762\u4E0D\u5199 `DO`\uFF08Pseudocode Guide \xA77.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u8BFB\u5230 -1 \u4E3A\u6B62",
            fileName: "Example_5_3_a.pseudocode",
            code: [
              "DECLARE Score : INTEGER",
              "DECLARE Count : INTEGER",
              "Count \u2190 0",
              'OUTPUT "Enter a score"',
              "INPUT Score",
              "WHILE Score <> -1",
              "   Count \u2190 Count + 1",
              '   OUTPUT "Enter a score"',
              "   INPUT Score",
              "ENDWHILE",
              'OUTPUT "Count: ", Count'
            ].join("\n"),
            annotations: [
              { fromLine: 4, toLine: 5, text: "\u8FDB\u5FAA\u73AF\u4E4B\u524D\u5148\u8BFB\u4E00\u6B21\u3002\u4E0D\u5148\u8BFB\uFF0C\u4E0B\u4E00\u884C\u7684\u6761\u4EF6\u5C31\u6CA1\u6709\u503C\u53EF\u5224\u65AD\u3002" },
              { fromLine: 6, toLine: 6, text: "\u62FF\u521A\u8BFB\u5230\u7684\u503C\u548C\u54E8\u5175\u6BD4\u3002\u8BFB\u5230 -1 \u5C31\u7ED3\u675F\uFF0C-1 \u672C\u8EAB\u4E0D\u7B97\u6570\u3002" },
              { fromLine: 8, toLine: 9, text: "\u5FAA\u73AF\u4F53\u7684\u6700\u540E\u518D\u8BFB\u4E00\u6B21\u3002\u8FD9\u4E00\u53E5\u5C31\u662F\u8BA9\u6761\u4EF6\u4E0B\u4E00\u8F6E\u80FD\u53D8\u7684\u90A3\u4E00\u53E5\u2014\u2014\u5C11\u4E86\u5B83\u6761\u4EF6\u6C38\u8FDC\u6210\u7ACB\u3002" }
            ],
            sampleRun: {
              inputs: ["80", "95", "-1"],
              outputs: ["Enter a score", "Enter a score", "Enter a score", "Count: 2"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`Count` \u662F 10 \u65F6\uFF0C\u4E0B\u9762\u8FD9\u6BB5\u5728\u5C4F\u5E55\u4E0A\u663E\u793A\u4EC0\u4E48\uFF1F",
            code: ["WHILE Count < 5", '   OUTPUT "In"', "ENDWHILE", 'OUTPUT "Done"'].join("\n"),
            options: [
              {
                key: "A",
                label: "\u7A0B\u5E8F\u4F1A\u4E00\u76F4\u8DD1\u4E0B\u53BB",
                correct: false,
                explanation: "\u4E00\u76F4\u8DD1\u4E0B\u53BB\u7684\u662F\u300C\u6761\u4EF6\u6C38\u8FDC\u6210\u7ACB\u300D\u7684\u5FAA\u73AF\u3002\u8FD9\u91CC\u6761\u4EF6\u4E00\u5F00\u59CB\u5C31\u4E0D\u6210\u7ACB\u3002"
              },
              {
                key: "B",
                label: "\u53EA\u6709 Done",
                correct: true,
                explanation: "\u5BF9\u3002\u6761\u4EF6\u5728\u6BCF\u4E00\u904D\u5F00\u59CB\u4E4B\u524D\u5224\u65AD\uFF0C`10 < 5` \u7B2C\u4E00\u6B21\u5C31\u662F `FALSE`\uFF0C\u5FAA\u73AF\u4F53\u4E00\u904D\u90FD\u4E0D\u8DD1\uFF0C\u76F4\u63A5\u6267\u884C `ENDWHILE` \u540E\u9762\u90A3\u4E00\u884C\u3002"
              },
              {
                key: "C",
                label: "In \u4E00\u904D\uFF0C\u7136\u540E Done",
                correct: false,
                explanation: "\u90A3\u662F\u4E0B\u4E00\u8282 `REPEAT` \u7684\u884C\u4E3A\u3002`WHILE` \u5148\u770B\u6761\u4EF6\u518D\u51B3\u5B9A\u8FDB\u4E0D\u8FDB\u53BB\u3002"
              },
              {
                key: "D",
                label: "\u4EC0\u4E48\u90FD\u6CA1\u6709",
                correct: false,
                explanation: '\u8DF3\u8FC7\u7684\u53EA\u662F\u5FAA\u73AF\u4F53\u3002`OUTPUT "Done"` \u5728 `ENDWHILE` \u540E\u9762\uFF0C\u4E0D\u5F52\u5FAA\u73AF\u7BA1\u3002'
              }
            ]
          }
        ]
      },
      {
        id: "5.4",
        title: "`REPEAT \u2026 UNTIL`\uFF1A\u5148\u505A\u4E00\u6B21",
        syllabus: ["\xA711.2", "G\xA77"],
        estimatedMinutes: 8,
        taughtFeatures: AFTER_5_4,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u6709\u4E9B\u4E8B\u5FC5\u987B\u5148\u505A\u4E00\u6B21\u624D\u77E5\u9053\u8981\u4E0D\u8981\u518D\u505A\uFF1A\u5148\u95EE\u4E00\u904D\u624D\u77E5\u9053\u7B54\u6848\u5BF9\u4E0D\u5BF9\uFF0C\u5148\u8BFB\u4E00\u6B21\u624D\u77E5\u9053\u8FD9\u4E2A\u6570\u5408\u4E0D\u5408\u683C\u3002\u8FD9\u65F6\u5019\u6761\u4EF6\u5E94\u8BE5\u653E\u5728\u540E\u9762\u2014\u2014\u5199 `REPEAT`\uFF0C\u4E2D\u95F4\u662F\u5FAA\u73AF\u4F53\uFF0C\u6700\u540E\u4E00\u884C\u5199 `UNTIL <\u6761\u4EF6>`\u3002",
              "\u5FAA\u73AF\u4F53\u5148\u8DD1\u4E00\u904D\uFF0C\u8DD1\u5B8C\u518D\u770B\u6761\u4EF6\u3002\u8FD9\u5C31\u662F\u540E\u6D4B\u5FAA\u73AF\uFF08post-condition loop\uFF09\u7684\u5B9A\u4E49\uFF1A**\u81F3\u5C11\u6267\u884C\u4E00\u6B21**\u3002`REPEAT` \u6CA1\u6709 `ENDREPEAT`\uFF0C`UNTIL` \u90A3\u4E00\u884C\u672C\u8EAB\u5C31\u662F\u7ED3\u5C3E\u3002",
              "`UNTIL` \u548C `WHILE` \u7684\u65B9\u5411\u6B63\u597D\u76F8\u53CD\uFF0C\u8FD9\u4E00\u70B9\u8981\u76EF\u4F4F\uFF1A`WHILE <\u6761\u4EF6>` \u662F\u6761\u4EF6\u6210\u7ACB\u5C31\u7EE7\u7EED\uFF0C`UNTIL <\u6761\u4EF6>` \u662F\u6761\u4EF6\u6210\u7ACB\u5C31\u505C\u3002",
              "\u6240\u4EE5\u540C\u4E00\u4EF6\u4E8B\u5199\u6210\u4E24\u79CD\u5FAA\u73AF\u65F6\uFF0C\u6761\u4EF6\u5F80\u5F80\u8981\u53CD\u8FC7\u6765\u5199\u3002\u300C\u7EE7\u7EED\u8BFB\uFF0C\u76F4\u5230\u8BFB\u5230 -1\u300D\u5199\u6210 `UNTIL Score = -1`\uFF1B\u6362\u6210 `WHILE` \u5C31\u5F97\u5199 `WHILE Score <> -1`\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u540E\u6D4B\u5FAA\u73AF\u5199\u4F5C `REPEAT \u2026 UNTIL <condition>`\uFF0C\u6761\u4EF6\u6210\u7ACB\u65F6\u7ED3\u675F\u5FAA\u73AF\uFF08Pseudocode Guide \xA77.3\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u95EE\u5230\u5408\u683C\u4E3A\u6B62",
            fileName: "Example_5_4_a.pseudocode",
            code: [
              "DECLARE Number : INTEGER",
              "REPEAT",
              '   OUTPUT "Enter a number from 1 to 5"',
              "   INPUT Number",
              "UNTIL Number >= 1 AND Number <= 5",
              'OUTPUT "Accepted: ", Number'
            ].join("\n"),
            annotations: [
              { fromLine: 2, toLine: 4, text: "\u4E0D\u7BA1\u600E\u6837\u90FD\u8981\u5148\u95EE\u4E00\u6B21\u2014\u2014\u4E0D\u95EE\u5C31\u6CA1\u6709\u503C\u53EF\u4EE5\u68C0\u67E5\u3002\u8FD9\u6B63\u662F `REPEAT` \u6BD4 `WHILE` \u987A\u624B\u7684\u5730\u65B9\uFF1A\u4E0D\u9700\u8981\u5728\u5FAA\u73AF\u524D\u5148\u8BFB\u4E00\u6B21\u3002" },
              { fromLine: 5, toLine: 5, text: "\u6761\u4EF6\u6210\u7ACB\uFF08\u8BFB\u5230\u7684\u6570\u843D\u5728 1 \u5230 5 \u4E4B\u95F4\uFF09\u5C31\u7ED3\u675F\uFF1B\u4E0D\u6210\u7ACB\u5C31\u518D\u6765\u4E00\u904D\u3002" }
            ],
            sampleRun: {
              inputs: ["9", "0", "3"],
              outputs: [
                "Enter a number from 1 to 5",
                "Enter a number from 1 to 5",
                "Enter a number from 1 to 5",
                "Accepted: 3"
              ]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`Count` \u662F 10 \u65F6\uFF0C`REPEAT OUTPUT Count UNTIL Count > 5` \u4F1A\u53D1\u751F\u4EC0\u4E48\uFF1F",
            options: [
              {
                key: "A",
                label: "\u7F16\u8F91\u5668\u4F1A\u62E6\u4E0B\u6765",
                correct: false,
                explanation: "\u8FD9\u6BB5\u4EE3\u7801\u5408\u6CD5\u3002`Count` \u5728\u5FAA\u73AF\u91CC\u6CA1\u53D8\uFF0C\u4F46\u6761\u4EF6\u7B2C\u4E00\u6B21\u5C31\u6210\u7ACB\uFF0C\u4E0D\u4F1A\u51FA\u95EE\u9898\u3002"
              },
              {
                key: "B",
                label: "\u663E\u793A\u4E00\u6B21 10\uFF0C\u7136\u540E\u7ED3\u675F",
                correct: true,
                explanation: "\u5BF9\u3002\u5FAA\u73AF\u4F53\u5148\u6267\u884C\u4E00\u904D\u663E\u793A `10`\uFF0C\u7136\u540E\u5224\u65AD `10 > 5` \u6210\u7ACB\uFF0C\u4E8E\u662F\u7ED3\u675F\u3002\u6761\u4EF6\u5728\u540E\u9762\uFF0C\u6240\u4EE5\u81F3\u5C11\u8DD1\u4E00\u904D\u3002"
              },
              {
                key: "C",
                label: "\u4EC0\u4E48\u90FD\u4E0D\u663E\u793A\uFF0C\u56E0\u4E3A 10 \u5DF2\u7ECF\u5927\u4E8E 5",
                correct: false,
                explanation: "\u90A3\u662F `WHILE` \u7684\u884C\u4E3A\u3002`REPEAT` \u628A\u6761\u4EF6\u653E\u5728\u540E\u9762\uFF0C\u5148\u8DD1\u5B8C\u4E00\u904D\u624D\u8F6E\u5230\u5224\u65AD\u3002"
              },
              {
                key: "D",
                label: "\u4E00\u76F4\u663E\u793A 10",
                correct: false,
                explanation: "\u4E00\u76F4\u8DD1\u4E0B\u53BB\u8981\u6C42\u6761\u4EF6\u4E00\u76F4\u4E0D\u6210\u7ACB\u3002`10 > 5` \u7B2C\u4E00\u6B21\u5224\u65AD\u5C31\u6210\u7ACB\u4E86\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "5.4.1",
            title: "\u5408\u6CD5\u624D\u6536",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u53CD\u590D\u63D0\u793A\u5E76\u8BFB\u5165\u4E00\u4E2A\u6574\u6570\uFF0C\u76F4\u5230\u8BFB\u5230\u7684\u6570\u843D\u5728 0 \u5230 100 \u4E4B\u95F4\u4E3A\u6B62\uFF0C\u7136\u540E\u663E\u793A\u5B83\u3002",
            ioSpec: {
              input: [
                "\u82E5\u5E72\u884C\uFF0C\u6BCF\u884C\u4E00\u4E2A `INTEGER`\u3002\u6BCF\u8BFB\u4E00\u6B21\u4E4B\u524D\u90FD\u8981\u663E\u793A\u4E00\u904D\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
                "`Enter a mark`"
              ].join("\n"),
              output: "\u6700\u540E\u4E00\u884C\u5199\u6210 `Accepted: <\u503C>`\u3002\u5192\u53F7\u540E\u9762\u662F\u4E00\u4E2A\u7A7A\u683C\u3002"
            },
            constraints: {
              require: [
                {
                  feature: "loop.repeat",
                  reason: "\u4E0D\u95EE\u4E00\u6B21\u5C31\u6CA1\u6709\u503C\u53EF\u4EE5\u5224\u65AD\uFF0C\u8FD9\u6B63\u662F\u300C\u81F3\u5C11\u505A\u4E00\u6B21\u300D\u7684\u573A\u5408\u3002"
                }
              ],
              forbid: [
                {
                  feature: "loop.while",
                  reason: "\u7528\u5B83\u5F97\u5728\u5FAA\u73AF\u524D\u5148\u95EE\u4E00\u6B21\uFF0C\u63D0\u793A\u548C\u8BFB\u53D6\u90A3\u4E24\u884C\u5C31\u8981\u5199\u4E24\u904D\u3002"
                }
              ]
            },
            hints: [
              "\u63D0\u793A\u8BED\u548C\u8BFB\u53D6\u90FD\u5728\u5FAA\u73AF\u4F53\u91CC\uFF0C\u6240\u4EE5\u4E0D\u5408\u683C\u65F6\u4F1A\u81EA\u7136\u5730\u518D\u95EE\u4E00\u904D\u3002",
              "\u300C\u843D\u5728 0 \u5230 100 \u4E4B\u95F4\u300D\u662F\u4E24\u4E2A\u6761\u4EF6\uFF0C\u7528 `AND` \u62FC\u8D77\u6765\u3002",
              "\u7ED3\u675F\u6761\u4EF6\u5199\u7684\u662F\u4EC0\u4E48\u65F6\u5019\u505C\uFF0C\u4E0D\u662F\u4EC0\u4E48\u65F6\u5019\u7EE7\u7EED\u3002"
            ],
            examples: [
              {
                inputs: ["42"],
                outputs: ["Enter a mark", "Accepted: 42"]
              }
            ],
            referenceSolution: [
              "DECLARE Mark : INTEGER",
              "REPEAT",
              '   OUTPUT "Enter a mark"',
              "   INPUT Mark",
              "UNTIL Mark >= 0 AND Mark <= 100",
              'OUTPUT "Accepted: ", Mark'
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["58"], caseHint: "\u7B2C\u4E00\u6B21\u5C31\u8F93\u5165\u4E86\u4E00\u4E2A\u5408\u683C\u7684\u6570\u3002" },
              { id: "t2", kind: "normal", inputs: ["120", "-4", "58"], caseHint: "\u8FDE\u7740\u8F93\u9519\u4E24\u6B21\u4E4B\u540E\u624D\u5BF9\u3002" },
              { id: "t3", kind: "boundary", inputs: ["0"], caseHint: "\u6B63\u597D\u8E29\u5728\u4E0B\u754C\u4E0A\u3002" },
              { id: "t4", kind: "boundary", inputs: ["100"], caseHint: "\u6B63\u597D\u8E29\u5728\u4E0A\u754C\u4E0A\u3002" },
              { id: "t5", kind: "abnormal", inputs: ["101", "50"], caseHint: "\u521A\u597D\u8D85\u51FA\u4E0A\u754C\u4E00\u70B9\u70B9\uFF0C\u7136\u540E\u624D\u7ED9\u4E00\u4E2A\u5408\u683C\u7684\u3002" },
              { id: "t6", kind: "extreme", inputs: ["999999", "7"], caseHint: "\u5148\u6765\u4E00\u4E2A\u8FDC\u8FDC\u8D85\u51FA\u8303\u56F4\u7684\u6570\u3002" }
            ]
          }
        ]
      },
      {
        id: "5.5",
        title: "\u524D\u6D4B\u4E0E\u540E\u6D4B\uFF1A\u540C\u4E00\u4EF6\u4E8B\u7684\u4E24\u79CD\u5199\u6CD5",
        syllabus: ["\xA711.2", "G\xA77"],
        estimatedMinutes: 8,
        taughtFeatures: AFTER_5_4,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "`WHILE` \u548C `REPEAT` \u90FD\u80FD\u505A\u300C\u4E0D\u77E5\u9053\u8981\u8DD1\u591A\u5C11\u904D\u300D\u7684\u4E8B\uFF0C\u533A\u522B\u53EA\u5728\u6761\u4EF6\u653E\u5728\u524D\u9762\u8FD8\u662F\u540E\u9762\u3002\u628A\u540C\u4E00\u4E2A\u4EFB\u52A1\u7684\u4E24\u79CD\u5199\u6CD5\u5E76\u6392\u770B\uFF0C\u533A\u522B\u5C31\u5F88\u6E05\u695A\u4E86\u3002",
              "\u4E24\u79CD\u5199\u6CD5\u90FD\u5BF9\uFF0C\u4F46\u5B83\u4EEC\u5728\u4E00\u79CD\u60C5\u51B5\u4E0B**\u7ED3\u679C\u4E0D\u4E00\u6837**\uFF1A\u7B2C\u4E00\u4E2A\u8F93\u5165\u5C31\u662F\u54E8\u5175\u3002`WHILE` \u7248\u6761\u4EF6\u4E00\u5F00\u59CB\u5C31\u4E0D\u6210\u7ACB\uFF0C\u5FAA\u73AF\u4F53\u4E00\u904D\u90FD\u4E0D\u8DD1\uFF1B`REPEAT` \u7248\u5FAA\u73AF\u4F53\u5148\u8DD1\u4E00\u904D\uFF0C\u8BFB\u5230\u7684\u54E8\u5175\u4E5F\u4F1A\u8FDB\u5230\u5FAA\u73AF\u4F53\u91CC\uFF0C\u6240\u4EE5\u5FC5\u987B\u591A\u5199\u4E00\u4E2A\u5224\u65AD\u628A\u5B83\u6321\u4F4F\u3002",
              "\u8FD9\u5C31\u662F\u9009\u62E9\u7684\u4F9D\u636E\uFF1A**\u300C\u4E00\u6B21\u90FD\u4E0D\u505A\u300D\u662F\u4E0D\u662F\u4E00\u79CD\u5408\u6CD5\u7684\u60C5\u51B5\uFF1F** \u662F\u7684\u8BDD\u7528 `WHILE`\uFF0C\u5B83\u5929\u751F\u652F\u6301\u8DD1 0 \u904D\uFF1B\u4E0D\u662F\u7684\u8BDD\uFF08\u6BD4\u5982\u300C\u81F3\u5C11\u8981\u95EE\u4E00\u6B21\u300D\uFF09\u7528 `REPEAT`\uFF0C\u5B83\u5929\u751F\u8DD1\u81F3\u5C11 1 \u904D\u3002"
            ]
          },
          {
            kind: "comparison",
            title: "\u8BFB\u5230 -1 \u4E3A\u6B62\uFF0C\u6570\u4E00\u6570\u8BFB\u4E86\u51E0\u4E2A",
            intro: "\u540C\u4E00\u4E2A\u4EFB\u52A1\uFF0C\u6761\u4EF6\u653E\u524D\u9762\u548C\u653E\u540E\u9762\uFF0C\u4EE3\u4EF7\u843D\u5728\u4E0D\u540C\u7684\u5730\u65B9\u3002",
            panes: [
              {
                label: "\u81EA\u7136\u8BED\u8A00",
                language: "natural",
                code: "\u4E00\u4E2A\u4E00\u4E2A\u8BFB\u6570\u5B57\uFF0C\u8BFB\u5230 -1 \u5C31\u505C\u4E0B\u6765\uFF0C\u6570\u4E00\u6570\u4E00\u5171\u8BFB\u4E86\u51E0\u4E2A\uFF08-1 \u4E0D\u7B97\uFF09\u3002",
                note: "\u8FD9\u53E5\u8BDD\u6CA1\u6709\u8BF4\u300C\u5982\u679C\u7B2C\u4E00\u4E2A\u5C31\u662F -1 \u600E\u4E48\u529E\u300D\u3002\u4EBA\u4F1A\u9ED8\u8BA4\u7B54\u6848\u662F\u96F6\u4E2A\uFF0C\u7A0B\u5E8F\u4E0D\u4F1A\u9ED8\u8BA4\uFF0C\u5F97\u7531\u7ED3\u6784\u672C\u8EAB\u51B3\u5B9A\u3002"
              },
              {
                label: "\u4F2A\u4EE3\u7801 \xB7 `WHILE`\uFF08\u524D\u6D4B\uFF09",
                language: "pseudocode",
                code: [
                  "DECLARE Score : INTEGER",
                  "DECLARE Count : INTEGER",
                  "Count \u2190 0",
                  'OUTPUT "Enter a score"',
                  "INPUT Score",
                  "WHILE Score <> -1",
                  "   Count \u2190 Count + 1",
                  '   OUTPUT "Enter a score"',
                  "   INPUT Score",
                  "ENDWHILE"
                ].join("\n"),
                note: "\u8FDB\u5FAA\u73AF\u524D\u8981\u5148\u8BFB\u4E00\u6B21\uFF0C\u5426\u5219\u7B2C\u4E00\u6B21\u5224\u65AD\u65F6\u53D8\u91CF\u8FD8\u6CA1\u6709\u503C\u3002\u4EE3\u4EF7\u662F\u63D0\u793A\u4E0E\u8BFB\u53D6\u90A3\u4E24\u884C\u5199\u4E86\u4E24\u904D\u3002\u7B2C\u4E00\u4E2A\u5C31\u8BFB\u5230 -1 \u65F6\uFF0C\u5FAA\u73AF\u4F53\u4E00\u904D\u4E0D\u8DD1\uFF0C\u7ED3\u679C\u81EA\u7136\u662F\u96F6\u4E2A\u3002"
              },
              {
                label: "\u4F2A\u4EE3\u7801 \xB7 `REPEAT`\uFF08\u540E\u6D4B\uFF09",
                language: "pseudocode",
                code: [
                  "DECLARE Score : INTEGER",
                  "DECLARE Count : INTEGER",
                  "Count \u2190 0",
                  "REPEAT",
                  '   OUTPUT "Enter a score"',
                  "   INPUT Score",
                  "   IF Score <> -1 THEN",
                  "      Count \u2190 Count + 1",
                  "   ENDIF",
                  "UNTIL Score = -1"
                ].join("\n"),
                note: "\u4E0D\u7528\u5148\u8BFB\uFF0C\u8BFB\u53D6\u53EA\u5199\u4E00\u904D\u3002\u4EE3\u4EF7\u662F\u5FAA\u73AF\u4F53\u91CC\u8981\u591A\u4E00\u4E2A\u5224\u65AD\u2014\u2014\u54E8\u5175\u672C\u8EAB\u4E5F\u4F1A\u88AB\u8BFB\u8FDB\u6765\uFF0C\u4E0D\u6321\u4F4F\u5C31\u4F1A\u88AB\u6570\u8FDB\u53BB\u3002"
              },
              {
                label: "Python",
                language: "python",
                code: [
                  "count = 0",
                  "score = int(input())",
                  "while score != -1:",
                  "    count += 1",
                  "    score = int(input())"
                ].join("\n"),
                note: "Python \u53EA\u6709\u524D\u6D4B\u7684 `while`\uFF0C\u6CA1\u6709\u5BF9\u5E94 `REPEAT \u2026 UNTIL` \u7684\u5199\u6CD5\uFF1B\u8981\u300C\u5148\u505A\u4E00\u6B21\u300D\u5F97\u7528 `while True` \u52A0 `break` \u62FC\u51FA\u6765\u3002\u4F2A\u4EE3\u7801\u628A\u4E24\u79CD\u90FD\u4F5C\u4E3A\u6B63\u5F0F\u7ED3\u6784\u63D0\u4F9B\uFF0C\u6240\u4EE5\u8981\u81EA\u5DF1\u6311\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u54EA\u4E00\u79CD\u60C5\u51B5**\u5FC5\u987B**\u7528 `REPEAT`\uFF0C\u7528 `WHILE` \u4F1A\u522B\u626D\uFF1F",
            options: [
              {
                key: "A",
                label: "\u53EA\u8981\u8FD8\u6709\u94B1\u5C31\u7EE7\u7EED\u4E70\u4E1C\u897F",
                correct: false,
                explanation: "\u4E00\u5206\u94B1\u90FD\u6CA1\u6709\u65F6\u5E94\u8BE5\u4E00\u6B21\u90FD\u4E0D\u4E70\u3002\u300C\u53EF\u80FD 0 \u6B21\u300D\u6B63\u662F `WHILE` \u7684\u573A\u5408\u3002"
              },
              {
                key: "B",
                label: "\u628A\u4E00\u4E32\u6570\u5B57\u4ECE\u5934\u5230\u5C3E\u8D70\u4E00\u904D",
                correct: false,
                explanation: "\u6B21\u6570\u4E8B\u5148\u5C31\u77E5\u9053\uFF0C\u8FD9\u79CD\u60C5\u51B5\u8FDE `WHILE` \u90FD\u4E0D\u662F\u9996\u9009\uFF0C`FOR` \u624D\u662F\u3002"
              },
              {
                key: "C",
                label: "\u663E\u793A 1 \u5230 10",
                correct: false,
                explanation: "\u6B21\u6570\u5DF2\u77E5\uFF0C\u7528 `FOR` \u6700\u76F4\u63A5\uFF1A\u8D77\u70B9\u7EC8\u70B9\u5199\u5728\u4E00\u884C\u91CC\u3002"
              },
              {
                key: "D",
                label: "\u53CD\u590D\u8981\u6C42\u7528\u6237\u8F93\u5165\u5BC6\u7801\uFF0C\u76F4\u5230\u8F93\u5BF9\u4E3A\u6B62",
                correct: true,
                explanation: "\u5BF9\u3002\u4E0D\u95EE\u4E00\u6B21\u5C31\u6CA1\u6709\u5BC6\u7801\u53EF\u4EE5\u68C0\u67E5\u3002\u7528 `WHILE` \u4E5F\u505A\u5F97\u5230\uFF0C\u4F46\u5FC5\u987B\u5728\u5FAA\u73AF\u524D\u5148\u95EE\u4E00\u6B21\uFF0C\u90A3\u4E00\u6BB5\u4F1A\u91CD\u590D\u5199\u4E24\u904D\u3002"
              }
            ]
          }
        ]
      }
    ],
    chapterTasks: [
      {
        kind: "chapterTask",
        id: "5.T1",
        title: "\u5206\u6570\u7EDF\u8BA1",
        statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u53CD\u590D\u8BFB\u5165\u5206\u6570\uFF0C\u8BFB\u5230 -1 \u8868\u793A\u8F93\u5165\u7ED3\u675F\uFF0C\u7136\u540E\u663E\u793A\u8FD9\u6279\u5206\u6570\u7684\u7EDF\u8BA1\u7ED3\u679C\u3002-1 \u672C\u8EAB\u4E0D\u7B97\u4E00\u4E2A\u5206\u6570\u3002",
        ioSpec: {
          input: [
            "\u82E5\u5E72\u884C\uFF0C\u6BCF\u884C\u4E00\u4E2A `INTEGER`\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
            "`Enter a score`",
            "\u8BFB\u5230 -1 \u8868\u793A\u7ED3\u675F\u3002\u53EF\u80FD\u7B2C\u4E00\u4E2A\u8BFB\u5230\u7684\u5C31\u662F -1\u3002"
          ].join("\n"),
          output: [
            "\u4E00\u4E2A\u5206\u6570\u90FD\u6CA1\u8BFB\u5230\u65F6\uFF0C\u53EA\u663E\u793A\u4E00\u884C `No scores`\uFF1B",
            "\u5426\u5219\u663E\u793A\u4E09\u884C\uFF1A",
            "`Count: <\u4E2A\u6570>`",
            "`Highest: <\u6700\u9AD8\u5206>`",
            "`Average: <\u5E73\u5747\u5206>`",
            "\u5E73\u5747\u5206\u53D6\u6574\u6570\u5546\u3002\u6BCF\u4E2A\u5192\u53F7\u540E\u9762\u90FD\u662F\u4E00\u4E2A\u7A7A\u683C\u3002"
          ].join("\n")
        },
        suggestedFeatures: ["loop.while", "select.if", "select.if-else", "op.relational", "op.div", "io.input", "io.output"],
        hints: [
          "\u300C\u4E00\u4E2A\u5206\u6570\u90FD\u6CA1\u6709\u300D\u662F\u4E00\u79CD\u5408\u6CD5\u60C5\u51B5\uFF0C5.5 \u7684\u5224\u636E\u76F4\u63A5\u7ED9\u51FA\u4E86\u8BE5\u7528\u54EA\u79CD\u5FAA\u73AF\u3002",
          "\u4E2A\u6570\u3001\u603B\u5206\u3001\u6700\u9AD8\u5206\u90FD\u8981\u4E00\u8DEF\u6512\u7740\uFF0C\u4E09\u4E2A\u53D8\u91CF\u90FD\u8981\u5728\u5FAA\u73AF\u5F00\u59CB\u524D\u5148\u7ED9\u521D\u503C\u3002",
          "\u6C42\u6700\u9AD8\u5206\u4E0D\u9700\u8981\u8BB0\u4F4F\u6240\u6709\u5206\u6570\uFF1A\u6BCF\u8BFB\u5230\u4E00\u4E2A\u5C31\u548C\u76EE\u524D\u7684\u6700\u9AD8\u5206\u6BD4\u4E00\u4E0B\uFF0C\u6BD4\u5B83\u5927\u5C31\u6362\u6389\u3002"
        ],
        examples: [
          {
            inputs: ["50", "70", "-1"],
            outputs: [
              "Enter a score",
              "Enter a score",
              "Enter a score",
              "Count: 2",
              "Highest: 70",
              "Average: 60"
            ]
          }
        ],
        referenceSolution: [
          "DECLARE Score : INTEGER",
          "DECLARE Total : INTEGER",
          "DECLARE Count : INTEGER",
          "DECLARE Highest : INTEGER",
          "Total \u2190 0",
          "Count \u2190 0",
          "Highest \u2190 0",
          'OUTPUT "Enter a score"',
          "INPUT Score",
          "WHILE Score <> -1",
          "   Total \u2190 Total + Score",
          "   Count \u2190 Count + 1",
          "   IF Score > Highest THEN",
          "      Highest \u2190 Score",
          "   ENDIF",
          '   OUTPUT "Enter a score"',
          "   INPUT Score",
          "ENDWHILE",
          "IF Count = 0 THEN",
          '   OUTPUT "No scores"',
          "ELSE",
          '   OUTPUT "Count: ", Count',
          '   OUTPUT "Highest: ", Highest',
          '   OUTPUT "Average: ", Total DIV Count',
          "ENDIF"
        ].join("\n"),
        tests: [
          { id: "t1", kind: "normal", inputs: ["80", "95", "60", "-1"], caseHint: "\u51E0\u4E2A\u666E\u901A\u7684\u5206\u6570\uFF0C\u6700\u9AD8\u7684\u90A3\u4E2A\u6392\u5728\u4E2D\u95F4\u3002" },
          { id: "t2", kind: "normal", inputs: ["70", "-1"], caseHint: "\u53EA\u8BFB\u5230\u4E00\u4E2A\u5206\u6570\u3002" },
          { id: "t3", kind: "boundary", inputs: ["-1"], caseHint: "\u4E00\u4E0A\u6765\u5C31\u7ED3\u675F\uFF0C\u4E00\u4E2A\u5206\u6570\u90FD\u6CA1\u6709\u3002" },
          { id: "t4", kind: "boundary", inputs: ["0", "-1"], caseHint: "\u552F\u4E00\u7684\u90A3\u4E2A\u5206\u6570\u6B63\u597D\u662F\u96F6\u3002" },
          { id: "t5", kind: "normal", inputs: ["100", "100", "100", "-1"], caseHint: "\u6240\u6709\u5206\u6570\u90FD\u4E00\u6837\u3002" },
          { id: "t6", kind: "extreme", inputs: ["99999", "1", "-1"], caseHint: "\u4E24\u4E2A\u76F8\u5DEE\u975E\u5E38\u60AC\u6B8A\u7684\u5206\u6570\u3002" }
        ]
      }
    ]
  };

  // packages/teaching-content/src/chapter-06.ts
  var AFTER_CHAPTER_5 = [
    "io.output",
    "io.input",
    "decl.variable",
    "misc.comment",
    "type.string",
    "literal.string",
    "type.integer",
    "type.real",
    "type.char",
    "type.boolean",
    "type.date",
    "literal.integer",
    "literal.real",
    "literal.char",
    "literal.boolean",
    "literal.date",
    "assign.simple",
    "decl.constant",
    "op.arithmetic",
    "op.div",
    "op.mod",
    "op.relational",
    "op.and",
    "op.or",
    "op.not",
    "select.if",
    "select.if-else",
    "select.nested-if",
    "select.case",
    "select.case-range",
    "select.case-otherwise",
    "loop.for",
    "loop.for-step",
    "loop.while",
    "loop.repeat"
  ];
  var AFTER_6_3 = [...AFTER_CHAPTER_5, "loop.nested"];
  var chapter06 = {
    id: 6,
    title: "\u5FAA\u73AF\u7684\u9009\u62E9\u4E0E\u5D4C\u5957",
    level: "AS",
    syllabus: ["\xA711.2"],
    prerequisites: [1, 2, 3, 4, 5],
    sections: [
      {
        id: "6.1",
        title: "\u4E09\u79CD\u5FAA\u73AF\u600E\u4E48\u6311",
        syllabus: ["\xA711.2"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_CHAPTER_5,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u7B2C 5 \u7AE0\u628A\u4E09\u79CD\u5FAA\u73AF\u5206\u522B\u8BB2\u4E86\u4E00\u904D\u3002\u5B83\u4EEC\u80FD\u505A\u7684\u4E8B\u5176\u5B9E\u5927\u9762\u79EF\u91CD\u53E0\u2014\u2014\u540C\u4E00\u4E2A\u4EFB\u52A1\u5F80\u5F80\u4E09\u79CD\u90FD\u5199\u5F97\u51FA\u6765\u3002\u6240\u4EE5\u771F\u6B63\u8981\u5B66\u7684\u4E0D\u662F\u300C\u54EA\u79CD\u80FD\u505A\u300D\uFF0C\u800C\u662F**\u54EA\u79CD\u6700\u5408\u9002**\u3002",
              "\u53EA\u95EE\u4E24\u4E2A\u95EE\u9898\u5C31\u591F\u4E86\u3002**\u7B2C\u4E00\u4E2A\uFF1A\u5F00\u59CB\u4E4B\u524D\uFF0C\u77E5\u9053\u8981\u8DD1\u591A\u5C11\u904D\u5417\uFF1F**\u77E5\u9053\u5C31\u7528 `FOR`\u3002\u300C\u663E\u793A 10 \u884C\u300D\u300C\u5904\u7406 7 \u5929\u7684\u6570\u636E\u300D\u300C\u4ECE 1 \u52A0\u5230 N\u300D\u90FD\u7B97\u77E5\u9053\u2014\u2014`N` \u662F\u8BFB\u8FDB\u6765\u7684\u4E5F\u7B97\uFF0C\u56E0\u4E3A\u8BFB\u5230\u5B83\u7684\u90A3\u4E00\u523B\u6B21\u6570\u5C31\u5B9A\u4E0B\u6765\u4E86\u3002",
              "**\u7B2C\u4E8C\u4E2A\uFF1A\u5982\u679C\u6761\u4EF6\u4E00\u5F00\u59CB\u5C31\u4E0D\u6210\u7ACB\uFF0C\u5E94\u8BE5\u8DD1\u51E0\u904D\uFF1F**\u8BE5\u8DD1 0 \u904D\u5C31\u7528 `WHILE`\uFF0C\u8BE5\u8DD1 1 \u904D\u5C31\u7528 `REPEAT`\u3002\u300C\u4F59\u989D\u4E0D\u591F\u5C31\u4E00\u4EF6\u4E5F\u4E0D\u4E70\u300D\u662F 0 \u904D\uFF1B\u300C\u4E0D\u95EE\u4E00\u6B21\u5C31\u4E0D\u77E5\u9053\u7528\u6237\u60F3\u5E72\u4EC0\u4E48\u300D\u662F 1 \u904D\u3002",
              "\u7B2C\u4E00\u4E2A\u95EE\u9898\u4F18\u5148\u3002\u6B21\u6570\u5DF2\u77E5\u65F6 `WHILE` \u4E5F\u505A\u5F97\u5230\uFF0C\u4F46\u4F60\u5F97\u81EA\u5DF1\u5199\u8BA1\u6570\u5668\u7684\u4E09\u4EF6\u4E8B\u2014\u2014\u8BBE\u521D\u503C\u3001\u5199\u6761\u4EF6\u3001\u6BCF\u904D\u52A0\u4E00\u3002\u4E09\u4EF6\u4E8B\u5C11\u5199\u4E00\u4EF6\uFF0C\u5FAA\u73AF\u5C31\u8DD1\u9519\u6216\u8005\u505C\u4E0D\u4E0B\u6765\u3002`FOR` \u628A\u8FD9\u4E09\u4EF6\u4E8B\u6536\u8FDB\u4E86\u4E00\u884C\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u80FD\u591F**\u8BF4\u660E**\u4E3A\u4EC0\u4E48\u67D0\u79CD\u5FAA\u73AF\u7ED3\u6784\u66F4\u9002\u5408\u67D0\u4E2A\u4EFB\u52A1\uFF08\xA711.2\uFF09\uFF0C\u4E0D\u53EA\u662F\u4F1A\u5199\u3002"
              }
            ]
          },
          {
            kind: "comparison",
            title: "\u540C\u4E00\u4EF6\u4E8B\uFF0C\u4E0D\u540C\u7684\u4EE3\u4EF7",
            intro: "\u300C\u663E\u793A\u4E94\u884C\u300D\u8FD9\u4EF6\u4E8B\u4E09\u79CD\u5FAA\u73AF\u90FD\u505A\u5F97\u5230\uFF0C\u4F46\u5199\u51FA\u6765\u7684\u4E1C\u897F\u4E0D\u4E00\u6837\u91CD\u3002",
            panes: [
              {
                label: "\u81EA\u7136\u8BED\u8A00",
                language: "natural",
                code: "\u628A\u8FD9\u53E5\u8BDD\u663E\u793A\u4E94\u904D\u3002",
                note: "\u4EBA\u542C\u5230\u300C\u4E94\u904D\u300D\u5C31\u77E5\u9053\u8BE5\u6570\u5230\u4E94\u3002\u7A0B\u5E8F\u9700\u8981\u6709\u4EBA\u628A\u300C\u4ECE\u54EA\u513F\u5F00\u59CB\u3001\u5230\u54EA\u513F\u7ED3\u675F\u3001\u6BCF\u904D\u600E\u4E48\u53D8\u300D\u5168\u90FD\u5199\u51FA\u6765\u3002"
              },
              {
                label: "\u4F2A\u4EE3\u7801 \xB7 `FOR`",
                language: "pseudocode",
                code: ["DECLARE I : INTEGER", "FOR I \u2190 1 TO 5", '   OUTPUT "Line ", I', "NEXT I"].join("\n"),
                note: "\u4E00\u884C\u8BF4\u6E05\u4E86\u4E09\u4EF6\u4E8B\uFF1A\u4ECE 1 \u5F00\u59CB\u3001\u5230 5 \u7ED3\u675F\u3001\u6BCF\u904D\u52A0 1\u3002\u8BA1\u6570\u5668\u7684\u4E8B\u5168\u4EA4\u7ED9\u7ED3\u6784\u672C\u8EAB\u3002"
              },
              {
                label: "\u4F2A\u4EE3\u7801 \xB7 `WHILE`",
                language: "pseudocode",
                code: [
                  "DECLARE I : INTEGER",
                  "I \u2190 1",
                  "WHILE I <= 5",
                  '   OUTPUT "Line ", I',
                  "   I \u2190 I + 1",
                  "ENDWHILE"
                ].join("\n"),
                note: "\u540C\u6837\u7684\u7ED3\u679C\uFF0C\u4F46\u8BA1\u6570\u5668\u7684\u4E09\u4EF6\u4E8B\u6563\u5728\u4E09\u4E2A\u5730\u65B9\uFF1A\u8BBE\u521D\u503C\u3001\u5199\u6761\u4EF6\u3001\u6BCF\u904D\u52A0\u4E00\u3002\u6F0F\u6389\u6700\u540E\u90A3\u4E00\u884C\u5C31\u6C38\u8FDC\u505C\u4E0D\u4E0B\u6765\u3002"
              },
              {
                label: "Python",
                language: "python",
                code: ["for i in range(1, 6):", '    print("Line", i)'].join("\n"),
                note: "Python \u7684 `range(1, 6)` \u53D6\u4E0D\u5230 6\uFF0C\u800C\u4F2A\u4EE3\u7801\u7684 `TO 5` \u53D6\u5F97\u5230 5\u3002\u4E24\u79CD\u8BB0\u6CD5\u90FD\u8981\u6570\u4E94\u904D\uFF0C\u4F46\u7AEF\u70B9\u7684\u89C4\u77E9\u4E0D\u4E00\u6837\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u300C\u4E00\u76F4\u5411\u7528\u6237\u8981\u4E00\u4E2A 1 \u5230 5 \u7684\u6570\u5B57\uFF0C\u76F4\u5230\u4ED6\u8F93\u5165\u5408\u6CD5\u4E3A\u6B62\u300D\u2014\u2014\u8BE5\u7528\u54EA\u79CD\u5FAA\u73AF\uFF1F",
            options: [
              {
                key: "A",
                label: "`FOR`",
                correct: false,
                explanation: "\u7528\u6237\u53EF\u80FD\u4E00\u6B21\u5C31\u8F93\u5BF9\uFF0C\u4E5F\u53EF\u80FD\u8F93\u9519\u5341\u6B21\u3002\u6B21\u6570\u4E8B\u5148\u4E0D\u77E5\u9053\uFF0C`FOR` \u7684\u8D77\u70B9\u7EC8\u70B9\u6CA1\u6CD5\u5199\u3002"
              },
              {
                key: "B",
                label: "`WHILE`",
                correct: false,
                explanation: "\u80FD\u5199\uFF0C\u4F46\u522B\u626D\uFF1A\u5224\u65AD\u6761\u4EF6\u65F6\u624B\u91CC\u5F97\u5148\u6709\u4E2A\u503C\uFF0C\u6240\u4EE5\u5FC5\u987B\u5728\u5FAA\u73AF\u524D\u9762\u5148\u95EE\u4E00\u6B21\uFF0C\u90A3\u4E24\u884C\u5C31\u5F97\u5199\u4E24\u904D\u3002"
              },
              {
                key: "C",
                label: "\u4E09\u79CD\u90FD\u4E00\u6837\uFF0C\u968F\u4FBF\u6311",
                correct: false,
                explanation: "\u4E09\u79CD\u786E\u5B9E\u90FD\u5199\u5F97\u51FA\u6765\uFF0C\u4F46\u4EE3\u4EF7\u4E0D\u4E00\u6837\uFF1A`FOR` \u5199\u4E0D\u51FA\uFF0C`WHILE` \u8981\u91CD\u590D\u4E24\u884C\u3002\u6311\u7684\u5C31\u662F\u4EE3\u4EF7\u6700\u5C0F\u7684\u90A3\u4E2A\u3002"
              },
              {
                key: "D",
                label: "`REPEAT`",
                correct: true,
                explanation: "\u5BF9\u3002\u4E0D\u95EE\u4E00\u6B21\u5C31\u6CA1\u6709\u503C\u53EF\u4EE5\u68C0\u67E5\uFF0C\u6240\u4EE5\u300C\u81F3\u5C11\u8DD1\u4E00\u904D\u300D\u662F\u8FD9\u4EF6\u4E8B\u7684\u672C\u6765\u9762\u76EE\uFF0C\u6761\u4EF6\u653E\u5728\u540E\u9762\u6B63\u5408\u9002\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "6.2",
        title: "\u6311\u9519\u4E86\u4F1A\u600E\u6837",
        syllabus: ["\xA711.2"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_CHAPTER_5,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u6311\u9519\u5FAA\u73AF\uFF0C\u6709\u65F6\u5019\u53EA\u662F\u4EE3\u7801\u96BE\u770B\u4E00\u70B9\uFF0C\u6709\u65F6\u5019\u7ED3\u679C\u4F1A\u76F4\u63A5\u9519\u6389\uFF0C\u800C\u4E14\u7A0B\u5E8F\u7167\u8DD1\u4E0D\u8BEF\u3001\u4E00\u6761\u63D0\u793A\u90FD\u6CA1\u6709\u3002\u6700\u5178\u578B\u7684\u4E00\u79CD\uFF1A**\u8BE5\u8DD1 0 \u904D\u7684\u4E8B\u7528\u4E86 `REPEAT`**\u3002",
              "\u5047\u8BBE\u89C4\u5219\u662F\u300C\u6BCF\u4EF6\u5546\u54C1 10 \u5143\uFF0C\u4F59\u989D\u591F\u5C31\u4E70\u4E00\u4EF6\uFF0C\u4E00\u76F4\u4E70\u5230\u4E0D\u591F\u4E3A\u6B62\u300D\u3002\u4F59\u989D\u53EA\u6709 5 \u5143\u65F6\uFF0C\u6B63\u786E\u7684\u884C\u4E3A\u662F\u4E00\u4EF6\u4E5F\u4E0D\u4E70\u3002",
              "\u6362\u6210 `WHILE`\uFF0C\u6761\u4EF6\u632A\u5230\u524D\u9762\uFF0C\u5176\u4F59\u4E00\u4E2A\u5B57\u4E0D\u6539\uFF0C\u7ED3\u679C\u5C31\u5BF9\u4E86\u3002\u6CE8\u610F\u6761\u4EF6\u7684\u65B9\u5411\u4E5F\u8DDF\u7740\u53D8\uFF1A`WHILE` \u5199\u7684\u662F\u300C\u4EC0\u4E48\u65F6\u5019\u7EE7\u7EED\u300D\uFF0C`REPEAT` \u5199\u7684\u662F\u300C\u4EC0\u4E48\u65F6\u5019\u505C\u300D\uFF0C\u4E24\u8005\u4E92\u4E3A\u53CD\u9762\u3002",
              "\u8FD9\u7C7B\u9519\u8BEF\u6709\u4E2A\u5171\u540C\u70B9\uFF1A**\u5B83\u53EA\u5728\u4E00\u79CD\u8F93\u5165\u4E0B\u9732\u9985**\u3002\u4F59\u989D 25 \u5143\u65F6\u4E24\u79CD\u5199\u6CD5\u7ED3\u679C\u4E00\u6837\uFF0C\u90FD\u662F\u4E70 2 \u4EF6\u5269 5 \u5143\uFF1B\u53EA\u6709\u4F59\u989D\u672C\u6765\u5C31\u4E0D\u591F\u7684\u65F6\u5019\uFF0C\u5DEE\u522B\u624D\u51FA\u73B0\u3002"
            ]
          },
          {
            kind: "counterExample",
            title: "\u7528 `REPEAT` \u5199\u300C\u4F59\u989D\u591F\u624D\u4E70\u300D",
            cases: [
              {
                code: [
                  "DECLARE Balance : INTEGER",
                  "DECLARE Bought : INTEGER",
                  "Bought \u2190 0",
                  'OUTPUT "Enter the balance"',
                  "INPUT Balance",
                  "REPEAT",
                  "   Balance \u2190 Balance - 10",
                  "   Bought \u2190 Bought + 1",
                  "UNTIL Balance < 10",
                  'OUTPUT "Bought: ", Bought',
                  'OUTPUT "Left: ", Balance'
                ].join("\n"),
                note: "\u8F93\u5165 5\uFF0C\u5B83\u663E\u793A `Bought: 1` \u548C `Left: -5`\u2014\u2014\u53EA\u6709 5 \u5143\u5374\u4E70\u4E86\u4E00\u4EF6\uFF0C\u4F59\u989D\u6210\u4E86\u8D1F\u6570\u3002\u8FD9\u6BB5\u4EE3\u7801\u8BED\u6CD5\u5168\u5BF9\u3001\u7C7B\u578B\u5168\u5BF9\u3001\u8DD1\u5F97\u5B8C\uFF0C\u7F16\u8F91\u5668**\u4E00\u6761\u63D0\u793A\u90FD\u6CA1\u6709**\u3002\u5B83\u53EA\u662F\u56DE\u7B54\u4E86\u9519\u7684\u95EE\u9898\uFF1A`REPEAT` \u95EE\u7684\u662F\u300C\u505A\u5B8C\u4E00\u6B21\u4E4B\u540E\u8981\u4E0D\u8981\u518D\u505A\u300D\uFF0C\u800C\u8FD9\u91CC\u8BE5\u95EE\u7684\u662F\u300C\u5230\u5E95\u8981\u4E0D\u8981\u505A\u300D\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u628A\u6761\u4EF6\u632A\u5230\u524D\u9762",
            fileName: "Example_6_2_a.pseudocode",
            code: [
              "DECLARE Balance : INTEGER",
              "DECLARE Bought : INTEGER",
              "Bought \u2190 0",
              'OUTPUT "Enter the balance"',
              "INPUT Balance",
              "WHILE Balance >= 10",
              "   Balance \u2190 Balance - 10",
              "   Bought \u2190 Bought + 1",
              "ENDWHILE",
              'OUTPUT "Bought: ", Bought',
              'OUTPUT "Left: ", Balance'
            ].join("\n"),
            annotations: [
              { fromLine: 6, toLine: 6, text: "\u6761\u4EF6\u5728\u5FAA\u73AF\u4F53\u4E4B\u524D\u5224\u65AD\u3002\u4F59\u989D\u4E0D\u591F\u65F6\u4E0D\u6210\u7ACB\uFF0C\u6574\u4E2A\u5FAA\u73AF\u4F53\u4E00\u904D\u90FD\u4E0D\u8DD1\u3002" },
              { fromLine: 6, toLine: 9, text: "\u548C\u4E0A\u9762\u90A3\u6BB5\u53CD\u4F8B\u76F8\u6BD4\uFF0C\u6539\u52A8\u53EA\u6709\u8FD9\u4E00\u5904\uFF1A\u6761\u4EF6\u4ECE\u672B\u5C3E\u632A\u5230\u5F00\u5934\uFF0C\u65B9\u5411\u4E5F\u8DDF\u7740\u53CD\u8FC7\u6765\u3002" }
            ],
            sampleRun: { inputs: ["5"], outputs: ["Enter the balance", "Bought: 0", "Left: 5"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0A\u9762\u4E24\u4E2A\u7248\u672C\uFF0C\u8F93\u5165 25 \u65F6\u7ED3\u679C\u6709\u533A\u522B\u5417\uFF1F",
            options: [
              {
                key: "A",
                label: "`REPEAT` \u7248\u4F1A\u62A5\u9519",
                correct: false,
                explanation: "\u4E24\u4E2A\u7248\u672C\u90FD\u5408\u6CD5\u3001\u90FD\u8DD1\u5F97\u5B8C\u3002\u8FD9\u6B63\u662F\u8FD9\u7C7B\u9519\u8BEF\u9EBB\u70E6\u7684\u5730\u65B9\u2014\u2014\u6CA1\u6709\u4EFB\u4F55\u63D0\u793A\u3002"
              },
              {
                key: "B",
                label: "\u6CA1\u6709\u533A\u522B\uFF0C\u4E24\u4E2A\u90FD\u662F\u4E70 2 \u4EF6\u3001\u5269 5 \u5143",
                correct: true,
                explanation: "\u5BF9\u300225 \u5143\u65F6\u5FAA\u73AF\u4F53\u672C\u6765\u5C31\u8BE5\u8DD1\uFF0C\u300C\u5148\u505A\u518D\u5224\u65AD\u300D\u548C\u300C\u5148\u5224\u65AD\u518D\u505A\u300D\u5F97\u5230\u7684\u662F\u540C\u4E00\u4E32\u52A8\u4F5C\u3002\u533A\u522B\u53EA\u5728\u5FAA\u73AF\u4F53\u4E00\u904D\u90FD\u4E0D\u8BE5\u8DD1\u7684\u65F6\u5019\u624D\u51FA\u73B0\u3002"
              },
              {
                key: "C",
                label: "\u6709\uFF0C`REPEAT` \u7248\u4F1A\u591A\u4E70\u4E00\u4EF6",
                correct: false,
                explanation: "25 \u5143\u8DB3\u591F\u4E70\u7B2C\u4E00\u4EF6\uFF0C\u4E24\u4E2A\u7248\u672C\u5728\u8FD9\u91CC\u7684\u884C\u4E3A\u5B8C\u5168\u4E00\u6837\uFF1A\u4E70\u3001\u518D\u5224\u65AD\u3002"
              },
              {
                key: "D",
                label: "\u6709\uFF0C`WHILE` \u7248\u4F1A\u5C11\u4E70\u4E00\u4EF6",
                correct: false,
                explanation: "`WHILE` \u4E0D\u4F1A\u5C11\u8DD1\uFF1A\u53EA\u8981\u6761\u4EF6\u6210\u7ACB\u5B83\u5C31\u7EE7\u7EED\uFF0C25 \u5230 15 \u5230 5\uFF0C\u6B63\u597D\u4E24\u904D\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "6.3",
        title: "\u5D4C\u5957\u5FAA\u73AF\uFF1A\u5916\u5C42\u4E00\u904D\uFF0C\u5185\u5C42\u8DD1\u5B8C\u4E00\u6574\u8F6E",
        syllabus: ["\xA711.2"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_6_3,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u5FAA\u73AF\u4F53\u91CC\u53EF\u4EE5\u518D\u653E\u4E00\u4E2A\u5FAA\u73AF\uFF0C\u8FD9\u53EB**\u5D4C\u5957\u5FAA\u73AF\uFF08nested loop\uFF09**\u3002\u89C4\u5219\u53EA\u6709\u4E00\u6761\uFF0C\u4F46\u8981\u60F3\u6E05\u695A\uFF1A**\u5916\u5C42\u6BCF\u8DD1\u4E00\u904D\uFF0C\u5185\u5C42\u5C31\u8981\u4ECE\u5934\u5230\u5C3E\u5B8C\u6574\u8DD1\u4E00\u8F6E\u3002**",
              "\u6240\u4EE5\u5916\u5C42 3 \u904D\u3001\u5185\u5C42 4 \u904D\u65F6\uFF0C\u6700\u91CC\u9762\u90A3\u53E5\u8BDD\u6267\u884C\u7684\u662F 3 \u4E58 4 \u7B49\u4E8E 12 \u6B21\uFF0C\u4E0D\u662F 3 \u52A0 4 \u7B49\u4E8E 7 \u6B21\u3002",
              "\u4E24\u5C42\u5FAA\u73AF\u7684\u63A7\u5236\u53D8\u91CF\u5FC5\u987B\u662F\u4E24\u4E2A\u4E0D\u540C\u7684\u53D8\u91CF\u3002\u5185\u5C42\u7528\u5B8C\u81EA\u5DF1\u90A3\u4E2A\u53D8\u91CF\u540E\uFF0C\u4E0B\u4E00\u6B21\u5916\u5C42\u518D\u8FDB\u6765\u65F6\u5B83\u4F1A\u91CD\u65B0\u4ECE\u8D77\u70B9\u5F00\u59CB\u2014\u2014\u8FD9\u662F\u81EA\u52A8\u7684\uFF0C\u4E0D\u7528\u624B\u52A8\u91CD\u7F6E\u3002",
              "\u5D4C\u5957\u4E5F\u4E0D\u9650\u4E8E\u540C\u4E00\u79CD\u5FAA\u73AF\uFF1A\u5916\u5C42 `FOR`\u3001\u5185\u5C42 `WHILE` \u5B8C\u5168\u6B63\u5E38\u3002\u6311\u54EA\u4E00\u79CD\u4ECD\u7136\u6309 6.1 \u7684\u4E24\u4E2A\u95EE\u9898\u95EE\uFF0C\u53EA\u4E0D\u8FC7\u8981**\u5206\u522B\u95EE\u4E24\u6B21**\uFF1A\u5916\u5C42\u8DD1\u591A\u5C11\u904D\u662F\u4E00\u4E2A\u95EE\u9898\uFF0C\u5185\u5C42\u8DD1\u591A\u5C11\u904D\u662F\u53E6\u4E00\u4E2A\u95EE\u9898\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u5D4C\u5957\u7684\u5FAA\u73AF\u6BCF\u4E00\u5C42\u90FD\u8981\u6709\u81EA\u5DF1\u7684\u63A7\u5236\u53D8\u91CF\u4E0E\u81EA\u5DF1\u7684\u7ED3\u675F\u6807\u8BB0\uFF0C\u5404\u7F29\u8FDB\u4E00\u7EA7\uFF08Pseudocode Guide \xA77.1\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u6570\u4E00\u6570\u6700\u91CC\u9762\u8DD1\u4E86\u51E0\u6B21",
            fileName: "Example_6_3_a.pseudocode",
            code: [
              "DECLARE I : INTEGER",
              "DECLARE J : INTEGER",
              "DECLARE N : INTEGER",
              "N \u2190 0",
              "FOR I \u2190 1 TO 3",
              "   FOR J \u2190 1 TO 4",
              "      N \u2190 N + 1",
              "   NEXT J",
              "NEXT I",
              'OUTPUT "Body ran ", N, " times"'
            ].join("\n"),
            annotations: [
              { fromLine: 5, toLine: 5, text: "\u5916\u5C42\u8DD1 3 \u904D\uFF0C`I` \u4F9D\u6B21\u662F 1\u30012\u30013\u3002" },
              { fromLine: 6, toLine: 6, text: "\u6BCF\u6B21\u8FDB\u5230\u8FD9\u91CC\uFF0C`J` \u90FD\u91CD\u65B0\u4ECE 1 \u5F00\u59CB\u6570\u5230 4\u3002" },
              { fromLine: 7, toLine: 7, text: "\u8FD9\u4E00\u53E5\u88AB\u6267\u884C\u7684\u6B21\u6570\u662F\u4E24\u5C42\u6B21\u6570\u7684\u4E58\u79EF\u3002" },
              { fromLine: 8, toLine: 9, text: "\u4E24\u4E2A `NEXT`\uFF0C\u5404\u81EA\u5173\u6389\u4E00\u5C42\u3002\u5148\u5173\u5185\u5C42\uFF0C\u518D\u5173\u5916\u5C42\u2014\u2014\u987A\u5E8F\u4E0D\u80FD\u4EA4\u53C9\u3002" }
            ],
            sampleRun: { inputs: [], outputs: ["Body ran 12 times"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u5916\u5C42 `FOR I \u2190 1 TO 5`\uFF0C\u5185\u5C42 `FOR J \u2190 1 TO 3`\uFF0C\u6700\u91CC\u9762\u90A3\u4E00\u53E5\u6267\u884C\u591A\u5C11\u6B21\uFF1F",
            options: [
              {
                key: "A",
                label: "3 \u6B21",
                correct: false,
                explanation: "3 \u662F\u5185\u5C42\u4E00\u8F6E\u7684\u904D\u6570\uFF0C\u90A3\u53EA\u662F\u5916\u5C42\u7B2C\u4E00\u904D\u7684\u60C5\u51B5\u3002"
              },
              {
                key: "B",
                label: "15 \u6B21",
                correct: true,
                explanation: "\u5BF9\u3002\u5916\u5C42\u6BCF\u4E00\u904D\u90FD\u8981\u628A\u5185\u5C42\u4ECE 1 \u5230 3 \u5B8C\u6574\u8DD1\u4E00\u8F6E\uFF0C\u6240\u4EE5\u662F 5 \u4E58 3\u3002"
              },
              {
                key: "C",
                label: "8 \u6B21",
                correct: false,
                explanation: "\u628A\u4E24\u5C42\u76F8\u52A0\uFF0C\u7B49\u4E8E\u628A\u5B83\u4EEC\u5F53\u6210\u5148\u540E\u53D1\u751F\u7684\u4E24\u4EF6\u4E8B\u3002\u5D4C\u5957\u4E0D\u662F\u5148\u540E\uFF0C\u662F\u5305\u542B\u3002"
              },
              {
                key: "D",
                label: "5 \u6B21",
                correct: false,
                explanation: "5 \u662F\u5916\u5C42\u7684\u904D\u6570\u3002\u5916\u5C42\u8DD1\u4E00\u904D\uFF0C\u91CC\u9762\u90A3\u53E5\u8BDD\u5DF2\u7ECF\u6267\u884C\u4E86 3 \u6B21\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "6.4",
        title: "\u5D4C\u5957\u5FAA\u73AF\u7684\u4E24\u79CD\u5E38\u89C1\u5F62\u72B6",
        syllabus: ["\xA711.2"],
        estimatedMinutes: 8,
        taughtFeatures: AFTER_6_3,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u5D4C\u5957\u5FAA\u73AF\u770B\u7740\u62BD\u8C61\uFF0C\u5B9E\u9645\u7528\u9014\u96C6\u4E2D\u5728\u4E24\u79CD\u5F62\u72B6\u4E0A\u3002\u8BA4\u51FA\u5F62\u72B6\uFF0C\u4EE3\u7801\u5C31\u5199\u5F97\u51FA\u6765\u3002**\u7B2C\u4E00\u79CD\u662F\u884C\u548C\u5217**\uFF1A\u5916\u5C42\u7BA1\u884C\uFF0C\u5185\u5C42\u7BA1\u5217\u3002\u4E58\u6CD5\u8868\u3001\u65E5\u5386\u3001\u6210\u7EE9\u8868\u90FD\u662F\u8FD9\u4E2A\u5F62\u72B6\uFF0C\u51E1\u662F\u300C\u4E00\u5F20\u8868\u683C\u300D\u90FD\u662F\u4E24\u5C42\u5FAA\u73AF\u3002",
              "**\u7B2C\u4E8C\u79CD\u662F\u5185\u5C42\u7684\u6B21\u6570\u968F\u5916\u5C42\u53D8**\uFF1A\u5185\u5C42\u7684\u7EC8\u70B9\u4E0D\u5199\u6B7B\uFF0C\u800C\u662F\u5199\u6210\u5916\u5C42\u7684\u63A7\u5236\u53D8\u91CF\uFF0C\u6BD4\u5982 `FOR J \u2190 1 TO I`\u3002\u8FD9\u6837\u7B2C\u4E00\u884C\u505A 1 \u6B21\u3001\u7B2C\u4E8C\u884C\u505A 2 \u6B21\u2026\u2026\u753B\u51FA\u6765\u662F\u4E2A\u4E09\u89D2\u5F62\u3002",
              "\u8981\u7559\u5FC3\u7684\u662F**\u8F93\u51FA\u7684\u4F4D\u7F6E**\u3002\u5199\u5728\u5185\u5C42\u91CC\u9762\uFF0C\u6BCF\u7B97\u4E00\u4E2A\u5C31\u663E\u793A\u4E00\u884C\uFF1B\u5199\u5728\u5185\u5C42\u5916\u9762\u3001\u5916\u5C42\u91CC\u9762\uFF0C\u6BCF\u884C\u663E\u793A\u4E00\u6B21\uFF1B\u5199\u5728\u4E24\u5C42\u5916\u9762\uFF0C\u6574\u4E2A\u8FC7\u7A0B\u53EA\u663E\u793A\u4E00\u6B21\u3002\u8FD9\u4E09\u4E2A\u4F4D\u7F6E\u7ED9\u51FA\u7684\u7ED3\u679C\u5B8C\u5168\u4E0D\u540C\uFF0C\u800C\u7F29\u8FDB\u6B63\u597D\u628A\u4F4D\u7F6E\u5199\u5F97\u6E05\u6E05\u695A\u695A\u3002"
            ]
          },
          {
            kind: "example",
            title: "\u4E24\u884C\u4E58\u6CD5\u8868",
            fileName: "Example_6_4_a.pseudocode",
            code: [
              "DECLARE I : INTEGER",
              "DECLARE J : INTEGER",
              "FOR I \u2190 1 TO 2",
              "   FOR J \u2190 1 TO 3",
              '      OUTPUT I, " x ", J, " = ", I * J',
              "   NEXT J",
              "NEXT I"
            ].join("\n"),
            annotations: [
              { fromLine: 3, toLine: 3, text: "\u5916\u5C42\u7BA1\u884C\uFF0C`I` \u662F\u88AB\u4E58\u6570\u3002" },
              { fromLine: 4, toLine: 4, text: "\u5185\u5C42\u7BA1\u5217\uFF0C`J` \u4ECE 1 \u6570\u5230 3\u3002" },
              { fromLine: 5, toLine: 5, text: "\u8FD9\u4E00\u53E5\u5728\u6700\u91CC\u5C42\uFF0C\u6240\u4EE5\u6BCF\u4E00\u5BF9 `I`\u3001`J` \u90FD\u663E\u793A\u4E00\u884C\uFF0C\u4E00\u5171 2 \u4E58 3 \u7B49\u4E8E 6 \u884C\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["1 x 1 = 1", "1 x 2 = 2", "1 x 3 = 3", "2 x 1 = 2", "2 x 2 = 4", "2 x 3 = 6"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u628A\u4E0A\u9762\u7684 `OUTPUT` \u90A3\u4E00\u884C\u4ECE\u5185\u5C42\u91CC\u9762\u632A\u5230 `NEXT J` \u7684\u540E\u9762\uFF08\u4ECD\u5728\u5916\u5C42\u91CC\u9762\uFF09\uFF0C\u4F1A\u600E\u6837\uFF1F",
            options: [
              {
                key: "A",
                label: "\u8FD8\u662F 6 \u884C\uFF0C\u53EA\u662F\u987A\u5E8F\u53D8\u4E86",
                correct: false,
                explanation: "\u663E\u793A\u51E0\u884C\u53D6\u51B3\u4E8E\u8FD9\u4E00\u53E5\u88AB\u6267\u884C\u51E0\u6B21\u3002\u79BB\u5F00\u5185\u5C42\u4E4B\u540E\uFF0C\u5B83\u4E00\u8F6E\u53EA\u6267\u884C\u4E00\u6B21\u3002"
              },
              {
                key: "B",
                label: "\u4E00\u5171\u663E\u793A 3 \u884C",
                correct: false,
                explanation: "3 \u662F\u5185\u5C42\u7684\u904D\u6570\u3002\u8FD9\u4E00\u53E5\u73B0\u5728\u5F52\u5916\u5C42\u7BA1\uFF0C\u548C\u5185\u5C42\u8DD1\u51E0\u904D\u6CA1\u5173\u7CFB\u4E86\u3002"
              },
              {
                key: "C",
                label: "\u7F16\u8F91\u5668\u4F1A\u62E6\u4E0B\u6765",
                correct: false,
                explanation: "\u4E24\u4E2A\u4F4D\u7F6E\u90FD\u5408\u6CD5\u3002\u8FD9\u6B63\u662F\u8981\u5C0F\u5FC3\u7684\u5730\u65B9\uFF1A\u4F4D\u7F6E\u653E\u9519\u4E0D\u4F1A\u62A5\u9519\uFF0C\u53EA\u4F1A\u7B97\u9519\u3002"
              },
              {
                key: "D",
                label: "\u4E00\u5171\u663E\u793A 2 \u884C",
                correct: true,
                explanation: "\u5BF9\u3002\u632A\u5230 `NEXT J` \u540E\u9762\u5B83\u5C31\u5F52\u5916\u5C42\u7BA1\u4E86\u2014\u2014\u5916\u5C42\u8DD1\u51E0\u904D\u5C31\u663E\u793A\u51E0\u904D\uFF0C\u4E0D\u518D\u662F\u6BCF\u4E00\u5217\u5404\u4E00\u884C\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "6.4.1",
            title: "\u5012\u4E09\u89D2",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u63D0\u793A\u5E76\u8BFB\u5165\u4E00\u4E2A\u6574\u6570 `N`\uFF0C\u663E\u793A `N` \u7EC4\u6570\u5B57\u2014\u2014\u7B2C\u4E00\u7EC4\u662F 1 \u4E2A `1`\uFF0C\u7B2C\u4E8C\u7EC4\u662F 2 \u4E2A `2`\uFF0C\u4E00\u76F4\u5230\u7B2C `N` \u7EC4\u662F `N` \u4E2A `N`\u3002\u6BCF\u4E2A\u6570\u5B57\u5404\u5360\u4E00\u884C\u3002",
            ioSpec: {
              input: ["\u4E00\u884C\uFF0C\u4E00\u4E2A `INTEGER`\u3002\u63D0\u793A\u8BED\u6392\u5728\u8BFB\u53D6\u4E4B\u524D\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a number`"].join("\n"),
              output: "\u82E5\u5E72\u884C\uFF0C\u6BCF\u884C\u4E00\u4E2A\u6570\u5B57\u3002\u8BFB\u5230\u7684\u6570\u4E0D\u662F\u6B63\u6570\u65F6\uFF0C\u4E00\u884C\u90FD\u4E0D\u663E\u793A\u3002"
            },
            constraints: {
              require: [
                {
                  feature: "loop.nested",
                  reason: "\u5916\u5C42\u7BA1\u7B2C\u51E0\u7EC4\uFF0C\u5185\u5C42\u7BA1\u8FD9\u4E00\u7EC4\u8981\u663E\u793A\u51E0\u4E2A\uFF0C\u4E24\u4EF6\u4E8B\u5FC5\u987B\u5206\u6210\u4E24\u5C42\u3002"
                },
                {
                  feature: "loop.for",
                  reason: "\u4E24\u5C42\u7684\u6B21\u6570\u5728\u8FDB\u5165\u5FAA\u73AF\u65F6\u90FD\u5DF2\u7ECF\u7B97\u5F97\u51FA\u6765\uFF0C\u4E0D\u9700\u8981\u8FB9\u8DD1\u8FB9\u5224\u65AD\u3002"
                }
              ],
              forbid: [
                {
                  feature: "loop.while",
                  reason: "\u6B21\u6570\u90FD\u662F\u5DF2\u77E5\u7684\uFF0C\u8FD9\u4E00\u9898\u8981\u7EC3\u7684\u662F\u628A\u8BA1\u6570\u4EA4\u7ED9 `FOR` \u7684\u4E24\u5C42\u5199\u6CD5\u3002"
                }
              ]
            },
            hints: [
              "\u7B2C\u51E0\u7EC4\u548C\u8FD9\u4E00\u7EC4\u8981\u663E\u793A\u51E0\u4E2A\uFF0C\u662F\u540C\u4E00\u4E2A\u6570\u3002\u5185\u5C42\u7684\u7EC8\u70B9\u53EF\u4EE5\u76F4\u63A5\u5199\u5916\u5C42\u7684\u63A7\u5236\u53D8\u91CF\u3002",
              "\u6BCF\u884C\u8981\u663E\u793A\u7684\u5185\u5BB9\u4E5F\u662F\u90A3\u4E2A\u6570\uFF1A\u5185\u5C42\u91CC\u663E\u793A\u7684\u662F\u5916\u5C42\u7684\u63A7\u5236\u53D8\u91CF\uFF0C\u4E0D\u662F\u5185\u5C42\u7684\u3002"
            ],
            examples: [{ inputs: ["2"], outputs: ["Enter a number", "1", "2", "2"] }],
            referenceSolution: [
              "DECLARE Number : INTEGER",
              "DECLARE I : INTEGER",
              "DECLARE J : INTEGER",
              'OUTPUT "Enter a number"',
              "INPUT Number",
              "FOR I \u2190 1 TO Number",
              "   FOR J \u2190 1 TO I",
              "      OUTPUT I",
              "   NEXT J",
              "NEXT I"
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["3"], caseHint: "\u4E00\u4E2A\u5F88\u5C0F\u7684\u6570\u3002" },
              { id: "t2", kind: "normal", inputs: ["5"], caseHint: "\u4E00\u4E2A\u666E\u901A\u5927\u5C0F\u7684\u6570\u3002" },
              { id: "t3", kind: "boundary", inputs: ["1"], caseHint: "\u53EA\u8BE5\u663E\u793A\u4E00\u884C\u7684\u90A3\u4E2A\u6570\u3002" },
              { id: "t4", kind: "boundary", inputs: ["0"], caseHint: "\u4E00\u884C\u90FD\u4E0D\u8BE5\u663E\u793A\u7684\u90A3\u4E2A\u6570\u3002" },
              { id: "t5", kind: "extreme", inputs: ["9"], caseHint: "\u4F1A\u663E\u793A\u5F88\u591A\u884C\u7684\u4E00\u4E2A\u6570\u3002" }
            ]
          }
        ]
      }
    ],
    chapterTasks: [
      {
        kind: "chapterTask",
        id: "6.T1",
        title: "\u4E09\u4E2A\u73ED\u7684\u5206\u6570",
        statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u4F9D\u6B21\u7EDF\u8BA1\u4E09\u4E2A\u73ED\u7684\u5206\u6570\u3002\u6BCF\u4E2A\u73ED\u7684\u4EBA\u6570\u4E8B\u5148\u4E0D\u77E5\u9053\uFF0C\u8BFB\u5230 -1 \u8868\u793A\u8FD9\u4E2A\u73ED\u5F55\u5B8C\u4E86\uFF1B\u4E09\u4E2A\u73ED\u5168\u90E8\u5F55\u5B8C\u540E\u7A0B\u5E8F\u7ED3\u675F\u3002\u67D0\u4E2A\u73ED\u53EF\u80FD\u4E00\u4E2A\u5206\u6570\u90FD\u6CA1\u6709\u3002",
        ioSpec: {
          input: [
            "\u82E5\u5E72\u884C\uFF0C\u6BCF\u884C\u4E00\u4E2A `INTEGER`\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
            "`Enter a score`",
            "\u6BCF\u4E2A\u73ED\u4EE5 -1 \u7ED3\u675F\uFF0C-1 \u672C\u8EAB\u4E0D\u662F\u5206\u6570\u3002"
          ].join("\n"),
          output: [
            "\u6BCF\u4E2A\u73ED\u5F55\u5B8C\u540E\u7ACB\u523B\u663E\u793A\u4E00\u884C\uFF1A",
            "`Class <\u73ED\u53F7>: count <\u4EBA\u6570> total <\u603B\u5206>`",
            "\u73ED\u53F7\u4ECE 1 \u5230 3\u3002\u4E00\u4E2A\u5206\u6570\u90FD\u6CA1\u6709\u7684\u73ED\u663E\u793A `count 0 total 0`\u3002"
          ].join("\n")
        },
        suggestedFeatures: ["loop.for", "loop.while", "loop.nested", "op.relational", "io.input", "io.output"],
        hints: [
          "\u8FD9\u9053\u9898\u91CC\u6709\u4E24\u5C42\u5FAA\u73AF\uFF0C\u4E24\u5C42\u8981\u5206\u522B\u6309 6.1 \u7684\u4E24\u4E2A\u95EE\u9898\u6311\uFF1A\u73ED\u6570\u662F\u4E8B\u5148\u77E5\u9053\u7684\uFF0C\u4EBA\u6570\u4E0D\u662F\u3002",
          "\u6BCF\u8FDB\u4E00\u4E2A\u65B0\u73ED\uFF0C\u8BA1\u6570\u548C\u603B\u5206\u90FD\u8981\u91CD\u65B0\u4ECE 0 \u5F00\u59CB\u2014\u2014\u8FD9\u4E24\u53E5\u653E\u5728\u54EA\u4E00\u5C42\u91CC\uFF0C\u4F4D\u7F6E\u5F88\u91CD\u8981\u3002",
          "\u663E\u793A\u90A3\u4E00\u884C\u653E\u5728\u5185\u5C42\u5FAA\u73AF\u7684\u540E\u9762\u3001\u5916\u5C42\u5FAA\u73AF\u7684\u91CC\u9762\uFF0C\u624D\u80FD\u505A\u5230\u6BCF\u73ED\u4E00\u884C\u3002"
        ],
        examples: [
          {
            inputs: ["10", "20", "-1", "30", "-1", "-1"],
            outputs: [
              "Enter a score",
              "Enter a score",
              "Enter a score",
              "Class 1: count 2 total 30",
              "Enter a score",
              "Enter a score",
              "Class 2: count 1 total 30",
              "Enter a score",
              "Class 3: count 0 total 0"
            ]
          }
        ],
        referenceSolution: [
          "DECLARE ClassNo : INTEGER",
          "DECLARE Score : INTEGER",
          "DECLARE Count : INTEGER",
          "DECLARE Total : INTEGER",
          "FOR ClassNo \u2190 1 TO 3",
          "   Count \u2190 0",
          "   Total \u2190 0",
          '   OUTPUT "Enter a score"',
          "   INPUT Score",
          "   WHILE Score <> -1",
          "      Total \u2190 Total + Score",
          "      Count \u2190 Count + 1",
          '      OUTPUT "Enter a score"',
          "      INPUT Score",
          "   ENDWHILE",
          '   OUTPUT "Class ", ClassNo, ": count ", Count, " total ", Total',
          "NEXT ClassNo"
        ].join("\n"),
        tests: [
          { id: "t1", kind: "normal", inputs: ["80", "70", "-1", "-1", "90", "-1"], caseHint: "\u4E2D\u95F4\u90A3\u4E2A\u73ED\u4E00\u4E2A\u4EBA\u90FD\u6CA1\u6709\u3002" },
          { id: "t2", kind: "normal", inputs: ["50", "-1", "60", "70", "-1", "80", "-1"], caseHint: "\u4E09\u4E2A\u73ED\u4EBA\u6570\u5404\u4E0D\u76F8\u540C\u3002" },
          { id: "t3", kind: "boundary", inputs: ["-1", "-1", "-1"], caseHint: "\u4E09\u4E2A\u73ED\u4E00\u4E2A\u5206\u6570\u90FD\u6CA1\u6709\u3002" },
          { id: "t4", kind: "boundary", inputs: ["0", "-1", "-1", "100", "-1"], caseHint: "\u51FA\u73B0\u4E86\u6700\u4F4E\u5206\u548C\u6700\u9AD8\u5206\uFF0C\u4E2D\u95F4\u90A3\u4E2A\u73ED\u662F\u7A7A\u7684\u3002" },
          { id: "t5", kind: "extreme", inputs: ["99999", "1", "-1", "-1", "-1"], caseHint: "\u7B2C\u4E00\u4E2A\u73ED\u91CC\u6709\u4E00\u4E2A\u975E\u5E38\u5927\u7684\u5206\u6570\u3002" }
        ]
      }
    ]
  };

  // packages/teaching-content/src/chapter-07.ts
  var AFTER_CHAPTER_6 = [
    "io.output",
    "io.input",
    "decl.variable",
    "misc.comment",
    "type.string",
    "literal.string",
    "type.integer",
    "type.real",
    "type.char",
    "type.boolean",
    "type.date",
    "literal.integer",
    "literal.real",
    "literal.char",
    "literal.boolean",
    "literal.date",
    "assign.simple",
    "decl.constant",
    "op.arithmetic",
    "op.div",
    "op.mod",
    "op.relational",
    "op.and",
    "op.or",
    "op.not",
    "select.if",
    "select.if-else",
    "select.nested-if",
    "select.case",
    "select.case-range",
    "select.case-otherwise",
    "loop.for",
    "loop.for-step",
    "loop.while",
    "loop.repeat",
    "loop.nested"
  ];
  var AFTER_7_2 = [...AFTER_CHAPTER_6, "builtin.length", "builtin.mid", "builtin.right"];
  var AFTER_7_3 = [...AFTER_7_2, "builtin.ucase", "builtin.lcase"];
  var AFTER_7_4 = [...AFTER_7_3, "op.concat"];
  var AFTER_7_5 = [...AFTER_7_4, "builtin.int", "builtin.rand"];
  var chapter07 = {
    id: 7,
    title: "\u5B57\u7B26\u4E32\u4E0E\u5185\u7F6E\u51FD\u6570",
    level: "AS",
    syllabus: ["\xA711.1", "G\xA75.5", "G\xA75.6"],
    prerequisites: [1, 2, 3, 4, 5, 6],
    sections: [
      {
        id: "7.1",
        title: "`CHAR` \u4E0E `STRING`\uFF1A\u4E24\u79CD\u6587\u5B57",
        syllabus: ["\xA711.1", "G\xA75.5"],
        estimatedMinutes: 8,
        taughtFeatures: AFTER_CHAPTER_6,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u7B2C 2 \u7AE0\u5217\u8FC7\u516D\u79CD\u57FA\u672C\u7C7B\u578B\uFF0C\u5176\u4E2D\u6709\u4E24\u79CD\u662F\u6587\u5B57\u3002`CHAR` \u662F**\u6070\u597D\u4E00\u4E2A\u5B57\u7B26**\uFF0C\u5B57\u9762\u91CF\u5199\u5728\u5355\u5F15\u53F7\u91CC\uFF1A`'A'`\u3001`'7'`\u3001`' '`\u3002`STRING` \u662F\u4E00\u4E32\u5B57\u7B26\uFF0C\u53EF\u4EE5\u662F\u96F6\u4E2A\u3001\u4E00\u4E2A\u6216\u5F88\u591A\u4E2A\uFF0C\u5B57\u9762\u91CF\u5199\u5728\u53CC\u5F15\u53F7\u91CC\uFF1A`\"A\"`\u3001`\"Hello\"`\u3001`\"\"`\u3002",
              "\u5173\u952E\u5728\u4E8E\uFF1A**`\"A\"` \u548C `'A'` \u4E0D\u662F\u540C\u4E00\u4E2A\u4E1C\u897F\u3002** \u524D\u8005\u662F\u957F\u5EA6\u4E3A 1 \u7684 `STRING`\uFF0C\u540E\u8005\u662F `CHAR`\u3002\u5B83\u4EEC\u957F\u5F97\u4E00\u6A21\u4E00\u6837\uFF0C\u7C7B\u578B\u5374\u4E0D\u540C\uFF0C\u6240\u4EE5\u4E0D\u80FD\u4E92\u76F8\u8D4B\u503C\uFF0C\u4E5F\u4E0D\u80FD\u76F4\u63A5\u6BD4\u8F83\u2014\u2014\u7F16\u8F91\u5668\u4F1A\u5728\u8FD0\u884C\u524D\u5C31\u62E6\u4E0B\u6765\u3002",
              "\u8FD9\u6761\u89C4\u77E9\u6709\u70B9\u4E25\uFF0C\u4F46\u5B83\u662F\u6709\u7528\u7684\uFF1A\u4E24\u7C7B\u51FD\u6570\u8981\u7684\u4E1C\u897F\u4E0D\u4E00\u6837\u3002`LENGTH`\u3001`MID`\u3001`RIGHT` \u53EA\u6536 `STRING`\uFF0C`UCASE`\u3001`LCASE` \u53EA\u6536 `CHAR`\u3002\u641E\u6E05\u695A\u624B\u91CC\u62FF\u7684\u662F\u54EA\u4E00\u79CD\uFF0C\u624D\u77E5\u9053\u80FD\u5BF9\u5B83\u505A\u4EC0\u4E48\u3002",
              "`INPUT` \u8BFB\u8FDB\u6765\u7684\u662F\u54EA\u4E00\u79CD\uFF0C\u7531\u53D8\u91CF\u7684\u58F0\u660E\u51B3\u5B9A\uFF1A`DECLARE C : CHAR` \u540E\u9762\u7684 `INPUT C` \u53EA\u63A5\u53D7\u6070\u597D\u4E00\u4E2A\u5B57\u7B26\uFF0C\u591A\u6253\u4E00\u4E2A\u5C31\u4F1A\u88AB\u9000\u56DE\u6765\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "`CHAR` \u7528\u5355\u5F15\u53F7\uFF0C\u6070\u597D\u4E00\u4E2A\u5B57\u7B26\uFF1B`STRING` \u7528\u53CC\u5F15\u53F7\uFF0C\u957F\u5EA6\u4E0D\u9650\u3002\u4E24\u8005\u662F\u4E0D\u540C\u7684\u7C7B\u578B\uFF08Pseudocode Guide \xA75.5\uFF09\u3002"
              }
            ]
          },
          {
            kind: "counterExample",
            title: "\u628A\u957F\u5EA6\u4E3A 1 \u7684 `STRING` \u5F53\u6210 `CHAR`",
            cases: [
              {
                title: "\u4E0D\u80FD\u8D4B\u8FC7\u53BB",
                code: [
                  "DECLARE C : CHAR",
                  "DECLARE S : STRING",
                  'S \u2190 "a"',
                  "C \u2190 S",
                  "OUTPUT C"
                ].join("\n"),
                note: "\u7F16\u8F91\u5668\u5728\u7B2C 4 \u884C\u5C31\u62E6\u4E0B\u6765\u3002`\"a\"` \u91CC\u53EA\u6709\u4E00\u4E2A\u5B57\u6BCD\uFF0C\u770B\u7740\u548C `'a'` \u6CA1\u5DEE\u522B\uFF0C\u4F46\u5B83\u7684\u7C7B\u578B\u662F `STRING`\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "ASSIGN-002", line: 4, text: "\u4E0D\u80FD\u628A `STRING` \u8D4B\u7ED9 `CHAR`\u3002" }
                ]
              },
              {
                title: "\u4E5F\u4E0D\u80FD\u62FF\u6765\u6BD4",
                code: [
                  "DECLARE C : CHAR",
                  "C \u2190 'a'",
                  'IF C = "a" THEN',
                  '   OUTPUT "same"',
                  "ENDIF"
                ].join("\n"),
                note: "\u7B2C 3 \u884C\u7684\u6BD4\u8F83\u4E24\u8FB9\u4E00\u8FB9\u662F `CHAR` \u4E00\u8FB9\u662F `STRING`\uFF0C\u7C7B\u578B\u5BF9\u4E0D\u4E0A\u3002\u8981\u6BD4\u5C31\u4E24\u8FB9\u90FD\u7528\u5355\u5F15\u53F7\uFF1A`C = 'a'`\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "OP-003", line: 3, text: "\u6BD4\u8F83\u7684\u4E24\u8FB9\u7C7B\u578B\u8981\u5BF9\u5F97\u4E0A\uFF0C\u4E00\u8FB9 `CHAR` \u4E00\u8FB9 `STRING` \u4E0D\u884C\u3002" }
                ]
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`DECLARE Letter : CHAR` \u4E4B\u540E\uFF0C\u54EA\u4E00\u884C\u662F\u5BF9\u7684\uFF1F",
            options: [
              {
                key: "A",
                label: "Letter \u2190 B",
                correct: false,
                explanation: "\u4E0D\u52A0\u5F15\u53F7\u7684 `B` \u4F1A\u88AB\u5F53\u6210\u4E00\u4E2A\u53D8\u91CF\u540D\uFF0C\u800C\u4E0D\u662F\u5B57\u6BCD B \u672C\u8EAB\u3002"
              },
              {
                key: "B",
                label: "Letter \u2190 'B'",
                correct: true,
                explanation: "\u5BF9\u3002\u5355\u5F15\u53F7\u3001\u6070\u597D\u4E00\u4E2A\u5B57\u7B26\uFF0C\u8FD9\u5C31\u662F\u4E00\u4E2A `CHAR` \u5B57\u9762\u91CF\u3002"
              },
              {
                key: "C",
                label: 'Letter \u2190 "B"',
                correct: false,
                explanation: "\u53CC\u5F15\u53F7\u91CC\u7684\u662F `STRING`\uFF0C\u54EA\u6015\u53EA\u6709\u4E00\u4E2A\u5B57\u6BCD\u3002`CHAR` \u53D8\u91CF\u53EA\u6536 `CHAR`\u3002"
              },
              {
                key: "D",
                label: "Letter \u2190 'AB'",
                correct: false,
                explanation: "\u5355\u5F15\u53F7\u91CC\u53EA\u80FD\u653E\u4E00\u4E2A\u5B57\u7B26\u3002\u4E24\u4E2A\u5B57\u7B26\u8981\u7528\u53CC\u5F15\u53F7\uFF0C\u800C\u90A3\u5C31\u662F `STRING` \u4E86\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "7.2",
        title: "`LENGTH`\u3001`MID`\u3001`RIGHT`\uFF1A\u628A\u6587\u5B57\u62C6\u5F00",
        syllabus: ["\xA711.1", "G\xA75.6"],
        estimatedMinutes: 10,
        taughtFeatures: AFTER_7_2,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u51FD\u6570\u662F\u4E00\u6BB5\u5199\u597D\u7684\u3001\u80FD\u7B97\u51FA\u4E00\u4E2A\u503C\u7684\u4E1C\u897F\uFF1A\u4F60\u7ED9\u5B83\u4E00\u4E9B\u503C\uFF0C\u5B83\u8FD8\u4F60\u4E00\u4E2A\u503C\u3002\u5199\u6CD5\u662F\u51FD\u6570\u540D\u52A0\u5706\u62EC\u53F7\uFF0C\u62EC\u53F7\u91CC\u662F\u8981\u7ED9\u5B83\u7684\u503C\uFF0C\u6BD4\u5982 `LENGTH(Name)`\u3002\u7B97\u51FA\u6765\u7684\u503C\u8981\u7528\u6389\u2014\u2014\u8D4B\u7ED9\u4E00\u4E2A\u53D8\u91CF\uFF0C\u6216\u8005\u76F4\u63A5 `OUTPUT`\u3002",
              "\u8FD9\u4E00\u8282\u7684\u4E09\u4E2A\u51FD\u6570\u90FD\u5728\u56DE\u7B54\u300C\u8FD9\u6BB5\u6587\u5B57\u91CC\u6709\u4EC0\u4E48\u300D\u3002`LENGTH(S)` \u6536\u4E00\u4E2A `STRING`\uFF0C\u8FD8\u4F60\u5B83\u6709\u51E0\u4E2A\u5B57\u7B26\uFF0C\u662F `INTEGER`\u3002`MID(S, Start, Count)` \u4ECE\u7B2C `Start` \u4E2A\u5B57\u7B26\u5F00\u59CB\u53D6 `Count` \u4E2A\uFF0C\u8FD8\u4F60\u4E00\u4E2A `STRING`\u3002`RIGHT(S, Count)` \u8FD8\u4F60\u6700\u540E `Count` \u4E2A\u5B57\u7B26\u3002",
              '`MID` \u7684\u8D77\u70B9**\u4ECE 1 \u5F00\u59CB\u6570**\uFF0C\u4E0D\u662F\u4ECE 0\u3002`MID("Computer", 1, 3)` \u7ED9\u51FA `"Com"`\u3002**Pseudocode Guide \u91CC\u6CA1\u6709 `LEFT`**\u2014\u2014\u8981\u53D6\u5F00\u5934\u7684\u51E0\u4E2A\u5B57\u7B26\uFF0C\u7528 `MID(S, 1, n)`\uFF0C\u6548\u679C\u4E00\u6837\uFF1B\u5199 `LEFT(...)` \u7F16\u8F91\u5668\u4F1A\u8BF4\u627E\u4E0D\u5230\u8FD9\u4E2A\u540D\u5B57\u3002',
              '\u53D6\u7684\u8303\u56F4\u8D85\u51FA\u6587\u5B57\u672C\u8EAB\u65F6\uFF0C\u7A0B\u5E8F\u4F1A\u5728\u90A3\u4E00\u884C\u505C\u4E0B\u6765\uFF1A`MID("abc", 5, 1)` \u4ECE\u7B2C 5 \u4E2A\u5B57\u7B26\u5F00\u59CB\u53D6\uFF0C\u53EF `"abc"` \u53EA\u6709 3 \u4E2A\u3002\u8FD9\u79CD\u9519\u9759\u6001\u68C0\u67E5\u770B\u4E0D\u51FA\u6765\u2014\u2014\u8D77\u70B9\u662F\u591A\u5C11\u8981\u8DD1\u8D77\u6765\u624D\u77E5\u9053\u3002'
            ],
            callouts: [
              {
                source: "CAIE",
                text: "`LENGTH(ThisString : STRING) RETURNS INTEGER`\uFF1B`MID(ThisString : STRING, x : INTEGER, y : INTEGER) RETURNS STRING`\uFF0C\u4ECE\u7B2C x \u4E2A\u5B57\u7B26\u8D77\u53D6 y \u4E2A\uFF1B`RIGHT(ThisString : STRING, x : INTEGER) RETURNS STRING`\uFF08Pseudocode Guide \xA75.6\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u62C6\u5F00\u4E00\u4E2A\u5355\u8BCD",
            fileName: "Example_7_2_a.pseudocode",
            code: [
              "DECLARE Word : STRING",
              'Word \u2190 "Computer"',
              'OUTPUT "Length: ", LENGTH(Word)',
              'OUTPUT "First three: ", MID(Word, 1, 3)',
              'OUTPUT "Middle two: ", MID(Word, 4, 2)',
              'OUTPUT "Last three: ", RIGHT(Word, 3)'
            ].join("\n"),
            annotations: [
              { fromLine: 3, toLine: 3, text: "`LENGTH` \u8FD8\u56DE\u6765\u7684\u662F `INTEGER`\uFF0C\u53EF\u4EE5\u76F4\u63A5\u8DDF\u5728 `OUTPUT` \u7684\u9017\u53F7\u540E\u9762\u663E\u793A\u3002" },
              { fromLine: 4, toLine: 4, text: "\u8D77\u70B9 1\u3001\u53D6 3 \u4E2A\uFF0C\u8FD9\u5C31\u662F\u300C\u5F00\u5934\u4E09\u4E2A\u5B57\u7B26\u300D\u7684\u5199\u6CD5\u3002" },
              { fromLine: 5, toLine: 5, text: "\u8D77\u70B9 4\u3001\u53D6 2 \u4E2A\u2014\u2014`C`\u3001`o`\u3001`m` \u662F\u7B2C 1\u30012\u30013 \u4E2A\uFF0C\u6240\u4EE5\u7B2C 4 \u4E2A\u662F `p`\u3002" },
              { fromLine: 6, toLine: 6, text: "`RIGHT` \u4ECE\u53F3\u8FB9\u6570\uFF0C\u4E0D\u7528\u7BA1\u603B\u957F\u5EA6\u662F\u591A\u5C11\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["Length: 8", "First three: Com", "Middle two: pu", "Last three: ter"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: '`MID("Pseudocode", 3, 4)` \u7684\u7ED3\u679C\u662F\u4EC0\u4E48\uFF1F',
            options: [
              {
                key: "A",
                label: "Pseu",
                correct: false,
                explanation: "\u8FD9\u662F `MID(S, 1, 4)`\uFF0C\u4E5F\u5C31\u662F\u5F00\u5934\u56DB\u4E2A\u5B57\u7B26\u3002\u7B2C\u4E8C\u4E2A\u53C2\u6570\u662F\u8D77\u70B9\uFF0C\u4E0D\u662F\u4E2A\u6570\u3002"
              },
              {
                key: "B",
                label: "eudo",
                correct: true,
                explanation: "\u5BF9\u3002\u4ECE\u7B2C 3 \u4E2A\u5B57\u7B26\u5F00\u59CB\u6570\uFF1A`P` \u662F 1\u3001`s` \u662F 2\u3001`e` \u662F 3\u3002\u4ECE `e` \u8D77\u53D6 4 \u4E2A\uFF0C\u662F `e`\u3001`u`\u3001`d`\u3001`o`\u3002"
              },
              {
                key: "C",
                label: "seud",
                correct: false,
                explanation: "\u8FD9\u662F\u4ECE\u7B2C 2 \u4E2A\u5B57\u7B26\u5F00\u59CB\u53D6\u7684\u7ED3\u679C\u3002`MID` \u7684\u8D77\u70B9\u4ECE 1 \u6570\u8D77\uFF0C\u7B2C 3 \u4E2A\u4E0D\u662F `s`\u3002"
              },
              {
                key: "D",
                label: "udoc",
                correct: false,
                explanation: "\u8FD9\u662F\u4ECE\u7B2C 4 \u4E2A\u5F00\u59CB\u53D6\u7684\u3002\u628A\u8D77\u70B9\u5F53\u6210\u300C\u8DF3\u8FC7 3 \u4E2A\u300D\u5C31\u4F1A\u9519\u4E00\u4F4D\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "7.2.1",
            title: "\u9996\u5B57\u6BCD\u4E0E\u540E\u7F00",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u63D0\u793A\u5E76\u8BFB\u5165\u4E00\u4E2A\u5355\u8BCD\uFF08\u4FDD\u8BC1\u81F3\u5C11 5 \u4E2A\u5B57\u7B26\uFF09\uFF0C\u663E\u793A\u5B83\u7684\u957F\u5EA6\u3001\u5F00\u5934\u4E24\u4E2A\u5B57\u7B26\u548C\u672B\u5C3E\u4E09\u4E2A\u5B57\u7B26\u3002",
            ioSpec: {
              input: ["\u4E00\u884C\uFF0C\u4E00\u4E2A `STRING`\u3002\u63D0\u793A\u8BED\u6392\u5728\u8BFB\u53D6\u4E4B\u524D\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a word`"].join("\n"),
              output: [
                "\u4E09\u884C\uFF1A",
                "`Length: <\u957F\u5EA6>`",
                "`Head: <\u5F00\u5934\u4E24\u4E2A\u5B57\u7B26>`",
                "`Tail: <\u672B\u5C3E\u4E09\u4E2A\u5B57\u7B26>`",
                "\u6BCF\u4E2A\u5192\u53F7\u540E\u9762\u90FD\u662F\u4E00\u4E2A\u7A7A\u683C\u3002"
              ].join("\n")
            },
            constraints: {
              require: [
                { feature: "builtin.length", reason: "\u957F\u5EA6\u8FD9\u4E00\u884C\u8981\u7684\u5C31\u662F\u8FD9\u4E2A\u51FD\u6570\u8FD8\u56DE\u6765\u7684\u6574\u6570\u3002" },
                { feature: "builtin.mid", reason: "Guide \u91CC\u6CA1\u6709\u53D6\u5DE6\u8FB9\u7684\u51FD\u6570\uFF0C\u5F00\u5934\u4E24\u4E2A\u5B57\u7B26\u53EA\u80FD\u7528\u5B83\uFF0C\u8D77\u70B9\u5199 1\u3002" },
                { feature: "builtin.right", reason: "\u672B\u5C3E\u4E09\u4E2A\u5B57\u7B26\u4ECE\u53F3\u8FB9\u6570\uFF0C\u7528\u5B83\u4E0D\u9700\u8981\u5148\u7B97\u603B\u957F\u5EA6\u3002" }
              ]
            },
            hints: [
              "\u300C\u5F00\u5934\u4E24\u4E2A\u300D\u7528 `MID`\uFF0C\u8D77\u70B9\u5199 1\u3002",
              "\u300C\u672B\u5C3E\u4E09\u4E2A\u300D\u4ECE\u53F3\u8FB9\u6570\uFF0C\u4E0D\u9700\u8981\u5148\u7B97\u957F\u5EA6\u3002"
            ],
            examples: [
              { inputs: ["Tuesday"], outputs: ["Enter a word", "Length: 7", "Head: Tu", "Tail: day"] }
            ],
            referenceSolution: [
              "DECLARE Word : STRING",
              'OUTPUT "Enter a word"',
              "INPUT Word",
              'OUTPUT "Length: ", LENGTH(Word)',
              'OUTPUT "Head: ", MID(Word, 1, 2)',
              'OUTPUT "Tail: ", RIGHT(Word, 3)'
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["Monday"], caseHint: "\u4E00\u4E2A\u666E\u901A\u957F\u5EA6\u7684\u5355\u8BCD\u3002" },
              { id: "t2", kind: "normal", inputs: ["Computer"], caseHint: "\u4E00\u4E2A\u957F\u4E00\u70B9\u7684\u5355\u8BCD\u3002" },
              { id: "t3", kind: "boundary", inputs: ["abcde"], caseHint: "\u6B63\u597D\u662F\u5141\u8BB8\u7684\u6700\u77ED\u957F\u5EA6\uFF0C\u5F00\u5934\u548C\u672B\u5C3E\u51E0\u4E4E\u8981\u78B0\u4E0A\u3002" },
              { id: "t4", kind: "normal", inputs: ["Pseudocode"], caseHint: "\u4E00\u4E2A\u66F4\u957F\u7684\u5355\u8BCD\u3002" },
              { id: "t5", kind: "extreme", inputs: ["Extraordinarily"], caseHint: "\u4E00\u4E2A\u975E\u5E38\u957F\u7684\u5355\u8BCD\u3002" }
            ]
          }
        ]
      },
      {
        id: "7.3",
        title: "`UCASE` \u4E0E `LCASE`\uFF1A\u53EA\u8BA4\u5355\u4E2A\u5B57\u7B26",
        syllabus: ["\xA711.1", "G\xA75.6"],
        estimatedMinutes: 8,
        taughtFeatures: AFTER_7_3,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u8FD9\u4E24\u4E2A\u51FD\u6570\u7BA1\u5927\u5C0F\u5199\uFF1A`UCASE` \u628A\u5B57\u7B26\u53D8\u6210\u5927\u5199\uFF0C`LCASE` \u53D8\u6210\u5C0F\u5199\u3002\u4E0D\u662F\u5B57\u6BCD\u7684\u5B57\u7B26\uFF08\u6570\u5B57\u3001\u7A7A\u683C\u3001\u6807\u70B9\uFF09\u539F\u6837\u8FD8\u56DE\u6765\u3002",
              "\u8981\u7D27\u7684\u662F\u5B83\u4EEC\u7684\u7C7B\u578B\uFF1A**\u4E24\u4E2A\u51FD\u6570\u90FD\u53EA\u6536 `CHAR`\uFF0C\u4E5F\u53EA\u8FD8 `CHAR`**\u3002\u8FD9\u5C31\u662F 7.1 \u90A3\u6761\u89C4\u77E9\u771F\u6B63\u5F00\u59CB\u8D77\u4F5C\u7528\u7684\u5730\u65B9\u2014\u2014`STRING` \u9012\u4E0D\u8FDB\u53BB\u3002",
              "\u4E5F\u8BB8\u4F60\u4F1A\u60F3\uFF1A\u90A3\u5148\u7528 `MID` \u53D6\u51FA\u4E00\u4E2A\u5B57\u7B26\u518D\u8F6C\u4E0D\u5C31\u884C\u4E86\uFF1F`MID` \u8FD8\u56DE\u6765\u7684\u662F `STRING`\uFF0C\u54EA\u6015\u53EA\u53D6\u4E00\u4E2A\u5B57\u7B26\uFF0C\u6240\u4EE5\u8FD9\u6761\u8DEF\u540C\u6837\u8D70\u4E0D\u901A\u3002**\u5728 Guide \u7684\u8FD9\u5957\u51FD\u6570\u91CC\uFF0C\u6CA1\u6709\u529E\u6CD5\u628A\u4E00\u4E2A\u957F\u5EA6\u4E3A 1 \u7684 `STRING` \u53D8\u6210 `CHAR`\u3002**",
              "\u8FD9\u4E0D\u662F\u7F16\u8F91\u5668\u7684\u9650\u5236\uFF0C\u662F Pseudocode Guide \u5C31\u8FD9\u4E48\u5B9A\u7684\u3002\u5B9E\u9645\u80FD\u7528\u4E0A\u5B83\u4EEC\u7684\u573A\u5408\uFF0C\u662F\u624B\u91CC\u672C\u6765\u5C31\u6709\u4E00\u4E2A `CHAR`\uFF1A`CHAR` \u5B57\u9762\u91CF\uFF0C\u6216\u8005 `INPUT` \u8FDB\u4E00\u4E2A `CHAR` \u53D8\u91CF\u2014\u2014\u6BD4\u5982\u8BA9\u7528\u6237\u8F93\u5165 `Y` \u6216 `N`\uFF0C\u4E0D\u7BA1\u4ED6\u6253\u7684\u662F\u5927\u5199\u8FD8\u662F\u5C0F\u5199\uFF0C\u5148\u7EDF\u4E00\u8F6C\u6210\u5927\u5199\u518D\u6BD4\u8F83\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "`UCASE(ThisChar : CHAR) RETURNS CHAR`\uFF1B`LCASE(ThisChar : CHAR) RETURNS CHAR`\u3002\u4E24\u8005\u90FD\u53EA\u5904\u7406\u5355\u4E2A\u5B57\u7B26\uFF08Pseudocode Guide \xA75.6\uFF09\u3002"
              }
            ]
          },
          {
            kind: "counterExample",
            title: "\u628A `STRING` \u9012\u7ED9\u53EA\u6536 `CHAR` \u7684\u51FD\u6570",
            cases: [
              {
                title: "\u76F4\u63A5\u9012\u4E00\u4E2A `STRING`",
                code: ["DECLARE S : STRING", 'S \u2190 "abc"', "OUTPUT UCASE(S)"].join("\n"),
                note: "`S` \u662F `STRING`\uFF0C\u800C `UCASE` \u8981\u7684\u662F `CHAR`\uFF0C\u7F16\u8F91\u5668\u5728\u7B2C 3 \u884C\u62E6\u4E0B\u6765\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "BUILTIN-001", line: 3, text: "`UCASE` \u53EA\u63A5\u53D7 `CHAR`\uFF0C\u8FD9\u91CC\u7ED9\u5B83\u7684\u662F `STRING`\u3002" }
                ]
              },
              {
                title: "\u5148\u7528 `MID` \u53D6\u4E00\u4E2A\u5B57\u7B26\u4E5F\u4E0D\u884C",
                code: ["DECLARE S : STRING", 'S \u2190 "abc"', "OUTPUT UCASE(MID(S, 1, 1))"].join("\n"),
                note: "\u770B\u7740\u50CF\u7ED5\u5F00\u4E86\uFF0C\u5176\u5B9E\u6CA1\u6709\uFF1A`MID` \u8FD8\u56DE\u6765\u7684\u4ECD\u7136\u662F `STRING`\uFF0C\u54EA\u6015\u91CC\u9762\u53EA\u6709\u4E00\u4E2A\u5B57\u7B26\u3002\u8FD9\u6761\u8DEF\u5728 Guide \u7684\u51FD\u6570\u91CC\u662F\u8D70\u4E0D\u901A\u7684\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "BUILTIN-001", line: 3, text: "`MID` \u8FD8\u56DE\u6765\u7684\u662F `STRING`\uFF0C\u9012\u4E0D\u8FDB\u53EA\u6536 `CHAR` \u7684 `UCASE`\u3002" }
                ]
              }
            ]
          },
          {
            kind: "example",
            title: "\u4E0D\u7BA1\u7528\u6237\u6253\u5927\u5199\u8FD8\u662F\u5C0F\u5199",
            fileName: "Example_7_3_a.pseudocode",
            code: [
              "DECLARE Answer : CHAR",
              'OUTPUT "Continue? Enter Y or N"',
              "INPUT Answer",
              "IF UCASE(Answer) = 'Y' THEN",
              '   OUTPUT "Going on"',
              "ELSE",
              '   OUTPUT "Stopped"',
              "ENDIF"
            ].join("\n"),
            annotations: [
              { fromLine: 1, toLine: 3, text: "`Answer` \u58F0\u660E\u6210 `CHAR`\uFF0C\u6240\u4EE5\u8BFB\u8FDB\u6765\u7684\u5C31\u662F\u4E00\u4E2A\u5B57\u7B26\u3002" },
              { fromLine: 4, toLine: 4, text: "\u5148\u8F6C\u6210\u5927\u5199\u518D\u6BD4\uFF0C\u8FD9\u6837 `y` \u548C `Y` \u90FD\u80FD\u901A\u8FC7\uFF0C\u4E0D\u7528\u5199\u4E24\u4E2A\u6761\u4EF6\u3002\u6BD4\u8F83\u4E24\u8FB9\u4E5F\u90FD\u662F `CHAR`\u3002" }
            ],
            sampleRun: { inputs: ["y"], outputs: ["Continue? Enter Y or N", "Going on"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: '`DECLARE S : STRING` \u4E14 `S \u2190 "hello"`\uFF0C\u4E0B\u9762\u54EA\u4E00\u884C\u80FD\u901A\u8FC7\u68C0\u67E5\uFF1F',
            options: [
              {
                key: "A",
                label: "OUTPUT UCASE(S)",
                correct: false,
                explanation: "`S` \u662F `STRING`\uFF0C\u800C `UCASE` \u53EA\u6536 `CHAR`\u3002"
              },
              {
                key: "B",
                label: "OUTPUT UCASE(MID(S, 1, 1))",
                correct: false,
                explanation: "\u770B\u7740\u50CF\u7ED5\u5F00\u4E86\uFF0C\u5176\u5B9E\u6CA1\u6709\uFF1A`MID` \u8FD8\u56DE\u6765\u7684\u662F `STRING`\uFF0C\u54EA\u6015\u53EA\u6709\u4E00\u4E2A\u5B57\u7B26\u3002"
              },
              {
                key: "C",
                label: 'OUTPUT UCASE("h")',
                correct: false,
                explanation: "\u53CC\u5F15\u53F7\u91CC\u7684\u662F `STRING`\u3002\u8FD9\u4E00\u5904\u5DEE\u522B\u5728\u8FD9\u4E24\u4E2A\u51FD\u6570\u4E0A\u662F\u786C\u6027\u7684\u3002"
              },
              {
                key: "D",
                label: "OUTPUT UCASE('h')",
                correct: true,
                explanation: "\u5BF9\u3002`'h'` \u662F\u5355\u5F15\u53F7\u5199\u7684 `CHAR` \u5B57\u9762\u91CF\uFF0C\u6B63\u662F `UCASE` \u8981\u7684\u4E1C\u897F\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "7.4",
        title: "\u7528 `&` \u628A\u6587\u5B57\u63A5\u8D77\u6765",
        syllabus: ["\xA711.1", "G\xA75.5"],
        estimatedMinutes: 8,
        taughtFeatures: AFTER_7_4,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              '`&` \u628A\u4E24\u6BB5 `STRING` \u63A5\u6210\u4E00\u6BB5\uFF1A`"Hello" & " " & "World"` \u5F97\u5230 `"Hello World"`\u3002\u8FD9\u53EB**\u8FDE\u63A5\uFF08concatenation\uFF09**\u3002',
              "\u5B83\u548C `OUTPUT` \u7684\u9017\u53F7\u770B\u8D77\u6765\u6548\u679C\u5DEE\u4E0D\u591A\uFF0C\u4F46\u505A\u7684\u662F\u4E24\u4EF6\u4E8B\uFF1A`&` \u9020\u51FA**\u4E00\u4E2A\u65B0\u7684 `STRING`**\uFF0C\u53EF\u4EE5\u8D4B\u7ED9\u53D8\u91CF\u3001\u7EE7\u7EED\u63A5\u3001\u9012\u7ED9\u51FD\u6570\uFF1B`OUTPUT A, B, C` \u53EA\u662F\u628A\u51E0\u4E2A\u503C\u6328\u7740\u663E\u793A\u51FA\u6765\uFF0C\u6CA1\u6709\u9020\u51FA\u4EFB\u4F55\u65B0\u503C\u3002",
              "\u6240\u4EE5\u8981\u300C\u663E\u793A\u4E00\u53E5\u8BDD\u300D\u4E24\u79CD\u90FD\u884C\uFF1B\u8981\u300C\u628A\u62FC\u597D\u7684\u4E1C\u897F\u5B58\u8D77\u6765\u5F85\u4F1A\u513F\u7528\u300D\uFF0C\u53EA\u80FD\u7528 `&`\u3002",
              '`&` \u7684\u4E24\u8FB9\u90FD\u5FC5\u987B\u662F `STRING`\u3002`"n=" & 5` \u662F\u4E0D\u6210\u7ACB\u7684\u2014\u20145 \u662F `INTEGER`\uFF0C\u7F16\u8F91\u5668\u4F1A\u62E6\u4E0B\u6765\u3002**\u8981\u663E\u793A\u6570\u5B57\uFF0C\u7528 `OUTPUT` \u7684\u9017\u53F7\u5F62\u5F0F**\uFF0C\u90A3\u91CC\u4EC0\u4E48\u7C7B\u578B\u90FD\u6536\u3002'
            ],
            callouts: [
              {
                source: "CAIE",
                text: "`&` \u662F\u5B57\u7B26\u4E32\u8FDE\u63A5\u8FD0\u7B97\u7B26\uFF0C\u4E24\u8FB9\u90FD\u5FC5\u987B\u662F `STRING`\uFF08Pseudocode Guide \xA75.5\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u4E24\u79CD\u5199\u6CD5\u5404\u81EA\u7684\u7528\u5904",
            fileName: "Example_7_4_a.pseudocode",
            code: [
              "DECLARE First : STRING",
              "DECLARE Last : STRING",
              "DECLARE Full : STRING",
              "DECLARE Count : INTEGER",
              'First \u2190 "Ada"',
              'Last \u2190 "Lovelace"',
              "Count \u2190 2",
              'Full \u2190 First & " " & Last',
              'OUTPUT "Name: ", Full',
              'OUTPUT "Words: ", Count'
            ].join("\n"),
            annotations: [
              { fromLine: 8, toLine: 8, text: "`&` \u628A\u4E09\u6BB5\u63A5\u6210\u4E00\u4E2A\u65B0\u7684 `STRING` \u5B58\u8FDB `Full`\uFF0C\u5B58\u4E0B\u6765\u4E4B\u540E\u8FD8\u80FD\u518D\u7528\u3002" },
              { fromLine: 9, toLine: 9, text: "\u9017\u53F7\u5F62\u5F0F\uFF0C\u53EA\u8D1F\u8D23\u663E\u793A\u3002" },
              { fromLine: 10, toLine: 10, text: '`Count` \u662F `INTEGER`\uFF0C\u53EA\u80FD\u8D70\u9017\u53F7\u8FD9\u6761\u8DEF\u2014\u2014\u5199\u6210 `"Words: " & Count` \u4F1A\u88AB\u62E6\u4E0B\u6765\u3002' }
            ],
            sampleRun: { inputs: [], outputs: ["Name: Ada Lovelace", "Words: 2"] }
          },
          {
            kind: "example",
            title: "\u5728\u5FAA\u73AF\u91CC\u63A5\u51FA\u4E00\u884C\u661F\u53F7",
            fileName: "Example_7_4_b.pseudocode",
            code: [
              "DECLARE I : INTEGER",
              "DECLARE Bar : STRING",
              'Bar \u2190 ""',
              "FOR I \u2190 1 TO 5",
              '   Bar \u2190 Bar & "*"',
              "NEXT I",
              "OUTPUT Bar"
            ].join("\n"),
            annotations: [
              { fromLine: 3, toLine: 3, text: "\u4ECE\u7A7A\u4E32\u5F00\u59CB\u3002\u4E0D\u5148\u8BBE\u7A7A\u4E32\uFF0C`Bar` \u5C31\u6CA1\u6709\u503C\u53EF\u4EE5\u63A5\u3002" },
              { fromLine: 5, toLine: 5, text: "\u6BCF\u4E00\u904D\u5728\u539F\u6765\u7684\u57FA\u7840\u4E0A\u63A5\u4E00\u4E2A\u661F\u53F7\u3002" },
              { fromLine: 7, toLine: 7, text: "\u663E\u793A\u653E\u5728\u5FAA\u73AF\u5916\u9762\uFF0C\u6240\u4EE5\u53EA\u663E\u793A\u6700\u540E\u63A5\u597D\u7684\u90A3\u4E00\u6574\u6761\u3002" }
            ],
            sampleRun: { inputs: [], outputs: ["*****"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`DECLARE N : INTEGER` \u4E14 `N \u2190 7`\uFF0C\u60F3\u663E\u793A `Score: 7`\uFF0C\u54EA\u4E00\u884C\u80FD\u901A\u8FC7\u68C0\u67E5\uFF1F",
            options: [
              {
                key: "A",
                label: 'OUTPUT "Score: ", N',
                correct: true,
                explanation: "\u5BF9\u3002`OUTPUT` \u7684\u9017\u53F7\u5F62\u5F0F\u5BF9\u7C7B\u578B\u6CA1\u6709\u8981\u6C42\uFF0C\u6570\u5B57\u76F4\u63A5\u663E\u793A\u51FA\u6765\u3002"
              },
              {
                key: "B",
                label: 'OUTPUT "Score: " & N',
                correct: false,
                explanation: "`&` \u4E24\u8FB9\u90FD\u5F97\u662F `STRING`\uFF0C\u800C `N` \u662F `INTEGER`\u3002"
              },
              {
                key: "C",
                label: 'OUTPUT "Score: " & "N"',
                correct: false,
                explanation: "\u8FD9\u80FD\u901A\u8FC7\u68C0\u67E5\uFF0C\u4F46\u663E\u793A\u7684\u662F `Score: N` \u8FD9\u51E0\u4E2A\u5B57\u6BCD\u2014\u2014\u5F15\u53F7\u91CC\u7684 `N` \u662F\u6587\u5B57\u672C\u8EAB\uFF0C\u4E0D\u662F\u53D8\u91CF\u7684\u503C\u3002"
              },
              {
                key: "D",
                label: 'OUTPUT "Score: " + N',
                correct: false,
                explanation: "`+` \u662F\u52A0\u6CD5\uFF0C\u4E0D\u662F\u8FDE\u63A5\u3002\u63A5\u6587\u5B57\u7528 `&`\uFF0C\u800C\u8FD9\u91CC\u8FDE `&` \u90FD\u4E0D\u8BE5\u7528\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "7.5",
        title: "`INT` \u4E0E `RAND`",
        syllabus: ["\xA711.1", "G\xA75.6"],
        estimatedMinutes: 8,
        taughtFeatures: AFTER_7_5,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u9664\u4E86\u5904\u7406\u6587\u5B57\uFF0CGuide \u8FD8\u7ED9\u4E86\u4E24\u4E2A\u5904\u7406\u6570\u5B57\u7684\u51FD\u6570\u3002`INT(x)` \u628A\u4E00\u4E2A `REAL` \u53D8\u6210 `INTEGER`\uFF0C\u505A\u6CD5\u662F**\u76F4\u63A5\u780D\u6389\u5C0F\u6570\u90E8\u5206**\uFF0C\u4E0D\u662F\u56DB\u820D\u4E94\u5165\uFF1A`INT(7.9)` \u662F 7\uFF0C`INT(-7.9)` \u662F -7\u3002\u8FD9\u6B63\u597D\u548C\u7B2C 3 \u7AE0\u7684 `DIV` \u5BF9\u4E0A\u2014\u2014`7 DIV 2` \u548C `INT(7 / 2)` \u90FD\u662F 3\u3002",
              "`RAND(x)` \u7ED9\u51FA\u4E00\u4E2A\u968F\u673A\u7684 `REAL`\uFF0C\u8303\u56F4\u662F 0\uFF08\u542B\uFF09\u5230 `x`\uFF08\u4E0D\u542B\uFF09\uFF0C\u53C2\u6570\u662F `INTEGER`\u3002\u56E0\u4E3A\u5B83\u8FD8\u56DE\u6765\u7684\u662F `REAL`\uFF0C\u60F3\u8981\u4E00\u4E2A\u968F\u673A\u6574\u6570\u5C31\u5F97\u914D\u5408 `INT`\uFF1A\u63B7\u9AB0\u5B50\u5199\u6210 `INT(RAND(6)) + 1`\u2014\u2014`RAND(6)` \u7ED9 0 \u5230 5.999\u2026\uFF0C\u780D\u6389\u5C0F\u6570\u5F97\u5230 0 \u5230 5\uFF0C\u518D\u52A0 1 \u5C31\u662F 1 \u5230 6\u3002",
              "\u7528\u4E86 `RAND` \u7684\u7A0B\u5E8F\u6BCF\u6B21\u8DD1\u7684\u7ED3\u679C\u90FD\u4E0D\u4E00\u6837\uFF0C\u6240\u4EE5\u8FD9\u7C7B\u9898\u76EE\u4E0D\u4F1A\u53BB\u6BD4\u5BF9\u5177\u4F53\u8F93\u51FA\uFF0C\u53EA\u4F1A\u770B\u8303\u56F4\u548C\u5199\u6CD5\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "`INT(x : REAL) RETURNS INTEGER`\uFF0C\u53D6\u6574\u6570\u90E8\u5206\uFF1B`RAND(x : INTEGER) RETURNS REAL`\uFF0C\u8FD4\u56DE 0 \u5230 x \u4E4B\u95F4\u7684\u968F\u673A\u5B9E\u6570\uFF08Pseudocode Guide \xA75.6\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u53D6\u6574\u4E0D\u662F\u56DB\u820D\u4E94\u5165",
            fileName: "Example_7_5_a.pseudocode",
            code: [
              "DECLARE A : INTEGER",
              "DECLARE B : INTEGER",
              "DECLARE C : INTEGER",
              "A \u2190 INT(7.9)",
              "B \u2190 INT(7.1)",
              "C \u2190 INT(7 / 2)",
              'OUTPUT "A: ", A',
              'OUTPUT "B: ", B',
              'OUTPUT "C: ", C'
            ].join("\n"),
            annotations: [
              { fromLine: 4, toLine: 5, text: "7.9 \u548C 7.1 \u780D\u6389\u5C0F\u6570\u90FD\u662F 7\u3002`INT` \u4E0D\u770B\u5C0F\u6570\u90E8\u5206\u6709\u591A\u5927\u3002" },
              { fromLine: 6, toLine: 6, text: "`7 / 2` \u662F 3.5\uFF08\u7B2C 3 \u7AE0\uFF1A`/` \u7684\u7ED3\u679C\u6C38\u8FDC\u662F `REAL`\uFF09\uFF0C\u780D\u6389\u5C0F\u6570\u662F 3\u3002" }
            ],
            sampleRun: { inputs: [], outputs: ["A: 7", "B: 7", "C: 3"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u60F3\u5F97\u5230\u4E00\u4E2A 1 \u5230 10 \u4E4B\u95F4\u7684\u968F\u673A\u6574\u6570\uFF0C\u8BE5\u600E\u4E48\u5199\uFF1F",
            options: [
              {
                key: "A",
                label: "INT(RAND(10))",
                correct: false,
                explanation: "\u53D6\u6574\u4E4B\u540E\u662F 0 \u5230 9\uFF0C\u5DEE\u4E86\u4E00\u4F4D\u2014\u2014`RAND(10)` \u53D6\u4E0D\u5230 10\uFF0C\u780D\u6389\u5C0F\u6570\u6700\u5927\u53EA\u5230 9\u3002"
              },
              {
                key: "B",
                label: "INT(RAND(11))",
                correct: false,
                explanation: "\u8303\u56F4\u662F 0 \u5230 10\uFF0C\u4E2A\u6570\u5BF9\u4E86\u4F46\u8D77\u70B9\u4E0D\u5BF9\u2014\u2014\u4F1A\u51FA\u73B0 0\u3002"
              },
              {
                key: "C",
                label: "INT(RAND(10)) + 1",
                correct: true,
                explanation: "\u5BF9\u3002`RAND(10)` \u7ED9 0 \u5230 9.999\u2026\uFF0C\u53D6\u6574\u5F97 0 \u5230 9\uFF0C\u52A0 1 \u6B63\u597D\u662F 1 \u5230 10\u3002"
              },
              {
                key: "D",
                label: "RAND(10)",
                correct: false,
                explanation: "`RAND` \u8FD8\u56DE\u6765\u7684\u662F `REAL`\uFF0C\u6BD4\u5982 3.7\uFF1B\u800C\u4E14\u5B83\u53EF\u80FD\u63A5\u8FD1 0\uFF0C\u4E0D\u5230 1\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "7.6",
        title: "\u51FD\u6570\u662F\u8868\u8FBE\u5F0F\u7684\u4E00\u90E8\u5206",
        syllabus: ["\xA711.1", "G\xA75.6"],
        estimatedMinutes: 7,
        taughtFeatures: AFTER_7_5,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u5230\u8FD9\u91CC\u4E03\u4E2A\u51FD\u6570\u90FD\u89C1\u8FC7\u4E86\uFF0C\u6700\u540E\u8981\u8BF4\u6E05\u695A\u5B83\u4EEC**\u653E\u5728\u54EA\u91CC**\u3002\u51FD\u6570\u8C03\u7528\u7B97\u51FA\u6765\u4E00\u4E2A\u503C\uFF0C\u6240\u4EE5\u51E1\u662F\u9700\u8981\u4E00\u4E2A\u503C\u7684\u5730\u65B9\u90FD\u53EF\u4EE5\u653E\u4E00\u4E2A\u51FD\u6570\u8C03\u7528\uFF1A\u8D4B\u503C\u7684\u53F3\u8FB9\u3001`OUTPUT` \u7684\u4E00\u9879\u3001\u6761\u4EF6\u91CC\u3001\u5FAA\u73AF\u7684\u7EC8\u70B9\u3001\u53E6\u4E00\u4E2A\u51FD\u6570\u7684\u53C2\u6570\u91CC\u3001\u548C\u8FD0\u7B97\u7B26\u6DF7\u5728\u4E00\u8D77\u3002",
              "`RIGHT(Code, LENGTH(Code) - 2)` \u503C\u5F97\u591A\u770B\u4E00\u773C\uFF1A\u62EC\u53F7\u91CC\u662F\u4E00\u4E2A\u7B97\u5F0F\uFF0C\u5148\u7B97\u51FA `LENGTH(Code) - 2`\uFF0C\u518D\u628A\u7ED3\u679C\u4EA4\u7ED9 `RIGHT`\u3002**\u53C2\u6570\u4E0D\u5FC5\u662F\u5199\u6B7B\u7684\u6570\u5B57\uFF0C\u53EF\u4EE5\u662F\u4EFB\u4F55\u7B97\u5F97\u51FA\u503C\u7684\u8868\u8FBE\u5F0F\u3002**\u53CD\u8FC7\u6765\uFF0C\u51FD\u6570\u8C03\u7528\u4E0D\u80FD\u5355\u72EC\u6210\u4E3A\u4E00\u6761\u8BED\u53E5\u2014\u2014\u7B97\u51FA\u6765\u7684\u503C\u6CA1\u4EBA\u63A5\u7740\u5C31\u4E22\u4E86\u3002",
              "\u672C\u7F16\u8F91\u5668\u5B9E\u73B0\u7684\u5C31\u662F Guide \u5217\u51FA\u7684\u8FD9\u4E03\u4E2A\uFF1A`LENGTH`\u3001`MID`\u3001`RIGHT`\u3001`UCASE`\u3001`LCASE`\u3001`INT`\u3001`RAND`\u3002\u522B\u7684\u540D\u5B57\uFF08\u6BD4\u5982 `LEFT`\u3001`ROUND`\uFF09\u90FD\u4F1A\u88AB\u5F53\u6210\u6CA1\u6709\u58F0\u660E\u7684\u540D\u79F0\u3002\u771F\u9898\u91CC\u5076\u5C14\u4F1A\u51FA\u73B0 Guide \u4E4B\u5916\u7684\u51FD\u6570\uFF0C\u90A3\u79CD\u60C5\u51B5\u4E0B\u9898\u76EE\u4F1A\u628A\u5B83\u7684\u5B9A\u4E49\u4E00\u8D77\u7ED9\u51FA\u6765\u3002"
            ]
          },
          {
            kind: "example",
            title: "\u51FD\u6570\u5D4C\u5728\u5404\u79CD\u4F4D\u7F6E",
            fileName: "Example_7_6_a.pseudocode",
            code: [
              "DECLARE Code : STRING",
              "DECLARE Tail : STRING",
              'Code \u2190 "AB1234"',
              "IF LENGTH(Code) > 4 THEN",
              "   Tail \u2190 RIGHT(Code, LENGTH(Code) - 2)",
              '   OUTPUT "Tail: ", Tail',
              '   OUTPUT "Tail length: ", LENGTH(Tail)',
              "ENDIF"
            ].join("\n"),
            annotations: [
              { fromLine: 4, toLine: 4, text: "\u51FD\u6570\u8C03\u7528\u5F53\u6761\u4EF6\u7684\u4E00\u534A\uFF0C\u5B83\u7B97\u51FA\u7684 `INTEGER` \u518D\u62FF\u53BB\u6BD4\u8F83\u3002" },
              { fromLine: 5, toLine: 5, text: "`LENGTH(Code) - 2` \u5148\u7B97\u6210 4\uFF0C\u518D\u4EA4\u7ED9 `RIGHT` \u5F53\u7B2C\u4E8C\u4E2A\u53C2\u6570\u3002" },
              { fromLine: 7, toLine: 7, text: "\u5BF9\u521A\u7B97\u51FA\u6765\u7684 `Tail` \u518D\u8C03\u7528\u4E00\u6B21 `LENGTH`\u3002" }
            ],
            sampleRun: { inputs: [], outputs: ["Tail: 1234", "Tail length: 4"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0B\u9762\u54EA\u4E00\u884C\u662F**\u4E0D\u6210\u7ACB**\u7684\uFF1F",
            options: [
              {
                key: "A",
                label: 'IF MID(Code, 1, 1) = "A" THEN',
                correct: false,
                explanation: '\u6210\u7ACB\u3002`MID` \u8FD8\u56DE\u6765\u7684\u662F `STRING`\uFF0C\u53F3\u8FB9 `"A"` \u4E5F\u662F `STRING`\uFF0C\u4E24\u8FB9\u7C7B\u578B\u5BF9\u5F97\u4E0A\u3002'
              },
              {
                key: "B",
                label: "OUTPUT MID(Code, 1, LENGTH(Code) - 2)",
                correct: false,
                explanation: "\u6210\u7ACB\u3002\u53C2\u6570\u53EF\u4EE5\u662F\u7B97\u5F0F\uFF0C\u5148\u7B97\u5B8C\u518D\u4EA4\u7ED9\u51FD\u6570\u3002"
              },
              {
                key: "C",
                label: "LENGTH(Word) \u5355\u72EC\u5360\u4E00\u884C",
                correct: true,
                explanation: "\u5BF9\u3002\u51FD\u6570\u7B97\u51FA\u4E86\u4E00\u4E2A\u503C\uFF0C\u4F46\u6CA1\u6709\u8D4B\u7ED9\u8C01\u3001\u4E5F\u6CA1\u6709\u663E\u793A\u51FA\u6765\uFF0C\u8FD9\u4E2A\u503C\u65E0\u5904\u53EF\u53BB\uFF0C\u6240\u4EE5\u5B83\u4E0D\u80FD\u5355\u72EC\u6210\u4E3A\u4E00\u6761\u8BED\u53E5\u3002"
              },
              {
                key: "D",
                label: "FOR I \u2190 1 TO LENGTH(Word)",
                correct: false,
                explanation: "\u6210\u7ACB\u3002`LENGTH` \u7B97\u51FA `INTEGER`\uFF0C\u6B63\u597D\u80FD\u5F53\u5FAA\u73AF\u7684\u7EC8\u70B9\u3002"
              }
            ]
          }
        ]
      }
    ],
    chapterTasks: [
      {
        kind: "chapterTask",
        id: "7.T1",
        title: "\u4EA7\u54C1\u7F16\u53F7",
        statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165\u4E00\u4E2A\u4EA7\u54C1\u7F16\u53F7\u548C\u4E00\u4E2A\u7B49\u7EA7\u5B57\u6BCD\uFF0C\u628A\u7F16\u53F7\u62C6\u5F00\u663E\u793A\u3002\u7F16\u53F7\u7684\u683C\u5F0F\u662F\u4E24\u4E2A\u5B57\u6BCD\u52A0\u82E5\u5E72\u6570\u5B57\uFF0C\u4FDD\u8BC1\u81F3\u5C11 3 \u4E2A\u5B57\u7B26\u3002",
        ioSpec: {
          input: [
            "\u4E24\u884C\u3002\u7B2C\u4E00\u884C\u662F\u4EA7\u54C1\u7F16\u53F7\uFF08`STRING`\uFF09\uFF0C\u7B2C\u4E8C\u884C\u662F\u7B49\u7EA7\uFF08`CHAR`\uFF0C\u4E00\u4E2A\u5B57\u6BCD\uFF0C\u5927\u5C0F\u5199\u90FD\u53EF\u80FD\uFF09\u3002",
            "\u4E24\u53E5\u63D0\u793A\u8BED\u5404\u81EA\u6392\u5728\u5B83\u5BF9\u5E94\u7684\u90A3\u6B21\u8BFB\u53D6\u4E4B\u524D\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
            "`Enter the code`",
            "`Enter the grade`"
          ].join("\n"),
          output: [
            "\u8BFB\u5B8C\u4E4B\u540E\u663E\u793A\u4E94\u884C\uFF1A",
            "`Length: <\u7F16\u53F7\u7684\u957F\u5EA6>`",
            "`Prefix: <\u7F16\u53F7\u7684\u524D\u4E24\u4E2A\u5B57\u7B26>`",
            "`Number: <\u524D\u4E24\u4E2A\u5B57\u7B26\u4E4B\u540E\u7684\u5168\u90E8\u5185\u5BB9>`",
            "`Tag: <\u524D\u7F00>-<\u6570\u5B57\u90E8\u5206>`",
            "`Grade: <\u7B49\u7EA7\u5B57\u6BCD\u7684\u5927\u5199>`",
            "\u6BCF\u4E2A\u5192\u53F7\u540E\u9762\u90FD\u662F\u4E00\u4E2A\u7A7A\u683C\uFF1B`Tag` \u90A3\u4E00\u884C\u7684\u4E24\u6BB5\u4E2D\u95F4\u662F\u4E00\u4E2A\u51CF\u53F7\uFF0C\u6CA1\u6709\u7A7A\u683C\u3002"
          ].join("\n")
        },
        suggestedFeatures: [
          "builtin.length",
          "builtin.mid",
          "builtin.right",
          "builtin.ucase",
          "op.concat",
          "io.input",
          "io.output"
        ],
        hints: [
          "\u300C\u524D\u4E24\u4E2A\u5B57\u7B26\u4E4B\u540E\u7684\u5168\u90E8\u5185\u5BB9\u300D\u6709\u51E0\u4E2A\u5B57\u7B26\uFF0C\u53D6\u51B3\u4E8E\u7F16\u53F7\u6709\u591A\u957F\u2014\u2014\u5148\u60F3\u6E05\u695A\u8FD9\u4E2A\u6570\u600E\u4E48\u7B97\u51FA\u6765\uFF0C\u518D\u51B3\u5B9A\u7528\u54EA\u4E2A\u51FD\u6570\u53D6\u3002",
          "`Tag` \u90A3\u4E00\u884C\u8981\u7684\u662F\u4E00\u4E2A\u62FC\u597D\u7684 `STRING`\uFF0C\u4E0D\u662F\u4E09\u6837\u4E1C\u897F\u6328\u7740\u663E\u793A\u3002",
          "\u7B49\u7EA7\u662F `CHAR`\uFF0C\u7F16\u53F7\u662F `STRING`\uFF0C\u4E24\u8005\u80FD\u7528\u7684\u51FD\u6570\u4E0D\u4E00\u6837\uFF0C\u58F0\u660E\u7684\u65F6\u5019\u5C31\u8981\u5206\u6E05\u3002"
        ],
        examples: [
          {
            inputs: ["AB1234", "a"],
            outputs: [
              "Enter the code",
              "Enter the grade",
              "Length: 6",
              "Prefix: AB",
              "Number: 1234",
              "Tag: AB-1234",
              "Grade: A"
            ]
          }
        ],
        referenceSolution: [
          "DECLARE Code : STRING",
          "DECLARE Grade : CHAR",
          "DECLARE Prefix : STRING",
          "DECLARE Digits : STRING",
          'OUTPUT "Enter the code"',
          "INPUT Code",
          'OUTPUT "Enter the grade"',
          "INPUT Grade",
          "Prefix \u2190 MID(Code, 1, 2)",
          "Digits \u2190 RIGHT(Code, LENGTH(Code) - 2)",
          'OUTPUT "Length: ", LENGTH(Code)',
          'OUTPUT "Prefix: ", Prefix',
          'OUTPUT "Number: ", Digits',
          'OUTPUT "Tag: ", Prefix & "-" & Digits',
          'OUTPUT "Grade: ", UCASE(Grade)'
        ].join("\n"),
        tests: [
          { id: "t1", kind: "normal", inputs: ["XY99", "b"], caseHint: "\u4E00\u4E2A\u77ED\u7F16\u53F7\uFF0C\u7B49\u7EA7\u662F\u5C0F\u5199\u3002" },
          { id: "t2", kind: "normal", inputs: ["QR2468", "c"], caseHint: "\u4E00\u4E2A\u666E\u901A\u957F\u5EA6\u7684\u7F16\u53F7\u3002" },
          { id: "t3", kind: "boundary", inputs: ["QQ1", "z"], caseHint: "\u7F16\u53F7\u77ED\u5230\u53EA\u5269\u4E00\u4F4D\u6570\u5B57\u3002" },
          { id: "t4", kind: "boundary", inputs: ["ZZ12", "A"], caseHint: "\u7B49\u7EA7\u672C\u6765\u5C31\u662F\u5927\u5199\uFF0C\u8F6C\u6362\u4E4B\u540E\u4E0D\u8BE5\u53D8\u6837\u3002" },
          { id: "t5", kind: "extreme", inputs: ["MN1234567890", "q"], caseHint: "\u4E00\u4E2A\u975E\u5E38\u957F\u7684\u7F16\u53F7\u3002" }
        ]
      }
    ]
  };

  // packages/teaching-content/src/chapter-08.ts
  var AFTER_CHAPTER_7 = [
    "io.output",
    "io.input",
    "decl.variable",
    "misc.comment",
    "type.string",
    "literal.string",
    "type.integer",
    "type.real",
    "type.char",
    "type.boolean",
    "type.date",
    "literal.integer",
    "literal.real",
    "literal.char",
    "literal.boolean",
    "literal.date",
    "assign.simple",
    "decl.constant",
    "op.arithmetic",
    "op.div",
    "op.mod",
    "op.relational",
    "op.and",
    "op.or",
    "op.not",
    "select.if",
    "select.if-else",
    "select.nested-if",
    "select.case",
    "select.case-range",
    "select.case-otherwise",
    "loop.for",
    "loop.for-step",
    "loop.while",
    "loop.repeat",
    "loop.nested",
    "builtin.length",
    "builtin.mid",
    "builtin.right",
    "builtin.ucase",
    "builtin.lcase",
    "op.concat",
    "builtin.int",
    "builtin.rand"
  ];
  var AFTER_8_1 = [...AFTER_CHAPTER_7, "decl.array-1d", "array.index"];
  var chapter08 = {
    id: 8,
    title: "\u4E00\u7EF4\u6570\u7EC4",
    level: "AS",
    syllabus: ["\xA710.2", "G\xA73"],
    prerequisites: [1, 2, 3, 4, 5, 6, 7],
    sections: [
      {
        id: "8.1",
        title: "\u4E3A\u4EC0\u4E48\u9700\u8981\u6570\u7EC4",
        syllabus: ["\xA710.2", "G\xA73"],
        estimatedMinutes: 8,
        taughtFeatures: AFTER_8_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u8981\u8BB0\u4F4F\u4E09\u4E2A\u5206\u6570\uFF0C\u58F0\u660E\u4E09\u4E2A\u53D8\u91CF\u5C31\u884C\u3002\u8981\u8BB0\u4F4F\u4E09\u5341\u4E2A\u5462\uFF1F\u4E09\u5341\u4E2A `DECLARE`\u3001\u4E09\u5341\u884C `INPUT`\uFF0C\u60F3\u6C42\u4E2A\u603B\u5206\u8FD8\u5F97\u628A\u4E09\u5341\u4E2A\u540D\u5B57\u5168\u5199\u4E00\u904D\u3002\u540D\u5B57\u4E00\u591A\uFF0C\u4EE3\u7801\u5C31\u6CA1\u6CD5\u5199\u4E86\u3002",
              "**\u6570\u7EC4\uFF08array\uFF09**\u662F\u4E00\u6392\u683C\u5B50\uFF0C\u5171\u7528\u4E00\u4E2A\u540D\u5B57\uFF0C\u7528\u7F16\u53F7\u533A\u5206\u3002`Marks[1]`\u3001`Marks[2]`\u3001`Marks[3]` \u5168\u90FD\u53EB `Marks`\uFF0C\u9760\u65B9\u62EC\u53F7\u91CC\u7684\u6570\u5B57\u5206\u5F00\u3002",
              "\u8FD9\u4E00\u4E0B\u5C31\u89E3\u5F00\u4E86\u540D\u5B57\u7684\u6B7B\u7ED3\uFF1A\u7F16\u53F7\u662F\u4E2A\u6570\u5B57\uFF0C\u800C\u6570\u5B57\u53EF\u4EE5\u7528\u53D8\u91CF\u88C5\u3002`Marks[I]` \u91CC\u7684 `I` \u6BCF\u53D8\u4E00\u6B21\u5C31\u6307\u5411\u4E0D\u540C\u7684\u683C\u5B50\u2014\u2014\u7B2C 5 \u7AE0\u7684 `FOR` \u6B63\u597D\u80FD\u628A `I` \u4ECE 1 \u6570\u5230 30\u3002**\u4E00\u6392\u683C\u5B50\u52A0\u4E00\u4E2A\u5FAA\u73AF\uFF0C\u4E09\u5341\u4E2A\u6570\u548C\u4E09\u4E2A\u6570\u5199\u8D77\u6765\u4E00\u6837\u957F\u3002**",
              "\u683C\u5B50\u91CC\u653E\u7684\u4E1C\u897F\u5FC5\u987B\u662F\u540C\u4E00\u79CD\u7C7B\u578B\uFF1A\u4E00\u4E2A `ARRAY \u2026 OF INTEGER` \u7684\u6BCF\u4E2A\u683C\u5B50\u90FD\u662F `INTEGER`\uFF0C\u4E0D\u80FD\u6709\u4E00\u683C\u585E `STRING`\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u6570\u7EC4\u662F\u4E00\u7EC4\u76F8\u540C\u7C7B\u578B\u7684\u6570\u636E\uFF0C\u7528\u4E00\u4E2A\u6807\u8BC6\u7B26\u548C\u4E0B\u6807\u8BBF\u95EE\uFF08\xA710.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "comparison",
            title: "\u8BB0\u4F4F\u4E09\u4E2A\u5206\u6570\uFF0C\u4E24\u79CD\u5199\u6CD5",
            intro: "\u4E09\u4E2A\u7684\u65F6\u5019\u5DEE\u522B\u4E0D\u5927\u2014\u2014\u8BF7\u4E00\u8FB9\u770B\u4E00\u8FB9\u60F3\u300C\u5982\u679C\u662F\u4E09\u5341\u4E2A\u4F1A\u600E\u6837\u300D\u3002",
            panes: [
              {
                label: "\u81EA\u7136\u8BED\u8A00",
                language: "natural",
                code: "\u8BB0\u4E0B\u4E09\u4E2A\u5206\u6570\uFF0C\u7136\u540E\u628A\u5B83\u4EEC\u52A0\u8D77\u6765\u3002",
                note: "\u4EBA\u8BF4\u300C\u4E09\u4E2A\u5206\u6570\u300D\u65F6\uFF0C\u8111\u5B50\u91CC\u662F\u4E00\u7EC4\u4E1C\u897F\uFF0C\u4E0D\u662F\u4E09\u4E2A\u5404\u81EA\u72EC\u7ACB\u7684\u540D\u5B57\u3002\u6570\u7EC4\u5C31\u662F\u628A\u8FD9\u4E2A\u300C\u4E00\u7EC4\u300D\u76F4\u63A5\u5199\u8FDB\u4EE3\u7801\u3002"
              },
              {
                label: "\u4F2A\u4EE3\u7801 \xB7 \u4E09\u4E2A\u5404\u81EA\u72EC\u7ACB\u7684\u53D8\u91CF",
                language: "pseudocode",
                code: [
                  "DECLARE MarkOne : INTEGER",
                  "DECLARE MarkTwo : INTEGER",
                  "DECLARE MarkThree : INTEGER",
                  "MarkOne \u2190 80",
                  "MarkTwo \u2190 70",
                  "MarkThree \u2190 60",
                  'OUTPUT "Total: ", MarkOne + MarkTwo + MarkThree'
                ].join("\n"),
                note: "\u4E09\u4E2A\u540D\u5B57\uFF0C\u4E09\u884C\u8D4B\u503C\uFF0C\u52A0\u8D77\u6765\u8FD8\u8981\u628A\u4E09\u4E2A\u540D\u5B57\u518D\u5199\u4E00\u904D\u3002\u6362\u6210\u4E09\u5341\u4E2A\uFF0C\u8FD9\u6BB5\u5C31\u8981\u5199\u4E5D\u5341\u884C\uFF0C\u800C\u4E14\u6CA1\u6709\u4EFB\u4F55\u529E\u6CD5\u7528\u5FAA\u73AF\u3002"
              },
              {
                label: "\u4F2A\u4EE3\u7801 \xB7 \u4E00\u4E2A\u6570\u7EC4",
                language: "pseudocode",
                code: [
                  "DECLARE Marks : ARRAY[1:3] OF INTEGER",
                  "Marks[1] \u2190 80",
                  "Marks[2] \u2190 70",
                  "Marks[3] \u2190 60",
                  'OUTPUT "Total: ", Marks[1] + Marks[2] + Marks[3]'
                ].join("\n"),
                note: "\u4E00\u4E2A\u540D\u5B57\uFF0C\u4E09\u4E2A\u7F16\u53F7\u3002\u73B0\u5728\u628A `3` \u6539\u6210 `30` \u53EA\u8981\u6539\u4E00\u5904\u2014\u2014\u800C\u4E14\u7F16\u53F7\u53EF\u4EE5\u6362\u6210\u53D8\u91CF\uFF0C\u90A3\u624D\u662F\u771F\u6B63\u7684\u597D\u5904\uFF0C8.4 \u4F1A\u7528\u4E0A\u3002"
              },
              {
                label: "Python",
                language: "python",
                code: ["marks = [80, 70, 60]", 'print("Total:", marks[0] + marks[1] + marks[2])'].join("\n"),
                note: "\u540C\u4E00\u4E2A\u60F3\u6CD5\u3002Python \u7684\u7F16\u53F7\u4ECE 0 \u8D77\uFF0C\u800C\u4F2A\u4EE3\u7801\u7684\u4E0A\u4E0B\u754C\u7531\u4F60\u81EA\u5DF1\u5728\u58F0\u660E\u91CC\u5199\u660E\u2014\u2014\u4E0B\u4E00\u8282\u5C31\u8BB2\u8FD9\u4E2A\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E3A\u4EC0\u4E48\u8BF4\u300C\u4E09\u5341\u4E2A\u5206\u6570\u7528\u4E09\u5341\u4E2A\u53D8\u91CF\u5199\u4E0D\u4E86\u300D\uFF1F",
            options: [
              {
                key: "A",
                label: "\u56E0\u4E3A\u4E09\u5341\u4E2A\u53D8\u91CF\u7684\u7C7B\u578B\u6CA1\u6CD5\u7EDF\u4E00",
                correct: false,
                explanation: "\u4E09\u5341\u4E2A\u53D8\u91CF\u5F53\u7136\u53EF\u4EE5\u90FD\u58F0\u660E\u6210 `INTEGER`\u3002\u6570\u7EC4\u8981\u6C42\u7C7B\u578B\u7EDF\u4E00\uFF0C\u53CD\u800C\u662F\u5B83\u6BD4\u6563\u53D8\u91CF\u66F4\u4E25\u7684\u5730\u65B9\u3002"
              },
              {
                key: "B",
                label: "\u56E0\u4E3A\u53D8\u91CF\u7684\u540D\u5B57\u6CA1\u6CD5\u7528\u5FAA\u73AF\u751F\u6210",
                correct: true,
                explanation: "\u5BF9\u3002\u5FAA\u73AF\u80FD\u8BA9\u4E00\u4E2A\u6570\u5B57\u53D8\u6765\u53D8\u53BB\uFF0C\u4F46\u6CA1\u6CD5\u8BA9\u53D8\u91CF\u7684**\u540D\u5B57**\u53D8\u6765\u53D8\u53BB\u3002\u6570\u7EC4\u628A\u300C\u7B2C\u51E0\u4E2A\u300D\u53D8\u6210\u4E86\u4E00\u4E2A\u6570\u5B57\uFF0C\u5FAA\u73AF\u624D\u4F7F\u5F97\u4E0A\u529B\u3002"
              },
              {
                key: "C",
                label: "\u56E0\u4E3A\u4F2A\u4EE3\u7801\u6700\u591A\u53EA\u80FD\u58F0\u660E\u5341\u4E2A\u53D8\u91CF",
                correct: false,
                explanation: "\u6CA1\u6709\u8FD9\u6761\u9650\u5236\u3002\u4E09\u5341\u4E2A `DECLARE` \u5B8C\u5168\u5408\u6CD5\uFF0C\u53EA\u662F\u5199\u8D77\u6765\u6CA1\u6CD5\u6536\u62FE\u3002"
              },
              {
                key: "D",
                label: "\u56E0\u4E3A\u53D8\u91CF\u5B58\u4E0D\u4E0B\u90A3\u4E48\u591A\u6570\u636E",
                correct: false,
                explanation: "\u4E00\u4E2A\u53D8\u91CF\u5B58\u4E00\u4E2A\u6570\uFF0C\u4E09\u5341\u4E2A\u53D8\u91CF\u5B58\u5F97\u4E0B\u4E09\u5341\u4E2A\u6570\u3002\u95EE\u9898\u4E0D\u5728\u5B58\u4E0D\u5B58\u5F97\u4E0B\uFF0C\u5728\u5199\u4E0D\u5199\u5F97\u52A8\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "8.2",
        title: "\u58F0\u660E\u3001\u4E0B\u6807\u3001\u4E0B\u754C\u4E0E\u4E0A\u754C",
        syllabus: ["\xA710.2", "G\xA73"],
        estimatedMinutes: 10,
        taughtFeatures: AFTER_8_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u58F0\u660E\u4E00\u4E2A\u6570\u7EC4\u5199\u6210 `DECLARE Marks : ARRAY[1:30] OF INTEGER`\u3002\u8BFB\u4F5C\uFF1A`Marks` \u662F\u4E00\u6392\u683C\u5B50\uFF0C\u7F16\u53F7\u4ECE 1 \u5230 30\uFF0C\u6BCF\u4E2A\u683C\u5B50\u91CC\u88C5\u4E00\u4E2A `INTEGER`\u3002",
              "\u65B9\u62EC\u53F7\u91CC\u90A3\u4E24\u4E2A\u6570\u5C31\u662F**\u4E0B\u754C\uFF08lower bound\uFF09**\u548C**\u4E0A\u754C\uFF08upper bound\uFF09**\u2014\u2014\u7B2C\u4E00\u4E2A\u683C\u5B50\u7684\u7F16\u53F7\u548C\u6700\u540E\u4E00\u4E2A\u683C\u5B50\u7684\u7F16\u53F7\u3002**\u4E24\u7AEF\u90FD\u7B97\u6570**\uFF0C\u6240\u4EE5 `ARRAY[1:30]` \u4E00\u5171 30 \u4E2A\u683C\u5B50\u3002",
              "\u65B9\u62EC\u53F7\u91CC\u7528\u6765\u6307\u683C\u5B50\u7684\u90A3\u4E2A\u6570\u53EB**\u4E0B\u6807\uFF08index\uFF09**\u3002`Marks[7]` \u7684\u4E0B\u6807\u662F 7\u3002\u4E0B\u6807\u5FC5\u987B\u662F `INTEGER`\uFF0C\u53EF\u4EE5\u662F\u5B57\u9762\u91CF\uFF0C\u4E5F\u53EF\u4EE5\u662F\u53D8\u91CF\u6216\u7B97\u5F0F\u2014\u2014\u4F46\u4E0D\u80FD\u662F `REAL`\uFF0C\u54EA\u6015\u5B83\u6B63\u597D\u662F\u4E2A\u6574\u6570\u503C\u3002",
              "CAIE \u8981\u6C42\u628A\u4E0A\u4E0B\u754C**\u5199\u660E\u767D**\uFF0C\u4E0D\u80FD\u53EA\u5199\u4E2A\u957F\u5EA6\u3002\u8FD9\u6837\u505A\u7684\u597D\u5904\u662F\u7F16\u53F7\u4ECE\u51E0\u5F00\u59CB\u7531\u4F60\u51B3\u5B9A\uFF1A\u6210\u7EE9\u4ECE 1 \u6570\u5230 30 \u5F88\u81EA\u7136\uFF0C\u800C\u8981\u8868\u793A 2020 \u5230 2029 \u8FD9\u5341\u5E74\uFF0C\u76F4\u63A5\u5199 `ARRAY[2020:2029]` \u6BD4\u81EA\u5DF1\u6362\u7B97\u65B9\u4FBF\u5F97\u591A\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u4E00\u7EF4\u6570\u7EC4\u58F0\u660E\u4E3A `DECLARE <identifier> : ARRAY[<lower>:<upper>] OF <type>`\uFF0C\u4E0A\u4E0B\u754C\u90FD\u8981\u663E\u5F0F\u5199\u51FA\uFF0C\u4E14\u90FD\u5305\u542B\u5728\u5185\uFF08Pseudocode Guide \xA73\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u4E00\u6392\u683C\u5B50\uFF0C\u4E00\u4E2A\u4E00\u4E2A\u653E",
            fileName: "Example_8_2_a.pseudocode",
            code: [
              "DECLARE Marks : ARRAY[1:3] OF INTEGER",
              "DECLARE Where : INTEGER",
              "Marks[1] \u2190 80",
              "Marks[2] \u2190 70",
              "Where \u2190 3",
              "Marks[Where] \u2190 60",
              'OUTPUT "First: ", Marks[1]',
              'OUTPUT "Last: ", Marks[3]',
              'OUTPUT "Total: ", Marks[1] + Marks[2] + Marks[3]'
            ].join("\n"),
            annotations: [
              { fromLine: 1, toLine: 1, text: "\u4E0B\u754C 1\u3001\u4E0A\u754C 3\uFF0C\u4E00\u5171\u4E09\u4E2A\u683C\u5B50\uFF0C\u6BCF\u683C\u88C5\u4E00\u4E2A `INTEGER`\u3002" },
              { fromLine: 5, toLine: 6, text: "\u4E0B\u6807\u53EF\u4EE5\u662F\u53D8\u91CF\u3002\u8FD9\u4E00\u884C\u548C `Marks[3] \u2190 60` \u662F\u540C\u4E00\u4EF6\u4E8B\u2014\u2014\u6B63\u56E0\u4E3A\u5982\u6B64\uFF0C\u5FAA\u73AF\u624D\u80FD\u6D3E\u4E0A\u7528\u573A\u3002" },
              { fromLine: 9, toLine: 9, text: "\u53D6\u51FA\u6765\u7684 `Marks[1]` \u5C31\u662F\u4E2A\u666E\u901A\u7684 `INTEGER`\uFF0C\u80FD\u52A0\u80FD\u6BD4\uFF0C\u548C\u522B\u7684\u6574\u6570\u6CA1\u6709\u4E24\u6837\u3002" }
            ],
            sampleRun: { inputs: [], outputs: ["First: 80", "Last: 60", "Total: 210"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`DECLARE Years : ARRAY[2020:2029] OF INTEGER` \u4E00\u5171\u6709\u51E0\u4E2A\u683C\u5B50\uFF1F",
            options: [
              {
                key: "A",
                label: "9 \u4E2A",
                correct: false,
                explanation: "\u5C11\u7B97\u4E86\u4E00\u4E2A\u3002\u4E24\u7AEF\u90FD\u5305\u542B\uFF0C\u6240\u4EE5\u662F\u300C\u4E0A\u754C\u51CF\u4E0B\u754C\u518D\u52A0\u4E00\u300D\u3002"
              },
              {
                key: "B",
                label: "2029 \u4E2A",
                correct: false,
                explanation: "2029 \u662F\u6700\u540E\u4E00\u4E2A\u683C\u5B50\u7684\u7F16\u53F7\uFF0C\u4E0D\u662F\u683C\u5B50\u7684\u6570\u91CF\u3002\u4E0B\u6807\u4E0D\u4E00\u5B9A\u4ECE 1 \u5F00\u59CB\u3002"
              },
              {
                key: "C",
                label: "\u4E0D\u5408\u6CD5\uFF0C\u4E0B\u754C\u5FC5\u987B\u662F 1",
                correct: false,
                explanation: "\u4E0B\u754C\u53EF\u4EE5\u662F\u4EFB\u4F55\u6574\u6570\u3002\u8BA9\u7F16\u53F7\u76F4\u63A5\u5C31\u662F\u5E74\u4EFD\uFF0C\u6BD4\u81EA\u5DF1\u6362\u7B97\u6210 1 \u5230 10 \u7701\u4E8B\u5F97\u591A\u3002"
              },
              {
                key: "D",
                label: "10 \u4E2A",
                correct: true,
                explanation: "\u5BF9\u3002\u4E0A\u4E0B\u754C\u4E24\u7AEF\u90FD\u7B97\u6570\uFF1A2029 \u51CF 2020 \u7B49\u4E8E 9\uFF0C\u518D\u52A0\u4E00\u5C31\u662F 10 \u4E2A\u683C\u5B50\uFF0C\u7F16\u53F7\u4ECE 2020 \u4E00\u76F4\u5230 2029\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "8.2.1",
            title: "\u5012\u7740\u5FF5\u56DE\u53BB",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u63D0\u793A\u5E76\u8BFB\u5165\u4E09\u4E2A\u6574\u6570\uFF0C\u628A\u5B83\u4EEC\u5B58\u8FDB\u4E00\u4E2A\u6570\u7EC4\uFF0C\u7136\u540E\u5012\u7740\u663E\u793A\u51FA\u6765\u2014\u2014\u6700\u540E\u8BFB\u5230\u7684\u5148\u663E\u793A\u3002",
            ioSpec: {
              input: ["\u4E09\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a number`"].join("\n"),
              output: "\u4E09\u884C\uFF0C\u6BCF\u884C\u4E00\u4E2A\u6570\uFF0C\u987A\u5E8F\u548C\u8BFB\u8FDB\u6765\u7684\u76F8\u53CD\u3002"
            },
            constraints: {
              require: [
                {
                  feature: "decl.array-1d",
                  reason: "\u4E09\u4E2A\u6570\u8981\u4E00\u8D77\u5B58\u7740\u5F85\u4F1A\u513F\u518D\u7528\uFF0C\u8FD9\u6B63\u662F\u4E00\u6392\u683C\u5B50\u8BE5\u5E72\u7684\u4E8B\u3002"
                },
                {
                  feature: "array.index",
                  reason: "\u5B58\u8FDB\u53BB\u548C\u53D6\u51FA\u6765\u90FD\u8981\u6307\u660E\u662F\u7B2C\u51E0\u4E2A\u683C\u5B50\u3002"
                }
              ]
            },
            hints: [
              "\u5148\u58F0\u660E\u4E00\u4E2A\u88C5\u5F97\u4E0B\u4E09\u4E2A\u6574\u6570\u7684\u6570\u7EC4\uFF0C\u4E0B\u754C\u5199 1\u3002",
              "\u8BFB\u7684\u65F6\u5019\u6309 1\u30012\u30013 \u5B58\u8FDB\u53BB\uFF0C\u663E\u793A\u7684\u65F6\u5019\u6309 3\u30012\u30011 \u53D6\u51FA\u6765\u3002"
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
              { id: "t1", kind: "normal", inputs: ["10", "20", "30"], caseHint: "\u4E09\u4E2A\u5404\u4E0D\u76F8\u540C\u7684\u6570\u3002" },
              { id: "t2", kind: "normal", inputs: ["5", "5", "9"], caseHint: "\u524D\u4E24\u4E2A\u4E00\u6837\u5927\u3002" },
              { id: "t3", kind: "boundary", inputs: ["0", "0", "0"], caseHint: "\u5168\u662F\u96F6\u3002" },
              { id: "t4", kind: "boundary", inputs: ["-1", "-2", "-3"], caseHint: "\u5168\u662F\u8D1F\u6570\u3002" },
              { id: "t5", kind: "extreme", inputs: ["999999", "1", "888888"], caseHint: "\u63BA\u7740\u5F88\u5927\u548C\u5F88\u5C0F\u7684\u6570\u3002" }
            ]
          }
        ]
      },
      {
        id: "8.3",
        title: "\u8D8A\u754C\u4E0E\u8FD8\u6CA1\u653E\u4E1C\u897F\u7684\u683C\u5B50",
        syllabus: ["\xA710.2", "G\xA73"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_8_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u6570\u7EC4\u53EA\u6709\u58F0\u660E\u65F6\u8BF4\u597D\u7684\u90A3\u4E9B\u683C\u5B50\u3002`ARRAY[1:3]` \u6CA1\u6709\u7B2C 0 \u683C\uFF0C\u4E5F\u6CA1\u6709\u7B2C 4 \u683C\u3002\u6307\u4E00\u4E2A\u4E0D\u5B58\u5728\u7684\u683C\u5B50\u53EB**\u8D8A\u754C**\uFF0C\u7A0B\u5E8F\u4E0D\u4F1A\u5C06\u5C31\u7740\u7ED9\u4F60\u4E00\u4E2A\u503C\uFF0C\u5B83\u4F1A\u505C\u4E0B\u6765\u3002",
              "\u8D8A\u754C\u4EC0\u4E48\u65F6\u5019\u88AB\u53D1\u73B0\uFF0C\u53D6\u51B3\u4E8E\u4E0B\u6807\u662F\u4EC0\u4E48\u3002**\u4E0B\u6807\u5199\u6210\u5B57\u9762\u91CF\u65F6\uFF0C\u7F16\u8F91\u5668\u5728\u8FD0\u884C\u524D\u5C31\u80FD\u62E6\u4E0B\u6765**\u2014\u2014`Marks[4]` \u91CC\u7684 4 \u6446\u5728\u90A3\u513F\uFF0C\u4E00\u770B\u5C31\u77E5\u9053\u8D85\u4E86\u3002",
              "**\u4E0B\u6807\u662F\u53D8\u91CF\u65F6\u5C31\u53EA\u80FD\u7B49\u5230\u8DD1\u8D77\u6765**\u3002`Marks[I]` \u91CC\u7684 `I` \u662F\u591A\u5C11\uFF0C\u8981\u6267\u884C\u5230\u90A3\u4E00\u884C\u624D\u77E5\u9053\u3002\u5FAA\u73AF\u8FB9\u754C\u5199\u9519\u4E00\u4F4D\uFF0C\u524D\u51E0\u904D\u90FD\u5BF9\uFF0C\u6700\u540E\u4E00\u904D\u624D\u70B8\u2014\u2014\u8FD9\u53C8\u662F\u4E00\u6B21\u300C\u80FD\u901A\u8FC7\u68C0\u67E5\u4E0D\u7B49\u4E8E\u80FD\u8DD1\u5B8C\u300D\u3002",
              "\u8FD8\u6709\u4E00\u79CD\u4E0D\u662F\u8D8A\u754C\u4F46\u540C\u6837\u4F1A\u505C\u7684\u60C5\u51B5\uFF1A\u683C\u5B50\u5728\u8303\u56F4\u91CC\uFF0C\u53EF\u662F**\u8FD8\u6CA1\u5F80\u91CC\u653E\u8FC7\u4E1C\u897F**\u3002\u58F0\u660E\u53EA\u662F\u5212\u51FA\u683C\u5B50\uFF0C\u6CA1\u6709\u7ED9\u5B83\u4EEC\u586B\u503C\uFF0C\u8BFB\u4E00\u4E2A\u7A7A\u683C\u5B50\u548C\u8BFB\u4E00\u4E2A\u6CA1\u8D4B\u8FC7\u503C\u7684\u53D8\u91CF\u662F\u4E00\u56DE\u4E8B\u3002"
            ]
          },
          {
            kind: "counterExample",
            title: "\u4E09\u79CD\u6307\u9519\u683C\u5B50\u7684\u65B9\u5F0F",
            cases: [
              {
                title: "\u4E0B\u6807\u5199\u6B7B\u4E86\uFF0C\u8FD0\u884C\u524D\u5C31\u62E6\u4E0B",
                code: ["DECLARE Marks : ARRAY[1:3] OF INTEGER", "Marks[4] \u2190 90"].join("\n"),
                note: "4 \u8D85\u8FC7\u4E86\u4E0A\u754C 3\u3002\u8FD9\u4E2A\u4E0B\u6807\u662F\u5199\u6B7B\u7684\uFF0C\u7F16\u8F91\u5668\u4E0D\u7528\u8DD1\u5C31\u77E5\u9053\u5B83\u4E0D\u5B58\u5728\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "ARRAY-004", line: 2, text: "\u7B2C 4 \u4E2A\u683C\u5B50\u4E0D\u5B58\u5728\u2014\u2014\u8FD9\u4E2A\u6570\u7EC4\u53EA\u6709\u7B2C 1 \u5230\u7B2C 3 \u683C\u3002" }
                ]
              },
              {
                title: "\u4E0B\u6807\u662F\u53D8\u91CF\uFF0C\u8DD1\u5230\u90A3\u4E00\u904D\u624D\u70B8",
                code: [
                  "DECLARE Marks : ARRAY[1:3] OF INTEGER",
                  "DECLARE I : INTEGER",
                  "FOR I \u2190 1 TO 4",
                  "   Marks[I] \u2190 I",
                  "NEXT I"
                ].join("\n"),
                note: "\u5FAA\u73AF\u591A\u8DD1\u4E86\u4E00\u904D\u3002\u524D\u4E09\u904D\u90FD\u5BF9\uFF0C\u7B2C\u56DB\u904D\u624D\u8D8A\u754C\u2014\u2014\u7F16\u8F91\u5668\u4E00\u6761\u63D0\u793A\u90FD\u6CA1\u6709\uFF0C\u56E0\u4E3A `I` \u662F\u591A\u5C11\u8981\u8DD1\u8D77\u6765\u624D\u77E5\u9053\u3002",
                expectRuntimeError: {
                  code: "RT1603",
                  line: 4,
                  text: "\u5FAA\u73AF\u8DD1\u5230\u7B2C 4 \u904D\uFF0C\u53EF\u6570\u7EC4\u53EA\u5230\u7B2C 3 \u683C\u3002\u68C0\u67E5\u4E00\u4E0B\u5FAA\u73AF\u7684\u7EC8\u70B9\u3002"
                }
              },
              {
                title: "\u683C\u5B50\u5728\uFF0C\u4F46\u8FD8\u662F\u7A7A\u7684",
                code: ["DECLARE Marks : ARRAY[1:3] OF INTEGER", "OUTPUT Marks[2]"].join("\n"),
                note: "\u7B2C 2 \u683C\u786E\u5B9E\u5B58\u5728\uFF0C\u53EA\u662F\u4ECE\u5934\u5230\u5C3E\u6CA1\u5F80\u91CC\u653E\u8FC7\u4E1C\u897F\u3002\u58F0\u660E\u53EA\u5212\u683C\u5B50\uFF0C\u4E0D\u586B\u503C\u3002",
                expectRuntimeError: {
                  code: "RT1003",
                  line: 2,
                  text: "\u8FD9\u4E2A\u683C\u5B50\u8FD8\u6CA1\u6709\u503C\u2014\u2014\u5148\u7ED9\u5B83\u8D4B\u503C\uFF0C\u6216\u8005\u7528 `INPUT` \u8BFB\u4E00\u4E2A\u8FDB\u53BB\u3002"
                }
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`DECLARE A : ARRAY[1:5] OF INTEGER` \u4E4B\u540E\uFF0C\u54EA\u4E00\u79CD\u5199\u6CD5\u7F16\u8F91\u5668**\u5728\u8FD0\u884C\u524D\u5C31\u80FD**\u53D1\u73B0\u95EE\u9898\uFF1F",
            options: [
              {
                key: "A",
                label: "A[6] \u2190 1",
                correct: true,
                explanation: "\u5BF9\u30026 \u662F\u5199\u6B7B\u5728\u4EE3\u7801\u91CC\u7684\uFF0C\u548C\u4E0A\u754C 5 \u4E00\u6BD4\u5C31\u77E5\u9053\u8D85\u4E86\uFF0C\u4E0D\u7528\u8DD1\u8D77\u6765\u3002"
              },
              {
                key: "B",
                label: "A[I] \u2190 1\uFF0C\u800C I \u8FD9\u65F6\u5019\u662F 6",
                correct: false,
                explanation: "`I` \u7684\u503C\u8981\u6267\u884C\u5230\u90A3\u4E00\u884C\u624D\u77E5\u9053\uFF0C\u6240\u4EE5\u8FD9\u79CD\u8D8A\u754C\u53EA\u80FD\u5728\u8FD0\u884C\u65F6\u53D1\u73B0\u3002"
              },
              {
                key: "C",
                label: "OUTPUT A[3]\uFF0C\u800C\u7B2C 3 \u683C\u8FD8\u6CA1\u8D4B\u8FC7\u503C",
                correct: false,
                explanation: "\u7B2C 3 \u683C\u5728\u8303\u56F4\u91CC\uFF0C\u9759\u6001\u68C0\u67E5\u6311\u4E0D\u51FA\u6BDB\u75C5\uFF1B\u7A7A\u683C\u5B50\u662F\u8DD1\u5230\u90A3\u4E00\u884C\u624D\u505C\u3002"
              },
              {
                key: "D",
                label: "\u4E09\u79CD\u90FD\u80FD\u5728\u8FD0\u884C\u524D\u53D1\u73B0",
                correct: false,
                explanation: "\u53EA\u6709\u4E0B\u6807\u5199\u6B7B\u7684\u90A3\u4E00\u79CD\u53EF\u4EE5\u3002\u53E6\u5916\u4E24\u79CD\u90FD\u8981\u7B49\u7A0B\u5E8F\u771F\u7684\u8DD1\u5230\u90A3\u4E00\u884C\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "8.4",
        title: "\u7528 `FOR` \u904D\u5386\u6570\u7EC4",
        syllabus: ["\xA710.2", "G\xA73"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_8_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u628A\u6570\u7EC4\u7684\u6BCF\u4E2A\u683C\u5B50\u4ECE\u5934\u5230\u5C3E\u8D70\u4E00\u904D\uFF0C\u53EB**\u904D\u5386\uFF08traverse\uFF09**\u3002\u6570\u7EC4\u7684\u4E0B\u6807\u662F\u8FDE\u7EED\u7684\u6574\u6570\uFF0C`FOR` \u7684\u63A7\u5236\u53D8\u91CF\u4E5F\u662F\u8FDE\u7EED\u7684\u6574\u6570\u2014\u2014\u4E24\u8005\u5929\u751F\u662F\u4E00\u5BF9\u3002",
              "\u5199\u6CD5\u5C31\u662F\u8BA9\u63A7\u5236\u53D8\u91CF\u4ECE\u4E0B\u754C\u6570\u5230\u4E0A\u754C\uFF0C\u5FAA\u73AF\u4F53\u91CC\u7528\u5B83\u5F53\u4E0B\u6807\uFF1A`FOR I \u2190 1 TO 5` \u914D `Marks[I]`\u3002\u5FAA\u73AF\u8DD1\u51E0\u904D\uFF0C\u683C\u5B50\u5C31\u88AB\u78B0\u51E0\u6B21\u3002",
              "**\u5FAA\u73AF\u7684\u8FB9\u754C\u8981\u548C\u6570\u7EC4\u7684\u4E0A\u4E0B\u754C\u5BF9\u4E0A\u3002**\u6570\u7EC4\u662F `ARRAY[1:5]`\uFF0C\u5FAA\u73AF\u5C31\u5199 `1 TO 5`\uFF1B\u5199\u6210 `1 TO 6` \u4F1A\u5728\u6700\u540E\u4E00\u904D\u8D8A\u754C\uFF0C\u5199\u6210 `1 TO 4` \u5219\u4F1A\u5B89\u9759\u5730\u6F0F\u6389\u6700\u540E\u4E00\u683C\u2014\u2014\u540E\u8005\u66F4\u9EBB\u70E6\uFF0C\u56E0\u4E3A\u5B83\u4E0D\u62A5\u9519\uFF0C\u53EA\u662F\u7ED3\u679C\u5C11\u4E86\u4E00\u5757\u3002"
            ]
          },
          {
            kind: "example",
            title: "\u8BFB\u8FDB\u6765\u518D\u5012\u7740\u663E\u793A",
            fileName: "Example_8_4_a.pseudocode",
            code: [
              "DECLARE Numbers : ARRAY[1:5] OF INTEGER",
              "DECLARE I : INTEGER",
              "FOR I \u2190 1 TO 5",
              '   OUTPUT "Enter a number"',
              "   INPUT Numbers[I]",
              "NEXT I",
              "FOR I \u2190 5 TO 1 STEP -1",
              "   OUTPUT Numbers[I]",
              "NEXT I"
            ].join("\n"),
            annotations: [
              { fromLine: 3, toLine: 6, text: "\u7B2C\u4E00\u904D\u904D\u5386\uFF1A\u4ECE\u4E0B\u754C\u6570\u5230\u4E0A\u754C\uFF0C\u6BCF\u904D\u8BFB\u4E00\u4E2A\u6570\u653E\u8FDB\u7B2C `I` \u683C\u3002" },
              { fromLine: 7, toLine: 7, text: "\u7B2C\u4E8C\u904D\u904D\u5386\u5012\u7740\u8D70\u2014\u2014\u8D77\u70B9\u662F\u4E0A\u754C\uFF0C\u7EC8\u70B9\u662F\u4E0B\u754C\uFF0C\u914D `STEP -1`\uFF085.2\uFF09\u3002" },
              { fromLine: 5, toLine: 5, text: "`INPUT` \u7684\u76EE\u6807\u53EF\u4EE5\u76F4\u63A5\u662F\u6570\u7EC4\u7684\u67D0\u4E00\u683C\uFF0C\u4E0D\u7528\u5148\u8BFB\u8FDB\u4E00\u4E2A\u4E34\u65F6\u53D8\u91CF\u518D\u642C\u8FC7\u53BB\u3002" }
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
            prompt: "\u6570\u7EC4\u662F `ARRAY[1:5]`\uFF0C\u5FAA\u73AF\u5199\u6210 `FOR I \u2190 1 TO 4` \u4F1A\u600E\u6837\uFF1F",
            options: [
              {
                key: "A",
                label: "\u7F16\u8F91\u5668\u4F1A\u62E6\u4E0B\u6765",
                correct: false,
                explanation: "\u5FAA\u73AF\u5C11\u8DD1\u4E00\u904D\u5B8C\u5168\u5408\u6CD5\u3002\u7F16\u8F91\u5668\u6CA1\u6CD5\u77E5\u9053\u4F60\u672C\u6765\u60F3\u8DD1\u51E0\u904D\u3002"
              },
              {
                key: "B",
                label: "\u7B2C 5 \u683C\u4F1A\u81EA\u52A8\u88AB\u5F53\u6210 0",
                correct: false,
                explanation: "\u6CA1\u6709\u8FD9\u79CD\u81EA\u52A8\u586B\u503C\u3002\u7B2C 5 \u683C\u53EA\u662F\u4FDD\u6301\u539F\u6837\u2014\u2014\u5982\u679C\u4ECE\u6CA1\u8D4B\u8FC7\u503C\uFF0C\u8BFB\u5B83\u53CD\u800C\u4F1A\u8BA9\u7A0B\u5E8F\u505C\u4E0B\u6765\u3002"
              },
              {
                key: "C",
                label: "\u4E0D\u62A5\u9519\uFF0C\u4F46\u7B2C 5 \u683C\u88AB\u6F0F\u6389\u4E86",
                correct: true,
                explanation: "\u5BF9\u30021 \u5230 4 \u662F\u5408\u6CD5\u7684\u4E0B\u6807\uFF0C\u7A0B\u5E8F\u8DD1\u5F97\u5B8C\uFF0C\u53EA\u662F\u6700\u540E\u4E00\u683C\u4ECE\u5934\u5230\u5C3E\u6CA1\u88AB\u78B0\u8FC7\u3002\u8FD9\u79CD\u9519\u6BD4\u8D8A\u754C\u96BE\u53D1\u73B0\u2014\u2014\u5B83\u53EA\u662F\u7ED3\u679C\u5C11\u4E86\u4E00\u5757\u3002"
              },
              {
                key: "D",
                label: "\u8FD0\u884C\u65F6\u8D8A\u754C\uFF0C\u7A0B\u5E8F\u505C\u4E0B\u6765",
                correct: false,
                explanation: "\u8D8A\u754C\u662F\u6307\u4E86\u4E0D\u5B58\u5728\u7684\u683C\u5B50\u3002\u8FD9\u91CC\u6307\u7684\u683C\u5B50\u90FD\u5B58\u5728\uFF0C\u53EA\u662F\u5C11\u6307\u4E86\u4E00\u4E2A\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "8.4.1",
            title: "\u6570\u4E00\u6570\u6709\u51E0\u4E2A\u53CA\u683C",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u63D0\u793A\u5E76\u8BFB\u5165 5 \u4E2A\u5206\u6570\u5B58\u8FDB\u6570\u7EC4\uFF0C\u7136\u540E\u6570\u4E00\u6570\u5176\u4E2D\u6709\u51E0\u4E2A\u4E0D\u4F4E\u4E8E 50\uFF0C\u663E\u793A\u8FD9\u4E2A\u6570\u91CF\u3002",
            ioSpec: {
              input: ["\u4E94\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a mark`"].join("\n"),
              output: "\u4E00\u884C\uFF0C\u5199\u6210 `Passed: <\u4E2A\u6570>`\u3002\u5192\u53F7\u540E\u9762\u662F\u4E00\u4E2A\u7A7A\u683C\u3002"
            },
            constraints: {
              require: [
                {
                  feature: "decl.array-1d",
                  reason: "\u4E94\u4E2A\u5206\u6570\u8981\u5148\u5B58\u4E0B\u6765\uFF0C\u624D\u80FD\u5728\u8BFB\u5B8C\u4E4B\u540E\u518D\u6570\u4E00\u904D\u3002"
                },
                {
                  feature: "loop.for",
                  reason: "\u683C\u5B50\u7684\u7F16\u53F7\u662F\u8FDE\u7EED\u7684\u6574\u6570\uFF0C\u6B21\u6570\u4E00\u5F00\u59CB\u5C31\u77E5\u9053\uFF0C\u4EA4\u7ED9\u8BA1\u6570\u63A7\u5236\u5FAA\u73AF\u6700\u7701\u4E8B\u3002"
                },
                {
                  feature: "array.index",
                  reason: "\u5B58\u8FDB\u53BB\u548C\u6570\u7684\u65F6\u5019\u90FD\u8981\u6307\u660E\u662F\u7B2C\u51E0\u683C\u3002"
                }
              ]
            },
            hints: [
              "\u8BFB\u7684\u65F6\u5019\u7528\u4E00\u4E2A `FOR` \u4ECE\u4E0B\u754C\u8D70\u5230\u4E0A\u754C\uFF0C\u628A\u8BFB\u5230\u7684\u6570\u653E\u8FDB\u7B2C `I` \u683C\u3002",
              "\u6570\u7684\u65F6\u5019\u9700\u8981\u4E00\u4E2A\u8BA1\u6570\u53D8\u91CF\uFF0C\u5FAA\u73AF\u5F00\u59CB\u524D\u5148\u8BBE\u6210 0\u3002",
              "\u300C\u4E0D\u4F4E\u4E8E 50\u300D\u662F\u4E00\u6B21\u6BD4\u8F83\uFF0C\u6BD4\u51FA\u6765\u6210\u7ACB\u5C31\u628A\u8BA1\u6570\u52A0\u4E00\u3002"
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
              "DECLARE I : INTEGER",
              "DECLARE Passed : INTEGER",
              "Passed \u2190 0",
              "FOR I \u2190 1 TO 5",
              '   OUTPUT "Enter a mark"',
              "   INPUT Marks[I]",
              "NEXT I",
              "FOR I \u2190 1 TO 5",
              "   IF Marks[I] >= 50 THEN",
              "      Passed \u2190 Passed + 1",
              "   ENDIF",
              "NEXT I",
              'OUTPUT "Passed: ", Passed'
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["80", "30", "70", "45", "55"], caseHint: "\u53CA\u683C\u548C\u4E0D\u53CA\u683C\u6DF7\u5728\u4E00\u8D77\u3002" },
              { id: "t2", kind: "normal", inputs: ["10", "20", "30", "40", "45"], caseHint: "\u4E00\u4E2A\u90FD\u6CA1\u53CA\u683C\u3002" },
              { id: "t3", kind: "boundary", inputs: ["50", "50", "50", "50", "50"], caseHint: "\u5168\u90E8\u6B63\u597D\u5361\u5728\u53CA\u683C\u7EBF\u4E0A\u3002" },
              { id: "t4", kind: "boundary", inputs: ["49", "49", "49", "49", "49"], caseHint: "\u5168\u90E8\u5DEE\u4E00\u5206\u3002" },
              { id: "t5", kind: "extreme", inputs: ["100", "100", "100", "100", "100"], caseHint: "\u5168\u90E8\u6EE1\u5206\u3002" }
            ]
          }
        ]
      },
      {
        id: "8.5",
        title: "\u5148\u5B58\u4E0B\u6765\uFF0C\u624D\u505A\u5F97\u5230\u7684\u4E8B",
        syllabus: ["\xA710.2", "G\xA73"],
        estimatedMinutes: 10,
        taughtFeatures: AFTER_8_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u6C42\u548C\u3001\u6C42\u6700\u5927\u3001\u8BA1\u6570\u8FD9\u4E09\u4EF6\u4E8B\uFF0C\u7B2C 5 \u7AE0\u4E0D\u7528\u6570\u7EC4\u4E5F\u505A\u5F97\u5230\u2014\u2014\u8FB9\u8BFB\u8FB9\u52A0\u3001\u8FB9\u8BFB\u8FB9\u6BD4\u3001\u8FB9\u8BFB\u8FB9\u6570\u5C31\u884C\u3002\u90A3\u6570\u7EC4\u5230\u5E95\u591A\u7ED9\u4E86\u4EC0\u4E48\uFF1F",
              "**\u5B83\u591A\u7ED9\u4E86\u300C\u518D\u770B\u4E00\u904D\u300D\u7684\u80FD\u529B\u3002**\u8FB9\u8BFB\u8FB9\u7B97\u7684\u4E1C\u897F\uFF0C\u8BFB\u5B8C\u5C31\u4E22\u4E86\uFF1B\u5B58\u8FDB\u6570\u7EC4\u7684\u6570\u636E\uFF0C\u60F3\u770B\u51E0\u904D\u5C31\u770B\u51E0\u904D\u3002",
              "\u6709\u4E9B\u95EE\u9898\u975E\u5F97\u770B\u4E24\u904D\u4E0D\u53EF\u3002\u6BD4\u5982\u300C\u6709\u51E0\u5929\u7684\u6C14\u6E29\u9AD8\u4E8E\u5E73\u5747\u503C\u300D\uFF1A\u5E73\u5747\u503C\u8981\u7B49\u5168\u90E8\u8BFB\u5B8C\u624D\u7B97\u5F97\u51FA\u6765\uFF0C\u53EF\u5224\u65AD\u300C\u9AD8\u4E8E\u5E73\u5747\u300D\u53C8\u8981\u56DE\u5934\u770B\u6BCF\u4E00\u5929\u3002\u7B2C\u4E00\u904D\u8BFB\u5165\u5E76\u6C42\u548C\uFF0C\u7B97\u51FA\u5E73\u5747\uFF0C\u7B2C\u4E8C\u904D\u518D\u56DE\u53BB\u6570\u2014\u2014**\u6CA1\u6709\u5B58\u4E0B\u6765\u5C31\u6CA1\u6709\u7B2C\u4E8C\u904D**\u3002",
              "\u6C42\u6700\u5927\u503C\u6709\u4E2A\u7EC6\u8282\uFF1A\u8D77\u70B9\u4E0D\u8981\u5199 0\u3002\u628A\u7B2C\u4E00\u4E2A\u683C\u5B50\u7684\u503C\u5F53\u8D77\u70B9\uFF0C\u518D\u4ECE\u7B2C\u4E8C\u683C\u5F00\u59CB\u6BD4\uFF0C\u8FD9\u6837\u5373\u4F7F\u5168\u662F\u8D1F\u6570\u4E5F\u4E0D\u4F1A\u51FA\u9519\u3002"
            ]
          },
          {
            kind: "example",
            title: "\u4E24\u904D\u904D\u5386\uFF1A\u5148\u7B97\u5E73\u5747\uFF0C\u518D\u6570\u8D85\u8FC7\u7684",
            fileName: "Example_8_5_a.pseudocode",
            code: [
              "DECLARE Temps : ARRAY[1:4] OF INTEGER",
              "DECLARE I : INTEGER",
              "DECLARE Total : INTEGER",
              "DECLARE Average : INTEGER",
              "DECLARE Above : INTEGER",
              "Total \u2190 0",
              "Above \u2190 0",
              "Temps[1] \u2190 18",
              "Temps[2] \u2190 25",
              "Temps[3] \u2190 20",
              "Temps[4] \u2190 21",
              "FOR I \u2190 1 TO 4",
              "   Total \u2190 Total + Temps[I]",
              "NEXT I",
              "Average \u2190 Total DIV 4",
              "FOR I \u2190 1 TO 4",
              "   IF Temps[I] > Average THEN",
              "      Above \u2190 Above + 1",
              "   ENDIF",
              "NEXT I",
              'OUTPUT "Average: ", Average',
              'OUTPUT "Above: ", Above'
            ].join("\n"),
            annotations: [
              { fromLine: 12, toLine: 14, text: "\u7B2C\u4E00\u904D\uFF1A\u53EA\u7BA1\u52A0\u603B\u3002\u5230\u8FD9\u91CC\u8FD8\u4E0D\u77E5\u9053\u5E73\u5747\u503C\u662F\u591A\u5C11\u3002" },
              { fromLine: 15, toLine: 15, text: "\u5168\u90E8\u52A0\u5B8C\u624D\u7B97\u5F97\u51FA\u5E73\u5747\u503C\u2014\u2014\u8FD9\u5C31\u662F\u4E3A\u4EC0\u4E48\u975E\u8981\u5206\u4E24\u904D\u3002" },
              { fromLine: 16, toLine: 20, text: "\u7B2C\u4E8C\u904D\uFF1A\u62FF\u7740\u5E73\u5747\u503C\u56DE\u5934\u518D\u770B\u6BCF\u4E00\u683C\u3002\u6570\u636E\u8FD8\u5728\u6570\u7EC4\u91CC\uFF0C\u6240\u4EE5\u56DE\u5F97\u53BB\u3002" }
            ],
            sampleRun: { inputs: [], outputs: ["Average: 21", "Above: 1"] }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0B\u9762\u54EA\u4EF6\u4E8B**\u5FC5\u987B**\u628A\u6570\u636E\u5148\u5B58\u8FDB\u6570\u7EC4\u624D\u505A\u5F97\u5230\uFF1F",
            options: [
              {
                key: "A",
                label: "\u627E\u51FA\u8BFB\u5230\u7684\u6570\u91CC\u6700\u5927\u7684\u90A3\u4E2A",
                correct: false,
                explanation: "\u8FB9\u8BFB\u8FB9\u6BD4\u5C31\u884C\uFF1A\u6BCF\u8BFB\u4E00\u4E2A\u548C\u76EE\u524D\u7684\u6700\u5927\u503C\u6BD4\u4E00\u4E0B\uFF0C\u4E0D\u9700\u8981\u8BB0\u4F4F\u6240\u6709\u6570\u3002"
              },
              {
                key: "B",
                label: "\u6570\u51FA\u6709\u51E0\u4E2A\u6570\u5927\u4E8E 50",
                correct: false,
                explanation: "50 \u662F\u4E8B\u5148\u5C31\u77E5\u9053\u7684\u95E8\u69DB\uFF0C\u8FB9\u8BFB\u8FB9\u6570\u5C31\u884C\u3002\u8981\u662F\u95E8\u69DB\u5F97\u7B49\u8BFB\u5B8C\u624D\u7B97\u5F97\u51FA\u6765\uFF0C\u90A3\u5C31\u53E6\u8BF4\u4E86\u3002"
              },
              {
                key: "C",
                label: "\u6570\u51FA\u6709\u51E0\u4E2A\u6570\u9AD8\u4E8E\u8FD9\u4E00\u6279\u6570\u7684\u5E73\u5747\u503C",
                correct: true,
                explanation: "\u5BF9\u3002\u5E73\u5747\u503C\u8981\u5168\u90E8\u8BFB\u5B8C\u624D\u7B97\u5F97\u51FA\u6765\uFF0C\u800C\u5224\u65AD\u8C01\u9AD8\u4E8E\u5B83\u53C8\u8981\u56DE\u5934\u770B\u6BCF\u4E00\u4E2A\u6570\u3002\u6CA1\u5B58\u4E0B\u6765\u5C31\u56DE\u4E0D\u53BB\u4E86\u3002"
              },
              {
                key: "D",
                label: "\u628A\u8BFB\u5230\u7684\u6570\u5168\u90E8\u52A0\u8D77\u6765",
                correct: false,
                explanation: "\u8FB9\u8BFB\u8FB9\u52A0\u5C31\u884C\uFF0C\u52A0\u5B8C\u7684\u6570\u4E0D\u9700\u8981\u518D\u7528\u7B2C\u4E8C\u6B21\u3002"
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
        title: "\u4E00\u5468\u6C14\u6E29",
        statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165\u4E00\u5468\u4E03\u5929\u7684\u6C14\u6E29\u5B58\u8FDB\u6570\u7EC4\uFF0C\u7136\u540E\u663E\u793A\u603B\u548C\u3001\u6700\u9AD8\u503C\u3001\u5E73\u5747\u503C\uFF0C\u4EE5\u53CA\u6709\u51E0\u5929\u9AD8\u4E8E\u5E73\u5747\u503C\u3002",
        ioSpec: {
          input: ["\u4E03\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a temperature`"].join("\n"),
          output: [
            "\u8BFB\u5B8C\u4E4B\u540E\u663E\u793A\u56DB\u884C\uFF1A",
            "`Total: <\u603B\u548C>`",
            "`Highest: <\u6700\u9AD8\u503C>`",
            "`Average: <\u5E73\u5747\u503C>`\u3000\uFF08\u53D6\u6574\u6570\u5546\uFF09",
            "`Above average: <\u9AD8\u4E8E\u5E73\u5747\u503C\u7684\u5929\u6570>`",
            "\u6BCF\u4E2A\u5192\u53F7\u540E\u9762\u90FD\u662F\u4E00\u4E2A\u7A7A\u683C\u3002"
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
          "\u6700\u540E\u90A3\u4E00\u884C\u662F\u8FD9\u9053\u9898\u7684\u5173\u952E\uFF1A\u5E73\u5747\u503C\u8981\u7B49\u4E03\u5929\u5168\u90E8\u8BFB\u5B8C\u624D\u7B97\u5F97\u51FA\u6765\uFF0C\u800C\u300C\u9AD8\u4E8E\u5E73\u5747\u300D\u53C8\u8981\u56DE\u5934\u770B\u6BCF\u4E00\u5929\u3002\u60F3\u6E05\u695A\u8FD9\u9700\u8981\u8D70\u51E0\u904D\u3002",
          "\u6C42\u6700\u9AD8\u503C\u65F6\uFF0C\u8D77\u70B9\u7528\u7B2C\u4E00\u5929\u7684\u6C14\u6E29\uFF0C\u4E0D\u8981\u7528 0\u2014\u2014\u6C14\u6E29\u662F\u53EF\u80FD\u4F4E\u4E8E\u96F6\u7684\u3002",
          "\u603B\u548C\u3001\u6700\u9AD8\u503C\u3001\u8BA1\u6570\u5404\u81EA\u9700\u8981\u4E00\u4E2A\u53D8\u91CF\uFF0C\u90FD\u8981\u5728\u5BF9\u5E94\u7684\u5FAA\u73AF\u5F00\u59CB\u524D\u7ED9\u597D\u521D\u503C\u3002"
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
          "DECLARE I : INTEGER",
          "DECLARE Total : INTEGER",
          "DECLARE Highest : INTEGER",
          "DECLARE Average : INTEGER",
          "DECLARE Above : INTEGER",
          "Total \u2190 0",
          "Above \u2190 0",
          "FOR I \u2190 1 TO 7",
          '   OUTPUT "Enter a temperature"',
          "   INPUT Temps[I]",
          "   Total \u2190 Total + Temps[I]",
          "NEXT I",
          "Highest \u2190 Temps[1]",
          "FOR I \u2190 2 TO 7",
          "   IF Temps[I] > Highest THEN",
          "      Highest \u2190 Temps[I]",
          "   ENDIF",
          "NEXT I",
          "Average \u2190 Total DIV 7",
          "FOR I \u2190 1 TO 7",
          "   IF Temps[I] > Average THEN",
          "      Above \u2190 Above + 1",
          "   ENDIF",
          "NEXT I",
          'OUTPUT "Total: ", Total',
          'OUTPUT "Highest: ", Highest',
          'OUTPUT "Average: ", Average',
          'OUTPUT "Above average: ", Above'
        ].join("\n"),
        tests: [
          { id: "t1", kind: "normal", inputs: ["15", "18", "21", "17", "19", "22", "16"], caseHint: "\u4E00\u5468\u6C14\u6E29\u6709\u9AD8\u6709\u4F4E\u3002" },
          { id: "t2", kind: "boundary", inputs: ["20", "20", "20", "20", "20", "20", "20"], caseHint: "\u4E03\u5929\u4E00\u6A21\u4E00\u6837\u2014\u2014\u8FD9\u65F6\u5019\u6CA1\u6709\u54EA\u5929\u9AD8\u4E8E\u5E73\u5747\u3002" },
          { id: "t3", kind: "boundary", inputs: ["-5", "-3", "-8", "-1", "-6", "-2", "-4"], caseHint: "\u6574\u5468\u90FD\u5728\u96F6\u5EA6\u4EE5\u4E0B\u3002" },
          { id: "t4", kind: "normal", inputs: ["0", "10", "0", "10", "0", "10", "0"], caseHint: "\u53EA\u6709\u4E24\u79CD\u503C\u8F6E\u6D41\u51FA\u73B0\u3002" },
          { id: "t5", kind: "extreme", inputs: ["40", "1", "1", "1", "1", "1", "1"], caseHint: "\u6709\u4E00\u5929\u7279\u522B\u70ED\uFF0C\u628A\u5E73\u5747\u503C\u62C9\u9AD8\u4E86\u3002" }
        ]
      }
    ]
  };

  // packages/teaching-content/src/chapter-09.ts
  var AFTER_CHAPTER_8 = [
    "io.output",
    "io.input",
    "decl.variable",
    "misc.comment",
    "type.string",
    "literal.string",
    "type.integer",
    "type.real",
    "type.char",
    "type.boolean",
    "type.date",
    "literal.integer",
    "literal.real",
    "literal.char",
    "literal.boolean",
    "literal.date",
    "assign.simple",
    "decl.constant",
    "op.arithmetic",
    "op.div",
    "op.mod",
    "op.relational",
    "op.and",
    "op.or",
    "op.not",
    "select.if",
    "select.if-else",
    "select.nested-if",
    "select.case",
    "select.case-range",
    "select.case-otherwise",
    "loop.for",
    "loop.for-step",
    "loop.while",
    "loop.repeat",
    "loop.nested",
    "builtin.length",
    "builtin.mid",
    "builtin.right",
    "builtin.ucase",
    "builtin.lcase",
    "op.concat",
    "builtin.int",
    "builtin.rand",
    "decl.array-1d",
    "array.index"
  ];
  var AFTER_9_1 = [...AFTER_CHAPTER_8, "decl.array-2d", "array.index-2d"];
  var chapter09 = {
    id: 9,
    title: "\u4E8C\u7EF4\u6570\u7EC4",
    level: "AS",
    syllabus: ["\xA710.2"],
    prerequisites: [1, 2, 3, 4, 5, 6, 7, 8],
    sections: [
      {
        id: "9.1",
        title: "\u4E8C\u7EF4\u6570\u7EC4\u7684\u5F62\u72B6",
        syllabus: ["\xA710.2"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_9_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E00\u7EF4\u6570\u7EC4\u662F\u4E00\u6392\u683C\u5B50\u3002\u53EF\u6709\u4E9B\u6570\u636E\u5929\u751F\u662F\u4E00\u5F20**\u8868**\uFF1A\u4E09\u4E2A\u5B66\u751F\u6BCF\u4EBA\u4E24\u79D1\u6210\u7EE9\u3001\u4E00\u5468\u4E03\u5929\u6BCF\u5929\u4E09\u4E2A\u65F6\u6BB5\u3001\u4E00\u5757\u4E94\u884C\u4E09\u5217\u7684\u68CB\u76D8\u3002\u786C\u585E\u8FDB\u4E00\u6392\u683C\u5B50\u4E5F\u884C\uFF0C\u4F46\u5F97\u81EA\u5DF1\u6362\u7B97\u300C\u7B2C 2 \u4E2A\u5B66\u751F\u7684\u7B2C 1 \u79D1\u662F\u7B2C\u51E0\u683C\u300D\u2014\u2014\u6362\u7B97\u5C31\u662F\u51FA\u9519\u7684\u5730\u65B9\u3002",
              "**\u4E8C\u7EF4\u6570\u7EC4\uFF082D array\uFF09**\u76F4\u63A5\u7ED9\u4F60\u4E00\u5F20\u8868\uFF1A`DECLARE Marks : ARRAY[1:3, 1:2] OF INTEGER` \u662F 3 \u884C 2 \u5217\uFF0C\u4E00\u5171 6 \u4E2A\u683C\u5B50\u3002\u65B9\u62EC\u53F7\u91CC\u4E24\u7EC4\u4E0A\u4E0B\u754C\u7528\u9017\u53F7\u9694\u5F00\uFF0C\u6BCF\u4E00\u7EC4\u7684\u89C4\u77E9\u548C\u4E00\u7EF4\u5B8C\u5168\u4E00\u6837\u2014\u2014\u4E24\u7AEF\u90FD\u7B97\u6570\u3002",
              "\u6307\u4E00\u4E2A\u683C\u5B50\u8981\u7ED9\u4E24\u4E2A\u4E0B\u6807\uFF1A`Marks[2, 1]` \u662F\u7B2C 2 \u884C\u7B2C 1 \u5217\u3002CAIE \u7684\u7EA6\u5B9A\u662F**\u5148\u884C\u540E\u5217**\uFF0C\u548C\u8BFB\u4E00\u5F20\u8868\u7684\u987A\u5E8F\u4E00\u81F4\u3002",
              "\u884C\u548C\u5217\u5177\u4F53\u4EE3\u8868\u4EC0\u4E48\u7531\u4F60\u51B3\u5B9A\uFF1A`ARRAY[1:3, 1:2]` \u65E2\u53EF\u4EE5\u662F\u300C3 \u4E2A\u5B66\u751F \xD7 2 \u79D1\u300D\uFF0C\u4E5F\u53EF\u4EE5\u662F\u300C3 \u5929 \xD7 2 \u4E2A\u65F6\u6BB5\u300D\u3002\u58F0\u660E\u91CC\u53EA\u6709\u6570\u5B57\uFF0C\u610F\u601D\u5728\u4F60\u5FC3\u91CC\u2014\u2014\u6240\u4EE5\u53D8\u91CF\u540D\u8981\u8D77\u5F97\u8BA9\u4EBA\u770B\u5F97\u61C2\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u4E8C\u7EF4\u6570\u7EC4\u58F0\u660E\u4E3A `DECLARE <identifier> : ARRAY[<lower1>:<upper1>, <lower2>:<upper2>] OF <type>`\uFF0C\u8BBF\u95EE\u65F6\u4E24\u4E2A\u4E0B\u6807\u6309\u5148\u884C\u540E\u5217\u7684\u987A\u5E8F\u7ED9\u51FA\uFF08\xA710.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u4E00\u5F20 3 \u884C 2 \u5217\u7684\u6210\u7EE9\u8868",
            fileName: "Example_9_1_a.pseudocode",
            code: [
              "DECLARE Marks : ARRAY[1:3, 1:2] OF INTEGER",
              "Marks[1, 1] \u2190 80",
              "Marks[1, 2] \u2190 70",
              "Marks[2, 1] \u2190 55",
              "Marks[2, 2] \u2190 90",
              "Marks[3, 1] \u2190 100",
              "Marks[3, 2] \u2190 40",
              'OUTPUT "Student 1, subject 2: ", Marks[1, 2]',
              'OUTPUT "Student 3, subject 1: ", Marks[3, 1]',
              'OUTPUT "Student 2 total: ", Marks[2, 1] + Marks[2, 2]'
            ].join("\n"),
            annotations: [
              { fromLine: 1, toLine: 1, text: "3 \u884C 2 \u5217\u3002\u7B2C\u4E00\u7EC4\u4E0A\u4E0B\u754C\u7BA1\u884C\uFF0C\u7B2C\u4E8C\u7EC4\u7BA1\u5217\u3002" },
              { fromLine: 2, toLine: 7, text: "\u516D\u4E2A\u683C\u5B50\u9010\u4E2A\u586B\u3002\u884C\u53F7\u5148\u5199\uFF0C\u5217\u53F7\u540E\u5199\u3002" },
              { fromLine: 10, toLine: 10, text: "\u540C\u4E00\u884C\u7684\u4E24\u4E2A\u683C\u5B50\u52A0\u8D77\u6765\uFF0C\u5C31\u662F\u8FD9\u4E2A\u5B66\u751F\u7684\u603B\u5206\u2014\u2014\u884C\u53F7\u76F8\u540C\u3001\u5217\u53F7\u4E0D\u540C\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["Student 1, subject 2: 70", "Student 3, subject 1: 100", "Student 2 total: 145"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`DECLARE Grid : ARRAY[1:4, 1:3] OF INTEGER` \u4E00\u5171\u6709\u591A\u5C11\u4E2A\u683C\u5B50\uFF1F",
            options: [
              {
                key: "A",
                label: "7 \u4E2A",
                correct: false,
                explanation: "\u628A\u4E24\u4E2A\u65B9\u5411\u52A0\u8D77\u6765\u4E86\u3002\u8868\u683C\u7684\u683C\u5B50\u6570\u662F\u884C\u6570\u4E58\u5217\u6570\uFF0C\u4E0D\u662F\u76F8\u52A0\u3002"
              },
              {
                key: "B",
                label: "6 \u4E2A",
                correct: false,
                explanation: "\u5C11\u7B97\u4E86\u4E24\u7AEF\uFF1A1 \u5230 4 \u662F\u56DB\u4E2A\u6570\u4E0D\u662F\u4E09\u4E2A\uFF0C1 \u5230 3 \u662F\u4E09\u4E2A\u6570\u4E0D\u662F\u4E24\u4E2A\u3002"
              },
              {
                key: "C",
                label: "43 \u4E2A",
                correct: false,
                explanation: "\u8FD9\u662F\u628A\u4E0A\u754C\u62FC\u5728\u4E00\u8D77\u4E86\u3002\u65B9\u62EC\u53F7\u91CC\u7684\u4E24\u7EC4\u6570\u662F\u4E24\u4E2A\u65B9\u5411\u7684\u8303\u56F4\uFF0C\u4E0D\u662F\u4E00\u4E2A\u6570\u5B57\u3002"
              },
              {
                key: "D",
                label: "12 \u4E2A",
                correct: true,
                explanation: "\u5BF9\u30024 \u884C\u4E58 3 \u5217\u7B49\u4E8E 12\u3002\u4E24\u7EC4\u4E0A\u4E0B\u754C\u5404\u81EA\u90FD\u662F\u4E24\u7AEF\u90FD\u7B97\u6570\uFF0C\u6240\u4EE5\u662F 4 \u4E2A\u4E58 3 \u4E2A\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "9.2",
        title: "\u4E24\u4E2A\u4E0B\u6807\u4E0D\u80FD\u5F04\u53CD",
        syllabus: ["\xA710.2"],
        estimatedMinutes: 8,
        taughtFeatures: AFTER_9_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E24\u4E2A\u4E0B\u6807\u5FC5\u987B**\u90FD\u7ED9\uFF0C\u800C\u4E14\u6309\u5148\u884C\u540E\u5217\u7684\u987A\u5E8F\u7ED9**\u3002\u5C11\u7ED9\u4E00\u4E2A\uFF0C\u6216\u8005\u987A\u5E8F\u5F04\u53CD\uFF0C\u90FD\u662F\u9519\u7684\u2014\u2014\u4F46\u8FD9\u4E24\u79CD\u9519\u88AB\u53D1\u73B0\u7684\u65B9\u5F0F\u4E0D\u4E00\u6837\u3002",
              "**\u53EA\u7ED9\u4E00\u4E2A\u4E0B\u6807**\uFF0C\u7F16\u8F91\u5668\u5728\u8FD0\u884C\u524D\u5C31\u62E6\u4E0B\u6765\uFF1A\u8FD9\u4E2A\u6570\u7EC4\u8981\u4E24\u4E2A\u4E0B\u6807\uFF0C\u4F60\u53EA\u7ED9\u4E86\u4E00\u4E2A\uFF0C\u4E00\u770B\u5C31\u77E5\u9053\u3002",
              "**\u987A\u5E8F\u5F04\u53CD**\u5C31\u9EBB\u70E6\u5F97\u591A\u3002`ARRAY[1:3, 1:2]` \u5199\u6210 `Marks[2, 3]` \u65F6\uFF0C\u7B2C\u4E8C\u4E2A\u4E0B\u6807 3 \u8D85\u51FA\u4E86\u5217\u7684\u8303\u56F4 1 \u5230 2\uFF0C\u4F1A\u88AB\u6293\u4F4F\uFF1B\u53EF\u8981\u662F\u884C\u548C\u5217\u7684\u8303\u56F4\u4E00\u6837\u5927\u2014\u2014\u6BD4\u5982 `ARRAY[1:3, 1:3]`\u2014\u2014\u90A3 `Marks[2, 1]` \u548C `Marks[1, 2]` **\u90FD\u5408\u6CD5**\uFF0C\u7A0B\u5E8F\u7167\u8DD1\uFF0C\u53EA\u662F\u53D6\u9519\u4E86\u683C\u5B50\u3002",
              "\u6240\u4EE5\u884C\u5217\u987A\u5E8F\u4E0D\u662F\u9760\u7F16\u8F91\u5668\u5E2E\u4F60\u8BB0\u7684\uFF0C\u662F\u9760\u81EA\u5DF1\u5199\u6E05\u695A\u3002\u4E00\u4E2A\u7BA1\u7528\u7684\u4E60\u60EF\uFF1A\u63A7\u5236\u53D8\u91CF\u522B\u53EB `I`\u3001`J`\uFF0C\u53EB `Row` \u548C `Col`\uFF0C\u6216\u8005\u53EB `Student` \u548C `Subject`\u2014\u2014\u540D\u5B57\u4E00\u5199\u5BF9\uFF0C\u987A\u5E8F\u5C31\u5F88\u96BE\u5199\u53CD\u3002"
            ]
          },
          {
            kind: "counterExample",
            title: "\u4E24\u79CD\u7ED9\u9519\u4E0B\u6807\u7684\u65B9\u5F0F",
            cases: [
              {
                title: "\u53EA\u7ED9\u4E86\u4E00\u4E2A\u4E0B\u6807",
                code: ["DECLARE Grid : ARRAY[1:2, 1:3] OF INTEGER", "Grid[1] \u2190 5"].join("\n"),
                note: "\u8FD9\u4E2A\u6570\u7EC4\u8981\u4E24\u4E2A\u4E0B\u6807\u3002\u5C11\u7ED9\u4E00\u4E2A\uFF0C\u7F16\u8F91\u5668\u5728\u8FD0\u884C\u524D\u5C31\u80FD\u770B\u51FA\u6765\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "ARRAY-004", line: 2, text: "\u8FD9\u662F\u4E00\u5F20\u8868\uFF0C\u6307\u4E00\u4E2A\u683C\u5B50\u8981\u540C\u65F6\u7ED9\u51FA\u884C\u548C\u5217\u3002" }
                ]
              },
              {
                title: "\u884C\u5217\u53CD\u4E86\uFF0C\u4F46\u4E24\u8FB9\u4E00\u6837\u5927\uFF0C\u6240\u4EE5\u6CA1\u4EBA\u62E6\u5F97\u4F4F",
                code: [
                  "DECLARE Grid : ARRAY[1:3, 1:3] OF INTEGER",
                  "DECLARE Row : INTEGER",
                  "DECLARE Col : INTEGER",
                  "Row \u2190 1",
                  "Col \u2190 3",
                  "Grid[Row, Col] \u2190 7",
                  "OUTPUT Grid[Col, Row]"
                ].join("\n"),
                note: "\u5B58\u8FDB\u7B2C 1 \u884C\u7B2C 3 \u5217\uFF0C\u53D6\u7684\u5374\u662F\u7B2C 3 \u884C\u7B2C 1 \u5217\u2014\u2014\u4E24\u4E2A\u90FD\u5728\u8303\u56F4\u91CC\uFF0C\u6240\u4EE5**\u8FD9\u6BB5\u4EE3\u7801\u96F6\u63D0\u793A\u3001\u8DD1\u5F97\u5B8C**\uFF0C\u53EA\u662F\u53D6\u5230\u7684\u662F\u53E6\u4E00\u4E2A\u683C\u5B50\u3002\u884C\u5217\u8303\u56F4\u4E00\u6837\u5927\u7684\u8868\u683C\uFF0C\u987A\u5E8F\u5199\u53CD\u4E0D\u4F1A\u6709\u4EFB\u4F55\u8B66\u544A\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`DECLARE T : ARRAY[1:5, 1:5] OF INTEGER` \u91CC\uFF0C\u628A `T[2, 4]` \u5199\u6210\u4E86 `T[4, 2]` \u4F1A\u600E\u6837\uFF1F",
            options: [
              {
                key: "A",
                label: "\u7A0B\u5E8F\u7167\u5E38\u8DD1\u5B8C\uFF0C\u4F46\u7528\u7684\u662F\u53E6\u4E00\u4E2A\u683C\u5B50",
                correct: true,
                explanation: "\u5BF9\u3002\u884C\u548C\u5217\u7684\u8303\u56F4\u4E00\u6837\u5927\uFF0C\u6240\u4EE5\u4E24\u4E2A\u5199\u6CD5\u90FD\u843D\u5728\u8868\u683C\u91CC\uFF0C\u8C01\u4E5F\u62E6\u4E0D\u4F4F\u3002\u8FD9\u79CD\u9519\u53EA\u80FD\u9760\u81EA\u5DF1\u628A\u884C\u5217\u7684\u542B\u4E49\u5199\u6E05\u695A\u6765\u9632\u3002"
              },
              {
                key: "B",
                label: "\u7F16\u8F91\u5668\u4F1A\u62E6\u4E0B\u6765",
                correct: false,
                explanation: "\u4E24\u4E2A\u4E0B\u6807\u90FD\u5728 1 \u5230 5 \u4E4B\u95F4\uFF0C\u5B8C\u5168\u5408\u6CD5\u3002\u7F16\u8F91\u5668\u4E0D\u77E5\u9053\u4F60\u5FC3\u91CC\u60F3\u7684\u662F\u54EA\u4E2A\u683C\u5B50\u3002"
              },
              {
                key: "C",
                label: "\u8FD0\u884C\u65F6\u8D8A\u754C\uFF0C\u7A0B\u5E8F\u505C\u4E0B\u6765",
                correct: false,
                explanation: "\u8D8A\u754C\u662F\u6307\u4E86\u4E0D\u5B58\u5728\u7684\u683C\u5B50\u3002\u8FD9\u91CC\u6307\u7684\u683C\u5B50\u5B58\u5728\uFF0C\u53EA\u662F\u4E0D\u662F\u4F60\u8981\u7684\u90A3\u4E2A\u3002"
              },
              {
                key: "D",
                label: "\u4E24\u4E2A\u5199\u6CD5\u672C\u6765\u5C31\u662F\u540C\u4E00\u4E2A\u683C\u5B50",
                correct: false,
                explanation: "\u9664\u975E\u884C\u53F7\u548C\u5217\u53F7\u6B63\u597D\u76F8\u7B49\uFF0C\u5426\u5219\u5B83\u4EEC\u662F\u4E0D\u540C\u7684\u4E24\u4E2A\u683C\u5B50\u3002\u8868\u683C\u4E0D\u662F\u5BF9\u79F0\u7684\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "9.3",
        title: "\u7528\u5D4C\u5957\u5FAA\u73AF\u904D\u5386\u4E00\u5F20\u8868",
        syllabus: ["\xA710.2"],
        estimatedMinutes: 10,
        taughtFeatures: AFTER_9_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E00\u7EF4\u6570\u7EC4\u914D\u4E00\u5C42 `FOR`\uFF0C\u4E8C\u7EF4\u6570\u7EC4\u914D\u4E24\u5C42\u2014\u2014\u8FD9\u6B63\u662F\u7B2C 6 \u7AE0\u90A3\u4E24\u79CD\u5D4C\u5957\u5F62\u72B6\u91CC\u7684\u7B2C\u4E00\u79CD\uFF1A\u5916\u5C42\u7BA1\u884C\uFF0C\u5185\u5C42\u7BA1\u5217\u3002\u5916\u5C42\u8DD1\u4E00\u904D\uFF0C\u5185\u5C42\u628A\u90A3\u4E00\u884C\u7684\u6BCF\u4E00\u5217\u8D70\u5B8C\u3002",
              "\u5916\u5C42\u7BA1\u884C\u3001\u5185\u5C42\u7BA1\u5217\uFF0C\u53EB**\u884C\u4F18\u5148**\uFF1A\u8D70\u7684\u987A\u5E8F\u662F\u7B2C 1 \u884C\u7684\u6BCF\u4E00\u5217\u3001\u7B2C 2 \u884C\u7684\u6BCF\u4E00\u5217\u2026\u2026\u9002\u5408\u300C\u6BCF\u4E00\u884C\u7B97\u4E00\u4E2A\u7ED3\u679C\u300D\uFF0C\u6BD4\u5982\u6BCF\u4E2A\u5B66\u751F\u7684\u603B\u5206\u3002",
              "\u628A\u4E24\u5C42\u6362\u4E2A\u4F4D\u7F6E\uFF0C\u5916\u5C42\u7BA1\u5217\u3001\u5185\u5C42\u7BA1\u884C\uFF0C\u5C31\u662F**\u5217\u4F18\u5148**\uFF1A\u9002\u5408\u300C\u6BCF\u4E00\u5217\u7B97\u4E00\u4E2A\u7ED3\u679C\u300D\uFF0C\u6BD4\u5982\u6BCF\u4E00\u79D1\u7684\u5E73\u5747\u5206\u3002**\u540C\u4E00\u5F20\u8868\uFF0C\u95EE\u7684\u95EE\u9898\u4E0D\u540C\uFF0C\u4E24\u5C42\u5FAA\u73AF\u7684\u91CC\u5916\u5C31\u4E0D\u540C\u3002**",
              "\u7B97\u6BCF\u884C\u4E00\u4E2A\u7ED3\u679C\u65F6\uFF0C\u90A3\u4E2A\u7D2F\u52A0\u53D8\u91CF\u8981\u5728**\u5916\u5C42\u5FAA\u73AF\u91CC\u9762\u3001\u5185\u5C42\u5FAA\u73AF\u5916\u9762**\u6E05\u96F6\u2014\u2014\u4F4D\u7F6E\u9519\u4E00\u5C42\uFF0C\u4E0A\u4E00\u884C\u7684\u7ED3\u679C\u5C31\u4F1A\u88AB\u5E26\u5230\u4E0B\u4E00\u884C\uFF08\u7B2C 6 \u7AE0\u7684\u7AE0\u672B\u5927\u9898\u6B63\u662F\u8FD9\u4EF6\u4E8B\uFF09\u3002"
            ]
          },
          {
            kind: "example",
            title: "\u540C\u4E00\u5F20\u8868\uFF0C\u4E24\u79CD\u8D70\u6CD5",
            fileName: "Example_9_3_a.pseudocode",
            code: [
              "DECLARE Marks : ARRAY[1:2, 1:3] OF INTEGER",
              "DECLARE Row : INTEGER",
              "DECLARE Col : INTEGER",
              "DECLARE Sum : INTEGER",
              "FOR Row \u2190 1 TO 2",
              "   FOR Col \u2190 1 TO 3",
              "      Marks[Row, Col] \u2190 Row * Col",
              "   NEXT Col",
              "NEXT Row",
              "FOR Row \u2190 1 TO 2",
              "   Sum \u2190 0",
              "   FOR Col \u2190 1 TO 3",
              "      Sum \u2190 Sum + Marks[Row, Col]",
              "   NEXT Col",
              '   OUTPUT "Row ", Row, " total: ", Sum',
              "NEXT Row",
              "FOR Col \u2190 1 TO 3",
              "   Sum \u2190 0",
              "   FOR Row \u2190 1 TO 2",
              "      Sum \u2190 Sum + Marks[Row, Col]",
              "   NEXT Row",
              '   OUTPUT "Col ", Col, " total: ", Sum',
              "NEXT Col"
            ].join("\n"),
            annotations: [
              { fromLine: 5, toLine: 9, text: "\u5148\u628A\u8868\u683C\u586B\u6EE1\uFF1A\u4E24\u5C42\u5FAA\u73AF\uFF0C\u884C\u5728\u5916\u3001\u5217\u5728\u5185\u3002" },
              { fromLine: 10, toLine: 16, text: "\u884C\u4F18\u5148\uFF1A\u6BCF\u8D70\u5B8C\u4E00\u884C\u5C31\u62A5\u4E00\u4E2A\u7ED3\u679C\u3002`Sum \u2190 0` \u5728\u5916\u5C42\u91CC\u9762\uFF0C\u6240\u4EE5\u6BCF\u884C\u91CD\u65B0\u5F00\u59CB\u3002" },
              { fromLine: 17, toLine: 23, text: "\u5217\u4F18\u5148\uFF1A\u53EA\u662F\u628A\u4E24\u5C42\u5BF9\u8C03\uFF0C\u540C\u4E00\u5F20\u8868\u5C31\u6309\u5217\u7B97\u4E86\u3002\u683C\u5B50\u4E00\u4E2A\u6CA1\u52A8\uFF0C\u95EE\u9898\u53D8\u4E86\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: [
                "Row 1 total: 6",
                "Row 2 total: 12",
                "Col 1 total: 3",
                "Col 2 total: 6",
                "Col 3 total: 9"
              ]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u628A\u4E0A\u9762\u90A3\u6BB5\u91CC\u7684 `Sum \u2190 0` \u4ECE\u5916\u5C42\u5FAA\u73AF\u91CC\u9762\u632A\u5230\u4E24\u5C42\u5FAA\u73AF\u4E4B\u524D\uFF0C\u6BCF\u884C\u7684\u7ED3\u679C\u4F1A\u53D8\u6210\u4EC0\u4E48\uFF1F",
            options: [
              {
                key: "A",
                label: "\u7F16\u8F91\u5668\u4F1A\u62E6\u4E0B\u6765",
                correct: false,
                explanation: "\u4E24\u4E2A\u4F4D\u7F6E\u90FD\u5408\u6CD5\u3002\u653E\u9519\u4E00\u5C42\u4E0D\u4F1A\u62A5\u9519\uFF0C\u53EA\u4F1A\u7B97\u9519\u2014\u2014\u8FD9\u6B63\u662F\u9EBB\u70E6\u7684\u5730\u65B9\u3002"
              },
              {
                key: "B",
                label: "\u6CA1\u6709\u533A\u522B",
                correct: false,
                explanation: "\u6709\u533A\u522B\uFF0C\u800C\u4E14\u53EA\u5728\u7B2C\u4E8C\u884C\u5F80\u540E\u624D\u770B\u5F97\u51FA\u6765\u3002\u7B2C\u4E00\u884C\u7684\u7ED3\u679C\u4E24\u79CD\u5199\u6CD5\u662F\u4E00\u6837\u7684\u3002"
              },
              {
                key: "C",
                label: "\u7B2C\u4E8C\u884C\u7684\u7ED3\u679C\u91CC\u6DF7\u8FDB\u4E86\u7B2C\u4E00\u884C\u7684\u6570",
                correct: true,
                explanation: "\u5BF9\u3002\u53EA\u6E05\u96F6\u4E00\u6B21\uFF0C\u7B2C\u4E00\u884C\u52A0\u5B8C\u7684\u6570\u8FD8\u7559\u5728 `Sum` \u91CC\uFF0C\u7B2C\u4E8C\u884C\u63A5\u7740\u5F80\u4E0A\u52A0\u3002\u7ED3\u679C\u53D8\u6210\u4E86\u300C\u5230\u8FD9\u4E00\u884C\u4E3A\u6B62\u7684\u7D2F\u8BA1\u300D\u3002"
              },
              {
                key: "D",
                label: "\u6BCF\u884C\u90FD\u663E\u793A 0",
                correct: false,
                explanation: "\u6E05\u96F6\u53EA\u53D1\u751F\u5728\u5F00\u5934\uFF0C\u4E4B\u540E\u5FAA\u73AF\u7167\u6837\u5F80\u91CC\u52A0\uFF0C\u4E0D\u4F1A\u4E00\u76F4\u662F 0\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "9.3.1",
            title: "\u6BCF\u884C\u7684\u548C",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165\u4E00\u5F20 2 \u884C 3 \u5217\u7684\u6574\u6570\u8868\u683C\uFF08\u6309\u884C\u8BFB\uFF0C\u5148\u8BFB\u6EE1\u7B2C\u4E00\u884C\u518D\u8BFB\u7B2C\u4E8C\u884C\uFF09\uFF0C\u7136\u540E\u663E\u793A\u6BCF\u4E00\u884C\u7684\u548C\u3002",
            ioSpec: {
              input: [
                "\u516D\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\uFF0C\u6309\u5148\u884C\u540E\u5217\u7684\u987A\u5E8F\u8BFB\u5165\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
                "`Enter a number`"
              ].join("\n"),
              output: ["\u4E24\u884C\uFF0C\u5199\u6210\uFF1A", "`Row <\u884C\u53F7>: <\u8FD9\u4E00\u884C\u7684\u548C>`", "\u5192\u53F7\u540E\u9762\u662F\u4E00\u4E2A\u7A7A\u683C\u3002"].join("\n")
            },
            constraints: {
              require: [
                {
                  feature: "decl.array-2d",
                  reason: "\u6570\u636E\u672C\u6765\u5C31\u662F\u4E00\u5F20\u8868\uFF0C\u7528\u4E8C\u7EF4\u6570\u7EC4\u5B58\u4E0B\u6765\u6700\u76F4\u63A5\u3002"
                },
                {
                  feature: "array.index-2d",
                  reason: "\u6307\u4E00\u4E2A\u683C\u5B50\u8981\u540C\u65F6\u7ED9\u51FA\u884C\u548C\u5217\u3002"
                },
                {
                  feature: "loop.nested",
                  reason: "\u4E00\u5F20\u8868\u8981\u4E24\u5C42\u5FAA\u73AF\u624D\u8D70\u5F97\u5B8C\uFF1A\u5916\u5C42\u7BA1\u884C\uFF0C\u5185\u5C42\u7BA1\u5217\u3002"
                }
              ]
            },
            hints: [
              "\u8BFB\u5165\u548C\u6C42\u548C\u53EF\u4EE5\u5206\u6210\u4E24\u6BB5\uFF0C\u4E5F\u53EF\u4EE5\u5728\u8BFB\u7684\u540C\u65F6\u5C31\u628A\u8FD9\u4E00\u884C\u52A0\u8D77\u6765\u3002",
              "\u6BCF\u4E00\u884C\u90FD\u8981\u91CD\u65B0\u4ECE 0 \u5F00\u59CB\u52A0\u2014\u2014\u6E05\u96F6\u90A3\u4E00\u53E5\u653E\u5728\u5916\u5C42\u5FAA\u73AF\u91CC\u9762\u3001\u5185\u5C42\u5FAA\u73AF\u5916\u9762\u3002",
              "\u663E\u793A\u90A3\u4E00\u884C\u653E\u5728\u5185\u5C42\u5FAA\u73AF\u7684\u540E\u9762\u3001\u5916\u5C42\u5FAA\u73AF\u7684\u91CC\u9762\uFF0C\u624D\u80FD\u505A\u5230\u6BCF\u884C\u4E00\u6761\u3002"
            ],
            examples: [
              {
                inputs: ["1", "2", "3", "10", "20", "30"],
                outputs: [
                  "Enter a number",
                  "Enter a number",
                  "Enter a number",
                  "Enter a number",
                  "Enter a number",
                  "Enter a number",
                  "Row 1: 6",
                  "Row 2: 60"
                ]
              }
            ],
            referenceSolution: [
              "DECLARE Grid : ARRAY[1:2, 1:3] OF INTEGER",
              "DECLARE Row : INTEGER",
              "DECLARE Col : INTEGER",
              "DECLARE Sum : INTEGER",
              "FOR Row \u2190 1 TO 2",
              "   FOR Col \u2190 1 TO 3",
              '      OUTPUT "Enter a number"',
              "      INPUT Grid[Row, Col]",
              "   NEXT Col",
              "NEXT Row",
              "FOR Row \u2190 1 TO 2",
              "   Sum \u2190 0",
              "   FOR Col \u2190 1 TO 3",
              "      Sum \u2190 Sum + Grid[Row, Col]",
              "   NEXT Col",
              '   OUTPUT "Row ", Row, ": ", Sum',
              "NEXT Row"
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["4", "5", "6", "7", "8", "9"], caseHint: "\u4E24\u884C\u7684\u548C\u4E0D\u4E00\u6837\u3002" },
              { id: "t2", kind: "normal", inputs: ["1", "1", "1", "2", "2", "2"], caseHint: "\u6BCF\u4E00\u884C\u91CC\u7684\u6570\u90FD\u76F8\u540C\u3002" },
              { id: "t3", kind: "boundary", inputs: ["0", "0", "0", "0", "0", "0"], caseHint: "\u6574\u5F20\u8868\u90FD\u662F\u96F6\u3002" },
              { id: "t4", kind: "boundary", inputs: ["-1", "-2", "-3", "1", "2", "3"], caseHint: "\u4E00\u884C\u5168\u662F\u8D1F\u6570\uFF0C\u53E6\u4E00\u884C\u5168\u662F\u6B63\u6570\uFF0C\u4E24\u884C\u7684\u548C\u6B63\u597D\u76F8\u53CD\u3002" },
              { id: "t5", kind: "extreme", inputs: ["99999", "1", "1", "1", "1", "99999"], caseHint: "\u4E24\u4E2A\u5F88\u5927\u7684\u6570\u5206\u522B\u843D\u5728\u4E24\u884C\u3002" }
            ]
          }
        ]
      },
      {
        id: "9.4",
        title: "\u4E00\u7EF4\u8FD8\u662F\u4E8C\u7EF4",
        syllabus: ["\xA710.2"],
        estimatedMinutes: 7,
        taughtFeatures: AFTER_9_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u5224\u636E\u548C\u7B2C 6 \u7AE0\u6311\u5FAA\u73AF\u4E00\u6837\u7B80\u5355\uFF1A**\u8FD9\u6279\u6570\u636E\u8981\u7528\u51E0\u4E2A\u7F16\u53F7\u624D\u6307\u5F97\u51C6\uFF1F**\u4E00\u4E2A\u7F16\u53F7\u5C31\u591F\u2014\u2014\u7B2C\u51E0\u4E2A\u5B66\u751F\u3001\u7B2C\u51E0\u5929\u2014\u2014\u7528\u4E00\u7EF4\uFF1B\u8981\u4E24\u4E2A\u2014\u2014\u7B2C\u51E0\u4E2A\u5B66\u751F\u7684\u7B2C\u51E0\u79D1\u3001\u7B2C\u51E0\u884C\u7684\u7B2C\u51E0\u5217\u2014\u2014\u7528\u4E8C\u7EF4\u3002",
              "\u53CD\u8FC7\u6765\u95EE\u4E5F\u4E00\u6837\uFF1A**\u628A\u6570\u636E\u6446\u5728\u7EB8\u4E0A\uFF0C\u662F\u4E00\u5217\u8FD8\u662F\u4E00\u5F20\u8868\uFF1F**\u8003\u8BD5\u6210\u7EE9\u5355\u662F\u4E00\u5F20\u8868\uFF08\u4EBA \xD7 \u79D1\u76EE\uFF09\uFF0C\u4E00\u5468\u7684\u6C14\u6E29\u662F\u4E00\u5217\uFF08\u53EA\u6709\u5929\uFF09\u3002\u6446\u5F97\u51FA\u6765\u662F\u4EC0\u4E48\u5F62\u72B6\uFF0C\u5C31\u7528\u4EC0\u4E48\u5F62\u72B6\u7684\u6570\u7EC4\u3002",
              "\u4E8C\u7EF4\u80FD\u505A\u7684\u4E8B\u4E00\u7EF4\u786C\u51D1\u4E5F\u80FD\u505A\u2014\u2014`ARRAY[1:6]` \u88C5 3 \u4E2A\u5B66\u751F 2 \u79D1\uFF0C\u81EA\u5DF1\u7B97\u300C\u7B2C `S` \u4E2A\u5B66\u751F\u7684\u7B2C `M` \u79D1\u662F\u7B2C `(S - 1) * 2 + M` \u683C\u300D\u3002\u80FD\u8DD1\uFF0C\u4F46\u6BCF\u6B21\u8BBF\u95EE\u90FD\u8981\u7B97\u4E00\u904D\uFF0C\u7B97\u9519\u4E00\u6B21\u5C31\u5168\u4E71\uFF0C\u800C\u4E14\u522B\u4EBA\u8BFB\u4F60\u7684\u4EE3\u7801\u8981\u5148\u89E3\u5F00\u8FD9\u4E2A\u516C\u5F0F\u3002**\u5F62\u72B6\u5BF9\u4E0A\u4E86\uFF0C\u4EE3\u7801\u5C31\u4E0D\u7528\u505A\u6362\u7B97\u3002**"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u80FD\u4E3A\u7ED9\u5B9A\u95EE\u9898**\u9009\u62E9**\u5408\u9002\u7684\u6570\u636E\u7ED3\u6784\uFF0C\u5E76\u8BF4\u660E\u7406\u7531\uFF08\xA710.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0B\u9762\u54EA\u79CD\u6570\u636E**\u5E94\u8BE5**\u7528\u4E8C\u7EF4\u6570\u7EC4\uFF1F",
            options: [
              {
                key: "A",
                label: "\u4E00\u5468\u4E03\u5929\u7684\u6700\u9AD8\u6C14\u6E29",
                correct: false,
                explanation: "\u53EA\u6709\u300C\u7B2C\u51E0\u5929\u300D\u4E00\u4E2A\u7F16\u53F7\u3002\u6446\u5728\u7EB8\u4E0A\u662F\u4E00\u5217\uFF0C\u4E0D\u662F\u4E00\u5F20\u8868\u3002"
              },
              {
                key: "B",
                label: "\u4E00\u4E2A\u5B66\u751F\u7684\u59D3\u540D",
                correct: false,
                explanation: "\u8FD9\u53EA\u662F\u4E00\u4E2A\u503C\uFF0C\u8FDE\u6570\u7EC4\u90FD\u4E0D\u9700\u8981\uFF0C\u4E00\u4E2A `STRING` \u53D8\u91CF\u5C31\u591F\u4E86\u3002"
              },
              {
                key: "C",
                label: "5 \u4E2A\u73ED\u5404\u81EA 4 \u4E2A\u5C0F\u7EC4\u7684\u4EBA\u6570",
                correct: true,
                explanation: "\u5BF9\u3002\u8981\u6307\u51C6\u4E00\u4E2A\u6570\u5F97\u8BF4\u6E05\u300C\u7B2C\u51E0\u73ED\u7684\u7B2C\u51E0\u7EC4\u300D\uFF0C\u4E24\u4E2A\u7F16\u53F7\uFF0C\u6B63\u597D\u662F\u4E00\u5F20 5 \u884C 4 \u5217\u7684\u8868\u3002"
              },
              {
                key: "D",
                label: "\u4E00\u4E2A\u73ED 30 \u4E2A\u5B66\u751F\u7684\u603B\u5206",
                correct: false,
                explanation: "\u4E00\u4E2A\u7F16\u53F7\u5C31\u591F\u4E86\u2014\u2014\u7B2C\u51E0\u4E2A\u5B66\u751F\u3002\u8FD9\u662F\u4E00\u5217\uFF0C\u7528\u4E00\u7EF4\u6570\u7EC4\u3002"
              }
            ]
          }
        ]
      }
    ],
    chapterTasks: [
      {
        kind: "chapterTask",
        id: "9.T1",
        title: "\u6210\u7EE9\u8868",
        statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165 3 \u4E2A\u5B66\u751F\u5404 2 \u79D1\u7684\u6210\u7EE9\uFF08\u6309\u5B66\u751F\u9010\u4E2A\u8BFB\uFF0C\u6BCF\u4E2A\u5B66\u751F\u5148\u8BFB\u7B2C 1 \u79D1\u518D\u8BFB\u7B2C 2 \u79D1\uFF09\uFF0C\u7136\u540E\u663E\u793A\u6BCF\u4E2A\u5B66\u751F\u7684\u603B\u5206\u548C\u6BCF\u4E00\u79D1\u7684\u5E73\u5747\u5206\u3002",
        ioSpec: {
          input: [
            "\u516D\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\uFF0C\u6309\u5148\u5B66\u751F\u540E\u79D1\u76EE\u7684\u987A\u5E8F\u8BFB\u5165\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
            "`Enter a mark`"
          ].join("\n"),
          output: [
            "\u8BFB\u5B8C\u4E4B\u540E\u663E\u793A\u4E94\u884C\u2014\u2014\u5148\u4E09\u884C\u5B66\u751F\u603B\u5206\uFF0C\u518D\u4E24\u884C\u79D1\u76EE\u5E73\u5747\uFF1A",
            "`Student <\u7F16\u53F7> total: <\u603B\u5206>`",
            "`Subject <\u7F16\u53F7> average: <\u5E73\u5747\u5206>`\u3000\uFF08\u53D6\u6574\u6570\u5546\uFF09",
            "\u6BCF\u4E2A\u5192\u53F7\u540E\u9762\u90FD\u662F\u4E00\u4E2A\u7A7A\u683C\u3002"
          ].join("\n")
        },
        suggestedFeatures: [
          "decl.array-2d",
          "array.index-2d",
          "loop.for",
          "loop.nested",
          "op.arithmetic",
          "op.div",
          "io.input",
          "io.output"
        ],
        hints: [
          "\u300C\u6BCF\u4E2A\u5B66\u751F\u7684\u603B\u5206\u300D\u548C\u300C\u6BCF\u4E00\u79D1\u7684\u5E73\u5747\u5206\u300D\u8D70\u7684\u662F\u540C\u4E00\u5F20\u8868\uFF0C\u4F46\u4E24\u5C42\u5FAA\u73AF\u7684\u91CC\u5916\u6B63\u597D\u76F8\u53CD\u3002",
          "\u7D2F\u52A0\u53D8\u91CF\u8981\u5728\u5916\u5C42\u5FAA\u73AF\u91CC\u9762\u6E05\u96F6\u2014\u2014\u4E0D\u7136\u4E0A\u4E00\u8F6E\u7684\u7ED3\u679C\u4F1A\u88AB\u5E26\u5230\u4E0B\u4E00\u8F6E\u3002",
          "\u8BFB\u5165\u7684\u987A\u5E8F\u548C\u540E\u9762\u600E\u4E48\u7B97\u65E0\u5173\uFF1A\u5B58\u8FDB\u53BB\u7684\u65F6\u5019\u884C\u662F\u5B66\u751F\u3001\u5217\u662F\u79D1\u76EE\uFF0C\u53D6\u7684\u65F6\u5019\u6309\u9700\u8981\u6311\u5148\u8D70\u54EA\u4E00\u5C42\u3002"
        ],
        examples: [
          {
            inputs: ["80", "70", "55", "90", "100", "40"],
            outputs: [
              "Enter a mark",
              "Enter a mark",
              "Enter a mark",
              "Enter a mark",
              "Enter a mark",
              "Enter a mark",
              "Student 1 total: 150",
              "Student 2 total: 145",
              "Student 3 total: 140",
              "Subject 1 average: 78",
              "Subject 2 average: 66"
            ]
          }
        ],
        referenceSolution: [
          "DECLARE Marks : ARRAY[1:3, 1:2] OF INTEGER",
          "DECLARE Student : INTEGER",
          "DECLARE Subject : INTEGER",
          "DECLARE Total : INTEGER",
          "FOR Student \u2190 1 TO 3",
          "   FOR Subject \u2190 1 TO 2",
          '      OUTPUT "Enter a mark"',
          "      INPUT Marks[Student, Subject]",
          "   NEXT Subject",
          "NEXT Student",
          "FOR Student \u2190 1 TO 3",
          "   Total \u2190 0",
          "   FOR Subject \u2190 1 TO 2",
          "      Total \u2190 Total + Marks[Student, Subject]",
          "   NEXT Subject",
          '   OUTPUT "Student ", Student, " total: ", Total',
          "NEXT Student",
          "FOR Subject \u2190 1 TO 2",
          "   Total \u2190 0",
          "   FOR Student \u2190 1 TO 3",
          "      Total \u2190 Total + Marks[Student, Subject]",
          "   NEXT Student",
          '   OUTPUT "Subject ", Subject, " average: ", Total DIV 3',
          "NEXT Subject"
        ].join("\n"),
        tests: [
          { id: "t1", kind: "normal", inputs: ["90", "60", "70", "80", "50", "100"], caseHint: "\u4E09\u4E2A\u5B66\u751F\u4E24\u79D1\u6210\u7EE9\u5404\u4E0D\u76F8\u540C\u3002" },
          { id: "t2", kind: "boundary", inputs: ["50", "50", "50", "50", "50", "50"], caseHint: "\u6240\u6709\u6210\u7EE9\u4E00\u6A21\u4E00\u6837\u3002" },
          { id: "t3", kind: "boundary", inputs: ["0", "0", "0", "0", "0", "1"], caseHint: "\u51E0\u4E4E\u5168\u662F\u96F6\uFF0C\u53EA\u6709\u6700\u540E\u4E00\u683C\u4E0D\u662F\u2014\u2014\u5E73\u5747\u5206\u4F1A\u88AB\u6574\u9664\u622A\u6389\u3002" },
          { id: "t4", kind: "normal", inputs: ["100", "0", "0", "100", "100", "0"], caseHint: "\u6BCF\u4E2A\u5B66\u751F\u90FD\u662F\u4E00\u79D1\u6EE1\u5206\u4E00\u79D1\u96F6\u5206\u3002" },
          { id: "t5", kind: "extreme", inputs: ["99999", "1", "1", "1", "1", "99999"], caseHint: "\u4E24\u4E2A\u5F88\u5927\u7684\u5206\u6570\u843D\u5728\u4E0D\u540C\u7684\u5B66\u751F\u548C\u79D1\u76EE\u4E0A\u3002" }
        ]
      }
    ]
  };

  // packages/teaching-content/src/chapter-10.ts
  var AFTER_CHAPTER_9 = [
    "io.output",
    "io.input",
    "decl.variable",
    "misc.comment",
    "type.string",
    "literal.string",
    "type.integer",
    "type.real",
    "type.char",
    "type.boolean",
    "type.date",
    "literal.integer",
    "literal.real",
    "literal.char",
    "literal.boolean",
    "literal.date",
    "assign.simple",
    "decl.constant",
    "op.arithmetic",
    "op.div",
    "op.mod",
    "op.relational",
    "op.and",
    "op.or",
    "op.not",
    "select.if",
    "select.if-else",
    "select.nested-if",
    "select.case",
    "select.case-range",
    "select.case-otherwise",
    "loop.for",
    "loop.for-step",
    "loop.while",
    "loop.repeat",
    "loop.nested",
    "builtin.length",
    "builtin.mid",
    "builtin.right",
    "builtin.ucase",
    "builtin.lcase",
    "op.concat",
    "builtin.int",
    "builtin.rand",
    "decl.array-1d",
    "array.index",
    "decl.array-2d",
    "array.index-2d"
  ];
  var chapter10 = {
    id: 10,
    title: "\u7EBF\u6027\u67E5\u627E\u4E0E\u5192\u6CE1\u6392\u5E8F",
    level: "AS",
    syllabus: ["\xA710.2"],
    prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    sections: [
      {
        id: "10.1",
        title: "\u7EBF\u6027\u67E5\u627E",
        syllabus: ["\xA710.2"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_CHAPTER_9,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u5230\u76EE\u524D\u4E3A\u6B62\u5BF9\u6570\u7EC4\u505A\u7684\u4E8B\u90FD\u8981\u628A\u6BCF\u4E00\u683C\u8D70\u5230\uFF1A\u6C42\u548C\u3001\u6C42\u6700\u5927\u3001\u627E\u51FA\u9AD8\u4E8E\u5E73\u5747\u7684\u3002\u67E5\u627E\u4E0D\u4E00\u6837\u2014\u2014**\u8981\u627E\u7684\u4E1C\u897F\u53EF\u80FD\u5728\u7B2C 1 \u683C\uFF0C\u53EF\u80FD\u5728\u6700\u540E\u4E00\u683C\uFF0C\u4E5F\u53EF\u80FD\u6839\u672C\u4E0D\u5728\u91CC\u9762**\u3002",
              "\u6700\u76F4\u63A5\u7684\u505A\u6CD5\u5C31\u53EB**\u7EBF\u6027\u67E5\u627E\uFF08linear search\uFF09**\uFF1A\u4ECE\u7B2C\u4E00\u683C\u5F00\u59CB\uFF0C\u62FF\u5B83\u8DDF\u8981\u627E\u7684\u503C\u6BD4\u4E00\u6BD4\uFF0C\u4E0D\u662F\u5C31\u770B\u4E0B\u4E00\u683C\uFF0C\u4E00\u683C\u4E00\u683C\u5F80\u4E0B\u8D70\u3002\u300C\u7EBF\u6027\u300D\u8BF4\u7684\u5C31\u662F\u8FD9\u6761\u8DEF\u7EBF\u2014\u2014\u6392\u7740\u961F\u8D70\u8FC7\u53BB\uFF0C\u4E0D\u8DF3\u3002",
              "\u7528 `FOR` \u5C31\u80FD\u628A\u8FD9\u6761\u8DEF\u7EBF\u5199\u51FA\u6765\uFF1A\u8D70\u904D\u6BCF\u4E00\u683C\uFF0C\u76F8\u7B49\u5C31\u62A5\u51FA\u6765\u3002\u4F46\u8FD9\u6837\u5199\u6709\u4E2A\u4EE3\u4EF7\u2014\u2014**\u5B83\u975E\u628A\u6BCF\u4E00\u683C\u90FD\u8D70\u5B8C\u4E0D\u53EF**\u3002\u8981\u627E\u7684\u4E1C\u897F\u5728\u7B2C 1 \u683C\uFF0C\u540E\u9762 99 \u683C\u7167\u6837\u767D\u6BD4\u4E00\u904D\u3002",
              "\u800C\u4E14\u62A5\u51FA\u6765\u7684\u4E0D\u53EA\u662F\u300C\u6709\u300D\u3002\u505C\u5728\u54EA\u4E00\u683C\uFF0C\u90A3\u4E2A\u4E0B\u6807\u672C\u8EAB\u5C31\u662F\u7B54\u6848\u7684\u4E00\u90E8\u5206\uFF1A\u4F60\u591A\u534A\u4E0D\u53EA\u60F3\u77E5\u9053\u5728\u4E0D\u5728\uFF0C\u8FD8\u60F3\u77E5\u9053\u5728\u7B2C\u51E0\u683C\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u5728 AS \u9636\u6BB5\u5C31\u80FD\u5199\u51FA\u5E76\u4F7F\u7528\u7EBF\u6027\u67E5\u627E\uFF08\xA710.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u8D70\u904D\u6BCF\u4E00\u683C\uFF0C\u6BD4\u4E2D\u5C31\u62A5",
            fileName: "Example_10_1_a.pseudocode",
            code: [
              "DECLARE Scores : ARRAY[1:5] OF INTEGER",
              "DECLARE I : INTEGER",
              "DECLARE Target : INTEGER",
              "Scores[1] \u2190 30",
              "Scores[2] \u2190 80",
              "Scores[3] \u2190 45",
              "Scores[4] \u2190 80",
              "Scores[5] \u2190 12",
              "Target \u2190 80",
              "FOR I \u2190 1 TO 5",
              "   IF Scores[I] = Target THEN",
              '      OUTPUT "Found at ", I',
              "   ENDIF",
              "NEXT I"
            ].join("\n"),
            annotations: [
              { fromLine: 9, toLine: 9, text: "\u8981\u627E\u7684\u503C\u3002\u628A\u5B83\u5355\u72EC\u653E\u8FDB\u4E00\u4E2A\u53D8\u91CF\uFF0C\u6362\u4E2A\u76EE\u6807\u53EA\u8981\u6539\u8FD9\u4E00\u884C\u3002" },
              { fromLine: 10, toLine: 14, text: "\u4ECE\u7B2C 1 \u683C\u8D70\u5230\u7B2C 5 \u683C\uFF0C\u6BCF\u4E00\u683C\u90FD\u8DDF `Target` \u6BD4\u4E00\u6B21\u3002" },
              { fromLine: 11, toLine: 13, text: "\u76F8\u7B49\u5C31\u62A5\u51FA\u4E0B\u6807\u3002\u6CE8\u610F\u8FD9\u91CC\u62A5\u5B8C\u8FD8\u63A5\u7740\u8D70\u2014\u2014`FOR` \u4E0D\u4F1A\u56E0\u4E3A\u627E\u5230\u4E86\u5C31\u505C\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["Found at 2", "Found at 4"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u628A\u4E0A\u9762\u90A3\u6BB5\u91CC\u7684 `Target` \u6539\u6210 `99`\uFF08\u6570\u7EC4\u91CC\u6CA1\u6709\u8FD9\u4E2A\u6570\uFF09\uFF0C\u8FD0\u884C\u4E4B\u540E\u5C4F\u5E55\u4E0A\u4F1A\u770B\u5230\u4EC0\u4E48\uFF1F",
            options: [
              {
                key: "A",
                label: "\u4EC0\u4E48\u90FD\u6CA1\u6709\uFF0C\u7A0B\u5E8F\u6B63\u5E38\u7ED3\u675F",
                correct: true,
                explanation: "\u5BF9\u3002`IF` \u4E00\u6B21\u90FD\u6CA1\u6210\u7ACB\uFF0C`OUTPUT` \u5C31\u4E00\u6B21\u90FD\u6CA1\u6267\u884C\u3002\u7A0B\u5E8F\u8DD1\u5B8C\u4E86\uFF0C\u53EA\u662F\u4EC0\u4E48\u4E5F\u6CA1\u8BF4\u2014\u2014\u300C\u6CA1\u627E\u5230\u300D\u548C\u300C\u7A0B\u5E8F\u6CA1\u8DD1\u300D\u5728\u5C4F\u5E55\u4E0A\u957F\u5F97\u4E00\u6A21\u4E00\u6837\u3002"
              },
              {
                key: "B",
                label: "\u663E\u793A `Found at 0`",
                correct: false,
                explanation: "\u4E0D\u4F1A\u3002`OUTPUT` \u53EA\u5199\u5728 `IF` \u91CC\u9762\uFF0C\u6761\u4EF6\u6CA1\u6210\u7ACB\u5B83\u5C31\u4E0D\u6267\u884C\uFF0C\u4E0D\u5B58\u5728\u4E00\u4E2A\u300C\u8868\u793A\u6CA1\u627E\u5230\u300D\u7684\u9ED8\u8BA4\u8F93\u51FA\u3002"
              },
              {
                key: "C",
                label: "\u7A0B\u5E8F\u5728\u8FD0\u884C\u65F6\u505C\u4E0B\u6765\u62A5\u9519",
                correct: false,
                explanation: "\u6CA1\u6709\u4EFB\u4F55\u4E00\u6B65\u51FA\u9519\uFF1A\u4E0B\u6807\u59CB\u7EC8\u5728 1 \u5230 5 \u4E4B\u95F4\uFF0C\u6BD4\u8F83\u4E5F\u5408\u6CD5\u3002\u627E\u4E0D\u5230\u4E0D\u662F\u9519\u8BEF\uFF0C\u53EA\u662F\u7ED3\u679C\u3002"
              },
              {
                key: "D",
                label: "\u7F16\u8F91\u5668\u5728\u8FD0\u884C\u524D\u5C31\u62E6\u4E0B\u6765",
                correct: false,
                explanation: "\u8FD9\u6BB5\u4EE3\u7801\u7684\u5199\u6CD5\u5B8C\u5168\u6B63\u786E\u3002\u7F16\u8F91\u5668\u4E0D\u77E5\u9053\u6570\u7EC4\u91CC\u5C06\u6765\u4F1A\u653E\u4EC0\u4E48\u503C\uFF0C\u4E5F\u5C31\u65E0\u4ECE\u5224\u65AD\u627E\u4E0D\u627E\u5F97\u5230\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "10.2",
        title: "\u627E\u4E0D\u5230\u7684\u60C5\u51B5\u600E\u4E48\u5199",
        syllabus: ["\xA710.2"],
        estimatedMinutes: 11,
        taughtFeatures: AFTER_CHAPTER_9,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E0A\u4E00\u8282\u90A3\u6BB5\u6709\u4E24\u5904\u8981\u8865\uFF1A\u627E\u5230\u4E86\u8FD8\u63A5\u7740\u628A\u5269\u4E0B\u7684\u683C\u5B50\u8D70\u5B8C\uFF0C\u800C\u627E\u4E0D\u5230\u7684\u65F6\u5019\u5C4F\u5E55\u4E0A\u4E00\u4E2A\u5B57\u90FD\u6CA1\u6709\u3002\u8981\u8865\u8FD9\u4E24\u5904\uFF0C\u53EA\u9700\u8981\u4E00\u4E2A `BOOLEAN` \u53D8\u91CF\u3002",
              "\u8FD9\u79CD\u300C\u8BB0\u5F55\u67D0\u4EF6\u4E8B\u6709\u6CA1\u6709\u53D1\u751F\u8FC7\u300D\u7684\u53D8\u91CF\u53EB**\u6807\u5FD7\uFF08flag\uFF09**\u3002\u5F00\u59CB\u65F6\u8BBE\u6210 `FALSE`\uFF0C\u4E00\u65E6\u6BD4\u4E2D\u5C31\u6539\u6210 `TRUE`\u3002\u5FAA\u73AF\u7ED3\u675F\u4E4B\u540E\u770B\u5B83\u4E00\u773C\uFF0C\u5C31\u77E5\u9053\u5230\u5E95\u627E\u6CA1\u627E\u5230\u2014\u2014\u8FD9\u53E5\u8BDD\uFF0C\u5C4F\u5E55\u4E0A\u5FC5\u987B\u6709\u3002",
              "\u6709\u4E86\u6807\u5FD7\uFF0C\u5FAA\u73AF\u7684\u6761\u4EF6\u5C31\u5199\u5F97\u51FA\u6765\u4E86\uFF1A`WHILE Found = FALSE AND Position <= 5`\u2014\u2014**\u8FD8\u6CA1\u627E\u5230\u3001\u800C\u4E14\u8FD8\u6CA1\u8D70\u5B8C**\uFF0C\u624D\u7EE7\u7EED\u8D70\u3002\u4E24\u4E2A\u6761\u4EF6\u91CC\u4EFB\u4F55\u4E00\u4E2A\u4E0D\u6210\u7ACB\uFF0C\u5FAA\u73AF\u7ACB\u523B\u505C\u3002\u8FD9\u6B63\u662F\u7B2C 5 \u7AE0\u8BF4\u7684\u300C\u6B21\u6570\u4E8B\u5148\u4E0D\u77E5\u9053\u300D\uFF1A\u8D70\u51E0\u683C\u53D6\u51B3\u4E8E\u6570\u636E\u3002",
              "`Position` \u505C\u5728\u54EA\u91CC\u4E5F\u662F\u7ED3\u679C\u7684\u4E00\u90E8\u5206\uFF1A\u627E\u5230\u65F6\u5B83\u505C\u5728\u90A3\u4E00\u683C\u4E0A\uFF0C\u6CA1\u627E\u5230\u65F6\u5B83\u5DF2\u7ECF\u8D8A\u8FC7\u4E0A\u754C\u3002\u6240\u4EE5**\u5148\u770B\u6807\u5FD7\uFF0C\u518D\u51B3\u5B9A `Position` \u80FD\u4E0D\u80FD\u62FF\u6765\u7528**\u2014\u2014\u987A\u5E8F\u53CD\u4E86\u5C31\u4F1A\u62A5\u51FA\u4E00\u4E2A\u6839\u672C\u4E0D\u5B58\u5728\u7684\u4F4D\u7F6E\u3002"
            ]
          },
          {
            kind: "example",
            title: "\u5E26\u6807\u5FD7\u7684\u7EBF\u6027\u67E5\u627E",
            fileName: "Example_10_2_a.pseudocode",
            code: [
              "DECLARE Scores : ARRAY[1:5] OF INTEGER",
              "DECLARE Position : INTEGER",
              "DECLARE Target : INTEGER",
              "DECLARE Found : BOOLEAN",
              "Scores[1] \u2190 30",
              "Scores[2] \u2190 80",
              "Scores[3] \u2190 45",
              "Scores[4] \u2190 80",
              "Scores[5] \u2190 12",
              "Target \u2190 99",
              "Found \u2190 FALSE",
              "Position \u2190 1",
              "WHILE Found = FALSE AND Position <= 5",
              "   IF Scores[Position] = Target THEN",
              "      Found \u2190 TRUE",
              "   ELSE",
              "      Position \u2190 Position + 1",
              "   ENDIF",
              "ENDWHILE",
              "IF Found = TRUE THEN",
              '   OUTPUT "Found at ", Position',
              "ELSE",
              '   OUTPUT "Not in the list"',
              "ENDIF"
            ].join("\n"),
            annotations: [
              { fromLine: 11, toLine: 12, text: "\u4E24\u4E2A\u8D77\u70B9\uFF1A\u8FD8\u6CA1\u627E\u5230\uFF0C\u4ECE\u7B2C 1 \u683C\u5F00\u59CB\u3002\u8FD9\u4E24\u884C\u5C11\u4E00\u884C\uFF0C\u5FAA\u73AF\u7B2C\u4E00\u6B21\u5C31\u5224\u65AD\u4E0D\u4E86\u3002" },
              { fromLine: 13, toLine: 13, text: "\u4E24\u4E2A\u7EE7\u7EED\u6761\u4EF6\u3002\u627E\u5230\u4E86\uFF0C\u6216\u8005\u8D70\u8FC7\u5934\u4E86\uFF0C\u90FD\u505C\u3002" },
              { fromLine: 14, toLine: 18, text: "\u6BD4\u4E2D\u5C31\u628A\u6807\u5FD7\u7ACB\u8D77\u6765\u2014\u2014\u6CE8\u610F\u8FD9\u65F6**\u4E0D\u518D\u52A0 1**\uFF0C`Position` \u8981\u505C\u5728\u547D\u4E2D\u7684\u90A3\u4E00\u683C\u4E0A\u3002\u6CA1\u6BD4\u4E2D\u624D\u5F80\u524D\u8D70\u3002" },
              { fromLine: 20, toLine: 24, text: "\u5FAA\u73AF\u4E4B\u540E\u5148\u770B\u6807\u5FD7\u3002\u8FD9\u6BB5 `ELSE` \u5C31\u662F\u4E0A\u4E00\u8282\u7F3A\u7684\u90A3\u53E5\u8BDD\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["Not in the list"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u628A `Position \u2190 Position + 1` \u4ECE `ELSE` \u91CC\u632A\u51FA\u6765\u3001\u653E\u5230 `ENDIF` \u540E\u9762\uFF08\u4E5F\u5C31\u662F\u6BCF\u4E00\u8F6E\u90FD\u52A0\u4E00\uFF09\uFF0C\u627E\u5F97\u5230\u7684\u65F6\u5019\u4F1A\u53D1\u751F\u4EC0\u4E48\uFF1F",
            options: [
              {
                key: "A",
                label: "\u4F1A\u53D8\u6210\u627E\u4E0D\u5230",
                correct: false,
                explanation: "`Found` \u7167\u6837\u88AB\u8BBE\u6210 `TRUE`\uFF0C\u6240\u4EE5\u8D70\u7684\u8FD8\u662F\u300C\u627E\u5230\u4E86\u300D\u90A3\u4E00\u652F\uFF0C\u53EA\u662F\u62A5\u51FA\u6765\u7684\u683C\u5B50\u4E0D\u5BF9\u3002"
              },
              {
                key: "B",
                label: "\u8FD0\u884C\u65F6\u8D8A\u754C\u505C\u4E0B\u6765",
                correct: false,
                explanation: "\u591A\u52A0\u7684\u90A3\u4E00\u6B21\u53D1\u751F\u5728\u5FAA\u73AF\u4F53\u7684\u672B\u5C3E\uFF0C\u52A0\u5B8C\u5FAA\u73AF\u5C31\u5224\u65AD\u6761\u4EF6\u5E76\u9000\u51FA\uFF0C\u4E0D\u4F1A\u518D\u62FF\u8FD9\u4E2A\u4E0B\u6807\u53BB\u53D6\u683C\u5B50\u3002"
              },
              {
                key: "C",
                label: "\u62A5\u51FA\u6765\u7684\u4F4D\u7F6E\u6BD4\u771F\u5B9E\u4F4D\u7F6E\u5927\u4E00",
                correct: true,
                explanation: "\u5BF9\u3002\u6BD4\u4E2D\u7684\u90A3\u4E00\u8F6E\u628A\u6807\u5FD7\u7ACB\u8D77\u6765\u4E4B\u540E\u53C8\u591A\u52A0\u4E86\u4E00\u6B21\uFF0C`Position` \u5DF2\u7ECF\u8D8A\u8FC7\u547D\u4E2D\u7684\u683C\u5B50\u3002\u7B2C 3 \u683C\u547D\u4E2D\u4F1A\u62A5\u6210\u7B2C 4 \u683C\u3002"
              },
              {
                key: "D",
                label: "\u7ED3\u679C\u4E0D\u53D8\uFF0C\u53EA\u662F\u591A\u8D70\u4E00\u6B65",
                correct: false,
                explanation: "\u5FAA\u73AF\u786E\u5B9E\u7ACB\u523B\u5C31\u505C\u4E86\uFF0C\u4F46\u505C\u4E0B\u6765\u65F6 `Position` \u7684\u503C\u5DF2\u7ECF\u88AB\u6539\u8FC7\uFF0C\u800C\u8FD9\u4E2A\u503C\u6B63\u662F\u8981\u62A5\u51FA\u6765\u7684\u7B54\u6848\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "10.2.1",
            title: "\u5728\u540D\u5355\u91CC\u627E\u4E00\u4E2A\u6570",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u5148\u8BFB\u5165 6 \u4E2A\u6574\u6570\u5B58\u8FDB\u6570\u7EC4\uFF0C\u518D\u8BFB\u5165\u4E00\u4E2A\u8981\u627E\u7684\u6570\uFF0C\u663E\u793A\u5B83\u5728\u6570\u7EC4\u91CC\u7684\u4F4D\u7F6E\uFF1B\u4E0D\u5728\u91CC\u9762\u5C31\u8BF4\u4E00\u58F0\u3002\u540C\u4E00\u4E2A\u6570\u51FA\u73B0\u4E24\u6B21\u65F6\uFF0C\u62A5**\u7B2C\u4E00\u6B21**\u51FA\u73B0\u7684\u4F4D\u7F6E\u3002",
            ioSpec: {
              input: [
                "\u5148\u516D\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\uFF1B\u518D\u4E00\u884C\uFF0C\u662F\u8981\u627E\u7684\u6570\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
                "\u524D\u516D\u6B21\u662F `Enter a number`\uFF0C\u6700\u540E\u4E00\u6B21\u662F `Enter the number to find`"
              ].join("\n"),
              output: [
                "\u4E00\u884C\u3002\u627E\u5230\u65F6\u5199\u6210\uFF1A",
                "`Found at <\u4F4D\u7F6E>`",
                "\u627E\u4E0D\u5230\u65F6\u5199\u6210\uFF1A",
                "`Not found`",
                "`Found at` \u548C\u4F4D\u7F6E\u4E4B\u95F4\u662F\u4E00\u4E2A\u7A7A\u683C\u3002"
              ].join("\n")
            },
            constraints: {
              require: [
                {
                  feature: "decl.array-1d",
                  reason: "\u516D\u4E2A\u6570\u8981\u5148\u5168\u90E8\u5B58\u4E0B\u6765\uFF0C\u624D\u8C08\u5F97\u4E0A\u5728\u91CC\u9762\u627E\u3002"
                },
                {
                  feature: "loop.while",
                  reason: "\u627E\u5230\u5C31\u8BE5\u505C\u4E0B\u6765\uFF0C\u8D70\u51E0\u683C\u4E8B\u5148\u4E0D\u77E5\u9053\u2014\u2014\u8FD9\u6B63\u662F `WHILE` \u7684\u573A\u5408\u3002"
                },
                {
                  feature: "select.if-else",
                  reason: "\u627E\u5230\u548C\u627E\u4E0D\u5230\u90FD\u8981\u6709\u4EA4\u4EE3\uFF0C\u5C4F\u5E55\u4E0A\u4E0D\u80FD\u4EC0\u4E48\u90FD\u4E0D\u663E\u793A\u3002"
                }
              ]
            },
            hints: [
              "\u7528\u4E00\u4E2A `BOOLEAN` \u8BB0\u4F4F\u300C\u627E\u5230\u4E86\u6CA1\u6709\u300D\uFF0C\u5FAA\u73AF\u4E4B\u524D\u5148\u628A\u5B83\u8BBE\u6210 `FALSE`\u3002",
              "\u5FAA\u73AF\u7684\u7EE7\u7EED\u6761\u4EF6\u6709\u4E24\u4E2A\uFF1A\u8FD8\u6CA1\u627E\u5230\uFF0C\u800C\u4E14\u8FD8\u6CA1\u8D70\u8FC7\u4E0A\u754C\u3002",
              "\u6BD4\u4E2D\u7684\u90A3\u4E00\u8F6E\u4E0D\u8981\u518D\u8BA9\u4E0B\u6807\u5F80\u524D\u8D70\uFF0C\u5426\u5219\u62A5\u51FA\u6765\u7684\u4F4D\u7F6E\u4F1A\u591A\u4E00\u683C\u3002"
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
              "FOR Position \u2190 1 TO 6",
              '   OUTPUT "Enter a number"',
              "   INPUT Values[Position]",
              "NEXT Position",
              'OUTPUT "Enter the number to find"',
              "INPUT Target",
              "Found \u2190 FALSE",
              "Position \u2190 1",
              "WHILE Found = FALSE AND Position <= 6",
              "   IF Values[Position] = Target THEN",
              "      Found \u2190 TRUE",
              "   ELSE",
              "      Position \u2190 Position + 1",
              "   ENDIF",
              "ENDWHILE",
              "IF Found = TRUE THEN",
              '   OUTPUT "Found at ", Position',
              "ELSE",
              '   OUTPUT "Not found"',
              "ENDIF"
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["5", "9", "2", "8", "4", "1", "8"], caseHint: "\u8981\u627E\u7684\u6570\u5728\u4E2D\u95F4\u67D0\u4E00\u683C\uFF0C\u53EA\u51FA\u73B0\u4E00\u6B21\u3002" },
              { id: "t2", kind: "boundary", inputs: ["5", "9", "2", "8", "4", "1", "5"], caseHint: "\u8981\u627E\u7684\u6570\u5C31\u5728\u7B2C\u4E00\u683C\u3002" },
              { id: "t3", kind: "boundary", inputs: ["5", "9", "2", "8", "4", "1", "1"], caseHint: "\u8981\u627E\u7684\u6570\u5728\u6700\u540E\u4E00\u683C\uFF0C\u8981\u4E00\u76F4\u8D70\u5230\u5934\u624D\u78B0\u5230\u3002" },
              { id: "t4", kind: "abnormal", inputs: ["5", "9", "2", "8", "4", "1", "7"], caseHint: "\u8981\u627E\u7684\u6570\u6839\u672C\u4E0D\u5728\u8FD9\u6279\u6570\u91CC\u3002" },
              { id: "t5", kind: "normal", inputs: ["3", "7", "3", "7", "3", "7", "7"], caseHint: "\u8981\u627E\u7684\u6570\u51FA\u73B0\u4E86\u597D\u51E0\u6B21\uFF0C\u5E94\u5F53\u62A5\u6700\u9760\u524D\u7684\u90A3\u4E00\u6B21\u3002" },
              { id: "t6", kind: "extreme", inputs: ["-99999", "0", "0", "0", "0", "99999", "99999"], caseHint: "\u4E00\u6279\u6570\u91CC\u6DF7\u7740\u5F88\u5927\u548C\u5F88\u5C0F\u7684\u503C\uFF0C\u8981\u627E\u7684\u662F\u6700\u5927\u7684\u90A3\u4E2A\u3002" }
            ]
          }
        ]
      },
      {
        id: "10.3",
        title: "\u5192\u6CE1\u6392\u5E8F\u7684\u601D\u8DEF",
        syllabus: ["\xA710.2"],
        estimatedMinutes: 10,
        taughtFeatures: AFTER_CHAPTER_9,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u67E5\u627E\u662F\u4ECE\u4E00\u6392\u6570\u91CC\u6311\u4E00\u4E2A\uFF0C\u6392\u5E8F\u662F\u628A\u6574\u6392\u91CD\u65B0\u6446\u597D\u3002**\u5192\u6CE1\u6392\u5E8F\uFF08bubble sort\uFF09**\u7684\u529E\u6CD5\u51FA\u5947\u5730\u7B28\uFF1A\u5B83\u4E00\u6B21\u53EA\u770B**\u76F8\u90BB\u7684\u4E24\u683C**\uFF0C\u524D\u9762\u90A3\u683C\u6BD4\u540E\u9762\u90A3\u683C\u5927\uFF0C\u5C31\u628A\u8FD9\u4E24\u4E2A\u503C**\u4EA4\u6362\uFF08swap\uFF09**\u8FC7\u6765\u3002",
              "\u4EA4\u6362\u4E24\u4E2A\u683C\u5B50\u8981**\u501F\u7B2C\u4E09\u4E2A\u53D8\u91CF**\u3002\u76F4\u63A5\u5199 `A \u2190 B` \u518D\u5199 `B \u2190 A` \u662F\u4E0D\u884C\u7684\uFF1A\u7B2C\u4E00\u53E5\u4E00\u6267\u884C\uFF0CA \u539F\u6765\u7684\u503C\u5C31\u88AB\u76D6\u6389\u4E86\uFF0C\u7B2C\u4E8C\u53E5\u518D\u5199\u56DE\u53BB\uFF0C\u4E24\u8FB9\u5C31\u90FD\u6210\u4E86 B\u3002\u6240\u4EE5\u5148\u628A A \u5B58\u8FDB\u4E00\u4E2A\u4E34\u65F6\u53D8\u91CF\uFF0C\u518D\u817E\u5730\u65B9\u3002",
              "\u4ECE\u5934\u5230\u5C3E\u8FD9\u6837\u6BD4\u4E00\u904D\uFF0C\u53EB\u8D70\u4E86**\u4E00\u8D9F\uFF08pass\uFF09**\u3002\u4E00\u8D9F\u8D70\u5B8C\uFF0C\u6700\u5927\u7684\u90A3\u4E2A\u6570\u4E00\u5B9A\u88AB\u63A8\u5230\u4E86\u6700\u540E\u4E00\u683C\u2014\u2014\u5B83\u6BCF\u6B21\u6BD4\u8F83\u90FD\u6BD4\u5BF9\u65B9\u5927\uFF0C\u4E8E\u662F\u4E00\u8DEF\u5F80\u53F3\u632A\u5230\u5934\uFF0C\u50CF\u6C14\u6CE1\u4E00\u6837\u6D6E\u4E0A\u53BB\uFF0C\u540D\u5B57\u5C31\u662F\u8FD9\u4E48\u6765\u7684\u3002",
              "\u4F46\u4E00\u8D9F\u53EA\u5B89\u987F\u4E86\u4E00\u4E2A\u6570\u3002\u5269\u4E0B\u7684\u8FD8\u4E71\u7740\uFF0C\u6240\u4EE5\u8981\u518D\u8D70\u4E00\u8D9F\u628A\u7B2C\u4E8C\u5927\u7684\u9001\u5230\u5012\u6570\u7B2C\u4E8C\u683C\uFF0C\u518D\u8D70\u4E00\u8D9F\u9001\u7B2C\u4E09\u5927\u7684\u2026\u2026\u4E0B\u4E00\u8282\u5C31\u628A\u8FD9\u4E9B\u8D9F\u6570\u5957\u8D77\u6765\u3002"
            ]
          },
          {
            kind: "example",
            title: "\u53EA\u8D70\u4E00\u8D9F",
            fileName: "Example_10_3_a.pseudocode",
            code: [
              "DECLARE Values : ARRAY[1:5] OF INTEGER",
              "DECLARE J : INTEGER",
              "DECLARE Temp : INTEGER",
              "Values[1] \u2190 3",
              "Values[2] \u2190 9",
              "Values[3] \u2190 1",
              "Values[4] \u2190 7",
              "Values[5] \u2190 5",
              "FOR J \u2190 1 TO 4",
              "   IF Values[J] > Values[J + 1] THEN",
              "      Temp \u2190 Values[J]",
              "      Values[J] \u2190 Values[J + 1]",
              "      Values[J + 1] \u2190 Temp",
              "   ENDIF",
              "NEXT J",
              "FOR J \u2190 1 TO 5",
              "   OUTPUT Values[J]",
              "NEXT J"
            ].join("\n"),
            annotations: [
              { fromLine: 9, toLine: 9, text: "\u4E94\u683C\u53EA\u6BD4\u56DB\u5BF9\uFF1A\u7B2C 5 \u683C\u6CA1\u6709\u53F3\u90BB\u5C45\uFF0C\u6240\u4EE5\u7EC8\u70B9\u662F 4 \u800C\u4E0D\u662F 5\u3002" },
              { fromLine: 10, toLine: 14, text: "\u53EA\u6BD4\u76F8\u90BB\u7684\u4E24\u683C\u3002\u6574\u4E2A\u5192\u6CE1\u6392\u5E8F\u5C31\u53EA\u505A\u8FD9\u4E00\u4EF6\u4E8B\uFF0C\u522B\u7684\u90FD\u662F\u91CD\u590D\u5B83\u3002" },
              { fromLine: 11, toLine: 13, text: "\u4E09\u6B65\u4EA4\u6362\uFF1A\u5148\u628A\u5DE6\u8FB9\u7684\u503C\u5B58\u8D77\u6765\uFF0C\u518D\u628A\u53F3\u8FB9\u7684\u642C\u8FC7\u6765\uFF0C\u6700\u540E\u628A\u5B58\u7740\u7684\u90A3\u4E2A\u653E\u5230\u53F3\u8FB9\u3002" },
              { fromLine: 16, toLine: 18, text: "\u4E00\u8D9F\u4E4B\u540E\u7684\u6837\u5B50\uFF1A\u6700\u5927\u7684 9 \u5DF2\u7ECF\u5728\u6700\u540E\u4E00\u683C\u4E86\uFF0C\u524D\u9762\u51E0\u4E2A\u8FD8\u4E71\u7740\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["3", "1", "7", "5", "9"]
            }
          },
          {
            kind: "counterExample",
            title: "\u4E0D\u501F\u4E34\u65F6\u53D8\u91CF\u7684\u300C\u4EA4\u6362\u300D",
            cases: [
              {
                code: [
                  "DECLARE Values : ARRAY[1:2] OF INTEGER",
                  "Values[1] \u2190 3",
                  "Values[2] \u2190 9",
                  "Values[1] \u2190 Values[2]",
                  "Values[2] \u2190 Values[1]",
                  "OUTPUT Values[1]",
                  "OUTPUT Values[2]"
                ].join("\n"),
                note: "\u4E24\u884C\u770B\u7740\u50CF\u662F\u628A\u503C\u5BF9\u8C03\uFF0C\u8DD1\u51FA\u6765\u5374\u662F\u4E24\u4E2A 9\u3002\u7B2C\u4E00\u884C\u628A `Values[1]` \u539F\u6765\u7684 3 \u76D6\u6389\u4E86\uFF0C\u7B2C\u4E8C\u884C\u518D\u53D6 `Values[1]` \u65F6\u53D6\u5230\u7684\u5DF2\u7ECF\u662F\u521A\u642C\u8FDB\u53BB\u7684 9\u3002**\u8FD9\u6BB5\u4EE3\u7801\u96F6\u63D0\u793A\u3001\u8DD1\u5F97\u5B8C**\u2014\u2014\u53EA\u662F 3 \u6CA1\u4E86\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E00\u6392 6 \u4E2A\u6570\uFF0C\u8D70\u5B8C**\u7B2C\u4E00\u8D9F**\u4E4B\u540E\uFF0C\u4E0B\u9762\u54EA\u4E00\u4EF6\u4E8B\u4E00\u5B9A\u6210\u7ACB\uFF1F",
            options: [
              {
                key: "A",
                label: "\u6574\u6392\u5DF2\u7ECF\u6392\u597D\u4E86",
                correct: false,
                explanation: "\u53EA\u6709\u78B0\u5DE7\u7684\u65F6\u5019\u624D\u4F1A\u3002\u4E00\u8D9F\u5B89\u987F\u7684\u662F\u672B\u5C3E\u90A3\u4E00\u4E2A\uFF0C\u524D\u9762\u7684\u987A\u5E8F\u4ECD\u7136\u53EF\u80FD\u662F\u4E71\u7684\u3002"
              },
              {
                key: "B",
                label: "\u81F3\u5C11\u53D1\u751F\u4E86\u4E00\u6B21\u4EA4\u6362",
                correct: false,
                explanation: "\u672C\u6765\u5C31\u5DF2\u7ECF\u6392\u597D\u7684\u4E00\u6392\uFF0C\u8D70\u4E00\u8D9F\u4E00\u6B21\u4E5F\u4E0D\u4F1A\u6362\u3002\u4E0B\u4E00\u8282\u672B\u5C3E\u6B63\u662F\u5229\u7528\u8FD9\u4E00\u70B9\u63D0\u524D\u6536\u5DE5\u3002"
              },
              {
                key: "C",
                label: "\u6700\u5927\u7684\u90A3\u4E2A\u6570\u5DF2\u7ECF\u5728\u6700\u540E\u4E00\u683C",
                correct: true,
                explanation: "\u5BF9\u3002\u6700\u5927\u7684\u6570\u65E0\u8BBA\u4ECE\u54EA\u4E00\u683C\u51FA\u53D1\uFF0C\u6BCF\u4E00\u6B21\u6BD4\u8F83\u90FD\u4F1A\u8D62\uFF0C\u4E8E\u662F\u88AB\u4E00\u8DEF\u5F80\u53F3\u6362\u5230\u5934\u3002\u8FD9\u662F\u4E00\u8D9F\u552F\u4E00\u80FD\u4FDD\u8BC1\u7684\u4E8B\u3002"
              },
              {
                key: "D",
                label: "\u6700\u5C0F\u7684\u90A3\u4E2A\u6570\u5DF2\u7ECF\u5728\u7B2C\u4E00\u683C",
                correct: false,
                explanation: "\u4E0D\u4E00\u5B9A\u3002\u5C0F\u7684\u6570\u6BCF\u8D9F\u6700\u591A\u5F80\u5DE6\u632A\u4E00\u683C\uFF1A\u5B83\u53EA\u6709\u5728\u8DDF\u5DE6\u90BB\u5C45\u6BD4\u7684\u90A3\u4E00\u6B21\u624D\u4F1A\u88AB\u6362\u8FC7\u53BB\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "10.4",
        title: "\u5199\u51FA\u5192\u6CE1\u6392\u5E8F",
        syllabus: ["\xA710.2"],
        estimatedMinutes: 11,
        taughtFeatures: AFTER_CHAPTER_9,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E00\u8D9F\u9001\u4E00\u4E2A\u6570\u5230\u4F4D\uFF0C\u90A3\u5C31\u591A\u8D70\u51E0\u8D9F\uFF1A**\u5916\u5C42\u6570\u8D9F\u6570\uFF0C\u5185\u5C42\u8D70\u4E00\u8D9F**\u2014\u2014\u53C8\u662F\u4E00\u5BF9\u5D4C\u5957\u5FAA\u73AF\uFF0C\u53EA\u4E0D\u8FC7\u8FD9\u56DE\u5185\u5C42\u505A\u7684\u4E8B\u662F\u6BD4\u8F83\u548C\u4EA4\u6362\u3002",
              "5 \u4E2A\u6570\u8981\u8D70\u51E0\u8D9F\uFF1F4 \u8D9F\u3002\u524D\u56DB\u8D9F\u628A\u6700\u5927\u7684\u56DB\u4E2A\u4F9D\u6B21\u5B89\u987F\u597D\uFF0C\u5269\u4E0B\u7684\u90A3\u4E00\u4E2A\u81EA\u7136\u5C31\u5728\u7B2C\u4E00\u683C\u4E86\u2014\u2014**n \u4E2A\u6570\u6700\u591A\u8D70 n-1 \u8D9F**\u3002",
              "\u5185\u5C42\u7684\u7EC8\u70B9\u6BCF\u8D9F\u90FD\u5F80\u56DE\u7F29\u4E00\u683C\uFF1A\u7B2C `I` \u8D9F\u5F00\u59CB\u65F6\uFF0C\u672B\u5C3E\u5DF2\u7ECF\u6709 `I - 1` \u4E2A\u5230\u4F4D\u4E86\uFF0C\u4E0D\u5FC5\u518D\u78B0\u3002\u5199\u6210 `FOR J \u2190 1 TO 5 - I`\uFF0C\u968F\u7740\u8D9F\u6570\u9012\u589E\u81EA\u52A8\u7F29\u77ED\u3002",
              "\u4E3A\u4EC0\u4E48\u662F `5 - I` \u800C\u4E0D\u662F `5`\uFF1F\u56E0\u4E3A\u5185\u5C42\u6BD4\u7684\u662F `Values[J]` \u548C `Values[J + 1]`\uFF1AJ \u8D70\u5230\u54EA\u513F\uFF0C\u53F3\u8FB9\u90A3\u4E00\u683C\u5C31\u5F97\u8FD8\u5728\u6570\u7EC4\u91CC\u3002\u7EC8\u70B9\u5199\u6210 5\uFF0C\u7B2C\u4E00\u8D9F J \u5C31\u4F1A\u8D70\u5230 5\uFF0C\u800C `Values[6]` \u6839\u672C\u4E0D\u5B58\u5728\u2014\u2014\u7A0B\u5E8F\u4F1A\u5728\u90A3\u4E00\u884C\u505C\u4E0B\u6765\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u5728 AS \u9636\u6BB5\u5C31\u80FD\u5199\u51FA\u5E76\u4F7F\u7528\u5192\u6CE1\u6392\u5E8F\uFF08\xA710.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u5B8C\u6574\u7684\u5192\u6CE1\u6392\u5E8F",
            fileName: "Example_10_4_a.pseudocode",
            code: [
              "DECLARE Values : ARRAY[1:5] OF INTEGER",
              "DECLARE I : INTEGER",
              "DECLARE J : INTEGER",
              "DECLARE Temp : INTEGER",
              "Values[1] \u2190 3",
              "Values[2] \u2190 9",
              "Values[3] \u2190 1",
              "Values[4] \u2190 7",
              "Values[5] \u2190 5",
              "FOR I \u2190 1 TO 4",
              "   FOR J \u2190 1 TO 5 - I",
              "      IF Values[J] > Values[J + 1] THEN",
              "         Temp \u2190 Values[J]",
              "         Values[J] \u2190 Values[J + 1]",
              "         Values[J + 1] \u2190 Temp",
              "      ENDIF",
              "   NEXT J",
              "NEXT I",
              "FOR I \u2190 1 TO 5",
              "   OUTPUT Values[I]",
              "NEXT I"
            ].join("\n"),
            annotations: [
              { fromLine: 10, toLine: 10, text: "\u5916\u5C42\u53EA\u7BA1\u6570\u8D9F\u6570\uFF1A5 \u4E2A\u6570\u8D70 4 \u8D9F\u3002`I` \u5728\u5FAA\u73AF\u4F53\u91CC\u4E0D\u7528\u6765\u53D6\u683C\u5B50\uFF0C\u5B83\u53EA\u662F\u300C\u7B2C\u51E0\u8D9F\u300D\u3002" },
              { fromLine: 11, toLine: 11, text: "\u5185\u5C42\u7684\u7EC8\u70B9\u8DDF\u7740\u8D9F\u6570\u7F29\uFF1A\u7B2C 1 \u8D9F\u6BD4\u5230\u7B2C 4 \u5BF9\uFF0C\u7B2C 4 \u8D9F\u53EA\u6BD4\u7B2C 1 \u5BF9\u3002" },
              { fromLine: 12, toLine: 16, text: "\u548C\u4E0A\u4E00\u8282\u90A3\u6BB5\u4E00\u6A21\u4E00\u6837\u3002\u6574\u4E2A\u6392\u5E8F\u7684\u529B\u6C14\u5168\u5728\u8FD9\u4E94\u884C\u4E0A\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["1", "3", "5", "7", "9"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u628A\u5185\u5C42\u5199\u6210 `FOR J \u2190 1 TO 5`\uFF08\u5FD8\u4E86\u51CF\u8D9F\u6570\uFF09\uFF0C\u8FD0\u884C\u4F1A\u600E\u6837\uFF1F",
            options: [
              {
                key: "A",
                label: "\u7B2C\u4E00\u8D9F\u8D70\u5230\u6700\u540E\u4E00\u5BF9\u65F6\u8D8A\u754C\uFF0C\u7A0B\u5E8F\u505C\u4E0B\u6765",
                correct: true,
                explanation: "\u5BF9\u3002`J` \u8D70\u5230 5 \u65F6\u8981\u53D6 `Values[J + 1]`\uFF0C\u4E5F\u5C31\u662F\u7B2C 6 \u683C\uFF0C\u800C\u6570\u7EC4\u53EA\u6709 5 \u683C\u3002\u7A0B\u5E8F\u505C\u5728\u6BD4\u8F83\u90A3\u4E00\u884C\u3002"
              },
              {
                key: "B",
                label: "\u6392\u5E8F\u7ED3\u679C\u6B63\u786E\uFF0C\u53EA\u662F\u591A\u6BD4\u4E86\u51E0\u6B21",
                correct: false,
                explanation: "\u591A\u6BD4\u51E0\u6B21\u672C\u8EAB\u4E0D\u5F71\u54CD\u7ED3\u679C\uFF0C\u4F46\u8FD9\u91CC\u591A\u51FA\u6765\u7684\u90A3\u4E00\u6B21\u8981\u8BFB\u4E00\u4E2A\u4E0D\u5B58\u5728\u7684\u683C\u5B50\uFF0C\u7A0B\u5E8F\u6839\u672C\u8D70\u4E0D\u5230\u6700\u540E\u3002"
              },
              {
                key: "C",
                label: "\u7F16\u8F91\u5668\u5728\u8FD0\u884C\u524D\u5C31\u62E6\u4E0B\u6765",
                correct: false,
                explanation: "\u4E0B\u6807\u662F `J + 1`\uFF0C\u662F\u4E2A\u7B97\u51FA\u6765\u7684\u503C\u3002\u8981\u7B49 `J` \u771F\u7684\u53D6\u5230 5 \u624D\u77E5\u9053\u8D8A\u754C\uFF0C\u8FD0\u884C\u524D\u770B\u4E0D\u51FA\u6765\u3002"
              },
              {
                key: "D",
                label: "\u6700\u540E\u4E00\u683C\u4F1A\u88AB\u5F53\u6210 0 \u53C2\u4E0E\u6BD4\u8F83",
                correct: false,
                explanation: "\u4E0D\u5B58\u5728\u7684\u683C\u5B50\u4E0D\u4F1A\u88AB\u5F53\u6210 0\u3002\u8D8A\u754C\u5C31\u662F\u8D8A\u754C\uFF0C\u7A0B\u5E8F\u4F1A\u505C\u4E0B\u6765\u800C\u4E0D\u662F\u7F16\u4E00\u4E2A\u503C\u51FA\u6765\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "10.4.1",
            title: "\u4ECE\u5C0F\u5230\u5927\u6392\u597D",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165 5 \u4E2A\u6574\u6570\u5B58\u8FDB\u6570\u7EC4\uFF0C\u7528\u5192\u6CE1\u6392\u5E8F\u628A\u5B83\u4EEC\u4ECE\u5C0F\u5230\u5927\u6392\u597D\uFF0C\u518D\u4E00\u884C\u4E00\u4E2A\u663E\u793A\u51FA\u6765\u3002",
            ioSpec: {
              input: ["\u4E94\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a number`"].join("\n"),
              output: "\u4E94\u884C\uFF0C\u6BCF\u884C\u4E00\u4E2A\u6574\u6570\uFF0C\u4ECE\u5C0F\u5230\u5927\u3002"
            },
            constraints: {
              require: [
                {
                  feature: "decl.array-1d",
                  reason: "\u8981\u53CD\u590D\u56DE\u5934\u6BD4\u8F83\u548C\u4EA4\u6362\uFF0C\u4E94\u4E2A\u6570\u5FC5\u987B\u5148\u5B58\u6210\u4E00\u6392\u3002"
                },
                {
                  feature: "loop.nested",
                  reason: "\u5916\u5C42\u6570\u8D9F\u6570\u3001\u5185\u5C42\u8D70\u4E00\u8D9F\uFF0C\u5192\u6CE1\u6392\u5E8F\u5929\u751F\u662F\u4E24\u5C42\u5FAA\u73AF\u3002"
                },
                {
                  feature: "select.if",
                  reason: "\u53EA\u6709\u524D\u9762\u90A3\u683C\u6BD4\u540E\u9762\u5927\u7684\u65F6\u5019\u624D\u4EA4\u6362\uFF0C\u4E0D\u80FD\u6BCF\u6B21\u90FD\u6362\u3002"
                }
              ]
            },
            hints: [
              "\u5148\u628A\u8BFB\u5165\u5199\u5B8C\u518D\u5F00\u59CB\u6392\u2014\u2014\u6392\u5E8F\u7684\u4E24\u5C42\u5FAA\u73AF\u91CC\u4E0D\u8BE5\u8FD8\u6709 `INPUT`\u3002",
              "\u4EA4\u6362\u8981\u501F\u4E00\u4E2A\u4E34\u65F6\u53D8\u91CF\uFF0C\u4E09\u53E5\u8BDD\u7F3A\u4E00\u4E0D\u53EF\u3002",
              "\u5185\u5C42\u7684\u7EC8\u70B9\u8981\u968F\u8D9F\u6570\u7F29\u77ED\uFF0C\u5426\u5219\u6700\u540E\u4E00\u6B21\u6BD4\u8F83\u4F1A\u53BB\u8BFB\u6570\u7EC4\u5916\u9762\u7684\u683C\u5B50\u3002"
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
              "FOR I \u2190 1 TO 5",
              '   OUTPUT "Enter a number"',
              "   INPUT Values[I]",
              "NEXT I",
              "FOR I \u2190 1 TO 4",
              "   FOR J \u2190 1 TO 5 - I",
              "      IF Values[J] > Values[J + 1] THEN",
              "         Temp \u2190 Values[J]",
              "         Values[J] \u2190 Values[J + 1]",
              "         Values[J + 1] \u2190 Temp",
              "      ENDIF",
              "   NEXT J",
              "NEXT I",
              "FOR I \u2190 1 TO 5",
              "   OUTPUT Values[I]",
              "NEXT I"
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["4", "2", "8", "6", "0"], caseHint: "\u4E94\u4E2A\u5404\u4E0D\u76F8\u540C\u7684\u6570\uFF0C\u987A\u5E8F\u662F\u4E71\u7684\u3002" },
              { id: "t2", kind: "boundary", inputs: ["1", "2", "3", "4", "5"], caseHint: "\u8BFB\u8FDB\u6765\u7684\u65F6\u5019\u672C\u6765\u5C31\u5DF2\u7ECF\u6392\u597D\u4E86\u3002" },
              { id: "t3", kind: "boundary", inputs: ["5", "4", "3", "2", "1"], caseHint: "\u8BFB\u8FDB\u6765\u7684\u65F6\u5019\u6B63\u597D\u662F\u5B8C\u5168\u5012\u8FC7\u6765\u7684\u3002" },
              { id: "t4", kind: "normal", inputs: ["7", "7", "7", "7", "7"], caseHint: "\u4E94\u4E2A\u6570\u5B8C\u5168\u4E00\u6837\uFF0C\u4E00\u6B21\u4E5F\u4E0D\u9700\u8981\u4EA4\u6362\u3002" },
              { id: "t5", kind: "extreme", inputs: ["99999", "-99999", "0", "99999", "-1"], caseHint: "\u6DF7\u7740\u6781\u5927\u548C\u6781\u5C0F\u7684\u503C\uFF0C\u8FD8\u6709\u91CD\u590D\u7684\u3002" }
            ]
          }
        ]
      },
      {
        id: "10.5",
        title: "\u52A0\u4E00\u4E2A\u6807\u5FD7\uFF0C\u6392\u597D\u4E86\u5C31\u6536\u5DE5",
        syllabus: ["\xA710.2"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_CHAPTER_9,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E0A\u4E00\u8282\u90A3\u6BB5\u6709\u4E2A\u6D6A\u8D39\uFF1A\u4E00\u6392\u672C\u6765\u5C31\u5DF2\u7ECF\u6392\u597D\u7684\u6570\uFF0C\u5B83\u7167\u6837\u8001\u8001\u5B9E\u5B9E\u8D70\u6EE1 4 \u8D9F\uFF0C\u4E00\u6B21\u90FD\u6CA1\u6362\u8FC7\uFF0C\u4E5F\u4E0D\u77E5\u9053\u81EA\u5DF1\u8BE5\u505C\u3002",
              "\u770B\u51FA\u6765\u53EA\u9700\u8981\u518D\u52A0\u4E00\u4E2A\u6807\u5FD7\uFF1A\u6BCF\u8D9F\u5F00\u59CB\u524D\u628A `Swapped` \u8BBE\u6210 `FALSE`\uFF0C\u4E00\u65E6\u53D1\u751F\u4EA4\u6362\u5C31\u6539\u6210 `TRUE`\u3002\u4E00\u8D9F\u8D70\u5B8C\u5B83\u8FD8\u662F `FALSE`\uFF0C\u5C31\u8BF4\u660E\u8FD9\u4E00\u8D9F\u76F8\u90BB\u7684\u6BCF\u4E00\u5BF9\u90FD\u5DF2\u7ECF\u662F\u5BF9\u7684\u2014\u2014**\u90A3\u6574\u6392\u5C31\u5DF2\u7ECF\u6392\u597D\u4E86**\uFF0C\u540E\u9762\u7684\u8D9F\u4E00\u8D9F\u90FD\u4E0D\u7528\u8D70\u3002",
              "\u4E8E\u662F\u5916\u5C42\u4ECE\u300C\u8D70\u6EE1\u56FA\u5B9A\u8D9F\u6570\u300D\u53D8\u6210\u300C\u8D70\u5230\u4E0D\u7528\u518D\u8D70\u4E3A\u6B62\u300D\uFF0C`FOR` \u4E5F\u5C31\u6362\u6210\u4E86 `REPEAT`\uFF1A\u81F3\u5C11\u5F97\u8D70\u4E00\u8D9F\uFF08\u4E0D\u8D70\u600E\u4E48\u77E5\u9053\u6362\u4E0D\u6362\uFF09\uFF0C\u8D70\u5B8C\u518D\u5224\u65AD\u8981\u4E0D\u8981\u7EE7\u7EED\u3002\u8FD9\u6B63\u662F\u7B2C 5 \u7AE0\u6311\u5FAA\u73AF\u7684\u5224\u636E\u3002",
              "\u6539\u5B8C\u4E4B\u540E\uFF0C\u6700\u597D\u7684\u60C5\u51B5\u53EA\u8D70\u4E00\u8D9F\uFF0C\u6700\u574F\u7684\u60C5\u51B5\uFF08\u5B8C\u5168\u5012\u8FC7\u6765\uFF09\u8FD8\u662F n-1 \u8D9F\u3002**\u540C\u4E00\u4E2A\u7B97\u6CD5\uFF0C\u5FEB\u6162\u53D6\u51B3\u4E8E\u6570\u636E\u957F\u4EC0\u4E48\u6837**\u2014\u2014\u7B2C 18 \u7AE0\u6BD4\u8F83\u7B97\u6CD5\u65F6\u8FD8\u4F1A\u56DE\u5230\u8FD9\u4EF6\u4E8B\u3002"
            ]
          },
          {
            kind: "example",
            title: "\u5E26\u6807\u5FD7\u7684\u5192\u6CE1\u6392\u5E8F",
            fileName: "Example_10_5_a.pseudocode",
            code: [
              "DECLARE Values : ARRAY[1:5] OF INTEGER",
              "DECLARE I : INTEGER",
              "DECLARE J : INTEGER",
              "DECLARE Temp : INTEGER",
              "DECLARE Swapped : BOOLEAN",
              "DECLARE Passes : INTEGER",
              "Values[1] \u2190 3",
              "Values[2] \u2190 9",
              "Values[3] \u2190 1",
              "Values[4] \u2190 7",
              "Values[5] \u2190 5",
              "Passes \u2190 0",
              "REPEAT",
              "   Swapped \u2190 FALSE",
              "   Passes \u2190 Passes + 1",
              "   FOR J \u2190 1 TO 4",
              "      IF Values[J] > Values[J + 1] THEN",
              "         Temp \u2190 Values[J]",
              "         Values[J] \u2190 Values[J + 1]",
              "         Values[J + 1] \u2190 Temp",
              "         Swapped \u2190 TRUE",
              "      ENDIF",
              "   NEXT J",
              "UNTIL Swapped = FALSE",
              'OUTPUT "Passes: ", Passes',
              "FOR I \u2190 1 TO 5",
              "   OUTPUT Values[I]",
              "NEXT I"
            ].join("\n"),
            annotations: [
              { fromLine: 14, toLine: 14, text: "\u6E05\u96F6\u653E\u5728\u6BCF\u8D9F\u7684\u5F00\u5934\uFF0C\u4E0D\u80FD\u653E\u5728 `REPEAT` \u4E4B\u524D\u2014\u2014\u90A3\u6837\u53EA\u6709\u7B2C\u4E00\u8D9F\u7B97\u6570\u3002" },
              { fromLine: 21, toLine: 21, text: "\u53EA\u8981\u6362\u8FC7\u4E00\u6B21\u5C31\u7ACB\u8D77\u6765\u3002\u5B83\u56DE\u7B54\u7684\u662F\u300C\u8FD9\u4E00\u8D9F\u6709\u6CA1\u6709\u52A8\u8FC7\u300D\u3002" },
              { fromLine: 24, toLine: 24, text: "\u4E00\u8D9F\u90FD\u6CA1\u6362\uFF0C\u5C31\u8BF4\u660E\u5DF2\u7ECF\u6392\u597D\uFF0C\u5FAA\u73AF\u5230\u6B64\u4E3A\u6B62\u3002" },
              { fromLine: 25, toLine: 25, text: "\u8FD9\u91CC\u628A\u8D9F\u6570\u663E\u793A\u51FA\u6765\u53EA\u662F\u4E3A\u4E86\u770B\u5F97\u89C1\uFF1B\u771F\u6B63\u5728\u7528\u7684\u7A0B\u5E8F\u91CC\u4E0D\u9700\u8981\u8FD9\u4E00\u884C\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["Passes: 3", "1", "3", "5", "7", "9"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u628A\u4E0A\u9762\u90A3\u6BB5\u91CC\u7684\u4E94\u4E2A\u6570\u6362\u6210 `1 3 5 7 9`\uFF08\u672C\u6765\u5C31\u6392\u597D\u4E86\uFF09\uFF0C`Passes` \u4F1A\u663E\u793A\u51E0\uFF1F",
            options: [
              {
                key: "A",
                label: "0",
                correct: false,
                explanation: "`REPEAT` \u81F3\u5C11\u6267\u884C\u4E00\u6B21\u2014\u2014\u4E0D\u5148\u8D70\u4E00\u8D9F\uFF0C\u6839\u672C\u65E0\u4ECE\u77E5\u9053\u8981\u4E0D\u8981\u4EA4\u6362\u3002"
              },
              {
                key: "B",
                label: "4",
                correct: false,
                explanation: "4 \u662F\u4E0A\u4E00\u8282\u90A3\u79CD\u56FA\u5B9A\u8D9F\u6570\u7684\u5199\u6CD5\u3002\u52A0\u4E86\u6807\u5FD7\u4E4B\u540E\uFF0C\u8D70\u6EE1 4 \u8D9F\u53EA\u4F1A\u53D1\u751F\u5728\u6700\u574F\u7684\u60C5\u51B5\u3002"
              },
              {
                key: "C",
                label: "2",
                correct: false,
                explanation: "\u4E0D\u9700\u8981\u7B2C\u4E8C\u8D9F\u3002\u7B2C\u4E00\u8D9F\u7ED3\u675F\u65F6\u6807\u5FD7\u8FD8\u662F `FALSE`\uFF0C`UNTIL` \u5DF2\u7ECF\u6210\u7ACB\uFF0C\u4E0D\u4F1A\u518D\u8FDB\u5FAA\u73AF\u3002"
              },
              {
                key: "D",
                label: "1",
                correct: true,
                explanation: "\u5BF9\u3002\u7B2C\u4E00\u8D9F\u628A\u6BCF\u4E00\u5BF9\u90FD\u6BD4\u4E86\u4E00\u904D\uFF0C\u4E00\u6B21\u4E5F\u6CA1\u6362\uFF0C`Swapped` \u4FDD\u6301 `FALSE`\uFF0C`UNTIL` \u7684\u6761\u4EF6\u6210\u7ACB\uFF0C\u5FAA\u73AF\u5C31\u7ED3\u675F\u4E86\u3002"
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
        title: "\u6392\u597D\u518D\u627E",
        statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165 6 \u4E2A\u6574\u6570\uFF0C\u5148\u628A\u5B83\u4EEC\u4ECE\u5C0F\u5230\u5927\u6392\u597D\u5E76\u9010\u884C\u663E\u793A\uFF0C\u7136\u540E\u8BFB\u5165\u4E00\u4E2A\u8981\u627E\u7684\u6570\uFF0C\u5728**\u6392\u597D\u4E4B\u540E**\u7684\u8FD9\u6392\u6570\u91CC\u67E5\u627E\uFF0C\u663E\u793A\u5B83\u7684\u4F4D\u7F6E\uFF1B\u4E0D\u5728\u91CC\u9762\u5C31\u8BF4\u4E00\u58F0\u3002",
        ioSpec: {
          input: [
            "\u5148\u516D\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\uFF1B\u7B49\u516D\u4E2A\u6570\u6392\u597D\u663E\u793A\u5B8C\u4E4B\u540E\uFF0C\u518D\u8BFB\u5165\u4E00\u884C\uFF0C\u662F\u8981\u627E\u7684\u6570\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
            "\u524D\u516D\u6B21\u662F `Enter a number`\uFF0C\u6700\u540E\u4E00\u6B21\u662F `Enter the number to find`"
          ].join("\n"),
          output: [
            "\u5148\u516D\u884C\uFF0C\u6BCF\u884C\u4E00\u4E2A\u6574\u6570\uFF0C\u4ECE\u5C0F\u5230\u5927\u3002\u7136\u540E\u4E00\u884C\u67E5\u627E\u7ED3\u679C\uFF1A",
            "`Found at <\u4F4D\u7F6E>`",
            "\u6216\u8005",
            "`Not found`",
            "\u4F4D\u7F6E\u6307\u7684\u662F\u6392\u597D\u4E4B\u540E\u7684\u4F4D\u7F6E\u3002\u540C\u4E00\u4E2A\u6570\u51FA\u73B0\u591A\u6B21\u65F6\u62A5\u6700\u9760\u524D\u7684\u90A3\u4E00\u6B21\u3002"
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
          "\u4E09\u6BB5\u4E8B\u5404\u5199\u5404\u7684\uFF1A\u8BFB\u5165\u3001\u6392\u5E8F\u3001\u67E5\u627E\u3002\u4E2D\u95F4\u4E0D\u8981\u4E92\u76F8\u63D2\u8BDD\u3002",
          "\u6392\u5E8F\u7528\u4E0A\u4E00\u8282\u7684\u4E24\u5C42\u5FAA\u73AF\uFF1B\u67E5\u627E\u7528\u5E26\u6807\u5FD7\u7684 `WHILE`\uFF0C\u627E\u5230\u5C31\u505C\u3002",
          "\u8981\u627E\u7684\u90A3\u4E2A\u6570\u5FC5\u987B\u7B49\u516D\u4E2A\u6570\u663E\u793A\u5B8C\u4E4B\u540E\u624D\u8BFB\u2014\u2014\u987A\u5E8F\u53CD\u4E86\uFF0C\u5C4F\u5E55\u4E0A\u7684\u5148\u540E\u5C31\u4E0D\u5BF9\u3002"
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
          "FOR I \u2190 1 TO 6",
          '   OUTPUT "Enter a number"',
          "   INPUT Values[I]",
          "NEXT I",
          "FOR I \u2190 1 TO 5",
          "   FOR J \u2190 1 TO 6 - I",
          "      IF Values[J] > Values[J + 1] THEN",
          "         Temp \u2190 Values[J]",
          "         Values[J] \u2190 Values[J + 1]",
          "         Values[J + 1] \u2190 Temp",
          "      ENDIF",
          "   NEXT J",
          "NEXT I",
          "FOR I \u2190 1 TO 6",
          "   OUTPUT Values[I]",
          "NEXT I",
          'OUTPUT "Enter the number to find"',
          "INPUT Target",
          "Found \u2190 FALSE",
          "Position \u2190 1",
          "WHILE Found = FALSE AND Position <= 6",
          "   IF Values[Position] = Target THEN",
          "      Found \u2190 TRUE",
          "   ELSE",
          "      Position \u2190 Position + 1",
          "   ENDIF",
          "ENDWHILE",
          "IF Found = TRUE THEN",
          '   OUTPUT "Found at ", Position',
          "ELSE",
          '   OUTPUT "Not found"',
          "ENDIF"
        ].join("\n"),
        tests: [
          { id: "t1", kind: "normal", inputs: ["4", "2", "8", "6", "0", "9", "6"], caseHint: "\u516D\u4E2A\u5404\u4E0D\u76F8\u540C\u7684\u6570\uFF0C\u8981\u627E\u7684\u90A3\u4E2A\u5728\u4E2D\u95F4\u3002" },
          { id: "t2", kind: "boundary", inputs: ["6", "5", "4", "3", "2", "1", "1"], caseHint: "\u8BFB\u8FDB\u6765\u65F6\u5B8C\u5168\u5012\u8FC7\u6765\uFF0C\u8981\u627E\u7684\u662F\u6392\u597D\u4E4B\u540E\u7684\u7B2C\u4E00\u4E2A\u3002" },
          { id: "t3", kind: "boundary", inputs: ["1", "2", "3", "4", "5", "6", "6"], caseHint: "\u8BFB\u8FDB\u6765\u65F6\u5C31\u5DF2\u7ECF\u6392\u597D\uFF0C\u8981\u627E\u7684\u662F\u6700\u540E\u4E00\u4E2A\u3002" },
          { id: "t4", kind: "abnormal", inputs: ["4", "2", "8", "6", "0", "9", "7"], caseHint: "\u8981\u627E\u7684\u6570\u4E0D\u5728\u8FD9\u6279\u6570\u91CC\u3002" },
          { id: "t5", kind: "normal", inputs: ["3", "7", "3", "7", "3", "7", "7"], caseHint: "\u53EA\u6709\u4E24\u79CD\u503C\u5404\u51FA\u73B0\u51E0\u6B21\uFF0C\u8981\u627E\u7684\u90A3\u4E2A\u6709\u597D\u51E0\u4EFD\u3002" },
          { id: "t6", kind: "extreme", inputs: ["99999", "-99999", "0", "0", "99999", "-1", "-99999"], caseHint: "\u6DF7\u7740\u6781\u5927\u548C\u6781\u5C0F\u7684\u503C\uFF0C\u8981\u627E\u7684\u662F\u6700\u5C0F\u7684\u90A3\u4E2A\u3002" }
        ]
      }
    ]
  };

  // packages/teaching-content/src/chapter-11.ts
  var AFTER_CHAPTER_10 = [
    "io.output",
    "io.input",
    "decl.variable",
    "misc.comment",
    "type.string",
    "literal.string",
    "type.integer",
    "type.real",
    "type.char",
    "type.boolean",
    "type.date",
    "literal.integer",
    "literal.real",
    "literal.char",
    "literal.boolean",
    "literal.date",
    "assign.simple",
    "decl.constant",
    "op.arithmetic",
    "op.div",
    "op.mod",
    "op.relational",
    "op.and",
    "op.or",
    "op.not",
    "select.if",
    "select.if-else",
    "select.nested-if",
    "select.case",
    "select.case-range",
    "select.case-otherwise",
    "loop.for",
    "loop.for-step",
    "loop.while",
    "loop.repeat",
    "loop.nested",
    "builtin.length",
    "builtin.mid",
    "builtin.right",
    "builtin.ucase",
    "builtin.lcase",
    "op.concat",
    "builtin.int",
    "builtin.rand",
    "decl.array-1d",
    "array.index",
    "decl.array-2d",
    "array.index-2d"
  ];
  var AFTER_11_1 = [...AFTER_CHAPTER_10, "decl.record-type", "record.field-access"];
  var chapter11 = {
    id: 11,
    title: "\u8BB0\u5F55",
    level: "AS",
    syllabus: ["\xA710.1"],
    prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    sections: [
      {
        id: "11.1",
        title: "\u4E3A\u4EC0\u4E48\u9700\u8981\u8BB0\u5F55",
        syllabus: ["\xA710.1"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_11_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u6570\u7EC4\u89E3\u51B3\u7684\u662F\u300C\u540C\u4E00\u79CD\u4E1C\u897F\u6709\u5F88\u591A\u4E2A\u300D\uFF1A\u4E00\u6392\u6210\u7EE9\u3001\u4E00\u6392\u6C14\u6E29\u3002\u53EF\u73B0\u5B9E\u91CC\u7684\u4E00\u4EFD\u6570\u636E\u5F80\u5F80\u662F**\u51E0\u6837\u4E0D\u540C\u7684\u4E1C\u897F\u51D1\u6210\u7684\u4E00\u4EFD**\u2014\u2014\u4E00\u4E2A\u5B66\u751F\u6709\u59D3\u540D\u3001\u5E74\u7EA7\u548C\u5E73\u5747\u5206\uFF0C\u4E00\u672C\u4E66\u6709\u4E66\u540D\u3001\u51FA\u7248\u5E74\u548C\u4EF7\u683C\u3002\u7C7B\u578B\u90FD\u4E0D\u4E00\u6837\uFF0C\u6570\u7EC4\u88C5\u4E0D\u4E0B\u3002",
              "\u53EA\u7528\u53D8\u91CF\u4E5F\u80FD\u88C5\uFF1A`StudentName`\u3001`StudentYear`\u3001`StudentMark` \u5404\u6765\u4E00\u4E2A\u3002\u80FD\u8DD1\uFF0C\u4F46\u8FD9\u4E09\u4E2A\u540D\u5B57\u4E4B\u95F4**\u6CA1\u6709\u4EFB\u4F55\u5173\u7CFB**\u2014\u2014\u5B83\u4EEC\u5C5E\u4E8E\u540C\u4E00\u4E2A\u4EBA\u8FD9\u4EF6\u4E8B\u53EA\u5199\u5728\u524D\u7F00\u91CC\uFF0C\u4E5F\u5C31\u662F\u53EA\u5199\u5728\u4F60\u5FC3\u91CC\u3002\u4F20\u7ED9\u522B\u4EBA\u3001\u5B58\u8FDB\u6570\u7EC4\u3001\u6392\u4E2A\u5E8F\uFF0C\u8FD9\u5C42\u5173\u7CFB\u968F\u65F6\u4F1A\u6563\u6389\u3002",
              "**\u8BB0\u5F55\uFF08record\uFF09**\u5C31\u662F\u628A\u8FD9\u51E0\u6837\u7ED1\u6210\u4E00\u4EFD\uFF1A\u5148\u5B9A\u4E49\u4E00\u79CD\u65B0\u7684\u7C7B\u578B\uFF0C\u8BF4\u6E05\u8FD9\u4EFD\u6570\u636E\u7531\u54EA\u51E0\u6837\u7EC4\u6210\uFF0C\u7136\u540E\u5C31\u80FD\u50CF\u7528 `INTEGER` \u4E00\u6837\u7528\u5B83\u58F0\u660E\u53D8\u91CF\u3002\u7EC4\u6210\u5B83\u7684\u6BCF\u4E00\u6837\u53EB\u4E00\u4E2A**\u5B57\u6BB5\uFF08field\uFF09**\u3002",
              "\u7ED1\u6210\u4E00\u4EFD\u4E4B\u540E\uFF0C\u300C\u4E00\u4E2A\u5B66\u751F\u300D\u624D\u7B2C\u4E00\u6B21\u6210\u4E3A\u7A0B\u5E8F\u91CC\u7684**\u4E00\u4E2A\u503C**\u2014\u2014\u53EF\u4EE5\u6574\u4EFD\u8D4B\u7ED9\u53E6\u4E00\u4E2A\u53D8\u91CF\uFF0C\u53EF\u4EE5\u6574\u4EFD\u653E\u8FDB\u6570\u7EC4\u7684\u4E00\u683C\u3002\u4E0B\u9762\u51E0\u8282\u5C31\u662F\u8FD9\u4EF6\u4E8B\u7684\u5199\u6CD5\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u80FD\u5B9A\u4E49\u5E76\u4F7F\u7528\u8BB0\u5F55\uFF0C\u5B57\u6BB5\u53EF\u4EE5\u662F\u4E0D\u540C\u7684\u6570\u636E\u7C7B\u578B\uFF08\xA710.1\uFF09\u3002"
              }
            ]
          },
          {
            kind: "comparison",
            title: "\u540C\u4E00\u4EFD\u6570\u636E\uFF0C\u4E09\u79CD\u88C5\u6CD5",
            intro: "\u4E00\u4E2A\u5B66\u751F\u7684\u59D3\u540D\u3001\u5E74\u7EA7\u548C\u5E73\u5747\u5206\u3002\u4E09\u680F\u8BF4\u7684\u662F\u540C\u4E00\u4EF6\u4E8B\uFF0C\u5DEE\u522B\u53EA\u5728\u300C\u5B83\u4EEC\u662F\u4E0D\u662F\u4E00\u4EFD\u300D\u3002",
            panes: [
              {
                label: "\u81EA\u7136\u8BED\u8A00",
                language: "natural",
                code: [
                  "\u4E00\u4E2A\u5B66\u751F\u7531\u4E09\u6837\u4E1C\u897F\u7EC4\u6210\uFF1A",
                  "  \u59D3\u540D\uFF08\u4E00\u4E32\u6587\u5B57\uFF09",
                  "  \u5E74\u7EA7\uFF08\u4E00\u4E2A\u6574\u6570\uFF09",
                  "  \u5E73\u5747\u5206\uFF08\u4E00\u4E2A\u5C0F\u6570\uFF09",
                  "\u8BB0\u4E0B Ada\uFF0C12 \u5E74\u7EA7\uFF0C78.5 \u5206\u3002"
                ].join("\n"),
                note: "\u300C\u7531\u4E09\u6837\u4E1C\u897F\u7EC4\u6210\u300D\u662F\u4E00\u53E5\u5B8C\u6574\u7684\u8BDD\uFF0C\u8BF4\u7684\u662F\u8FD9\u4E09\u6837\u5C5E\u4E8E\u540C\u4E00\u4E2A\u4EBA\u3002\u4E0B\u9762\u4E24\u680F\u7684\u5DEE\u522B\u5C31\u5728\u4E8E\u8FD9\u53E5\u8BDD\u6709\u6CA1\u6709\u88AB\u5199\u8FDB\u7A0B\u5E8F\u91CC\u3002"
              },
              {
                label: "\u4E09\u4E2A\u5404\u7BA1\u5404\u7684\u53D8\u91CF",
                language: "pseudocode",
                code: [
                  "DECLARE StudentName : STRING",
                  "DECLARE StudentYear : INTEGER",
                  "DECLARE StudentMark : REAL",
                  'StudentName \u2190 "Ada"',
                  "StudentYear \u2190 12",
                  "StudentMark \u2190 78.5"
                ].join("\n"),
                note: "\u4E09\u4E2A\u72EC\u7ACB\u7684\u53D8\u91CF\u3002\u5B83\u4EEC\u5C5E\u4E8E\u540C\u4E00\u4E2A\u4EBA\u8FD9\u4EF6\u4E8B\u53EA\u4F53\u73B0\u5728\u5171\u540C\u7684\u524D\u7F00\u4E0A\u2014\u2014\u7A0B\u5E8F\u672C\u8EAB\u5E76\u4E0D\u77E5\u9053\uFF0C\u6240\u4EE5\u4E5F\u5E2E\u4E0D\u4E0A\u4EFB\u4F55\u5FD9\u3002"
              },
              {
                label: "\u4E00\u6761\u8BB0\u5F55",
                language: "pseudocode",
                code: [
                  "TYPE TStudent",
                  "   DECLARE Name : STRING",
                  "   DECLARE Year : INTEGER",
                  "   DECLARE Mark : REAL",
                  "ENDTYPE",
                  "DECLARE One : TStudent",
                  'One.Name \u2190 "Ada"',
                  "One.Year \u2190 12",
                  "One.Mark \u2190 78.5"
                ].join("\n"),
                note: "\u5148\u8BF4\u6E05\u300C\u5B66\u751F\u300D\u662F\u4EC0\u4E48\uFF0C\u518D\u7528\u5B83\u58F0\u660E\u53D8\u91CF\u3002`One` \u662F\u4E00\u4E2A\u503C\uFF0C\u4E0D\u662F\u4E09\u4E2A\uFF1B\u8981\u591A\u8BB0\u4E00\u4E2A\u4EBA\uFF0C\u518D\u58F0\u660E\u4E00\u4E2A\u5C31\u884C\u3002"
              },
              {
                label: "Python",
                language: "python",
                code: ['one = {"name": "Ada", "year": 12, "mark": 78.5}', 'print(one["name"])'].join("\n"),
                note: "Python \u628A\u4E09\u6837\u88C5\u8FDB\u4E00\u4E2A\u5B57\u5178\uFF0C\u53D6\u7684\u65F6\u5019\u7528\u952E\u540D\u3002\u5F62\u72B6\u548C\u8BB0\u5F55\u4E00\u6837\uFF0C\u53EA\u662F\u5B83\u4E0D\u5FC5\u4E8B\u5148\u8BF4\u6E05\u6709\u54EA\u51E0\u6837\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0B\u9762\u54EA\u4E00\u6279\u6570\u636E**\u9002\u5408**\u653E\u8FDB\u4E00\u6761\u8BB0\u5F55\uFF1F",
            options: [
              {
                key: "A",
                label: "\u4E00\u53E5\u8981\u663E\u793A\u7ED9\u7528\u6237\u7684\u63D0\u793A\u8BED",
                correct: false,
                explanation: "\u8FD9\u53EA\u662F\u4E00\u4E2A\u503C\uFF0C\u4E00\u4E2A `STRING` \u53D8\u91CF\u5C31\u591F\uFF0C\u6CA1\u6709\u51E0\u6837\u4E1C\u897F\u9700\u8981\u7ED1\u5728\u4E00\u8D77\u3002"
              },
              {
                key: "B",
                label: "5 \u4E2A\u73ED\u5404 4 \u4E2A\u5C0F\u7EC4\u7684\u4EBA\u6570",
                correct: false,
                explanation: "\u5168\u662F\u4EBA\u6570\uFF0C\u7C7B\u578B\u76F8\u540C\uFF0C\u8981\u6307\u51C6\u4E00\u4E2A\u6570\u5F97\u8BF4\u6E05\u300C\u7B2C\u51E0\u73ED\u7B2C\u51E0\u7EC4\u300D\u2014\u2014\u8FD9\u662F\u4E8C\u7EF4\u6570\u7EC4\u3002"
              },
              {
                key: "C",
                label: "\u4E00\u4EF6\u5546\u54C1\u7684\u7F16\u53F7\u3001\u540D\u79F0\u548C\u5355\u4EF7",
                correct: true,
                explanation: "\u5BF9\u3002\u4E09\u6837\u4E1C\u897F\u7C7B\u578B\u5404\u4E0D\u76F8\u540C\uFF0C\u5374\u63CF\u8FF0\u7684\u662F\u540C\u4E00\u4EF6\u5546\u54C1\u2014\u2014\u6B63\u662F\u8BB0\u5F55\u8981\u7ED1\u7684\u90A3\u79CD\u4E00\u4EFD\u6570\u636E\u3002"
              },
              {
                key: "D",
                label: "\u4E00\u4E2A\u73ED 30 \u4E2A\u5B66\u751F\u7684\u603B\u5206",
                correct: false,
                explanation: "\u4E09\u5341\u4E2A\u540C\u7C7B\u578B\u7684\u6570\uFF0C\u4E00\u4E2A\u7F16\u53F7\u5C31\u6307\u5F97\u51C6\u3002\u8FD9\u662F\u6570\u7EC4\u7684\u6D3B\uFF0C\u4E0D\u662F\u8BB0\u5F55\u7684\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "11.2",
        title: "`TYPE ... ENDTYPE`\uFF1A\u5148\u5B9A\u4E49\uFF0C\u518D\u4F7F\u7528",
        syllabus: ["\xA710.1"],
        estimatedMinutes: 10,
        taughtFeatures: AFTER_11_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u5B9A\u4E49\u4E00\u79CD\u8BB0\u5F55\u7C7B\u578B\u5199\u5728 `TYPE` \u548C `ENDTYPE` \u4E4B\u95F4\uFF1A`TYPE TBook` \u8D77\u5934\uFF0C\u4E2D\u95F4\u4E00\u884C\u4E00\u4E2A\u5B57\u6BB5\uFF0C`ENDTYPE` \u6536\u5C3E\u3002**\u5B57\u6BB5\u7167\u6837\u7528 `DECLARE` \u5199**\uFF0C\u548C\u58F0\u660E\u666E\u901A\u53D8\u91CF\u7684\u683C\u5F0F\u4E00\u6A21\u4E00\u6837\u2014\u2014\u540D\u5B57\u3001\u5192\u53F7\u3001\u7C7B\u578B\u3002",
              "`TYPE ... ENDTYPE` \u672C\u8EAB**\u4E0D\u4EA7\u751F\u4EFB\u4F55\u5B58\u653E\u6570\u636E\u7684\u5730\u65B9**\u3002\u5B83\u53EA\u662F\u7ED9\u7F16\u8F91\u5668\u4E00\u53E5\u8BF4\u660E\uFF1A\u300C\u4EE5\u540E\u8981\u662F\u6709\u4EBA\u8BF4 `TBook`\uFF0C\u6307\u7684\u662F\u7531\u4E66\u540D\u3001\u51FA\u7248\u5E74\u3001\u4EF7\u683C\u4E09\u6837\u7EC4\u6210\u7684\u4E1C\u897F\u3002\u300D\u771F\u6B63\u7684\u5730\u65B9\u8981\u7B49 `DECLARE Current : TBook` \u624D\u6709\u3002",
              "\u5B9A\u4E49\u597D\u4EE5\u540E\uFF0C\u8FD9\u4E2A\u540D\u5B57\u5C31\u80FD\u5F53\u7C7B\u578B\u540D\u7528\uFF0C\u548C `INTEGER`\u3001`STRING` \u7AD9\u5728\u540C\u4E00\u4E2A\u4F4D\u7F6E\u3002\u8FD9\u4E5F\u662F\u4E3A\u4EC0\u4E48\u7C7B\u578B\u540D\u503C\u5F97\u8D77\u5F97\u4E00\u773C\u80FD\u8BA4\u51FA\u6765\u2014\u2014\u6B63\u5F0F\u53D1\u5E03\u7684\u4F2A\u4EE3\u7801\u8303\u4F8B\u5E38\u5E38\u7ED9\u5B83\u52A0\u4E2A `T` \u5F00\u5934\uFF0C\u672C\u8BFE\u7A0B\u8DDF\u968F\u8FD9\u4E2A\u5199\u6CD5\u3002",
              "\u5B57\u6BB5\u7684\u7C7B\u578B\u53EF\u4EE5\u5404\u4E0D\u76F8\u540C\uFF0C\u8FD9\u6B63\u662F\u8BB0\u5F55\u5B58\u5728\u7684\u7406\u7531\uFF1B\u4E5F\u53EF\u4EE5\u6709\u591A\u4E2A\u5B57\u6BB5\u662F\u540C\u4E00\u79CD\u7C7B\u578B\uFF0C\u6CA1\u4EBA\u62E6\u7740\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8BB0\u5F55\u7C7B\u578B\u5199\u6210 `TYPE <\u540D\u5B57>`\u3001\u82E5\u5E72\u884C `DECLARE <\u5B57\u6BB5> : <\u7C7B\u578B>`\u3001`ENDTYPE`\uFF08G\xA74\uFF09\u3002"
              },
              {
                source: "convention",
                text: "Guide \u6CA1\u6709\u89C4\u5B9A\u7C7B\u578B\u540D\u7684\u5199\u6CD5\u3002\u7ED9\u8BB0\u5F55\u7C7B\u578B\u540D\u52A0 `T` \u5F00\u5934\u662F\u8303\u4F8B\u91CC\u5E38\u89C1\u7684\u505A\u6CD5\uFF0C\u672C\u8BFE\u7A0B\u7EDF\u4E00\u91C7\u7528\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u5B9A\u4E49\u4E00\u79CD\u7C7B\u578B\uFF0C\u518D\u7528\u5B83\u58F0\u660E\u4E00\u4E2A\u53D8\u91CF",
            fileName: "Example_11_2_a.pseudocode",
            code: [
              "TYPE TBook",
              "   DECLARE Title : STRING",
              "   DECLARE Year : INTEGER",
              "   DECLARE Price : REAL",
              "ENDTYPE",
              "DECLARE Current : TBook",
              'Current.Title \u2190 "Algorithms"',
              "Current.Year \u2190 2020",
              "Current.Price \u2190 39.5",
              "OUTPUT Current.Title",
              "OUTPUT Current.Year",
              "OUTPUT Current.Price"
            ].join("\n"),
            annotations: [
              { fromLine: 1, toLine: 5, text: "\u8FD9\u4E94\u884C\u53EA\u662F\u4E00\u53E5\u8BF4\u660E\uFF0C\u8DD1\u8D77\u6765\u4EC0\u4E48\u4E5F\u4E0D\u505A\uFF0C\u8FDE\u4E00\u4E2A\u653E\u6570\u636E\u7684\u5730\u65B9\u90FD\u6CA1\u5EFA\u3002" },
              { fromLine: 2, toLine: 4, text: "\u4E09\u4E2A\u5B57\u6BB5\u4E09\u79CD\u7C7B\u578B\u3002\u5199\u6CD5\u548C\u666E\u901A\u7684 `DECLARE` \u5B8C\u5168\u4E00\u6837\uFF0C\u53EA\u662F\u4F4D\u7F6E\u5728 `TYPE` \u91CC\u9762\u3002" },
              { fromLine: 6, toLine: 6, text: "\u5230\u8FD9\u4E00\u884C\u624D\u771F\u6B63\u6709\u4E86\u4E00\u4E2A\u53D8\u91CF\u3002`TBook` \u7AD9\u7684\u6B63\u662F `INTEGER` \u5E73\u65F6\u7AD9\u7684\u4F4D\u7F6E\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["Algorithms", "2020", "39.5"]
            }
          },
          {
            kind: "counterExample",
            title: "\u4E24\u79CD\u5199\u4E0D\u6210\u7C7B\u578B\u7684\u5199\u6CD5",
            cases: [
              {
                title: "\u5FD8\u4E86 `ENDTYPE`",
                code: ["TYPE TBook", "   DECLARE Title : STRING", "DECLARE Current : TBook"].join("\n"),
                note: "\u6CA1\u6709 `ENDTYPE`\uFF0C\u7F16\u8F91\u5668\u5C31\u4E0D\u77E5\u9053\u8FD9\u4E2A\u7C7B\u578B\u5230\u54EA\u513F\u7B97\u5B8C\uFF0C\u4E0B\u9762\u90A3\u884C `DECLARE` \u4F1A\u88AB\u5F53\u6210\u53C8\u4E00\u4E2A\u5B57\u6BB5\u3002\u63D0\u793A\u6307\u56DE `TYPE` \u90A3\u4E00\u884C\u2014\u2014\u7F3A\u7684\u662F\u8FD9\u4E00\u5BF9\u91CC\u7684\u53E6\u4E00\u534A\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "UDT-003", line: 1, text: "`TYPE` \u8D77\u4E86\u5934\u5C31\u8981\u6709 `ENDTYPE` \u6536\u5C3E\uFF0C\u63D0\u793A\u505C\u5728\u8D77\u5934\u90A3\u4E00\u884C\u3002" }
                ]
              },
              {
                title: "\u5B57\u6BB5\u6CA1\u5199 `DECLARE`",
                code: ["TYPE TBook", "   Title : STRING", "ENDTYPE", "DECLARE Current : TBook"].join("\n"),
                note: "\u5B57\u6BB5\u4E0D\u80FD\u7701\u6389 `DECLARE`\u3002\u8FD9\u91CC\u7684\u5199\u6CD5\u770B\u7740\u50CF\u522B\u7684\u8BED\u8A00\u91CC\u7684\u7C7B\u578B\u6807\u6CE8\uFF0C\u4F46\u5728\u4F2A\u4EE3\u7801\u91CC\uFF0C`TYPE` \u91CC\u7684\u6BCF\u4E00\u884C\u90FD\u662F\u4E00\u53E5\u5B8C\u6574\u7684\u58F0\u660E\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "UDT-003", line: 2, text: "\u5B57\u6BB5\u4E5F\u8981\u5199\u6210 `DECLARE \u540D\u5B57 : \u7C7B\u578B`\u3002" }
                ]
              }
            ]
          },
          {
            kind: "quiz",
            type: "fill-blank",
            prompt: "\u8865\u5168\u8FD9\u6BB5\u5B9A\u4E49\uFF1A\u4E00\u79CD\u53EB `TPoint` \u7684\u8BB0\u5F55\uFF0C\u6709\u4E24\u4E2A `INTEGER` \u5B57\u6BB5 `X` \u548C `Y`\u3002",
            template: ["__1__ TPoint", "   __2__ X : INTEGER", "   __2__ Y : INTEGER", "__3__"].join("\n"),
            blanks: [
              { index: 1, answer: "TYPE" },
              { index: 2, answer: "DECLARE" },
              { index: 3, answer: "ENDTYPE" }
            ],
            bank: [
              { word: "TYPE", explanation: "\u8D77\u5934\u7684\u5173\u952E\u5B57\uFF0C\u540E\u9762\u8DDF\u8FD9\u79CD\u7C7B\u578B\u7684\u540D\u5B57\u3002" },
              { word: "DECLARE", explanation: "\u6BCF\u4E00\u4E2A\u5B57\u6BB5\u90FD\u662F\u4E00\u53E5\u58F0\u660E\uFF0C\u5199\u6CD5\u548C\u58F0\u660E\u666E\u901A\u53D8\u91CF\u4E00\u6837\u3002" },
              { word: "ENDTYPE", explanation: "\u6536\u5C3E\u7684\u5173\u952E\u5B57\uFF0C\u5C11\u4E86\u5B83\u7F16\u8F91\u5668\u4E0D\u77E5\u9053\u7C7B\u578B\u5230\u54EA\u513F\u7B97\u5B8C\u3002" },
              { word: "ENDDECLARE", explanation: "\u4F2A\u4EE3\u7801\u91CC\u6CA1\u6709\u8FD9\u4E2A\u5173\u952E\u5B57\u3002\u6536\u5C3E\u8981\u548C\u8D77\u5934\u914D\u5BF9\uFF0C\u8D77\u5934\u662F `TYPE`\u3002" },
              { word: "RECORD", explanation: "\u300C\u8BB0\u5F55\u300D\u662F\u8FD9\u79CD\u7C7B\u578B\u7684\u53EB\u6CD5\uFF0C\u4E0D\u662F\u5173\u952E\u5B57\u3002\u4F2A\u4EE3\u7801\u91CC\u8D77\u5934\u7528\u7684\u662F `TYPE`\u3002" }
            ]
          }
        ]
      },
      {
        id: "11.3",
        title: "\u7528\u70B9\u53F7\u8BFB\u5199\u5B57\u6BB5",
        syllabus: ["\xA710.1"],
        estimatedMinutes: 11,
        taughtFeatures: AFTER_11_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u6307\u4E00\u4E2A\u5B57\u6BB5\u7684\u5199\u6CD5\u662F**\u53D8\u91CF\u540D\u3001\u4E00\u4E2A\u70B9\u3001\u5B57\u6BB5\u540D**\uFF1A`Current.Title`\u3002\u70B9\u53F7\u5DE6\u8FB9\u5FC5\u987B\u662F\u4E00\u4E2A\u8BB0\u5F55\u53D8\u91CF\uFF0C\u53F3\u8FB9\u5FC5\u987B\u662F\u8FD9\u79CD\u7C7B\u578B\u91CC\u771F\u6709\u7684\u5B57\u6BB5\u540D\u2014\u2014\u5199\u4E86\u4E2A\u4E0D\u5B58\u5728\u7684\u540D\u5B57\uFF0C\u7F16\u8F91\u5668\u5728\u8FD0\u884C\u524D\u5C31\u62E6\u4E0B\u6765\u3002",
              "`Current.Title` \u6574\u4F53\u5C31\u5F53\u4E00\u4E2A\u666E\u901A\u53D8\u91CF\u7528\uFF1A\u80FD\u8D4B\u503C\u3001\u80FD\u51FA\u73B0\u5728\u8868\u8FBE\u5F0F\u91CC\u3001\u80FD `INPUT` \u8FDB\u53BB\u3001\u80FD `OUTPUT` \u51FA\u6765\u3002\u5B83\u662F\u4EC0\u4E48\u7C7B\u578B\uFF0C\u770B\u7684\u662F\u5B9A\u4E49\u91CC\u90A3\u4E00\u884C\u5199\u7684\u7C7B\u578B\u3002",
              "\u5B57\u6BB5\u540D**\u53EA\u5728\u5B83\u6240\u5C5E\u7684\u7C7B\u578B\u91CC\u6709\u610F\u4E49**\u3002`TBook` \u91CC\u6709\u4E2A\u5B57\u6BB5\u53EB `Year`\uFF0C\u7A0B\u5E8F\u91CC\u53E6\u5916\u58F0\u660E\u4E00\u4E2A\u53D8\u91CF\u4E5F\u53EB `Year`\uFF0C\u4E24\u8005\u4E92\u4E0D\u76F8\u5E72\u2014\u2014\u4E00\u4E2A\u8981\u5199\u6210 `Current.Year` \u624D\u6307\u5F97\u5230\uFF0C\u53E6\u4E00\u4E2A\u76F4\u63A5\u5199 `Year`\u3002",
              "\u58F0\u660E\u4E00\u4E2A\u8BB0\u5F55\u53D8\u91CF\uFF0C\u53EA\u662F\u628A\u51E0\u4E2A\u7A7A\u4F4D\u4E00\u8D77\u6446\u51FA\u6765\uFF0C**\u6BCF\u4E2A\u5B57\u6BB5\u5404\u81EA\u8FD8\u662F\u6CA1\u6709\u503C**\u3002\u54EA\u4E2A\u5B57\u6BB5\u6CA1\u8D4B\u503C\u5C31\u53BB\u8BFB\u54EA\u4E2A\uFF0C\u7A0B\u5E8F\u7167\u6837\u4F1A\u5728\u90A3\u4E00\u884C\u505C\u4E0B\u6765\u2014\u2014\u548C\u5FD8\u4E86\u7ED9\u666E\u901A\u53D8\u91CF\u8D4B\u503C\u662F\u540C\u4E00\u56DE\u4E8B\u3002"
            ]
          },
          {
            kind: "example",
            title: "\u540C\u540D\u7684\u5B57\u6BB5\u548C\u53D8\u91CF\u4E92\u4E0D\u76F8\u5E72",
            fileName: "Example_11_3_a.pseudocode",
            code: [
              "TYPE TBook",
              "   DECLARE Title : STRING",
              "   DECLARE Year : INTEGER",
              "ENDTYPE",
              "DECLARE Year : INTEGER",
              "DECLARE Current : TBook",
              "Year \u2190 2026",
              'OUTPUT "Enter a title"',
              "INPUT Current.Title",
              "Current.Year \u2190 2020",
              'OUTPUT Current.Title, " is ", Year - Current.Year, " years old"'
            ].join("\n"),
            annotations: [
              { fromLine: 3, toLine: 5, text: "\u4E24\u4E2A `Year`\uFF1A\u4E00\u4E2A\u662F `TBook` \u7684\u5B57\u6BB5\uFF0C\u4E00\u4E2A\u662F\u72EC\u7ACB\u7684\u53D8\u91CF\u3002\u5B83\u4EEC\u4E0D\u51B2\u7A81\uFF0C\u56E0\u4E3A\u6307\u5230\u5B83\u4EEC\u7684\u5199\u6CD5\u4E0D\u4E00\u6837\u3002" },
              { fromLine: 9, toLine: 9, text: "`INPUT` \u53EF\u4EE5\u76F4\u63A5\u8BFB\u8FDB\u4E00\u4E2A\u5B57\u6BB5\uFF0C\u4E0D\u7528\u5148\u8BFB\u8FDB\u4E34\u65F6\u53D8\u91CF\u518D\u642C\u3002" },
              { fromLine: 11, toLine: 11, text: "\u4E00\u53E5\u91CC\u4E24\u4E2A `Year` \u90FD\u51FA\u73B0\u4E86\uFF1A\u4E0D\u5E26\u70B9\u7684\u662F\u4ECA\u5E74\uFF0C\u5E26\u70B9\u7684\u662F\u8FD9\u672C\u4E66\u7684\u51FA\u7248\u5E74\u3002" }
            ],
            sampleRun: {
              inputs: ["Algorithms"],
              outputs: ["Enter a title", "Algorithms is 6 years old"]
            }
          },
          {
            kind: "counterExample",
            title: "\u4E24\u79CD\u7528\u4E0D\u4E86\u7684\u5B57\u6BB5",
            cases: [
              {
                title: "\u8FD9\u4E2A\u7C7B\u578B\u91CC\u6CA1\u6709\u8FD9\u4E2A\u5B57\u6BB5",
                code: ["TYPE TBook", "   DECLARE Title : STRING", "ENDTYPE", "DECLARE Current : TBook", 'Current.Name \u2190 "Algorithms"'].join("\n"),
                note: "`TBook` \u91CC\u53EA\u6709 `Title`\uFF0C\u6CA1\u6709 `Name`\u3002\u6709\u54EA\u4E9B\u5B57\u6BB5\u5728\u5B9A\u4E49\u91CC\u5199\u5F97\u6E05\u6E05\u695A\u695A\uFF0C\u6240\u4EE5\u8FD9\u4E00\u6761\u8FD0\u884C\u524D\u5C31\u80FD\u67E5\u51FA\u6765\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "UDT-005", line: 5, text: "\u8FD9\u4E2A\u7C7B\u578B\u91CC\u6CA1\u6709\u53EB\u8FD9\u4E2A\u540D\u5B57\u7684\u5B57\u6BB5\u3002" }
                ]
              },
              {
                title: "\u5B57\u6BB5\u8FD8\u6CA1\u8D4B\u503C\u5C31\u53BB\u8BFB",
                code: [
                  "TYPE TBook",
                  "   DECLARE Title : STRING",
                  "   DECLARE Year : INTEGER",
                  "ENDTYPE",
                  "DECLARE Current : TBook",
                  'Current.Title \u2190 "Algorithms"',
                  "OUTPUT Current.Year"
                ].join("\n"),
                note: "`Title` \u7ED9\u4E86\u503C\uFF0C`Year` \u6CA1\u7ED9\u3002\u58F0\u660E\u8BB0\u5F55\u53EA\u662F\u628A\u7A7A\u4F4D\u6446\u51FA\u6765\uFF0C\u4E00\u4E2A\u5B57\u6BB5\u4E00\u4E2A\u5B57\u6BB5\u5730\u586B\u624D\u7B97\u6570\u3002",
                expectRuntimeError: {
                  code: "RT1003",
                  line: 7,
                  text: "\u8FD9\u4E2A\u5B57\u6BB5\u8FD8\u6CA1\u6709\u503C\uFF0C\u7A0B\u5E8F\u505C\u5728\u8BFB\u5B83\u7684\u90A3\u4E00\u884C\u3002"
                }
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`TBook` \u91CC\u6709\u5B57\u6BB5 `Year`\uFF0C\u7A0B\u5E8F\u91CC\u53E6\u5916\u8FD8\u58F0\u660E\u4E86\u4E00\u4E2A\u53D8\u91CF `Year`\u3002\u5199 `Year \u2190 2026` \u6539\u7684\u662F\u54EA\u4E00\u4E2A\uFF1F",
            options: [
              {
                key: "A",
                label: "\u4E24\u4E2A\u4E00\u8D77\u6539",
                correct: false,
                explanation: "\u5B83\u4EEC\u662F\u4E24\u4E2A\u5404\u81EA\u72EC\u7ACB\u7684\u5B58\u653E\u4F4D\u7F6E\uFF0C\u4E00\u53E5\u8D4B\u503C\u53EA\u80FD\u6539\u4E00\u4E2A\u3002"
              },
              {
                key: "B",
                label: "\u7F16\u8F91\u5668\u4F1A\u56E0\u4E3A\u91CD\u540D\u62A5\u9519",
                correct: false,
                explanation: "\u4E0D\u91CD\u540D\u3002\u5B57\u6BB5\u540D\u53EA\u5728\u5B83\u6240\u5C5E\u7684\u7C7B\u578B\u91CC\u6709\u610F\u4E49\uFF0C\u4E0D\u5360\u7528\u7A0B\u5E8F\u91CC\u666E\u901A\u53D8\u91CF\u7684\u540D\u5B57\u3002"
              },
              {
                key: "C",
                label: "\u90A3\u4E2A\u72EC\u7ACB\u7684\u53D8\u91CF",
                correct: true,
                explanation: "\u5BF9\u3002\u4E0D\u5E26\u70B9\u53F7\u5C31\u662F\u90A3\u4E2A\u72EC\u7ACB\u7684\u53D8\u91CF\u3002\u8981\u6539\u8BB0\u5F55\u91CC\u7684\u90A3\u4E2A\uFF0C\u5FC5\u987B\u5199\u6210 `Current.Year`\u2014\u2014\u70B9\u53F7\u5DE6\u8FB9\u6307\u660E\u4E86\u662F\u8C01\u7684\u3002"
              },
              {
                key: "D",
                label: "\u8BB0\u5F55\u91CC\u7684\u90A3\u4E2A\u5B57\u6BB5",
                correct: false,
                explanation: "\u6307\u4E0D\u5230\u3002\u5B57\u6BB5\u6C38\u8FDC\u8981\u7ECF\u7531\u67D0\u4E2A\u8BB0\u5F55\u53D8\u91CF\u624D\u6307\u5F97\u5230\uFF0C\u5355\u5199\u5B57\u6BB5\u540D\u4E0D\u884C\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "11.3.1",
            title: "\u4E00\u4E2A\u5B66\u751F\u7684\u4E24\u79D1\u6210\u7EE9",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u5B9A\u4E49\u4E00\u79CD\u8BB0\u5F55\u7C7B\u578B\uFF0C\u4E00\u4E2A\u5B66\u751F\u6709\u59D3\u540D\u548C\u4E24\u79D1\u6210\u7EE9\uFF1B\u8BFB\u5165\u4E00\u4E2A\u5B66\u751F\u7684\u8FD9\u4E09\u6837\uFF0C\u7136\u540E\u663E\u793A\u4ED6\u7684\u59D3\u540D\u548C\u4E24\u79D1\u603B\u5206\u3002",
            ioSpec: {
              input: [
                "\u4E09\u884C\uFF1A\u7B2C\u4E00\u884C\u662F\u59D3\u540D\uFF08`STRING`\uFF09\uFF0C\u540E\u4E24\u884C\u5404\u662F\u4E00\u79D1\u6210\u7EE9\uFF08`INTEGER`\uFF09\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
                "`Enter a name`\u3001`Enter the first mark`\u3001`Enter the second mark`"
              ].join("\n"),
              output: ["\u4E00\u884C\uFF0C\u5199\u6210\uFF1A", "`<\u59D3\u540D>: <\u4E24\u79D1\u603B\u5206>`", "\u5192\u53F7\u540E\u9762\u662F\u4E00\u4E2A\u7A7A\u683C\u3002"].join("\n")
            },
            constraints: {
              require: [
                {
                  feature: "decl.record-type",
                  reason: "\u59D3\u540D\u548C\u4E24\u79D1\u6210\u7EE9\u662F\u540C\u4E00\u4E2A\u4EBA\u7684\u4E09\u6837\u4E1C\u897F\uFF0C\u9898\u76EE\u8981\u6C42\u628A\u5B83\u4EEC\u7ED1\u6210\u4E00\u4EFD\u3002"
                },
                {
                  feature: "record.field-access",
                  reason: "\u7ED1\u6210\u4E00\u4EFD\u4E4B\u540E\uFF0C\u8BFB\u5199\u5176\u4E2D\u4EFB\u4F55\u4E00\u6837\u90FD\u8981\u7ECF\u7531\u70B9\u53F7\u3002"
                }
              ]
            },
            hints: [
              "\u5148\u628A `TYPE ... ENDTYPE` \u5199\u5B8C\uFF0C\u518D `DECLARE` \u4E00\u4E2A\u8FD9\u79CD\u7C7B\u578B\u7684\u53D8\u91CF\u3002",
              "`INPUT` \u53EF\u4EE5\u76F4\u63A5\u8BFB\u8FDB\u5B57\u6BB5\uFF0C\u4E0D\u5FC5\u5148\u8BFB\u8FDB\u666E\u901A\u53D8\u91CF\u518D\u642C\u8FC7\u53BB\u3002",
              "\u603B\u5206\u4E0D\u7528\u4E13\u95E8\u58F0\u660E\u4E00\u4E2A\u53D8\u91CF\u5B58\uFF0C\u76F4\u63A5\u5728 `OUTPUT` \u91CC\u628A\u4E24\u4E2A\u5B57\u6BB5\u52A0\u8D77\u6765\u5C31\u884C\u3002"
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
              { id: "t1", kind: "normal", inputs: ["Bob", "62", "71"], caseHint: "\u666E\u901A\u7684\u4E00\u4E2A\u4EBA\uFF0C\u4E24\u79D1\u6210\u7EE9\u4E0D\u4E00\u6837\u3002" },
              { id: "t2", kind: "boundary", inputs: ["Cal", "0", "0"], caseHint: "\u4E24\u79D1\u90FD\u662F\u96F6\u5206\u3002" },
              { id: "t3", kind: "boundary", inputs: ["Dee", "100", "100"], caseHint: "\u4E24\u79D1\u90FD\u662F\u6EE1\u5206\u3002" },
              { id: "t4", kind: "normal", inputs: ["Eve Marie", "48", "52"], caseHint: "\u59D3\u540D\u91CC\u5E26\u7A7A\u683C\uFF0C\u663E\u793A\u7684\u65F6\u5019\u8981\u539F\u6837\u5199\u51FA\u6765\u3002" },
              { id: "t5", kind: "extreme", inputs: ["Fay", "-99999", "99999"], caseHint: "\u4E00\u79D1\u6781\u5C0F\u4E00\u79D1\u6781\u5927\uFF0C\u52A0\u8D77\u6765\u6B63\u597D\u62B5\u6D88\u3002" }
            ]
          }
        ]
      },
      {
        id: "11.4",
        title: "\u8BB0\u5F55\u6570\u7EC4",
        syllabus: ["\xA710.1"],
        estimatedMinutes: 11,
        taughtFeatures: AFTER_11_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E00\u6761\u8BB0\u5F55\u88C5\u4E00\u4E2A\u4EBA\uFF0C\u4E00\u4E2A\u73ED\u8981\u88C5\u4E09\u5341\u4E2A\u3002\u6570\u7EC4\u8981\u6C42\u6BCF\u4E00\u683C\u88C5\u540C\u4E00\u79CD\u4E1C\u897F\u2014\u2014\u8BB0\u5F55\u7C7B\u578B\u6B63\u597D\u4E5F\u662F\u4E00\u79CD\u7C7B\u578B\uFF0C\u6240\u4EE5 `ARRAY[1:30] OF TStudent` \u662F\u5408\u6CD5\u7684\uFF0C\u800C\u4E14\u662F\u8FD9\u95E8\u8BFE\u91CC\u6700\u5E38\u7528\u7684\u7EC4\u5408\u3002",
              "\u6307\u5230\u67D0\u4E2A\u4EBA\u7684\u67D0\u4E00\u6837\uFF0C\u4E24\u6B65\u8FDE\u7740\u5199\uFF1A`Form[2].Name`\u2014\u2014\u5148\u7528\u4E0B\u6807\u6311\u51FA\u7B2C 2 \u683C\uFF0C\u518D\u7528\u70B9\u53F7\u6311\u51FA\u90A3\u4E00\u683C\u91CC\u7684 `Name`\u3002\u987A\u5E8F\u662F\u56FA\u5B9A\u7684\uFF0C\u4E0B\u6807\u5728\u524D\u3001\u70B9\u53F7\u5728\u540E\u3002",
              "\u6709\u4E86\u8FD9\u4E2A\u7EC4\u5408\uFF0C\u524D\u51E0\u7AE0\u5B66\u7684\u4E1C\u897F\u5168\u90FD\u7528\u5F97\u4E0A\uFF1A`FOR` \u904D\u5386\u6574\u4E2A\u6570\u7EC4\uFF0C`IF` \u6311\u51FA\u7B26\u5408\u6761\u4EF6\u7684\u4EBA\uFF0C\u7B2C 10 \u7AE0\u7684\u5192\u6CE1\u6392\u5E8F\u751A\u81F3\u53EF\u4EE5**\u6574\u6761\u8BB0\u5F55\u4E00\u8D77\u4EA4\u6362**\u2014\u2014\u4E34\u65F6\u53D8\u91CF\u7684\u7C7B\u578B\u5199\u6210\u90A3\u79CD\u8BB0\u5F55\u7C7B\u578B\u5C31\u884C\u3002",
              "\u4E00\u683C\u4E00\u683C\u586B\u7684\u65F6\u5019\u4E0D\u7528\u5148\u7ED9\u6574\u683C\u8D4B\u4E00\u4E2A\u5B8C\u6574\u7684\u8BB0\u5F55\uFF0C\u76F4\u63A5\u5199 `Form[1].Name \u2190 ...` \u5C31\u53EF\u4EE5\uFF1A\u6BCF\u4E00\u683C\u5929\u751F\u5C31\u662F\u4E00\u6761\u5404\u5B57\u6BB5\u90FD\u8FD8\u7A7A\u7740\u7684\u8BB0\u5F55\u3002"
            ],
            callouts: [
              {
                source: "editor",
                text: "\u6570\u7EC4\u7684\u4E00\u683C\u6216\u8BB0\u5F55\u7684\u4E00\u4E2A\u5B57\u6BB5\u672C\u8EAB\u662F\u8BB0\u5F55\u65F6\uFF0C\u8FD9\u4E00\u683C\u5728\u7B2C\u4E00\u6B21\u7528\u5230\u5C31\u5DF2\u7ECF\u662F\u4E00\u6761\u7A7A\u8BB0\u5F55\uFF0C\u53EF\u4EE5\u76F4\u63A5\u5F80\u91CC\u9762\u7684\u5B57\u6BB5\u8D4B\u503C\uFF1B\u91CC\u9762\u7684\u57FA\u672C\u7C7B\u578B\u5B57\u6BB5\u4ECD\u7136\u8981\u5404\u81EA\u8D4B\u8FC7\u503C\u624D\u80FD\u8BFB\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u4E00\u4E2A\u73ED\u7684\u6210\u7EE9",
            fileName: "Example_11_4_a.pseudocode",
            code: [
              "TYPE TStudent",
              "   DECLARE Name : STRING",
              "   DECLARE Mark : INTEGER",
              "ENDTYPE",
              "DECLARE Form : ARRAY[1:3] OF TStudent",
              "DECLARE I : INTEGER",
              'Form[1].Name \u2190 "Ada"',
              "Form[1].Mark \u2190 80",
              'Form[2].Name \u2190 "Bob"',
              "Form[2].Mark \u2190 55",
              'Form[3].Name \u2190 "Cal"',
              "Form[3].Mark \u2190 91",
              "FOR I \u2190 1 TO 3",
              "   IF Form[I].Mark >= 60 THEN",
              '      OUTPUT Form[I].Name, " passed"',
              "   ENDIF",
              "NEXT I"
            ].join("\n"),
            annotations: [
              { fromLine: 5, toLine: 5, text: "\u4E09\u683C\uFF0C\u6BCF\u683C\u4E00\u6761 `TStudent`\u3002\u65B9\u62EC\u53F7\u91CC\u7684\u5199\u6CD5\u548C\u4E00\u7EF4\u6570\u7EC4\u5B8C\u5168\u4E00\u6837\uFF0C\u53D8\u7684\u53EA\u662F `OF` \u540E\u9762\u3002" },
              { fromLine: 7, toLine: 12, text: "\u4E0B\u6807\u5728\u524D\u3001\u70B9\u53F7\u5728\u540E\u3002\u516D\u884C\u586B\u6EE1\u4E09\u4E2A\u4EBA\u7684\u4E24\u4E2A\u5B57\u6BB5\u3002" },
              { fromLine: 13, toLine: 17, text: "\u904D\u5386\u548C\u5224\u65AD\u90FD\u662F\u8001\u5199\u6CD5\uFF0C\u53EA\u662F\u53D6\u503C\u7684\u65F6\u5019\u591A\u4E86\u4E00\u622A `.Mark`\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["Ada passed", "Cal passed"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`DECLARE Form : ARRAY[1:30] OF TStudent` \u4E4B\u540E\uFF0C\u8981\u53D6\u7B2C 7 \u4E2A\u4EBA\u7684 `Mark`\uFF0C\u8BE5\u600E\u4E48\u5199\uFF1F",
            options: [
              {
                key: "A",
                label: "`Form[7].Mark`",
                correct: true,
                explanation: "\u5BF9\u3002\u5148\u7528\u4E0B\u6807\u6311\u51FA\u90A3\u4E00\u683C\uFF0C\u518D\u7528\u70B9\u53F7\u6311\u51FA\u90A3\u4E00\u683C\u91CC\u7684\u5B57\u6BB5\uFF0C\u987A\u5E8F\u662F\u56FA\u5B9A\u7684\u3002"
              },
              {
                key: "B",
                label: "`Form.Mark[7]`",
                correct: false,
                explanation: "\u53CD\u4E86\u3002`Form` \u662F\u6570\u7EC4\u4E0D\u662F\u8BB0\u5F55\uFF0C\u70B9\u53F7\u5F97\u5148\u6709\u4E00\u6761\u8BB0\u5F55\u624D\u7528\u5F97\u4E0A\uFF1B\u800C `Mark` \u662F\u4E00\u4E2A\u6574\u6570\uFF0C\u4E0D\u662F\u4E00\u6392\u6570\u3002"
              },
              {
                key: "C",
                label: "`Form[7, Mark]`",
                correct: false,
                explanation: "\u9017\u53F7\u5206\u9694\u7684\u4E24\u4E2A\u4E0B\u6807\u662F\u4E8C\u7EF4\u6570\u7EC4\u7684\u5199\u6CD5\u3002\u8FD9\u91CC\u7B2C\u4E8C\u6B65\u6311\u7684\u662F\u5B57\u6BB5\u540D\uFF0C\u4E0D\u662F\u53E6\u4E00\u4E2A\u65B9\u5411\u7684\u7F16\u53F7\u3002"
              },
              {
                key: "D",
                label: "`TStudent[7].Mark`",
                correct: false,
                explanation: "`TStudent` \u662F\u7C7B\u578B\u540D\uFF0C\u4E0D\u662F\u5B58\u653E\u6570\u636E\u7684\u5730\u65B9\u3002\u8981\u53D6\u503C\u5F97\u4ECE\u90A3\u4E2A\u771F\u6B63\u58F0\u660E\u51FA\u6765\u7684\u53D8\u91CF `Form` \u5F00\u59CB\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "11.4.1",
            title: "\u5206\u6570\u6700\u9AD8\u7684\u4EBA",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165 4 \u4E2A\u5B66\u751F\u7684\u59D3\u540D\u548C\u6210\u7EE9\uFF0C\u5B58\u8FDB\u4E00\u4E2A\u8BB0\u5F55\u6570\u7EC4\uFF0C\u7136\u540E\u663E\u793A\u5206\u6570\u6700\u9AD8\u7684\u90A3\u4E2A\u4EBA\u7684\u59D3\u540D\u548C\u5206\u6570\u3002\u4FDD\u8BC1\u6700\u9AD8\u5206\u53EA\u6709\u4E00\u4E2A\u4EBA\u3002",
            ioSpec: {
              input: [
                "\u516B\u884C\uFF0C\u4E00\u4E2A\u4EBA\u4E24\u884C\uFF1A\u5148\u59D3\u540D\uFF08`STRING`\uFF09\uFF0C\u518D\u6210\u7EE9\uFF08`INTEGER`\uFF09\uFF0C\u56DB\u4E2A\u4EBA\u4F9D\u6B21\u8BFB\u5B8C\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
                "\u59D3\u540D\u524D\u662F `Enter a name`\uFF0C\u6210\u7EE9\u524D\u662F `Enter a mark`"
              ].join("\n"),
              output: ["\u4E00\u884C\uFF0C\u5199\u6210\uFF1A", "`Top: <\u59D3\u540D> <\u5206\u6570>`", "\u5192\u53F7\u540E\u9762\u548C\u59D3\u540D\u540E\u9762\u5404\u4E00\u4E2A\u7A7A\u683C\u3002"].join("\n")
            },
            constraints: {
              require: [
                {
                  feature: "decl.record-type",
                  reason: "\u59D3\u540D\u548C\u6210\u7EE9\u5C5E\u4E8E\u540C\u4E00\u4E2A\u4EBA\uFF0C\u5FC5\u987B\u7ED1\u6210\u4E00\u4EFD\u624D\u4E0D\u4F1A\u5728\u6392\u5E8F\u548C\u6BD4\u8F83\u65F6\u6563\u6389\u3002"
                },
                {
                  feature: "decl.array-1d",
                  reason: "\u56DB\u4E2A\u4EBA\u8981\u4E00\u8D77\u5B58\u4E0B\u6765\uFF0C\u4E00\u4EBA\u4E00\u683C\u3002"
                },
                {
                  feature: "record.field-access",
                  reason: "\u6BD4\u8F83\u7528\u7684\u662F\u6210\u7EE9\uFF0C\u663E\u793A\u7528\u7684\u662F\u59D3\u540D\uFF0C\u90FD\u8981\u7ECF\u7531\u70B9\u53F7\u53D6\u51FA\u6765\u3002"
                }
              ]
            },
            hints: [
              "\u5148\u628A\u8BFB\u5165\u7684\u5FAA\u73AF\u5199\u5B8C\uFF0C\u518D\u5F00\u59CB\u627E\u6700\u5927\u2014\u2014\u4E24\u4EF6\u4E8B\u4E0D\u8981\u6DF7\u5728\u4E00\u4E2A\u5FAA\u73AF\u91CC\u3002",
              "\u8BB0\u4F4F\u300C\u76EE\u524D\u6700\u9AD8\u7684\u662F\u7B2C\u51E0\u683C\u300D\uFF0C\u6BD4\u8BB0\u4F4F\u5206\u6570\u672C\u8EAB\u66F4\u597D\u7528\uFF1A\u59D3\u540D\u548C\u5206\u6570\u90FD\u80FD\u4ECE\u90A3\u4E00\u683C\u53D6\u5230\u3002",
              "\u628A\u7B2C 1 \u683C\u5F53\u6210\u8D77\u70B9\uFF0C\u4ECE\u7B2C 2 \u683C\u5F00\u59CB\u6BD4\u5C31\u591F\u4E86\u3002"
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
              "DECLARE I : INTEGER",
              "DECLARE Best : INTEGER",
              "FOR I \u2190 1 TO 4",
              '   OUTPUT "Enter a name"',
              "   INPUT Form[I].Name",
              '   OUTPUT "Enter a mark"',
              "   INPUT Form[I].Mark",
              "NEXT I",
              "Best \u2190 1",
              "FOR I \u2190 2 TO 4",
              "   IF Form[I].Mark > Form[Best].Mark THEN",
              "      Best \u2190 I",
              "   ENDIF",
              "NEXT I",
              'OUTPUT "Top: ", Form[Best].Name, " ", Form[Best].Mark'
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["Gil", "61", "Hal", "72", "Ivy", "58", "Jon", "66"], caseHint: "\u6700\u9AD8\u5206\u843D\u5728\u4E2D\u95F4\u67D0\u4E2A\u4EBA\u8EAB\u4E0A\u3002" },
              { id: "t2", kind: "boundary", inputs: ["Gil", "90", "Hal", "72", "Ivy", "58", "Jon", "66"], caseHint: "\u6700\u9AD8\u5206\u5C31\u662F\u7B2C\u4E00\u4E2A\u8BFB\u8FDB\u6765\u7684\u4EBA\u3002" },
              { id: "t3", kind: "boundary", inputs: ["Gil", "61", "Hal", "72", "Ivy", "58", "Jon", "88"], caseHint: "\u6700\u9AD8\u5206\u662F\u6700\u540E\u4E00\u4E2A\u8BFB\u8FDB\u6765\u7684\u4EBA\u3002" },
              { id: "t4", kind: "normal", inputs: ["Gil", "50", "Hal", "50", "Ivy", "50", "Jon", "51"], caseHint: "\u5176\u4F59\u51E0\u4E2A\u4EBA\u5206\u6570\u5B8C\u5168\u76F8\u540C\uFF0C\u53EA\u6709\u4E00\u4E2A\u4EBA\u7565\u9AD8\u3002" },
              { id: "t5", kind: "extreme", inputs: ["Gil", "-99999", "Hal", "-99998", "Ivy", "-99997", "Jon", "-99996"], caseHint: "\u6240\u6709\u4EBA\u7684\u5206\u6570\u90FD\u662F\u5F88\u5C0F\u7684\u8D1F\u6570\u3002" }
            ]
          }
        ]
      },
      {
        id: "11.5",
        title: "\u8BB0\u5F55\u8FD8\u662F\u5E73\u884C\u6570\u7EC4",
        syllabus: ["\xA710.1"],
        estimatedMinutes: 8,
        taughtFeatures: AFTER_11_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E0D\u7528\u8BB0\u5F55\u4E5F\u80FD\u5B58\u4E00\u4E2A\u73ED\uFF1A\u5F00\u4E24\u4E2A\u6570\u7EC4\uFF0C`Names` \u548C `Marks`\uFF0C\u7EA6\u5B9A\u7B2C `I` \u683C\u8BF4\u7684\u662F\u540C\u4E00\u4E2A\u4EBA\u3002\u8FD9\u79CD\u505A\u6CD5\u53EB**\u5E73\u884C\u6570\u7EC4\uFF08parallel arrays\uFF09**\u2014\u2014\u4E24\u6392\u4E1C\u897F\u5E76\u6392\u653E\u7740\uFF0C\u9760\u4E0B\u6807\u5BF9\u9F50\u3002",
              "\u5B83\u80FD\u8DD1\uFF0C\u4F46\u90A3\u53E5\u300C\u7B2C `I` \u683C\u8BF4\u7684\u662F\u540C\u4E00\u4E2A\u4EBA\u300D\u53EA\u662F\u4E2A**\u7EA6\u5B9A**\uFF0C\u7A0B\u5E8F\u91CC\u6CA1\u6709\u4EFB\u4F55\u4E00\u884C\u5199\u7740\u5B83\u3002\u53EA\u8981\u6709\u4E00\u5904\u8BA9\u4E24\u6392\u7684\u987A\u5E8F\u9519\u5F00\u2014\u2014\u6BD4\u5982\u6392\u5E8F\u65F6\u53EA\u6362\u4E86 `Marks` \u5FD8\u4E86\u6362 `Names`\u2014\u2014\u59D3\u540D\u548C\u5206\u6570\u5C31\u5BF9\u4E0D\u4E0A\u4E86\uFF0C\u800C\u4E14**\u4E00\u6761\u63D0\u793A\u90FD\u4E0D\u4F1A\u6709**\u3002",
              "**\u8BB0\u5F55\u6570\u7EC4\uFF08array of records\uFF09**\u628A\u8FD9\u53E5\u7EA6\u5B9A\u5199\u8FDB\u4E86\u7A0B\u5E8F\uFF1A\u4E00\u4E2A\u4EBA\u7684\u59D3\u540D\u548C\u5206\u6570\u5728\u540C\u4E00\u683C\u91CC\uFF0C\u6362\u683C\u5B50\u7684\u65F6\u5019\u53EA\u80FD\u4E00\u8D77\u6362\uFF0C\u60F3\u62C6\u90FD\u62C6\u4E0D\u5F00\u3002\u518D\u52A0\u5B57\u6BB5\u4E5F\u53EA\u6539\u4E00\u4E2A\u5730\u65B9\uFF0C\u800C\u4E0D\u662F\u518D\u5F00\u4E00\u4E2A\u6570\u7EC4\u3001\u518D\u8BB0\u4E00\u6761\u7EA6\u5B9A\u3002",
              "\u5224\u636E\u4E8E\u662F\u5F88\u7B80\u5355\uFF1A**\u8FD9\u4E9B\u6570\u636E\u662F\u4E0D\u662F\u63CF\u8FF0\u540C\u4E00\u6837\u4E1C\u897F\u7684\u4E0D\u540C\u65B9\u9762\uFF1F**\u662F\uFF0C\u5C31\u7528\u8BB0\u5F55\uFF1B\u53EA\u662F\u78B0\u5DE7\u957F\u5EA6\u4E00\u6837\u7684\u4E24\u6279\u6570\uFF0C\u90A3\u624D\u662F\u4E24\u4E2A\u5404\u81EA\u72EC\u7ACB\u7684\u6570\u7EC4\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u80FD\u4E3A\u7ED9\u5B9A\u95EE\u9898\u9009\u62E9\u5408\u9002\u7684\u6570\u636E\u7ED3\u6784\u5E76\u8BF4\u660E\u7406\u7531\uFF08\xA710.1\u3001\xA710.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u7528\u5E73\u884C\u6570\u7EC4\u5B58\u4E00\u4E2A\u73ED\uFF0C\u6392\u5E8F\u65F6\u53EA\u4EA4\u6362\u4E86 `Marks` \u7684\u4E24\u683C\u3001\u5FD8\u4E86\u4EA4\u6362 `Names`\uFF0C\u4F1A\u600E\u6837\uFF1F",
            options: [
              {
                key: "A",
                label: "\u7F16\u8F91\u5668\u4F1A\u62E6\u4E0B\u6765",
                correct: false,
                explanation: "\u7F16\u8F91\u5668\u53EA\u770B\u5F97\u5230\u4E24\u4E2A\u5404\u81EA\u72EC\u7ACB\u7684\u6570\u7EC4\uFF0C\u770B\u4E0D\u51FA\u4F60\u5FC3\u91CC\u8BA4\u4E3A\u5B83\u4EEC\u7684\u7B2C `I` \u683C\u8BF4\u7684\u662F\u540C\u4E00\u4E2A\u4EBA\u3002"
              },
              {
                key: "B",
                label: "\u8FD0\u884C\u65F6\u4F1A\u8D8A\u754C\u505C\u4E0B\u6765",
                correct: false,
                explanation: "\u4EA4\u6362\u53EA\u5728\u5DF2\u6709\u7684\u683C\u5B50\u4E4B\u95F4\u642C\u503C\uFF0C\u4E0B\u6807\u4E00\u4E2A\u90FD\u6CA1\u8D8A\u754C\u3002\u6570\u636E\u9519\u4E86\uFF0C\u4F46\u7A0B\u5E8F\u6CA1\u51FA\u9519\u3002"
              },
              {
                key: "C",
                label: "\u6362\u6210\u8BB0\u5F55\u6570\u7EC4\u4E5F\u4E00\u6837\u4F1A\u51FA\u8FD9\u4E2A\u95EE\u9898",
                correct: false,
                explanation: "\u4E0D\u4E00\u6837\u3002\u8BB0\u5F55\u6570\u7EC4\u91CC\u59D3\u540D\u548C\u5206\u6570\u5728\u540C\u4E00\u683C\uFF0C\u4EA4\u6362\u6574\u683C\u65F6\u5B83\u4EEC\u53EA\u80FD\u4E00\u8D77\u8D70\uFF0C\u6CA1\u6709\u300C\u53EA\u6362\u4E86\u4E00\u534A\u300D\u8FD9\u79CD\u5199\u6CD5\u3002"
              },
              {
                key: "D",
                label: "\u7A0B\u5E8F\u7167\u5E38\u8DD1\u5B8C\uFF0C\u4F46\u59D3\u540D\u548C\u5206\u6570\u5BF9\u4E0D\u4E0A\u4E86",
                correct: true,
                explanation: "\u5BF9\u3002\u4E24\u4E2A\u6570\u7EC4\u5404\u81EA\u90FD\u662F\u5408\u6CD5\u7684\uFF0C\u4E0B\u6807\u4E5F\u90FD\u5728\u8303\u56F4\u91CC\uFF0C\u6CA1\u6709\u4EFB\u4F55\u4E00\u6B65\u51FA\u9519\u2014\u2014\u9519\u7684\u53EA\u662F\u90A3\u53E5\u6CA1\u5199\u8FDB\u7A0B\u5E8F\u7684\u7EA6\u5B9A\u3002"
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
        title: "\u6210\u7EE9\u6392\u884C\u699C",
        statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165 5 \u4E2A\u5B66\u751F\u7684\u59D3\u540D\u548C\u6210\u7EE9\uFF0C\u6309\u6210\u7EE9**\u4ECE\u9AD8\u5230\u4F4E**\u6392\u597D\uFF0C\u518D\u4E00\u884C\u4E00\u4E2A\u663E\u793A\u51FA\u6765\u3002\u6210\u7EE9\u76F8\u540C\u7684\u4E24\u4E2A\u4EBA\uFF0C\u5148\u8BFB\u8FDB\u6765\u7684\u6392\u5728\u524D\u9762\u3002",
        ioSpec: {
          input: [
            "\u5341\u884C\uFF0C\u4E00\u4E2A\u4EBA\u4E24\u884C\uFF1A\u5148\u59D3\u540D\uFF08`STRING`\uFF09\uFF0C\u518D\u6210\u7EE9\uFF08`INTEGER`\uFF09\uFF0C\u4E94\u4E2A\u4EBA\u4F9D\u6B21\u8BFB\u5B8C\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
            "\u59D3\u540D\u524D\u662F `Enter a name`\uFF0C\u6210\u7EE9\u524D\u662F `Enter a mark`"
          ].join("\n"),
          output: ["\u4E94\u884C\uFF0C\u6BCF\u884C\u4E00\u4E2A\u4EBA\uFF0C\u5199\u6210\uFF1A", "`<\u59D3\u540D> <\u5206\u6570>`", "\u59D3\u540D\u548C\u5206\u6570\u4E4B\u95F4\u4E00\u4E2A\u7A7A\u683C\uFF0C\u6210\u7EE9\u4ECE\u9AD8\u5230\u4F4E\u3002"].join("\n")
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
          "\u6392\u5E8F\u7528\u7B2C 10 \u7AE0\u7684\u5192\u6CE1\u6392\u5E8F\uFF0C\u53EA\u662F\u6BD4\u8F83\u7684\u65F6\u5019\u8981\u53D6 `.Mark`\uFF0C\u800C\u4E14\u65B9\u5411\u548C\u4E4B\u524D\u76F8\u53CD\u3002",
          "\u4EA4\u6362\u7684\u662F**\u6574\u6761\u8BB0\u5F55**\uFF0C\u4E0D\u662F\u5355\u4E2A\u5B57\u6BB5\u2014\u2014\u4E34\u65F6\u53D8\u91CF\u7684\u7C7B\u578B\u5C31\u5199\u6210\u90A3\u79CD\u8BB0\u5F55\u7C7B\u578B\u3002",
          "\u6210\u7EE9\u76F8\u540C\u5C31\u4E0D\u8981\u4EA4\u6362\uFF0C\u8FD9\u6837\u5148\u8BFB\u8FDB\u6765\u7684\u90A3\u4E2A\u81EA\u7136\u4F1A\u7559\u5728\u524D\u9762\u3002"
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
          "DECLARE I : INTEGER",
          "DECLARE J : INTEGER",
          "FOR I \u2190 1 TO 5",
          '   OUTPUT "Enter a name"',
          "   INPUT Form[I].Name",
          '   OUTPUT "Enter a mark"',
          "   INPUT Form[I].Mark",
          "NEXT I",
          "FOR I \u2190 1 TO 4",
          "   FOR J \u2190 1 TO 5 - I",
          "      IF Form[J].Mark < Form[J + 1].Mark THEN",
          "         Temp \u2190 Form[J]",
          "         Form[J] \u2190 Form[J + 1]",
          "         Form[J + 1] \u2190 Temp",
          "      ENDIF",
          "   NEXT J",
          "NEXT I",
          "FOR I \u2190 1 TO 5",
          '   OUTPUT Form[I].Name, " ", Form[I].Mark',
          "NEXT I"
        ].join("\n"),
        tests: [
          { id: "t1", kind: "normal", inputs: ["Gil", "61", "Hal", "72", "Ivy", "58", "Jon", "66", "Kay", "49"], caseHint: "\u4E94\u4E2A\u4EBA\u5206\u6570\u5404\u4E0D\u76F8\u540C\uFF0C\u8BFB\u8FDB\u6765\u7684\u987A\u5E8F\u662F\u4E71\u7684\u3002" },
          { id: "t2", kind: "boundary", inputs: ["Gil", "90", "Hal", "80", "Ivy", "70", "Jon", "60", "Kay", "50"], caseHint: "\u8BFB\u8FDB\u6765\u7684\u65F6\u5019\u5DF2\u7ECF\u662F\u4ECE\u9AD8\u5230\u4F4E\u4E86\u3002" },
          { id: "t3", kind: "boundary", inputs: ["Gil", "50", "Hal", "60", "Ivy", "70", "Jon", "80", "Kay", "90"], caseHint: "\u8BFB\u8FDB\u6765\u7684\u65F6\u5019\u6B63\u597D\u5B8C\u5168\u5012\u8FC7\u6765\u3002" },
          { id: "t4", kind: "normal", inputs: ["Gil", "70", "Hal", "70", "Ivy", "70", "Jon", "70", "Kay", "70"], caseHint: "\u6240\u6709\u4EBA\u5206\u6570\u5B8C\u5168\u76F8\u540C\uFF0C\u8C01\u90FD\u4E0D\u8BE5\u88AB\u6362\u5230\u522B\u4EBA\u524D\u9762\u53BB\u3002" },
          { id: "t5", kind: "extreme", inputs: ["Gil", "99999", "Hal", "-99999", "Ivy", "0", "Jon", "-99999", "Kay", "99999"], caseHint: "\u6DF7\u7740\u6781\u5927\u548C\u6781\u5C0F\u7684\u5206\u6570\uFF0C\u800C\u4E14\u4E24\u5934\u90FD\u6709\u5E76\u5217\u7684\u3002" }
        ]
      }
    ]
  };

  // packages/teaching-content/src/chapter-12.ts
  var AFTER_CHAPTER_11 = [
    "io.output",
    "io.input",
    "decl.variable",
    "misc.comment",
    "type.string",
    "literal.string",
    "type.integer",
    "type.real",
    "type.char",
    "type.boolean",
    "type.date",
    "literal.integer",
    "literal.real",
    "literal.char",
    "literal.boolean",
    "literal.date",
    "assign.simple",
    "decl.constant",
    "op.arithmetic",
    "op.div",
    "op.mod",
    "op.relational",
    "op.and",
    "op.or",
    "op.not",
    "select.if",
    "select.if-else",
    "select.nested-if",
    "select.case",
    "select.case-range",
    "select.case-otherwise",
    "loop.for",
    "loop.for-step",
    "loop.while",
    "loop.repeat",
    "loop.nested",
    "builtin.length",
    "builtin.mid",
    "builtin.right",
    "builtin.ucase",
    "builtin.lcase",
    "op.concat",
    "builtin.int",
    "builtin.rand",
    "decl.array-1d",
    "array.index",
    "decl.array-2d",
    "array.index-2d",
    "decl.record-type",
    "record.field-access"
  ];
  var AFTER_12_1 = [...AFTER_CHAPTER_11, "routine.procedure", "routine.call"];
  var AFTER_12_3 = [...AFTER_12_1, "param.byval"];
  var AFTER_12_5 = [...AFTER_12_3, "param.byref"];
  var chapter12 = {
    id: 12,
    title: "\u8FC7\u7A0B",
    level: "AS",
    syllabus: ["\xA711.3"],
    prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    sections: [
      {
        id: "12.1",
        title: "\u5206\u89E3\uFF1A\u628A\u4E00\u6BB5\u7A0B\u5E8F\u62C6\u6210\u51E0\u4EF6\u4E8B",
        syllabus: ["\xA711.3"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_12_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u5230\u8FD9\u91CC\u4E3A\u6B62\u5199\u7684\u90FD\u662F\u4E00\u6574\u6BB5\u7A0B\u5E8F\uFF0C\u4ECE\u7B2C\u4E00\u884C\u8BFB\u5230\u6700\u540E\u4E00\u884C\u3002\u7A0B\u5E8F\u4E00\u957F\uFF0C\u8FD9\u79CD\u5199\u6CD5\u5F00\u59CB\u96BE\u53D7\uFF1A\u540C\u4E00\u4EF6\u4E8B\u8981\u505A\u4E09\u904D\u5C31\u5F97\u628A\u90A3\u51E0\u884C\u6284\u4E09\u904D\uFF0C\u4EE5\u540E\u6539\u4E00\u5904\u8FD8\u5F97\u8BB0\u7740\u53E6\u5916\u4E24\u5904\u4E5F\u8981\u6539\u3002",
              "\u529E\u6CD5\u662F**\u5206\u89E3\uFF08decomposition\uFF09**\uFF1A\u628A\u300C\u505A\u4E00\u4EF6\u4E8B\u300D\u7684\u90A3\u51E0\u884C\u5355\u72EC\u62FF\u51FA\u6765\uFF0C\u8D77\u4E2A\u540D\u5B57\uFF1B\u9700\u8981\u7684\u65F6\u5019\u558A\u4E00\u58F0\u540D\u5B57\u5C31\u884C\u3002\u4F2A\u4EE3\u7801\u91CC\u8FD9\u6837\u4E00\u6BB5\u88AB\u8D77\u4E86\u540D\u5B57\u7684\u4EE3\u7801\u53EB\u4E00\u4E2A**\u8FC7\u7A0B\uFF08procedure\uFF09**\u3002",
              "\u4EC0\u4E48\u65F6\u5019\u8BE5\u62BD\u51FA\u4E00\u4E2A\u8FC7\u7A0B\uFF1F\u4E24\u4E2A\u4FE1\u53F7\uFF1A**\u540C\u4E00\u6BB5\u4EE3\u7801\u51FA\u73B0\u4E86\u7B2C\u4E8C\u904D**\uFF0C\u6216\u8005**\u4F60\u5F97\u5148\u7ED9\u8FD9\u51E0\u884C\u8D77\u4E2A\u540D\u5B57\u624D\u8BF4\u5F97\u6E05\u5B83\u5728\u5E72\u561B**\u3002\u7B2C\u4E8C\u4E2A\u4FE1\u53F7\u5E38\u5E38\u6BD4\u7B2C\u4E00\u4E2A\u91CD\u8981\u2014\u2014\u540D\u5B57\u672C\u8EAB\u5C31\u662F\u89E3\u91CA\u3002",
              "\u62C6\u5B8C\u4E4B\u540E\u4E3B\u7A0B\u5E8F\u53D8\u6210\u4E00\u5F20\u76EE\u5F55\uFF1A\u5148\u5E72\u8FD9\u4E2A\u3001\u518D\u5E72\u90A3\u4E2A\uFF0C\u7EC6\u8282\u5404\u81EA\u6536\u5728\u81EA\u5DF1\u7684\u540D\u5B57\u5E95\u4E0B\u3002\u8FD9\u79CD\u5199\u6CD5\u53EB**\u6A21\u5757\u5316\uFF08modularity\uFF09**\uFF0C\u597D\u5904\u4E0D\u662F\u7A0B\u5E8F\u53D8\u77ED\uFF0C\u800C\u662F**\u6BCF\u6B21\u53EA\u9700\u8981\u770B\u4E00\u5C0F\u5757**\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u7406\u89E3\u5206\u89E3\u4E0E\u6A21\u5757\u5316\u7684\u610F\u4E49\uFF0C\u5E76\u80FD\u5199\u51FA\u548C\u4F7F\u7528\u8FC7\u7A0B\uFF08\xA711.3\uFF09\u3002"
              }
            ]
          },
          {
            kind: "comparison",
            title: "\u540C\u4E00\u4EFD\u8F93\u51FA\uFF0C\u6284\u4E09\u904D\u8FD8\u662F\u8D77\u4E2A\u540D\u5B57",
            intro: "\u4E00\u5F20\u62A5\u8868\uFF0C\u4E09\u5904\u90FD\u8981\u753B\u4E00\u6761\u5206\u9694\u7EBF\u3002",
            panes: [
              {
                label: "\u81EA\u7136\u8BED\u8A00",
                language: "natural",
                code: ["\u663E\u793A\u6807\u9898\u3002", "\u753B\u4E00\u6761\u5206\u9694\u7EBF\u3002", "\u663E\u793A\u603B\u8BA1\u3002", "\u753B\u4E00\u6761\u5206\u9694\u7EBF\u3002", "\u663E\u793A\u7ED3\u675F\u8BED\u3002", "\u753B\u4E00\u6761\u5206\u9694\u7EBF\u3002"].join("\n"),
                note: "\u300C\u753B\u4E00\u6761\u5206\u9694\u7EBF\u300D\u8FD9\u53E5\u8BDD\u8BF4\u4E86\u4E09\u904D\uFF0C\u4F46\u5B83\u662F\u540C\u4E00\u4EF6\u4E8B\u2014\u2014\u8BF4\u7684\u4EBA\u4E0D\u4F1A\u628A\u90A3\u6761\u7EBF\u7684\u6837\u5B50\u91CD\u590D\u63CF\u8FF0\u4E09\u6B21\u3002"
              },
              {
                label: "\u6284\u4E09\u904D",
                language: "pseudocode",
                code: [
                  'OUTPUT "Report"',
                  'OUTPUT "----------"',
                  'OUTPUT "Total: 42"',
                  'OUTPUT "----------"',
                  'OUTPUT "Done"',
                  'OUTPUT "----------"'
                ].join("\n"),
                note: "\u8DD1\u8D77\u6765\u5B8C\u5168\u6B63\u786E\u3002\u4F46\u7EBF\u8981\u6539\u957F\u4E00\u683C\uFF0C\u5C31\u5F97\u627E\u9F50\u4E09\u5904\u90FD\u6539\uFF1B\u6F0F\u4E00\u5904\uFF0C\u4E09\u6761\u7EBF\u91CC\u6709\u4E00\u6761\u4E0D\u4E00\u6837\u957F\u3002"
              },
              {
                label: "\u62BD\u6210\u4E00\u4E2A\u8FC7\u7A0B",
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
                note: "\u7EBF\u957F\u4EC0\u4E48\u6837\u53EA\u5199\u5728\u4E00\u4E2A\u5730\u65B9\u3002\u8981\u6539\u5C31\u6539\u90A3\u4E00\u5904\uFF0C\u4E09\u6761\u7EBF\u4E00\u8D77\u53D8\u2014\u2014\u800C\u4E14\u4E3B\u7A0B\u5E8F\u8BFB\u8D77\u6765\u662F\u300C\u6807\u9898\u3001\u7EBF\u3001\u603B\u8BA1\u3001\u7EBF\u3001\u7ED3\u675F\u8BED\u3001\u7EBF\u300D\u3002"
              },
              {
                label: "Python",
                language: "python",
                code: ["def show_line():", '    print("-" * 10)', "", 'print("Report")', "show_line()"].join("\n"),
                note: "Python \u7684 `def` \u5C31\u662F\u540C\u4E00\u4EF6\u4E8B\uFF1A\u7ED9\u4E00\u6BB5\u4EE3\u7801\u8D77\u540D\u5B57\uFF0C\u7528\u7684\u65F6\u5019\u5199\u540D\u5B57\u3002\u533A\u522B\u53EA\u5728\u4F2A\u4EE3\u7801\u8C03\u7528\u8FC7\u7A0B\u65F6\u8981\u5199 `CALL`\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0B\u9762\u54EA\u4E00\u79CD\u60C5\u51B5**\u6700**\u8BE5\u62BD\u51FA\u4E00\u4E2A\u8FC7\u7A0B\uFF1F",
            options: [
              {
                key: "A",
                label: "\u4E24\u6BB5\u957F\u5F97\u5F88\u50CF\u3001\u4F46\u505A\u7684\u4E8B\u5B8C\u5168\u4E0D\u540C\u7684\u4EE3\u7801",
                correct: false,
                explanation: "\u50CF\u4E0D\u7B49\u4E8E\u662F\u540C\u4E00\u4EF6\u4E8B\u3002\u786C\u62BD\u6210\u4E00\u4E2A\u8FC7\u7A0B\uFF0C\u4EE5\u540E\u5176\u4E2D\u4E00\u8FB9\u8981\u6539\uFF0C\u5C31\u5F97\u52A0\u53C2\u6570\u3001\u52A0\u5206\u652F\uFF0C\u8D8A\u7F20\u8D8A\u4E71\u3002"
              },
              {
                key: "B",
                label: "\u53EA\u7528\u4E86\u4E00\u6B21\u3001\u4F46\u5199\u8D77\u6765\u5F88\u957F\u7684\u4E00\u6BB5\u8BA1\u7B97",
                correct: false,
                explanation: "\u53EA\u7528\u4E00\u6B21\u4E5F\u53EF\u4EE5\u62BD\u2014\u2014\u5982\u679C\u62BD\u51FA\u6765\u80FD\u7ED9\u5B83\u8D77\u4E2A\u8BF4\u5F97\u6E05\u7684\u540D\u5B57\u3002\u4F46\u5149\u662F\u300C\u957F\u300D\u672C\u8EAB\u4E0D\u662F\u7406\u7531\uFF0C\u5207\u5F00\u800C\u4E0D\u89E3\u91CA\u53EA\u662F\u628A\u5B83\u632A\u4E86\u4E2A\u5730\u65B9\u3002"
              },
              {
                key: "C",
                label: "\u540C\u4E00\u6BB5\u4E03\u884C\u7684\u68C0\u67E5\uFF0C\u5728\u7A0B\u5E8F\u91CC\u4E09\u4E2A\u5730\u65B9\u539F\u6837\u51FA\u73B0",
                correct: true,
                explanation: "\u5BF9\u3002\u91CD\u590D\u51FA\u73B0\u662F\u6700\u786C\u7684\u4FE1\u53F7\uFF1A\u62BD\u51FA\u6765\u4E4B\u540E\u8981\u6539\u53EA\u6539\u4E00\u5904\uFF0C\u4E5F\u4E0D\u4F1A\u51FA\u73B0\u300C\u4E09\u5904\u91CC\u6709\u4E00\u5904\u5FD8\u4E86\u6539\u300D\u3002"
              },
              {
                key: "D",
                label: "\u4E00\u53E5 `OUTPUT`",
                correct: false,
                explanation: "\u62BD\u51FA\u6765\u4E4B\u540E\u8BFB\u4EE3\u7801\u7684\u4EBA\u8FD8\u5F97\u8DF3\u8FC7\u53BB\u770B\u4E00\u773C\u624D\u77E5\u9053\u5B83\u663E\u793A\u4EC0\u4E48\uFF0C\u53CD\u800C\u6BD4\u539F\u5730\u5199\u7740\u66F4\u96BE\u8BFB\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "12.2",
        title: "`PROCEDURE ... ENDPROCEDURE` \u4E0E `CALL`",
        syllabus: ["\xA711.3"],
        estimatedMinutes: 11,
        taughtFeatures: AFTER_12_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u5B9A\u4E49\u4E00\u4E2A\u8FC7\u7A0B\u5199\u5728 `PROCEDURE` \u548C `ENDPROCEDURE` \u4E4B\u95F4\uFF0C\u540D\u5B57\u540E\u9762**\u8DDF\u4E00\u5BF9\u62EC\u53F7**\u2014\u2014\u54EA\u6015\u4E00\u4E2A\u53C2\u6570\u90FD\u6CA1\u6709\uFF0C\u8FD9\u5BF9\u62EC\u53F7\u4E5F\u4E0D\u80FD\u7701\u3002\u4E2D\u95F4\u7684\u51E0\u884C\u7167\u5E38\u7F29\u8FDB\u4E09\u683C\u3002",
              "\u5B9A\u4E49\u53EA\u662F\u300C\u8BF4\u6E05\u8FD9\u4EF6\u4E8B\u600E\u4E48\u505A\u300D\uFF0C\u5B83\u81EA\u5DF1\u4E0D\u4F1A\u53D1\u751F\u3002\u8981\u5B83\u771F\u7684\u53D1\u751F\uFF0C\u5F97**\u8C03\u7528**\u5B83\uFF1A`CALL ShowLine()`\uFF0C\u540C\u6837\u5E26\u62EC\u53F7\u3002",
              "`CALL` \u8FD9\u4E2A\u8BCD\u4E0D\u80FD\u7701\u3002\u4F2A\u4EE3\u7801\u91CC**\u8FC7\u7A0B\u53EA\u80FD\u7528 `CALL` \u8C03\u7528**\u2014\u2014\u5149\u5199 `ShowLine()` \u662F\u4E0D\u884C\u7684\u3002\uFF08\u7B2C 13 \u7AE0\u7684\u51FD\u6570\u6B63\u597D\u76F8\u53CD\uFF0C\u90A3\u79CD\u624D\u4E0D\u5199 `CALL`\u3002\uFF09",
              "\u8FC7\u7A0B\u5B9A\u4E49\u653E\u5728\u54EA\u513F\u90FD\u80FD\u8BA4\uFF0C\u653E\u5728\u8C03\u7528\u540E\u9762\u4E5F\u884C\uFF1B\u4F46\u4E60\u60EF\u4E0A\u628A\u8FC7\u7A0B\u5199\u5728\u524D\u9762\u3001\u4E3B\u7A0B\u5E8F\u653E\u5728\u6700\u540E\uFF0C\u8BFB\u8D77\u6765\u662F\u300C\u5148\u8BA4\u8BC6\u8FD9\u51E0\u4EF6\u5DE5\u5177\uFF0C\u518D\u770B\u5B83\u4EEC\u600E\u4E48\u88AB\u7528\u300D\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8FC7\u7A0B\u5199\u6210 `PROCEDURE <\u540D\u5B57>()` \u2026 `ENDPROCEDURE`\uFF0C\u4EE5\u72EC\u7ACB\u8BED\u53E5 `CALL <\u540D\u5B57>()` \u8C03\u7528\uFF08G\xA78.1\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u4E00\u4E2A\u6CA1\u6709\u53C2\u6570\u7684\u8FC7\u7A0B",
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
              { fromLine: 1, toLine: 3, text: "\u5B9A\u4E49\u3002\u8FD9\u4E09\u884C\u8DD1\u8D77\u6765\u4EC0\u4E48\u4E5F\u4E0D\u663E\u793A\u2014\u2014\u5B83\u53EA\u662F\u628A\u300C\u753B\u4E00\u6761\u7EBF\u300D\u8FD9\u4EF6\u4E8B\u8BB0\u4E0B\u6765\u3002" },
              { fromLine: 4, toLine: 7, text: "\u4E3B\u7A0B\u5E8F\u3002\u771F\u6B63\u6309\u987A\u5E8F\u6267\u884C\u7684\u662F\u8FD9\u56DB\u884C\uFF1B`CALL` \u4E00\u51FA\u73B0\uFF0C\u5C31\u8DF3\u8FDB\u53BB\u628A\u8FC7\u7A0B\u91CC\u7684\u5185\u5BB9\u505A\u4E00\u904D\u518D\u56DE\u6765\u3002" },
              { fromLine: 5, toLine: 5, text: "`CALL` \u548C\u62EC\u53F7\u90FD\u4E0D\u80FD\u5C11\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["Report", "----------", "Total: 42", "----------"]
            }
          },
          {
            kind: "counterExample",
            title: "\u4E24\u79CD\u5C11\u5199\u4E86\u4E1C\u897F\u7684\u5199\u6CD5",
            cases: [
              {
                title: "\u5B9A\u4E49\u65F6\u6F0F\u4E86\u62EC\u53F7",
                code: ["PROCEDURE Greet", '   OUTPUT "Hello"', "ENDPROCEDURE", "CALL Greet()"].join("\n"),
                note: "\u6CA1\u6709\u53C2\u6570\u4E5F\u8981\u5199 `()`\u3002\u62EC\u53F7\u662F\u8FC7\u7A0B\u540D\u5B57\u7684\u4E00\u90E8\u5206\uFF0C\u4E0D\u662F\u300C\u6709\u53C2\u6570\u624D\u52A0\u300D\u7684\u88C5\u9970\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "PROC-001", line: 1, text: "\u8FC7\u7A0B\u540D\u540E\u9762\u8981\u8DDF\u4E00\u5BF9\u62EC\u53F7\uFF0C\u6CA1\u6709\u53C2\u6570\u4E5F\u8981\u5199\u3002" }
                ]
              },
              {
                title: "\u8C03\u7528\u65F6\u6F0F\u4E86 `CALL`",
                code: ["PROCEDURE Greet()", '   OUTPUT "Hello"', "ENDPROCEDURE", "Greet()"].join("\n"),
                note: "\u5149\u5199\u540D\u5B57\u52A0\u62EC\u53F7\uFF0C\u5728\u4F2A\u4EE3\u7801\u91CC\u4E0D\u7B97\u8C03\u7528\u8FC7\u7A0B\u3002\u8FD9\u79CD\u5199\u6CD5\u5728\u522B\u7684\u8BED\u8A00\u91CC\u5F88\u5E38\u89C1\uFF0C\u6240\u4EE5\u683C\u5916\u5BB9\u6613\u5E26\u8FDB\u6765\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "PROC-001", line: 4, text: "\u8C03\u7528\u8FC7\u7A0B\u8981\u5199\u6210 `CALL \u540D\u5B57()`\u3002" }
                ]
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0A\u9762\u90A3\u6BB5\u793A\u4F8B\uFF0C\u628A\u4E24\u53E5 `CALL ShowLine()` \u90FD\u5220\u6389\uFF0C\u5C4F\u5E55\u4E0A\u4F1A\u770B\u5230\u4EC0\u4E48\uFF1F",
            options: [
              {
                key: "A",
                label: "`Report` \u548C `Total: 42`\uFF0C\u6CA1\u6709\u7EBF",
                correct: true,
                explanation: "\u5BF9\u3002`PROCEDURE` \u90A3\u4E09\u884C\u53EA\u662F\u5B9A\u4E49\uFF0C\u4E0D\u5199 `CALL` \u5C31\u4E00\u6B21\u90FD\u4E0D\u6267\u884C\u3002\u5B9A\u4E49\u548C\u53D1\u751F\u662F\u4E24\u56DE\u4E8B\u3002"
              },
              {
                key: "B",
                label: "\u4E24\u6761\u7EBF\uFF0C\u4F46\u6CA1\u6709\u522B\u7684",
                correct: false,
                explanation: "\u53CD\u4E86\u3002\u5B9A\u4E49\u91CC\u7684 `OUTPUT` \u4E0D\u4F1A\u81EA\u5DF1\u6267\u884C\uFF0C\u5012\u662F\u4E3B\u7A0B\u5E8F\u90A3\u4E24\u53E5\u4E00\u5B9A\u4F1A\u6267\u884C\u3002"
              },
              {
                key: "C",
                label: "\u548C\u539F\u6765\u4E00\u6837",
                correct: false,
                explanation: "\u5982\u679C\u4E00\u6837\uFF0C\u90A3 `CALL` \u5C31\u6CA1\u6709\u5B58\u5728\u7684\u5FC5\u8981\u4E86\u3002\u8FC7\u7A0B\u8981\u88AB\u8C03\u7528\u624D\u4F1A\u53D1\u751F\u3002"
              },
              {
                key: "D",
                label: "\u7F16\u8F91\u5668\u4F1A\u56E0\u4E3A\u8FC7\u7A0B\u6CA1\u88AB\u7528\u5230\u800C\u62E6\u4E0B\u6765",
                correct: false,
                explanation: "\u5B9A\u4E49\u4E86\u4E0D\u7528\u4E0D\u662F\u9519\u8BEF\u3002\u5199\u597D\u4E00\u4E2A\u8FC7\u7A0B\u6682\u65F6\u8FD8\u6CA1\u8C03\u7528\uFF0C\u662F\u5F88\u6B63\u5E38\u7684\u4E2D\u95F4\u72B6\u6001\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "12.3",
        title: "\u53C2\u6570\u4E0E\u5B9E\u53C2",
        syllabus: ["\xA711.3"],
        estimatedMinutes: 11,
        taughtFeatures: AFTER_12_3,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E0A\u9762\u90A3\u4E2A `ShowLine` \u6BCF\u6B21\u753B\u7684\u7EBF\u4E00\u6837\u957F\u3002\u8981\u8BA9\u5B83\u6BCF\u6B21\u4E0D\u4E00\u6837\uFF0C\u5F97\u5728\u62EC\u53F7\u91CC\u7559\u4E2A\u53E3\u5B50\u628A\u503C\u9012\u8FDB\u53BB\u2014\u2014\u8FD9\u4E2A\u53E3\u5B50\u53EB**\u53C2\u6570\uFF08parameter\uFF09**\uFF0C\u5199\u6CD5\u548C `DECLARE` \u4E00\u6837\uFF1A\u540D\u5B57\u3001\u5192\u53F7\u3001\u7C7B\u578B\u3002",
              "\u8C03\u7528\u65F6\u62EC\u53F7\u91CC\u771F\u6B63\u7ED9\u8FDB\u53BB\u7684\u90A3\u4E2A\u503C\u53EB**\u5B9E\u53C2\uFF08argument\uFF09**\u3002\u8003\u7EB2\u628A\u8FD9\u4E24\u4E2A\u8BCD\u5206\u5F97\u5F88\u6E05\u695A\uFF1A**\u53C2\u6570\u662F\u5B9A\u4E49\u91CC\u7684\u90A3\u4E2A\u540D\u5B57\uFF0C\u5B9E\u53C2\u662F\u8C03\u7528\u65F6\u7684\u90A3\u4E2A\u503C**\u3002",
              "\u53C2\u6570\u5728\u8FC7\u7A0B\u4F53\u91CC**\u5C31\u662F\u4E00\u4E2A\u5DF2\u7ECF\u6709\u503C\u7684\u53D8\u91CF**\uFF0C\u4E0D\u7528\u518D `DECLARE`\uFF1B\u5B83\u7684\u503C\u6765\u81EA\u8FD9\u4E00\u6B21\u8C03\u7528\u7ED9\u7684\u5B9E\u53C2\u3002\u540C\u4E00\u4E2A\u8FC7\u7A0B\u88AB\u8C03\u7528\u4E24\u6B21\uFF0C\u53C2\u6570\u5C31\u5148\u540E\u662F\u4E24\u4E2A\u4E0D\u540C\u7684\u503C\u3002",
              "\u591A\u4E2A\u53C2\u6570\u7528\u9017\u53F7\u9694\u5F00\uFF0C\u6BCF\u4E2A\u90FD\u8981\u5199\u7C7B\u578B\u3002\u5B9E\u53C2\u7684**\u4E2A\u6570\u3001\u987A\u5E8F\u3001\u7C7B\u578B**\u4E09\u6837\u90FD\u8981\u5BF9\u5F97\u4E0A\u2014\u2014\u5BF9\u4E0D\u4E0A\uFF0C\u7F16\u8F91\u5668\u5728\u8FD0\u884C\u524D\u5C31\u62E6\u4E0B\u6765\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u5B9E\u53C2\u7684\u6570\u91CF\u3001\u987A\u5E8F\u548C\u7C7B\u578B\u5FC5\u987B\u4E0E\u5F62\u53C2\u4E00\u81F4\uFF08G\xA78.1\uFF09\u3002\u8003\u7EB2\u660E\u786E\u8981\u6C42\u533A\u5206 parameter \u4E0E argument\uFF08\xA711.3\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u628A\u503C\u9012\u8FDB\u8FC7\u7A0B\u91CC",
            fileName: "Example_12_3_a.pseudocode",
            code: [
              "PROCEDURE ShowLine(Width : INTEGER)",
              "   DECLARE I : INTEGER",
              "   DECLARE Bar : STRING",
              '   Bar \u2190 ""',
              "   FOR I \u2190 1 TO Width",
              '      Bar \u2190 Bar & "-"',
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
              { fromLine: 1, toLine: 1, text: "`Width` \u662F\u53C2\u6570\u3002\u5B83\u5728\u8FC7\u7A0B\u4F53\u91CC\u5F53\u53D8\u91CF\u7528\uFF0C\u4F46\u4E0D\u9700\u8981 `DECLARE`\u2014\u2014\u62EC\u53F7\u91CC\u8FD9\u4E00\u53E5\u5DF2\u7ECF\u662F\u58F0\u660E\u4E86\u3002" },
              { fromLine: 10, toLine: 10, text: "\u4E24\u4E2A\u53C2\u6570\uFF0C\u5404\u5199\u5404\u7684\u7C7B\u578B\u3002\u9017\u53F7\u9694\u5F00\u3002" },
              { fromLine: 13, toLine: 15, text: '`6`\u3001`"Total"`\u3001`42`\u3001`3` \u90FD\u662F\u5B9E\u53C2\u3002`ShowLine` \u88AB\u8C03\u7528\u4E24\u6B21\uFF0C`Width` \u5148\u662F 6 \u518D\u662F 3\u3002' }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["------", "Total: 42", "---"]
            }
          },
          {
            kind: "counterExample",
            title: "\u4E24\u79CD\u5BF9\u4E0D\u4E0A\u7684\u8C03\u7528",
            cases: [
              {
                title: "\u5C11\u7ED9\u4E86\u4E00\u4E2A\u5B9E\u53C2",
                code: [
                  "PROCEDURE ShowRow(Label : STRING, Value : INTEGER)",
                  '   OUTPUT Label, ": ", Value',
                  "ENDPROCEDURE",
                  'CALL ShowRow("Total")'
                ].join("\n"),
                note: "\u5B9A\u4E49\u91CC\u6709\u4E24\u4E2A\u53C2\u6570\uFF0C\u8C03\u7528\u53EA\u7ED9\u4E86\u4E00\u4E2A\u3002`Value` \u6CA1\u6709\u503C\u53EF\u7528\uFF0C\u6240\u4EE5\u8FD9\u4E00\u6761\u8FD0\u884C\u524D\u5C31\u88AB\u62E6\u4F4F\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "PROC-002", line: 4, text: "\u8FD9\u4E2A\u8FC7\u7A0B\u8981\u4E24\u4E2A\u5B9E\u53C2\uFF0C\u8FD9\u91CC\u53EA\u7ED9\u4E86\u4E00\u4E2A\u3002" }
                ]
              },
              {
                title: "\u987A\u5E8F\u5F04\u53CD\u4E86",
                code: [
                  "PROCEDURE ShowRow(Label : STRING, Value : INTEGER)",
                  '   OUTPUT Label, ": ", Value',
                  "ENDPROCEDURE",
                  'CALL ShowRow(42, "Total")'
                ].join("\n"),
                note: "\u4E2A\u6570\u5BF9\u4E86\uFF0C\u4F46\u7B2C\u4E00\u4E2A\u53C2\u6570\u8981 `STRING`\u3001\u7B2C\u4E8C\u4E2A\u8981 `INTEGER`\uFF0C\u8FD9\u91CC\u6B63\u597D\u53CD\u7740\u7ED9\u3002**\u5B9E\u53C2\u662F\u6309\u4F4D\u7F6E\u5BF9\u4E0A\u53BB\u7684\uFF0C\u4E0D\u662F\u6309\u540D\u5B57\u3002**",
                expectDiagnostics: [
                  { severity: "error", ruleId: "PROC-002", line: 4, text: "\u8FD9\u4E2A\u4F4D\u7F6E\u4E0A\u7684\u5B9E\u53C2\u7C7B\u578B\u548C\u53C2\u6570\u5BF9\u4E0D\u4E0A\u3002" }
                ]
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: '`PROCEDURE ShowRow(Label : STRING, Value : INTEGER)` \u91CC\uFF0C`Label` \u548C\u8C03\u7528\u65F6\u5199\u7684 `"Total"` \u5206\u522B\u53EB\u4EC0\u4E48\uFF1F',
            options: [
              {
                key: "A",
                label: '`Label` \u662F\u53D8\u91CF\uFF0C`"Total"` \u662F\u5E38\u91CF',
                correct: false,
                explanation: '`Label` \u5728\u8FC7\u7A0B\u4F53\u91CC\u786E\u5B9E\u5F53\u53D8\u91CF\u7528\uFF0C\u4F46\u8FD9\u4E0D\u662F\u5B83\u5728\u8FD9\u91CC\u7684\u540D\u79F0\uFF1B\u800C `"Total"` \u53EA\u662F\u4E00\u4E2A\u5B57\u9762\u91CF\uFF0C\u4E0D\u662F `CONSTANT`\u3002'
              },
              {
                key: "B",
                label: "\u4E24\u4E2A\u90FD\u53EB\u53C2\u6570",
                correct: false,
                explanation: "\u8003\u7EB2\u628A\u5B83\u4EEC\u5206\u5F00\uFF1A\u5B9A\u4E49\u91CC\u7684\u540D\u5B57\u662F\u53C2\u6570\uFF0C\u8C03\u7528\u65F6\u7ED9\u7684\u503C\u53E6\u6709\u540D\u5B57\u3002\u6DF7\u7740\u8BF4\u4F1A\u5728\u8BFB\u9898\u65F6\u5403\u4E8F\u3002"
              },
              {
                key: "C",
                label: '`Label` \u662F\u5B9E\u53C2\uFF0C`"Total"` \u662F\u53C2\u6570',
                correct: false,
                explanation: "\u8BF4\u53CD\u4E86\u3002\u5B9A\u4E49\u91CC\u7684\u90A3\u4E2A\u540D\u5B57\u662F\u53C2\u6570\uFF0C\u8C03\u7528\u65F6\u9012\u8FDB\u53BB\u7684\u503C\u624D\u662F\u5B9E\u53C2\u3002"
              },
              {
                key: "D",
                label: '`Label` \u662F\u53C2\u6570\uFF0C`"Total"` \u662F\u5B9E\u53C2',
                correct: true,
                explanation: "\u5BF9\u3002\u53C2\u6570\uFF08parameter\uFF09\u662F\u5B9A\u4E49\u91CC\u7559\u7684\u53E3\u5B50\uFF0C\u5B9E\u53C2\uFF08argument\uFF09\u662F\u6BCF\u6B21\u8C03\u7528\u771F\u6B63\u585E\u8FDB\u53BB\u7684\u503C\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "12.3.1",
            title: "\u4E09\u884C\u5C0F\u6761\u5F62\u56FE",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u5B9A\u4E49\u4E00\u4E2A\u8FC7\u7A0B\uFF0C\u5B83\u63A5\u53D7\u4E00\u4E2A\u540D\u79F0\u548C\u4E00\u4E2A\u4E2A\u6570\uFF0C\u663E\u793A\u300C\u540D\u79F0 + \u7A7A\u683C + \u90A3\u4E48\u591A\u4E2A\u661F\u53F7\u300D\uFF1B\u4E3B\u7A0B\u5E8F\u8BFB\u5165\u4E09\u7EC4\u540D\u79F0\u548C\u4E2A\u6570\uFF0C\u6BCF\u8BFB\u4E00\u7EC4\u5C31\u8C03\u7528\u4E00\u6B21\u8FD9\u4E2A\u8FC7\u7A0B\u3002",
            ioSpec: {
              input: [
                "\u516D\u884C\uFF0C\u4E00\u7EC4\u4E24\u884C\uFF1A\u5148\u540D\u79F0\uFF08`STRING`\uFF09\uFF0C\u518D\u4E2A\u6570\uFF08`INTEGER`\uFF09\uFF0C\u4E09\u7EC4\u4F9D\u6B21\u8BFB\u5B8C\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
                "\u540D\u79F0\u524D\u662F `Enter a label`\uFF0C\u4E2A\u6570\u524D\u662F `Enter a count`"
              ].join("\n"),
              output: ["\u6BCF\u8BFB\u5B8C\u4E00\u7EC4\u663E\u793A\u4E00\u884C\uFF1A", "`<\u540D\u79F0> <\u90A3\u4E48\u591A\u4E2A\u661F\u53F7>`", "\u540D\u79F0\u548C\u661F\u53F7\u4E4B\u95F4\u4E00\u4E2A\u7A7A\u683C\u3002\u4E2A\u6570\u662F 0 \u65F6\u661F\u53F7\u4E00\u4E2A\u90FD\u6CA1\u6709\uFF0C\u90A3\u4E00\u884C\u5C31\u53EA\u5269\u540D\u79F0\u548C\u4E00\u4E2A\u7A7A\u683C\u3002"].join("\n")
            },
            constraints: {
              require: [
                {
                  feature: "routine.procedure",
                  reason: "\u540C\u4E00\u4EF6\u4E8B\u8981\u505A\u4E09\u904D\uFF0C\u6B63\u8BE5\u628A\u5B83\u62BD\u6210\u4E00\u4E2A\u6709\u540D\u5B57\u7684\u8FC7\u7A0B\u3002"
                },
                {
                  feature: "routine.call",
                  reason: "\u8FC7\u7A0B\u5B9A\u4E49\u4E86\u8FD8\u5F97\u8C03\u7528\u624D\u4F1A\u53D1\u751F\uFF0C\u800C\u4E14\u8C03\u7528\u8981\u5199 `CALL`\u3002"
                },
                {
                  feature: "param.byval",
                  reason: "\u6BCF\u4E00\u7EC4\u7684\u540D\u79F0\u548C\u4E2A\u6570\u90FD\u4E0D\u4E00\u6837\uFF0C\u5F97\u5F53\u53C2\u6570\u9012\u8FDB\u8FC7\u7A0B\u91CC\u3002"
                }
              ]
            },
            hints: [
              "\u8FC7\u7A0B\u8981\u4E24\u4E2A\u53C2\u6570\uFF1A\u4E00\u4E2A `STRING` \u7684\u540D\u79F0\uFF0C\u4E00\u4E2A `INTEGER` \u7684\u4E2A\u6570\u3002",
              "\u661F\u53F7\u7528\u4E00\u4E2A `STRING` \u4ECE\u7A7A\u4E32\u5F00\u59CB\u63A5\uFF0C\u5FAA\u73AF\u91CC\u6BCF\u6B21\u63A5\u4E00\u4E2A\u3002",
              "\u8BFB\u5165\u653E\u5728\u4E3B\u7A0B\u5E8F\u91CC\uFF0C\u8FC7\u7A0B\u53EA\u8D1F\u8D23\u663E\u793A\u2014\u2014\u8FD9\u6837\u8FC7\u7A0B\u624D\u7528\u5F97\u4E0A\u7B2C\u4E8C\u6B21\u3001\u7B2C\u4E09\u6B21\u3002"
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
              "   DECLARE I : INTEGER",
              "   DECLARE Bar : STRING",
              '   Bar \u2190 ""',
              "   FOR I \u2190 1 TO Count",
              '      Bar \u2190 Bar & "*"',
              "   NEXT I",
              '   OUTPUT Label, " ", Bar',
              "ENDPROCEDURE",
              "DECLARE Name : STRING",
              "DECLARE Amount : INTEGER",
              "DECLARE K : INTEGER",
              "FOR K \u2190 1 TO 3",
              '   OUTPUT "Enter a label"',
              "   INPUT Name",
              '   OUTPUT "Enter a count"',
              "   INPUT Amount",
              "   CALL ShowBar(Name, Amount)",
              "NEXT K"
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["Red", "2", "Green", "4", "Blue", "6"], caseHint: "\u4E09\u7EC4\u666E\u901A\u7684\u6570\u636E\uFF0C\u4E2A\u6570\u5404\u4E0D\u76F8\u540C\u3002" },
              { id: "t2", kind: "boundary", inputs: ["Red", "0", "Green", "1", "Blue", "2"], caseHint: "\u7B2C\u4E00\u7EC4\u7684\u4E2A\u6570\u662F\u96F6\uFF0C\u90A3\u4E00\u884C\u4E00\u4E2A\u661F\u53F7\u90FD\u4E0D\u8BE5\u6709\u3002" },
              { id: "t3", kind: "boundary", inputs: ["A", "1", "B", "1", "C", "1"], caseHint: "\u4E09\u7EC4\u7684\u4E2A\u6570\u90FD\u53EA\u6709\u4E00\u4E2A\u3002" },
              { id: "t4", kind: "normal", inputs: ["Two words", "3", "X", "2", "Y", "4"], caseHint: "\u7B2C\u4E00\u7EC4\u7684\u540D\u79F0\u91CC\u5E26\u7A7A\u683C\uFF0C\u8981\u539F\u6837\u663E\u793A\u51FA\u6765\u3002" },
              { id: "t5", kind: "extreme", inputs: ["Big", "40", "Small", "0", "Mid", "7"], caseHint: "\u4E00\u7EC4\u7684\u4E2A\u6570\u76F8\u5F53\u5927\uFF0C\u53E6\u4E00\u7EC4\u662F\u96F6\u3002" }
            ]
          }
        ]
      },
      {
        id: "12.4",
        title: "`BYVAL`\uFF1A\u8FC7\u7A0B\u6539\u7684\u662F\u526F\u672C",
        syllabus: ["\xA711.3"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_12_3,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u628A\u4E00\u4E2A\u53D8\u91CF\u5F53\u5B9E\u53C2\u9012\u8FDB\u8FC7\u7A0B\u4E4B\u540E\uFF0C\u8FC7\u7A0B\u91CC\u6539\u4E86\u5B83\uFF0C\u5916\u9762\u90A3\u4E2A\u53D8\u91CF\u4F1A\u8DDF\u7740\u53D8\u5417\uFF1F**\u9ED8\u8BA4\u4E0D\u4F1A\u3002**\u9012\u8FDB\u53BB\u7684\u662F\u503C\u7684\u4E00\u4EFD**\u526F\u672C**\uFF0C\u8FC7\u7A0B\u6539\u7684\u662F\u526F\u672C\uFF0C\u5916\u9762\u7684\u539F\u4EF6\u4E00\u52A8\u4E0D\u52A8\u3002",
              "\u8FD9\u79CD\u4F20\u9012\u65B9\u5F0F\u53EB**\u4F20\u503C\uFF08by value\uFF09**\uFF0C\u53EF\u4EE5\u5728\u53C2\u6570\u524D\u9762\u5199\u4E0A `BYVAL` \u8BF4\u660E\u767D\u3002**\u4E0D\u5199\u7684\u65F6\u5019\u9ED8\u8BA4\u5C31\u662F `BYVAL`**\uFF0C\u6240\u4EE5\u524D\u9762\u51E0\u8282\u90A3\u4E9B\u53C2\u6570\u5176\u5B9E\u90FD\u662F\u4F20\u503C\u7684\u3002",
              "\u9ED8\u8BA4\u662F\u4F20\u503C\u6709\u5B83\u7684\u9053\u7406\uFF1A\u8FC7\u7A0B\u53EA\u662F\u62FF\u8FD9\u4E2A\u503C\u6765\u7B97\u70B9\u4EC0\u4E48\uFF0C\u4E0D\u8BE5\u987A\u624B\u628A\u8C03\u7528\u8005\u7684\u53D8\u91CF\u6539\u6389\u3002**\u8C03\u7528\u4E00\u4E2A\u8FC7\u7A0B\u4E4B\u540E\uFF0C\u81EA\u5DF1\u7684\u53D8\u91CF\u8FD8\u662F\u539F\u6837**\u2014\u2014\u8FD9\u4EF6\u4E8B\u80FD\u9760\u5F97\u4F4F\uFF0C\u7A0B\u5E8F\u624D\u597D\u8BFB\u3002",
              "\u6570\u7EC4\u548C\u8BB0\u5F55\u4E5F\u4E00\u6837\uFF1A\u6574\u4E2A\u6570\u7EC4\u5F53\u5B9E\u53C2\u4F20\u8FDB\u53BB\u662F\u4E00\u4EFD\u6DF1\u62F7\u8D1D\uFF0C\u8FC7\u7A0B\u91CC\u6539\u54EA\u4E00\u683C\u90FD\u5F71\u54CD\u4E0D\u5230\u5916\u9762\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "`BYVAL` / `BYREF` \u5199\u5728\u5F62\u53C2\u524D\uFF1B\u672A\u5199\u65F6\u9ED8\u8BA4\u6309\u503C\u4F20\u9012\uFF08G\xA78.3\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u91CC\u9762\u53D8\u4E86\uFF0C\u5916\u9762\u6CA1\u53D8",
            fileName: "Example_12_4_a.pseudocode",
            code: [
              "PROCEDURE Bump(BYVAL N : INTEGER)",
              "   N \u2190 N + 100",
              '   OUTPUT "inside: ", N',
              "ENDPROCEDURE",
              "DECLARE Score : INTEGER",
              "Score \u2190 5",
              "CALL Bump(Score)",
              'OUTPUT "outside: ", Score'
            ].join("\n"),
            annotations: [
              { fromLine: 1, toLine: 1, text: "`BYVAL` \u5199\u4E0D\u5199\u90FD\u4E00\u6837\uFF0C\u8FD9\u91CC\u5199\u51FA\u6765\u662F\u4E3A\u4E86\u770B\u6E05\u695A\u3002" },
              { fromLine: 2, toLine: 3, text: "\u8FC7\u7A0B\u91CC `N` \u786E\u5B9E\u53D8\u6210\u4E86 105\u2014\u2014\u6539\u7684\u662F\u90A3\u4EFD\u526F\u672C\u3002" },
              { fromLine: 8, toLine: 8, text: "\u56DE\u5230\u4E3B\u7A0B\u5E8F\uFF0C`Score` \u8FD8\u662F 5\u3002\u8FC7\u7A0B\u78B0\u4E0D\u5230\u5B83\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["inside: 105", "outside: 5"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u628A\u4E0A\u9762\u90A3\u6BB5\u91CC\u7684 `BYVAL` \u4E09\u4E2A\u5B57\u6BCD\u5220\u6389\uFF08\u5199\u6210 `PROCEDURE Bump(N : INTEGER)`\uFF09\uFF0C\u7ED3\u679C\u4F1A\u53D8\u5417\uFF1F",
            options: [
              {
                key: "A",
                label: "\u7F16\u8F91\u5668\u4F1A\u8981\u6C42\u5FC5\u987B\u5199\u51FA `BYVAL` \u6216 `BYREF`",
                correct: false,
                explanation: "\u4E0D\u8981\u6C42\u3002\u4E24\u4E2A\u90FD\u4E0D\u5199\u662F\u5408\u6CD5\u7684\u5199\u6CD5\uFF0C\u53EA\u662F\u8FD9\u65F6\u7684\u542B\u4E49\u56FA\u5B9A\u4E3A\u4F20\u503C\u3002"
              },
              {
                key: "B",
                label: "\u4E0D\u53D8\uFF0C\u4E24\u79CD\u5199\u6CD5\u5B8C\u5168\u4E00\u6837",
                correct: true,
                explanation: "\u5BF9\u3002\u4E0D\u5199\u4F20\u9012\u65B9\u5F0F\u65F6\u9ED8\u8BA4\u5C31\u662F `BYVAL`\uFF0C\u6240\u4EE5\u8FD9\u4E24\u79CD\u5199\u6CD5\u7684\u884C\u4E3A\u4E00\u6A21\u4E00\u6837\u3002\u5199\u51FA\u6765\u53EA\u662F\u66F4\u663E\u773C\u3002"
              },
              {
                key: "C",
                label: "\u4F1A\u53D8\u6210\u4F20\u5F15\u7528\uFF0C\u5916\u9762\u7684 `Score` \u53D8\u6210 105",
                correct: false,
                explanation: "\u4F20\u5F15\u7528\u8981\u663E\u5F0F\u5199 `BYREF`\u3002\u9ED8\u8BA4\u4ECE\u6765\u4E0D\u662F\u4F20\u5F15\u7528\u2014\u2014\u4E0D\u7136\u300C\u8C03\u7528\u4E00\u4E0B\u81EA\u5DF1\u7684\u53D8\u91CF\u5C31\u88AB\u6539\u4E86\u300D\u4F1A\u9632\u4E0D\u80DC\u9632\u3002"
              },
              {
                key: "D",
                label: "\u8FC7\u7A0B\u91CC `N` \u4F1A\u53D8\u6210\u672A\u521D\u59CB\u5316",
                correct: false,
                explanation: "\u53C2\u6570\u8FDB\u8FC7\u7A0B\u65F6\u5C31\u5E26\u7740\u5B9E\u53C2\u7684\u503C\uFF0C\u4E24\u79CD\u5199\u6CD5\u90FD\u4E00\u6837\u3002\u5B83\u4ECE\u6765\u4E0D\u9700\u8981\u53E6\u5916\u8D4B\u503C\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "12.5",
        title: "`BYREF`\uFF1A\u8FC7\u7A0B\u6539\u7684\u662F\u539F\u4EF6",
        syllabus: ["\xA711.3"],
        estimatedMinutes: 10,
        taughtFeatures: AFTER_12_5,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u6709\u65F6\u5019\u4F60\u5C31\u662F\u8981\u8FC7\u7A0B\u53BB\u6539\u8C03\u7528\u8005\u7684\u53D8\u91CF\u2014\u2014\u6700\u5178\u578B\u7684\u662F\u300C\u628A\u4E24\u4E2A\u53D8\u91CF\u7684\u503C\u5BF9\u8C03\u300D\u3002\u8FD9\u65F6\u5728\u53C2\u6570\u524D\u9762\u5199 `BYREF`\uFF1A\u9012\u8FDB\u53BB\u7684\u4E0D\u518D\u662F\u526F\u672C\uFF0C\u800C\u662F**\u90A3\u4E2A\u53D8\u91CF\u672C\u8EAB**\uFF0C\u8FC7\u7A0B\u91CC\u6539\u5B83\u5C31\u662F\u6539\u5916\u9762\u7684\u539F\u4EF6\u3002",
              "\u8FD9\u79CD\u4F20\u9012\u65B9\u5F0F\u53EB**\u4F20\u5F15\u7528\uFF08by reference\uFF09**\u3002Pseudocode Guide \u7ED9\u7684\u6837\u677F\u6B63\u662F `SWAP`\uFF1A\u7B2C 10 \u7AE0\u90A3\u4E09\u53E5\u501F\u4E34\u65F6\u53D8\u91CF\u7684\u4EA4\u6362\uFF0C\u62BD\u6210\u8FC7\u7A0B\u4E4B\u540E\u5C31\u80FD\u5BF9\u4EFB\u610F\u4E24\u4E2A\u53D8\u91CF\u7528\u3002",
              "\u6709\u4E00\u6761\u5BB9\u6613\u6F0F\u7684\u89C4\u5219\uFF1A**\u8FDE\u7740\u7684\u51E0\u4E2A\u53C2\u6570\u4F20\u9012\u65B9\u5F0F\u76F8\u540C\u65F6\uFF0C\u5173\u952E\u5B57\u4E0D\u7528\u91CD\u590D\u5199**\u3002`(BYREF X : INTEGER, Y : INTEGER)` \u91CC `Y` **\u4E5F\u662F** `BYREF`\uFF0C\u4E0D\u662F\u9ED8\u8BA4\u7684\u4F20\u503C\u3002",
              "`BYREF` \u7684\u5B9E\u53C2\u5FC5\u987B\u662F\u4E2A**\u80FD\u88AB\u6539\u7684\u4E1C\u897F**\u2014\u2014\u53D8\u91CF\u3001\u6570\u7EC4\u7684\u4E00\u683C\u3001\u8BB0\u5F55\u7684\u4E00\u4E2A\u5B57\u6BB5\u90FD\u884C\uFF0C\u4F46\u5199\u4E2A\u5B57\u9762\u91CF\u4E0D\u884C\uFF1A`CALL Swap(1, 2)` \u6CA1\u6709\u610F\u4E49\uFF0C`1` \u6CA1\u6709\u5730\u65B9\u53EF\u4EE5\u88AB\u6539\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "`BYREF` \u5199\u5728\u5F62\u53C2\u524D\uFF1B\u8FDE\u7EED\u76F8\u540C\u4F20\u9012\u65B9\u5F0F\u7684\u53C2\u6570\u53EF\u4EE5\u7701\u7565\u91CD\u590D\u7684\u5173\u952E\u5B57\uFF08G\xA78.3\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u628A\u4E24\u4E2A\u53D8\u91CF\u5BF9\u8C03",
            fileName: "Example_12_5_a.pseudocode",
            code: [
              "PROCEDURE Swap(BYREF A : INTEGER, BYREF B : INTEGER)",
              "   DECLARE Temp : INTEGER",
              "   Temp \u2190 A",
              "   A \u2190 B",
              "   B \u2190 Temp",
              "ENDPROCEDURE",
              "DECLARE P : INTEGER",
              "DECLARE Q : INTEGER",
              "P \u2190 1",
              "Q \u2190 2",
              'OUTPUT "before: ", P, " ", Q',
              "CALL Swap(P, Q)",
              'OUTPUT "after: ", P, " ", Q'
            ].join("\n"),
            annotations: [
              { fromLine: 1, toLine: 1, text: "\u4E24\u4E2A\u90FD\u5199\u4E86 `BYREF`\u3002\u53EA\u5199\u5728\u7B2C\u4E00\u4E2A\u524D\u9762\u4E5F\u662F\u540C\u6837\u7684\u610F\u601D\u2014\u2014\u7B2C\u4E8C\u4E2A\u4F1A\u8DDF\u7740\u7B2C\u4E00\u4E2A\u3002" },
              { fromLine: 2, toLine: 5, text: "\u548C\u7B2C 10 \u7AE0\u90A3\u4E09\u53E5\u4EA4\u6362\u4E00\u6A21\u4E00\u6837\uFF0C\u53EA\u662F\u73B0\u5728\u5B83\u6709\u4E86\u540D\u5B57\uFF0C\u5BF9\u54EA\u4E24\u4E2A\u53D8\u91CF\u90FD\u80FD\u7528\u3002" },
              { fromLine: 12, toLine: 13, text: "\u8C03\u7528\u4E4B\u540E\u4E3B\u7A0B\u5E8F\u91CC\u7684 `P` \u548C `Q` \u771F\u7684\u6362\u4E86\u3002\u8FD9\u6B63\u662F `BYVAL` \u505A\u4E0D\u5230\u7684\u4E8B\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["before: 1 2", "after: 2 1"]
            }
          },
          {
            kind: "counterExample",
            title: "`BYREF` \u6536\u4E0D\u4E0B\u4E00\u4E2A\u5B57\u9762\u91CF",
            cases: [
              {
                code: ["PROCEDURE Bump(BYREF N : INTEGER)", "   N \u2190 N + 1", "ENDPROCEDURE", "CALL Bump(5)"].join("\n"),
                note: "`BYREF` \u7684\u610F\u601D\u662F\u300C\u8FC7\u7A0B\u4F1A\u53BB\u6539\u4F60\u7ED9\u7684\u8FD9\u4E2A\u4E1C\u897F\u300D\u3002\u7ED9\u4E00\u4E2A `5` \u5C31\u6CA1\u6CD5\u5F80\u4E0B\u8BF4\u4E86\u2014\u2014`5` \u4E0D\u662F\u4E00\u4E2A\u80FD\u88AB\u6539\u7684\u4F4D\u7F6E\u3002\u6362\u6210\u4E00\u4E2A\u53D8\u91CF\u5C31\u884C\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "PARAM-001", line: 4, text: "`BYREF` \u7684\u5B9E\u53C2\u5F97\u662F\u4E00\u4E2A\u80FD\u88AB\u6539\u7684\u53D8\u91CF\uFF0C\u4E0D\u80FD\u662F\u5199\u6B7B\u7684\u503C\u3002" }
                ]
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`PROCEDURE Swap(BYREF A : INTEGER, B : INTEGER)`\u2014\u2014\u53EA\u5728\u7B2C\u4E00\u4E2A\u53C2\u6570\u524D\u5199\u4E86 `BYREF`\u3002`B` \u662F\u600E\u4E48\u4F20\u7684\uFF1F",
            options: [
              {
                key: "A",
                label: "\u8981\u770B\u8C03\u7528\u65F6\u7ED9\u7684\u662F\u53D8\u91CF\u8FD8\u662F\u5B57\u9762\u91CF",
                correct: false,
                explanation: "\u4F20\u9012\u65B9\u5F0F\u5728\u5B9A\u4E49\u91CC\u5C31\u5B9A\u6B7B\u4E86\uFF0C\u548C\u8C03\u7528\u65F6\u7ED9\u4EC0\u4E48\u65E0\u5173\uFF1B\u53CD\u8FC7\u6765\u662F\u5B9A\u4E49\u91CC\u7684 `BYREF` \u8981\u6C42\u8C03\u7528\u65F6\u5FC5\u987B\u7ED9\u4E00\u4E2A\u80FD\u6539\u7684\u4E1C\u897F\u3002"
              },
              {
                key: "B",
                label: "\u4E5F\u662F\u4F20\u5F15\u7528",
                correct: true,
                explanation: "\u5BF9\u3002\u8FDE\u7740\u7684\u53C2\u6570\u4F20\u9012\u65B9\u5F0F\u76F8\u540C\u65F6\u5173\u952E\u5B57\u4E0D\u7528\u91CD\u590D\u5199\uFF0C\u6240\u4EE5 `B` \u8DDF\u7740 `A` \u4E00\u8D77\u662F `BYREF`\u3002\u8FD9\u6BB5 `Swap` \u7167\u6837\u80FD\u7528\u3002"
              },
              {
                key: "C",
                label: "\u4F20\u503C\uFF0C\u56E0\u4E3A\u5B83\u524D\u9762\u6CA1\u5199 `BYREF`",
                correct: false,
                explanation: "\u300C\u6CA1\u5199\u5C31\u9ED8\u8BA4\u4F20\u503C\u300D\u53EA\u5728**\u524D\u9762\u4E5F\u6CA1\u6709\u522B\u7684\u4F20\u9012\u65B9\u5F0F\u5173\u952E\u5B57**\u65F6\u6210\u7ACB\u3002\u8FD9\u91CC `BYREF` \u5DF2\u7ECF\u5199\u5728\u540C\u4E00\u4E32\u53C2\u6570\u7684\u524D\u9762\u4E86\u3002"
              },
              {
                key: "D",
                label: "\u5199\u6CD5\u4E0D\u5408\u6CD5\uFF0C\u6BCF\u4E2A\u53C2\u6570\u90FD\u5FC5\u987B\u5199",
                correct: false,
                explanation: "\u5408\u6CD5\u3002Pseudocode Guide \u81EA\u5DF1\u7684 `SWAP` \u6837\u677F\u5C31\u662F\u8FD9\u4E48\u5199\u7684\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "12.5.1",
            title: "\u5C0F\u7684\u6392\u524D\u9762",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u5B9A\u4E49\u4E00\u4E2A\u8FC7\u7A0B\uFF0C\u5B83\u63A5\u53D7\u4E24\u4E2A\u6574\u6570\u53D8\u91CF\uFF0C\u5982\u679C\u524D\u4E00\u4E2A\u6BD4\u540E\u4E00\u4E2A\u5927\u5C31\u628A\u5B83\u4EEC\u5BF9\u8C03\uFF1B\u4E3B\u7A0B\u5E8F\u8BFB\u5165\u4E24\u4E2A\u6570\uFF0C\u8C03\u7528\u8FD9\u4E2A\u8FC7\u7A0B\uFF0C\u518D\u628A\u5B83\u4EEC\u663E\u793A\u51FA\u6765\u3002",
            ioSpec: {
              input: ["\u4E24\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a number`"].join("\n"),
              output: ["\u4E00\u884C\uFF0C\u4E24\u4E2A\u6570\u4E2D\u95F4\u4E00\u4E2A\u7A7A\u683C\uFF0C\u5C0F\u7684\u5728\u524D\uFF1A", "`<\u5C0F\u7684> <\u5927\u7684>`"].join("\n")
            },
            constraints: {
              require: [
                {
                  feature: "param.byref",
                  reason: "\u8FC7\u7A0B\u8981\u771F\u7684\u6539\u6389\u4E3B\u7A0B\u5E8F\u91CC\u90A3\u4E24\u4E2A\u53D8\u91CF\uFF0C\u4F20\u526F\u672C\u6539\u4E0D\u7740\u3002"
                },
                {
                  feature: "routine.procedure",
                  reason: "\u9898\u76EE\u8981\u6C42\u628A\u300C\u5FC5\u8981\u65F6\u5BF9\u8C03\u300D\u8FD9\u4EF6\u4E8B\u5199\u6210\u4E00\u4E2A\u6709\u540D\u5B57\u7684\u8FC7\u7A0B\u3002"
                },
                {
                  feature: "select.if",
                  reason: "\u5DF2\u7ECF\u662F\u5C0F\u7684\u5728\u524D\u65F6\u4E0D\u8BE5\u52A8\uFF0C\u53EA\u6709\u524D\u4E00\u4E2A\u66F4\u5927\u624D\u4EA4\u6362\u3002"
                }
              ]
            },
            hints: [
              "\u4E24\u4E2A\u53C2\u6570\u90FD\u8981 `BYREF`\u2014\u2014\u53EA\u5199\u5728\u7B2C\u4E00\u4E2A\u524D\u9762\u4E5F\u7B97\u6570\u3002",
              "\u4EA4\u6362\u8FD8\u662F\u90A3\u4E09\u53E5\uFF0C\u501F\u4E00\u4E2A\u4E34\u65F6\u53D8\u91CF\uFF1B\u8FD9\u4E2A\u4E34\u65F6\u53D8\u91CF\u5728\u8FC7\u7A0B\u91CC `DECLARE` \u5C31\u884C\u3002",
              "\u663E\u793A\u653E\u5728\u4E3B\u7A0B\u5E8F\u91CC\uFF0C\u8FC7\u7A0B\u53EA\u7BA1\u8C03\u6574\u987A\u5E8F\u3002"
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
              "      Temp \u2190 A",
              "      A \u2190 B",
              "      B \u2190 Temp",
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
              { id: "t1", kind: "normal", inputs: ["8", "3"], caseHint: "\u524D\u4E00\u4E2A\u6BD4\u540E\u4E00\u4E2A\u5927\uFF0C\u9700\u8981\u5BF9\u8C03\u3002" },
              { id: "t2", kind: "normal", inputs: ["3", "8"], caseHint: "\u672C\u6765\u5C31\u662F\u5C0F\u7684\u5728\u524D\uFF0C\u4E0D\u8BE5\u52A8\u5B83\u3002" },
              { id: "t3", kind: "boundary", inputs: ["7", "7"], caseHint: "\u4E24\u4E2A\u6570\u4E00\u6837\u5927\u3002" },
              { id: "t4", kind: "boundary", inputs: ["0", "-1"], caseHint: "\u4E00\u4E2A\u662F\u96F6\uFF0C\u53E6\u4E00\u4E2A\u662F\u8D1F\u6570\u3002" },
              { id: "t5", kind: "extreme", inputs: ["99999", "-99999"], caseHint: "\u4E00\u4E2A\u6781\u5927\u4E00\u4E2A\u6781\u5C0F\uFF0C\u800C\u4E14\u987A\u5E8F\u662F\u53CD\u7684\u3002" }
            ]
          }
        ]
      },
      {
        id: "12.6",
        title: "\u5C40\u90E8\u53D8\u91CF\u4E0E\u4F5C\u7528\u57DF",
        syllabus: ["\xA711.3"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_12_5,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u5728\u8FC7\u7A0B\u91CC `DECLARE` \u51FA\u6765\u7684\u53D8\u91CF\u53EB**\u5C40\u90E8\u53D8\u91CF\uFF08local variable\uFF09**\uFF1A\u5B83\u53EA\u5728\u8FD9\u4E2A\u8FC7\u7A0B\u91CC\u5B58\u5728\uFF0C\u8FC7\u7A0B\u4E00\u7ED3\u675F\u5C31\u6CA1\u4E86\uFF0C\u5916\u9762\u770B\u4E0D\u89C1\u4E5F\u7528\u4E0D\u4E86\u3002\u4E00\u4E2A\u540D\u5B57\u80FD\u5728\u54EA\u4E9B\u5730\u65B9\u7528\uFF0C\u8FD9\u4EF6\u4E8B\u53EB\u5B83\u7684**\u4F5C\u7528\u57DF\uFF08scope\uFF09**\u3002",
              "\u5C40\u90E8\u53D8\u91CF\u6B63\u662F\u8FC7\u7A0B\u80FD\u72EC\u7ACB\u6210\u4E00\u4EF6\u4E8B\u7684\u539F\u56E0\u3002`Swap` \u91CC\u90A3\u4E2A `Temp` \u53EA\u5C5E\u4E8E `Swap`\uFF1B\u522B\u7684\u8FC7\u7A0B\u91CC\u4E5F\u53EB `Temp` \u6CA1\u5173\u7CFB\uFF0C\u5B83\u4EEC\u4E92\u4E0D\u76F8\u5E72\u2014\u2014\u5C31\u50CF\u7B2C 11 \u7AE0\u91CC\u8BB0\u5F55\u7684\u5B57\u6BB5\u540D\u548C\u666E\u901A\u53D8\u91CF\u540D\u4E92\u4E0D\u76F8\u5E72\u4E00\u6837\u3002",
              "\u5728\u6240\u6709\u8FC7\u7A0B\u5916\u9762 `DECLARE` \u7684\u53D8\u91CF\u53EB**\u5168\u5C40\u53D8\u91CF\uFF08global variable\uFF09**\uFF0C\u8FC7\u7A0B\u91CC\u80FD\u8BFB\u4E5F\u80FD\u5199\u3002\u4F46**\u80FD\u6539\u4E0D\u7B49\u4E8E\u8BE5\u6539**\uFF1A\u8FC7\u7A0B\u5077\u5077\u6539\u5168\u5C40\u53D8\u91CF\uFF0C\u8C03\u7528\u5B83\u7684\u4EBA\u4ECE\u8C03\u7528\u90A3\u4E00\u884C\u770B\u4E0D\u51FA\u6765\u3002\u8981\u6539\u5C31\u628A\u5B83\u5F53 `BYREF` \u53C2\u6570\u660E\u5199\u5728\u62EC\u53F7\u91CC\u3002",
              "\u5982\u679C\u8FC7\u7A0B\u91CC `DECLARE` \u4E86\u4E00\u4E2A\u548C\u5168\u5C40\u53D8\u91CF\u540C\u540D\u7684\u53D8\u91CF\uFF0C\u90A3\u8FC7\u7A0B\u91CC\u7528\u7684\u5C31\u662F\u81EA\u5DF1\u90A3\u4E2A\uFF0C\u5916\u9762\u90A3\u4E2A\u4E0D\u53D7\u5F71\u54CD\u2014\u2014\u540D\u5B57\u4E00\u6837\uFF0C\u662F\u4E24\u4E2A\u4E0D\u540C\u7684\u4F4D\u7F6E\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u7406\u89E3\u5C40\u90E8\u53D8\u91CF\u4E0E\u5168\u5C40\u53D8\u91CF\u7684\u533A\u522B\uFF0C\u4EE5\u53CA\u4F5C\u7528\u57DF\u7684\u542B\u4E49\uFF08\xA711.3\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u540C\u540D\uFF0C\u4F46\u662F\u4E24\u4E2A\u4E0D\u540C\u7684\u4F4D\u7F6E",
            fileName: "Example_12_6_a.pseudocode",
            code: [
              "DECLARE Total : INTEGER",
              "PROCEDURE Report()",
              "   DECLARE Total : INTEGER",
              "   Total \u2190 100",
              '   OUTPUT "inside: ", Total',
              "ENDPROCEDURE",
              "Total \u2190 7",
              "CALL Report()",
              'OUTPUT "outside: ", Total'
            ].join("\n"),
            annotations: [
              { fromLine: 1, toLine: 1, text: "\u5168\u5C40\u53D8\u91CF\uFF0C\u4E3B\u7A0B\u5E8F\u548C\u6240\u6709\u8FC7\u7A0B\u90FD\u770B\u5F97\u5230\u3002" },
              { fromLine: 3, toLine: 4, text: "\u8FC7\u7A0B\u91CC\u53C8\u58F0\u660E\u4E86\u4E00\u4E2A\u540C\u540D\u7684\u3002\u4ECE\u8FD9\u4E00\u884C\u8D77\uFF0C\u8FC7\u7A0B\u5185\u90E8\u7684 `Total` \u6307\u7684\u90FD\u662F\u8FD9\u4E2A\u5C40\u90E8\u7684\u3002" },
              { fromLine: 9, toLine: 9, text: "\u8FC7\u7A0B\u7ED3\u675F\u3001\u5C40\u90E8\u7684\u90A3\u4E2A\u6D88\u5931\uFF0C\u4E3B\u7A0B\u5E8F\u91CC\u7684 `Total` \u4ECD\u7136\u662F 7\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["inside: 100", "outside: 7"]
            }
          },
          {
            kind: "counterExample",
            title: "\u5728\u5916\u9762\u7528\u8FC7\u7A0B\u91CC\u7684\u53D8\u91CF",
            cases: [
              {
                code: [
                  "PROCEDURE Report()",
                  "   DECLARE Count : INTEGER",
                  "   Count \u2190 3",
                  "ENDPROCEDURE",
                  "CALL Report()",
                  "OUTPUT Count"
                ].join("\n"),
                note: "`Count` \u662F `Report` \u7684\u5C40\u90E8\u53D8\u91CF\uFF0C\u8FC7\u7A0B\u4E00\u7ED3\u675F\u5C31\u4E0D\u5B58\u5728\u4E86\u3002\u4E3B\u7A0B\u5E8F\u8FD9\u4E00\u884C\u627E\u4E0D\u5230\u8FD9\u4E2A\u540D\u5B57\u2014\u2014**\u4E0D\u662F\u5B83\u7684\u503C\u4E0D\u5BF9\uFF0C\u662F\u8FD9\u4E2A\u540D\u5B57\u5728\u8FD9\u91CC\u6839\u672C\u6CA1\u6709\u610F\u4E49**\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "DECL-002", line: 6, text: "\u8FD9\u4E2A\u540D\u5B57\u662F\u5728\u8FC7\u7A0B\u91CC\u58F0\u660E\u7684\uFF0C\u4E3B\u7A0B\u5E8F\u770B\u4E0D\u5230\u5B83\u3002" }
                ]
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E00\u4E2A\u8FC7\u7A0B\u9700\u8981\u628A\u7B97\u51FA\u6765\u7684\u7ED3\u679C\u4EA4\u56DE\u7ED9\u4E3B\u7A0B\u5E8F\u3002\u4E0B\u9762\u54EA\u79CD\u505A\u6CD5**\u6700**\u5408\u9002\uFF1F",
            options: [
              {
                key: "A",
                label: "\u5728\u8FC7\u7A0B\u91CC `OUTPUT` \u51FA\u6765",
                correct: false,
                explanation: "\u90A3\u662F\u663E\u793A\u7ED9\u4EBA\u770B\uFF0C\u4E0D\u662F\u4EA4\u56DE\u7ED9\u7A0B\u5E8F\u3002\u4E3B\u7A0B\u5E8F\u62FF\u4E0D\u5230\u8FD9\u4E2A\u503C\uFF0C\u6CA1\u6CD5\u63A5\u7740\u62FF\u5B83\u53BB\u7B97\u3002"
              },
              {
                key: "B",
                label: "\u5728\u8FC7\u7A0B\u91CC\u76F4\u63A5\u6539\u4E00\u4E2A\u5168\u5C40\u53D8\u91CF",
                correct: false,
                explanation: "\u505A\u5F97\u5230\uFF0C\u4F46\u8C03\u7528\u90A3\u4E00\u884C\u770B\u4E0D\u51FA\u5B83\u4F1A\u6539\u4EC0\u4E48\uFF0C\u8BFB\u4EE3\u7801\u7684\u4EBA\u5F97\u7FFB\u8FDB\u8FC7\u7A0B\u91CC\u624D\u77E5\u9053\u3002\u80FD\u7528\u53C2\u6570\u8BF4\u6E05\u7684\u4E8B\u4E0D\u8BE5\u85CF\u8D77\u6765\u3002"
              },
              {
                key: "C",
                label: "\u628A\u7ED3\u679C\u5199\u6210\u8FC7\u7A0B\u91CC\u7684\u5C40\u90E8\u53D8\u91CF\uFF0C\u4E3B\u7A0B\u5E8F\u53BB\u8BFB\u5B83",
                correct: false,
                explanation: "\u8BFB\u4E0D\u5230\u3002\u5C40\u90E8\u53D8\u91CF\u968F\u8FC7\u7A0B\u4E00\u8D77\u6D88\u5931\uFF0C\u8FD9\u4E2A\u540D\u5B57\u5728\u4E3B\u7A0B\u5E8F\u91CC\u6CA1\u6709\u610F\u4E49\u3002"
              },
              {
                key: "D",
                label: "\u628A\u7528\u6765\u88C5\u7ED3\u679C\u7684\u53D8\u91CF\u5F53 `BYREF` \u53C2\u6570\u4F20\u8FDB\u53BB",
                correct: true,
                explanation: "\u5BF9\u3002\u8C03\u7528\u90A3\u4E00\u884C\u5C31\u5199\u7740\u300C\u8FD9\u4E2A\u53D8\u91CF\u4F1A\u88AB\u5B83\u6539\u300D\uFF0C\u770B\u4E00\u773C\u8C03\u7528\u5C31\u77E5\u9053\u5F71\u54CD\u5230\u8C01\u3002\uFF08\u4E0B\u4E00\u7AE0\u7684\u51FD\u6570\u8FD8\u6709\u66F4\u76F4\u63A5\u7684\u529E\u6CD5\u3002\uFF09"
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
        title: "\u4E09\u4E2A\u6570\u6392\u597D\u5E8F",
        statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u7528\u8FC7\u7A0B\u628A\u4E09\u4E2A\u6574\u6570\u4ECE\u5C0F\u5230\u5927\u6392\u597D\u518D\u663E\u793A\u51FA\u6765\u3002\u81F3\u5C11\u5199\u51FA\u4E09\u4E2A\u8FC7\u7A0B\u2014\u2014\u4E00\u4E2A\u8D1F\u8D23\u8BFB\u4E00\u4E2A\u6570\uFF0C\u4E00\u4E2A\u8D1F\u8D23\u628A\u4E24\u4E2A\u53D8\u91CF\u6309\u5927\u5C0F\u6446\u6B63\uFF0C\u4E00\u4E2A\u8D1F\u8D23\u628A\u4E09\u4E2A\u6570\u663E\u793A\u51FA\u6765\u3002\u4E3B\u7A0B\u5E8F\u53EA\u8D1F\u8D23\u6309\u987A\u5E8F\u8C03\u7528\u5B83\u4EEC\u3002",
        ioSpec: {
          input: ["\u4E09\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a number`"].join("\n"),
          output: "\u4E09\u884C\uFF0C\u6BCF\u884C\u4E00\u4E2A\u6574\u6570\uFF0C\u4ECE\u5C0F\u5230\u5927\u3002"
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
          "\u300C\u8BFB\u4E00\u4E2A\u6570\u300D\u548C\u300C\u6446\u6B63\u4E24\u4E2A\u53D8\u91CF\u300D\u90FD\u8981\u6539\u8C03\u7528\u8005\u7684\u53D8\u91CF\uFF0C\u6240\u4EE5\u8D70 `BYREF`\uFF1B\u300C\u663E\u793A\u4E09\u4E2A\u6570\u300D\u53EA\u662F\u62FF\u6765\u770B\uFF0C`BYVAL` \u5C31\u591F\u3002",
          "\u4E09\u4E2A\u6570\u6392\u5E8F\u4E0D\u7528\u65B0\u5199\u7B97\u6CD5\uFF1A\u628A\u300C\u6446\u6B63\u4E24\u4E2A\u300D\u8C03\u7528\u4E09\u6B21\u5C31\u884C\u2014\u2014\u5148\u7B2C\u4E00\u4E8C\u4E2A\uFF0C\u518D\u7B2C\u4E8C\u4E09\u4E2A\uFF0C\u6700\u540E\u518D\u7B2C\u4E00\u4E8C\u4E2A\u3002",
          "\u4E3B\u7A0B\u5E8F\u5E94\u8BE5\u53EA\u5269\u4E0B\u51E0\u884C `DECLARE` \u548C\u4E00\u4E32 `CALL`\u3002"
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
          "      Temp \u2190 A",
          "      A \u2190 B",
          "      B \u2190 Temp",
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
          { id: "t1", kind: "normal", inputs: ["5", "1", "3"], caseHint: "\u4E09\u4E2A\u5404\u4E0D\u76F8\u540C\u7684\u6570\uFF0C\u987A\u5E8F\u662F\u4E71\u7684\u3002" },
          { id: "t2", kind: "boundary", inputs: ["1", "2", "3"], caseHint: "\u8BFB\u8FDB\u6765\u7684\u65F6\u5019\u672C\u6765\u5C31\u5DF2\u7ECF\u6392\u597D\u4E86\u3002" },
          { id: "t3", kind: "boundary", inputs: ["3", "2", "1"], caseHint: "\u8BFB\u8FDB\u6765\u7684\u65F6\u5019\u6B63\u597D\u5B8C\u5168\u5012\u8FC7\u6765\u3002" },
          { id: "t4", kind: "normal", inputs: ["6", "6", "6"], caseHint: "\u4E09\u4E2A\u6570\u5B8C\u5168\u4E00\u6837\uFF0C\u4E00\u6B21\u4E5F\u4E0D\u9700\u8981\u5BF9\u8C03\u3002" },
          { id: "t5", kind: "extreme", inputs: ["99999", "-99999", "0"], caseHint: "\u6DF7\u7740\u6781\u5927\u548C\u6781\u5C0F\u7684\u503C\u3002" }
        ]
      }
    ]
  };

  // packages/teaching-content/src/chapter-13.ts
  var AFTER_CHAPTER_12 = [
    "io.output",
    "io.input",
    "decl.variable",
    "misc.comment",
    "type.string",
    "literal.string",
    "type.integer",
    "type.real",
    "type.char",
    "type.boolean",
    "type.date",
    "literal.integer",
    "literal.real",
    "literal.char",
    "literal.boolean",
    "literal.date",
    "assign.simple",
    "decl.constant",
    "op.arithmetic",
    "op.div",
    "op.mod",
    "op.relational",
    "op.and",
    "op.or",
    "op.not",
    "select.if",
    "select.if-else",
    "select.nested-if",
    "select.case",
    "select.case-range",
    "select.case-otherwise",
    "loop.for",
    "loop.for-step",
    "loop.while",
    "loop.repeat",
    "loop.nested",
    "builtin.length",
    "builtin.mid",
    "builtin.right",
    "builtin.ucase",
    "builtin.lcase",
    "op.concat",
    "builtin.int",
    "builtin.rand",
    "decl.array-1d",
    "array.index",
    "decl.array-2d",
    "array.index-2d",
    "decl.record-type",
    "record.field-access",
    "routine.procedure",
    "routine.call",
    "param.byval",
    "param.byref"
  ];
  var AFTER_13_1 = [...AFTER_CHAPTER_12, "routine.function", "routine.return", "expr.function-call"];
  var chapter13 = {
    id: 13,
    title: "\u51FD\u6570",
    level: "AS",
    syllabus: ["\xA711.3"],
    prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    sections: [
      {
        id: "13.1",
        title: "\u8FC7\u7A0B\u8FD8\u662F\u51FD\u6570",
        syllabus: ["\xA711.3"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_13_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E0A\u4E00\u7AE0\u672B\u5C3E\u7559\u4E86\u4E2A\u95EE\u9898\uFF1A\u8FC7\u7A0B\u7B97\u51FA\u6765\u7684\u7ED3\u679C\u600E\u4E48\u4EA4\u56DE\u7ED9\u4E3B\u7A0B\u5E8F\uFF1F`BYREF` \u53C2\u6570\u505A\u5F97\u5230\uFF0C\u4F46\u7ED5\u2014\u2014\u4F60\u5F97\u5148\u58F0\u660E\u4E00\u4E2A\u53D8\u91CF\u5F53\u5BB9\u5668\uFF0C\u518D\u628A\u5B83\u9012\u8FDB\u53BB\u7B49\u7740\u88AB\u586B\u3002",
              "\u4E3A\u300C\u7B97\u51FA\u4E00\u4E2A\u503C\u4EA4\u56DE\u53BB\u300D\u51C6\u5907\u7684\u5199\u6CD5\u662F**\u51FD\u6570\uFF08function\uFF09**\u3002\u5B83\u548C\u8FC7\u7A0B\u7684\u533A\u522B\u53EA\u6709\u4E00\u6761\uFF1A**\u8FC7\u7A0B\u505A\u4E00\u4EF6\u4E8B\uFF0C\u51FD\u6570\u7B97\u51FA\u4E00\u4E2A\u503C**\u3002\u8003\u7EB2\u7684\u8BF4\u6CD5\u66F4\u51C6\u786E\uFF1A\u51FD\u6570\u8C03\u7528\u5B8C\u6210\u4E4B\u540E\uFF0C**\u8FD9\u4E2A\u8C03\u7528\u672C\u8EAB\u5C31\u53D8\u6210\u4E86\u90A3\u4E2A\u8FD4\u56DE\u503C**\u3002",
              "\u6240\u4EE5\u51FD\u6570\u4E0D\u662F\u7528 `CALL` \u5355\u5360\u4E00\u884C\u7684\uFF0C\u800C\u662F\u5199\u5728**\u9700\u8981\u4E00\u4E2A\u503C\u7684\u5730\u65B9**\uFF1A\u8D4B\u503C\u53F7\u53F3\u8FB9\u3001`OUTPUT` \u91CC\u3001`IF` \u7684\u6761\u4EF6\u91CC\u3001\u751A\u81F3\u53E6\u4E00\u4E2A\u51FD\u6570\u7684\u5B9E\u53C2\u4F4D\u7F6E\u4E0A\u3002`LENGTH`\u3001`MID` \u8FD9\u4E9B\u5185\u7F6E\u7684\u4E1C\u897F\u4E00\u76F4\u5C31\u662F\u8FD9\u4E48\u7528\u7684\u2014\u2014\u73B0\u5728\u4F60\u80FD\u81EA\u5DF1\u5199\u4E86\u3002",
              "\u5224\u636E\u5F88\u76F4\u63A5\uFF1A\u8FD9\u6BB5\u4EE3\u7801\u7684\u7ED3\u679C\u662F\u300C\u5C4F\u5E55\u4E0A\u591A\u4E86\u70B9\u4E1C\u897F\u300D\u6216\u8005\u300C\u67D0\u4E2A\u53D8\u91CF\u88AB\u6539\u4E86\u300D\uFF0C\u5199\u8FC7\u7A0B\uFF1B\u7ED3\u679C\u662F\u300C\u7B97\u51FA\u4E00\u4E2A\u503C\uFF0C\u62FF\u53BB\u63A5\u7740\u7528\u300D\uFF0C\u5199\u51FD\u6570\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u533A\u5206\u8FC7\u7A0B\u4E0E\u51FD\u6570\uFF0C\u5E76\u7406\u89E3\u300C\u8FD4\u56DE\u503C\u53D6\u4EE3\u4E86\u8FD9\u6B21\u8C03\u7528\u300D\uFF08\xA711.3\uFF09\u3002"
              }
            ]
          },
          {
            kind: "comparison",
            title: "\u540C\u4E00\u4EF6\u4E8B\uFF0C\u4EA4\u56DE\u7ED3\u679C\u7684\u4E24\u79CD\u529E\u6CD5",
            intro: "\u628A\u4E00\u4E2A\u6570\u4E58\u4EE5\u4E8C\uFF0C\u518D\u628A\u7ED3\u679C\u663E\u793A\u51FA\u6765\u3002",
            panes: [
              {
                label: "\u81EA\u7136\u8BED\u8A00",
                language: "natural",
                code: ["\u300C\u628A 5 \u4E58\u4EE5\u4E8C\u300D\u8FD9\u53E5\u8BDD\u672C\u8EAB\u5C31\u4EE3\u8868\u4E00\u4E2A\u6570\u3002", "\u6240\u4EE5\u53EF\u4EE5\u76F4\u63A5\u8BF4\uFF1A\u663E\u793A\u300C\u628A 5 \u4E58\u4EE5\u4E8C\u300D\u3002", "\u800C\u4E0D\u5FC5\u5148\u8BF4\uFF1A\u7B97\u51FA\u6765\u653E\u7740\uFF0C\u5F85\u4F1A\u513F\u6211\u53BB\u62FF\u3002"].join("\n"),
                note: "\u8BF4\u8BDD\u7684\u65F6\u5019\u6CA1\u4EBA\u4F1A\u5148\u58F0\u660E\u4E00\u4E2A\u5BB9\u5668\u3002\u300C\u628A 5 \u4E58\u4EE5\u4E8C\u300D\u5C31\u662F\u4E00\u4E2A\u503C\uFF0C\u53EF\u4EE5\u76F4\u63A5\u653E\u8FDB\u53E5\u5B50\u91CC\u7528\u3002"
              },
              {
                label: "\u7528\u8FC7\u7A0B",
                language: "pseudocode",
                code: [
                  "PROCEDURE Double(BYVAL N : INTEGER, BYREF Result : INTEGER)",
                  "   Result \u2190 N * 2",
                  "ENDPROCEDURE",
                  "DECLARE Answer : INTEGER",
                  "CALL Double(5, Answer)",
                  "OUTPUT Answer"
                ].join("\n"),
                note: "\u80FD\u8DD1\uFF0C\u4F46\u4E3A\u4E86\u63A5\u4F4F\u4E00\u4E2A\u503C\u5F97\u5148\u9020\u4E00\u4E2A\u53D8\u91CF\uFF0C\u8FD8\u5F97\u591A\u5360\u4E00\u884C\u8C03\u7528\u3002\u7ED3\u679C\u548C\u300C5 \u4E58\u4EE5\u4E8C\u300D\u4E4B\u95F4\u9694\u7740\u4E24\u6B65\u3002"
              },
              {
                label: "\u7528\u51FD\u6570",
                language: "pseudocode",
                code: [
                  "FUNCTION Double(N : INTEGER) RETURNS INTEGER",
                  "   RETURN N * 2",
                  "ENDFUNCTION",
                  "OUTPUT Double(5)"
                ].join("\n"),
                note: "`Double(5)` \u6574\u4E2A\u5C31\u662F\u4E00\u4E2A\u503C\uFF0C\u76F4\u63A5\u653E\u8FDB `OUTPUT` \u91CC\u3002\u4E0D\u7528\u5BB9\u5668\uFF0C\u4E5F\u4E0D\u7528\u5355\u72EC\u4E00\u884C\u8C03\u7528\u3002"
              },
              {
                label: "Python",
                language: "python",
                code: ["def double(n):", "    return n * 2", "", "print(double(5))"].join("\n"),
                note: "Python \u4E0D\u533A\u5206\u8FC7\u7A0B\u548C\u51FD\u6570\uFF0C\u5168\u7528 `def`\uFF1B\u4E0D\u5199 `return` \u7684\u5C31\u76F8\u5F53\u4E8E\u4F2A\u4EE3\u7801\u7684\u8FC7\u7A0B\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0B\u9762\u54EA\u4E00\u4EF6\u4E8B**\u6700**\u8BE5\u5199\u6210\u51FD\u6570\u800C\u4E0D\u662F\u8FC7\u7A0B\uFF1F",
            options: [
              {
                key: "A",
                label: "\u7B97\u51FA\u4E00\u4E2A\u5B57\u7B26\u4E32\u91CC\u6709\u51E0\u4E2A\u7A7A\u683C",
                correct: true,
                explanation: "\u5BF9\u3002\u7ED3\u679C\u662F\u4E00\u4E2A\u6570\uFF0C\u800C\u4E14\u4F60\u591A\u534A\u8981\u62FF\u5B83\u63A5\u7740\u53BB\u7B97\u6216\u8005\u53BB\u5224\u65AD\u2014\u2014\u6B63\u597D\u653E\u5728\u9700\u8981\u4E00\u4E2A\u503C\u7684\u5730\u65B9\u3002"
              },
              {
                key: "B",
                label: "\u8BFB\u5165\u7528\u6237\u8F93\u5165\u7684\u4E09\u4E2A\u6570",
                correct: false,
                explanation: "\u8981\u4EA4\u56DE\u4E09\u4E2A\u503C\uFF0C\u800C\u51FD\u6570\u53EA\u8FD8\u4E00\u4E2A\u3002\u8FD9\u79CD\u7528\u8FC7\u7A0B\u914D `BYREF` \u53C2\u6570\u66F4\u5408\u9002\u3002"
              },
              {
                key: "C",
                label: "\u628A\u4E00\u4E2A\u6570\u7EC4\u4ECE\u5C0F\u5230\u5927\u6392\u597D",
                correct: false,
                explanation: "\u5B83\u7684\u7ED3\u679C\u662F\u300C\u90A3\u4E2A\u6570\u7EC4\u88AB\u91CD\u65B0\u6446\u8FC7\u4E86\u300D\uFF0C\u4E0D\u662F\u7B97\u51FA\u4E00\u4E2A\u503C\u3002\u8FD9\u79CD\u8BE5\u5199\u6210\u8FC7\u7A0B\uFF0C\u6570\u7EC4\u8D70 `BYREF`\u3002"
              },
              {
                key: "D",
                label: "\u628A\u4E00\u5F20\u62A5\u8868\u6253\u5370\u5230\u5C4F\u5E55\u4E0A",
                correct: false,
                explanation: "\u7ED3\u679C\u662F\u5C4F\u5E55\u4E0A\u591A\u4E86\u4E1C\u897F\uFF0C\u6CA1\u6709\u503C\u8981\u4EA4\u56DE\u53BB\u3002\u5178\u578B\u7684\u8FC7\u7A0B\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "13.2",
        title: "`FUNCTION ... RETURNS ... ENDFUNCTION`",
        syllabus: ["\xA711.3"],
        estimatedMinutes: 11,
        taughtFeatures: AFTER_13_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u51FD\u6570\u7684\u5934\u90E8\u6BD4\u8FC7\u7A0B\u591A\u4E00\u622A\uFF1A`FUNCTION Double(N : INTEGER) RETURNS INTEGER`\u3002\u62EC\u53F7\u91CC\u7167\u6837\u662F\u53C2\u6570\uFF0C`RETURNS` \u540E\u9762\u5199\u7684\u662F**\u5B83\u4F1A\u8FD8\u56DE\u6765\u4EC0\u4E48\u7C7B\u578B\u7684\u503C**\u3002\u6536\u5C3E\u7528 `ENDFUNCTION`\u3002",
              "\u4EA4\u56DE\u503C\u7528 `RETURN \u503C`\u3002**`RETURN` \u4E00\u6267\u884C\uFF0C\u51FD\u6570\u5F53\u573A\u7ED3\u675F**\uFF0C\u540E\u9762\u8FD8\u6CA1\u8DD1\u7684\u884C\u4E00\u884C\u90FD\u4E0D\u4F1A\u8DD1\u2014\u2014\u8FD9\u4E00\u70B9\u548C `ENDFUNCTION` \u4E0D\u4E00\u6837\uFF1A`ENDFUNCTION` \u53EA\u662F\u5199\u6CD5\u4E0A\u7684\u6536\u5C3E\uFF0C`RETURN` \u624D\u662F\u771F\u7684\u8D70\u4EBA\u3002",
              "\u8C03\u7528\u65F6**\u4E0D\u5199 `CALL`**\uFF1A`X \u2190 Double(5)`\u3002\u5199\u4E86 `CALL` \u4F1A\u88AB\u62E6\u4E0B\u6765\u3002\u53CD\u8FC7\u6765\u4E5F\u4E00\u6837\u2014\u2014\u628A\u4E00\u4E2A\u51FD\u6570\u8C03\u7528\u5355\u72EC\u5199\u6210\u4E00\u884C\u662F\u4E0D\u884C\u7684\uFF0C\u90A3\u4E00\u884C\u6CA1\u6709\u4EBA\u63A5\u4F4F\u5B83\u8FD8\u56DE\u6765\u7684\u503C\u3002",
              '`RETURN` \u540E\u9762\u90A3\u4E2A\u503C\u7684\u7C7B\u578B\u8981\u548C `RETURNS` \u5199\u7684\u5BF9\u5F97\u4E0A\u3002\u5199\u7740 `RETURNS INTEGER` \u5374 `RETURN "twice"`\uFF0C\u8FD0\u884C\u524D\u5C31\u88AB\u62E6\u4F4F\u3002'
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u51FD\u6570\u5934\u5305\u542B `RETURNS <\u7C7B\u578B>`\uFF0C\u4EE5 `ENDFUNCTION` \u7ED3\u675F\uFF0C\u7528 `RETURN <\u503C>` \u8FD4\u56DE\u5355\u4E2A\u503C\uFF1B\u51FD\u6570\u8C03\u7528\u5FC5\u987B\u51FA\u73B0\u5728\u8868\u8FBE\u5F0F\u4E2D\uFF0C\u4E0D\u4F7F\u7528 `CALL`\uFF08G\xA78.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u4E24\u4E2A\u51FD\u6570\uFF0C\u4E09\u79CD\u7528\u6CD5",
            fileName: "Example_13_2_a.pseudocode",
            code: [
              "FUNCTION Double(N : INTEGER) RETURNS INTEGER",
              "   RETURN N * 2",
              "ENDFUNCTION",
              "FUNCTION Shout(S : STRING) RETURNS STRING",
              '   RETURN S & "!"',
              "ENDFUNCTION",
              "DECLARE X : INTEGER",
              "X \u2190 Double(5)",
              "OUTPUT X",
              "OUTPUT Double(3) + Double(4)",
              'OUTPUT Shout("hello")'
            ].join("\n"),
            annotations: [
              { fromLine: 1, toLine: 1, text: "`RETURNS INTEGER` \u8BF4\u7684\u662F\u8FD8\u56DE\u6765\u4E00\u4E2A\u6574\u6570\uFF0C\u4E0D\u662F\u53C2\u6570\u7684\u7C7B\u578B\u2014\u2014\u53C2\u6570\u7684\u7C7B\u578B\u5728\u62EC\u53F7\u91CC\u3002" },
              { fromLine: 8, toLine: 8, text: "\u653E\u5728\u8D4B\u503C\u53F7\u53F3\u8FB9\u3002`Double(5)` \u8FD9\u4E00\u6574\u5757\u5C31\u7B49\u4E8E 10\u3002" },
              { fromLine: 10, toLine: 10, text: "\u653E\u5728\u8868\u8FBE\u5F0F\u91CC\uFF0C\u4E24\u4E2A\u8C03\u7528\u5404\u81EA\u53D8\u6210\u4E00\u4E2A\u6570\u518D\u76F8\u52A0\u3002\u8FD9\u662F\u8FC7\u7A0B\u505A\u4E0D\u5230\u7684\u4E8B\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["10", "14", "hello!"]
            }
          },
          {
            kind: "counterExample",
            title: "\u4E24\u79CD\u7528\u9519\u51FD\u6570\u7684\u5199\u6CD5",
            cases: [
              {
                title: "\u62FF `CALL` \u8C03\u7528\u51FD\u6570",
                code: ["FUNCTION Double(N : INTEGER) RETURNS INTEGER", "   RETURN N * 2", "ENDFUNCTION", "CALL Double(5)"].join("\n"),
                note: "`CALL` \u662F\u8FC7\u7A0B\u4E13\u7528\u7684\u3002\u800C\u4E14\u8FD9\u4E00\u884C\u5C31\u7B97\u8DD1\u5F97\u8D77\u6765\u4E5F\u6CA1\u610F\u4E49\u2014\u2014`Double(5)` \u8FD8\u56DE\u6765\u4E00\u4E2A 10\uFF0C\u8FD9\u91CC\u6CA1\u6709\u4EBA\u63A5\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "FUNC-002", line: 4, text: "\u51FD\u6570\u4E0D\u7528 `CALL`\uFF0C\u8981\u5199\u5728\u9700\u8981\u4E00\u4E2A\u503C\u7684\u5730\u65B9\u3002" }
                ]
              },
              {
                title: "\u8FD8\u56DE\u6765\u7684\u7C7B\u578B\u4E0D\u5BF9",
                code: ["FUNCTION Double(N : INTEGER) RETURNS INTEGER", '   RETURN "twice"', "ENDFUNCTION", "OUTPUT Double(5)"].join("\n"),
                note: "\u5934\u90E8\u627F\u8BFA\u8FD8\u4E00\u4E2A `INTEGER`\uFF0C`RETURN` \u5374\u7ED9\u4E86\u4E00\u6BB5\u6587\u5B57\u3002\u627F\u8BFA\u548C\u5151\u73B0\u5BF9\u4E0D\u4E0A\uFF0C\u8FD0\u884C\u524D\u5C31\u67E5\u5F97\u51FA\u6765\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "FUNC-001", line: 2, text: "\u8FD8\u56DE\u6765\u7684\u503C\u548C `RETURNS` \u5199\u7684\u7C7B\u578B\u5BF9\u4E0D\u4E0A\u3002" }
                ]
              }
            ]
          },
          {
            kind: "quiz",
            type: "fill-blank",
            prompt: "\u8865\u5168\u8FD9\u4E2A\u51FD\u6570\uFF1A\u63A5\u53D7\u4E00\u4E2A `INTEGER`\uFF0C\u8FD8\u56DE\u6765\u5B83\u7684\u5E73\u65B9\u3002",
            template: ["__1__ Square(N : INTEGER) __2__ INTEGER", "   __3__ N * N", "__4__"].join("\n"),
            blanks: [
              { index: 1, answer: "FUNCTION" },
              { index: 2, answer: "RETURNS" },
              { index: 3, answer: "RETURN" },
              { index: 4, answer: "ENDFUNCTION" }
            ],
            bank: [
              { word: "FUNCTION", explanation: "\u8D77\u5934\u7684\u5173\u952E\u5B57\uFF0C\u540E\u9762\u8DDF\u51FD\u6570\u540D\u548C\u53C2\u6570\u3002" },
              { word: "RETURNS", explanation: "\u5E26 S \u7684\u8FD9\u4E2A\u5199\u5728\u5934\u90E8\uFF0C\u540E\u9762\u8DDF\u7684\u662F\u8FD8\u56DE\u6765\u7684\u503C\u662F\u4EC0\u4E48\u7C7B\u578B\u3002" },
              { word: "RETURN", explanation: "\u4E0D\u5E26 S \u7684\u8FD9\u4E2A\u5199\u5728\u51FD\u6570\u4F53\u91CC\uFF0C\u540E\u9762\u8DDF\u771F\u6B63\u8981\u8FD8\u56DE\u53BB\u7684\u90A3\u4E2A\u503C\u3002" },
              { word: "ENDFUNCTION", explanation: "\u6536\u5C3E\u7684\u5173\u952E\u5B57\uFF0C\u548C\u8D77\u5934\u7684 `FUNCTION` \u914D\u5BF9\u3002" },
              { word: "PROCEDURE", explanation: "\u8FC7\u7A0B\u7528\u7684\u5173\u952E\u5B57\u3002\u8FC7\u7A0B\u4E0D\u8FD8\u503C\uFF0C\u8FD9\u91CC\u8981\u8FD8\u4E00\u4E2A\u5E73\u65B9\u6570\uFF0C\u6240\u4EE5\u4E0D\u662F\u5B83\u3002" },
              { word: "CALL", explanation: "\u8C03\u7528\u8FC7\u7A0B\u7528\u7684\u3002\u51FD\u6570\u65E2\u4E0D\u7528\u5B83\u8D77\u5934\uFF0C\u4E5F\u4E0D\u7528\u5B83\u8C03\u7528\u3002" }
            ]
          }
        ]
      },
      {
        id: "13.3",
        title: "\u6BCF\u6761\u8DEF\u90FD\u8981 `RETURN`",
        syllabus: ["\xA711.3"],
        estimatedMinutes: 11,
        taughtFeatures: AFTER_13_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u51FD\u6570\u5FC5\u987B**\u5728\u6BCF\u4E00\u6761\u8D70\u5F97\u5230\u7684\u8DEF\u4E0A\u90FD\u8FD8\u56DE\u4E00\u4E2A\u503C**\u3002\u5C11\u4E00\u6761\u8DEF\u6CA1\u6709 `RETURN`\uFF0C\u8C03\u7528\u7684\u5730\u65B9\u5C31\u63A5\u5230\u7A7A\u2014\u2014\u6240\u4EE5\u7F16\u8F91\u5668\u5728\u8FD0\u884C\u524D\u5C31\u67E5\u8FD9\u4EF6\u4E8B\uFF0C\u800C\u4E14\u63D0\u793A\u6307\u56DE\u51FD\u6570\u7684\u5934\u90E8\u90A3\u4E00\u884C\u3002",
              "\u6700\u5E38\u89C1\u7684\u7F3A\u53E3\u957F\u8FD9\u6837\uFF1A`IF ... THEN RETURN ... ENDIF` \u540E\u9762\u5C31\u6CA1\u4E86\u3002\u6761\u4EF6\u6210\u7ACB\u65F6\u6709\u503C\u53EF\u8FD8\uFF0C\u4E0D\u6210\u7ACB\u65F6\u51FD\u6570\u4E00\u8DEF\u8D70\u5230 `ENDFUNCTION` \u4E5F\u6CA1\u8FD8\u4EFB\u4F55\u4E1C\u897F\u3002\u8865\u6CD5\u662F\u52A0 `ELSE`\uFF0C\u6216\u8005\u5728 `ENDIF` \u540E\u9762\u518D\u5199\u4E00\u53E5 `RETURN`\u3002",
              "\u56E0\u4E3A `RETURN` \u4E00\u6267\u884C\u5C31\u8D70\u4EBA\uFF0C`IF ... THEN RETURN A ENDIF` \u540E\u9762\u76F4\u63A5\u8DDF\u4E00\u53E5 `RETURN B` \u662F\u5B8C\u5168\u6B63\u786E\u7684\uFF1A**\u80FD\u8D70\u5230 `RETURN B` \u90A3\u4E00\u884C\uFF0C\u672C\u8EAB\u5C31\u8BF4\u660E\u6761\u4EF6\u6CA1\u6210\u7ACB**\u3002\u4E0D\u9700\u8981\u518D\u5199 `ELSE`\u3002",
              "\u5FAA\u73AF\u91CC\u7684 `RETURN` \u4E5F\u4E00\u6837\uFF1A\u4E00\u65E6\u6267\u884C\uFF0C\u5FAA\u73AF\u548C\u51FD\u6570\u4E00\u8D77\u7ED3\u675F\u3002\u7B2C 10 \u7AE0\u300C\u627E\u5230\u5C31\u505C\u300D\u7684\u5199\u6CD5\uFF0C\u7528\u51FD\u6570\u5199\u5C31\u662F\u5FAA\u73AF\u91CC\u76F4\u63A5 `RETURN` \u90A3\u4E2A\u4F4D\u7F6E\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u51FD\u6570\u4EE5 `RETURN <\u503C>` \u8FD4\u56DE\u5355\u4E2A\u503C\uFF0C\u6267\u884C `RETURN` \u540E\u7ACB\u5373\u7ED3\u675F\u51FD\u6570\uFF08G\xA78.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u4E09\u6761\u8DEF\uFF0C\u4E09\u53E5 `RETURN`",
            fileName: "Example_13_3_a.pseudocode",
            code: [
              "FUNCTION Sign(N : INTEGER) RETURNS STRING",
              "   IF N > 0 THEN",
              '      RETURN "positive"',
              "   ENDIF",
              "   IF N < 0 THEN",
              '      RETURN "negative"',
              "   ENDIF",
              '   RETURN "zero"',
              "ENDFUNCTION",
              "OUTPUT Sign(5)",
              "OUTPUT Sign(-5)",
              "OUTPUT Sign(0)"
            ].join("\n"),
            annotations: [
              { fromLine: 2, toLine: 4, text: "\u6210\u7ACB\u5C31\u8D70\u4EBA\uFF0C\u4E0B\u9762\u51E0\u884C\u90FD\u4E0D\u4F1A\u8DD1\u3002" },
              { fromLine: 8, toLine: 8, text: "\u80FD\u8D70\u5230\u8FD9\u4E00\u884C\uFF0C\u8BF4\u660E\u4E0A\u9762\u4E24\u4E2A\u6761\u4EF6\u90FD\u6CA1\u6210\u7ACB\u2014\u2014\u6240\u4EE5\u8FD9\u53E5\u4E0D\u7528\u5305\u5728 `ELSE` \u91CC\u3002" },
              { fromLine: 10, toLine: 12, text: "\u4E09\u6B21\u8C03\u7528\u5404\u8D70\u4E00\u6761\u8DEF\u3002\u51FD\u6570\u88AB\u8C03\u7528\u4E09\u6B21\uFF0C`N` \u5148\u540E\u662F\u4E09\u4E2A\u4E0D\u540C\u7684\u503C\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["positive", "negative", "zero"]
            }
          },
          {
            kind: "counterExample",
            title: "\u6709\u4E00\u6761\u8DEF\u8D70\u5230\u5E95\u4E5F\u6CA1\u8FD8\u4E1C\u897F",
            cases: [
              {
                code: [
                  "FUNCTION Sign(N : INTEGER) RETURNS STRING",
                  "   IF N > 0 THEN",
                  '      RETURN "positive"',
                  "   ENDIF",
                  "ENDFUNCTION",
                  "OUTPUT Sign(0)"
                ].join("\n"),
                note: "`N` \u4E0D\u5927\u4E8E 0 \u7684\u65F6\u5019\uFF0C\u51FD\u6570\u4E00\u8DEF\u8D70\u5230 `ENDFUNCTION` \u4E5F\u6CA1\u6709 `RETURN`\u3002\u63D0\u793A\u6307\u5728\u5934\u90E8\u90A3\u4E00\u884C\u2014\u2014**\u7F3A\u53E3\u662F\u6574\u4E2A\u51FD\u6570\u7684\u4E8B\uFF0C\u4E0D\u662F\u67D0\u4E00\u884C\u7684\u4E8B**\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "FUNC-001", line: 1, text: "\u6709\u4E00\u6761\u8DEF\u8D70\u5B8C\u4E5F\u6CA1\u6709 `RETURN`\uFF0C\u8865\u4E00\u53E5\u653E\u5728 `ENDIF` \u540E\u9762\u3002" }
                ]
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: '\u4E0A\u9762\u90A3\u4E2A `Sign` \u51FD\u6570\uFF0C\u628A\u6700\u540E\u90A3\u53E5 `RETURN "zero"` \u6539\u5199\u6210 `ELSE RETURN "zero"` \u5305\u8FDB\u7B2C\u4E8C\u4E2A `IF` \u91CC\uFF0C\u4F1A\u600E\u6837\uFF1F',
            options: [
              {
                key: "A",
                label: '`N` \u7B49\u4E8E 0 \u65F6\u4F1A\u8FD8\u56DE `"negative"`',
                correct: false,
                explanation: "`0 < 0` \u4E0D\u6210\u7ACB\uFF0C\u8D70\u7684\u662F `ELSE` \u90A3\u4E00\u652F\u3002\u54EA\u4E00\u652F\u88AB\u8D70\u53D6\u51B3\u4E8E\u6761\u4EF6\u672C\u8EAB\uFF0C\u548C\u5305\u4E0D\u5305 `ELSE` \u65E0\u5173\u3002"
              },
              {
                key: "B",
                label: "\u51FD\u6570\u4F1A\u8FD8\u56DE\u4E24\u4E2A\u503C",
                correct: false,
                explanation: "\u51FD\u6570\u53EA\u8FD8\u4E00\u4E2A\u503C\u2014\u2014\u7B2C\u4E00\u53E5\u6267\u884C\u5230\u7684 `RETURN` \u4E00\u5230\uFF0C\u51FD\u6570\u5C31\u7ED3\u675F\u4E86\uFF0C\u4E0D\u5B58\u5728\u7B2C\u4E8C\u6B21\u3002"
              },
              {
                key: "C",
                label: "\u7F16\u8F91\u5668\u4F1A\u8BF4\u6709\u4E00\u6761\u8DEF\u6CA1\u6709 `RETURN`",
                correct: false,
                explanation: "\u4E0D\u4F1A\u3002\u5305\u8FDB `ELSE` \u4E4B\u540E\u4E24\u652F\u90FD\u6709 `RETURN`\uFF0C\u7B2C\u4E8C\u4E2A `IF` \u672C\u8EAB\u5C31\u628A\u6240\u6709\u60C5\u51B5\u76D6\u4F4F\u4E86\u3002"
              },
              {
                key: "D",
                label: "\u4E00\u6837\u5BF9\uFF0C\u53EA\u662F\u591A\u4E86\u4E00\u5C42\u7F29\u8FDB",
                correct: true,
                explanation: "\u5BF9\u3002\u4E24\u79CD\u5199\u6CD5\u8986\u76D6\u7684\u60C5\u51B5\u5B8C\u5168\u76F8\u540C\uFF0C\u884C\u4E3A\u4E5F\u5B8C\u5168\u76F8\u540C\uFF1B\u533A\u522B\u53EA\u5728\u8BFB\u8D77\u6765\u54EA\u79CD\u66F4\u987A\u2014\u2014\u8DEF\u6570\u4E00\u591A\uFF0C\u4E0D\u5199 `ELSE` \u7684\u90A3\u79CD\u901A\u5E38\u66F4\u5E73\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "13.3.1",
            title: "\u5206\u6570\u6362\u7B49\u7B2C",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u5B9A\u4E49\u4E00\u4E2A\u51FD\u6570\uFF0C\u63A5\u53D7\u4E00\u4E2A\u6574\u6570\u5206\u6570\uFF0C\u8FD8\u56DE\u6765\u7B49\u7B2C\u2014\u201480 \u5206\u53CA\u4EE5\u4E0A\u662F `A`\uFF0C60 \u5206\u53CA\u4EE5\u4E0A\u662F `B`\uFF0C40 \u5206\u53CA\u4EE5\u4E0A\u662F `C`\uFF0C\u518D\u4F4E\u662F `F`\u3002\u4E3B\u7A0B\u5E8F\u8BFB\u5165\u4E09\u4E2A\u5206\u6570\uFF0C\u6BCF\u8BFB\u4E00\u4E2A\u5C31\u628A\u5206\u6570\u548C\u7B49\u7B2C\u663E\u793A\u51FA\u6765\u3002",
            ioSpec: {
              input: ["\u4E09\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a mark`"].join("\n"),
              output: ["\u6BCF\u8BFB\u5B8C\u4E00\u4E2A\u663E\u793A\u4E00\u884C\uFF1A", "`<\u5206\u6570> <\u7B49\u7B2C>`", "\u4E2D\u95F4\u4E00\u4E2A\u7A7A\u683C\u3002"].join("\n")
            },
            constraints: {
              require: [
                {
                  feature: "routine.function",
                  reason: "\u7B49\u7B2C\u662F\u7B97\u51FA\u6765\u7684\u4E00\u4E2A\u503C\uFF0C\u8981\u62FF\u53BB\u663E\u793A\uFF0C\u6B63\u8BE5\u7531\u51FD\u6570\u8FD8\u56DE\u6765\u3002"
                },
                {
                  feature: "routine.return",
                  reason: "\u56DB\u79CD\u7B49\u7B2C\u90FD\u662F\u4E00\u6761\u8DEF\uFF0C\u6BCF\u6761\u8DEF\u90FD\u5F97\u628A\u7ED3\u679C\u8FD8\u56DE\u53BB\u3002"
                },
                {
                  feature: "expr.function-call",
                  reason: "\u51FD\u6570\u4E0D\u5199 `CALL`\uFF0C\u8981\u653E\u5728\u9700\u8981\u4E00\u4E2A\u503C\u7684\u5730\u65B9\u7528\u3002"
                }
              ]
            },
            hints: [
              "\u51FD\u6570\u5934\u90E8\u5199\u6210 `FUNCTION Grade(Mark : INTEGER) RETURNS STRING`\u3002",
              "\u56DB\u4E2A\u95E8\u69DB\u4ECE\u9AD8\u5F80\u4F4E\u67E5\uFF1A\u5148\u770B\u591F\u4E0D\u591F 80\uFF0C\u518D\u770B\u591F\u4E0D\u591F 60\u2026\u2026\u987A\u5E8F\u53CD\u4E86\u4F1A\u5168\u843D\u5230\u7B2C\u4E00\u6761\u3002",
              "\u6700\u540E\u90A3\u53E5 `RETURN` \u653E\u5728\u6240\u6709 `ENDIF` \u7684\u540E\u9762\u5C31\u884C\uFF0C\u4E0D\u5FC5\u5305 `ELSE`\u3002"
            ],
            examples: [
              {
                inputs: ["85", "60", "10"],
                outputs: ["Enter a mark", "85 A", "Enter a mark", "60 B", "Enter a mark", "10 F"]
              }
            ],
            referenceSolution: [
              "FUNCTION Grade(Mark : INTEGER) RETURNS STRING",
              "   IF Mark >= 80 THEN",
              '      RETURN "A"',
              "   ENDIF",
              "   IF Mark >= 60 THEN",
              '      RETURN "B"',
              "   ENDIF",
              "   IF Mark >= 40 THEN",
              '      RETURN "C"',
              "   ENDIF",
              '   RETURN "F"',
              "ENDFUNCTION",
              "DECLARE Mark : INTEGER",
              "DECLARE I : INTEGER",
              "FOR I \u2190 1 TO 3",
              '   OUTPUT "Enter a mark"',
              "   INPUT Mark",
              '   OUTPUT Mark, " ", Grade(Mark)',
              "NEXT I"
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["95", "72", "55"], caseHint: "\u4E09\u4E2A\u5206\u6570\u5404\u843D\u5728\u4E0D\u540C\u7684\u7B49\u7B2C\u4E0A\u3002" },
              { id: "t2", kind: "boundary", inputs: ["80", "60", "40"], caseHint: "\u4E09\u4E2A\u5206\u6570\u6B63\u597D\u90FD\u8E29\u5728\u95E8\u69DB\u4E0A\u3002" },
              { id: "t3", kind: "boundary", inputs: ["79", "59", "39"], caseHint: "\u4E09\u4E2A\u5206\u6570\u90FD\u5DEE\u4E00\u5206\u591F\u4E0D\u7740\u95E8\u69DB\u3002" },
              { id: "t4", kind: "boundary", inputs: ["0", "100", "0"], caseHint: "\u96F6\u5206\u548C\u6EE1\u5206\u3002" },
              { id: "t5", kind: "extreme", inputs: ["99999", "-99999", "41"], caseHint: "\u4E00\u4E2A\u5927\u5F97\u79BB\u8C31\uFF0C\u4E00\u4E2A\u662F\u5F88\u5C0F\u7684\u8D1F\u6570\u3002" }
            ]
          }
        ]
      },
      {
        id: "13.4",
        title: "\u51FD\u6570\u7684\u53C2\u6570",
        syllabus: ["\xA711.3"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_13_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u51FD\u6570\u7684\u53C2\u6570\u548C\u8FC7\u7A0B\u7684\u5B8C\u5168\u4E00\u6837\uFF1A\u5199\u5728\u62EC\u53F7\u91CC\uFF0C\u540D\u5B57\u3001\u5192\u53F7\u3001\u7C7B\u578B\uFF1B\u8C03\u7528\u65F6\u6309\u4F4D\u7F6E\u7ED9\u5B9E\u53C2\uFF0C\u4E2A\u6570\u3001\u987A\u5E8F\u3001\u7C7B\u578B\u90FD\u8981\u5BF9\u4E0A\u3002\u9ED8\u8BA4\u4E5F\u8FD8\u662F\u4F20\u503C\u3002",
              "\u4F46\u591A\u4E00\u6761\u89C4\u77E9\uFF1A**\u51FD\u6570\u7684\u53C2\u6570\u4E0D\u8BE5\u7528 `BYREF`**\u3002\u7406\u7531\u4E0D\u590D\u6742\u2014\u2014\u51FD\u6570\u662F\u7528\u6765\u7B97\u4E00\u4E2A\u503C\u7684\uFF0C\u987A\u624B\u628A\u8C03\u7528\u8005\u7684\u53D8\u91CF\u4E5F\u6539\u6389\uFF0C\u90A3\u662F\u53E6\u4E00\u4EF6\u4E8B\uFF0C\u4E24\u4EF6\u4E8B\u6DF7\u5728\u4E00\u53E5\u8868\u8FBE\u5F0F\u91CC\u8C01\u90FD\u770B\u4E0D\u6E05\u3002",
              "\u5199\u4E86 `BYREF` \u7684\u51FD\u6570\u7167\u6837\u80FD\u8DD1\uFF0C\u7F16\u8F91\u5668\u7ED9\u7684\u662F\u4E00\u6761\u89C4\u8303\u63D0\u793A\uFF0C\u4E0D\u662F\u963B\u65AD\u9519\u8BEF\u2014\u2014**\u80FD\u8DD1\u4E0D\u7B49\u4E8E\u5408\u89C4\u8303**\uFF0CPseudocode Guide \u8FD9\u4E00\u6761\u5199\u5F97\u5F88\u660E\u786E\u3002",
              "\u51FD\u6570\u4E5F\u53EF\u4EE5\u4E00\u4E2A\u53C2\u6570\u90FD\u6CA1\u6709\uFF1A`FUNCTION Answer() RETURNS INTEGER`\uFF0C\u8C03\u7528\u65F6\u5199 `Answer()`\u2014\u2014\u62EC\u53F7\u548C\u8FC7\u7A0B\u4E00\u6837\u4E0D\u80FD\u7701\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u51FD\u6570\u53C2\u6570\u4E0D\u5E94\u4EE5 `BYREF` \u4F20\u9012\uFF08G\xA78.3\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u6CA1\u6709\u53C2\u6570\u3001\u4E24\u4E2A\u53C2\u6570\u3001\u62FF\u51FD\u6570\u5F53\u5B9E\u53C2",
            fileName: "Example_13_4_a.pseudocode",
            code: [
              "FUNCTION Answer() RETURNS INTEGER",
              "   RETURN 42",
              "ENDFUNCTION",
              "FUNCTION Area(Width : INTEGER, Height : INTEGER) RETURNS INTEGER",
              "   RETURN Width * Height",
              "ENDFUNCTION",
              "OUTPUT Answer()",
              "OUTPUT Area(3, 4)",
              "OUTPUT Area(Answer(), 2)"
            ].join("\n"),
            annotations: [
              { fromLine: 1, toLine: 1, text: "\u6CA1\u6709\u53C2\u6570\uFF0C\u62EC\u53F7\u7167\u5199\u3002" },
              { fromLine: 8, toLine: 8, text: "\u4E24\u4E2A\u5B9E\u53C2\u6309\u4F4D\u7F6E\u5BF9\u4E0A `Width` \u548C `Height`\u3002" },
              { fromLine: 9, toLine: 9, text: "`Answer()` \u5148\u53D8\u6210 42\uFF0C\u518D\u5F53\u5B9E\u53C2\u9012\u7ED9 `Area`\u3002\u51FD\u6570\u80FD\u653E\u5728\u4EFB\u4F55\u9700\u8981\u4E00\u4E2A\u503C\u7684\u5730\u65B9\u2014\u2014\u5305\u62EC\u53E6\u4E00\u4E2A\u51FD\u6570\u7684\u62EC\u53F7\u91CC\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["42", "12", "84"]
            }
          },
          {
            kind: "counterExample",
            title: "\u51FD\u6570\u53C2\u6570\u5199\u6210 `BYREF`",
            cases: [
              {
                code: [
                  "FUNCTION Bad(BYREF N : INTEGER) RETURNS INTEGER",
                  "   N \u2190 N + 1",
                  "   RETURN N",
                  "ENDFUNCTION",
                  "DECLARE X : INTEGER",
                  "X \u2190 1",
                  "OUTPUT Bad(X)",
                  "OUTPUT X"
                ].join("\n"),
                note: "**\u8FD9\u6BB5\u8DD1\u5F97\u5B8C**\uFF0C\u4E24\u884C\u90FD\u663E\u793A 2\u2014\u2014\u51FD\u6570\u628A\u5916\u9762\u7684 `X` \u4E5F\u6539\u4E86\u3002\u63D0\u793A\u662F\u4E00\u6761\u89C4\u8303\u7EA7\u522B\u7684\uFF0C\u4E0D\u62E6\u4F60\u8FD0\u884C\u3002\u9EBB\u70E6\u5728\u4E8E\u8BFB\u7B2C 7 \u884C\u7684\u4EBA\u6839\u672C\u60F3\u4E0D\u5230 `X` \u4F1A\u56E0\u6B64\u53D8\u5316\u3002",
                expectDiagnostics: [
                  { severity: "caie", ruleId: "PARAM-002", line: 1, text: "\u51FD\u6570\u7684\u53C2\u6570\u4E0D\u8BE5\u7528 `BYREF`\u3002\u8981\u6539\u8C03\u7528\u8005\u7684\u53D8\u91CF\uFF0C\u90A3\u4EF6\u4E8B\u5E94\u8BE5\u4EA4\u7ED9\u8FC7\u7A0B\u3002" }
                ]
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E3A\u4EC0\u4E48\u89C4\u8303\u4E0D\u8BA9\u51FD\u6570\u7684\u53C2\u6570\u7528 `BYREF`\uFF1F",
            options: [
              {
                key: "A",
                label: "\u56E0\u4E3A `BYREF` \u53EA\u80FD\u7528\u5728 `INTEGER` \u4E0A",
                correct: false,
                explanation: "\u548C\u7C7B\u578B\u6CA1\u5173\u7CFB\u3002\u8FC7\u7A0B\u91CC `BYREF` \u4E00\u4E2A `STRING`\u3001\u4E00\u4E2A\u6570\u7EC4\u90FD\u5B8C\u5168\u6B63\u5E38\u3002"
              },
              {
                key: "B",
                label: "\u56E0\u4E3A\u51FD\u6570\u5199\u5728\u8868\u8FBE\u5F0F\u91CC\uFF0C\u987A\u624B\u6539\u6389\u522B\u4EBA\u7684\u53D8\u91CF\u4F1A\u8BA9\u90A3\u53E5\u8868\u8FBE\u5F0F\u8BF4\u4E0D\u6E05",
                correct: true,
                explanation: "\u5BF9\u3002\u51FD\u6570\u662F\u62FF\u6765\u6C42\u503C\u7684\uFF0C\u51FA\u73B0\u5728\u8D4B\u503C\u53F7\u53F3\u8FB9\u3001`IF` \u7684\u6761\u4EF6\u91CC\u3002\u5B83\u5728\u90A3\u513F\u6084\u6084\u6539\u6389\u4E00\u4E2A\u53D8\u91CF\uFF0C\u8BFB\u90A3\u4E00\u884C\u7684\u4EBA\u5B8C\u5168\u770B\u4E0D\u51FA\u6765\u3002"
              },
              {
                key: "C",
                label: "\u56E0\u4E3A\u7F16\u8F91\u5668\u8FD8\u6CA1\u5B9E\u73B0",
                correct: false,
                explanation: "\u5B9E\u73B0\u4E86\uFF0C\u5199\u4E86\u7167\u6837\u8DD1\u3002\u8FD9\u662F Pseudocode Guide \u7684\u5199\u6CD5\u8981\u6C42\uFF0C\u4E0D\u662F\u80FD\u529B\u9650\u5236\u3002"
              },
              {
                key: "D",
                label: "\u56E0\u4E3A\u51FD\u6570\u4E0D\u80FD\u6709\u53C2\u6570",
                correct: false,
                explanation: "\u51FD\u6570\u5F53\u7136\u80FD\u6709\u53C2\u6570\uFF0C\u800C\u4E14\u591A\u6570\u51FD\u6570\u90FD\u6709\u3002\u4E0D\u8BA9\u7528\u7684\u53EA\u662F `BYREF` \u8FD9\u4E00\u79CD\u4F20\u9012\u65B9\u5F0F\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "13.5",
        title: "\u51FD\u6570\u4E0D\u8BE5\u6709\u526F\u4F5C\u7528",
        syllabus: ["\xA711.3"],
        estimatedMinutes: 10,
        taughtFeatures: AFTER_13_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u51FD\u6570\u9664\u4E86\u7B97\u51FA\u8FD4\u56DE\u503C\u4E4B\u5916\u8FD8\u5E72\u4E86\u522B\u7684\u2014\u2014\u663E\u793A\u4E86\u4E1C\u897F\u3001\u6539\u4E86\u5168\u5C40\u53D8\u91CF\u3001\u5F80\u6587\u4EF6\u91CC\u5199\u4E86\u4E00\u884C\u2014\u2014\u8FD9\u4E9B\u989D\u5916\u7684\u52A8\u4F5C\u7EDF\u79F0**\u526F\u4F5C\u7528\uFF08side effect\uFF09**\u3002\u4E0A\u4E00\u8282\u7684 `BYREF` \u53C2\u6570\u662F\u5176\u4E2D\u4E00\u79CD\uFF0C\u4F46\u4E0D\u6B62\u90A3\u4E00\u79CD\u3002",
              "\u4E3A\u4EC0\u4E48\u8981\u8EB2\u5F00\u5B83\uFF1F\u56E0\u4E3A\u51FD\u6570\u85CF\u5728\u8868\u8FBE\u5F0F\u91CC\uFF0C**\u4F60\u6570\u4E0D\u6E05\u5B83\u88AB\u8C03\u7528\u4E86\u51E0\u6B21\u3001\u6309\u4EC0\u4E48\u987A\u5E8F**\u3002`OUTPUT Double(3) + Double(4)` \u91CC\u6709\u4E24\u6B21\u8C03\u7528\uFF1B\u6362\u4E2A\u5199\u6CD5\u53EF\u80FD\u662F\u4E00\u6B21\uFF0C\u4E5F\u53EF\u80FD\u662F\u4E09\u6B21\u3002\u6BCF\u6B21\u8C03\u7528\u90FD\u5077\u5077\u505A\u70B9\u4EC0\u4E48\uFF0C\u7ED3\u679C\u5C31\u8DDF\u7740\u8C03\u7528\u6B21\u6570\u98D8\u3002",
              "\u7F16\u8F91\u5668\u4E0D\u62E6\u8FD9\u4EF6\u4E8B\u2014\u2014\u51FD\u6570\u91CC\u5199 `OUTPUT` \u8BED\u6CD5\u4E0A\u5B8C\u5168\u5408\u6CD5\u3002\u8FD9\u662F**\u5199\u6CD5\u4E0A\u7684\u8981\u6C42**\uFF0C\u8DDF\u7F29\u8FDB\u3001\u5927\u5199\u4E00\u6837\uFF1A\u4E0D\u9075\u5B88\u4E5F\u80FD\u8DD1\uFF0C\u4F46\u5199\u51FA\u6765\u7684\u7A0B\u5E8F\u522B\u4EBA\u8BFB\u4E0D\u660E\u767D\u3002",
              "\u5224\u636E\u6709\u4E00\u53E5\u73B0\u6210\u7684\uFF1A**\u628A\u4E00\u4E2A\u51FD\u6570\u8C03\u7528\u6362\u6210\u5B83\u7B97\u51FA\u6765\u7684\u90A3\u4E2A\u503C\uFF0C\u7A0B\u5E8F\u7684\u884C\u4E3A\u5E94\u8BE5\u5B8C\u5168\u4E0D\u53D8\u3002** \u505A\u5F97\u5230\uFF0C\u5B83\u5C31\u662F\u5E72\u51C0\u7684\u3002"
            ]
          },
          {
            kind: "example",
            title: "\u4E00\u4E2A\u6709\u526F\u4F5C\u7528\u7684\u51FD\u6570\uFF0C\u6570\u6570\u5B83\u88AB\u53EB\u4E86\u51E0\u6B21",
            fileName: "Example_13_5_a.pseudocode",
            code: [
              "FUNCTION Noisy(N : INTEGER) RETURNS INTEGER",
              '   OUTPUT "called with ", N',
              "   RETURN N * 2",
              "ENDFUNCTION",
              "OUTPUT Noisy(3) + Noisy(4)"
            ].join("\n"),
            annotations: [
              { fromLine: 2, toLine: 2, text: "\u8FD9\u4E00\u53E5\u5C31\u662F\u526F\u4F5C\u7528\uFF1A\u5B83\u548C\u300C\u7B97\u51FA N \u7684\u4E24\u500D\u300D\u8FD9\u4EF6\u4E8B\u6CA1\u6709\u5173\u7CFB\u3002" },
              { fromLine: 5, toLine: 5, text: "\u53EA\u5199\u4E86\u4E00\u53E5 `OUTPUT`\uFF0C\u5C4F\u5E55\u4E0A\u5374\u51FA\u6765\u4E09\u884C\u2014\u2014\u56E0\u4E3A\u8FD9\u4E00\u884C\u91CC\u51FD\u6570\u88AB\u8C03\u7528\u4E86\u4E24\u6B21\uFF0C\u6BCF\u6B21\u90FD\u81EA\u5DF1\u5148\u558A\u4E00\u55D3\u5B50\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["called with 3", "called with 4", "14"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0A\u9762\u90A3\u6BB5\u6700\u540E\u4E00\u884C\u5982\u679C\u6539\u6210 `OUTPUT Noisy(3) * 2`\uFF0C\u5C4F\u5E55\u4E0A\u4F1A\u6709\u51E0\u884C\uFF1F",
            options: [
              {
                key: "A",
                label: "1 \u884C",
                correct: false,
                explanation: "\u51FD\u6570\u4F53\u91CC\u90A3\u53E5 `OUTPUT` \u6BCF\u6B21\u8C03\u7528\u90FD\u4F1A\u6267\u884C\u4E00\u6B21\uFF0C\u6240\u4EE5\u9664\u4E86\u7ED3\u679C\u90A3\u884C\u4E4B\u5916\u81F3\u5C11\u8FD8\u6709\u4E00\u884C\u3002"
              },
              {
                key: "B",
                label: "2 \u884C",
                correct: true,
                explanation: "\u5BF9\uFF1A\u4E00\u6B21\u8C03\u7528\u5E26\u51FA\u4E00\u884C `called with 3`\uFF0C\u518D\u52A0\u7ED3\u679C `12`\u3002**\u540C\u6837\u4E00\u4E2A\u51FD\u6570\uFF0C\u6362\u4E2A\u5F0F\u5B50\u884C\u6570\u5C31\u53D8\u4E86**\u2014\u2014\u526F\u4F5C\u7528\u9EBB\u70E6\u5C31\u9EBB\u70E6\u5728\u8FD9\u91CC\u3002"
              },
              {
                key: "C",
                label: "\u770B\u8FD0\u884C\u51E0\u6B21\u624D\u77E5\u9053",
                correct: false,
                explanation: "\u6BCF\u6B21\u8FD0\u884C\u90FD\u4E00\u6837\u3002\u4E0D\u786E\u5B9A\u7684\u4E0D\u662F\u6B21\u6570\u672C\u8EAB\uFF0C\u800C\u662F\u8BFB\u4EE3\u7801\u7684\u4EBA\u5149\u770B\u90A3\u4E00\u884C\u731C\u4E0D\u51FA\u4F1A\u663E\u793A\u51E0\u884C\u3002"
              },
              {
                key: "D",
                label: "3 \u884C",
                correct: false,
                explanation: "3 \u884C\u662F\u539F\u6765\u90A3\u79CD\u5199\u6CD5\u7684\u7ED3\u679C\uFF1A\u4E24\u6B21\u8C03\u7528\u5404\u4E00\u884C\uFF0C\u52A0\u4E0A\u6700\u540E\u7684\u548C\u3002\u8FD9\u91CC\u53EA\u6709\u4E00\u6B21\u8C03\u7528\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "13.5.1",
            title: "\u56DB\u4E2A\u6570\u91CC\u6700\u5927\u7684",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u5B9A\u4E49\u4E00\u4E2A**\u5E72\u51C0\u7684**\u51FD\u6570\uFF0C\u63A5\u53D7\u4E24\u4E2A\u6574\u6570\u3001\u8FD8\u56DE\u6765\u8F83\u5927\u7684\u90A3\u4E00\u4E2A\uFF08\u4E0D\u663E\u793A\u4EFB\u4F55\u4E1C\u897F\u3001\u4E0D\u6539\u4EFB\u4F55\u5916\u90E8\u53D8\u91CF\uFF09\uFF1B\u4E3B\u7A0B\u5E8F\u8BFB\u5165\u56DB\u4E2A\u6570\uFF0C\u9760\u53CD\u590D\u8C03\u7528\u8FD9\u4E2A\u51FD\u6570\u627E\u51FA\u6700\u5927\u7684\u4E00\u4E2A\u518D\u663E\u793A\u51FA\u6765\u3002",
            ioSpec: {
              input: ["\u56DB\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a number`"].join("\n"),
              output: ["\u4E00\u884C\uFF0C\u5199\u6210\uFF1A", "`Largest: <\u6700\u5927\u7684\u90A3\u4E2A\u6570>`", "\u5192\u53F7\u540E\u9762\u4E00\u4E2A\u7A7A\u683C\u3002"].join("\n")
            },
            constraints: {
              require: [
                {
                  feature: "routine.function",
                  reason: "\u300C\u4E24\u4E2A\u6570\u91CC\u8F83\u5927\u7684\u90A3\u4E2A\u300D\u662F\u4E00\u4E2A\u503C\uFF0C\u62FF\u53BB\u63A5\u7740\u6BD4\uFF0C\u6B63\u8BE5\u7531\u51FD\u6570\u8FD8\u56DE\u6765\u3002"
                },
                {
                  feature: "expr.function-call",
                  reason: "\u51FD\u6570\u8981\u7528\u5728\u9700\u8981\u4E00\u4E2A\u503C\u7684\u5730\u65B9\uFF0C\u800C\u4E0D\u662F\u5355\u5360\u4E00\u884C\u3002"
                }
              ],
              forbid: [
                {
                  feature: "param.byref",
                  reason: "\u51FD\u6570\u7684\u53C2\u6570\u4E0D\u8BE5\u7528 `BYREF`\uFF0C\u8FD9\u9053\u9898\u8981\u5199\u7684\u6B63\u662F\u4E00\u4E2A\u5E72\u51C0\u7684\u51FD\u6570\u3002"
                }
              ]
            },
            hints: [
              "\u51FD\u6570\u91CC\u53EA\u8981\u4E00\u4E2A `IF` \u548C\u4E24\u53E5 `RETURN`\uFF0C\u4E00\u53E5 `OUTPUT` \u90FD\u4E0D\u8BE5\u6709\u3002",
              "\u5148\u628A\u7B2C\u4E00\u4E2A\u6570\u5F53\u6210\u300C\u76EE\u524D\u6700\u5927\u7684\u300D\uFF0C\u540E\u9762\u6BCF\u8BFB\u4E00\u4E2A\u5C31\u548C\u5B83\u6BD4\u4E00\u6B21\u3002",
              "\u6BD4\u8F83\u7684\u7ED3\u679C\u8981\u5B58\u56DE\u53BB\uFF1A`Best \u2190 Bigger(Best, N)`\u3002"
            ],
            examples: [
              {
                inputs: ["3", "9", "2", "7"],
                outputs: ["Enter a number", "Enter a number", "Enter a number", "Enter a number", "Largest: 9"]
              }
            ],
            referenceSolution: [
              "FUNCTION Bigger(A : INTEGER, B : INTEGER) RETURNS INTEGER",
              "   IF A > B THEN",
              "      RETURN A",
              "   ENDIF",
              "   RETURN B",
              "ENDFUNCTION",
              "DECLARE Best : INTEGER",
              "DECLARE N : INTEGER",
              "DECLARE I : INTEGER",
              'OUTPUT "Enter a number"',
              "INPUT Best",
              "FOR I \u2190 2 TO 4",
              '   OUTPUT "Enter a number"',
              "   INPUT N",
              "   Best \u2190 Bigger(Best, N)",
              "NEXT I",
              'OUTPUT "Largest: ", Best'
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["4", "8", "1", "6"], caseHint: "\u6700\u5927\u7684\u90A3\u4E2A\u843D\u5728\u4E2D\u95F4\u3002" },
              { id: "t2", kind: "boundary", inputs: ["9", "1", "2", "3"], caseHint: "\u6700\u5927\u7684\u5C31\u662F\u7B2C\u4E00\u4E2A\u8BFB\u8FDB\u6765\u7684\u3002" },
              { id: "t3", kind: "boundary", inputs: ["1", "2", "3", "9"], caseHint: "\u6700\u5927\u7684\u662F\u6700\u540E\u4E00\u4E2A\u8BFB\u8FDB\u6765\u7684\u3002" },
              { id: "t4", kind: "normal", inputs: ["5", "5", "5", "5"], caseHint: "\u56DB\u4E2A\u6570\u5B8C\u5168\u4E00\u6837\u3002" },
              { id: "t5", kind: "extreme", inputs: ["-99999", "-99998", "-99997", "-99996"], caseHint: "\u5168\u662F\u5F88\u5C0F\u7684\u8D1F\u6570\uFF0C\u6700\u5927\u7684\u4E5F\u662F\u8D1F\u7684\u3002" }
            ]
          }
        ]
      },
      {
        id: "13.6",
        title: "\u4E94\u4E2A\u5FC5\u987B\u5206\u6E05\u7684\u8BCD",
        syllabus: ["\xA711.3"],
        estimatedMinutes: 8,
        taughtFeatures: AFTER_13_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u8003\u7EB2\u70B9\u540D\u8981\u6C42\u80FD\u5206\u6E05\u4E94\u4E2A\u8BCD\u3002\u62FF `FUNCTION Area(Width : INTEGER, Height : INTEGER) RETURNS INTEGER` \u8FD9\u4E00\u884C\u5F53\u4F8B\u5B50\uFF0C\u4E94\u4E2A\u8BCD\u5168\u5728\u91CC\u9762\u6216\u8005\u7D27\u6328\u7740\u5B83\u3002",
              "**\u5934\u90E8\uFF08header\uFF09**\u5C31\u662F\u8FD9\u4E00\u884C\u672C\u8EAB\uFF1A\u540D\u5B57\u3001\u53C2\u6570\u3001\u8FD4\u56DE\u7C7B\u578B\u3002\u5B83\u4E0D\u5305\u542B\u51FD\u6570\u4F53\uFF0C\u4E5F\u4E0D\u5305\u542B `ENDFUNCTION`\u3002\u8FC7\u7A0B\u4E5F\u6709\u5934\u90E8\uFF0C\u53EA\u662F\u6CA1\u6709 `RETURNS` \u90A3\u4E00\u622A\u3002",
              "**\u63A5\u53E3\uFF08interface\uFF09**\u662F\u5934\u90E8\u91CC\u56DE\u7B54\u300C\u600E\u4E48\u7528\u5B83\u300D\u7684\u90A3\u90E8\u5206\uFF1A\u8981\u7ED9\u5B83\u4EC0\u4E48\u3001\u5B83\u4F1A\u8FD8\u56DE\u6765\u4EC0\u4E48\u3002\u77E5\u9053\u63A5\u53E3\u5C31\u8DB3\u591F\u4F7F\u7528\u4E00\u4E2A\u51FD\u6570\u4E86\u2014\u2014**\u91CC\u9762\u600E\u4E48\u5199\u7684\u5B8C\u5168\u4E0D\u7528\u770B**\uFF0C\u8FD9\u6B63\u662F\u5206\u89E3\u5E26\u6765\u7684\u597D\u5904\u3002",
              "**\u53C2\u6570\uFF08parameter\uFF09**\u662F `Width` \u548C `Height`\uFF1B**\u5B9E\u53C2\uFF08argument\uFF09**\u662F\u8C03\u7528\u65F6\u5199\u7684 `3` \u548C `4`\uFF1B**\u8FD4\u56DE\u503C\uFF08return value\uFF09**\u662F `RETURN` \u4EA4\u56DE\u53BB\u3001\u5E76\u4E14\u53D6\u4EE3\u4E86\u8FD9\u6B21\u8C03\u7528\u7684\u90A3\u4E2A\u6570\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u660E\u786E\u5217\u51FA header\u3001interface\u3001parameter\u3001argument\u3001return value \u4E94\u4E2A\u672F\u8BED\uFF08\xA711.3\uFF09\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "`OUTPUT Area(3, 4)` \u663E\u793A\u51FA `12`\u3002\u8FD9\u4E2A `12` \u662F\u4EC0\u4E48\uFF1F",
            options: [
              {
                key: "A",
                label: "\u5934\u90E8",
                correct: false,
                explanation: "\u5934\u90E8\u662F `FUNCTION Area(...) RETURNS INTEGER` \u90A3\u4E00\u884C\uFF0C\u6BCF\u4E2A\u51FD\u6570\u53EA\u6709\u4E00\u4E2A\uFF0C\u548C\u8C03\u7528\u51E0\u6B21\u65E0\u5173\u3002"
              },
              {
                key: "B",
                label: "\u63A5\u53E3",
                correct: false,
                explanation: "\u63A5\u53E3\u8BF4\u7684\u662F\u300C\u8981\u7ED9\u4E24\u4E2A `INTEGER`\u3001\u4F1A\u8FD8\u56DE\u6765\u4E00\u4E2A `INTEGER`\u300D\u8FD9\u4EF6\u4E8B\uFF0C\u662F\u4F7F\u7528\u8BF4\u660E\uFF0C\u4E0D\u662F\u67D0\u4E00\u6B21\u7684\u7ED3\u679C\u3002"
              },
              {
                key: "C",
                label: "\u5B9E\u53C2",
                correct: false,
                explanation: "\u5B9E\u53C2\u662F\u8C03\u7528\u65F6\u9012\u8FDB\u53BB\u7684 `3` \u548C `4`\uFF0C\u65B9\u5411\u6B63\u597D\u76F8\u53CD\u2014\u2014\u5B83\u4EEC\u662F\u8FDB\u53BB\u7684\uFF0C`12` \u662F\u51FA\u6765\u7684\u3002"
              },
              {
                key: "D",
                label: "\u8FD4\u56DE\u503C",
                correct: true,
                explanation: "\u5BF9\u3002\u800C\u4E14\u66F4\u51C6\u786E\u7684\u8BF4\u6CD5\u662F\uFF1A`Area(3, 4)` \u8FD9\u4E00\u6574\u5757\u88AB\u8FD9\u4E2A\u503C\u53D6\u4EE3\u4E86\uFF0C\u6240\u4EE5 `OUTPUT` \u62FF\u5230\u7684\u5C31\u662F `12`\u3002"
              }
            ]
          }
        ]
      }
    ],
    chapterTasks: [
      {
        kind: "chapterTask",
        id: "13.T1",
        title: "\u4E94\u79D1\u6210\u7EE9\u62A5\u544A",
        statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165 5 \u79D1\u6210\u7EE9\uFF0C\u7B97\u51FA\u5E73\u5747\u5206\uFF08\u53D6\u6574\u6570\u5546\uFF09\uFF0C\u518D\u6309\u5E73\u5747\u5206\u7ED9\u51FA\u7B49\u7B2C\uFF0C\u6700\u540E\u628A\u5E73\u5747\u5206\u548C\u7B49\u7B2C\u663E\u793A\u51FA\u6765\u3002\u5E73\u5747\u5206\u548C\u7B49\u7B2C\u5404\u5199\u6210\u4E00\u4E2A\u51FD\u6570\uFF0C\u663E\u793A\u5199\u6210\u4E00\u4E2A\u8FC7\u7A0B\uFF1B\u4E3B\u7A0B\u5E8F\u53EA\u8D1F\u8D23\u8BFB\u5165\u3001\u8C03\u7528\u548C\u4E32\u8D77\u6765\u3002\u7B49\u7B2C\u89C4\u5219\uFF1A80 \u5206\u53CA\u4EE5\u4E0A\u662F `A`\uFF0C60 \u5206\u53CA\u4EE5\u4E0A\u662F `B`\uFF0C40 \u5206\u53CA\u4EE5\u4E0A\u662F `C`\uFF0C\u518D\u4F4E\u662F `F`\u3002",
        ioSpec: {
          input: ["\u4E94\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a mark`"].join("\n"),
          output: ["\u8BFB\u5B8C\u4E4B\u540E\u663E\u793A\u4E24\u884C\uFF1A", "`Average: <\u5E73\u5747\u5206>`", "`Grade: <\u7B49\u7B2C>`", "\u6BCF\u4E2A\u5192\u53F7\u540E\u9762\u4E00\u4E2A\u7A7A\u683C\u3002"].join("\n")
        },
        suggestedFeatures: [
          "routine.function",
          "routine.return",
          "expr.function-call",
          "routine.procedure",
          "routine.call",
          "param.byval",
          "op.div",
          "select.if",
          "loop.for",
          "io.input",
          "io.output"
        ],
        hints: [
          "\u4E24\u4E2A\u51FD\u6570\u4E00\u4E2A\u8FC7\u7A0B\uFF1A\u7B97\u5E73\u5747\u7684\u51FD\u6570\u3001\u5224\u7B49\u7B2C\u7684\u51FD\u6570\u3001\u663E\u793A\u7ED3\u679C\u7684\u8FC7\u7A0B\u3002\u4E09\u4EF6\u4E8B\u5404\u7BA1\u5404\u7684\u3002",
          "\u5224\u7B49\u7B2C\u7684\u90A3\u4E2A\u51FD\u6570\u62FF\u5E73\u5747\u5206\u5F53\u53C2\u6570\uFF0C\u5B83\u4E0D\u9700\u8981\u77E5\u9053\u6210\u7EE9\u662F\u600E\u4E48\u6765\u7684\u2014\u2014\u8FD9\u6B63\u662F\u63A5\u53E3\u7684\u610F\u601D\u3002",
          "\u4E00\u4E2A\u51FD\u6570\u7684\u8FD4\u56DE\u503C\u53EF\u4EE5\u76F4\u63A5\u5F53\u53E6\u4E00\u4E2A\u8C03\u7528\u7684\u5B9E\u53C2\uFF1A`CALL ShowResult(Mean, Grade(Mean))`\u3002"
        ],
        examples: [
          {
            inputs: ["80", "70", "90", "60", "100"],
            outputs: [
              "Enter a mark",
              "Enter a mark",
              "Enter a mark",
              "Enter a mark",
              "Enter a mark",
              "Average: 80",
              "Grade: A"
            ]
          }
        ],
        referenceSolution: [
          "FUNCTION Average(Total : INTEGER, Count : INTEGER) RETURNS INTEGER",
          "   RETURN Total DIV Count",
          "ENDFUNCTION",
          "FUNCTION Grade(Mark : INTEGER) RETURNS STRING",
          "   IF Mark >= 80 THEN",
          '      RETURN "A"',
          "   ENDIF",
          "   IF Mark >= 60 THEN",
          '      RETURN "B"',
          "   ENDIF",
          "   IF Mark >= 40 THEN",
          '      RETURN "C"',
          "   ENDIF",
          '   RETURN "F"',
          "ENDFUNCTION",
          "PROCEDURE ShowResult(Value : INTEGER, Letter : STRING)",
          '   OUTPUT "Average: ", Value',
          '   OUTPUT "Grade: ", Letter',
          "ENDPROCEDURE",
          "DECLARE Sum : INTEGER",
          "DECLARE Mark : INTEGER",
          "DECLARE I : INTEGER",
          "DECLARE Mean : INTEGER",
          "Sum \u2190 0",
          "FOR I \u2190 1 TO 5",
          '   OUTPUT "Enter a mark"',
          "   INPUT Mark",
          "   Sum \u2190 Sum + Mark",
          "NEXT I",
          "Mean \u2190 Average(Sum, 5)",
          "CALL ShowResult(Mean, Grade(Mean))"
        ].join("\n"),
        tests: [
          { id: "t1", kind: "normal", inputs: ["55", "62", "71", "48", "90"], caseHint: "\u4E94\u79D1\u6210\u7EE9\u9AD8\u4F4E\u4E0D\u4E00\uFF0C\u5E73\u5747\u5206\u843D\u5728\u4E2D\u95F4\u7684\u7B49\u7B2C\u4E0A\u3002" },
          { id: "t2", kind: "boundary", inputs: ["80", "80", "80", "80", "80"], caseHint: "\u5E73\u5747\u5206\u6B63\u597D\u8E29\u5728\u6700\u9AD8\u7684\u90A3\u4E2A\u95E8\u69DB\u4E0A\u3002" },
          { id: "t3", kind: "boundary", inputs: ["0", "0", "0", "0", "0"], caseHint: "\u5168\u90E8\u96F6\u5206\u3002" },
          { id: "t4", kind: "boundary", inputs: ["41", "40", "40", "40", "40"], caseHint: "\u603B\u5206\u9664\u4E0D\u5C3D\uFF0C\u6574\u9664\u4E4B\u540E\u6B63\u597D\u843D\u56DE\u95E8\u69DB\u4E0A\u3002" },
          { id: "t5", kind: "extreme", inputs: ["99999", "0", "0", "0", "0"], caseHint: "\u4E00\u79D1\u5927\u5F97\u79BB\u8C31\uFF0C\u5176\u4F59\u5168\u662F\u96F6\u3002" }
        ]
      }
    ]
  };

  // packages/teaching-content/src/chapter-14.ts
  var AFTER_CHAPTER_13 = [
    "io.output",
    "io.input",
    "decl.variable",
    "misc.comment",
    "type.string",
    "literal.string",
    "type.integer",
    "type.real",
    "type.char",
    "type.boolean",
    "type.date",
    "literal.integer",
    "literal.real",
    "literal.char",
    "literal.boolean",
    "literal.date",
    "assign.simple",
    "decl.constant",
    "op.arithmetic",
    "op.div",
    "op.mod",
    "op.relational",
    "op.and",
    "op.or",
    "op.not",
    "select.if",
    "select.if-else",
    "select.nested-if",
    "select.case",
    "select.case-range",
    "select.case-otherwise",
    "loop.for",
    "loop.for-step",
    "loop.while",
    "loop.repeat",
    "loop.nested",
    "builtin.length",
    "builtin.mid",
    "builtin.right",
    "builtin.ucase",
    "builtin.lcase",
    "op.concat",
    "builtin.int",
    "builtin.rand",
    "decl.array-1d",
    "array.index",
    "decl.array-2d",
    "array.index-2d",
    "decl.record-type",
    "record.field-access",
    "routine.procedure",
    "routine.call",
    "param.byval",
    "param.byref",
    "routine.function",
    "routine.return",
    "expr.function-call"
  ];
  var AFTER_14_1 = [...AFTER_CHAPTER_13, "file.open-write", "file.write", "file.close"];
  var AFTER_14_3 = [...AFTER_14_1, "file.open-read", "file.read"];
  var AFTER_14_4 = [...AFTER_14_3, "file.open-append"];
  var AFTER_14_5 = [...AFTER_14_4, "builtin.eof"];
  var chapter14 = {
    id: 14,
    title: "\u6587\u672C\u6587\u4EF6",
    level: "AS",
    syllabus: ["\xA710.3"],
    prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    sections: [
      {
        id: "14.1",
        title: "\u4E3A\u4EC0\u4E48\u9700\u8981\u6587\u4EF6",
        syllabus: ["\xA710.3"],
        estimatedMinutes: 8,
        taughtFeatures: AFTER_14_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u5230\u8FD9\u91CC\u4E3A\u6B62\uFF0C\u7A0B\u5E8F\u91CC\u6240\u6709\u7684\u6570\u636E\u2014\u2014\u53D8\u91CF\u3001\u6570\u7EC4\u3001\u8BB0\u5F55\u2014\u2014\u90FD\u6709\u540C\u4E00\u4E2A\u6BDB\u75C5\uFF1A**\u7A0B\u5E8F\u4E00\u7ED3\u675F\uFF0C\u5B83\u4EEC\u5C31\u5168\u6CA1\u4E86**\u3002\u4E0B\u6B21\u518D\u8FD0\u884C\uFF0C\u4E00\u5207\u4ECE\u5934\u5F00\u59CB\uFF0C\u4E0A\u6B21\u8F93\u5165\u7684\u4E1C\u897F\u4E00\u4E2A\u5B57\u90FD\u4E0D\u5269\u3002",
              "\u8981\u8BA9\u6570\u636E\u6D3B\u8FC7\u4E00\u6B21\u8FD0\u884C\uFF0C\u5C31\u5F97\u628A\u5B83\u5199\u5230\u7A0B\u5E8F\u5916\u9762\u53BB\u3002**\u6587\u672C\u6587\u4EF6\uFF08text file\uFF09**\u662F\u6700\u7B80\u5355\u7684\u90A3\u79CD\u53BB\u5904\uFF1A\u4E00\u4E2A\u6709\u540D\u5B57\u7684\u5730\u65B9\uFF0C\u91CC\u9762\u662F\u4E00\u884C\u4E00\u884C\u7684\u6587\u5B57\uFF0C\u7A0B\u5E8F\u7ED3\u675F\u4E4B\u540E\u5B83\u8FD8\u5728\u3002",
              "\u6587\u672C\u6587\u4EF6\u53EA\u88C5\u6587\u5B57\u3002\u5F80\u91CC\u5199\u4E00\u4E2A\u6570\uFF0C\u5199\u8FDB\u53BB\u7684\u662F\u8FD9\u4E2A\u6570**\u5199\u51FA\u6765\u7684\u6837\u5B50**\uFF1B\u8BFB\u56DE\u6765\u7684\u4E5F\u662F\u4E00\u884C\u6587\u5B57\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u53D8\u56DE\u6570\u2014\u2014\u8FD9\u4E00\u70B9\u540E\u9762\u51E0\u8282\u4F1A\u53CD\u590D\u78B0\u5230\u3002",
              "\u7528\u6587\u4EF6\u7684\u56DB\u4EF6\u4E8B\u603B\u662F\u8FD9\u4E2A\u987A\u5E8F\uFF1A**\u6253\u5F00\u3001\u8BFB\u6216\u5199\u3001\u5173\u6389**\u3002\u4E2D\u95F4\u90A3\u4E00\u6B65\u505A\u4EC0\u4E48\u7531\u6253\u5F00\u65F6\u9009\u7684\u65B9\u5F0F\u51B3\u5B9A\uFF0C\u4E0B\u9762\u51E0\u8282\u4E00\u4EF6\u4E00\u4EF6\u8BF4\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u80FD\u4F7F\u7528\u6587\u672C\u6587\u4EF6\u5B58\u50A8\u548C\u8BFB\u53D6\u6570\u636E\uFF08\xA710.3\uFF09\u3002"
              }
            ]
          },
          {
            kind: "comparison",
            title: "\u8BB0\u5728\u53D8\u91CF\u91CC\uFF0C\u8FD8\u662F\u8BB0\u5230\u6587\u4EF6\u91CC",
            intro: "\u628A\u4E00\u4E2A\u540D\u5B57\u5B58\u8D77\u6765\u3002",
            panes: [
              {
                label: "\u81EA\u7136\u8BED\u8A00",
                language: "natural",
                code: ["\u8BB0\u5728\u8111\u5B50\u91CC\uFF1A\u8FD9\u6B21\u8C08\u8BDD\u7ED3\u675F\u5C31\u5FD8\u4E86\u3002", "\u5199\u5728\u7EB8\u4E0A\uFF1A\u660E\u5929\u8FD8\u80FD\u7FFB\u51FA\u6765\u770B\u3002"].join("\n"),
                note: "\u53D8\u91CF\u662F\u8111\u5B50\uFF0C\u6587\u4EF6\u662F\u7EB8\u3002\u5DEE\u522B\u4E0D\u5728\u8FD9\u4E00\u523B\u80FD\u4E0D\u80FD\u7528\uFF0C\u800C\u5728\u4E0B\u6B21\u8FD8\u5728\u4E0D\u5728\u3002"
              },
              {
                label: "\u53D8\u91CF",
                language: "pseudocode",
                code: ["DECLARE Best : STRING", 'Best \u2190 "Ada"', "OUTPUT Best"].join("\n"),
                note: "\u8FD9\u4E00\u6B21\u8FD0\u884C\u91CC\u7528\u8D77\u6765\u4E00\u70B9\u95EE\u9898\u90FD\u6CA1\u6709\u3002\u4F46\u7A0B\u5E8F\u4E00\u7ED3\u675F\uFF0C`Best` \u5C31\u4E0D\u5B58\u5728\u4E86\uFF0C\u4E0B\u6B21\u8FD0\u884C\u5F97\u91CD\u65B0\u8F93\u5165\u4E00\u904D\u3002"
              },
              {
                label: "\u6587\u4EF6",
                language: "pseudocode",
                code: [
                  'OPENFILE "Best.txt" FOR WRITE',
                  'WRITEFILE "Best.txt", "Ada"',
                  'CLOSEFILE "Best.txt"',
                  'OUTPUT "Saved"'
                ].join("\n"),
                note: "\u5C4F\u5E55\u4E0A\u53EA\u591A\u4E86\u4E00\u53E5 `Saved`\uFF0C\u770B\u4E0D\u89C1 `Ada`\u2014\u2014\u5B83\u4E0D\u5728\u5C4F\u5E55\u4E0A\uFF0C\u5728 `Best.txt` \u91CC\uFF0C\u4E0B\u6B21\u8FD0\u884C\u8FD8\u80FD\u8BFB\u51FA\u6765\u3002"
              },
              {
                label: "Python",
                language: "python",
                code: ['with open("best.txt", "w") as f:', '    f.write("Ada\\n")'].join("\n"),
                note: "\u4E09\u6B65\u662F\u4E00\u6837\u7684\uFF1A\u6253\u5F00\u3001\u5199\u3001\u5173\u6389\u3002Python \u7684 `with` \u53EA\u662F\u628A\u300C\u5173\u6389\u300D\u8FD9\u4E00\u6B65\u81EA\u52A8\u5316\u4E86\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0B\u9762\u54EA\u4EF6\u4E8B**\u53EA\u6709**\u6587\u4EF6\u505A\u5F97\u5230\uFF0C\u53D8\u91CF\u548C\u6570\u7EC4\u505A\u4E0D\u5230\uFF1F",
            options: [
              {
                key: "A",
                label: "\u5B58\u653E\u4E0D\u540C\u7C7B\u578B\u7684\u6570\u636E",
                correct: false,
                explanation: "\u90A3\u662F\u8BB0\u5F55\u7684\u6D3B\u3002\u6587\u672C\u6587\u4EF6\u53CD\u800C\u53EA\u8BA4\u6587\u5B57\uFF0C\u4EC0\u4E48\u8FDB\u53BB\u90FD\u53D8\u6210\u6587\u5B57\u3002"
              },
              {
                key: "B",
                label: "\u628A\u6570\u636E\u663E\u793A\u7ED9\u7528\u6237\u770B",
                correct: false,
                explanation: "\u663E\u793A\u7528 `OUTPUT`\u3002\u5199\u8FDB\u6587\u4EF6\u6070\u6070\u662F**\u4E0D**\u663E\u793A\u2014\u2014\u5C4F\u5E55\u4E0A\u770B\u4E0D\u89C1\u5B83\u3002"
              },
              {
                key: "C",
                label: "\u4E00\u6B21\u5B58\u5F88\u591A\u6761\u6570\u636E",
                correct: false,
                explanation: "\u6570\u7EC4\u5C31\u80FD\u505A\u5230\uFF0C\u800C\u4E14\u53D6\u7528\u6BD4\u6587\u4EF6\u65B9\u4FBF\u5F97\u591A\u3002\u6761\u6570\u591A\u4E0D\u662F\u7528\u6587\u4EF6\u7684\u7406\u7531\u3002"
              },
              {
                key: "D",
                label: "\u628A\u8FD9\u6B21\u8FD0\u884C\u8F93\u5165\u7684\u4E1C\u897F\u7559\u7ED9\u4E0B\u4E00\u6B21\u8FD0\u884C\u7528",
                correct: true,
                explanation: "\u5BF9\u3002\u7A0B\u5E8F\u4E00\u7ED3\u675F\uFF0C\u53D8\u91CF\u548C\u6570\u7EC4\u8FDE\u540C\u91CC\u9762\u7684\u503C\u4E00\u8D77\u6D88\u5931\uFF1B\u6587\u4EF6\u7559\u5728\u7A0B\u5E8F\u5916\u9762\uFF0C\u4E0B\u4E00\u6B21\u8FD0\u884C\u8FD8\u80FD\u6253\u5F00\u5B83\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "14.2",
        title: "`OPENFILE`\u3001`WRITEFILE`\u3001`CLOSEFILE`",
        syllabus: ["\xA710.3"],
        estimatedMinutes: 10,
        taughtFeatures: AFTER_14_1,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              '\u5199\u4E00\u4E2A\u6587\u4EF6\u8981\u4E09\u53E5\u8BDD\u3002`OPENFILE "Names.txt" FOR WRITE` \u6253\u5F00\u5B83\uFF1A\u6587\u4EF6\u540D\u5199\u6210\u4E00\u6BB5 `STRING`\uFF0C`FOR` \u540E\u9762\u8BF4\u660E\u8FD9\u6B21\u8981\u62FF\u5B83\u5E72\u4EC0\u4E48\u3002',
              '`WRITEFILE "Names.txt", "Ada"` \u5F80\u91CC\u5199**\u4E00\u6574\u884C**\u3002\u5199\u5B8C\u4F4D\u7F6E\u81EA\u52A8\u5F80\u4E0B\u632A\u4E00\u884C\uFF0C\u6240\u4EE5\u63A5\u7740\u518D\u5199\u4E00\u53E5\u5C31\u662F\u7B2C\u4E8C\u884C\u2014\u2014\u4E0D\u7528\u81EA\u5DF1\u7BA1\u884C\u53F7\u3002',
              '`CLOSEFILE "Names.txt"` \u5173\u6389\u3002**\u6BCF\u4E00\u53E5\u90FD\u8981\u91CD\u590D\u5199\u4E00\u904D\u6587\u4EF6\u540D**\uFF0C\u56E0\u4E3A\u7A0B\u5E8F\u91CC\u53EF\u4EE5\u540C\u65F6\u5F00\u7740\u597D\u51E0\u4E2A\u6587\u4EF6\uFF0C\u6BCF\u4E00\u53E5\u90FD\u5F97\u8BF4\u6E05\u662F\u54EA\u4E00\u4E2A\u3002',
              "\u5173\u6389\u8FD9\u4E00\u6B65\u4E0D\u80FD\u7701\u3002\u6587\u4EF6\u5F00\u7740\u7684\u65F6\u5019\u522B\u4EBA\uFF08\u5305\u62EC\u8FD9\u6BB5\u7A0B\u5E8F\u81EA\u5DF1\uFF09\u6CA1\u6CD5\u518D\u6253\u5F00\u5B83\u2014\u2014\u4E0B\u4E00\u8282\u8981\u628A\u521A\u5199\u7684\u4E1C\u897F\u8BFB\u56DE\u6765\uFF0C\u5C31\u5FC5\u987B\u5148\u5173\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u6587\u672C\u6587\u4EF6\u7528 `OPENFILE <\u6587\u4EF6> FOR READ|WRITE|APPEND` \u6253\u5F00\uFF0C`WRITEFILE <\u6587\u4EF6>, <\u6570\u636E>` \u5199\u5165\u4E00\u884C\uFF0C`CLOSEFILE <\u6587\u4EF6>` \u5173\u95ED\uFF08G\xA79.1\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u628A\u4E24\u4E2A\u540D\u5B57\u5199\u51FA\u53BB",
            fileName: "Example_14_2_a.pseudocode",
            code: [
              'OPENFILE "Names.txt" FOR WRITE',
              'WRITEFILE "Names.txt", "Ada"',
              'WRITEFILE "Names.txt", "Bob"',
              'CLOSEFILE "Names.txt"',
              'OUTPUT "Saved 2 names"'
            ].join("\n"),
            annotations: [
              { fromLine: 1, toLine: 1, text: "`FOR WRITE` \u6253\u5F00\u7684\u540C\u65F6\u5C31\u628A\u6587\u4EF6\u6E05\u7A7A\u4E86\u2014\u2014\u4E0B\u4E00\u8282\u4F1A\u770B\u5230\u8FD9\u4E00\u70B9\u7684\u540E\u679C\u3002" },
              { fromLine: 2, toLine: 3, text: "\u4E24\u53E5\u5199\u51FA\u4E24\u884C\u3002\u4F4D\u7F6E\u81EA\u5DF1\u5F80\u4E0B\u8D70\uFF0C\u4E0D\u7528\u544A\u8BC9\u5B83\u5199\u7B2C\u51E0\u884C\u3002" },
              { fromLine: 5, toLine: 5, text: "\u5C4F\u5E55\u4E0A\u53EA\u6709\u8FD9\u4E00\u53E5\u3002\u524D\u56DB\u884C\u7684\u6210\u679C\u5728\u6587\u4EF6\u91CC\uFF0C\u770B\u4E0D\u89C1\u2014\u2014\u8FD9\u6B63\u662F\u6587\u4EF6\u548C `OUTPUT` \u7684\u533A\u522B\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["Saved 2 names"]
            }
          },
          {
            kind: "counterExample",
            title: "\u4E24\u79CD\u6F0F\u4E86 `OPENFILE` \u7684\u5199\u6CD5",
            cases: [
              {
                title: "\u6CA1\u6253\u5F00\u5C31\u5199",
                code: ['WRITEFILE "Names.txt", "Ada"'].join("\n"),
                note: "\u6587\u4EF6\u5F97\u5148\u6253\u5F00\u624D\u80FD\u5199\u3002\u8FD9\u4E00\u6761\u8FD0\u884C\u524D\u5C31\u80FD\u67E5\u51FA\u6765\u2014\u2014\u7F16\u8F91\u5668\u987A\u7740\u4EE3\u7801\u770B\u5F97\u5230\u8FD9\u4E2A\u6587\u4EF6\u4ECE\u5934\u5230\u5C3E\u6CA1\u88AB\u6253\u5F00\u8FC7\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "FILE-003", line: 1, text: "\u8FD9\u4E2A\u6587\u4EF6\u8FD8\u6CA1\u6253\u5F00\uFF0C\u5199\u4E0D\u8FDB\u53BB\u3002" }
                ]
              },
              {
                title: "\u5173\u4E86\u4E24\u904D",
                code: [
                  'OPENFILE "Names.txt" FOR WRITE',
                  'WRITEFILE "Names.txt", "Ada"',
                  'CLOSEFILE "Names.txt"',
                  'CLOSEFILE "Names.txt"'
                ].join("\n"),
                note: "\u7B2C\u4E00\u53E5 `CLOSEFILE` \u4E4B\u540E\u6587\u4EF6\u5DF2\u7ECF\u5173\u4E86\uFF0C\u7B2C\u4E8C\u53E5\u6CA1\u6709\u4E1C\u897F\u53EF\u5173\u3002\u591A\u5199\u4E00\u53E5\u770B\u7740\u65E0\u5BB3\uFF0C\u4F46\u5B83\u8BF4\u660E\u4F60\u5BF9\u300C\u73B0\u5728\u8FD9\u4E2A\u6587\u4EF6\u662F\u5F00\u7740\u8FD8\u662F\u5173\u7740\u300D\u8BB0\u5C94\u4E86\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "FILE-003", line: 4, text: "\u8FD9\u4E2A\u6587\u4EF6\u5DF2\u7ECF\u5173\u6389\u4E86\uFF0C\u4E0D\u80FD\u518D\u5173\u4E00\u6B21\u3002" }
                ]
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E3A\u4EC0\u4E48 `WRITEFILE` \u548C `CLOSEFILE` \u90FD\u8981\u628A\u6587\u4EF6\u540D\u518D\u5199\u4E00\u904D\uFF1F",
            options: [
              {
                key: "A",
                label: "\u56E0\u4E3A `OPENFILE` \u4E4B\u540E\u6587\u4EF6\u540D\u5C31\u5FD8\u4E86",
                correct: false,
                explanation: "\u6CA1\u5FD8\uFF0C\u6587\u4EF6\u4E00\u76F4\u5F00\u7740\u3002\u91CD\u5199\u6587\u4EF6\u540D\u662F\u4E3A\u4E86\u6307\u660E\u662F\u54EA\u4E00\u4E2A\uFF0C\u4E0D\u662F\u56E0\u4E3A\u5B83\u4E22\u4E86\u3002"
              },
              {
                key: "B",
                label: "\u56E0\u4E3A\u7A0B\u5E8F\u91CC\u53EF\u4EE5\u540C\u65F6\u5F00\u7740\u597D\u51E0\u4E2A\u6587\u4EF6\uFF0C\u6BCF\u4E00\u53E5\u90FD\u5F97\u8BF4\u6E05\u662F\u5BF9\u54EA\u4E00\u4E2A",
                correct: true,
                explanation: "\u5BF9\u3002\u4E00\u8FB9\u8BFB\u4E00\u4E2A\u6587\u4EF6\u4E00\u8FB9\u5199\u53E6\u4E00\u4E2A\u662F\u5F88\u5E38\u89C1\u7684\u505A\u6CD5\uFF0814.6 \u5C31\u8981\u8FD9\u4E48\u5E72\uFF09\uFF0C\u6240\u4EE5\u6BCF\u4E00\u53E5\u90FD\u5F97\u6307\u540D\u9053\u59D3\u3002"
              },
              {
                key: "C",
                label: "\u56E0\u4E3A\u6587\u4EF6\u540D\u6BCF\u6B21\u90FD\u53EF\u80FD\u4E0D\u4E00\u6837",
                correct: false,
                explanation: "\u540C\u4E00\u4E2A\u6587\u4EF6\u4ECE\u6253\u5F00\u5230\u5173\u6389\u5F53\u7136\u662F\u540C\u4E00\u4E2A\u540D\u5B57\u3002\u80FD\u53D8\u7684\u662F\u4F60\u6253\u5F00\u7684\u662F\u54EA\u4E2A\u6587\u4EF6\uFF0C\u4E0D\u662F\u5B83\u4E2D\u9014\u6539\u540D\u3002"
              },
              {
                key: "D",
                label: "\u53EA\u662F\u5199\u6CD5\u8981\u6C42\uFF0C\u7701\u6389\u4E5F\u80FD\u8DD1",
                correct: false,
                explanation: "\u7701\u4E0D\u6389\u3002\u4E0D\u5199\u6587\u4EF6\u540D\u8FD9\u51E0\u53E5\u5C31\u4E0D\u5B8C\u6574\uFF0C\u7F16\u8F91\u5668\u4F1A\u5F53\u6210\u5199\u9519\u4E86\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "14.3",
        title: "`READFILE`\uFF1A\u628A\u5B83\u8BFB\u56DE\u6765",
        syllabus: ["\xA710.3"],
        estimatedMinutes: 11,
        taughtFeatures: AFTER_14_3,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              '\u8BFB\u8981\u7528 `FOR READ` \u6253\u5F00\uFF1A`OPENFILE "Names.txt" FOR READ`\u3002\u8FD9\u79CD\u65B9\u5F0F\u4E0D\u6539\u52A8\u6587\u4EF6\u5185\u5BB9\uFF0C\u53EA\u662F\u4ECE\u7B2C 1 \u884C\u5F00\u59CB\u5F80\u4E0B\u770B\u3002',
              '`READFILE "Names.txt", Line` \u8BFB**\u5F53\u524D\u8FD9\u4E00\u884C**\uFF0C\u653E\u8FDB `Line` \u8FD9\u4E2A\u53D8\u91CF\u91CC\uFF0C\u7136\u540E\u4F4D\u7F6E\u5F80\u4E0B\u632A\u4E00\u884C\u3002\u4E0B\u4E00\u53E5 `READFILE` \u8BFB\u5230\u7684\u5C31\u662F\u4E0B\u4E00\u884C\u2014\u2014\u548C\u5199\u7684\u65F6\u5019\u4E00\u6837\uFF0C\u4F4D\u7F6E\u81EA\u5DF1\u8D70\u3002',
              "\u63A5\u6536\u7684\u90A3\u4E2A\u53D8\u91CF**\u5FC5\u987B\u662F `STRING`**\u3002\u6587\u4EF6\u91CC\u88C5\u7684\u5C31\u662F\u6587\u5B57\uFF0C\u54EA\u6015\u90A3\u4E00\u884C\u770B\u8D77\u6765\u662F\u4E2A\u6570\u5B57\uFF0C\u8BFB\u56DE\u6765\u4E5F\u662F\u4E00\u6BB5\u6587\u5B57\uFF1B\u5199\u6210 `INTEGER` \u53D8\u91CF\u63A5\uFF0C\u8FD0\u884C\u524D\u5C31\u88AB\u62E6\u4E0B\u6765\u3002",
              "\u8FD8\u6709\u4E00\u4EF6\u4E8B\u503C\u5F97\u5148\u8BB0\u4F4F\uFF1A**`FOR READ` \u6253\u5F00\u4E00\u4E2A\u4E0D\u5B58\u5728\u7684\u6587\u4EF6\u4F1A\u76F4\u63A5\u505C\u4E0B\u6765**\u3002\u6240\u4EE5\u4E0B\u9762\u6BCF\u4E2A\u4F8B\u5B50\u90FD\u662F\u5148\u5199\u518D\u8BFB\u2014\u2014\u8FD9\u4E00\u6BB5\u7A0B\u5E8F\u81EA\u5DF1\u628A\u6587\u4EF6\u51C6\u5907\u597D\uFF0C\u4E0D\u6307\u671B\u5B83\u672C\u6765\u5C31\u5728\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "`READFILE <\u6587\u4EF6>, <\u53D8\u91CF>` \u7684\u76EE\u6807\u53D8\u91CF\u5E94\u4E3A `STRING`\uFF08G\xA79.1\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u5148\u5199\u4E24\u884C\uFF0C\u518D\u4E00\u884C\u4E00\u884C\u8BFB\u56DE\u6765",
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
              { fromLine: 1, toLine: 4, text: "\u5148\u628A\u6587\u4EF6\u5199\u51FA\u6765\u518D\u5173\u6389\u3002\u4E0D\u5173\u5C31\u8BFB\u4E0D\u4E86\u2014\u2014\u6587\u4EF6\u540C\u4E00\u65F6\u523B\u53EA\u80FD\u5F00\u7740\u4E00\u4E2A\u3002" },
              { fromLine: 5, toLine: 5, text: "\u63A5\u6536\u7684\u53D8\u91CF\u662F `STRING`\u3002\u8FD9\u4E00\u884C\u5199\u6210 `INTEGER` \u7684\u8BDD\uFF0C\u7B2C 7 \u884C\u5C31\u8FC7\u4E0D\u53BB\u3002" },
              { fromLine: 7, toLine: 9, text: "\u4E24\u53E5 `READFILE` \u8BFB\u5230\u7684\u662F\u4E24\u884C\u4E0D\u540C\u7684\u5185\u5BB9\uFF1A\u4F4D\u7F6E\u5728\u7B2C\u4E00\u53E5\u4E4B\u540E\u81EA\u5DF1\u5F80\u4E0B\u8D70\u4E86\u4E00\u884C\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["1: Ada", "2: Bob"]
            }
          },
          {
            kind: "counterExample",
            title: "\u8BFB\u4E0D\u51FA\u6765\u7684\u4E24\u79CD\u60C5\u51B5",
            cases: [
              {
                title: "\u62FF `INTEGER` \u53D8\u91CF\u53BB\u63A5",
                code: [
                  "DECLARE N : INTEGER",
                  'OPENFILE "Nums.txt" FOR WRITE',
                  'WRITEFILE "Nums.txt", 5',
                  'CLOSEFILE "Nums.txt"',
                  'OPENFILE "Nums.txt" FOR READ',
                  'READFILE "Nums.txt", N',
                  'CLOSEFILE "Nums.txt"'
                ].join("\n"),
                note: "\u5199\u8FDB\u53BB\u7684 `5` \u5728\u6587\u4EF6\u91CC\u5DF2\u7ECF\u662F\u6587\u5B57\u4E86\u3002\u8BFB\u56DE\u6765\u53EA\u80FD\u8FDB `STRING`\u2014\u2014**\u6587\u4EF6\u4E0D\u8BB0\u5F97\u5B83\u539F\u6765\u662F\u4E2A\u6570**\uFF0C\u800C\u4F2A\u4EE3\u7801\u91CC\u6CA1\u6709\u628A\u8FD9\u6BB5\u6587\u5B57\u53D8\u56DE\u6570\u7684\u529E\u6CD5\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "FILE-002", line: 6, text: "\u8BFB\u6587\u4EF6\u53EA\u80FD\u8BFB\u8FDB `STRING` \u53D8\u91CF\u3002" }
                ]
              },
              {
                title: "\u6253\u5F00\u4E00\u4E2A\u4E0D\u5B58\u5728\u7684\u6587\u4EF6\u6765\u8BFB",
                code: [
                  "DECLARE Line : STRING",
                  'OPENFILE "Ghost.txt" FOR READ',
                  'READFILE "Ghost.txt", Line',
                  'CLOSEFILE "Ghost.txt"'
                ].join("\n"),
                note: "\u8FD9\u6BB5\u4EE3\u7801\u672C\u8EAB\u6CA1\u6709\u4EFB\u4F55\u5199\u6CD5\u95EE\u9898\uFF0C\u6240\u4EE5\u8FD0\u884C\u524D\u67E5\u4E0D\u51FA\u6765\u2014\u2014\u8981\u7B49\u771F\u7684\u53BB\u627E\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u53D1\u73B0\u6CA1\u6709\uFF0C\u7A0B\u5E8F\u624D\u505C\u5728\u6253\u5F00\u90A3\u4E00\u884C\u3002",
                expectRuntimeError: {
                  code: "RT2005",
                  line: 2,
                  text: "\u8981\u8BFB\u7684\u8FD9\u4E2A\u6587\u4EF6\u4E0D\u5B58\u5728\uFF0C\u7A0B\u5E8F\u505C\u5728\u6253\u5F00\u5B83\u7684\u90A3\u4E00\u884C\u3002"
                }
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: '\u8FDE\u7740\u5199\u4E24\u53E5 `READFILE "Names.txt", Line`\uFF0C\u7B2C\u4E8C\u53E5\u8BFB\u5230\u7684\u662F\u4EC0\u4E48\uFF1F',
            options: [
              {
                key: "A",
                label: "\u8FD8\u662F\u7B2C 1 \u884C\uFF0C\u56E0\u4E3A\u6CA1\u544A\u8BC9\u5B83\u5F80\u4E0B\u8D70",
                correct: false,
                explanation: "\u4F4D\u7F6E\u662F\u81EA\u5DF1\u8D70\u7684\u3002\u8BFB\u5B8C\u4E00\u884C\u4E4B\u540E\u5B83\u5C31\u6307\u5411\u4E0B\u4E00\u884C\u4E86\uFF0C\u4E0D\u9700\u8981\u53E6\u5916\u4E00\u53E5\u53BB\u63A8\u5B83\u3002"
              },
              {
                key: "B",
                label: "\u7B2C 2 \u884C",
                correct: true,
                explanation: "\u5BF9\u3002`READFILE` \u8BFB\u5B8C\u5F53\u524D\u884C\u4E4B\u540E\u4F4D\u7F6E\u52A0\u4E00\uFF0C\u6240\u4EE5\u8FDE\u7740\u8BFB\u5C31\u662F\u4E00\u884C\u4E00\u884C\u5F80\u4E0B\u3002\u5199\u7684\u65F6\u5019\u4E5F\u662F\u540C\u4E00\u5957\u89C4\u77E9\u3002"
              },
              {
                key: "C",
                label: "\u6574\u4E2A\u6587\u4EF6\u7684\u5185\u5BB9\u62FC\u5728\u4E00\u8D77",
                correct: false,
                explanation: "`READFILE` \u4E00\u6B21\u53EA\u8BFB\u4E00\u884C\uFF0C\u8BFB\u591A\u5C11\u884C\u5C31\u5F97\u5199\u591A\u5C11\u53E5\uFF08\u6216\u8005\u8BA9\u5FAA\u73AF\u53BB\u5199\uFF09\u3002"
              },
              {
                key: "D",
                label: "\u6700\u540E\u4E00\u884C",
                correct: false,
                explanation: "\u4F4D\u7F6E\u6BCF\u6B21\u53EA\u5F80\u4E0B\u632A\u4E00\u683C\uFF0C\u4E0D\u4F1A\u8DF3\u5230\u672B\u5C3E\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "14.3.1",
            title: "\u5B58\u4E0B\u6765\u518D\u5FF5\u4E00\u904D",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165 3 \u4E2A\u540D\u5B57\uFF0C\u9010\u4E2A\u5199\u8FDB\u4E00\u4E2A\u6587\u672C\u6587\u4EF6\uFF1B\u5199\u5B8C\u5173\u6389\uFF0C\u518D\u628A\u8FD9\u4E2A\u6587\u4EF6\u6253\u5F00\u8BFB\u56DE\u6765\uFF0C\u4E00\u884C\u4E00\u4E2A\u663E\u793A\u51FA\u6765\u3002\u6587\u4EF6\u540D\u81EA\u5DF1\u5B9A\u3002",
            ioSpec: {
              input: ["\u4E09\u884C\uFF0C\u5404\u4E00\u4E2A\u540D\u5B57\uFF08`STRING`\uFF09\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a name`"].join("\n"),
              output: "\u4E09\u884C\uFF0C\u5C31\u662F\u8BFB\u8FDB\u6765\u7684\u90A3\u4E09\u4E2A\u540D\u5B57\uFF0C\u987A\u5E8F\u4E0D\u53D8\u3002"
            },
            constraints: {
              require: [
                {
                  feature: "file.write",
                  reason: "\u9898\u76EE\u8981\u6C42\u5148\u628A\u540D\u5B57\u5199\u5230\u6587\u4EF6\u91CC\u53BB\uFF0C\u800C\u4E0D\u662F\u7559\u5728\u53D8\u91CF\u91CC\u3002"
                },
                {
                  feature: "file.read",
                  reason: "\u663E\u793A\u7684\u5185\u5BB9\u5FC5\u987B\u662F\u4ECE\u6587\u4EF6\u8BFB\u56DE\u6765\u7684\uFF0C\u4E0D\u80FD\u76F4\u63A5\u7528\u521A\u624D\u8F93\u5165\u7684\u53D8\u91CF\u3002"
                },
                {
                  feature: "file.close",
                  reason: "\u5199\u5B8C\u4E0D\u5173\uFF0C\u540C\u4E00\u4E2A\u6587\u4EF6\u5C31\u6253\u4E0D\u5F00\u6765\u8BFB\u3002"
                }
              ]
            },
            hints: [
              "\u4E09\u6BB5\uFF1A`FOR WRITE` \u5199\u4E09\u884C\u3001`CLOSEFILE`\u3001`FOR READ` \u8BFB\u4E09\u884C\u3002\u4E2D\u95F4\u90A3\u4E00\u53E5\u4E0D\u80FD\u7701\u3002",
              "\u5199\u548C\u8BFB\u90FD\u53EF\u4EE5\u653E\u5728 `FOR` \u5FAA\u73AF\u91CC\uFF0C\u56E0\u4E3A\u884C\u6570\u662F\u77E5\u9053\u7684\u2014\u2014\u6B63\u597D\u4E09\u884C\u3002",
              "\u63A5\u6536\u8BFB\u5230\u7684\u5185\u5BB9\u7684\u90A3\u4E2A\u53D8\u91CF\u5FC5\u987B\u662F `STRING`\u3002"
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
              "FOR I \u2190 1 TO 3",
              '   OUTPUT "Enter a name"',
              "   INPUT Name",
              '   WRITEFILE "Names.txt", Name',
              "NEXT I",
              'CLOSEFILE "Names.txt"',
              'OPENFILE "Names.txt" FOR READ',
              "FOR I \u2190 1 TO 3",
              '   READFILE "Names.txt", Name',
              "   OUTPUT Name",
              "NEXT I",
              'CLOSEFILE "Names.txt"'
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["Red", "Green", "Blue"], caseHint: "\u4E09\u4E2A\u666E\u901A\u7684\u540D\u5B57\u3002" },
              { id: "t2", kind: "normal", inputs: ["Two words", "X", "Something longer"], caseHint: "\u6709\u7684\u540D\u5B57\u91CC\u5E26\u7A7A\u683C\uFF0C\u6709\u7684\u53EA\u6709\u4E00\u4E2A\u5B57\u6BCD\u3002" },
              { id: "t3", kind: "boundary", inputs: ["Same", "Same", "Same"], caseHint: "\u4E09\u4E2A\u540D\u5B57\u5B8C\u5168\u4E00\u6837\uFF0C\u987A\u5E8F\u770B\u4E0D\u51FA\u6765\u4F46\u884C\u6570\u5F97\u5BF9\u3002" },
              { id: "t4", kind: "boundary", inputs: ["A", "B", "C"], caseHint: "\u4E09\u4E2A\u540D\u5B57\u90FD\u53EA\u6709\u4E00\u4E2A\u5B57\u6BCD\u3002" },
              { id: "t5", kind: "extreme", inputs: ["QWERTYUIOPASDFGHJKLZXCVBNM", "Z", "Mixed Case Name"], caseHint: "\u4E00\u4E2A\u7279\u522B\u957F\uFF0C\u4E00\u4E2A\u7279\u522B\u77ED\u3002" }
            ]
          }
        ]
      },
      {
        id: "14.4",
        title: "\u4E09\u79CD\u6A21\u5F0F\uFF1A`READ`\u3001`WRITE`\u3001`APPEND`",
        syllabus: ["\xA710.3"],
        estimatedMinutes: 10,
        taughtFeatures: AFTER_14_4,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "`OPENFILE` \u7684 `FOR` \u540E\u9762\u53EA\u6709\u4E09\u4E2A\u8BCD\u53EF\u5199\uFF0C\u5404\u7BA1\u4E00\u4EF6\u4E8B\u3002`READ`\uFF1A\u4ECE\u7B2C 1 \u884C\u5F00\u59CB\u5F80\u4E0B\u8BFB\uFF0C\u4E00\u4E2A\u5B57\u90FD\u4E0D\u6539\u3002`WRITE`\uFF1A**\u6253\u5F00\u7684\u4E00\u77AC\u95F4\u5C31\u628A\u539F\u6709\u5185\u5BB9\u5168\u90E8\u6E05\u7A7A**\uFF0C\u7136\u540E\u4ECE\u7B2C 1 \u884C\u5F00\u59CB\u5199\u3002`APPEND`\uFF1A\u4FDD\u7559\u539F\u6709\u5185\u5BB9\uFF0C\u4ECE\u6700\u540E\u4E00\u884C\u7684\u540E\u9762\u63A5\u7740\u5199\u3002",
              "`WRITE` \u90A3\u6761\u8981\u7279\u522B\u5C0F\u5FC3\uFF1A\u5B83\u4E0D\u662F\u300C\u51C6\u5907\u5F80\u91CC\u5199\u70B9\u4E1C\u897F\u300D\uFF0C\u800C\u662F\u300C\u8FD9\u4E2A\u6587\u4EF6\u4ECE\u73B0\u5728\u8D77\u91CD\u65B0\u6765\u8FC7\u300D\u3002\u60F3\u5728\u5DF2\u6709\u5185\u5BB9\u540E\u9762\u6DFB\u4E00\u884C\u5374\u5199\u6210\u4E86 `FOR WRITE`\uFF0C**\u539F\u6765\u7684\u4E1C\u897F\u4E00\u53E5\u63D0\u793A\u90FD\u4E0D\u7ED9\u5C31\u6CA1\u4E86**\u3002",
              "\u9009\u54EA\u4E2A\u7684\u5224\u636E\u5F88\u77ED\uFF1A**\u539F\u6765\u7684\u5185\u5BB9\u8FD8\u8981\u4E0D\u8981\uFF1F**\u4E0D\u8981\u5C31 `WRITE`\uFF0C\u8981\u7559\u7740\u5C31 `APPEND`\uFF0C\u53EA\u662F\u770B\u770B\u5C31 `READ`\u3002",
              "\u6A21\u5F0F\u4E00\u65E6\u9009\u5B9A\u5C31\u7BA1\u4F4F\u4E86\u8FD9\u6B21\u80FD\u505A\u4EC0\u4E48\uFF1A`FOR READ` \u6253\u5F00\u7684\u6587\u4EF6\u4E0D\u80FD `WRITEFILE`\uFF0C`FOR WRITE` \u6253\u5F00\u7684\u4E0D\u80FD `READFILE`\u3002\u8981\u6362\u7740\u6765\uFF0C\u5C31\u5F97\u5148 `CLOSEFILE` \u518D\u7528\u53E6\u4E00\u79CD\u65B9\u5F0F\u91CD\u65B0\u6253\u5F00\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "`WRITEFILE` \u4EC5\u7528\u4E8E `WRITE` \u6216 `APPEND` \u6A21\u5F0F\uFF1B\u540C\u4E00\u6587\u4EF6\u5E94\u4E00\u6B21\u53EA\u4EE5\u4E00\u79CD\u6A21\u5F0F\u6253\u5F00\uFF08G\xA79.1\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "`APPEND` \u7559\u7740\uFF0C`WRITE` \u62B9\u6389",
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
              { fromLine: 5, toLine: 6, text: "`APPEND` \u63A5\u5728\u540E\u9762\u5199\u3002\u6587\u4EF6\u73B0\u5728\u6709\u4E24\u884C\u3002" },
              { fromLine: 9, toLine: 12, text: "\u8BFB\u51FA\u6765\u786E\u5B9E\u662F\u4E24\u884C\uFF0C`first` \u8FD8\u5728\u3002" },
              { fromLine: 14, toLine: 15, text: "\u540C\u6837\u662F\u5199\u4E00\u884C\uFF0C\u8FD9\u6B21\u7528 `WRITE`\u2014\u2014\u6253\u5F00\u90A3\u4E00\u77AC\u95F4\u524D\u4E24\u884C\u5C31\u6CA1\u4E86\u3002" },
              { fromLine: 18, toLine: 19, text: "\u518D\u8BFB\uFF0C\u7B2C 1 \u884C\u5DF2\u7ECF\u662F `third`\u3002\u539F\u6765\u90A3\u4E24\u884C\u627E\u4E0D\u56DE\u6765\u4E86\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["after append 1: first", "after append 2: second", "after write 1: third"]
            }
          },
          {
            kind: "counterExample",
            title: "\u7528 `FOR READ` \u6253\u5F00\u5374\u60F3\u5F80\u91CC\u5199",
            cases: [
              {
                code: [
                  'OPENFILE "Log.txt" FOR WRITE',
                  'CLOSEFILE "Log.txt"',
                  'OPENFILE "Log.txt" FOR READ',
                  'WRITEFILE "Log.txt", "x"',
                  'CLOSEFILE "Log.txt"'
                ].join("\n"),
                note: "\u6253\u5F00\u7684\u65B9\u5F0F\u8BF4\u4E86\u8FD9\u6B21\u53EA\u8BFB\uFF0C\u90A3\u8FD9\u6B21\u5C31\u53EA\u80FD\u8BFB\u3002\u60F3\u5199\u5C31\u5148\u5173\u6389\u3001\u518D\u7528 `FOR WRITE` \u6216 `FOR APPEND` \u6253\u5F00\u4E00\u6B21\u3002",
                expectDiagnostics: [
                  { severity: "error", ruleId: "FILE-003", line: 4, text: "\u8FD9\u4E2A\u6587\u4EF6\u662F\u6309\u53EA\u8BFB\u65B9\u5F0F\u6253\u5F00\u7684\uFF0C\u5199\u4E0D\u8FDB\u53BB\u3002" }
                ]
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E00\u4E2A\u6587\u4EF6\u91CC\u5DF2\u7ECF\u6709\u4E09\u884C\u3002\u7528 `FOR WRITE` \u6253\u5F00\u5B83\u3001\u4EC0\u4E48\u90FD\u4E0D\u5199\u5C31 `CLOSEFILE`\uFF0C\u6587\u4EF6\u91CC\u8FD8\u5269\u51E0\u884C\uFF1F",
            options: [
              {
                key: "A",
                label: "\u56DB\u884C\uFF0C\u591A\u51FA\u4E00\u884C\u7A7A\u7684",
                correct: false,
                explanation: "\u6CA1\u5199\u5C31\u4E0D\u4F1A\u591A\u51FA\u884C\u3002`WRITEFILE` \u624D\u4F1A\u6DFB\u884C\u3002"
              },
              {
                key: "B",
                label: "\u7F16\u8F91\u5668\u4F1A\u62E6\u4F4F\u8FD9\u79CD\u6CA1\u610F\u4E49\u7684\u64CD\u4F5C",
                correct: false,
                explanation: "\u4E0D\u62E6\u3002\u300C\u6253\u5F00\u51C6\u5907\u5199\uFF0C\u7ED3\u679C\u53D1\u73B0\u6CA1\u4EC0\u4E48\u53EF\u5199\u300D\u5728\u7A0B\u5E8F\u91CC\u5F88\u6B63\u5E38\uFF0C\u7F16\u8F91\u5668\u6CA1\u6CD5\u5224\u65AD\u4F60\u662F\u4E0D\u662F\u771F\u60F3\u6E05\u7A7A\u3002"
              },
              {
                key: "C",
                label: "\u4E09\u884C\uFF0C\u56E0\u4E3A\u6CA1\u5199\u4E1C\u897F\u8FDB\u53BB",
                correct: false,
                explanation: "\u6E05\u7A7A\u53D1\u751F\u5728**\u6253\u5F00**\u7684\u90A3\u4E00\u523B\uFF0C\u4E0D\u662F\u5199\u7684\u65F6\u5019\u3002\u4E00\u53E5 `WRITEFILE` \u90FD\u6CA1\u6709\uFF0C\u90A3\u4E09\u884C\u7167\u6837\u5DF2\u7ECF\u6CA1\u4E86\u3002"
              },
              {
                key: "D",
                label: "\u96F6\u884C",
                correct: true,
                explanation: "\u5BF9\u3002`FOR WRITE` \u4E00\u6253\u5F00\u5C31\u628A\u6587\u4EF6\u6E05\u7A7A\u3002\u8FD9\u4E5F\u662F\u300C\u60F3\u6DFB\u4E00\u884C\u5374\u5199\u6210 `WRITE`\u300D\u7279\u522B\u5371\u9669\u7684\u539F\u56E0\u2014\u2014\u6CA1\u6709\u4EFB\u4F55\u63D0\u793A\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "14.5",
        title: "`EOF`\uFF1A\u8BFB\u5230\u54EA\u513F\u7B97\u5B8C",
        syllabus: ["\xA710.3"],
        estimatedMinutes: 11,
        taughtFeatures: AFTER_14_5,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E0A\u9762\u90A3\u4E9B\u4F8B\u5B50\u90FD\u77E5\u9053\u6587\u4EF6\u91CC\u6709\u51E0\u884C\uFF0C\u6240\u4EE5\u7528 `FOR` \u5C31\u591F\u4E86\u3002\u53EF\u771F\u5B9E\u7684\u6587\u4EF6\u901A\u5E38**\u4E0D\u77E5\u9053\u6709\u51E0\u884C**\u2014\u2014\u90A3\u662F\u522B\u4EBA\u5199\u8FDB\u53BB\u7684\uFF0C\u6216\u8005\u4E0A\u6B21\u8FD0\u884C\u7559\u4E0B\u7684\u3002",
              '`EOF("Names.txt")` \u56DE\u7B54\u7684\u5C31\u662F\u8FD9\u4E2A\u95EE\u9898\uFF1A\u5F53\u524D\u4F4D\u7F6E\u5DF2\u7ECF\u8D8A\u8FC7\u6700\u540E\u4E00\u884C\u4E86\u5417\uFF1F\u8D8A\u8FC7\u4E86\u8FD8 `TRUE`\uFF0C\u8FD8\u6709\u884C\u53EF\u8BFB\u5C31\u662F `FALSE`\u3002\u540D\u5B57\u6765\u81EA **\u6587\u4EF6\u672B\u5C3E\uFF08end of file\uFF09**\u3002',
              '\u6240\u4EE5\u8BFB\u6574\u4E2A\u6587\u4EF6\u7684\u6807\u51C6\u5199\u6CD5\u662F `WHILE NOT EOF("Names.txt")`\uFF1A\u8FD8\u6CA1\u5230\u672B\u5C3E\u5C31\u7EE7\u7EED\u8BFB\u4E00\u884C\u3002\u8FD9\u662F\u7B2C 5 \u7AE0\u8BF4\u7684\u300C\u6B21\u6570\u4E8B\u5148\u4E0D\u77E5\u9053\u300D\uFF0C\u800C\u4E14**\u4E00\u884C\u90FD\u6CA1\u6709\u7684\u6587\u4EF6\u5E94\u8BE5\u4E00\u6B21\u90FD\u4E0D\u8BFB**\u2014\u2014\u6B63\u597D\u662F\u524D\u6D4B\u5FAA\u73AF\u3002',
              "\u5C11\u4E86\u8FD9\u9053\u5224\u65AD\uFF0C\u8BFB\u5230\u672B\u5C3E\u4E4B\u540E\u518D\u8BFB\u4E00\u53E5\uFF0C\u7A0B\u5E8F\u5C31\u505C\u5728\u90A3\u4E00\u884C\u3002\u6587\u4EF6\u91CC\u5230\u5E95\u6709\u51E0\u884C\u4E0D\u662F\u4F60\u80FD\u5047\u8BBE\u7684\u4E8B\uFF0C**\u80FD\u8BFB\u591A\u5C11\u884C\u8981\u95EE `EOF`\uFF0C\u4E0D\u8981\u9760\u8BB0**\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "`EOF(<\u6587\u4EF6>)` \u8FD4\u56DE `BOOLEAN`\uFF0C\u7528\u4E8E\u5224\u65AD\u662F\u5426\u5DF2\u5230\u6587\u4EF6\u672B\u5C3E\uFF08G\xA79.1\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u8BFB\u5B8C\u6574\u4E2A\u6587\u4EF6\uFF0C\u987A\u4FBF\u6570\u6570\u6709\u51E0\u884C",
            fileName: "Example_14_5_a.pseudocode",
            code: [
              "DECLARE Line : STRING",
              "DECLARE Count : INTEGER",
              'OPENFILE "Names.txt" FOR WRITE',
              'WRITEFILE "Names.txt", "Ada"',
              'WRITEFILE "Names.txt", "Bob"',
              'WRITEFILE "Names.txt", "Cal"',
              'CLOSEFILE "Names.txt"',
              "Count \u2190 0",
              'OPENFILE "Names.txt" FOR READ',
              'WHILE NOT EOF("Names.txt")',
              '   READFILE "Names.txt", Line',
              "   Count \u2190 Count + 1",
              '   OUTPUT Count, ": ", Line',
              "ENDWHILE",
              'CLOSEFILE "Names.txt"',
              'OUTPUT "Total: ", Count'
            ].join("\n"),
            annotations: [
              { fromLine: 10, toLine: 14, text: "\u5FAA\u73AF\u7684\u6761\u4EF6\u53EA\u770B `EOF`\u3002\u8FD9\u6BB5\u4EE3\u7801\u4E0D\u77E5\u9053\u4E5F\u4E0D\u9700\u8981\u77E5\u9053\u6587\u4EF6\u91CC\u6709\u4E09\u884C\u2014\u2014\u6362\u6210\u4E09\u5341\u884C\u5B83\u4E00\u4E2A\u5B57\u90FD\u4E0D\u7528\u6539\u3002" },
              { fromLine: 11, toLine: 11, text: "`READFILE` \u5728\u5FAA\u73AF\u4F53\u7684\u7B2C\u4E00\u53E5\u3002\u4F4D\u7F6E\u6BCF\u8BFB\u4E00\u884C\u5C31\u5F80\u4E0B\u8D70\uFF0C\u6240\u4EE5 `EOF` \u8FDF\u65E9\u4F1A\u53D8\u6210 `TRUE`\u3002" },
              { fromLine: 16, toLine: 16, text: "\u884C\u6570\u662F\u6570\u51FA\u6765\u7684\uFF0C\u4E0D\u662F\u4E8B\u5148\u77E5\u9053\u7684\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["1: Ada", "2: Bob", "3: Cal", "Total: 3"]
            }
          },
          {
            kind: "counterExample",
            title: "\u591A\u8BFB\u4E86\u4E00\u884C",
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
                note: "\u6587\u4EF6\u91CC\u53EA\u6709\u4E00\u884C\uFF0C\u5374\u8BFB\u4E86\u4E24\u53E5\u3002\u7B2C\u4E00\u53E5\u597D\u597D\u7684\uFF0C\u7B2C\u4E8C\u53E5\u5DF2\u7ECF\u6CA1\u6709\u884C\u53EF\u8BFB\u2014\u2014**\u7A0B\u5E8F\u4F1A\u5148\u628A\u7B2C\u4E00\u884C\u663E\u793A\u51FA\u6765\u518D\u505C\u4E0B\u6765**\uFF0C\u6240\u4EE5\u5C4F\u5E55\u4E0A\u770B\u5F97\u5230\u4E00\u90E8\u5206\u7ED3\u679C\uFF0C\u5F88\u5BB9\u6613\u8BEF\u4EE5\u4E3A\u6574\u6BB5\u90FD\u8DD1\u5B8C\u4E86\u3002",
                expectRuntimeError: {
                  code: "RT2002",
                  line: 8,
                  text: "\u5DF2\u7ECF\u8BFB\u5230\u6587\u4EF6\u672B\u5C3E\u4E86\uFF0C\u8FD9\u4E00\u53E5\u6CA1\u6709\u884C\u53EF\u8BFB\u3002"
                }
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E00\u4E2A\u521A\u7528 `FOR WRITE` \u521B\u5EFA\u3001\u4E00\u884C\u90FD\u6CA1\u5199\u7684\u7A7A\u6587\u4EF6\uFF0C\u7528 `FOR READ` \u6253\u5F00\u4E4B\u540E `EOF` \u662F\u4EC0\u4E48\uFF1F",
            options: [
              {
                key: "A",
                label: "`TRUE`",
                correct: true,
                explanation: "\u5BF9\u3002\u6240\u4EE5 `WHILE NOT EOF(...)` \u5BF9\u7A7A\u6587\u4EF6\u4E00\u6B21\u90FD\u4E0D\u4F1A\u8FDB\u5FAA\u73AF\u2014\u2014\u8FD9\u6B63\u662F\u5B83\u8BE5\u7528\u524D\u6D4B\u5FAA\u73AF\u800C\u4E0D\u662F `REPEAT` \u7684\u539F\u56E0\u3002"
              },
              {
                key: "B",
                label: "\u7A0B\u5E8F\u4F1A\u56E0\u4E3A\u6587\u4EF6\u662F\u7A7A\u7684\u800C\u505C\u4E0B\u6765",
                correct: false,
                explanation: "\u7A7A\u6587\u4EF6\u662F\u5B8C\u5168\u6B63\u5E38\u7684\u6587\u4EF6\uFF0C\u6253\u5F00\u5B83\u6CA1\u6709\u4EFB\u4F55\u95EE\u9898\u3002\u505C\u4E0B\u6765\u7684\u662F\u300C\u5DF2\u7ECF\u5230\u672B\u5C3E\u8FD8\u786C\u8BFB\u4E00\u53E5\u300D\u3002"
              },
              {
                key: "C",
                label: "\u8981\u770B\u8FD9\u4E2A\u6587\u4EF6\u4E4B\u524D\u6709\u6CA1\u6709\u5185\u5BB9",
                correct: false,
                explanation: "`FOR WRITE` \u6253\u5F00\u7684\u90A3\u4E00\u523B\u5C31\u628A\u539F\u6709\u5185\u5BB9\u6E05\u7A7A\u4E86\uFF0C\u6240\u4EE5\u73B0\u5728\u5B83\u786E\u5B9E\u4E00\u884C\u90FD\u6CA1\u6709\u3002"
              },
              {
                key: "D",
                label: "`FALSE`\uFF0C\u8981\u8BFB\u4E00\u6B21\u624D\u77E5\u9053",
                correct: false,
                explanation: "\u4E0D\u7528\u8BFB\u5C31\u77E5\u9053\u3002`EOF` \u95EE\u7684\u662F\u300C\u5F53\u524D\u4F4D\u7F6E\u6709\u6CA1\u6709\u8D8A\u8FC7\u6700\u540E\u4E00\u884C\u300D\uFF0C\u7A7A\u6587\u4EF6\u4E00\u6253\u5F00\u5C31\u5DF2\u7ECF\u8D8A\u8FC7\u4E86\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "14.5.1",
            title: "\u5B58\u4E0B\u6765\uFF0C\u518D\u7F16\u53F7\u5FF5\u4E00\u904D",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165 4 \u884C\u6587\u5B57\uFF0C\u9010\u884C\u5199\u8FDB\u4E00\u4E2A\u6587\u672C\u6587\u4EF6\uFF1B\u5199\u5B8C\u5173\u6389\uFF0C\u518D\u7528 `EOF` \u63A7\u5236\u7684\u5FAA\u73AF\u628A\u6574\u4E2A\u6587\u4EF6\u8BFB\u56DE\u6765\uFF0C\u4E00\u884C\u4E00\u4E2A\u663E\u793A\uFF0C\u6BCF\u884C\u524D\u9762\u52A0\u4E0A\u884C\u53F7\u3002**\u4E0D\u8981\u7528 `FOR` \u5FAA\u73AF\u53BB\u8BFB**\u2014\u2014\u8BFB\u7684\u65F6\u5019\u5C31\u5F53\u4F5C\u4E0D\u77E5\u9053\u6587\u4EF6\u91CC\u6709\u51E0\u884C\u3002",
            ioSpec: {
              input: ["\u56DB\u884C\u6587\u5B57\uFF08`STRING`\uFF09\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a line`"].join("\n"),
              output: ["\u56DB\u884C\uFF0C\u5199\u6210\uFF1A", "`<\u884C\u53F7>: <\u90A3\u4E00\u884C\u7684\u5185\u5BB9>`", "\u884C\u53F7\u4ECE 1 \u5F00\u59CB\uFF0C\u5192\u53F7\u540E\u9762\u4E00\u4E2A\u7A7A\u683C\u3002"].join("\n")
            },
            constraints: {
              require: [
                {
                  feature: "builtin.eof",
                  reason: "\u9898\u76EE\u8981\u6C42\u8BFB\u7684\u65F6\u5019\u4E0D\u8BB8\u5047\u8BBE\u6587\u4EF6\u6709\u51E0\u884C\uFF0C\u53EA\u80FD\u95EE `EOF`\u3002"
                },
                {
                  feature: "loop.while",
                  reason: "\u4E00\u884C\u90FD\u6CA1\u6709\u7684\u6587\u4EF6\u5E94\u8BE5\u4E00\u6B21\u90FD\u4E0D\u8BFB\uFF0C\u6240\u4EE5\u8981\u7528\u5148\u770B\u6761\u4EF6\u7684\u5FAA\u73AF\u3002"
                },
                {
                  feature: "file.read",
                  reason: "\u663E\u793A\u7684\u5185\u5BB9\u5FC5\u987B\u662F\u4ECE\u6587\u4EF6\u8BFB\u56DE\u6765\u7684\u3002"
                }
              ]
            },
            hints: [
              "\u5199\u7684\u65F6\u5019\u884C\u6570\u662F\u77E5\u9053\u7684\uFF0C\u53EF\u4EE5\u7528 `FOR`\uFF1B\u8BFB\u7684\u65F6\u5019\u4E0D\u77E5\u9053\uFF0C\u8981\u7528 `WHILE NOT EOF(...)`\u3002",
              "\u884C\u53F7\u7528\u4E00\u4E2A\u4ECE 0 \u5F00\u59CB\u7684\u8BA1\u6570\u53D8\u91CF\uFF0C\u6BCF\u8BFB\u4E00\u884C\u52A0\u4E00\u3002",
              "\u5199\u5B8C\u4E00\u5B9A\u8981 `CLOSEFILE`\uFF0C\u5426\u5219\u540C\u4E00\u4E2A\u6587\u4EF6\u6253\u4E0D\u5F00\u6765\u8BFB\u3002"
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
              "FOR I \u2190 1 TO 4",
              '   OUTPUT "Enter a line"',
              "   INPUT Line",
              '   WRITEFILE "Notes.txt", Line',
              "NEXT I",
              'CLOSEFILE "Notes.txt"',
              "Count \u2190 0",
              'OPENFILE "Notes.txt" FOR READ',
              'WHILE NOT EOF("Notes.txt")',
              '   READFILE "Notes.txt", Line',
              "   Count \u2190 Count + 1",
              '   OUTPUT Count, ": ", Line',
              "ENDWHILE",
              'CLOSEFILE "Notes.txt"'
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["one", "two", "three", "four"], caseHint: "\u56DB\u884C\u666E\u901A\u7684\u6587\u5B57\u3002" },
              { id: "t2", kind: "normal", inputs: ["a b c", "d", "e f", "g h i j"], caseHint: "\u6709\u7684\u884C\u91CC\u5E26\u7A7A\u683C\uFF0C\u957F\u77ED\u4E0D\u4E00\u3002" },
              { id: "t3", kind: "boundary", inputs: ["x", "x", "x", "x"], caseHint: "\u56DB\u884C\u5185\u5BB9\u5B8C\u5168\u4E00\u6837\uFF0C\u53EA\u6709\u884C\u53F7\u80FD\u533A\u5206\u3002" },
              { id: "t4", kind: "boundary", inputs: ["1", "2", "3", "4"], caseHint: "\u5199\u8FDB\u53BB\u7684\u770B\u7740\u50CF\u6570\u5B57\uFF0C\u8BFB\u56DE\u6765\u4ECD\u7136\u662F\u6587\u5B57\u3002" },
              { id: "t5", kind: "extreme", inputs: ["Q", "WERTYUIOPASDFGHJKLZXCVBNM", "e", "R"], caseHint: "\u4E00\u884C\u7279\u522B\u957F\uFF0C\u5176\u4F59\u90FD\u53EA\u6709\u4E00\u4E2A\u5B57\u6BCD\u3002" }
            ]
          }
        ]
      },
      {
        id: "14.6",
        title: "\u5B8C\u6574\u5904\u7406\u4E00\u4E2A\u6587\u4EF6",
        syllabus: ["\xA710.3"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_14_5,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u771F\u6B63\u7528\u5F97\u4E0A\u6587\u4EF6\u7684\u7A0B\u5E8F\u591A\u534A\u957F\u6210\u540C\u4E00\u4E2A\u6837\u5B50\uFF1A**\u8BFB\u4E00\u4E2A\u6587\u4EF6 \u2192 \u4E00\u884C\u4E00\u884C\u5904\u7406 \u2192 \u628A\u7ED3\u679C\u5199\u8FDB\u53E6\u4E00\u4E2A\u6587\u4EF6**\u3002\u4E2D\u95F4\u90A3\u4E00\u6B65\u53EF\u4EE5\u662F\u7B5B\u9009\u3001\u7EDF\u8BA1\u3001\u6539\u5199\uFF0C\u5F62\u72B6\u90FD\u4E00\u6837\u3002",
              "\u5173\u952E\u5728\u4E8E**\u4E24\u4E2A\u6587\u4EF6\u540C\u65F6\u5F00\u7740**\uFF1A\u4E00\u4E2A `FOR READ`\uFF0C\u4E00\u4E2A `FOR WRITE`\u3002\u6BCF\u4E00\u53E5 `READFILE` / `WRITEFILE` \u90FD\u5199\u7740\u81EA\u5DF1\u7684\u6587\u4EF6\u540D\uFF0C\u6240\u4EE5\u4E92\u4E0D\u5E72\u6270\u2014\u2014\u8FD9\u5C31\u662F 14.2 \u91CC\u8BF4\u7684\u300C\u6BCF\u4E00\u53E5\u90FD\u8981\u6307\u540D\u9053\u59D3\u300D\u7684\u7528\u5904\u3002",
              "**\u4E0D\u8981\u4E00\u8FB9\u8BFB\u4E00\u8FB9\u5F80\u540C\u4E00\u4E2A\u6587\u4EF6\u91CC\u5199\u3002**\u540C\u4E00\u4E2A\u6587\u4EF6\u540C\u4E00\u65F6\u523B\u53EA\u80FD\u5F00\u7740\u4E00\u4E2A\uFF0C\u800C\u4E14 `FOR WRITE` \u4E00\u6253\u5F00\u5C31\u628A\u4F60\u6B63\u8981\u8BFB\u7684\u5185\u5BB9\u6E05\u7A7A\u4E86\u3002\u8981\u6539\u4E00\u4E2A\u6587\u4EF6\uFF0C\u505A\u6CD5\u662F\u300C\u8BFB\u65E7\u7684\u3001\u5199\u65B0\u7684\u300D\u3002",
              "\u6700\u540E\u522B\u5FD8\u4E86\u4E24\u4E2A\u6587\u4EF6\u90FD\u8981 `CLOSEFILE`\u3002\u5199\u7684\u90A3\u4E2A\u4E0D\u5173\uFF0C\u63A5\u4E0B\u6765\u60F3\u8BFB\u5B83\u5C31\u6253\u4E0D\u5F00\u3002"
            ]
          },
          {
            kind: "example",
            title: "\u628A\u957F\u7684\u90A3\u4E9B\u6311\u8FDB\u53E6\u4E00\u4E2A\u6587\u4EF6",
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
              { fromLine: 7, toLine: 8, text: "\u4E24\u4E2A\u6587\u4EF6\u540C\u65F6\u5F00\u7740\uFF0C\u4E00\u4E2A\u53EA\u8BFB\u4E00\u4E2A\u53EA\u5199\u3002\u540D\u5B57\u4E0D\u540C\uFF0C\u6240\u4EE5\u4E92\u4E0D\u5F71\u54CD\u3002" },
              { fromLine: 9, toLine: 14, text: "\u6574\u4E2A\u5904\u7406\u5C31\u8FD9\u4E00\u4E2A\u5FAA\u73AF\uFF1A\u8BFB\u4E00\u884C\u3001\u5224\u65AD\u3001\u591F\u683C\u7684\u5199\u51FA\u53BB\u3002`EOF` \u7BA1\u7684\u662F\u8BFB\u7684\u90A3\u4E2A\u6587\u4EF6\u3002" },
              { fromLine: 15, toLine: 16, text: "\u4E24\u4E2A\u90FD\u8981\u5173\u3002\u4E0B\u9762\u8981\u8BFB `Out.txt`\uFF0C\u4E0D\u5173\u5C31\u6253\u4E0D\u5F00\u3002" },
              { fromLine: 17, toLine: 22, text: "\u628A\u7ED3\u679C\u5FF5\u51FA\u6765\u53EA\u662F\u4E3A\u4E86\u770B\u5F97\u89C1\u2014\u2014\u771F\u6B63\u7684\u6210\u679C\u662F `Out.txt` \u8FD9\u4E2A\u6587\u4EF6\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["ada", "cathy"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u60F3\u628A\u4E00\u4E2A\u6587\u4EF6\u91CC\u7684\u6BCF\u4E00\u884C\u90FD\u6539\u6210\u5927\u5199\u518D\u5B58\u56DE\u53BB\u3002\u4E0B\u9762\u54EA\u79CD\u505A\u6CD5\u53EF\u884C\uFF1F",
            options: [
              {
                key: "A",
                label: "\u5148 `FOR READ` \u8BFB\u5B8C\u5168\u90E8\u5185\u5BB9\uFF0C\u518D `FOR WRITE` \u6253\u5F00\u540C\u4E00\u4E2A\u6587\u4EF6\u5199\u56DE\u53BB",
                correct: false,
                explanation: "\u8FD9\u4E2A\u601D\u8DEF\u662F\u5BF9\u7684\uFF0C\u4F46\u5F97\u5148\u628A\u8BFB\u5230\u7684\u5185\u5BB9\u5B58\u8FDB\u6570\u7EC4\u4E4B\u7C7B\u7684\u5730\u65B9\u2014\u2014\u8BFB\u5B8C\u5FC5\u987B\u5148 `CLOSEFILE`\uFF0C\u800C\u6587\u4EF6\u91CC\u7684\u5185\u5BB9\u5728 `FOR WRITE` \u6253\u5F00\u90A3\u4E00\u523B\u5C31\u6CA1\u4E86\u3002"
              },
              {
                key: "B",
                label: "\u540C\u65F6\u7528 `FOR READ` \u548C `FOR WRITE` \u6253\u5F00\u8FD9\u4E00\u4E2A\u6587\u4EF6\uFF0C\u8FB9\u8BFB\u8FB9\u5199\u56DE\u53BB",
                correct: false,
                explanation: "\u540C\u4E00\u4E2A\u6587\u4EF6\u540C\u4E00\u65F6\u523B\u53EA\u80FD\u5F00\u7740\u4E00\u4E2A\uFF0C\u8FD9\u4E00\u6B65\u5C31\u8FC7\u4E0D\u53BB\uFF1B\u5C31\u7B97\u8FC7\u5F97\u53BB\uFF0C`FOR WRITE` \u4E00\u6253\u5F00\u5C31\u628A\u8981\u8BFB\u7684\u5185\u5BB9\u6E05\u7A7A\u4E86\u3002"
              },
              {
                key: "C",
                label: "\u8BFB\u539F\u6587\u4EF6\u3001\u5199\u4E00\u4E2A\u65B0\u6587\u4EF6\uFF0C\u5904\u7406\u5B8C\u518D\u628A\u65B0\u6587\u4EF6\u5F53\u4F5C\u7ED3\u679C",
                correct: true,
                explanation: "\u5BF9\u3002\u300C\u8BFB\u65E7\u7684\u3001\u5199\u65B0\u7684\u300D\u662F\u5904\u7406\u6587\u4EF6\u7684\u6807\u51C6\u5F62\u72B6\uFF0C\u4E24\u4E2A\u6587\u4EF6\u540C\u65F6\u5F00\u7740\uFF0C\u5404\u5E72\u5404\u7684\u3002"
              },
              {
                key: "D",
                label: "\u7528 `FOR APPEND` \u6253\u5F00\u539F\u6587\u4EF6\uFF0C\u628A\u5927\u5199\u7684\u884C\u63A5\u5728\u540E\u9762",
                correct: false,
                explanation: "\u90A3\u6837\u6587\u4EF6\u91CC\u4F1A\u53D8\u6210\u300C\u539F\u6765\u7684\u5C0F\u5199 + \u65B0\u52A0\u7684\u5927\u5199\u300D\uFF0C\u539F\u6765\u90A3\u4E9B\u4E00\u884C\u90FD\u6CA1\u5C11\u3002"
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
        title: "\u6311\u51FA\u957F\u540D\u5B57",
        statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165 5 \u4E2A\u540D\u5B57\u5199\u8FDB\u4E00\u4E2A\u6587\u672C\u6587\u4EF6\uFF1B\u7136\u540E\u628A\u8FD9\u4E2A\u6587\u4EF6\u8BFB\u56DE\u6765\uFF0C\u628A**\u957F\u5EA6 5 \u4E2A\u5B57\u7B26\u53CA\u4EE5\u4E0A**\u7684\u540D\u5B57\u6311\u51FA\u6765\u5199\u8FDB\u7B2C\u4E8C\u4E2A\u6587\u4EF6\uFF1B\u6700\u540E\u628A\u7B2C\u4E8C\u4E2A\u6587\u4EF6\u8BFB\u51FA\u6765\u663E\u793A\uFF0C\u5E76\u5728\u672B\u5C3E\u62A5\u51FA\u6311\u4E2D\u4E86\u51E0\u4E2A\u3002\u8BFB\u6587\u4EF6\u65F6\u90FD\u4E0D\u8BB8\u5047\u8BBE\u6709\u51E0\u884C\u3002",
        ioSpec: {
          input: ["\u4E94\u884C\uFF0C\u5404\u4E00\u4E2A\u540D\u5B57\uFF08`STRING`\uFF09\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a name`"].join("\n"),
          output: [
            "\u5148\u662F\u6311\u4E2D\u7684\u90A3\u4E9B\u540D\u5B57\uFF0C\u4E00\u884C\u4E00\u4E2A\uFF0C\u987A\u5E8F\u548C\u8F93\u5165\u65F6\u4E00\u6837\uFF1B\u6700\u540E\u4E00\u884C\u5199\u6210\uFF1A",
            "`Count: <\u6311\u4E2D\u7684\u4E2A\u6570>`",
            "\u5192\u53F7\u540E\u9762\u4E00\u4E2A\u7A7A\u683C\u3002\u4E00\u4E2A\u90FD\u6CA1\u6311\u4E2D\u65F6\u5C31\u53EA\u6709\u6700\u540E\u8FD9\u4E00\u884C\u3002"
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
          "\u4E09\u6BB5\uFF1A\u5199\u7B2C\u4E00\u4E2A\u6587\u4EF6\u3001\u628A\u7B2C\u4E00\u4E2A\u7B5B\u8FDB\u7B2C\u4E8C\u4E2A\u3001\u628A\u7B2C\u4E8C\u4E2A\u5FF5\u51FA\u6765\u3002\u6BCF\u6BB5\u4E4B\u95F4\u90FD\u8981\u628A\u7528\u5B8C\u7684\u6587\u4EF6\u5173\u6389\u3002",
          "\u7B5B\u9009\u90A3\u4E00\u6BB5\u4E24\u4E2A\u6587\u4EF6\u540C\u65F6\u5F00\u7740\uFF0C\u4E00\u4E2A `FOR READ` \u4E00\u4E2A `FOR WRITE`\uFF0C\u6BCF\u4E00\u53E5\u90FD\u5199\u6E05\u662F\u54EA\u4E00\u4E2A\u3002",
          "\u4E2A\u6570\u5728\u5FF5\u7B2C\u4E8C\u4E2A\u6587\u4EF6\u7684\u65F6\u5019\u987A\u624B\u6570\u5C31\u884C\uFF0C\u4E0D\u5FC5\u5728\u7B5B\u9009\u7684\u65F6\u5019\u6570\u3002"
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
          "FOR I \u2190 1 TO 5",
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
          "Count \u2190 0",
          'OPENFILE "Long.txt" FOR READ',
          'WHILE NOT EOF("Long.txt")',
          '   READFILE "Long.txt", Name',
          "   Count \u2190 Count + 1",
          "   OUTPUT Name",
          "ENDWHILE",
          'CLOSEFILE "Long.txt"',
          'OUTPUT "Count: ", Count'
        ].join("\n"),
        tests: [
          { id: "t1", kind: "normal", inputs: ["Alice", "Bo", "Charlie", "Di", "Edward"], caseHint: "\u957F\u77ED\u63BA\u7740\u6765\uFF0C\u6311\u4E2D\u7684\u4E0D\u6B62\u4E00\u4E2A\u3002" },
          { id: "t2", kind: "boundary", inputs: ["Anna", "Bob", "Cy", "Dee", "Eli"], caseHint: "\u4E00\u4E2A\u90FD\u591F\u4E0D\u7740\u957F\u5EA6\u95E8\u69DB\u3002" },
          { id: "t3", kind: "boundary", inputs: ["Abcde", "Fghij", "Klmno", "Pqrst", "Uvwxy"], caseHint: "\u4E94\u4E2A\u540D\u5B57\u90FD\u6B63\u597D\u8E29\u5728\u957F\u5EA6\u95E8\u69DB\u4E0A\u3002" },
          { id: "t4", kind: "normal", inputs: ["Ann", "Two words", "Bo", "Cy", "Di"], caseHint: "\u6311\u4E2D\u7684\u53EA\u6709\u4E00\u4E2A\uFF0C\u800C\u4E14\u91CC\u9762\u5E26\u7A7A\u683C\u3002" },
          { id: "t5", kind: "extreme", inputs: ["A", "QWERTYUIOPASDFGHJKLZXCVBNM", "B", "C", "D"], caseHint: "\u4E00\u4E2A\u7279\u522B\u957F\uFF0C\u5176\u4F59\u90FD\u53EA\u6709\u4E00\u4E2A\u5B57\u6BCD\u3002" }
        ]
      }
    ]
  };

  // packages/teaching-content/src/chapter-15.ts
  var AFTER_CHAPTER_14 = [
    "io.output",
    "io.input",
    "decl.variable",
    "misc.comment",
    "type.string",
    "literal.string",
    "type.integer",
    "type.real",
    "type.char",
    "type.boolean",
    "type.date",
    "literal.integer",
    "literal.real",
    "literal.char",
    "literal.boolean",
    "literal.date",
    "assign.simple",
    "decl.constant",
    "op.arithmetic",
    "op.div",
    "op.mod",
    "op.relational",
    "op.and",
    "op.or",
    "op.not",
    "select.if",
    "select.if-else",
    "select.nested-if",
    "select.case",
    "select.case-range",
    "select.case-otherwise",
    "loop.for",
    "loop.for-step",
    "loop.while",
    "loop.repeat",
    "loop.nested",
    "builtin.length",
    "builtin.mid",
    "builtin.right",
    "builtin.ucase",
    "builtin.lcase",
    "op.concat",
    "builtin.int",
    "builtin.rand",
    "decl.array-1d",
    "array.index",
    "decl.array-2d",
    "array.index-2d",
    "decl.record-type",
    "record.field-access",
    "routine.procedure",
    "routine.call",
    "param.byval",
    "param.byref",
    "routine.function",
    "routine.return",
    "expr.function-call",
    "file.open-read",
    "file.open-write",
    "file.open-append",
    "file.read",
    "file.write",
    "file.close",
    "builtin.eof"
  ];
  var chapter15 = {
    id: 15,
    title: "\u62BD\u8C61\u6570\u636E\u7C7B\u578B\u5165\u95E8",
    level: "AS",
    syllabus: ["\xA710.4"],
    prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    sections: [
      {
        id: "15.1",
        title: "\u4EC0\u4E48\u662F\u62BD\u8C61\u6570\u636E\u7C7B\u578B",
        syllabus: ["\xA710.4"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_CHAPTER_14,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u6570\u7EC4\u548C\u8BB0\u5F55\u8BF4\u7684\u90FD\u662F**\u600E\u4E48\u5B58**\uFF1A\u51E0\u683C\u3001\u4EC0\u4E48\u7C7B\u578B\u3001\u600E\u4E48\u53D6\u3002**\u62BD\u8C61\u6570\u636E\u7C7B\u578B\uFF08abstract data type (ADT)\uFF09**\u6362\u4E86\u4E2A\u89D2\u5EA6\u2014\u2014\u5B83\u5148\u8BF4\u6E05**\u80FD\u5BF9\u8FD9\u6279\u6570\u636E\u505A\u54EA\u51E0\u4EF6\u4E8B**\uFF0C\u81F3\u4E8E\u5E95\u4E0B\u62FF\u4EC0\u4E48\u5B58\uFF0C\u6682\u65F6\u4E0D\u95EE\u3002",
              "\u300C\u62BD\u8C61\u300D\u7684\u610F\u601D\u5C31\u662F\u8FD9\u4E2A\uFF1A**\u53EA\u627F\u8BFA\u884C\u4E3A\uFF0C\u4E0D\u627F\u8BFA\u5B58\u6CD5**\u3002\u548C\u7B2C 13 \u7AE0\u7684\u63A5\u53E3\u662F\u540C\u4E00\u4E2A\u601D\u8DEF\u2014\u2014\u77E5\u9053\u8981\u7ED9\u4EC0\u4E48\u3001\u4F1A\u8FD8\u56DE\u4EC0\u4E48\u5C31\u591F\u7528\u4E86\uFF0C\u91CC\u9762\u600E\u4E48\u5199\u4E0D\u5FC5\u770B\u3002",
              "\u8003\u7EB2\u8981\u6C42\u8BA4\u8BC6\u4E09\u79CD\uFF1A**\u6808\uFF08stack\uFF09**\u3001**\u961F\u5217\uFF08queue\uFF09**\u3001**\u94FE\u8868\uFF08linked list\uFF09**\u3002\u5B83\u4EEC\u88C5\u7684\u90FD\u662F\u300C\u4E00\u4E32\u6570\u636E\u300D\uFF0C\u533A\u522B\u5168\u5728\u89C4\u77E9\u4E0A\u2014\u2014**\u4ECE\u54EA\u5934\u8FDB\u3001\u4ECE\u54EA\u5934\u51FA\u3001\u600E\u4E48\u627E\u5230\u4E0B\u4E00\u4E2A**\u3002",
              "AS \u9636\u6BB5**\u4E0D\u8981\u6C42\u4E3A\u8FD9\u4E09\u79CD\u7ED3\u6784\u5199\u4F2A\u4EE3\u7801**\u3002\u8981\u6C42\u7684\u662F\u4E09\u4EF6\u4E8B\uFF1A\u8BF4\u6E05\u5404\u81EA\u7684\u7279\u70B9\u3001\u5728\u7ED9\u5B9A\u573A\u666F\u91CC\u6311\u4E00\u4E2A\u5E76\u8BF4\u660E\u7406\u7531\u3001**\u63CF\u8FF0**\u600E\u4E48\u7528\u6570\u7EC4\u628A\u5B83\u4EEC\u505A\u51FA\u6765\u3002\u5B8C\u6574\u5B9E\u73B0\u7559\u5230\u7B2C 20 \u7AE0\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u539F\u8BDD\uFF1AADT \u662F\u4E00\u6279\u6570\u636E\u52A0\u4E0A\u5B9A\u4E49\u5728\u8FD9\u6279\u6570\u636E\u4E0A\u7684\u4E00\u7EC4\u64CD\u4F5C\uFF1B\u6808\u3001\u961F\u5217\u3001\u94FE\u8868\u90FD\u662F ADT \u7684\u4F8B\u5B50\uFF1B**\u4E0D\u8981\u6C42\u4E3A\u8FD9\u4E9B\u7ED3\u6784\u5199\u4F2A\u4EE3\u7801**\uFF0C\u4F46\u8981\u80FD\u5F80\u91CC\u9762\u6DFB\u52A0\u3001\u4FEE\u6539\u3001\u5220\u9664\u6570\u636E\uFF08\xA710.4\uFF09\u3002"
              }
            ]
          },
          {
            kind: "comparison",
            title: "\u8BF4\u5B58\u6CD5\uFF0C\u8FD8\u662F\u8BF4\u505A\u6CD5",
            intro: "\u540C\u6837\u662F\u300C\u4E00\u6279\u6574\u6570\u300D\uFF0C\u4E24\u79CD\u8BF4\u660E\u65B9\u5F0F\u7BA1\u7684\u4E8B\u4E0D\u4E00\u6837\u3002",
            panes: [
              {
                label: "\u6570\u7EC4\uFF1A\u8BF4\u7684\u662F\u5B58\u6CD5",
                language: "pseudocode",
                code: ["DECLARE Values : ARRAY[1:10] OF INTEGER", "Values[3] \u2190 42", "OUTPUT Values[3]"].join("\n"),
                note: "\u5341\u683C\u3001\u6574\u6570\u3001\u6309\u4E0B\u6807\u53D6\u3002\u770B\u5B8C\u8FD9\u4E09\u884C\u4F60\u77E5\u9053\u5B83\u957F\u4EC0\u4E48\u6837\uFF0C\u4F46\u4E0D\u77E5\u9053\u8BE5\u6309\u4EC0\u4E48\u987A\u5E8F\u5F80\u91CC\u653E\u3001\u5F80\u5916\u53D6\u2014\u2014\u90A3\u7531\u7528\u5B83\u7684\u4EBA\u968F\u4FBF\u51B3\u5B9A\u3002"
              },
              {
                label: "\u6808\uFF1A\u8BF4\u7684\u662F\u505A\u6CD5",
                language: "natural",
                code: [
                  "\u4E00\u4E2A\u6808\u80FD\u505A\u4E09\u4EF6\u4E8B\uFF1A",
                  "  \u5F80\u9876\u4E0A\u653E\u4E00\u4E2A\uFF08push\uFF09",
                  "  \u4ECE\u9876\u4E0A\u53D6\u8D70\u4E00\u4E2A\uFF08pop\uFF09",
                  "  \u770B\u4E00\u773C\u9876\u4E0A\u662F\u4EC0\u4E48\uFF0C\u4F46\u4E0D\u53D6\u8D70",
                  "\u89C4\u77E9\uFF1A\u653E\u548C\u53D6\u90FD\u53EA\u5728\u540C\u4E00\u5934\u3002",
                  "\u81F3\u4E8E\u5E95\u4E0B\u7528\u6570\u7EC4\u8FD8\u662F\u522B\u7684\uFF0C\u4E0D\u5173\u4F7F\u7528\u8005\u7684\u4E8B\u3002"
                ].join("\n"),
                note: "\u4E00\u683C\u90FD\u6CA1\u63D0\uFF0C\u5374\u628A\u80FD\u5E72\u4EC0\u4E48\u8BF4\u5168\u4E86\u3002\u8FD9\u5C31\u662F\u300C\u62BD\u8C61\u300D\u2014\u2014**\u5148\u5B9A\u89C4\u77E9\uFF0C\u518D\u8C08\u5B58\u6CD5**\u3002"
              },
              {
                label: "Python",
                language: "python",
                code: ["stack = []", "stack.append(42)   # push", "top = stack.pop()  # pop"].join("\n"),
                note: "Python \u7684 list \u5E95\u4E0B\u662F\u6570\u7EC4\uFF0C\u4F46 `append` / `pop` \u8FD9\u4E00\u5BF9\u7528\u6CD5\u628A\u5B83\u5F53\u6808\u4F7F\u3002\u540C\u4E00\u4EFD\u5B58\u6CD5\uFF0C\u914D\u4E0D\u540C\u7684\u89C4\u77E9\u5C31\u662F\u4E0D\u540C\u7684 ADT\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0B\u9762\u54EA\u4E00\u53E5\u6700\u51C6\u786E\u5730\u8BF4\u51FA\u4E86\u300C\u62BD\u8C61\u6570\u636E\u7C7B\u578B\u300D\u91CC\u300C\u62BD\u8C61\u300D\u7684\u610F\u601D\uFF1F",
            options: [
              {
                key: "A",
                label: "\u5B83\u6BD4\u6570\u7EC4\u66F4\u96BE\u7406\u89E3",
                correct: false,
                explanation: "\u96BE\u4E0D\u96BE\u548C\u62BD\u8C61\u4E0D\u62BD\u8C61\u6CA1\u5173\u7CFB\u3002\u6808\u7684\u89C4\u77E9\u53EA\u6709\u4E00\u6761\uFF0C\u6BD4\u6570\u7EC4\u7684\u4E0B\u6807\u8FD0\u7B97\u597D\u61C2\u5F97\u591A\u3002"
              },
              {
                key: "B",
                label: "\u5B83\u53EA\u8BF4\u6E05\u80FD\u505A\u54EA\u51E0\u4EF6\u4E8B\uFF0C\u4E0D\u8BF4\u5E95\u4E0B\u600E\u4E48\u5B58",
                correct: true,
                explanation: "\u5BF9\u3002\u4F7F\u7528\u8005\u53EA\u9700\u8981\u77E5\u9053\u90A3\u51E0\u4EF6\u4E8B\u548C\u5B83\u4EEC\u7684\u89C4\u77E9\uFF1B\u6362\u4E00\u79CD\u5B58\u6CD5\u800C\u89C4\u77E9\u4E0D\u53D8\uFF0C\u7528\u5B83\u7684\u4EE3\u7801\u4E00\u4E2A\u5B57\u90FD\u4E0D\u7528\u6539\u3002"
              },
              {
                key: "C",
                label: "\u5B83\u4E0D\u9700\u8981\u5360\u5B58\u50A8\u7A7A\u95F4",
                correct: false,
                explanation: "\u6570\u636E\u603B\u8981\u5B58\u5728\u4EC0\u4E48\u5730\u65B9\u3002ADT \u4E0D\u8BF4\u5B58\u6CD5\uFF0C\u4E0D\u7B49\u4E8E\u4E0D\u7528\u5B58\u3002"
              },
              {
                key: "D",
                label: "\u5B83\u91CC\u9762\u7684\u6570\u636E\u7C7B\u578B\u53EF\u4EE5\u968F\u65F6\u6539\u53D8",
                correct: false,
                explanation: "\u8FD9\u8BF4\u7684\u662F\u6570\u636E\u7C7B\u578B\uFF0C\u4E0D\u662F\u62BD\u8C61\u3002\u6808\u91CC\u88C5\u4EC0\u4E48\u7C7B\u578B\u548C\u5B83\u662F\u4E0D\u662F ADT \u65E0\u5173\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "15.2",
        title: "\u6808\uFF1A\u540E\u8FDB\u5148\u51FA",
        syllabus: ["\xA710.4"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_CHAPTER_14,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u6808\u7684\u89C4\u77E9\u53EA\u6709\u4E00\u6761\uFF1A**\u653E\u548C\u53D6\u90FD\u53EA\u5728\u540C\u4E00\u5934**\u3002\u90A3\u4E00\u5934\u53EB\u6808\u9876\u3002\u653E\u8FDB\u53BB\u53EB**\u5165\u6808\uFF08push\uFF09**\uFF0C\u53D6\u51FA\u6765\u53EB**\u51FA\u6808\uFF08pop\uFF09**\uFF0C\u6B64\u5916\u901A\u5E38\u8FD8\u80FD\u300C\u770B\u4E00\u773C\u6808\u9876\u662F\u4EC0\u4E48\u4F46\u4E0D\u53D6\u8D70\u300D\u3002",
              "\u8FD9\u4E00\u6761\u89C4\u77E9\u5E26\u6765\u7684\u540E\u679C\u662F\uFF1A**\u6700\u540E\u653E\u8FDB\u53BB\u7684\u6700\u5148\u88AB\u53D6\u51FA\u6765**\uFF0C\u7B80\u79F0**\u540E\u8FDB\u5148\u51FA\uFF08LIFO\uFF09**\u3002\u4E00\u645E\u76D8\u5B50\u5C31\u662F\u6808\u2014\u2014\u5F80\u6700\u4E0A\u9762\u645E\uFF0C\u4E5F\u4ECE\u6700\u4E0A\u9762\u62FF\uFF0C\u4E2D\u95F4\u90A3\u5F20\u62BD\u4E0D\u51FA\u6765\u3002",
              "\u4E24\u79CD\u60C5\u51B5\u8981\u7559\u795E\uFF1A**\u7A7A\u6808\u6CA1\u6CD5 pop**\uFF08\u6CA1\u6709\u4E1C\u897F\u53EF\u53D6\uFF09\uFF0C**\u6EE1\u4E86\u6CA1\u6CD5 push**\uFF08\u6CA1\u6709\u5730\u65B9\u53EF\u653E\uFF09\u3002\u7528\u6570\u7EC4\u505A\u7684\u6808\u603B\u6709\u4E2A\u4E0A\u9650\uFF0C\u6240\u4EE5\u8FD9\u4E24\u4EF6\u4E8B\u90FD\u5F97\u5148\u95EE\u4E00\u53E5\u3002",
              "\u4EC0\u4E48\u65F6\u5019\u7528\u6808\uFF1A**\u8981\u6309\u76F8\u53CD\u987A\u5E8F\u5904\u7406**\u7684\u65F6\u5019\u3002\u6D4F\u89C8\u5668\u7684\u540E\u9000\u3001\u7F16\u8F91\u5668\u7684\u64A4\u9500\u3001\u68C0\u67E5\u62EC\u53F7\u914D\u4E0D\u914D\u5BF9\uFF0C\u8FD8\u6709\u7B2C 19 \u7AE0\u7684\u9012\u5F52\u2014\u2014\u6BCF\u4E00\u5C42\u8C03\u7528\u90FD\u645E\u5728\u4E0A\u4E00\u5C42\u4E0A\u9762\uFF0C\u8FD4\u56DE\u65F6\u4ECE\u6700\u4E0A\u9762\u5F00\u59CB\u62C6\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u63CF\u8FF0\u6808\u7684\u5173\u952E\u7279\u70B9\uFF0C\u5E76\u4E3A\u7ED9\u5B9A\u573A\u666F\u8BF4\u660E\u7528\u5B83\u7684\u7406\u7531\uFF08\xA710.4\uFF09\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E00\u4E2A\u7A7A\u6808\uFF0C\u4F9D\u6B21 push \u4E86 `3`\u3001`7`\u3001`5`\uFF0C\u7136\u540E pop \u4E00\u6B21\uFF0C\u518D push `9`\u3002\u73B0\u5728\u6808\u9876\u662F\u4EC0\u4E48\uFF1F",
            options: [
              {
                key: "A",
                label: "`5`",
                correct: false,
                explanation: "5 \u5DF2\u7ECF\u88AB\u90A3\u6B21 pop \u53D6\u8D70\u4E86\u3002pop \u53D6\u7684\u6B63\u662F\u5F53\u65F6\u7684\u6808\u9876\u3002"
              },
              {
                key: "B",
                label: "`9`",
                correct: true,
                explanation: "\u5BF9\u3002push \u5B8C\u662F 3\u30017\u30015\uFF085 \u5728\u9876\u4E0A\uFF09\uFF0Cpop \u53D6\u8D70 5 \u5269\u4E0B 3\u30017\uFF0C\u518D push 9 \u645E\u5728\u6700\u4E0A\u9762\u3002\u6808\u9876\u6C38\u8FDC\u662F\u6700\u540E\u653E\u8FDB\u53BB\u7684\u90A3\u4E2A\u3002"
              },
              {
                key: "C",
                label: "`7`",
                correct: false,
                explanation: "pop \u4E4B\u540E\u6808\u9876\u786E\u5B9E\u662F 7\uFF0C\u4F46\u540E\u9762\u8FD8 push \u4E86\u4E00\u4E2A 9\uFF0C\u5B83\u645E\u5728 7 \u4E0A\u9762\u3002"
              },
              {
                key: "D",
                label: "`3`",
                correct: false,
                explanation: "3 \u662F\u6700\u5148\u653E\u8FDB\u53BB\u7684\uFF0C\u5B83\u538B\u5728\u6700\u5E95\u4E0B\u3002\u8981\u53D6\u5230\u5B83\u5F97\u5148\u628A\u4E0A\u9762\u7684\u5168\u90E8\u53D6\u8D70\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "15.3",
        title: "\u961F\u5217\uFF1A\u5148\u8FDB\u5148\u51FA",
        syllabus: ["\xA710.4"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_CHAPTER_14,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u961F\u5217\u7684\u89C4\u77E9\u4E5F\u53EA\u6709\u4E00\u6761\uFF0C\u4F46\u548C\u6808\u6B63\u597D\u76F8\u53CD\uFF1A**\u4E00\u5934\u8FDB\uFF0C\u53E6\u4E00\u5934\u51FA**\u3002\u8FDB\u6765\u53EB**\u5165\u961F\uFF08enqueue\uFF09**\uFF0C\u51FA\u53BB\u53EB**\u51FA\u961F\uFF08dequeue\uFF09**\u3002",
              "\u540E\u679C\u662F**\u6700\u5148\u8FDB\u6765\u7684\u6700\u5148\u51FA\u53BB**\uFF0C\u7B80\u79F0**\u5148\u8FDB\u5148\u51FA\uFF08FIFO\uFF09**\u3002\u8FD9\u5C31\u662F\u6392\u961F\uFF1A\u7AD9\u5230\u961F\u5C3E\uFF0C\u4ECE\u961F\u5934\u8D70\u3002\u63D2\u961F\u5728\u961F\u5217\u91CC\u662F\u4E0D\u5B58\u5728\u7684\u3002",
              "\u961F\u5217\u8981\u8BB0\u4E24\u4E2A\u4F4D\u7F6E\uFF1A**\u961F\u5934**\uFF08\u4E0B\u4E00\u4E2A\u51FA\u53BB\u7684\u662F\u8C01\uFF09\u548C**\u961F\u5C3E**\uFF08\u4E0B\u4E00\u4E2A\u8FDB\u6765\u7684\u653E\u54EA\u513F\uFF09\u3002\u6808\u53EA\u9700\u8981\u8BB0\u4E00\u4E2A\uFF0C\u56E0\u4E3A\u5B83\u53EA\u6709\u4E00\u5934\u5728\u52A8\u3002",
              "\u4EC0\u4E48\u65F6\u5019\u7528\u961F\u5217\uFF1A**\u8981\u6309\u5230\u8FBE\u987A\u5E8F\u5904\u7406**\u7684\u65F6\u5019\u3002\u6253\u5370\u4EFB\u52A1\u3001\u5BA2\u670D\u6392\u53F7\u3001\u628A\u5148\u6765\u7684\u5DE5\u4F5C\u5148\u6D3E\u51FA\u53BB\u3002\u5224\u636E\u4E00\u53E5\u8BDD\uFF1A**\u5148\u6765\u7684\u5148\u529E\uFF0C\u5C31\u662F\u961F\u5217\uFF1B\u540E\u6765\u7684\u5148\u529E\uFF0C\u5C31\u662F\u6808\u3002**"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u63CF\u8FF0\u961F\u5217\u7684\u5173\u952E\u7279\u70B9\uFF0C\u5E76\u4E3A\u7ED9\u5B9A\u573A\u666F\u8BF4\u660E\u7528\u5B83\u7684\u7406\u7531\uFF08\xA710.4\uFF09\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E00\u4E2A\u7A7A\u961F\u5217\uFF0C\u4F9D\u6B21 enqueue \u4E86 `A`\u3001`B`\u3001`C`\uFF0C\u7136\u540E dequeue \u4E24\u6B21\u3002\u8FD9\u4E24\u6B21\u51FA\u6765\u7684\u5206\u522B\u662F\u4EC0\u4E48\uFF1F",
            options: [
              {
                key: "A",
                label: "`A`\uFF0C\u7136\u540E `C`",
                correct: false,
                explanation: "\u51FA\u961F\u6C38\u8FDC\u4ECE\u961F\u5934\u6328\u7740\u8D70\uFF0C\u4E0D\u4F1A\u8DF3\u8FC7 `B`\u3002\u961F\u5217\u91CC\u6CA1\u6709\u300C\u6311\u4E00\u4E2A\u51FA\u6765\u300D\u8FD9\u4EF6\u4E8B\u3002"
              },
              {
                key: "B",
                label: "\u4E24\u6B21\u90FD\u662F `A`",
                correct: false,
                explanation: "dequeue \u662F\u53D6\u8D70\uFF0C\u4E0D\u662F\u770B\u4E00\u773C\u3002\u7B2C\u4E00\u6B21\u4E4B\u540E `A` \u5DF2\u7ECF\u4E0D\u5728\u961F\u5217\u91CC\u4E86\u3002"
              },
              {
                key: "C",
                label: "`C`\uFF0C\u7136\u540E `B`",
                correct: false,
                explanation: "\u8FD9\u662F\u6808\u7684\u884C\u4E3A\u2014\u2014\u540E\u8FDB\u5148\u51FA\u3002\u961F\u5217\u4ECE\u53E6\u4E00\u5934\u51FA\uFF0C\u5148\u8FDB\u6765\u7684\u5148\u8D70\u3002"
              },
              {
                key: "D",
                label: "`A`\uFF0C\u7136\u540E `B`",
                correct: true,
                explanation: "\u5BF9\u3002`A` \u6700\u5148\u8FDB\u6765\uFF0C\u6240\u4EE5\u6700\u5148\u51FA\u53BB\uFF1B\u63A5\u7740\u8F6E\u5230 `B`\u3002\u961F\u5217\u91CC\u5269\u4E0B `C`\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "15.4",
        title: "\u94FE\u8868\uFF1A\u6BCF\u4E2A\u8282\u70B9\u8BB0\u7740\u4E0B\u4E00\u4E2A\u5728\u54EA\u513F",
        syllabus: ["\xA710.4"],
        estimatedMinutes: 10,
        taughtFeatures: AFTER_CHAPTER_14,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u6570\u7EC4\u7684\u683C\u5B50\u662F\u6328\u7740\u6392\u7684\uFF0C\u7B2C\u51E0\u683C\u5728\u54EA\u91CC\u9760\u4E0B\u6807\u7B97\u51FA\u6765\u3002**\u94FE\u8868\uFF08linked list\uFF09**\u6362\u4E86\u4E2A\u529E\u6CD5\uFF1A\u5B83\u7531\u4E00\u4E32**\u8282\u70B9\uFF08node\uFF09**\u7EC4\u6210\uFF0C\u6BCF\u4E2A\u8282\u70B9\u9664\u4E86\u88C5\u6570\u636E\uFF0C\u8FD8\u8BB0\u7740**\u4E0B\u4E00\u4E2A\u8282\u70B9\u5728\u54EA\u513F**\uFF1B\u6700\u540E\u4E00\u4E2A\u8282\u70B9\u8BB0\u7684\u662F\u300C\u6CA1\u6709\u4E0B\u4E00\u4E2A\u4E86\u300D\u3002\u53E6\u5916\u5355\u72EC\u6709\u4E2A\u5730\u65B9\u8BB0\u7740**\u7B2C\u4E00\u4E2A\u8282\u70B9\u5728\u54EA\u513F**\u3002",
              "\u8FD9\u4E48\u505A\u7684\u597D\u5904\u662F**\u4E2D\u95F4\u63D2\u5220\u5F88\u4FBF\u5B9C**\uFF1A\u5728\u4E24\u4E2A\u8282\u70B9\u4E4B\u95F4\u63D2\u4E00\u4E2A\uFF0C\u53EA\u8981\u6539\u4E24\u5904\u300C\u4E0B\u4E00\u4E2A\u5728\u54EA\u513F\u300D\uFF0C\u522B\u7684\u8282\u70B9\u4E00\u4E2A\u90FD\u4E0D\u7528\u52A8\u3002\u6570\u7EC4\u8981\u5728\u4E2D\u95F4\u63D2\u4E00\u4E2A\uFF0C\u540E\u9762\u6240\u6709\u5143\u7D20\u90FD\u5F97\u5F80\u540E\u632A\u4E00\u683C\u3002",
              "\u4EE3\u4EF7\u662F**\u6CA1\u6CD5\u76F4\u63A5\u8DF3\u5230\u7B2C 5 \u4E2A**\u3002\u6570\u7EC4\u5199 `A[5]` \u4E00\u6B65\u5230\u4F4D\uFF0C\u94FE\u8868\u53EA\u80FD\u4ECE\u7B2C\u4E00\u4E2A\u5F00\u59CB\u987A\u7740\u8D70\u4E94\u6B65\u2014\u2014\u60F3\u770B\u7B2C\u51E0\u4E2A\uFF0C\u5C31\u5F97\u8D70\u51E0\u6B65\u3002",
              "\u6240\u4EE5\u5224\u636E\u5F88\u6E05\u695A\uFF1A**\u7ECF\u5E38\u5728\u4E2D\u95F4\u63D2\u5220\uFF0C\u7528\u94FE\u8868\uFF1B\u7ECF\u5E38\u6309\u7F16\u53F7\u76F4\u63A5\u53D6\uFF0C\u7528\u6570\u7EC4\u3002**\u81F3\u4E8E\u8FD9\u4E09\u79CD ADT \u4E4B\u95F4\u600E\u4E48\u4E92\u76F8\u5B9E\u73B0\uFF0C\u662F\u7B2C 20 \u7AE0\u7684\u4E8B\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u63CF\u8FF0\u94FE\u8868\u7684\u5173\u952E\u7279\u70B9\uFF0C\u5E76\u4E3A\u7ED9\u5B9A\u573A\u666F\u8BF4\u660E\u7528\u5B83\u7684\u7406\u7531\uFF08\xA710.4\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u987A\u7740\u300C\u4E0B\u4E00\u4E2A\u5728\u54EA\u513F\u300D\u8D70\u4E00\u904D",
            fileName: "Example_15_4_a.pseudocode",
            code: [
              "DECLARE Data : ARRAY[1:5] OF STRING",
              "DECLARE NextAt : ARRAY[1:5] OF INTEGER",
              "DECLARE Start : INTEGER",
              "DECLARE Here : INTEGER",
              'Data[1] \u2190 "Ada"',
              "NextAt[1] \u2190 4",
              'Data[4] \u2190 "Bob"',
              "NextAt[4] \u2190 2",
              'Data[2] \u2190 "Cal"',
              "NextAt[2] \u2190 0",
              "Start \u2190 1",
              "Here \u2190 Start",
              "WHILE Here <> 0",
              "   OUTPUT Data[Here]",
              "   Here \u2190 NextAt[Here]",
              "ENDWHILE"
            ].join("\n"),
            annotations: [
              { fromLine: 5, toLine: 10, text: "\u4E09\u4E2A\u8282\u70B9\u5206\u522B\u653E\u5728\u7B2C 1\u30014\u30012 \u683C\u2014\u2014**\u5728\u6570\u7EC4\u91CC\u7684\u4F4D\u7F6E\u662F\u4E71\u7684**\uFF0C\u987A\u5E8F\u7531 `NextAt` \u8BF4\u4E86\u7B97\u3002" },
              { fromLine: 10, toLine: 10, text: "`0` \u8868\u793A\u300C\u6CA1\u6709\u4E0B\u4E00\u4E2A\u4E86\u300D\u3002\u7B2C 0 \u683C\u4E0D\u5B58\u5728\uFF0C\u6B63\u597D\u62FF\u6765\u5F53\u8FD9\u4E2A\u6807\u8BB0\u3002" },
              { fromLine: 13, toLine: 16, text: "\u8D70\u6CD5\u662F\u300C\u5230\u8FD9\u513F\u3001\u770B\u4E0B\u4E00\u4E2A\u5728\u54EA\u513F\u3001\u8D70\u8FC7\u53BB\u300D\uFF0C\u4E00\u76F4\u8D70\u5230 `0`\u3002\u663E\u793A\u51FA\u6765\u7684\u987A\u5E8F\u662F Ada\u3001Bob\u3001Cal\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["Ada", "Bob", "Cal"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0A\u9762\u90A3\u6BB5\u91CC\uFF0C\u8981\u5728 `Ada` \u548C `Bob` \u4E4B\u95F4\u63D2\u4E00\u4E2A\u65B0\u8282\u70B9\uFF08\u6BD4\u5982\u653E\u5728\u7B2C 3 \u683C\uFF09\uFF0C\u81F3\u5C11\u8981\u6539\u52A8\u51E0\u5904\u300C\u4E0B\u4E00\u4E2A\u5728\u54EA\u513F\u300D\uFF1F",
            options: [
              {
                key: "A",
                label: "\u4E24\u5904\uFF1A`NextAt[1]` \u6539\u6210 3\uFF0C`NextAt[3]` \u8BBE\u6210 4",
                correct: true,
                explanation: "\u5BF9\u3002\u524D\u4E00\u4E2A\u6539\u6210\u6307\u5411\u65B0\u8282\u70B9\uFF0C\u65B0\u8282\u70B9\u6307\u5411\u539F\u6765\u7684\u540E\u4E00\u4E2A\u3002`Bob`\u3001`Cal` \u548C\u5B83\u4EEC\u7684\u6570\u636E\u4E00\u4E2A\u5B57\u90FD\u4E0D\u7528\u52A8\u2014\u2014\u8FD9\u6B63\u662F\u94FE\u8868\u4E2D\u95F4\u63D2\u5220\u4FBF\u5B9C\u7684\u539F\u56E0\u3002"
              },
              {
                key: "B",
                label: "\u4E00\u5904\uFF1A\u628A `NextAt[1]` \u6539\u6210 3 \u5C31\u884C",
                correct: false,
                explanation: "\u90A3\u6837\u8D70\u5230\u7B2C 3 \u683C\u5C31\u65AD\u4E86\u2014\u2014\u65B0\u8282\u70B9\u7684\u300C\u4E0B\u4E00\u4E2A\u300D\u8FD8\u6CA1\u8BBE\uFF0C\u94FE\u5B50\u63A5\u4E0D\u56DE `Bob`\u3002"
              },
              {
                key: "C",
                label: "\u4E09\u5904\uFF0C`NextAt[4]` \u4E5F\u8981\u6539",
                correct: false,
                explanation: "`Bob` \u540E\u9762\u8FD8\u662F `Cal`\uFF0C\u6CA1\u6709\u53D8\u3002\u63D2\u5728\u524D\u9762\u4E0D\u5F71\u54CD\u5B83\u6307\u5411\u8C01\u3002"
              },
              {
                key: "D",
                label: "\u8981\u5148\u628A `Bob` \u548C `Cal` \u5F80\u540E\u632A\u4E00\u683C",
                correct: false,
                explanation: "\u90A3\u662F\u6570\u7EC4\u7684\u505A\u6CD5\u3002\u94FE\u8868\u91CC\u8282\u70B9\u653E\u5728\u54EA\u4E00\u683C\u6839\u672C\u4E0D\u91CD\u8981\uFF0C\u6240\u4EE5\u4E0D\u9700\u8981\u642C\u52A8\u4EFB\u4F55\u4E1C\u897F\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "15.5",
        title: "\u7528\u6570\u7EC4\u63CF\u8FF0\u8FD9\u4E09\u79CD\u7ED3\u6784",
        syllabus: ["\xA710.4"],
        estimatedMinutes: 10,
        taughtFeatures: AFTER_CHAPTER_14,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u8003\u7EB2\u8981\u6C42\u4F60\u80FD**\u63CF\u8FF0**\u600E\u4E48\u7528\u6570\u7EC4\u628A\u8FD9\u4E09\u79CD\u7ED3\u6784\u505A\u51FA\u6765\u2014\u2014\u63CF\u8FF0\uFF0C\u4E0D\u662F\u5199\u51FA\u5B8C\u6574\u5B9E\u73B0\u3002\u4E09\u79CD\u7684\u5957\u8DEF\u662F\u540C\u4E00\u4E2A\uFF1A**\u4E00\u4E2A\u6570\u7EC4\u88C5\u6570\u636E\uFF0C\u5916\u52A0\u4E00\u4E24\u4E2A\u6574\u6570\u53D8\u91CF\u8BB0\u4F4D\u7F6E**\u3002",
              "**\u6808**\uFF1A\u4E00\u4E2A\u6570\u7EC4 + \u4E00\u4E2A `Top`\uFF0C\u8BB0\u7740\u6808\u9876\u5728\u7B2C\u51E0\u683C\u3002\u653E\u4E00\u4E2A\u5C31\u662F `Top` \u52A0\u4E00\u518D\u5F80\u90A3\u683C\u5199\uFF0C\u53D6\u4E00\u4E2A\u5C31\u662F\u5148\u8BFB\u90A3\u683C\u518D\u628A `Top` \u51CF\u4E00\u3002`Top` \u662F 0 \u8868\u793A\u7A7A\u6808\uFF0C`Top` \u7B49\u4E8E\u4E0A\u754C\u8868\u793A\u6EE1\u4E86\u3002",
              "**\u961F\u5217**\uFF1A\u4E00\u4E2A\u6570\u7EC4 + `Front` \u548C `Rear` \u4E24\u4E2A\u4F4D\u7F6E\u3002\u51FA\u961F\u65F6 `Front` \u5F80\u540E\u632A\uFF0C\u5165\u961F\u65F6 `Rear` \u5F80\u540E\u632A\u3002\u4E24\u4E2A\u90FD\u53EA\u671D\u4E00\u4E2A\u65B9\u5411\u8D70\uFF0C\u6240\u4EE5\u8D70\u5230\u6570\u7EC4\u5C3D\u5934\u5C31\u5F97\u4ECE\u5934\u7ED5\u56DE\u6765\u2014\u2014\u90A3\u53EB\u73AF\u5F62\u961F\u5217\uFF0C\u7B2C 20 \u7AE0\u8BB2\u3002",
              "**\u94FE\u8868**\uFF1A\u6570\u636E\u653E\u4E00\u4E2A\u6570\u7EC4\uFF0C\u300C\u4E0B\u4E00\u4E2A\u5728\u54EA\u513F\u300D\u653E\u53E6\u4E00\u4E2A\u6570\u7EC4\uFF08\u6216\u8005\u505A\u6210\u8BB0\u5F55\u6570\u7EC4\u7684\u4E00\u4E2A\u5B57\u6BB5\uFF09\uFF0C\u518D\u52A0\u4E00\u4E2A\u53D8\u91CF\u8BB0\u7740\u7B2C\u4E00\u4E2A\u8282\u70B9\u5728\u7B2C\u51E0\u683C\u3002**\u8FD9\u91CC\u5B58\u7684\u300C\u4E0B\u4E00\u4E2A\u5728\u54EA\u513F\u300D\u662F\u6570\u7EC4\u4E0B\u6807\uFF0C\u4E0D\u662F\u5185\u5B58\u5730\u5740\u3002**"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "Content under development"
              }
            ]
          },
          {
            kind: "example",
            title: "\u6808\uFF1A\u4E00\u4E2A\u6570\u7EC4\u52A0\u4E00\u4E2A `Top`",
            fileName: "Example_15_5_a.pseudocode",
            code: [
              "DECLARE Stack : ARRAY[1:5] OF INTEGER",
              "DECLARE Top : INTEGER",
              "Top \u2190 0",
              "Top \u2190 Top + 1",
              "Stack[Top] \u2190 10",
              "Top \u2190 Top + 1",
              "Stack[Top] \u2190 20",
              "Top \u2190 Top + 1",
              "Stack[Top] \u2190 30",
              'OUTPUT "Top is at ", Top',
              'OUTPUT "Top holds ", Stack[Top]',
              "Top \u2190 Top - 1",
              'OUTPUT "After one pop, top holds ", Stack[Top]',
              'OUTPUT "Slot 3 still holds ", Stack[3]'
            ].join("\n"),
            annotations: [
              { fromLine: 3, toLine: 3, text: "`Top` \u662F 0 \u8868\u793A\u7A7A\u6808\u3002\u7B2C 0 \u683C\u4E0D\u5B58\u5728\uFF0C\u6240\u4EE5\u8FD9\u4E2A\u503C\u4E0D\u4F1A\u548C\u4EFB\u4F55\u4E00\u4E2A\u771F\u5B9E\u7684\u4F4D\u7F6E\u6DF7\u8D77\u6765\u3002" },
              { fromLine: 4, toLine: 9, text: "\u653E\u4E09\u4E2A\uFF1A\u6BCF\u6B21\u90FD\u662F\u300C`Top` \u52A0\u4E00\u3001\u5F80\u90A3\u4E00\u683C\u5199\u300D\u3002\u6570\u7EC4\u7684\u683C\u5B50\u4E00\u683C\u90FD\u4E0D\u7528\u632A\u3002" },
              { fromLine: 12, toLine: 14, text: "\u53D6\u4E00\u4E2A\u53EA\u662F\u628A `Top` \u51CF\u4E00\u3002**\u7B2C 3 \u683C\u91CC\u7684 30 \u5176\u5B9E\u8FD8\u5728**\u2014\u2014\u5B83\u53EA\u662F\u4E0D\u518D\u7B97\u6570\u4E86\uFF0C\u4E0B\u6B21\u653E\u4E1C\u897F\u4F1A\u76D6\u6389\u5B83\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["Top is at 3", "Top holds 30", "After one pop, top holds 20", "Slot 3 still holds 30"]
            }
          },
          {
            kind: "example",
            title: "\u961F\u5217\uFF1A\u4E00\u4E2A\u6570\u7EC4\u52A0\u4E24\u4E2A\u4F4D\u7F6E",
            fileName: "Example_15_5_b.pseudocode",
            code: [
              "DECLARE Queue : ARRAY[1:5] OF STRING",
              "DECLARE Front : INTEGER",
              "DECLARE Rear : INTEGER",
              "Front \u2190 1",
              "Rear \u2190 0",
              "Rear \u2190 Rear + 1",
              'Queue[Rear] \u2190 "Ada"',
              "Rear \u2190 Rear + 1",
              'Queue[Rear] \u2190 "Bob"',
              "Rear \u2190 Rear + 1",
              'Queue[Rear] \u2190 "Cal"',
              'OUTPUT "Next out: ", Queue[Front]',
              "Front \u2190 Front + 1",
              'OUTPUT "Next out: ", Queue[Front]',
              'OUTPUT "Front is ", Front, ", Rear is ", Rear'
            ].join("\n"),
            annotations: [
              { fromLine: 4, toLine: 5, text: "\u4E24\u4E2A\u4F4D\u7F6E\u5404\u7BA1\u4E00\u5934\u3002`Rear` \u4ECE 0 \u8D77\uFF0C\u56E0\u4E3A\u8FD8\u6CA1\u6709\u4EBA\u6392\u8FDB\u6765\u3002" },
              { fromLine: 12, toLine: 14, text: "\u51FA\u961F\u5C31\u662F\u8BFB `Front` \u90A3\u4E00\u683C\u518D\u628A `Front` \u5F80\u540E\u632A\u3002**\u961F\u4F0D\u91CC\u7684\u4EBA\u4E00\u4E2A\u90FD\u4E0D\u7528\u5F80\u524D\u8D70**\u2014\u2014\u632A\u7684\u662F\u6807\u8BB0\uFF0C\u4E0D\u662F\u6570\u636E\u3002" },
              { fromLine: 15, toLine: 15, text: "\u4E24\u4E2A\u4F4D\u7F6E\u90FD\u5728\u5F80\u540E\u722C\u3002\u722C\u5230\u7B2C 5 \u683C\u4E4B\u540E\u5C31\u5F97\u60F3\u529E\u6CD5\u7ED5\u56DE\u7B2C 1 \u683C\uFF0C\u90A3\u662F\u7B2C 20 \u7AE0\u7684\u4E8B\u3002" }
            ],
            sampleRun: {
              inputs: [],
              outputs: ["Next out: Ada", "Next out: Bob", "Front is 2, Rear is 3"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u7528\u6570\u7EC4\u505A\u7684\u961F\u5217\uFF0C\u51FA\u961F\u65F6\u4E3A\u4EC0\u4E48\u4E0D\u9700\u8981\u628A\u540E\u9762\u7684\u4EBA\u6574\u4F53\u5F80\u524D\u632A\u4E00\u683C\uFF1F",
            options: [
              {
                key: "A",
                label: "\u56E0\u4E3A\u6570\u7EC4\u672C\u6765\u5C31\u4F1A\u81EA\u52A8\u5F80\u524D\u6536\u7F29",
                correct: false,
                explanation: "\u6570\u7EC4\u4E0D\u4F1A\u81EA\u52A8\u505A\u4EFB\u4F55\u4E8B\u3002\u6BCF\u4E00\u683C\u91CC\u7684\u503C\u53EA\u6709\u88AB\u8D4B\u503C\u624D\u4F1A\u53D8\u3002"
              },
              {
                key: "B",
                label: "\u56E0\u4E3A\u51FA\u961F\u7684\u90A3\u4E2A\u503C\u4F1A\u88AB\u81EA\u52A8\u6E05\u6389",
                correct: false,
                explanation: "\u5B83\u4E0D\u4F1A\u88AB\u6E05\u6389\uFF0C\u8FD8\u7559\u5728\u539F\u6765\u90A3\u4E00\u683C\u91CC\u2014\u2014\u53EA\u662F `Front` \u5DF2\u7ECF\u8D8A\u8FC7\u5B83\uFF0C\u4E0D\u518D\u7B97\u6570\u4E86\u3002"
              },
              {
                key: "C",
                label: "\u56E0\u4E3A\u961F\u5934\u662F\u9760 `Front` \u8BB0\u7740\u7684\uFF0C\u632A\u4E00\u4E0B\u8FD9\u4E2A\u53D8\u91CF\u5C31\u7B49\u4E8E\u961F\u4F0D\u5F80\u524D\u8D70\u4E86\u4E00\u4F4D",
                correct: true,
                explanation: "\u5BF9\u3002\u961F\u5934\u5728\u54EA\u513F\u7531\u4E00\u4E2A\u53D8\u91CF\u8BF4\u4E86\u7B97\uFF0C\u6539\u5B83\u6BD4\u642C\u6570\u636E\u4FBF\u5B9C\u5F97\u591A\u3002\u6808\u7684 `Top` \u4E5F\u662F\u540C\u4E00\u4E2A\u9053\u7406\u3002"
              },
              {
                key: "D",
                label: "\u56E0\u4E3A\u961F\u5217\u7684\u957F\u5EA6\u662F\u56FA\u5B9A\u7684",
                correct: false,
                explanation: "\u6570\u7EC4\u7684\u957F\u5EA6\u56FA\u5B9A\uFF0C\u4F46\u961F\u5217\u91CC\u5B9E\u9645\u6392\u7740\u51E0\u4E2A\u4EBA\u662F\u53D8\u7684\u2014\u2014`Front` \u548C `Rear` \u4E4B\u95F4\u90A3\u4E00\u6BB5\u624D\u662F\u961F\u4F0D\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "15.6",
        title: "\u7ED9\u4E00\u4E2A\u573A\u666F\u6311\u7ED3\u6784",
        syllabus: ["\xA710.4"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_CHAPTER_14,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u6311\u7ED3\u6784\u7684\u5224\u636E\u5C31\u4E00\u53E5\u8BDD\uFF1A**\u8FD9\u6279\u6570\u636E\u8981\u6309\u4EC0\u4E48\u987A\u5E8F\u53D6\u51FA\u6765\uFF1F**\u6309\u76F8\u53CD\u987A\u5E8F\u53D6 \u2192 \u6808\uFF1B\u6309\u5230\u8FBE\u987A\u5E8F\u53D6 \u2192 \u961F\u5217\uFF1B\u6309\u7F16\u53F7\u76F4\u63A5\u53D6 \u2192 \u6570\u7EC4\uFF1B\u987A\u5E8F\u5E38\u53D8\u3001\u7ECF\u5E38\u5728\u4E2D\u95F4\u63D2\u5220 \u2192 \u94FE\u8868\u3002",
              "\u8003\u7EB2\u8981\u6C42\u7684\u4E0D\u53EA\u662F\u6311\u5BF9\uFF0C\u8FD8\u8981**\u8BF4\u5F97\u51FA\u7406\u7531**\u3002\u7406\u7531\u8981\u843D\u5728\u300C\u8FD9\u4E2A\u573A\u666F\u91CC\u6570\u636E\u662F\u600E\u4E48\u8FDB\u3001\u600E\u4E48\u51FA\u7684\u300D\u4E0A\u2014\u2014\u300C\u56E0\u4E3A\u64A4\u9500\u8981\u4ECE\u6700\u8FD1\u4E00\u6B21\u5F00\u59CB\u9000\u300D\u662F\u7406\u7531\uFF0C\u300C\u56E0\u4E3A\u6808\u6BD4\u8F83\u5FEB\u300D\u4E0D\u662F\u3002",
              "\u6311\u9519\u4E86\u4E0D\u4F1A\u7ACB\u523B\u51FA\u9519\uFF0C\u8FD9\u662F\u6700\u5BB9\u6613\u5FFD\u7565\u7684\u4E00\u70B9\u3002\u62FF\u6570\u7EC4\u786C\u505A\u4E00\u4E2A\u961F\u5217\u4E5F\u8DD1\u5F97\u52A8\uFF0C\u53EA\u662F\u6BCF\u6B21\u51FA\u961F\u90FD\u8981\u628A\u540E\u9762\u7684\u4EBA\u5168\u632A\u4E00\u683C\uFF1B\u6570\u636E\u4E00\u591A\u5C31\u6162\uFF0C\u800C\u4E14\u591A\u51FA\u6765\u7684\u642C\u8FD0\u4EE3\u7801\u5168\u662F\u51FA\u9519\u7684\u673A\u4F1A\u3002",
              "**\u7ED3\u6784\u6311\u5BF9\u4E86\uFF0C\u4EE3\u7801\u5C31\u4E0D\u7528\u505A\u591A\u4F59\u7684\u642C\u8FD0**\u2014\u2014\u8FD9\u548C\u7B2C 9 \u7AE0\u300C\u5F62\u72B6\u5BF9\u4E0A\u4E86\u5C31\u4E0D\u7528\u505A\u6362\u7B97\u300D\u3001\u7B2C 11 \u7AE0\u300C\u7ED1\u6210\u4E00\u4EFD\u5C31\u62C6\u4E0D\u6563\u300D\u662F\u540C\u4E00\u4EF6\u4E8B\u7684\u4E09\u79CD\u8BF4\u6CD5\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u4E3A\u7ED9\u5B9A\u573A\u666F\u8BF4\u660E\u9009\u62E9\u67D0\u79CD ADT \u7684\u7406\u7531\uFF08\xA710.4\uFF09\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E00\u4E2A\u7A0B\u5E8F\u8981\u8BB0\u4E0B\u7528\u6237\u505A\u8FC7\u7684\u6BCF\u4E00\u6B65\u64CD\u4F5C\uFF0C\u597D\u8BA9\u300C\u64A4\u9500\u300D\u6309\u94AE\u4E00\u6B21\u9000\u56DE\u4E00\u6B65\u3002\u8BE5\u7528\u54EA\u79CD\u7ED3\u6784\uFF1F",
            options: [
              {
                key: "A",
                label: "\u94FE\u8868\uFF0C\u56E0\u4E3A\u64CD\u4F5C\u7684\u6570\u91CF\u4E0D\u56FA\u5B9A",
                correct: false,
                explanation: "\u6570\u91CF\u4E0D\u56FA\u5B9A\u8FD9\u4E00\u70B9\u6808\u4E5F\u6EE1\u8DB3\u3002\u6311\u7ED3\u6784\u770B\u7684\u662F\u53D6\u51FA\u987A\u5E8F\uFF0C\u4E0D\u662F\u6570\u91CF\u3002"
              },
              {
                key: "B",
                label: "\u4E8C\u7EF4\u6570\u7EC4\uFF0C\u56E0\u4E3A\u6BCF\u4E00\u6B65\u64CD\u4F5C\u6709\u597D\u51E0\u9879\u4FE1\u606F",
                correct: false,
                explanation: "\u4E00\u6B65\u64CD\u4F5C\u6709\u51E0\u9879\u4FE1\u606F\u662F\u300C\u4E00\u4EFD\u6570\u636E\u600E\u4E48\u5B58\u300D\u7684\u95EE\u9898\uFF08\u8BB0\u5F55\u66F4\u5408\u9002\uFF09\uFF0C\u548C\u300C\u6309\u4EC0\u4E48\u987A\u5E8F\u9000\u56DE\u300D\u662F\u4E24\u4EF6\u4E8B\u3002"
              },
              {
                key: "C",
                label: "\u6808\uFF0C\u56E0\u4E3A\u64A4\u9500\u8981\u4ECE\u6700\u8FD1\u4E00\u6B21\u5F00\u59CB\u5F80\u56DE\u9000",
                correct: true,
                explanation: "\u5BF9\u3002\u6700\u540E\u505A\u7684\u90A3\u4E00\u6B65\u6700\u5148\u88AB\u64A4\u9500\uFF0C\u6B63\u662F\u540E\u8FDB\u5148\u51FA\u3002\u7406\u7531\u843D\u5728\u300C\u53D6\u51FA\u987A\u5E8F\u300D\u4E0A\uFF0C\u8FD9\u4E5F\u662F\u8003\u7EB2\u8981\u7684\u8BF4\u6CD5\u3002"
              },
              {
                key: "D",
                label: "\u961F\u5217\uFF0C\u56E0\u4E3A\u64CD\u4F5C\u662F\u6309\u65F6\u95F4\u5148\u540E\u53D1\u751F\u7684",
                correct: false,
                explanation: "\u53D1\u751F\u987A\u5E8F\u786E\u5B9E\u662F\u5148\u540E\u7684\uFF0C\u4F46\u64A4\u9500\u8981\u9000\u7684\u662F**\u6700\u8FD1**\u90A3\u4E00\u6B65\u3002\u961F\u5217\u5148\u51FA\u6765\u7684\u662F\u6700\u65E9\u90A3\u4E00\u6B65\uFF0C\u6B63\u597D\u9000\u53CD\u4E86\u3002"
              }
            ]
          }
        ]
      }
    ],
    chapterTasks: []
  };

  // packages/teaching-content/src/chapter-16.ts
  var AFTER_CHAPTER_15 = [
    "io.output",
    "io.input",
    "decl.variable",
    "misc.comment",
    "type.string",
    "literal.string",
    "type.integer",
    "type.real",
    "type.char",
    "type.boolean",
    "type.date",
    "literal.integer",
    "literal.real",
    "literal.char",
    "literal.boolean",
    "literal.date",
    "assign.simple",
    "decl.constant",
    "op.arithmetic",
    "op.div",
    "op.mod",
    "op.relational",
    "op.and",
    "op.or",
    "op.not",
    "select.if",
    "select.if-else",
    "select.nested-if",
    "select.case",
    "select.case-range",
    "select.case-otherwise",
    "loop.for",
    "loop.for-step",
    "loop.while",
    "loop.repeat",
    "loop.nested",
    "builtin.length",
    "builtin.mid",
    "builtin.right",
    "builtin.ucase",
    "builtin.lcase",
    "op.concat",
    "builtin.int",
    "builtin.rand",
    "decl.array-1d",
    "array.index",
    "decl.array-2d",
    "array.index-2d",
    "decl.record-type",
    "record.field-access",
    "routine.procedure",
    "routine.call",
    "param.byval",
    "param.byref",
    "routine.function",
    "routine.return",
    "expr.function-call",
    "file.open-read",
    "file.open-write",
    "file.open-append",
    "file.read",
    "file.write",
    "file.close",
    "builtin.eof"
  ];
  var chapter16 = {
    id: 16,
    title: "\u7EFC\u5408\uFF1A\u4ECE\u95EE\u9898\u5230\u5B8C\u6574\u7A0B\u5E8F",
    level: "AS",
    syllabus: ["\xA79.2", "\xA712.2"],
    prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    sections: [
      {
        id: "16.1",
        title: "\u5148\u628A\u9898\u76EE\u8BFB\u660E\u767D",
        syllabus: ["\xA79.2"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_CHAPTER_15,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u524D\u9762\u5341\u4E94\u7AE0\u6559\u7684\u662F**\u600E\u4E48\u5199**\u3002\u8FD9\u4E00\u7AE0\u8BB2\u7684\u662F\u62FF\u5230\u4E00\u9053\u9898\u4E4B\u540E\u3001\u52A8\u624B\u5199\u4E4B\u524D\u8BE5\u505A\u4EC0\u4E48\u2014\u2014\u56E0\u4E3A\u5199\u4E0D\u51FA\u6765\u7684\u65F6\u5019\uFF0C\u95EE\u9898\u5F80\u5F80\u4E0D\u5728\u8BED\u6CD5\u4E0A\uFF0C\u800C\u5728\u8FD8\u6CA1\u60F3\u6E05\u695A\u8981\u505A\u4EC0\u4E48\u3002",
              "\u7B2C\u4E00\u6B65\u662F\u628A\u9898\u9762\u62C6\u6210\u4E09\u6837\u4E1C\u897F\uFF1A**\u5DF2\u77E5**\uFF08\u7ED9\u4E86\u4EC0\u4E48\uFF09\u3001**\u8981\u6C42**\uFF08\u8981\u4EA4\u51FA\u4EC0\u4E48\uFF09\u3001**\u7EA6\u675F**\uFF08\u6709\u4EC0\u4E48\u9650\u5236\uFF09\u3002\u4E09\u6837\u90FD\u5199\u4E0B\u6765\uFF0C\u7F3A\u54EA\u6837\u4E00\u773C\u5C31\u770B\u5F97\u89C1\u3002",
              "\u672C\u7AE0\u4ECE\u5934\u5230\u5C3E\u53EA\u7528\u4E00\u9053\u9898\uFF1A*\u4E00\u4E2A\u73ED\u6709 5 \u4E2A\u5B66\u751F\uFF0C\u6BCF\u4EBA\u6709\u59D3\u540D\u548C\u4E00\u4E2A\u5206\u6570\u3002\u8BFB\u5165\u8FD9\u4E9B\u6570\u636E\uFF0C\u663E\u793A\u5E73\u5747\u5206\uFF08\u53D6\u6574\u6570\u5546\uFF09\uFF0C\u518D\u5217\u51FA\u5206\u6570\u9AD8\u4E8E\u5E73\u5747\u5206\u7684\u5B66\u751F\u59D3\u540D\u3002* \u4E09\u6837\u5206\u522B\u662F\u2014\u2014\u5DF2\u77E5\uFF1A5 \u4E2A\u5B66\u751F\u7684\u59D3\u540D\u548C\u5206\u6570\uFF1B\u8981\u6C42\uFF1A\u5E73\u5747\u5206\u4E00\u884C\u3001\u9AD8\u4E8E\u5E73\u5747\u7684\u59D3\u540D\u82E5\u5E72\u884C\uFF1B\u7EA6\u675F\uFF1A\u4EBA\u6570\u56FA\u5B9A 5 \u4E2A\uFF0C\u5E73\u5747\u5206\u53D6\u6574\u6570\u5546\u3002",
              "**\u7EA6\u675F\u6700\u5BB9\u6613\u6F0F\uFF0C\u800C\u5B83\u5E38\u5E38\u51B3\u5B9A\u6574\u4E2A\u505A\u6CD5\u3002**\u300C\u9AD8\u4E8E\u5E73\u5747\u5206\u300D\u8FD9\u4E00\u6761\u5C31\u662F\uFF1A\u5E73\u5747\u5206\u8981\u5168\u90E8\u8BFB\u5B8C\u624D\u7B97\u5F97\u51FA\u6765\uFF0C\u800C\u5224\u65AD\u53C8\u8981\u56DE\u5934\u770B\u6BCF\u4E00\u4E2A\u4EBA\u2014\u2014\u6240\u4EE5\u6570\u636E\u975E\u5B58\u4E0B\u6765\u4E0D\u53EF\uFF08\u7B2C 8 \u7AE0\u8BB2\u8FC7\u8FD9\u4EF6\u4E8B\uFF09\u3002\u8FD9\u4E00\u53E5\u8981\u662F\u6CA1\u8BFB\u51FA\u6765\uFF0C\u5199\u5230\u4E00\u534A\u624D\u53D1\u73B0\u5F97\u63A8\u5012\u91CD\u6765\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u628A\u7B97\u6CD5\u7406\u89E3\u4E3A\u300C\u4E00\u4E2A\u95EE\u9898\u7684\u89E3\uFF0C\u5199\u6210\u4E00\u4E32\u786E\u5B9A\u7684\u6B65\u9AA4\u300D\uFF0C\u5E76\u80FD\u4E3A\u95EE\u9898\u91CC\u7684\u6570\u636E\u8D77\u5408\u9002\u7684\u6807\u8BC6\u7B26\u540D\uFF08\xA79.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "comparison",
            title: "\u540C\u4E00\u9053\u9898\uFF0C\u8BFB\u5230\u4EC0\u4E48\u7A0B\u5EA6\u624D\u7B97\u8BFB\u660E\u767D",
            intro: "\u9898\u9762\uFF1A\u8BFB\u5165\u4E00\u4E2A\u623F\u95F4\u7684\u957F\u548C\u5BBD\uFF0C\u663E\u793A\u5B83\u7684\u9762\u79EF\u3002",
            panes: [
              {
                label: "\u53EA\u8BFB\u4E86\u4E2A\u5927\u6982",
                language: "natural",
                code: ["\u300C\u7B97\u9762\u79EF\u3002\u300D", "\u2014\u2014\u90A3\u957F\u548C\u5BBD\u4ECE\u54EA\u513F\u6765\uFF1F\u7B97\u5B8C\u7ED9\u8C01\u770B\uFF1F", "\u5199\u5230\u4E00\u534A\u5C31\u5F97\u505C\u4E0B\u6765\u56DE\u5934\u731C\u3002"].join("\n"),
                note: "\u4E0D\u662F\u8BFB\u5F97\u4E0D\u8BA4\u771F\uFF0C\u662F\u6CA1\u6709\u628A\u9898\u9762\u62C6\u6210\u4E09\u6837\u3002\u5269\u4E0B\u7684\u4E24\u6837\u4E00\u76F4\u7A7A\u7740\uFF0C\u52A8\u624B\u7684\u65F6\u5019\u624D\u53D1\u73B0\u3002"
              },
              {
                label: "\u62C6\u6210\u4E09\u6837",
                language: "natural",
                code: [
                  "\u5DF2\u77E5\uFF1A\u4E00\u4E2A\u957F\u3001\u4E00\u4E2A\u5BBD\uFF0C\u90FD\u4ECE\u952E\u76D8\u8BFB\u5165\u3002",
                  "\u8981\u6C42\uFF1A\u663E\u793A\u9762\u79EF\uFF0C\u4E00\u884C\u3002",
                  "\u7EA6\u675F\uFF1A\u957F\u548C\u5BBD\u90FD\u662F\u6574\u6570\u3002"
                ].join("\n"),
                note: "\u4E09\u6837\u9F50\u4E86\uFF0C\u4EE3\u7801\u7684\u5F62\u72B6\u5DF2\u7ECF\u5B9A\u4E0B\u6765\u4E86\uFF1A\u4E24\u6B21\u8BFB\u5165\u3001\u4E00\u6B21\u8BA1\u7B97\u3001\u4E00\u6B21\u663E\u793A\u2014\u2014\u4E5F\u5C31\u662F\u4E0B\u4E00\u8282\u7684 IPO \u4E09\u6BB5\u3002"
              },
              {
                label: "\u5199\u6210\u4F2A\u4EE3\u7801",
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
                note: "\u4E00\u884C\u90FD\u4E0D\u7528\u72B9\u8C6B\u2014\u2014\u4E0A\u9762\u90A3\u4E09\u884C\u5DF2\u7ECF\u628A\u8BE5\u6709\u4EC0\u4E48\u8BF4\u5B8C\u4E86\uFF0C\u8FD9\u91CC\u53EA\u662F\u6362\u6210\u4F2A\u4EE3\u7801\u7684\u5199\u6CD5\u3002"
              },
              {
                label: "Python",
                language: "python",
                code: ["width = int(input())", "height = int(input())", 'print("Area:", width * height)'].join("\n"),
                note: "\u6362\u6210\u53E6\u4E00\u79CD\u8BED\u8A00\uFF0C\u4E09\u6837\u4E1C\u897F\u4E00\u4E2A\u4E0D\u53D8\u3002**\u8BFB\u660E\u767D\u9898\u76EE\u8FD9\u4E00\u6B65\u548C\u7528\u4EC0\u4E48\u8BED\u8A00\u65E0\u5173\u3002**"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u672C\u7AE0\u90A3\u9053\u9898\u91CC\uFF0C\u300C\u5217\u51FA\u5206\u6570**\u9AD8\u4E8E\u5E73\u5747\u5206**\u7684\u5B66\u751F\u59D3\u540D\u300D\u8FD9\u4E00\u6761\uFF0C\u6700\u5148\u5F71\u54CD\u7684\u662F\u4EC0\u4E48\u51B3\u5B9A\uFF1F",
            options: [
              {
                key: "A",
                label: "\u7528\u4EC0\u4E48\u540D\u5B57\u7ED9\u53D8\u91CF",
                correct: false,
                explanation: "\u540D\u5B57\u8981\u8D77\u597D\uFF0C\u4F46\u8FD9\u4E00\u6761\u7EA6\u675F\u6362\u6210\u300C\u4F4E\u4E8E\u5E73\u5747\u5206\u300D\u540D\u5B57\u4E5F\u4E0D\u7528\u53D8\u3002\u5B83\u5F71\u54CD\u7684\u662F\u66F4\u9760\u524D\u7684\u51B3\u5B9A\u3002"
              },
              {
                key: "B",
                label: "\u6570\u636E\u5FC5\u987B\u5148\u5168\u90E8\u5B58\u4E0B\u6765\uFF0C\u4E0D\u80FD\u8FB9\u8BFB\u8FB9\u7B97\u5B8C\u5C31\u6254",
                correct: true,
                explanation: "\u5BF9\u3002\u5E73\u5747\u5206\u8981\u8BFB\u5B8C\u5168\u90E8\u624D\u7B97\u5F97\u51FA\u6765\uFF0C\u800C\u300C\u8C01\u9AD8\u4E8E\u5B83\u300D\u53C8\u8981\u56DE\u5934\u770B\u6BCF\u4E00\u4E2A\u4EBA\u2014\u2014\u7B2C 8 \u7AE0\u5C31\u662F\u62FF\u8FD9\u4EF6\u4E8B\u8BF4\u660E\u6570\u7EC4\u4E3A\u4EC0\u4E48\u975E\u8981\u4E0D\u53EF\u3002"
              },
              {
                key: "C",
                label: "\u7528 `FOR` \u8FD8\u662F `WHILE`",
                correct: false,
                explanation: "\u5FAA\u73AF\u600E\u4E48\u9009\u7531\u300C\u6B21\u6570\u77E5\u4E0D\u77E5\u9053\u300D\u51B3\u5B9A\uFF0C\u8FD9\u91CC\u4EBA\u6570\u56FA\u5B9A\u662F 5\uFF0C\u7528 `FOR`\u3002\u8FD9\u4E00\u6761\u7EA6\u675F\u7BA1\u7684\u662F\u522B\u7684\u4E8B\u3002"
              },
              {
                key: "D",
                label: "\u5E73\u5747\u5206\u8981\u4E0D\u8981\u53D6\u6574",
                correct: false,
                explanation: "\u53D6\u6574\u662F\u53E6\u4E00\u6761\u7EA6\u675F\uFF08\u9898\u9762\u5355\u72EC\u8BF4\u4E86\u300C\u53D6\u6574\u6570\u5546\u300D\uFF09\uFF0C\u4E24\u6761\u5404\u7BA1\u5404\u7684\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "16.2",
        title: "input / process / output \u4E0E\u6807\u8BC6\u7B26\u8868",
        syllabus: ["\xA79.2"],
        estimatedMinutes: 11,
        taughtFeatures: AFTER_CHAPTER_15,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u8BFB\u660E\u767D\u4E4B\u540E\uFF0C\u628A\u9898\u76EE\u6446\u6210\u4E09\u6BB5\uFF1A**\u8F93\u5165\u4EC0\u4E48\u3001\u4E2D\u95F4\u505A\u4EC0\u4E48\u3001\u8F93\u51FA\u4EC0\u4E48**\u3002\u7B2C 1 \u7AE0\u5C31\u7528\u8FC7\u8FD9\u4E2A\u8BF4\u6CD5\uFF0C\u73B0\u5728\u5B83\u6210\u4E86\u56FA\u5B9A\u7684\u4E00\u6B65\u2014\u2014\u56E0\u4E3A**\u4EFB\u4F55\u4E00\u6BB5\u7A0B\u5E8F\u90FD\u88C5\u5F97\u8FDB\u8FD9\u4E09\u6BB5**\u3002",
              "\u672C\u7AE0\u90A3\u9053\u9898\u7684\u4E09\u6BB5\u662F\uFF1A\u8F93\u5165 5 \u7EC4\u59D3\u540D\u548C\u5206\u6570\uFF1B\u4E2D\u95F4\u7B97\u51FA\u603B\u5206\u3001\u518D\u7B97\u5E73\u5747\u5206\u3001\u518D\u6311\u51FA\u9AD8\u4E8E\u5E73\u5747\u7684\u4EBA\uFF1B\u8F93\u51FA\u5E73\u5747\u5206\u4E00\u884C\u3001\u59D3\u540D\u82E5\u5E72\u884C\u3002",
              "\u63A5\u4E0B\u6765\u7ED9\u6BCF\u4E00\u6837\u6570\u636E\u8D77\u540D\u5B57\uFF0C\u5217\u6210\u4E00\u5F20**\u6807\u8BC6\u7B26\u8868\uFF08identifier table\uFF09**\uFF1A\u540D\u5B57\u3001\u7C7B\u578B\u3001\u5B83\u4EE3\u8868\u4EC0\u4E48\u3002\u8003\u7EB2\u660E\u786E\u8981\u6C42\u4F1A\u5217\u8FD9\u5F20\u8868\u3002\u5B83\u4E0D\u662F\u683C\u5F0F\u529F\u8BFE\u2014\u2014**\u540D\u5B57\u8D77\u4E0D\u51FA\u6765\uFF0C\u591A\u534A\u662F\u90A3\u6837\u4E1C\u897F\u4F60\u8FD8\u6CA1\u60F3\u6E05\u695A**\u3002",
              "\u8D77\u540D\u7684\u8001\u89C4\u77E9\u8FD8\u5728\uFF08\u7B2C 2 \u7AE0\uFF09\uFF1A\u5B57\u6BCD\u5F00\u5934\u3001\u89C1\u540D\u77E5\u610F\u3001\u522B\u548C\u5173\u952E\u5B57\u6216\u5185\u7F6E\u51FD\u6570\u649E\uFF08`Length` \u8FD9\u79CD\u5C31\u4E0D\u80FD\u7528\uFF0C\u5B83\u662F\u5185\u7F6E\u51FD\u6570\u540D\uFF09\u3002\u8868\u91CC\u4E00\u884C\u4E00\u6837\u4E1C\u897F\uFF0C\u4E34\u65F6\u7684\u5FAA\u73AF\u53D8\u91CF\u4E5F\u7B97\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u5199\u51FA\u5305\u542B input\u3001process\u3001output \u7684\u4F2A\u4EE3\u7801\uFF0C\u5E76\u7528\u6807\u8BC6\u7B26\u8868\u8868\u793A\u95EE\u9898\u91CC\u7528\u5230\u7684\u6570\u636E\uFF08\xA79.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u6700\u5C0F\u7684\u4E00\u4EFD IPO",
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
              { fromLine: 1, toLine: 2, text: "\u6807\u8BC6\u7B26\u8868\u843D\u5230\u4EE3\u7801\u4E0A\u5C31\u662F\u8FD9\u4E24\u884C\uFF1A\u540D\u5B57\u3001\u7C7B\u578B\uFF0C\u5404\u4EE3\u8868\u4EC0\u4E48\u5199\u5728\u540D\u5B57\u91CC\u3002" },
              { fromLine: 3, toLine: 6, text: "input \u6BB5\u3002\u4E24\u6837\u8F93\u5165\uFF0C\u5404\u914D\u4E00\u53E5\u63D0\u793A\u3002" },
              { fromLine: 7, toLine: 8, text: "process \u548C output \u6324\u5728\u540C\u4E00\u884C\u4E86\u2014\u2014\u7B97\u5F0F\u7B80\u5355\u7684\u65F6\u5019\u53EF\u4EE5\uFF0C\u590D\u6742\u4E86\u5C31\u8BE5\u5148\u7B97\u8FDB\u4E00\u4E2A\u53D8\u91CF\u518D\u663E\u793A\u3002" }
            ],
            sampleRun: {
              inputs: ["3", "4"],
              outputs: ["Enter the width", "Enter the height", "Area: 12", "Perimeter: 14"]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u5217\u6807\u8BC6\u7B26\u8868\u7684\u65F6\u5019\uFF0C\u4E0B\u9762\u54EA\u4E00\u6837**\u4E5F\u5E94\u8BE5**\u5217\u8FDB\u53BB\uFF1F",
            options: [
              {
                key: "A",
                label: "\u6BCF\u4E00\u53E5 `OUTPUT` \u91CC\u7684\u63D0\u793A\u8BED",
                correct: false,
                explanation: "\u63D0\u793A\u8BED\u662F\u5199\u6B7B\u5728\u4EE3\u7801\u91CC\u7684\u6587\u5B57\uFF0C\u4E0D\u662F\u8981\u5B58\u8D77\u6765\u7684\u6570\u636E\uFF0C\u6CA1\u6709\u540D\u5B57\u4E5F\u6CA1\u6709\u7C7B\u578B\u3002"
              },
              {
                key: "B",
                label: "\u7528\u5230\u7684\u6BCF\u4E00\u4E2A\u8FD0\u7B97\u7B26",
                correct: false,
                explanation: "\u6807\u8BC6\u7B26\u8868\u767B\u8BB0\u7684\u662F\u6570\u636E\uFF0C\u4E0D\u662F\u8FD0\u7B97\u3002\u8FD0\u7B97\u5C5E\u4E8E process \u90A3\u4E00\u6BB5\u7684\u63CF\u8FF0\u3002"
              },
              {
                key: "C",
                label: "\u7A0B\u5E8F\u4E00\u5171\u6709\u591A\u5C11\u884C",
                correct: false,
                explanation: "\u884C\u6570\u548C\u6570\u636E\u6CA1\u6709\u5173\u7CFB\uFF0C\u800C\u4E14\u5199\u7740\u5199\u7740\u5C31\u53D8\u4E86\u3002"
              },
              {
                key: "D",
                label: "\u53EA\u5728\u5FAA\u73AF\u91CC\u7528\u6765\u6570\u6570\u7684\u90A3\u4E2A\u63A7\u5236\u53D8\u91CF",
                correct: true,
                explanation: "\u5BF9\u3002\u5B83\u4E5F\u662F\u4E00\u4EFD\u8981\u5360\u5730\u65B9\u7684\u6570\u636E\uFF0C\u4E5F\u8981 `DECLARE`\uFF0C\u4E5F\u8981\u8D77\u4E2A\u8BF4\u5F97\u6E05\u7684\u540D\u5B57\u3002\u8868\u91CC\u4E00\u884C\u4E00\u6837\u4E1C\u897F\uFF0C\u4E0D\u5206\u91CD\u8981\u4E0D\u91CD\u8981\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "16.2.1",
            title: "\u623F\u95F4\u7684\u9762\u79EF\u548C\u5468\u957F",
            statement: "\u6309 IPO \u4E09\u6BB5\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165\u4E00\u4E2A\u623F\u95F4\u7684\u957F\u548C\u5BBD\uFF08\u90FD\u662F\u6574\u6570\uFF09\uFF0C\u663E\u793A\u5B83\u7684\u9762\u79EF\u548C\u5468\u957F\u3002\u5148\u60F3\u6E05\u695A\u8981\u51E0\u4E2A\u53D8\u91CF\u3001\u5404\u53EB\u4EC0\u4E48\uFF0C\u518D\u52A8\u624B\u3002",
            ioSpec: {
              input: [
                "\u4E24\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\uFF1A\u5148\u957F\u540E\u5BBD\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
                "\u957F\u4E4B\u524D\u662F `Enter the length`\uFF0C\u5BBD\u4E4B\u524D\u662F `Enter the width`"
              ].join("\n"),
              output: ["\u4E24\u884C\uFF0C\u5199\u6210\uFF1A", "`Area: <\u9762\u79EF>`", "`Perimeter: <\u5468\u957F>`", "\u5468\u957F\u662F\u300C\u957F\u52A0\u5BBD\u518D\u4E58\u4E8C\u300D\u3002\u6BCF\u4E2A\u5192\u53F7\u540E\u9762\u4E00\u4E2A\u7A7A\u683C\u3002"].join("\n")
            },
            constraints: {
              require: [
                {
                  feature: "io.input",
                  reason: "\u957F\u548C\u5BBD\u90FD\u8981\u4ECE\u952E\u76D8\u8BFB\u8FDB\u6765\uFF0C\u4E0D\u80FD\u5199\u6B7B\u5728\u4EE3\u7801\u91CC\u3002"
                },
                {
                  feature: "op.arithmetic",
                  reason: "\u9762\u79EF\u548C\u5468\u957F\u90FD\u5F97\u7B97\u51FA\u6765\u3002"
                }
              ]
            },
            hints: [
              "\u4E24\u6837\u8F93\u5165\u5C31\u662F\u4E24\u4E2A\u53D8\u91CF\u3002\u540D\u5B57\u522B\u7528 `Length`\u2014\u2014\u90A3\u662F\u5185\u7F6E\u51FD\u6570\u7684\u540D\u5B57\uFF0C\u5360\u4E86\u3002",
              "\u5468\u957F\u662F\u300C(\u957F + \u5BBD) \xD7 2\u300D\uFF0C\u62EC\u53F7\u522B\u6F0F\uFF0C\u4E58\u6CD5\u6BD4\u52A0\u6CD5\u5148\u7B97\u3002",
              "\u4E24\u53E5 `OUTPUT` \u7684\u6B21\u5E8F\u7167\u9898\u76EE\u5199\u7684\u6765\uFF1A\u5148\u9762\u79EF\u540E\u5468\u957F\u3002"
            ],
            examples: [
              {
                inputs: ["7", "4"],
                outputs: ["Enter the length", "Enter the width", "Area: 28", "Perimeter: 22"]
              }
            ],
            referenceSolution: [
              "DECLARE RoomLength : INTEGER",
              "DECLARE RoomWidth : INTEGER",
              'OUTPUT "Enter the length"',
              "INPUT RoomLength",
              'OUTPUT "Enter the width"',
              "INPUT RoomWidth",
              'OUTPUT "Area: ", RoomLength * RoomWidth',
              'OUTPUT "Perimeter: ", 2 * (RoomLength + RoomWidth)'
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["5", "3"], caseHint: "\u4E00\u4E2A\u666E\u901A\u7684\u957F\u65B9\u5F62\u3002" },
              { id: "t2", kind: "boundary", inputs: ["6", "6"], caseHint: "\u957F\u548C\u5BBD\u4E00\u6837\u5927\u3002" },
              { id: "t3", kind: "boundary", inputs: ["1", "1"], caseHint: "\u6700\u5C0F\u7684\u90A3\u79CD\uFF0C\u9762\u79EF\u548C\u5468\u957F\u5DEE\u5F97\u5F88\u8FDC\u3002" },
              { id: "t4", kind: "boundary", inputs: ["9", "0"], caseHint: "\u6709\u4E00\u8FB9\u662F\u96F6\uFF0C\u9762\u79EF\u4E5F\u5C31\u6CA1\u4E86\uFF0C\u5468\u957F\u8FD8\u5728\u3002" },
              { id: "t5", kind: "extreme", inputs: ["9999", "9999"], caseHint: "\u4E24\u8FB9\u90FD\u5F88\u5927\u3002" }
            ]
          }
        ]
      },
      {
        id: "16.3",
        title: "\u5206\u89E3\u4E0E\u7ED3\u6784\u56FE",
        syllabus: ["\xA79.2", "\xA712.2"],
        estimatedMinutes: 10,
        taughtFeatures: AFTER_CHAPTER_15,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u4E09\u6BB5\u6446\u597D\u4E4B\u540E\uFF0Cprocess \u90A3\u4E00\u6BB5\u5F80\u5F80\u8FD8\u662F\u4E00\u5927\u5757\u3002**\u5206\u89E3**\u5C31\u662F\u628A\u8FD9\u4E00\u5927\u5757\u62C6\u6210\u51E0\u4EF6\u5404\u81EA\u8BF4\u5F97\u6E05\u7684\u4E8B\uFF0C\u6BCF\u4EF6\u4E8B\u5C06\u6765\u662F\u4E00\u4E2A\u8FC7\u7A0B\u6216\u8005\u4E00\u4E2A\u51FD\u6570\uFF08\u7B2C 12\u300113 \u7AE0\uFF09\u3002",
              "\u672C\u7AE0\u90A3\u9053\u9898\u62C6\u6210\u4E09\u4EF6\uFF1A**\u8BFB\u5165\u4E00\u4E2A\u73ED**\u3001**\u7B97\u5E73\u5747\u5206**\u3001**\u5217\u51FA\u9AD8\u4E8E\u5E73\u5747\u7684\u4EBA**\u3002\u4E09\u4EF6\u4E8B\u5404\u81EA\u90FD\u80FD\u7528\u4E00\u53E5\u8BDD\u8BF4\u6E05\u695A\uFF0C\u800C\u4E14\u5404\u81EA\u90FD\u80FD\u5355\u72EC\u68C0\u67E5\u5BF9\u4E0D\u5BF9\u2014\u2014\u8FD9\u662F\u62C6\u5F97\u597D\u4E0D\u597D\u7684\u5224\u636E\u3002",
              "\u62C6\u5B8C\u4E4B\u540E\u753B\u4E00\u5F20**\u7ED3\u6784\u56FE\uFF08structure chart\uFF09**\uFF1A\u4E0A\u9762\u4E00\u4E2A\u65B9\u6846\u662F\u4E3B\u7A0B\u5E8F\uFF0C\u4E0B\u9762\u4E00\u6392\u65B9\u6846\u662F\u62C6\u51FA\u6765\u7684\u51E0\u4EF6\u4E8B\uFF0C\u7BAD\u5934\u4E0A\u6807\u7740\u5B83\u4EEC\u4E4B\u95F4**\u4F20\u7684\u662F\u4EC0\u4E48**\u3002\u8003\u7EB2\u8981\u6C42\u4F1A\u770B\u3001\u4F1A\u753B\uFF0C\u8FD8\u8981\u6C42\u80FD\u4ECE\u7ED3\u6784\u56FE\u5012\u63A8\u51FA\u4F2A\u4EE3\u7801\u3002",
              "\u7ED3\u6784\u56FE\u4E0A\u6700\u503C\u94B1\u7684\u662F\u7BAD\u5934\u4E0A\u90A3\u51E0\u4E2A\u540D\u5B57\u3002\u5B83\u4EEC\u76F4\u63A5\u5BF9\u5E94\u53C2\u6570\u8868\uFF1A\u5F80\u4E0B\u4F20\u7684\u662F\u5B9E\u53C2\uFF0C\u5F80\u4E0A\u4F20\u7684\u662F\u8FD4\u56DE\u503C\u6216\u8005 `BYREF` \u53C2\u6570\u6539\u56DE\u6765\u7684\u4E1C\u897F\u3002**\u56FE\u753B\u5BF9\u4E86\uFF0C\u8FC7\u7A0B\u7684\u5934\u90E8\u5C31\u5DF2\u7ECF\u5199\u597D\u4E86\u3002**"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u7528\u7ED3\u6784\u56FE\u628A\u95EE\u9898\u5206\u89E3\u6210\u5B50\u4EFB\u52A1\uFF0C\u8BF4\u660E\u5404\u6A21\u5757\u4E4B\u95F4\u4F20\u9012\u7684\u53C2\u6570\uFF0C\u5E76\u80FD\u7531\u7ED3\u6784\u56FE\u63A8\u51FA\u7B49\u4EF7\u7684\u4F2A\u4EE3\u7801\uFF08\xA712.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "comparison",
            title: "\u4E00\u5F20\u7ED3\u6784\u56FE\u548C\u5B83\u5BF9\u5E94\u7684\u5934\u90E8",
            intro: "\u672C\u7AE0\u90A3\u9053\u9898\u62C6\u6210\u4E09\u4EF6\u4E8B\u4E4B\u540E\u7684\u6837\u5B50\u3002",
            panes: [
              {
                label: "\u7ED3\u6784\u56FE",
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
                  "    \u2191 Form             \u2193 Total            \u2193 Form",
                  "    \u2191 Total            \u2193 Count            \u2193 Mean",
                  "                       \u2191 average"
                ].join("\n"),
                note: "\u65B9\u6846\u91CC\u5199\u7684\u5C31\u662F\u5C06\u6765\u90A3\u51E0\u4E2A\u8FC7\u7A0B\u548C\u51FD\u6570\u7684\u540D\u5B57\uFF0C\u7BAD\u5934\u4E0A\u5199\u7684\u662F\u53C2\u6570\u540D\u3002**\u671D\u4E0B\u7684\u7BAD\u5934\u662F\u4E3B\u7A0B\u5E8F\u9012\u4E0B\u53BB\u7684\uFF0C\u671D\u4E0A\u7684\u662F\u4EA4\u56DE\u4E3B\u7A0B\u5E8F\u7684**\u2014\u2014`ReadClass` \u8981\u4EA4\u56DE\u73ED\u7EA7\u548C\u603B\u5206\u4E24\u6837\uFF0C\u6240\u4EE5\u5B83\u4E0B\u9762\u6302\u7740\u4E24\u4E2A\u671D\u4E0A\u7684\u7BAD\u5934\u3002\uFF08\u56FE\u91CC\u4E00\u5F8B\u7528\u6807\u8BC6\u7B26\u540D\uFF0C\u4E0D\u7528\u4E2D\u6587\u3002\uFF09"
              },
              {
                label: "\u7528\u8BDD\u8BF4\u4E00\u904D",
                language: "natural",
                code: [
                  "\u4E3B\u7A0B\u5E8F\u8981\u505A\u4E09\u4EF6\u4E8B\uFF1A",
                  "  \u4E00\u3001\u8BFB\u5165\u4E00\u4E2A\u73ED\uFF08ReadClass\uFF09\u2014\u2014\u505A\u5B8C\u4E4B\u540E\u8981\u628A\u73ED\u7EA7 Form \u548C\u603B\u5206 Total \u4EA4\u56DE\u4E3B\u7A0B\u5E8F\u3002",
                  "  \u4E8C\u3001\u7B97\u5E73\u5747\u5206\uFF08AverageOf\uFF09\u2014\u2014\u7ED9\u5B83\u603B\u5206 Total \u548C\u4EBA\u6570 Count\uFF0C\u5B83\u4EA4\u56DE\u5E73\u5747\u5206\u3002",
                  "  \u4E09\u3001\u5217\u51FA\u9AD8\u4E8E\u5E73\u5747\u7684\u4EBA\uFF08ShowAbove\uFF09\u2014\u2014\u7ED9\u5B83\u73ED\u7EA7 Form \u548C\u5E73\u5747\u5206 Mean\uFF0C\u5B83\u81EA\u5DF1\u663E\u793A\uFF0C\u4E0D\u7528\u4EA4\u56DE\u4EC0\u4E48\u3002"
                ].join("\n"),
                note: "\u6BCF\u4EF6\u4E8B\u540E\u9762\u90A3\u534A\u53E5\u5C31\u662F\u7BAD\u5934\uFF1A**\u300C\u4EA4\u56DE\u300D\u7684\u662F\u671D\u4E0A\u7684\uFF0C\u300C\u7ED9\u5B83\u300D\u7684\u662F\u671D\u4E0B\u7684**\u3002\u8BDD\u8BF4\u6E05\u695A\u4E86\uFF0C\u56FE\u548C\u5934\u90E8\u90FD\u662F\u7167\u6284\u3002"
              },
              {
                label: "\u7167\u7740\u56FE\u5199\u51FA\u6765\u7684\u5934\u90E8",
                language: "pseudocode",
                code: [
                  "TYPE TStudent",
                  "   DECLARE Name : STRING",
                  "   DECLARE Mark : INTEGER",
                  "ENDTYPE",
                  "PROCEDURE ReadClass(BYREF Form : ARRAY[1:5] OF TStudent, BYREF Total : INTEGER)",
                  "   Total \u2190 0",
                  "ENDPROCEDURE",
                  "FUNCTION AverageOf(Total : INTEGER, Count : INTEGER) RETURNS INTEGER",
                  "   RETURN Total DIV Count",
                  "ENDFUNCTION",
                  "PROCEDURE ShowAbove(Form : ARRAY[1:5] OF TStudent, Mean : INTEGER)",
                  "   OUTPUT Mean",
                  "ENDPROCEDURE"
                ].join("\n"),
                note: "\u56FE\u4E0A\u7684\u7BAD\u5934\u9010\u6761\u53D8\u6210\u4E86\u62EC\u53F7\u91CC\u7684\u4E1C\u897F\uFF1A\u671D\u4E0B\u7684\u6210\u4E86\u53C2\u6570\uFF0C\u671D\u4E0A\u7684\u6210\u4E86 `BYREF` \u53C2\u6570\u6216\u8005\u8FD4\u56DE\u503C\u3002\u4E09\u4E2A\u4F53\u5148\u7A7A\u7740\uFF0C\u4E0B\u4E00\u8282\u518D\u586B\u2014\u2014**\u5934\u90E8\u5DF2\u7ECF\u5B9A\u6B7B\u4E86\uFF0C\u586B\u4F53\u7684\u65F6\u5019\u4E0D\u4F1A\u518D\u52A8\u5B83**\u3002"
              },
              {
                label: "Python",
                language: "python",
                code: ["def read_marks(): ...", "def average_of(total, count): ...", "def show_above(marks, mean): ..."].join("\n"),
                note: "\u6362\u4E2A\u8BED\u8A00\uFF0C\u56FE\u4E00\u4E2A\u5B57\u90FD\u4E0D\u7528\u6539\u3002\u7ED3\u6784\u56FE\u8BF4\u7684\u662F\u300C\u8C01\u8C03\u7528\u8C01\u3001\u4E4B\u95F4\u4F20\u4EC0\u4E48\u300D\uFF0C\u548C\u8BED\u6CD5\u65E0\u5173\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u7ED3\u6784\u56FE\u4E0A\uFF0C\u4ECE\u300C\u7B97\u5E73\u5747\u5206\u300D\u8FD9\u4E2A\u65B9\u6846\u6307\u5411\u4E3B\u7A0B\u5E8F\u7684\u90A3\u4E2A**\u671D\u4E0A**\u7684\u7BAD\u5934\uFF0C\u5BF9\u5E94\u4F2A\u4EE3\u7801\u91CC\u7684\u4EC0\u4E48\uFF1F",
            options: [
              {
                key: "A",
                label: "\u5B83\u7684\u8FD4\u56DE\u503C",
                correct: true,
                explanation: "\u5BF9\u3002\u671D\u4E0A\u7684\u7BAD\u5934\u662F\u300C\u4EA4\u56DE\u7ED9\u8C03\u7528\u8005\u7684\u4E1C\u897F\u300D\uFF1B\u4E00\u4EF6\u4E8B\u53EA\u9700\u8981\u4EA4\u56DE\u4E00\u4E2A\u503C\uFF0C\u5199\u6210\u51FD\u6570\u7684\u8FD4\u56DE\u503C\u6700\u76F4\u63A5\u3002"
              },
              {
                key: "B",
                label: "\u5B83\u7684\u53C2\u6570",
                correct: false,
                explanation: "\u53C2\u6570\u662F\u4E3B\u7A0B\u5E8F\u9012\u4E0B\u53BB\u7684\uFF0C\u7BAD\u5934\u671D\u4E0B\u3002\u65B9\u5411\u53CD\u4E86\u3002"
              },
              {
                key: "C",
                label: "\u5B83\u7684\u540D\u5B57",
                correct: false,
                explanation: "\u540D\u5B57\u5199\u5728\u65B9\u6846\u91CC\uFF0C\u4E0D\u5728\u7BAD\u5934\u4E0A\u3002\u7BAD\u5934\u4E0A\u6807\u7684\u662F\u4F20\u7684\u6570\u636E\u3002"
              },
              {
                key: "D",
                label: "\u5B83\u88AB\u8C03\u7528\u4E86\u51E0\u6B21",
                correct: false,
                explanation: "\u7ED3\u6784\u56FE\u4E0D\u8BF4\u6B21\u6570\uFF0C\u53EA\u8BF4\u8C01\u8C03\u7528\u8C01\u3001\u4E4B\u95F4\u4F20\u4EC0\u4E48\u3002\u6B21\u6570\u7531\u8C03\u7528\u5B83\u7684\u90A3\u6BB5\u4EE3\u7801\u51B3\u5B9A\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "16.4",
        title: "\u9010\u6B65\u6C42\u7CBE",
        syllabus: ["\xA79.2"],
        estimatedMinutes: 10,
        taughtFeatures: AFTER_CHAPTER_15,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u62C6\u51FA\u6765\u7684\u6BCF\u4E00\u4EF6\u4E8B\u8FD8\u662F\u4E00\u53E5\u4E2D\u6587\u3002**\u9010\u6B65\u6C42\u7CBE\uFF08stepwise refinement\uFF09**\u5C31\u662F\u628A\u8FD9\u4E00\u53E5\u8BDD\u4E00\u5C42\u4E00\u5C42\u5199\u7EC6\uFF0C**\u7EC6\u5230\u6BCF\u4E00\u884C\u90FD\u80FD\u76F4\u63A5\u6362\u6210\u4F2A\u4EE3\u7801\u4E3A\u6B62**\u3002\u8003\u7EB2\u70B9\u540D\u8981\u6C42\u8FD9\u4E2A\u8FC7\u7A0B\u3002",
              "\u62FF\u300C\u8BFB\u5165\u4E00\u4E2A\u73ED\u5E76\u7B97\u51FA\u603B\u5206\u300D\u4E3A\u4F8B\u3002\u7B2C\u4E00\u5C42\uFF1A*\u8BFB\u5165 5 \u4E2A\u5B66\u751F\u7684\u59D3\u540D\u548C\u5206\u6570\uFF0C\u540C\u65F6\u628A\u5206\u6570\u52A0\u8D77\u6765\u3002* \u7B2C\u4E8C\u5C42\uFF1A*\u603B\u5206\u6E05\u96F6\uFF1B\u91CD\u590D 5 \u6B21\uFF1A\u63D0\u793A\u5E76\u8BFB\u59D3\u540D\u3001\u63D0\u793A\u5E76\u8BFB\u5206\u6570\u3001\u628A\u8FD9\u4E2A\u5206\u6570\u52A0\u5230\u603B\u5206\u4E0A\u3002* \u5230\u8FD9\u4E00\u5C42\uFF0C\u6BCF\u4E00\u53E5\u90FD\u5BF9\u5F97\u4E0A\u4E00\u4E2A\u5199\u6CD5\u4E86\u3002",
              "\u6BCF\u5F80\u4E0B\u4E00\u5C42\uFF0C\u53EA\u56DE\u7B54\u4E00\u4E2A\u95EE\u9898\uFF1A**\u8FD9\u4E00\u53E5\u5177\u4F53\u600E\u4E48\u505A\uFF1F**\u522B\u5728\u540C\u4E00\u5C42\u91CC\u65E2\u5199\u300C\u91CD\u590D 5 \u6B21\u300D\u53C8\u5199 `FOR I \u2190 1 TO 5`\u2014\u2014**\u4E00\u5C42\u53EA\u8BF4\u4E00\u4EF6\u4E8B\u7684\u7C92\u5EA6**\uFF0C\u6DF7\u7740\u5199\u5C31\u5206\u4E0D\u6E05\u54EA\u4E9B\u5DF2\u7ECF\u5B9A\u4E0B\u6765\u4E86\u3002",
              "\u4EC0\u4E48\u65F6\u5019\u505C\uFF1F**\u5F53\u6BCF\u4E00\u53E5\u90FD\u80FD\u4E00\u5BF9\u4E00\u5730\u6362\u6210\u4E00\u884C\u4F2A\u4EE3\u7801\u7684\u65F6\u5019\u3002**\u518D\u7EC6\u5C31\u662F\u5728\u5199\u4EE3\u7801\u4E86\uFF0C\u518D\u7C97\u5C31\u8FD8\u6709\u60F3\u4E0D\u6E05\u695A\u7684\u5730\u65B9\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u63CF\u8FF0\u5E76\u4F7F\u7528\u9010\u6B65\u6C42\u7CBE\uFF0C\u628A\u7B97\u6CD5\u7EC6\u5316\u5230\u53EF\u4EE5\u76F4\u63A5\u7F16\u7A0B\u7684\u7A0B\u5EA6\uFF08\xA79.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u7B2C\u4E8C\u5C42\u5199\u5B8C\u4E4B\u540E\u76F4\u63A5\u6362\u6210\u4F2A\u4EE3\u7801",
            fileName: "Example_16_4_a.pseudocode",
            code: [
              "DECLARE Marks : ARRAY[1:5] OF INTEGER",
              "DECLARE I : INTEGER",
              "DECLARE Total : INTEGER",
              "Total \u2190 0",
              "FOR I \u2190 1 TO 5",
              '   OUTPUT "Enter a mark"',
              "   INPUT Marks[I]",
              "   Total \u2190 Total + Marks[I]",
              "NEXT I",
              'OUTPUT "Average: ", Total DIV 5'
            ].join("\n"),
            annotations: [
              { fromLine: 4, toLine: 4, text: "\u5BF9\u5E94\u7B2C\u4E8C\u5C42\u7684\u300C\u603B\u5206\u6E05\u96F6\u300D\u3002\u4F4D\u7F6E\u5728\u5FAA\u73AF\u4E4B\u524D\u2014\u2014\u7B2C 6 \u7AE0\u53CD\u590D\u8BB2\u8FC7\u8FD9\u4EF6\u4E8B\u3002" },
              { fromLine: 5, toLine: 9, text: "\u5BF9\u5E94\u300C\u91CD\u590D 5 \u6B21\uFF1A\u2026\u2026\u300D\u3002\u6B21\u6570\u5DF2\u7ECF\u77E5\u9053\uFF0C\u6240\u4EE5\u662F `FOR`\u3002" },
              { fromLine: 8, toLine: 8, text: "\u5BF9\u5E94\u300C\u628A\u8FD9\u4E2A\u5206\u6570\u52A0\u5230\u603B\u5206\u4E0A\u300D\u3002\u4E00\u53E5\u8BDD\u6362\u4E00\u884C\uFF0C\u8FD9\u5C31\u662F\u6C42\u7CBE\u8BE5\u505C\u4E0B\u6765\u7684\u4FE1\u53F7\u3002" }
            ],
            sampleRun: {
              inputs: ["80", "70", "90", "60", "100"],
              outputs: [
                "Enter a mark",
                "Enter a mark",
                "Enter a mark",
                "Enter a mark",
                "Enter a mark",
                "Average: 80"
              ]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u9010\u6B65\u6C42\u7CBE\u8BE5\u5728\u4EC0\u4E48\u65F6\u5019\u505C\u4E0B\u6765\uFF1F",
            options: [
              {
                key: "A",
                label: "\u5F53\u6BCF\u4E00\u53E5\u90FD\u4E0D\u8D85\u8FC7\u5341\u4E2A\u5B57\u7684\u65F6\u5019",
                correct: false,
                explanation: "\u300C\u628A\u8FD9\u4E2A\u73ED\u6309\u5206\u6570\u6392\u597D\u300D\u53EA\u6709\u4E5D\u4E2A\u5B57\uFF0C\u4F46\u5B83\u79BB\u4E00\u884C\u4F2A\u4EE3\u7801\u8FD8\u8FDC\u7740\u3002\u957F\u77ED\u8BF4\u660E\u4E0D\u4E86\u7C92\u5EA6\u3002"
              },
              {
                key: "B",
                label: "\u5199\u6EE1\u4E09\u5C42\u5C31\u505C",
                correct: false,
                explanation: "\u5C42\u6570\u7531\u9898\u76EE\u7684\u590D\u6742\u7A0B\u5EA6\u51B3\u5B9A\u3002\u7B80\u5355\u7684\u4E00\u5C42\u5C31\u591F\uFF0C\u590D\u6742\u7684\u56DB\u4E94\u5C42\u4E5F\u6B63\u5E38\uFF0C\u6CA1\u6709\u56FA\u5B9A\u7684\u6570\u3002"
              },
              {
                key: "C",
                label: "\u5F53\u6BCF\u4E00\u53E5\u90FD\u80FD\u4E00\u5BF9\u4E00\u6362\u6210\u4E00\u884C\u4F2A\u4EE3\u7801\u7684\u65F6\u5019",
                correct: true,
                explanation: "\u5BF9\u3002\u518D\u7EC6\u5C31\u7B49\u4E8E\u5728\u5199\u4EE3\u7801\u4E86\uFF0C\u518D\u7C97\u5C31\u8FD8\u6709\u53E5\u5B50\u8BF4\u4E0D\u6E05\u8BE5\u600E\u4E48\u505A\u3002\u8FD9\u662F\u552F\u4E00\u80FD\u64CD\u4F5C\u7684\u5224\u636E\u3002"
              },
              {
                key: "D",
                label: "\u5F53\u6240\u6709\u53D8\u91CF\u90FD\u8D77\u597D\u540D\u5B57\u7684\u65F6\u5019",
                correct: false,
                explanation: "\u540D\u5B57\u5728\u6807\u8BC6\u7B26\u8868\u90A3\u4E00\u6B65\u5C31\u8D77\u4E86\u3002\u540D\u5B57\u9F50\u4E86\uFF0C\u53E5\u5B50\u4ECD\u7136\u53EF\u80FD\u7C97\u5F97\u6CA1\u6CD5\u76F4\u63A5\u5199\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "16.5",
        title: "\u4ECE\u7ED3\u6784\u5316\u82F1\u8BED\u548C\u6D41\u7A0B\u56FE\u5199\u51FA\u4F2A\u4EE3\u7801",
        syllabus: ["\xA79.2"],
        estimatedMinutes: 11,
        taughtFeatures: AFTER_CHAPTER_15,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u6C42\u7CBE\u5199\u51FA\u6765\u7684\u90A3\u51E0\u5C42\uFF0C\u5199\u89C4\u6574\u4E00\u70B9\u5C31\u662F**\u7ED3\u6784\u5316\u82F1\u8BED\uFF08structured English\uFF09**\uFF1A\u7528\u65E5\u5E38\u7684\u8BCD\u63CF\u8FF0\u6B65\u9AA4\uFF0C\u4F46\u7F29\u8FDB\u548C\u300C\u91CD\u590D\u300D\u300C\u5982\u679C\u300D\u8FD9\u4E9B\u7ED3\u6784\u8BCD\u548C\u4F2A\u4EE3\u7801\u5BF9\u5F97\u4E0A\u3002\u5B83\u6BD4\u4F2A\u4EE3\u7801\u677E\uFF0C\u6BD4\u5927\u767D\u8BDD\u4E25\u3002",
              "\u540C\u6837\u7684\u4E1C\u897F\u8FD8\u53EF\u4EE5\u753B\u6210**\u6D41\u7A0B\u56FE\uFF08flowchart\uFF09**\uFF1A\u4E00\u4E2A\u4E2A\u65B9\u6846\u6309\u6267\u884C\u987A\u5E8F\u8FDE\u8D77\u6765\uFF0C\u5224\u65AD\u753B\u6210\u4E00\u4E2A\u6709\u4E24\u6761\u51FA\u53E3\u7684\u83F1\u5F62\uFF0C\u5FAA\u73AF\u5C31\u662F\u4E00\u6761\u7ED5\u56DE\u53BB\u7684\u7EBF\u3002\u8003\u7EB2\u8981\u6C42\u80FD\u4ECE\u8FD9\u4E24\u79CD\u63CF\u8FF0**\u5199\u51FA\u4F2A\u4EE3\u7801**\u3002",
              "\u8F6C\u5199\u7684\u65F6\u5019\u53EA\u505A\u4E00\u4EF6\u4E8B\uFF1A**\u628A\u7ED3\u6784\u8BCD\u6362\u6210\u5173\u952E\u5B57**\u3002\u300C\u91CD\u590D 5 \u6B21\u300D\u6362\u6210 `FOR ... TO ... NEXT`\uFF0C\u300C\u5982\u679C\u2026\u2026\u90A3\u4E48\u300D\u6362\u6210 `IF ... THEN ... ENDIF`\uFF0C\u300C\u663E\u793A\u300D\u6362\u6210 `OUTPUT`\u3002\u7F29\u8FDB\u7167\u6284\u2014\u2014\u5B83\u672C\u6765\u5C31\u6807\u7740\u8C01\u5305\u7740\u8C01\u3002",
              "\u6709\u4E00\u5904\u8981\u7559\u795E\uFF1A**\u8FD9\u4E24\u79CD\u63CF\u8FF0\u91CC\u90FD\u4E0D\u5199\u53D8\u91CF\u58F0\u660E**\u3002\u8F6C\u6210\u4F2A\u4EE3\u7801\u65F6\u8981\u81EA\u5DF1\u628A `DECLARE` \u8865\u9F50\u2014\u2014\u7167\u7740\u6807\u8BC6\u7B26\u8868\u8865\uFF0C\u4E00\u4E2A\u90FD\u4E0D\u4F1A\u6F0F\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u80FD\u4ECE\u7ED3\u6784\u5316\u82F1\u8BED\u63CF\u8FF0\u6216\u6D41\u7A0B\u56FE\u5199\u51FA\u4F2A\u4EE3\u7801\uFF0C\u5E76\u80FD\u53CD\u8FC7\u6765\u7531\u4F2A\u4EE3\u7801\u753B\u51FA\u6D41\u7A0B\u56FE\uFF08\xA79.2\uFF09\u3002\u672C\u6A21\u5757\u53EA\u505A\u300C\u8BFB\u61C2\u5E76\u8F6C\u6210\u4F2A\u4EE3\u7801\u300D\u8FD9\u4E2A\u65B9\u5411\u3002"
              }
            ]
          },
          {
            kind: "comparison",
            title: "\u540C\u4E00\u4E2A\u7B97\u6CD5\u7684\u4E09\u79CD\u5199\u6CD5",
            intro: "\u7EDF\u8BA1\u4E09\u5929\u91CC\u6709\u51E0\u5929\u6C14\u6E29\u4F4E\u4E8E\u96F6\u5EA6\u3002",
            panes: [
              {
                label: "\u6D41\u7A0B\u56FE",
                language: "diagram",
                code: [
                  "             ( start )",
                  "                 |",
                  "          [ Count \u2190 0 ]",
                  "                 |",
                  "            [ I \u2190 1 ]",
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
                  "     |     [ Count \u2190 Count + 1 ]          |",
                  "     |           |                        |",
                  "     |           +<-----------------------+",
                  "     |           |",
                  "     |     [ I \u2190 I + 1 ]",
                  "     |           |",
                  "     +-----------+"
                ].join("\n"),
                note: "\u65B9\u6846\u662F\u4E00\u6B65\u52A8\u4F5C\uFF0C\u83F1\u5F62\u662F\u5224\u65AD\u3001\u4E24\u6761\u51FA\u53E3\u5404\u8D70\u4E00\u652F\uFF1B\u6700\u5DE6\u8FB9\u90A3\u6761\u7ED5\u56DE\u53BB\u7684\u7EBF\u5C31\u662F\u5FAA\u73AF\u3002\u4FE1\u606F\u548C\u53F3\u8FB9\u90A3\u680F\u4E00\u6A21\u4E00\u6837\uFF0C\u53EA\u662F\u753B\u51FA\u6765\u4E86\u3002"
              },
              {
                label: "\u7ED3\u6784\u5316\u82F1\u8BED",
                language: "natural",
                code: [
                  "set the count to zero",
                  "repeat 3 times",
                  "    ask for a temperature and read it",
                  "    if the temperature is below zero",
                  "        add one to the count",
                  "output the count"
                ].join("\n"),
                note: "\u6BCF\u4E00\u884C\u90FD\u5BF9\u5F97\u4E0A\u4E00\u4E2A\u5199\u6CD5\uFF0C\u7F29\u8FDB\u6807\u51FA\u4E86\u8C01\u5305\u7740\u8C01\u3002\u7F3A\u7684\u53EA\u6709\u58F0\u660E\u2014\u2014\u90A3\u51E0\u884C\u5F97\u81EA\u5DF1\u8865\u3002"
              },
              {
                label: "\u4F2A\u4EE3\u7801",
                language: "pseudocode",
                code: [
                  "DECLARE Count : INTEGER",
                  "DECLARE Temperature : INTEGER",
                  "DECLARE I : INTEGER",
                  "Count \u2190 0",
                  "FOR I \u2190 1 TO 3",
                  '   OUTPUT "Enter a temperature"',
                  "   INPUT Temperature",
                  "   IF Temperature < 0 THEN",
                  "      Count \u2190 Count + 1",
                  "   ENDIF",
                  "NEXT I",
                  'OUTPUT "Frost days: ", Count'
                ].join("\n"),
                note: "\u7ED3\u6784\u8BCD\u6362\u6210\u5173\u952E\u5B57\u3001\u7F29\u8FDB\u7167\u6284\uFF0C\u518D\u628A\u524D\u4E09\u884C `DECLARE` \u8865\u4E0A\u3002\u63D0\u793A\u8BED\u4E5F\u5F97\u81EA\u5DF1\u52A0\u2014\u2014\u90A3\u4E24\u680F\u90FD\u6CA1\u5199\u5B83\u3002"
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
                note: "\u540C\u4E00\u4E2A\u7B97\u6CD5\u6362\u7B2C\u56DB\u79CD\u5199\u6CD5\u3002**\u7B97\u6CD5\u548C\u8BB0\u6CD5\u662F\u4E24\u4EF6\u4E8B**\u2014\u2014\u8FD9\u6B63\u662F\u7B2C 1 \u7AE0\u8BF4\u8FC7\u7684\uFF0C\u4E3A\u4EC0\u4E48\u8981\u6709\u4F2A\u4EE3\u7801\u8FD9\u79CD\u56FA\u5B9A\u5199\u6CD5\u3002"
              }
            ]
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u628A\u7ED3\u6784\u5316\u82F1\u8BED\u8F6C\u6210\u4F2A\u4EE3\u7801\u65F6\uFF0C\u4E0B\u9762\u54EA\u4E00\u6837**\u5FC5\u987B\u81EA\u5DF1\u8865\u4E0A**\uFF1F",
            options: [
              {
                key: "A",
                label: "\u8BED\u53E5\u7684\u5148\u540E\u987A\u5E8F",
                correct: false,
                explanation: "\u987A\u5E8F\u6B63\u662F\u8FD9\u4E24\u79CD\u63CF\u8FF0\u6700\u4E3B\u8981\u7684\u5185\u5BB9\u2014\u2014\u4E00\u4E2A\u9760\u884C\u7684\u5148\u540E\uFF0C\u4E00\u4E2A\u9760\u7BAD\u5934\u3002"
              },
              {
                key: "B",
                label: "\u5FAA\u73AF\u7684\u6B21\u6570",
                correct: false,
                explanation: "\u6B21\u6570\u5728\u63CF\u8FF0\u91CC\u5199\u7740\uFF08\u300Crepeat 3 times\u300D\uFF09\uFF0C\u7167\u6284\u5C31\u884C\u3002"
              },
              {
                key: "C",
                label: "\u53D8\u91CF\u7684\u58F0\u660E",
                correct: true,
                explanation: "\u5BF9\u3002\u7ED3\u6784\u5316\u82F1\u8BED\u548C\u6D41\u7A0B\u56FE\u90FD\u4E0D\u5199 `DECLARE`\uFF0C\u8F6C\u8FC7\u6765\u65F6\u8981\u7167\u7740\u6807\u8BC6\u7B26\u8868\u628A\u58F0\u660E\u8865\u9F50\u3002\u987A\u5E26\u8FD8\u6709 `INPUT` \u524D\u7684\u63D0\u793A\u8BED\uFF0C\u90A3\u4E24\u79CD\u63CF\u8FF0\u91CC\u901A\u5E38\u4E5F\u4E0D\u5199\u3002"
              },
              {
                key: "D",
                label: "\u5224\u65AD\u7684\u6761\u4EF6",
                correct: false,
                explanation: "\u6761\u4EF6\u5199\u5728\u300Cif the temperature is below zero\u300D\u548C\u83F1\u5F62\u91CC\uFF0C\u4E24\u8FB9\u90FD\u6709\uFF0C\u53EA\u9700\u8981\u6362\u6210\u7B26\u53F7\u3002"
              }
            ]
          },
          {
            kind: "task",
            id: "16.5.1",
            title: "\u7167\u7740\u63CF\u8FF0\u5199\u51FA\u6765",
            statement: [
              "\u4E0B\u9762\u662F\u4E00\u6BB5\u7ED3\u6784\u5316\u82F1\u8BED\u3002\u628A\u5B83**\u539F\u6837**\u8F6C\u6210\u4F2A\u4EE3\u7801\uFF08\u58F0\u660E\u548C\u8F93\u5165\u63D0\u793A\u8BED\u8981\u81EA\u5DF1\u8865\u4E0A\uFF09\uFF1A",
              "",
              "`set the count to zero`",
              "`repeat 5 times`",
              "`\u3000\u3000ask for a temperature and read it`",
              "`\u3000\u3000if the temperature is below zero`",
              "`\u3000\u3000\u3000\u3000add one to the count`",
              "`output the count`"
            ].join("\n"),
            ioSpec: {
              input: ["\u4E94\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a temperature`"].join("\n"),
              output: ["\u4E00\u884C\uFF0C\u5199\u6210\uFF1A", "`Frost days: <\u4F4E\u4E8E\u96F6\u5EA6\u7684\u5929\u6570>`", "\u5192\u53F7\u540E\u9762\u4E00\u4E2A\u7A7A\u683C\u3002"].join("\n")
            },
            constraints: {
              require: [
                {
                  feature: "loop.for",
                  reason: "\u63CF\u8FF0\u91CC\u5199\u7740\u300C\u91CD\u590D 5 \u6B21\u300D\uFF0C\u6B21\u6570\u4E8B\u5148\u5C31\u77E5\u9053\u3002"
                },
                {
                  feature: "select.if",
                  reason: "\u300C\u5982\u679C\u4F4E\u4E8E\u96F6\u5EA6\u300D\u90A3\u4E00\u53E5\u8981\u6362\u6210\u4E00\u4E2A\u5224\u65AD\u3002"
                }
              ]
            },
            hints: [
              "\u7F29\u8FDB\u7167\u6284\uFF1A\u63CF\u8FF0\u91CC\u7F29\u8FDB\u7684\u90A3\u4E24\u884C\uFF0C\u5728\u4F2A\u4EE3\u7801\u91CC\u5C31\u5728 `FOR` \u548C `IF` \u91CC\u9762\u3002",
              "\u300C\u4F4E\u4E8E\u96F6\u5EA6\u300D\u662F `< 0`\uFF0C\u4E0D\u542B\u96F6\u2014\u2014\u96F6\u5EA6\u90A3\u5929\u4E0D\u7B97\u3002",
              "\u63CF\u8FF0\u91CC\u6CA1\u5199\u7684\u4E24\u6837\u8981\u81EA\u5DF1\u8865\uFF1A\u4E09\u884C `DECLARE`\uFF0C\u8FD8\u6709\u6BCF\u6B21\u8BFB\u5165\u524D\u7684\u63D0\u793A\u8BED\u3002"
            ],
            examples: [
              {
                inputs: ["5", "-2", "0", "-7", "12"],
                outputs: [
                  "Enter a temperature",
                  "Enter a temperature",
                  "Enter a temperature",
                  "Enter a temperature",
                  "Enter a temperature",
                  "Frost days: 2"
                ]
              }
            ],
            referenceSolution: [
              "DECLARE Count : INTEGER",
              "DECLARE Temperature : INTEGER",
              "DECLARE I : INTEGER",
              "Count \u2190 0",
              "FOR I \u2190 1 TO 5",
              '   OUTPUT "Enter a temperature"',
              "   INPUT Temperature",
              "   IF Temperature < 0 THEN",
              "      Count \u2190 Count + 1",
              "   ENDIF",
              "NEXT I",
              'OUTPUT "Frost days: ", Count'
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["3", "-1", "-4", "8", "-6"], caseHint: "\u4E94\u5929\u91CC\u6709\u51E0\u5929\u5728\u96F6\u5EA6\u4EE5\u4E0B\uFF0C\u6709\u51E0\u5929\u5728\u96F6\u5EA6\u4EE5\u4E0A\u3002" },
              { id: "t2", kind: "boundary", inputs: ["0", "0", "0", "0", "0"], caseHint: "\u4E94\u5929\u5168\u662F\u96F6\u5EA6\u2014\u2014\u96F6\u5EA6\u4E0D\u7B97\u5728\u96F6\u5EA6\u4EE5\u4E0B\u3002" },
              { id: "t3", kind: "boundary", inputs: ["-1", "-1", "-1", "-1", "-1"], caseHint: "\u4E94\u5929\u5168\u5728\u96F6\u5EA6\u4EE5\u4E0B\u3002" },
              { id: "t4", kind: "boundary", inputs: ["1", "1", "1", "1", "1"], caseHint: "\u4E94\u5929\u5168\u5728\u96F6\u5EA6\u4EE5\u4E0A\uFF0C\u4E00\u5929\u90FD\u4E0D\u8BE5\u6570\u4E0A\u3002" },
              { id: "t5", kind: "extreme", inputs: ["-9999", "9999", "0", "-1", "1"], caseHint: "\u6DF7\u7740\u6781\u51B7\u548C\u6781\u70ED\u7684\u5929\u6C14\uFF0C\u8FD8\u6709\u6B63\u597D\u96F6\u5EA6\u7684\u4E00\u5929\u3002" }
            ]
          }
        ]
      },
      {
        id: "16.6",
        title: "\u9009\u6570\u636E\u7ED3\u6784\uFF0C\u9009\u63A7\u5236\u7ED3\u6784",
        syllabus: ["\xA79.2", "\xA710.1"],
        estimatedMinutes: 9,
        taughtFeatures: AFTER_CHAPTER_15,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u6C42\u7CBE\u5230\u67D0\u4E00\u5C42\uFF0C\u5C31\u5F97\u56DE\u7B54\u4E24\u4E2A\u95EE\u9898\uFF1A**\u6570\u636E\u88C5\u5728\u4EC0\u4E48\u91CC\uFF1F\u5FAA\u73AF\u7528\u54EA\u4E00\u79CD\uFF1F**\u8FD9\u4E24\u4E2A\u5224\u636E\u524D\u9762\u90FD\u7ED9\u8FC7\uFF0C\u8FD9\u91CC\u53EA\u662F\u628A\u5B83\u4EEC\u6446\u5230\u4E00\u8D77\u7528\u3002",
              "**\u6570\u636E\u7ED3\u6784**\uFF1A\u4E00\u4E2A\u503C\u7528\u53D8\u91CF\uFF1B\u4E00\u4E32\u540C\u7C7B\u578B\u7684\u3001\u4E00\u4E2A\u7F16\u53F7\u6307\u5F97\u51C6\u7684\u7528\u4E00\u7EF4\u6570\u7EC4\uFF1B\u8981\u4E24\u4E2A\u7F16\u53F7\u7684\u7528\u4E8C\u7EF4\u6570\u7EC4\uFF1B\u51E0\u6837\u4E0D\u540C\u7C7B\u578B\u51D1\u6210\u4E00\u4EFD\u7684\u7528\u8BB0\u5F55\uFF1B\u5F88\u591A\u4EFD\u8FD9\u6837\u7684\u7528\u8BB0\u5F55\u6570\u7EC4\uFF1B\u8981\u6D3B\u8FC7\u8FD9\u6B21\u8FD0\u884C\u7684\u5199\u6587\u4EF6\u3002\u672C\u7AE0\u90A3\u9053\u9898\u662F\u300C5 \u4E2A\u4EBA\uFF0C\u6BCF\u4EBA\u59D3\u540D + \u5206\u6570\u300D\u2014\u2014**\u51E0\u6837\u4E0D\u540C\u7C7B\u578B\u51D1\u6210\u4E00\u4EFD\u3001\u6709\u5F88\u591A\u4EFD**\uFF0C\u6240\u4EE5\u662F\u8BB0\u5F55\u6570\u7EC4\u3002",
              "**\u63A7\u5236\u7ED3\u6784**\uFF1A\u6B21\u6570\u4E8B\u5148\u77E5\u9053\u7528 `FOR`\uFF1B\u4E0D\u77E5\u9053\u3001\u800C\u4E14\u53EF\u80FD\u4E00\u6B21\u90FD\u4E0D\u505A\u7528 `WHILE`\uFF1B\u4E0D\u77E5\u9053\u3001\u4F46\u81F3\u5C11\u505A\u4E00\u6B21\u7528 `REPEAT`\uFF1B\u4ECE\u51E0\u6761\u8DEF\u91CC\u6311\u4E00\u6761\u7528 `IF` \u4E32\u63A5\uFF0C\u62FF\u540C\u4E00\u4E2A\u4E1C\u897F\u6BD4\u4E0D\u540C\u7684\u503C\u7528 `CASE`\u3002\u672C\u7AE0\u90A3\u9053\u9898\u4EBA\u6570\u56FA\u5B9A\u662F 5\uFF0C\u4E24\u5904\u5FAA\u73AF\u90FD\u662F `FOR`\u3002",
              "\u4E24\u4E2A\u5224\u636E\u90FD\u6709\u540C\u4E00\u53E5\u8BDD\u57AB\u5E95\uFF1A**\u9009\u5BF9\u4E86\uFF0C\u4EE3\u7801\u5C31\u4E0D\u7528\u505A\u591A\u4F59\u7684\u4E8B\u3002**\u9009\u9519\u4E0D\u4F1A\u7ACB\u523B\u62A5\u9519\u2014\u2014\u7528\u5E73\u884C\u6570\u7EC4\u4E5F\u80FD\u5B58\u8FD9\u4E2A\u73ED\uFF0C\u53EA\u662F\u6392\u5E8F\u65F6\u8981\u8BB0\u5F97\u4E24\u4E2A\u6570\u7EC4\u4E00\u8D77\u6362\uFF08\u7B2C 11 \u7AE0\uFF09\uFF1B\u7528 `REPEAT` \u8BFB\u4E00\u4E2A\u53EF\u80FD\u4E00\u884C\u90FD\u6CA1\u6709\u7684\u6587\u4EF6\u4E5F\u80FD\u5199\uFF0C\u53EA\u662F\u7A7A\u6587\u4EF6\u4F1A\u88AB\u591A\u8BFB\u4E00\u6B21\uFF08\u7B2C 14 \u7AE0\uFF09\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u4E3A\u95EE\u9898\u89E3\u6CD5\u9009\u62E9\u5E76\u4F7F\u7528\u5408\u9002\u7684\u6570\u636E\u7C7B\u578B\u4E0E\u6570\u636E\u7ED3\u6784\uFF08\xA710.1\u3001\xA710.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u9009\u5B9A\u4E4B\u540E\uFF0C\u8BFB\u5165\u90A3\u4E00\u6BB5\u7684\u6837\u5B50",
            fileName: "Example_16_6_a.pseudocode",
            code: [
              "TYPE TStudent",
              "   DECLARE Name : STRING",
              "   DECLARE Mark : INTEGER",
              "ENDTYPE",
              "DECLARE Form : ARRAY[1:5] OF TStudent",
              "DECLARE I : INTEGER",
              "DECLARE Total : INTEGER",
              "Total \u2190 0",
              "FOR I \u2190 1 TO 5",
              '   OUTPUT "Enter a name"',
              "   INPUT Form[I].Name",
              '   OUTPUT "Enter a mark"',
              "   INPUT Form[I].Mark",
              "   Total \u2190 Total + Form[I].Mark",
              "NEXT I",
              'OUTPUT "Average: ", Total DIV 5'
            ].join("\n"),
            annotations: [
              { fromLine: 1, toLine: 5, text: "\u6570\u636E\u7ED3\u6784\u7684\u51B3\u5B9A\u843D\u5728\u8FD9\u4E94\u884C\u4E0A\uFF1A\u4E00\u4EFD\u662F\u4E00\u6761\u8BB0\u5F55\uFF0C\u4E94\u4EFD\u662F\u4E00\u4E2A\u8BB0\u5F55\u6570\u7EC4\u3002" },
              { fromLine: 9, toLine: 15, text: "\u63A7\u5236\u7ED3\u6784\u7684\u51B3\u5B9A\u843D\u5728\u8FD9\u4E00\u884C\u4E0A\uFF1A\u4EBA\u6570\u56FA\u5B9A\uFF0C\u6240\u4EE5\u662F `FOR`\u3002" },
              { fromLine: 14, toLine: 14, text: "\u603B\u5206\u8FB9\u8BFB\u8FB9\u52A0\u3002\u5B83\u4E0D\u8FDD\u53CD\u300C\u975E\u5B58\u4E0B\u6765\u4E0D\u53EF\u300D\u2014\u2014\u5B58\u7684\u662F\u6BCF\u4E2A\u4EBA\u7684\u5206\u6570\uFF0C\u603B\u5206\u53EA\u662F\u987A\u624B\u6512\u7684\u3002" }
            ],
            sampleRun: {
              inputs: ["Ada", "80", "Bob", "70", "Cal", "90", "Dee", "60", "Eve", "100"],
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
                "Average: 80"
              ]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E00\u4E2A\u7A0B\u5E8F\u8981\u4E00\u884C\u4E00\u884C\u8BFB\u5B8C\u4E00\u4E2A\u6587\u4EF6\uFF0C\u6587\u4EF6\u91CC\u6709\u51E0\u884C\u4E8B\u5148\u4E0D\u77E5\u9053\u3002\u8BE5\u7528\u54EA\u79CD\u5FAA\u73AF\uFF1F",
            options: [
              {
                key: "A",
                label: "`WHILE ... ENDWHILE`",
                correct: true,
                explanation: "\u5BF9\u3002\u6B21\u6570\u4E0D\u77E5\u9053\uFF0C\u800C\u4E14\u7A7A\u6587\u4EF6\u5E94\u8BE5\u4E00\u6B21\u90FD\u4E0D\u8BFB\u2014\u2014\u5148\u770B\u6761\u4EF6\u7684\u5FAA\u73AF\u6B63\u597D\u4E24\u6761\u90FD\u6EE1\u8DB3\uFF0C\u8FD9\u5C31\u662F\u7B2C 14 \u7AE0\u90A3\u4E2A `WHILE NOT EOF(...)`\u3002"
              },
              {
                key: "B",
                label: "\u4E24\u5C42\u5D4C\u5957\u5FAA\u73AF",
                correct: false,
                explanation: "\u5D4C\u5957\u662F\u7ED9\u300C\u6BCF\u4E00\u884C\u91CC\u8FD8\u8981\u518D\u8D70\u4E00\u904D\u300D\u51C6\u5907\u7684\u3002\u4E00\u884C\u4E00\u884C\u8BFB\u5B8C\u53EA\u9700\u8981\u4E00\u5C42\u3002"
              },
              {
                key: "C",
                label: "`REPEAT ... UNTIL`",
                correct: false,
                explanation: "\u5B83\u81F3\u5C11\u505A\u4E00\u6B21\u3002\u78B0\u4E0A\u4E00\u884C\u90FD\u6CA1\u6709\u7684\u7A7A\u6587\u4EF6\uFF0C\u7B2C\u4E00\u6B21\u8BFB\u5C31\u6CA1\u6709\u884C\u53EF\u8BFB\uFF0C\u7A0B\u5E8F\u4F1A\u505C\u4E0B\u6765\u3002"
              },
              {
                key: "D",
                label: "`FOR ... TO ... NEXT`",
                correct: false,
                explanation: "`FOR` \u8981\u4E8B\u5148\u5199\u51FA\u6B21\u6570\uFF0C\u800C\u8FD9\u91CC\u6B63\u662F\u4E0D\u77E5\u9053\u6709\u51E0\u884C\u3002\u5199\u6B7B\u4E00\u4E2A\u6570\u5C31\u7B49\u4E8E\u5728\u5047\u8BBE\u6587\u4EF6\u6709\u591A\u957F\u3002"
              }
            ]
          }
        ]
      },
      {
        id: "16.7",
        title: "\u5199\u51FA\u4E00\u4E2A\u5B8C\u6574\u89E3",
        syllabus: ["\xA79.2", "\xA712.2"],
        estimatedMinutes: 10,
        taughtFeatures: AFTER_CHAPTER_15,
        blocks: [
          {
            kind: "explanation",
            paragraphs: [
              "\u524D\u9762\u516D\u6B65\u8D70\u5B8C\uFF0C\u4EE3\u7801\u57FA\u672C\u662F\u6284\u51FA\u6765\u7684\uFF1A\u7ED3\u6784\u56FE\u4E0A\u7684\u4E09\u4E2A\u65B9\u6846\u53D8\u6210\u4E09\u4E2A\u5934\u90E8\uFF0C\u7BAD\u5934\u53D8\u6210\u53C2\u6570\u548C\u8FD4\u56DE\u503C\uFF0C\u6C42\u7CBE\u7684\u6700\u540E\u4E00\u5C42\u53D8\u6210\u5404\u81EA\u7684\u4F53\uFF0C\u6807\u8BC6\u7B26\u8868\u53D8\u6210 `DECLARE`\u3002",
              "\u4E3B\u7A0B\u5E8F\u6B64\u65F6\u5E94\u8BE5\u5F88\u77ED\u2014\u2014\u51E0\u884C\u58F0\u660E\u52A0\u4E00\u4E32\u8C03\u7528\u3002**\u4E3B\u7A0B\u5E8F\u4E00\u957F\uFF0C\u8BF4\u660E\u6709\u4EF6\u4E8B\u6CA1\u62C6\u51FA\u53BB\u3002**\u8FD9\u662F\u68C0\u67E5\u5206\u89E3\u505A\u5F97\u597D\u4E0D\u597D\u6700\u5FEB\u7684\u529E\u6CD5\u3002",
              "\u6709\u4E00\u5904\u662F\u7B2C 12 \u7AE0\u7684\u89C4\u77E9\u5728\u8D77\u4F5C\u7528\uFF1A\u300C\u8BFB\u5165\u4E00\u4E2A\u73ED\u300D\u8981\u628A\u73ED\u7EA7\u548C\u603B\u5206\u90FD\u4EA4\u56DE\u4E3B\u7A0B\u5E8F\uFF0C\u800C\u51FD\u6570\u53EA\u8FD8\u4E00\u4E2A\u503C\uFF0C\u6240\u4EE5\u5B83\u5199\u6210\u8FC7\u7A0B\u3001\u4E24\u6837\u90FD\u8D70 `BYREF`\uFF1B\u300C\u7B97\u5E73\u5747\u5206\u300D\u53EA\u4EA4\u56DE\u4E00\u4E2A\u6570\uFF0C\u5199\u6210\u51FD\u6570\u6700\u7701\u4E8B\u3002",
              "\u5199\u5B8C\u522B\u5FD8\u4E86\u81EA\u5DF1\u8DD1\u4E00\u904D\uFF0C\u800C\u4E14\u8981\u4E13\u95E8\u8BD5**\u8FB9\u754C**\uFF1A\u5168\u73ED\u540C\u5206\u65F6\u8C01\u90FD\u4E0D\u9AD8\u4E8E\u5E73\u5747\uFF0C\u96F6\u5206\u548C\u6EE1\u5206\u6DF7\u5728\u4E00\u8D77\u65F6\u6570\u5B57\u5BF9\u4E0D\u5BF9\u3002**\u8FD9\u4E00\u6B65\u8C01\u90FD\u66FF\u4E0D\u4E86\u4F60**\u2014\u2014\u524D\u9762\u516D\u6B65\u4FDD\u8BC1\u7684\u662F\u300C\u60F3\u6E05\u695A\u4E86\u300D\uFF0C\u8DD1\u4E00\u904D\u624D\u77E5\u9053\u300C\u5199\u5BF9\u4E86\u300D\u3002"
            ],
            callouts: [
              {
                source: "CAIE",
                text: "\u8003\u7EB2\u8981\u6C42\u628A\u95EE\u9898\u5206\u89E3\u4E3A\u5B50\u95EE\u9898\uFF0C\u8FDB\u800C\u5F62\u6210\u7A0B\u5E8F\u6A21\u5757\uFF08\u8FC7\u7A0B / \u51FD\u6570\uFF09\uFF0C\u5E76\u5199\u51FA\u5B8C\u6574\u7684\u89E3\uFF08\xA79.2\u3001\xA712.2\uFF09\u3002"
              }
            ]
          },
          {
            kind: "example",
            title: "\u672C\u7AE0\u90A3\u9053\u9898\u7684\u5B8C\u6574\u89E3",
            fileName: "Example_16_7_a.pseudocode",
            code: [
              "TYPE TStudent",
              "   DECLARE Name : STRING",
              "   DECLARE Mark : INTEGER",
              "ENDTYPE",
              "PROCEDURE ReadClass(BYREF Form : ARRAY[1:5] OF TStudent, BYREF Total : INTEGER)",
              "   DECLARE I : INTEGER",
              "   Total \u2190 0",
              "   FOR I \u2190 1 TO 5",
              '      OUTPUT "Enter a name"',
              "      INPUT Form[I].Name",
              '      OUTPUT "Enter a mark"',
              "      INPUT Form[I].Mark",
              "      Total \u2190 Total + Form[I].Mark",
              "   NEXT I",
              "ENDPROCEDURE",
              "FUNCTION AverageOf(Total : INTEGER, Count : INTEGER) RETURNS INTEGER",
              "   RETURN Total DIV Count",
              "ENDFUNCTION",
              "PROCEDURE ShowAbove(Form : ARRAY[1:5] OF TStudent, Mean : INTEGER)",
              "   DECLARE I : INTEGER",
              "   FOR I \u2190 1 TO 5",
              "      IF Form[I].Mark > Mean THEN",
              "         OUTPUT Form[I].Name",
              "      ENDIF",
              "   NEXT I",
              "ENDPROCEDURE",
              "DECLARE Group : ARRAY[1:5] OF TStudent",
              "DECLARE Sum : INTEGER",
              "DECLARE Mean : INTEGER",
              "CALL ReadClass(Group, Sum)",
              "Mean \u2190 AverageOf(Sum, 5)",
              'OUTPUT "Average: ", Mean',
              "CALL ShowAbove(Group, Mean)"
            ].join("\n"),
            annotations: [
              { fromLine: 5, toLine: 5, text: "\u4E24\u6837\u90FD\u8981\u4EA4\u56DE\u4E3B\u7A0B\u5E8F\uFF0C\u6240\u4EE5\u662F\u8FC7\u7A0B\u52A0\u4E24\u4E2A `BYREF`\u2014\u2014\u7ED3\u6784\u56FE\u4E0A\u90A3\u4E24\u4E2A\u671D\u4E0A\u7684\u7BAD\u5934\u3002" },
              { fromLine: 19, toLine: 19, text: "\u53EA\u5F80\u4E0B\u4F20\uFF0C\u4EC0\u4E48\u90FD\u4E0D\u4EA4\u56DE\uFF0C\u800C\u4E14\u6570\u7EC4\u662F\u62FF\u6765\u770B\u7684\uFF0C\u6240\u4EE5\u7528\u9ED8\u8BA4\u7684\u4F20\u503C\u3002" },
              { fromLine: 27, toLine: 33, text: "\u4E3B\u7A0B\u5E8F\u53EA\u5269\u4E03\u884C\uFF1A\u4E09\u884C\u58F0\u660E\u3001\u4E09\u6B21\u8C03\u7528\u3001\u4E00\u53E5\u663E\u793A\u3002\u62C6\u5F97\u5BF9\u7684\u65F6\u5019\u5B83\u5C31\u8BE5\u8FD9\u4E48\u77ED\u3002" }
            ],
            sampleRun: {
              inputs: ["Ada", "80", "Bob", "70", "Cal", "90", "Dee", "60", "Eve", "100"],
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
                "Average: 80",
                "Cal",
                "Eve"
              ]
            }
          },
          {
            kind: "quiz",
            type: "single-choice",
            prompt: "\u4E0A\u9762\u90A3\u4E2A\u5B8C\u6574\u89E3\u91CC\uFF0C\u5168\u73ED\u4E94\u4E2A\u4EBA\u5206\u6570\u5B8C\u5168\u76F8\u540C\u65F6\uFF0C\u5C4F\u5E55\u4E0A\u4F1A\u6709\u51E0\u884C\uFF1F",
            options: [
              {
                key: "A",
                label: "\u7A0B\u5E8F\u4F1A\u505C\u4E0B\u6765\uFF0C\u56E0\u4E3A\u6CA1\u6709\u4EBA\u9AD8\u4E8E\u5E73\u5747\u5206",
                correct: false,
                explanation: "\u4E00\u4E2A\u90FD\u6311\u4E0D\u51FA\u6765\u662F\u5B8C\u5168\u6B63\u5E38\u7684\u7ED3\u679C\uFF0C\u4E0D\u662F\u9519\u8BEF\u3002\u5FAA\u73AF\u8D70\u5B8C\u5C31\u7ED3\u675F\u4E86\u3002"
              },
              {
                key: "B",
                label: "\u4E24\u884C\uFF1A\u5E73\u5747\u5206\uFF0C\u52A0\u4E00\u884C\u300C\u6CA1\u6709\u4EBA\u9AD8\u4E8E\u5E73\u5747\u5206\u300D",
                correct: false,
                explanation: "\u4EE3\u7801\u91CC\u6CA1\u6709\u8FD9\u4E48\u4E00\u53E5\u3002\u60F3\u8981\u5B83\u5C31\u5F97\u81EA\u5DF1\u52A0\u2014\u2014\u8FD9\u4E5F\u8BF4\u660E\u4E3A\u4EC0\u4E48\u5199\u5B8C\u8981\u7167\u7740\u9898\u76EE\u518D\u6838\u4E00\u904D\u8F93\u51FA\u683C\u5F0F\u3002"
              },
              {
                key: "C",
                label: "\u516D\u884C\uFF1A\u5E73\u5747\u5206\u4E00\u884C\uFF0C\u4E94\u4E2A\u4EBA\u5404\u4E00\u884C",
                correct: false,
                explanation: "\u6761\u4EF6\u662F\u300C\u9AD8\u4E8E\u5E73\u5747\u5206\u300D\u3002\u5206\u6570\u90FD\u4E00\u6837\u65F6\u5E73\u5747\u5206\u5C31\u7B49\u4E8E\u6BCF\u4E2A\u4EBA\u7684\u5206\u6570\uFF0C\u8C01\u90FD\u4E0D\u6BD4\u5B83\u9AD8\u3002"
              },
              {
                key: "D",
                label: "\u4E00\u884C\uFF1A\u53EA\u6709\u5E73\u5747\u5206",
                correct: true,
                explanation: "\u5BF9\u3002`Form[I].Mark > Mean` \u4E00\u6B21\u90FD\u4E0D\u6210\u7ACB\uFF0C`ShowAbove` \u91CC\u4E00\u53E5 `OUTPUT` \u90FD\u4E0D\u6267\u884C\u3002**\u8FD9\u6B63\u662F\u5199\u5B8C\u8981\u4E13\u95E8\u8BD5\u7684\u90A3\u79CD\u8FB9\u754C\u3002**"
              }
            ]
          },
          {
            kind: "task",
            id: "16.7.1",
            title: "\u53CA\u683C\u540D\u5355\u5B58\u8FDB\u6587\u4EF6",
            statement: "\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165 6 \u4E2A\u5206\u6570\uFF0C\u6BCF\u8BFB\u4E00\u4E2A\u5C31\u5F80\u6587\u4EF6\u91CC\u5199\u4E00\u884C\u2014\u2014\u53CA\u683C\uFF0850 \u5206\u53CA\u4EE5\u4E0A\uFF09\u5199 `pass`\uFF0C\u4E0D\u53CA\u683C\u5199 `fail`\uFF1B\u516D\u4E2A\u8BFB\u5B8C\u5173\u6389\u6587\u4EF6\uFF0C\u518D\u628A\u6587\u4EF6\u8BFB\u56DE\u6765\u7EDF\u8BA1\u53CA\u683C\u548C\u4E0D\u53CA\u683C\u5404\u6709\u51E0\u4E2A\uFF0C\u663E\u793A\u51FA\u6765\u3002\u8BFB\u6587\u4EF6\u65F6\u4E0D\u8BB8\u5047\u8BBE\u6709\u51E0\u884C\u3002",
            ioSpec: {
              input: ["\u516D\u884C\uFF0C\u5404\u4E00\u4E2A `INTEGER`\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A", "`Enter a mark`"].join("\n"),
              output: [
                "\u8BFB\u5B8C\u7EDF\u8BA1\u5B8C\u4E4B\u540E\u663E\u793A\u4E24\u884C\uFF1A",
                "`Passes: <\u53CA\u683C\u4E2A\u6570>`",
                "`Fails: <\u4E0D\u53CA\u683C\u4E2A\u6570>`",
                "\u6BCF\u4E2A\u5192\u53F7\u540E\u9762\u4E00\u4E2A\u7A7A\u683C\u3002"
              ].join("\n")
            },
            constraints: {
              require: [
                {
                  feature: "file.write",
                  reason: "\u5224\u8FC7\u4E4B\u540E\u7684\u7ED3\u679C\u8981\u5199\u8FDB\u6587\u4EF6\uFF0C\u4E0D\u80FD\u53EA\u7559\u5728\u53D8\u91CF\u91CC\u3002"
                },
                {
                  feature: "builtin.eof",
                  reason: "\u9898\u76EE\u8981\u6C42\u8BFB\u7684\u65F6\u5019\u4E0D\u8BB8\u5047\u8BBE\u6587\u4EF6\u6709\u51E0\u884C\u3002"
                },
                {
                  feature: "select.if-else",
                  reason: "\u53CA\u683C\u548C\u4E0D\u53CA\u683C\u5404\u5199\u4E00\u79CD\u6587\u5B57\uFF0C\u4E24\u6761\u8DEF\u90FD\u8981\u6709\u3002"
                }
              ]
            },
            hints: [
              "\u5199\u7684\u65F6\u5019\u6B21\u6570\u77E5\u9053\uFF08\u516D\u4E2A\uFF09\uFF0C\u8BFB\u7684\u65F6\u5019\u4E0D\u77E5\u9053\u2014\u2014\u4E24\u6BB5\u7528\u7684\u5FAA\u73AF\u4E0D\u4E00\u6837\u3002",
              "\u5199\u8FDB\u6587\u4EF6\u7684\u662F `pass` \u6216 `fail` \u8FD9\u4E24\u6BB5\u6587\u5B57\uFF1B\u8BFB\u56DE\u6765\u6BD4\u7684\u4E5F\u662F\u6587\u5B57\uFF0C\u4E0D\u662F\u5206\u6570\u3002",
              "\u4E24\u4E2A\u8BA1\u6570\u53EA\u7528\u6570\u4E00\u4E2A\uFF0C\u53E6\u4E00\u4E2A\u51CF\u51FA\u6765\u5C31\u884C\uFF1B\u5199\u5B8C\u4E00\u5B9A\u8981 `CLOSEFILE` \u624D\u8BFB\u5F97\u4E86\u3002"
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
              "DECLARE I : INTEGER",
              "DECLARE Line : STRING",
              "DECLARE Passes : INTEGER",
              'OPENFILE "Marks.txt" FOR WRITE',
              "FOR I \u2190 1 TO 6",
              '   OUTPUT "Enter a mark"',
              "   INPUT Mark",
              "   IF Mark >= 50 THEN",
              '      WRITEFILE "Marks.txt", "pass"',
              "   ELSE",
              '      WRITEFILE "Marks.txt", "fail"',
              "   ENDIF",
              "NEXT I",
              'CLOSEFILE "Marks.txt"',
              "Passes \u2190 0",
              'OPENFILE "Marks.txt" FOR READ',
              'WHILE NOT EOF("Marks.txt")',
              '   READFILE "Marks.txt", Line',
              '   IF Line = "pass" THEN',
              "      Passes \u2190 Passes + 1",
              "   ENDIF",
              "ENDWHILE",
              'CLOSEFILE "Marks.txt"',
              'OUTPUT "Passes: ", Passes',
              'OUTPUT "Fails: ", 6 - Passes'
            ].join("\n"),
            tests: [
              { id: "t1", kind: "normal", inputs: ["71", "32", "88", "45", "50", "63"], caseHint: "\u53CA\u683C\u548C\u4E0D\u53CA\u683C\u90FD\u6709\uFF0C\u63BA\u7740\u6765\u3002" },
              { id: "t2", kind: "boundary", inputs: ["50", "50", "50", "50", "50", "50"], caseHint: "\u516D\u4E2A\u90FD\u6B63\u597D\u8E29\u5728\u53CA\u683C\u7EBF\u4E0A\u2014\u2014\u90A3\u6761\u7EBF\u662F\u300C\u53CA\u4EE5\u4E0A\u300D\u3002" },
              { id: "t3", kind: "boundary", inputs: ["49", "49", "49", "49", "49", "49"], caseHint: "\u516D\u4E2A\u90FD\u5DEE\u4E00\u5206\uFF0C\u4E00\u4E2A\u90FD\u4E0D\u53CA\u683C\u3002" },
              { id: "t4", kind: "boundary", inputs: ["100", "100", "100", "100", "100", "100"], caseHint: "\u516D\u4E2A\u90FD\u6EE1\u5206\u3002" },
              { id: "t5", kind: "extreme", inputs: ["99999", "-99999", "0", "50", "49", "1"], caseHint: "\u6DF7\u7740\u5927\u5F97\u79BB\u8C31\u548C\u5F88\u5C0F\u7684\u8D1F\u6570\uFF0C\u8FD8\u6709\u6B63\u597D\u8E29\u7EBF\u7684\u3002" }
            ]
          }
        ]
      }
    ],
    chapterTasks: [
      {
        kind: "chapterTask",
        id: "16.T1",
        title: "\u501F\u9605\u7EDF\u8BA1",
        statement: "\u6309\u8FD9\u4E00\u7AE0\u7684\u6B65\u9AA4\u5199\u4E00\u6BB5\u4F2A\u4EE3\u7801\uFF1A\u8BFB\u5165 5 \u672C\u4E66\u7684\u4E66\u540D\u548C\u501F\u51FA\u6B21\u6570\uFF0C\u663E\u793A\u501F\u51FA\u603B\u6B21\u6570\u3001\u5E73\u5747\u6B21\u6570\uFF08\u53D6\u6574\u6570\u5546\uFF09\uFF0C\u4EE5\u53CA\u501F\u51FA\u6B21\u6570\u6700\u591A\u7684\u90A3\u672C\u4E66\u7684\u4E66\u540D\u3002\u4FDD\u8BC1\u6700\u591A\u7684\u90A3\u672C\u53EA\u6709\u4E00\u672C\u3002\u5148\u628A\u4E09\u6837\uFF08\u5DF2\u77E5\u3001\u8981\u6C42\u3001\u7EA6\u675F\uFF09\u548C\u6807\u8BC6\u7B26\u8868\u60F3\u6E05\u695A\uFF0C\u518D\u5206\u89E3\u3001\u6C42\u7CBE\u3001\u52A8\u624B\u3002",
        ioSpec: {
          input: [
            "\u5341\u884C\uFF0C\u4E00\u672C\u4E66\u4E24\u884C\uFF1A\u5148\u4E66\u540D\uFF08`STRING`\uFF09\uFF0C\u518D\u501F\u51FA\u6B21\u6570\uFF08`INTEGER`\uFF09\uFF0C\u4E94\u672C\u4F9D\u6B21\u8BFB\u5B8C\u3002\u6BCF\u6B21\u8BFB\u53D6\u4E4B\u524D\u90FD\u8981\u663E\u793A\u63D0\u793A\u8BED\uFF0C\u4E00\u5B57\u4E0D\u5DEE\uFF1A",
            "\u4E66\u540D\u524D\u662F `Enter a title`\uFF0C\u6B21\u6570\u524D\u662F `Enter a loan count`"
          ].join("\n"),
          output: [
            "\u8BFB\u5B8C\u4E4B\u540E\u663E\u793A\u4E09\u884C\uFF1A",
            "`Total loans: <\u603B\u6B21\u6570>`",
            "`Average loans: <\u5E73\u5747\u6B21\u6570>`",
            "`Most borrowed: <\u4E66\u540D>`",
            "\u6BCF\u4E2A\u5192\u53F7\u540E\u9762\u4E00\u4E2A\u7A7A\u683C\u3002"
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
          "\u4E66\u540D\u548C\u6B21\u6570\u662F\u540C\u4E00\u672C\u4E66\u7684\u4E24\u6837\u4E1C\u897F\u2014\u2014\u7B2C 11 \u7AE0\u8BF4\u8FC7\u8FD9\u79CD\u8BE5\u7ED1\u6210\u4E00\u4EFD\u3002",
          "\u300C\u6700\u591A\u7684\u90A3\u672C\u300D\u8BB0\u4F4F\u5B83\u5728\u7B2C\u51E0\u683C\u5C31\u591F\u4E86\uFF0C\u4E66\u540D\u548C\u6B21\u6570\u90FD\u80FD\u4ECE\u90A3\u4E00\u683C\u53D6\u5230\u3002",
          "\u8BFB\u5165\u3001\u627E\u6700\u591A\u3001\u663E\u793A\uFF0C\u53EF\u4EE5\u5404\u5199\u6210\u4E00\u4EF6\u4E8B\uFF1B\u4E3B\u7A0B\u5E8F\u5E94\u8BE5\u53EA\u5269\u51E0\u884C\u58F0\u660E\u548C\u4E00\u4E32\u8C03\u7528\u3002"
        ],
        examples: [
          {
            inputs: ["Dune", "12", "Emma", "3", "Hamlet", "20", "Ivanhoe", "5", "Jaws", "7"],
            outputs: [
              "Enter a title",
              "Enter a loan count",
              "Enter a title",
              "Enter a loan count",
              "Enter a title",
              "Enter a loan count",
              "Enter a title",
              "Enter a loan count",
              "Enter a title",
              "Enter a loan count",
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
          "   DECLARE I : INTEGER",
          "   Total \u2190 0",
          "   FOR I \u2190 1 TO 5",
          '      OUTPUT "Enter a title"',
          "      INPUT Shelf[I].Title",
          '      OUTPUT "Enter a loan count"',
          "      INPUT Shelf[I].Loans",
          "      Total \u2190 Total + Shelf[I].Loans",
          "   NEXT I",
          "ENDPROCEDURE",
          "FUNCTION BestOf(Shelf : ARRAY[1:5] OF TBook) RETURNS INTEGER",
          "   DECLARE I : INTEGER",
          "   DECLARE Best : INTEGER",
          "   Best \u2190 1",
          "   FOR I \u2190 2 TO 5",
          "      IF Shelf[I].Loans > Shelf[Best].Loans THEN",
          "         Best \u2190 I",
          "      ENDIF",
          "   NEXT I",
          "   RETURN Best",
          "ENDFUNCTION",
          "DECLARE Books : ARRAY[1:5] OF TBook",
          "DECLARE Total : INTEGER",
          "DECLARE Top : INTEGER",
          "CALL ReadBooks(Books, Total)",
          "Top \u2190 BestOf(Books)",
          'OUTPUT "Total loans: ", Total',
          'OUTPUT "Average loans: ", Total DIV 5',
          'OUTPUT "Most borrowed: ", Books[Top].Title'
        ].join("\n"),
        tests: [
          { id: "t1", kind: "normal", inputs: ["Alpha", "4", "Beta", "9", "Gamma", "2", "Delta", "6", "Sigma", "1"], caseHint: "\u4E94\u672C\u6B21\u6570\u5404\u4E0D\u76F8\u540C\uFF0C\u6700\u591A\u7684\u90A3\u672C\u5728\u4E2D\u95F4\u3002" },
          { id: "t2", kind: "boundary", inputs: ["Alpha", "9", "Beta", "1", "Gamma", "2", "Delta", "3", "Sigma", "4"], caseHint: "\u6700\u591A\u7684\u6B63\u597D\u662F\u7B2C\u4E00\u672C\u8BFB\u8FDB\u6765\u7684\u3002" },
          { id: "t3", kind: "boundary", inputs: ["Alpha", "1", "Beta", "2", "Gamma", "3", "Delta", "4", "Sigma", "9"], caseHint: "\u6700\u591A\u7684\u6B63\u597D\u662F\u6700\u540E\u4E00\u672C\u8BFB\u8FDB\u6765\u7684\u3002" },
          { id: "t4", kind: "boundary", inputs: ["Alpha", "0", "Beta", "0", "Gamma", "0", "Delta", "0", "Sigma", "1"], caseHint: "\u51E0\u4E4E\u5168\u662F\u96F6\uFF0C\u5E73\u5747\u6570\u4F1A\u88AB\u6574\u9664\u622A\u6389\u3002" },
          { id: "t5", kind: "normal", inputs: ["Two words here", "5", "Beta", "5", "Gamma", "5", "Delta", "5", "Sigma", "6"], caseHint: "\u4E66\u540D\u91CC\u5E26\u7A7A\u683C\uFF0C\u5176\u4F59\u51E0\u672C\u6B21\u6570\u5B8C\u5168\u76F8\u540C\u3002" },
          { id: "t6", kind: "extreme", inputs: ["Alpha", "99999", "Beta", "0", "Gamma", "0", "Delta", "0", "Sigma", "1"], caseHint: "\u4E00\u672C\u5927\u5F97\u79BB\u8C31\uFF0C\u5176\u4F59\u51E0\u4E4E\u662F\u96F6\u3002" }
        ]
      }
    ]
  };

  // packages/teaching-content/src/expected-outputs.ts
  var expectedOutputs = {
    "1.2.1/t1": [
      "Enter the name",
      "Enter the city",
      "Chen lives in Shanghai"
    ],
    "1.2.1/t2": [
      "Enter the name",
      "Enter the city",
      "Bianca lives in Lisbon"
    ],
    "1.2.1/t3": [
      "Enter the name",
      "Enter the city",
      "A lives in B"
    ],
    "1.2.1/t4": [
      "Enter the name",
      "Enter the city",
      "Maximiliana Gwendolyn Rosalind lives in San Cristobal de las Casas"
    ],
    "1.T1/t1": [
      "Enter the student name",
      "Enter the subject",
      "Enter the room",
      "Enrolment confirmed",
      "Student: Chen",
      "Subject: Physics",
      "Room: A101"
    ],
    "1.T1/t2": [
      "Enter the student name",
      "Enter the subject",
      "Enter the room",
      "Enrolment confirmed",
      "Student: Bianca",
      "Subject: Further Mathematics",
      "Room: Lab 3"
    ],
    "1.T1/t3": [
      "Enter the student name",
      "Enter the subject",
      "Enter the room",
      "Enrolment confirmed",
      "Student: A",
      "Subject: B",
      "Room: C"
    ],
    "1.T1/t4": [
      "Enter the student name",
      "Enter the subject",
      "Enter the room",
      "Enrolment confirmed",
      "Student: Maximiliana Gwendolyn Rosalind",
      "Subject: Design and Technology: Product Design",
      "Room: Building C, Second Floor, Room 214"
    ],
    "2.4.1/t1": [
      "Points: 0"
    ],
    "2.T1/t1": [
      "Pass mark: 50",
      "Score: 64"
    ],
    "3.2.1/t1": [
      "Enter the seconds",
      "1 min 35 s"
    ],
    "3.2.1/t2": [
      "Enter the seconds",
      "4 min 5 s"
    ],
    "3.2.1/t3": [
      "Enter the seconds",
      "0 min 0 s"
    ],
    "3.2.1/t4": [
      "Enter the seconds",
      "2 min 0 s"
    ],
    "3.2.1/t5": [
      "Enter the seconds",
      "1439 min 59 s"
    ],
    "3.T1/t1": [
      "Enter the unit price",
      "Enter the quantity",
      "Total: 345",
      "Yuan: 3 Fen: 45",
      "Free delivery: FALSE"
    ],
    "3.T1/t2": [
      "Enter the unit price",
      "Enter the quantity",
      "Total: 1000",
      "Yuan: 10 Fen: 0",
      "Free delivery: TRUE"
    ],
    "3.T1/t3": [
      "Enter the unit price",
      "Enter the quantity",
      "Total: 500",
      "Yuan: 5 Fen: 0",
      "Free delivery: TRUE"
    ],
    "3.T1/t4": [
      "Enter the unit price",
      "Enter the quantity",
      "Total: 0",
      "Yuan: 0 Fen: 0",
      "Free delivery: FALSE"
    ],
    "3.T1/t5": [
      "Enter the unit price",
      "Enter the quantity",
      "Total: 9899901",
      "Yuan: 98999 Fen: 1",
      "Free delivery: TRUE"
    ],
    "4.2.1/t1": [
      "Enter a number",
      "Odd"
    ],
    "4.2.1/t2": [
      "Enter a number",
      "Even"
    ],
    "4.2.1/t3": [
      "Enter a number",
      "Even"
    ],
    "4.2.1/t4": [
      "Enter a number",
      "Odd"
    ],
    "4.5.1/t1": [
      "Enter the day number",
      "Wednesday"
    ],
    "4.5.1/t2": [
      "Enter the day number",
      "Saturday"
    ],
    "4.5.1/t3": [
      "Enter the day number",
      "Monday"
    ],
    "4.5.1/t4": [
      "Enter the day number",
      "Sunday"
    ],
    "4.5.1/t5": [
      "Enter the day number",
      "Unknown"
    ],
    "4.5.1/t6": [
      "Enter the day number",
      "Unknown"
    ],
    "4.T1/t1": [
      "Enter the age",
      "Enter the day",
      "Age group: Adult",
      "Day type: Weekday",
      "Price: 40"
    ],
    "4.T1/t2": [
      "Enter the age",
      "Enter the day",
      "Age group: Child",
      "Day type: Weekend",
      "Price: 20"
    ],
    "4.T1/t3": [
      "Enter the age",
      "Enter the day",
      "Age group: Adult",
      "Day type: Weekday",
      "Price: 40"
    ],
    "4.T1/t4": [
      "Enter the age",
      "Enter the day",
      "Age group: Senior",
      "Day type: Weekend",
      "Price: 25"
    ],
    "4.T1/t5": [
      "Enter the age",
      "Enter the day",
      "Age group: Child",
      "Day type: Weekday",
      "Price: 15"
    ],
    "4.T1/t6": [
      "Enter the age",
      "Enter the day",
      "Age group: Adult",
      "Day type: Unknown",
      "Price: 45"
    ],
    "4.T1/t7": [
      "Enter the age",
      "Enter the day",
      "Age group: Senior",
      "Day type: Weekday",
      "Price: 20"
    ],
    "5.1.1/t1": [
      "Enter a number",
      "Sum: 15"
    ],
    "5.1.1/t2": [
      "Enter a number",
      "Sum: 55"
    ],
    "5.1.1/t3": [
      "Enter a number",
      "Sum: 1"
    ],
    "5.1.1/t4": [
      "Enter a number",
      "Sum: 0"
    ],
    "5.1.1/t5": [
      "Enter a number",
      "Sum: 500500"
    ],
    "5.4.1/t1": [
      "Enter a mark",
      "Accepted: 58"
    ],
    "5.4.1/t2": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Accepted: 58"
    ],
    "5.4.1/t3": [
      "Enter a mark",
      "Accepted: 0"
    ],
    "5.4.1/t4": [
      "Enter a mark",
      "Accepted: 100"
    ],
    "5.4.1/t5": [
      "Enter a mark",
      "Enter a mark",
      "Accepted: 50"
    ],
    "5.4.1/t6": [
      "Enter a mark",
      "Enter a mark",
      "Accepted: 7"
    ],
    "5.T1/t1": [
      "Enter a score",
      "Enter a score",
      "Enter a score",
      "Enter a score",
      "Count: 3",
      "Highest: 95",
      "Average: 78"
    ],
    "5.T1/t2": [
      "Enter a score",
      "Enter a score",
      "Count: 1",
      "Highest: 70",
      "Average: 70"
    ],
    "5.T1/t3": [
      "Enter a score",
      "No scores"
    ],
    "5.T1/t4": [
      "Enter a score",
      "Enter a score",
      "Count: 1",
      "Highest: 0",
      "Average: 0"
    ],
    "5.T1/t5": [
      "Enter a score",
      "Enter a score",
      "Enter a score",
      "Enter a score",
      "Count: 3",
      "Highest: 100",
      "Average: 100"
    ],
    "5.T1/t6": [
      "Enter a score",
      "Enter a score",
      "Enter a score",
      "Count: 2",
      "Highest: 99999",
      "Average: 50000"
    ],
    "6.4.1/t1": [
      "Enter a number",
      "1",
      "2",
      "2",
      "3",
      "3",
      "3"
    ],
    "6.4.1/t2": [
      "Enter a number",
      "1",
      "2",
      "2",
      "3",
      "3",
      "3",
      "4",
      "4",
      "4",
      "4",
      "5",
      "5",
      "5",
      "5",
      "5"
    ],
    "6.4.1/t3": [
      "Enter a number",
      "1"
    ],
    "6.4.1/t4": [
      "Enter a number"
    ],
    "6.4.1/t5": [
      "Enter a number",
      "1",
      "2",
      "2",
      "3",
      "3",
      "3",
      "4",
      "4",
      "4",
      "4",
      "5",
      "5",
      "5",
      "5",
      "5",
      "6",
      "6",
      "6",
      "6",
      "6",
      "6",
      "7",
      "7",
      "7",
      "7",
      "7",
      "7",
      "7",
      "8",
      "8",
      "8",
      "8",
      "8",
      "8",
      "8",
      "8",
      "9",
      "9",
      "9",
      "9",
      "9",
      "9",
      "9",
      "9",
      "9"
    ],
    "6.T1/t1": [
      "Enter a score",
      "Enter a score",
      "Enter a score",
      "Class 1: count 2 total 150",
      "Enter a score",
      "Class 2: count 0 total 0",
      "Enter a score",
      "Enter a score",
      "Class 3: count 1 total 90"
    ],
    "6.T1/t2": [
      "Enter a score",
      "Enter a score",
      "Class 1: count 1 total 50",
      "Enter a score",
      "Enter a score",
      "Enter a score",
      "Class 2: count 2 total 130",
      "Enter a score",
      "Enter a score",
      "Class 3: count 1 total 80"
    ],
    "6.T1/t3": [
      "Enter a score",
      "Class 1: count 0 total 0",
      "Enter a score",
      "Class 2: count 0 total 0",
      "Enter a score",
      "Class 3: count 0 total 0"
    ],
    "6.T1/t4": [
      "Enter a score",
      "Enter a score",
      "Class 1: count 1 total 0",
      "Enter a score",
      "Class 2: count 0 total 0",
      "Enter a score",
      "Enter a score",
      "Class 3: count 1 total 100"
    ],
    "6.T1/t5": [
      "Enter a score",
      "Enter a score",
      "Enter a score",
      "Class 1: count 2 total 100000",
      "Enter a score",
      "Class 2: count 0 total 0",
      "Enter a score",
      "Class 3: count 0 total 0"
    ],
    "7.2.1/t1": [
      "Enter a word",
      "Length: 6",
      "Head: Mo",
      "Tail: day"
    ],
    "7.2.1/t2": [
      "Enter a word",
      "Length: 8",
      "Head: Co",
      "Tail: ter"
    ],
    "7.2.1/t3": [
      "Enter a word",
      "Length: 5",
      "Head: ab",
      "Tail: cde"
    ],
    "7.2.1/t4": [
      "Enter a word",
      "Length: 10",
      "Head: Ps",
      "Tail: ode"
    ],
    "7.2.1/t5": [
      "Enter a word",
      "Length: 15",
      "Head: Ex",
      "Tail: ily"
    ],
    "7.T1/t1": [
      "Enter the code",
      "Enter the grade",
      "Length: 4",
      "Prefix: XY",
      "Number: 99",
      "Tag: XY-99",
      "Grade: B"
    ],
    "7.T1/t2": [
      "Enter the code",
      "Enter the grade",
      "Length: 6",
      "Prefix: QR",
      "Number: 2468",
      "Tag: QR-2468",
      "Grade: C"
    ],
    "7.T1/t3": [
      "Enter the code",
      "Enter the grade",
      "Length: 3",
      "Prefix: QQ",
      "Number: 1",
      "Tag: QQ-1",
      "Grade: Z"
    ],
    "7.T1/t4": [
      "Enter the code",
      "Enter the grade",
      "Length: 4",
      "Prefix: ZZ",
      "Number: 12",
      "Tag: ZZ-12",
      "Grade: A"
    ],
    "7.T1/t5": [
      "Enter the code",
      "Enter the grade",
      "Length: 12",
      "Prefix: MN",
      "Number: 1234567890",
      "Tag: MN-1234567890",
      "Grade: Q"
    ],
    "8.2.1/t1": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "30",
      "20",
      "10"
    ],
    "8.2.1/t2": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "9",
      "5",
      "5"
    ],
    "8.2.1/t3": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "0",
      "0",
      "0"
    ],
    "8.2.1/t4": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "-3",
      "-2",
      "-1"
    ],
    "8.2.1/t5": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "888888",
      "1",
      "999999"
    ],
    "8.4.1/t1": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Passed: 3"
    ],
    "8.4.1/t2": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Passed: 0"
    ],
    "8.4.1/t3": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Passed: 5"
    ],
    "8.4.1/t4": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Passed: 0"
    ],
    "8.4.1/t5": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Passed: 5"
    ],
    "8.T1/t1": [
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Total: 128",
      "Highest: 22",
      "Average: 18",
      "Above average: 3"
    ],
    "8.T1/t2": [
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Total: 140",
      "Highest: 20",
      "Average: 20",
      "Above average: 0"
    ],
    "8.T1/t3": [
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Total: -29",
      "Highest: -1",
      "Average: -4",
      "Above average: 3"
    ],
    "8.T1/t4": [
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Total: 30",
      "Highest: 10",
      "Average: 4",
      "Above average: 3"
    ],
    "8.T1/t5": [
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Total: 46",
      "Highest: 40",
      "Average: 6",
      "Above average: 1"
    ],
    "9.3.1/t1": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Row 1: 15",
      "Row 2: 24"
    ],
    "9.3.1/t2": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Row 1: 3",
      "Row 2: 6"
    ],
    "9.3.1/t3": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Row 1: 0",
      "Row 2: 0"
    ],
    "9.3.1/t4": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Row 1: -6",
      "Row 2: 6"
    ],
    "9.3.1/t5": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Row 1: 100001",
      "Row 2: 100001"
    ],
    "9.T1/t1": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Student 1 total: 150",
      "Student 2 total: 150",
      "Student 3 total: 150",
      "Subject 1 average: 70",
      "Subject 2 average: 80"
    ],
    "9.T1/t2": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Student 1 total: 100",
      "Student 2 total: 100",
      "Student 3 total: 100",
      "Subject 1 average: 50",
      "Subject 2 average: 50"
    ],
    "9.T1/t3": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Student 1 total: 0",
      "Student 2 total: 0",
      "Student 3 total: 1",
      "Subject 1 average: 0",
      "Subject 2 average: 0"
    ],
    "9.T1/t4": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Student 1 total: 100",
      "Student 2 total: 100",
      "Student 3 total: 100",
      "Subject 1 average: 66",
      "Subject 2 average: 33"
    ],
    "9.T1/t5": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Student 1 total: 100000",
      "Student 2 total: 2",
      "Student 3 total: 100000",
      "Subject 1 average: 33333",
      "Subject 2 average: 33333"
    ],
    "10.2.1/t1": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter the number to find",
      "Found at 4"
    ],
    "10.2.1/t2": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter the number to find",
      "Found at 1"
    ],
    "10.2.1/t3": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter the number to find",
      "Found at 6"
    ],
    "10.2.1/t4": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter the number to find",
      "Not found"
    ],
    "10.2.1/t5": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter the number to find",
      "Found at 2"
    ],
    "10.2.1/t6": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter the number to find",
      "Found at 6"
    ],
    "10.4.1/t1": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "0",
      "2",
      "4",
      "6",
      "8"
    ],
    "10.4.1/t2": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "10.4.1/t3": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "1",
      "2",
      "3",
      "4",
      "5"
    ],
    "10.4.1/t4": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "7",
      "7",
      "7",
      "7",
      "7"
    ],
    "10.4.1/t5": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "-99999",
      "-1",
      "0",
      "99999",
      "99999"
    ],
    "10.T1/t1": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "0",
      "2",
      "4",
      "6",
      "8",
      "9",
      "Enter the number to find",
      "Found at 4"
    ],
    "10.T1/t2": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "Enter the number to find",
      "Found at 1"
    ],
    "10.T1/t3": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "Enter the number to find",
      "Found at 6"
    ],
    "10.T1/t4": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "0",
      "2",
      "4",
      "6",
      "8",
      "9",
      "Enter the number to find",
      "Not found"
    ],
    "10.T1/t5": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "3",
      "3",
      "3",
      "7",
      "7",
      "7",
      "Enter the number to find",
      "Found at 4"
    ],
    "10.T1/t6": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "-99999",
      "-1",
      "0",
      "0",
      "99999",
      "99999",
      "Enter the number to find",
      "Found at 1"
    ],
    "11.3.1/t1": [
      "Enter a name",
      "Enter the first mark",
      "Enter the second mark",
      "Bob: 133"
    ],
    "11.3.1/t2": [
      "Enter a name",
      "Enter the first mark",
      "Enter the second mark",
      "Cal: 0"
    ],
    "11.3.1/t3": [
      "Enter a name",
      "Enter the first mark",
      "Enter the second mark",
      "Dee: 200"
    ],
    "11.3.1/t4": [
      "Enter a name",
      "Enter the first mark",
      "Enter the second mark",
      "Eve Marie: 100"
    ],
    "11.3.1/t5": [
      "Enter a name",
      "Enter the first mark",
      "Enter the second mark",
      "Fay: 0"
    ],
    "11.4.1/t1": [
      "Enter a name",
      "Enter a mark",
      "Enter a name",
      "Enter a mark",
      "Enter a name",
      "Enter a mark",
      "Enter a name",
      "Enter a mark",
      "Top: Hal 72"
    ],
    "11.4.1/t2": [
      "Enter a name",
      "Enter a mark",
      "Enter a name",
      "Enter a mark",
      "Enter a name",
      "Enter a mark",
      "Enter a name",
      "Enter a mark",
      "Top: Gil 90"
    ],
    "11.4.1/t3": [
      "Enter a name",
      "Enter a mark",
      "Enter a name",
      "Enter a mark",
      "Enter a name",
      "Enter a mark",
      "Enter a name",
      "Enter a mark",
      "Top: Jon 88"
    ],
    "11.4.1/t4": [
      "Enter a name",
      "Enter a mark",
      "Enter a name",
      "Enter a mark",
      "Enter a name",
      "Enter a mark",
      "Enter a name",
      "Enter a mark",
      "Top: Jon 51"
    ],
    "11.4.1/t5": [
      "Enter a name",
      "Enter a mark",
      "Enter a name",
      "Enter a mark",
      "Enter a name",
      "Enter a mark",
      "Enter a name",
      "Enter a mark",
      "Top: Jon -99996"
    ],
    "11.T1/t1": [
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
      "Hal 72",
      "Jon 66",
      "Gil 61",
      "Ivy 58",
      "Kay 49"
    ],
    "11.T1/t2": [
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
      "Gil 90",
      "Hal 80",
      "Ivy 70",
      "Jon 60",
      "Kay 50"
    ],
    "11.T1/t3": [
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
      "Kay 90",
      "Jon 80",
      "Ivy 70",
      "Hal 60",
      "Gil 50"
    ],
    "11.T1/t4": [
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
      "Gil 70",
      "Hal 70",
      "Ivy 70",
      "Jon 70",
      "Kay 70"
    ],
    "11.T1/t5": [
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
      "Gil 99999",
      "Kay 99999",
      "Ivy 0",
      "Hal -99999",
      "Jon -99999"
    ],
    "12.3.1/t1": [
      "Enter a label",
      "Enter a count",
      "Red **",
      "Enter a label",
      "Enter a count",
      "Green ****",
      "Enter a label",
      "Enter a count",
      "Blue ******"
    ],
    "12.3.1/t2": [
      "Enter a label",
      "Enter a count",
      "Red ",
      "Enter a label",
      "Enter a count",
      "Green *",
      "Enter a label",
      "Enter a count",
      "Blue **"
    ],
    "12.3.1/t3": [
      "Enter a label",
      "Enter a count",
      "A *",
      "Enter a label",
      "Enter a count",
      "B *",
      "Enter a label",
      "Enter a count",
      "C *"
    ],
    "12.3.1/t4": [
      "Enter a label",
      "Enter a count",
      "Two words ***",
      "Enter a label",
      "Enter a count",
      "X **",
      "Enter a label",
      "Enter a count",
      "Y ****"
    ],
    "12.3.1/t5": [
      "Enter a label",
      "Enter a count",
      "Big ****************************************",
      "Enter a label",
      "Enter a count",
      "Small ",
      "Enter a label",
      "Enter a count",
      "Mid *******"
    ],
    "12.5.1/t1": [
      "Enter a number",
      "Enter a number",
      "3 8"
    ],
    "12.5.1/t2": [
      "Enter a number",
      "Enter a number",
      "3 8"
    ],
    "12.5.1/t3": [
      "Enter a number",
      "Enter a number",
      "7 7"
    ],
    "12.5.1/t4": [
      "Enter a number",
      "Enter a number",
      "-1 0"
    ],
    "12.5.1/t5": [
      "Enter a number",
      "Enter a number",
      "-99999 99999"
    ],
    "12.T1/t1": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "1",
      "3",
      "5"
    ],
    "12.T1/t2": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "1",
      "2",
      "3"
    ],
    "12.T1/t3": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "1",
      "2",
      "3"
    ],
    "12.T1/t4": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "6",
      "6",
      "6"
    ],
    "12.T1/t5": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "-99999",
      "0",
      "99999"
    ],
    "13.3.1/t1": [
      "Enter a mark",
      "95 A",
      "Enter a mark",
      "72 B",
      "Enter a mark",
      "55 C"
    ],
    "13.3.1/t2": [
      "Enter a mark",
      "80 A",
      "Enter a mark",
      "60 B",
      "Enter a mark",
      "40 C"
    ],
    "13.3.1/t3": [
      "Enter a mark",
      "79 B",
      "Enter a mark",
      "59 C",
      "Enter a mark",
      "39 F"
    ],
    "13.3.1/t4": [
      "Enter a mark",
      "0 F",
      "Enter a mark",
      "100 A",
      "Enter a mark",
      "0 F"
    ],
    "13.3.1/t5": [
      "Enter a mark",
      "99999 A",
      "Enter a mark",
      "-99999 F",
      "Enter a mark",
      "41 C"
    ],
    "13.5.1/t1": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Largest: 8"
    ],
    "13.5.1/t2": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Largest: 9"
    ],
    "13.5.1/t3": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Largest: 9"
    ],
    "13.5.1/t4": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Largest: 5"
    ],
    "13.5.1/t5": [
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Enter a number",
      "Largest: -99996"
    ],
    "13.T1/t1": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Average: 65",
      "Grade: B"
    ],
    "13.T1/t2": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Average: 80",
      "Grade: A"
    ],
    "13.T1/t3": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Average: 0",
      "Grade: F"
    ],
    "13.T1/t4": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Average: 40",
      "Grade: C"
    ],
    "13.T1/t5": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Average: 19999",
      "Grade: A"
    ],
    "14.3.1/t1": [
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Red",
      "Green",
      "Blue"
    ],
    "14.3.1/t2": [
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Two words",
      "X",
      "Something longer"
    ],
    "14.3.1/t3": [
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Same",
      "Same",
      "Same"
    ],
    "14.3.1/t4": [
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "A",
      "B",
      "C"
    ],
    "14.3.1/t5": [
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "QWERTYUIOPASDFGHJKLZXCVBNM",
      "Z",
      "Mixed Case Name"
    ],
    "14.5.1/t1": [
      "Enter a line",
      "Enter a line",
      "Enter a line",
      "Enter a line",
      "1: one",
      "2: two",
      "3: three",
      "4: four"
    ],
    "14.5.1/t2": [
      "Enter a line",
      "Enter a line",
      "Enter a line",
      "Enter a line",
      "1: a b c",
      "2: d",
      "3: e f",
      "4: g h i j"
    ],
    "14.5.1/t3": [
      "Enter a line",
      "Enter a line",
      "Enter a line",
      "Enter a line",
      "1: x",
      "2: x",
      "3: x",
      "4: x"
    ],
    "14.5.1/t4": [
      "Enter a line",
      "Enter a line",
      "Enter a line",
      "Enter a line",
      "1: 1",
      "2: 2",
      "3: 3",
      "4: 4"
    ],
    "14.5.1/t5": [
      "Enter a line",
      "Enter a line",
      "Enter a line",
      "Enter a line",
      "1: Q",
      "2: WERTYUIOPASDFGHJKLZXCVBNM",
      "3: e",
      "4: R"
    ],
    "14.T1/t1": [
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Alice",
      "Charlie",
      "Edward",
      "Count: 3"
    ],
    "14.T1/t2": [
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Count: 0"
    ],
    "14.T1/t3": [
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Abcde",
      "Fghij",
      "Klmno",
      "Pqrst",
      "Uvwxy",
      "Count: 5"
    ],
    "14.T1/t4": [
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Two words",
      "Count: 1"
    ],
    "14.T1/t5": [
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "Enter a name",
      "QWERTYUIOPASDFGHJKLZXCVBNM",
      "Count: 1"
    ],
    "16.2.1/t1": [
      "Enter the length",
      "Enter the width",
      "Area: 15",
      "Perimeter: 16"
    ],
    "16.2.1/t2": [
      "Enter the length",
      "Enter the width",
      "Area: 36",
      "Perimeter: 24"
    ],
    "16.2.1/t3": [
      "Enter the length",
      "Enter the width",
      "Area: 1",
      "Perimeter: 4"
    ],
    "16.2.1/t4": [
      "Enter the length",
      "Enter the width",
      "Area: 0",
      "Perimeter: 18"
    ],
    "16.2.1/t5": [
      "Enter the length",
      "Enter the width",
      "Area: 99980001",
      "Perimeter: 39996"
    ],
    "16.5.1/t1": [
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Frost days: 3"
    ],
    "16.5.1/t2": [
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Frost days: 0"
    ],
    "16.5.1/t3": [
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Frost days: 5"
    ],
    "16.5.1/t4": [
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Frost days: 0"
    ],
    "16.5.1/t5": [
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Enter a temperature",
      "Frost days: 2"
    ],
    "16.7.1/t1": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Passes: 4",
      "Fails: 2"
    ],
    "16.7.1/t2": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Passes: 6",
      "Fails: 0"
    ],
    "16.7.1/t3": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Passes: 0",
      "Fails: 6"
    ],
    "16.7.1/t4": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Passes: 6",
      "Fails: 0"
    ],
    "16.7.1/t5": [
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Enter a mark",
      "Passes: 2",
      "Fails: 4"
    ],
    "16.T1/t1": [
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Total loans: 22",
      "Average loans: 4",
      "Most borrowed: Beta"
    ],
    "16.T1/t2": [
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Total loans: 19",
      "Average loans: 3",
      "Most borrowed: Alpha"
    ],
    "16.T1/t3": [
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Total loans: 19",
      "Average loans: 3",
      "Most borrowed: Sigma"
    ],
    "16.T1/t4": [
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Total loans: 1",
      "Average loans: 0",
      "Most borrowed: Sigma"
    ],
    "16.T1/t5": [
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Total loans: 26",
      "Average loans: 5",
      "Most borrowed: Sigma"
    ],
    "16.T1/t6": [
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Enter a title",
      "Enter a loan count",
      "Total loans: 100000",
      "Average loans: 20000",
      "Most borrowed: Alpha"
    ]
  };
  var sampleTranscripts = {
    "1.1/Example_1_1_a.pseudocode": [
      {
        "kind": "output",
        "text": "Hello, world"
      }
    ],
    "1.2/Example_1_2_a.pseudocode": [
      {
        "kind": "output",
        "text": "What is your name?"
      },
      {
        "kind": "input",
        "text": "Ada"
      },
      {
        "kind": "output",
        "text": "Hello, Ada"
      }
    ],
    "1.3/Example_1_3_a.pseudocode": [
      {
        "kind": "output",
        "text": "What is your name?"
      },
      {
        "kind": "input",
        "text": "Ada"
      },
      {
        "kind": "output",
        "text": "Hello, Ada"
      }
    ],
    "2.2/Example_2_2_a.pseudocode": [
      {
        "kind": "output",
        "text": "Enter the count"
      },
      {
        "kind": "input",
        "text": "12"
      },
      {
        "kind": "output",
        "text": "12"
      }
    ],
    "2.3/Example_2_3_a.pseudocode": [
      {
        "kind": "output",
        "text": "A"
      },
      {
        "kind": "output",
        "text": "Ada"
      },
      {
        "kind": "output",
        "text": "TRUE"
      },
      {
        "kind": "output",
        "text": "02/01/2028"
      }
    ],
    "2.4/Example_2_4_a.pseudocode": [
      {
        "kind": "output",
        "text": "0"
      }
    ],
    "2.5/Example_2_5_a.pseudocode": [
      {
        "kind": "output",
        "text": "Days: 7"
      }
    ],
    "3.1/Example_3_1_a.pseudocode": [
      {
        "kind": "output",
        "text": "Plain: 14"
      },
      {
        "kind": "output",
        "text": "Grouped: 20"
      },
      {
        "kind": "output",
        "text": "Divided: 3.0"
      }
    ],
    "3.2/Example_3_2_a.pseudocode": [
      {
        "kind": "output",
        "text": "Full cars: 3"
      },
      {
        "kind": "output",
        "text": "Left over: 1"
      }
    ],
    "3.3/Example_3_3_a.pseudocode": [
      {
        "kind": "output",
        "text": "Passed: TRUE"
      },
      {
        "kind": "output",
        "text": "Even: TRUE"
      }
    ],
    "3.4/Example_3_4_a.pseudocode": [
      {
        "kind": "output",
        "text": "Awarded: TRUE"
      },
      {
        "kind": "output",
        "text": "Missing: FALSE"
      }
    ],
    "4.1/Example_4_1_a.pseudocode": [
      {
        "kind": "output",
        "text": "Enter the score"
      },
      {
        "kind": "input",
        "text": "72"
      },
      {
        "kind": "output",
        "text": "Passed"
      },
      {
        "kind": "output",
        "text": "Done"
      }
    ],
    "4.2/Example_4_2_a.pseudocode": [
      {
        "kind": "output",
        "text": "Enter the score"
      },
      {
        "kind": "input",
        "text": "50"
      },
      {
        "kind": "output",
        "text": "Passed"
      },
      {
        "kind": "output",
        "text": "Checked"
      }
    ],
    "4.3/Example_4_3_a.pseudocode": [
      {
        "kind": "output",
        "text": "Enter the score"
      },
      {
        "kind": "input",
        "text": "55"
      },
      {
        "kind": "output",
        "text": "Pass"
      }
    ],
    "4.4/Example_4_4_a.pseudocode": [
      {
        "kind": "output",
        "text": "Enter the day number"
      },
      {
        "kind": "input",
        "text": "3"
      },
      {
        "kind": "output",
        "text": "Wednesday"
      },
      {
        "kind": "output",
        "text": "Checked"
      }
    ],
    "4.5/Example_4_5_a.pseudocode": [
      {
        "kind": "output",
        "text": "Enter the score"
      },
      {
        "kind": "input",
        "text": "73"
      },
      {
        "kind": "output",
        "text": "Pass"
      }
    ],
    "5.1/Example_5_1_a.pseudocode": [
      {
        "kind": "output",
        "text": "Line 1"
      },
      {
        "kind": "output",
        "text": "Line 2"
      },
      {
        "kind": "output",
        "text": "Line 3"
      },
      {
        "kind": "output",
        "text": "Line 4"
      },
      {
        "kind": "output",
        "text": "Line 5"
      },
      {
        "kind": "output",
        "text": "Done"
      }
    ],
    "5.2/Example_5_2_a.pseudocode": [
      {
        "kind": "output",
        "text": "5"
      },
      {
        "kind": "output",
        "text": "4"
      },
      {
        "kind": "output",
        "text": "3"
      },
      {
        "kind": "output",
        "text": "2"
      },
      {
        "kind": "output",
        "text": "1"
      },
      {
        "kind": "output",
        "text": "Go"
      }
    ],
    "5.3/Example_5_3_a.pseudocode": [
      {
        "kind": "output",
        "text": "Enter a score"
      },
      {
        "kind": "input",
        "text": "80"
      },
      {
        "kind": "output",
        "text": "Enter a score"
      },
      {
        "kind": "input",
        "text": "95"
      },
      {
        "kind": "output",
        "text": "Enter a score"
      },
      {
        "kind": "input",
        "text": "-1"
      },
      {
        "kind": "output",
        "text": "Count: 2"
      }
    ],
    "5.4/Example_5_4_a.pseudocode": [
      {
        "kind": "output",
        "text": "Enter a number from 1 to 5"
      },
      {
        "kind": "input",
        "text": "9"
      },
      {
        "kind": "output",
        "text": "Enter a number from 1 to 5"
      },
      {
        "kind": "input",
        "text": "0"
      },
      {
        "kind": "output",
        "text": "Enter a number from 1 to 5"
      },
      {
        "kind": "input",
        "text": "3"
      },
      {
        "kind": "output",
        "text": "Accepted: 3"
      }
    ],
    "6.2/Example_6_2_a.pseudocode": [
      {
        "kind": "output",
        "text": "Enter the balance"
      },
      {
        "kind": "input",
        "text": "5"
      },
      {
        "kind": "output",
        "text": "Bought: 0"
      },
      {
        "kind": "output",
        "text": "Left: 5"
      }
    ],
    "6.3/Example_6_3_a.pseudocode": [
      {
        "kind": "output",
        "text": "Body ran 12 times"
      }
    ],
    "6.4/Example_6_4_a.pseudocode": [
      {
        "kind": "output",
        "text": "1 x 1 = 1"
      },
      {
        "kind": "output",
        "text": "1 x 2 = 2"
      },
      {
        "kind": "output",
        "text": "1 x 3 = 3"
      },
      {
        "kind": "output",
        "text": "2 x 1 = 2"
      },
      {
        "kind": "output",
        "text": "2 x 2 = 4"
      },
      {
        "kind": "output",
        "text": "2 x 3 = 6"
      }
    ],
    "7.2/Example_7_2_a.pseudocode": [
      {
        "kind": "output",
        "text": "Length: 8"
      },
      {
        "kind": "output",
        "text": "First three: Com"
      },
      {
        "kind": "output",
        "text": "Middle two: pu"
      },
      {
        "kind": "output",
        "text": "Last three: ter"
      }
    ],
    "7.3/Example_7_3_a.pseudocode": [
      {
        "kind": "output",
        "text": "Continue? Enter Y or N"
      },
      {
        "kind": "input",
        "text": "y"
      },
      {
        "kind": "output",
        "text": "Going on"
      }
    ],
    "7.4/Example_7_4_a.pseudocode": [
      {
        "kind": "output",
        "text": "Name: Ada Lovelace"
      },
      {
        "kind": "output",
        "text": "Words: 2"
      }
    ],
    "7.4/Example_7_4_b.pseudocode": [
      {
        "kind": "output",
        "text": "*****"
      }
    ],
    "7.5/Example_7_5_a.pseudocode": [
      {
        "kind": "output",
        "text": "A: 7"
      },
      {
        "kind": "output",
        "text": "B: 7"
      },
      {
        "kind": "output",
        "text": "C: 3"
      }
    ],
    "7.6/Example_7_6_a.pseudocode": [
      {
        "kind": "output",
        "text": "Tail: 1234"
      },
      {
        "kind": "output",
        "text": "Tail length: 4"
      }
    ],
    "8.2/Example_8_2_a.pseudocode": [
      {
        "kind": "output",
        "text": "First: 80"
      },
      {
        "kind": "output",
        "text": "Last: 60"
      },
      {
        "kind": "output",
        "text": "Total: 210"
      }
    ],
    "8.4/Example_8_4_a.pseudocode": [
      {
        "kind": "output",
        "text": "Enter a number"
      },
      {
        "kind": "input",
        "text": "1"
      },
      {
        "kind": "output",
        "text": "Enter a number"
      },
      {
        "kind": "input",
        "text": "2"
      },
      {
        "kind": "output",
        "text": "Enter a number"
      },
      {
        "kind": "input",
        "text": "3"
      },
      {
        "kind": "output",
        "text": "Enter a number"
      },
      {
        "kind": "input",
        "text": "4"
      },
      {
        "kind": "output",
        "text": "Enter a number"
      },
      {
        "kind": "input",
        "text": "5"
      },
      {
        "kind": "output",
        "text": "5"
      },
      {
        "kind": "output",
        "text": "4"
      },
      {
        "kind": "output",
        "text": "3"
      },
      {
        "kind": "output",
        "text": "2"
      },
      {
        "kind": "output",
        "text": "1"
      }
    ],
    "8.5/Example_8_5_a.pseudocode": [
      {
        "kind": "output",
        "text": "Average: 21"
      },
      {
        "kind": "output",
        "text": "Above: 1"
      }
    ],
    "9.1/Example_9_1_a.pseudocode": [
      {
        "kind": "output",
        "text": "Student 1, subject 2: 70"
      },
      {
        "kind": "output",
        "text": "Student 3, subject 1: 100"
      },
      {
        "kind": "output",
        "text": "Student 2 total: 145"
      }
    ],
    "9.3/Example_9_3_a.pseudocode": [
      {
        "kind": "output",
        "text": "Row 1 total: 6"
      },
      {
        "kind": "output",
        "text": "Row 2 total: 12"
      },
      {
        "kind": "output",
        "text": "Col 1 total: 3"
      },
      {
        "kind": "output",
        "text": "Col 2 total: 6"
      },
      {
        "kind": "output",
        "text": "Col 3 total: 9"
      }
    ],
    "10.1/Example_10_1_a.pseudocode": [
      {
        "kind": "output",
        "text": "Found at 2"
      },
      {
        "kind": "output",
        "text": "Found at 4"
      }
    ],
    "10.2/Example_10_2_a.pseudocode": [
      {
        "kind": "output",
        "text": "Not in the list"
      }
    ],
    "10.3/Example_10_3_a.pseudocode": [
      {
        "kind": "output",
        "text": "3"
      },
      {
        "kind": "output",
        "text": "1"
      },
      {
        "kind": "output",
        "text": "7"
      },
      {
        "kind": "output",
        "text": "5"
      },
      {
        "kind": "output",
        "text": "9"
      }
    ],
    "10.4/Example_10_4_a.pseudocode": [
      {
        "kind": "output",
        "text": "1"
      },
      {
        "kind": "output",
        "text": "3"
      },
      {
        "kind": "output",
        "text": "5"
      },
      {
        "kind": "output",
        "text": "7"
      },
      {
        "kind": "output",
        "text": "9"
      }
    ],
    "10.5/Example_10_5_a.pseudocode": [
      {
        "kind": "output",
        "text": "Passes: 3"
      },
      {
        "kind": "output",
        "text": "1"
      },
      {
        "kind": "output",
        "text": "3"
      },
      {
        "kind": "output",
        "text": "5"
      },
      {
        "kind": "output",
        "text": "7"
      },
      {
        "kind": "output",
        "text": "9"
      }
    ],
    "11.2/Example_11_2_a.pseudocode": [
      {
        "kind": "output",
        "text": "Algorithms"
      },
      {
        "kind": "output",
        "text": "2020"
      },
      {
        "kind": "output",
        "text": "39.5"
      }
    ],
    "11.3/Example_11_3_a.pseudocode": [
      {
        "kind": "output",
        "text": "Enter a title"
      },
      {
        "kind": "input",
        "text": "Algorithms"
      },
      {
        "kind": "output",
        "text": "Algorithms is 6 years old"
      }
    ],
    "11.4/Example_11_4_a.pseudocode": [
      {
        "kind": "output",
        "text": "Ada passed"
      },
      {
        "kind": "output",
        "text": "Cal passed"
      }
    ],
    "12.2/Example_12_2_a.pseudocode": [
      {
        "kind": "output",
        "text": "Report"
      },
      {
        "kind": "output",
        "text": "----------"
      },
      {
        "kind": "output",
        "text": "Total: 42"
      },
      {
        "kind": "output",
        "text": "----------"
      }
    ],
    "12.3/Example_12_3_a.pseudocode": [
      {
        "kind": "output",
        "text": "------"
      },
      {
        "kind": "output",
        "text": "Total: 42"
      },
      {
        "kind": "output",
        "text": "---"
      }
    ],
    "12.4/Example_12_4_a.pseudocode": [
      {
        "kind": "output",
        "text": "inside: 105"
      },
      {
        "kind": "output",
        "text": "outside: 5"
      }
    ],
    "12.5/Example_12_5_a.pseudocode": [
      {
        "kind": "output",
        "text": "before: 1 2"
      },
      {
        "kind": "output",
        "text": "after: 2 1"
      }
    ],
    "12.6/Example_12_6_a.pseudocode": [
      {
        "kind": "output",
        "text": "inside: 100"
      },
      {
        "kind": "output",
        "text": "outside: 7"
      }
    ],
    "13.2/Example_13_2_a.pseudocode": [
      {
        "kind": "output",
        "text": "10"
      },
      {
        "kind": "output",
        "text": "14"
      },
      {
        "kind": "output",
        "text": "hello!"
      }
    ],
    "13.3/Example_13_3_a.pseudocode": [
      {
        "kind": "output",
        "text": "positive"
      },
      {
        "kind": "output",
        "text": "negative"
      },
      {
        "kind": "output",
        "text": "zero"
      }
    ],
    "13.4/Example_13_4_a.pseudocode": [
      {
        "kind": "output",
        "text": "42"
      },
      {
        "kind": "output",
        "text": "12"
      },
      {
        "kind": "output",
        "text": "84"
      }
    ],
    "13.5/Example_13_5_a.pseudocode": [
      {
        "kind": "output",
        "text": "called with 3"
      },
      {
        "kind": "output",
        "text": "called with 4"
      },
      {
        "kind": "output",
        "text": "14"
      }
    ],
    "14.2/Example_14_2_a.pseudocode": [
      {
        "kind": "output",
        "text": "Saved 2 names"
      }
    ],
    "14.3/Example_14_3_a.pseudocode": [
      {
        "kind": "output",
        "text": "1: Ada"
      },
      {
        "kind": "output",
        "text": "2: Bob"
      }
    ],
    "14.4/Example_14_4_a.pseudocode": [
      {
        "kind": "output",
        "text": "after append 1: first"
      },
      {
        "kind": "output",
        "text": "after append 2: second"
      },
      {
        "kind": "output",
        "text": "after write 1: third"
      }
    ],
    "14.5/Example_14_5_a.pseudocode": [
      {
        "kind": "output",
        "text": "1: Ada"
      },
      {
        "kind": "output",
        "text": "2: Bob"
      },
      {
        "kind": "output",
        "text": "3: Cal"
      },
      {
        "kind": "output",
        "text": "Total: 3"
      }
    ],
    "14.6/Example_14_6_a.pseudocode": [
      {
        "kind": "output",
        "text": "ada"
      },
      {
        "kind": "output",
        "text": "cathy"
      }
    ],
    "15.4/Example_15_4_a.pseudocode": [
      {
        "kind": "output",
        "text": "Ada"
      },
      {
        "kind": "output",
        "text": "Bob"
      },
      {
        "kind": "output",
        "text": "Cal"
      }
    ],
    "15.5/Example_15_5_a.pseudocode": [
      {
        "kind": "output",
        "text": "Top is at 3"
      },
      {
        "kind": "output",
        "text": "Top holds 30"
      },
      {
        "kind": "output",
        "text": "After one pop, top holds 20"
      },
      {
        "kind": "output",
        "text": "Slot 3 still holds 30"
      }
    ],
    "15.5/Example_15_5_b.pseudocode": [
      {
        "kind": "output",
        "text": "Next out: Ada"
      },
      {
        "kind": "output",
        "text": "Next out: Bob"
      },
      {
        "kind": "output",
        "text": "Front is 2, Rear is 3"
      }
    ],
    "16.2/Example_16_2_a.pseudocode": [
      {
        "kind": "output",
        "text": "Enter the width"
      },
      {
        "kind": "input",
        "text": "3"
      },
      {
        "kind": "output",
        "text": "Enter the height"
      },
      {
        "kind": "input",
        "text": "4"
      },
      {
        "kind": "output",
        "text": "Area: 12"
      },
      {
        "kind": "output",
        "text": "Perimeter: 14"
      }
    ],
    "16.4/Example_16_4_a.pseudocode": [
      {
        "kind": "output",
        "text": "Enter a mark"
      },
      {
        "kind": "input",
        "text": "80"
      },
      {
        "kind": "output",
        "text": "Enter a mark"
      },
      {
        "kind": "input",
        "text": "70"
      },
      {
        "kind": "output",
        "text": "Enter a mark"
      },
      {
        "kind": "input",
        "text": "90"
      },
      {
        "kind": "output",
        "text": "Enter a mark"
      },
      {
        "kind": "input",
        "text": "60"
      },
      {
        "kind": "output",
        "text": "Enter a mark"
      },
      {
        "kind": "input",
        "text": "100"
      },
      {
        "kind": "output",
        "text": "Average: 80"
      }
    ],
    "16.6/Example_16_6_a.pseudocode": [
      {
        "kind": "output",
        "text": "Enter a name"
      },
      {
        "kind": "input",
        "text": "Ada"
      },
      {
        "kind": "output",
        "text": "Enter a mark"
      },
      {
        "kind": "input",
        "text": "80"
      },
      {
        "kind": "output",
        "text": "Enter a name"
      },
      {
        "kind": "input",
        "text": "Bob"
      },
      {
        "kind": "output",
        "text": "Enter a mark"
      },
      {
        "kind": "input",
        "text": "70"
      },
      {
        "kind": "output",
        "text": "Enter a name"
      },
      {
        "kind": "input",
        "text": "Cal"
      },
      {
        "kind": "output",
        "text": "Enter a mark"
      },
      {
        "kind": "input",
        "text": "90"
      },
      {
        "kind": "output",
        "text": "Enter a name"
      },
      {
        "kind": "input",
        "text": "Dee"
      },
      {
        "kind": "output",
        "text": "Enter a mark"
      },
      {
        "kind": "input",
        "text": "60"
      },
      {
        "kind": "output",
        "text": "Enter a name"
      },
      {
        "kind": "input",
        "text": "Eve"
      },
      {
        "kind": "output",
        "text": "Enter a mark"
      },
      {
        "kind": "input",
        "text": "100"
      },
      {
        "kind": "output",
        "text": "Average: 80"
      }
    ],
    "16.7/Example_16_7_a.pseudocode": [
      {
        "kind": "output",
        "text": "Enter a name"
      },
      {
        "kind": "input",
        "text": "Ada"
      },
      {
        "kind": "output",
        "text": "Enter a mark"
      },
      {
        "kind": "input",
        "text": "80"
      },
      {
        "kind": "output",
        "text": "Enter a name"
      },
      {
        "kind": "input",
        "text": "Bob"
      },
      {
        "kind": "output",
        "text": "Enter a mark"
      },
      {
        "kind": "input",
        "text": "70"
      },
      {
        "kind": "output",
        "text": "Enter a name"
      },
      {
        "kind": "input",
        "text": "Cal"
      },
      {
        "kind": "output",
        "text": "Enter a mark"
      },
      {
        "kind": "input",
        "text": "90"
      },
      {
        "kind": "output",
        "text": "Enter a name"
      },
      {
        "kind": "input",
        "text": "Dee"
      },
      {
        "kind": "output",
        "text": "Enter a mark"
      },
      {
        "kind": "input",
        "text": "60"
      },
      {
        "kind": "output",
        "text": "Enter a name"
      },
      {
        "kind": "input",
        "text": "Eve"
      },
      {
        "kind": "output",
        "text": "Enter a mark"
      },
      {
        "kind": "input",
        "text": "100"
      },
      {
        "kind": "output",
        "text": "Average: 80"
      },
      {
        "kind": "output",
        "text": "Cal"
      },
      {
        "kind": "output",
        "text": "Eve"
      }
    ]
  };

  // packages/teaching-content/src/publish.ts
  function publishTests(taskId, tests, expected) {
    return tests.map((test) => ({
      id: test.id,
      kind: test.kind,
      inputs: test.inputs,
      caseHint: test.caseHint,
      expected: expected[`${taskId}/${test.id}`] ?? []
    }));
  }
  function toPublicChapter(chapter, expected, transcripts = {}) {
    return {
      ...chapter,
      sections: chapter.sections.map((section) => ({
        ...section,
        blocks: section.blocks.map((block) => {
          if (block.kind === "example") {
            const transcript = transcripts[`${section.id}/${block.fileName}`];
            return transcript ? { ...block, transcript } : block;
          }
          if (block.kind !== "task") return block;
          const { referenceSolution: _hidden, tests, ...rest } = block;
          return { ...rest, tests: publishTests(block.id, tests, expected) };
        })
      })),
      chapterTasks: chapter.chapterTasks.map((task) => {
        const { referenceSolution: _hidden, tests, ...rest } = task;
        return { ...rest, tests: publishTests(task.id, tests, expected) };
      })
    };
  }

  // packages/teaching-content/src/browser.ts
  var course = {
    syllabusVersion: "CAIE 9618 (2027\u20132029)",
    chapters: [
      toPublicChapter(chapter01, expectedOutputs, sampleTranscripts),
      toPublicChapter(chapter02, expectedOutputs, sampleTranscripts),
      toPublicChapter(chapter03, expectedOutputs, sampleTranscripts),
      toPublicChapter(chapter04, expectedOutputs, sampleTranscripts),
      toPublicChapter(chapter05, expectedOutputs, sampleTranscripts),
      toPublicChapter(chapter06, expectedOutputs, sampleTranscripts),
      toPublicChapter(chapter07, expectedOutputs, sampleTranscripts),
      toPublicChapter(chapter08, expectedOutputs, sampleTranscripts),
      toPublicChapter(chapter09, expectedOutputs, sampleTranscripts),
      toPublicChapter(chapter10, expectedOutputs, sampleTranscripts),
      toPublicChapter(chapter11, expectedOutputs, sampleTranscripts),
      toPublicChapter(chapter12, expectedOutputs, sampleTranscripts),
      toPublicChapter(chapter13, expectedOutputs, sampleTranscripts),
      toPublicChapter(chapter14, expectedOutputs, sampleTranscripts),
      toPublicChapter(chapter15, expectedOutputs, sampleTranscripts),
      toPublicChapter(chapter16, expectedOutputs, sampleTranscripts)
    ]
  };
  return __toCommonJS(browser_exports);
})();
