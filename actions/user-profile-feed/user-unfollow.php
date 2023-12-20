<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $follow_id = $_POST['follow_id'];
    $follower_id = $_POST['follower_id'];
    $following_id = $_POST['following_id'];

    if ($logged_in_user_id === $follower_id) {
        $check_users_query = "SELECT * FROM users_accounts WHERE user_id = '$follower_id' OR user_id = '$following_id' ";
        $check_users_result = mysqli_query($con, $check_users_query);

        if ($check_users_result && mysqli_num_rows($check_users_result) > 0) {

            $unfollow_query = "DELETE FROM `user_follows` WHERE follow_id = '$follow_id'";
            $unfollow_result = mysqli_query($con, $unfollow_query);

            $data['message'] = "True.";
            $data['status'] = "success";
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