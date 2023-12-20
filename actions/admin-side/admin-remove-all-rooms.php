<?php
include("../database-connect.php");

$data = [];

$delete_rooms_query = "DELETE FROM voice_room";
$delete_rooms_result = mysqli_query($con, $delete_rooms_query);

if ($delete_rooms_result) {
    $data['status'] = 'success';
} else {
    $data['status'] = 'error';
    $data['message'] = 'Failed to remove voice rooms.';
}

echo json_encode($data);
?>