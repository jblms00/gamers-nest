<?php

include("database-connect.php");

$data = [];
$data['status'] = '';

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $email = $_POST['user_email'];
    $name = $_POST['user_name'];

    if (empty($email)) {
        $data['status'] = 'error';
        $data['message'] = "Please enter your email";
    } else if (empty($name)) {
        $data['status'] = 'error';
        $data['message'] = "Please enter your username";
    } else {
        $get_user_query = "SELECT * FROM users_accounts WHERE username = '$name' AND user_email = '$email'";
        $get_user_result = mysqli_query($con, $get_user_query);

        if ($get_user_result && mysqli_num_rows($get_user_result) > 0) {
            $fetch_user = mysqli_fetch_assoc($get_user_result);
            if ($email != $fetch_user['user_email']) {
                $data['status'] = 'error';
                $data['message'] = "Your email is incorrect";
            } else if ($name != $fetch_user['username']) {
                $data['status'] = 'error';
                $data['message'] = "Your username is incorrect";
            } else {
                $new_generated_password = generatePassword($email, $name);
                $new_encoded_password = base64_encode($new_generated_password);
                $update_password_query = "UPDATE users_accounts SET user_password ='$new_encoded_password' WHERE username = '$name' AND user_email = '$email'";
                $update_password_result = mysqli_query($con, $update_password_query);

                if ($update_password_result) {
                    $data['new_generated_password'] = $new_generated_password;
                    $data['status'] = 'success';
                }
            }
        } else {
            $data['status'] = 'error';
            $data['message'] = "No user found";
        }
    }
} else {
    $data['status'] = 'error';
    $data['message'] = "Invalid request method.";
}

echo json_encode($data);

function generatePassword($email, $name)
{
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?';
    $passwordLength = 12;

    $password = '';
    $characterCount = strlen($characters);

    for ($i = 0; $i < $passwordLength; $i++) {
        $randomIndex = rand(0, $characterCount - 1);
        $password .= $characters[$randomIndex];
    }

    return $password;
}