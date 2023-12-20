$(document).ready(function () {
    usersTable();
    postsTable();
    reportsTable();
    guildsTable();
    roomsTable();

    removeSelectedData();
    removeAllData();
    usersModal();

    setInterval(usersTable, 60000);
    setInterval(postsTable, 60000);
    setInterval(reportsTable, 60000);
    setInterval(guildsTable, 60000);
    setInterval(roomsTable, 60000);
});

function usersTable() {
    $.ajax({
        url: '../actions/admin-side/get-overall-users.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                var userTable = $('#userTable');
                var tableHTML = `
                    <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>Username</th>
                            <th>User Availability</th>
                            <th>Account Status</th>
                            <th>Account Created</th>
                            <th>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="noResultsRow" class="d-none">
                            <td colspan="7" class="text-center text-pink">No results found.</td>
                        </tr>
                `;

                if (response.users.length === 0) {
                    // If there are no posts, add a single row with the message
                    tableHTML += `
                        <tr>
                            <td colspan="7" class="text-center text-pink fw-semibold">There are currently no posts to display.</td>
                        </tr>
                    `;
                } else {
                    response.users.forEach(function (user) {
                        var accountCreated = new Date(user.account_created);
                        var formattedDate = (accountCreated.getMonth() + 1) + '/' + accountCreated.getDate() + '/' + accountCreated.getFullYear();
                        var userStatusClass = user.user_status === 'Online' ? 'text-success' : 'text-danger';
                        tableHTML += `
                            <tr>
                                <td class="align-middle"><input type="checkbox" class="user-checkbox" data-userid="${user.user_id}" data-username="${user.username}"></td>
                                <td class="align-middle">${user.user_id}</td>
                                <td class="align-middle">
                                    <img src="../src/css/images/free-display-photos/${user.user_avatar}" class="avatar" alt="avatar">
                                    <span>${user.username}</span>
                                </td>
                                <td class="align-middle fw-semibold ${userStatusClass}">${user.user_status}</td>
                                <td class="align-middle">${user.account_status}</td>
                                <td class="align-middle">${formattedDate}</td>
                                <td class="align-middle" data-userid="${user.user_id}">
                                    <button type="button" class="edit-btn edit-user" data-bs-toggle="modal" data-bs-target="#editUser"><i class="bi bi-pencil-square"></i></i></button>
                                </td>
                            </tr>
                        `;
                    });
                }
                tableHTML += `
                    </tbody>
                `;
                userTable.html(tableHTML);
            }
        },
        error: function (xhr, status, error) {
            console.log("AJAX Error:", error);
        }
    });

    function filterTable(searchQuery) {
        var rows = $('#userTable tbody tr:not(#noResultsRow)');
        var lowerSearchQuery = searchQuery.toLowerCase();
        var anyMatch = false;

        rows.each(function () {
            var rowText = $(this).text().toLowerCase();
            if (rowText.indexOf(lowerSearchQuery) === -1) {
                $(this).addClass('d-none'); // Hide rows that don't match
            } else {
                $(this).removeClass('d-none'); // Show rows that match
                anyMatch = true;
            }
        });

        // Show "No results" row if no matches
        if (!anyMatch) {
            $('#noResultsRow').removeClass('d-none');
        } else {
            $('#noResultsRow').addClass('d-none');
        }
    }

    // Call the filter function when the search input changes
    $('#userSearch').on('input', function () {
        var searchQuery = $(this).val();
        filterTable(searchQuery);
    });
}

function generateMediaHTML(mediaUpload, mediaOrientation) {
    var mediaHTML = "";

    if (mediaUpload && typeof mediaUpload === "string" && mediaOrientation && typeof mediaOrientation === "string") {
        var mediaUrls = mediaUpload.split(",");
        var orientations = mediaOrientation.split(",");

        if (mediaUrls.length === orientations.length) {
            // Multiple files
            if (mediaUrls.length > 1) {
                var isAllPortrait = orientations.every(function (orientation) {
                    return orientation === "portrait";
                });

                var isAllLandscape = orientations.every(function (orientation) {
                    return orientation === "landscape";
                });

                var uploadMediaClass = "upload-media";

                if (isAllPortrait) {
                    uploadMediaClass += " all-portrait";
                } else if (isAllLandscape) {
                    uploadMediaClass += " all-landscape";
                } else {
                    uploadMediaClass += " mixed-orientation";
                }

                mediaHTML += '<div class="' + uploadMediaClass + '">';
                for (var i = 0; i < mediaUrls.length; i++) {
                    var mediaUrl = mediaUrls[i].trim();
                    var mediaFile = mediaUrl.split(".").pop().toLowerCase();
                    var orientation = orientations[i].trim();

                    if (mediaFile === "jpg" || mediaFile === "jpeg" || mediaFile === "png") {
                        // Image file
                        mediaHTML += '<img src="/gamers-nest/src/css/media_upload/' + mediaUrl + '" class="uploaded-media ' + orientation + '" alt="Uploaded Image">';
                    }
                }
                mediaHTML += "</div>";
            }
            // Single file
            else {
                var mediaUrl = mediaUrls[0].trim();
                var mediaFile = mediaUrl.split(".").pop().toLowerCase();
                var orientation = orientations[0].trim();

                if (mediaFile === "jpg" || mediaFile === "jpeg" ||mediaFile === "png") {
                    // Image file
                    mediaHTML += '<div class="upload-media">';
                    mediaHTML += '<img src="/gamers-nest/src/css/media_upload/' + mediaUrl + '" class="uploaded-media ' + orientation + '" alt="Uploaded Image">';
                    mediaHTML += "</div>";
                } else if (mediaFile === "mp4" || mediaFile === "mov" ||mediaFile === "avi") {
                    // Video file
                    mediaHTML += '<div class="upload-media">';
                    mediaHTML += '<video controls class="uploaded-media ' + orientation + '"><source src="/gamers-nest/src/css/media_upload/' + mediaUrl + '" type="video/' + mediaFile + '">Your browser does not support the video tag.</video>';
                    mediaHTML += "</div>";
                }
            }
        }
    }
    return mediaHTML;
}

function postsTable() {
    $.ajax({
        url: '../actions/admin-side/get-overall-posts.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                var postsTable = $('#postsTable');
                var tableHTML = `
                    <thead>
                        <tr>
                            <th></th>
                            <th>Post ID</th>
                            <th>Username</th>
                            <th>Topic</th>
                            <th>Posted at</th>
                            <th>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="noResultsRow" class="d-none">
                            <td colspan="6" class="text-center text-pink">No results found.</td>
                        </tr>
                `;

                if (response.posts.length === 0) {
                    tableHTML += `
                        <tr>
                            <td colspan="6" class="text-center text-pink fw-semibold">There are currently no posts to display.</td>
                        </tr>
                    `;
                } else {
                    response.posts.forEach(function (post) {
                        var postCreated = new Date(post.user_posted_date);
                        var formattedDate = (postCreated.getMonth() + 1) + '/' + postCreated.getDate() + '/' + postCreated.getFullYear();

                        tableHTML += `
                            <tr>
                                <td class="align-middle"><input type="checkbox" class="post-checkbox" data-postid="${post.user_content_id}"></td>
                                <td class="align-middle">${post.user_content_id }</td>
                                <td class="align-middle">
                                    <img src="../src/css/images/free-display-photos/${post.user_avatar}" class="avatar" alt="avatar">
                                    <span>${post.username}</span>
                                </td>
                                <td class="align-middle">${post.user_topic}</td>
                                <td class="align-middle">${formattedDate}</td>
                                <td class="align-middle" data-postid="${post.user_content_id}">
                                    <button type="button" class="view-post" data-bs-toggle="modal" data-bs-target="#editPost"><i class="bi bi-eye-fill"></i></button>
                                </td>
                            </tr>
                        `;
                    });
                }
                tableHTML += `
                    </tbody>
                `;

                postsTable.html(tableHTML);
            }
        },
        error: function (xhr, status, error) {
            console.log("AJAX Error:", error);
        }
    });

    function filterTable(searchQuery) {
        var rows = $('#postsTable tbody tr:not(#noResultsRow)');
        var lowerSearchQuery = searchQuery.toLowerCase();
        var anyMatch = false;

        rows.each(function () {
            var rowText = $(this).text().toLowerCase();
            if (rowText.indexOf(lowerSearchQuery) === -1) {
                $(this).addClass('d-none'); // Hide rows that don't match
            } else {
                $(this).removeClass('d-none'); // Show rows that match
                anyMatch = true;
            }
        });

        // Show "No results" row if no matches
        if (!anyMatch) {
            $('#noResultsRow').removeClass('d-none');
        } else {
            $('#noResultsRow').addClass('d-none');
        }
    }

    // Call the filter function when the search input changes
    $('#postSearch').on('input', function () {
        var searchQuery = $(this).val();
        filterTable(searchQuery);
    });
}

function guildsTable() {
    $.ajax({
        url: '../actions/admin-side/get-overall-guilds.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                var guildsTable = $('#guildsTable');
                var tableHTML = `
                    <thead>
                        <tr>
                            <th></th>
                            <th>Guild ID</th>
                            <th>Creator ID</th>
                            <th>Guild Name</th>
                            <th>Guild Members</th>
                            <th>Guild Status</th>
                            <th>Created At</th>
                            <th>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="noResultsRow" class="d-none">
                            <td colspan="8" class="text-center text-pink">No results found.</td>
                        </tr>
                `;

                if (response.guilds.length === 0) {
                    tableHTML += `
                        <tr>
                            <td colspan="8" class="text-center text-pink fw-semibold">There are currently no guilds to display.</td>
                        </tr>
                    `;
                } else {
                    response.guilds.forEach(function (guild) {
                        var guildCreated = new Date(guild.guild_created_at);
                        var formattedDate = (guildCreated.getMonth() + 1) + '/' + guildCreated.getDate() + '/' + guildCreated.getFullYear();
                        
                        var count = guild.members === "" ? 0 : guild.members;

                        tableHTML += `
                            <tr>
                                <td class="align-middle"><input type="checkbox" class="guild-checkbox" data-guildid="${guild.guild_id}"></td>
                                <td class="align-middle">${guild.guild_id}</td>
                                <td class="align-middle">${guild.guild_creator_id}</td>
                                <td class="align-middle">${guild.guild_name}</td>
                                <td class="align-middle">${count + 1}</td>
                                <td class="align-middle text-capitalize">${guild.guild_status}</td>
                                <td class="align-middle">${formattedDate}</td>
                                <td class="align-middle" data-guildid="${guild.guild_id}">
                                    <button type="button" class="edit-btn edit-guild" data-bs-toggle="modal" data-bs-target="#editGuild"><i class="bi bi-pencil-square"></i></i></button>
                                </td>
                            </tr>
                        `;
                    });
                }
                tableHTML += `
                    </tbody>
                `;

                guildsTable.html(tableHTML);
            }
        },
        error: function (xhr, status, error) {
            console.log("AJAX Error:", error);
        }
    });

    function filterTable(searchQuery) {
        var rows = $('#guildsTable tbody tr:not(#noResultsRow)');
        var lowerSearchQuery = searchQuery.toLowerCase();
        var anyMatch = false;

        rows.each(function () {
            var rowText = $(this).text().toLowerCase();
            if (rowText.indexOf(lowerSearchQuery) === -1) {
                $(this).addClass('d-none'); // Hide rows that don't match
            } else {
                $(this).removeClass('d-none'); // Show rows that match
                anyMatch = true;
            }
        });

        // Show "No results" row if no matches
        if (!anyMatch) {
            $('#noResultsRow').removeClass('d-none');
        } else {
            $('#noResultsRow').addClass('d-none');
        }
    }

    // Call the filter function when the search input changes
    $('#guildSearch').on('input', function () {
        var searchQuery = $(this).val();
        filterTable(searchQuery);
    });
}

function roomsTable() {
    $.ajax({
        url: '../actions/admin-side/get-overall-voicerooms.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                var roomsTable = $('#roomsTable');
                var tableHTML = `
                    <thead>
                        <tr>
                            <th></th>
                            <th>Room ID</th>
                            <th>Room Creator ID</th>
                            <th>Room Name</th>
                            <th>Guild Members</th>
                            <th>Room Status</th>
                            <th>Created At</th>
                            <th>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="noResultsRow" class="d-none">
                            <td colspan="8" class="text-center text-pink">No results found.</td>
                        </tr>
                `;

                if (response.rooms.length === 0) {
                    tableHTML += `
                        <tr>
                            <td colspan="8" class="text-center text-pink fw-semibold">There are currently no rooms to display.</td>
                        </tr>
                    `;
                } else {
                    response.rooms.forEach(function (room) {
                        var roomCreated = new Date(room.room_created_at);
                        var formattedDate = (roomCreated.getMonth() + 1) + '/' + roomCreated.getDate() + '/' + roomCreated.getFullYear();
                        
                        var count = room.members === "" ? 0 : room.members;

                        tableHTML += `
                            <tr>
                                <td class="align-middle"><input type="checkbox" class="room-checkbox" data-roomid="${room.room_id}"></td>
                                <td class="align-middle">${room.room_id}</td>
                                <td class="align-middle">${room.room_creator_id}</td>
                                <td class="align-middle">${room.room_name}</td>
                                <td class="align-middle">${count}</td>
                                <td class="align-middle text-capitalize">${room.room_status}</td>
                                <td class="align-middle">${formattedDate}</td>
                                <td class="align-middle" data-roomid="${room.room_id}">
                                    <button type="button" class="edit-room view-rooms" data-bs-toggle="modal" data-bs-target="#editRoom"><i class="bi bi-eye-fill"></i></button>
                                </td>
                            </tr>
                        `;
                    });
                }
                tableHTML += `
                    </tbody>
                `;
                roomsTable.html(tableHTML);
            }
        },
        error: function (xhr, status, error) {
            console.log("AJAX Error:", error);
        }
    });

    function filterTable(searchQuery) {
        var rows = $('#roomsTable tbody tr:not(#noResultsRow)');
        var lowerSearchQuery = searchQuery.toLowerCase();
        var anyMatch = false;

        rows.each(function () {
            var rowText = $(this).text().toLowerCase();
            if (rowText.indexOf(lowerSearchQuery) === -1) {
                $(this).addClass('d-none');
            } else {
                $(this).removeClass('d-none');
                anyMatch = true;
            }
        });

        // Show "No results" row if no matches
        if (!anyMatch) {
            $('#noResultsRow').removeClass('d-none');
        } else {
            $('#noResultsRow').addClass('d-none');
        }
    }

    // Call the filter function when the search input changes
    $('#roomSearch').on('input', function () {
        var searchQuery = $(this).val();
        filterTable(searchQuery);
    });
}

function reportsTable() {
    $.ajax({
        url: '../actions/admin-side/get-overall-reports.php',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                var reportsTable = $('#reportsTable');
                var tableHTML = `
                    <thead>
                        <tr>
                            <th></th>
                            <th>Report ID</th>
                            <th>User ID</th>
                            <th>Reported User</th>
                            <th>Reason</th>
                            <th>Account Status</th>
                            <th>Reported On</th>
                            <th>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="noResultsRow" class="d-none">
                            <td colspan="8" class="text-center text-pink">No results found.</td>
                        </tr>
                `;

                if (response.reports.length === 0) {
                    tableHTML += `
                        <tr>
                            <td colspan="8" class="text-center text-pink fw-semibold">There are currently no reports to display.</td>
                        </tr>
                    `;
                } else {
                    response.reports.forEach(function (report) {
                        var reportCreated = new Date(report.report_time);
                        var formattedDate = (reportCreated.getMonth() + 1) + '/' + reportCreated.getDate() + '/' + reportCreated.getFullYear();

                        tableHTML += `
                            <tr>
                                <td class="align-middle"><input type="checkbox" class="report-checkbox" data-reportid="${report.report_id}"></td>
                                <td class="align-middle">${report.report_id}</td>
                                <td class="align-middle">${report.reported_user_id}</td>
                                <td class="align-middle">
                                    <img src="../src/css/images/free-display-photos/${report.user_avatar}" class="avatar" alt="avatar">
                                    <span>${report.username}</span>
                                </td>
                                <td class="align-middle">${report.report_option}</td>
                                <td class="align-middle">${report.account_status}</td>
                                <td class="align-middle">${formattedDate}</td>
                                <td class="align-middle" data-reportid="${report.report_id}">
                                    <button type="button" class="edit-btn edit-report" data-bs-toggle="modal" data-bs-target="#editReport"><i class="bi bi-pencil-square"></i></i></button>
                                </td>
                            </tr>
                        `;
                    });
                }
                tableHTML += `
                    </tbody>
                `;

                reportsTable.html(tableHTML);
            }
        },
        error: function (xhr, status, error) {
            console.log("AJAX Error:", error);
        }
    });

    function filterTable(searchQuery) {
        var rows = $('#reportsTable tbody tr:not(#noResultsRow)');
        var lowerSearchQuery = searchQuery.toLowerCase();
        var anyMatch = false;

        rows.each(function () {
            var rowText = $(this).text().toLowerCase();
            if (rowText.indexOf(lowerSearchQuery) === -1) {
                $(this).addClass('d-none'); // Hide rows that don't match
            } else {
                $(this).removeClass('d-none'); // Show rows that match
                anyMatch = true;
            }
        });

        // Show "No results" row if no matches
        if (!anyMatch) {
            $('#noResultsRow').removeClass('d-none');
        } else {
            $('#noResultsRow').addClass('d-none');
        }
    }

    // Call the filter function when the search input changes
    $('#reportSearch').on('input', function () {
        var searchQuery = $(this).val();
        filterTable(searchQuery);
    });
}

function usersModal() {
    // Users
    $(document).on('click', '.edit-user', function () {
        var user_id = $(this).closest('.align-middle').attr('data-userid');
        $.ajax({
            url: '../actions/admin-side/get-users-information.php',
            method: 'POST',
            data: { user_id: user_id },
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    var editUserDialog = $('#editUserDialog');
                    var user = response.users[0];
                    var accountCreated = new Date(user.account_created);
                    var formattedDate = (accountCreated.getMonth() + 1) + '/' + accountCreated.getDate() + '/' + accountCreated.getFullYear();
                    var content = `
                        <div class="modal-content user-content" style="background-image: url(../src/css/images/free-cover-banner/${user.user_banner}">
                            <div class="modal-header">
                                <h1 class="modal-title text-pink fs-5">${user.username}</h1>
                                <button type="button" class="btn-close text-light" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body container-fluid">
                                <div class="row">
                                    <div class="col-sm-4 col-md-4 col-lg-4">
                                        <p class="text-pink m-0">ID</p>
                                        <input class="mb-4" id="userID" type="text" value="${user.user_id}" disabled="true">
                                    </div>
                                    <div class="col-sm-4 col-md-4 col-lg-4">
                                        <p class="text-pink m-0">Email</p>
                                        <input class="mb-4" type="text" value="${user.user_email}" disabled="true">
                                    </div>
                                    <div class="col-sm-4 col-md-4 col-lg-4">
                                        <p class="text-pink m-0">Username</p>
                                        <input class="mb-4" type="text" value="${user.username}" disabled="true">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="text-pink m-0">Password</p>
                                        <input class="mb-4" type="password" value="${user.user_password}" disabled="true">
                                    </div>
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="text-pink m-0">Created At</p>
                                        <input class="mb-4" type="text" value="${formattedDate}" disabled="true">
                                    </div>
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="text-pink m-0">User Availability</p>
                                        <input class="mb-4" type="text" value="${user.user_status}" disabled="true">
                                    </div>
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="text-pink m-0">Account Status</p>
                                        <input class="mb-4" id="userStatus" type="text" value="${user.account_status}" disabled="true">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col text-center">
                                        <select id="accountStatusSelect" class="form-select" aria-label="Default select example">
                                            <option selected>Edit Account Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Warning">Warning</option>
                                            <option value="Suspend">Suspend</option>
                                            <option value="Banned">Banned</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="modal-opt-btn" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="modal-opt-btn save-user">Save changes</button>
                            </div>
                        </div>
                    `;
                    if (editUserDialog.children().length > 0) {
                        editUserDialog.empty();
                    }
                    editUserDialog.append(content);
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });

    $(document).on('click', '.save-user', function () {
        var button = $(this);
        var modalContent = button.closest('.modal-content');
        var user_id = modalContent.find('#userID').val();
        var selected_status = $('#accountStatusSelect').val();

        $.ajax({
            url: '../actions/admin-side/admin-change-status.php',
            method: 'POST',
            data: { user_id: user_id,
                    selected_status: selected_status },
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    modalContent.find('.btn-close').prop('disabled', true);
                    modalContent.find('.modal-opt-btn').prop('disabled', true);

                    modalContent.find('#userStatus').val(selected_status);
                    modalContent.find('.modal-body').append('<p class="my-3 text-light text-center fw-semibold" id="successMessage">Change Successfully!</p>');
                    var successMessage = $('#successMessage');
                    successMessage.fadeOut(2800, function () {
                        location.reload();
                    });
                } else {
                    $('#errorMessage').remove();
                    modalContent.find('.modal-body').append('<p class="my-3 text-danger text-center fw-semibold" id="errorMessage">'+ response.message +'</p>');

                    var errorMessage = $('#errorMessage');
                    setTimeout(function () {
                        errorMessage.fadeOut(1000);
                    }, 2000);

                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });

    // Posts
    $(document).on('click', '.view-post', function () {
        var post_id = $(this).closest('.align-middle').attr('data-postid');
        $.ajax({
            url: '../actions/admin-side/get-posts-content.php',
            method: 'POST',
            data: { post_id: post_id },
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    var editPostDialog = $('#editPostDialog');
                    var post = response.posts[0];
                    var postCreated = new Date(post.user_posted_date);
                    var formattedDate = (postCreated.getMonth() + 1) + '/' + postCreated.getDate() + '/' + postCreated.getFullYear();
                    var content = `
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title text-pink fs-5">${post.username}</h1>
                                <button type="button" class="btn-close text-light" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body container-fluid">
                                <div class="row">
                                    <div class="col-sm-4 col-md-4 col-lg-4">
                                        <p class="text-pink m-0">User ID</p>
                                        <input class="mb-4" id="userID" type="text" value="${post.user_id}" disabled="true">
                                    </div>
                                    <div class="col-sm-4 col-md-4 col-lg-4">
                                        <p class="text-pink m-0">Post ID</p>
                                        <input class="mb-4" type="text" value="${post.user_content_id}" disabled="true">
                                    </div>
                                    <div class="col-sm-4 col-md-4 col-lg-4">
                                        <p class="text-pink m-0">Posted At</p>
                                        <input class="mb-4" type="text" value="${formattedDate}" disabled="true">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <div class="posted-feed">
                                            <div class="users-contents">
                                                <div class="user-info">
                                                    <img src="../src/css/images/free-display-photos/${post.user_avatar}" class="sm-avatar" alt="Avatar">
                                                    <p class="m-0 text-light fw-normal">${post.username}</p>
                                                </div>
                                                <div class="content">
                                                    <p class="user-post-content">${[post.user_content]}</p>
                                                    ${generateMediaHTML(post.media_upload, post.media_orientation)}
                                                    <h5 class="topic">Topic Discussed: ${post.user_topic}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    if (editPostDialog.children().length > 0) {
                        editPostDialog.empty();
                    }
                    editPostDialog.append(content);
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });

    // Reports
    $(document).on('click', '.edit-report', function () {
        var report_id = $(this).closest('.align-middle').attr('data-reportid');
        $.ajax({
            url: '../actions/admin-side/admin-report-user.php',
            method: 'POST',
            data: { report_id: report_id },
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    var editReportDialog = $('#editReportDialog');
                    var report = response.reports[0];
                    var reportCreated = new Date(report.report_time);
                    var formattedDate = (reportCreated.getMonth() + 1) + '/' + reportCreated.getDate() + '/' + reportCreated.getFullYear();
                    var content = `
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title text-pink fs-5">${report.username}</h1>
                                <button type="button" class="btn-close text-light" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body container-fluid">
                                <div class="row">
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="text-pink m-0">Report ID</p>
                                        <input class="mb-4" type="text" value="${report.report_id}" disabled="true">
                                    </div>
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="text-pink m-0">User ID</p>
                                        <input class="mb-4" id="userID" type="text" value="${report.reported_user_id}" disabled="true">
                                    </div>
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="text-pink m-0">Account Status</p>
                                        <input class="mb-4" id="userStatus" type="text" value="${report.account_status}" disabled="true">
                                    </div>
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="text-pink m-0">Reported On</p>
                                        <input class="mb-4" type="text" value="${formattedDate}" disabled="true">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col text-center">
                                        <select id="accountStatusSelect" class="form-select" aria-label="Default select example">
                                            <option selected>Edit Account Status</option>
                                            <option value="Active">Active</option>
                                            <option value="Warning">Warning</option>
                                            <option value="Suspend">Suspend</option>
                                            <option value="Banned">Banned</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="modal-opt-btn" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="modal-opt-btn save-user">Save changes</button>
                            </div>
                        </div>
                    `;
                    if (editReportDialog.children().length > 0) {
                        editReportDialog.empty();
                    }
                    editReportDialog.append(content);
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });

    // Guilds
    $(document).on('click', '.edit-guild', function () {
        var guild_id = $(this).closest('.align-middle').attr('data-guildid');
        $.ajax({
            url: '../actions/admin-side/admin-edit-guild.php',
            method: 'POST',
            data: { guild_id: guild_id },
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    var editGuildDialog = $('#editGuildDialog');
                    var guild = response.guilds[0];
                    var guildCreated = new Date(guild.guild_created_at);
                    var formattedDate = (guildCreated.getMonth() + 1) + '/' + guildCreated.getDate() + '/' + guildCreated.getFullYear();

                    var content = `
                        <div class="modal-content guild-content" style="background-image: url(../src/css/images/guilds-media/guild-banners/${guild.guild_banner}">
                            <div class="modal-header">
                                <h1 class="modal-title text-uppercase text-pink fs-5">
                                    <img src="../src/css/images/guilds-media/guild-logos/${guild.guild_logo}" class="me-3 guild-avatar" alt="avatar">
                                    ${guild.guild_name}
                                </h1>
                                <button type="button" class="btn-close text-light" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body container-fluid">
                                <div class="row">
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="m-0 text-pink">Guild ID</p>
                                        <input class="mb-4" type="text" value="${guild.guild_id}" disabled="true">
                                    </div>
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="m-0 text-pink">Creator ID</p>
                                        <input class="mb-4" id="userID" type="text" value="${guild.guild_creator_id}" disabled="true">
                                    </div>
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="m-0 text-pink">Guild Status</p>
                                        <input class="mb-4 text-capitalize" id="guildStatus" type="text" value="${guild.guild_status}" disabled="true">
                                    </div>
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="m-0 text-pink">Created At</p>
                                        <input class="mb-4" type="text" value="${formattedDate}" disabled="true">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col text-center">
                                        <p class="m-0 text-pink">Guild Description</p>
                                        <p>${guild.guild_description}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <table class="table text-center table-bordered">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Members ID</th>
                                                    <th scope="col">Members Username</th>
                                                </tr>
                                            </thead>
                                            <tbody id="membersTableBody"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="modal-opt-btn" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="modal-opt-btn save-user">Save changes</button>
                            </div>
                        </div>
                    `;
                    if (editGuildDialog.children().length > 0) {
                        editGuildDialog.empty();
                    }
                    editGuildDialog.append(content);

                    var memberRows = '';
                    var creatorRow = '';
                    guild.member_info.forEach(function (member) {
                        var membersTableBody = $('#membersTableBody');
                        creatorRow = `
                            <tr>
                                <td class="align-middle">${guild.guild_creator_id}</td>
                                <td class="align-middle">
                                    <img src="../src/css/images/free-display-photos/${guild.creator_avatar}" class="avatar" alt="avatar">
                                    <span>${guild.creator_name}</span>
                                </td>
                            </tr>
                        `;
                        memberRows += `
                            <tr>
                                <td class="align-middle">${member.user_id}</td>
                                <td class="align-middle">
                                    <img src="../src/css/images/free-display-photos/${member.user_avatar}" class="avatar" alt="avatar">
                                    <span>${member.username}</span>
                                </td>
                            </tr>
                        `;
                        membersTableBody.html(creatorRow + memberRows);
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });

    // Voice Rooms
    $(document).on('click', '.edit-room', function () {
        var room_id = $(this).closest('.align-middle').attr('data-roomid');
        $.ajax({
            url: '../actions/admin-side/admin-edit-voiceroom.php',
            method: 'POST',
            data: { room_id: room_id },
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    var editRoomDialog = $('#editRoomDialog');
                    var room = response.rooms[0];
                    var roomCreated = new Date(room.room_created);
                    var formattedDate = (roomCreated.getMonth() + 1) + '/' + roomCreated.getDate() + '/' + roomCreated.getFullYear();

                    var content = `
                        <div class="modal-content room-content">
                            <div class="modal-header">
                                <h1 class="modal-title text-uppercase text-pink fs-5">${room.room_name}</h1>
                                <button type="button" class="btn-close text-light" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body container-fluid">
                                <div class="row">
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="m-0 text-pink">Room ID</p>
                                        <input class="mb-4" type="text" value="${room.room_id}" disabled="true">
                                    </div>
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="m-0 text-pink">Room Creator ID</p>
                                        <input class="mb-4" id="userID" type="text" value="${room.room_creator_id}" disabled="true">
                                    </div>
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="m-0 text-pink">Room Status</p>
                                        <input class="mb-4 text-capitalize" id="roomStatus" type="text" value="${room.room_status}" disabled="true">
                                    </div>
                                    <div class="col-sm-3 col-md-3 col-lg-3">
                                        <p class="m-0 text-pink">Created At</p>
                                        <input class="mb-4" type="text" value="${formattedDate}" disabled="true">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <table class="table text-center table-bordered">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Members ID</th>
                                                    <th scope="col">Members Username</th>
                                                </tr>
                                            </thead>
                                            <tbody id="vmembersTableBody"></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    if (editRoomDialog.children().length > 0) {
                        editRoomDialog.empty();
                    }
                    editRoomDialog.append(content);

                    var vmembersTableBody = $('#vmembersTableBody');
                    var memberRows = '';
                    var creatorRow = `
                        <tr>
                            <td class="align-middle">${room.room_creator_id}</td>
                            <td class="align-middle">
                                <img src="../src/css/images/free-display-photos/${room.creator_avatar}" class="avatar" alt="avatar">
                                <span>${room.creator_name}</span>
                            </td>
                        </tr>
                    `;

                    room.member_info.forEach(function (member) {
                        memberRows += `
                            <tr>
                                <td class="align-middle">${member.user_id}</td>
                                <td class="align-middle">
                                    <img src="../src/css/images/free-display-photos/${member.user_avatar}" class="avatar" alt="avatar">
                                    <span>${member.username}</span>
                                </td>
                            </tr>
                        `;
                    });
                    vmembersTableBody.html(creatorRow + memberRows);
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });
}

function removeSelectedUsers() {
    var selectedUsers = [];
    var selectedUsersname = [];

    $('.user-checkbox:checked').each(function () {
        selectedUsers.push($(this).data('userid'));
        selectedUsersname.push($(this).data('username'));
    });

    $.ajax({
        url: '../actions/admin-side/admin-remove-selected-users.php',
        method: 'POST',
        data: { selected_users: selectedUsers,
                selected_usersname: selectedUsersname },
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                var modalBody = $('#modalRemovedData .modal-body p');
                modalBody.text("Selected users have been removed successfully.");
                $('#modalRemovedData').modal('show');

                setTimeout(function () {
                    location.reload();
                }, 2000);
            } else {
                alert("Failed to remove selected users.");
            }
        },
        error: function (xhr, status, error) {
            console.log("AJAX Error:", error);
        }
    });
}

function removeSelectedPosts() {
    var selectedPosts = [];

    $('.post-checkbox:checked').each(function () {
        selectedPosts.push($(this).data('postid'));
    });

    $.ajax({
        url: '../actions/admin-side/admin-remove-selected-posts.php',
        method: 'POST',
        data: { selected_posts: selectedPosts },
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                var modalBody = $('#modalRemovedData .modal-body p');
                modalBody.text("Selected posts have been removed successfully.");
                $('#modalRemovedData').modal('show');

                setTimeout(function () {
                    location.reload();
                }, 2000);
            } else {
                alert("Failed to remove selected posts.");
            }
        },
        error: function (xhr, status, error) {
            console.log("AJAX Error:", error);
        }
    });
}

function removeSelectedGuilds() {
    var selectedGuilds = [];

    $('.guild-checkbox:checked').each(function () {
        selectedGuilds.push($(this).data('guildid'));
    });

    $.ajax({
        url: '../actions/admin-side/admin-remove-selected-guilds.php',
        method: 'POST',
        data: { selected_guilds: selectedGuilds },
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                var modalBody = $('#modalRemovedData .modal-body p');
                modalBody.text("Selected guilds have been removed successfully.");
                $('#modalRemovedData').modal('show');

                setTimeout(function () {
                    location.reload();
                }, 2000);
            } else {
                alert("Failed to remove selected guilds.");
            }
        },
        error: function (xhr, status, error) {
            console.log("AJAX Error:", error);
        }
    });
}

function removeSelectedReports() {
    var selectedRepotrs = [];

    $('.report-checkbox:checked').each(function () {
        selectedRepotrs.push($(this).data('reportid'));
    });

    $.ajax({
        url: '../actions/admin-side/admin-remove-selected-reports.php',
        method: 'POST',
        data: { selected_reports: selectedRepotrs },
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                var modalBody = $('#modalRemovedData .modal-body p');
                modalBody.text("Selected reports have been removed successfully.");
                $('#modalRemovedData').modal('show');

                setTimeout(function () {
                    location.reload();
                }, 2000);
            } else {
                alert("Failed to remove selected reports.");
            }
        },
        error: function (xhr, status, error) {
            console.log("AJAX Error:", error);
        }
    });
}

function removeSelectedRooms() {
    var selectedRooms = [];

    $('.report-checkbox:checked').each(function () {
        selectedRooms.push($(this).data('roomid'));
    });

    $.ajax({
        url: '../actions/admin-side/admin-remove-selected-rooms.php',
        method: 'POST',
        data: { selected_rooms: selectedRooms },
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                var modalBody = $('#modalRemovedData .modal-body p');
                modalBody.text("Selected rooms have been removed successfully.");
                $('#modalRemovedData').modal('show');

                setTimeout(function () {
                    location.reload();
                }, 2000);
            } else {
                alert("Failed to remove selected rooms.");
            }
        },
        error: function (xhr, status, error) {
            console.log("AJAX Error:", error);
        }
    });
}

function removeSelectedData() {
    checkboxTable();
    removeSelectedButton();

    function checkboxTable() {
        // Users
        $(document).on('change', '.user-checkbox', function () {
            updateUserRemoveButtonVisibility();
        });

        // Posts
        $(document).on('change', '.post-checkbox', function () {
            updatePostRemoveButtonVisibility();
        });

        // Guilds
        $(document).on('change', '.guild-checkbox', function () {
            updateGuildRemoveButtonVisibility();
        });

        // Reports
        $(document).on('change', '.report-checkbox', function () {
            updateReportRemoveButtonVisibility();
        });

        // Voice Rooms
        $(document).on('change', '.room-checkbox', function () {
            updateRoomRemoveButtonVisibility();
        });
    }

    function removeSelectedButton() {
        // Users
        $(document).on('click', '#removeSelectedUsersButton', function () {
            removeSelectedUsers();
        });

        // Posts
        $(document).on('click', '#removeSelectedPostsButton', function () {
            removeSelectedPosts();
        });

        // Guilds
        $(document).on('click', '#removeSelectedGuildsButton', function () {
            removeSelectedGuilds();
        });
        
        // Reports
        $(document).on('click', '#removeSelectedReportsButton', function () {
            removeSelectedReports();
        });

        // Voice Rooms
        $(document).on('click', '#removeSelectedRoomsButton', function () {
            removeSelectedRooms();
        });
    }

    // Users
    function updateUserRemoveButtonVisibility() {
        var removeButton = $('.remove-selected-btn');
        var anyChecked = $('.user-checkbox:checked').length > 0;
    
        if (anyChecked) {
            removeButton.removeClass('d-none');
        } else {
            removeButton.addClass('d-none');
        }
    }

    // Posts
    function updatePostRemoveButtonVisibility() {
        var removeButton = $('.remove-selected-btn');
        var anyChecked = $('.post-checkbox:checked').length > 0;
    
        if (anyChecked) {
            removeButton.removeClass('d-none');
        } else {
            removeButton.addClass('d-none');
        }
    }

    // Guilds
    function updateGuildRemoveButtonVisibility() {
        var removeButton = $('.remove-selected-btn');
        var anyChecked = $('.guild-checkbox:checked').length > 0;
    
        if (anyChecked) {
            removeButton.removeClass('d-none');
        } else {
            removeButton.addClass('d-none');
        }
    }

    // Reports
    function updateReportRemoveButtonVisibility() {
        var removeButton = $('.remove-selected-btn');
        var anyChecked = $('.report-checkbox:checked').length > 0;
    
        if (anyChecked) {
            removeButton.removeClass('d-none');
        } else {
            removeButton.addClass('d-none');
        }
    }

    // Voice Rooms
    function updateRoomRemoveButtonVisibility() {
        var removeButton = $('.remove-selected-btn');
        var anyChecked = $('.room-checkbox:checked').length > 0;
    
        if (anyChecked) {
            removeButton.removeClass('d-none');
        } else {
            removeButton.addClass('d-none');
        }
    }
}

function removeAllData() {
    // Users
    $(document).on('click', '.remove-users-btn', function () {
        var modalContent = $(this).closest('.modal-content');
        $.ajax({
            url: '../actions/admin-side/admin-remove-all-users.php',
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    modalContent.find('p').html("All users have been removed successfully.").addClass('text-success fw-semibold text-center');

                    modalContent.fadeOut(3000, function () {
                        setTimeout(function () {
                            location.reload();
                        }, 500);
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    })

    // Posts
    $(document).on('click', '.remove-posts-btn', function () {
        var modalContent = $(this).closest('.modal-content');
        $.ajax({
            url: '../actions/admin-side/admin-remove-all-posts.php',
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    modalContent.find('p').html("All posts have been removed successfully.").addClass('text-success fw-semibold text-center');

                    modalContent.fadeOut(3000, function () {
                        setTimeout(function () {
                            location.reload();
                        }, 500);
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    })

    // Guilds
    $(document).on('click', '.remove-guilds-btn', function () {
        var modalContent = $(this).closest('.modal-content');
        $.ajax({
            url: '../actions/admin-side/admin-remove-all-guilds.php',
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    modalContent.find('p').html("All guilds have been removed successfully.").addClass('text-success fw-semibold text-center');

                    modalContent.fadeOut(3000, function () {
                        setTimeout(function () {
                            location.reload();
                        }, 500);
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    })

    // Voice Rooms
    $(document).on('click', '.remove-rooms-btn', function () {
        var modalContent = $(this).closest('.modal-content');
        $.ajax({
            url: '../actions/admin-side/admin-remove-all-rooms.php',
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    modalContent.find('p').html("All rooms have been removed successfully.").addClass('text-success fw-semibold text-center');

                    modalContent.fadeOut(3000, function () {
                        setTimeout(function () {
                            location.reload();
                        }, 500);
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    })

    // Reports
    $(document).on('click', '.remove-reports-btn', function () {
        var modalContent = $(this).closest('.modal-content');
        $.ajax({
            url: '../actions/admin-side/admin-remove-all-reports.php',
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    modalContent.find('p').html("All reports have been removed successfully.").addClass('text-success fw-semibold text-center');

                    modalContent.fadeOut(3000, function () {
                        setTimeout(function () {
                            location.reload();
                        }, 500);
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    })
}