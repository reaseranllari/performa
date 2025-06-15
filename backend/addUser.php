<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'database.php';

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$role_id = (int) ($data['role_id'] ?? 0);
$manager_id = $data['manager_id'] ?? null; 

if (!$username || !$email || !$password || !$role_id) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $conn->prepare("INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)");
    $stmt->execute([$username, $email, $hashedPassword, $role_id]);

    echo json_encode(['success' => true, 'message' => 'User created successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
