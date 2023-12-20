<?php
include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $current_user_id = mysqli_real_escape_string($con, $_POST['current_user_id']);
    $guild_id = $_POST['guild_id'];
    $new_guild_name = $_POST['current_guild_name'];
    $new_guild_description = mysqli_real_escape_string($con, $_POST['current_guild_description']);
    $new_guild_banner = isset($_FILES['current_guild_banner']) ? $_FILES['current_guild_banner'] : null;
    $new_guild_logo = isset($_FILES['current_guild_logo']) ? $_FILES['current_guild_logo'] : null;

    // Check if guild_name contains exactly 3 words
    $word_count = str_word_count($new_guild_name);
    if (empty($new_guild_name) || $word_count > 3) {
        $data['message'] = "Guild name should contain at least 3 words.";
        $data['status'] = "error";
        echo json_encode($data);
        exit;
    }

    // Check if guild_description is blank or contains at least 30 characters
    $character_count_description = strlen($new_guild_description);
    if (empty($new_guild_description) || $character_count_description < 30) {
        $data['message'] = "Guild description should contain at least 30 characters";
        $data['status'] = "error";
        echo json_encode($data);
        exit;
    }

    $check_guild_query = "SELECT * FROM `users_guilds` WHERE guild_id = '$guild_id'";
    $check_guild_result = mysqli_query($con, $check_guild_query);

    if ($check_guild_result && mysqli_num_rows($check_guild_result) > 0) {
        // Check if file uploads had any errors
        $defaultBanner = "default-banner.jpg";
        $defaultLogo = "default-logo.png";

        if ($new_guild_banner !== null) {
            $bannerExtension = pathinfo($new_guild_banner['name'], PATHINFO_EXTENSION);
            $bannerFilename = "GBANNER-" . date("YmdHis") . "-" . mt_rand(1000, 9999) . ".$bannerExtension";
            $bannerUploadDirectory = "C:/xampp/htdocs/gamers-nest/src/css/images/guilds-media/guild-banners/";
            $bannerFilePath = $bannerUploadDirectory . $bannerFilename;

            move_uploaded_file($new_guild_banner['tmp_name'], $bannerFilePath);
        } else {
            $bannerFilename = $defaultBanner;
        }

        if ($new_guild_logo !== null) {
            $logoExtension = pathinfo($new_guild_logo['name'], PATHINFO_EXTENSION);
            $logoFilename = "GLOGO-" . date("YmdHis") . "-" . mt_rand(1000, 9999) . ".$logoExtension";
            $logoUploadDirectory = "C:/xampp/htdocs/gamers-nest/src/css/images/guilds-media/guild-logos/";
            $logoFilePath = $logoUploadDirectory . $logoFilename;

            move_uploaded_file($new_guild_logo['tmp_name'], $logoFilePath);
        } else {
            $logoFilename = $defaultLogo;
        }

        $update_query = "UPDATE `users_guilds` SET `guild_name`='$new_guild_name',`guild_description`='$new_guild_description',`guild_banner`='$bannerFilename',`guild_logo`='$logoFilename' WHERE guild_id = '$guild_id'";
        $update_result = mysqli_query($con, $update_query);

        if ($update_result) {
            $data['new_guild_name'] = $new_guild_name;
            $data['guild_id'] = $guild_id;
            $data['status'] = "success";
            $data['message'] = "Guild information updated successfully.";
        } else {
            $data['status'] = "error";
            $data['message'] = "Guild information is not successfully updated.";
        }

    } else {
        $data['status'] = "error";
        $data['message'] = "Guild does not exist.";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);
?>