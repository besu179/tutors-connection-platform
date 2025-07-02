<?php
// Enable CORS (for development only - update for production)
header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// For production, uncomment and set your allowed origin
// header('Access-Control-Allow-Origin: https://your-frontend-domain.com');

// Set JSON content type
header('Content-Type: application/json');

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Error handling
set_error_handler(function($errno, $errstr) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
    exit;
});

// Initialize required classes
require_once '../config/Database.php';
require_once '../controllers/AuthController.php';

// Get the request URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove trailing slash
$uri = rtrim($uri, '/');

// Handle API routes
switch ($uri) {
    case '/api/register':
        try {
            $auth = new AuthController();
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid request data']);
                exit;
            }
            
            $result = $auth->register($data);
            http_response_code(200);
            echo json_encode($result);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case '/api/login':
        try {
            $auth = new AuthController();
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid request data']);
                exit;
            }
            
            $result = $auth->login($data);
            http_response_code(200);
            echo json_encode($result);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case '/api/logout':
        try {
            $auth = new AuthController();
            $result = $auth->logout();
            http_response_code(200);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        exit;
}