<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../database.php'; 


$manager_id = $_GET['manager_id'] ?? null;

if (!$manager_id) {
    http_response_code(400);
    echo json_encode(["error" => "Manager ID is required."]);
    exit();
}

try {
    
    $stmt = $conn->prepare("
        SELECT 
            fs.id AS submission_id,
            fs.from_user_id,
            fs.comment,
            fs.date,
            u.username AS from_username,
            GROUP_CONCAT(c.name, ':', fr.rating SEPARATOR '; ') AS feedback_details
        FROM feedback_submissions fs
        JOIN users u ON fs.from_user_id = u.id
        LEFT JOIN feedback_ratings fr ON fs.id = fr.submission_id
        LEFT JOIN categories c ON fr.category_id = c.id
        WHERE fs.to_user_id = ?
        GROUP BY fs.id, fs.from_user_id, fs.comment, fs.date, u.username
        ORDER BY fs.date DESC
    ");
    $stmt->execute([$manager_id]);
    $feedbackGivenToMe = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $structuredFeedback = [];
    foreach ($feedbackGivenToMe as $submission) {
        $ratings = [];
        if (!empty($submission['feedback_details'])) {
            $pairs = explode('; ', $submission['feedback_details']);
            foreach ($pairs as $pair) {
                list($category, $rating) = explode(':', $pair);
                $ratings[] = ['category' => $category, 'rating' => (int)$rating];
            }
        }
        $structuredFeedback[] = [
            'submission_id' => $submission['submission_id'],
            'from_user_id' => $submission['from_user_id'],
            'from_username' => $submission['from_username'],
            'comment' => $submission['comment'],
            'date' => $submission['date'],
            'ratings' => $ratings
        ];
    }

    echo json_encode(["success" => true, "feedback" => $structuredFeedback]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>