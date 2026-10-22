# Third-party notices and rights review

The proposed MIT license applies only to original material whose rights the project contributors control. It does not grant rights in Cambridge publications, quoted text, third-party packages, logos or trademarks. The maintainer has not authorized publication; see `RELEASE_REVIEW.md` for the current review boundary.

## Cambridge publications

The official syllabus and pseudocode guide PDFs and their complete Markdown transcriptions were removed from all planned public history. See `EXTERNAL_REFERENCES.md` for official links. Cambridge's guide permits registered centres to copy material for internal use; that does not establish permission to republish a full copy publicly. Permission guidance: https://help.cambridgeinternational.org/hc/en-gb/articles/115004418469-How-do-I-apply-for-permission-to-use-Cambridge-copyrighted-material

The project's Chinese rules and lessons interpret language facts and provide project-specific teaching. The identified official prose quotations, external mark-scheme answer fragment and doubtful concrete guide-style examples were conservatively removed from all planned public history. Short project-written fixtures replace the affected parser/runtime examples. Chapter 15.5 keeps a local “Content under development” notice in the former quotation position. Details and changed coverage are in `docs/CONTENT_GAPS.md`.

This is a precautionary content decision, not a finding of plagiarism. Ordinary pseudocode grammar, keyword/type names, signatures, language facts, standard algorithm ideas and short compatibility data were retained. Automated text overlap was used only to locate material for review; neither a match nor its absence establishes rights or originality.

## Teaching and assets

All sixteen authored chapters, exercises and reference solutions are retained. No evidence that they are wholesale exam reproductions was found. That is not an authorship attestation. The owner confirms that the lessons, questions and reference solutions were generated with ChatGPT. This records their stated origin; the separately identified doubtful expressions were removed conservatively. No exercise was removed or turned into an empty task.

The owner confirms that the four root `SeedToCode_*.png` files and `web/SeedToCode_favicon.png` were generated with ChatGPT. This is the owner's provenance declaration, not an independent review of generation prompts or any reference inputs. Non-rendering PNG metadata (including C2PA containers in three files) was removed from candidate history; image/rendering chunks were preserved byte-for-byte. The protected audit retains metadata hashes. This sanitization is not copyright clearance. No third-party image source or Cambridge logo has been identified. As with the rest of the project, the proposed MIT license can grant only rights actually controlled by the project contributors; it does not grant third-party rights.

## Dependencies and generated bundles

Runtime application code is primarily project-authored. Development dependencies include TypeScript (Apache-2.0), esbuild (MIT), Vitest (MIT), Wrangler and Cloudflare worker types (Apache-2.0), plus transitive packages with their own licenses. Some platform-specific development image binaries declare LGPL licenses; copying a development toolchain into a release would require its own redistribution review. The installed dependency/license inventory is retained in the local private audit, outside the publication tree. Use each package's included license as authoritative; generated distributions must retain any required third-party notices. No `node_modules`, Swift build directories or production data is tracked in the candidate.

AI-generated drafts and agent-assisted code still require ordinary provenance and similarity review. This file is a scope statement and review record, not a legal clearance.
