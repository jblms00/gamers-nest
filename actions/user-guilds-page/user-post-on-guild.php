<?php
session_start();
include("../database-connect.php");
include("../check_login.php");

$user_data = check_login($con);
$logged_in_user_id = $user_data['user_id'];

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $current_user_id = $_POST['current_user_id'];
    $guild_id = $_POST['guild_id'];
    $user_content = mysqli_real_escape_string($con, $_POST['user_content']);
    $media_files = isset($_FILES['media']) ? $_FILES['media'] : null;

    if ($logged_in_user_id === $current_user_id) {
        if (!empty($user_content)) {
            $media_files = isset($_FILES['media']) ? $_FILES['media'] : null;
            $media_urls = [];
            $media_orientations = [];
            $upload_dir = "C:/xampp/htdocs/gamers-nest/src/css/guild_media_uploads/";
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
                            $media_orientations[] = 'landscape';
                        }
                    }
                }
            }

            $media_urls_str = !empty($media_urls) ? "'" . implode(',', $media_urls) . "'" : "0";
            $media_orientations_str = !empty($media_orientations) ? "'" . implode(',', $media_orientations) . "'" : "0";

            $guild_post_id = rand(100000, 999999);
            $posted_at = date('Y-m-d H:i:s'); // Formats the timestamp in 'YYYY-MM-DD HH:MM:SS' format
            $insert_post_query = "INSERT INTO `user_guild_posts` (`guild_post_id`, `guild_id`, `user_id`, `user_posted_content`, `media_upload`, `media_orientation`, `post_status`, `posted_at`) VALUES ('$guild_post_id', '$guild_id', '$current_user_id', '$user_content', $media_urls_str, $media_orientations_str, 'Active', '$posted_at')";
            $insert_post_result = mysqli_query($con, $insert_post_query);

            if ($insert_post_result) {
                $data['username'] = $user_data['username'];
                $data['user_avatar'] = $user_data['user_avatar'];
                $data['user_id'] = $current_user_id;
                $data['guild_post_id'] = $guild_post_id;
                $data['media_names'] = $media_urls;
                $data['media_orientation'] = $media_orientations;
                $data['status'] = 'success';
                $data['message'] = 'Post created successfully';
            } else {
                $data['status'] = 'error';
                $data['message'] = 'Error inserting post.';
            }
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Error creating post.';
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "User id does not match.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);