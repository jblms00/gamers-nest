<?php
session_start();

include("actions/database-connect.php");
include("actions/check_login.php");

$user_data = check_login($con);
$user_id = $user_data['user_id'];
$username = $user_data['username'];
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
    <link rel="stylesheet" href="src/css/user-style.css">
    <link rel="stylesheet" href="src/css/responsive-style.css">
    <title>Messages | Gamer's Nest</title>
</head>

<body class="msg-body user-index msg-page" data-userid="<?php echo $user_id; ?>">
    <div class="navbar-top justify-content-end">
        <ul class="nav">
            <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="user-index-page.php">
                    <i class="bi bi-house-door-fill"></i>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="user-vroom-page.php">
                    <i class="bi bi-headset"></i>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="user-guilds-page.php">
                    <i class="bi bi-amd"></i>
                </a>
            </li>
            <li class="nav-item">
                <div class="dropdown nav-link user-notif">
                    <button class="dropdown-toggle user-notif-btn" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i class="bi bi-bell-fill"></i>
                    </button>
                    <div class="dropdown-menu notification-dropdown">
                        <div class="notification-option">
                            <button type="button" class="notif-opt-btn" id="markReadNotif">Mark All as Read</button>
                            <button type="button" class="notif-opt-btn" id="clearNotif">Clear Notification</button>
                        </div>
                        <ul class="notifications-list" id="notificationsDropdown">
                            <!-- Display Notifications here -->
                        </ul>
                    </div>
                </div>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="userProfile">
                    <img src="src/css/images/free-display-photos/<?php echo $user_data['user_avatar']; ?>"
                        class="bi topbar-avatar" alt="Avatar">
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="actions/user-logout.php">
                    <i class="bi bi-power"></i>
                </a>
            </li>
        </ul>
    </div>
    <div class="msg-container" id="messageContainer">
        <div class="msg-left-sidebar">
            <div class="search-box">
                <input type="text" id="searchConversation" class="search-convo" placeholder="Search conversation">
            </div>
            <div class="options">
                <div class="mute">
                    <a class="option-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-bell-fill"></i>
                    </a>
                    <ul class="dropdown-menu">
                        <li><button type="button" id="muteAllConversation" class="dropdown-item">Mute All
                                Conversation</button></li>
                        <li><button type="button" id="unmuteAllConversation" class="dropdown-item">Unmute All
                                Conversation</button></li>
                    </ul>
                </div>
                <div class="new-msg">
                    <button class="option-btn new-message-btn" id="NewMessage" type="button" data-bs-toggle="modal"
                        data-bs-target="#modalnewMessage">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                </div>
            </div>

            <div class="chat-wrapper">
                <ul class="chat-container" id="chatListContainer">
                    <!-- Display chat list here -->
                </ul>
            </div>
        </div>
    </div>

    <!-- Modal New Message-->
    <div class="modal fade" id="modalnewMessage" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-md" id="messageDisplayUser">
            <!-- Display Users Here -->
        </div>
    </div>
    <!-- Modal Delete Conversation-->
    <div class="modal fade" id="deleteConversation" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" id="deleteConvoDialog">
            <!-- Display Content Here -->
        </div>
    </div>
    <!-- Modal Block User-->
    <div class="modal fade" id="blockUser" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" id="blockUserDialog">
            <!-- Display Content Here -->
        </div>
    </div>
    <!-- Modal Report User === 1st Modal-->
    <div class="modal fade" id="reportUser">
        <div class="modal-dialog modal-dialog-centered" id="reportUserDialog">
            <!-- Display Content Here -->
        </div>
    </div>
    <!-- Modal Report User === 2nd Modal-->
    <div class="modal fade" id="reportUserSecondModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <!-- Display Content Here -->
            </div>
        </div>
    </div>
    <!-- Modal - View Guild Post-->
    <div class="modal fade modal-view-post" id="viewGuildPost" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg" id="modalUserGuildPost">
            <!-- Display User's Post -->
        </div>
    </div>
    <!-- Modal - Warnig Account Status-->
    <div class="modal fade" id="adminMessage" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5 text-danger fw-semibold">Account Warning Notice</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Dear
                        <?php echo $username; ?>,
                    </p>
                    <p>We regret to inform you that your account has received a warning due to a violation of our
                        platform's policies. We take these matters seriously to maintain a safe and respectful
                        environment for all users.</p>
                    <p>Please review our community guidelines to understand what specific rule or policy was violated.
                        We encourage you to rectify the situation and adhere to our guidelines to avoid further
                        consequences.</p>
                    <p>Thank you for your understanding and cooperation.</p>
                    <p class="m-0">Sincerely,</p>
                    <p class="text-info text-uppercase fw-semibold m-0">Gamer's Nest</p>
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
    <!-- Users JS -->
    <script src="src/js/user-message-page-script.js"></script>
</body>

</html>