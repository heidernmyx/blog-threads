<?php

header("Content-type: application/json");
header("Access-Control-Allow-Origin: *");

class Comment {
  
    public function getComments($json) {
      include 'connection/connection.php';
  
      $sql = "SELECT * FROM `tbl_comments` WHERE post_id = :post_id";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(':post_id', $json['post_id']);
      $stmt->execute();
      $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  
      unset($conn);
      unset($stmt);
      return json_encode($result);
    }
  
    public function addComment($json) {
      include 'connection/connection.php';
      // echo $json;
      // die;
  

$sql = "INSERT INTO `tbl_comments` (
          `postComment_id`,
          `comment_text`,
          `comment_username`
      )
      VALUES (
          :post_id,
          :comment_text,
          :comment_username
      )";
      $stmt = $conn->prepare($sql);
      $stmt->bindParam(':post_id', $json['post_id'], PDO::PARAM_INT);
      $stmt->bindParam(':comment_text', $json['comment_text'], PDO::PARAM_STR);
      $stmt->bindParam(':comment_username', $json['comment_username'], PDO::PARAM_STR);
      
      $stmt->execute();
      
      $result = $stmt->rowCount() > 0 ? 1 : 0;
      unset($conn);
      unset($stmt);
      echo json_encode($result);
    }
}


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $operation = $_POST['operation'];
  $json = isset($_POST['json']) ? $_POST['json'] : null;
  $json = json_decode($json, true);
  // $json = isset($_POST['json']) ? json_decode($_POST['json'], true) : null;
  // json_decode($json, true);
  // echo $json;
  // die;

}
else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  $operation = $_GET['operation'];
  $json = isset($_GET['json']) ? $_GET['json'] : null;
  $json = json_decode($json, true);
  // json_decode($json, true);
  
}

switch ($operation) {
  case 'fetch':
    $comment = new Comment();
    $result = $comment->getComments($json);
    break;
  case 'comment':
    $comment = new Comment();
    $result = $comment->addComment($json);
    break;
}