<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'database.php';

try {
    $stmt = $conn->query("SELECT id, name FROM roles");
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($roles);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}