<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
require_once 'Database.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true);
  $sender_id = $input['sender_id'] ?? null;
  $receiver_id = $input['receiver_id'] ?? null;
  $message_content = trim($input['message_content'] ?? '');
  if (!$sender_id || !$receiver_id || !$message_content) {
    echo json_encode(['success' => false, 'message' => 'All fields required.']); exit();
  }
  $stmt = $conn->prepare('INSERT INTO messages (sender_id, receiver_id, message_content) VALUES (?, ?, ?)');
  $stmt->bind_param('iis', $sender_id, $receiver_id, $message_content);
  if ($stmt->execute()) {
    echo json_encode(['success' => true]);
  } else {
    echo json_encode(['success' => false, 'message' => 'Failed to send message.']);
  }
  $stmt->close();
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
$conn->close(); 