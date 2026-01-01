// EppicLife Dashboard — Full Script
// EASY MODE: whole file replacement, no ambiguity.

// ===== GLOBAL CONFIG =====

const ONE_NOTE_JOURNAL_URL = "https://www.onenote.com/"; // <-- replace with your real OneNote link

// Base URL patterns for Sportsurge (or similar). These are examples / placeholders.
const SPORTS_SURGE_BASE = {
    NFL: "https://v2.sportsurge.net/#/streams/0",       // examples – adjust to your real categories
    NBA: "https://v2.sportsurge.net/#/streams/1",
    MLB: "https://v2.sportsurge.net/#/streams/2",
    NHL: "https://v2.sportsurge.net/#/streams/3",
    SOCCER: "https://v2.sportsurge.net/#/streams/4",
    UFC: "https://v2.sportsurge.net/#/streams/5",
    BOXING: "https://v2.sportsurge.net/#/streams/6",
    RUGBY: "https://v2.sportsurge.net/#/streams/7",
    SUMO: "https://v2.sportsurge.net/",
    KABADDI: "https://v2.sportsurge.net/"
};

// Your team hierarchy / favorites
const FAVORITES = {
    MLB: ["Seattle Mariners", "Atlanta Braves"],
    NBA: ["Philadelphia 76ers", "Portland Trail Blazers", "Seattle Supersonics"],
    NFL: ["Seattle Seahawks", "Buffalo Bills"],
    NHL: ["Seattle Kraken", "New York Rangers"],
    EPL: ["Tottenham Hotspur", "Nottingham Forest", "Crystal Palace"],
    CHAMPIONSHIP: ["Portsmouth"],
    RUGBY: ["Ireland", "Leinster"],
    KABADDI: ["Patna Pirates"],
    SUMO: ["Ura", "Hoshoryu"],
    BOXING: ["Anthony Joshua"],
    UFC: ["Big Fight"] // conceptual – special tagging
};

// Season awareness: order of leagues depends on the calendar.
// This is a simple example. You can refine later.
function getSeasonOrderedLeagues(currentDate = new Date()) {
    const month = currentDate.getMonth() + 1; // 1–12

    // Very rough season buckets – tweak as needed.
    if (month >= 4 && month <= 9) {
        // MLB + soccer + some rugby
        return ["MLB", "EPL", "CHAMPIONSHIP", "NBA", "NFL", "NHL", "RUGBY", "UFC", "BOXING", "SUMO", "KABADDI"];
    } else if (month >= 10 || month <= 2) {
        // NFL + early NBA + NHL + soccer
        return ["NFL", "EPL", "CHAMPIONSHIP", "NBA", "NHL", "MLB", "RUGBY", "UFC", "BOXING", "SUMO", "KABADDI"];
    } else {
        // Transition months – default
        return ["NBA", "NHL", "MLB", "EPL", "CHAMPIONSHIP", "NFL", "RUGBY", "UFC", "BOXING", "SUMO", "KABADDI"];
    }
}

// Background image candidates — in real use, you’d call Unsplash / sports feeds.
let backgroundCandidates = [
    // Placeholder static images. Replace with real URLs or API responses.
    "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg",
    "https://images.pexels.com/photos/2570139/pexels-photo-2570139.jpeg",
    "https://images.pexels.com/photos/140300/pexels-photo-140300.jpeg"
];

// Background rotation interval: 30 minutes (ms)
const BACKGROUND_ROTATION_INTERVAL = 30 * 60 * 1000;

// ===== INIT =====

document.addEventListener("DOMContentLoaded", () => {
    wireIdentityActions();
    initClock();
    initEnvironment();
    initSportsPanel();
    initBackgroundRotator();
});

// ===== IDENTITY / COACH =====

function wireIdentityActions() {
    const journalButton = document.getElementById("journal-button");
    const coachJournalButton = document.getElementById("coach-journal-button");
    const coachIdeaButton = document.getElementById("coach-idea-button");

    if (journalButton) {
        journalButton.href = ONE_NOTE_JOURNAL_URL;
    }
    if (coachJournalButton) {
        coachJournalButton.addEventListener("click", () => {
            window.open(ONE_NOTE_JOURNAL_URL, "_blank");
        });
    }
    if (coachIdeaButton) {
        coachIdeaButton.addEventListener("click", () => {
            // Simple placeholder – later you can wire this to a prompt / API.
            alert("Prompt: What’s one moment from today that would matter to you 5 years from now?");
        });
    }
}

// ===== CLOCK + ENVIRONMENT (RIGHT PANEL) =====

function initClock() {
    updateClock();
    setInterval(updateClock, 1000 * 30); // every 30 seconds is enough
}

function updateClock() {
    const dateEl = document.getElementById("date-text");
    const timeEl = document.getElementById("time-text");

    const now = new Date();
    const dateOptions = { weekday: "short", month: "short", day: "numeric", year: "numeric" };
    const timeOptions = { hour: "numeric", minute: "2-digit" };

    if (dateEl) dateEl.textContent = now.toLocaleDateString(undefined, dateOptions).toUpperCase();
    if (timeEl) timeEl.textContent = now.toLocaleTimeString(undefined, timeOptions);
}

function initEnvironment() {
    // High-level placeholders for now.

    const weatherMain = document.getElementById("weather-main");
    const weatherExtra = document.getElementById("weather-extra");
    const moonText = document.getElementById("moon-text");
    const deerText = document.getElementById("deer-text");
    const seasonText = document.getElementById("season-text");

    if (weatherMain) weatherMain.textContent = "Weather loading…";
    if (weatherExtra) weatherExtra.textContent = "High / Low · Wind · Feels like";

    if (moonText) moonText.textContent = "Moon phase data placeholder.";
    if (deerText) deerText.textContent = "Deer movement prediction placeholder.";
    if (seasonText) seasonText.textContent = "Season signal placeholder.";

    // Later: plug in real APIs for weather / moon / deer.
}

// ===== SPORTS PANEL (LEFT) =====

function initSportsPanel() {
    // In a real build, this is where you call your sports API(s)
    // and then feed data into the engine.

    // For now, we simulate some data so layout + Live logic are visible.
    const sampleSportsData = buildSampleSportsData();

    const orderedLeagues = getSeasonOrderedLeagues();
    const liveGames = [];
    const otherGames = [];

    // Flatten + classify games
    orderedLeagues.forEach((league) => {
        const leagueGames = sampleSportsData[league] || [];
        leagueGames.forEach((game) => {
            if (game.isLive) {
                liveGames.push({ league, game });
            } else {
                otherGames.push({ league, game });
            }
        });
    });

    // Sort live and non-live games by favorites first
    const sortedLiveGames = sortByFavorites(liveGames);
    const sortedOtherGames = sortByFavorites(otherGames);

    renderSportsPanel(sortedLiveGames, sortedOtherGames, sampleSportsData.headlines, sampleSportsData.highlights);
}

function sortByFavorites(entries) {
    // entries: { league, game }
    return entries.sort((a, b) => {
        const favs = FAVORITES[a.league] || [];
        const aScore = computeFavoriteScore(a.game, favs);
        const bScore = computeFavoriteScore(b.game, favs);
        return bScore - aScore; // descending
    });
}

function computeFavoriteScore(game, leagueFavorites) {
    let score = 0;
    if (!leagueFavorites || leagueFavorites.length === 0) return score;

    leagueFavorites.forEach((teamName, idx) => {
        const weight = leagueFavorites.length - idx; // first favorite = highest weight
        const homeMatch = game.homeTeam.includes(teamName);
        const awayMatch = game.awayTeam.includes(teamName);
        if (homeMatch || awayMatch) score += weight * 10;
    });

    // Slight bonus for live
    if (game.isLive) score += 5;

    return score;
}

function renderSportsPanel(liveGames, otherGames, headlines, highlights) {
    const liveList = document.getElementById("sports-live-list");
    const scoresList = document.getElementById("sports-scores-list");
    const headlinesList = document.getElementById("sports-headlines-list");
    const highlightsList = document.getElementById("sports-highlights-list");
    const summaryEl = document.getElementById("sports-summary");
    const favoritesList = document.getElementById("sports-favorites-list");

    if (liveList) {
        liveList.innerHTML = "";
        liveGames.forEach(({ league, game }) => {
            const item = buildSportsItem(league, game, true);
            liveList.appendChild(item);
        });
        if (liveGames.length === 0) {
            const empty = document.createElement("div");
            empty.className = "sports-summary-text";
            empty.textContent = "No live games right now.";
            liveList.appendChild(empty);
        }
    }

    if (scoresList) {
        scoresList.innerHTML = "";
        otherGames.forEach(({ league, game }) => {
            const item = buildSportsItem(league, game, false);
            scoresList.appendChild(item);
        });
    }

    if (headlinesList) {
        headlinesList.innerHTML = "";
        headlines.forEach((h) => {
            const div = document.createElement("div");
            div.className = "sports-item";
            const main = document.createElement("div");
            main.className = "sports-item-main";

            const title = document.createElement("div");
            title.className = "sports-item-title";
            title.textContent = h.title;

            const subtitle = document.createElement("div");
            subtitle.className = "sports-item-subtitle";
            subtitle.textContent = h.source;

            main.appendChild(title);
            main.appendChild(subtitle);
            div.appendChild(main);

            if (h.url) {
                div.classList.add("clickable");
                div.addEventListener("click", () => {
                    window.open(h.url, "_blank");
                });
            }

            headlinesList.appendChild(div);
        });
    }

    if (highlightsList) {
        highlightsList.innerHTML = "";
        highlights.forEach((hl) => {
            const div = document.createElement("div");
            div.className = "sports-item clickable";
            const main = document.createElement("div");
            main.className = "sports-item-main";

            const title = document.createElement("div");
            title.className = "sports-item-title";
            title.textContent = hl.title;

            const subtitle = document.createElement("div");
            subtitle.className = "sports-item-subtitle";
            subtitle.textContent = hl.context;

            main.appendChild(title);
            main.appendChild(subtitle);
            div.appendChild(main);

            div.addEventListener("click", () => {
                if (hl.url) window.open(hl.url, "_blank");
            });

            highlightsList.appendChild(div);
        });
    }

    if (summaryEl) {
        summaryEl.textContent =
            "Today’s sports snapshot: favorites first, big moments surfaced, and live games one click away.";
    }

    if (favoritesList) {
        favoritesList.innerHTML = "";
        Object.entries(FAVORITES).forEach(([league, teams]) => {
            teams.forEach((t) => {
                const div = document.createElement("div");
                div.className = "sports-item";
                const main = document.createElement("div");
                main.className = "sports-item-main";

                const title = document.createElement("div");
                title.className = "sports-item-title";
                title.textContent = t;

                const subtitle = document.createElement("div");
                subtitle.className = "sports-item-subtitle";
                subtitle.textContent = league;

                main.appendChild(title);
                main.appendChild(subtitle);
                div.appendChild(main);
                favoritesList.appendChild(div);
            });
        });
    }
}

function buildSportsItem(league, game, isLive) {
    const div = document.createElement("div");
    div.className = "sports-item";
    if (isLive) div.classList.add("live", "clickable");

    const main = document.createElement("div");
    main.className = "sports-item-main";

    const title = document.createElement("div");
    title.className = "sports-item-title";
    title.textContent = `${game.awayTeam} @ ${game.homeTeam}`;

    const subtitle = document.createElement("div");
    subtitle.className = "sports-item-subtitle";
    subtitle.textContent = `${league} · ${game.status}`;

    main.appendChild(title);
    main.appendChild(subtitle);

    const meta = document.createElement("div");
    meta.className = "sports-item-meta";
    meta.textContent = game.scoreText || "";

    div.appendChild(main);
    div.appendChild(meta);

    if (isLive) {
        div.addEventListener("click", () => {
            const url = resolveSportsurgeUrlForLeague(league);
            if (url) window.open(url, "_blank");
        });
    }

    return div;
}

function resolveSportsurgeUrlForLeague(league) {
    switch (league) {
        case "NFL":
            return SPORTS_SURGE_BASE.NFL;
        case "NBA":
            return SPORTS_SURGE_BASE.NBA;
        case "MLB":
            return SPORTS_SURGE_BASE.MLB;
        case "NHL":
            return SPORTS_SURGE_BASE.NHL;
        case "EPL":
        case "CHAMPIONSHIP":
            return SPORTS_SURGE_BASE.SOCCER;
        case "RUGBY":
            return SPORTS_SURGE_BASE.RUGBY;
        case "UFC":
            return SPORTS_SURGE_BASE.UFC;
        case "BOXING":
            return SPORTS_SURGE_BASE.BOXING;
        case "SUMO":
            return SPORTS_SURGE_BASE.SUMO;
        case "KABADDI":
            return SPORTS_SURGE_BASE.KABADDI;
        default:
            return null;
    }
}

// SAMPLE DATA (for layout + logic testing only)
function buildSampleSportsData() {
    return {
        MLB: [
            {
                homeTeam: "Seattle Mariners",
                awayTeam: "Houston Astros",
                status: "LIVE · Top 6th",
                scoreText: "3 – 2",
                isLive: true
            },
            {
                homeTeam: "Atlanta Braves",
                awayTeam: "New York Mets",
                status: "FINAL",
                scoreText: "7 – 4",
                isLive: false
            }
        ],
        NFL: [
            {
                homeTeam: "Seattle Seahawks",
                awayTeam: "San Francisco 49ers",
                status: "SUNDAY 1:25 PM",
                scoreText: "",
                isLive: false
            },
            {
                homeTeam: "Buffalo Bills",
                awayTeam: "New England Patriots",
                status: "MONDAY 5:15 PM",
                scoreText: "",
                isLive: false
            }
        ],
        NBA: [
            {
                homeTeam: "Philadelphia 76ers",
                awayTeam: "Boston Celtics",
                status: "LIVE · 3rd Qtr",
                scoreText: "82 – 77",
                isLive: false // flip to true to test multiple live games
            }
        ],
        NHL: [
            {
                homeTeam: "Seattle Kraken",
                awayTeam: "Vancouver Canucks",
                status: "FINAL",
                scoreText: "4 – 1",
                isLive: false
            }
        ],
        EPL: [
            {
                homeTeam: "Tottenham Hotspur",
                awayTeam: "Liverpool",
                status: "SAT 9:30 AM",
                scoreText: "",
                isLive: false
            }
        ],
        CHAMPIONSHIP: [
            {
                homeTeam: "Portsmouth",
                awayTeam: "Sunderland",
                status: "SAT 7:00 AM",
                scoreText: "",
                isLive: false
            }
        ],
        RUGBY: [
            {
                homeTeam: "Leinster",
                awayTeam: "Munster",
                status: "LIVE · 2nd Half",
                scoreText: "19 – 13",
                isLive: false
            }
        ],
        UFC: [
            {
                homeTeam: "UFC 300",
                awayTeam: "Big Card",
                status: "SAT 7:00 PM",
                scoreText: "",
                isLive: false
            }
        ],
        BOXING: [
            {
                homeTeam: "Anthony Joshua",
                awayTeam: "Big Fight Opponent",
                status: "NEXT · MAIN EVENT",
                scoreText: "",
                isLive: false
            }
        ],
        SUMO: [],
        KABADDI: [],
        headlines: [
            {
                title: "Mariners walk it off in extra innings",
                source: "MLB · Today",
                url: "#"
            },
            {
                title: "Seahawks finalize depth chart ahead of opener",
                source: "NFL · This week",
                url: "#"
            },
            {
                title: "Leinster dominate in statement win",
                source: "Rugby · Today",
                url: "#"
            }
        ],
        highlights: [
            {
                title: "Walk-off home run in Seattle",
                context: "MLB · Mariners",
                url: "#"
            },
            {
                title: "Last-second field goal thriller",
                context: "NFL · General",
                url: "#"
            }
        ]
    };
}

// ===== BACKGROUND ROTATOR (SPORTS-AWARE ENGINE) =====

function initBackgroundRotator() {
    // On first load: set a background immediately
    pickAndApplyBackground();

    // Then rotate every 30 minutes
    setInterval(pickAndApplyBackground, BACKGROUND_ROTATION_INTERVAL);
}

function pickAndApplyBackground() {
    // In a real build, you'd:
    // 1. call Unsplash / sports highlight APIs
    // 2. filter images (no neon, no green fields, no text overlays)
    // 3. prefer big moments, dramatic lighting, mythic energy
    //
    // For now, we just pick from backgroundCandidates.

    if (!backgroundCandidates || backgroundCandidates.length === 0) return;

    const backgroundEl = document.getElementById("background");
    if (!backgroundEl) return;

    const index = Math.floor(Math.random() * backgroundCandidates.length);
    const url = backgroundCandidates[index];
    backgroundEl.style.backgroundImage = `url("${url}")`;
}
