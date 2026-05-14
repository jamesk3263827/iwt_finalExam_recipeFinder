<?php include 'includes/header.php'; ?>

<main>
    <h1>Search Recipes</h1>

    <!-- Search Form -->
    <section class="search-form-section">
        <form id="search-form" action="search.php" method="GET">
            <div class="search-row">
                <input
                    type="text"
                    id="search-input"
                    name="q"
                    placeholder="e.g. chicken, garlic, Seafood…"
                    required
                >
                <select id="search-type" name="type">
                    <option value="ingredient">By Ingredient</option>
                    <option value="category">By Category</option>
                    <option value="name">By Name</option>
                </select>
                <button type="submit" id="searchButton">Search</button>
            </div>
            <p id="form-error" class="form-error"></p>
        </form>
    </section>

    <!-- Results appear here — JS injects cards into this div -->
    <section class="results-section">
        <div id="results-grid"></div>
    </section>

</main>
<script src="js/search.js"></script>
<?php include 'includes/footer.php'; ?>
