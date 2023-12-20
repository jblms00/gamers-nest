<?php
session_start();
include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userId = $user_data['user_id'];
    $sharedPostId = $_POST['sharedpost_id'];

    $selectQuery = "SELECT * FROM user_shared_post WHERE shared_post_id = '$sharedPostId' AND user_id = '$userId'";
    $selectResult = mysqli_query($con, $selectQuery);
    $selectQuery_num_rows = mysqli_num_rows($selectResult);

    if ($selectQuery_num_rows > 0) {
        $deleteQuery = "DELETE FROM user_shared_post WHERE shared_post_id = '$sharedPostId' AND user_id = '$userId'";
        $deleteResult = mysqli_query($con, $deleteQuery);

        if ($deleteResult) {
            $deleteSharedPostLikesQuery = "DELETE FROM user_shared_posts_likes WHERE shared_post_id = '$sharedPostId' AND user_id = '$userId'";
            $deleteSharedPostLikesResult = mysqli_query($con, $deleteSharedPostLikesQuery);

            if ($deleteSharedPostLikesResult) {
                $deleteSharedPostCommentsQuery = "DELETE FROM user_sharedpost_comments WHERE shared_post_id = '$sharedPostId'";
                $deleteSharedPostCommentsResult = mysqli_query($con, $deleteSharedPostCommentsQuery);

                if ($deleteSharedPostCommentsResult) {
                    $deleteNotifQuery = "DELETE FROM user_notifications WHERE activity_id = '$sharedPostId' AND sender_id = '$userId'";
                    $deleteNotifResult = mysqli_query($con, $deleteNotifQuery);

                    $data['status'] = 'success';
                } else {
                    $data['status'] = 'error';
                    $data['message'] = 'Error deleting shared post comments.';
                }
            } else {
                $data['status'] = 'error';
                $data['message'] = 'Error deleting shared post likes.';
            }
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Error deleting user post.';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'No content found.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);