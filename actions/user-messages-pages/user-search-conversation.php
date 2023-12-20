<?php
session_start();
include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$current_user_id = $user_data['user_id'];

$data = [];

if (isset($_POST['input'])) {
    $input = $_POST['input'];
    $escaped_input = mysqli_real_escape_string($con, $input);

    $get_convo_room_ids = "SELECT * FROM user_conversation_room WHERE convo_room_name LIKE '%$escaped_input%' ORDER BY created_at ASC";
    $result_convo_room_ids = mysqli_query($con, $get_convo_room_ids);
    $convo_room_ids = [];

    while ($fetch_convo_room_id = mysqli_fetch_assoc($result_convo_room_ids)) {
        $convo_status = $fetch_convo_room_id['status'];

        if ($current_user_id === $fetch_convo_room_id['sender_id'] && $convo_status === 'active' || $convo_status === 'deleted_by_receiver') {
            $convo_room_ids[] = $fetch_convo_room_id['convo_room_id'];

            if (!empty($convo_room_ids)) {
                $convo_rooms = [];
                foreach ($convo_room_ids as $convo_room_id) {
                    $status_query = "SELECT * FROM user_messages WHERE convo_room_id = '$convo_room_id' ORDER BY sent_at DESC";
                    $result_status = mysqli_query($con, $status_query);

                    if ($result_status && mysqli_num_rows($result_status) > 0) {
                        $row = mysqli_fetch_assoc($result_status);
                        $last_message_time = $row['sent_at'];
                        $last_message = $row['messages'];

                        $sender_id = $row['sender_id'];
                        $receiver_id = $row['receiver_id'];

                        if ($current_user_id == $sender_id) {
                            $status = "sender";
                        } else {
                            $status = "receiver";
                        }

                        // Get sender's information
                        $get_sender_info_query = "SELECT user_avatar, username FROM users_accounts WHERE user_id = '$sender_id'";
                        $result_sender_info = mysqli_query($con, $get_sender_info_query);
                        $sender_info = mysqli_fetch_assoc($result_sender_info);

                        // Get receiver's information
                        $get_receiver_info_query = "SELECT user_avatar, username FROM users_accounts WHERE user_id = '$receiver_id'";
                        $result_receiver_info = mysqli_query($con, $get_receiver_info_query);
                        $receiver_info = mysqli_fetch_assoc($result_receiver_info);

                        if ($current_user_id == $sender_id) {
                            $sender_name = "You";
                        } else {
                            $sender_name = $sender_info['username'];
                        }

                        $convo_rooms[] = [
                            'convo_room_id' => $convo_room_id,
                            'status' => $status,
                            'sender_id' => $sender_id,
                            'receiver_id' => $receiver_id,
                            'sender_avatar' => $sender_info['user_avatar'],
                            'sender_username' => $sender_info['username'],
                            'receiver_avatar' => $receiver_info['user_avatar'],
                            'receiver_username' => $receiver_info['username'],
                            'sender_name' => $sender_name,
                            'last_message' => $last_message,
                            'last_message_time' => $last_message_time,
                        ];
                    }
                }
                if (!empty($convo_rooms)) {
                    $data['convo_rooms'] = $convo_rooms;
                    $data['status'] = "success";
                } else {
                    $data['status'] = "error";
                    $data['message'] = "No conversation found.";
                }
            } else {
                $data['status'] = "error";
                $data['message'] = "No conversation found.";
            }
        } else if ($current_user_id === $fetch_convo_room_id['receiver_id'] && $convo_status === 'active' || $convo_status === 'deleted_by_sender') {
            $convo_room_ids[] = $fetch_convo_room_id['convo_room_id'];

            if (!empty($convo_room_ids)) {
                $convo_rooms = [];
                foreach ($convo_room_ids as $convo_room_id) {
                    $status_query = "SELECT * FROM user_messages WHERE convo_room_id = '$convo_room_id' ORDER BY sent_at DESC";
                    $result_status = mysqli_query($con, $status_query);

                    if ($result_status && mysqli_num_rows($result_status) > 0) {
                        $row = mysqli_fetch_assoc($result_status);
                        $last_message_time = $row['sent_at'];
                        $last_message = $row['messages'];

                        $sender_id = $row['sender_id'];
                        $receiver_id = $row['receiver_id'];

                        if ($current_user_id == $sender_id) {
                            $status = "sender";
                        } else {
                            $status = "receiver";
                        }

                        // Get sender's information
                        $get_sender_info_query = "SELECT user_avatar, username FROM users_accounts WHERE user_id = '$sender_id'";
                        $result_sender_info = mysqli_query($con, $get_sender_info_query);
                        $sender_info = mysqli_fetch_assoc($result_sender_info);

                        // Get receiver's information
                        $get_receiver_info_query = "SELECT user_avatar, username FROM users_accounts WHERE user_id = '$receiver_id'";
                        $result_receiver_info = mysqli_query($con, $get_receiver_info_query);
                        $receiver_info = mysqli_fetch_assoc($result_receiver_info);

                        if ($current_user_id == $sender_id) {
                            $sender_name = "You";
                        } else {
                            $sender_name = $sender_info['username'];
                        }

                        $convo_rooms[] = [
                            'convo_room_id' => $convo_room_id,
                            'status' => $status,
                            'sender_id' => $sender_id,
                            'receiver_id' => $receiver_id,
                            'sender_avatar' => $sender_info['user_avatar'],
                            'sender_username' => $sender_info['username'],
                            'receiver_avatar' => $receiver_info['user_avatar'],
                            'receiver_username' => $receiver_info['username'],
                            'sender_name' => $sender_name,
                            'last_message' => $last_message,
                            'last_message_time' => $last_message_time,
                        ];
                    }
                }
                if (!empty($convo_rooms)) {
                    $data['convo_rooms'] = $convo_rooms;
                    $data['status'] = "success";
                } else {
                    $data['status'] = "error";
                    $data['message'] = "No conversation found.";
                }
            } else {
                $data['status'] = "error";
                $data['message'] = "No conversation found.";
            }
        } else {
            $data['status'] = 'error';
            $data['message'] = 'No conversation found.';
        }
    }

} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>