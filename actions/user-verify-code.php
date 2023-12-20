<?php
session_start();

include("database-connect.php");

$data = [];
$data['status'] = '';

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $user_email = $_POST['user_email'];
    $user_name = $_POST['user_name'];
    $input_code = $_POST['input_code'];

    if (!empty($input_code)) {
        $get_code_query = "SELECT * FROM users_accounts WHERE user_email = '$user_email' AND username = '$user_name'";
        $get_code_result = mysqli_query($con, $get_code_query);

        if ($get_code_result && mysqli_num_rows($get_code_result) > 0) {
            $fetch_code = mysqli_fetch_assoc($get_code_result);

            if ($fetch_code['is_verified'] == 'true') {
                $data['status'] = 'error';
                $data['message'] = 'Email is already verified!';
            } else if ($fetch_code['verification_code'] !== $input_code) {
                $data['status'] = 'error';
                $data['message'] = 'Incorrect verification code!';
            } else {
                $update_verified_query = "UPDATE users_accounts SET is_verified = 'true' WHERE user_email = '$user_email' AND username = '$user_name'";
                mysqli_query($con, $update_verified_query);

                $data['status'] = 'success';
                $data['message'] = 'Email verification successful!';
            }
        } else {
            $data['status'] = 'error';
            $data['message'] = 'Invalid request or email is already verified';
        }
    } else {
        $data['status'] = 'error';
        $data['message'] = 'Please enter your verification code';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method';
}

echo json_encode($data);
?>