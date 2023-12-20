<?php
session_start();
include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$user_id = $user_data['user_id'];

$data = [];

// Retrieve the user's avatar from the database based on their ID
$sql = "SELECT user_avatar FROM users_accounts WHERE user_id = '$user_id'";
$query = mysqli_query($con, $sql);

if ($query && mysqli_num_rows($query) > 0) {
    $result = mysqli_fetch_assoc($query);
    $data['status'] = 'success';
    $data['user_avatar'] = $result['user_avatar'];
} else {
    // Return a default avatar if the user's avatar is not found
    $data['status'] = 'error';
    $data['message'] = 'User avatar not found.';
}

echo json_encode($data);