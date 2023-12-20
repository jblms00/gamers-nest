<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $selected_users = $_POST['selected_users'];
    $selected_usernames = $_POST['selected_usersname'];

    if (!empty($selected_users)) {
        $selected_users_ids = implode(',', array_map('intval', $selected_users));
        $selected_usernames = implode("','", array_map(function ($user) use ($con) {
            return mysqli_real_escape_string($con, $user);
        }, $selected_users));

        $delete_guilds = [];

        $check_creator_query = "SELECT guild_id, guild_creator_id FROM users_guilds WHERE users_ids IN ($selected_users_ids)";
        $check_creator_result = mysqli_query($con, $check_creator_query);

        while ($row = mysqli_fetch_assoc($check_creator_result)) {
            if ($row['guild_creator_id'] == 1) {
                $delete_guilds[] = $row['guild_id'];
            }
        }

        if (!empty($delete_guilds)) {
            $delete_guilds_ids = implode(',', array_map('intval', $delete_guilds));
            $delete_guilds_names = implode(',', array_map('intval', $delete_guilds_name));

            $delete_guilds_query = "DELETE FROM users_guilds WHERE guild_id IN ($delete_guilds_ids)";
            $delete_guilds_result = mysqli_query($con, $delete_guilds_query);

            $delete_gconvo_query = "DELETE FROM guild_conversation_room WHERE guild_name IN ($delete_guilds_names)";
            $delete_gconvo_result = mysqli_query($con, $delete_gconvo_query);

            $delete_gposts_query = "DELETE FROM user_guild_posts WHERE guild_id IN ($delete_guilds_ids)";
            $delete_gposts_result = mysqli_query($con, $delete_gposts_query);

            $delete_request_query = "DELETE FROM user_guild_request WHERE guild_id IN ($delete_guilds_ids)";
            $delete_request_result = mysqli_query($con, $delete_request_query);

            if (!$delete_guilds_result) {
                $data['status'] = 'error';
                $data['message'] = 'Failed to delete guilds.';
                echo json_encode($data);
                exit;
            }
        }

        $remove_users_ids_query = "UPDATE users_guilds SET users_ids = REPLACE(users_ids, '$selected_users_ids,', '')";
        $remove_users_ids_result = mysqli_query($con, $remove_users_ids_query);

        $remove_usernames_query = "UPDATE users_guilds SET guild_members = REPLACE(guild_members, '$selected_usernames,', '')";
        $remove_usernames_result = mysqli_query($con, $remove_usernames_query);

        $delete_users_query = "DELETE FROM users_accounts WHERE user_id IN ($selected_users_ids)";
        $delete_users_result = mysqli_query($con, $delete_users_query);

        $delete_block_query = "DELETE FROM blocked_users WHERE blocked_user_id IN ($selected_users_ids)";
        $delete_block_result = mysqli_query($con, $delete_block_query);

        $delete_report_query = "DELETE FROM users_reports WHERE reported_user_id IN ($selected_users_ids)";
        $delete_report_result = mysqli_query($con, $delete_report_query);

        $delete_comments_query = "DELETE FROM user_contents_comments WHERE user_id IN ($selected_users_ids)";
        $delete_comments_result = mysqli_query($con, $delete_comments_query);

        $delete_follows_query = "DELETE FROM user_follows WHERE follower_id IN ($selected_users_ids) OR following_id IN ($selected_users_ids)";
        $delete_follows_result = mysqli_query($con, $delete_follows_query);

        $delete_messages_query = "DELETE FROM user_messages WHERE sender_id IN ($selected_users_ids) OR receiver_id IN ($selected_users_ids)";
        $delete_messages_result = mysqli_query($con, $delete_messages_query);

        $delete_convo_query = "DELETE FROM user_conversation_room WHERE sender_id IN ($selected_users_ids) OR receiver_id IN ($selected_users_ids)";
        $delete_convo_result = mysqli_query($con, $delete_convo_query);

        $delete_notification_query = "DELETE FROM user_notifications WHERE user_id IN ($selected_users_ids)";
        $delete_notification_result = mysqli_query($con, $delete_notification_query);

        $delete_posts_query = "DELETE FROM user_posted_content WHERE user_id IN ($selected_users_ids)";
        $delete_posts_result = mysqli_query($con, $delete_posts_query);

        $delete_likes_query = "DELETE FROM user_posts_likes WHERE user_id IN ($selected_users_ids)";
        $delete_likes_result = mysqli_query($con, $delete_likes_query);

        $delete_spcomm_query = "DELETE FROM user_sharedpost_comments WHERE user_id IN ($selected_users_ids)";
        $delete_spcomm_result = mysqli_query($con, $delete_spcomm_query);

        $delete_sposts_query = "DELETE FROM user_shared_post WHERE user_id IN ($selected_users_ids)";
        $delete_sposts_result = mysqli_query($con, $delete_sposts_query);

        $delete_splikes_query = "DELETE FROM user_shared_posts_likes WHERE user_id IN ($selected_users_ids)";
        $delete_splikes_result = mysqli_query($con, $delete_splikes_query);

        if (
            $remove_users_ids_result && $remove_usernames_result && $delete_users_result &&
            $delete_block_result && $delete_report_result && $delete_comments_result &&
            $delete_follows_result && $delete_messages_result && $delete_convo_result &&
            $delete_notification_result && $delete_posts_result && $delete_likes_result &&
            $delete_spcomm_result && $delete_sposts_result && $delete_splikes_result
        ) {
            $data['status'] = 'success';
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Failed to remove selected users.';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'No selected users to remove.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>