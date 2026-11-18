<?php
require __DIR__ . '/storage.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['error' => 'Method not allowed'], 405);
}

$portfolioId = trim($_POST['portfolioId'] ?? '');
$title       = trim($_POST['title'] ?? '');
$type        = trim($_POST['type'] ?? '');
$date        = trim($_POST['date'] ?? '');
$rawEvidence = trim($_POST['evidence'] ?? '');

if ($portfolioId === '' || $title === '') {
    sendJson(['error' => 'portfolioId and title are required'], 400);
}
if ($rawEvidence !== '' && filter_var($rawEvidence, FILTER_VALIDATE_URL) === false) {
    sendJson(['error' => 'evidence must be a valid URL'], 400);
}

$rawSkills = $_POST['skills'] ?? '';
$skills = array_values(array_filter(
    array_map('trim', explode(',', $rawSkills)),
    function ($s) { return $s !== ''; }
));

$newItem = [
    'id'          => uniqid('item'),
    'title'       => $title,
    'type'        => $type,
    'date'        => $date,
    'role'        => trim($_POST['role'] ?? ''),
    'description' => trim($_POST['description'] ?? ''),
    'skills'      => $skills,
    'reflection'  => [
        'whatIDid' => trim($_POST['whatIDid'] ?? ''),
        'nextStep' => trim($_POST['nextStep'] ?? '')
    ],
    'evidence'    => $rawEvidence !== '' ? [$rawEvidence] : []
];

$portfolios = readPortfolios();
foreach ($portfolios as $index => $portfolio) {
    if ($portfolio['id'] === $portfolioId) {
        $portfolios[$index]['items'][] = $newItem;
        writePortfolios($portfolios);
        sendJson($newItem, 201);
    }
}

sendJson(['error' => 'Portfolio not found'], 404);