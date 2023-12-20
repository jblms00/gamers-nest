<?php
include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_content_id = $_POST['user_content_id'];
    $user_id = $_POST['user_id'];

    // Check if the user has already liked the post
    $sql_check_like = "SELECT * FROM user_posts_likes WHERE user_content_id = '$user_content_id' AND user_id = '$user_id'";
    $query_check_like = mysqli_query($con, $sql_check_like);
    $like_exists = mysqli_num_rows($query_check_like) > 0;

    if ($like_exists) {
        $data['status'] = 'error';
        $data['message'] = 'You have already liked this post.';
    } else {
        // Get the owner of the post
        $sql_get_owner = "SELECT user_id FROM user_posted_content WHERE user_content_id = '$user_content_id'";
        $query_get_owner = mysqli_query($con, $sql_get_owner);

        if ($query_get_owner && mysqli_num_rows($query_get_owner) > 0) {
            $row = mysqli_fetch_assoc($query_get_owner);
            $post_owner_id = $row['user_id'];

            $like_id = rand(100000, 999999);

            $sql_insertion = "INSERT INTO `user_posts_likes`(`user_like_id`, `user_content_id`, `user_id`) VALUES ('$like_id','$user_content_id','$user_id')";

            if ($query_insertion = mysqli_query($con, $sql_insertion)) {
                $sql_count = "SELECT COUNT(*) AS count FROM user_posts_likes WHERE user_content_id = '$user_content_id'";
                $query_count = mysqli_query($con, $sql_count);
                $get_count = mysqli_fetch_assoc($query_count);
                $like_count = $get_count['count'];

                $data['count'] = $like_count;
                $data['user_id'] = $user_id;
                $data['user_content_id'] = $user_content_id;
                $data['like_id'] = $like_id;
                $data['status'] = 'success';

                // Insert notification into the notifications table only if the user is not the post owner
                if ($user_id !== $post_owner_id) {
                    $notification_id = rand(100000, 999999);
                    $activity_type = 'like_post';
                    $timestamp = date('Y-m-d H:i:s');

                    $sql_notification = "INSERT INTO `user_notifications` (`notification_id`, `user_id`, `activity_type`, `activity_id`, `sender_id`, `timestamp`, `is_read`) VALUES ('$notification_id', '$post_owner_id', '$activity_type', '$like_id', '$user_id', '$timestamp', 'false')";
                    $query_notification = mysqli_query($con, $sql_notification);

                    if (!$query_notification) {
                        $data['status'] = 'error';
                        $data['message'] = 'Error adding notification';
                    }
                }
            } else {
                $data['status'] = 'error';
                $data['message'] = 'Error adding like';
            }
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Error retrieving post owner information';
        }
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>