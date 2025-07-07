<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
require_once 'Database.php';
$user1_id = $_GET['user1_id'] ?? null;
$user2_id = $_GET['user2_id'] ?? null;
if (!$user1_id || !$user2_id) { echo json_encode(['success' => false, 'message' => 'Missing user ids']); exit(); }
$stmt = $conn->prepare('SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC');
$stmt->bind_param('iiii', $user1_id, $user2_id, $user2_id, $user1_id);
$stmt->execute();
$result = $stmt->get_result();
$messages = [];
while ($row = $result->fetch_assoc()) { $messages[] = $row; }
$stmt->close();
echo json_encode(['success' => true, 'messages' => $messages]);
$conn->close(); 