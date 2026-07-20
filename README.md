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

Open the Final integrated prototype at:

```text
http://localhost:5173/?version=final
```

## Final: Integrated Prototype

The Final prototype is an independent, mobile-first flow that learns from profile assumptions, selected and skipped candidates, actual actions, and short satisfaction feedback. It presents three differently framed options without treating the highest efficiency score as the only correct answer.

My QOL and My ROI have different roles and time scales. My QOL is the recent state of daily fulfillment, aggregated from multiple actions and feedback. My ROI is the personalized measure used to compare each choice, balancing satisfaction, family time, learning, and other value against time, cost, crowding, fatigue, and other burdens. Candidate cards show My ROI and the QOL dimensions likely to be supported; they do not show two competing scores.

Its state is stored separately in `tokyo-life-roi-final-state-v2` and automatically migrates the previous Final state. Use `デモを試す` to load a family profile with prior choices and see how learned preferences change both predictions. See [docs/prototypes/12-final.md](docs/prototypes/12-final.md) for the Japanese specification.

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
