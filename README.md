# ArcGIS Location Platform Sandbox

A minimal browser-based learning sandbox for showcasing ArcGIS Location
Platform capabilities with the ArcGIS Maps SDK for JavaScript.

The repository intentionally uses plain HTML, CSS, and JavaScript. There is no
framework, package manager, build step, backend, or custom Docker image.

## Start the sandbox

1. Open the repository on GitHub.
2. Select **Code → Codespaces → Create codespace**.
3. Wait for the Codespace and forwarded port `8080` to open.
4. Enter an ArcGIS API key with the privileges required by the lesson.
5. Choose a lesson from the navigation.

You can also run it from any local checkout:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## The modular lesson model

Each file in `lessons/` contains both halves of one teaching session:

- the live ArcGIS showcase in its `mount()` function;
- the detailed explanation, activities, source links, and displayed code.

`lessons/manifest.js` is the small ordered registry used to build the lesson
navigation. Therefore, adding or removing a lesson affects at most two files:
the lesson module and its registry entry.

```text
index.html                 Stable application shell
styles.css                 Shared application and lesson layout
app.js                     Authentication, routing, and lesson rendering

lessons/
├── manifest.js            Ordered lesson registry
├── _template.js           Copy this when authoring a lesson
├── 01-map-basics.js       One complete session
├── 02-place-search.js     One complete session
└── 03-scene-basics.js

docs/
└── LESSON_AUTHORING.md    Contract for people and future coding agents
```

Read [docs/LESSON_AUTHORING.md](docs/LESSON_AUTHORING.md) for the exact lesson
contract, two-file workflow, writing standard, source standard, checklist, and
a ready-to-use prompt for a future coding agent.

## API key handling

Each developer supplies their own ArcGIS API key. It flows only through the
browser:

```text
API key input
    ↓
sessionStorage
    ↓
esriConfig.apiKey
    ↓
ArcGIS Maps SDK and location services
```

The key is not committed, written to a file, or stored in the Codespace
configuration. It survives a refresh in the same browser tab and is removed
when the tab session ends or the learner selects **Change API key**.

Use a key with the smallest set of privileges needed for the active lesson and
configure referrer restrictions for deployed applications.

## Development workflow

Edit a lesson, save it, and refresh the browser. Normal HTML, CSS, and JavaScript
changes do not require a container rebuild.

Only rebuild the Codespace after changing `.devcontainer/devcontainer.json`.
The development container starts a small Python HTTP server and forwards port
`8080`; it performs no application processing.
