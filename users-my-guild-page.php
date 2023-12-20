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
    <title>My Guilds | Gamer's Nest</title>
</head>

<body class="user-index" data-userid="<?php echo $user_id; ?>">
    <div class="header">
        <a href="#home">
            <img src="src/css/images/main-logo.png" class="logo" alt="Image">
        </a>
    </div>
    <div class="main-container user-landing-page guild-page">
        <div class="left-sidebar">
            <div class="sidebar-wrapper">
                <div class="top-button-groups">
                    <a href="user-index-page.php" class="a-tag home">
                        <div class="links">
                            <i class="bi bi-house-door-fill"></i>
                            <label>Home</label>
                        </div>
                    </a>
                    <div class="dropdown notif-dropdown user-notif">
                        <a class="notifications user-notif-btn" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false" data-bs-auto-close="false">
                            <i class="bi bi-bell-fill"></i>
                            <label>Notifications</label>
                        </a>
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
                    <a href="user-messages-page.php" class="a-tag messages">
                        <div class="links">
                            <i class="bi bi-chat-right-text-fill"></i>
                            <label>Messages</label>
                        </div>
                    </a>
                    <a href="user-vroom-page.php" class="a-tag voicerooms">
                        <div class="links">
                            <i class="bi bi-headset"></i>
                            <label>Voice Rooms</label>
                        </div>
                    </a>
                    <a class="a-tag guilds" data-bs-toggle="collapse" href="#collapseGuilds" role="button"
                        aria-expanded="false">
                        <div class="links">
                            <i class="bi bi-amd"></i>
                            <label>Guilds</label>
                        </div>
                    </a>
                    <div class="collapse" id="collapseGuilds">
                        <a class="a-tag" href="user-guilds-page.php">
                            <div class="links">
                                <label class="mx-5">All Guilds</label>
                            </div>
                        </a>
                        <a class="a-tag" href="#">
                            <div class="links">
                                <label class="mx-5">My Guild</label>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="bottom-button-groups">
                    <a id="userProfile" class="a-tag profile">
                        <div class="links">
                            <img src="src/css/images/free-display-photos/<?php echo $user_data['user_avatar']; ?>"
                                class="bi sidebar-dp" alt="Avatar">
                            <label style="cursor:pointer">
                                <?php echo $user_data['username']; ?>
                            </label>
                        </div>
                    </a>
                    <button type="button" class="a-tag settings" data-bs-toggle="modal" data-bs-target="#userSettings"
                        data-user-id="<?php echo $user_id; ?>">
                        <div class="links">
                            <i class="bi bi-gear-fill"></i>
                            <label>Settings</label>
                        </div>
                    </button>
                    <a href="actions/user-logout.php" class="a-tag settings">
                        <div class="links">
                            <i class="bi bi-power"></i>
                            <label>Logout</label>
                        </div>
                    </a>
                </div>
            </div>
        </div>

        <div class="main-feed container-fluid">
            <div class="outer-container">
                <div class="button-container">
                    <button type="button" id="createGuildModal" class="create-guild-btn" data-bs-toggle="modal"
                        data-bs-target="#createGuild">
                        <label>Create Guild</label>
                        <i class="bi bi-plus-lg"></i>
                    </button>
                </div>
                <button type="button" class="me-3 za-filter-guilds">
                    <i class="bi bi-sort-alpha-down-alt"></i>
                </button>
            </div>
            <div class="guilds-container" id="myguildsContainer">
                <!-- Display users guild here -->
            </div>
        </div>
    </div>

    <!-- Modal Create Guild-->
    <div class="modal fade" id="createGuild" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" id="createGuildDialog">
            <!-- Display HTML element here -->
        </div>
    </div>
    <!-- Modal - Leave Guild -->
    <div class="modal fade modal-view-post" id="leaveGuild" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" id="leaveGuildDialog">
            <!-- Display Modal Content Here -->
        </div>
    </div>
    <!-- Modal - Settings-->
    <div class="modal fade" id="userSettings" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" id="userDialogSettings">
            <!-- Display HTML Element Here -->
        </div>
    </div>
    <!-- Modal - Change Username-->
    <div class="modal fade" id="changeUsername" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" id="usernameDialog">
            <!-- Display HTML Element Here -->
        </div>
    </div>
    <!-- Modal - Change Username-->
    <div class="modal fade" id="changePassword" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" id="passwordDialog">
            <!-- Display HTML Element Here -->
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
    <script src="src/js/user-guild-page.js"></script>
</body>

</html>