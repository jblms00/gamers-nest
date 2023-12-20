<?php

include("database-connect.php");

$data = [];
$data['status'] = '';

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $report_content = mysqli_real_escape_string($con, $_POST['report_content']);
    $current_user_id = $_POST['current_user_id'];
    $report_user_id = $_POST['report_user_id'];

    $check_user_query = "SELECT * FROM users_accounts WHERE user_id = '$current_user_id' OR user_id = '$report_user_id'";
    $check_user_result = mysqli_query($con, $check_user_query);

    if ($check_user_result && mysqli_num_rows($check_user_result) > 0) {

        $report_id = rand(100000, 999999);
        $insert_report_query = "INSERT INTO `users_reports`(`report_id`, `user_id`, `reported_user_id`, `report_option`, `report_time`) VALUES ('$report_id','$current_user_id','$report_user_id','$report_content', NOW())";
        $insert_report_result = mysqli_query($con, $insert_report_query);

        if ($insert_report_result) {
            $data['status'] = "success";
            $data['message'] = "User found.";
        } else {
            $data['status'] = "error";
            $data['message'] = "Error inserting.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "No users found.";
    }
} else {
    $data['status'] = 'error';
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);