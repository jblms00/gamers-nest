<?php
include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $shared_post_id = $_POST['shared_post_id'];
    $sharedpost_like_id = $_POST['sharedpost_like_id'];
    $user_content_id = $_POST['user_content_id'];
    $user_id = $_POST['user_id'];

    // Check if the user has already liked the shared post
    $sql_check_like = "SELECT * FROM user_shared_posts_likes WHERE shared_post_id = '$shared_post_id' AND user_content_id = '$user_content_id' AND user_id = '$user_id'";
    $query_check_like = mysqli_query($con, $sql_check_like);
    $like_exists = mysqli_num_rows($query_check_like) > 0;

    if ($like_exists) {
        // Unlike the shared post
        $sql_unlike = "DELETE FROM user_shared_posts_likes WHERE shared_post_id = '$shared_post_id' AND user_content_id = '$user_content_id' AND user_id = '$user_id'";
        if ($query_unlike = mysqli_query($con, $sql_unlike)) {
            $sql_count = "SELECT COUNT(*) AS count FROM user_shared_posts_likes WHERE shared_post_id = '$shared_post_id'";

            if ($query_count = mysqli_query($con, $sql_count)) {
                $get_count = mysqli_fetch_assoc($query_count);

                $deleteNotifQuery = "DELETE FROM user_notifications WHERE activity_id = '$sharedpost_like_id' AND sender_id = '$user_id'";

                if ($deleteNotifResult = mysqli_query($con, $deleteNotifQuery)) {
                    $like_count = $get_count['count'];
                    $data['count'] = $like_count;
                    $data['user_id'] = $user_id;
                    $data['user_content_id'] = $user_content_id;
                    $data['shared_post_id'] = $shared_post_id;
                    $data['status'] = 'success';
                }

            }
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Error removing like';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'You have not liked this shared post.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>