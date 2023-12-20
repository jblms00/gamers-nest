<?php
session_start();

include("actions/database-connect.php");
include("actions/check_login.php");
require_once "src/vendor/autoload.php";

$sitekey = '6LfZ9vgoAAAAAHiwtAocyLIVpkU6Uwcd2RIEOU3q';
$secret = '6LfZ9vgoAAAAAKnBj3AkmUOxcmlDZIbicoHUwbwT';
$captcha = new \Anhskohbo\NoCaptcha\NoCaptcha($secret, $sitekey);

?>
<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Icon -->
    <link rel="icon" type="image/x-icon" href="src/css/images/favicon.png">
    <!-- CSS and Bootstrap -->
    <link rel="stylesheet" href="src/css/main.css">
    <link rel="stylesheet" href="src/css/bootstrap.css">
    <link rel="stylesheet" href="src/css/style.css">
    <link rel="stylesheet" href="src/css/responsive-style.css">
    <title>Gamer's Nest | Create Your Account</title>
</head>

<body class="signup-page">
    <div class="main-container registration-form">
        <div class="logo">
            <nav class="navbar bg-body-tertiary justify-content-start">
                <div class="row">
                    <div class="col">
                        <a class="navbar-brand pb-3" href="index.php">
                            <img src="src/css/images/main-logo.png" class="logo" alt="Image">
                        </a>
                    </div>
                </div>
                <ul class="nav justify-content-center profile-navbar">
                    <li class="nav-item">
                        <a class="nav-link" href="index.php #home">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="index.php #about">About</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="index.php #contacts">Contacts</a>
                    </li>
                    <li class="nav-item">
                        <div class="dropdown">
                            <button class="dropdown-btn">
                                Terms and Conditions
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="user-agreement-page.php">User Agreement</a></li>
                                <li><a class="dropdown-item" href="#">Privacy Policy</a></li>
                                <li><a class="dropdown-item" href="#">Content Policy</a></li>
                            </ul>
                        </div>
                    </li>
                </ul>
                <ul class="nav justify-content-end">
                    <li class="nav-item">
                        <a class="nav-link" href="login-page.php">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white"
                                class="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                <path fill-rule="evenodd"
                                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                            </svg>
                            <span>Login</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="container-fluid reg-form" id="container">
            <div class="row">
                <div class="col">
                    <h1>Sign Up here.</h1>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p>Create your account.</p>
                </div>
            </div>
            <form id="signupForm">
                <div class="form-group">
                    <div class="row">
                        <div class="col-6">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" name="username" autocomplete="off">
                                <label>Username</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-floating mb-3">
                                <input type="email" class="form-control" name="user_email" autocomplete="off">
                                <label>Email</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="form-floating mb-3">
                                <input type="password" class="form-control" name="user_password" autocomplete="off">
                                <label>Password</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-floating mb-3">
                                <input type="password" class="form-control" name="confirm_password" autocomplete="off">
                                <label>Confirm Password</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col">
                            <p class="termsconds-text">By clicking Sign Up, you agree to our
                                <span>
                                    <a href="user-agreement-page.php" target="_blank">User Agreement</a>
                                </span> and <span>
                                    <a href="privacy-policy-page.php" target="_blank">Privacy Policy</a>
                                </span>.
                            </p>
                        </div>
                    </div>
                    <div class="row my-3">
                        <div class="col">
                            <div class="sign-up-captcha">
                                <?php echo $captcha->display(); ?>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <button type="submit" class="btn btn-primary signup-btn">Sign Up</button>
                        </div>
                    </div>
                </div>
            </form>
            <?php echo $captcha->renderJs(); ?>
            <div class="form-group">
                <div class="row">
                    <div class="col">
                        <p>Already have an account?
                            <a href="login-page.php">Login here.</a>
                        </p>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div id="displayMessage" class="displayMessage"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- JQuery -->
    <script src="https://code.jquery.com/jquery-3.6.1.min.js"
        integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"
        integrity="sha384-fbbOQedDUMZZ5KreZpsbe1LCZPVmfTnH7ois6mU1QK+m14rQ1l2bGBq41eYeM/fS"
        crossorigin="anonymous"></script>
    <!-- Google Recaptcha -->
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
</body>
<!-- Users JS -->
<script src="src/js/user-signup-script.js"></script>
</body>

</html>