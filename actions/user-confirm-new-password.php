<?php

include("database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $new_password = base64_encode($_POST['new_password']);
    $user_id = $_POST['user_id'];

    $get_user_query = "SELECT * FROM users_accounts WHERE user_id = '$user_id'";
    $get_user_result = mysqli_query($con, $get_user_query);

    if ($get_user_result && mysqli_num_rows($get_user_result) > 0) {
        $update_password_query = "UPDATE users_accounts SET user_password = '$new_password' WHERE user_id = '$user_id'";
        $update_password_result = mysqli_query($con, $update_password_query);

        if ($update_password_result) {
            $data['status'] = "success";
            $data['message'] = "Your password has been successfully changed. For security reasons, please log out and log in again to use your new password.";
        } else {
            $data['status'] = "error";
            $data['message'] = "Cannot update your password.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "User not found";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method";
}

echo json_encode($data);