<?php

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS"); 
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


include '../database.php'; 


$data = json_decode(file_get_contents("php://input"), true);

$goal_id = $data['goal_id'] ?? null;
$status = $data['status'] ?? null;
$role = $data['role'] ?? null; 

if (!$goal_id || !$status || !$role) {
    echo json_encode(['success' => false, 'message' => 'Missing goal_id, status, or role.']);
    exit;
}

try {
    
    $stmt = $conn->prepare("UPDATE goals SET status = ? WHERE id = ?");
    $stmt->execute([$status, $goal_id]);

    $stmt->execute([$status, $goal_id]);

 
    error_log("Goal ID: $goal_id, Status: $status, Role: $role updated successfully.");

    echo json_encode(['success' => true, 'message' => 'Goal status updated.']);
} catch (PDOException $e) {
    error_log("Database error in updateGoalStatus.php: " . $e->getMessage()); 
    echo json_encode(['success' => false, 'message' => 'An error occurred while updating the goal status.']);
}
?>