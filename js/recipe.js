let output;
let params;
let id;

window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
    output = document.getElementById('recipe-output');
    params = new URLSearchParams(window.location.search);
    id     = params.get('id');

    if (!id) {
        output.innerHTML = '<p class="load-error">No recipe selected. <a href="index.php">Go back home</a>.</p>';
        return;
    }

    fetchrecipe(id);

}

async function fetchrecipe(id) {
    output.innerHTML = '<p class="loading-msg">Loading recipe…</p>';

    let fetchURL = 'server/get_recipe.php?id=' + encodeURIComponent(id);
    let response = await fetch(fetchURL);
    let data = await response.json();

    if (data.error) {
        output.innerHTML = '<p class="load-error">' + data.error + ' <a href="index.php">Go back home</a>.</p>';
        return;
    }

    buildrecipe(data);
}

function buildrecipe(data) {
    try {

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
            li.textContent = item.measure ? item.measure + ' ' + item.ingredient : item.ingredient;
            ul.appendChild(li);
        });

        // Instructions heading + paragraph block
        const instrHeading = document.createElement('h2');
        instrHeading.textContent = 'Instructions';

        const instructions = document.createElement('div');
        instructions.className = 'recipe-instructions';

        const steps = data.strInstructions.split('\r\n');

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

    } catch (error) {
        output.innerHTML = '<p class="load-error">Something went wrong loading this recipe. Please try again.</p>';
    }
}