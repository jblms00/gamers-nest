<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$current_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $guild_id = $_POST['guild_id'];
    $guild_name = $_POST['guild_name'];

    $get_convo_query = "SELECT guild_room_id FROM guild_conversation_room WHERE guild_name = '$guild_name'";
    $get_convo_result = mysqli_query($con, $get_convo_query);

    if ($get_convo_result && mysqli_num_rows($get_convo_result) > 0) {
        $fetch_convo = mysqli_fetch_assoc($get_convo_result);
        $guild_room_id = $fetch_convo['guild_room_id'];

        $get_messages_query = "SELECT * FROM user_messages WHERE convo_room_id = '$guild_room_id' ORDER BY sent_at DESC";
        $get_messages_result = mysqli_query($con, $get_messages_query);

        if ($get_messages_result && mysqli_num_rows($get_messages_result) > 0) {
            $get_users_query = "SELECT * FROM users_guilds WHERE guild_id = '$guild_id' AND guild_name = '$guild_name'";
            $get_users_result = mysqli_query($con, $get_users_query);
            $users = [];

            if ($get_users_result && mysqli_num_rows($get_users_result) > 0) {
                while ($fetch_users = mysqli_fetch_assoc($get_users_result)) {
                    $get_creator_avatar_query = "SELECT user_avatar FROM users_accounts WHERE user_id = '{$fetch_users['guild_creator_id']}'";
                    $get_creator_avatar_result = mysqli_query($con, $get_creator_avatar_query);
                    $fetch_creator_avatar = mysqli_fetch_assoc($get_creator_avatar_result);

                    $user_messages = [];
                    while ($fetch_messages = mysqli_fetch_assoc($get_messages_result)) {
                        $user_messages[] = [
                            'sender_id' => $fetch_messages['sender_id'],
                            'message' => $fetch_messages['messages'],
                            'user_avatar' => $fetch_messages['media_content']
                        ];
                    }

                    $user = [
                        'guild_members' => explode(",", $fetch_users['guild_members']) ?? NULL,
                        'users_ids' => explode(",", $fetch_users['users_ids']) ?? NULL,
                        'creator_avatar' => $fetch_creator_avatar['user_avatar'],
                        'user_messages' => $user_messages
                    ];
                    array_push($users, $user);
                }
                $data['logged_in_user'] = $current_user_id;
                $data['users'] = $users;
                $data['status'] = "success";
            } else {
                $data['status'] = "error";
                $data['message'] = "No guild found.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "No messages found.";
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
?>