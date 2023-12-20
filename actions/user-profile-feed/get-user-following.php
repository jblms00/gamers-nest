<?php
session_start();
include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$logged_in_user = $user_data['user_id'];
$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $current_user_id = $_POST['current_user_id'];

    if ($logged_in_user === $current_user_id) {
        $get_following_query = "SELECT follow_id, following_id FROM user_follows WHERE follower_id = '$current_user_id'";
        $get_following_result = mysqli_query($con, $get_following_query);

        if ($get_following_result && mysqli_num_rows($get_following_result) > 0) {
            $following_information = [];
            while ($fetch_following_info = mysqli_fetch_assoc($get_following_result)) {
                $following_id = $fetch_following_info['following_id'];
                $get_users_info_query = "SELECT user_id, username, user_avatar FROM users_accounts WHERE user_id = '$following_id'";
                $get_users_info_result = mysqli_query($con, $get_users_info_query);

                if ($get_users_info_result && mysqli_num_rows($get_users_info_result) > 0) {
                    $fetch_users_info = mysqli_fetch_assoc($get_users_info_result);
                    $following_individual_info = [
                        'follow_id' => $fetch_following_info['follow_id'],
                        'following_user_id' => $fetch_users_info['user_id'],
                        'following_name' => $fetch_users_info['username'],
                        'following_avatar' => $fetch_users_info['user_avatar'],
                    ];
                    $following_information[] = $following_individual_info;
                }
            }

            $data['current_username'] = $user_data['username'];
            $data['following'] = $following_information;
            $data['status'] = "success";
        } else {
            $data['status'] = "error";
            $data['message'] = "You aren't following anyone";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "ID does not match.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>