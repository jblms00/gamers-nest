<?php
session_start();
include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_POST['user_id'];

    // Query for posts
    $sql = "SELECT * FROM user_posted_content WHERE user_id = '$user_id' AND user_content_status = 'Public' ORDER BY user_posted_date DESC";
    $query = mysqli_query($con, $sql);
    $query_num_rows = mysqli_num_rows($query);
    $posts = [];

    if ($query_num_rows > 0) {
        while ($query_result_post = mysqli_fetch_assoc($query)) {
            $post = [
                'content_id' => $query_result_post['user_content_id'],
                'user_id' => $query_result_post['user_id'],
                'username' => $query_result_post['username'],
                'user_avatar' => $query_result_post['user_avatar'],
                'user_content' => $query_result_post['user_content'],
                'media_upload' => $query_result_post['media_upload'],
                'media_orientation' => $query_result_post['media_orientation'],
                'user_topic' => $query_result_post['user_topic'],
                'likes' => 0,
                'liked_by_user' => false,
                'shared_by' => [],
                'comments' => []
            ];

            $mediaOrientations = array();
            if (!empty($row['media_orientation'])) {
                $mediaOrientations = explode(',', $row['media_orientation']);
            }
            $post['media_orientations_str'] = $mediaOrientations;

            // Query for comments related to the post
            $post_id = $query_result_post['user_content_id'];
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

            // Query for likes related to the post
            $query_likes = "SELECT * FROM user_posts_likes WHERE user_content_id = '$post_id'";
            $result_likes = mysqli_query($con, $query_likes);
            $num_likes = mysqli_num_rows($result_likes);
            $post['likes'] = $num_likes;

            // Check if the user has already liked the post
            $user_id = $user_data['user_id']; // Assuming user ID is stored in session
            $query_check_like = "SELECT * FROM user_posts_likes WHERE user_content_id = '$post_id' AND user_id = '$user_id'";
            $result_check_like = mysqli_query($con, $query_check_like);
            $fetch_check_like = mysqli_fetch_assoc($result_check_like);
            $num_likes_by_user = mysqli_num_rows($result_check_like);
            if ($num_likes_by_user > 0) {
                $post['liked_by_user'] = true;
                $post['likepost_id'] = $fetch_check_like['user_like_id'];
            }

            // Query for users who shared the post
            $query_shared_by = "SELECT * FROM user_shared_post WHERE user_content_id = '$post_id' AND user_id = '$user_id' ORDER BY shared_at ASC";
            $result_shared_by = mysqli_query($con, $query_shared_by);
            $shared_by = [];

            if ($result_shared_by) {
                while ($row_shared_by = mysqli_fetch_assoc($result_shared_by)) {
                    $shared_by_user_id = $row_shared_by['user_id'];
                    $shared_text_content = $row_shared_by['shared_text_content'];
                    $shared_post_id = $row_shared_by['shared_post_id'];
                    $shared_post_content_id = $row_shared_by['user_content_id'];

                    $query_shared_by_user = "SELECT * FROM users_accounts WHERE user_id = '$shared_by_user_id'";
                    $result_shared_by_user = mysqli_query($con, $query_shared_by_user);

                    if ($result_shared_by_user && mysqli_num_rows($result_shared_by_user) > 0) {
                        $shared_by_user = mysqli_fetch_assoc($result_shared_by_user);
                        $shared_by_username = $shared_by_user['username'];
                        $shared_by_user_avatar = $shared_by_user['user_avatar'];
                        $shared_by_data = [
                            'user_id' => $shared_by_user_id,
                            'username' => $shared_by_username,
                            'user_avatar' => $shared_by_user_avatar,
                            'shared_text_content' => $shared_text_content,
                            'shared_post_id' => $shared_post_id,
                            'shared_post_content_id' => $shared_post_content_id,
                            'sharedpost_likes' => 0,
                            'sharedpost_liked_by_user' => false,
                            'sharedpost_comments' => []
                        ];

                        // Query for comments related to the shared post
                        $query_sharedpost_comments = "SELECT * FROM user_sharedpost_comments WHERE shared_post_id = '$shared_post_id' ORDER BY comment_at DESC";
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
                        $shared_by_data['sharedpost_comments'] = $sharedpost_comments;

                        // Query for likes related to the shared post
                        $query_sharedpost_likes = "SELECT * FROM user_shared_posts_likes WHERE shared_post_id = '$shared_post_id'";
                        $result_sharedpost_likes = mysqli_query($con, $query_sharedpost_likes);

                        while ($get_sharedpost_likes = mysqli_fetch_assoc($result_sharedpost_likes)) {
                            $num_sharedpost_likes = mysqli_num_rows($result_sharedpost_likes);
                            $sharedpost_like_id = $get_sharedpost_likes['sharedpost_like_id'];
                            $shared_by_data['sharedpost_likes'] = $num_sharedpost_likes;

                            // Check if the user has already liked the shared post
                            $user_id = $user_data['user_id'];
                            $query_check_sharedpost_like = "SELECT * FROM user_shared_posts_likes WHERE sharedpost_like_id = '$sharedpost_like_id' AND user_id = '$user_id'";
                            $result_check_sharedpost_like = mysqli_query($con, $query_check_sharedpost_like);
                            $num_sharedpost_likes_by_user = mysqli_num_rows($result_check_sharedpost_like);

                            if ($num_sharedpost_likes_by_user > 0) {
                                $shared_by_data['sharedpost_liked_by_user'] = true;
                                $shared_by_data['sharedpost_like_id'] = $sharedpost_like_id;
                            }
                        }
                        array_push($shared_by, $shared_by_data);
                    }
                }
            }
            $post['shared_by'] = $shared_by;

            array_push($posts, $post);
        }
    }

    http_response_code(200);
    $data['status'] = 'success';
    $data['posts'] = $posts;

} else {
    http_response_code(403);
    $data['status'] = "error";
}

echo json_encode($data);
?>