<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['room_id'])) {
        $room_id = mysqli_real_escape_string($con, $_POST['room_id']);

        $get_room_query = "SELECT * FROM voice_room WHERE room_id = '$room_id'";
        $get_room_results = mysqli_query($con, $get_room_query);
        $rooms = [];

        if ($get_room_results) {
            while ($fetch_room = mysqli_fetch_assoc($get_room_results)) {
                $roomMembersIds = explode(',', $fetch_room['member_ids']);
                $member_information = [];

                foreach ($roomMembersIds as $member_id) {
                    $member_id = mysqli_real_escape_string($con, $member_id);

                    $get_member_info_query = "SELECT user_avatar, username FROM users_accounts WHERE user_id = '$member_id'";
                    $member_info_result = mysqli_query($con, $get_member_info_query);

                    if ($member_info_result && $member_info_row = mysqli_fetch_assoc($member_info_result)) {
                        $member_information[] = [
                            'user_id' => $member_id,
                            'username' => $member_info_row['username'],
                            'user_avatar' => $member_info_row['user_avatar'] ?? null
                        ];
                    }
                }

                $creator_id = mysqli_real_escape_string($con, $fetch_room['user_id']);
                $get_creator_info_query = "SELECT user_avatar, username FROM users_accounts WHERE user_id = '$creator_id'";
                $get_creator_info_result = mysqli_query($con, $get_creator_info_query);

                if ($get_creator_info_result && $fetch_creator_row = mysqli_fetch_assoc($get_creator_info_result)) {
                    $room = [
                        'room_id' => $fetch_room['room_id'],
                        'room_creator_id' => $fetch_room['user_id'],
                        'room_name' => $fetch_room['room_name'],
                        'gametype' => $fetch_room['room_gameType'],
                        'room_logo' => $fetch_room['room_coverImg'],
                        'room_status' => $fetch_room['room_status'],
                        'room_created' => $fetch_room['room_created'],
                        'creator_name' => $fetch_creator_row['username'],
                        'creator_avatar' => $fetch_creator_row['user_avatar'],
                        'members' => count($roomMembersIds),
                        'member_info' => $member_information
                    ];

                    $rooms[] = $room;
                }
            }

            if (!empty($rooms)) {
                $data['rooms'] = $rooms;
                $data['status'] = 'success';
            } else {
                $data['status'] = 'error';
                $data['message'] = 'No rooms found.';
            }
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Failed to fetch rooms.';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'Missing room_id parameter.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>