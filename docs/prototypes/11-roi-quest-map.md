# 11. ROI Quest Map

## Concept

ROI Quest Map places Tokyo spots on a 2D map and turns nearby choices into small quests. It is not a game about maximizing a single score. My ROI helps users evaluate whether a choice fits their individual situation; Quest Point rewards taking action and discovering more of Tokyo.

> My ROI finds a choice that fits you. Quests turn it into action. Quest Point opens the next choice.

## My ROI and Quest Point

| Measure | Role | When shown | How it changes |
| --- | --- | --- | --- |
| Predicted My ROI | Personal fit before action | Quest card and spot detail | Calculated from profile, purpose, budget, time, family context, travel load, and spot values |
| Actual My ROI | Personal fit after action | Completion review and My ROI trends | Calculated from brief feedback; stored as history, not added up |
| Quest Point | Exploration and completion reward | Quest card, completion reward, My page | Granted for completion, first visits, new areas/categories, streaks, a small ROI bonus, and urban contribution |

My ROI is never a balance, level, or unlock condition. Quest Point is the progression system.

## Demo Flow

1. Open `/?version=quest-map` or choose `11. ROI Quest Map` in the prototype switcher.
2. The map opens at Tokyo Station when location is unavailable or permission is declined.
3. Choose `家族で学びたい`.
4. Open the Tokyo Water Science Museum quest and review its predicted My ROI and fit reasons.
5. Start the quest, then use the demo check-in control.
6. Complete the short feedback. The demo default displays a predicted My ROI of `84` and an actual My ROI of `79`.
7. The reward is calculated separately: `100` base + `30` first visit + `10` high-ROI selection + `5` urban contribution = `145 Quest Point`.
8. The demo progresses from `1,140 QP` / Quest Level 2 to `1,285 QP` / Quest Level 3, unlocking the composite quest.
9. In `My ROI`, inspect personal fit trends separately from Quest Point and Quest Level progress.

## Data and Persistence

- 24 local mock spot records represent real Tokyo locations. Coordinates are used for map placement; opening hours, costs, travel time, crowding, and scores are demo values.
- Quest definitions, spot data, and types are in `src/data/questMapData.ts`.
- Personal ROI calculation, feedback evaluation, rewards, unlocks, and localStorage access are in `src/lib/questMapScoring.ts`.
- Quest progress and ROI history use separate localStorage keys:
  - `tokyo-life-roi-quest-map-progress-v2`
  - `tokyo-life-roi-quest-map-roi-history-v2`

## Current Constraints

- Map tiles are from OpenStreetMap through Leaflet.
- Location, routes, opening hours, costs, crowding, check-ins, rewards, and recommendations are all mock behavior.
- There is no login, backend database, live route API, real-time crowd data, or background location tracking.
