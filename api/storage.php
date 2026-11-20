<?php
if (PHP_OS_FAMILY === 'Windows' || php_sapi_name() === 'cli-server' || !is_dir('/var/www')) {
    define('DATA_DIR', __DIR__ . '/../local-data');
} else {
    define('DATA_DIR', '/var/www/data');
}

define('DATA_FILE', DATA_DIR . '/portfolios.json');
define('LOCK_FILE', DATA_DIR . '/portfolios.lock');

function sendJson($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

function lockData() {
    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0775, true);
    }
    static $lockHandle = null;
    if ($lockHandle === null) {
        $lockHandle = fopen(LOCK_FILE, 'c');
    }
    if ($lockHandle) {
        flock($lockHandle, LOCK_EX);
    }
}

function readPortfolios() {
    lockData();
    if (!file_exists(DATA_FILE)) {
        return [];
    }
    $raw = file_get_contents(DATA_FILE);
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function writePortfolios($portfolios) {
    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0775, true);
    }
    $json = json_encode($portfolios, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        return false;
    }
    return file_put_contents(DATA_FILE, $json, LOCK_EX) !== false;
}
