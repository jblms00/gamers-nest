<?php

include("database-connect.php");

$data = []; // Assume success by default

if ($_SERVER['REQUEST_METHOD'] == "POST") {
	// If data is entered...
	$user_id = $_POST['user_id'];
	$get_user_query = "SELECT user_banner, user_avatar FROM users_accounts WHERE user_id = '$user_id'";
	$get_user_result = mysqli_query($con, $get_user_query);

	if ($get_user_result && mysqli_num_rows($get_user_result) > 0) {
		$fetch_media = mysqli_fetch_assoc($get_user_result);

		$user_banner_cover = $_POST['user_banner_cover'] ?? $fetch_media['user_banner'];
		$user_avatar = $_POST['user_avatar'] ?? $fetch_media['user_avatar'];

		if (!empty($user_banner_cover)) {
			$query = "UPDATE `users_accounts` SET `user_banner`='$user_banner_cover' WHERE user_id = '$user_id'";
			mysqli_query($con, $query);

			$data['status'] = 'success';
		}

		if (!empty($user_avatar)) {
			$query = "UPDATE `users_accounts` SET `user_avatar`='$user_avatar' WHERE user_id = '$user_id'";
			mysqli_query($con, $query);

			$query_comments_tbl = "UPDATE `user_contents_comments` SET `user_avatar`='$user_avatar' WHERE user_id = '$user_id'";
			mysqli_query($con, $query_comments_tbl);

			$query_contents_tbl = "UPDATE `user_posted_content` SET `user_avatar`='$user_avatar' WHERE user_id = '$user_id'";
			mysqli_query($con, $query_contents_tbl);

			$data['status'] = 'success';
		}
	} else {
		$data['status'] = 'error';
		$data['message'] = 'No user found.';
	}
} else {
	$data['status'] = 'error';
	$data['message'] = 'Invalid request method.';
}

echo json_encode($data);