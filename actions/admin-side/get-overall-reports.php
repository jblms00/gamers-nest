<?php
include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $get_reports_query = "SELECT ur.*, ua.username, ua.user_avatar, ua.account_status FROM users_reports ur
                        LEFT JOIN users_accounts ua ON ur.reported_user_id = ua.user_id ORDER BY ur.report_time DESC";

    $get_reports_result = mysqli_query($con, $get_reports_query);

    if ($get_reports_result) {
        $data['status'] = 'success';
        $data['reports'] = [];

        while ($row = mysqli_fetch_assoc($get_reports_result)) {
            $data['reports'][] = $row;
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'Failed to fetch reports.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>