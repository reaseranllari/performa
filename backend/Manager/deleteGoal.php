<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
include '../database.php'; 

$data = json_decode(file_get_contents("php://input"));
$id = $data->id ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Missing goal ID']);
    exit;
}

try {
    $stmt = $conn->prepare("DELETE FROM goals WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
