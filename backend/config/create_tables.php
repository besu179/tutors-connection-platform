<?php
require_once 'Database.php';

try {
    // Get database instance
    $db = Database::getInstance();
    $connection = $db->getConnection();
    
    // Create database if it doesn't exist
    $sql = "CREATE DATABASE IF NOT EXISTS tutors_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    $db->query($sql);
    
    // Select the database
    $db->query("USE tutors_platform");

    // Create users table
    $sql = "CREATE TABLE IF NOT EXISTS users (
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
    )";
    $db->query($sql);

    // Create tutor_profiles table
    $sql = "CREATE TABLE IF NOT EXISTS tutor_profiles (
        tutor_id INT PRIMARY KEY,
        bio TEXT,
        education JSON,
        subjects JSON,
        hourly_rate DECIMAL(10,2),
        availability JSON,
        FOREIGN KEY (tutor_id) REFERENCES users(user_id) ON DELETE CASCADE
    )";
    $db->query($sql);

    // Create sessions table
    $sql = "CREATE TABLE IF NOT EXISTS sessions (
        session_id INT PRIMARY KEY AUTO_INCREMENT,
        tutor_id INT,
        student_id INT,
        session_date DATETIME,
        status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tutor_id) REFERENCES users(user_id) ON DELETE SET NULL,
        FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE SET NULL
    )";
    $db->query($sql);

    // Create messages table
    $sql = "CREATE TABLE IF NOT EXISTS messages (
        message_id INT PRIMARY KEY AUTO_INCREMENT,
        sender_id INT,
        receiver_id INT,
        message_content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
    )";
    $db->query($sql);

    // Create website_reviews table
    $sql = "CREATE TABLE IF NOT EXISTS website_reviews (
        review_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        review_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
    )";
    $db->query($sql);

    // Create contact_us table
    $sql = "CREATE TABLE IF NOT EXISTS contact_us (
        contact_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100),
        email VARCHAR(100),
        subject VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";


} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Close the connection
$pdo = null;
