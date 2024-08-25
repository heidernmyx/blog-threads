<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include './connection/connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  // $operation = $_GET['operation'];
  $json = isset($_GET['operation']) ? json_decode($_GET['operation'], true) : null;

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
  INNER JOIN 
      tbl_votes v ON p.post_id = v.post_id  -- Join on post_id to filter liked posts
  WHERE 
      v.user_id = :session_id  -- Replace 12 with the dynamic user_id value you want to filter by
  ORDER BY 
      p.time_posted DESC, 
      c.comment_time ASC';

  $stmt = $conn->prepare($sql);
  $stmt->bindParam(':session_id', $_GET['session_id'], PDO:: PARAM_STR);

  $stmt->execute();
  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $posts = [];
    foreach ($result as $row) {
      $post_id = $row['post_id'];
      if (!isset($posts[$post_id])) {
        $posts[$post_id] = [
          'post_id' => $row['post_id'],
          'post_title' => $row['post_title'],
          'post_username' => $row['post_username'],
          'post_description' => $row['post_description'],
          'time_posted' => $row['time_posted'],
          'post_comments' => [],
        ];
      }

      if (!empty($row['comment_id'])) {
        $posts[$post_id]['post_comments'][] = [
          'comment_id' => $row['comment_id'],
          'comment_text' => $row['comment_text'],
          'comment_username' => $row['comment_username'],
          'comment_time' => $row['comment_time'],
        ];
      }
    }

  unset($conn);
  unset($stmt);
  echo json_encode(array_values($posts));


}