<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $current_user_id = $_POST['current_user_id'];

    $check_user_query = "SELECT * FROM users_accounts WHERE user_id = '$current_user_id'";
    $check_user_result = mysqli_query($con, $check_user_query);

    if ($check_user_result && mysqli_num_rows($check_user_result) > 0) {
        $get_follows_query = "
            SELECT users_accounts.username, users_accounts.user_avatar, user_follows.follower_id
            FROM users_accounts
            INNER JOIN user_follows ON users_accounts.user_id = user_follows.follower_id
            WHERE user_follows.following_id = '$current_user_id'
        ";

        $get_follows_result = mysqli_query($con, $get_follows_query);
        $follower_details = [];

        if ($get_follows_result && mysqli_num_rows($get_follows_result) > 0) {
            while ($fetch_followers = mysqli_fetch_assoc($get_follows_result)) {
                $follower_details[] = [
                    'follower_id' => $fetch_followers['follower_id'],
                    'username' => $fetch_followers['username'],
                    'user_avatar' => $fetch_followers['user_avatar']
                ];
            }

            $data['follower_details'] = $follower_details;
            $data['status'] = "success";
        }
    } else {
        $data['message'] = "No user found.";
        $data['status'] = "error";
    }
}

echo json_encode($data);