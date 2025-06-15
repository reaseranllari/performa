<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'database.php';

$data = json_decode(file_get_contents("php://input"));

$title = $data->title ?? '';
$employee_id = $data->employee_id ?? null;
$deadline = $data->deadline ?? '';
$priority = $data->priority ?? '';
$status = $data->status ?? 'Pending';


if (!$title || !$employee_id || !$deadline || !$priority) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO goals (title, employee_id, deadline, priority, status) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$title, $employee_id, $deadline, $priority, $status]);


    $goalId = $conn->lastInsertId();
    $goalStmt = $conn->prepare("SELECT g.*, u.username AS employee FROM goals g JOIN users u ON g.employee_id = u.id WHERE g.id = ?");
    $goalStmt->execute([$goalId]);
    $newGoal = $goalStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'goal' => $newGoal]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>

