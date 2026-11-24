# REM Program Builder — Modernized dependency release QA

Date: November 23, 2026 (America/Phoenix). Owner/Maintainer: Ahmed Alhamadah.

## Scope

- Replaced the older public demo interface with the approved modern NewFoS navy/teal visual treatment, official previously supplied logo, responsive UI, seven phase navigation and project footer.
- Added a visible native **Protect dependencies** checkbox (ON by default), nine explicit suggested relationship links, per-file dependency/locking explanations, and an expanded review summary.
- Protected add: adds transitively required companions. Protected remove: blocks conflicts, including bulk removal. Unprotected mode: arbitrary selections allowed with warnings. Re-enabling protection: restores dependencies and notifies. Draft save/restore persists the setting, and older drafts migrate safely.
- For protected downloads, selection resolver rejects any missing suggested prerequisite; for unprotected downloads it permits arbitrary valid selections.
- Preserves catalog identity, 31 resources, 28 components, seven sections, three preset sizes (31 / 25 / 16), search, file-level selection, slides, drafts, valid sample ZIPs and canonical download paths.

## Local automated verification

- **Baseline Chromium regression:** 13/13 groups pass (`qa_browser_regression.py` / `QA_REPORT.json`). Covers all 40 component-level buttons, all 31 file formats in presets, file-selection and custom behavior, search, navigation, modal, drafts, slides, responsive screens, package paths and console errors.
- **Dependency-focused Chromium testing:** 13/13 groups pass (`qa_dependencies.py` / `QA_DEPENDENCIES.json`). Covers all nine dependency links, transitive closure, release/unlock ordering, bulk protection/override, unprotected one-file ZIP, re-enabling protection, review locks, draft on/off and legacy migration, resolver validation, keyboard, catalog invariants and console errors.
- **Screen widths:** 320, 390, 768, 1024, 1440 px; no document-wide horizontal overflow in baseline.
- **Generated documents:** valid synthetic DOCX, XLSX and PDF files. Full 31 (14 DOCX, 11 XLSX, 6 PDF); Summer 25; Placement 16; custom tested in both protected and free modes. ZIP CRC, paths and duplicate checks performed.

## Release limitations

1. Tested in real headless Chromium, not Safari/Firefox or with assistive technologies. Keyboard behavior and basic accessibility were tested but this is not a complete WCAG certification.
2. The dependency graph contains **suggested workflow relationships**, not confirmed mandatory procedural or formula-level document dependencies. The owner should approve rules before official deployment.
3. **No authentic program documents** are distributed in this public demo; program approval of source files is still required.
4. Google Apps Script/Drive delivery, live permissions and release of actual documents are separate tasks. Public GitHub files are intentionally limited to sample documents.