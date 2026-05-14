let resultsGrid;
let searchInput;
let searchTypeSelect;
let errorMsg;

window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {

    resultsGrid = document.getElementById('results-grid');
    searchInput = document.getElementById('search-input');
    searchTypeSelect = document.getElementById('search-type');
    errorMsg = document.getElementById('form-error');

    // Prevent the form from reloading the page on click or Enter
    searchButton.addEventListener("click", function(event) {
        event.preventDefault();
        checkEntry();
    });

    searchInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            checkEntry();
        }
    });

    // Auto-run on page load if URL already has search params
    // (handles arriving from a category card or the homepage form)
    const params = new URLSearchParams(window.location.search);
    if (params.has('q')) {
        buildSearch();
    }

}

function checkEntry() {

    if (searchInput.value.trim() === "") {
        errorMsg.textContent = 'Please enter a search term before searching.';

    } else {
        errorMsg.textContent = '';
        buildSearch();
    }
}

function buildSearch() {
    const params = new URLSearchParams(window.location.search);

    let term = '';
    let type = 'ingredient';

    if (params.has('q') && searchInput.value.trim() === '') {
        // Arrived from the homepage search form or category card — input is still empty
        term = params.get('q').trim();
        type = params.get('type') || 'ingredient';

        // Pre-fill the form so the user can see what was searched
        searchInput.value      = term;
        searchTypeSelect.value = type;

    } else {
        // User typed directly into the search form on this page
        term = searchInput.value.trim();
        type = searchTypeSelect.value;
    }

    // Nothing to search — leave the results area empty and wait
    if (term === '') return;

    history.replaceState(null, '', 'search.php?q=' + term + '&type=' + type);
    
    fetchResults(term, type);
}

async function fetchResults(term, type) {

    // Show a loading message while the fetch is in flight
    resultsGrid.innerHTML = '<p class="loading-msg">Loading…</p>';

    let fetchURL = 'server/servSearch.php?q=' + term + '&type=' + type;
    let response = await fetch(fetchURL);
    let data     = await response.json();

    // No matches found
    if (!data.meals || data.meals.length === 0) {
        resultsGrid.innerHTML = '<p class="no-results">No recipes found for <strong>' + term + '</strong>. Try a different search.</p>';
        return;
    }

    loadResults(data);

}

function loadResults(data) {

    try {
        resultsGrid.innerHTML = '';

        // Build one result card per meal
        data.meals.forEach(function(meal) {
            const card = document.createElement('a');
            card.href      = 'recipe.php?id=' + encodeURIComponent(meal.idMeal);
            card.className = 'result-card';

            const img = document.createElement('img');
            img.src = meal.strMealThumb;
            img.alt = meal.strMeal;

            const name = document.createElement('span');
            name.textContent = meal.strMeal;

            card.appendChild(img);
            card.appendChild(name);
            resultsGrid.appendChild(card);
        });

    } catch (error) {
        resultsGrid.innerHTML = '<p class="load-error">Something went wrong. Please try again.</p>';
    }
}
