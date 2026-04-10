# Anime Next Watch Generator

## Project Overview

**Anime Next Watch Generator** is a web application designed to help users quickly decide what anime to watch next. With thousands of anime available, users often face decision fatigue. This project solves that problem by providing smart, quick, and engaging anime recommendations.

The final version includes a responsive frontend, live anime data from the Jikan API, and interactive features such as search, filtering, sorting, favorites, and theme switching.

---

## Purpose

The goal of this project is to:

* Help users discover new anime easily
* Reduce time spent searching for what to watch
* Provide a clean and interactive recommendation experience
* Build a strong base for future features like filtering and sorting

---

## API Used

The project uses:

* **Jikan API (MyAnimeList unofficial API)**
   https://api.jikan.moe/

### Why this API?

* Free and publicly accessible
* Large anime database
* Provides detailed information like:

  * Title
  * Genre
  * Rating
  * Episodes
  * Synopsis
  * Images


## Features

* Search anime by title
* Load popular anime from the API
* Display anime cards dynamically
* Show loading and error states
* Responsive layout for mobile, tablet, and desktop
* Filter anime by genre
* Sort anime by title, score, or episodes
* Save favorites using local storage
* Toggle between dark mode and light mode

---

##  Technologies Used

* **Frontend:**

  * HTML
  * CSS
  * JavaScript


* **API Handling:**

  * Fetch API (async/await)

* **Deployment:**

  * Ready to deploy on Netlify or Vercel

---

## ⚙️ How the Project Will Work

1. User opens the website
2. User searches for an anime title or loads popular anime
3. Application sends a request to the Jikan API using `fetch`
4. API returns data in JSON format
5. Data is displayed dynamically as anime cards on the page

---

## 📂 Project Structure

```bash
Anime-Next-Watch-Generator/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## ▶️ How to Run Locally

1. Clone or download the repository
2. Open the project folder
3. Open `index.html` in your browser

No build tools or package installation are required for this version because the project uses plain HTML, CSS, and JavaScript.


## Code Highlights

* Search, filtering, and sorting are handled with array higher-order functions such as `filter()`, `some()`, `map()`, and `sort()`
* Favorites and theme selection are stored using browser local storage
* The UI is responsive across mobile, tablet, and desktop layouts
* The project uses modular JavaScript functions for fetching data, processing results, and rendering cards

## Deployment

This project can be deployed on platforms such as Netlify or Vercel by uploading the repository and setting the publish directory to the project root.

---

## Future Improvements

This project can be extended into:

* More detailed anime recommendation logic
* A full watchlist page
* User accounts and cloud storage

---

##  Contribution

This is an academic project, but suggestions and improvements are welcome.
