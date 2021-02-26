const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const movieContainer = document.querySelector(".tempat-movie");
const elementModalBody = document.querySelector(".modal-body");
const elementModalJudul = document.querySelector(".modal-judul");
const elementFooter = document.querySelector("footer");

searchInput.addEventListener("keyup", function (e) {
  e.preventDefault();
  // prevent default agar tidak reload saat button di klik
  if (e.keyCode === 13) {
    searchButton.click();
  }
});
searchButton.addEventListener("click", async () => {
  // async untuk kasih tau js kalau  ada fungsi asynchronous yaitu funsi pd await
  movieContainer.innerHTML = `<h4 class="text-center">Loading cuy...</h4>`;
  try {
    const movies = await fetchMovie(searchInput.value);
    // await untuk tunggu fungsi asynchronousnya dijalankan
    updateUI(movies);
    elementFooter.innerHTML = footer();
  } catch (err) {
    // console.log(err)
    movieContainer.innerHTML = `<h1 class="text-danger">${err}</h1>`;
  }
});
const fetchMovie = (mov) => {
  return (
    fetch("https://www.omdbapi.com/?apikey=ab5e5f27&s=" + mov)
      .finally(() => (movieContainer.innerHTML = ""))
      // finally dijalankan saat setelah selesai fetch
      .then((response) => {
        if (!response.ok) {
          // tanda ! artinya response not ok, response.ok valuenya bisa true / false
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((response) => {
        if (response.Response === "False") {
          throw new Error(response.Error);
        }
        return response.Search;
      })
  );
  // .catch(()=>movieContainer.innerHTML=`<h1 class="text-danger">Gagal memuat !</h1>`)
};
const updateUI = (mS) => {
  const movies = mS;
  let cards = "";
  movies.forEach((m) => (cards += showCards(m)));
  movieContainer.innerHTML += cards;
};

function showCards(m) {
  return `<div class="col col-md-4 my-2 " >
    <div class="card"  >
    <img src=${m.Poster} class="card-img-top"  alt=" ">
    <div class="card-body">
      <h5 class="card-title" >${m.Title}</h5>
      <p class="card-text">Tahun : ${m.Year}</p>
      <a href="#infoDetail" class="btn btn-primary detailBtn " data-toggle="modal" data-target="#infoDetail"  data-idfilm="${m.imdbID}" >Info Detail</a>
    </div>
  </div></div>`;
}
// ketika tombol detail di klik(pake teknik Binding)
document.addEventListener("click", async function (element) {
  try {
    if (element.target.classList.contains("detailBtn")) {
      const idFilm = element.target.dataset.idfilm;
      const fetchDetail = await fetchInfoDetail(idFilm);
      modalDetail(fetchDetail);
    }
  } catch (eror) {
    console.log(eror);
  }
});
const fetchInfoDetail = (idFilm) => {
  return fetch(`https://www.omdbapi.com/?apikey=ab5e5f27&i=${idFilm}`)
    .then((respons) => {
      if (respons.status !== 200) {
        throw new Error(respons.statusText);
      }
      return respons.json();
    })
    .then((d) => {
      if (d.Response === "False") {
        throw new Error(d.Error);
      }
      return d;
    });
  // .catch(elementModalBody.innerHTML=`<h4 class="text-danger">Ada yang error nih !</h4>`)
};
const modalDetail = (d) => {
  elementModalJudul.innerHTML = modalTitle(d);
  elementModalBody.innerHTML = modalBody(d);
  console.log(d);
};

function modalTitle(title) {
  return `<h5 class="modal-title" id="infoDetailLabel">${title.Title} (${title.Year})</h5>`;
}
function modalBody(d) {
  return `<div class="container-fluid">
  <div class="row">
    <div class="col-md-3">
      <img src="${d.Poster}" class="img-fluid" alt=" ">
    </div>
    <div class="col-md">
      <ul class="list-group">
        <li class="list-group-item"><strong>Rating </strong><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="#ffd900" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
      </svg> ${d.Ratings[0].Value}</li>
        <li class="list-group-item"><strong>Genre : </strong>${d.Genre}</li>
        <li class="list-group-item"><strong>Director : </strong>${d.Director}</li>
        <li class="list-group-item"><strong>Actor : </strong>${d.Actors}</li>
        <li class="list-group-item"><strong>Writer : </strong>${d.Writer}</li>
        <li class="list-group-item"><strong>Plot : </strong>${d.Plot}</li>
      </ul>
    </div>
  </div>
</div>`;
}

const footer = () => {
  return `
  <div
  class="bg-dark mx-auto"
  style="
  font-size:10px;
  width: 100%;
  padding: 5px 0 5px 0;
  bottom: 0;">
  <div class="container text-white-50"
  style="max-width: 400px; ">
    Source :  <a href="http://www.omdbapi.com/" class="text-white-50">omdbapi.com</a>
    <br>
    Icons : <a href="https://www.flaticon.com/authors/icongeek26" title="Icongeek26" class="text-white-50">Icongeek26</a> from <a href="https://www.flaticon.com/" title="Flaticon" class="text-white-50">www.flaticon.com</a>
  </div>
  </div>
  `;
};
