<?php
// CORS headers for all requests
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'Database.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

$first_name = trim($input['first_name'] ?? '');
$last_name = trim($input['last_name'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$role = $input['role'] ?? '';

if (!$first_name || !$last_name || !$email || !$password || !$role) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit();
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit();
}

// Check if email already exists
$stmt = $conn->prepare('SELECT user_id FROM users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already registered.']);
    exit();
}
$stmt->close();

// Hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insert user
$stmt = $conn->prepare('INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)');
$stmt->bind_param('sssss', $first_name, $last_name, $email, $hashed_password, $role);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Registration successful.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
}
$stmt->close();
$conn->close();
