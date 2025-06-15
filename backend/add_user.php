<?php
include 'database.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'];
$email    = $data['email'];
$phone    = $data['phone'];
$password = password_hash($data['password'], PASSWORD_DEFAULT);
$role_id  = $data['role'];
$status   = $data['status'];

$stmt = $conn->prepare("INSERT INTO users (username, email, phone, password, role_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");

try {
  $stmt->execute([$username, $email, $phone, $password, $role_id, $status]);
  echo json_encode(["success" => true]);
} catch (PDOException $e) {
  echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
