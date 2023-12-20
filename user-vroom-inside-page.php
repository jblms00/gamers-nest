<?php
session_start();

include("actions/database-connect.php");
include("actions/check_login.php");

$user_data = check_login($con);
$user_id = $user_data['user_id'];
$username = $user_data['username'];

$room_id = $_GET['roomid'];

$query = "SELECT * from voice_room where room_id = '$room_id'";
$result = mysqli_query($con, $query);
$get_Value = mysqli_fetch_assoc($result);
?>

<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta id="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Icon -->
    <link rel="icon" type="image/x-icon" href="src/css/images/favicon.png">
    <!-- Bootstrap Icon -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <!-- CSS and Bootstrap -->
    <link rel="stylesheet" href="src/css/main.css">
    <link rel="stylesheet" href="src/css/bootstrap.css">
    <link rel="stylesheet" href="src/css/user-style.css">
    <link rel="stylesheet" href="src/css/responsive-style.css">
    <title>Voice Room | Gamer's Nest</title>
</head>

<body class="user-index vroom-page" data-userid="<?php echo $user_id; ?>">
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
    <div class="main-voiceroom-container pb-5">
        <!-- VC Details -->
        <div class="voice-room-details" id="voiceRoomDetails">
            <div class="voice-room-logo">
                <img src="" class="defaulVroom-img  voice-room-image" alt="voice room image" />
            </div>
            <div class="room-description">
                <h2 class="text-uppercase">Room Name: <span class="voice-room-name"></span></h2>
                <h4 class="text-light">Game Type: <span class="voice-game-type"></span></h4>
                <h4 class="text-light mb-4">Room ID: <span class="voice-room-id"></span>
                </h4>
            </div>
        </div>
        <div class="stream-wrapper" id="stream-wrapper">
            <div id="video-streams" class="vid-streams"></div>
            <div id="stream-controls" class="stream-controls">
                <button class="btn btn-primary" id="mic-btn"><i class="bi bi-mic-fill"></i></button>
                <button class="btn btn-primary" id="camera-btn"><i class="bi bi-camera-video-fill"></i></button>
                <button class="btn btn-primary btn-leave" data-vroom-id="">
                    <i class="bi bi-telephone-x-fill"></i>
                </button>
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
    <script src="src/js/inside-voice-room.js"></script>
    <!-- Agora -->
    <script src="src/js/AgoraRTC_N-4.7.3.js"></script>
    <script src="src/js/user-realtime-call-script.js"></script>
</body>

</html>