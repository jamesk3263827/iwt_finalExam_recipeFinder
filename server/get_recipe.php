<?php

header('Content-Type: application/json');

$base = 'https://www.themealdb.com/api/json/v1/1/';

$id = isset($_GET['id']) ? trim($_GET['id']) : '';

if ($id === '') {
    echo json_encode(['error' => 'No meal ID provided.']);
    exit;
}

$url      = $base . 'lookup.php?i=' . urlencode($id);
$response = file_get_contents($url);

if (!$response) {
    echo json_encode(['error' => 'Could not reach TheMealDB API.']);
    exit;
}

$data = json_decode($response, true);

if (!$data['meals']) {
    echo json_encode(['error' => 'Recipe not found.']);
    exit;
}

$meal = $data['meals'][0];

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
