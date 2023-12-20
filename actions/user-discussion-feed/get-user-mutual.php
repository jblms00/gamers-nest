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
        $get_mutual_players_query = "
            SELECT ua.user_id, ua.username, ua.user_avatar, ua.user_status
            FROM user_follows AS uf
            JOIN user_follows AS uf2 ON uf.follower_id = uf2.following_id
            JOIN users_accounts AS ua ON ua.user_id = uf.follower_id
            WHERE uf.following_id = $current_user_id AND uf2.follower_id = $logged_in_user";

        $get_mutual_players_result = mysqli_query($con, $get_mutual_players_query);

        if ($get_mutual_players_result && mysqli_num_rows($get_mutual_players_result) > 0) {
            $mutual_users = [];
            while ($row = mysqli_fetch_assoc($get_mutual_players_result)) {
                $mutual_users[] = $row;
            }
            $data['status'] = "success";
            $data['mutual_users'] = $mutual_users;
        } else {
            $data['status'] = "error";
            $data['message'] = "You don't have mutual players.";
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