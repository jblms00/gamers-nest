<?php

include("../database-connect.php");

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_POST['user_id'];
    $user_comment_id = $_POST['user_comment_id'];
    $user_content_id = $_POST['user_content_id'];

    $sql = "SELECT * FROM user_contents_comments WHERE user_comment_id = '$user_comment_id' AND user_id = '$user_id'";
    $query = mysqli_query($con, $sql);
    $result = mysqli_fetch_assoc($query);

    if ($query && mysqli_num_rows($query) > 0) {
        $deleteQuery = "DELETE FROM user_contents_comments WHERE user_comment_id = '$user_comment_id' AND user_id = '$user_id'";

        if ($deleteResult = mysqli_query($con, $deleteQuery)) {
            $deleteNotifQuery = "DELETE FROM user_notifications WHERE activity_id = '$user_comment_id' AND sender_id = '$user_id'";
            $deleteNotifResult = mysqli_query($con, $deleteNotifQuery);

            $data['user_id'] = $user_id;
            $data['status'] = 'success';
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Error deleting user comment.';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'User comment not found.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);