<?php

include("database-connect.php");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
	//if data is entered..
	$user_id = $_POST['user_id'];
	$user_bio = mysqli_real_escape_string($con, $_POST['user_bio']);

	if (!empty($user_id) && !empty($user_bio)) {

		$query = "UPDATE `users_accounts` SET `user_bio`='$user_bio' WHERE user_id = '$user_id'";
		mysqli_query($con, $query);

		header("Location: ../user-profile-page.php?user_id=$user_id");
		die;
	} else {
		$message = "Please enter bio!";
	}
}