<?php

include("../database-connect.php");

// Fetch the room data from the database
$query = "SELECT * FROM voice_room ORDER BY room_created DESC";
$result = mysqli_query($con, $query);

$rooms = array();

while ($row = mysqli_fetch_assoc($result)) {
    $rooms[] = $row;
}

// Return the room data as JSON
header('Content-Type: application/json');
echo json_encode($rooms);