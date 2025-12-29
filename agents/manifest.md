# Agent Manifest: The Business Factory Team

## 1. STRATEGIST (The Brain)
- **Directory**: `/agents/strategist`
- **Output**: `strategy.json`
- **Description**: Synthesizes market research and video strategies into a concrete business plan.
- **Prompt Logic**: "Analyze the provided text/videos. Output a JSON with: 'business_name', 'target_audience', 'core_value_proposition', 'key_features' (list), 'monetization_model'."

## 2. DESIGNER (The Vision)
- **Directory**: `/agents/designer`
- **Output**: `design_system.css`, `mockups.html`
- **Description**: Translate the strategy into visual assets using Opal's logic or direct CSS/HTML generation.
- **Prompt Logic**: "Based on 'core_value_proposition' and 'target_audience', generate a modern, premium design system. Colors, Typography, Spacing."

## 3. ENGINEER (The Builder)
- **Directory**: `/agents/engineer`
- **Output**: Production Code
- **Description**: The heavy lifter. Takes the Mockups + Strategy -> React App.
- **Tools**: Vite, React, Vanilla CSS.

## 4. MARKETER (The Voice)
- **Directory**: `/agents/marketer`
- **Output**: Landing Page Copy, Meta Tags
- **Description**: Sells the product.
- **Prompt Logic**: "Write a high-converting H1 and H2 based on 'pain_points' identified by the Strategist."
