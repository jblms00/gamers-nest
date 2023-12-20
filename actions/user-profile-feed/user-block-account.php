<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $current_user_id = $_POST['current_user_id'];
    $reported_user_id = $_POST['reported_user_id'];

    $get_convo_query = "SELECT * FROM user_conversation_room WHERE (sender_id = '$current_user_id' OR receiver_id = '$current_user_id') AND (sender_id = '$reported_user_id' OR receiver_id = '$reported_user_id')";
    $get_convo_result = mysqli_query($con, $get_convo_query);
    $fetch_convo_result = mysqli_fetch_assoc($get_convo_result);

    $user_status = '';
    if ($reported_user_id === $fetch_convo_result['sender_id']) {
        $convo_room_id = $fetch_convo_result['convo_room_id'];
        $user_status = "block_account_by_sender";
    } else {
        $convo_room_id = $fetch_convo_result['convo_room_id'];
        $user_status = "block_account_by_receiver";
    }

    if ($logged_in_user_id === $current_user_id) {
        $get_users = "SELECT * FROM users_accounts WHERE user_id = '$reported_user_id'";
        $get_users_result = mysqli_query($con, $get_users);

        if ($get_users_result && mysqli_num_rows($get_users_result) > 0) {
            $block_id = rand(100000, 999999);
            $insert_query = "INSERT INTO `blocked_users`(`block_id`, `blocking_user_id`, `blocked_user_id`, `block_timestamp`, `is_active`) VALUES ('$block_id','$current_user_id','$reported_user_id', NOW(), 'false')";
            $insert_result = mysqli_query($con, $insert_query);

            if ($insert_result) {
                $update_query = "UPDATE `user_conversation_room` SET `status`='$user_status', `is_blocked`='true' WHERE convo_room_id = '$convo_room_id'";
                $update_result = mysqli_query($con, $update_query);

                $data['status'] = "success";
                $data['message'] = "User successfully blocked.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "User not found.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "User id does not match";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);