<?php

header('Content-Type: application/json');

$base = 'https://www.themealdb.com/api/json/v1/1/';

$term = isset($_GET['q'])    ? trim($_GET['q'])    : '';
$type = isset($_GET['type']) ? trim($_GET['type']) : 'ingredient';

if ($term === '') {
    echo json_encode(['error' => 'No search term provided.']);
    exit;
}

switch ($type) {
    case 'category':
        $url = $base . 'filter.php?c=' . urlencode($term);
        break;
    case 'name':
        $url = $base . 'search.php?s=' . urlencode($term);
        break;
    //ingredient by default
    default:
        $url = $base . 'filter.php?i=' . urlencode($term);
        break;
}

$response = file_get_contents($url);

if (!$response) {
    echo json_encode(['error' => 'Could not reach TheMealDB API.']);
    exit;
}

$data = json_decode($response, true);


if ($data['meals'] === null) {
    echo json_encode(['meals' => []]);
    exit;
}

echo json_encode(['meals' => $data['meals']]);