<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];
$logged_in_username = $user_data['username'];

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $current_user_id = $_POST['current_user_id'];
    $guild_id = $_POST['guild_id'];

    $get_guilds_query = "SELECT * FROM users_guilds WHERE guild_id = '$guild_id'";
    $get_guilds_result = mysqli_query($con, $get_guilds_query);

    if ($get_guilds_result && mysqli_num_rows($get_guilds_result) > 0) {
        $fetch_guilds = mysqli_fetch_assoc($get_guilds_result);
        $guild_creator_id = $fetch_guilds['guild_creator_id'];
        $guild_name = $fetch_guilds['guild_name'];

        $get_conversation_query = "SELECT * FROM guild_conversation_room WHERE sender_id = $guild_creator_id";
        $get_conversation_result = mysqli_query($con, $get_conversation_query);
        $fetch_conversation = mysqli_fetch_assoc($get_conversation_result);
        $guild_room_id = $fetch_conversation['guild_room_id'];

        if ($current_user_id === $guild_creator_id) {
            $delete_guild_query = "DELETE FROM `users_guilds` WHERE guild_id = '$guild_id'";
            $delete_guild_result = mysqli_query($con, $delete_guild_query);

            $delete_messages_query = "DELETE FROM `user_messages` WHERE convo_room_id = '$guild_room_id'";
            $delete_messages_result = mysqli_query($con, $delete_messages_query);

            if ($delete_guild_result) {
                $delete_conversation_query = "DELETE FROM `guild_conversation_room` WHERE guild_room_id = '$guild_room_id' AND sender_id = '$guild_creator_id'";
                $delete_post_query = "DELETE FROM `user_guild_posts` WHERE guild_id = '$guild_id'";
                $delete_request_query = "DELETE FROM `user_guild_request` WHERE guild_id = '$guild_id' AND guild_name = '$guild_name'";

                $delete_conversation_result = mysqli_query($con, $delete_conversation_query);
                $delete_post_result = mysqli_query($con, $delete_post_query);
                $delete_request_result = mysqli_query($con, $delete_request_query);

                if ($delete_conversation_result && $delete_post_result && $delete_request_result) {
                    $data['status'] = 'success';
                    $data['message'] = 'Guild successfully removed';
                } else {
                    $data['status'] = 'error';
                    $data['message'] = 'Guild was not successfully deleted.';
                }
            }
        } else {
            $user_ids = $fetch_guilds['users_ids'];
            $user_ids = is_array($user_ids) ? $user_ids : explode(',', $user_ids);

            $guild_members = explode(",", $fetch_guilds['guild_members']);
            $guild_members = is_array($guild_members) ? $guild_members : explode(',', $guild_members);

            $is_member = (in_array($current_user_id, $user_ids) && in_array($logged_in_username, $guild_members));

            if ($is_member) {
                $id_member_key = array_search($current_user_id, $user_ids);
                $name_member_key = array_search($logged_in_username, $guild_members);

                unset($user_ids[$id_member_key]);
                $updated_user_ids = implode(",", $user_ids);

                unset($guild_members[$name_member_key]);
                $updated_guild_members = implode(",", $guild_members);

                $update_users_query = "UPDATE users_guilds SET users_ids = '$updated_user_ids', guild_members = '$updated_guild_members' WHERE guild_id = '$guild_id'";
                $update_users_result = mysqli_query($con, $update_users_query);

                if ($update_users_result) {
                    $delete_messages_query = "DELETE FROM `user_messages` WHERE sender_id = '$current_user_id' AND convo_room_id ='$guild_room_id'";
                    $delete_post_query = "DELETE FROM `user_guild_posts` WHERE user_id = '$current_user_id'";

                    $delete_messages_result = mysqli_query($con, $delete_messages_query);
                    $delete_post_result = mysqli_query($con, $delete_post_query);

                    if ($delete_messages_result && $delete_post_result) {
                        $data['status'] = 'success';
                        $data['message'] = 'You have left the guild.';
                    } else {
                        $data['status'] = 'error';
                        $data['message'] = 'Failed to remove data.';
                    }
                } else {
                    $data['status'] = 'error';
                    $data['message'] = 'Failed to update guild data.';
                }
            } else {
                $data['status'] = 'error';
                $data['message'] = 'You are not a member of this guild.';
            }
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'No guild found.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);