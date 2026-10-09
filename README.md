# ArcGIS Location Platform Sandbox

A minimal browser-based learning sandbox for the ArcGIS Location Platform using **declarative ArcGIS Web Components**.

Each lesson is an ordinary HTML page, containing **both** a runnable demonstration and its educational context. The sandbox embeds that page in an iframe and optionally lets you edit and run its HTML. No framework, package manager, bundler, backend, or custom Docker image is needed.

## Start locally

```bash
# From the repository root
python3 -m http.server 8080
```

Open http://localhost:8080 and enter an ArcGIS API key with the services required by the lesson. Alternatively, start a GitHub Codespace; its devcontainer serves the same port automatically.

## Workflow

1. Choose a lesson in the sidebar. Its **live demo** is displayed by default.
2. Scroll inside the demo to read **What you see**, **How it works**, **Try it**, **What's next?**, and **Documentation**.
3. Click **Show code** to open the complete HTML source next to the demo. Monaco syntax highlighting loads on demand when the CDN is available; a plain text editor works otherwise.
4. Change an HTML attribute (such as `basemap`, `center` or `zoom`) and click **Run code**, or press Ctrl/Cmd + Enter.
5. Click **Reset** to restore the file's original HTML. Changes in the browser are temporary; edit the real HTML file in VS Code to save them.

## Repository

```text
index.html               Stable sandbox interface and API-key form
app.js                   Navigation, iframe preview, optional code editor
styles.css               Shared sandbox layout (not lesson styling)
lessons/
  manifest.js            Simple lesson registry
  _template.html         Copy for a new lesson
  01-map-basics.html     Basemaps and 2D navigation
  02-place-search.html   Geocoding with ArcGIS Search
  03-scene-basics.html   Elevation and 3D scenes
docs/
  LESSON_AUTHORING.md    The lesson contract for humans and Copilot
.devcontainer/
  devcontainer.json      GitHub Codespaces port 8080 server
```

### Adding or removing a lesson

Copy `lessons/_template.html` to a new HTML file, implement a self-contained example and educational explanation, then add **one entry** to `lessons/manifest.js`. To remove a lesson, delete its HTML file and manifest entry. No modifications to `app.js`, `styles.css`, or other lessons should be necessary.

See [Lesson authoring guide](docs/LESSON_AUTHORING.md).

## API keys

The API key is entered in the sandbox and stored in browser `sessionStorage`. Each same-origin lesson iframe reads the key before loading the ArcGIS CDN SDK:

```html
<script>
  var esriConfig = { apiKey: sessionStorage.getItem("ARCGIS_API_KEY") || "" };
</script>
<script type="module" src="https://js.arcgis.com/5.1/"></script>
```

The API key is **not secret** when used in browser code. Limit its privileges to those needed, apply HTTP referrer restrictions for deployed projects, and don't share private Codespaces ports publicly. The key is not committed to the repository and is cleared with **Change API key** or by ending the browser tab session.

The lesson editor runs your HTML in a same-origin iframe (`srcdoc`). **Only execute code you trust:** JavaScript entered in that editor can access the origin's session storage. This sandbox is intended for developers working on their own examples, not arbitrary third-party code.

## Implementation notes

- Each HTML lesson loads its own ArcGIS SDK copy. The sandbox shows only one lesson at a time.
- The full HTML of the selected lesson is also its source code; there is no duplicated `code` string or `mount()` implementation.
- Standard browser refresh is sufficient for code changes. Rebuild Codespaces only after changing the devcontainer configuration.
- JavaScript API use is permitted when the lesson needs additional functionality, but prefer declarative `<arcgis-map>`, `<arcgis-scene>` and their child components first.
