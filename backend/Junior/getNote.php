<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../database.php';

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT n.*, u.username AS sender 
        FROM notes n 
        JOIN users u ON n.from_user_id = u.id 
        WHERE n.to_user_id = ? 
        ORDER BY n.timestamp DESC
    ");
    $stmt->execute([$user_id]);
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($notes);
} catch (PDOException $e) {
    echo json_encode([]);
}
?>
