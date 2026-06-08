# EcoTrack: Personal Carbon Accounting Ledger

EcoTrack is a client-side sustainability tool designed to track, analyze, and optimize daily carbon dioxide (CO₂) emissions. 

---

## Technical Features

1. **Continuous Carbon Accounting**
   * Computes carbon offsets in real-time across four primary metrics: Transport, Nutrition, Utilities, and Consumer Shopping.
   * Employs standard sustainability coefficients to calculate footprint metrics dynamically.

2. **Isolated Storage Protocol**
   * Implements strict user isolation in local storage memory (`localStorage`).
   * Scopes activity inputs and history keys under each user's email, preventing cross-account data leaks.

3. **Handcrafted Dynamic Charts**
   * Renders lightweight SVG vectors for weekly averages, monthly trends, and category shares.
   * Avoids external rendering packages to maintain instant loading speeds.

4. **Rules-Engine Sustainability Advisor**
   * Dynamically tracks logged activities to evaluate top-impact consumption categories and suggest actionable carbon-offset challenges.

---

## File Architecture

* `/src/pages` — Contains layout views for Auth, Dashboard, Analytics, and Recommendations.
* `/src/components` — Houses SVG charts, interactive logging forms, and metrics meters.
* `/src/utils` — Handles carbon calculation constants, recommendations rules, and local database storage scopes.

---

## Setup & Running

To launch the developer sandbox locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the Vite developer server:
   ```bash
   npm run dev
   ```

3. Compile for production hosting:
   ```bash
   npm run build
   ```
