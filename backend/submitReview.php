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

$user_id = $input['user_id'] ?? null;
$rating = $input['rating'] ?? null;
$review_text = trim($input['review_text'] ?? '');

// Validation
if (!$user_id || !$rating || !$review_text) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit();
}

if ($rating < 1 || $rating > 5) {
    echo json_encode(['success' => false, 'message' => 'Rating must be between 1 and 5.']);
    exit();
}

// Check if user exists
$stmt = $conn->prepare('SELECT user_id FROM users WHERE user_id = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid user.']);
    exit();
}
$stmt->close();

// Check if user already submitted a review
$stmt = $conn->prepare('SELECT review_id FROM website_reviews WHERE user_id = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Update existing review
    $stmt = $conn->prepare('UPDATE website_reviews SET rating = ?, review_text = ? WHERE user_id = ?');
    $stmt->bind_param('isi', $rating, $review_text, $user_id);
} else {
    // Insert new review
    $stmt = $conn->prepare('INSERT INTO website_reviews (user_id, rating, review_text) VALUES (?, ?, ?)');
    $stmt->bind_param('iis', $user_id, $rating, $review_text);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Review submitted successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to submit review. Please try again.']);
}

$stmt->close();
$conn->close(); 