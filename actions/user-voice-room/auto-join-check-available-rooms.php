<?php
include("../database-connect.php");

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $current_user_id = $_POST['current_user_id'];

    $get_available_room_query = "SELECT * FROM voice_room WHERE room_status = 'Available' ORDER BY RAND() LIMIT 1";
    $get_available_room_result = mysqli_query($con, $get_available_room_query);

    if ($get_available_room_result && mysqli_num_rows($get_available_room_result) > 0) {
        $room_data = mysqli_fetch_assoc($get_available_room_result);
        $room_id = $room_data['room_id'];
        $member_ids_array = empty($member_ids) ? [] : explode(',', $member_ids);

        if (count($member_ids_array) >= 5) {
            // Room is already full
            $data['status'] = "error";
            $data['message'] = "Room is already full. Cannot add more members.";
        } else {
            if (!in_array($current_user_id, $member_ids_array)) {
                // Add current user to the member list
                if (empty($member_ids_array)) {
                    $new_member_ids = $current_user_id;
                } else {
                    $member_ids_array[] = $current_user_id;
                    $new_member_ids = implode(',', $member_ids_array);
                }

                $update_member_query = "UPDATE voice_room SET member_ids = '$new_member_ids' WHERE room_id = '$room_id'";
                $update_member_result = mysqli_query($con, $update_member_query);

                if ($update_member_result) {
                    $data['voice_room_id'] = $room_id;
                    $data['status'] = "success";
                    $data['message'] = "User added to member list.";
                } else {
                    $data['status'] = "error";
                    $data['message'] = "Error updating member list.";
                }
            } else {
                // User is already a member of the room
                $data['voice_room_id'] = $room_id;
                $data['status'] = "info";
                $data['message'] = "User is already a member of this room.";
            }
        }
    } else {
        // No available rooms found
        $data['status'] = 'error';
        $data['message'] = 'No available rooms.';
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>