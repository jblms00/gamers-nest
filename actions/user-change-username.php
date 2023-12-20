<?php

include("database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $user_id = $_POST['user_id'];
    $new_username = mysqli_real_escape_string($con, $_POST['new_username']);
    $password = base64_encode(mysqli_real_escape_string($con, $_POST['password']));
    $confirm_password = base64_encode(mysqli_real_escape_string($con, $_POST['confirm_password']));

    $get_user_query = "SELECT * FROM users_accounts WHERE user_id = '$user_id'";
    $get_user_result = mysqli_query($con, $get_user_query);

    if ($get_user_result && mysqli_num_rows($get_user_result) > 0) {
        $fetch_user = mysqli_fetch_assoc($get_user_result);
        $user_password = $fetch_user['user_password'];
        $current_username = $fetch_user['username'];

        if (empty($new_username)) {
            $data['message'] = "Please enter your new username";
            $data['status'] = "error";
        } else if ($new_username === $current_username) {
            $data['message'] = "The new username is the same as your current username. Please choose a different username.";
            $data['status'] = "error";
        } else if (strlen($new_username) >= 12) {
            $data['status'] = "error";
            $data['message'] = "Username should contain at least 12 characters";
        } else if (empty($password)) {
            $data['message'] = "Please enter your password";
            $data['status'] = "error";
        } else if (empty($confirm_password)) {
            $data['message'] = "Please confirm your password";
            $data['status'] = "error";
        } else if ($password !== $confirm_password) {
            $data['message'] = "Passwords do not match";
            $data['status'] = "error";
        } else if ($password !== $user_password) {
            $data['message'] = "Incorrect password";
            $data['status'] = "error";
        } else {
            $get_guilds_query = "SELECT guild_members, users_ids FROM users_guilds WHERE users_ids LIKE '%$user_id%'";
            $get_guilds_result = mysqli_query($con, $get_guilds_query);

            if ($get_guilds_result && mysqli_num_rows($get_guilds_result) > 0) {
                while ($row = mysqli_fetch_assoc($get_guilds_result)) {
                    $guild_members = $row['guild_members'];
                    $users_ids = $row['users_ids'];
                    $guild_creator_id = $row['guild_creator_id'];

                    $guild_members_array = explode(',', $guild_members);
                    $users_ids_array = explode(',', $users_ids);

                    $user_index = array_search($user_id, $users_ids_array);

                    if ($user_index !== false) {
                        $guild_members_array[$user_index] = $new_username;
                        $new_guild_members = implode(',', $guild_members_array);

                        if ($user_id !== $guild_creator_id) {
                            $update_guild_members_query = "UPDATE users_guilds SET guild_members = '$new_guild_members' WHERE users_ids LIKE '%$user_id%'";
                            $update_guild_members_result = mysqli_query($con, $update_guild_members_query);
                        }

                        $udpate_u1_query = "UPDATE users_accounts SET username = '$new_username' WHERE user_id = '$user_id'";
                        $update_u1_result = mysqli_query($con, $udpate_u1_query);

                        $udpate_u2_query = "UPDATE user_contents_comments SET username = '$new_username' WHERE user_id = '$user_id'";
                        $update_u2_result = mysqli_query($con, $udpate_u2_query);

                        $udpate_u3_query = "UPDATE user_sharedpost_comments SET username = '$new_username' WHERE user_id = '$user_id'";
                        $update_u3_result = mysqli_query($con, $udpate_u3_query);

                        $udpate_u4_query = "UPDATE user_posted_content SET username = '$new_username' WHERE user_id = '$user_id'";
                        $update_u4_result = mysqli_query($con, $udpate_u4_query);

                        if ($update_u1_result && $update_u2_result && $update_u3_result && $update_u4_result) {
                            $data['message'] = "Changed successfully!";
                            $data['status'] = "success";
                        } else {
                            $data['status'] = "error";
                            $data['message'] = "Failed to change username";
                        }

                        if ($update_guild_members_result) {
                            $data['message'] = "Changed successfully!";
                            $data['status'] = "success";
                        } else {
                            $data['status'] = "error";
                            $data['message'] = "Failed to change username in users_guilds";
                        }
                    }
                }
            } else {
                $data['status'] = "error";
                $data['message'] = "Failed to fetch user guild members";
            }
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "User not found";
    }
} else {
    $data['status'] = "error";
    $data['message'] = "Invalid request method";
}

echo json_encode($data);
?>