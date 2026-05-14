let grid;
let searchInputHome;
let errorMsgHome;


window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {

    grid = document.getElementById('category-grid');
    searchInputHome = document.getElementById('search-input-home');
    errorMsgHome = document.getElementById('form-error-home');

    searchButtonHome.addEventListener("click", function(event) {
        checkEntryHome();
    });

    searchInputHome.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            checkEntryHome();
        }
    });

    fetchCategories();
}

function checkEntryHome () {

    if (searchInputHome.value.trim() === "") {
        event.preventDefault();
        errorMsgHome.textContent = 'Please enter a search term before searching.';

    } else {
        errorMsgHome.textContent = '';
    }
};

// Fetch all MealDB categories from the server
async function fetchCategories() {

    grid.innerHTML = '<p class="loading-msg">Loading categories…</p>';

    let fetchURL = `server/get_categories.php`;
    let response = await fetch (fetchURL);
    let data = await response.json();

    loadCategories(data);

}

// Build and inject a grid of clickable image + name cards into #category-grid.
function loadCategories(data) {    

    try {

        // Clear the loading message
        grid.innerHTML = '';

        // Build one card per category and append it to the grid
        data.categories.forEach(function (category) {
            const card = document.createElement('a');
            card.href = 'search.php?q=' + category.strCategory + '&type=category';
            card.className = 'category-card';

            const img = document.createElement('img');
            img.src = category.strCategoryThumb;
            img.alt = category.strCategory;

            const name = document.createElement('span');
            name.textContent = category.strCategory;

            card.appendChild(img);
            card.appendChild(name);
            grid.appendChild(card);

        });

    } catch (error) {
        grid.innerHTML = '<p class="load-error">Could not load categories. Please try later.</p>';
    }
}