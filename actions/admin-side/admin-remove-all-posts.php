<?php
include("../database-connect.php");

$data = [];

$tablesToDeleteFrom = [
    'user_posted_content',
    'user_contents_comments',
    'user_posts_likes',
    'user_shared_post',
    'user_sharedpost_comments',
    'user_shared_posts_likes'
];

$success = true;

foreach ($tablesToDeleteFrom as $table) {
    $delete_query = "DELETE FROM $table";
    $delete_result = mysqli_query($con, $delete_query);

    if (!$delete_result) {
        $success = false;
        break; // No need to continue if a deletion fails
    }
}

if ($success) {
    $data['status'] = 'success';
} else {
    $data['status'] = 'error';
    $data['message'] = 'Failed to remove posts.';
}

echo json_encode($data);
?>