<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $current_user_id = $_POST['current_user_id'];
    $guild_post_id = $_POST['guild_post_id'];
    $guild_name = $_POST['guild_name'];
    $guild_id = $_POST['guild_id'];
    $user_comment = mysqli_real_escape_string($con, $_POST['user_comment']);

    if ($logged_in_user_id === $current_user_id) {
        $get_post_query = "SELECT * FROM user_guild_posts WHERE guild_post_id = '$guild_post_id' AND guild_id = '$guild_id'";
        $get_post_result = mysqli_query($con, $get_post_query);

        if ($get_post_result && mysqli_num_rows($get_post_result) > 0) {
            $fetch_post = mysqli_fetch_assoc($get_post_result);
            $post_owner_id = $fetch_post['user_id'];
            if (!empty($user_comment)) {
                $commentor_username = $user_data['username'];
                $commentor_user_avatar = $user_data['user_avatar'];

                $user_comment_id = rand(100000, 999999);
                $insert_comment_query = "INSERT INTO user_contents_comments (user_comment_id, user_id, username, user_avatar, user_content_id, comment_text) VALUES ('$user_comment_id', '$current_user_id', '$commentor_username', '$commentor_user_avatar', '$guild_post_id', '$user_comment')";
                $insert_comment_result = mysqli_query($con, $insert_comment_query);

                if ($insert_comment_result) {
                    if ($current_user_id !== $post_owner_id) {
                        $notification_id = rand(100000, 999999);
                        $activity_type = 'comment_on_guild_post';
                        $timestamp = date('Y-m-d H:i:s');

                        $sql_notification = "INSERT INTO user_notifications (notification_id, user_id, activity_type, activity_id, sender_id, timestamp, is_read) VALUES ('$notification_id', '$post_owner_id', '$activity_type', '$user_comment_id', '$current_user_id', '$timestamp', 'false')";
                        $query_notification = mysqli_query($con, $sql_notification);

                        if (!$query_notification) {
                            $data['status'] = 'error';
                            $data['message'] = 'Error adding notification';
                        }
                    }

                    $data['current_user_id'] = $current_user_id;
                    $data['user_comment_id'] = $user_comment_id;
                    $data['commentor_username'] = $commentor_username;
                    $data['commentor_user_avatar'] = $commentor_user_avatar;
                    $data['status'] = 'success';
                    $data['message'] = 'Comment added successfully';
                } else {
                    $data['status'] = "error";
                    $data['message'] = "Error adding comment.";
                }
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "No post found.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "User id does not match.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);