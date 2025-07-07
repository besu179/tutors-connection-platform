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

// Get tutor's subjects
$stmt = $conn->prepare('SELECT subject_id FROM tutor_subject WHERE tutor_id = ?');
$stmt->bind_param('i', $tutor_id);
$stmt->execute();
$result = $stmt->get_result();

$subjects = [];
while ($row = $result->fetch_assoc()) {
    $subjects[] = $row['subject_id'];
}

$stmt->close();

echo json_encode([
    'success' => true,
    'subjects' => $subjects
]);

$conn->close(); 