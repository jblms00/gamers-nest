<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];
$logged_in_username = $user_data['username'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $guild_id = $_POST['guild_id'];
    $guild_name = $_POST['guild_name'];

    $get_guild_query = "SELECT * FROM users_guilds WHERE guild_id = '$guild_id'";
    $get_guild_result = mysqli_query($con, $get_guild_query);
    $guild_informations = [];

    if ($get_guild_result && mysqli_num_rows($get_guild_result)) {
        $guild_request_count_query = "SELECT COUNT(*) AS total_rows FROM user_guild_request WHERE request_type = 'requested_to_join_guild' AND guild_id = '$guild_id' AND guild_name = '$guild_name'";
        $guild_request_count_result = mysqli_query($con, $guild_request_count_query);

        if ($guild_request_count_result) {
            $fetch_count = mysqli_fetch_assoc($guild_request_count_result);
            // Get the total number of rows
            $total_rows = $fetch_count['total_rows'];
        } else {
            $total_rows = '';
        }

        $get_guild_room_query = "SELECT * FROM guild_conversation_room WHERE guild_name = '$guild_name'";
        $get_guild_room_result = mysqli_query($con, $get_guild_room_query);
        $fetch_guild_room = mysqli_fetch_assoc($get_guild_room_result);

        while ($fetch_guilds = mysqli_fetch_assoc($get_guild_result)) {
            $guild_information = [
                'logged_in_username' => $logged_in_username,
                'guild_id' => $fetch_guilds['guild_id'],
                'guild_creator_id' => $fetch_guilds['guild_creator_id'],
                'guild_name' => $fetch_guilds['guild_name'],
                'guild_description' => $fetch_guilds['guild_description'],
                'guild_members' => $fetch_guilds['guild_members'],
                'users_ids' => $fetch_guilds['users_ids'],
                'guild_banner' => $fetch_guilds['guild_banner'],
                'guild_logo' => $fetch_guilds['guild_logo'],
                'guild_status' => $fetch_guilds['guild_status'],
                'total_rows' => $total_rows,
                'guild_convo_room_id' => $fetch_guild_room['guild_room_id'] ?? NULL,
            ];
            $guild_informations[] = $guild_information;
        }
        $data['guild_informations'] = $guild_informations;
        $data['status'] = "success";
    } else {
        $data['status'] = "error";
        $data['message'] = "There are no existing guilds right now.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>