<?php

include("../database-connect.php");

$data = [];

$delete_report_query = "DELETE FROM users_reports";
$delete_reports_result = mysqli_query($con, $delete_report_query);

if ($delete_reports_result) {
    $data['status'] = 'success';
} else {
    $data['status'] = 'error';
    $data['message'] = 'Failed to remove reports.';
}

echo json_encode($data);
?>