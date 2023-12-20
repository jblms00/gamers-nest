<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $get_guilds_query = "SELECT * FROM users_guilds ORDER BY guild_created_at DESC";
    $get_guilds_results = mysqli_query($con, $get_guilds_query);
    $guilds = [];

    if ($get_guilds_results) {
        while ($fetch_guild = mysqli_fetch_assoc($get_guilds_results)) {
            $userIds = $fetch_guild['users_ids'];
            $guildMembers = explode(',', $fetch_guild['users_ids']);

            $memberAvatars = [];
            foreach ($guildMembers as $member) {
                // Assuming you have a users table with columns user_id and user_avatar
                $get_avatar_query = "SELECT user_avatar FROM users_accounts WHERE user_id = '$member'";
                $avatar_result = mysqli_query($con, $get_avatar_query);
                $avatar_row = mysqli_fetch_assoc($avatar_result);
                $memberAvatars[] = [
                    'user_id' => $member,
                    'user_avatar' => $avatar_row['user_avatar'] ?? NULL
                ];
            }

            $guild = [
                'guild_id' => $fetch_guild['guild_id'],
                'guild_creator_id' => $fetch_guild['guild_creator_id'],
                'guild_name' => $fetch_guild['guild_name'],
                'guild_status' => $fetch_guild['guild_status'],
                'guild_created_at' => $fetch_guild['guild_created_at'],
                'members' => count($guildMembers),
                'member_avatars' => $memberAvatars
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