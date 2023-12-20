<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$current_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['guild_id']) && isset($_POST['guild_name'])) {
        $guild_id = $_POST['guild_id'];
        $guild_name = $_POST['guild_name'];

        $get_guild_request_query = "SELECT * FROM user_guild_request WHERE request_type = 'requested_to_join_guild' AND guild_id = '$guild_id' AND guild_name = '$guild_name'";
        $get_guild_request_result = mysqli_query($con, $get_guild_request_query);

        if ($get_guild_request_result && mysqli_num_rows($get_guild_request_result) > 0) {
            $users = [];

            while ($fetch_request = mysqli_fetch_assoc($get_guild_request_result)) {
                $requested_user_id = $fetch_request['user_id'];

                $get_user_information_query = "SELECT username, user_avatar FROM users_accounts WHERE user_id = '$requested_user_id'";
                $get_user_information_result = mysqli_query($con, $get_user_information_query);

                if ($get_user_information_result && mysqli_num_rows($get_user_information_result) > 0) {
                    $fetch_users = mysqli_fetch_assoc($get_user_information_result);
                    $user = [
                        'username' => $fetch_users['username'],
                        'user_avatar' => $fetch_users['user_avatar'],
                    ];
                    $users[] = $user;
                }
            }
            $data['users'] = $users;
            $data['status'] = "success";
        } else {
            $data['status'] = "error";
            $data['message'] = "No guild request.";
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Missing guild_id or guild_name in the request.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);