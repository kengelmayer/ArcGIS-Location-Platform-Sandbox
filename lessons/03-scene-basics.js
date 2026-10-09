const code = `const scene = document.createElement("arcgis-scene");

scene.setAttribute("basemap", "arcgis/topographic");
scene.setAttribute("ground", "world-elevation");

scene.innerHTML = \`
  <arcgis-zoom slot="top-left"></arcgis-zoom>
  <arcgis-navigation-toggle slot="top-left"></arcgis-navigation-toggle>
  <arcgis-compass slot="top-left"></arcgis-compass>
\`;

container.append(scene);
await scene.viewOnReady();

await scene.goTo({
  center: [8.77, 50.81],
  zoom: 13,
  tilt: 67,
  heading: 25,
});`;

export default {
  id: "scene-basics",
  title: "Explore terrain in 3D",
  summary:
    "Use the same component model for a 3D scene, combine a basemap with the World Elevation service, and position a virtual camera above the landscape.",
  tags: ["3D scenes", "Elevation", "Camera"],
  explanation: [
    {
      title: "What you are seeing",
      paragraphs: [
        "This lesson replaces the 2D Map component with a Scene component. The basemap is draped over a three-dimensional ground surface supplied by the ArcGIS World Elevation service. The initial camera is tilted and rotated so changes in terrain are visible instead of looking straight down.",
        "Drag to move through the scene, use the navigation toggle to switch interaction modes, and use the compass to restore the orientation. The scene still uses geographic layers and coordinates; the extra dimension changes how the view renders and navigates them.",
      ],
    },
    {
      title: "Ground, camera, and view",
      paragraphs: [
        "The ground property defines the elevation surface beneath the scene. A camera describes where the viewer is looking from and toward, including position, heading, and tilt. In this simple example, goTo() moves the scene to a target containing a center, zoom, tilt, and heading after the view is ready.",
        "A 3D scene can combine elevation with points, lines, polygons, integrated meshes, buildings, point clouds, and other scene layers. Those layer types are deliberately left for later lessons so this session isolates the conceptual change from a flat map to a camera-based view of a 3D world.",
      ],
    },
    {
      title: "When 3D adds information",
      paragraphs: [
        "Three-dimensional presentation is most useful when height, depth, terrain, or line of sight contributes to the question. Examples include urban development, visibility, underground assets, flood planning, aviation, and landscape analysis. A 2D map is often clearer when the task is primarily about position, distribution, or comparison.",
        "Choosing 2D or 3D is therefore an information-design decision, not simply a visual upgrade. The Maps SDK keeps the application pattern similar so the choice can follow the problem being explained.",
      ],
    },
  ],
  tryIt: [
    "Drag with the primary and secondary pointer buttons to compare pan and rotate behavior.",
    "Use the navigation toggle, then explore the terrain from a lower viewing angle.",
    "Change tilt or heading in the goTo target and observe how the camera changes.",
  ],
  references: [
    {
      label: "ArcGIS Scene component reference",
      url: "https://developers.arcgis.com/javascript/latest/references/map-components/components/arcgis-scene/",
    },
    {
      label: "ArcGIS 3D scene documentation",
      url: "https://developers.arcgis.com/documentation/mapping-and-location-services/mapping/scenes-3d/",
    },
    {
      label: "ArcGIS Elevation service guide",
      url: "https://developers.arcgis.com/documentation/mapping-and-location-services/elevation/",
    },
  ],
  code,

  async mount(container) {
    const scene = document.createElement("arcgis-scene");
    scene.setAttribute("basemap", "arcgis/topographic");
    scene.setAttribute("ground", "world-elevation");
    scene.innerHTML = `
      <arcgis-zoom slot="top-left"></arcgis-zoom>
      <arcgis-navigation-toggle slot="top-left"></arcgis-navigation-toggle>
      <arcgis-compass slot="top-left"></arcgis-compass>
    `;

    container.append(scene);
    await scene.viewOnReady();
    await scene.goTo({
      center: [8.77, 50.81],
      zoom: 13,
      tilt: 67,
      heading: 25,
    });
  },
};
