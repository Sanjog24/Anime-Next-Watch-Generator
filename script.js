const state = {
  searchTerm: "",
  selectedGenre: "all",
  selectedSort: "default",
  animeList: [],
  favorites: JSON.parse(localStorage.getItem("anime-favorites")) || [],
  currentLabel: "popular anime",
  theme: localStorage.getItem("anime-theme") || "dark",
};

const elements = {
  form: document.querySelector("#controls-form"),
  searchInput: document.querySelector("#search-input"),
  genreSelect: document.querySelector("#genre-select"),
  sortSelect: document.querySelector("#sort-select"),
  loadPopularButton: document.querySelector("#load-popular-button"),
  statusText: document.querySelector("#status-text"),
  resultsGrid: document.querySelector("#results-grid"),
  favoritesCount: document.querySelector("#favorites-count"),
  themeToggle: document.querySelector("#theme-toggle"),
};

const updateState = () => {
  state.searchTerm = elements.searchInput.value.trim().toLowerCase();
  state.selectedGenre = elements.genreSelect.value;
  state.selectedSort = elements.sortSelect.value;
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const saveFavorites = () => {
  localStorage.setItem("anime-favorites", JSON.stringify(state.favorites));
  elements.favoritesCount.textContent = String(state.favorites.length);
};

const applyTheme = () => {
  document.body.dataset.theme = state.theme;
  elements.themeToggle.textContent = state.theme === "dark" ? "Light Mode" : "Dark Mode";
  localStorage.setItem("anime-theme", state.theme);
};

const updateGenreOptions = () => {
  const genres = state.animeList
    .flatMap((anime) => anime.genres || [])
    .map((genre) => genre.name)
    .filter((genre, index, allGenres) => allGenres.indexOf(genre) === index)
    .sort((firstGenre, secondGenre) => firstGenre.localeCompare(secondGenre));

  elements.genreSelect.innerHTML = ['<option value="all">All genres</option>']
    .concat(genres.map((genre) => `<option value="${escapeHtml(genre)}">${escapeHtml(genre)}</option>`))
    .join("");

  if (!genres.includes(state.selectedGenre)) {
    state.selectedGenre = "all";
    elements.genreSelect.value = "all";
  } else {
    elements.genreSelect.value = state.selectedGenre;
  }
};

const getProcessedAnime = () =>
  state.animeList
    .filter((anime) => {
      if (!state.searchTerm) {
        return true;
      }

      return (anime.title || "").toLowerCase().includes(state.searchTerm);
    })
    .filter((anime) => {
      if (state.selectedGenre === "all") {
        return true;
      }

      return (anime.genres || []).some((genre) => genre.name === state.selectedGenre);
    })
    .sort((firstAnime, secondAnime) => {
      if (state.selectedSort === "title-asc") {
        return (firstAnime.title || "").localeCompare(secondAnime.title || "");
      }

      if (state.selectedSort === "score-desc") {
        return (secondAnime.score || 0) - (firstAnime.score || 0);
      }

      if (state.selectedSort === "episodes-desc") {
        return (secondAnime.episodes || 0) - (firstAnime.episodes || 0);
      }

      return 0;
    });

const createCardMarkup = (anime) => {
  const title = anime.title || "Untitled Anime";
  const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "";
  const score = anime.score ? `Score: ${anime.score}` : "Score: N/A";
  const type = anime.type || "Unknown format";
  const episodes = anime.episodes ? `${anime.episodes} episodes` : "Episodes unknown";
  const synopsis = anime.synopsis
    ? `${anime.synopsis.slice(0, 140)}${anime.synopsis.length > 140 ? "..." : ""}`
    : "No synopsis available yet.";
  const genreText = (anime.genres || []).slice(0, 2).map((genre) => genre.name).join(", ") || "Genre not listed";
  const safeTitle = escapeHtml(title);
  const safeSynopsis = escapeHtml(synopsis);
  const safeScore = escapeHtml(score);
  const safeType = escapeHtml(type);
  const safeEpisodes = escapeHtml(episodes);
  const safeGenreText = escapeHtml(genreText);
  const safeUrl = anime.url || "#";
  const isFavorite = state.favorites.includes(anime.mal_id);
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
        <p class="genre-label">${safeGenreText}</p>
        <p>${safeSynopsis}</p>
        <div class="card-actions">
          <button class="favorite-button ${isFavorite ? "active" : ""}" data-id="${anime.mal_id}" type="button">
            ${isFavorite ? "Favorited" : "Add Favorite"}
          </button>
          <a class="anime-link" href="${safeUrl}" target="_blank" rel="noreferrer">
            View More
          </a>
        </div>
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
      <p>${escapeHtml(message)}</p>
    </article>
  `;
  elements.statusText.textContent = "Something went wrong while fetching anime data.";
};

const renderEmptyState = () => {
  elements.resultsGrid.innerHTML = `
    <article class="anime-card placeholder-card">
      <div class="placeholder-badge">No Results</div>
      <h3>No anime matched these controls</h3>
      <p>Try another title, choose a different genre, or reset to popular anime.</p>
    </article>
  `;
  elements.statusText.textContent = "No anime matched the current search, filter, and sort settings.";
};

const renderAnimeList = () => {
  const processedAnime = getProcessedAnime();

  if (!processedAnime.length) {
    renderEmptyState();
    return;
  }

  elements.resultsGrid.innerHTML = processedAnime.map(createCardMarkup).join("");
  elements.statusText.textContent =
    `Showing ${processedAnime.length} anime from ${state.currentLabel}.`;
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
    state.currentLabel = label;
    updateGenreOptions();
    renderAnimeList();
  } catch (error) {
    renderErrorState(error.message);
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const rawSearch = elements.searchInput.value.trim();
  updateState();

  if (!rawSearch) {
    fetchAnime("https://api.jikan.moe/v4/top/anime?limit=18", "popular anime");
    return;
  }

  const query = encodeURIComponent(rawSearch);
  fetchAnime(`https://api.jikan.moe/v4/anime?q=${query}&limit=18`, `"${rawSearch}" results`);
};

const handlePopularClick = () => {
  elements.searchInput.value = "";
  state.searchTerm = "";
  state.selectedGenre = "all";
  state.selectedSort = "default";
  elements.sortSelect.value = "default";
  fetchAnime("https://api.jikan.moe/v4/top/anime?limit=18", "popular anime");
};

const handleControlsChange = () => {
  updateState();
  renderAnimeList();
};

const handleResultsClick = (event) => {
  const favoriteButton = event.target.closest(".favorite-button");

  if (!favoriteButton) {
    return;
  }

  const animeId = Number(favoriteButton.dataset.id);
  const alreadyFavorite = state.favorites.includes(animeId);

  state.favorites = alreadyFavorite
    ? state.favorites.filter((id) => id !== animeId)
    : state.favorites.concat(animeId);

  saveFavorites();
  renderAnimeList();
};

const handleThemeToggle = () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme();
};

const init = () => {
  saveFavorites();
  applyTheme();
  elements.form.addEventListener("submit", handleSubmit);
  elements.searchInput.addEventListener("input", handleControlsChange);
  elements.genreSelect.addEventListener("change", handleControlsChange);
  elements.sortSelect.addEventListener("change", handleControlsChange);
  elements.loadPopularButton.addEventListener("click", handlePopularClick);
  elements.resultsGrid.addEventListener("click", handleResultsClick);
  elements.themeToggle.addEventListener("click", handleThemeToggle);
  fetchAnime("https://api.jikan.moe/v4/top/anime?limit=18", "popular anime");
};

init();
