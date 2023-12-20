<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$current_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $convo_room_id = $_POST['convo_id'];
    $message_input = mysqli_real_escape_string($con, $_POST['message_input']);

    $get_convo_query = "SELECT * FROM user_conversation_room WHERE convo_room_id = '$convo_room_id'";
    $get_convo_result = mysqli_query($con, $get_convo_query);

    if ($get_convo_result && mysqli_num_rows($get_convo_result) > 0) {
        $fetch_users = mysqli_fetch_assoc($get_convo_result);

        if ($current_user_id === $fetch_users['sender_id']) {
            $sender_id = $fetch_users['sender_id'];
            $receiver_id = $fetch_users['receiver_id'];

            $receiver_muted = $fetch_users['receiver_muted'];
        } else {
            $sender_id = $fetch_users['receiver_id'];
            $receiver_id = $fetch_users['sender_id'];

            $receiver_muted = $fetch_users['sender_muted'];
        }

        $message_id = rand(100000, 999999);
        $insert_message_query = "INSERT INTO `user_messages`(`message_id`, `convo_room_id`, `sender_id`, `receiver_id`, `messages`, `sent_at`) VALUES ('$message_id', '$convo_room_id', '$current_user_id', '$receiver_id', '$message_input', NOW())";

        // Check if the current user is part of the conversation
        if ($insert_message_result = mysqli_query($con, $insert_message_query)) {

            if ($receiver_muted == 'false') {
                // Send the notification.
                $notification_id = rand(100000, 999999);
                $activity_type = 'send_message';
                $timestamp = date('Y-m-d H:i:s');

                $sql_notification = "INSERT INTO user_notifications (notification_id, user_id, activity_type, activity_id, sender_id, timestamp, is_read) VALUES ('$notification_id', '$receiver_id', '$activity_type', '$message_id', '$current_user_id', '$timestamp', 'false')";
                $query_notification = mysqli_query($con, $sql_notification);
            }

            // Fetch sender's username and user_avatar
            $get_sender_info_query = "SELECT username, user_avatar FROM users_accounts WHERE user_id = '$current_user_id'";
            $get_sender_info_result = mysqli_query($con, $get_sender_info_query);
            $sender_info = mysqli_fetch_assoc($get_sender_info_result);

            // Fetch receiver's username and user_avatar
            $get_receiver_info_query = "SELECT username, user_avatar FROM users_accounts WHERE user_id = '$receiver_id'";
            $get_receiver_info_result = mysqli_query($con, $get_receiver_info_query);
            $receiver_info = mysqli_fetch_assoc($get_receiver_info_result);

            if (mysqli_num_rows($get_sender_info_result) > 0 && mysqli_num_rows($get_receiver_info_result) > 0) {
                $data['message_input'] = $message_input;

                $data['sender_username'] = $sender_info['username'];
                $data['sender_avatar'] = $sender_info['user_avatar'];

                $data['receiver_username'] = $receiver_info['username'];
                $data['receiver_avatar'] = $receiver_info['user_avatar'];
                $data['status'] = "success";
            } else {
                $data['status'] = "error";
                $data['message'] = "Failed to fetch sender or receiver information.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "You are not part of this conversation.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "No conversation found.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);