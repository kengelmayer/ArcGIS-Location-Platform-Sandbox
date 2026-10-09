const code = `const map = document.createElement("arcgis-map");

map.setAttribute("basemap", "arcgis/navigation");
map.setAttribute("center", "8.77,50.81");
map.setAttribute("zoom", "6");

map.innerHTML = \`
  <arcgis-search
    slot="top-right"
    placeholder="Find an address or place"
  ></arcgis-search>
  <arcgis-zoom slot="top-left"></arcgis-zoom>
\`;

container.append(map);
await map.viewOnReady();`;

export default {
  id: "place-search",
  title: "Find addresses and places",
  summary:
    "Turn human-readable place names and addresses into map locations with the ArcGIS Geocoding service and a ready-made Search component.",
  tags: ["Geocoding", "Search", "Location services"],
  explanation: [
    {
      title: "What you are seeing",
      paragraphs: [
        "The search box is connected to the map and to the ArcGIS World Geocoding service. Begin typing an address, landmark, city, postal code, or place name. The service returns suggestions; selecting one adds a result marker and navigates the map to the matched location.",
        "This is forward geocoding: the input is text and the output is a geographic candidate with coordinates, an address label, and additional attributes. The visual marker is only the final presentation of that structured result.",
      ],
    },
    {
      title: "How a search becomes a location",
      paragraphs: [
        "While you type, the component requests suggestions so users can choose a standardized result instead of submitting ambiguous free text. After selection, the component performs address matching, ranks the candidates, chooses the selected candidate, and asks the map view to navigate to its geometry.",
        "Candidate quality depends on the input and the available reference data. A complete street address can resolve to a rooftop or address point, while a broad place name may resolve to a city or administrative area. Production applications should inspect returned attributes when the precision of a result matters.",
      ],
      bullets: [
        "Suggestions improve speed and reduce spelling or formatting ambiguity.",
        "The result contains coordinates and descriptive attributes, not just a pin.",
        "The same service can also reverse geocode coordinates into an address.",
      ],
    },
    {
      title: "Why the component stays simple",
      paragraphs: [
        "No service URL is needed here. When a global API key is configured, the Search component uses the ArcGIS World Geocoding service through its location-services endpoint. It also handles the input, suggestion list, result graphic, keyboard interaction, and map navigation.",
        "For a more specialized application, the same component can search feature layers, use several sources, limit the number of results, change result symbols, or disable automatic navigation. The basic lesson intentionally keeps those defaults visible before adding configuration.",
      ],
    },
  ],
  tryIt: [
    "Search for a complete street address and then for only its city; compare the zoom levels.",
    "Search for a landmark such as “Brandenburg Gate” or a category such as “coffee”.",
    "Use the browser developer tools to inspect the selected Search component result.",
  ],
  references: [
    {
      label: "ArcGIS Search component reference",
      url: "https://developers.arcgis.com/javascript/latest/references/map-components/components/arcgis-search/",
    },
    {
      label: "ArcGIS Geocoding service guide",
      url: "https://developers.arcgis.com/documentation/mapping-and-location-services/geocoding/",
    },
  ],
  code,

  async mount(container) {
    const map = document.createElement("arcgis-map");
    map.setAttribute("basemap", "arcgis/navigation");
    map.setAttribute("center", "8.77,50.81");
    map.setAttribute("zoom", "6");
    map.innerHTML = `
      <arcgis-search
        slot="top-right"
        placeholder="Find an address or place"
      ></arcgis-search>
      <arcgis-zoom slot="top-left"></arcgis-zoom>
    `;

    container.append(map);
    await map.viewOnReady();
  },
};
