<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $get_users_query = "SELECT pc.*, ua.username, ua.user_avatar FROM user_posted_content pc
                        LEFT JOIN users_accounts ua ON pc.user_id = ua.user_id ORDER BY user_posted_date DESC";
    $get_users_result = mysqli_query($con, $get_users_query);

    if ($get_users_result) {
        $data['status'] = 'success';
        $data['posts'] = [];

        while ($row = mysqli_fetch_assoc($get_users_result)) {
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