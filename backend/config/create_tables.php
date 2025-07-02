<?php
$host = 'localhost';
$dbname = 'tutors_platform';
$user = 'root';
$pass = '';

// Database configuration

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "CREATE DATABASE IF NOT EXISTS $dbname DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    $pdo->exec($sql);
    echo "Database created successfully\n";
    
    // Use the database
    $pdo->exec("USE $dbname");

    // Create tables
    $tables = [
        // Users table
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
        ) ENGINE=InnoDB;",

        // Tutor profiles table
        "CREATE TABLE IF NOT EXISTS tutor_profiles (
            tutor_id INT PRIMARY KEY,
            bio TEXT,
            education TEXT,
            subjects_offered JSON,
            hourly_rate DECIMAL,
            availability JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (tutor_id) REFERENCES users(user_id) ON DELETE CASCADE
        ) ENGINE=InnoDB;",

        // Sessions table
        "CREATE TABLE IF NOT EXISTS sessions (
            session_id INT PRIMARY KEY AUTO_INCREMENT,
            tutor_id INT NOT NULL,
            student_id INT NOT NULL,
            session_date DATE NOT NULL,
            session_time TIME NOT NULL,
            status ENUM('scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
            session_notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (tutor_id) REFERENCES users(user_id),
            FOREIGN KEY (student_id) REFERENCES users(user_id)
        ) ENGINE=InnoDB;",

        // Messages table
        "CREATE TABLE IF NOT EXISTS messages (
            message_id INT PRIMARY KEY AUTO_INCREMENT,
            sender_id INT NOT NULL,
            receiver_id INT NOT NULL,
            message_content TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users(user_id),
            FOREIGN KEY (receiver_id) REFERENCES users(user_id)
        ) ENGINE=InnoDB;",

        // Website Reviews table
        "CREATE TABLE IF NOT EXISTS website_reviews (
            review_id INT PRIMARY KEY AUTO_INCREMENT,
            tutor_id INT NOT NULL,
            student_id INT NOT NULL,
            rating INT CHECK (rating >= 1 AND rating <= 5),
            review_text TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tutor_id) REFERENCES users(user_id),
            FOREIGN KEY (student_id) REFERENCES users(user_id)
        ) ENGINE=InnoDB;",

        // Contact Us table
        "CREATE TABLE IF NOT EXISTS contact_us (
            contact_id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            subject VARCHAR(100) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;"
    ];

    // Execute each table creation
    foreach ($tables as $table) {
        try {
            $pdo->exec($table);
            echo "Table created successfully\n";
        } catch (PDOException $e) {
            echo "Error creating table: " . $e->getMessage() . "\n";
        }
    }

    echo "Database and tables created successfully!\n";

} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Close the connection
$pdo = null;
