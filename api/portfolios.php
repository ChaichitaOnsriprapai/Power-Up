<?php
require __DIR__ . '/storage.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    sendJson(readPortfolios(), 200);
}

if ($method === 'POST') {
    $displayName = trim($_POST['displayName'] ?? '');
    $whatIEnjoy  = trim($_POST['whatIEnjoy'] ?? '');

    if ($displayName === '' || mb_strlen($displayName) > 100) {
        sendJson(['error' => 'displayName is required and must be under 100 characters'], 400);
    }

    $newPortfolio = [
        'id'                 => uniqid('p'),
        'displayName'        => $displayName,
        'whatIEnjoy'         => $whatIEnjoy,
        'whatIveTried'       => trim($_POST['whatIveTried'] ?? ''),
        'whatImCuriousAbout' => trim($_POST['whatImCuriousAbout'] ?? ''),
        'items'              => []
    ];

    $portfolios = readPortfolios();
    $portfolios[] = $newPortfolio;
    writePortfolios($portfolios);

    sendJson($newPortfolio, 201);
}

sendJson(['error' => 'Method not allowed'], 405);