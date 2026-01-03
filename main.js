/* ============================================================
   EPPICLIFE HELM — MAIN JS ENGINE
   ============================================================ */

/* ------------------------------------------------------------
   PANEL TOGGLES (LEFT + RIGHT)
   ------------------------------------------------------------ */
const leftPanel = document.getElementById("panel-sports");
const rightPanel = document.getElementById("panel-environment");
const centerPanel = document.getElementById("panel-center");

const toggleLeft = document.querySelector(".ember-left-toggle");
const toggleRight = document.querySelector(".ember-right-toggle");

let leftOpen = true;
let rightOpen = true;

function updateLayout() {
  const leftWidth = leftOpen ? "20%" : "0%";
  const rightWidth = rightOpen ? "20%" : "0%";

  leftPanel.style.width = leftWidth;
  rightPanel.style.width = rightWidth;

  const centerWidth =
    leftOpen && rightOpen ? "60%" :
    leftOpen && !rightOpen ? "80%" :
    !leftOpen && rightOpen ? "80%" :
    "100%";

  centerPanel.style.width = centerWidth;

  toggleLeft.style.opacity = leftOpen ? "1" : "0.5";
  toggleRight.style.opacity = rightOpen ? "1" : "0.5";
}

toggleLeft.addEventListener("click", () => {
  leftOpen = !leftOpen;
  updateLayout();
});

toggleRight.addEventListener("click", () => {
  rightOpen = !rightOpen;
  updateLayout();
});

updateLayout();

/* ------------------------------------------------------------
   BACKGROUND ROTATOR
   ------------------------------------------------------------ */
const bgImage = document.getElementById("helm-background-image");

const backgroundImages = [
  "https://images.unsplash.com/photo-1517649763962-0c623066013b",
  "https://images.unsplash.com/photo-1505842465776-3d90f616310d",
  "https://images.unsplash.com/photo-1505842465776-3d90f616310d",
  "https://images.unsplash.com/photo-1518609878373-06d740f60d8b",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b"
];

function rotateBackground() {
  const img = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
  bgImage.style.opacity = 0;

  setTimeout(() => {
    bgImage.style.backgroundImage = `url(${img})`;
    bgImage.style.opacity = 1;
  }, 800);
}

rotateBackground();
setInterval(rotateBackground, 30 * 60 * 1000);

/* ------------------------------------------------------------
   FOOTER QUOTE ROTATOR
   ------------------------------------------------------------ */
const quoteText = document.getElementById("footer-quote-text");
const quoteAuthor = document.getElementById("footer-quote-author");

const quotes = [
  {
    text: "We do not live to think, but we think in order to survive.",
    author: "José Ortega y Gasset"
  },
  {
    text: "Tell me to what you pay attention and I will tell you who you are.",
    author: "José Ortega y Gasset"
  },
  {
    text: "Living is a constant process of deciding what we are going to do.",
    author: "José Ortega y Gasset"
  },
  {
    text: "Life is fired at us point-blank.",
    author: "José Ortega y Gasset"
  }
];

function rotateQuote() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  quoteText.textContent = q.text;
  quoteAuthor.textContent = `— ${q.author}`;
}

setInterval(rotateQuote, 15000);

/* ------------------------------------------------------------
   DATE / TIME (RIGHT PANEL)
   ------------------------------------------------------------ */
const envDatetime = document.getElementById("env-datetime");

function updateDateTime() {
  const now = new Date();
  const formatted = now.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

  envDatetime.textContent = formatted.toUpperCase();
}

updateDateTime();
setInterval(updateDateTime, 1000);

/* ------------------------------------------------------------
   POSTING COACH — RANDOM PROMPTS
   ------------------------------------------------------------ */
const postIdeaBtn = document.getElementById("btn-post-idea");

const postIdeas = [
  "Write about the moment today that shifted your mood.",
  "Describe one thing you noticed that nobody else did.",
  "What was the cleanest decision you made today?",
  "What was the most cinematic moment of your day?",
  "What did you learn today that Tomorrow‑You will thank you for?"
];

postIdeaBtn.addEventListener("click", () => {
  const idea = postIdeas[Math.floor(Math.random() * postIdeas.length)];
  alert(idea);
});

/* ------------------------------------------------------------
   JOURNAL BUTTONS
   ------------------------------------------------------------ */
document.getElementById("btn-open-journal").addEventListener("click", () => {
  window.open("https://www.onenote.com", "_blank");
});

document.getElementById("btn-open-journal-2").addEventListener("click", () => {
  window.open("https://www.onenote.com", "_blank");
});

/* ------------------------------------------------------------
   PLACEHOLDER HOOKS FOR FUTURE SYSTEMS
   ------------------------------------------------------------ */

// Weather API hook
function loadWeather() {
  document.getElementById("env-weather-status").textContent = "Weather system coming online...";
}

// Moon phase hook
function loadMoon() {
  document.getElementById("env-moon").textContent = "Moon phase system coming online...";
}

// Deer movement hook
function loadDeer() {
  document.getElementById("env-deer").textContent = "Deer movement system coming online...";
}

// Season signal hook
function loadSeason() {
  document.getElementById("env-season").textContent = "Season signal system coming online...";
}

// Sports API hook
function loadSports() {
  console.log("Sports system ready for API integration.");
}

loadWeather();
loadMoon();
loadDeer();
loadSeason();
loadSports();
