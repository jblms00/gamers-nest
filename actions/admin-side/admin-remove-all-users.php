<?php

include("../database-connect.php");

$data = [];
$success = true;

$tables_to_delete = [
    "guild_conversation_room",
    "blocked_users",
    "users_guilds",
    "users_reports",
    "user_contents_comments",
    "user_conversation_room",
    "user_follows",
    "user_guild_posts",
    "user_guild_request",
    "user_messages",
    "user_notifications",
    "user_posted_content",
    "user_posts_likes",
    "user_sharedpost_comments",
    "user_shared_post",
    "user_shared_posts_likes",
    "voice_room"
];

foreach ($tables_to_delete as $table) {
    $delete_query = "DELETE FROM $table";
    $delete_result = mysqli_query($con, $delete_query);

    if (!$delete_result) {
        $success = false;
        $data['status'] = 'error';
        $data['message'] = "Failed to remove records from $table.";
        break;
    }
}

if ($success) {
    $delete_query = "DELETE FROM users_accounts WHERE user_type = 'user'";
    $delete_result = mysqli_query($con, $delete_query);

    if ($delete_result) {
        $data['status'] = 'success';
    } else {
        $data['status'] = 'error';
        $data['message'] = 'Failed to remove user accounts.';
    }
}

echo json_encode($data);
?>