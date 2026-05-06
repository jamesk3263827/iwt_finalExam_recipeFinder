// script.js

// ===========================
// Ingredient Form Validation
// ===========================
// Runs on the homepage. Prevents form submission if all three
// ingredient fields are empty, and shows an inline error message.

const ingredientForm = document.getElementById('ingredient-form');

if (ingredientForm) {
    ingredientForm.addEventListener('submit', function (event) {
        const i1 = document.getElementById('ingredient1').value.trim();
        const i2 = document.getElementById('ingredient2').value.trim();
        const i3 = document.getElementById('ingredient3').value.trim();
        const errorMsg = document.getElementById('form-error');

        if (i1 === '' && i2 === '' && i3 === '') {
            event.preventDefault();
            errorMsg.textContent = 'Please enter at least one ingredient before searching.';
        } else {
            errorMsg.textContent = '';
        }
    });
}


// ===========================
// Category Grid (Homepage)
// ===========================
// Fetches all MealDB categories from the server, then builds and
// injects a grid of clickable image + name cards into #category-grid.

function loadCategories() {
    const grid = document.getElementById('category-grid');

    // Only run on pages that have the category grid
    if (!grid) return;

    // Show a loading message while the fetch is in flight
    grid.innerHTML = '<p class="loading-msg">Loading categories…</p>';

    fetch('server/get_categories.php')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Clear the loading message
            grid.innerHTML = '';

            // Guard against an API error response
            if (data.error || !data.categories) {
                grid.innerHTML = '<p class="load-error">Could not load categories. Please try again later.</p>';
                return;
            }

            // Build one card per category and append it to the grid
            data.categories.forEach(function (category) {
                const card = document.createElement('a');
                card.href = 'search.php?category=' + encodeURIComponent(category.strCategory);
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
        })
        .catch(function () {
            grid.innerHTML = '<p class="load-error">Could not load categories. Please check your connection.</p>';
        });
}

// Run on page load
loadCategories();


// ===========================
// Search Page
// ===========================
// On search.php, reads URL parameters to determine what to search for,
// pre-fills the form, and fetches results from server/servSearch.php.
// Handles three entry points:
//   ?category=Seafood          — clicked a category card on the homepage
//   ?i1=chicken&i2=&i3=        — submitted the ingredient form on the homepage
//   ?q=curry&type=name         — submitted the search form on this page directly

function runSearch() {
    const resultsGrid = document.getElementById('results-grid');

    // Only run on pages that have the results grid
    if (!resultsGrid) return;

    const params     = new URLSearchParams(window.location.search);
    const input      = document.getElementById('search-input');
    const typeSelect = document.getElementById('search-type');

    let term = '';
    let type = 'ingredient';

    // --- Determine where the request came from and set term + type ---

    if (params.has('category')) {
        // Arrived from a category card click on the homepage
        term = params.get('category');
        type = 'category';

    } else if (params.has('i1') || params.has('i2') || params.has('i3')) {
        // Arrived from the ingredient form on the homepage.
        // MealDB filter.php only supports one ingredient at a time, so we
        // use the first non-empty value and search by ingredient.
        const i1 = (params.get('i1') || '').trim();
        const i2 = (params.get('i2') || '').trim();
        const i3 = (params.get('i3') || '').trim();
        term = i1 || i2 || i3;   // first non-empty value
        type = 'ingredient';

    } else if (params.has('q')) {
        // Arrived from the search form on this page
        term = params.get('q').trim();
        type = params.get('type') || 'ingredient';
    }

    // Nothing to search — leave the results area empty and wait
    if (term === '') return;

    // Pre-fill the form so the user can see what was searched
    if (input)      input.value = term;
    if (typeSelect) typeSelect.value = type;

    // Show a loading message while fetching
    resultsGrid.innerHTML = '<p class="loading-msg">Searching…</p>';

    // Build the fetch URL pointing to the server-side PHP file
    const fetchURL = 'server/servSearch.php?q=' + encodeURIComponent(term) + '&type=' + encodeURIComponent(type);

    fetch(fetchURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            resultsGrid.innerHTML = '';

            // Server-side error (API unreachable, missing term, etc.)
            if (data.error) {
                resultsGrid.innerHTML = '<p class="load-error">' + data.error + '</p>';
                return;
            }

            // No matches found
            if (!data.meals || data.meals.length === 0) {
                resultsGrid.innerHTML = '<p class="no-results">No recipes found for <strong>' + term + '</strong>. Try a different search.</p>';
                return;
            }

            // Build one result card per meal
            data.meals.forEach(function (meal) {
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
        })
        .catch(function () {
            resultsGrid.innerHTML = '<p class="load-error">Something went wrong. Please try again.</p>';
        });
}

// Run on page load
runSearch();


// ===========================
// Recipe Page
// ===========================
// On recipe.php, reads the ?id= URL parameter, fetches the full meal
// from server/get_recipe.php, and builds the recipe layout into
// #recipe-output.

function loadRecipe() {
    const output = document.getElementById('recipe-output');

    // Only run on pages that have the recipe output div
    if (!output) return;

    const params = new URLSearchParams(window.location.search);
    const id     = params.get('id');

    // No ID in the URL — show a friendly message instead of a blank page
    if (!id) {
        output.innerHTML = '<p class="load-error">No recipe selected. <a href="index.php">Go back home</a>.</p>';
        return;
    }

    // Show a loading message while the fetch is in flight
    output.innerHTML = '<p class="loading-msg">Loading recipe…</p>';

    fetch('server/get_recipe.php?id=' + encodeURIComponent(id))
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Server-side error (bad ID, API down, etc.)
            if (data.error) {
                output.innerHTML = '<p class="load-error">' + data.error + ' <a href="index.php">Go back home</a>.</p>';
                return;
            }

            // --- Build the recipe layout ---

            // Meal name
            const title = document.createElement('h1');
            title.textContent = data.strMeal;

            // Metadata: category and area/cuisine
            const meta = document.createElement('p');
            meta.className   = 'recipe-meta';
            meta.textContent = data.strCategory + ' · ' + data.strArea;

            // Meal image
            const img = document.createElement('img');
            img.src       = data.strMealThumb;
            img.alt       = data.strMeal;
            img.className = 'recipe-img';

            // Ingredients heading + list
            const ingHeading = document.createElement('h2');
            ingHeading.textContent = 'Ingredients';

            const ul = document.createElement('ul');
            ul.className = 'recipe-ingredients';

            data.ingredients.forEach(function (item) {
                const li = document.createElement('li');
                // Show measure alongside ingredient when available (e.g. "2 tbsp Olive Oil")
                li.textContent = item.measure
                    ? item.measure + ' ' + item.ingredient
                    : item.ingredient;
                ul.appendChild(li);
            });

            // Instructions heading + paragraph block
            const instrHeading = document.createElement('h2');
            instrHeading.textContent = 'Instructions';

            const instructions = document.createElement('div');
            instructions.className = 'recipe-instructions';

            // MealDB instructions use \r\n line breaks — split into paragraphs
            // so the text is easier to read than one long block.
            const steps = data.strInstructions
                .split(/\r?\n/)
                .map(function (s) { return s.trim(); })
                .filter(function (s) { return s.length > 0; });

            steps.forEach(function (step) {
                const p = document.createElement('p');
                p.textContent = step;
                instructions.appendChild(p);
            });

            // --- Assemble and inject ---
            output.innerHTML = '';
            output.appendChild(title);
            output.appendChild(meta);
            output.appendChild(img);
            output.appendChild(ingHeading);
            output.appendChild(ul);
            output.appendChild(instrHeading);
            output.appendChild(instructions);
        })
        .catch(function () {
            output.innerHTML = '<p class="load-error">Something went wrong loading this recipe. Please try again.</p>';
        });
}

// Run on page load
loadRecipe();
