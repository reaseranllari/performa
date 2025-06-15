<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'database.php';

$data = json_decode(file_get_contents("php://input"));

$id = $data->id ?? null;
$username = $data->username ?? '';
$email = $data->email ?? '';
$role_id = $data->role_id ?? null;

if ($id && $username && $email && $role_id) {
    $stmt = $conn->prepare("UPDATE users SET username = ?, email = ?, role_id = ? WHERE id = ?");
    $success = $stmt->execute([$username, $email, $role_id, $id]);
    echo json_encode(['success' => $success]);
} else {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
}
?>
