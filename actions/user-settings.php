<?php
session_start();
include("database-connect.php");
include("check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $current_user_id = $_POST['current_user_id'];

    $get_information_query = "SELECT * FROM users_accounts WHERE user_id = '$current_user_id'";
    $get_information_result = mysqli_query($con, $get_information_query);
    $users_info = [];

    if ($logged_in_user_id === $current_user_id && $get_information_result && mysqli_num_rows($get_information_result) > 0) {
        while ($fetch_information = mysqli_fetch_assoc($get_information_result)) {
            $user_info = [
                'user_id' => $fetch_information['user_id'],
                'user_email' => $fetch_information['user_email'],
                'username' => $fetch_information['username'],
                'user_avatar' => $fetch_information['user_avatar'],
                'user_password' => base64_decode($fetch_information['user_password']),
                'account_created' => date('F d, Y', strtotime($fetch_information['account_created']))
            ];
            $users_info[] = $user_info;
        }
        $data['users_info'] = $users_info;
        $data['status'] = "success";
    } else {
        $data['status'] = 'error';
        $data['message'] = 'ID does not match.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>