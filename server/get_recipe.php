<?php
// server/get_recipe.php
// Reads a meal ID from the query string, calls the MealDB lookup endpoint,
// and returns a clean, simplified JSON object for the recipe page.
// Called by loadRecipe() in js/script.js via fetch().

// Tell the browser to expect JSON
header('Content-Type: application/json');

$base = 'https://www.themealdb.com/api/json/v1/1/';

// Read and sanitize the incoming meal ID
$id = isset($_GET['id']) ? trim($_GET['id']) : '';

// An ID is required — return an error if it is missing
if ($id === '') {
    echo json_encode(['error' => 'No meal ID provided.']);
    exit;
}

// Call the MealDB lookup endpoint
$url      = $base . 'lookup.php?i=' . urlencode($id);
$response = file_get_contents($url);

// If the HTTP request itself failed, return a clear error
if ($response === false) {
    echo json_encode(['error' => 'Could not reach TheMealDB API.']);
    exit;
}

// Decode the JSON from MealDB
$data = json_decode($response, true);

// MealDB returns {"meals": null} when the ID is not found
if (empty($data['meals'])) {
    echo json_encode(['error' => 'Recipe not found.']);
    exit;
}

// The lookup endpoint always returns exactly one meal
$meal = $data['meals'][0];

// --- Build the ingredients list ---
// MealDB stores ingredients as strIngredient1 … strIngredient20
// and measures  as strMeasure1   … strMeasure20.
// Collect only the pairs where the ingredient field is non-empty.
$ingredients = [];
for ($i = 1; $i <= 20; $i++) {
    $ingredient = trim($meal['strIngredient' . $i] ?? '');
    $measure    = trim($meal['strMeasure'    . $i] ?? '');

    if ($ingredient !== '') {
        $ingredients[] = [
            'ingredient' => $ingredient,
            'measure'    => $measure,
        ];
    }
}

// --- Return a clean, minimal object to the browser ---
echo json_encode([
    'idMeal'       => $meal['idMeal'],
    'strMeal'      => $meal['strMeal'],
    'strCategory'  => $meal['strCategory'],
    'strArea'      => $meal['strArea'],
    'strMealThumb' => $meal['strMealThumb'],
    'strInstructions' => $meal['strInstructions'],
    'ingredients'  => $ingredients,
]);
