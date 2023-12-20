<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$current_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['convo_id'])) {
        $convo_room_id = $_POST['convo_id'];

        $get_convo_room = "SELECT * FROM user_conversation_room WHERE convo_room_id = '$convo_room_id'";
        $result_convo_room = mysqli_query($con, $get_convo_room);
        $convo_rooms = [];

        if ($result_convo_room && $query_num_rows = mysqli_num_rows($result_convo_room) > 0) {
            while ($fetch_convo_rooms = mysqli_fetch_assoc($result_convo_room)) {
                if ($current_user_id === $fetch_convo_rooms['sender_id'] && $fetch_convo_rooms['status'] === 'active' || $fetch_convo_rooms['status'] === 'deleted_by_receiver') {
                    $usernames = explode(" and ", $fetch_convo_rooms['convo_room_name']);
                    $convo_room = [
                        'convo_room_id' => $fetch_convo_rooms['convo_room_id'],
                        'convo_room_name' => $fetch_convo_rooms['convo_room_name'],
                        'sender_id' => $fetch_convo_rooms['sender_id'],
                        'receiver_id' => $fetch_convo_rooms['receiver_id'],
                        'sender_muted' => $fetch_convo_rooms['sender_muted'],
                        'receiver_muted' => $fetch_convo_rooms['receiver_muted'],
                        'status' => $fetch_convo_rooms['status'],
                        'is_blocked' => $fetch_convo_rooms['is_blocked'],
                        'username_receiverUser' => $usernames[0],
                        'username_currentUser' => $usernames[1],
                        'users_receiver_info' => []
                    ];

                    if ($current_user_id === $fetch_convo_rooms['receiver_id']) {
                        $sender_id = $fetch_convo_rooms['receiver_id'];
                        $receiver_id = $fetch_convo_rooms['sender_id'];

                        $receiver_name = $user_data['username'];
                    } else {
                        $sender_id = $fetch_convo_rooms['sender_id'];
                        $receiver_id = $fetch_convo_rooms['receiver_id'];

                        $receiver_name = $user_data['username'];
                    }

                    $get_users = "SELECT * FROM users_accounts WHERE user_id = '$receiver_id'";
                    $result_users = mysqli_query($con, $get_users);
                    $users_receiver_info = [];

                    while ($fetch_users_receiver_info = mysqli_fetch_assoc($result_users)) {
                        $user_receiver_info = [
                            'receiver_user_name' => $fetch_users_receiver_info['username'],
                            'receiver_user_avatar' => $fetch_users_receiver_info['user_avatar'],
                            'receiver_id' => $fetch_users_receiver_info['user_id'],
                        ];
                    }

                    $convo_room['users_receiver_info'] = $user_receiver_info;
                    array_push($convo_rooms, $convo_room);
                } else if ($current_user_id === $fetch_convo_rooms['receiver_id'] && $fetch_convo_rooms['status'] === 'active' || $fetch_convo_rooms['status'] === 'deleted_by_sender') {
                    $usernames = explode(" and ", $fetch_convo_rooms['convo_room_name']);
                    $convo_room = [
                        'convo_room_id' => $fetch_convo_rooms['convo_room_id'],
                        'convo_room_name' => $fetch_convo_rooms['convo_room_name'],
                        'sender_id' => $fetch_convo_rooms['sender_id'],
                        'receiver_id' => $fetch_convo_rooms['receiver_id'],
                        'sender_muted' => $fetch_convo_rooms['sender_muted'],
                        'receiver_muted' => $fetch_convo_rooms['receiver_muted'],
                        'status' => $fetch_convo_rooms['status'],
                        'is_blocked' => $fetch_convo_rooms['is_blocked'],
                        'username_receiverUser' => $usernames[0],
                        'username_currentUser' => $usernames[1],
                        'users_receiver_info' => []
                    ];

                    if ($current_user_id === $fetch_convo_rooms['receiver_id']) {
                        $sender_id = $fetch_convo_rooms['receiver_id'];
                        $receiver_id = $fetch_convo_rooms['sender_id'];

                        $receiver_name = $user_data['username'];
                    } else {
                        $sender_id = $fetch_convo_rooms['sender_id'];
                        $receiver_id = $fetch_convo_rooms['receiver_id'];

                        $receiver_name = $user_data['username'];
                    }

                    $get_users = "SELECT * FROM users_accounts WHERE user_id = '$receiver_id'";
                    $result_users = mysqli_query($con, $get_users);
                    $users_receiver_info = [];

                    while ($fetch_users_receiver_info = mysqli_fetch_assoc($result_users)) {
                        $user_receiver_info = [
                            'receiver_user_name' => $fetch_users_receiver_info['username'],
                            'receiver_user_avatar' => $fetch_users_receiver_info['user_avatar'],
                            'receiver_id' => $fetch_users_receiver_info['user_id'],
                        ];
                    }

                    $convo_room['users_receiver_info'] = $user_receiver_info;
                    array_push($convo_rooms, $convo_room);
                } else {
                    $data['status'] = "error";
                    $data['message'] = "No conversation found.";
                }
            }
            $data['convo_rooms'] = $convo_rooms;
            $data['status'] = "success";
        } else {
            $data['status'] = "error";
            $data['message'] = "No conversation found.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Invalid missing parameters";
    }
}

echo json_encode($data);
?>