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

        // Remove the current user from the member_ids list
        $member_ids = explode(',', $room_data['member_ids']);
        $key = array_search($current_user_id, $member_ids);

        if ($key !== false) {
            unset($member_ids[$key]);
        }

        $new_member_ids = implode(',', $member_ids);

        if (empty($new_member_ids)) {
            // If no members left, delete the room
            $delete_room_query = "DELETE FROM voice_room WHERE room_id = '$room_id'";
            $delete_room_result = mysqli_query($con, $delete_room_query);

            if ($delete_room_result) {
                $data['status'] = "success";
                $data['message'] = "Room deleted.";
            } else {
                $data['status'] = "error";
                $data['message'] = "Error deleting room.";
            }
        } else {
            // Update member list if other members remain
            $update_member_query = "UPDATE voice_room SET member_ids = '$new_member_ids' WHERE room_id = '$room_id'";
            $update_member_result = mysqli_query($con, $update_member_query);

            if ($update_member_result) {
                $data['status'] = "success";
                $data['message'] = "User removed from member list.";
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



// OLD CODE

// <?php
// include("../database-connect.php");

// $data = [];

// if ($_SERVER["REQUEST_METHOD"] == "POST") {
//     $room_id = $_POST['voice_room_id'];
//     $current_user_id = $_POST['current_user_id'];

//     $get_room_query = "SELECT * FROM voice_room WHERE room_id = '$room_id'";
//     $get_room_result = mysqli_query($con, $get_room_query);

//     if ($get_room_result && mysqli_num_rows($get_room_result) > 0) {
//         $room_data = mysqli_fetch_assoc($get_room_result);

//         // Remove the current user from the member_ids list
//         $member_ids = explode(',', $room_data['member_ids']);
//         $key = array_search($current_user_id, $member_ids);
//         if ($key !== false) {
//             unset($member_ids[$key]);
//         }

//         $new_member_ids = implode(',', $member_ids);
//         $update_member_query = "UPDATE voice_room SET member_ids = '$new_member_ids' WHERE room_id = '$room_id'";
//         $update_member_result = mysqli_query($con, $update_member_query);
//         if ($update_member_result) {
//             $data['status'] = "success";
//             $data['message'] = "User removed from member list.";
//         } else {
//             $data['status'] = "error";
//             $data['message'] = "Error updating member list.";
//         }
//     } else {
//         $data['status'] = "error";
//         $data['message'] = "Room not found.";
//     }
// } else {
//     $data['status'] = "error";
//     $data['message'] = "Invalid request method.";
// }

// echo json_encode($data);
