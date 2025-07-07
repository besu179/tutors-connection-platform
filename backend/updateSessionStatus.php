<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
require_once 'Database.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true);
  $session_id = $input['session_id'] ?? null;
  $status = $input['status'] ?? null;
  if (!$session_id || !$status) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']); exit();
  }
  $stmt = $conn->prepare('UPDATE sessions SET status = ? WHERE session_id = ?');
  $stmt->bind_param('si', $status, $session_id);
  if ($stmt->execute()) {
    echo json_encode(['success' => true]);
  } else {
    echo json_encode(['success' => false, 'message' => 'Failed to update session status.']);
  }
  $stmt->close();
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
$conn->close(); 