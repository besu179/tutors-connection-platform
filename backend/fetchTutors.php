<?php
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Content-Type: application/json');

require_once 'Database.php';

global $conn;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $tutor_id = isset($_GET['tutor_id']) ? intval($_GET['tutor_id']) : null;

    // Main query: join users and tutor_profiles
    $sql = "SELECT u.*, t.bio, t.education, t.hourly_rate, t.availability
            FROM users u
            LEFT JOIN tutor_profiles t ON u.user_id = t.tutor_id
            WHERE u.role = 'tutor'";
    $params = [];
    if ($tutor_id) {
        $sql .= " AND u.user_id = ?";
        $params[] = $tutor_id;
    }
    $stmt = $conn->prepare($sql . ($tutor_id ? '' : ''));
    if ($tutor_id) {
        $stmt->bind_param("i", $tutor_id);
    }
    $stmt->execute();
    $result = $stmt->get_result();

    $tutors = [];
    while ($row = $result->fetch_assoc()) {
        $row['subjects'] = [];
        // Fetch subjects for this tutor
        $sub_stmt = $conn->prepare("SELECT s.name FROM tutor_subject ts JOIN subjects s ON ts.subject_id = s.subject_id WHERE ts.tutor_id = ?");
        $sub_stmt->bind_param("i", $row['user_id']);
        $sub_stmt->execute();
        $sub_res = $sub_stmt->get_result();
        while ($subj = $sub_res->fetch_assoc()) {
            $row['subjects'][] = $subj['name'];
        }
        $sub_stmt->close();
        $tutors[] = $row;
    }
    // Return single object if tutor_id is set, else array
    if ($tutor_id && count($tutors) > 0) {
        echo json_encode($tutors[0]);
    } else {
        echo json_encode($tutors);
    }
    $conn->close();
}
?>
