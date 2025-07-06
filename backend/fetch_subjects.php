<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');

require_once 'Database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    global $conn;

    $stmt = $conn->prepare("SELECT * FROM subjects");
    $stmt->execute();
    $response = $stmt->get_result();

    $subjects = [];

    while ($row = $response->fetch_assoc()) {
        $subjects[] = $row;
    }

    echo json_encode(["found" => $subjects]);

    $conn->close();
}
?>
