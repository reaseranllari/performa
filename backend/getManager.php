<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS"); 
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json"); 

include 'database.php'; 

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(["error" => "User ID is required."]);
    exit;
}

try {

    $stmt = $conn->prepare("SELECT manager_id FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $manager_id = $stmt->fetchColumn();

    if (!$manager_id) {
        http_response_code(404);
        echo json_encode(["error" => "No manager found for this user."]);
        exit;
    }

  
    $managerStmt = $conn->prepare("
        SELECT u.id, u.username, r.name AS role
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = ? AND r.name = 'manager' 
        LIMIT 1
    ");
    $managerStmt->execute([$manager_id]);
    $manager = $managerStmt->fetch(PDO::FETCH_ASSOC);

    if ($manager) {
        echo json_encode($manager);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Manager details not found or user is not a manager."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>