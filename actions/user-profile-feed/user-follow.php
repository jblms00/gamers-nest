<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $follower_id = $_POST['follower_id'];
    $following_id = $_POST['following_id'];

    if ($logged_in_user_id === $follower_id) {
        $check_users_query = "SELECT * FROM users_accounts WHERE user_id = '$follower_id' OR user_id = '$following_id'";
        $check_users_result = mysqli_query($con, $check_users_query);

        if ($check_users_result && mysqli_num_rows($check_users_result) > 0) {
            $follow_id = rand(100000, 999999);

            $follow_query = "INSERT INTO `user_follows`(`follow_id`, `follower_id`, `following_id`, `follow_timestamp`) VALUES ('$follow_id','$follower_id','$following_id',NOW())";
            $follow_result = mysqli_query($con, $follow_query);

            if ($follow_result) {
                $notification_id = rand(100000, 999999);
                $activity_type = 'follows_you';
                $timestamp = date('Y-m-d H:i:s');

                $sql_notification = "INSERT INTO user_notifications (notification_id, user_id, activity_type, activity_id, sender_id, timestamp, is_read) VALUES ('$notification_id', '$following_id', '$activity_type', '$follow_id', '$follower_id', '$timestamp', 'false')";
                $query_notification = mysqli_query($con, $sql_notification);

                $data['follow_id'] = $follow_id;
                $data['message'] = "True.";
                $data['status'] = "success";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Users doesn't exist.";
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