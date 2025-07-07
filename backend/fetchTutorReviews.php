<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
require_once 'Database.php';
$tutor_id = $_GET['tutor_id'] ?? null;
if (!$tutor_id) { echo json_encode(['success' => false, 'message' => 'Missing tutor_id']); exit(); }
$stmt = $conn->prepare('SELECT r.*, CONCAT(u.first_name, " ", u.last_name) as student_name FROM reviews r LEFT JOIN users u ON r.student_id = u.user_id WHERE r.tutor_id = ? ORDER BY r.created_at DESC');
$stmt->bind_param('i', $tutor_id);
$stmt->execute();
$result = $stmt->get_result();
$reviews = [];
while ($row = $result->fetch_assoc()) { $reviews[] = $row; }
$stmt->close();
echo json_encode(['success' => true, 'reviews' => $reviews]);
$conn->close(); 