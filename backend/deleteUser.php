<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'database.php';

$data = json_decode(file_get_contents("php://input"));
$id = $data->id ?? null;


if (!$id) {
    echo json_encode(['success' => false, 'message' => 'No user ID provided']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
$success = $stmt->execute([$id]);

echo json_encode(['success' => $success]);
?>
