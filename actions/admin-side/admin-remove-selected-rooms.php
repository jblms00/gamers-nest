<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $selected_rooms = $_POST['selected_rooms'];

    if (!empty($selected_rooms)) {
        $selected_rooms_ids = implode(',', array_map('intval', $selected_rooms));

        $delete_rooms_query = "DELETE FROM voice_room WHERE room_id IN ($selected_rooms_ids)";
        $delete_rooms_result = mysqli_query($con, $delete_rooms_query);

        if ($delete_rooms_result) {
            $data['status'] = 'success';
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Failed to remove selected rooms.';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'No selected rooms to remove.';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);
?>