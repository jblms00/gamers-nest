<?php

include("../database-connect.php");

$data = [];

$getGameTypesQuery = "SELECT room_gameType FROM voice_room";
$getGameTypesResult = mysqli_query($con, $getGameTypesQuery);

if ($getGameTypesResult) {
    $gameTypes = [];
    while ($row = mysqli_fetch_assoc($getGameTypesResult)) {
        $gameTypes[] = $row['room_gameType'];
    }

    $data['status'] = "success";
    $data['gameTypes'] = $gameTypes;
} else {
    $data['status'] = "error";
    $data['message'] = "Failed to fetch game types.";
}

echo json_encode($data);