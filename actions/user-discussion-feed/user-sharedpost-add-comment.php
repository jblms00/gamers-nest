<?php
session_start();
include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);

$data = [];
$data['status'] = '';

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $sharedpost_comment_id = rand(100000, 999999);
    $shared_post_id = $_POST['shared_post_id'];
    $user_id = $user_data['user_id'];
    $user_content_id = $_POST['user_content_id'];
    $user_comment = mysqli_real_escape_string($con, $_POST['comment_text']);

    $query = "SELECT * FROM users_accounts WHERE user_id = '$user_id'";
    $result = mysqli_query($con, $query);
    $row = mysqli_fetch_assoc($result);
    $username = $row['username'];
    $user_avatar = $row['user_avatar'];

    if ($result && mysqli_num_rows($result) > 0) {
        $query_posts = "SELECT * FROM user_posted_content WHERE user_id = '$user_id'";
        $result_posts = mysqli_query($con, $query_posts);

        if (!empty($user_comment)) {
            $query = "INSERT INTO `user_sharedpost_comments`(`sharedpost_comment_id`, `shared_post_id`, `user_id`, `user_content_id`, `username`, `user_avatar`, `comment_text`) VALUES ('$sharedpost_comment_id','$shared_post_id','$user_id','$sharedpost_comment_id','$username','$user_avatar','$user_comment')";

            if (mysqli_query($con, $query)) {

                $sql_get_owner = "SELECT user_id FROM user_shared_post WHERE shared_post_id = '$shared_post_id'";
                $query_get_owner = mysqli_query($con, $sql_get_owner);
                $row = mysqli_fetch_assoc($query_get_owner);
                $post_owner_id = $row['user_id'];

                if ($user_id !== $post_owner_id) {
                    $notification_id = rand(100000, 999999);
                    $activity_type = 'comment_on_sharedpost';
                    $timestamp = date('Y-m-d H:i:s');

                    $sql_notification = "INSERT INTO user_notifications (notification_id, user_id, activity_type, activity_id, sender_id, timestamp, is_read) VALUES ('$notification_id', '$post_owner_id', '$activity_type', '$sharedpost_comment_id', '$user_id', '$timestamp', 'false')";
                    $query_notification = mysqli_query($con, $sql_notification);

                    if (!$query_notification) {
                        $data['status'] = 'error';
                        $data['message'] = 'Error adding notification';
                    }
                }
                $data['sharedpost_comment_id'] = $sharedpost_comment_id;
                $data['shared_post_id'] = $shared_post_id;
                $data['user_id'] = $user_id;
                $data['user_content_id'] = $user_content_id;
                $data['user_comment'] = $user_comment;
                $data['username'] = $username;
                $data['user_avatar'] = $user_avatar;

                $data['status'] = 'success';
                $data['message'] = 'Comment added successfully';
            } else {
                $data['status'] = 'error';
                $data['message'] = 'Error creating comment.';
            }
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'User not found.';
    }
}

echo json_encode($data);