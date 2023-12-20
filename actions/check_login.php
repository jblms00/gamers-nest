<?php
// function to check if the user is logged in or not
function check_login($con)
{

    // Check if either the 'username' or 'user_email' session variable is set
    if (isset($_SESSION['username']) || isset($_SESSION['user_email'])) {

        // Get the user's email and username from the session
        $user_email = isset($_SESSION['user_email']) ? $_SESSION['user_email'] : null;
        $username = isset($_SESSION['username']) ? $_SESSION['username'] : null;

        // Query the database to check if the user exists
        $query = "SELECT * FROM users_accounts WHERE user_email = '$user_email' OR username = '$username' LIMIT 1";
        $result = mysqli_query($con, $query);

        if ($result && mysqli_num_rows($result) > 0) {
            $user_data = mysqli_fetch_assoc($result);
            return $user_data;
        }
    }

    // Redirect to login if the user is not logged in
    header("Location: /gamers-nest/login-page.php");
    die;
}