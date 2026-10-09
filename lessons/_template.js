const code = `// Put the shortest complete example shown to the learner here.`;

export default {
  // Use a stable, URL-friendly ID. It becomes the hash in index.html#lesson-id.
  id: "replace-with-lesson-id",
  title: "Replace with a clear lesson title",
  summary: "State what the learner will see and understand in one sentence.",
  tags: ["Capability", "Service or SDK"],

  explanation: [
    {
      title: "What you are seeing",
      paragraphs: [
        "Describe the visible result first. Name the map, control, layer, or service that produced it.",
      ],
      bullets: ["Optional observation one.", "Optional observation two."],
    },
    {
      title: "How it works",
      paragraphs: [
        "Explain the request, data, ArcGIS capability, and browser behavior in plain language.",
      ],
    },
    {
      title: "When to use it",
      paragraphs: [
        "Explain the practical use case, limitations, and the next concept a learner should add.",
      ],
    },
  ],

  tryIt: [
    "Give the learner a specific interaction to perform.",
    "Ask them to change one simple value in this file.",
  ],

  // Link to primary Esri documentation used to create and verify the lesson.
  references: [
    {
      label: "ArcGIS documentation",
      url: "https://developers.arcgis.com/",
    },
  ],

  code,

  async mount(container) {
    // Build only the interactive showcase here.
    // The shared app renders the title, explanation, sources, and code panel.
    const map = document.createElement("arcgis-map");
    map.setAttribute("basemap", "arcgis/topographic");
    map.setAttribute("center", "8.77,50.81");
    map.setAttribute("zoom", "11");
    container.append(map);

    await map.viewOnReady();

    // Optionally return an async cleanup function for timers or global listeners:
    // return async () => { ... };
  },
};
