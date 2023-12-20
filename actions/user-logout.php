<?php
session_start();
include("database-connect.php");

if (isset($_SESSION['user_email'])) {
    $user_email = $_SESSION['user_email'];

    $get_user_query = "SELECT * FROM users_accounts WHERE user_email = '$user_email'";
    $get_user_result = mysqli_query($con, $get_user_query);
    $fetch_user = mysqli_fetch_assoc($get_user_result);

    if ($fetch_user['user_type'] === 'user') {
        $update_status_query = "UPDATE users_accounts SET user_status = 'Offline' WHERE user_email = '$user_email'";
        $update_status_result = mysqli_query($con, $update_status_query);

        if ($update_status_result) {
            session_destroy();
            header("Location: ../login-page.php");
            exit;
        }
    } else if ($fetch_user['user_type'] === 'admin') {
        $update_admin_status_query = "UPDATE users_accounts SET user_status = 'Offline' WHERE user_email = '$user_email'";
        $update_admin_status_result = mysqli_query($con, $update_admin_status_query);

        if ($update_admin_status_result) {
            session_destroy();
            header("Location: ../login-page.php");
            exit;
        }
    }
}
?>