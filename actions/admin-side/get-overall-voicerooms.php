<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $get_rooms_query = "SELECT * FROM voice_room ORDER BY room_created DESC";
    $get_rooms_results = mysqli_query($con, $get_rooms_query);
    $rooms = [];

    if ($get_rooms_results) {
        while ($fetch_room = mysqli_fetch_assoc($get_rooms_results)) {
            $roomMembers = explode(',', $fetch_room['member_ids']);

            $memberAvatars = [];
            foreach ($roomMembers as $member) {
                // Assuming you have a users table with columns user_id and user_avatar
                $get_avatar_query = "SELECT user_avatar FROM users_accounts WHERE user_id = '$member'";
                $avatar_result = mysqli_query($con, $get_avatar_query);
                $avatar_row = mysqli_fetch_assoc($avatar_result);
                $memberAvatars[] = [
                    'user_id' => $member,
                    'user_avatar' => $avatar_row['user_avatar'] ?? NULL
                ];
            }

            $room = [
                'room_id' => $fetch_room['room_id'],
                'room_creator_id' => $fetch_room['user_id'],
                'room_name' => $fetch_room['room_name'],
                'room_gameType' => $fetch_room['room_gameType'],
                'room_status' => $fetch_room['room_status'],
                'room_created_at' => $fetch_room['room_created'],
                'members' => count($roomMembers),
                'member_avatars' => $memberAvatars
            ];

            $rooms[] = $room;
        }

        $data['rooms'] = $rooms;
        $data['status'] = 'success';
    } else {
        $data['status'] = 'error';
        $data['message'] = 'Failed to fetch rooms.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>