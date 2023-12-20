<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $current_user_id = $_POST['current_user_id'];
    $guild_name = mysqli_real_escape_string($con, $_POST['guild_name']);
    $guild_description = mysqli_real_escape_string($con, $_POST['guild_description']);
    $guild_members_usernames = $_POST['guild_members'];

    // Check if guild_name contains exactly 3 words
    $word_count = str_word_count($guild_name);
    if (empty($guild_name) || $word_count > 3) {
        $data['message'] = "Guild name should contain exactly 3 words.";
        $data['status'] = "error";
        echo json_encode($data);
        exit;
    }

    // Check if guild_description is blank or contains at least 30 characters
    $character_count_description = strlen($guild_description);
    if (empty($guild_description) || $character_count_description < 30) {
        $data['message'] = "Guild description should contain at least 30 characters";
        $data['status'] = "error";
        echo json_encode($data);
        exit;
    }

    // Check if the user has invited guild members
    if (empty($guild_members_usernames)) {
        $data['message'] = "Please invite your guild members.";
        $data['status'] = "error";
        echo json_encode($data);
        exit;
    }

    // Check if the guild name already exists
    if (guildNameExists($con, $guild_name)) {
        $data['message'] = "The guild name already exists.";
        $data['status'] = "error";
        echo json_encode($data);
        exit;
    }

    // Convert guild_members to an array if it is a single member
    if (!is_array($guild_members_usernames)) {
        $guild_members_usernames = explode(', ', $guild_members_usernames);
    }

    $guild_id = rand(100000, 999999);
    $guild_created_at = date('Y-m-d H:i:s');

    $insert_query = "INSERT INTO `users_guilds`(`guild_id`, `guild_creator_id`, `guild_name`, `guild_description`, `guild_banner`, `guild_logo`, `guild_status`, `guild_created_at`) VALUES ('$guild_id','$current_user_id','$guild_name','$guild_description', 'default-banner.jpg', 'default-logo.png', 'active', '$guild_created_at')";
    $insert_result = mysqli_query($con, $insert_query);

    // Create Guild Conversation Room
    $guild_room_id = rand(100000, 999999);
    $create_guild_convo_query = "INSERT INTO `guild_conversation_room` (`guild_room_id`, `guild_name`, `sender_id`, `status`, `created_at`) VALUES ('$guild_room_id ', '$guild_name', '$current_user_id', 'active', NOW())";
    $create_guild_convo_result = mysqli_query($con, $create_guild_convo_query);

    if (!$insert_result) {
        $data['message'] = "Failed to create the guild.";
        $data['status'] = "error";
        echo json_encode($data);
        exit;
    }

    // Get the usernames and user_ids of the guild members from the users_accounts table
    $guild_members_data = [];
    foreach ($guild_members_usernames as $username) {
        $user_info_query = "SELECT user_id FROM users_accounts WHERE username = '$username'";
        $user_info_result = mysqli_query($con, $user_info_query);

        if (!$user_info_result) {
            // Handle the case when the user information retrieval fails for a guild member
            $data['message'] = "Failed to get user info for $username.";
            $data['status'] = "error";
            echo json_encode($data);
            exit;
        }

        $fetch_info = mysqli_fetch_assoc($user_info_result);
        if (!$fetch_info) {
            // Handle the case when the user does not exist in the users_accounts table
            $data['message'] = "$username not found.";
            $data['status'] = "error";
            echo json_encode($data);
            exit;
        }

        $user_id = $fetch_info['user_id'];
        $guild_members_data[] = [
            'username' => $username,
            'user_id' => $user_id,
        ];

        // Insert a request for each guild member
        $request_id = rand(100000, 999999);
        $request_type = 'guild_invitation';
        $request_at = date('Y-m-d H:i:s');
        $sql_request = "INSERT INTO `user_guild_request`(`request_guild_id`, `guild_id`, `guild_name`, `user_id`, `request_type`, `request_at`) VALUES ('$request_id','$guild_id','$guild_name','$user_id','$request_type','$request_at')";
        $query_request = mysqli_query($con, $sql_request);

        if (!$query_request) {
            // Handle the case when the notification insertion fails for a guild member
            $data['message'] = "Failed to send invite to $username.";
            $data['status'] = "error";
            echo json_encode($data);
            exit;
        }

        // Insert a notification for each guild member
        $notification_id = rand(100000, 999999);
        $activity_type = 'invited_to_guild';
        $sql_notification = "INSERT INTO `user_notifications` (`notification_id`, `user_id`, `activity_type`, `activity_id`, `sender_id`, `timestamp`, `is_read`) VALUES ('$notification_id', '$user_id', '$activity_type', '$request_id', '$current_user_id', NOW(), 'false')";
        $query_notification = mysqli_query($con, $sql_notification);
        if (!$query_notification) {
            // Handle the case when the notification insertion fails for a guild member
            $data['message'] = "Failed to send notification to $username.";
            $data['status'] = "error";
            echo json_encode($data);
            exit;
        }
    }

    $data['guild_members_data'] = $guild_members_data;
    $data['guild_description'] = $guild_description;
    $data['guild_id'] = $guild_id;
    $data['guild_name'] = $guild_name;
    $data['status'] = "success";
    $data['message'] = "Guild created successfully!";
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);

function guildNameExists($con, $guild_name)
{
    $guild_name = mysqli_real_escape_string($con, $guild_name);
    $query = "SELECT COUNT(*) AS count FROM users_guilds WHERE guild_name = '$guild_name'";
    $result = mysqli_query($con, $query);
    $row = mysqli_fetch_assoc($result);
    return $row['count'] > 0;
}