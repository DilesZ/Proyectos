# 🎨 Stable Diffusion Agent (Local/Cloud)

**Role**: Uncensored, High-Fidelity Image Generation.
**Focus**: Adult Content (NSFW), Artistic Control, consistency.

## 🧰 Tool Stack
1.  **Stable Diffusion (SDXL / Pony V6)**:
    - *Use Case*: The "Workhorse" for Fanvue content.
    - *Strength*: LoRA support (perfect face consistency).
2.  **Perchance (Unsafe/Uncensored)**:
    - *Use Case*: **Rapid Prototyping & "Edge" Concepts**.
    - *Why*: No filters. Great for testing poses or concepts that might trigger "Safety Refusals" in Gemini/Bing. Use it to generate a "Base Image" and then refine in SD.
    - *URL*: `perchance.org/unsafeimagesgenerator`

## ⚙️ Workflow: The "Deep Fake" Pipeline
1.  **Drafting**: Use **Perchance** to find a composition/pose that works (no login, fast).
2.  **Generation**: Move to **SDXL (Pony V6)**.
    - Apply **LoRA** (Character Face) at 0.8 strength.
    - Apply **ControlNet** (OpenPose) using the Perchance draft as reference.
3.  **Upscaling**: Use **Ultimate SD Upscale** for 4k resolution.
