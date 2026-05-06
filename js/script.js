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
