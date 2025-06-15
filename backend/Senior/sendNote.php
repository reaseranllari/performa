<?php

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    http_response_code(200);
    exit();
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include '../database.php'; 
$conn->exec("SET NAMES utf8mb4");

$data = json_decode(file_get_contents("php://input"), true);

$from_user_id = $data['from_user_id'] ?? null;
$to_user_id = $data['to_user_id'] ?? null;
$content = $data['content'] ?? null;

if (!$from_user_id || !$to_user_id || !$content) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO notes (from_user_id, to_user_id, content) VALUES (?, ?, ?)");
    $stmt->execute([$from_user_id, $to_user_id, $content]);
    echo json_encode(['success' => true, 'message' => 'Note sent successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
