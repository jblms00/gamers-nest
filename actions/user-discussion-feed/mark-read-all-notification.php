<?php

include("../database-connect.php");

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_POST['userid'];

    $query_user = "SELECT * FROM user_notifications WHERE user_id = '$user_id'";

    if ($result_user = mysqli_query($con, $query_user)) {
        $query_user_notif = "UPDATE user_notifications SET is_read ='true' WHERE user_id = '$user_id'";
        $result_user_notif = mysqli_query($con, $query_user_notif);

        if ($result_user_notif !== false) {
            $data['status'] = 'success';
            $data['message'] = 'All notifications have been marked as read.';
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Failed to update the notification status.';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'No notifications found.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);