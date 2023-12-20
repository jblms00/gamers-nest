<?php

include("database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $user_id = $_POST['user_id'];
    $old_password = base64_encode(mysqli_real_escape_string($con, $_POST['old_password']));
    $new_password = base64_encode(mysqli_real_escape_string($con, $_POST['new_password']));
    $confirm_password = base64_encode(mysqli_real_escape_string($con, $_POST['confirm_password']));

    $get_user_query = "SELECT user_password FROM users_accounts WHERE user_id = '$user_id'";
    $get_user_result = mysqli_query($con, $get_user_query);

    if ($get_user_result && mysqli_num_rows($get_user_result) > 0) {
        $fetch_user = mysqli_fetch_assoc($get_user_result);
        $current_password = $fetch_user['user_password'];

        if (empty($old_password)) {
            $data['message'] = "Please enter your old password";
            $data['status'] = "error";
        } else if (base64_encode($new_password) === $old_password) {
            $data['message'] = "The new password is the same as your current password. Please choose a different password.";
            $data['status'] = "error";
        } else if (empty($confirm_password)) {
            $data['message'] = "Please confirm your password";
            $data['status'] = "error";
        } else if ($new_password !== $confirm_password) {
            $data['message'] = "Passwords do not match";
            $data['status'] = "error";
        } else if ($old_password !== $current_password) {
            $data['message'] = "Incorrect old password";
            $data['status'] = "error";

            $data['old_password'] = $old_password;
            $data['current_password'] = $current_password;
        } else if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[a-zA-Z\d\W]{8,}$/', base64_decode($new_password))) {
            $data['status'] = "error";
            $data['message'] = "Password should be at least 8 characters in length and should include at least one upper case letter, one number, and one special character.";
        } else {
            $update_password_query = "UPDATE users_accounts SET user_password = '$new_password' WHERE user_id = '$user_id'";
            $update_password_result = mysqli_query($con, $update_password_query);

            if ($update_password_result) {
                $data['status'] = "success";
                $data['message'] = "Password updated successfully";
            } else {
                $data['status'] = "error";
                $data['message'] = "Password update failed";
            }
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
?>