<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $get_users_query = "SELECT COUNT(*) AS active_users FROM users_accounts WHERE user_status ='Online' AND user_type = 'user'";
    $get_users_result = mysqli_query($con, $get_users_query);

    if ($get_users_result) {
        $activeUsersData = mysqli_fetch_assoc($get_users_result);
        $activeUsers = $activeUsersData['active_users'];

        // Fetch actual data from the database for the graph
        $get_user_counts_query = "SELECT COUNT(*) AS user_count, DATE_FORMAT(account_created, '%b %d, %Y') AS date FROM users_accounts WHERE user_status = 'Online' GROUP BY DATE(account_created)";
        $get_user_counts_result = mysqli_query($con, $get_user_counts_query);

        $activeCounts = [
            'labels' => [],
            'data' => []
        ];

        while ($row = mysqli_fetch_assoc($get_user_counts_result)) {
            $activeCounts['labels'][] = $row['date'];
            $activeCounts['data'][] = $row['user_count'];
        }

        $data['activeUsers'] = $activeUsers;
        $data['activeCounts'] = $activeCounts;
        $data['status'] = 'success';
    } else {
        $data['status'] = 'error';
        $data['message'] = 'Error fetching active user count.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);