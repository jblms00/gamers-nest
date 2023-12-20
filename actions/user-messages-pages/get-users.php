<?php

include("../database-connect.php");

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $current_user_id = $_POST['user_id'];
    $input = $_POST['input'];
    $escaped_input = mysqli_real_escape_string($con, $input);

    $get_user_query = "SELECT * FROM users_accounts WHERE username LIKE '%$escaped_input%' AND user_id != '$current_user_id' AND user_type = 'user'";
    $get_user_result = mysqli_query($con, $get_user_query);
    $get_users_array = [];

    if ($get_user_result) {
        while ($fetch_results = mysqli_fetch_assoc($get_user_result)) {
            $get_users_array[] = $fetch_results;
        }

        $data['users'] = $get_users_array;
        $data['status'] = "success";
    } else {
        $data['status'] = "error";
        $data['message'] = "No results found.";
    }
}

echo json_encode($data);
?>