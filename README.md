# AICU: Early ICU Length-of-Stay Risk and Dynamic Patient Monitoring

*Korea Clinical Datathon 2025 (Team G)*

## What this repo is about

We prototype an **early, dynamic, and explainable risk layer** for ICU care. Using only the **first 24 hours** after ICU admission, we predict whether a patient will experience **prolonged length of stay (LOS ≥ 72h)** and surface **actionable explanations** and **cluster-level phenotypes** to help triage and plan care. A lightweight **web demo** shows how these signals can live inside a clinician’s workflow.

> Scope of this code and results reflects work completed for **Korea Clinical Datathon 2025**.

---

## Problem framing

* **Clinical pain point:** ICU care is high-velocity and multimodal; information overload and alarm fatigue make **prioritization** hard. Discrete, static scores under-serve dynamic decisions.
* **Objective:** Within 24h of ICU admission, **estimate the risk of LOS ≥ 72h** and present interpretable signals that can guide resource planning and patient-level actions.
* **Why LOS≥72h?** It aligns with ICU throughput, staffing, bed management, and cost; early identification can trigger proactive pathways (e.g., diuresis/afterload for HF phenotypes, perfusion workup for hypoperfusion).

---

## Data and cohort (high-level)

* Cohort: **23,894 ICU stays** from postoperative population; **18,858 subjects**.
* Outcome: **Prolonged LOS ≥ 72h**; empirical rate ~ **30.4%** in the cohort.
* Features (first 24h): clinician-entered flowsheets and labs aggregated into robust **windowed statistics** (mean, min, max, deltas, volatility), plus **NA indicators** to preserve missingness signal.
* Grouping: splits are **subject-wise** to avoid information leakage across stays.

> All data handling and modeling follow a retrospective, de-identified setup appropriate for a datathon environment.

---

## Modeling (baseline)

* **Feature pipeline:** 24h anchor at ICU admission; per-signal aggregation; missingness indicators; median imputation.
* **Classifier:** LightGBM with class-imbalance-aware settings; GroupKFold cross-validation by subject.
* **Interpretability:** Global gain-based importances; per-patient SHAP-style attributions for demo.
* **Guardrails:** Threshold sweep targeting pragmatic alert rates (e.g., ~10%) to report PPV/Recall trade-offs.

### Cross-validation results (prolonged LOS ≥ 72h)

* **CV AUROC:** ~ **0.7063**
* **Average Precision (AP):** ~ **0.4398**
* **Brier score:** ~ **0.2050**
* **Threshold sweep (examples):**

  * Alert rate ~ **10%** → **PPV ~0.64**, **Recall ~0.19**
  * Alert rate ~ **20%** → **PPV ~0.58**, **Recall ~0.33**

Interpretation: A 24h-only baseline already recovers meaningful signal for prolonged LOS. This sets a solid floor for iterative improvement and prospective calibration.

---

## Demo application (concept)

* **Patient card:** risk badge, cluster badge, top features (“why this risk”), and guardrail-based alerts.
* **Time view:** risk trajectory and feature trendlines to favor **trend over absolute**.
* **Action snippets:** cluster-specific checklists and threshold presets to reduce cognitive load.
* **Team view:** ward-level list sorted by risk and ETA-to-discharge heuristics.

---

## Phenotype Clustering — Key Insights

We learned patient representations with a **DeepSurv** time-to-event network and clustered in the latent space. We profiled clusters with feature importance and organ-system summaries, testing **k=3** and **k=4** across multiple random initializations.

**Consistent findings**

* **NT-proBNP** ranks highest in feature importance across most clusters, indicating a dominant **heart-failure severity** axis.
* With **k = 4**, one persistent cluster shows a **worst-prognosis** signature driven by **tissue hypoperfusion/ischemia markers**: elevated **Lactate**, low **pH**, high **LDH**.
  This is clinically compatible with **acute myocardial infarction (AMI)** or global hypoxic injury patterns.
* Patterns are **robust to random seeds**, arguing against artifact.
* **k = 3** mostly separates **heart-failure phenotypes**; **k = 4** preserves these and adds a distinct **hypoperfusion** group.

**Clinical implications**

* Phenotypes enable fast triage mental models:
  HF-dominant → diuresis/afterload focus;
  Hypoperfusion → urgent perfusion workup, lactate-clearance monitoring, coronary evaluation as context permits.
* Explains concentration of LOS risk in specific biological trajectories and informs **cluster-specific agent prompts** in the UI.

**Caveats**

* Associational, not causal; lab availability may bias assignments.
* Requires external validation and prospective testing to confirm impact on LOS and outcomes.

---

## What is novel here

* **Dynamic over static:** privileging **trends and deltas** within the first 24h rather than static snapshots.
* **Guardrail design:** reporting along **operational alert rates** that matter to staffing and cognitive load.
* **Phenotype-aware UX:** cluster badges, “why-this-risk” explanations, and action presets to shorten time-to-decision.
* **Datathon-grade to clinic-ready path:** clean baseline with clear hooks for calibration and deployment.

---

## Limitations and risks

* Retrospective, single-center style preprocessing may limit external generalization.
* Missingness is informative but can encode process bias.
* Calibration drift is expected across units and seasons; requires **site-specific recalibration** and continuous monitoring.
* Phenotype clustering is exploratory; **no causal claims**.

---

## Clinical, safety, and equity notes

* **Patient safety:** aim to reduce alarm fatigue by tuning to operational alert rates, prioritizing positive predictive value in scarce-attention settings.
* **Equity:** monitor performance by demographic slices where available; re-train or re-calibrate when disparities are detected.
* **Transparency:** expose “why-this-risk” signals and guardrails so clinicians can contest or confirm recommendations.

---

## Roadmap

* **Data:** add medications, procedures, and real-time vitals; extend windows beyond 24h while preserving latency.
* **Models:** survival head for discharge ETA; conformal prediction for calibrated uncertainty.
* **Calibration:** site-specific Platt/Isotonic; periodic drift checks.
* **Product:** integrate with EHR events; clinician-in-the-loop feedback for active learning.
* **Validation:** external cohort testing; silent prospective run; impact evaluation on throughput and safety metrics.

---

## Team and Roles

Sungman Hong — Lead, preprocessing, mortality modeling

Youngbin Kong — Mortality modeling, presentation

Euiseop Song, MD — Clinical direction, feature selection

Yujin Eom — Agent workflow, preprocessing, mortality modeling

Seoyoung Oh — LOS prediction, EDA, demo app architecture

Hong Kang Lee — Patient clustering, model interpretability

Jongwook Jung, MD — Clinical direction, feature selection


---
