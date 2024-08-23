<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

class Vote {

  function getUserVote($json) {
    include 'connection/connection.php';

    $query = $conn->prepare("SELECT vote_type FROM tbl_votes WHERE post_id = :post_id AND user_id = :user_id");
    $query->bindParam(':post_id', $post_id, PDO::PARAM_INT);
    $query->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $query->execute();

    if ($query->rowCount() > 0) {
      $result = $query->fetch(PDO::FETCH_ASSOC);
      echo json_encode(['vote_type' => $result['vote_type']]);
    } else {
      echo json_encode(['vote_type' => null]);
    }
  }
  function upVotePost($json) {
    include 'connection/connection.php';

    $post_id = $json['post_id'];
    $user_id = $json['user_id'];

    // Check if the user has already voted on this post
    $checkVote = $conn->prepare("SELECT vote_type FROM tbl_votes WHERE post_id = :post_id AND user_id = :user_id");
    $checkVote->bindParam(':post_id', $post_id);
    $checkVote->bindParam(':user_id', $user_id);
    $checkVote->execute();

    if ($checkVote->rowCount() > 0) {
        $existingVote = $checkVote->fetch(PDO::FETCH_ASSOC)['vote_type'];
        if ($existingVote === 'upvote') {
            // If already upvoted, remove the vote
            $removeVote = $conn->prepare("DELETE FROM tbl_votes WHERE post_id = :post_id AND user_id = :user_id");
            $removeVote->bindParam(':post_id', $post_id);
            $removeVote->bindParam(':user_id', $user_id);
            $removeVote->execute();

            echo json_encode(['status' => 'success', 'message' => 'Upvote removed']);
        } else {
            // If downvoted, switch to upvote
            $switchVote = $conn->prepare("UPDATE tbl_votes SET vote_type = 'upvote' WHERE post_id = :post_id AND user_id = :user_id");
            $switchVote->bindParam(':post_id', $post_id);
            $switchVote->bindParam(':user_id', $user_id);
            $switchVote->execute();

            echo json_encode(['status' => 'success', 'message' => 'Vote switched to upvote']);
        }
    } else {
        // Add the upvote
        $upvote = $conn->prepare("INSERT INTO tbl_votes (post_id, user_id, vote_type) VALUES (:post_id, :user_id, 'upvote')");
        $upvote->bindParam(':post_id', $post_id);
        $upvote->bindParam(':user_id', $user_id);
        $upvote->execute();

        echo json_encode(['status' => 'success', 'message' => 'Upvoted successfully']);
    }
  }

  function downVotePosts($json) {
    include 'connection/connection.php';

    $post_id = $json['post_id'];
    $user_id = $json['user_id'];

    // Check if the user has already voted on this post
    $checkVote = $conn->prepare("SELECT vote_type FROM tbl_votes WHERE post_id = :post_id AND user_id = :user_id");
    $checkVote->bindParam(':post_id', $post_id);
    $checkVote->bindParam(':user_id', $user_id);
    $checkVote->execute();

    if ($checkVote->rowCount() > 0) {
        $existingVote = $checkVote->fetch(PDO::FETCH_ASSOC)['vote_type'];
        if ($existingVote === 'downvote') {
            // If already downvoted, remove the vote
            $removeVote = $conn->prepare("DELETE FROM tbl_votes WHERE post_id = :post_id AND user_id = :user_id");
            $removeVote->bindParam(':post_id', $post_id);
            $removeVote->bindParam(':user_id', $user_id);
            $removeVote->execute();

            echo json_encode(['status' => 'success', 'message' => 'Downvote removed']);
        } else {
            // If upvoted, switch to downvote
            $switchVote = $conn->prepare("UPDATE tbl_votes SET vote_type = 'downvote' WHERE post_id = :post_id AND user_id = :user_id");
            $switchVote->bindParam(':post_id', $post_id);
            $switchVote->bindParam(':user_id', $user_id);
            $switchVote->execute();

            echo json_encode(['status' => 'success', 'message' => 'Vote switched to downvote']);
        }
    } else {
        // Add the downvote
        $downvote = $conn->prepare("INSERT INTO tbl_votes (post_id, user_id, vote_type) VALUES (:post_id, :user_id, 'downvote')");
        $downvote->bindParam(':post_id', $post_id);
        $downvote->bindParam(':user_id', $user_id);
        $downvote->execute();

        echo json_encode(['status' => 'success', 'message' => 'Downvoted successfully']);
    }
  }

  function fetchPostVoteList($json) {
    
    include './connection/connection.php';

    $sql = "SELECT
        tbl_accounts.username,
        `vote_type`
    FROM
        `tbl_votes`
    INNER JOIN tbl_accounts ON tbl_accounts.account_id = tbl_votes.user_id
    WHERE post_id = :post_id";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':post_id', $json['post_id'], PDO::PARAM_INT);
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    unset($conn);
    unset($stmt);

    echo json_encode($result);
  }

}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $operation = $_POST['operation'];
  $json = isset($_POST['json']) ? json_decode($_POST['json'], true) : null;
} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  $operation = $_GET['operation'];
  $json = isset($_GET['json']) ? json_decode($_GET['json'], true) : null;
}

$vote = new Vote();
switch ($operation) {
  case 'getVote':
    $vote->getUserVote($json);
    break;
  case 'upvote':
    $vote->upVotePost($json);
    break;
  case 'downvote':
    $vote->downVotePosts($json);
    break;
  case 'fetchPostVoteList':
    $vote->fetchPostVoteList($json);
    break;
  default:
    echo json_encode(['status' => 'error', 'message' => 'Invalid operation']);
    break;
}
?>
