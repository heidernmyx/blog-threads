<?php


header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include "./connection/connection.php";



if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $operation = isset($_POST['operation'])? json_decode($operation, true) : null;
  $json = isset($_POST['json']) ? json_decode($_POST['json'], true): null;

  $sql = "SELECT
    `account_id`,
    `username`,
    `password`,
    `email`
    FROM
        `tbl_accounts`
    WHERE
        username = :username";

    $stmt= $conn->prepare($sql);

    $stmt->bindParam(':username', $json['username'], PDO::PARAM_STR);
    // $stmt->bindParam(':password', $json['password'], PDO::PARAM_STR);

    $stmt->execute();
    $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);

    unset($conn);
    unset($stmt);

    if (!empty($returnValue)) {
      echo json_encode($returnValue[0]);
    } 
    else {
      echo json_encode(null);
    }

// else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
//   $operation = $_GET['operation'];
//   $json = isset($_GET['json']) ? json_decode($_GET['json'], true): null;
// }


// switch ($operation) {
//   case 'login':
//     // login();
//     break;
}