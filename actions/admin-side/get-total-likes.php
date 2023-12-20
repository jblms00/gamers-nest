<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $get_likes_query = "SELECT DATE(liked_at) AS date, COUNT(*) AS count FROM user_posts_likes GROUP BY date";
    $get_likes_result = mysqli_query($con, $get_likes_query);

    $likeCounts = array();
    $labels = array();

    while ($row = mysqli_fetch_assoc($get_likes_result)) {
        // Format the date as MDY (Month Day Year)
        $formattedDate = date("M j, Y", strtotime($row['date']));
        $likeCounts[] = intval($row['count']);
        $labels[] = $formattedDate;
    }

    $data['likeCounts'] = array(
        'labels' => $labels,
        'data' => $likeCounts
    );

    $data['totalLikes'] = array_sum($likeCounts);
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>