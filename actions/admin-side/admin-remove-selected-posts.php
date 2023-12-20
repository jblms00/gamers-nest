<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $selected_posts = $_POST['selected_posts'];

    if (!empty($selected_posts)) {
        // Use proper escaping/prepared statements to prevent SQL injection
        $selected_guild_ids = implode(',', array_map('intval', $selected_posts));

        // Delete the selected guilds from the database
        $delete_guild_query = "DELETE FROM user_posted_content WHERE user_content_id IN ($selected_guild_ids)";
        $delete_guild_result = mysqli_query($con, $delete_guild_query);

        if ($delete_guild_result) {
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