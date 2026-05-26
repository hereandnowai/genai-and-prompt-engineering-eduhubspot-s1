# Identity Document Verifier

A local-first React app that compares a user's entered full name and date of birth against OCR text extracted from a Passport or Aadhaar card.

## Features

- Manual full name and date of birth input
- Passport or Aadhaar parsing mode
- JPG, PNG, and PDF upload support
- Browser OCR through Tesseract.js
- First-page PDF rendering through PDF.js
- Field-level match, mismatch, and missing-field feedback
- Clear session action for removing all in-memory PII from the UI

## Privacy

This app has no backend and does not use `localStorage`, `sessionStorage`, cookies, or analytics. Uploaded files and extracted text are kept only in React state for the current browser session. Clearing the session or refreshing the page removes that in-memory data.

The OCR engine may load its runtime assets in the browser, but this app does not upload the selected identity document or extracted PII to a server.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
```
