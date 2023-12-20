<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $get_top_user_topics_query = "SELECT user_topic, COUNT(*) AS topic_count FROM user_posted_content GROUP BY user_topic ORDER BY topic_count DESC LIMIT 10";
    $get_top_user_topics_result = mysqli_query($con, $get_top_user_topics_query);

    $topUserTopics = array();

    while ($row = mysqli_fetch_assoc($get_top_user_topics_result)) {
        $topUserTopics[] = array(
            'user_topic' => $row['user_topic'],
            'topic_count' => intval($row['topic_count'])
        );
    }

    $data['topUserTopics'] = $topUserTopics;
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>