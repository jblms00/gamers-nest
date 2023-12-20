<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $current_user_id = $_POST['current_user_id'];
    $guild_id = $_POST['guild_id'];
    $join_request_id = $_POST['join_request_id'];

    if ($logged_in_user_id === $current_user_id) {
        $check_guild_query = "SELECT * FROM users_guilds WHERE guild_id = '$guild_id'";
        $check_guild_result = mysqli_query($con, $check_guild_query);

        if ($check_guild_result && mysqli_num_rows($check_guild_result) > 0) {
            $check_request_query = "SELECT * FROM user_guild_request WHERE request_guild_id = '$join_request_id' AND guild_id = '$guild_id'";
            $check_request_result = mysqli_query($con, $check_request_query);

            if ($check_guild_result && mysqli_num_rows($check_guild_result) > 0) {
                $remove_request_query = "DELETE FROM `user_guild_request` WHERE request_guild_id = '$join_request_id' AND guild_id = '$guild_id'";
                $remove_request_result = mysqli_query($con, $remove_request_query);

                $remove_notification_query = "DELETE FROM `user_notifications` WHERE sender_id = '$current_user_id' AND activity_id = '$join_request_id'";
                $remove_notification_result = mysqli_query($con, $remove_notification_query);

                if ($remove_request_result && $remove_notification_result) {
                    $data['status'] = "success";
                    $data['message'] = "Guild request has been removed.";
                } else {
                    $data['status'] = "error";
                    $data['message'] = "Error removing guild request.";
                }
            } else {
                $data['status'] = "error";
                $data['message'] = "No guild request found.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "No guild found.";
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