<?php include 'includes/header.php'; ?>

<main>
    <h1>Welcome to Recipe Finder</h1>

    <!-- Ingredient Search Form -->
    <section class="ingredient-search">
        <h2>Search by Ingredient</h2>
        <p>Enter up to three ingredients to find matching recipes.</p>

        <form id="ingredient-form" action="search.php" method="GET">
            <div class="form-group">
                <label for="ingredient1">Ingredient 1</label>
                <input type="text" id="ingredient1" name="i1" placeholder="e.g. chicken">
            </div>
            <div class="form-group">
                <label for="ingredient2">Ingredient 2</label>
                <input type="text" id="ingredient2" name="i2" placeholder="e.g. garlic">
            </div>
            <div class="form-group">
                <label for="ingredient3">Ingredient 3</label>
                <input type="text" id="ingredient3" name="i3" placeholder="e.g. tomato">
            </div>

            <p id="form-error" class="form-error" aria-live="polite"></p>

            <button type="submit">Find Recipes</button>
        </form>
    </section>

</main>

<?php include 'includes/footer.php'; ?>
