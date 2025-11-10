# Rakshak — AI-Powered Farming Assistant

## Overview

Rakshak is an AI-driven farming assistant designed to help smallholder farmers and agronomists make data-driven decisions. The app combines satellite and sensor data, simple ML/AI models, and rule-based automation to deliver timely recommendations for irrigation, pest management, fertilizer application, and crop health monitoring.

Firebase serves as the backbone: Authentication, Realtime Database / Firestore, Cloud Functions, Storage, and Cloud Messaging power the backend for all data ingestion, processing, notifications, and user management.

This README documents architecture, setup, APIs, data schema, deployment, and best practices so you can deploy Rakshak locally or on a production Firebase project.

---

## Key Features

* Field registration and geotagging
* Crop calendar and phenology tracking
* Soil moisture and weather-driven irrigation alerts
* Pest and disease detection (image-based) using AI
* Fertilizer recommendation engine (rule-based + ML)
* Push notifications and SMS alerts via Firebase Cloud Messaging (FCM) and third-party SMS providers
* Offline-first data capture for low-connectivity environments
* Role-based access (farmer, agronomist, admin)
* Historical farm log and analytics dashboards

---

## Architecture

1. **Client apps (Android/Flutter, Web/React)** — UI for farmers and agronomists, offline caching, and media upload.
2. **Firebase Auth** — Email/phone-based authentication and role management.
3. **Firestore / Realtime DB** — Primary data store for users, fields, events, logs, and recommendations.
4. **Cloud Storage** — Stores photos, drone images, and generated reports.
5. **Cloud Functions** — Serverless compute for processing images (invoke AI), running rules, sending notifications, and scheduled tasks (cron).
6. **Third-party AI endpoints** — Optional: Gemini Vision, custom TensorFlow/TF Lite models for pest/disease detection.
7. **FCM & SMS Gateway** — Notification channels to deliver alerts.

Diagram (logical):

```
[Mobile/Web] <---> Firebase Auth
       |                 |
       |                 v
       |             Firestore
       v                 |
   Cloud Storage <---- Cloud Functions ----> 3rd-party AI
       |
       v
  FCM / SMS
```

---

## Technology Stack

* Frontend: Flutter (recommended) / React
* Backend: Firebase (Auth, Firestore, Cloud Functions, Storage, FCM)
* AI: Gemini Vision or custom TensorFlow.js / TF Lite models
* Dev Tools: Node.js, Firebase CLI, GitHub Actions (CI/CD)

---

## Data Model

### Users (collection: `users`)

```json
{
  "uid": "user_123",
  "name": "Ram",
  "phone": "+91xxxxxxxxxx",
  "role": "farmer", // or agronomist, admin
  "village": "Village Name",
  "created_at": "2025-11-01T08:00:00Z"
}
```

### Fields (collection: `fields`)

```json
{
  "field_id": "field_456",
  "owner_uid": "user_123",
  "name": "North Plot",
  "latlng": {"lat": 26.9124, "lng": 75.7873},
  "area_hectares": 0.5,
  "soil_type": "Loamy",
  "crop": "Wheat",
  "sowing_date": "2025-10-10"
}
```

### Measurements (collection: `measurements`)

```json
{
  "field_id": "field_456",
  "timestamp": "2025-11-08T06:00:00Z",
  "type": "soil_moisture", // or temperature, humidity
  "value": 22.5
}
```

### Events / Recommendations (collection: `events`)

```json
{
  "event_id": "evt_789",
  "field_id": "field_456",
  "type": "irrigation_alert",
  "message": "Soil moisture at 22% — recommended irrigation 20mm",
  "priority": "high",
  "created_at": "2025-11-08T07:00:00Z",
  "status": "pending"
}
```

---

## Setup & Local Development

### Prerequisites

* Node.js 18+
* Firebase CLI (`npm i -g firebase-tools`)
* Google Cloud account with Firebase project
* (Optional) API keys for Gemini Vision or your AI provider

### Steps

1. Clone repo:

```bash
git clone <repo-url>
cd rakshak
```

2. Install dependencies for functions:

```bash
cd functions
npm install
```

3. Initialize Firebase (if not yet):

```bash
firebase login
firebase init
# Select Firestore, Functions, Hosting (if web), Storage
```

4. Configure environment variables for Functions (locally and production):

```bash
firebase functions:config:set ai.provider="gemini" ai.key="YOUR_KEY" sms.provider="twilio" sms.sid="..." sms.token="..."
```

5. Run emulators for local dev:

```bash
firebase emulators:start --only firestore,functions,auth,storage
```

6. Deploy functions and hosting:

```bash
firebase deploy --only functions,firestore,storage,hosting
```

---

## Cloud Functions (Examples)

* `onImageUpload`: Triggered when an image is uploaded to Cloud Storage. Calls AI inference endpoint and writes detection + recommendations to Firestore.
* `scheduledIrrigationCheck`: Cron job that runs daily to evaluate fields using weather forecasts and soil data and generates irrigation events.
* `onMeasurementWrite`: Listens to new measurements and triggers threshold-based alerts.
* `sendNotification`: Sends FCM push + fallback SMS when a high-priority event is created.

Example Node.js function skeleton:

```js
exports.onImageUpload = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  // download, call AI, write results
});
```

---

## AI Integration

1. **Pest/Disease Detection:** Send image bytes to Gemini Vision or custom TF Lite model endpoint and parse labels/confidence. Store label and confidence in `events` collection.
2. **Fertilizer Recommendations:** Use a mix of rule-based logic (soil tests, crop type, growth stage) and lightweight regression models to suggest NPK doses.
3. **Irrigation Scheduler:** Combine soil moisture, forecast precipitation (OpenWeather API), and evapotranspiration heuristics to compute irrigation need.

---

## Offline-first Strategy

* Use Firestore offline persistence on mobile to cache writes and sync when online.
* Queue images locally and upload when connection is available.
* Add lightweight local rules to warn users when critical thresholds are reached even offline.

---

## Notifications and Alerts

* Use FCM to deliver push notifications to the app.
* For critical alerts in low-connectivity regions, fall back to SMS using Twilio or an SMS gateway.
* Notification example: "Irrigation recommended for North Plot — apply 20mm within 24 hours."

---

## Security & Privacy

* Enforce Firestore security rules by user role and document ownership.
* Use Firebase Auth custom claims for role-based access.
* Secure Cloud Function endpoints and validate inputs.
* Keep AI keys and SMS credentials in `functions.config()` (Firebase environment config), never in client code.

---

## Testing

* Unit tests for Cloud Functions (use `firebase-functions-test` library).
* Integration tests with the local Firebase emulator suite.
* Manual QA on low-end devices to ensure offline UX and image uploads are robust.

---

## Deployment & CI/CD

* Use GitHub Actions to run tests and deploy Cloud Functions on merge to `main`.
* Store secrets in GitHub Secrets and use `firebase deploy --token` in the action.

Sample GitHub Action (deploy functions):

```yaml
name: Deploy Functions
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci --prefix functions
      - run: npx firebase-tools login:ci --token ${{ secrets.FIREBASE_TOKEN }}
      - run: firebase deploy --only functions,firestore,storage --project ${{ secrets.FIREBASE_PROJECT }}
```

---

## Monitoring & Analytics

* Use Firebase Performance Monitoring and Crashlytics for mobile app performance.
* Log function errors to Stackdriver / Cloud Logging.
* Create dashboard in Google Data Studio or Looker Studio for farm-level analytics.

---

## Cost Optimization

* Use Cloud Functions with conservative memory/time limits and cold-start optimizations.
* Batch AI calls where possible to reduce API costs.
* Archive older images to cheaper storage classes or delete per retention policy.

---

## Contribution Guide

1. Fork the repository and create a feature branch.
2. Run tests locally and add unit tests for new logic.
3. Submit a PR with a detailed description and screenshots if applicable.

---

## License

Rakshak is released under the MIT License.

---
