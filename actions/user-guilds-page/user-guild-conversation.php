<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];
$logged_in_user_avatar = $user_data['user_avatar'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $message_id = rand(100000, 999999);
    $current_user_id = $_POST['current_user_id'];
    $guild_id = $_POST['guild_id'];
    $guild_name = $_POST['guild_name'];
    $guild_convo_room_id = $_POST['guild_convo_room_id'];
    $userg_message_input = mysqli_real_escape_string($con, $_POST['userg_message_input']);

    if ($logged_in_user_id === $current_user_id) {
        $check_guild_query = "SELECT guild_creator_id, guild_members, users_ids FROM users_guilds WHERE guild_id = '$guild_id' AND guild_name = '$guild_name'";
        $check_guild_result = mysqli_query($con, $check_guild_query);

        if ($check_guild_result && mysqli_num_rows($check_guild_result) > 0) {
            $fetch_all_members = mysqli_fetch_assoc($check_guild_result);

            $guild_creator_id = $fetch_all_members['guild_creator_id'];
            $users_ids = $fetch_all_members['users_ids'];
            if (!is_array($users_ids)) {
                $users_ids = explode(",", $users_ids);
            }

            if ($current_user_id === $guild_creator_id) {
                foreach ($users_ids as $user_id) {
                    $notification_id = rand(100000, 999999);
                    $activity_type = 'send_guild_message';

                    $send_notif_members_query = "INSERT INTO `user_notifications` (`notification_id`, `user_id`, `activity_type`, `activity_id`, `sender_id`, `timestamp`, `is_read`) VALUES ('$notification_id', '$user_id', '$activity_type', '$message_id', '$current_user_id', NOW(), 'false')";
                    $send_notif_members_result = mysqli_query($con, $send_notif_members_query);
                    if (!$send_notif_members_result) {
                        // Handle the case when the notification insertion fails for a user
                        $data['message'] = "Failed to send notification.";
                        $data['status'] = "error";
                        echo json_encode($data);
                        exit;
                    }
                }
            } else {
                $activity_type = 'send_guild_message';

                foreach ($users_ids as $user_id) {
                    if ($current_user_id !== $user_id) {
                        $notification_id = rand(100000, 999999);
                        $send_notif_members_query = "INSERT INTO `user_notifications` (`notification_id`, `user_id`, `activity_type`, `activity_id`, `sender_id`, `timestamp`, `is_read`) VALUES ('$notification_id', '$user_id', '$activity_type', '$message_id', '$current_user_id', NOW(), 'false')";
                        $send_notif_members_result = mysqli_query($con, $send_notif_members_query);
                        if (!$send_notif_members_result) {
                            // Handle the case when the notification insertion fails for a user
                            $data['message'] = "Failed to send notification to members";
                            $data['status'] = "error";
                            echo json_encode($data);
                            exit;
                        }
                    }
                }

                $notification_id = rand(100000, 999999);
                $send_notif_creator_query = "INSERT INTO `user_notifications` (`notification_id`, `user_id`, `activity_type`, `activity_id`, `sender_id`, `timestamp`, `is_read`) VALUES ('$notification_id', '$guild_creator_id', '$activity_type', '$message_id', '$current_user_id', NOW(), 'false')";
                $send_notif_creator_result = mysqli_query($con, $send_notif_creator_query);
                if (!$send_notif_creator_result) {
                    // Handle the case when the notification insertion fails for a user
                    $data['message'] = "Failed to send notification to creator";
                    $data['status'] = "error";
                    echo json_encode($data);
                    exit;
                }
            }

            $insert_message_query = "INSERT INTO `user_messages`(`message_id`, `convo_room_id`, `sender_id`, `receiver_id`, `messages`, `media_content`, `sent_at`) VALUES ('$message_id', '$guild_convo_room_id', '$current_user_id', '6', '$userg_message_input', '$logged_in_user_avatar', NOW())";
            $insert_message_result = mysqli_query($con, $insert_message_query);

            if ($insert_message_result) {
                $data['userg_message_input'] = $userg_message_input;
                $data['current_avatar'] = $user_data['user_avatar'];
                $data['current_username'] = $user_data['username'];
                $data['status'] = "success";
                $data['message'] = "Message sent successfully.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "No guild found.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "ID does not match.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);