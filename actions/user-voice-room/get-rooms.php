<?php
include("../database-connect.php");

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $get_rooms_query = "SELECT * FROM voice_room";
    $get_rooms_result = mysqli_query($con, $get_rooms_query);
    $rooms = [];

    if ($get_rooms_result && mysqli_num_rows($get_rooms_result) > 0) {
        while ($fetch_rooms = mysqli_fetch_assoc($get_rooms_result)) {
            // Count the number of member IDs in the room
            $member_ids = $fetch_rooms['member_ids'];
            $member_count = 0;

            if (!empty($member_ids)) {
                $member_count = count(explode(",", $member_ids));
            }

            $room = [
                'room_id' => $fetch_rooms['room_id'],
                'user_id' => $fetch_rooms['user_id'],
                'room_name' => $fetch_rooms['room_name'],
                'member_ids' => $member_ids,
                'member_count' => $member_count,
                'room_gameType' => $fetch_rooms['room_gameType'],
                'room_coverImg' => $fetch_rooms['room_coverImg'],
            ];
            array_push($rooms, $room);
        }
        $data['rooms'] = $rooms;
        $data['status'] = 'success';
    } else {
        $data['status'] = "error";
        $data['message'] = "There are no existing voice rooms right now.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>