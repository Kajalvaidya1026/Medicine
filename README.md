# MedicineShop Web

This folder is an independent React + JavaScript + Vite frontend. The original
Expo project remains in the repository root.

## Run locally

```bash
npm install
npm run dev
```

The development server prints the local URL. Production output can be checked
with `npm run build` and served locally with `npm run preview`.

## Backend URL

The existing Spring Boot requests use `http://localhost:8085` by default. To
override it, create a `.env` file in this directory based on `.env.example` and
set `VITE_API_BASE_URL` to the backend base URL. The browser calls `/user/login`
and `/user/save`; the backend must permit requests from the Vite origin through
its CORS configuration.

No backend credentials are stored in this frontend. Password recovery, OTP
verification, and the home-page account dialogs remain explicitly labelled
frontend demos because the inspected project has no corresponding backend API.
# MedicineShop-
