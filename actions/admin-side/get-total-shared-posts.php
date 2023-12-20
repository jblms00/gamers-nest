<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $get_shared_posts_query = "SELECT DATE(shared_at) AS date, COUNT(*) AS count FROM user_shared_post GROUP BY date";
    $get_shared_posts_result = mysqli_query($con, $get_shared_posts_query);

    $sharedPostCounts = array();
    $labels = array();

    while ($row = mysqli_fetch_assoc($get_shared_posts_result)) {
        // Format the date as MDY (Month Day Year)
        $formattedDate = date("M j, Y", strtotime($row['date']));
        $sharedPostCounts[] = intval($row['count']);
        $labels[] = $formattedDate;
    }

    $data['sharedPostCounts'] = array(
        'labels' => $labels,
        'data' => $sharedPostCounts
    );

    $data['totalSharedPosts'] = array_sum($sharedPostCounts);
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>