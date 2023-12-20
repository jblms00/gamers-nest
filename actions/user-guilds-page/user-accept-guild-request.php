<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $current_user_id = $_POST['current_user_id'];
    $request_guild_id = $_POST['request_guild_id'];

    if ($logged_in_user_id === $current_user_id) {
        // Check if the guild request exists
        $check_guild_request_query = "SELECT * FROM user_guild_request WHERE request_guild_id = '$request_guild_id'";
        $check_guild_request_result = mysqli_query($con, $check_guild_request_query);

        if ($check_guild_request_result && mysqli_num_rows($check_guild_request_result) > 0) {
            $fetch_guild_request = mysqli_fetch_assoc($check_guild_request_result);
            $guild_id = $fetch_guild_request['guild_id'];
            $requested_user_id = $fetch_guild_request['user_id'];

            $get_user_query = "SELECT username FROM users_accounts WHERE user_id = '$requested_user_id'";
            $get_user_result = mysqli_query($con, $get_user_query);
            $fetch_user = mysqli_fetch_assoc($get_user_result);

            // Check if the guild exists
            $get_guild_query = "SELECT * FROM users_guilds WHERE guild_id = '$guild_id'";
            $get_guild_result = mysqli_query($con, $get_guild_query);

            if ($get_guild_result && mysqli_num_rows($get_guild_result) > 0) {
                $fetch_guild = mysqli_fetch_assoc($get_guild_result);
                $guild_name = $fetch_guild['guild_name'];

                // Check if the guild already has six members
                $guild_members = explode(",", $fetch_guild['guild_members']);
                $guild_user_ids = explode(",", $fetch_guild['users_ids']);

                if (count($guild_members) >= 6 && count($guild_user_ids) >= 6) {
                    $data['status'] = "error";
                    $data['message'] = "Guild already has six members.";
                } else {
                    // Add the requested user ID to the guild_members list
                    $guild_members[] = $fetch_user['username'];
                    $guild_user_ids[] = $requested_user_id;

                    // Update the guild_members in the database
                    $updated_members = implode(",", $guild_members);
                    $updated_user_ids = implode(",", $guild_user_ids);

                    // If there are no members, do not use implode
                    $updated_members = empty($fetch_guild['guild_members']) ? $fetch_user['username'] : $updated_members;
                    $updated_user_ids = empty($fetch_guild['users_ids']) ? $requested_user_id : $updated_user_ids;

                    // Update the users_guilds table
                    $update_guild_query = "UPDATE users_guilds SET guild_members = '$updated_members', users_ids = '$updated_user_ids' WHERE guild_id = '$guild_id'";
                    $update_guild_result = mysqli_query($con, $update_guild_query);

                    if ($update_guild_result) {
                        // Remove request after accepting request
                        $remove_reqeuest_query = "DELETE FROM `user_guild_request` WHERE guild_id = '$guild_id' AND guild_name = '$guild_name' AND user_id = '$requested_user_id'";
                        $remove_reqeuest_result = mysqli_query($con, $remove_reqeuest_query);

                        if ($remove_reqeuest_result) {
                            $notification_id = rand(100000, 999999);
                            $activity_type = 'invite_guild_accepted';
                            $guild_creator_id = $fetch_guild['guild_creator_id'];

                            $sql_notification = "INSERT INTO `user_notifications` (`notification_id`, `user_id`, `activity_type`, `activity_id`, `sender_id`, `timestamp`, `is_read`) VALUES ('$notification_id', '$requested_user_id', '$activity_type', '$request_guild_id', '$current_user_id', NOW(), 'false')";
                            $query_notification = mysqli_query($con, $sql_notification);

                            $remove_notification_query = "DELETE FROM `user_notifications` WHERE activity_id = '$request_guild_id' AND notification_id != $notification_id";
                            $remove_notification_result = mysqli_query($con, $remove_notification_query);

                            if ($query_notification && $remove_notification_result) {
                                $data['guild_id'] = $fetch_guild['guild_id'];
                                $data['guild_name'] = $fetch_guild['guild_name'];
                                $data['guild_name'] = $fetch_guild['guild_name'];
                                $data['status'] = "success";
                                $data['message'] = "User added to the guild successfully.";
                            }
                        }
                    } else {
                        $data['status'] = "error";
                        $data['message'] = "Failed to add user to the guild.";
                    }
                }
            } else {
                $data['status'] = "error";
                $data['message'] = "No guild found.";
            }
        } else {
            $data['status'] = "error";
            $data['message'] = "No guild request found.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "User id does not match.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);