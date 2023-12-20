<?php
include("../database-connect.php");

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $sql = "SELECT user_topic, COUNT(*) as total FROM user_posted_content GROUP BY user_topic ORDER BY total DESC, user_posted_date ASC";
    $get_topics = mysqli_query($con, $sql);

    if ($get_topics) {
        $topics = [];

        if ($get_topics->num_rows > 0) {
            while ($row = $get_topics->fetch_assoc()) {
                $topics[] = $row['user_topic'];
            }
            $data['status'] = 'success';
            $data['topics'] = $topics;
        } else {
            $data['status'] = 'error';
            $data['message'] = 'No topics found.';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'Database query failed.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>