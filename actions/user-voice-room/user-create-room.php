<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    // Retrieve the room details from the AJAX request
    $room_id = rand(100000, 999999);
    $roomName = $_POST['room_name'];
    $gameType = $_POST['room_gameType'];
    $user_id = $_POST['user_id'];

    if (empty($roomName)) {
        $data['status'] = 'error';
        $data['message'] = 'Please enter room name';
    } else if (empty($gameType)) {
        $data['status'] = 'error';
        $data['message'] = 'Please enter voice room game type';
    } else {
        // Check if the user uploaded room_coverImg
        if (isset($_FILES['room_coverImg'])) {
            $file = $_FILES['room_coverImg'];
            $filename = $file['name'];
            $tempFilePath = $file['tmp_name'];
            $fileDestination = 'C:xampp/htdocs/gamers-nest/src/css/images/voiceRoom-cover/' . $filename;

            if (move_uploaded_file($tempFilePath, $fileDestination)) {
                $query = "INSERT INTO voice_room (room_id, user_id, room_name, member_ids, room_gameType, room_coverImg, room_status) VALUES ('$room_id', '$user_id', '$roomName', '$user_id', '$gameType', '$filename', 'Available')";
                $data['status'] = mysqli_query($con, $query) ? 'success' : 'error';
                $data['filePath'] = 'src/css/images/voiceRoom-cover/' . $filename;
            } else {
                $data['status'] = 'error';
                $data['message'] = 'Failed to upload the room cover image';
            }
        } else {
            $query = "INSERT INTO voice_room (room_id, user_id, room_name, member_ids, room_gameType, room_coverImg, room_status) VALUES ('$room_id', '$user_id', '$roomName', '$user_id', '$gameType', 'default-vrom-cover.jpg','Available')";
            $data['status'] = mysqli_query($con, $query) ? 'success' : 'error';
        }

        $data['room_id'] = $room_id;
        $data['gameType'] = $gameType;
        $data['roomName'] = $roomName;
    }
}

echo json_encode($data);