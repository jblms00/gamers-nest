<?php
session_start();
include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $post_id = $_POST['userpostid'];

    $query = "SELECT * FROM user_posted_content WHERE user_content_id = $post_id";
    $result = mysqli_query($con, $query);

    if ($result) {
        while ($query_result_post = mysqli_fetch_assoc($result)) {
            $post = [
                'user_id' => $query_result_post['user_id'],
                'content_id' => $query_result_post['user_content_id'],
                'username' => $query_result_post['username'],
                'user_avatar' => $query_result_post['user_avatar'],
                'user_content' => $query_result_post['user_content'],
                'user_topic' => $query_result_post['user_topic'],
                'likes' => 0,
                'liked_by_user' => false,
                'comments' => []
            ];

            // Query for comments related to the post
            $post_id = $query_result_post['user_content_id'];
            $query_comments = "SELECT * FROM user_contents_comments WHERE user_content_id = '$post_id' ORDER BY user_created_at ASC";
            $result_comments = mysqli_query($con, $query_comments);
            $num_rows = mysqli_num_rows($result_comments);
            $comments = [];

            if ($num_rows > 0) {
                while ($row = mysqli_fetch_assoc($result_comments)) {
                    $comment = [
                        'user_id' => $row['user_id'],
                        'content_id' => $row['user_content_id'],
                        'comment_id' => $row['user_comment_id'],
                        'username' => $row['username'],
                        'user_avatar' => $row['user_avatar'],
                        'comment_text' => $row['comment_text']
                    ];
                    $comments[] = $comment;
                }
            }
            $post['comments'] = $comments;

            // Query for likes related to the post
            $query_likes = "SELECT * FROM user_posts_likes WHERE user_content_id = '$post_id'";
            $result_likes = mysqli_query($con, $query_likes);
            $num_likes = mysqli_num_rows($result_likes);
            $post['likes'] = $num_likes;

            // Check if the user has already liked the post
            $user_id = $user_data['user_id'];
            $query_check_like = "SELECT * FROM user_posts_likes WHERE user_content_id = '$post_id' AND user_id = '$user_id'";
            $result_check_like = mysqli_query($con, $query_check_like);
            $num_likes_by_user = mysqli_num_rows($result_check_like);
            if ($num_likes_by_user > 0) {
                $post['liked_by_user'] = true;
            }

            $data['status'] = 'success';
            $data['posts'][] = $post;
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'Failed to retrieve content details.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>