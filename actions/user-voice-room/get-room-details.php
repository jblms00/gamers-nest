<?php
session_start();

include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $room_id = $_POST['room_id'];

    $get_room_query = "SELECT * from voice_room WHERE room_id = '$room_id'";
    $get_room_result = mysqli_query($con, $get_room_query);
    $room_informations = [];

    if ($get_room_result && mysqli_num_rows($get_room_result) > 0) {
        while ($fetch_room = mysqli_fetch_assoc($get_room_result)) {
            $member_ids = explode(",", $fetch_room['member_ids']);

            $room_information = [
                'room_id' => $fetch_room['room_id'],
                'room_creator_id' => $fetch_room['user_id'],
                'room_name' => $fetch_room['room_name'],
                'member_ids' => $fetch_room['member_ids'],
                'room_gameType' => $fetch_room['room_gameType'],
                'room_logo' => $fetch_room['room_coverImg'],
                'room_status' => $fetch_room['room_status'],
                'room_created' => $fetch_room['room_created'],
                'number_of_member_ids' => count($member_ids) ?? '0',
                'members_info' => []
            ];

            if (count($member_ids) === 1 && $member_ids[0] == $logged_in_user_id) {
                $user_info = [
                    'user_id' => $logged_in_user_id,
                    'username' => $user_data['username'],
                    'user_avatar' => $user_data['user_avatar']
                ];
                $room_information['members_info'][] = $user_info;
            } else {
                $member_ids_imploded = implode(",", $member_ids);
                if ($member_ids_imploded === "") {
                    $get_members_info_query = "SELECT user_id, username, user_avatar FROM users_accounts WHERE user_id = '$logged_in_user_id'";
                    $get_members_info_result = mysqli_query($con, $get_members_info_query);

                    while ($member_info = mysqli_fetch_assoc($get_members_info_result)) {
                        $room_information['members_info'][] = $member_info;
                    }
                } else {
                    $get_members_info_query = "SELECT user_id, username, user_avatar FROM users_accounts WHERE user_id IN ($member_ids_imploded)";
                    $get_members_info_result = mysqli_query($con, $get_members_info_query);

                    while ($member_info = mysqli_fetch_assoc($get_members_info_result)) {
                        $room_information['members_info'][] = $member_info;
                    }
                }
            }

            array_push($room_informations, $room_information);
        }
        $data['room_informations'] = $room_informations;
        $data['status'] = "success";
    } else {
        $data['status'] = "error";
        $data['message'] = "Voice room not found.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);