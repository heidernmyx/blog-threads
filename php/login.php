<?php


header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include "./connection/connection.php";




if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $operation = $_POST['operation'];
  $json = isset($_POST['json']) ? json_decode($_POST['json'], true): null;

  $sql = "SELECT
    `username`,
    `password`
    FROM
        `tbl_accounts`
    WHERE
        username = :username
        AND
        password = :password;";

    $stmt= $conn->prepare($sql);

    $stmt->bindParam(':username', $json['username'], PDO::PARAM_STR);
    $stmt->bindParam(':password', $json['password'], PDO::PARAM_STR);

    $stmt->execute();
    $return = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($return)) {
      echo json_encode(['' => 'Login Successful']);
    } 
    else {
      echo json_encode(['' => 'Invalid Credentials']);
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