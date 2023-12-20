<?php
session_start();

include("../actions/database-connect.php");

?>

<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Icon -->
    <link rel="icon" type="image/x-icon" href="../src/css/images/favicon.png">
    <!-- Bootstrap Icon -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <!-- CSS and Bootstrap -->
    <link rel="stylesheet" href="../src/css/main.css">
    <link rel="stylesheet" href="../src/css/bootstrap.css">
    <link rel="stylesheet" href="../src/css/admin-style.css">
    <link rel="stylesheet" href="../src/css/responsive-style.css">
    <title>Admin Dashboard | Gamer's Nest</title>
</head>

<body class="admin-index">
    <div class="header">
        <ul class="nav justify-content-end">
            <li class="nav-item">
                <a class="nav-link" href="#">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="admin-users-page.php">Users</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="admin-posts-page.php">Posts</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="admin-guilds-page.php">Guilds</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="admin-voiceroom-page.php">Rooms</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="admin-reports-page.php">Reports</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="../actions/user-logout.php">Logout</a>
            </li>
        </ul>
    </div>
    <div class="main-container">
        <div class="card">
            <div class="card-title">
                <i class="bi bi-people-fill"></i>
                <h4>Total Registered Users</h4>
            </div>
            <h2 class="count text-end m-0" id="registeredUsers">0</h2>
            <canvas id="registeredGraph" width="400" height="200"></canvas>
        </div>
        <div class="card">
            <div class="card-title">
                <i class="bi bi-person-fill-check"></i>
                <h4>Total Active Users</h4>
            </div>
            <h2 class="count text-end m-0" id="activeUsers">0</h2>
            <canvas id="activeGraph" width="400" height="200"></canvas>
        </div>
        <div class="card">
            <div class="card-title">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <h4>Total Reports</h4>
            </div>
            <h2 class="count text-end m-0" id="totalReport">0</h2>
            <canvas id="reportGraph" width="400" height="200"></canvas>
        </div>
        <div class="card">
            <div class="card-title">
                <i class="bi bi-file-post"></i>
                <h4>Total Posts</h4>
            </div>
            <h2 class="count text-end m-0" id="totalPosts">0</h2>
            <canvas id="postGraph" width="400" height="200"></canvas>
        </div>
        <div class="card">
            <div class="card-title">
                <i class="bi bi-hand-thumbs-up-fill"></i>
                <h4>Total Likes</h4>
            </div>
            <h2 class="count text-end m-0" id="totalLikes">0</h2>
            <canvas id="likesGraph" width="400" height="200"></canvas>
        </div>
        <div class="card">
            <div class="card-title">
                <i class="bi bi-share-fill"></i>
                <h4>Total Shared Post</h4>
            </div>
            <h2 class="count text-end m-0" id="sharedPostLikes">0</h2>
            <canvas id="sharedPostGraph" width="400" height="200"></canvas>
        </div>
        <div class="card-topics">
            <div class="card-title">
                <i class="bi bi-bar-chart-line-fill"></i>
                <h4>Top 10 User Topics</h4>
            </div>
            <div id="topUserTopics" class="p-3"></div>
        </div>
    </div>


    <!-- Modal - Removed Data -->
    <div class="modal fade" id="modalRemovedData" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body"></div>
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
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Users JS -->
    <script src="../src/js/admin-side/admin-dashboard-script.js"></script>
</body>

</html>