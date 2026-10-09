import { lessons } from "./lessons/manifest.js";

const ARCGIS_SDK_URL = "https://js.arcgis.com/5.1/";
const API_KEY_STORAGE_NAME = "ARCGIS_API_KEY";

const auth = document.querySelector("#auth");
const authForm = document.querySelector("#auth-form");
const authInput = document.querySelector("#api-key");
const authError = document.querySelector("#auth-error");
const app = document.querySelector("#app");
const lessonElement = document.querySelector("#lesson");
const lessonNavigation = document.querySelector("#lesson-navigation");
const lessonCount = document.querySelector("#lesson-count");
const menuButton = document.querySelector("#menu-button");
const sidebar = document.querySelector("#lesson-sidebar");
const changeKeyButton = document.querySelector("#change-key");

let sdkPromise;
let cleanupCurrentLesson;

function loadArcGIS() {
  if (sdkPromise) {
    return sdkPromise;
  }

  sdkPromise = new Promise((resolve, reject) => {
    const sdk = document.createElement("script");
    sdk.type = "module";
    sdk.src = ARCGIS_SDK_URL;
    sdk.onload = resolve;
    sdk.onerror = () => reject(new Error("The ArcGIS Maps SDK could not be loaded."));
    document.head.append(sdk);
  });

  return sdkPromise;
}

function getSelectedLesson() {
  const requestedId = location.hash.slice(1);
  return lessons.find((lesson) => lesson.id === requestedId) ?? lessons[0];
}

function renderNavigation() {
  lessonCount.textContent = String(lessons.length);
  lessonNavigation.replaceChildren();

  lessons.forEach((lesson, index) => {
    const link = document.createElement("a");
    link.className = "lesson-link";
    link.href = `#${lesson.id}`;
    link.innerHTML = `
      <span class="lesson-number">${String(index + 1).padStart(2, "0")}</span>
      <span>${lesson.title}</span>
    `;
    lessonNavigation.append(link);
  });
}

function createExplanationSection(section) {
  const element = document.createElement("section");
  const paragraphs = section.paragraphs
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
  const bullets = section.bullets?.length
    ? `<ul>${section.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>`
    : "";

  element.innerHTML = `<h2>${section.title}</h2>${paragraphs}${bullets}`;
  return element;
}

function renderLessonText(lesson) {
  const tags = lesson.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
  const tryItems = lesson.tryIt.map((item) => `<li>${item}</li>`).join("");
  const references = lesson.references
    .map(
      (reference) => `
        <li>
          <a href="${reference.url}" target="_blank" rel="noreferrer">
            ${reference.label}
          </a>
        </li>
      `,
    )
    .join("");

  lessonElement.innerHTML = `
    <header class="lesson-header">
      <p class="eyebrow">Lesson ${String(lessons.indexOf(lesson) + 1).padStart(2, "0")}</p>
      <h1>${lesson.title}</h1>
      <p class="lesson-summary">${lesson.summary}</p>
      <div class="tag-list">${tags}</div>
    </header>

    <div id="lesson-stage" class="lesson-stage" aria-label="Interactive lesson"></div>

    <div class="lesson-body">
      <article id="lesson-explanation" class="explanation"></article>

      <aside class="lesson-aside">
        <section>
          <h2>Try it</h2>
          <ol>${tryItems}</ol>
        </section>

        <section>
          <h2>Sources</h2>
          <ul class="reference-list">${references}</ul>
        </section>
      </aside>

      <section class="code-panel">
        <h2>The complete lesson code</h2>
        <pre><code id="lesson-code"></code></pre>
      </section>
    </div>
  `;

  const explanation = document.querySelector("#lesson-explanation");
  lesson.explanation.forEach((section) => {
    explanation.append(createExplanationSection(section));
  });

  document.querySelector("#lesson-code").textContent = lesson.code;
}

async function renderSelectedLesson() {
  if (app.hidden) {
    return;
  }

  const lesson = getSelectedLesson();

  if (!location.hash) {
    history.replaceState(null, "", `#${lesson.id}`);
  }

  if (cleanupCurrentLesson) {
    await cleanupCurrentLesson();
    cleanupCurrentLesson = undefined;
  }

  renderLessonText(lesson);

  document.querySelectorAll(".lesson-link").forEach((link) => {
    if (link.hash === `#${lesson.id}`) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  sidebar.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  document.title = `${lesson.title} | ArcGIS Sandbox`;

  try {
    cleanupCurrentLesson = await lesson.mount(document.querySelector("#lesson-stage"));
  } catch (error) {
    console.error(error);
    document.querySelector("#lesson-stage").innerHTML = `
      <p class="fatal-error">
        This lesson could not start. Check the browser console and confirm that
        your API key has the privileges required by this example.
      </p>
    `;
  }

  lessonElement.focus({ preventScroll: true });
  scrollTo({ top: 0, behavior: "auto" });
}

async function startSandbox(apiKey) {
  const trimmedKey = apiKey.trim();

  if (!trimmedKey) {
    return;
  }

  authError.hidden = true;
  sessionStorage.setItem(API_KEY_STORAGE_NAME, trimmedKey);
  esriConfig.apiKey = trimmedKey;

  try {
    await loadArcGIS();
    auth.hidden = true;
    app.hidden = false;
    renderNavigation();
    await renderSelectedLesson();
  } catch (error) {
    authError.textContent = error.message;
    authError.hidden = false;
  }
}

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  startSandbox(authInput.value);
});

changeKeyButton.addEventListener("click", () => {
  sessionStorage.removeItem(API_KEY_STORAGE_NAME);
  location.reload();
});

menuButton.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

window.addEventListener("hashchange", renderSelectedLesson);

const storedKey = sessionStorage.getItem(API_KEY_STORAGE_NAME);

if (storedKey) {
  startSandbox(storedKey);
}
