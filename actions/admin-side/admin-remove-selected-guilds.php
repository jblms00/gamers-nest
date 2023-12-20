<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $selected_guilds = $_POST['selected_guilds'];

    if (!empty($selected_guilds)) {
        // Use proper escaping/prepared statements to prevent SQL injection
        $selected_guild_ids = implode(',', array_map('intval', $selected_guilds));

        // Delete the selected guilds from the database
        $delete_guild_query = "DELETE FROM users_guilds WHERE guild_id IN ($selected_guild_ids)";
        $delete_guild_result = mysqli_query($con, $delete_guild_query);

        $delete_posts_query = "DELETE FROM user_guild_posts WHERE guild_id IN ($selected_guild_ids)";
        $delete_posts_result = mysqli_query($con, $delete_posts_query);

        $delete_convo_query = "DELETE FROM guild_conversation_room WHERE guild_name IN ($selected_guild_ids)";
        $delete_convo_result = mysqli_query($con, $delete_convo_query);

        if ($delete_guild_result && $delete_convo_result && $delete_posts_result) {
            $data['status'] = 'success';
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Failed to remove selected guilds.';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'No selected guilds to remove.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>