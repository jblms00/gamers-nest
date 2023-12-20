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
        $get_following_query = "SELECT following_id, follow_id FROM user_follows WHERE follower_id = '$current_user_id'";
        $get_following_result = mysqli_query($con, $get_following_query);

        $logged_in_user_following_ids = [];
        while ($fetch_following_data = mysqli_fetch_assoc($get_following_result)) {
            $logged_in_user_following_ids[$fetch_following_data['following_id']] = $fetch_following_data['follow_id'];
        }

        $get_followers_query = "SELECT follower_id FROM user_follows WHERE following_id = '$current_user_id'";
        $get_followers_result = mysqli_query($con, $get_followers_query);

        if ($get_followers_result && mysqli_num_rows($get_followers_result) > 0) {
            $followers_ids = []; // Initialize an array to hold all follower IDs
            while ($fetch_followers_id = mysqli_fetch_assoc($get_followers_result)) {
                $followers_ids[] = $fetch_followers_id['follower_id']; // Collect all follower IDs
            }

            $followers_information = [];
            foreach ($followers_ids as $follower_id) {
                $get_users_info_query = "SELECT user_id, username, user_avatar FROM users_accounts WHERE user_id = '$follower_id'";
                $get_users_info_result = mysqli_query($con, $get_users_info_query);

                if ($get_users_info_result && mysqli_num_rows($get_users_info_result) > 0) {
                    $fetch_users_info = mysqli_fetch_assoc($get_users_info_result);

                    // Check if the follower is being followed by the current user
                    $is_following = array_key_exists($follower_id, $logged_in_user_following_ids);

                    // Get the follow_id if the follower is being followed
                    $follow_id = $is_following ? $logged_in_user_following_ids[$follower_id] : null;

                    // Check if the follower is also following the current user
                    $is_following_back_query = "SELECT COUNT(*) AS follow_count FROM user_follows WHERE follower_id = '$follower_id' AND following_id = '$logged_in_user'";
                    $is_following_back_result = mysqli_query($con, $is_following_back_query);
                    $is_following_back_data = mysqli_fetch_assoc($is_following_back_result);
                    $is_following_back = $is_following_back_data['follow_count'] > 0;

                    $follower_information = [
                        'follower_user_id' => $fetch_users_info['user_id'],
                        'follower_name' => $fetch_users_info['username'],
                        'follower_avatar' => $fetch_users_info['user_avatar'],
                        'is_following' => $is_following,
                        'is_following_back' => $is_following_back,
                        'follow_id' => $follow_id
                    ];
                    $followers_information[] = $follower_information;
                }
            }

            $data['current_username'] = $user_data['username'];
            $data['followers'] = $followers_information;
            $data['status'] = "success";
        } else {
            $data['status'] = "error";
            $data['message'] = "You don't have any followers";
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