<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $guild_id = $_POST['guild_id'];

    $get_guild_query = "SELECT * FROM users_guilds WHERE guild_id = '$guild_id'";
    $get_guild_results = mysqli_query($con, $get_guild_query);
    $guilds = [];

    if ($get_guild_results) {
        while ($fetch_guild = mysqli_fetch_assoc($get_guild_results)) {
            $userIds = $fetch_guild['users_ids'];
            $guildMembersUsernames = explode(',', $fetch_guild['guild_members']);
            $guildMembersIds = explode(',', $fetch_guild['users_ids']);

            $member_information = [];
            foreach ($guildMembersIds as $index => $member_id) {
                // Fetch user_avatar along with other member details
                $get_member_info_query = "SELECT user_avatar, username FROM users_accounts WHERE user_id = '$member_id'";
                $member_info_result = mysqli_query($con, $get_member_info_query);
                $member_info_row = mysqli_fetch_assoc($member_info_result);

                $member_information[] = [
                    'user_id' => $member_id,
                    'username' => $member_info_row['username'],
                    'user_avatar' => $member_info_row['user_avatar'] ?? null
                ];
            }

            $get_creator_info_query = "SELECT user_avatar, username FROM users_accounts WHERE user_id = '{$fetch_guild['guild_creator_id']}'";
            $get_creator_info_result = mysqli_query($con, $get_creator_info_query);
            $fetch_creator_row = mysqli_fetch_assoc($get_creator_info_result);

            $guild = [
                'guild_id' => $fetch_guild['guild_id'],
                'guild_creator_id' => $fetch_guild['guild_creator_id'],
                'guild_name' => $fetch_guild['guild_name'],
                'guild_description' => $fetch_guild['guild_description'],
                'guild_banner' => $fetch_guild['guild_banner'],
                'guild_logo' => $fetch_guild['guild_logo'],
                'guild_status' => $fetch_guild['guild_status'],
                'guild_created_at' => $fetch_guild['guild_created_at'],
                'creator_name' => $fetch_creator_row['username'],
                'creator_avatar' => $fetch_creator_row['user_avatar'],
                'members' => count($guildMembersIds),
                'member_info' => $member_information
            ];

            $guilds[] = $guild;
        }

        $data['guilds'] = $guilds;
        $data['status'] = 'success';
    } else {
        $data['status'] = 'error';
        $data['message'] = 'Failed to fetch guilds.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>