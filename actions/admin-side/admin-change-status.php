<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'];
    $selected_status = $_POST['selected_status'];

    $get_users_query = "SELECT * FROM users_accounts WHERE user_id = '$user_id'";
    $get_users_result = mysqli_query($con, $get_users_query);

    if ($get_users_result) {
        $user_data = mysqli_fetch_assoc($get_users_result);

        if ($selected_status === 'Edit Account Status') {
            $data['status'] = 'error';
            $data['message'] = 'Please select whether you want to change the account status or not.';
        } else if ($selected_status === 'Warning') {
            $suspend_query = "UPDATE users_accounts SET account_status = 'Warning' WHERE user_id = '$user_id'";
            $suspend_result = mysqli_query($con, $suspend_query);

            if ($suspend_result) {
                $notification_id = rand(100000, 999999);
                $activity_type = 'warning_account_status';
                $timestamp = date('Y-m-d H:i:s');

                $sql_notification = "INSERT INTO user_notifications (notification_id, user_id, activity_type, activity_id, sender_id, timestamp, is_read) VALUES ('$notification_id', '$user_id', '$activity_type', '$notification_id', 'admin', '$timestamp', 'false')";
                $query_notification = mysqli_query($con, $sql_notification);

                if ($query_notification) {
                    $data['status'] = 'success';
                } else {
                    $data['status'] = 'error';
                    $data['message'] = 'Failed to send notification.';
                }
            } else {
                $data['status'] = 'error';
                $data['message'] = 'Failed to suspend the account.';
            }
        } else if ($selected_status === 'Suspend') {
            // Suspend Account for 14 days
            $suspended_date = date('Y-m-d H:i:s');
            $suspension_period = 14 * 24 * 60 * 60; // 14 days in seconds
            $suspended_until = date('Y-m-d H:i:s', strtotime($suspended_date) + $suspension_period);

            $suspend_query = "UPDATE users_accounts SET account_status = 'Suspend', suspended_date = '$suspended_until' WHERE user_id = '$user_id'";
            $suspend_result = mysqli_query($con, $suspend_query);

            if ($suspend_result) {
                $data['status'] = 'success';
                $data['message'] = 'Account suspended successfully for 14 days.';
            } else {
                $data['status'] = 'error';
                $data['message'] = 'Failed to suspend the account.';
            }
        } else if ($selected_status === 'Banned') {
            $delete_account_query = "DELETE FROM `users_accounts` WHERE user_id ='$user_id'";
            $delete_account_result = mysqli_query($con, $delete_account_query);

            if ($delete_account_result) {
                $data['status'] = 'success';
                $data['message'] = 'Account Removed Successfully';
            } else {
                $data['status'] = 'error';
                $data['message'] = 'Failed to removed the account.';
            }
        } else {
            $update_status_query = "UPDATE users_accounts SET account_status = '$selected_status', suspended_date = '' WHERE user_id = '$user_id'";
            $update_status_result = mysqli_query($con, $update_status_query);

            if ($update_status_result) {
                $data['status'] = 'success';
            } else {
                $data['status'] = 'error';
                $data['message'] = 'Failed to update status.';
            }
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