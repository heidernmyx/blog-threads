<?php

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");


class Accounts {
  public function addAccount($json) {

    include "../php/connection/connection.php";

    $sql = "INSERT INTO `tbl_accounts`(
        `username`,
        `password`,
        `fname`,
        `lname`,
        `email`,
        `birthdate`,
        `gender`
    )
    VALUES(
        :username,
        :password,
        :fname,
        :lname,
        :email,
        :birthdate,
        :gender
    )";

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':username', $json['username'], PDO::PARAM_STR);
    $stmt->bindParam(':password', $json['password'], PDO::PARAM_STR);
    $stmt->bindParam(':fname', $json['fname'], PDO::PARAM_STR);
    $stmt->bindParam(':lname', $json['lname'], PDO::PARAM_STR);
    $stmt->bindParam(':email', $json['email'], PDO::PARAM_STR);
    $stmt->bindParam(':birthdate', $json['birthdate'], PDO::PARAM_STR);
    $stmt->bindParam(':gender', $json['gender'], PDO::PARAM_STR);

    $stmt->execute();
    $result = $stmt->rowCount() > 0 ? 1 :0;

    unset($conn);
    unset($stmt);

    if ($result == 1) {
      echo json_encode(['message' => 'Account successfully added']);
    }
    else if ($result == 0) {
      echo json_encode(['error' => 'An error occured while creating account']);
    }

  }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $operation = $_POST['operation'];
  $json = isset($_POST['json']) ? json_decode($_POST['json'], true) : null;
}
else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  $operation = $_GET['operation'];
  $json = isset($_GET['json']) ? json_decode($_GET['json'], true) : null;
}

$accounts = new Accounts();
switch ($operation) {
  case 'addAccount':
    $condition = usernameCheck();
    if ($condition) {
      echo json_encode(['error' => 'Username already exists']);
    }
    else {
      $accounts->addAccount($json);
    }
    break;
  // case
}

function usernameCheck () {
  include "../php/connection/connection.php";
  
  $sql = 'SELECT `username` FROM `tbl_accounts` WHERE username = :username';
  $stmt = $conn->prepare($sql);
  $json = json_decode($_POST['json'], true);
  $stmt->bindParam(':username', $json['username'], PDO::PARAM_STR);
  $stmt->execute();
  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  if (!empty($result)) {


    unset($conn);
    unset($stmt);
    return true;
  }
}