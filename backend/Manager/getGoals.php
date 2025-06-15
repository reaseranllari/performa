<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include "../database.php";

$manager_id = $_GET['manager_id'] ?? null;
$employee_id = $_GET['employee_id'] ?? null;

if (!$manager_id) {
    echo json_encode([]);
    exit;
}

if ($employee_id) {
    try {
        $stmt = $conn->prepare("
            SELECT g.*, u.username AS employee
            FROM goals g
            JOIN users u ON g.employee_id = u.id
            WHERE g.employee_id = ?
            ORDER BY g.deadline ASC
        ");
        $stmt->execute([$employee_id]);
        $goals = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($goals as &$g) {
            $g['notes'] = isset($g['notes']) ? explode("||", $g['notes']) : [];
        }

        echo json_encode($goals);
        exit;
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        exit;
    }
}

try {
    $stmt = $conn->prepare("
        SELECT g.*, u.username AS employee
        FROM goals g
        JOIN users u ON g.employee_id = u.id
        WHERE u.manager_id = ?
        ORDER BY g.deadline ASC
    ");
    $stmt->execute([$manager_id]);
    $goals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($goals as &$g) {
        $g['notes'] = isset($g['notes']) ? explode("||", $g['notes']) : [];
    }

    echo json_encode($goals);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>

