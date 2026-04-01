const state = {
  searchTerm: "",
  animeList: [],
};

const elements = {
  form: document.querySelector("#controls-form"),
  searchInput: document.querySelector("#search-input"),
  loadPopularButton: document.querySelector("#load-popular-button"),
  statusText: document.querySelector("#status-text"),
  resultsGrid: document.querySelector("#results-grid"),
};

const updateState = () => {
  state.searchTerm = elements.searchInput.value.trim();
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const createCardMarkup = (anime) => {
  const title = anime.title || "Untitled Anime";
  const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "";
  const score = anime.score ? `Score: ${anime.score}` : "Score: N/A";
  const type = anime.type || "Unknown format";
  const episodes = anime.episodes ? `${anime.episodes} episodes` : "Episodes unknown";
  const synopsis = anime.synopsis
    ? `${anime.synopsis.slice(0, 140)}${anime.synopsis.length > 140 ? "..." : ""}`
    : "No synopsis available yet.";
  const safeTitle = escapeHtml(title);
  const safeSynopsis = escapeHtml(synopsis);
  const safeScore = escapeHtml(score);
  const safeType = escapeHtml(type);
  const safeEpisodes = escapeHtml(episodes);
  const safeUrl = anime.url || "#";
  const imageMarkup = image
    ? `<img src="${image}" alt="${safeTitle} poster" />`
    : `<div class="image-placeholder">No image available</div>`;

  return `
    <article class="anime-card">
      ${imageMarkup}
      <div class="anime-card-content">
        <h3>${safeTitle}</h3>
        <div class="anime-meta">
          <span>${safeScore}</span>
          <span>${safeType}</span>
          <span>${safeEpisodes}</span>
        </div>
        <p>${safeSynopsis}</p>
        <a class="anime-link" href="${safeUrl}" target="_blank" rel="noreferrer">
          View on MyAnimeList
        </a>
      </div>
    </article>
  `;
};

const renderLoadingState = () => {
  const loadingCards = Array.from({ length: 6 }, () => `
    <article class="anime-card placeholder-card loading-card">
      <div class="placeholder-badge">Loading</div>
      <div class="loading-line short"></div>
      <div class="loading-line"></div>
      <div class="loading-line medium"></div>
      <div class="loading-line"></div>
    </article>
  `).join("");

  elements.resultsGrid.innerHTML = loadingCards;
  elements.statusText.textContent = "Loading anime recommendations...";
};

const renderErrorState = (message) => {
  elements.resultsGrid.innerHTML = `
    <article class="anime-card placeholder-card">
      <div class="placeholder-badge">Error</div>
      <h3>Unable to load anime right now</h3>
      <p>${message}</p>
    </article>
  `;
  elements.statusText.textContent = "Something went wrong while fetching anime data.";
};

const renderEmptyState = () => {
  elements.resultsGrid.innerHTML = `
    <article class="anime-card placeholder-card">
      <div class="placeholder-badge">No Results</div>
      <h3>No anime matched your search</h3>
      <p>Try another title or load the popular anime list instead.</p>
    </article>
  `;
  elements.statusText.textContent = "No anime were found for that search.";
};

const renderAnimeList = (animeList, label) => {
  if (!animeList.length) {
    renderEmptyState();
    return;
  }

  elements.resultsGrid.innerHTML = animeList.map(createCardMarkup).join("");
  elements.statusText.textContent = `Showing ${animeList.length} anime for ${label}.`;
};

const fetchAnime = async (endpoint, label) => {
  renderLoadingState();

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("The API request failed. Please try again in a moment.");
    }

    const result = await response.json();
    state.animeList = result.data || [];
    renderAnimeList(state.animeList, label);
  } catch (error) {
    renderErrorState(error.message);
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  updateState();

  if (!state.searchTerm) {
    fetchAnime("https://api.jikan.moe/v4/top/anime?limit=12", "popular anime");
    return;
  }

  const query = encodeURIComponent(state.searchTerm);
  fetchAnime(`https://api.jikan.moe/v4/anime?q=${query}&limit=12`, `"${state.searchTerm}"`);
};

const handlePopularClick = () => {
  elements.searchInput.value = "";
  state.searchTerm = "";
  fetchAnime("https://api.jikan.moe/v4/top/anime?limit=12", "popular anime");
};

const init = () => {
  elements.form.addEventListener("submit", handleSubmit);
  elements.loadPopularButton.addEventListener("click", handlePopularClick);
  fetchAnime("https://api.jikan.moe/v4/top/anime?limit=12", "popular anime");
};

init();
