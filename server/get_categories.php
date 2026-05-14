<?php
header('Content-Type: application/json');

$url = 'https://www.themealdb.com/api/json/v1/1/categories.php';

$response = file_get_contents($url);

if (!$response) {
    echo json_encode(['error' => 'Could not reach TheMealDB API.']);

} else {
    echo $response;
}