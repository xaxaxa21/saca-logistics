---
name: Redesign Intro Logo Morph
overview: Redesign the IntroGate animation in `components/ui/preview-logo.tsx` from the current laggy 5-path MorphSVG + DrawSVG approach to a single fluid blob that smoothly resolves into the raster logo over ~4 seconds.
todos: []
isProject: false
---

# Redesign Intro Logo Morph Animation

## Root Cause Analysis

The current animation in [`components/ui/preview-logo.