import './css/style.css';

const API_KEY = '8d597952'; // Заміни на свій ключ API
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');

let debounceTimeout = null;
let currentPage = 1;

async function fetchMovies(query, page = 1) {
    if (!query) {
        resultsContainer.innerHTML = '';
        return;
    }

    try {
        const response = await fetch(`${API_URL}&s=${query}&page=${page}`);
        const data = await response.json();

        if (data.Response === 'True') {
            displayMovies(data.Search);
            updatePagination(data.totalResults);
        } else {
            resultsContainer.innerHTML = `Нічого не знайдено.`;
        }
    } catch (error) {
        console.error('Помилка отримання даних:', error);
        resultsContainer.innerHTML = `Помилка отримання даних. Будь ласка, спробуйте пізніше.`;
    }
}

function updatePagination(totalResults) {
    const totalPages = Math.ceil(totalResults / 10);
    document.getElementById('current-page').textContent = `Сторінка ${currentPage} з ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

function displayMovies(movies) {
    const movieHTML = movies.map(movie => `
        <div class="movie">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://commons.wikimedia.org/wiki/File:No_Image_Available.jpg'}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>Рік: ${movie.Year}</p>
            <p>Тип: ${movie.Type}</p>
        </div>
    `).join('');

    resultsContainer.innerHTML = movieHTML;
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchMovies(searchInput.value.trim(), currentPage);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    fetchMovies(searchInput.value.trim(), currentPage);
});

searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimeout);
    const query = e.target.value.trim();

    if (query.length > 4) {
        debounceTimeout = setTimeout(() => {
            currentPage = 1;
            fetchMovies(query, currentPage);
        }, 2000);
    }
});

// const img = document.createElement('img');
// img.src = logo;
// document.body.appendChild(img);

// const text = document.createElement('div');
// text.className = 'custom-font';
// text.innerText = 'Текст із локальним шрифтом';
// document.body.appendChild(text);