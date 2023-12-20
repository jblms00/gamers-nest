<?php
include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $report_id = $_POST['report_id'];

    $get_reports_query = "SELECT ur.*, ua.username, ua.user_avatar, ua.account_status FROM users_reports ur
                        LEFT JOIN users_accounts ua ON ur.reported_user_id = ua.user_id WHERE report_id = '$report_id'";
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