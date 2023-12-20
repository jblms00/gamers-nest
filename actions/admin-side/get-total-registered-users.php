<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $get_users_query = "SELECT COUNT(*) AS registered_users FROM users_accounts WHERE user_type ='user'";
    $get_users_result = mysqli_query($con, $get_users_query);

    if ($get_users_result) {
        $registeredUsersData = mysqli_fetch_assoc($get_users_result);
        $registeredUsers = $registeredUsersData['registered_users'];

        // Fetch actual data from the database for the graph
        $get_user_counts_query = "SELECT COUNT(*) AS user_count, DATE_FORMAT(account_created, '%b %d, %Y') AS date FROM users_accounts WHERE user_type = 'user' GROUP BY DATE(account_created)";
        $get_user_counts_result = mysqli_query($con, $get_user_counts_query);

        $registeredCounts = [
            'labels' => [],
            'data' => []
        ];

        while ($row = mysqli_fetch_assoc($get_user_counts_result)) {
            $registeredCounts['labels'][] = $row['date'];
            $registeredCounts['data'][] = $row['user_count'];
        }

        $data['registeredUsers'] = $registeredUsers;
        $data['registeredCounts'] = $registeredCounts;
        $data['status'] = 'success';
    } else {
        $data['status'] = 'error';
        $data['message'] = 'Error fetching registered user count.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);