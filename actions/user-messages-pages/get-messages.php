<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

// Check if the user is logged in
$user_data = check_login($con);
$current_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get conversation room ID from POST request
    $convo_room_id = $_POST['convo_id'];

    // Fetch messages for the given conversation room
    $get_messages_query = "SELECT * FROM user_messages WHERE convo_room_id = '$convo_room_id' ORDER BY sent_at DESC";
    $get_messages_result = mysqli_query($con, $get_messages_query);
    $get_messages = [];

    if ($get_messages_result && mysqli_num_rows($get_messages_result) > 0) {
        while ($fetch_messages = mysqli_fetch_assoc($get_messages_result)) {
            // Extract message details
            $get_message = [
                'sender_id' => $fetch_messages['sender_id'],
                'receiver_id' => $fetch_messages['receiver_id'],
                'messages' => $fetch_messages['messages'],
                'media_content' => $fetch_messages['media_content'],
                'sent_at' => $fetch_messages['sent_at'],
                'users_info' => []
            ];

            if ($current_user_id === $fetch_messages['receiver_id']) {
                $sender_id = $fetch_messages['receiver_id'];
                $receiver_id = $fetch_messages['sender_id'];
            } else {
                $sender_id = $fetch_messages['sender_id'];
                $receiver_id = $fetch_messages['receiver_id'];
            }

            $get_users_query = "SELECT * FROM users_accounts WHERE user_id = '$receiver_id'";
            $result_users = mysqli_query($con, $get_users_query);
            $users_info = [];

            while ($fetch_users_info = mysqli_fetch_assoc($result_users)) {
                $user_info = [
                    'receiver_user_name' => $fetch_users_info['username'],
                    'receiver_user_avatar' => $fetch_users_info['user_avatar'],
                    'receiver_user_id' => $fetch_users_info['user_id'],
                    'sender_user_name' => $user_data['username'],
                    'sender_user_avatar' => $user_data['user_avatar'],
                    'sender_user_id' => $user_data['user_id'],
                ];
                $users_info[] = $user_info;
            }
            $get_message['users_info'] = $user_info;
            array_push($get_messages, $get_message);
        }
        $data['get_messages'] = $get_messages;
        $data['status'] = "success";
    } else {
        $data['status'] = "error";
        $data['message'] = "No messages found";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method";
}

// Send JSON response
echo json_encode($data);
?>