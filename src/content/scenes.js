export const SCENES = [
  {
    id: 1,
    title: "Scene 1 — Wake Up",
    text: "You wake in a locked castle room. Your phone shows 23:47 and NO SIGNAL. What is your first instinct?",
    choices: [
      { id: "map", label: "Study the map on the wall" },
      { id: "keys", label: "Check the old keys on the desk" },
      { id: "door", label: "Go straight to the door" },
    ],
  },
  {
    id: 2,
    title: "Scene 2 — Footsteps",
    text: "Footsteps approach from the corridor. You have only a few seconds to react.",
    choices: [
      { id: "run", label: "Run toward the corridor" },
      { id: "hide", label: "Hide and listen" },
      { id: "call", label: "Call for the others" },
    ],
  },
];

export function getScene(sceneId) {
  return SCENES.find((scene) => scene.id === sceneId) || SCENES[0];
}
