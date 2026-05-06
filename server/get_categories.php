<?php
// server/get_categories.php
// Fetches all meal categories from TheMealDB API and returns them as clean JSON.
// Called by loadCategories() in js/script.js via fetch().

// Tell the browser to expect JSON
header('Content-Type: application/json');

// MealDB categories endpoint
$url = 'https://www.themealdb.com/api/json/v1/1/categories.php';

// Fetch the data from the API
$response = file_get_contents($url);

// If the request failed, return an error object instead of crashing
if ($response === false) {
    echo json_encode(['error' => 'Could not reach TheMealDB API.']);
    exit;
}

// Decode the JSON string into a PHP array
$data = json_decode($response, true);

// Re-encode and send back to the browser as clean JSON
echo json_encode($data);
