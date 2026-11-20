<?php
require __DIR__ . '/storage.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    sendJson(readPortfolios(), 200);
}

if ($method === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $whatIEnjoy  = trim($_POST['whatIEnjoy'] ?? '');
    $whatIveTried = trim($_POST['whatIveTried'] ?? '');
    $whatImCuriousAbout = trim($_POST['whatImCuriousAbout'] ?? '');

    if ($name === '' || $whatIEnjoy === '' || $whatIveTried === '' || $whatImCuriousAbout === '') {
        sendJson(['error' => 'All profile fields are required'], 400);
    }

    if (mb_strlen($name) > 100) {
        sendJson(['error' => 'name must be 100 characters or fewer'], 400);
    }

    $newPortfolio = [
        'id'                 => uniqid('profile_'),
        'name'               => $name,
        'whatIEnjoy'         => $whatIEnjoy,
        'whatIveTried'       => $whatIveTried,
        'whatImCuriousAbout' => $whatImCuriousAbout,
        'items'              => []
    ];

    $portfolios = readPortfolios();
    $portfolios[] = $newPortfolio;
    if (!writePortfolios($portfolios)) {
        sendJson(['error' => 'Could not save portfolio data'], 500);
    }

    sendJson($newPortfolio, 201);
}

sendJson(['error' => 'Method not allowed'], 405);
