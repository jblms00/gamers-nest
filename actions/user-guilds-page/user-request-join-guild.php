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

    if ($logged_in_user_id === $current_user_id) {
        $check_guild_query = "SELECT * FROM users_guilds WHERE guild_id = '$guild_id'";
        $check_guild_result = mysqli_query($con, $check_guild_query);
        $fetch_guild = mysqli_fetch_assoc($check_guild_result);
        $guild_name = $fetch_guild['guild_name'];
        $guild_creator_id = $fetch_guild['guild_creator_id'];

        if ($check_guild_result && mysqli_num_rows($check_guild_result)) {
            $request_guild_id = rand(100000, 999999);
            $insert_request_query = "INSERT INTO `user_guild_request`(`request_guild_id`, `guild_id`, `guild_name`, `user_id`, `request_type`, `request_at`) VALUES ('$request_guild_id', '$guild_id', '$guild_name', '$current_user_id', 'requested_to_join_guild', NOw())";
            $insert_request_result = mysqli_query($con, $insert_request_query);

            if ($insert_request_result) {
                $notification_id = rand(100000, 999999);
                $activity_type = 'requested_to_join_guild';

                $sql_notification = "INSERT INTO `user_notifications` (`notification_id`, `user_id`, `activity_type`, `activity_id`, `sender_id`, `timestamp`, `is_read`) VALUES ('$notification_id', '$guild_creator_id', '$activity_type', '$request_guild_id', '$current_user_id', NOW(), 'false')";
                $query_notification = mysqli_query($con, $sql_notification);

                if ($query_notification) {
                    $data['request_guild_id'] = $request_guild_id;
                    $data['message'] = "Thank you for requesting to join.";
                    $data['status'] = "success";
                } else {
                    $data['status'] = "error";
                    $data['message'] = "Failed to send on notification.";
                }

            } else {
                $data['status'] = "error";
                $data['message'] = "Failed to request on guild.";
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