<?php
session_start();
include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$currentUser = $user_data['user_id'];

$data = [];
$data['status'] = '';

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $user_id = $_POST['user_id'];
    $user_content_id = $_POST['post_id'];
    $sharedpost_id = $_POST['sharedpost_id'];

    // Query to get post data [who posted]
    $query_post = "SELECT * FROM user_posted_content WHERE user_content_id = '$user_content_id' AND user_id ='$user_id'";
    $query_post_result = mysqli_query($con, $query_post);

    if ($query_post_result && mysqli_num_rows($query_post_result) > 0) {
        $fetch_post_result = mysqli_fetch_assoc($query_post_result);
        $username = $fetch_post_result['username'];
        $user_avatar = $fetch_post_result['user_avatar'];
        $user_content = $fetch_post_result['user_content'];
        $user_topic = $fetch_post_result['user_topic'];
        $media_upload = $fetch_post_result['media_upload'];
        $media_orientation = $fetch_post_result['media_orientation'];

        $query_currentUser = "SELECT * FROM users_accounts WHERE user_id = '$currentUser'";
        $query_currentUser_result = mysqli_query($con, $query_currentUser);

        if ($fetch_CurrentUser = mysqli_fetch_assoc($query_currentUser_result)) {
            $currentUserAvatar = $fetch_CurrentUser['user_avatar'];
            $currentUserName = $fetch_CurrentUser['username'];

            $data['current_user_avatar'] = $currentUserAvatar;
            $data['current_user_name'] = $currentUserName;
            $data['current_user_id'] = $currentUser;

            $data['user_content_id'] = $user_content_id;
            $data['user_id'] = $user_id;
            $data['username'] = $username;
            $data['user_avatar'] = $user_avatar;
            $data['user_content'] = $user_content;
            $data['user_topic'] = $user_topic;
            $data['media_upload'] = $media_upload;
            $data['media_orientation'] = $media_orientation;

            $data['status'] = 'success';
            $data['message'] = 'Shared post successfully';

        } else {
            $data['status'] = 'error';
            $data['message'] = 'Error fetching current user data.';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'No users found';
    }
}

echo json_encode($data);