<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json");

include 'database.php';

$manager_id = $_GET['manager_id'] ?? null;

if (!$manager_id) {
  echo json_encode(['error' => 'Missing manager_id']);
  exit;
}

$stmt = $conn->prepare("SELECT COUNT(*) AS total FROM users WHERE manager_id = ?");
$stmt->execute([$manager_id]);
$count = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode(['total' => $count['total'] ?? 0]);
