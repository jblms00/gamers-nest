<?php
include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $like_post_id = $_POST['like_post_id'];
    $user_content_id = $_POST['user_content_id'];
    $user_id = $_POST['user_id'];

    // Check if the user has already liked the post
    $sql_check_like = "SELECT * FROM user_posts_likes WHERE user_content_id = '$user_content_id' AND user_id = '$user_id'";
    $query_check_like = mysqli_query($con, $sql_check_like);
    $like_exists = mysqli_num_rows($query_check_like) > 0;

    if ($like_exists) {
        // Unlike the post
        $sql_unlike = "DELETE FROM user_posts_likes WHERE user_content_id = '$user_content_id' AND user_id = '$user_id'";
        if ($query_unlike = mysqli_query($con, $sql_unlike)) {
            $sql_count = "SELECT COUNT(*) AS count FROM user_posts_likes WHERE user_content_id = '$user_content_id'";
            $query_count = mysqli_query($con, $sql_count);
            $get_count = mysqli_fetch_assoc($query_count);
            $like_count = $get_count['count'];

            // Remove the corresponding notification from the notifications table
            $sql_remove_notification = "DELETE FROM user_notifications WHERE activity_id = '$like_post_id' AND sender_id = '$user_id'";
            $query_remove_notification = mysqli_query($con, $sql_remove_notification);

            $data['count'] = $like_count;
            $data['user_id'] = $user_id;
            $data['user_content_id'] = $user_content_id;
            $data['status'] = 'success';


            if (!$query_remove_notification) {
                $data['status'] = 'error';
                $data['message'] = 'Error removing notification';
            }
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Error removing like';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'You have not liked this post.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>