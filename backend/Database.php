<?php

header('Access-Control-Allow-Origin: http://127.0.0.1:5500');


$host = 'localhost';
$database = 'tutors_platform';
$user = 'root';
$password = '';

$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create tables
$tables = [

    "CREATE TABLE IF NOT EXISTS users (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('tutor', 'parent', 'student') NOT NULL,
        profile_picture_url VARCHAR(255),
        phone_number VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )",

    // Tutor Profiles (No JSON)
    "CREATE TABLE IF NOT EXISTS tutor_profiles (
        tutor_id INT PRIMARY KEY,
        bio TEXT,
        education TEXT,
        hourly_rate DECIMAL(10,2),
        availability TEXT,
        FOREIGN KEY (tutor_id) REFERENCES users(user_id) ON DELETE CASCADE
    )",

    // Subjects
    "CREATE TABLE IF NOT EXISTS subjects (
        subject_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",

    // Tutor-Subject Pivot Table (Many-to-Many)
    "CREATE TABLE IF NOT EXISTS tutor_subject (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tutor_id INT NOT NULL,
        subject_id INT NOT NULL,
        FOREIGN KEY (tutor_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
    )",

    // Sessions
    "CREATE TABLE IF NOT EXISTS sessions (
        session_id INT PRIMARY KEY AUTO_INCREMENT,
        tutor_id INT,
        student_id INT,
        session_date DATETIME,
        status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tutor_id) REFERENCES users(user_id) ON DELETE SET NULL,
        FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE SET NULL
    )",

    // Messages
    "CREATE TABLE IF NOT EXISTS messages (
        message_id INT PRIMARY KEY AUTO_INCREMENT,
        sender_id INT,
        receiver_id INT,
        message_content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
    )",

    // Website Reviews (e.g., public review section)
    "CREATE TABLE IF NOT EXISTS website_reviews (
        review_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        review_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
    )",

    // Contact Us
    "CREATE TABLE IF NOT EXISTS contact_us (
        contact_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100),
        email VARCHAR(100),
        subject VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )",

    // Tutor Reviews
    "CREATE TABLE IF NOT EXISTS reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tutor_id INT,
        student_id INT,
        rating INT,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tutor_id) REFERENCES users(user_id) ON DELETE SET NULL,
        FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE SET NULL
    )"
];

// Execute each table creation
foreach ($tables as $sql) {
    if (!$conn->query($sql)) {
        error_log("Table creation failed: " . $conn->error);
    }
}

