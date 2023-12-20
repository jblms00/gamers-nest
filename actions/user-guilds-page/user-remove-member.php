<?php
session_start();
include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $guild_owner_id = $_POST['guild_owner_id'];
    $guild_member_id = $_POST['guild_member_id'];
    $guild_id = $_POST['guild_id'];
    $guild_name = $_POST['guild_name'];

    if ($logged_in_user_id === $guild_owner_id) {
        $check_member_query = "SELECT guild_members, users_ids FROM users_guilds WHERE FIND_IN_SET('$guild_member_id', users_ids) AND guild_id = '$guild_id' AND guild_name = '$guild_name'";
        $check_member_result = mysqli_query($con, $check_member_query);

        if ($check_member_result && mysqli_num_rows($check_member_result) > 0) {
            // Fetch the current guild members and users_ids
            $guild_data = mysqli_fetch_assoc($check_member_result);
            $current_members = explode(",", $guild_data['guild_members']);
            $current_users_ids = explode(",", $guild_data['users_ids']);

            // Find the index of the guild member to remove
            $member_index = array_search($guild_member_id, $current_users_ids);

            if ($member_index !== false) {
                // Remove the member from the arrays
                unset($current_members[$member_index]);
                unset($current_users_ids[$member_index]);

                // If there are only two members left, format the arrays without comma
                if (count($current_members) === 2) {
                    $new_members = implode("", $current_members);
                    $new_users_ids = implode("", $current_users_ids);
                } else {
                    $new_members = implode(",", $current_members);
                    $new_users_ids = implode(",", $current_users_ids);
                }

                $update_query = "UPDATE users_guilds SET guild_members = '$new_members', users_ids = '$new_users_ids' WHERE guild_id = '$guild_id' AND guild_name = '$guild_name'";
                $update_result = mysqli_query($con, $update_query);

                if ($update_result) {
                    $remove_member_post_query = "DELETE FROM `user_guild_posts` WHERE user_id = '$guild_member_id'";
                    $remove_member_post_result = mysqli_query($con, $remove_member_post_query) ?? NULL;

                    $data['status'] = 'success';
                    $data['message'] = 'Guild member removed successfully.';
                } else {
                    $data['status'] = 'error';
                    $data['message'] = 'Failed to update guild information.';
                }
            } else {
                $data['status'] = 'error';
                $data['message'] = 'Guild member not found in the guild.';
            }
        } else {
            $data['status'] = 'error';
            $data['message'] = 'No user found.';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = "You don't have the permission to remove the guild member.";
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>