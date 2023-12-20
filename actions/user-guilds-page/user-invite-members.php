<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $current_user_id = $_POST['current_user_id'];
    $guild_members_usernames = $_POST['guild_members'];
    $guild_id = $_POST['guild_id'];

    if (empty($guild_members_usernames)) {
        $data['message'] = "Please invite your guild members.";
        $data['status'] = "error";
        echo json_encode($data);
        exit;
    }

    // Convert guild_members to an array if it is a single member
    if (!is_array($guild_members_usernames)) {
        $guild_members_usernames = explode(',', $guild_members_usernames);
    }

    // Check if any of the guild members are already part of the guild
    $guild_members_query = "SELECT guild_name, guild_members, users_ids FROM users_guilds WHERE guild_id = '$guild_id'";
    $guild_members_result = mysqli_query($con, $guild_members_query);
    $guild_members_row = mysqli_fetch_assoc($guild_members_result);

    if ($guild_members_row) {
        $existing_usernames = explode(',', $guild_members_row['guild_members']);
        $existing_user_ids = explode(',', $guild_members_row['users_ids']);

        foreach ($guild_members_usernames as $username) {
            $user_query = "SELECT user_id FROM users_accounts WHERE username = '$username'";
            $user_result = mysqli_query($con, $user_query);
            $user_row = mysqli_fetch_assoc($user_result);

            if ($user_row) {
                $user_id = $user_row['user_id'];

                if (in_array($username, $existing_usernames) && in_array($user_id, $existing_user_ids)) {
                    // User's username and ID are already part of the guild
                    $data['message'] = "$username is already in the guild";
                    $data['status'] = "error";
                    echo json_encode($data);
                    exit;
                }
            } else {
                // User not found in the users table
                $data['message'] = "User not found: $username";
                $data['status'] = "error";
                echo json_encode($data);
                exit;
            }
        }

        // All usernames are not part of the guild, proceed with sending requests and notifications
        $guild_name = $guild_members_row['guild_name'];

        foreach ($guild_members_usernames as $username) {
            $user_query = "SELECT user_id FROM users_accounts WHERE username = '$username'";
            $user_result = mysqli_query($con, $user_query);
            $user_row = mysqli_fetch_assoc($user_result);

            if ($user_row) {
                $user_id = $user_row['user_id'];

                // Insert a request for each guild member
                $request_id = rand(100000, 999999);
                $request_type = 'guild_invitation';
                $request_at = date('Y-m-d H:i:s');
                $sql_request = "INSERT INTO `user_guild_request`(`request_guild_id`, `guild_id`, `guild_name`, `user_id`, `request_type`, `request_at`) VALUES ('$request_id','$guild_id','$guild_name','$user_id','$request_type','$request_at')";
                $query_request = mysqli_query($con, $sql_request);

                // Insert a notification for each guild member
                $notification_id = rand(100000, 999999);
                $activity_type = 'invited_to_guild';
                $sql_notification = "INSERT INTO `user_notifications` (`notification_id`, `user_id`, `activity_type`, `activity_id`, `sender_id`, `timestamp`, `is_read`) VALUES ('$notification_id', '$user_id', '$activity_type', '$request_id', '$current_user_id', NOW(), 'false')";
                $query_notification = mysqli_query($con, $sql_notification);

                if (!$query_request || !$query_notification) {
                    // Handle the case when the request or notification insertion fails for a guild member
                    $data['message'] = "Failed to send invitation to $username";
                    $data['status'] = "error";
                    echo json_encode($data);
                    exit;
                }
            } else {
                // User not found in the users table
                $data['message'] = "User not found: $username";
                $data['status'] = "error";
                echo json_encode($data);
                exit;
            }
        }

        $data['status'] = "success";
        $data['message'] = "Guild invites checked!";
    } else {
        // Guild not found in the users_guilds table
        $data['message'] = "Guild not found";
        $data['status'] = "error";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);