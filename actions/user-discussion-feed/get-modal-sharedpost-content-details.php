<?php
session_start();
include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $sharedpost_id = $_POST['sharedpost_id'];
    $user_id = $user_data['user_id'];

    $query_sharedpost = "SELECT * FROM user_shared_post WHERE shared_post_id = $sharedpost_id";

    if ($result_sharedpost = mysqli_query($con, $query_sharedpost)) {
        $query_user = "SELECT * FROM users_accounts WHERE user_id = '$user_id'";
        $result_user = mysqli_query($con, $query_user);
        $fetch_result_user = mysqli_fetch_assoc($result_user);

        while ($fetch_result_sharedpost = mysqli_fetch_assoc($result_sharedpost)) {
            $user_content_id = $fetch_result_sharedpost['user_content_id'];

            $query_post = "SELECT * FROM user_posted_content WHERE user_content_id = $user_content_id";
            $result_post = mysqli_query($con, $query_post);
            $fetch_result_post = mysqli_fetch_assoc($result_post);

            $query_shared_user = "SELECT * FROM users_accounts WHERE user_id = '{$fetch_result_sharedpost['user_id']}'";
            $result_shared_user = mysqli_query($con, $query_shared_user);
            $fetch_result_shared_user = mysqli_fetch_assoc($result_shared_user);

            $post = [
                'post_content' => $fetch_result_post['user_content'],
                'post_topic' => $fetch_result_post['user_topic'],
                'post_username' => $fetch_result_post['username'],
                'post_user_avatar' => $fetch_result_post['user_avatar'],
                'post_user_id' => $fetch_result_post['user_id'],

                'current_user_avatar' => $user_data['user_avatar'],
                'current_user_id' => $user_data['user_id'],

                'sharedpost_user_avatar' => $fetch_result_shared_user['user_avatar'],
                'sharedpost_username' => $fetch_result_shared_user['username'],

                'shared_post_id' => $fetch_result_sharedpost['shared_post_id'],
                'user_id' => $fetch_result_sharedpost['user_id'],
                'content_id' => $user_content_id,
                'shared_text_content' => $fetch_result_sharedpost['shared_text_content'],
                'sharedpost_likes' => 0,
                'sharedpost_liked_by_user' => false,
                'comments' => []
            ];

            $shared_post_id = $fetch_result_sharedpost['shared_post_id'];
            $query_comments = "SELECT * FROM user_sharedpost_comments WHERE shared_post_id = '$shared_post_id' ORDER BY comment_at DESC";
            $result_comments = mysqli_query($con, $query_comments);
            $num_rows = mysqli_num_rows($result_comments);
            $comments = [];

            if ($num_rows > 0) {
                while ($row = mysqli_fetch_assoc($result_comments)) {
                    $comment = [
                        'sharedpost_comment_id' => $row['sharedpost_comment_id'],
                        'shared_post_id' => $row['shared_post_id'],
                        'shared_user_id' => $row['user_id'],
                        'user_id' => $row['user_id'],
                        'user_content_id' => $row['user_content_id'],
                        'username' => $row['username'],
                        'user_avatar' => $row['user_avatar'],
                        'comment_text' => $row['comment_text']
                    ];
                    $comments[] = $comment;
                }
            }
            $post['comments'] = $comments;

            $query_likes = "SELECT * FROM user_shared_posts_likes WHERE shared_post_id = '$shared_post_id'";
            $result_likes = mysqli_query($con, $query_likes);
            $num_likes = mysqli_num_rows($result_likes);
            $post['sharedpost_likes'] = $num_likes;

            $query_check_like = "SELECT * FROM user_shared_posts_likes WHERE shared_post_id = '$shared_post_id' AND user_id = '$user_id'";
            $result_check_like = mysqli_query($con, $query_check_like);
            $num_likes_by_user = mysqli_num_rows($result_check_like);
            if ($num_likes_by_user > 0) {
                $post['sharedpost_liked_by_user'] = true;
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