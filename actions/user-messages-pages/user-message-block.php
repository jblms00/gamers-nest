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

    if ($get_convo_result && mysqli_num_rows($get_convo_result) > 0) {
        $fetch_convo_result = mysqli_fetch_assoc($get_convo_result);

        // Check if $current_user_id is the sender or receiver
        if ($fetch_convo_result['sender_id'] == $current_user_id) {
            $update_query = "UPDATE `user_conversation_room` SET `is_blocked`='true' WHERE convo_room_id = '$convo_room_id'";
            $update_result = mysqli_query($con, $update_query);

            $data['status'] = "success";
            $data['message'] = "Current user is the sender.";
        } else {
            $update_query = "UPDATE `user_conversation_room` SET `is_blocked`='true' WHERE convo_room_id = '$convo_room_id'";
            $update_result = mysqli_query($con, $update_query);

            $data['status'] = "success";
            $data['message'] = "Current user is the receiver.";
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