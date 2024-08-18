<?php


header("Content-type: application/json");
header("Access-Control-Allow-Origin: *");

class Posts {
  // function getPosts() {

  //   include 'connection/connection.php';
  //   $sql = "SELECT * FROM `tbl_posts` ORDER BY time_posted DESC";
  //   $stmt = $conn->prepare($sql);
  //   $stmt->execute();
  //   $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
  //   unset($conn);
  //   unset($stmt);
  //   echo json_encode($result);
  // }

  function getPosts() {
    include 'connection/connection.php';

    // SQL query to get posts along with their comments
    $sql = "
        SELECT 
            p.post_id, p.post_title, p.post_username, p.post_description, p.time_posted,
            c.comment_id, c.comment_text, c.comment_username, c.comment_time
        FROM 
            tbl_posts p
        LEFT JOIN 
            tbl_comments c ON p.post_id = c.postComment_id
        ORDER BY 
            p.time_posted DESC, c.comment_time ASC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Group the comments by post
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
    echo json_encode(array_values($posts)); // Convert the associative array back to an indexed array
}

  
  function upload($json) {

    include 'connection/connection.php';

    $sql = "INSERT INTO `tbl_posts` (
        `post_title`,
        `post_username`,
        `post_description`
    )
    VALUES (
        :title,
        :username,
        :content
    )";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':title', $json['post_title']);
    $stmt->bindParam(':username', $json['post_username']);
    $stmt->bindParam(':content', $json['post_description']);
    $stmt->execute();

    $result = $stmt->rowCount() > 0 ? 1 : 0;
    unset($conn);
    unset($stmt);
    return json_encode($result); // Use json_encode to convert the result to JSON
  }

}


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $operation = $_POST['operation'];
  $json = isset($_POST['json']) ? $_POST['json'] : null;
  $json = json_decode($json, true);
}
else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  $operation = $_GET['operation'];
  $json = isset($_GET['json']) ? $_GET['json'] : null;
  $json = json_decode($json, true);
}

$post = new Posts();
switch ($operation) {
  case 'fetch':
    $result = $post->getPosts();
    break;
  case 'upload':
    $post->upload($json);
    break;
  default:
    echo 'Invalid Operation';
    break;
}


