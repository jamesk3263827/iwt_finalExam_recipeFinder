<?php
// server/search.php
// Reads the search term and type from the query string, calls the correct
// MealDB endpoint, and returns the results as clean JSON.
// Called by runSearch() in js/script.js via fetch().

// Tell the browser to expect JSON
header('Content-Type: application/json');

$base = 'https://www.themealdb.com/api/json/v1/1/';

// Read and sanitize incoming parameters
$term = isset($_GET['q'])    ? trim($_GET['q'])    : '';
$type = isset($_GET['type']) ? trim($_GET['type']) : 'ingredient';

// A search term is required — return an error if it is missing
if ($term === '') {
    echo json_encode(['error' => 'No search term provided.']);
    exit;
}

// Build the correct MealDB URL based on search type
switch ($type) {
    case 'category':
        $url = $base . 'filter.php?c=' . urlencode($term);
        break;
    case 'name':
        $url = $base . 'search.php?s=' . urlencode($term);
        break;
    case 'ingredient':
    default:
        $url = $base . 'filter.php?i=' . urlencode($term);
        break;
}

// Fetch the data from MealDB
$response = file_get_contents($url);

// If the HTTP request itself failed, return a clear error
if ($response === false) {
    echo json_encode(['error' => 'Could not reach TheMealDB API.']);
    exit;
}

// Decode the JSON from MealDB
$data = json_decode($response, true);

// MealDB returns {"meals": null} when nothing matches — normalise that
// into an empty array so JS can handle it consistently.
if (empty($data['meals'])) {
    echo json_encode(['meals' => []]);
    exit;
}

// Name searches return full meal objects; filter searches return only
// idMeal, strMeal, strMealThumb. Normalise both shapes into the same
// three fields so script.js only has to handle one format.
$meals = [];
foreach ($data['meals'] as $meal) {
    $meals[] = [
        'idMeal'       => $meal['idMeal'],
        'strMeal'      => $meal['strMeal'],
        'strMealThumb' => $meal['strMealThumb'],
    ];
}

echo json_encode(['meals' => $meals]);
