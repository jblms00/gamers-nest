<?php
include("../database-connect.php");

$data = [];

$tablesToDeleteFrom = [
    'users_guilds',
    'guild_conversation_room',
    'user_guild_posts',
    'user_guild_request'
];

$success = true;

foreach ($tablesToDeleteFrom as $table) {
    $delete_query = "DELETE FROM $table";
    $delete_result = mysqli_query($con, $delete_query);

    if (!$delete_result) {
        $success = false;
        break; // No need to continue if a deletion fails
    }
}

if ($success) {
    $data['status'] = 'success';
} else {
    $data['status'] = 'error';
    $data['message'] = 'Failed to remove guilds.';
}

echo json_encode($data);
?>