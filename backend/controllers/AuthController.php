<?php
class AuthController {
    private $db;
    private $max_login_attempts = 5;
    private $lockout_time = 300; // 5 minutes in seconds
    private $token_expiration = 3600; // 1 hour in seconds

    public function __construct() {
        $this->db = Database::getInstance();
        session_start();
    }

    private function checkRateLimit($ip) {
        if (!isset($_SESSION['login_attempts'])) {
            $_SESSION['login_attempts'] = [];
        }

        if (!isset($_SESSION['login_attempts'][$ip])) {
            $_SESSION['login_attempts'][$ip] = ['count' => 0, 'time' => time()];
        }

        $attempts = $_SESSION['login_attempts'][$ip];
        
        // Reset counter if lockout time has passed
        if (time() - $attempts['time'] > $this->lockout_time) {
            $attempts['count'] = 0;
            $attempts['time'] = time();
        }

        if ($attempts['count'] >= $this->max_login_attempts) {
            throw new Exception("Too many failed attempts. Please try again in " . 
                ceil(($this->lockout_time - (time() - $attempts['time'])) / 60) . " minutes");
        }

        return $attempts;
    }

    private function incrementLoginAttempt($ip) {
        $_SESSION['login_attempts'][$ip]['count']++;
        $_SESSION['login_attempts'][$ip]['time'] = time();
    }

    private function resetLoginAttempts($ip) {
        $_SESSION['login_attempts'][$ip]['count'] = 0;
        $_SESSION['login_attempts'][$ip]['time'] = time();
    }

    private function validateToken($token) {
        if (!isset($_SESSION['token']) || $_SESSION['token'] !== $token) {
    public function register($data) {
        // Create User instance
        $user = new User();

        // Check if email already exists
        $existingUser = $user->getUserByEmail($data['email']);
        if ($existingUser) {
            throw new Exception('Email already registered');
        }

        // Register new user
        if ($user->register($data)) {
            return [
                'success' => true,
                'message' => 'Registration successful'
            ];
        }

        throw new Exception('Registration failed');
    }

    public function login($data) {
        try {
            $ip = $_SERVER['REMOTE_ADDR'];
            $this->checkRateLimit($ip);

            $user = new User();
            $existingUser = $user->getUserByEmail($data['email']);

            if (!$existingUser) {
                $this->incrementLoginAttempt($ip);
                throw new Exception('User not found');
            }

            if (!$user->verifyPassword($existingUser['password'], $data['password'])) {
                $this->incrementLoginAttempt($ip);
                throw new Exception('Invalid password');
            }

            // Reset login attempts on successful login
            $this->resetLoginAttempts($ip);

            // Generate session token
            $token = bin2hex(random_bytes(32));
            $_SESSION['user_id'] = $existingUser['id'];
            $_SESSION['role'] = $existingUser['role'];
            $_SESSION['token'] = $token;

            // Update last login time
            $user->updateLastLogin($existingUser['id']);

            return [
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user_id' => $existingUser['id'],
                'role' => $existingUser['role']
            ];
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function logout() {
        // Clean up session
        if (isset($_SESSION['token'])) {
            unset($_SESSION['token']);
            unset($_SESSION['user_id']);
            unset($_SESSION['role']);
        }
        session_destroy();
        return true;
    }

    public function checkAuth($token = null) {
        try {
            if ($token) {
                if (!isset($_SESSION['token']) || $_SESSION['token'] !== $token) {
                    return false;
                }
            }
            
            if (!isset($_SESSION['user_id']) || !isset($_SESSION['token'])) {
                return false;
            }

            $user = new User();
            $userData = $user->getUserById($_SESSION['user_id']);
            
            if (!$userData) {
                return false;
            }

            return [
                'authenticated' => true,
                'user_id' => $_SESSION['user_id'],
                'role' => $_SESSION['role'],
                'profile' => $user->getUserProfile($_SESSION['user_id'])
            ];
        } catch (Exception $e) {
            return false;
        }
    }
}
