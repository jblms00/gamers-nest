<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$user_id = $user_data['user_id'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $get_messages = "SELECT * FROM user_conversation_room WHERE status = 'active' AND sender_id = '$user_id' OR receiver_id = '$user_id' ORDER BY created_at ASC";
    $result_messages = mysqli_query($con, $get_messages);
    $convo_rooms = [];

    if ($result_messages && mysqli_num_rows($result_messages) > 0) {
        while ($fetch_users = mysqli_fetch_assoc($result_messages)) {
            $usernames = explode(" and ", $fetch_users['convo_room_name']);
            $convo_room = [
                'convo_room_id' => $fetch_users['convo_room_id'],
                'convo_room_name' => $fetch_users['convo_room_name'],
                'sender_id' => $fetch_users['sender_id'],
                'receiver_id' => $fetch_users['receiver_id'],
                'sender_muted' => $fetch_users['sender_muted'],
                'receiver_muted' => $fetch_users['receiver_muted'],
                'is_blocked' => $fetch_users['is_blocked'],
                'username_receiverUser' => $usernames[0],
                'username_currentUser' => $usernames[1],
                'users_receiver_info' => []
            ];

            // Determine whether the logged-in user is the sender or receiver
            if ($fetch_users['sender_id'] == $user_id) {
                $receiver_username = $usernames[1];
            } else {
                $receiver_username = $usernames[0];
            }

            $get_users = "SELECT * FROM users_accounts WHERE username = '$receiver_username'";
            $result_users = mysqli_query($con, $get_users);
            $users_receiver_info = [];

            while ($fetch_users_receiver_info = mysqli_fetch_assoc($result_users)) {
                $convo_room_id = $fetch_users['convo_room_id'];
                $get_current_message = "SELECT * FROM user_messages WHERE convo_room_id = '$convo_room_id' ORDER BY sent_at DESC";
                $result_current_message = mysqli_query($con, $get_current_message);
                $fetch_current_message = mysqli_fetch_assoc($result_current_message);

                if ($fetch_current_message !== null && $user_id == $fetch_current_message['sender_id']) {
                    $sender_username = "You";
                } else {
                    $sender_username = $fetch_users_receiver_info['username'];
                }

                $sent_at = '';
                if (!empty($fetch_current_message['sent_at'])) {
                    $sent_at = $fetch_current_message['sent_at'];
                }

                $user_receiver_info = [
                    'receiver_user_id' => $fetch_users_receiver_info['user_id'],
                    'receiver_user_name' => $fetch_users_receiver_info['username'],
                    'receiver_user_avatar' => $fetch_users_receiver_info['user_avatar'],
                    'current_message' => $fetch_current_message,
                    'sent_at' => $sent_at,
                    'sender_username' => $sender_username
                ];
                $users_receiver_info[] = $user_receiver_info;
            }

            $convo_room['users_receiver_info'] = $user_receiver_info;
            array_push($convo_rooms, $convo_room);
        }

        $data['convo_rooms'] = $convo_rooms;
        $data['status'] = "success";
    } else {
        $data['status'] = "error";
        $data['message'] = "No conversation.";
    }
}

echo json_encode($data);