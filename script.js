/* -----------------------------
   DATE & TIME
----------------------------- */
function updateDateTime() {
  const now = new Date();

  const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const day = dayNames[now.getDay()];
  const date = `${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const time = `${hours}:${minutes} ${ampm}`;

  document.getElementById("footer-day").textContent = day;
  document.getElementById("footer-date").textContent = date;
  document.getElementById("footer-time").textContent = time;
}
setInterval(updateDateTime, 1000);
updateDateTime();

/* -----------------------------
   TAGLINE ROTATION
----------------------------- */
const taglines = [
  "Every scar earned. Every step chosen.",
  "Stand tall. Move forward.",
  "Your story is still being written.",
  "Strength is built one choice at a time.",
  "You are the fire that endures.",
  "Walk with purpose. Live with honor."
];

function chooseTagline() {
  const taglineEl = document.getElementById("tagline");
  const random = Math.floor(Math.random() * taglines.length);
  taglineEl.style.opacity = 0;

  setTimeout(() => {
    taglineEl.textContent = taglines[random];
    taglineEl.style.opacity = 1;
  }, 300);
}

chooseTagline();
setInterval(chooseTagline, 30 * 60 * 1000);

/* -----------------------------
   EPPIC JOURNAL BUTTON
----------------------------- */
document.getElementById("onenote-button").addEventListener("click", () => {
  window.open("onenote:https://d.docs.live.net/your-onenote-link-here", "_blank");
});

/* -----------------------------
   POSTING COACH
----------------------------- */
function updatePostingCoach() {
  const pcMessage = document.getElementById("pc-message");
  const pcTiming = document.getElementById("pc-timing");

  const day = new Date().getDay();
  const highImpactDays = [1,3,5,0];

  if (highImpactDays.includes(day)) {
    pcMessage.textContent = "Today is a high‑impact posting day. Share something meaningful.";
    pcTiming.textContent = "Best windows: Morning or early evening.";
  } else {
    pcMessage.textContent = "No post needed today. Focus on your real‑world work.";
    pcTiming.textContent = "Next high‑impact day: Monday, Wednesday, Friday, or Sunday.";
  }
}
updatePostingCoach();

/* -----------------------------
   WEATHER
----------------------------- */
let currentCity = "Ellensburg";

async function fetchWeather(city) {
  try {
    const apiKey = "YOUR_OPENWEATHER_KEY";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    document.getElementById("weather-title").innerHTML = `${city}<br>Weather`;
    document.getElementById("temp").textContent = `${Math.round(data.main.temp)}°`;
    document.getElementById("conditions").textContent = data.weather[0].description;
    document.getElementById("wind").textContent = `Wind: ${Math.round(data.wind.speed)} mph`;

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: "numeric", minute: "2-digit"});
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: "numeric", minute: "2-digit"});
    document.getElementById("sun").textContent = `Sunrise: ${sunrise} | Sunset: ${sunset}`;
  } catch (err) {
    document.getElementById("temp").textContent = "Weather unavailable";
  }
}

fetchWeather(currentCity);

document.getElementById("switch-city-btn").addEventListener("click", () => {
  currentCity = currentCity === "Ellensburg" ? "Clearwater" : "Ellensburg";
  document.getElementById("switch-city-btn").textContent =
    currentCity === "Ellensburg" ? "Clearwater" : "Ellensburg";
  fetchWeather(currentCity);
});

/* -----------------------------
   MOON PHASE (REAL ICONS)
----------------------------- */
const moonIcons = [
  "https://raw.githubusercontent.com/manifestinteractive/moon-phase-icons/master/svg/new-moon.svg",
  "https://raw.githubusercontent.com/manifestinteractive/moon-phase-icons/master/svg/waxing-crescent-moon.svg",
  "https://raw.githubusercontent.com/manifestinteractive/moon-phase-icons/master/svg/first-quarter-moon.svg",
  "https://raw.githubusercontent.com/manifestinteractive/moon-phase-icons/master/svg/waxing-gibbous-moon.svg",
  "https://raw.githubusercontent.com/manifestinteractive/moon-phase-icons/master/svg/full-moon.svg",
  "https://raw.githubusercontent.com/manifestinteractive/moon-phase-icons/master/svg/waning-gibbous-moon.svg",
  "https://raw.githubusercontent.com/manifestinteractive/moon-phase-icons/master/svg/last-quarter-moon.svg",
  "https://raw.githubusercontent.com/manifestinteractive/moon-phase-icons/master/svg/waning-crescent-moon.svg"
];

const moonNames = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent"
];

function getMoonPhaseIndex() {
  const now = new Date();
  const lp = 2551443;
  const new_moon = new Date("Jan 6, 2000 18:14:00").getTime();
  const phase = ((now.getTime() - new_moon) / 1000) % lp;
  return Math.floor((phase / lp) * 8);
}

function updateMoon() {
  const index = getMoonPhaseIndex();
  document.getElementById("moon-icon-footer").src = moonIcons[index];
  document.getElementById("moon-phase-footer").textContent = moonNames[index];
}

updateMoon();

/* -----------------------------
   SPORTS (STATIC EXAMPLE)
----------------------------- */
const sportsData = [
  {
    type: "live",
    home: "Seahawks",
    away: "49ers",
    score: "17 — 20",
    league: "NFL",
    tagline: "True to the blue",
    location: "Lumen Field"
  },
  {
    type: "live",
    home: "Kraken",
    away: "Canucks",
    score: "2 — 1",
    league: "NHL",
    tagline: "Release the deep",
    location: "Rogers Arena"
  },
  {
    type: "upcoming",
    home: "Mariners",
    away: "Astros",
    score: "0 — 0",
    league: "MLB",
    tagline: "Late-night heartbreak optional",
    location: "T-Mobile Park"
  }
];

function loadSports() {
  const container = document.getElementById("sports-container");
  container.innerHTML = "";

  sportsData.forEach(game => {
    const block = document.createElement("div");
    block.className = `sports-block ${game.type}`;

    block.innerHTML = `
      <div class="sports-row">
        <div class="sports-team">
          <span class="sports-team-name">${game.home}</span>
          <span class="sports-sub">${game.league} — ${game.tagline}</span>
        </div>
        <div class="sports-score">${game.score}</div>
      </div>
      <div class="sports-sub">${game.location}</div>
    `;

    container.appendChild(block);
  });
}

loadSports();
