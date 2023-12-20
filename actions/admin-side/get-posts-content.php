<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_content_id = $_POST['post_id'];

    $get_post_query = "SELECT pc.*, ua.username, ua.user_avatar FROM user_posted_content pc
                        LEFT JOIN users_accounts ua ON pc.user_id = ua.user_id WHERE pc.user_content_id = $user_content_id";
    $get_post_result = mysqli_query($con, $get_post_query);

    if ($get_post_result) {
        $data['status'] = 'success';
        $data['posts'] = [];

        while ($row = mysqli_fetch_assoc($get_post_result)) {
            $data['posts'][] = $row;
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'Failed to fetch user data.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);