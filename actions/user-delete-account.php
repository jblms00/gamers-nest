<?php
session_start();

include("database-connect.php");
include("check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];
$logged_in_username = $user_data['username'];

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $user_id = $_POST['user_id'];
    $user_password = $_POST['user_password'];

    if ($logged_in_user_id !== $user_id) {
        $data['status'] = "error";
        $data['message'] = "ID does not match";
    } else if (empty($user_password)) {
        $data['status'] = "error";
        $data['message'] = "For account deletion, please enter your password.";
    } else if ($user_data['user_password'] !== $user_password) {
        $data['status'] = "error";
        $data['message'] = "Invalid  password, please enter the correct password";
    } else {
        $get_guild_query = "SELECT * FROM users_guilds WHERE guild_creator_id = '$user_id'";
        $get_guild_result = mysqli_query($con, $get_guild_query);
        $guild_data = mysqli_fetch_assoc($get_guild_result);

        if ($get_guild_result && mysqli_num_rows($get_guild_result) > 0) {
            // Delete the user's guild
            $delete_guild_query = "DELETE FROM users_guilds WHERE guild_id = '{$guild_data['guild_id']}' AND guild_name = '{$guild_data['guild_name']}'";
            $delete_guild_result = mysqli_query($con, $delete_guild_query);

            if ($delete_guild_result) {
                $data['message'] = 'Guild Deleted';
            } else {
                $data['status'] = 'error';
                $data['message'] = 'Failed to delete guild.';
            }
        }

        // Check if the user is a member of other guilds
        $get_member_guilds_query = "SELECT * FROM users_guilds WHERE users_ids LIKE '%$logged_in_user_id%'";
        $get_member_guilds_result = mysqli_query($con, $get_member_guilds_query);

        if ($get_member_guilds_result && mysqli_num_rows($get_member_guilds_result) > 0) {
            while ($member_guild = mysqli_fetch_assoc($get_member_guilds_result)) {
                $user_ids = explode(',', $member_guild['users_ids']);
                $guild_members = explode(',', $member_guild['guild_members']);

                $user_ids_key = array_search($logged_in_user_id, $user_ids);
                if ($user_ids_key !== false) {
                    unset($user_ids[$user_ids_key]);
                    $updated_user_ids = implode(",", $user_ids);

                    $guild_members_key = array_search($logged_in_username, $guild_members);
                    if ($guild_members_key !== false) {
                        unset($guild_members[$guild_members_key]);
                        $updated_guild_members = implode(",", $guild_members);

                        // Update the user's guild
                        $update_users_query = "UPDATE users_guilds SET users_ids = '$updated_user_ids', guild_members = '$updated_guild_members' WHERE guild_id = '{$member_guild['guild_id']}'";
                        $update_users_result = mysqli_query($con, $update_users_query);

                        if ($update_users_result) {
                            $data['message'] = 'Removed from Guild';
                        } else {
                            $data['status'] = 'error';
                            $data['message'] = 'Failed to remove from guild.';
                        }
                    }
                }
            }
        }

        $delete_block_query = "DELETE FROM `blocked_users` WHERE blocking_user_id = '$user_id'";
        $delete_block_result = mysqli_query($con, $delete_block_query);

        $delete_gconversation_query = "DELETE FROM `guild_conversation_room` WHERE sender_id = '$user_id'";
        $delete_conversation_result = mysqli_query($con, $delete_gconversation_query);

        $delete_gpost_query = "DELETE FROM `user_guild_posts` WHERE user_id = '$user_id'";
        $delete_post_result = mysqli_query($con, $delete_gpost_query) ?? NULL;

        $delete_request_query = "DELETE FROM `user_guild_request` WHERE user_id = '$user_id'";
        $delete_request_result = mysqli_query($con, $delete_request_query) ?? NULL;

        $delete_report_query = "DELETE FROM `users_reports` WHERE user_id = '$user_id'";
        $delete_report_result = mysqli_query($con, $delete_report_query);

        $delete_pcomment_query = "DELETE FROM `user_contents_comments` WHERE user_id = '$user_id'";
        $delete_pcomment_result = mysqli_query($con, $delete_pcomment_query);

        $delete_following_query = "DELETE FROM `user_follows` WHERE following_id = '$user_id'";
        $delete_following_result = mysqli_query($con, $delete_following_query);

        $delete_followers_query = "DELETE FROM `user_follows` WHERE follower_id = '$user_id'";
        $delete_followers_result = mysqli_query($con, $delete_followers_query);

        $delete_smessage_query = "DELETE FROM `user_messages` WHERE sender_id = '$user_id'";
        $delete_smessage_result = mysqli_query($con, $delete_smessage_query);

        $delete_rmessage_query = "DELETE FROM `user_messages` WHERE receiver_id = '$user_id'";
        $delete_rmessage_result = mysqli_query($con, $delete_rmessage_query);

        $delete_unotif_query = "DELETE FROM `user_notifications` WHERE user_id = '$user_id'";
        $delete_unotif_result = mysqli_query($con, $delete_unotif_query);

        $delete_snotif_query = "DELETE FROM `user_notifications` WHERE sender_id = '$user_id'";
        $delete_snotif_result = mysqli_query($con, $delete_snotif_query);

        $delete_post_query = "DELETE FROM `user_posted_content` WHERE user_id = '$user_id'";
        $delete_post_result = mysqli_query($con, $delete_post_query);

        $delete_likepost_query = "DELETE FROM `user_posts_likes` WHERE user_id = '$user_id'";
        $delete_likepost_result = mysqli_query($con, $delete_likepost_query);

        $delete_spostcom_query = "DELETE FROM `user_sharedpost_comments` WHERE user_id = '$user_id'";
        $delete_spostcom_result = mysqli_query($con, $delete_spostcom_query);

        $delete_spost_query = "DELETE FROM `user_shared_post` WHERE user_id = '$user_id'";
        $delete_spost_result = mysqli_query($con, $delete_spost_query);

        $delete_splikes_query = "DELETE FROM `user_shared_posts_likes` WHERE user_id = '$user_id'";
        $delete_splikes_result = mysqli_query($con, $delete_splikes_query);

        $delete_account_query = "DELETE FROM `users_accounts` WHERE user_id = '$user_id'";
        $delete_account_result = mysqli_query($con, $delete_account_query);

        $delete_vroom_query = "DELETE FROM `voice_room` WHERE user_id = '$user_id'";
        $delete_vroom_result = mysqli_query($con, $delete_vroom_query);

        if ($delete_block_result && $delete_conversation_result && $delete_post_result && $delete_request_result && $delete_report_result && $delete_pcomment_result && $delete_following_result && $delete_followers_result && $delete_smessage_result && $delete_rmessage_result && $delete_unotif_result && $delete_snotif_result && $delete_post_result && $delete_likepost_result && $delete_spostcom_result && $delete_spost_result && $delete_splikes_result && $delete_account_result && $delete_vroom_result) {
            $data['status'] = 'success';
            $data['message'] = 'Account Deleted';
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Failed to delete account.';
        }

        // Set success message
        $data['status'] = 'success';
        $data['message'] = 'Account Deleted';
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method";
}

echo json_encode($data);
?>