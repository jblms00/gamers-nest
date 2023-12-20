<?php
session_start();

include("actions/database-connect.php");
include("actions/check_login.php");

?>
<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Icon -->
    <link rel="icon" type="image/x-icon" href="src/css/images/favicon.png">
    <!-- Bootstrap Icon -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <!-- CSS and Bootstrap -->
    <link rel="stylesheet" href="src/css/main.css">
    <link rel="stylesheet" href="src/css/bootstrap.css">
    <link rel="stylesheet" href="src/css/style.css">
    <link rel="stylesheet" href="src/css/responsive-style.css">
    <title>Gamer's Nest | Login Your Account</title>
</head>

<body class="login-page">
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
                        <a class="nav-link" href="#">
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
        <div class="container-fluid reg-form login-form login" id="container">
            <div class="row">
                <div class="col">
                    <h1>Login here.</h1>
                </div>
            </div>
            <form id="loginForm">
                <div class="form-group">
                    <div class="row">
                        <div class="col">
                            <div class="form-floating mb-3">
                                <input type="text" name="user_account" class="form-control" autocomplete="off">
                                <label>Email or Username</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-floating">
                                <input type="password" name="user_password" id="userPassword" class="form-control"
                                    autocomplete="off">
                                <label>Password</label>
                            </div>
                        </div>
                    </div>
                    <div class="row my-2">
                        <div class="col">
                            <div class="show-password">
                                <input type="checkbox" class="toggle-password" id="showPassword">
                                <label class="text-light" for="showPassword">Show Password</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col">
                            <button type="submit" id="loginUser" class="signup-btn">Login</button>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col">
                            <p class="mb-2">Forgot Password? <span><a href="user-forgot-password-page.php"
                                        id="forgotPassword" class="forget-pass-btn">Click
                                        here to reset password.</a></span></p>
                            <p class="mb-3">Don't have an account? <a href="signup-page.php">Sign up here.</a></p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div id="displayMessage" class="displayMessage"></div>
                        </div>
                    </div>
                </div>
            </form>
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

    <!-- Users JS -->
    <script>
        $(document).ready(function () {

            $('#showPassword').click(function () {
                var passwordInput = $('#userPassword');
                if (passwordInput.attr('type') === 'password') {
                    passwordInput.attr('type', 'text');
                } else {
                    passwordInput.attr('type', 'password');
                }
            });

            let container = document.getElementById('container')

            toggle = () => {
                container.classList.toggle('login')
            }

            setTimeout(() => {
                container.classList.add('login')
            }, 200)

            // Login Form
            $('#loginForm').submit(function () {

                var form_data = $('#loginForm').serialize();

                $.ajax({
                    method: 'POST',
                    dataType: 'json',
                    data: form_data,
                    url: 'actions/user-login.php',
                    success: function (response) {
                        if (response.status === 'error') {
                            $('#displayMessage').html(response.message);
                            $('#displayMessage').html('<div class="alert alert-danger message">' + response.message + '</div>');
                        } else {
                            if (response.user_status == 'admin') {
                                $('#displayMessage').html(response.message);
                                $('#displayMessage').html('<div class="alert alert-success message">' + response.message + '</div>');

                                $('#loginForm .form-control').attr('disabled', true)
                                $('#loginForm .signup-btn').attr('disabled', true)

                                setTimeout(function () {
                                    window.location.href = "admin-side/admin-index-page.php";
                                }, 2000);
                            }

                            if (response.user_status == 'user') {
                                $('#displayMessage').html(response.message);
                                $('#displayMessage').html('<div class="alert alert-success message">' + response.message + '</div>');

                                $('#loginForm .form-control').attr('disabled', true)
                                $('#loginForm .signup-btn').attr('disabled', true)

                                setTimeout(function () {
                                    window.location.href = "user-index-page.php";
                                }, 2000);
                            }
                        }
                    }
                });
                return false;
            });
        });
    </script>
</body>

</html>