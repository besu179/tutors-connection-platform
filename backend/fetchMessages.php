<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
require_once 'Database.php';
$user_id = $_GET['user_id'] ?? null;
if (!$user_id) { echo json_encode(['success' => false, 'message' => 'Missing user_id']); exit(); }
$stmt = $conn->prepare('SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ? ORDER BY created_at DESC');
$stmt->bind_param('ii', $user_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();
$messages = [];
while ($row = $result->fetch_assoc()) { $messages[] = $row; }
$stmt->close();
echo json_encode(['success' => true, 'messages' => $messages]);
$conn->close(); 