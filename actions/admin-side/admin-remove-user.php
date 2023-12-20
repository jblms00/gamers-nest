<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'];

    $get_users_query = "SELECT * FROM users_accounts WHERE user_id = '$user_id'";
    $get_users_result = mysqli_query($con, $get_users_query);

    if ($get_users_result) {
        $remove_user_query = "DELETE FROM users_accounts WHERE user_id = '$user_id'";
        $remove_user_result = mysqli_query($con, $remove_user_query);

        if ($remove_user_result) {
            $data['status'] = 'success';
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Failed to fetch user data.';
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