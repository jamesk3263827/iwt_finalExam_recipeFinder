<?php include 'includes/header.php'; ?>

<main>
    <h1>Welcome to Recipe Finder</h1>

    <!-- Homepage Search Form -->
    <section class="ingredient-search">
        <h2>Find a Recipe</h2>
        <p>Search by ingredient, category, or meal name.</p>

        <form id="home-search-form" action="search.php" method="GET">
            <div class="search-row">
                <input
                    type="text"
                    id="search-input-home"
                    name="q"
                    placeholder="e.g. chicken, garlic, Seafood…"
                >
                <select id="search-type-home" name="type">
                    <option value="ingredient">By Ingredient</option>
                    <option value="category">By Category</option>
                    <option value="name">By Name</option>
                </select>
                <button type="submit" id="searchButtonHome">Search</button>
            </div>
            <p id="form-error-home" class="form-error"></p>
        </form>
    </section>

    <!-- Category Grid -->
    <section class="category-section">
        <h2>Browse by Category</h2>
        <p>Click any category below to see all recipes in that group.</p>

        <!-- JS injects category cards here -->
        <div id="category-grid"></div>
    </section>

</main>
<script src="js/index.js"></script>
<?php include 'includes/footer.php'; ?>
