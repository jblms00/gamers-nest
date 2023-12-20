<?php
include("../database-connect.php");

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Query for posts
    $sql = "SELECT * FROM user_posted_content WHERE user_content_status = 'Public' ORDER BY user_posted_date DESC";
    $query = mysqli_query($con, $sql);
    $query_num_rows = mysqli_num_rows($query);
    $posts = [];

    if ($query_num_rows > 0) {
        while ($query_result_post = mysqli_fetch_assoc($query)) {
            $post = [
                'content_id' => $query_result_post['user_content_id'],
                'username' => $query_result_post['username'],
                'user_avatar' => $query_result_post['user_avatar'],
                'user_content' => $query_result_post['user_content'],
                'user_topic' => $query_result_post['user_topic'],
                'comments' => []
            ];

            // Query for comments related to the post
            $query_comments = "SELECT * FROM user_contents_comments ORDER BY user_created_at ASC";
            $result_comments = mysqli_query($con, $query_comments);
            $num_rows = mysqli_num_rows($result_comments);
            $comments = [];

            if ($num_rows > 0) {
                while ($row = mysqli_fetch_assoc($result_comments)) {
                    $comment = [
                        'comment_id' => $row['user_comment_id'],
                        'username' => $row['username'],
                        'user_avatar' => $row['user_avatar'],
                        'comment_text' => $row['comment_text']
                    ];
                    array_push($comments, $comment);
                }
            }

            $post['comments'] = $comments;
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