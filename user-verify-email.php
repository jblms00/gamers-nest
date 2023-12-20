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
    <title>Gamer's Nest | Login Your Account</title>
</head>

<body>
    <div class="main-container registration-form">
        <div class="container-fluid reg-form verify-form login" id="container">
            <div class="row">
                <div class="col">
                    <h2>Verify Your Email</h2>
                </div>
            </div>
            <form id="verifyEmailForm">
                <div class="form-group">
                    <div class="row">
                        <div class="col">
                            <div class="form-floating mb-3">
                                <input type="text" id="inputCode" class="form-control" autocomplete="off">
                                <label for="inputCode">Verification Code</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col">
                            <button type="submit" class="mt-4 mb-0 verify-btn">Submit</button>
                        </div>
                    </div>
                </div>
                <p id="errorMessage" class="alert p-1 alert-danger mt-3" style="display:none;"></p>
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
    <!-- User Script -->
    <script src="src/js/user-login-script.js"></script>
    <script src="src/js/user-verify-email.js"></script>
</body>

</html>