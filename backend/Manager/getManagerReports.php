<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: *");

include '../database.php';

$manager_id = $_GET['manager_id'] ?? null;

if (!$manager_id) {
    echo json_encode(["error" => "Manager ID is required"]);
    exit;
}

try {
    $stmt1 = $conn->prepare("
    SELECT
        fs.*,
        u.username AS name,
        u.role_id AS role,
        (
            SELECT GROUP_CONCAT(CONCAT(c.name, ':', fr.rating))
            FROM categories c
            JOIN feedback_ratings fr ON c.id = fr.category_id
            WHERE fr.submission_id = fs.id
            ORDER BY c.name ASC
        ) AS sub_categories,
        (
            SELECT c.main_category
            FROM categories c
            JOIN feedback_ratings fr ON c.id = fr.category_id
            WHERE fr.submission_id = fs.id
            GROUP BY c.main_category
            ORDER BY COUNT(c.id) DESC
            LIMIT 1
        ) AS main_category,
        fs.date
    FROM feedback_submissions fs
    JOIN users u ON fs.to_user_id = u.id
    WHERE u.manager_id = ?
GROUP BY fs.id
ORDER BY fs.date DESC, fs.id DESC
    ");
    
    $stmt1->execute([$manager_id]);
    $feedbacks = $stmt1->fetchAll(PDO::FETCH_ASSOC);

 
    $stmt2 = $conn->prepare("
    SELECT 
        fs.id AS submission_id,
        fs.from_user_id,
        fs.comment,
        fs.date,
        u.username AS from_name,
        GROUP_CONCAT(c.name, ':', fr.rating SEPARATOR '; ') AS feedback_details
    FROM feedback_submissions fs
    JOIN users u ON fs.from_user_id = u.id
    LEFT JOIN feedback_ratings fr ON fs.id = fr.submission_id
    LEFT JOIN categories c ON fr.category_id = c.id
    WHERE fs.to_user_id = ?
    GROUP BY fs.id, fs.from_user_id, fs.comment, fs.date, u.username
    ORDER BY fs.date DESC
");
$stmt2->execute([$manager_id]);
$feedbackToManager = $stmt2->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "feedbacks" => $feedbacks,
    "feedbackToManager" => $feedbackToManager
]);

} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}

?>