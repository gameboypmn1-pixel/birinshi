const currencyData = {
  USD: { name: "US Dollar", flag: "🇺🇸", rate: 1 },
  EUR: { name: "Euro", flag: "🇪🇺", rate: 0.92 },
  UZS: { name: "Uzbek Som", flag: "🇺🇿", rate: 12650 },
  RUB: { name: "Russian Ruble", flag: "🇷🇺", rate: 91.2 },
  KZT: { name: "Kazakh Tenge", flag: "🇰🇿", rate: 497.3 },
  GBP: { name: "British Pound", flag: "🇬🇧", rate: 0.79 },
  JPY: { name: "Japanese Yen", flag: "🇯🇵", rate: 149.5 },
  CNY: { name: "Chinese Yuan", flag: "🇨🇳", rate: 7.24 },
  TRY: { name: "Turkish Lira", flag: "🇹🇷", rate: 32.1 },
  AED: { name: "UAE Dirham", flag: "🇦🇪", rate: 3.67 },
  KRW: { name: "South Korean Won", flag: "🇰🇷", rate: 1338.7 }
};

const rateChanges = {
  USD: 0.12,
  EUR: -0.18,
  UZS: 0.04,
  RUB: -0.52,
  KZT: 0.15,
  GBP: 0.09,
  JPY: -0.21,
  CNY: 0.11,
  TRY: -0.34,
  AED: 0.02,
  KRW: 0.26
};

const translations = {
  en: {
    heroTitle: "Anime Currency Dashboard",
    heroSubtitle: "Premium dark exchange platform with live-style rates, fast conversion, analytics, favorites, and history.",
    startBtn: "Start Converting",
    loginTitle: "Login",
    registerTitle: "Register",
    loginBtn: "Login",
    registerBtn: "Create Account",
    converterTitle: "Currency Converter",
    amountLabel: "Amount",
    fromLabel: "From",
    toLabel: "To",
    favoritesTitle: "Favorites",
    historyTitle: "History",
    ratesTitle: "Exchange Rates Dashboard",
    popularTitle: "Popular Conversions",
    analyticsTitle: "Mini Analytics",
    faqTitle: "FAQ"
  },
  uz: {
    heroTitle: "Anime Valyuta Paneli",
    heroSubtitle: "Premium dark exchange platforma: tez konvertatsiya, analytics, favorites va history bilan.",
    startBtn: "Boshlash",
    loginTitle: "Kirish",
    registerTitle: "Ro‘yxatdan o‘tish",
    loginBtn: "Kirish",
    registerBtn: "Account yaratish",
    converterTitle: "Valyuta Kalkulyatori",
    amountLabel: "Miqdor",
    fromLabel: "Dan",
    toLabel: "Ga",
    favoritesTitle: "Sevimlilar",
    historyTitle: "Tarix",
    ratesTitle: "Valyuta Kurslari",
    popularTitle: "Mashhur Almashtirishlar",
    analyticsTitle: "Mini Analitika",
    faqTitle: "Savollar"
  },
  ru: {
    heroTitle: "Аниме Валютная Панель",
    heroSubtitle: "Премиум платформа с тёмным дизайном, быстрым обменом, аналитикой, избранным и историей.",
    startBtn: "Начать",
    loginTitle: "Вход",
    registerTitle: "Регистрация",
    loginBtn: "Войти",
    registerBtn: "Создать аккаунт",
    converterTitle: "Конвертер валют",
    amountLabel: "Сумма",
    fromLabel: "Из",
    toLabel: "В",
    favoritesTitle: "Избранное",
    historyTitle: "История",
    ratesTitle: "Курсы валют",
    popularTitle: "Популярные конверсии",
    analyticsTitle: "Мини аналитика",
    faqTitle: "FAQ"
  }
};

const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const resultText = document.getElementById("resultText");
const swapBtn = document.getElementById("swapBtn");
const convertBtn = document.getElementById("convertBtn");
const copyBtn = document.getElementById("copyBtn");
const resetBtn = document.getElementById("resetBtn");
const ratesGrid = document.getElementById("ratesGrid");
const popularGrid = document.getElementById("popularGrid");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const favoritesList = document.getElementById("favoritesList");
const searchResults = document.getElementById("searchResults");
const currencySearch = document.getElementById("currencySearch");
const lastUpdated = document.getElementById("lastUpdated");
const toast = document.getElementById("toast");
const languageSelect = document.getElementById("languageSelect");
const themeToggle = document.getElementById("themeToggle");
const proModeToggle = document.getElementById("proModeToggle");
const soundToggle = document.getElementById("soundToggle");
const loader = document.getElementById("loader");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authSection = document.getElementById("authSection");
const dashboardContent = document.getElementById("dashboardContent");
const logoutBtn = document.getElementById("logoutBtn");
const appContainer = document.getElementById("appContainer");
const footer = document.getElementById("footer");

let soundEnabled = false;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  if (soundEnabled) playBeep();
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function playBeep() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 660;
  gainNode.gain.value = 0.03;

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.12);
}

function formatNumber(num) {
  return new Intl.NumberFormat().format(Number(num.toFixed(2)));
}

function populateCurrencies() {
  const entries = Object.entries(currencyData);
  fromCurrency.innerHTML = "";
  toCurrency.innerHTML = "";

  entries.forEach(([code, info]) => {
    const option1 = document.createElement("option");
    option1.value = code;
    option1.textContent = `${info.flag} ${code} - ${info.name}`;

    const option2 = document.createElement("option");
    option2.value = code;
    option2.textContent = `${info.flag} ${code} - ${info.name}`;

    fromCurrency.appendChild(option1);
    toCurrency.appendChild(option2);
  });

  fromCurrency.value = "USD";
  toCurrency.value = "UZS";
}

function convertCurrency(save = true) {
  const amount = parseFloat(amountInput.value) || 0;
  const from = fromCurrency.value;
  const to = toCurrency.value;

  const usdAmount = amount / currencyData[from].rate;
  const converted = usdAmount * currencyData[to].rate;

  resultText.textContent = `${formatNumber(amount)} ${from} = ${formatNumber(converted)} ${to}`;

  if (save) saveHistory(`${formatNumber(amount)} ${from} → ${formatNumber(converted)} ${to}`);
}

function saveHistory(entry) {
  let history = JSON.parse(localStorage.getItem("akai_history")) || [];
  history.unshift(entry);
  history = history.slice(0, 8);
  localStorage.setItem("akai_history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("akai_history")) || [];
  historyList.innerHTML = history.length
    ? history.map(item => `<div class="history-item">${item}</div>`).join("")
    : `<div class="history-item">No history yet</div>`;
}

function renderRates() {
  ratesGrid.classList.remove("skeleton");
  ratesGrid.innerHTML = Object.entries(currencyData)
    .map(([code, info]) => {
      const change = rateChanges[code] || 0;
      const changeClass = change >= 0 ? "up" : "down";
      const sign = change >= 0 ? "+" : "";
      return `
        <div class="rate-card">
          <span>${info.flag} ${code}</span>
          <strong>${formatNumber(info.rate)}</strong>
          <small>${info.name}</small>
          <p class="${changeClass}">${sign}${change.toFixed(2)}%</p>
        </div>
      `;
    })
    .join("");
}

function renderPopular() {
  const popularPairs = [
    ["USD", "UZS"],
    ["RUB", "UZS"],
    ["EUR", "UZS"],
    ["USD", "RUB"],
    ["EUR", "RUB"],
    ["UZS", "USD"]
  ];

  popularGrid.innerHTML = popularPairs
    .map(([from, to]) => `
      <div class="popular-card" data-from="${from}" data-to="${to}">
        <span>${currencyData[from].flag} ${from} → ${currencyData[to].flag} ${to}</span>
        <strong>Quick Convert</strong>
        <small>Tap to auto-fill</small>
      </div>
    `)
    .join("");

  document.querySelectorAll(".popular-card").forEach(card => {
    card.addEventListener("click", () => {
      fromCurrency.value = card.dataset.from;
      toCurrency.value = card.dataset.to;
      convertCurrency(false);
      drawChart(card.dataset.to);
      showToast("Popular pair selected");
    });
  });
}

function renderFavorites() {
  const favorites = JSON.parse(localStorage.getItem("akai_favorites")) || [];
  favoritesList.innerHTML = favorites.length
    ? favorites.map(code => `<div class="tag">${currencyData[code].flag} ${code}</div>`).join("")
    : `<div class="tag">No favorites</div>`;
}

function addFavorite(code) {
  let favorites = JSON.parse(localStorage.getItem("akai_favorites")) || [];
  if (!favorites.includes(code)) {
    favorites.push(code);
    localStorage.setItem("akai_favorites", JSON.stringify(favorites));
    renderFavorites();
    showToast(`${code} added to favorites`);
  }
}

function searchCurrencies(query) {
  const lower = query.toLowerCase();
  const matched = Object.entries(currencyData).filter(([code, info]) =>
    code.toLowerCase().includes(lower) || info.name.toLowerCase().includes(lower)
  );

  searchResults.innerHTML = matched.length
    ? matched.map(([code, info]) => `
      <div class="search-item" data-code="${code}">
        ${info.flag} ${code} - ${info.name}
      </div>
    `).join("")
    : "";

  document.querySelectorAll(".search-item").forEach(item => {
    item.addEventListener("click", () => {
      addFavorite(item.dataset.code);
    });
  });
}

function drawChart(currencyCode = "UZS") {
  const canvas = document.getElementById("trendChart");
  const ctx = canvas.getContext("2d");

  const data = Array.from({ length: 12 }, () =>
    Math.random() * 40 + currencyData[currencyCode].rate * 0.9
  );

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#ff0033";
  ctx.lineWidth = 3;
  ctx.beginPath();

  const padding = 40;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;

  const min = Math.min(...data);
  const max = Math.max(...data);

  data.forEach((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + ((max - value) / (max - min || 1)) * chartHeight;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();

  ctx.fillStyle = "rgba(255, 0, 51, 0.12)";
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.closePath();
  ctx.fill();
}

function updateLastUpdated() {
  const now = new Date();
  lastUpdated.textContent = `Last updated: ${now.toLocaleString()}`;
}

function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;

  document.getElementById("heroTitle").textContent = t.heroTitle;
  document.getElementById("heroSubtitle").textContent = t.heroSubtitle;
  document.getElementById("startBtn").textContent = t.startBtn;
  document.getElementById("loginTitle").textContent = t.loginTitle;
  document.getElementById("registerTitle").textContent = t.registerTitle;
  document.getElementById("loginBtn").textContent = t.loginBtn;
  document.getElementById("registerBtn").textContent = t.registerBtn;
  document.getElementById("converterTitle").textContent = t.converterTitle;
  document.getElementById("amountLabel").textContent = t.amountLabel;
  document.getElementById("fromLabel").textContent = t.fromLabel;
  document.getElementById("toLabel").textContent = t.toLabel;
  document.getElementById("favoritesTitle").textContent = t.favoritesTitle;
  document.getElementById("historyTitle").textContent = t.historyTitle;
  document.getElementById("ratesTitle").textContent = t.ratesTitle;
  document.getElementById("popularTitle").textContent = t.popularTitle;
  document.getElementById("analyticsTitle").textContent = t.analyticsTitle;
  document.getElementById("faqTitle").textContent = t.faqTitle;
}

function initTheme() {
  const theme = localStorage.getItem("akai_theme");
  const proMode = localStorage.getItem("akai_pro_mode");

  if (theme === "light") document.body.classList.add("light-mode");
  if (proMode === "on") document.body.classList.add("pro-mode");
}

function setupFAQ() {
  document.querySelectorAll(".faq-item").forEach(item => {
    const btn = item.querySelector(".faq-question");
    btn.addEventListener("click", () => {
      item.classList.toggle("active");
    });
  });
}

function registerUser(username, password) {
  const users = JSON.parse(localStorage.getItem("akai_users")) || [];
  const exists = users.find(user => user.username === username);
  if (exists) {
    showToast("User already exists");
    return;
  }
  users.push({ username, password });
  localStorage.setItem("akai_users", JSON.stringify(users));
  showToast("Account created");
}

function loginUser(username, password) {
  const users = JSON.parse(localStorage.getItem("akai_users")) || [];
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    showToast("Invalid login");
    return false;
  }
  localStorage.setItem("akai_logged_in", username);
  showDashboard();
  showToast(`Welcome ${username}`);
  return true;
}

function showDashboard() {
  authSection.classList.add("hidden");
  dashboardContent.classList.remove("hidden");
  logoutBtn.classList.remove("hidden");
  footer.classList.remove("hidden");
}

function logoutUser() {
  localStorage.removeItem("akai_logged_in");
  dashboardContent.classList.add("hidden");
  authSection.classList.remove("hidden");
  logoutBtn.classList.add("hidden");
  footer.classList.add("hidden");
  showToast("Logged out");
}

function checkSession() {
  const loggedIn = localStorage.getItem("akai_logged_in");
  if (loggedIn) showDashboard();
}

swapBtn.addEventListener("click", () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  convertCurrency(false);
  drawChart(toCurrency.value);
  showToast("Currencies swapped");
});

convertBtn.addEventListener("click", () => {
  convertCurrency(true);
  drawChart(toCurrency.value);
  showToast("Conversion complete");
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(resultText.textContent);
    showToast("Copied");
  } catch {
    showToast("Copy failed");
  }
});

resetBtn.addEventListener("click", () => {
  amountInput.value = 1;
  fromCurrency.value = "USD";
  toCurrency.value = "UZS";
  convertCurrency(false);
  drawChart("UZS");
  showToast("Reset complete");
});

clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem("akai_history");
  renderHistory();
  showToast("History cleared");
});

currencySearch.addEventListener("input", (e) => {
  searchCurrencies(e.target.value.trim());
});

languageSelect.addEventListener("change", (e) => {
  applyTranslations(e.target.value);
  showToast("Language changed");
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const current = document.body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem("akai_theme", current);
  showToast(`Theme: ${current}`);
});

proModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("pro-mode");
  const current = document.body.classList.contains("pro-mode") ? "on" : "off";
  localStorage.setItem("akai_pro_mode", current);
  showToast(`Pro Mode: ${current}`);
});

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = `Sound: ${soundEnabled ? "On" : "Off"}`;
  showToast(`Sound ${soundEnabled ? "enabled" : "disabled"}`);
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();

  if (username.length < 3 || password.length < 3) {
    showToast("Min 3 characters");
    return;
  }

  registerUser(username, password);
  registerForm.reset();
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  loginUser(username, password);
  loginForm.reset();
});

logoutBtn.addEventListener("click", logoutUser);

window.addEventListener("load", () => {
  populateCurrencies();
  renderRates();
  renderPopular();
  renderFavorites();
  renderHistory();
  drawChart("UZS");
  updateLastUpdated();
  applyTranslations("en");
  initTheme();
  setupFAQ();
  checkSession();

  setTimeout(() => {
    loader.style.display = "none";
    appContainer.classList.remove("hidden");
  }, 1400);
});