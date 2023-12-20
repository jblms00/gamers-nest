<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
	$user_id = $_POST['user_id'];
	$user_content = mysqli_real_escape_string($con, $_POST['user_content']);
	$user_topic = mysqli_real_escape_string($con, $_POST['user_topic']);
	$other_topic = mysqli_real_escape_string($con, $_POST['other_topic']);
	$user_content_id = rand(100000, 999999);
	$get_user_query = "SELECT * FROM users_accounts WHERE user_id = $user_id";
	$get_user_result = mysqli_query($con, $get_user_query);

	if ($get_user_result && mysqli_num_rows($get_user_result) > 0) {
		$fetch_user = mysqli_fetch_assoc($get_user_result);
		$username = $fetch_user['username'];
		$user_avatar = $fetch_user['user_avatar'];

		if ($fetch_user['account_status'] === 'Suspend') {
			$suspended_date = strtotime($fetch_user['suspended_date']);
			$current_date = time();
			$suspension_period = 14 * 24 * 60 * 60; // 14 days in seconds

			if ($current_date < ($suspended_date + $suspension_period)) {
				$data['status'] = "error";
				$data['message'] = "Your account is suspended. You can post after " . date("M d, Y", $suspended_date + $suspension_period);
			}
		} else if (empty($user_content)) {
			$data['status'] = 'error';
			$data['message'] = 'Please enter you caption';
		} else if (empty($user_topic)) {
			$data['status'] = 'error';
			$data['message'] = 'Please choose your game topic';
		} else {
			$media_files = isset($_FILES['media']) ? $_FILES['media'] : null;
			$media_urls = [];
			$media_orientations = [];
			$upload_dir = "C:/xampp/htdocs/gamers-nest/src/css/media_upload/";
			$max_images = 2;
			$max_video_size = 100 * 1024 * 1024; // 100MB

			if (!empty($media_files['tmp_name'][0])) {
				$image_count = 0;
				$video_count = 0;

				foreach ($media_files['tmp_name'] as $key => $tmp_name) {
					$file_name = $media_files['name'][$key];
					$file_size = $media_files['size'][$key];
					$file_tmp = $media_files['tmp_name'][$key];
					$file_type = $media_files['type'][$key];

					$file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
					$valid_image_extensions = array("jpg", "jpeg", "png");
					$valid_video_extensions = array("mp4", "avi", "mov");

					if (in_array($file_ext, $valid_image_extensions) && $image_count < $max_images) {
						$new_file_name = 'IMG' . uniqid() . date('Ymd') . '.' . $file_ext;
						$image_count++;
					} elseif (in_array($file_ext, $valid_video_extensions) && $video_count < 1 && $file_size <= $max_video_size) {
						$new_file_name = 'VID' . uniqid() . date('Ymd') . '.' . $file_ext;
						$video_count++;
					} else {
						$data['status'] = 'error';
						$data['message'] = 'Invalid file type or maximum file size exceeded. Supported image formats: jpg, jpeg, png. Supported video formats: mp4, avi, mov. Max video file size: 100MB.';
						echo json_encode($data);
						exit;
					}

					$destination = $upload_dir . $new_file_name;

					if (move_uploaded_file($file_tmp, $destination)) {
						$media_urls[] = $new_file_name;

						if (in_array($file_ext, $valid_image_extensions)) {
							$image_info = getimagesize($destination);
							$orientation = $image_info[0] > $image_info[1] ? 'landscape' : 'portrait';
							$media_orientations[] = $orientation;
						} elseif (in_array($file_ext, $valid_video_extensions)) {
							$media_orientations[] = 'landscape'; // Video orientation is not applicable, set a default value.
						}
					}
				}
			}

			$media_urls_str = !empty($media_urls) ? "'" . implode(',', $media_urls) . "'" : "0";
			$media_orientations_str = !empty($media_orientations) ? "'" . implode(',', $media_orientations) . "'" : "0";

			if ($user_topic === "Other") {
				$post_topic = $other_topic;
			} else {
				$post_topic = $user_topic;
			}

			$insert_post_query = "INSERT INTO `user_posted_content`(`user_content_id`, `user_id`, `username`, `user_avatar`, `user_content`, `media_upload`, `media_orientation`, `user_topic`, `user_content_status`, `user_posted_date`) VALUES ('$user_content_id','$user_id','$username','$user_avatar','$user_content',$media_urls_str,$media_orientations_str,'$post_topic','Public', NOW())";
			$insert_post_result = mysqli_query($con, $insert_post_query);

			if ($insert_post_result) {
				$data['post_topic'] = $post_topic;
				$data['username'] = $username;
				$data['user_avatar'] = $user_avatar;
				$data['user_id'] = $user_id;
				$data['content_id'] = $user_content_id;
				$data['media_names'] = $media_urls;
				$data['media_orientation'] = $media_orientations;
				$data['status'] = 'success';
				$data['message'] = 'Post created successfully';
			} else {
				$data['status'] = 'error';
				$data['message'] = 'Error inserting post.';
			}
		}
	} else {
		$data['status'] = 'error';
		$data['message'] = 'User not found.';
	}
}

echo json_encode($data);
?>