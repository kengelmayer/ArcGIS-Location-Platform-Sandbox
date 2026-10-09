const code = `const map = document.createElement("arcgis-map");

map.setAttribute("basemap", "arcgis/topographic");
map.setAttribute("center", "8.77,50.81");
map.setAttribute("zoom", "11");

map.innerHTML = \`
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-compass slot="top-left"></arcgis-compass>
  <arcgis-scale-bar slot="bottom-left" unit="metric"></arcgis-scale-bar>
  <arcgis-basemap-toggle
    slot="bottom-right"
    next-basemap="arcgis/imagery"
  ></arcgis-basemap-toggle>
\`;

container.append(map);
await map.viewOnReady();`;

export default {
  id: "map-basics",
  title: "Display and navigate a 2D map",
  summary:
    "Start with the smallest useful mapping application: a hosted basemap, a location, and reusable controls for navigation and context.",
  tags: ["Maps SDK", "Basemaps", "Web components"],
  explanation: [
    {
      title: "What you are seeing",
      paragraphs: [
        "The large interactive area is a two-dimensional Map component. The topographic basemap supplies geographic context such as roads, settlements, land cover, and labels. The map starts over Marburg, Germany, using a longitude/latitude center and a zoom level.",
        "The controls are separate ArcGIS web components placed into named slots on the map. Zoom and compass controls sit at the top left, the metric scale bar sits at the bottom left, and the basemap toggle sits at the bottom right. The map component connects those child components to its view automatically.",
      ],
      bullets: [
        "Pan by dragging and zoom with the mouse wheel, trackpad, or zoom buttons.",
        "Rotate the map, then use the compass to return north to the top.",
        "Switch between the topographic and imagery basemaps.",
      ],
    },
    {
      title: "What the platform is doing",
      paragraphs: [
        "The browser loads the ArcGIS Maps SDK for JavaScript from the ArcGIS CDN. The Map component creates and manages a MapView, while the basemap value identifies a hosted ArcGIS basemap style. Your API key authorizes the request for that location service.",
        "A map and a view have different jobs. The map is the container for the basemap and operational layers; the view renders that map and manages interaction, navigation, scale, extent, and screen coordinates. The Map web component hides much of that setup while still exposing the underlying core API when a lesson needs it.",
      ],
    },
    {
      title: "Why this pattern matters",
      paragraphs: [
        "Web components keep the first example readable. Each tag has one responsibility, works in plain HTML and JavaScript, and can later be moved into a framework without changing the ArcGIS concept being taught.",
        "The call to viewOnReady() is the boundary between declaring the map and programmatically using it. Code that adds layers, graphics, event handlers, or analysis should wait for that promise before it works with the view.",
      ],
    },
  ],
  tryIt: [
    "Move to a different city and notice how the scale bar changes while zooming.",
    "Use the basemap toggle and compare the information emphasized by each style.",
    "Change center and zoom in this lesson file, save, and refresh the page.",
  ],
  references: [
    {
      label: "ArcGIS Map component reference",
      url: "https://developers.arcgis.com/javascript/latest/references/map-components/components/arcgis-map/",
    },
    {
      label: "Mapping and location services overview",
      url: "https://developers.arcgis.com/documentation/mapping-and-location-services/",
    },
    {
      label: "ArcGIS Maps SDK: get started with the CDN",
      url: "https://developers.arcgis.com/javascript/latest/get-api/",
    },
  ],
  code,

  async mount(container) {
    const map = document.createElement("arcgis-map");
    map.setAttribute("basemap", "arcgis/topographic");
    map.setAttribute("center", "8.77,50.81");
    map.setAttribute("zoom", "11");
    map.innerHTML = `
      <arcgis-zoom slot="top-left"></arcgis-zoom>
      <arcgis-compass slot="top-left"></arcgis-compass>
      <arcgis-scale-bar slot="bottom-left" unit="metric"></arcgis-scale-bar>
      <arcgis-basemap-toggle
        slot="bottom-right"
        next-basemap="arcgis/imagery"
      ></arcgis-basemap-toggle>
    `;

    container.append(map);
    await map.viewOnReady();
  },
};
