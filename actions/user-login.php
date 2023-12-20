<?php
session_start();

include("database-connect.php");
include("check_login.php");

$data = [];
$data['status'] = '';

if ($_SERVER['REQUEST_METHOD'] == "POST") {
	$user_data = array();
	$user_account = $_POST['user_account'];
	$user_password = base64_encode($_POST['user_password']);

	$query = "SELECT * FROM users_accounts WHERE user_email = '$user_account' OR username = '$user_account' AND user_password = '$user_password'";
	$query_result = mysqli_query($con, $query);
	$user_data = mysqli_fetch_assoc($query_result);

	if (empty($user_account) && empty($user_password)) {
		$data['status'] = "error";
		$data['message'] = "Please enter your username or email and password";
	} else if (empty($user_account)) {
		$data['status'] = "error";
		$data['message'] = "Please enter your email or username";
	} else if (empty($user_password)) {
		$data['status'] = "error";
		$data['message'] = "Please enter your password";
	} else if ($user_data['is_verified'] === "false") {
		$data['status'] = "error";
		$data['message'] = "Your email is not verified";
	} else {
		if (!empty($user_data)) {
			$user_type = $user_data['user_type'];
			$user_status = $user_data['user_status'];
		}

		if ($query_result && mysqli_num_rows($query_result) > 0) {
			if ($user_data['user_status'] === 'Online') {
				$data['status'] = "error";
				$data['message'] = "Kindly log out of your account on other devices";
			} else {
				if ($user_data['user_password'] === $user_password) {
					$_SESSION['user_email'] = $user_data['user_email'];

					if ($user_type == 'user') {
						if ($user_status == 'Offline') {
							$update_status_query = "UPDATE users_accounts SET user_status = 'Online' WHERE user_email = '{$user_data['user_email']}'";
							mysqli_query($con, $update_status_query);

							$data['user_status'] = "user";
							$data['status'] = "success";
							$data['message'] = "User Login Successfully!";
						}
					}

					if ($user_type == 'admin') {
						$update_admin_status_query = "UPDATE users_accounts SET user_status = 'Online' WHERE user_email = '{$user_data['user_email']}'";
						mysqli_query($con, $update_admin_status_query);

						$data['user_status'] = "admin";
						$data['status'] = "success";
						$data['message'] = "Admin Login Successfully!";
					}
				} else {
					$data['status'] = "error";
					$data['message'] = "Incorrect password!";
				}
			}

		} else {
			$data['status'] = "error";
			$data['message'] = "Wrong email or username!";
		}
	}
}

echo json_encode($data);