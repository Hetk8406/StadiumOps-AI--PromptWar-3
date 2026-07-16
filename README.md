# Smart Stadiums & Tournament Operations Command Center (StadiumOps AI)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](#)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%20AA-gold.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#)

StadiumOps AI is an enterprise-grade Smart Stadium Operations Command Center designed for the FIFA World Cup 2026. Built with React and TypeScript, it integrates Gemini AI to provide tournament operators with real-time incident analysis, volunteer dispatch recommendations, crowd control tracking, and multilingual communication translations.

---

## Key Features

*   **Operations Dashboard:** Real-time metrics tracking gates occupancy, incident response rates, and volunteer loads.
*   **Incident Monitoring (AI Enabled):** Real-time incident logs with automated impact classifications and action plans generated via Gemini AI.
*   **Volunteer Operations (AI Enabled):** Automated matching algorithms recommending the closest, best-skilled volunteers for incidents.
*   **Crowd Intelligence (AI Enabled):** Zone congestion analyzers predicting hotspots and suggesting crowd diversion schemes.
*   **Multilingual Communications:** Instant translation interface facilitating message exchanges between operators and international field marshals.
*   **Keyboard-First Command Palette:** Access features, navigation, and run tasks without leaving the keyboard (`Ctrl + K`).

---

## System Architecture

The application adheres to a clean, layered frontend architecture decoupled from direct backend services:

```text
React Components (View Layer)
      ↓
Custom Feature Hooks (State/Shortcut Hooks)
      ↓
React Context Providers (State Management)
      ↓
Domain Services & AI Prompt Builders (Business Logic Layer)
      ↓
Mock Repositories & Local Database (Data Access Layer)
```

For a detailed walkthrough, review the [Architecture & Onboarding Guide](docs/architecture-and-onboarding.md).

---

## Tech Stack

*   **Framework:** React 18, Vite, TypeScript (Strict Mode)
*   **Styling:** Custom CSS Custom Properties (High Contrast & Light/Dark Themes)
*   **Icons:** Lucide React
*   **Generative AI:** Google Generative AI SDK (Gemini AI Models)
*   **Build Pipeline:** ESLint, TypeScript Compiler (`tsc`), Vite Build

---

## Getting Started

### Prerequisites
*   Node.js v20.x or higher
*   npm

### Installation

1.  **Clone the repository and install dependencies:**
    ```bash
    npm ci
    ```

2.  **Configure environment variables:**
    Create a `.env` file in the root folder:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    VITE_DEBUG_MODE=true
    ```

3.  **Run the local development server:**
    ```bash
    npm run dev
    ```

4.  **Verify type-safety and compile the production bundle:**
    ```bash
    npm run typecheck
    npm run build
    ```

---

## Contributing

Please review our [Contribution Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting pull requests.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
