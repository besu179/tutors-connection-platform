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
  $session_date = $input['session_date'] ?? null;
  $notes = $input['notes'] ?? '';
  if (!$tutor_id || !$student_id || !$session_date) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']); exit();
  }
  $stmt = $conn->prepare('INSERT INTO sessions (tutor_id, student_id, session_date, notes) VALUES (?, ?, ?, ?)');
  $stmt->bind_param('iiss', $tutor_id, $student_id, $session_date, $notes);
  if ($stmt->execute()) {
    echo json_encode(['success' => true]);
  } else {
    echo json_encode(['success' => false, 'message' => 'Failed to schedule session.']);
  }
  $stmt->close();
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
$conn->close(); 