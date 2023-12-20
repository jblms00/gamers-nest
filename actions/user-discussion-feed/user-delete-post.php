<?php

include("../database-connect.php");

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_POST['user_id'];
    $user_content_id = $_POST['user_content_id'];

    $sql = "SELECT * FROM user_posted_content WHERE user_content_id = '$user_content_id' AND user_id = '$user_id'";
    $query = mysqli_query($con, $sql);
    $result = mysqli_fetch_assoc($query);

    if ($query && mysqli_num_rows($query) > 0) {
        $query_posts = "DELETE FROM user_posted_content WHERE user_content_id = '$user_content_id' AND user_id = '$user_id'";

        if ($deleteResult = mysqli_query($con, $query_posts)) {
            $query_comments = "DELETE FROM user_contents_comments WHERE user_content_id = '$user_content_id' AND user_id = '$user_id'";

            if ($deletecommentsResult = mysqli_query($con, $query_comments)) {
                $query_likes = "DELETE FROM user_posts_likes WHERE user_content_id = '$user_content_id' AND user_id = '$user_id'";
                $removelikesResult = mysqli_query($con, $query_likes);

                $data['user_id'] = $user_id;
                $data['user_content_id'] = $user_content_id;
                $data['status'] = 'success';
            }
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Error deleting user post.';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'no_content';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);