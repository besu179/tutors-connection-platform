<?php
class User {
    private $db;
    private $role;
    private $valid_roles = ['tutor', 'parent', 'student'];

    public function __construct() {
        $this->db = Database::getInstance();
        $conn = $this->db->getConnection();
        if (method_exists($conn, 'set_charset')) {
            $conn->set_charset("utf8mb4");
        }
    }

    private function validateInput($data) {
        // Validate email
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format');
        }

        // Validate password complexity
        if (strlen($data['password']) < 6) {
            throw new Exception('Password must be at least 8 characters long');
        }

        // Validate role
        if (!in_array($data['role'], $this->valid_roles)) {
            throw new Exception('Invalid user role');
        }

        // Sanitize inputs
        $data['first_name'] = filter_var($data['first_name'], FILTER_SANITIZE_STRING);
        $data['last_name'] = filter_var($data['last_name'], FILTER_SANITIZE_STRING);
        return $data;
    }

    public function register($data) {
        try {
            $data = $this->validateInput($data);

            $stmt = $this->db->prepare(
                "INSERT INTO users (first_name, last_name, email, password, role) 
                 VALUES (?, ?, ?, ?, ?)"
            );
            
            // Hash the password
            $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
            
            // Insert user data
            $stmt->bind_param("sssss", 
                $data['first_name'],
                $data['last_name'],
                $data['email'],
                $hashed_password,
                $data['role']
            );
            
            if ($stmt->execute()) {
                return true;
            }
            return false;
            
        } catch (Exception $e) {
            throw new Exception("Registration failed: " . $e->getMessage());
        }
    }

    public function getUserByEmail($email) {
        try {
            $email = filter_var($email, FILTER_SANITIZE_EMAIL);
            $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            return $result->fetch_assoc();
        } catch (Exception $e) {
            throw new Exception("Error fetching user: " . $e->getMessage());
        }
    }

    public function getUserById($id) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE user_id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            return $result->fetch_assoc();
        } catch (Exception $e) {
            throw new Exception("Error fetching user: " . $e->getMessage());
        }
    }

    public function verifyPassword($hashedPassword, $password) {
        return password_verify($password, $hashedPassword);
    }



    public function updateLastLogin($userId) {
        try {
            $stmt = $this->db->prepare("UPDATE users SET last_login = NOW() WHERE user_id = ?");
            $stmt->bind_param("i", $userId);
            return $stmt->execute();
        } catch (Exception $e) {
            throw new Exception("Error updating last login: " . $e->getMessage());
        }
    }

    public function getUserProfile($userId) {
        try {
            $stmt = $this->db->prepare(
                "SELECT first_name, last_name, email, role, created_at, last_login \
                 FROM users WHERE user_id = ?"
            );
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            return $result->fetch_assoc();
        } catch (Exception $e) {
            throw new Exception("Error fetching user profile: " . $e->getMessage());
        }
    }
}