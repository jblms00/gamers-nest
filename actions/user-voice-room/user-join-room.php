<?php
include("../database-connect.php");

$data = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $room_id = $_POST['voice_room_id'];
    $current_user_id = $_POST['current_user_id'];

    $get_room_query = "SELECT * FROM voice_room WHERE room_id = '$room_id'";
    $get_room_result = mysqli_query($con, $get_room_query);

    if ($get_room_result && mysqli_num_rows($get_room_result) > 0) {
        $room_data = mysqli_fetch_assoc($get_room_result);

        $member_ids = $room_data['member_ids'] ? explode(',', $room_data['member_ids']) : [];

        if (count($member_ids) >= 5) {
            // If there are already 5 member IDs, display an error message
            $update_status_query = "UPDATE voice_room SET room_status = 'Full' WHERE room_id = '$room_id'";
            $update_status_result = mysqli_query($con, $update_status_query);

            $data['status'] = "error";
            $data['message'] = "Room is already full. Cannot add more members.";
        } else if (empty($member_ids)) {
            // If member_ids are blank or null, just add your ID
            $member_ids[] = $current_user_id;
            $new_member_ids = implode(',', $member_ids);

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
            // If member_ids are not blank, add your ID and implode the member_ids
            if (!in_array($current_user_id, $member_ids)) {
                $member_ids[] = $current_user_id;
            }
            $new_member_ids = implode(',', $member_ids);
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
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Room not found.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>