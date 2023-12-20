<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$current_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $guild_id = $_POST['guild_id'];
    $guild_name = $_POST['guild_name'];

    // Fetch the guild information from the database
    $get_guild_query = "SELECT * FROM users_guilds WHERE guild_id = '$guild_id' AND guild_name = '$guild_name'";
    $get_guild_result = mysqli_query($con, $get_guild_query);
    $guild_datas = [];

    if (mysqli_num_rows($get_guild_result) > 0) {
        $count_request_query = "SELECT COUNT(*) AS request_count FROM user_guild_request WHERE guild_id = '$guild_id' AND guild_name = '$guild_name'";
        $count_request_result = mysqli_query($con, $count_request_query);
        $count_row = mysqli_fetch_assoc($count_request_result);

        while ($fetch_guilds = mysqli_fetch_assoc($get_guild_result)) {
            $guild_members_ids = explode(",", $fetch_guilds['users_ids']) ?? NULL;
            $guild_member_avatars = [];

            // Fetch avatars of guild members from users_accounts table
            foreach ($guild_members_ids as $member_id) {
                $get_avatar_query = "SELECT user_avatar, user_status FROM users_accounts WHERE user_id = '$member_id'";
                $get_avatar_result = mysqli_query($con, $get_avatar_query);
                $avatar_row = mysqli_fetch_assoc($get_avatar_result);

                if ($avatar_row) {
                    $guild_member_avatars[] = $avatar_row['user_avatar'];
                    $guild_member_status[] = $avatar_row['user_status'];
                }
            }

            $get_guild_creator_query = "SELECT username, user_avatar, user_status FROM users_accounts WHERE user_id = '{$fetch_guilds['guild_creator_id']}'";
            $get_guild_creator_result = mysqli_query($con, $get_guild_creator_query);
            $fetch_guild_creator = mysqli_fetch_assoc($get_guild_creator_result);

            $guild_data = [
                'creator_username' => $fetch_guild_creator['username'],
                'creator_user_avatar' => $fetch_guild_creator['user_avatar'],
                'creator_user_status' => $fetch_guild_creator['user_status'],
                'guild_id' => $fetch_guilds['guild_id'],
                'guild_creator_id' => $fetch_guilds['guild_creator_id'],
                'guild_name' => $fetch_guilds['guild_name'],
                'guild_description' => $fetch_guilds['guild_description'],
                'guild_members' => explode(",", $fetch_guilds['guild_members']) ?? NULL,
                'users_ids' => explode(",", $fetch_guilds['users_ids']) ?? NULL,
                'guild_banner' => $fetch_guilds['guild_banner'],
                'guild_logo' => $fetch_guilds['guild_logo'],
                'guild_status' => $fetch_guilds['guild_status'],
                'request_count' => $fetch_guilds['request_count'] ?? '0',
                'guild_member_avatars' => $guild_member_avatars,
                'guild_member_status' => $guild_member_status ?? NULL
            ];
            $guild_datas[] = $guild_data;
        }
        $data['guild_datas'] = $guild_datas;
        $data['status'] = "success";

    } else {
        $data['status'] = "error";
        $data['message'] = "Guild not found.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>