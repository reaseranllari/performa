<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $email    = $_POST['email'] ?? '';
    $password = password_hash($_POST['password'] ?? '', PASSWORD_DEFAULT);

    $roleStmt = $conn->prepare("SELECT id FROM roles WHERE name = 'junior employee' LIMIT 1");
    $roleStmt->execute();
    $roleRow = $roleStmt->fetch(PDO::FETCH_ASSOC);
    $role_id = $roleRow['id'] ?? null;

    if (!$role_id) {
        echo json_encode(["success" => false, "message" => "Role not found"]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)");

    try {
        $stmt->execute([$username, $email, $password, $role_id]);
        echo json_encode([
            "success" => true,
            "message" => "User registered successfully",
            "role" => "junior employee"
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Registration failed: " . $e->getMessage()
        ]);
    }
}
?>
