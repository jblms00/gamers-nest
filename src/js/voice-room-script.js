$(document).ready(function () {
    // Voice Room Page
    displayVoiceRooms();
    loadGameTypes();
    createVoiceRoom();
    setupJoinRoomClick();
    userJoinRoom();
    searchVoiceRoom();

    // Profile Page
    goToCurrentUserPage();

    notifications();
    markReadNotification();
    clearNotification();
    acceptGuildRequest();
    
    setInterval(notifications, 30000);
    setInterval(displayVoiceRooms, 3000);
    setInterval(loadGameTypes, 3000);

    var ascending = true;
    $('.za-filter-vroom').click(function() {
        ascending = !ascending;
        var icon = $(this).find('i');
        icon.toggleClass('bi-sort-alpha-down-alt', ascending);
        icon.toggleClass('bi-sort-alpha-up-alt', !ascending);
        sortVoiceRooms(ascending);
    })

    
    $(document).on("click", ".filter-game", function() {
        var selectedGameType = $(this).data("game-type");
        filterRoomsByGameType(selectedGameType);
    });
});

function periodicallyUpdateData() {
    var url = window.location.href;
    var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);
    var current_user_id = $('.user-index').attr('data-userid');

    if (matchResult) {
        var guildName = matchResult[1];
        var guildId = matchResult[2];
        // Convert URL-encoded characters back to spaces in guildName
        guildName = decodeURIComponent(guildName);
    }

    $.ajax({
        url: "actions/get-updated-data.php",
        data: { current_user_id: current_user_id,
                guild_name: guildName,
                guild_id: guildId,
        },
        type: "POST",
        dataType: "json",
        success: function (response) {
            if (response.status === 'success') {
                console.log(response.message)
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

// View Profile
function goToCurrentUserPage() {
    $(document).on("click", "#userProfile", function (event) {
        var user_id = $(".user-index").attr("data-userid");

        var userProfileUrl = "/gamers-nest/user-profile-page.php?user_id=" + user_id;
        window.location.href = userProfileUrl;
    });
}

// User Notification
function notifications() {
    var user_id = $(".user-index").attr("data-userid");
    $.ajax({
        method: "POST",
        url: "actions/user-discussion-feed/get-user-notifications.php",
        data: {
            user_id: user_id
        },
        dataType: "json",
        success: function (response) {
            if (response.status === "success") {
                var notif = $("#notificationsDropdown");
                var notificationHTML = "";

                $.each(response.notifications, function (i, notification) {
                    var notificationType = "";

                    if (notification.activity_type === "like_post") {
                        notificationType = "likes your post.";
                    } else if (notification.activity_type === "like_sharedpost") {
                        notificationType = "likes your shared post.";
                    } else if (notification.activity_type === "share_post") {
                        notificationType = "shares your post.";
                    } else if (notification.activity_type === "comment_on_post") {
                        notificationType = "comments on your post.";
                    } else if (notification.activity_type === "comment_on_sharedpost") {
                        notificationType = "comments on your shared post.";
                    } else if (notification.activity_type === "send_message") {
                        notificationType = "sends you a message.";
                    } else if (notification.activity_type === "requested_to_join_guild") {
                        notificationType = "request to join the guild.";
                    } else if (notification.activity_type === "invited_to_guild") {
                        notificationType = "invites you to join the guild.";
                    } else if (notification.activity_type === "invite_guild_accepted") {
                        notificationType = "approved your request..";
                    } else if (notification.activity_type === "like_guild_post") {
                        notificationType = "likes your guild post.";
                    } else if (notification.activity_type === "comment_on_guild_post") {
                        notificationType = "comments on your guild post.";
                    } else if (notification.activity_type === "send_guild_message") {
                        notificationType = "sends a message on your guild.";
                    } else if (notification.activity_type === "warning_account_status") {
                        notificationType = "issued your account.";
                    } else if (notification.activity_type === "follows_you") {
                        notificationType = "follows you.";
                    }

                    var notificationClass = notification.is_read === "false" ? "unread-notif" : "";

                    if (notification.activity_type === "like_post" || notification.activity_type === "share_post") {
                        notificationHTML += `
							<li class="user-notification ${notificationClass}">
								<button type="button" class="dropdown-item notifs show-more-btn" data-bs-toggle="modal" data-bs-target="#viewPost" data-userpostid="${notification.sender_infos[0].user_content_id}">
									<div class="notif-content">
										<img src="src/css/images/free-display-photos/${notification.sender_infos[0].user_avatar}" class="display-photo" alt="">
										<p>${notification.sender_infos[0].username}<span class="notif-text">${notificationType}</span></p>
										<p class="notif-time">${notification.timestamp}</p>
									</div>
								</button>
								<div class="dropdown">
									<button class="notif-option-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
									<ul class="dropdown-menu notif-menu">
										<li><button type="button" data-notif-id="${notification.notification_id}" class="markread-notification dropdown-item">Mark as Read</button></li>
										<li><button type="button" data-notif-id="${notification.notification_id}" class="remove-notif dropdown-item">Remove Notification</button></li>
									</ul>
								</div>
							</li>
						`;
                    } else if (notification.activity_type === "comment_on_sharedpost" || notification.activity_type === "like_sharedpost") {
                        notificationHTML += `
							<li class="user-notification ${notificationClass}">
								<button type="button" class="dropdown-item notifs sharedpost-show-more" data-bs-toggle="modal" data-bs-target="#viewSharedPost" data-sharedpost-id="${notification.sender_infos[0].shared_post_id}">
									<div class="notif-content">
										<img src="src/css/images/free-display-photos/${notification.sender_infos[0].user_avatar}" class="display-photo" alt="">
										<p>${notification.sender_infos[0].username}<span class="notif-text">${notificationType}</span></p>
										<p class="notif-time">${notification.timestamp}</p>
									</div>
								</button>
								<div class="dropdown">
									<button class="notif-option-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
									<ul class="dropdown-menu notif-menu">
										<li><button type="button" data-notif-id="${notification.notification_id}" class="markread-notification dropdown-item">Mark as Read</button></li>
										<li><button type="button" data-notif-id="${notification.notification_id}" class="remove-notif dropdown-item">Remove Notification</button></li>
									</ul>
								</div>
							</li>
						`;
                    } else if (notification.activity_type === "send_message") {
                        notificationHTML += `
							<li class="user-notification ${notificationClass}">
								<a href="/gamers-nest/user-conversation-page.php?message=${notification.sender_infos[0].convo_room_id}" class="dropdown-item notifs" data-messageid="${notification.sender_infos[0].message_id}">
									<div class="notif-content">
										<img src="src/css/images/free-display-photos/${notification.sender_infos[0].user_avatar}" class="display-photo" alt="">
										<p>${notification.sender_infos[0].username}<span class="notif-text">${notificationType}</span></p>
										<p class="notif-time">${notification.timestamp}</p>
									</div>
								</a>
								<div class="dropdown">
									<button class="notif-option-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
									<ul class="dropdown-menu notif-menu">
										<li><button type="button" data-notif-id="${notification.notification_id}" class="markread-notification dropdown-item">Mark as Read</button></li>
										<li><button type="button" data-notif-id="${notification.notification_id}" class="remove-notif dropdown-item">Remove Notification</button></li>
									</ul>
								</div>
							</li>
						`;
                    } else if (notification.activity_type === "requested_to_join_guild" || notification.activity_type === "invited_to_guild") {
                        notificationHTML += `
                            <li class="user-notification ${notificationClass}">
                                <div class="dropdown-item notifs">
                                    <div class="notif-content">
                                        <img src="src/css/images/free-display-photos/${notification.sender_infos[0].user_avatar}" class="display-photo" alt="">
                                        <p>${notification.sender_infos[0].username}<span class="notif-text">${notificationType}</span></p>
                                        <p class="notif-time">${notification.timestamp}</p>
                                    </div>
                                    <div class="notif-group-btn text-center" role="group">
                                        <button type="button" class="j-btn" data-request-id="${notification.sender_infos[0].request_guild_id}">Join</button>
                                        <button type="button" class="r-btn">Remove</button>
                                    </div>
                                </div>
                                <div class="dropdown">
                                    <button class="notif-option-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
                                    <ul class="dropdown-menu notif-menu">
                                        <li><button type="button" data-notif-id="${notification.notification_id}" class="markread-notification dropdown-item">Mark as Read</button></li>
                                        <li><button type="button" data-notif-id="${notification.notification_id}" class="remove-notif dropdown-item">Remove Notification</button></li>
                                    </ul>
                                </div>
                            </li>
						`;
                    } else if (notification.activity_type === "invite_guild_accepted" || notification.activity_type === "send_guild_message") {
                        notificationHTML += `
							<li class="user-notification ${notificationClass}">
                                <a href="/gamers-nest/user-guild-page.php?/gn/${notification.sender_infos[0].guild_name}/id/${notification.sender_infos[0].guild_id}" class="dropdown-item notifs">
                                    <div class="dropdown-item notifs ps-0">
                                        <div class="notif-content">
                                            <img src="src/css/images/free-display-photos/${notification.sender_infos[0].user_avatar}" class="display-photo" alt="">
                                            <p>${notification.sender_infos[0].username}<span class="notif-text">${notificationType}</span></p>
                                            <p class="notif-time">${notification.timestamp}</p>
                                        </div>
                                    </div>
                                </a>
								<div class="dropdown">
									<button class="notif-option-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
									<ul class="dropdown-menu notif-menu">
										<li><button type="button" data-notif-id="${notification.notification_id}" class="markread-notification dropdown-item">Mark as Read</button></li>
										<li><button type="button" data-notif-id="${notification.notification_id}" class="remove-notif dropdown-item">Remove Notification</button></li>
									</ul>
								</div>
							</li>
						`;
                    } else if (notification.activity_type === "like_guild_post" || notification.activity_type === "comment_on_guild_post") {
                        notificationHTML += `
							<li class="user-notification ${notificationClass}">
                                <button type="button" class="dropdown-item notifs show-more-gpost-btn" data-bs-toggle="modal" data-bs-target="#viewGuildPost" data-userpostid="${notification.sender_infos[0].guild_post_id}">
                                    <div class="notif-content">
                                        <img src="src/css/images/free-display-photos/${notification.sender_infos[0].user_avatar}" class="display-photo" alt="">
                                        <p>${notification.sender_infos[0].username}<span class="notif-text">${notificationType}</span></p>
                                        <p class="notif-time">${notification.timestamp}</p>
                                    </div>
                                </button>
								<div class="dropdown">
									<button class="notif-option-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
									<ul class="dropdown-menu notif-menu">
										<li><button type="button" data-notif-id="${notification.notification_id}" class="markread-notification dropdown-item">Mark as Read</button></li>
										<li><button type="button" data-notif-id="${notification.notification_id}" class="remove-notif dropdown-item">Remove Notification</button></li>
									</ul>
								</div>
							</li>
						`;
                    } else if (notification.activity_type === "warning_account_status") {
                        notificationHTML += `
							<li class="user-notification ${notificationClass}">
                                <button type="button" class="dropdown-item notifs admin-msg-btn" data-bs-toggle="modal" data-bs-target="#adminMessage">
                                    <div class="notif-content">
                                        <img src="src/css/images/favicon.png" class="display-photo" alt="avatar">
                                        <p>Gamer's Nest<span class="notif-text">${notificationType}</span></p>
                                        <p class="notif-time">${notification.timestamp}</p>
                                    </div>
                                </button>
								<div class="dropdown">
									<button class="notif-option-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
									<ul class="dropdown-menu notif-menu">
										<li><button type="button" data-notif-id="${notification.notification_id}" class="markread-notification dropdown-item">Mark as Read</button></li>
										<li><button type="button" data-notif-id="${notification.notification_id}" class="remove-notif dropdown-item">Remove Notification</button></li>
									</ul>
								</div>
							</li>
						`;
                    } else if (notification.activity_type === "comment_on_post" || notification.activity_type === "comment_on_sharedpost") {
                        notificationHTML += `
							<li class="user-notification ${notificationClass}">
								<button type="button" class="dropdown-item notifs show-more-btn" data-bs-toggle="modal" data-bs-target="#viewPost" data-userpostid="${notification.sender_infos[0].user_content_id}">
									<div class="notif-content">
										<img src="src/css/images/free-display-photos/${notification.sender_infos[0].user_avatar}" class="display-photo" alt="">
										<p>${notification.sender_infos[0].username}<span class="notif-text">${notificationType}</span></p>
										<p class="notif-time">${notification.timestamp}</p>
									</div>
								</button>
								<div class="dropdown">
									<button class="notif-option-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
									<ul class="dropdown-menu notif-menu">
										<li><button type="button" data-notif-id="${notification.notification_id}" class="markread-notification dropdown-item">Mark as Read</button></li>
										<li><button type="button" data-notif-id="${notification.notification_id}" class="remove-notif dropdown-item">Remove Notification</button></li>
									</ul>
								</div>
							</li>
						`;
                    } else if (notification.activity_type === "follows_you") {
                        notificationHTML += `
							<li class="user-notification ${notificationClass}">
                                <div class="notif-content">
                                    <img src="src/css/images/free-display-photos/${notification.sender_infos[0].user_avatar}" class="display-photo" alt="">
                                    <p class="text-light">${notification.sender_infos[0].username}<span class="notif-text">${notificationType}</span></p>
                                    <p class="notif-time">${notification.timestamp}</p>
                                </div>
							</li>
						`;
                    } else {
                        notificationHTML += `
							<li class="user-notification ${notificationClass}">
								<div type="button" class="dropdown-item notifs">
									<div class="notif-content">
										<img src="src/css/images/free-display-photos/${notification.sender_infos[0].user_avatar}" class="display-photo" alt="">
										<p>${notification.sender_infos[0].username}<span class="notif-text">${notificationType}</span></p>
										<p class="notif-time">${notification.timestamp}</p>
									</div>
								</div>
								<div class="dropdown">
									<button class="notif-option-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
									<ul class="dropdown-menu notif-menu">
										<li><button type="button" data-notif-id="${notification.notification_id}" class="markread-notification dropdown-item">Mark as Read</button></li>
										<li><button type="button" data-notif-id="${notification.notification_id}" class="remove-notif dropdown-item">Remove Notification</button></li>
									</ul>
								</div>
							</li>
						`;
                    }
                });

                notif.html(notificationHTML);
            } else {
                $("#notificationsDropdown").css({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                });

                $("#notificationsDropdown").html('<li><p class="no-notifications">No notifications</p></li>');
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

// Mark as Read Notification
function markReadNotification() {
    // Mark All as Read
    $(document).on("click", "#markReadNotif", function (event) {
        event.stopPropagation();
        var userid = $(".user-index").attr("data-userid");
        $.ajax({
            url: "actions/user-discussion-feed/mark-read-all-notification.php",
            method: "POST",
            data: {
                userid: userid
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    $(".user-notification.unread-notif").removeClass("unread-notif");
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    });

    // Mark as Read
    $(document).on("click", ".markread-notification", function (event) {
        event.stopPropagation();
        var userid = $(".user-index").attr("data-userid");
        var notification_id = $(this).attr("data-notif-id");

        $.ajax({
            url: "actions/user-discussion-feed/mark-read-notification.php",
            method: "POST",
            data: {
                userid: userid,
                notification_id: notification_id
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    $(event.target).closest(".user-notification").removeClass("unread-notif");
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    });
}

// Clear and Remove Notification/s
function clearNotification() {
    // Clear All Notifications
    $(document).on("click", "#clearNotif", function (event) {
        event.preventDefault();
        var user_id = $(".user-index").attr("data-userid");

        $.ajax({
            url: "actions/user-discussion-feed/user-clear-notification.php",
            method: "POST",
            data: {
                user_id: user_id
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    // Clear the notifications list
                    $("#notificationsDropdown").empty();

                    // Optionally, you can add a visual effect
                    $("#notificationsDropdown").fadeOut(500, function () {
                        $(this).html('<li><p class="no-notifications">No notifications</p></li>').fadeIn(600);
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    });

    // Remove Notification
    $(document).on("click", ".remove-notif", function (event) {
        event.preventDefault();
        var user_id = $(".user-index").attr("data-userid");
        var notification_id = $(this).attr("data-notif-id");
        var notificationElement = $(this).closest(".user-notification");

        $.ajax({
            url: "actions/user-discussion-feed/user-remove-notification.php",
            method: "POST",
            data: {
                user_id: user_id,
                notification_id: notification_id
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    notificationElement.fadeOut(500, function () {
                        $(this).remove();
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    });
}

function acceptGuildRequest() {
    // On notification
    $(document).on('click', '.j-btn', function (event) {
        event.preventDefault();
        var current_user_id = $('.user-index').attr('data-userid');
        var request_guild_id = $(this).attr('data-request-id');
        var joinButton = $(this);

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/user-accept-guild-request.php",
            data: {
                current_user_id: current_user_id,
                request_guild_id: request_guild_id
            },
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    console.log(response.request_guild_id);
                    var notifTextElement = joinButton.closest('.notifs').find('.notif-text');
                    notifTextElement.addClass("ms-2").removeClass("notif-text");
                    joinButton.closest('.notif-group-btn').find('.j-btn, .r-btn').remove();
                    notifTextElement.text("joined the guild!");
                    // Fade out and remove the notification after 3 seconds
                    setTimeout(function () {
                        notifTextElement.closest('.user-notification').fadeOut('slow', function () {
                            notifTextElement.closest('.user-notification').remove();
                        });
                    }, 3000);
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });
}

// Display All Voice Rooms
function displayVoiceRooms() {
    $.ajax({
        url: "actions/user-voice-room/get-rooms.php",
        type: "POST",
        dataType: "json",
        success: function (response) {
            var roomFeeds = $("#roomFeeds");
            roomFeeds.empty();
            if (response.status === 'success') {
                var rooms = response.rooms;
                $.each(rooms, function (i, room) {
                    var roomCoverImg = '';

                    if (room.room_coverImg !== 'default-vrom-cover.jpg') {
                        roomCoverImg = `<img src="src/css/images/voiceRoom-cover/${room.room_coverImg}" class="defaulVroom-img" alt="${room.room_name}">`;
                    } else {
                        roomCoverImg = `<img src="src/css/images/${room.room_coverImg}" class="defaulVroom-img" alt="${room.room_name}">`;
                    }

                    var roomColumn = `
                        <div class="users-room" data-game-type="${room.room_gameType}">
                            <div class="room-img">
                                ${roomCoverImg}
                            </div>
                            <div class="room-info">
                                <h5 class="room-name text-uppercase">${room.room_name}</h5>
                                <p class="text-color room-gameType">Game Type: ${room.room_gameType}</p>
                                <p class="text-color room-id">Room ID: ${room.room_id}</p>
                                <p class="mb-2">${room.member_count}/5 members</p>
                                <button type="button" id="join-btn" class="inside-room join-room" data-vroom-id="${room.room_id}">Join Room</button>
                            </div>
                        </div>
                    `;
                    roomFeeds.append(roomColumn);
                });
            } else {
                roomFeeds.append('<p class="mt-5 fw-semibold display-error">'+ response.message +'</p>');
            }
        },
    });
}

// Filter by Game Type
function filterRoomsByGameType(gameType) {
    var roomColumns = $(".users-room");
    if (gameType === "All") {
        roomColumns.show(); // Show all rooms if "All" game type is selected
    } else {
        roomColumns.hide(); // Hide all rooms
        roomColumns.filter(`[data-game-type="${gameType}"]`).show(); // Show rooms with the selected game type
    }
}

// Search Voice Room
function filterVoiceRooms(searchQuery) {
    var roomColumns = $(".users-room");

    roomColumns.each(function () {
        var roomName = $(this).find('.room-name').text().toLowerCase();
        var roomId = $(this).find('.room-id').text().toLowerCase();
        var gameType = $(this).find('.room-gameType').text().toLowerCase();

        if (
            roomId.includes(searchQuery) ||
            roomName.includes(searchQuery) ||
            gameType.includes(searchQuery)
        ) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

// Sort Voice Rooms [A-z or Z-A]
function sortVoiceRooms(ascending) {
    var roomFeeds = $('#roomFeeds');
    var roomColumns = roomFeeds.find('.users-room');
    roomColumns.sort(function(a, b) {
        var roomNameA = $(a).find('.room-name').text().toUpperCase();
        var roomNameB = $(b).find('.room-name').text().toUpperCase();

        if (ascending) {
            return (roomNameA < roomNameB) ? -1 : (roomNameA > roomNameB) ? 1 : 0;
        } else {
            return (roomNameA > roomNameB) ? -1 : (roomNameA < roomNameB) ? 1 : 0;
        }
    });
    roomColumns.detach().appendTo(roomFeeds);
}

function loadGameTypes() {
    $.ajax({
        url: "actions/user-voice-room/get-game-types.php", // Change the URL to your actual API endpoint
        type: "GET",
        dataType: "json",
        success: function(response) {
            var filterGameType = $("#filter-game-type");
            filterGameType.empty();
            if (response.status === "success") {
                var gameTypes = response.gameTypes;
                $.each(gameTypes, function(i, gameType) {
                    var listItem = `
                        <li><button type="button" class="dropdown-item filter-game" data-game-type="${gameType}">${gameType}</button></li>
                    `;

                    filterGameType.append(listItem);
                });
            } else {
                filterGameType.append("<li>No game types available.</li>");
            }
        },
        error: function(xhr, status, error) {
            console.log(error);
        }
    });
}

function searchVoiceRoom() {
    $(document).on("input", "#searchVoiceRooms", function () {
        var searchQuery = $(this).val().trim().toLowerCase();
        filterVoiceRooms(searchQuery);
    });
}

// Create Voice Room
function createVoiceRoom() {
    // Open Modal
    $(document).on('click', '.croom-btn', function () {
        var createVRoomDialog = $('#createVRoomDialog');
        var modalDialog = `
            <div class="modal-content modal-vroom">
                <form id="roomContentForm" method="POST">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Create Voice Room</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col">
                                <p>Room name:</p>
                                <input type="text" autocomplete="off" id="room_name" class="mb-3">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <p>Game Type:</p>
                                <input type="text" autocomplete="off" id="room_gameType" class="mb-3">
                            </div>
                        </div>
                        <div class="customVroom-img">
                            <img id="room_coverImgPreview" src="src/css/images/default-vrom-cover.jpg"
                                class="defaulVroom-img" alt="Image">
                            <div class="change-vroomImg">
                                <p>Upload Photo</p>
                                <input type="file" id="room_coverImg" accept="image/*">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="cancelBtn" class="modalVroom-btn"
                            data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" id="createRoomBtn" class="modalVroom-btn">Create</button>
                    </div>
                </form>
            </div>
        `;
        if (createVRoomDialog.children().length > 0) {
            createVRoomDialog.empty();
        }
        createVRoomDialog.append(modalDialog);

        // Function to handle file selection for room cover image
        $("#room_coverImg").change(function () {
            var file = this.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#room_coverImgPreview").attr("src", e.target.result);
            };
            reader.readAsDataURL(file);
        });
    });

    // On Submit
    $(document).on('submit', '#roomContentForm', function (event) {
        event.preventDefault();
        var form = $(this);
        var user_id = $('.user-index').attr('data-userid');
        var roomName = $("#room_name").val();
        var gameType = $("#room_gameType").val();
        var room_coverImg = $("#room_coverImg")[0].files[0];
        var formData = new FormData();

        formData.append("user_id", user_id);
        formData.append("room_name", roomName);
        formData.append("room_gameType", gameType);
        formData.append("user_id", user_id);
        formData.append("room_coverImg", room_coverImg);

        $.ajax({
            method: "POST",
            url: "actions/user-voice-room/user-create-room.php",
            data: formData,
            dataType: "json",
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.status === "success") {
                    var roomFeeds = $("#roomFeeds");
                    var roomHTML = `
                        <div class="users-room" data-game-type="${gameType}">
                            <div class="room-img">
                                <img src="${response.filePath}" class="defaulVroom-img" alt="Image">
                            </div>
                            <div class="room-info">
                                <h5 class="room-name text-uppercase">${roomName}</h5>
                                <p class="text-color room-gameType">Game Type: ${gameType}</p>
                                <p class="text-color room-id">Room ID: ${response.room_id}</p>
                                <p class="mb-2">/5 members</p>
                                <a class="inside-room" href="user-vroom-inside-page.php?roomid=${response.room_id}">Join Room</a>
                            </div>
                        </div>
                    `;
                    roomFeeds.prepend(roomHTML);

                    $("#room_name").val("");
                    $("#room_gameType").val("");
                    $("#room_coverImg").val("");

                    $("#room_name").removeAttr("disabled", "disabled");
                    $("#room_gameType").removeAttr("disabled", "disabled");
                    $("#room_coverImg").removeAttr("disabled", "disabled");
                    $("#room_coverImgPreview").attr("src","src/css/images/default-vrom-cover.jpg");

                    $("#createVoiceRoom").modal("hide");

                    var createdRoomUrl = "/gamers-nest/user-vroom-inside-page.php?roomid=" + response.room_id;
                    window.location.href = createdRoomUrl;
                } else {
                    form.find('.text-danger').remove();
                    var errorMessage = $('<p class="text-danger fw-semibold text-center">' + response.message + '</p>')
                        .hide()
                        .appendTo(form.find('.modal-body'))
                        .fadeIn();

                    setTimeout(function () {
                        errorMessage.fadeOut('slow', function () {
                            errorMessage.remove();
                        });
                    }, 3000);
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });
}

function setupJoinRoomClick() {
    $(document).on('click', '#joinRoom', function () {
        var current_user_id = $('.user-index').attr('data-userid');
        $(".display-error").hide();

        $.ajax({
            url: "actions/user-voice-room/auto-join-check-available-rooms.php",
            data: { current_user_id: current_user_id },
            type: "POST",
            dataType: "json",
            success: function (response) {
                // Handle the response from the server
                if (response.status === "success") {
                    $("#timerDisplay").show();
                    startQueueTimer(response.voice_room_id);
                } else {
                    $("#timerDisplay").show();
                    $(".display-error").hide();
                    joinQueue(response.message);
                }
            },
        });
    });

    function joinQueue(message) {
        var errorMessage = $('<p class="mt-5 fw-semibold display-error">' + message + '</p>');
        $("#timerDisplay").html(errorMessage);

        // Fade out the error message after 2 seconds
        setTimeout(function () {
            errorMessage.fadeOut();
        }, 1500);
    }
}

function startQueueTimer(voice_room_id) {
    var timerSeconds = 1; // Change this to the desired starting duration in seconds
    var timerDisplay = $("#timerDisplay"); // Update with the ID of the timer display element

    // Update the timer display initially
    timerDisplay.text(formatTime(timerSeconds));

    // Start the countdown timer
    var countdown = setInterval(function () {
        timerSeconds++;
        timerDisplay.text(formatTime(timerSeconds));

        // Check if the timer has reached 10 seconds
        if (timerSeconds === 10) {
            clearInterval(countdown);
            // Perform actions to enter the room after the timer expires
            $("#timerDisplay").text("Entering the room...");
            setTimeout(function () {
                enterRoom(voice_room_id); // Pass the roomId to enterRoom
            }, 3000);
        }
    }, 1000); // Change the interval to 1000 milliseconds (1 second)

    function enterRoom(voice_room_id) {
        window.location.href ="/gamers-nest/user-vroom-inside-page.php?roomid=" + voice_room_id;
    }
}

// Function to format the time as "0:01", "0:02", "0:03", etc.
function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return padZero(minutes) + ":" + padZero(remainingSeconds);

    // Function to add leading zero to single-digit numbers
    function padZero(number) {
        return (number < 10 ? "0" : "") + number;
    }
}

function userJoinRoom() {
    $(document).on('click', '.join-room', function () {

        var current_user_id = $('.user-index').attr('data-userid');
        var voice_room_id = $(this).attr('data-vroom-id');

        $.ajax({
            method: "POST",
            url: "actions/user-voice-room/user-join-room.php",
            data: { current_user_id: current_user_id, 
                    voice_room_id: voice_room_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var roomPageURL = "/gamers-nest/user-vroom-inside-page.php?roomid=" + response.voice_room_id;
                    window.location.href = roomPageURL;
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });
}

// Note: 

// 2. Settings Page [make it a modal or another page]
//      a. Change email [?]
//      b. Activity Log [?]

// 3. Voice Room
//      b. Realtime voice room [call only]

// 4. Landing Page
//      a. Add the top guilds

// CSS - Make it a responsive for mobile, tablet, laptop, desktop, etc.
