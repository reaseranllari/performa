<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'database.php';

$manager_id = $_GET['manager_id'] ?? null;

if ($manager_id) {
    try {
        $stmt = $conn->prepare("
            SELECT u.id, u.username, u.email, r.name AS role
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.manager_id = ? AND u.role_id IN (3, 4)
        ");
        $stmt->execute([$manager_id]);
        $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($employees);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Manager ID missing"]);
}