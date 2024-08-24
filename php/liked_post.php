<?php

include './connection/connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  // $operation = $_GET['operation'];
  $json = isset($_GET['json']) ? json_decode($_GET['json'], true) : null;

  $sql = 'SELECT 
            p.post_id, 
            p.post_title, 
            a.username AS post_username, 
            p.post_description, 
            p.time_posted,
            c.comment_id, 
            c.comment_text, 
            ca.username AS comment_username,
            c.comment_time
        FROM 
            tbl_posts p
        LEFT JOIN 
            tbl_comments c ON p.post_id = c.postComment_id
        INNER JOIN 
            tbl_accounts a ON p.postUser_id = a.account_id
        LEFT JOIN 
            tbl_accounts ca ON c.userComment_id = ca.account_id
        WHERE a.username = :username
        ORDER BY 
            p.time_posted DESC, 
            c.comment_time ASC;';

  $stmt = $conn->prepare($sql);

  $stmt->bindParam(':username', $json['username'], PDO:: PARAM_STR);

  $stmt->execute();
  $result = $stmt->rowCount() > 0 ? 1 : 0;

  unset($conn);
  unset($stmt);
  echo json_encode($result);


}