<?php
session_start();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

include("database-connect.php");
require '../src/vendor/autoload.php';

$data = [];
$data['status'] = '';

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $username = $_POST['username'];
    $user_email = $_POST['user_email'];
    $user_password = base64_encode($_POST['user_password']);
    $confirm_user_password = $_POST['confirm_password'];
    $recaptcha_response = $_POST['g-recaptcha-response']; // Captcha response from the form

    if (empty($recaptcha_response)) {
        $data['status'] = "error";
        $data['message'] = "Please complete the reCAPTCHA verification.";
    } elseif (!empty($username) && !empty($user_email) && !empty($user_password) && !is_numeric($username)) {
        // Verify reCAPTCHA
        $recaptcha_secret = '6LfZ9vgoAAAAAKnBj3AkmUOxcmlDZIbicoHUwbwT';

        $recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
        $recaptcha_data = [
            'secret' => $recaptcha_secret,
            'response' => $recaptcha_response,
        ];

        $recaptcha_options = [
            'http' => [
                'method' => 'POST',
                'content' => http_build_query($recaptcha_data),
                'header' => 'Content-Type: application/x-www-form-urlencoded',
            ],
        ];

        $recaptcha_context = stream_context_create($recaptcha_options);
        $recaptcha_result = file_get_contents($recaptcha_url, false, $recaptcha_context);
        $recaptcha_result = json_decode($recaptcha_result);

        if (!$recaptcha_result->success) {
            $data['status'] = "error";
            $data['message'] = "reCAPTCHA verification failed.";
        } elseif (strlen($username) >= 12) {
            $data['status'] = "error";
            $data['message'] = "Username should contain at least 12 characters";
        } elseif (!filter_var($user_email, FILTER_VALIDATE_EMAIL)) {
            $data['status'] = "error";
            $data['message'] = "Invalid user_email format";
        } else {
            // Check if the user_email is already in use
            $sql_user_email = "SELECT * FROM users_accounts WHERE user_email = '$user_email' LIMIT 1";
            $resu_user_email = mysqli_query($con, $sql_user_email) or die(mysqli_error($con));

            if (mysqli_num_rows($resu_user_email) > 0) {
                $data['status'] = "error";
                $data['message'] = "Email already used!";
            } elseif (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[a-zA-Z\d\W]{8,}$/', $user_password)) {
                $data['status'] = "error";
                $data['message'] = "Password should be at least 8 characters in length and should include at least one upper case letter, one number, and one special character.";
            } elseif ($_POST['user_password'] !== $confirm_user_password) {
                $data['status'] = "error";
                $data['message'] = "Password doesn't match!";
            } else {
                $user_id = rand(10000000, 99999999);
                $verification_code = substr(number_format(time() * rand(), 0, '', ''), 0, 6);
                $query = "INSERT INTO users_accounts (user_id, username, user_email, user_password, user_banner, user_avatar, user_status, account_status, verification_code, is_verified, user_type, account_created) VALUES ('$user_id', '$username', '$user_email', '$user_password', 'default-banner.jpg', 'default-avatar.png', 'Offline', 'Active', '$verification_code', 'false', 'user', NOW())";
                mysqli_query($con, $query);

                // Send the verification email
                sendVerificationEmail($user_email, $username, $verification_code);

                $data['user_name'] = $username;
                $data['user_email'] = $user_email;
                $data['status'] = "success";
                $data['message'] = "Account Successfully Created! Check your email for verification.";
            }
        }
    } else {
        $data['status'] = "error";
        $data['message'] = "Please enter some information!";
    }
}

echo json_encode($data);

function sendVerificationEmail($user_email, $user_name, $verification_code)
{
    $mail = new PHPMailer(true);

    try {
        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;

        $mail->Username = 'webdev.gamers.nest00@gmail.com';
        $mail->Password = 'bkis xqhj nyqg fhgd';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('webdev.gamers.nest00@gmail.com', 'Gamers Nest');
        $mail->addAddress($user_email, $user_name);

        $mail->isHTML(true);

        $mail->Subject = "Email Verification from Gamer's Nest";
        $mail->Body = "<p>Your verification code is: <b style='font-size: 2rem;'>$verification_code</b></p>";

        $mail->send();
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>