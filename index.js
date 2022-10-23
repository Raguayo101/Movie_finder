const movieSearchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search-btn");
const movieList = document.getElementById("movie-list");
const watchlistBtn = document.getElementById("listBtn");
const responseText = document.getElementById("noResponse");

searchBtn.addEventListener("click", () => {
  let search = movieSearchTerm.value;
  movieList.innerHTML = ``;
  if (search === "") {
    movieList.innerHTML += `
    <figure>
    <h2>Unable to find what you're looking for. Please try another search</h2>
  </figure>
  `;
  } else {
    getData(search);
  }
});

watchlistBtn.addEventListener("click", () => {
  movieList.innerHTML = ``;
  displayFavorites();
});

document.addEventListener("click", (e) => {
  if (e.target.dataset.add) {
    let dataName = document.getElementById(`${e.target.dataset.add}`);
    localStorage.setItem(`${dataName.dataset.name}`, `${e.target.dataset.add}`);
  }
  if (e.target.dataset.remove) {
    let dataRemove = document.getElementById(`${e.target.dataset.remove}`);
    localStorage.removeItem(`${dataRemove.dataset.name}`);
    displayFavorites();
  }
});

async function getData(searchterm) {
  const URL = `http://www.omdbapi.com/?apikey=faa73f23&s=${searchterm}&page=1`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response === "True") {
    displayMovies(data.Search);
  } else {
    movieList.innerHTML += `
    <figure>
    <h2>Unable to find what you're looking for. Please try another search.</h2>
  </figure>
  `;
  }
}

function displayMovies(movies) {
  let movieId = movies.map(
    (el) => `http://www.omdbapi.com/?apikey=faa73f23&i=${el.imdbID}`
  );
  //   console.log(movieId);
  for (let i = 0; i < movieId.length; i++) {
    fetch(movieId[i])
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        movieSearchTerm.value = "";
        movieList.innerHTML += `
        <section class="container">
        <div class="card-img" id='placeholder'>
        <img src=${data.Poster}/>
        </div>
        <div class="movie-title">
          <div class="movie-info" data-name="${data.Title}" id='${data.imdbID}'>
            <h2>${data.Title}</h2>
            <div class="movie-details">
              <p>${data.Runtime}</p>
              <p>${data.Genre}</p>
              <div class="watchlist"> 
                <button
                class='addBtn'><span data-add="${data.imdbID}">+</span></button>
                <p>Watchlist</p>
              </div>
            </div>
          </div>
          <div class="movie-summary">
            <p>
              ${data.Plot}
            </p>
          </div>
        </div>
        </section>
        <hr />
        `;
      });
  }
}

function displayFavorites() {
  let lsArray = Object.values(localStorage);
  let movieId = lsArray.map(
    (el) => `http://www.omdbapi.com/?apikey=faa73f23&i=${el}`
  );
  for (let i = 0; i < movieId.length; i++) {
    fetch(movieId[i])
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        movieSearchTerm.value = "";
        movieList.innerHTML += `
        <section class="container">
        <div class="card-img" id='placeholder'>
        <img src=${data.Poster}/>
        </div>
        <div class="movie-title">
          <div class="movie-info" >
            <h2>${data.Title}</h2>
            <div class="movie-details">
              <p>${data.Runtime}</p>
              <p>${data.Genre}</p>
              <div class="watchlist" data-name="${data.Title}" id='${data.imdbID}'> 
                <button
                class='addBtn'><span data-remove="${data.imdbID}">-</span></button>
                <p>Remove</p>
              </div>
            </div>
          </div>
          <div class="movie-summary">
            <p>
              ${data.Plot}
            </p>
          </div>
        </div>
        </section>
        <hr />
        `;
      });
  }
}
