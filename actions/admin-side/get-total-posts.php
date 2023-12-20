<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $get_posts_query = "SELECT DATE(user_posted_date) AS date, COUNT(*) AS count FROM user_posted_content GROUP BY date";
    $get_posts_result = mysqli_query($con, $get_posts_query);

    $postCounts = array();
    $labels = array();

    while ($row = mysqli_fetch_assoc($get_posts_result)) {
        $formattedDate = date("M j, Y", strtotime($row['date']));
        $postCounts[] = intval($row['count']);
        $labels[] = $formattedDate;
    }

    $data['postCounts'] = array(
        'labels' => $labels,
        'data' => $postCounts
    );

    $data['totalPosts'] = array_sum($postCounts);
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);