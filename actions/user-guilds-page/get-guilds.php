<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$loggned_in_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_POST['current_user_id'] ?? NULL;

    $get_guilds_query = "SELECT * FROM users_guilds ORDER BY guild_created_at ASC";
    $get_guilds_result = mysqli_query($con, $get_guilds_query);
    $guilds = [];

    if ($get_guilds_result && mysqli_num_rows($get_guilds_result)) {
        while ($fetch_guilds = mysqli_fetch_assoc($get_guilds_result)) {
            $guild_id = $fetch_guilds['guild_id'];

            // Check if the user has already requested to join this guild
            $check_request_query = "SELECT * FROM user_guild_request WHERE guild_id = '$guild_id' AND user_id = '$loggned_in_user_id'";
            $check_request_result = mysqli_query($con, $check_request_query);
            $fetch_guild_request = mysqli_fetch_assoc($check_request_result);
            $guild_creator_id = $fetch_guilds['guild_creator_id'];

            $get_creator_name_query = "SELECT username FROM users_accounts WHERE user_id = '$guild_creator_id'";
            $get_creator_name_result = mysqli_query($con, $get_creator_name_query);
            $fetch_name = mysqli_fetch_assoc($get_creator_name_result);

            // Check if the user is already a member of this guild
            $user_ids = explode(",", $fetch_guilds['users_ids']);
            $is_member = in_array($loggned_in_user_id, $user_ids);

            $guild = [
                'guild_id' => $fetch_guilds['guild_id'],
                'guild_creator_id' => $fetch_guilds['guild_creator_id'],
                'guild_name' => $fetch_guilds['guild_name'],
                'guild_description' => $fetch_guilds['guild_description'],
                'guild_members' => $fetch_guilds['guild_members'],
                'users_ids' => $fetch_guilds['users_ids'],
                'guild_banner' => $fetch_guilds['guild_banner'],
                'guild_status' => $fetch_guilds['guild_status'],
                'request_guild_id' => $fetch_guild_request['request_guild_id'] ?? null,
                'guild_request' => $fetch_guild_request['request_type'] ?? null,
                'creator_name' => $fetch_name['username'],
                'is_member' => $is_member
            ];
            $guilds[] = $guild;
        }
        $data['guilds'] = $guilds;
        $data['status'] = "success";
    } else {
        $data['status'] = "error";
        $data['message'] = "There is no existing guilds right now.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>