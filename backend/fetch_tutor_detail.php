<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');

require_once 'Database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    global $conn;

    // Fix: use tutor_id instead of user_id
    $stmt = $conn->prepare("SELECT * FROM tutor_profiles WHERE tutor_id = ?");
    $stmt->bind_param("i", $tutor_id);

    $tutor_id = $_GET['tutor_id'] ?? null;

    $stmt->execute();
    $response = $stmt->get_result();

    $tutor_detail = [];

    while ($row = $response->fetch_assoc()) {
        $tutor_detail[] = $row;
    }

    echo json_encode($tutor_detail);

    $conn->close();
}
?>
