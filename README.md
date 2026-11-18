# REM Program Builder — QA-preview public demo

This repository contains a **public, sample-only** browser version of the REM Program Builder. It is for user-interface and ZIP workflow testing, **not** an approved distribution of NewFoS forms or sensitive participant information.

## Scope and approval status

- **22** resource entries from the earlier staging demo retain their single-home placements and preset memberships.
- **9** newly reviewed resources are included as **proposals**; their original terms, cohort dates, payments, and program ownership still require review. The proposed entries are flagged in `catalog.json`.
- Test counts: **Full REM 31**, **Summer Only 25**, **Research Placement 16**; the nine additions' preset membership was assigned for pilot testing and is **not** the program team's approved final configuration.
- **Custom** supports file-level inclusion/exclusion. A preset with one file removed becomes Custom from that preset.
- **7** sections / **28** defined components, with empty components hidden from the active picker.
- The 3 repeated upload sources (offer letter, bootcamp schedule, summer calendar) were not duplicated.
- The 4 excluded red/orange checklist items were not added.
- The **full** “See how NewFoS ran it” walkthrough is restored: Full 6 slides, Summer 5, Placement 2.

## How to test

The project is a standalone HTML app with no third-party runtime dependencies. Open `index.html` in a browser or publish from GitHub Pages on `main` / root.

1. Select Full / Summer / Placement and review the file count and navigation sections.
2. Switch to Custom or remove a single file from a preset; confirm only the desired items remain.
3. Use Search; check the Review package list and canonical ZIP folder locations.
4. Download each preset and a custom package; unzip and open the fictional DOCX, XLSX and PDF samples.
5. Use Save draft, refresh the page, and use Resume draft.
6. Open "See how NewFoS ran it" and navigate to the last slide for each preset.

Automated regression checks run with `node --test tests/*.test.mjs` and through the GitHub Actions "REM Builder QA" workflow. **Automated validation does not replace checking the published GitHub Pages UI in a real browser.**

## Never treat demo downloads as real program material

All generated files are **fictional, marked SAMPLE ONLY** and created in the browser. The source documents (including host/student agreements, participant details, financial workbook, original event guides and other controlled assets) are **not** included in this public repository.

Release blockers for actual document distribution include: program-owner review of host/student agreement language, consent and year; financial workbook amounts/participant information/housing notes; mentor syllabus placeholders; conflicting storyboard dates; summer presentation timing; and ERN 2027 conference dates/deadlines. The ERN documents are **event-specific examples** (not generic conference guidance).

The following resource gaps remain: a governance Roles and Decisions template, academic-year seminar planner, and complete workflow checklists where the program team still requires them. The checklist's proposed rename of Project Intake to Project Development and any separately emailed form also need reconciliation before real-file publication.

## Maintainer notes

- `catalog.json` is the human-readable mirror of the embedded browser catalog; keep them synchronized.
- `index.html` contains the application logic, catalog, slides and browser-generated fictional samples.
- `tests/` holds the catalog and interaction/ZIP regression checks.
- Do not commit real or restricted source files to this public repository.
