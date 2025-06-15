<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");

include 'database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = $_POST['email'];
    $password = $_POST['password'];

   
    $stmt = $conn->prepare("
        SELECT u.id, u.username, u.password, r.name AS role
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.email = ?
        LIMIT 1
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);



    if ($user && password_verify($password, $user['password'])) {
        echo json_encode([
            'success' => true,
            'id' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role']
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid credentials'
        ]);
    }
}
?>