---
title: "Deepfake Detection Pipeline for KYC: rPPG + Hybrid Quantum-Classical ML"
description: "An end-to-end low-resolution KYC video deepfake detection pipeline combining rPPG-based physiological analysis with hybrid quantum-classical machine learning inference."
problem: "Detecting deepfakes in low-resolution KYC videos requires reliable signals beyond conventional visual analysis, particularly when video quality limits the effectiveness of purely appearance-based detection."
approach: "Built a pipeline incorporating frame processing, rPPG-based physiological analysis, POS/CHROM signal processing, physiological feature extraction, and hybrid quantum-classical ML inference, with the resulting inference workflow integrated into a React application."
technologies:
  - Python
  - PyTorch
  - PennyLane
  - OpenCV
  - MediaPipe
  - React
  - scikit-learn
contributions:
  - "Built an end-to-end low-resolution KYC video detection pipeline"
  - "Implemented rPPG-based physiological analysis"
  - "Engineered POS/CHROM signal processing"
  - "Extracted 23 physiological features for temporal liveness and deepfake analysis"
  - "Developed and evaluated the hybrid quantum-classical inference component"
  - "Integrated inference into a React-based application"
results: "Improved the VQC from majority-class prediction to genuine/FAKE-class detection, achieving 0.702 specificity."
repoUrl: "https://github.com/NYN-05/Major-project"
status: "in-progress"
featured: true
startDate: "2024-01"
endDate: ""
image: "/images/deepfake-kyc.png"
imageAlt: "Deepfake detection pipeline architecture showing rPPG analysis and quantum-classical ML components"
---
