# NewFoS REM Program Builder — Modern public demonstration

**Project Owner and Maintainer: Ahmed Alhamadah**

This repository hosts the responsive, sample-only REM Program Builder. It retains NewFoS styling and the seven-section, 28-component catalog with **31 fictional document samples** (not official source documents). The public site is built from one self-contained `index.html` plus `catalog.json` for inspection.

## Using the builder

1. Open `index.html` or visit the repository's GitHub Pages site if Pages is enabled.
2. Choose Full REM (**31**), Summer Only (**25**), Research Placement (**16**) or Custom (**0** initially).
3. Under **Keep related files together**, leave **Protect dependencies** checked (default) to maintain suggested companion-file links; uncheck it to add or remove any file independently.
4. Search, browse by phase, expand a component and select files. A prerequisite shows **Protected — required by** while a selected file depends on it. A linked file added in protected mode automatically adds any missing prerequisites. To remove a prerequisite, first remove the files that use it or uncheck the protection control.
5. Review the selected files and their canonical ZIP paths; save/resume drafts in the same browser; view example slides; download a valid-format, fictional DOCX/XLSX/PDF sample ZIP.

## Dependency map

The nine `dependsOn` relationships are listed in `catalog.json` and explained in the interface. They are **suggested workflow/sequence relationships for the demonstration**, not owner-approved mandatory dependencies and **not a verified dependency audit of source-document internals**. The selection/scoring-to-matching handoff is based on the known cross-workbook process; all other links should be checked with the program owner before official release. The rules are configurable without changing file IDs or preset membership.

When protection is **ON**, the UI automatically adds missing prerequisites, blocks removing any prerequisite still needed by a selected file, and validates the package before downloading. When **OFF**, file selections are unrestricted. Incomplete suggested links are disclosed rather than silently repaired. The state is saved in browser drafts and restored; older drafts are migrated to protected mode safely.

## Public-demo boundary and approvals

- All downloads are **synthetic demo files**, clearly marked `SAMPLE ONLY`. **No actual agreement, financial worksheet, participant data, staff material, or restricted source file has been published**.
- The three repeated offer-letter/bootcamp/calendar source files are not separate selectable items.
- Four red/orange checklist additions remain excluded from this release.
- The 2027 ERN conference guidance is event-specific, **not** an official calendar or reusable deadline list. Dates, compensation details, consent language, agreements, the mentor syllabus, and financial materials require owner review before any real-file distribution.
- Google Apps Script, real Drive sources, distribution permissions, and non-Chromium physical devices are not part of this public-demo verification.

## Tests

This release was verified with 26 groups of real Chromium browser tests and downloadable-file validation, including all 31 sample formats, all four presets/custom, all nine dependency edges, recursive links, on/off overrides, stale drafts, keyboard interaction, and five responsive screen widths.

The repository's GitHub Actions workflow also runs `node --test tests/*.test.mjs` on push. See `QA_RELEASE.md` for the detailed scope and limitations.

Acknowledgements: thanks to Grant Batchelder; recognition of New Frontiers of Sound (NewFoS) and the University of Arizona.

© 2026 Ahmed Alhamadah. All rights reserved.