<?php
// CORS headers for all requests
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'Database.php';

$tutor_id = $_GET['tutor_id'] ?? null;

if (!$tutor_id) {
    echo json_encode(['success' => false, 'message' => 'Tutor ID is required.']);
    exit();
}

// Get user data
$stmt = $conn->prepare('SELECT user_id, first_name, last_name, email, role, profile_picture_url, phone_number, address FROM users WHERE user_id = ? AND role = "tutor"');
$stmt->bind_param('i', $tutor_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Tutor not found.']);
    exit();
}

$user = $result->fetch_assoc();
$stmt->close();

// Get tutor profile data
$stmt = $conn->prepare('SELECT bio, education, hourly_rate, availability FROM tutor_profiles WHERE tutor_id = ?');
$stmt->bind_param('i', $tutor_id);
$stmt->execute();
$result = $stmt->get_result();
$profile = $result->num_rows > 0 ? $result->fetch_assoc() : [];
$stmt->close();

echo json_encode([
    'success' => true,
    'user' => $user,
    'profile' => $profile
]);

$conn->close(); 