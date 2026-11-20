<?php
require __DIR__ . '/storage.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['error' => 'Method not allowed'], 405);
}

$portfolioId = trim($_POST['portfolioId'] ?? '');
$title       = trim($_POST['title'] ?? '');
$type        = trim($_POST['type'] ?? '');
$date        = trim($_POST['date'] ?? '');
$role        = trim($_POST['role'] ?? '');
$description = trim($_POST['description'] ?? '');
$whatIDid    = trim($_POST['whatIDid'] ?? '');
$whatILearned = trim($_POST['whatILearned'] ?? '');
$challenge   = trim($_POST['challenge'] ?? '');
$nextStep    = trim($_POST['nextStep'] ?? '');

if ($portfolioId === '' || $title === '' || $type === '' || $role === '' || $description === '' ||
    $whatIDid === '' || $whatILearned === '' || $challenge === '' || $nextStep === '') {
    sendJson(['error' => 'Portfolio, item, and all reflection fields are required'], 400);
}

$dateParts = explode('-', $date);
if (count($dateParts) !== 3 || !checkdate((int) $dateParts[1], (int) $dateParts[2], (int) $dateParts[0]) ||
    !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    sendJson(['error' => 'date must be a valid YYYY-MM-DD date'], 400);
}

$rawSkills = $_POST['skills'] ?? '';
$skills = array_values(array_filter(
    array_map('trim', explode(',', $rawSkills)),
    function ($s) { return $s !== ''; }
));

if (count($skills) === 0) {
    sendJson(['error' => 'At least one skill is required'], 400);
}

$rawEvidence = trim($_POST['evidence'] ?? '');
$evidence = array_values(array_filter(array_map('trim', preg_split('/\r?\n/', $rawEvidence)), function ($url) {
    return $url !== '';
}));

if (count($evidence) === 0) {
    sendJson(['error' => 'At least one evidence URL is required'], 400);
}

foreach ($evidence as $url) {
    $parts = parse_url($url);
    if (filter_var($url, FILTER_VALIDATE_URL) === false ||
        !isset($parts['scheme']) || !in_array(strtolower($parts['scheme']), ['http', 'https'], true)) {
        sendJson(['error' => 'Each evidence entry must be a valid HTTP or HTTPS URL'], 400);
    }
}

$newItem = [
    'id'          => uniqid('item'),
    'title'       => $title,
    'type'        => $type,
    'date'        => $date,
    'role'        => $role,
    'description' => $description,
    'skills'      => $skills,
    'reflection'  => [
        'whatIDid' => $whatIDid,
        'whatILearned' => $whatILearned,
        'challenge' => $challenge,
        'nextStep' => $nextStep
    ],
    'evidence'    => $evidence
];

$portfolios = readPortfolios();
foreach ($portfolios as $index => $portfolio) {
    if (isset($portfolio['id']) && (string) $portfolio['id'] === $portfolioId) {
        $portfolios[$index]['items'][] = $newItem;
        if (!writePortfolios($portfolios)) {
            sendJson(['error' => 'Could not save portfolio item'], 500);
        }
        sendJson($newItem, 201);
    }
}

sendJson(['error' => 'Portfolio not found'], 404);
