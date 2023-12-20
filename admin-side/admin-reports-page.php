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

<body class="admin-side admin-reports-page">
    <div class="header">
        <ul class="nav justify-content-end">
            <li class="nav-item">
                <a class="nav-link" href="admin-index-page.php">Home</a>
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
                <a class="nav-link" href="#">Reports</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="../actions/user-logout.php">Logout</a>
            </li>
        </ul>
    </div>
    <div class="admin-tables">
        <h3 class="table-name">Gamer's Nest Thorough Reports</h3>
        <div class="btn-options">
            <button type="button" class="remove-selected-btn d-none" id="removeSelectedReportsButton">Remove
                Selected</button>
            <input type="text" id="reportSearch" placeholder="Search reports">
            <button type="button" data-bs-toggle="modal" data-bs-target="#modalRemovedAllData">Remove All</button>
        </div>
        <table class="table text-center table-bordered" id="reportsTable">
            <!-- Table Content -->
        </table>
    </div>


    <!-- Modal - Edit Status -->
    <div class="modal fade" id="editReport" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" id="editReportDialog">
            <!-- Modal Content -->
        </div>
    </div>
    <!-- Modal - Removed Data -->
    <div class="modal fade" id="modalRemovedData" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <p class="text-center text-success fw-semibold mb-0"></p>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal - Removed ALL Data -->
    <div class="modal fade" id="modalRemovedAllData" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Remove All Posts</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="mb-0"> Are you sure you want to remove all the posts?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="modal-opt-btn" data-bs-dismiss="modal">No</button>
                    <button type="button" class="modal-opt-btn remove-reports-btn">Yes</button>
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
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Users JS -->
    <script src="../src/js/admin-side/admin-tables-script.js"></script>
</body>

</html>