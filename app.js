import { lessons } from "./lessons/manifest.js";

const $ = (selector) => document.querySelector(selector);
const auth = $("#auth");
const app = $("#app");
const preview = $("#preview");
const workspace = $("#workspace");
const codePanel = $("#code-panel");
const codeInput = $("#code-input");
const showCode = $("#toggle-code");
const runCode = $("#run-code");
const resetCode = $("#reset-code");
const codeStatus = $("#code-status");
let currentLesson;
let originalCode = "";
let editor;
let editorLoading;
let requestId = 0;

// Each lesson runs as a real HTML document in a same-origin iframe.
function selectLesson() {
  if (app.hidden) return;
  const lesson = lessons.find((item) => item.id === location.hash.slice(1)) || lessons[0];
  if (!lesson) return;
  if (!location.hash) history.replaceState(null, "", `#${lesson.id}`);
  currentLesson = lesson;
  $("#lesson-title").textContent = lesson.title;
  document.title = `${lesson.title} | ArcGIS Sandbox`;
  preview.removeAttribute("srcdoc");
  preview.src = lesson.file;
  $("#navigation").querySelectorAll("a").forEach((link) => {
    link.setAttribute("aria-current", String(link.hash === `#${lesson.id}`));
  });
  $("#sidebar").classList.remove("open");
  $("#menu").setAttribute("aria-expanded", "false");
  if (!codePanel.hidden) loadSource(lesson);
}

async function loadSource(lesson) {
  const id = ++requestId;
  codeStatus.textContent = "Loading HTML…";
  try {
    const response = await fetch(lesson.file);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    if (id !== requestId) return;
    originalCode = html;
    setCode(html);
    codeStatus.textContent = "Edit the HTML, then click Run code (Ctrl/Cmd + Enter).";
  } catch (error) {
    if (id === requestId) codeStatus.textContent = `Cannot load source: ${error.message}`;
  }
}

function getCode() {
  return editor ? editor.getValue() : codeInput.value;
}

function setCode(text) {
  codeInput.value = text;
  if (editor) editor.setValue(text);
}

// Monaco is optional and loads only when the developer opens the code panel.
function loadMonaco() {
  if (editorLoading) return editorLoading;
  editorLoading = new Promise((resolve) => {
    const cdn = "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs";
    const script = document.createElement("script");
    script.src = `${cdn}/loader.js`;
    script.onload = () => {
      window.require.config({ paths: { vs: cdn } });
      window.require(["vs/editor/editor.main"], () => {
        $("#editor-host").hidden = false;
        editor = window.monaco.editor.create($("#editor-host"), {
          value: codeInput.value,
          language: "html",
          theme: "vs-dark",
          automaticLayout: true,
          minimap: { enabled: false },
          wordWrap: "on",
          fontSize: 13,
        });
        editor.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.Enter, runPreview);
        codeInput.hidden = true;
        resolve();
      }, () => resolve());
    };
    script.onerror = () => resolve(); // Editable textarea remains available offline.
    document.head.append(script);
  });
  return editorLoading;
}

function runPreview() {
  // srcdoc inherits this page's origin, so the lesson reads the existing tab's sessionStorage.
  preview.srcdoc = getCode();
  codeStatus.textContent = "Preview updated. Changes are not saved to the HTML file.";
}

$("#auth-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const key = $("#api-key").value.trim();
  if (!key) return;
  sessionStorage.setItem("ARCGIS_API_KEY", key);
  auth.hidden = true;
  app.hidden = false;
  selectLesson();
});

$("#change-key").addEventListener("click", () => {
  sessionStorage.removeItem("ARCGIS_API_KEY");
  location.reload();
});

$("#menu").addEventListener("click", () => {
  const open = $("#sidebar").classList.toggle("open");
  $("#menu").setAttribute("aria-expanded", String(open));
});

showCode.addEventListener("click", async () => {
  const open = codePanel.hidden;
  codePanel.hidden = !open;
  workspace.classList.toggle("split", open);
  showCode.textContent = open ? "Hide code" : "Show code";
  showCode.setAttribute("aria-pressed", String(open));
  runCode.hidden = resetCode.hidden = !open;
  if (open) {
    await loadSource(currentLesson);
    await loadMonaco();
    editor?.layout();
  }
});

runCode.addEventListener("click", runPreview);
codeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    runPreview();
  }
});
resetCode.addEventListener("click", () => {
  setCode(originalCode);
  preview.removeAttribute("srcdoc");
  preview.src = currentLesson.file;
  codeStatus.textContent = "Restored the original lesson.";
});

window.addEventListener("hashchange", selectLesson);

// The manifest controls the list; no lesson logic belongs in the shell.
const navigation = $("#navigation");
lessons.forEach((lesson, index) => {
  const link = document.createElement("a");
  link.href = `#${lesson.id}`;
  link.textContent = `${String(index + 1).padStart(2, "0")}  ${lesson.title}`;
  navigation.append(link);
});

if (sessionStorage.getItem("ARCGIS_API_KEY")) {
  auth.hidden = true;
  app.hidden = false;
  selectLesson();
}
