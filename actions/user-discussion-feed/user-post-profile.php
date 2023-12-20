<?php

include("../database-connect.php");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
	//if data is entered..
	$user_id = $_POST['user_id'];
	$username = $_POST['username'];
	$user_avatar = $_POST['user_avatar'];
	$username = $_POST['username'];
	$user_content = mysqli_real_escape_string($con, $_POST['user_content']);
	$user_topic = $_POST['user_topic'];

	$user_content_id = rand(100000, 999999);

	if (!empty($user_content) && !empty($user_topic)) {

		$query = "INSERT INTO `user_posted_content`(`user_content_id`, `user_id`, `username`, `user_avatar`, `user_content`, `user_topic`, `user_content_status`) VALUES ('$user_content_id','$user_id','$username','$user_avatar','$user_content','$user_topic','Public')";
		mysqli_query($con, $query);

		header("Location: ../user-profile-page.php");
		die;
	} else {
		$message = "ERROR!";
	}
}