<?php
session_start();
include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);

$data = [];

if (isset($_POST['input'])) {
    $input = $_POST['input'];

    if (!empty($data['users'] = getUsers()) || !empty($data['posts'] = getPosts()) || !empty($data['sharedPosts'] = getSharedPosts())) {
        $data['users'] = getUsers();
        $data['posts'] = getPosts();
        $data['sharedPosts'] = getSharedPosts();

        $data['status'] = 'success';
        $data['data'] = $data;
        $data['current_user_avatar'] = $user_data['user_avatar'];
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);

function getUsers()
{
    include("../database-connect.php");

    $input = $_POST['input'];
    $escaped_input = mysqli_real_escape_string($con, $input);

    $query_users = "SELECT * FROM users_accounts WHERE username LIKE '%$escaped_input%'";
    $result_users = mysqli_query($con, $query_users);
    $users = [];

    if ($query_num_rows = mysqli_num_rows($result_users) > 0) {
        while ($fetch_users = mysqli_fetch_assoc($result_users)) {
            $user = [
                'user_name' => $fetch_users['username'],
                'user_id' => $fetch_users['user_id']
            ];
            array_push($users, $user);
        }
    } else {
        $user = "No result found.";
    }

    return $users;
}

function getPosts()
{
    include("../database-connect.php");
    $user_data = check_login($con);

    $input = $_POST['input'];
    $escaped_input = mysqli_real_escape_string($con, $input);

    $query_posts = "SELECT * FROM user_posted_content WHERE username LIKE '%$escaped_input%' OR user_content LIKE '%$escaped_input%' OR user_topic LIKE '%$escaped_input%'";
    $result_posts = mysqli_query($con, $query_posts);
    $posts = [];

    if ($query_num_rows = mysqli_num_rows($result_posts) > 0) {
        while ($fetch_posts = mysqli_fetch_assoc($result_posts)) {

            // Check if the user has already liked the post
            $user_id = $user_data['user_id'];
            $query_check_like = "SELECT * FROM user_posts_likes WHERE user_content_id = '{$fetch_posts['user_content_id']}' AND user_id = '$user_id'";
            $result_check_like = mysqli_query($con, $query_check_like);
            $num_likes_by_user = mysqli_num_rows($result_check_like);
            $fetch_check_like = mysqli_fetch_assoc($result_check_like);

            $post = [
                'content_id' => $fetch_posts['user_content_id'],
                'user_id' => $fetch_posts['user_id'],
                'user_name' => $fetch_posts['username'],
                'user_avatar' => $fetch_posts['user_avatar'],
                'user_content' => $fetch_posts['user_content'],
                'media_upload' => $fetch_posts['media_upload'],
                'media_orientation' => $fetch_posts['media_orientation'],
                'user_topic' => $fetch_posts['user_topic'],
                'current_user_id' => $user_data['user_id'],
                'post_type' => "user_post",
                'likes' => 0,
                'liked_by_user' => false,
                'comments' => []
            ];

            // Query for comments related to the post
            $post_id = $fetch_posts['user_content_id'];
            $query_comments = "SELECT * FROM user_contents_comments WHERE user_content_id = '$post_id' ORDER BY user_created_at ASC";
            $result_comments = mysqli_query($con, $query_comments);
            $num_rows = mysqli_num_rows($result_comments);
            $comments = [];

            if ($num_rows > 0) {
                while ($row = mysqli_fetch_assoc($result_comments)) {
                    $comment = [
                        'user_id' => $row['user_id'],
                        'content_id' => $row['user_content_id'],
                        'comment_id' => $row['user_comment_id'],
                        'username' => $row['username'],
                        'user_avatar' => $row['user_avatar'],
                        'comment_text' => $row['comment_text']
                    ];
                    array_push($comments, $comment);
                }
            }
            $post['comments'] = $comments;

            if ($num_likes_by_user > 0) {
                $post['liked_by_user'] = true;
            }

            // Query for likes related to the post
            $query_likes = "SELECT * FROM user_posts_likes WHERE user_content_id = '{$fetch_posts['user_content_id']}'";
            $result_likes = mysqli_query($con, $query_likes);
            $num_likes = mysqli_num_rows($result_likes);
            $post['likes'] = $num_likes;

            if ($fetch_check_like !== null) {
                $post['likepost_id'] = $fetch_check_like['user_like_id'];
            }

            array_push($posts, $post);
        }
    } else {
        $post = "No result found.";
    }

    return $posts;
}

function getSharedPosts()
{
    include("../database-connect.php");
    $user_data = check_login($con);

    $input = $_POST['input'];
    $escaped_input = mysqli_real_escape_string($con, $input);

    $query_shared_posts = "SELECT user_shared_post.*,
                            users_accounts.username AS sharedpost_username, users_accounts.user_avatar AS sharedpost_user_avatar
                            FROM user_shared_post
                            INNER JOIN users_accounts ON user_shared_post.user_id = users_accounts.user_id
                            WHERE user_shared_post.shared_text_content LIKE '%$escaped_input%' OR users_accounts.username LIKE '%$escaped_input%'";

    $result_shared_posts = mysqli_query($con, $query_shared_posts);
    $sharedposts = [];

    if ($query_num_rows = mysqli_num_rows($result_shared_posts) > 0) {
        while ($fetch_shared_posts = mysqli_fetch_assoc($result_shared_posts)) {

            // Get the data of post in shared post
            $query_post = "SELECT * FROM user_posted_content WHERE user_content_id = '{$fetch_shared_posts['user_content_id']}'";
            $result_post = mysqli_query($con, $query_post);
            $fetch_post = mysqli_fetch_assoc($result_post);

            // Check if the user has already liked the post
            $user_id = $user_data['user_id'];
            $query_check_like = "SELECT * FROM user_shared_posts_likes WHERE shared_post_id = '{$fetch_shared_posts['shared_post_id']}' AND user_id = '$user_id'";
            $result_check_like = mysqli_query($con, $query_check_like);
            $num_likes_by_user = mysqli_num_rows($result_check_like);
            $fetch_check_like = mysqli_fetch_assoc($result_check_like);

            $sharedpost = [
                'shared_post_id' => $fetch_shared_posts['shared_post_id'],
                'user_id' => $fetch_shared_posts['user_id'],
                'user_content_id' => $fetch_shared_posts['user_content_id'],
                'shared_text_content' => $fetch_shared_posts['shared_text_content'],
                'sharedpost_username' => $fetch_shared_posts['sharedpost_username'],
                'sharedpost_user_avatar' => $fetch_shared_posts['sharedpost_user_avatar'],
                'current_user_id' => $user_id,
                'post_type' => "user_sharedpost",

                'post_id' => $fetch_post['user_content_id'] ?? 'post_deleted',
                'post_user_id' => $fetch_post['user_id'] ?? 'post_deleted',
                'post_user_name' => $fetch_post['username'] ?? 'post_deleted',
                'post_user_avatar' => $fetch_post['user_avatar'] ?? 'post_deleted',
                'post_user_content' => $fetch_post['user_content'] ?? 'post_deleted',
                'post_user_topic' => $fetch_post['user_topic'] ?? 'post_deleted',
                'post_media_upload' => $fetch_post['media_upload'] ?? 'post_deleted',
                'post_media_orientation' => $fetch_post['media_orientation'] ?? 'post_deleted',

                'sharedpost_likes' => 0,
                'sharedpost_liked_by_user' => false,
                'sharedpost_comments' => []
            ];

            // Query for comments related to the shared post
            $query_sharedpost_comments = "SELECT * FROM user_sharedpost_comments WHERE shared_post_id = '{$fetch_shared_posts['shared_post_id']}' ORDER BY comment_at DESC";
            $result_sharedpost_comments = mysqli_query($con, $query_sharedpost_comments);
            $sharedpost_num_rows = mysqli_num_rows($result_sharedpost_comments);
            $sharedpost_comments = [];

            if ($sharedpost_num_rows > 0) {
                while ($sharedpost_row = mysqli_fetch_assoc($result_sharedpost_comments)) {
                    $sharedpost_comment = [
                        'username' => $sharedpost_row['username'],
                        'user_avatar' => $sharedpost_row['user_avatar'],
                        'sharedpost_comment_id' => $sharedpost_row['sharedpost_comment_id'],
                        'shared_post_id' => $sharedpost_row['shared_post_id'],
                        'user_id' => $sharedpost_row['user_id'],
                        'user_content_id' => $sharedpost_row['user_content_id'],
                        'comment_text' => $sharedpost_row['comment_text']
                    ];
                    array_push($sharedpost_comments, $sharedpost_comment);
                }
            }
            $sharedpost['sharedpost_comments'] = $sharedpost_comments;

            if ($num_likes_by_user > 0) {
                $sharedpost['sharedpost_liked_by_user'] = true;
            }

            // Query for likes related to the post
            $query_sharedpost_likes = "SELECT * FROM user_shared_posts_likes WHERE shared_post_id = '{$fetch_shared_posts['shared_post_id']}'";
            $result_sharedpost_likes = mysqli_query($con, $query_sharedpost_likes);
            $num_sharedpost_likes = mysqli_num_rows($result_sharedpost_likes);
            $sharedpost['sharedpost_likes'] = $num_sharedpost_likes;

            if ($fetch_check_like !== null) {
                $sharedpost['sharedpost_like_id'] = $fetch_check_like['sharedpost_like_id'];
            }

            array_push($sharedposts, $sharedpost);
        }
    } else {
        $sharedpost = "No result found.";
    }

    return $sharedposts;
}