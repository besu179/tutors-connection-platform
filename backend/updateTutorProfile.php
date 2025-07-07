<?php
// CORS headers for all requests
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'Database.php';

// Get form data
$user_id = $_POST['user_id'] ?? null;
$first_name = trim($_POST['first_name'] ?? '');
$last_name = trim($_POST['last_name'] ?? '');
$phone_number = trim($_POST['phone_number'] ?? '');
$address = trim($_POST['address'] ?? '');
$bio = trim($_POST['bio'] ?? '');
$education = trim($_POST['education'] ?? '');
$hourly_rate = $_POST['hourly_rate'] ?? null;
$availability = trim($_POST['availability'] ?? '');

if (!$user_id || !$first_name || !$last_name) {
    echo json_encode(['success' => false, 'message' => 'Required fields are missing.']);
    exit();
}

// Handle image upload
$profile_picture_url = null;
if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['profile_image'];
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!in_array($file['type'], $allowed_types)) {
        echo json_encode(['success' => false, 'message' => 'Invalid image format. Only JPG, PNG, GIF, and WebP are allowed.']);
        exit();
    }
    
    if ($file['size'] > 5 * 1024 * 1024) { // 5MB limit
        echo json_encode(['success' => false, 'message' => 'Image size too large. Maximum 5MB allowed.']);
        exit();
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'user_' . $user_id . '_' . time() . '.' . $extension;
    $upload_path = '../frontend/images/users/' . $filename;
    
    // Create directory if it doesn't exist
    if (!is_dir('../frontend/images/users/')) {
        mkdir('../frontend/images/users/', 0777, true);
    }
    
    if (move_uploaded_file($file['tmp_name'], $upload_path)) {
        $profile_picture_url = 'images/users/' . $filename;
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to upload image.']);
        exit();
    }
}

// Update user table
$user_sql = 'UPDATE users SET first_name = ?, last_name = ?, phone_number = ?, address = ?';
$user_params = [$first_name, $last_name, $phone_number, $address];
$user_types = 'ssss';

if ($profile_picture_url) {
    $user_sql .= ', profile_picture_url = ?';
    $user_params[] = $profile_picture_url;
    $user_types .= 's';
}

$user_sql .= ' WHERE user_id = ? AND role = "tutor"';
$user_params[] = $user_id;
$user_types .= 'i';

$stmt = $conn->prepare($user_sql);
$stmt->bind_param($user_types, ...$user_params);
$user_updated = $stmt->execute();
$stmt->close();

// Update or insert tutor profile
$stmt = $conn->prepare('SELECT tutor_id FROM tutor_profiles WHERE tutor_id = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();
$profile_exists = $result->num_rows > 0;
$stmt->close();

if ($profile_exists) {
    // Update existing profile
    $stmt = $conn->prepare('UPDATE tutor_profiles SET bio = ?, education = ?, hourly_rate = ?, availability = ? WHERE tutor_id = ?');
    $stmt->bind_param('ssdsi', $bio, $education, $hourly_rate, $availability, $user_id);
} else {
    // Insert new profile
    $stmt = $conn->prepare('INSERT INTO tutor_profiles (tutor_id, bio, education, hourly_rate, availability) VALUES (?, ?, ?, ?, ?)');
    $stmt->bind_param('issds', $user_id, $bio, $education, $hourly_rate, $availability);
}

$profile_updated = $stmt->execute();
$stmt->close();

// Handle subjects update
$subjects_updated = true;
if (isset($_POST['subjects'])) {
    $selected_subjects = json_decode($_POST['subjects'], true);
    
    if (is_array($selected_subjects)) {
        // Delete existing tutor-subject associations
        $stmt = $conn->prepare('DELETE FROM tutor_subject WHERE tutor_id = ?');
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $stmt->close();
        
        // Insert new tutor-subject associations
        if (!empty($selected_subjects)) {
            $stmt = $conn->prepare('INSERT INTO tutor_subject (tutor_id, subject_id) VALUES (?, ?)');
            foreach ($selected_subjects as $subject_id) {
                $stmt->bind_param('ii', $user_id, $subject_id);
                if (!$stmt->execute()) {
                    $subjects_updated = false;
                    break;
                }
            }
            $stmt->close();
        }
    }
}

if ($user_updated && $profile_updated && $subjects_updated) {
    // Get updated user data for response
    $stmt = $conn->prepare('SELECT user_id, first_name, last_name, email, role, profile_picture_url, phone_number, address FROM users WHERE user_id = ?');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $updated_user = $result->fetch_assoc();
    $stmt->close();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Profile updated successfully!',
        'user' => $updated_user
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update profile.']);
}

$conn->close(); 