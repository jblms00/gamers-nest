<?php
session_start();
include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$currentUser = $user_data['user_id'];

$data = [
    'status' => ''
];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $user_id = $_POST['user_id']; // User ID of the user who posted
    $user_content_id = $_POST['post_id'];
    $shared_text_content = $_POST['shared_text_content'];
    $shared_post_id = rand(100000, 999999);

    // Query to get post data [who posted]
    $query_post = "SELECT * FROM user_posted_content WHERE user_id = '$user_id' AND user_content_id = '$user_content_id'";
    $query_post_result = mysqli_query($con, $query_post);

    if ($query_post_result && mysqli_num_rows($query_post_result) > 0) {
        $fetch_post_result = mysqli_fetch_assoc($query_post_result);
        $username = $fetch_post_result['username'];
        $user_avatar = $fetch_post_result['user_avatar'];
        $user_content = $fetch_post_result['user_content'];
        $user_topic = $fetch_post_result['user_topic'];
        $media_upload = $fetch_post_result['media_upload'];
        $media_orientation = $fetch_post_result['media_orientation'];

        $query_currentUser = "SELECT * FROM users_accounts WHERE user_id = '$currentUser'";
        $query_currentUser_result = mysqli_query($con, $query_currentUser);

        if ($fetch_CurrentUser = mysqli_fetch_assoc($query_currentUser_result)) {
            $currentUserAvatar = $fetch_CurrentUser['user_avatar'];
            $currentUserName = $fetch_CurrentUser['username'];

            $query_insert = "INSERT INTO `user_shared_post`(`shared_post_id`, `user_id`, `user_content_id`, `shared_text_content`) VALUES ('$shared_post_id','$currentUser','$user_content_id','$shared_text_content')";
            $query_insert_result = mysqli_query($con, $query_insert);

            if ($query_insert_result) {
                // Insert notification into the notifications table only if the user is not the post owner
                if ($currentUser !== $user_id) {
                    $notification_id = rand(100000, 999999);
                    $activity_type = 'share_post';
                    $timestamp = date('Y-m-d H:i:s');

                    $sql_notification = "INSERT INTO `user_notifications` (`notification_id`, `user_id`, `activity_type`, `activity_id`, `sender_id`, `timestamp`, `is_read`) VALUES ('$notification_id', '$user_id', '$activity_type', '$shared_post_id', '$currentUser', '$timestamp', 'false')";

                    if ($query_notification = mysqli_query($con, $sql_notification)) {
                        $deleteNotifQuery = "DELETE FROM user_notifications WHERE activity_id = '$shared_post_id' AND sender_id = '$currentUser'";
                        $deleteNotifResult = mysqli_query($con, $deleteNotifQuery);
                    }

                    if (!$query_notification) {
                        $data['status'] = 'error';
                        $data['message'] = 'Error adding notification';
                    }
                }

                $data['current_user_avatar'] = $currentUserAvatar;
                $data['current_user_name'] = $currentUserName;
                $data['shared_text_content'] = $shared_text_content;
                $data['shared_post_id'] = $shared_post_id;
                $data['user_content_id'] = $user_content_id;

                $data['current_user_id'] = $currentUser;
                $data['user_id'] = $user_id;
                $data['username'] = $username;
                $data['user_avatar'] = $user_avatar;
                $data['user_content'] = $user_content;
                $data['user_topic'] = $user_topic;
                $data['media_upload'] = $media_upload;
                $data['media_orientation'] = $media_orientation;
                $data['status'] = 'success';
            } else {
                $data['status'] = 'error';
                $data['message'] = 'Error inserting into the database.';
            }

        } else {
            $data['status'] = 'error';
            $data['message'] = 'Error fetching current user data.';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'No posts found.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>