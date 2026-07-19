# Tokyo Life ROI Mock

Tokyo Life ROI is a frontend-only prototype collection for exploring different ways to support everyday decisions in Tokyo.

## Setup

```bash
npm install
npm run dev
```

Open V11 directly at:

```text
http://localhost:5173/?version=quest-map
```

`?version=11` is also supported.

## Version 11: ROI Quest Map

V11 combines a Leaflet/OpenStreetMap map, local Tokyo spot data, quest cards, a demo location fallback, and a check-in flow. The app is a mock: operating hours, costs, crowding, routes, and reward values are demo data.

### My ROI and Quest Point

- **Predicted My ROI** evaluates how well an individual quest fits the user before departure.
- **Actual My ROI** evaluates that completed choice after short feedback. My ROI is kept as a history and shown as averages and tendencies; it is not an accumulated point or level.
- **Quest Point** rewards actual exploration and completion. It unlocks new quests, areas, collection progress, and Quest Levels.

In short: **ROI measures the quality of a choice; points expand the range of actions.**

The V11 demo starts at Quest Level 2 with `1,140 QP`. Complete the Tokyo Water Science Museum quest with the default feedback to receive `145 QP`, reach Quest Level 3, and unlock a composite quest. Its predicted and actual My ROI are shown separately from the reward.

### Local Storage

V11 separates its persistence into two keys:

- `tokyo-life-roi-quest-map-progress-v2`: Quest Point, Quest Level-related progress, visits, unlocks, and trophies.
- `tokyo-life-roi-quest-map-roi-history-v2`: Predicted/actual My ROI histories and feedback.

Use the reset action in V11 settings to restore the demo state.
