<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../database.php';

$data = json_decode(file_get_contents("php://input"), true);
file_put_contents('../debug_feedback.log', print_r($data, true), FILE_APPEND);

$from_user_id = $data['from_user_id'] ?? null;
$to_user_id = $data['to_user_id'] ?? null;
$comment = $data['comment'] ?? '';
$evaluate_more = $data['evaluate_more'] ?? '';
$evaluate_less = $data['evaluate_less'] ?? '';
$feedbackItems = $data['feedback'] ?? [];
$date = date('Y-m-d');


if (!$from_user_id || !$to_user_id || empty($feedbackItems)) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}


$fromStmt = $conn->prepare("SELECT role_id FROM users WHERE id = ?");
$fromStmt->execute([$from_user_id]);
$fromRoleId = $fromStmt->fetchColumn();

$toStmt = $conn->prepare("SELECT role_id FROM users WHERE id = ?");
$toStmt->execute([$to_user_id]);
$toRoleId = $toStmt->fetchColumn();

$allowed = false;
if ($fromRoleId == 2 && in_array($toRoleId, [3, 4])) {
    $allowed = true;
} elseif ($fromRoleId == 3 && $toRoleId == 4) {
    $allowed = true;
} elseif ($fromRoleId == 4 && $toRoleId == 2) {
    $allowed = true;
}

if (!$allowed) {
    http_response_code(403);
    echo json_encode(["error" => "You are not allowed to give feedback to this user."]);
    exit;
}


if ($fromRoleId == 2) { 
    $checkManager = $conn->prepare("SELECT id FROM users WHERE id = ? AND manager_id = ?");
    $checkManager->execute([$to_user_id, $from_user_id]);
    if ($checkManager->rowCount() === 0) {
        http_response_code(403);
        echo json_encode(["error" => "This employee is not assigned to you."]);
        exit;
    }
}


if ($fromRoleId == 4) { 
    $checkJunior = $conn->prepare("SELECT manager_id FROM users WHERE id = ?");
    $checkJunior->execute([$from_user_id]);
    $assignedManagerId = $checkJunior->fetchColumn();

    if ($to_user_id != $assignedManagerId) {
        http_response_code(403);
        echo json_encode(["error" => "You can only give feedback to your assigned manager."]);
        exit;
    }
}
$submissionStmt = $conn->prepare("
    INSERT INTO feedback_submissions 
    (from_user_id, to_user_id, comment, date, evaluate_more, evaluate_less)
    VALUES (?, ?, ?, ?, ?, ?)
");
$submissionStmt->execute([
    $from_user_id,
    $to_user_id,
    $comment,
    $date,
    $evaluate_more,
    $evaluate_less
]);
$submission_id = $conn->lastInsertId();

$ratingStmt = $conn->prepare("
    INSERT INTO feedback_ratings (submission_id, category_id, rating)
    VALUES (?, ?, ?)
");

$successCount = 0;

foreach ($feedbackItems as $item) {
    $category_name = $item['name'] ?? null;
    $rating = $item['rating'] ?? null;

    if (!$category_name || !$rating) continue;

 
    $catStmt = $conn->prepare("SELECT id FROM categories WHERE name = ?");
    $catStmt->execute([$category_name]);
    $category_id = $catStmt->fetchColumn();

    if ($category_id) {
        $ratingSuccess = $ratingStmt->execute([$submission_id, $category_id, $rating]);
        if ($ratingSuccess) $successCount++;
    }
}

if ($successCount > 0) {
    echo json_encode([
        "message" => "Feedback submitted successfully!",
        "submission_id" => $submission_id,
        "ratings_saved" => $successCount,
        "recalculated_performers" => $data  
    ]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Submission saved, but no ratings inserted."]);
}


$recalculateStmt = $conn->prepare("
  SELECT u.username, ROUND(AVG(fr.rating), 2) AS avg_rating
  FROM feedback_ratings fr
  JOIN feedback_submissions fs ON fs.id = fr.submission_id
  JOIN users u ON u.id = fs.to_user_id
  WHERE u.manager_id = ?
  GROUP BY fs.to_user_id
  ORDER BY avg_rating DESC
");
$recalculateStmt->execute([$from_user_id]);
$data = $recalculateStmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "message" => "Feedback submitted successfully!",
    "submission_id" => $submission_id,
    "ratings_saved" => $successCount,
    "recalculated_performers" => $data
]);
?>