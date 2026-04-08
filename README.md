# Anime Next Watch Generator

## Project Overview

**Anime Next Watch Generator** is a web application designed to help users quickly decide what anime to watch next. With thousands of anime available, users often face decision fatigue. This project solves that problem by providing smart, quick, and engaging anime recommendations.

The project now includes a basic frontend interface and Milestone 2 API integration using live anime data.

---

## Purpose

The goal of this project is to:

* Help users discover new anime easily
* Reduce time spent searching for what to watch
* Provide a clean and interactive recommendation experience
* Build a strong base for future features like filtering and sorting

---

## API Used

The project will use an external Anime API such as:

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


### Current Features

* Search anime by title
* Load popular anime from the API
* Display anime cards dynamically
* Show loading and error states
* Responsive layout for mobile, tablet, and desktop
* Filter anime by genre
* Sort anime by title, score, or episodes
* Save favorites using local storage
* Toggle between dark mode and light mode

### Planned Next Features

* Generate more suggestions instantly
* Add more detailed recommendation logic
* Improve watchlist features

---

##  Technologies Used

* **Frontend:**

  * HTML
  * CSS
  * JavaScript


* **API Handling:**

  * Fetch API (async/await)

* **Deployment:**

  * Netlify / Vercel

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

## ▶️ How to Run

1. Clone or download the repository
2. Open the project folder
3. Open `index.html` in your browser

No build tools or package installation are required for this version because the project uses plain HTML, CSS, and JavaScript.


##  Project Status

 **Currently in Milestone 3 Phase**

* Project idea finalized
* API selected
* Basic frontend files created
* Live API integration completed
* Dynamic data display added
* Loading and error handling included
* Search, filter, and sorting added using array higher-order functions
* Favorite button interactions added
* Dark mode and light mode toggle added

---

## Future Scope

This project can be extended into:

* A full anime recommendation system
* A personalized dashboard using user preferences
* Integration with user login and cloud storage

---

##  Contribution

This is an academic project, but suggestions and improvements are welcome.
