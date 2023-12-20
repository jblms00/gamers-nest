<?php

include("../database-connect.php");

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_POST['user_id'];
    $notification_id = $_POST['notification_id'];

    $sql = "SELECT * FROM user_notifications WHERE user_id = '$user_id' AND notification_id = '$notification_id'";
    $query = mysqli_query($con, $sql);
    $result = mysqli_fetch_assoc($query);

    if ($query && mysqli_num_rows($query) > 0) {
        $deleteQuery = "DELETE FROM user_notifications WHERE user_id = '$user_id' AND notification_id = '$notification_id'";

        if ($deleteResult = mysqli_query($con, $deleteQuery)) {
            $data['user_id'] = $user_id;
            $data['status'] = 'success';
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Error removing notification.';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'No notification found.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);