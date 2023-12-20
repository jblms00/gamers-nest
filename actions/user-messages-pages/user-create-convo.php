<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$current_user_id = $user_data['user_id'];
$user_avatar_currentUser = $user_data['user_avatar'];
$username_currentUser = $user_data['username'];

// Prepare response data
$data = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Sanitize input data (you should implement a proper sanitization function)
    $receiver_user_id = $_POST['receiver_user_id'];

    $query = "SELECT * FROM users_accounts WHERE user_id = '$receiver_user_id'";
    $result = mysqli_query($con, $query);
    $fetch = mysqli_fetch_assoc($result);
    $username_receiverUser = $fetch['username'];

    // Check if conversation room already exists
    $convo_room_name1 = "$username_currentUser and $username_receiverUser";
    $convo_room_name2 = "$username_receiverUser and $username_currentUser";
    $check_convo_query = "SELECT * FROM user_conversation_room WHERE convo_room_name = '$convo_room_name1' OR convo_room_name = '$convo_room_name2'";
    $check_convo_result = mysqli_query($con, $check_convo_query);

    if ($check_convo_result && mysqli_num_rows($check_convo_result) > 0) {
        // Conversation room already exists
        $data['status'] = "error";
        $data['message'] = "Conversation already exists.";
    } else {
        // Conversation room doesn't exist, create a new one
        $convo_room_id = rand(100000, 999999);

        // Fetch the receiver's username and avatar from the database
        $get_users_query = "SELECT * FROM users_accounts WHERE user_id = '$receiver_user_id'";
        $get_users_result = mysqli_query($con, $get_users_query);

        if ($fetch_users = mysqli_fetch_assoc($get_users_result)) {
            $username_receiverUser = $fetch_users['username'];
            $user_avatar_receiverUser = $fetch_users['user_avatar'];

            // Create conversation room name
            $convo_room_name = "$username_currentUser and $username_receiverUser";

            // Insert conversation room into the database
            $create_convo_query = "INSERT INTO `user_conversation_room` (`convo_room_id`, `convo_room_name`, `sender_id`, `receiver_id`, `sender_muted`, `receiver_muted`, `is_blocked`, `status`, `created_at`) VALUES ('$convo_room_id', '$convo_room_name', '$current_user_id', '$receiver_user_id', 'false', 'false', 'false', 'active', NOW())";

            if (mysqli_query($con, $create_convo_query)) {
                //Add blank message
                $message_id = rand(100000, 999999);
                $message_query = "INSERT INTO `user_messages`(`message_id`, `convo_room_id`, `sender_id`, `receiver_id`, `sent_at`) VALUES ('$message_id','$convo_room_id','$current_user_id', '$receiver_user_id', NOW())";

                if ($message_result = mysqli_query($con, $message_query)) {
                    $data['convo_room_id'] = $convo_room_id;
                    $data['message_id'] = $message_id;
                    $data['receiver_id'] = $receiver_user_id;

                    $data['sender_muted'] = "false";
                    $data['receiver_muted'] = "false";

                    $data['receiver_username'] = $username_receiverUser;
                    $data['sender_username'] = $username_currentUser;

                    $data['receiver_user_avatar'] = $user_avatar_receiverUser;
                    $data['sender_user_avatar'] = $user_avatar_currentUser;
                    $data['status'] = "success";
                } else {
                    $data['status'] = "error";
                    $data['message'] = "Failed to create participants for the conversation room.";
                }
            } else {
                $data['status'] = "error";
                $data['message'] = "Failed to create conversation room.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "Receiver user not found in the database.";
        }
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

// Output the JSON response
echo json_encode($data);
?>