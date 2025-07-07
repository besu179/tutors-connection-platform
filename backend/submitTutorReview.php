<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
require_once 'Database.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true);
  $tutor_id = $input['tutor_id'] ?? null;
  $student_id = $input['student_id'] ?? null;
  $rating = $input['rating'] ?? null;
  $comment = trim($input['comment'] ?? '');
  if (!$tutor_id || !$student_id || !$rating) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']); exit();
  }
  $stmt = $conn->prepare('INSERT INTO reviews (tutor_id, student_id, rating, comment) VALUES (?, ?, ?, ?)');
  $stmt->bind_param('iiis', $tutor_id, $student_id, $rating, $comment);
  if ($stmt->execute()) {
    // Update ratings_summary
    $sumStmt = $conn->prepare('SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews FROM reviews WHERE tutor_id = ?');
    $sumStmt->bind_param('i', $tutor_id);
    $sumStmt->execute();
    $sumRes = $sumStmt->get_result()->fetch_assoc();
    $avg = $sumRes['avg_rating'];
    $total = $sumRes['total_reviews'];
    $sumStmt->close();
    $upStmt = $conn->prepare('REPLACE INTO ratings_summary (tutor_id, average_rating, total_reviews) VALUES (?, ?, ?)');
    $upStmt->bind_param('idi', $tutor_id, $avg, $total);
    $upStmt->execute();
    $upStmt->close();
    echo json_encode(['success' => true]);
  } else {
    echo json_encode(['success' => false, 'message' => 'Failed to submit review.']);
  }
  $stmt->close();
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
$conn->close(); 