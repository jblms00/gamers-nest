<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$current_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $convo_room_id = $_POST['convo_room_id'];

    $get_convo_query = "SELECT * FROM user_conversation_room WHERE convo_room_id = '$convo_room_id' AND (sender_id = '$current_user_id' OR receiver_id = '$current_user_id')";
    $get_convo_result = mysqli_query($con, $get_convo_query);
    $fetch_convo_result = mysqli_fetch_assoc($get_convo_result);
    $conversation_status = $fetch_convo_result['status'];

    if ($current_user_id === $fetch_convo_result['sender_id']) {
        $sender_id = $fetch_convo_result['sender_id'];
        $receiver_id = $fetch_convo_result['receiver_id'];
        $status = "deleted_by_receiver";
    } else {
        $sender_id = $fetch_convo_result['receiver_id'];
        $receiver_id = $fetch_convo_result['sender_id'];
        $status = "deleted_by_sender";
    }

    if ($get_convo_result && $convo_num_rows = mysqli_num_rows($get_convo_result) > 0) {

        if ($conversation_status === 'deleted_by_sender' || $conversation_status === 'deleted_by_receiver') {
            $delete_convo_query = "DELETE FROM `user_conversation_room` WHERE convo_room_id = '$convo_room_id'";
            $delete_convo_result = mysqli_query($con, $delete_convo_query);

            $delete_messages_query = "DELETE FROM `user_messages` WHERE convo_room_id = '$convo_room_id'";
            $delete_messages_result = mysqli_query($con, $delete_messages_query);

            if ($delete_convo_result && $delete_messages_result) {
                $data['status'] = "success";
            } else {
                $data['status'] = "error";
                $data['message'] = "Error deleteing conversation";
            }
        } else {
            $update_convo_query = "UPDATE `user_conversation_room` SET `status`='$status' WHERE convo_room_id = '$convo_room_id'";
            $update_convo_result = mysqli_query($con, $update_convo_query);

            $sender_id = $fetch_convo_result['sender_id'];
            $receiver_id = $fetch_convo_result['receiver_id'];

            $data['sender_id'] = $sender_id;
            $data['receiver_id'] = $receiver_id;
            $data['convo_status'] = $status;
            $data['status'] = "success";
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