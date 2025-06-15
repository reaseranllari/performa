<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'database.php';

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $conn->prepare("\n        SELECT * FROM goals WHERE employee_id = ? ORDER BY deadline ASC\n    ");
    $stmt->execute([$user_id]);
    $goals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($goals);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>