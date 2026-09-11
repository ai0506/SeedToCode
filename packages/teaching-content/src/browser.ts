import { chapter01 } from "./chapter-01.js";
import { chapter02 } from "./chapter-02.js";
import { chapter03 } from "./chapter-03.js";
import { chapter04 } from "./chapter-04.js";
import { chapter05 } from "./chapter-05.js";
import { chapter06 } from "./chapter-06.js";
import { chapter07 } from "./chapter-07.js";
import { chapter08 } from "./chapter-08.js";
import { chapter09 } from "./chapter-09.js";
import { chapter10 } from "./chapter-10.js";
import { chapter11 } from "./chapter-11.js";
import { expectedOutputs, sampleTranscripts } from "./expected-outputs.js";
import { toPublicChapter, type PublicChapter } from "./publish.js";

/** 浏览器入口：只暴露去掉参考解之后的课程数据。 */
export const course: { syllabusVersion: string; chapters: PublicChapter[] } = {
  syllabusVersion: "CAIE 9618 (2027–2029)",
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
    toPublicChapter(chapter11, expectedOutputs, sampleTranscripts)
  ]
};

export type {
  PublicBlock,
  PublicExample,
  PublicChapter,
  PublicChapterTask,
  PublicSection,
  PublicTask,
  PublicTest
} from "./publish.js";
