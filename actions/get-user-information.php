<?php
session_start();
include("database-connect.php");
include("check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'];
    $current_user_id = $_POST['current_user_id'];

    $get_follows_query = "SELECT * FROM user_follows WHERE (follower_id = '$current_user_id' OR following_id = '$current_user_id') AND (follower_id = '$user_id' OR following_id = '$user_id')";
    $get_follows_result = mysqli_query($con, $get_follows_query);


    if ($logged_in_user_id === $user_id && $logged_in_user_id === $current_user_id) {
        $check_block_query_1 = "SELECT * FROM blocked_users WHERE (blocked_user_id = '$current_user_id' OR blocking_user_id = '$current_user_id')";
        $check_block_result_1 = mysqli_query($con, $check_block_query_1);

        $get_non_followers_query = "
            SELECT ua.user_id, ua.username, ua.user_avatar
            FROM users_accounts ua
            LEFT JOIN user_follows uf ON ua.user_id = uf.following_id AND (uf.follower_id = '$current_user_id' OR uf.follower_id IS NULL)
            WHERE ua.user_id != '$current_user_id' AND (uf.follower_id IS NULL OR uf.follower_id != '$user_id') AND user_type = 'user'
        ";
        $get_non_followers_result = mysqli_query($con, $get_non_followers_query);

        if ($get_non_followers_result && mysqli_num_rows($get_non_followers_result) > 0) {
            $non_followers_information = [];
            while ($fetch_non_follower_info = mysqli_fetch_assoc($get_non_followers_result)) {
                $non_follower_individual_info = [
                    'user_id' => $fetch_non_follower_info['user_id'],
                    'username' => $fetch_non_follower_info['username'],
                    'user_avatar' => $fetch_non_follower_info['user_avatar'],
                ];
                $non_followers_information[] = $non_follower_individual_info;
            }

            $data['non_followers'] = $non_followers_information;
        } else {
            $data['non_followers'] = []; // No users found who didn't follow the current user
        }

        $count_followers_query = "SELECT COUNT(*) AS followers_count FROM user_follows WHERE following_id = '$current_user_id'";
        $count_following_query = "SELECT COUNT(*) AS following_count FROM user_follows WHERE follower_id = '$current_user_id'";
        $count_followers_result = mysqli_query($con, $count_followers_query);
        $count_following_result = mysqli_query($con, $count_following_query);

        if ($count_followers_result && $count_following_result) {
            $followers_count = mysqli_fetch_assoc($count_followers_result)['followers_count'];
            $following_count = mysqli_fetch_assoc($count_following_result)['following_count'];
            $data['followers_count'] = $followers_count;
            $data['following_count'] = $following_count;
        }

        if ($check_block_result_1 && $fetch_block_1 = mysqli_fetch_assoc($check_block_result_1)) {
            $data['block_id'] = $fetch_block_1['block_id'];
            $data['blocking_user_id'] = $fetch_block_1['blocking_user_id'];
            $data['blocked_user_id'] = $fetch_block_1['blocked_user_id'];
        }

        if ($get_follows_result && $fetch_follows_result = mysqli_fetch_assoc($get_follows_result)) {
            $data['follow_id'] = $fetch_follows_result['follow_id'];
            $data['follower_id'] = $fetch_follows_result['follower_id'];
            $data['following_id'] = $fetch_follows_result['following_id'];
        }

        $data['user_id'] = $current_user_id;
        $data['username'] = $user_data['username'];
        $data['user_banner'] = $user_data['user_banner'];
        $data['user_avatar'] = $user_data['user_avatar'];
        $data['user_bio'] = $user_data['user_bio'];
        $data['status'] = "success";
    } else {
        $query_user = "SELECT * FROM users_accounts WHERE user_id = '$user_id'";
        $result_user = mysqli_query($con, $query_user);

        $check_block_query_2 = "SELECT * FROM blocked_users WHERE (blocked_user_id = '$user_id' OR blocking_user_id = '$user_id')";
        $check_block_result_2 = mysqli_query($con, $check_block_query_2);

        $count_followers_query = "SELECT COUNT(*) AS followers_count FROM user_follows WHERE following_id = '$user_id'";
        $count_following_query = "SELECT COUNT(*) AS following_count FROM user_follows WHERE follower_id = '$user_id'";
        $count_followers_result = mysqli_query($con, $count_followers_query);
        $count_following_result = mysqli_query($con, $count_following_query);

        if ($count_followers_result && $count_following_result) {
            $followers_count = mysqli_fetch_assoc($count_followers_result)['followers_count'];
            $following_count = mysqli_fetch_assoc($count_following_result)['following_count'];
            $data['followers_count'] = $followers_count;
            $data['following_count'] = $following_count;
        }

        if ($result_user && $fetch_user = mysqli_fetch_assoc($result_user)) {
            $fetch_block_2 = mysqli_fetch_assoc($check_block_result_2);

            if ($fetch_block_2) {
                $data['blocking_user_id'] = $fetch_block_2['blocking_user_id'];
                $data['blocked_user_id'] = $fetch_block_2['blocked_user_id'];
            }

            if ($get_follows_result && $fetch_follows_result = mysqli_fetch_assoc($get_follows_result)) {
                $data['follow_id'] = $fetch_follows_result['follow_id'];
                $data['follower_id'] = $fetch_follows_result['follower_id'];
                $data['following_id'] = $fetch_follows_result['following_id'];
            }

            $data['user_id'] = $user_id;
            $data['username'] = $fetch_user['username'];
            $data['user_banner'] = $fetch_user['user_banner'];
            $data['user_avatar'] = $fetch_user['user_avatar'];
            $data['user_bio'] = $fetch_user['user_bio'];
            $data['status'] = 'success';
        }
    }

} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>