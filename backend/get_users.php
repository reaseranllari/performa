<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");


ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'database.php';

try {
    $stmt = $conn->prepare("
        SELECT 
            u.id, 
            u.username, 
            u.email, 
            r.name AS role, 
            u.created_at
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
    ");
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
