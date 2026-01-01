/* TAGLINES */
const taglines = [
  "EppicLife — From mud, from ash, from truth.",
  "EppicLife — Built from the wreckage, rising anyway.",
  "EppicLife — Forged in the quiet, proven in the storm.",
  "EppicLife — Born twice: once by chance, once by choice.",
  "EppicLife — Rise. Fall. Rise better.",
  "EppicLife — The man rebuilt from the fire.",
  "EppicLife — No masks. No excuses. Just the work.",
  "EppicLife — Honest bones. Hard miles. Open heart.",
  "EppicLife — Built on truth, carried by grit.",
  "EppicLife — Strong enough to break, brave enough to rebuild.",
  "EppicLife — The courage to be real.",
  "EppicLife — Fight forward.",
  "EppicLife — The comeback is the story.",
  "EppicLife — Hit the ground. Stand again.",
  "EppicLife — The man who refuses to stay down.",
  "EppicLife — Every scar earned. Every step chosen.",
  "EppicLife — Built by wind, sharpened by mountains.",
  "EppicLife — Where the wild makes the man.",
  "EppicLife — Strong as the land that raised me.",
  "EppicLife — Walk the ridge. Face the truth.",
  "EppicLife — A life carved from public lands and hard lessons.",
  "EppicLife — Becoming the man I was meant to be.",
  "EppicLife — A life lived awake.",
  "EppicLife — Spirit-led. Grit-built. Truth-driven.",
  "EppicLife — The journey inward is the real hunt.",
  "EppicLife — Becoming is the bravest thing a man can do.",
  "EppicLife — Rise anyway.",
  "EppicLife — Built, not born.",
  "EppicLife — Earned. Every day.",
  "EppicLife — Rise. Hunt. Become.",
  "EppicLife — Strong. Still. Becoming."
];

function chooseTagline() {
  const el = document.getElementById("tagline");
  if (!el) return;
  const choice = taglines[Math.floor(Math.random() * taglines.length)];
  el.textContent = choice;
}

/* QUOTES */
const quotes = [
  "“There are some who can live without wild things and some who cannot.” — Aldo Leopold",
  "“In wildness is the preservation of the world.” — Henry David Thoreau",
  "“The mountains are calling and I must go.” — John Muir",
  "“Wilderness is not a luxury but a necessity of the human spirit.” — Edward Abbey",
  "“The clearest way into the Universe is through a forest wilderness.” — John Muir",
  "“A man is whole only when he takes into account his shadow.” — Carl Jung",
  "“Not all who wander are lost.” — J.R.R. Tolkien"
];

function chooseQuote() {
  const el = document.getElementById("footer-quote");
  if (!el) return;
  const choice = quotes[Math.floor(Math.random() * quotes.length)];
  el.textContent = choice;
}

/* DATE/TIME */
function updateDateTime() {
  const dayEl = document.getElementById("footer-day");
  const dateEl = document.getElementById("footer-date");
  const timeEl = document.getElementById("footer-time");
  if (!dayEl || !dateEl || !timeEl) return;

  const now = new Date();
  dayEl.textContent = now.toLocaleDateString(undefined, { weekday: "long" });
  dateEl.textContent = now.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  timeEl.textContent = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit"
  });
}

/* MOON PHASE */
function getMoonPhaseInfo(date) {
  const synodicMonth = 29.53058867;
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14);
  const now = date.getTime();
  const daysSince = (now - knownNewMoon) / (1000 * 60 * 60 * 24);
  const phase = ((daysSince % synodicMonth) + synodicMonth) % synodicMonth;
  const index = Math.floor((phase / synodicMonth) * 8);

  const names = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Last Quarter",
    "Waning Crescent"
  ];

  const icons = ["●", "◔", "◑", "◕", "○", "◕", "◑", "◔"];

  return { name: names[index], icon: icons[index] };
}

function applyMoonPhase() {
  const now = new Date();
  const info = getMoonPhaseInfo(now);

  const footerIcon = document.getElementById("moon-icon-footer");
  const footerText = document.getElementById("moon-phase-footer");

  if (footerIcon) footerIcon.textContent = info.icon;
  if (footerText) footerText.textContent = info.name;
}

/* POSTING COACH */
function getPostingSuggestion() {
  const coachMessage = document.getElementById("pc-message");
  const coachTiming = document.getElementById("pc-timing");
  if (!coachMessage || !coachTiming) return;

  const now = new Date();
  const day = now.getDay();

  const schedule = {
    1: {
      message:
        "Share a practical resource today — something that helps veterans navigate housing, benefits, or medical systems.",
      timing: "Best time to post: 9 AM – 12 PM"
    },
    3: {
      message:
        "Offer a grounding skill or stress‑management tool. Someone needs this today.",
      timing: "Best time to post: 11 AM – 2 PM"
    },
    5: {
      message:
        "Spotlight a local group, event, or resource in one of your five counties.",
      timing: "Best time to post: 10 AM – 1 PM"
    },
    0: {
      message: "Share a reflection about purpose, resilience, or community.",
      timing: "Best time to post: 8 AM – 11 AM"
    }
  };

  if (schedule[day]) {
    coachMessage.textContent = schedule[day].message;
    coachTiming.textContent = schedule[day].timing;
  } else {
    coachMessage.textContent =
      "No post needed today. Focus on your real‑world work.";
    coachTiming.textContent = "Next posting day: Mon, Wed, Fri, Sun.";
  }
}

/* WEATHER */
// NOTE: In production, this key should be moved server-side.
const API_KEY = "61d2707f92567484d2ce96ac93348f87";

const cities = {
  ellensburg: {
    name: "Ellensburg<br>Weather",
    lat: 46.9965,
    lon: -120.5478
  },
  clearwater: {
    name: "Clearwater<br>Weather",
    lat: 27.9659,
    lon: -82.8001
  }
};

let currentCity = "ellensburg";

function isValidWeatherData(data) {
  return (
    data &&
    data.main &&
    typeof data.main.temp === "number" &&
    data.weather &&
    Array.isArray(data.weather) &&
    data.weather[0] &&
    data.sys &&
    typeof data.sys.sunrise === "number" &&
    typeof data.sys.sunset === "number" &&
    data.wind &&
    typeof data.wind.speed === "number"
  );
}

async function fetchWeather(cityKey) {
  const city = cities[cityKey];
  if (!city) {
    console.error("Unknown city key:", cityKey);
    return;
  }

  const { lat, lon } = city;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (!isValidWeatherData(data)) {
      console.error("Invalid weather data structure:", data);
      return;
    }

    updateWeatherPanel(cityKey, data);
  } catch (error) {
    console.error("Weather fetch error:", error);
  }
}

function updateWeatherPanel(cityKey, data) {
  const city = cities[cityKey];
  if (!city) return;

  const titleEl = document.getElementById("weather-title");
  const tempEl = document.getElementById("temp");
  const conditionsEl = document.getElementById("conditions");
  const windEl = document.getElementById("wind");
  const sunEl = document.getElementById("sun");

  if (titleEl) {
    titleEl.innerHTML = city.name;
  }

  if (tempEl) {
    tempEl.textContent = `${Math.round(data.main.temp)}°`;
  }

  if (conditionsEl) {
    conditionsEl.textContent = data.weather[0].description;
  }

  if (windEl) {
    windEl.textContent = `Wind: ${Math.round(data.wind.speed)} mph`;
  }

  if (sunEl) {
    const sunriseTime = new Date(
      data.sys.sunrise * 1000
    ).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const sunsetTime = new Date(
      data.sys.sunset * 1000
    ).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    sunEl.innerHTML = "";

    const sunriseIcon = document.createElement("span");
    sunriseIcon.className = "sunrise-icon";
    sunriseIcon.textContent = "🌅";

    const sunsetIcon = document.createElement("span");
    sunsetIcon.className = "sunset-icon";
    sunsetIcon.textContent = "🌇";

    sunEl.append(
      sunriseIcon,
      document.createTextNode(` Sunrise: ${sunriseTime}`),
      document.createElement("br"),
      sunsetIcon,
      document.createTextNode(` Sunset: ${sunsetTime}`)
    );
  }
}

/* DOM READY */
document.addEventListener("DOMContentLoaded", () => {
  chooseTagline();
  chooseQuote();
  updateDateTime();
  applyMoonPhase();
  setInterval(updateDateTime, 60000);

  const onenoteButton = document.getElementById("onenote-button");
  if (onenoteButton) {
    onenoteButton.addEventListener("click", () => {
      const oneNoteUrl = "https://www.onenote.com/";
      window.open(oneNoteUrl, "_blank");
    });
  }

  getPostingSuggestion();

  const switchBtn = document.getElementById("switch-city-btn");
  if (switchBtn) {
    switchBtn.addEventListener("click", () => {
      currentCity = currentCity === "ellensburg" ? "clearwater" : "ellensburg";
      switchBtn.textContent =
        currentCity === "ellensburg" ? "Clearwater" : "Ellensburg";
      fetchWeather(currentCity);
    });
  }

  fetchWeather(currentCity);
});
