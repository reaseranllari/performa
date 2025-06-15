<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(E_ALL);

include '../database.php'; 

$junior_id = isset($_GET['junior_id'])
           ? intval($_GET['junior_id'])
           : 0;
if (!$junior_id) {
  http_response_code(400);
  echo json_encode(["error" => "junior_id is required"]);
  exit;
}

$allCategories = [
  "Communication","Teamwork","Adaptability","Problem-solving",
  "Reliability","Accountability","Punctuality","Work Ethic",
  "Initiative","Leadership","Decision Making","Delegation"
];

$stmt1 = $conn->prepare("
  SELECT c.name AS category, ROUND(AVG(fr.rating),2) AS avg_rating
  FROM feedback_ratings fr
  JOIN feedback_submissions fs ON fr.submission_id = fs.id
  JOIN categories c ON fr.category_id = c.id
  WHERE fs.to_user_id = ?
  GROUP BY c.name
");
$stmt1->execute([$junior_id]); 
$got = $stmt1->fetchAll(PDO::FETCH_KEY_PAIR);  

$stmt2 = $conn->prepare("
  SELECT DATE_FORMAT(fs.date,'%Y-%m') AS month, COUNT(*) AS count
  FROM feedback_submissions fs
  WHERE fs.to_user_id = ?
  GROUP BY month
  ORDER BY month
");
$stmt2->execute([$junior_id]); 
$byMonth = $stmt2->fetchAll(PDO::FETCH_ASSOC); 


$byCategory = [];
foreach ($allCategories as $cat) {
  $byCategory[] = [
    "category"   => $cat,
    "avg_rating" => isset($got[$cat]) ? floatval($got[$cat]) : 0
  ];
}

echo json_encode([
  "byCategory" => $byCategory,
  "byMonth"    => $byMonth
]);
?>