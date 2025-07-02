<?php
class Database {
    private static $instance = null;
    private $connection;
    private $host = 'localhost';
    private $dbname = 'tutors_platform';
    private $user = 'root';
    private $pass = '';

    private function __construct() {
        try {
            $this->connection = new mysqli($this->host, $this->user, $this->pass, $this->dbname);
            if ($this->connection->connect_error) {
                throw new Exception("Connection failed: " . $this->connection->connect_error);
            }
            $this->connection->set_charset("utf8mb4");
        } catch (Exception $e) {
            throw new Exception("Connection failed: " . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->connection;
    }

    public function query($sql) {
        try {
            $result = $this->connection->query($sql);
            if (!$result) {
                throw new Exception("Query failed: " . $this->connection->error);
            }
            return $result;
        } catch (Exception $e) {
            throw new Exception("Query failed: " . $e->getMessage());
        }
    }

    public function prepare($sql) {
        try {
            $stmt = $this->connection->prepare($sql);
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->connection->error);
            }
            return $stmt;
        } catch (Exception $e) {
            throw new Exception("Prepare failed: " . $e->getMessage());
        }
    }

    public function close() {
        if ($this->connection) {
            $this->connection->close();
        }
    }

    public function __clone() {}
    public function __wakeup() {}
}
