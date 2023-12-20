$(document).ready(function () {
    // Profile Page
    goToCurrentUserPage();

    notifications();
    markReadNotification();
    clearNotification();
    acceptGuildRequest();

    loadRoom();
    userLeaveRoom();
});

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

// Inside Room
function loadRoom() {
    var url = window.location.href;
    var matchResult = url.match(/roomid=(\d+)/);
    var room_id = matchResult[1];

    $.ajax({
        method: "POST",
        url: "actions/user-voice-room/get-room-details.php",
        data: { room_id: room_id, },
        dataType: "json",
        success: function (response) {
            var container = $('#voiceRoomContainer');
            if (response.status === 'success') {
                var ri = response.room_informations[0];

                if (ri.room_logo !== 'default-vrom-cover.jpg') {
                    var roomCoverImg = `src/css/images/voiceRoom-cover/${ri.room_logo}`;
                } else {
                    var roomCoverImg = `src/css/images/${ri.room_logo}`;
                }

                var roomInfo = {
                    logo: roomCoverImg,
                    name: ri.room_name,
                    gametype: ri.room_gameType,
                    id: room_id
                };

                $('#voiceRoomDetails .voice-room-image').attr('src', roomInfo.logo);
                $('#voiceRoomDetails .voice-room-name').text(roomInfo.name);
                $('#voiceRoomDetails .voice-game-type').text(roomInfo.gametype);
                $('#voiceRoomDetails .voice-room-id').text(roomInfo.id);
                $("#stream-controls .btn-leave").attr('data-vroom-id', roomInfo.id);

            }
        },
        error: function (xhr, status, error) {
            console.log("AJAX Error:", error);
        }
    });

}

// User left the room
function userLeaveRoom() {
    $(document).on('click', '#stream-controls .btn-leave', function () {
        var current_user_id = $('.user-index').attr('data-userid');
        var voice_room_id = $(this).attr('data-vroom-id');

        $.ajax({
            method: "POST",
            url: "actions/user-voice-room/user-left-room.php",
            data: {
                current_user_id: current_user_id,
                voice_room_id: voice_room_id,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {;
                    setTimeout(function () {
                        var voiceRoomPage = "/gamers-nest/user-vroom-page.php";
                        window.location.href = voiceRoomPage;
                    }, 500);
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