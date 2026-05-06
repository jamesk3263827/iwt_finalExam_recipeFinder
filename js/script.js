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
