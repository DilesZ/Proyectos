# 📸 Datasheet Generation Prompts (Nano Banana Pro)

## 🧠 Strategy
We use **Nano Banana Pro (Gemini 3)** to understand the "Concept" and generate the Master Reference, then use batch processing for the variations.

---

## 1. The "Master Anchor" Prompt (Gemini 3 Pro)
*Use this in Nano Banana Pro to create the source of truth.*

```text
**Role**: Concept Artist.
**Task**: Create a "Character Reference Sheet" for a consistent influencer persona.
**Model Settings**: Aspect Ratio 3:2, High Fidelity.

**Character Description**:
[INSERT DETAILED DESCRIPTION HERE - e.g., "Elena, 24 years old, Spanish, curly brown hair, green eyes, wearing a chic beige trench coat and white sneakers."]

**Output Requirements**:
1. Generate a single image containing THREE views of the character:
   - Left: Full body Front view.
   - Center: Close-up Portrait (smiling).
   - Right: Full body Side view.
2. Background: Neutral grey studio background.
3. Lighting: Soft cinematic lighting (Rembrandt).
4. Style: [Photorealistic / 3D Pixar / Anime].
```

---

## 2. The "30 Scenarios" Batch List
*Feed these into SeaArt.ai (using ControlNet Reference) or Freepik (Re-imagine) using the Master Image.*

**Morning Routine:**
1. Waking up in bed, stretching, sunlight streaming in.
2. Brushing teeth in a modern bathroom mirror.
3. Drinking coffee in a cozy kitchen, wearing pajamas.
4. Yoga pose on a mat, living room background.
5. Making a healthy smoothie bowl.

**Work/Hustle:**
6. Typing on a laptop at a hipster coffee shop.
7. On a phone call, looking professional/serious.
8. Writing in a notebook, thoughtful expression.
9. Presenting to a whiteboard (view from behind/side).
10. Holding a tablet showing a chart.

**Lifestyle/Outdoors:**
11. Walking in a park, autumn leaves.
12. Shopping, holding bags, city street.
13. Eating an ice cream cone, laughing.
14. Sitting on a park bench reading a book.
15. Riding a bicycle (or electric scooter).

**Social/Night:**
16. Toasting with a glass of wine at a restaurant.
17. Dancing in a club (neon lights).
18. Selfie pose with a landmark in the background.
19. dressed up for a gala/date night.
20. Singing karaoke (holding microphone).

**Emotions (Close-ups):**
21. Crying / Sad expression.
22. Bursting out laughing.
23. Angry / Frustrated.
24. Surprised / Shocked (hand over mouth).
25. Flirty / Winking.

**Niche Specific (Adjust as needed):**
26. Holding the product (Book/Cosmetic).
27. Pointing at a sign (blank for text overlay).
28. Thumbs up, looking at camera.
29. "Shhh" gesture (finger on lips).
30. Heart hands gesture.
```
