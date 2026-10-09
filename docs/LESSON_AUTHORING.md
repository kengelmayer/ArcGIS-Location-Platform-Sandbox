# Lesson authoring contract

This is the source of truth for both humans and code-generation agents authoring lessons for **ArcGIS-Location-Platform-Sandbox** (https://github.com/kengelmayer/ArcGIS-Location-Platform-Sandbox).

## One lesson = one independent HTML document

Copy `lessons/_template.html` to `lessons/NN-short-topic.html`. Include the full `<!doctype html>`, `<head>`, minimal CSS, SDK setup, interactive demo, explanations, activities and official documentation links in that one file. A lesson must work as a directly served page and when embedded by the sandbox iframe. Do not create `mount()`, exported lesson objects, separate context documents, or strings that duplicate the demo code.

## Required structure

1. **Page setup:** UTF-8, viewport, meaningful title and only CSS required by the demo.
2. **Browser-session API key:** `var esriConfig = { apiKey: sessionStorage.getItem("ARCGIS_API_KEY") || "" };` before the ArcGIS CDN script. No committed keys or backend proxy.
3. **SDK:** `<script type="module" src="https://js.arcgis.com/5.1/"></script>` unless a deliberate, documented change is requested.
4. **Live demo first:** Immediately visible and interactive, preferably using declarative ArcGIS Web Components directly in HTML.
5. **Educational context:** Introductory learning objective, `What you see`, `How it works`, `Try it`, `What's next?` and `Documentation`.
6. **Specific sources:** At least one accurate link to an official ArcGIS SDK or location-services documentation page.
7. **Manifest entry:** `{ id: "stable-slug", title: "Visible lesson title", file: "lessons/NN-short-topic.html" }` in `lessons/manifest.js`. File name and ID should be unique.

## Writing and design

- Teach exactly one capability. A developer should see a working result within minutes.
- Prefer `<arcgis-map>`, `<arcgis-scene>`, `<arcgis-search>`, and other supported components over `document.createElement()` when simple HTML is enough.
- Use a few CSS declarations to give the demo an explicit height. Avoid unrelated styling and abstractions.
- Use additional JavaScript only for functionality that genuinely requires it. Explain where it comes from and why.
- Keep the demo as the first substantial body element; put explanation below it so the default view is the demo.
- Explain exactly what a user sees and which controls are interactive; give one click experiment and one editable-HTML experiment.
- Indicate which ArcGIS services and API-key privileges are used. Never claim an example works without testing it.
- Use accurate, specific documentation URLs. Check latest official references when possible.
- No npm, bundlers, React/Vue, local backend, credentials in source files, or dependencies unrelated to the learning goal.

## Example authoring workflow

1. Read `README.md`, `lessons/_template.html` and an existing lesson closest to the requested capability.
2. Check the official ArcGIS documentation for the required Web Components and authentication behavior.
3. Create **one** new `lessons/NN-topic.html` file. Keep it readable and runnable by itself.
4. Add **one** entry to `lessons/manifest.js` (ordered as desired).
5. Run `python3 -m http.server 8080` and check the page with the API key privileges needed.
6. Open the code panel, edit an HTML attribute, run the code, reset, and verify the docs/activities are accurate.
7. Report file changes and distinguish syntax/static checks from tested live ArcGIS behavior.

## Acceptance checklist

- [ ] One valid complete HTML file per lesson (no separate lesson JavaScript module)
- [ ] Demonstration visible first and fills an appropriate portion of the iframe
- [ ] Uses declarative ArcGIS Web Components where possible
- [ ] Works without a build process or changing `app.js`
- [ ] Reads API key from `sessionStorage` before SDK import
- [ ] All five educational sections included and accurate to visible controls
- [ ] Experiments include one immediate interaction and one HTML change
- [ ] Official documentation links and required key privileges stated
- [ ] Manifest includes only the new/changed lesson entry
- [ ] HTML source displayed by the code editor is the actual lesson file
- [ ] Syntax and browser behavior checked where possible; limitations reported

## Non-goals

Do not rewrite shared navigation, authentication, editor, or CSS just to add a lesson. Never use the old JS-module lesson contract (`code`, `explanation`, `mount(container)`) or add duplicate HTML/context files.
