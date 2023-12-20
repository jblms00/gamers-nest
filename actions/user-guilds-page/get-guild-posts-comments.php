<?php
session_start();
include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $current_user_id = ($logged_in_user_id === $_POST['user_id']) ? $_POST['user_id'] : $logged_in_user_id;
    $guild_id = $_POST['guild_id'];
    $guild_name = $_POST['guild_name'];
    // Query for posts
    $get_post_query = "SELECT * FROM user_guild_posts WHERE guild_id = '$guild_id' AND post_status = 'Active' ORDER BY posted_at DESC";
    $get_post_result = mysqli_query($con, $get_post_query);
    $posts = [];

    if ($get_post_result && mysqli_num_rows($get_post_result) > 0) {
        while ($fetch_post = mysqli_fetch_assoc($get_post_result)) {
            $post = [
                'current_user_id' => $user_data['user_id'],
                'current_username' => $user_data['username'],
                'current_user_avatar' => $user_data['user_avatar'],
                'guild_post_id' => $fetch_post['guild_post_id'],
                'guild_id' => $fetch_post['guild_id'],
                'user_id' => $fetch_post['user_id'],
                'user_posted_content' => $fetch_post['user_posted_content'],
                'media_upload' => $fetch_post['media_upload'],
                'media_orientation' => $fetch_post['media_orientation'],
                'likes' => 0,
                'liked_by_user' => false,
                'comments' => [],
                'users_information' => []
            ];

            // Sanitize media_orientation to prevent possible security issues
            $media_orientation = $fetch_post['media_orientation'];
            $mediaOrientations = !empty($media_orientation) ? explode(',', $media_orientation) : [];
            $post['media_orientations_str'] = $mediaOrientations;

            // Query for likes related to the post
            $guild_post_id = $fetch_post['guild_post_id'];
            $query_likes = "SELECT * FROM user_posts_likes WHERE user_content_id = '$guild_post_id'";
            $result_likes = mysqli_query($con, $query_likes);
            $num_likes = mysqli_num_rows($result_likes);
            $post['likes'] = $num_likes;

            // Check if the user has already liked the post
            $query_check_like = "SELECT * FROM user_posts_likes WHERE user_content_id = '$guild_post_id' AND user_id = '$current_user_id'";
            $result_check_like = mysqli_query($con, $query_check_like);
            $fetch_check_like = mysqli_fetch_assoc($result_check_like);
            if ($result_check_like && mysqli_num_rows($result_check_like) > 0) {
                $post['liked_by_user'] = true;
                $post['likepost_id'] = $fetch_check_like['user_like_id'];
            }

            // Query for comments related to the post
            $query_comments = "SELECT * FROM user_contents_comments WHERE user_content_id = '$guild_post_id' ORDER BY user_created_at DESC";
            $result_comments = mysqli_query($con, $query_comments);
            $comments = [];

            if ($result_comments && mysqli_num_rows($result_comments) > 0) {
                while ($fetch_comments = mysqli_fetch_assoc($result_comments)) {
                    $comment = [
                        'commenter_id' => $fetch_comments['user_id'],
                        'guild_post_id' => $fetch_comments['user_content_id'],
                        'comment_id' => $fetch_comments['user_comment_id'],
                        'commenter_username' => $fetch_comments['username'],
                        'commenter_user_avatar' => $fetch_comments['user_avatar'],
                        'comment_text' => $fetch_comments['comment_text']
                    ];
                    array_push($comments, $comment);
                }
            }
            $post['comments'] = $comments;

            // Get author of the post information
            $atuhor_id = $fetch_post['user_id'];
            $get_author = "SELECT user_id, username, user_avatar FROM users_accounts WHERE user_id = '$atuhor_id'";
            $get_author_result = mysqli_query($con, $get_author);
            $users_information = [];

            if ($get_author_result && mysqli_num_rows($get_author_result) > 0) {
                while ($fetch_author = mysqli_fetch_assoc($get_author_result)) {
                    $user_information = [
                        'author_user_id' => $fetch_author['user_id'],
                        'author_username' => $fetch_author['username'],
                        'author_user_avatar' => $fetch_author['user_avatar']
                    ];
                    array_push($users_information, $user_information);
                }
            }
            $post['users_information'] = $users_information;
            array_push($posts, $post);
        }
        $data['status'] = "success";
        $data['message'] = "Posts retrieved successfully.";
        $data['posts'] = $posts;
    } else {
        $data['status'] = "error";
        $data['no_post'] = 0;
        $data['message'] = "No posts found.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}


echo json_encode($data);
?>