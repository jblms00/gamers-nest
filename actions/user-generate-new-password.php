<?php

include("database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $user_id = $_POST['user_id'];
    $user_email = $_POST['user_email'];
    $username = $_POST['username'];
    $account_created_date = date("F j, Y", strtotime($_POST['account_created_date']));

    $get_user_query = "SELECT * FROM users_accounts WHERE user_id = '$user_id'";
    $get_user_result = mysqli_query($con, $get_user_query);

    if ($get_user_result && mysqli_num_rows($get_user_result) > 0) {
        $fetch_user = mysqli_fetch_assoc($get_user_result);
        $current_email = $fetch_user['user_email'];
        $current_username = $fetch_user['username'];
        $date_created = $fetch_user['account_created'];
        $formatted_date = date("F j, Y", strtotime($date_created));

        $data['formatted_date'] = $formatted_date;
        $data['account_created_date'] = $account_created_date;

        if (empty($user_email)) {
            $data['message'] = "Please enter your email";
            $data['status'] = "error";
        } else if (!filter_var($user_email, FILTER_VALIDATE_EMAIL)) {
            $data['message'] = "Invalid email format";
            $data['status'] = "error";
        } else if (empty($username)) {
            $data['message'] = "Please enter username";
            $data['status'] = "error";
        } else if (empty($account_created_date)) {
            $data['message'] = "Please select the date when you created your account";
            $data['status'] = "error";
        } else if ($user_email !== $current_email) {
            $data['message'] = "Email does not match current email";
            $data['status'] = "error";
        } else if ($username !== $current_username) {
            $data['message'] = "You entered your wrong username";
            $data['status'] = "error";
        } else if ($account_created_date !== $formatted_date) {
            $data['message'] = "Please confirm your accurate account creation date.";
            $data['status'] = "error";
        } else {
            $new_generated_password = generatePassword($username, $account_created_date);
            $data['new_generated_password'] = $new_generated_password;
            $data['status'] = "success";
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

function generatePassword($username, $account_created_date)
{
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?';
    $passwordLength = 10;

    $password = '';
    $characterCount = strlen($characters);

    for ($i = 0; $i < $passwordLength; $i++) {
        $randomIndex = rand(0, $characterCount - 1);
        $password .= $characters[$randomIndex];
    }

    return $password;
}