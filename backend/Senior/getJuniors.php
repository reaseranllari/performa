<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../database.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
   
    $roleStmt = $conn->prepare("SELECT id FROM roles WHERE name = ?");
    $roleStmt->execute(['junior employee']);
    $roleId = $roleStmt->fetchColumn();

    if (!$roleId) {
        throw new Exception("Role 'junior employee' not found.");
    }
    
    $stmt = $conn->prepare("SELECT id, username FROM users WHERE role_id = ?");
    $stmt->execute([$roleId]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
