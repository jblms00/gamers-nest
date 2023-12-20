$(document).ready(function () {
    goToCurrentUserPage();

    notifications();
    markReadNotification();
    clearNotification();
    acceptGuildRequest();

    viewLoadUserGuild();
    editGuildProfile();
    modalMemberOption();
    modalInviteMembers();
    loadGuildMembers();
    guildPosts();
    loadGuildPosts();
    likeGuildPostButton();
    guildPostsComments();
    guildConversation();
    loadGuildConversation();
    reportUser();
    userSettings();
    leaveGuild();

    setInterval(notifications, 30000);
    setInterval(loadGuildConversation, 3000);
    setInterval(loadGuildPosts, 3000);
    setInterval(loadGuildMembers, 3000);
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
    $(document).on("click", "#userProfile", function () {
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

// View Guild Content
function viewLoadUserGuild() {
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
        method: "POST",
        url: "actions/user-guilds-page/users-guild.php",
        data: {
            guild_id: guildId,
            guild_name: guildName
        },
        type: "POST",
        dataType: "json",
        success: function (response) {
            var mainGuildFeed = $('#mainGuildFeed');
            var guildInformation = $('#guildInformation');
            var guildConversation = $('#guildConversation');

            if (response.status === "success" && response.guild_informations.length > 0) {
                var guild = response.guild_informations[0];
                
                // Check if the current user is part of users_ids
                var usersIds = guild.users_ids.split(",");
                var isCurrentUserMember = usersIds.includes(current_user_id);

                if (current_user_id === guild.guild_creator_id) { 
                    // Guild Owner
                    var guildBannerHTML = `
                        <div class="banner" id="guildInformation" style="background-image: url(src/css/images/guilds-media/guild-banners/${guild.guild_banner}">
                            <div class="guild-logo">
                                <img src="src/css/images/guilds-media/guild-logos/${guild.guild_logo}" alt="${guild.guild_logo}">
                            </div>
                            <div class="guild-info">
                                <h2 class="text-uppercase">${guild.guild_name}</h2>
                                <p>${guild.guild_description}</p>
                                <button type="button" class="guild-btn edit-guild-btn" data-bs-toggle="modal" data-bs-target="#editGuildInformation">
                                    <i class="bi bi-pencil-square"></i>
                                    <label class="ms-3 p-1">Edit Guild</label>
                                </button>
                                <button type="button" class="guild-btn guild-members" data-bs-toggle="modal" data-bs-target="#allGuildMembers">
                                    <i class="bi bi-people-fill"></i>
                                    <label class="ms-3 p-1">Guild Members</label>
                                </button>
                                <button type="button" class="guild-btn guild-members leave-guild-btn" data-bs-toggle="modal" data-bs-target="#leaveGuild" data-user-id="${guild.guild_creator_id}" data-guild-id="${guild.guild_id}">
                                    <i class="bi bi-door-open-fill"></i>
                                    <label class="ms-3 p-1">Disband</label>
                                </button>
                            </div>
                        </div>
                        <div class="post-input mt-4">
                            <button type="button" class="btn gpost-btn" data-bs-toggle="modal" data-bs-target="#guildPost">
                                Share something ${guild.logged_in_username}
                            </button>
                        </div>
                        <div class="guild-feeds" id="guildpostFeeds">
                            <!-- Display all member posts here -->
                        </div>
                    `;
                    mainGuildFeed.append(guildBannerHTML);
                    
                    var guildConversationHTML = `
                        <div class="gmember-messages" id="memberMessages" data-guild-convoid=${guild.guild_convo_room_id}></div>
                        <form method="POST" id="guildConversationForm">
                            <div class="text-area" data-gconvo-roomid="${guild.guild_convo_room_id}">
                                <input type="text" placeholder="Aa" id="usergMessageInput" autocomplete="off">
                                <button type="button" class="gmsg-submit mx-2"><i class="bi bi-send-fill"></i></button>
                            </div>
                        </form>
                    `;
                    guildConversation.append(guildConversationHTML);
                } else if (isCurrentUserMember) {
                    // Guild Members
                    var guildBannerHTML = `
                        <div class="banner" id="guildInformation" style="background-image: url(src/css/images/guilds-media/guild-banners/${guild.guild_banner}">
                            <div class="guild-logo">
                                <img src="src/css/images/guilds-media/guild-logos/${guild.guild_logo}" alt="${guild.guild_logo}">
                            </div>
                            <div class="guild-info">
                                <h2 class="text-uppercase">${guild.guild_name}</h2>
                                <p>${guild.guild_description}</p>
                                <button type="button" class="guild-btn guild-members leave-guild-btn" data-bs-toggle="modal" data-bs-target="#leaveGuild" data-user-id="${guild.guild_creator_id}" data-guild-id="${guild.guild_id}">
                                    <i class="bi bi-door-open-fill"></i>
                                    <label class="ms-3 p-1">Leave Guild</label>
                                </button>
                            </div>
                        </div>
                        <div class="post-input mt-4">
                            <button type="button" class="btn gpost-btn" data-bs-toggle="modal" data-bs-target="#guildPost">
                                Share something ${guild.logged_in_username}
                            </button>
                        </div>
                        <div class="guild-feeds" id="guildpostFeeds">
                            <!-- Display all member posts here -->
                        </div>
                    `;
                    mainGuildFeed.append(guildBannerHTML);

                    var guildConversationHTML = `
                        <div class="gmember-messages" id="memberMessages" data-guild-convoid=${guild.guild_convo_room_id}></div>
                        <form method="POST" id="guildConversationForm">
                            <div class="text-area" data-gconvo-roomid="${guild.guild_convo_room_id}">
                                <input type="text" placeholder="Aa" id="usergMessageInput" autocomplete="off">
                                <button type="button" class="gmsg-submit mx-2"><i class="bi bi-send-fill"></i></button>
                            </div>
                        </form>
                    `;
                    guildConversation.append(guildConversationHTML);
                } else {
                    // Display error message if the current user is not a member
                    guildInformation.html("<p>You are not a member of this guild.</p>");
                }
            } else {
                guildInformation.html("<p>No guild information available.</p>");
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        },
    });
}

// Edit Guild
function editGuildProfile() {
    // Open Modal
    $(document).on('click', '.edit-guild-btn', function () {
        var url = window.location.href;
        var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);

        if (matchResult) {
            var guildName = matchResult[1];
            var guildId = matchResult[2];
            // Convert URL-encoded characters back to spaces in guildName
            guildName = decodeURIComponent(guildName);
        }

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/get-user-guild-information.php",
            data: {
                guild_id: guildId,
                guild_name: guildName
            },
            type: "POST",
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    var editGuildDialog = $('#editGuildDialog');
                    var guild_data = response.guild_datas[0];
                    var trimmedDescription = guild_data.guild_description.replace(/^\s+|\s+$/g, '');

                    var modalHTML = `
                        <div class="modal-content">
                            <form id="editGuildForm" class="edit-guild-form" enctype="multipart/form-data">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5">Edit Guild</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body container-fluid">
                                    <div class="row">
                                        <div class="col">
                                            <p class="mb-0">Edit Guild Name:</p>
                                            <input type="text"  id="guildName"class="mb-3" value="${guild_data.guild_name}" placeholder="Enter new guild name" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <p class="mb-0">Edit Guild Description:</p>
                                            <textarea type="text" id="guildDescription" class="mb-3" cols="40" rows="4" placeholder="Enter your new guild description (at least 30 words)" autocomplete="off">${trimmedDescription}</textarea>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6">
                                            <p class="mb-0">Edit Guild Banner:</p>
                                            <input class="visually-hidden" type="file" id="guildBannerInput" accept="image/*">
                                            <div class="guild-banner-preview">
                                                <label for="guildBannerInput" class="upload-button">
                                                    <img class="g-banner" id="guildBannerPreview" src="src/css/images/guilds-media/guild-banners/${guild_data.guild_banner}" alt="${guild_data.guild_banner}">
                                                </label>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <p class="mb-0">Edit Guild Logo:</p>
                                            <input class="visually-hidden" type="file" id="guildLogoInput" accept="image/*">
                                            <div class="guild-logo-preview mt-4">
                                                <label for="guildLogoInput" class="upload-button">
                                                    <img class="g-logo" id="guildLogoPreview" src="src/css/images/guilds-media/guild-logos/${guild_data.guild_logo}" alt="${guild_data.guild_logo}">
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="modal-opt-btn" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" class="modal-opt-btn">Save changes</button>
                                </div>
                            </form>
                        </div>
                    `;

                    if (editGuildDialog.children().length > 0) {
                        editGuildDialog.empty();
                    }
                    editGuildDialog.append(modalHTML);

                    // Handle Guild Banner image input change
                    $('#guildBannerInput').on('change', function () {
                        var fileInput = this;
                        if (fileInput.files && fileInput.files[0]) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                $('#guildBannerPreview').attr('src', e.target.result);
                            };
                            reader.readAsDataURL(fileInput.files[0]);
                        }
                    });

                    // Handle Guild Logo image input change
                    $('#guildLogoInput').on('change', function () {
                        var fileInput = this;
                        if (fileInput.files && fileInput.files[0]) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                $('#guildLogoPreview').attr('src', e.target.result);
                            };
                            reader.readAsDataURL(fileInput.files[0]);
                        }
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });

    // Edit Form
    $(document).on('submit', '#editGuildForm', function (event) {
        event.preventDefault();
        var current_user_id = $('.user-index').attr('data-userid');
        var url = window.location.href;
        var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);
    
        if (matchResult) {
            var guildName = matchResult[1];
            var guildId = matchResult[2];
            // Convert URL-encoded characters back to spaces in guildName
            guildName = decodeURIComponent(guildName);
        }

        var current_guild_name = $('#guildName').val();
        var current_guild_description = $('#guildDescription').val();
        var current_guild_banner = $('#guildBannerInput')[0].files[0];
        var current_guild_logo = $('#guildLogoInput')[0].files[0];
    
        var formData = new FormData();
        formData.append('current_user_id', current_user_id);
        formData.append('guild_id', guildId);
        formData.append('current_guild_name', current_guild_name);
        formData.append('current_guild_description', current_guild_description);
        formData.append('current_guild_banner', current_guild_banner);
        formData.append('current_guild_logo', current_guild_logo);

        var modal = $(this).closest('#editGuildDialog');

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/user-edit-guild.php",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    modal.removeClass('modal-lg').addClass('modal-dialog-centered');
                    // Remove modal-body and modal-footer
                    modal.find('.modal-header .modal-title').remove();
                    modal.find('.modal-header .btn-close').remove();
                    modal.find('.modal-body .row').remove();
                    modal.find('.modal-footer .modal-opt-btn').remove();

                    var message = "<p class='mt-2 mb-2 text-center text-success fw-bold'>Guild successfully updated.</p>";
                    modal.find('.modal-body').append(message);

                    setTimeout(function () {
                        modal.find('.modal-body p').fadeOut(1000, function () {
                            // Replace the message with "Wait a moment"
                            var waitMessage = "<p class='mt-2 mb-2 text-center'>Please wait a moment...</p>";
                            modal.find('.modal-body').append(waitMessage);
                            // Reload the page after another 3 seconds
                            setTimeout(function () {
                                var userGuildPage = "/gamers-nest/user-guild-page.php?/gn/" + response.new_guild_name + "/id/" + response.guild_id;
                                window.location.href = userGuildPage;
                            }, 3000);
                        });
                    }, 3000);
                } else {
                    var errorMessage = "<p class='mb-0 text-danger text-center fw-bold error-msg'>" + response.message + "</p>";
                    modal.find('.modal-body').prepend(errorMessage);
                    setTimeout(function () {
                        modal.find('.modal-body .error-msg').fadeOut(1000, function () {
                            // Remove the error message after fading out
                            $(this).remove();
                        });
                    }, 3000);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });
}

// Members -- Invite Members -- Guild Request
function modalMemberOption() {
    // Open Modal
    $(document).on('click', '.guild-members', function () {
        var url = window.location.href;
        var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);

        if (matchResult) {
            var guildName = matchResult[1];
            var guildId = matchResult[2];
            // Convert URL-encoded characters back to spaces in guildName
            guildName = decodeURIComponent(guildName);
        }

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/get-user-guild-information.php",
            data: {
                guild_id: guildId,
                guild_name: guildName
            },
            type: "POST",
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var guild = response.guild_datas[0];
                    var guildMembersDialog = $('#guildMembersDialog');
                    var memberHTML = '';

                    if (guild.guild_members.length === 1 && guild.guild_members[0] === "" && guild.users_ids.length === 1 && guild.users_ids[0] === "") {
                        memberHTML = `<p class="text-danger text-center fw-bold">No guild members</p>`;
                    } else {
                        // Iterate through each guild member and add a list item
                        guild.guild_members.forEach(function (member, i) {
                            var memberUserId = guild.users_ids[i];
                            var guild_user_avatar = guild.guild_member_avatars[i];
                            memberHTML += `
                                <li>
                                    <div class="guild-member-info">
                                        <img src="src/css/images/free-display-photos/${guild_user_avatar}" class="bi sidebar-dp me-2" alt="Avatar">
                                        <label>${member}</label>
                                    </div>
                                    <button class="remove-member-btn" data-member-id=${memberUserId}>
                                        <i class="fs-5 bi bi-person-x-fill"></i>
                                    </button>
                                </li>
                            `;
                        });
                    }

                    var modalHTML = `
                        <div class="modal-content members-modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5">Guild Members</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="button-group">
                                    <button type="button" class="guild-btn member-request-btn" data-bs-toggle="modal" data-bs-target="#guildPendingRequest">
                                        <i class="bi bi-people-fill"></i>
                                        <label class="me-1 p-1">Member Request</label>
                                        <span>${guild.request_count}</span>
                                    </button>
                                    <button type="button" class="guild-btn invite-members-btn" data-bs-toggle="modal" data-bs-target="#inviteMembers">
                                        <i class="bi bi-person-plus-fill"></i>
                                        <label class="me-1 p-1">Invite Members</label>
                                    </button>
                                </div>
                                <div class="mt-5">
                                    <ul>${memberHTML}</ul>
                                </div>
                            </div>
                        </div>
                    `;
                    if (guildMembersDialog.children().length > 0) {
                        guildMembersDialog.empty();
                    }
                    guildMembersDialog.append(modalHTML);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });

    // Open Modal - Request to join guild
    $(document).on('click', '.member-request-btn', function () {
        loadlRequest();
        var memberRequestDialog = $('#memberRequestDialog');
        var modalHTML = `
            <div class="modal-content request-guild-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Guild Pending Request</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul id="modalbodyGuildRequest">
                        <!-- Display HTML Elements here -->
                    </ul>
                </div>
            </div>
        `;
        if (memberRequestDialog.children().length > 0) {
            memberRequestDialog.empty();
        }
        memberRequestDialog.append(modalHTML);
    });

    $(document).on('click', '.remove-member-btn', function () {
        var guild_owner_id = $('.user-index').attr('data-userid');
        var guild_member_id = $(this).attr('data-member-id');
        var url = window.location.href;
        var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);

        removeButton = $(this);

        if (matchResult) {
            var guildName = matchResult[1];
            var guildId = matchResult[2];
            // Convert URL-encoded characters back to spaces in guildName
            guildName = decodeURIComponent(guildName);
        }

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/user-remove-member.php",
            data: {
                guild_owner_id: guild_owner_id,
                guild_member_id: guild_member_id,
                guild_id: guildId,
                guild_name: guildName
            },
            type: "POST",
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    var listItem = removeButton.closest('li');
                    listItem.fadeOut(500, function() {
                        var messageElement = $('<div class="mt-2 mb-2 text-danger text-center fw-bold">Guild member removed</div>');
                        $(this).closest('.members-modal-content li').replaceWith(messageElement);
                        messageElement.fadeOut(2000, function() {
                            messageElement.remove();
                        });
                        listItem.remove();
                        setTimeout(function () {
                            var userGuildPage = "/gamers-nest/user-guild-page.php?/gn/" + guildName + "/id/" + guildId;
                            window.location.href = userGuildPage;
                        }, 2000);
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });

    function loadlRequest() {
        // Load Users Request
        var url = window.location.href;
        var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);

        if (matchResult) {
            var guildName = matchResult[1];
            var guildId = matchResult[2];
            // Convert URL-encoded characters back to spaces in guildName
            guildName = decodeURIComponent(guildName);
        }
    
        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/get-users-guild-request.php",
            data: {
                guild_id: guildId,
                guild_name: guildName
            },
            type: "POST",
            dataType: "json",
            success: function (response) {
                var modalbodyGuildRequest = $('#modalbodyGuildRequest');
                if (response.status === 'success') {
                    var users = response.users;
                    modalbodyGuildRequest.empty();
                    $.each(users, function (i, user) {
                        var liHTML = `
                            <li class="guild-request-list">
                                <div class="req-user-info">
                                    <img src="src/css/images/free-display-photos/${user.user_avatar}" class="sidebar-dp me-2" alt="${user.user_avatar}">
                                    <label>${user.username}</label>
                                </div>
                                <div class="accept-member">
                                    <button class="confirm-request"><i class="bi bi-check-lg"></i></button>
                                </div>
                            </li>
                        `;
                        modalbodyGuildRequest.append(liHTML);
                    });
                } else {
                    modalbodyGuildRequest.html("<p class='text-center fw-bold'>No pending request.</p>");
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    }
}

function loadGuildMembers() {
    var url = window.location.href;
    var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);

    if (matchResult) {
        var guildName = matchResult[1];
        var guildId = matchResult[2];
        // Convert URL-encoded characters back to spaces in guildName
        guildName = decodeURIComponent(guildName);
    }

    $.ajax({
        method: "POST",
        url: "actions/user-guilds-page/get-user-guild-information.php",
        data: {
            guild_id: guildId,
            guild_name: guildName
        },
        type: "POST",
        dataType: "json",
        success: function (response) {
            var guildMembers = $('#guildMembers');
            guildMembers.empty();
            if (response.status === "success") {
                var guild = response.guild_datas[0];

                if (guild.guild_members.length === 1 && guild.guild_members[0] === "" && guild.users_ids.length === 1 && guild.users_ids[0] === "") {
                    guildMembers.append("<p class='mt-5 text-center'>You don't have a guild members.</p>");
                } else {
                    // Iterate through each guild member and add a list item
                    guild.guild_members.forEach(function (member, i) {
                        var guild_user_avatar = guild.guild_member_avatars[i];
                        var guild_member_status = guild.guild_member_status[i];
                        var status = '';
                        if (guild_member_status === 'Online') {
                            status = "status-online";
                        } else {
                            status = "status-offline";
                        }
                        var memberHTML = `
                            <li>
                                <div class="guild-member-info">
                                    <img src="src/css/images/free-display-photos/${guild_user_avatar}" class="bi sidebar-dp" alt="Avatar">
                                    <label class="${status} link-underline-success">${member}</label>
                                </div>
                            </li>
                        `;
                        guildMembers.append(memberHTML);
                    });

                    var creatorStatus = '';
                    if (guild.creator_user_status === 'Online') {
                        creatorStatus = "status-online";
                    } else {
                        creatorStatus = "status-offline";
                    }
                    var guildCreatorHTML = `
                        <li>
                            <div class="guild-member-info">
                                <img src="src/css/images/free-display-photos/${guild.creator_user_avatar}" class="bi sidebar-dp" alt="Avatar">
                                <label class="${creatorStatus} link-underline-success">${guild.creator_username}</label>
                            </div>
                        </li>
                    `;
                    guildMembers.prepend(guildCreatorHTML);
                }
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        },
    });
}

// Guild Owner Invite Members
function modalInviteMembers() {
    // Open Modal
    $(document).on('click', '.invite-members-btn', function () {
        guildMemberSuggestions();
        var inviteMembersDialog = $('#inviteMembersDialog');
        var modalHTML = `
            <div class="modal-content invite-content">
                <form method="POST" id="memberInviteForm">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Invite Members</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body container-fluid">
                        <div class="row">
                            <div class="col">
                                <input type="text" id="inviteMember" placeholder="Invite people" autocomplete="off">
                                <ul id="memberSuggestions" class="member-suggestions" style="display: none;"></ul>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="modal-opt-btn" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="modal-opt-btn">Send Invites</button>
                    </div>
                </form>
            </div>
        `;
        if (inviteMembersDialog.children().length > 0) {
            inviteMembersDialog.empty();
        }
        inviteMembersDialog.append(modalHTML);
    });

    // Send invites
    $(document).on("submit", "#memberInviteForm", function (event) {
        event.preventDefault();
        var current_user_id = $('.user-index').attr('data-userid');
        var invitedMember = $('#inviteMember').val();
        var url = window.location.href;
        var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);

        if (matchResult) {
            var guildId = matchResult[2];
        }
        $('#inviteMembersDialog .display-error').remove();

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/user-invite-members.php",
            data: {
                current_user_id: current_user_id,
                guild_members: invitedMember,
                guild_id: guildId
            },
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    var errorDisplay = `
                        <div class="row">
                            <div class="col">
                                <p class="mb-4 mt-5 display-success text-center">Invite sent!</p>
                            </div>
                        </div>
                    `;
                    $('#inviteMembersDialog .modal-body').append(errorDisplay);
                    $('#inviteMembersDialog .display-success').delay(3000).fadeOut(500, function () {
                        $('#inviteMembers').modal('hide');
                        $(this).remove();
                    });
                } else {
                    var errorDisplay = `
                        <div class="row">
                            <div class="col">
                                <p class="mb-4 mt-5 display-error text-center">${response.message}</p>
                            </div>
                        </div>
                    `;
                    $('#inviteMembersDialog .modal-body').append(errorDisplay);
                    $('#inviteMembersDialog .display-error').delay(3000).fadeOut(500, function () {
                        $(this).remove();
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });

    // Suggestions
    function guildMemberSuggestions() {
        // Show suggestions when clicking on #guildMembers input
        $(document).on("click", "#inviteMember", function (event) {
            event.stopPropagation();
            var current_user_id = $('.user-index').attr('data-userid');
    
            $.ajax({
                method: "POST",
                url: "actions/user-guilds-page/user-get-member-suggestions.php",
                data: { current_user_id: current_user_id },
                dataType: "json",
                success: function (response) {
                    if (response.status === 'success') {
                        var suggestedMembers = response.follower_details;
    
                        var suggestionsList = $("#memberSuggestions");
                        suggestionsList.empty();
    
                        for (var i = 0; i < suggestedMembers.length; i++) {
                            var suggestedMember = suggestedMembers[i];
    
                            var listHTML = `
                                <li class="guild-member">
                                    <button>
                                        <img src="src/css/images/free-display-photos/${suggestedMember.user_avatar}" class="sidebar-dp me-2" alt="${suggestedMember.user_avatar}">
                                        <label>${suggestedMember.username}</label>
                                    </button>
                                </li>
                            `;
                            suggestionsList.append(listHTML);
                        }
                        suggestionsList.show();
                    }
                },
                error: function (xhr, status, error) {
                    console.log("AJAX Error:", error);
                }
            });
        });
    
        // Hide suggestions when clicking outside the input
        $(document).click(function (event) {
            var suggestionsList = $("#memberSuggestions");
            if (!event.target.matches("#guildMembers")) {
                suggestionsList.hide();
            }
        });
    
        // Add selected suggestion to the input when clicking on it
        $(document).on("click", "#memberSuggestions li", function (event) {
            event.preventDefault();
            var selectedSuggestion = $(this).text().trim();
            var inviteMembersInput = $("#inviteMember");
            var currentMembers = inviteMembersInput.val().split(",").map(member => member.trim());
    
            // Check if the suggestion is not already present and if there's room for more suggestions
            if (!currentMembers.includes(selectedSuggestion) && currentMembers.length <= 5) {
                if (inviteMembersInput.val().trim() !== '') {
                    inviteMembersInput.val(inviteMembersInput.val().trim() + ", " + selectedSuggestion);
                } else {
                    inviteMembersInput.val(selectedSuggestion);
                }
            }
            $("#memberSuggestions").hide();
        });
    }
}

// User Accept Guild Request
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

// Post on Guild
function guildPosts() {
    // Open Modal
    $(document).on('click', '.gpost-btn', function () {
        var guildPostDialog = $('#guildPostDialog');
        var modalContent = `
            <div class="modal-content modal-post-input">
                <form id="postGuildContentForm" enctype="multipart/form-data">
                    <div class="modal-header">
                        <h1 class="modal-title fs-3">Share Something</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="input-data">
                            <textarea id="userContent" cols="30" rows="5" placeholder="Write something you want to share." required></textarea>
                            <div id="mediaPreviewContainer" class="preview-container mb-4"></div>
                            <div class="buttons">
                                <div class="upload-btn">
                                    <label for="mediaUploads" class="upload-button">
                                        <i class="bi bi-images"></i>
                                    </label>
                                    <input type="file" class="form-control visually-hidden" id="mediaUploads"
                                        accept="image/jpeg, image/jpg, image/png, video/mp4, video/webm, video/mov"
                                        multiple>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-create-post">Post</button>
                    </div>
                </form>
            </div>
        `;

        if (guildPostDialog.children().length > 0) {
            guildPostDialog.empty();
        }
        guildPostDialog.append(modalContent);
        handleFileInput();
    });

    // On form submit
    $(document).on('submit', '#postGuildContentForm', function (event) {
        event.preventDefault();
        var url = window.location.href;
        var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);
    
        if (matchResult) {
            var guildName = matchResult[1];
            var guildId = matchResult[2];
        }

        var current_user_id = $('.user-index').attr('data-userid');
        var mediaFiles = $("#mediaUploads")[0].files;
        var maxImageFiles = 2;
        var maxVideoFiles = 1;
        var imageFilesCount = 0;
        var videoFilesCount = 0;
    
        var userContent = $("#userContent").val();
        var formData = new FormData();
        formData.append("user_content", userContent);
        formData.append("current_user_id", current_user_id);
        formData.append("guild_id", guildId);
    
        for (var i = 0; i < mediaFiles.length; i++) {
            var fileType = mediaFiles[i].type.split("/")[0];
            if (fileType === "image") {
                imageFilesCount++;
                if (imageFilesCount > maxImageFiles) {
                    console.log("Error: Maximum number of images exceeded.");
                    return;
                }
            } else if (fileType === "video") {
                videoFilesCount++;
                if (videoFilesCount > maxVideoFiles) {
                    console.log("Error: Maximum number of videos exceeded.");
                    return;
                }
            }
            formData.append("media[]", mediaFiles[i]);
        }

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/user-post-on-guild.php",
            data: formData,
            dataType: "json",
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.status === 'success') {
                    var mediaNames = response.media_names;
                    var mediaOrientations = response.media_orientation;
                    var mediaHTML = "";

                    if (fileType === "image") {
                        // Check if mediaFiles length is greater than 0
                        if (mediaNames.length > 0) {
                            // Check if there are exactly 2 media files uploaded
                            if (mediaNames.length === 2) {
                                var media1 = mediaNames[0];
                                var media2 = mediaNames[1];
                                mediaHTML = `
									<div class="upload-media">
										<img src="/gamers-nest/src/css/guild_media_uploads/${media1}" class="uploaded-media ${mediaOrientations[0]}" alt="${media1}">
										<img src="/gamers-nest/src/css/guild_media_uploads/${media2}" class="uploaded-media ${mediaOrientations[1]}" alt="${media2}">
									</div>
								`;
                            } else if (mediaNames.length === 1) {
                                var media = mediaNames[0];
                                mediaHTML = `
									<div class="upload-media">
										<img src="/gamers-nest/src/css/guild_media_uploads/${media}" class="uploaded-media ${mediaOrientations[0]}" alt="${media}">
									</div>
								`;
                            }
                        }
                    } else if (fileType === "video") {
                        var media = mediaNames[0];
                        var fileExtension = media.split(".").pop().toLowerCase();
                        mediaHTML = `
							<div class="upload-media">
								<video controls preload="metadata" class="uploaded-media ${mediaOrientations[0]}">
									<source src="/gamers-nest/src/css/guild_media_uploads/${media}" type="video/${fileExtension}">
									Your browser does not support the video tag.
								</video>
							</div>
						`;
                    }

                    var guildpostFeeds = $("#guildpostFeeds");

                    var postHTML = `
                        <div class="posted-feed">
                            <div class="users-contents">
                                <div class="user-info">
                                    <img src="src/css/images/free-display-photos/${response.user_avatar}" class="sm-avatar" alt="Avatar">
                                    <p>${response.username}</p>
                                    <div class="dropdown menu-btn">
                                        <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-three-dots"></i>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li><button type="submit" class="dropdown-item menu-option">Delete</button></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="content">
                                    <p class="user-post-content">${userContent}</p>
                                    ${mediaHTML}
                                </div>
                            </div>
                            <div class="social-buttons guild-sbtn">
                                <button class="like-btn" type="submit" data-likepost-id="" data-content-id="${response.guild_post_id}" data-author-id="${response.user_id}"><i class="bi bi-hand-thumbs-up-fill"> <span class="like-count"></span></i></button>
                                <button class="comment-btn"><i class="bi bi-chat-square-text-fill"></i></button>
                            </div>
                            <div class="comment-section" data-post-userid="${response.guild_post_id}" data-current-userid="${response.user_id}">
                                <div class="row">
                                    <div class="col">
                                        <div class="comment-txtfld" data-postuser-id="${response.user_id}" data-guildpost-id="${response.guild_post_id}">
                                            <img src="src/css/images/free-display-photos/${response.user_avatar}" class="sm-avatar comment-avatar" alt="${response.user_avatar}">
                                            <form id="commentGuildForm" method="POST" class="comment-form all-comment-form" >
                                                <input type="text" class="input-comment" id="userComment" placeholder="Write your comment here..." autocomplete="off" required>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    guildpostFeeds.prepend(postHTML);

                    $("#userContent").val("");
                    $("#mediaInput").val("");
                    $("#previewContainer").empty();
                    $("#userContent").removeAttr("disabled", "disabled");
                    $("#guildPost").modal("hide");
                    $(".display-error").hide();
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });

    // Image/Video Preview for Posting
    function handleFileInput() {
        $("#mediaUploads").change(function (event) {
            var files = event.target.files;
            var mediaPreviewContainer = $("#mediaPreviewContainer");
            mediaPreviewContainer.empty();
    
            for (var i = 0; i < Math.min(files.length, 2); i++) {
                var file = files[i];
                var fileType = file.type;
    
                if (fileType.startsWith("image/")) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = new Image();
                        img.onload = function () {
                            var imgClass = this.naturalWidth > this.naturalHeight ? "landscape" : "portrait";
                            $(img).addClass(imgClass);
                            mediaPreviewContainer.append(img);
                        };
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                } else if (fileType.startsWith("video/")) {
                    var video = document.createElement("video");
                    video.controls = true;
                    video.preload = "metadata";
    
                    var source = document.createElement("source");
                    source.src = URL.createObjectURL(file);
                    video.appendChild(source);
    
                    mediaPreviewContainer.append(video);
                }
            }
        });
    }
}

// Load posts in guild page
function loadGuildPosts() {
    var current_user_id = $(".user-index").attr("data-userid");
    var url = window.location.href;
    var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);

    if (matchResult) {
        var guildName = matchResult[1];
        var guildId = matchResult[2];
        guildName = decodeURIComponent(guildName);
    }

    $.ajax({
        url: "actions/user-guilds-page/get-guild-posts-comments.php",
        data: {
            user_id: current_user_id,
            guild_id: guildId,
            guild_name: guildName
        },
        type: "POST",
        dataType: "json",
        success: function (response) {
            var posts = response.posts;
            var guildpostFeeds = $("#guildpostFeeds");
            var displayError = $(".display-error");

            if (response.no_post === 0) {
                guildpostFeeds.empty();
                guildpostFeeds.html('<p class="display-error">No guild posts.</p>');
            } else {
                displayError.hide();
                guildpostFeeds.empty();
                $.each(posts, function (i, post) {
                    var author_info = post.users_information[0];

                    var postOptions = "";
                    if (current_user_id === post.user_id) {
                        postOptions = `
							<ul class="dropdown-menu">
								<li><button type="button" class="dropdown-item delete-gpost" data-content-id="${post.guild_post_id}" data-author-id="${post.current_user_id}">Delete</button></li>
							</ul>
						`;
                    } else {
                        postOptions = `
							<ul class="dropdown-menu">
								<li><button type="button" id="reportUserButton" class="dropdown-item menu-option modal-report" data-bs-toggle="modal" data-bs-target="#reportUser" data-reported-id="${author_info.author_user_id}" data-reportedname="${author_info.author_username}">Report</button></li>
							</ul>
						`;
                    }

                    var likePost = "";
                    var likeBtnClass = post.liked_by_user ? "already-like-btn" : "like-btn";
                    likePost = `
                        <button class="${likeBtnClass}" type="button" data-likepost-id="${post.likepost_id}" data-content-id="${post.guild_post_id}" data-author-id="${post.user_id}">
                            <i class="bi bi-hand-thumbs-up-fill"> 
                                <span class="like-count">${post.likes}</span>
                            </i>
                        </button>
                        `;

                    var postColumn = `
						<div class="posted-feed">
							<div class="users-contents">
								<div class="user-info">
									<img src="src/css/images/free-display-photos/${author_info.author_user_avatar}" class="sm-avatar" alt="${author_info.author_user_avatar}">
                                    <a class="text-decoration-none" href="user-profile-page.php?user_id=${author_info.author_user_id}"><p>${author_info.author_username}</p></a>
									<div class="dropdown menu-btn">
										<button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
											<i class="bi bi-three-dots"></i>
										</button>
										${postOptions}
									</div>
								</div>
								<div class="content">
									<p class="user-post-content">${post.user_posted_content}</p>
									${generateMediaHTML(post.media_upload, post.media_orientation)}
								</div>
							</div>
							<div class="social-buttons guild-sbtn">
								${likePost}
								<button class="comment-btn"><i class="bi bi-chat-square-text-fill"></i></button>
							</div>
							<div class="comment-section" id="userComments">
								<!-- Display comments using a loop -->
								${getGuildCommentsHtml(post.comments)}
								<div class="row">
									<div class="col">
										<div class="comment-txtfld" data-postuser-id="${post.user_id}" data-guildpost-id="${post.guild_post_id}">
											<img src="src/css/images/free-display-photos/${post.current_user_avatar}" class="sm-avatar comment-avatar" alt="${post.current_user_avatar}">
											<form id="commentGuildForm" method="POST" class="comment-form all-comment-form">
												<input type="text" id="userComment" class="input-comment" placeholder="Write your comment here..." autocomplete="off" required>
											</form>
										</div>
									</div>
								</div>
							</div>
						</div>
					`;

                    guildpostFeeds.append(postColumn);
                });
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });

    // Get Media
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
                            mediaHTML += '<img src="/gamers-nest/src/css/guild_media_uploads/' + mediaUrl + '" class="uploaded-media ' + orientation + '" alt='+ mediaUrl +'>';
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
                        mediaHTML += '<img src="/gamers-nest/src/css/guild_media_uploads/' + mediaUrl + '" class="uploaded-media ' + orientation + '" alt='+ mediaUrl +'>';
                        mediaHTML += "</div>";
                    } else if (mediaFile === "mp4" || mediaFile === "mov" ||mediaFile === "avi") {
                        // Video file
                        mediaHTML += '<div class="upload-media">';
                        mediaHTML += '<video controls class="uploaded-media ' + orientation + '"><source src="/gamers-nest/src/css/guild_media_uploads/' + mediaUrl + '" type="video/' + mediaFile + '">Your browser does not support the video tag.</video>';
                        mediaHTML += "</div>";
                    }
                }
            }
        }
        return mediaHTML;
    }

    // Display comments
    function getGuildCommentsHtml(comments) {
        getUsersGuildPostOnModal();
        var current_user_id = $('.user-index').attr('data-userid');
        var commentsHtml = "";
        var commentCount = 0;
        var showMoreButton = false;

        $.each(comments, function (i, comment) {
            if (commentCount < 3) {
                var postOptions = "";
                if (current_user_id === comment.commenter_id) {
                    postOptions = `
                        <ul class="dropdown-menu">
                            <li><button type="submit" class="dropdown-item menu-option delete-gcomment" data-current-id="${current_user_id}">Delete</button></li>
                        </ul>
                    `;
                } else {
                    postOptions = `
                        <ul class="dropdown-menu">
                            <li><button type="submit" class="dropdown-item menu-option" data-current-id="${current_user_id}">Report</button></li>
                        </ul>
                    `;
                }
                var commentHtml = `
                    <div class="row">
                        <div class="col">
                            <div class="comment-txtfld" data-gcomment-id="${comment.comment_id}" tdata-postuser-id="${comment.commenter_id}" data-guildpost-id="${comment.guild_post_id}">
                                <img src="src/css/images/free-display-photos/${comment.commenter_user_avatar}" class="sm-avatar comment-avatar" alt="${comment.commenter_user_avatar}">
                                <div class="comment-content">
                                    <a class="users-name text-decoration-none" href="user-profile-page.php?user_id=${comment.commenter_id}"><p>${comment.commenter_username}</p></a>
                                    <p class="users-comment">${comment.comment_text}</p>
                                </div>
                                <div class="dropdown">
                                    <button class="delete-comment-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="bi bi-three-dots"></i> 
                                    </button>
                                    ${postOptions}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                commentsHtml += commentHtml;
            } else {
                post_id = comment.guild_post_id;
                showMoreButton = true;
                return false;
            }
            commentCount++;
        });

        if (showMoreButton) {
            commentsHtml += `
                <div class="row">
                    <div class="col">
                        <div class="show-more-comments">
                            <button class="show-more-gpost-btn smore-btn" type="button" data-bs-toggle="modal" data-bs-target="#viewGuildPost" data-userpostid="${post_id}">Show More</button>
                        </div>
                    </div>
                </div>
            `;
        }
        return commentsHtml;
    }
}

// Display and get guild post on modal
function getUsersGuildPostOnModal() {
    $(document).on("click", ".show-more-gpost-btn", function () {
        var userpostid = $(this).attr("data-userpostid");
        $.ajax({
            url: "actions/user-guilds-page/get-modal-gpost-content.php",
            method: "POST",
            data: {
                guild_post_id: userpostid
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var post = response.posts[0];
                    var modalUserGuildPost = $("#modalUserGuildPost");
                    var commentsHtml = "";
                    
                    for (var i = 0; i < post.comments.length; i++) {
                        var comment = post.comments[i];
                        var commentOptions = "";
                        if (post.current_user_id === comment.commenter_id) {
                            commentOptions = `
								<ul class="dropdown-menu">
									<li><button type="button" class="dropdown-item menu-option delete-gcomment">Delete</button></li>
								</ul>
							`;
                        } else {
                            commentOptions = `
								<ul class="dropdown-menu">
									<li><button type="submit" class="dropdown-item menu-option">Report</button></li>
								</ul>
							`;
                        }
                        var commentHtml = `
							<div class="row">
								<div class="col">
									<div class="comment-txtfld" data-gcomment-id="${comment.comment_id}" data-postuser-id="${comment.commenter_id}" data-guildpost-id="${comment.guild_post_id}">
										<img src="src/css/images/free-display-photos/${comment.commenter_user_avatar}" class="sm-avatar comment-avatar" alt="${comment.commenter_user_avatar}">
										<div class="comment-content">
                                            <a class="users-name text-decoration-none" href="user-profile-page.php?user_id=${comment.commenter_id}"><p>${comment.commenter_username}</p></a>
											<p class="users-comment">${comment.comment_text}</p>
										</div>
										<div class="dropdown">
											<button class="delete-comment-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
												<i class="bi bi-three-dots"></i> 
											</button>
											${commentOptions}
										</div>
									</div>
								</div>
							</div>
						`;
                        commentsHtml += commentHtml;
                    }

                    var likePost = "";
                    var likeBtnClass = post.liked_by_user ? "already-like-btn" : "like-btn";
                    likePost = `
						<button class="${likeBtnClass}" type="submit" data-content-id="${post.content_id}" data-user-id="${post.user_id}">
							<i class="bi bi-hand-thumbs-up-fill"> 
								<span class="like-count">${post.likes}</span>
							</i>
						</button>
					`;

                    var userpostHTML = `
						<div class="modal-content">
							<div class="modal-header">
								<h1 class="modal-title fs-5" id="users_name">${post.author_username}'s Guild Post</h1>
								<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div class="modal-body">
								<div class="container-fluid" id="users-post">
									<div class="row">
										<div class="col">
											<div class="users-info">
												<img src="src/css/images/free-display-photos/${post.author_user_avatar}" class="sm-avatar" alt="${post.author_user_avatar}">
												<a class="text-light text-decoration-none" href="user-profile-page.php?user_id=${post.author_user_id}"><p>${post.author_username}</p></a>
											</div>
											<div class="user-content">
												<p class="users-post">${post.user_posted_content}</p>
											</div>
											<div class="social-buttons guild-sbtn">
												${likePost}
												<button class="comment-btn"><i class="bi bi-chat-square-text-fill"></i></button>
											</div>
											<div class="comment-section" id="userComments">
											${commentsHtml} <!-- Display the generated comments HTML -->
												<div class="row">
													<div class="col">
														<div class="comment-txtfld" data-postuser-id="${post.current_user_id}" data-guildpost-id="${post.guild_post_id}">
															<img src="src/css/images/free-display-photos/${post.current_user_avatar}" class="sm-avatar comment-avatar" alt="${post.current_user_avatar}" id="usersuser_avatar">
															<form id="commentGuildForm" method="POST" class="comment-form all-comment-form">
                                                                <input type="text" id="userComment" class="input-comment" placeholder="Write your comment here..." autocomplete="off" required>
                                                            </form>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					`;
                    // Check if modal already exists
                    if (modalUserGuildPost.children().length > 0) {
                        modalUserGuildPost.empty();
                    }
                    modalUserGuildPost.append(userpostHTML);
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.log(error);
            }
        });
    });
}

// Like and Unlike
function likeGuildPostButton() {
    // Like post
    $(document).on("click", ".like-btn", function () {
        var button = $(this);
        var current_user_id = $(".user-index").attr("data-userid");
        var guild_post_id = button.data("content-id");
        var url = window.location.href;
        var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);
    
        if (matchResult) {
            var guildName = matchResult[1];
            var guildId = matchResult[2];
            guildName = decodeURIComponent(guildName);
        }

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/user-gpost-like.php",
            data: {
                current_user_id: current_user_id,
                guild_post_id: guild_post_id,
                guild_id: guildId,
                guild_name: guildName
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var likeHTML = `
						<button class="already-like-btn" type="button" data-likepost-id="${response.like_id}" data-content-id="${guild_post_id}"><i class="bi bi-hand-thumbs-up-fill"><span class="like-count">${response.count}</span></i></button>
					`;
                    button.replaceWith(likeHTML);
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    });

    // Unlike post
    $(document).on("click", ".already-like-btn", function () {
        var button = $(this);
        var current_user_id = $(".user-index").attr("data-userid");
        var guild_post_id = button.data("content-id");
        var url = window.location.href;
        var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);
        var like_post_id = button.data("likepost-id");

        if (matchResult) {
            var guildName = matchResult[1];
            var guildId = matchResult[2];
            guildName = decodeURIComponent(guildName);
        }

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/user-gpost-unlike.php",
            data: {
                current_user_id: current_user_id,
                guild_post_id: guild_post_id,
                like_post_id: like_post_id,
                guild_id: guildId,
                guild_name: guildName
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var unlikeHTML = `
						<button class="like-btn" type="submit" data-content-id="${guild_post_id}"><i class="bi bi-hand-thumbs-up-fill"><span class="like-count">${response.like_count}</span></i></button>
					`;

                    button.replaceWith(unlikeHTML);
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    });
}

// Add Comment on Guild Post
function guildPostsComments() {
    $(document).on('submit', '#commentGuildForm', function (event) {
        event.preventDefault();
        var guild_post_id = $(this).closest('.comment-txtfld').data('guildpost-id');
        var url = window.location.href;
        var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);
    
        if (matchResult) {
            var guildName = matchResult[1];
            var guildId = matchResult[2];
            guildName = decodeURIComponent(guildName);
        }
        var current_user_id = $('.user-index').attr('data-userid');
        var userComment = $(this).find('#userComment').val();

        var commentGuildForm = $(this);

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/user-add-gpost-comment.php",
            data: {
                current_user_id: current_user_id,
                guild_post_id: guild_post_id,
                guild_name: guildName,
                guild_id: guildId,
                user_comment: userComment,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var userComments = commentGuildForm.closest(".comment-section");
                    var commentHTML = `
						<div class="row">
							<div class="col">
								<div class="comment-txtfld">
									<img src="src/css/images/free-display-photos/${response.commentor_user_avatar}" class="sm-avatar comment-avatar" alt="${response.commentor_user_avatar}">
									<div class="comment-content">
										<p class="users-name">${response.commentor_username}</p>
										<p class="users-comment">${userComment}</p>
									</div>
									<div class="dropdown">
										<button class="delete-comment-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
											<i class="bi bi-three-dots"></i> 
										</button>
										<ul class="dropdown-menu">
											<li><button type="submit" class="dropdown-item menu-option" data-commentid="${response.user_comment_id}" data-commentorid="${response.commentor_user_id}">Delete</button></li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					`;
                    userComments.prepend(commentHTML);
                    commentGuildForm.find('input[id="userComment"]').val("");
                } else {
                    console.log("Error:", response.message);
                }
            }
        });
    });

    $(document).on('click', '.delete-gcomment', function (event) {
        event.preventDefault();
        var current_user_id = $('.user-index').attr('data-userid');
        var rowComment = $(this).closest('.comment-txtfld');
        var comment_id = rowComment.attr('data-gcomment-id');
        var guild_post_id = rowComment.attr('data-guildpost-id');

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/user-delete-gcomment.php",
            data: {
                current_user_id: current_user_id,
                comment_id: comment_id,
                guild_post_id: guild_post_id
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    rowComment.closest(".row").fadeOut(1000, function () {
                        $(this).remove();
                    });
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    });

    $(document).on('click', '.delete-gpost', function (event) {
        event.preventDefault();
        
        var guild_post_id = $(this).attr('data-content-id');
        var author_id = $(this).attr('data-author-id');
        var gpostContainer = $(this).closest('.posted-feed');

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/user-delete-gpost.php",
            data: {
                guild_post_id: guild_post_id,
                author_id: author_id
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    gpostContainer.fadeOut("slow", function () {
                        $(this).remove();
                    });
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    });
}

function guildConversation() {
    // Submit Message
    $(document).on('submit', '#guildConversationForm', function(event) {
        event.preventDefault();

        var url = window.location.href;
        var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);
    
        if (matchResult) {
            var guildName = matchResult[1];
            var guildId = matchResult[2];
            guildName = decodeURIComponent(guildName);
        }

        var message_input = $(this);
        var current_user_id = $('.user-index').attr('data-userid');
        var usergMessageInput = $(this).find('#usergMessageInput').val();
        var guild_convo_room_id = $(this).find('.text-area').attr('data-gconvo-roomid');

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/user-guild-conversation.php",
            data: {
                current_user_id: current_user_id,
                guild_id: guildId,
                guild_name: guildName,
                userg_message_input: usergMessageInput,
                guild_convo_room_id: guild_convo_room_id
            },
            dataType: "json",
            success: function (response) {
                console.log(response.users_ids);
                if (response.status === "success") {
                    var memberMessages = $('#memberMessages');
                    var senderHTML = `
                        <div class="message-wrapper">
                            <div class="message sender">
                                <div class="message-content">
                                    <p>${response.userg_message_input}</p>
                                </div>
                                <img class="avatar" src="src/css/images/free-display-photos/${response.current_avatar}" alt="${response.current_avatar}">
                            </div>
                        </div>
                    `;
                    memberMessages.prepend(senderHTML);
                    message_input.find('#usergMessageInput').val('');
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    });
}

function loadGuildConversation() {
    var url = window.location.href;
    var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);
    var current_user_id = $('.user-index').attr('data-userid');

    if (matchResult) {
        var guildName = matchResult[1];
        var guildId = matchResult[2];
        guildName = decodeURIComponent(guildName);
    }

    $.ajax({
        method: "POST",
        url: "actions/user-guilds-page/get-guild-conversation.php",
        data: {
            guild_id: guildId,
            guild_name: guildName
        },
        type: "POST",
        dataType: "json",
        success: function (response) {
            var memberMessages = $('#memberMessages');
            memberMessages.empty();
            if (response.status === "success") {
                var users = response.users;

                $.each(users, function (i, user) {
                    var messagesHTML = '';

                    $.each(user.user_messages, function (j, message) {

                        if (current_user_id === message.sender_id) {
                            var messageHTML = `
                                <div class="message-wrapper">
                                    <div class="message sender">
                                        <div class="message-content">
                                            <p>${message.message}</p>
                                        </div>
                                        <img class="avatar" src="src/css/images/free-display-photos/${message.user_avatar}" alt="${message.user_avatar}">
                                    </div>
                                </div>
                            `;
                        } else {
                            var messageHTML = `
                                <div class="message-wrapper">
                                    <div class="message receiver">
                                        <img class="avatar" src="src/css/images/free-display-photos/${message.user_avatar}" alt="${message.user_avatar}">
                                        <div class="message-content">
                                            <p>${message.message}</p>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }

                        messagesHTML += messageHTML;
                    });

                    memberMessages.append(messagesHTML);
                });
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        },
    });
}

// Report User
function reportUser() {
    // Open Modal [Report User]
    $(document).on("click", ".modal-report", function () {
        var receiver_name = $(this).data("reportedname");
        var reported_id = $(this).data("reported-id");
        var modalDialog = $("#reportUserDialog");
        var modalHTML = `
            <div class="modal-content modal-report-user">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Report ${receiver_name} </h1>
                </div>
                <div class="modal-body">
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-report-id=${reported_id} data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Harassment or Bullying">Harassment or Bullying</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-report-id=${reported_id} data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Hate Speech or Discrimination">Hate Speech or Discrimination</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-report-id=${reported_id} data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Inappropriate Content">Inappropriate Content</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-report-id=${reported_id} data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Spam or Scams">Spam or Scams</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-report-id=${reported_id} data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Cheating or Hacking">Cheating or Hacking</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-report-id=${reported_id} data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Impersonation">Impersonation</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-report-id=${reported_id} data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Personal Information">Personal Information</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-report-id=${reported_id} data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Threats or Violence">Threats or Violence</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-report-id=${reported_id} data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Off-Topic Content">Off-Topic Content</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-report-id=${reported_id} data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Trolling or Flamebait">Trolling or Flamebait</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-report-id=${reported_id} data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Unsportsmanlike Behavior">Unsportsmanlike Behavior</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-report-id=${reported_id} data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Privacy Violation">Privacy Violation</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                </div>
            </div>
        `;

        if (modalDialog.children().length > 0) {
            modalDialog.empty();
        }
        modalDialog.append(modalHTML);
    });
    
    // Event listener for each report option button
    $(document).on("click", ".btn-report-option", function() {
        var reportContent = $(this).data("report-option");
        var reported_id = $(this).data("report-id");

        // Object to store the report details for each report option
        var reportDetails = {
            "Harassment or Bullying": "User is engaging in offensive behavior or bullying others.",
            "Hate Speech or Discrimination": "User is using discriminatory language or promoting hate speech.",
            "Inappropriate Content": "User is posting or sharing inappropriate or offensive content.",
            "Spam or Scams": "User is spamming the platform or trying to scam others.",
            "Cheating or Hacking": "In gaming discussions, report users who cheat or hack in games.",
            "Impersonation": "User is pretending to be someone else.",
            "Personal Information": "User is sharing personal information without consent.",
            "Threats or Violence": "User is making threats of violence or harm.",
            "Off-Topic Content": "User is consistently posting content that is unrelated to the gaming discussion.",
            "Trolling or Flamebait": "User is intentionally provoking others or causing conflicts.",
            "Unsportsmanlike Behavior": "In gaming discussions, report users who display poor sportsmanship.",
            "Privacy Violation": "User is violating someone else's privacy."
        };

        // Get the corresponding report detail from the object
        var detailContent = reportDetails[reportContent];
        $('#reportUserSecondModal .modal-content').empty();

        var reportDetailHTML = `
            <div class="modal-header">
                <h1 class="modal-title fs-5">Report Details</h1>
            </div>
            <div class="modal-body">
                <p class="mb-0 fw-light"><span class="fw-normal report-details">${reportContent}</span>: ${detailContent}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="modal-opt-btn" data-bs-dismiss="modal">Cancel</button>
                <button type="button" data-id="${reported_id}" class="modal-opt-btn confirm-report">Confirm</button>
            </div>
        `;
        $('#reportUserSecondModal .modal-content').append(reportDetailHTML);
    });
    
    // Event listener for confirming the report
    $(document).on("click", ".confirm-report", function() {
        var report_content = $('.report-details').text();
        var current_user_id = $(".user-index").attr("data-userid");
        var report_user_id = $(this).attr("data-id");

        $.ajax({
            url: "actions/user-report.php",
            method: "POST",
            data: { 
                report_content: report_content,
                current_user_id: current_user_id,
                report_user_id: report_user_id
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    $('.modal-body').empty();
                    $('.confirm-report').prop('disabled', true);
                    $('.modal-body').append('<p class="text-success mb-0">Report submitted.</p>');
            
                    setTimeout(function() {
                        $('#reportUserSecondModal .modal-content').empty();
                        $('#reportUserSecondModal').modal('hide');
                    }, 3000);
                } else {
                    console.error(response.message);
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors here
                console.log(error);
            },
        });
    });
}

function userSettings() {
    // Open Settings Modal
    $(document).on('click', '.settings', function () {
        var current_user_id = $(this).attr('data-user-id');
        $.ajax({
            method: "POST",
            url: "actions/user-settings.php",
            data: { current_user_id: current_user_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var userDialogSettings = $('#userDialogSettings');
                    var userInfo = response.users_info[0];
                    var content = `
                        <div class="modal-content settings-content" data-currentid="${userInfo.user_id}">
                            <div class="modal-header">
                                <h5 class="modal-title">Account Settings</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body container">
                                <div class="row my-3">
                                    <div class="col-4">
                                        <p class="text-title">Email</p>
                                    </div>
                                    <div class="col-4 text-center">
                                        <p>${userInfo.user_email}</p>
                                    </div>
                                </div>
                                <div class="row my-3">
                                    <div class="col">
                                        <p class="text-title">Username</p>
                                    </div>
                                    <div class="col-6 text-center">
                                        <p>${userInfo.username}</p>
                                    </div>
                                    <div class="col text-center">
                                        <button type="button" class="edit-btn edit-username" data-bs-toggle="modal" data-bs-target="#changeUsername"><i class="bi bi-pencil-fill"></i></button>
                                    </div>
                                </div>
                                <div class="row my-3">
                                    <div class="col">
                                        <p class="text-title">Password</p>
                                    </div>
                                    <div class="col-6 text-center">
                                        <input type="password" class="user-password" value="${userInfo.user_password}" disabled="true">
                                    </div>
                                    <div class="col text-center">
                                        <button type="button" class="edit-btn edit-password" data-bs-toggle="modal" data-bs-target="#changePassword"><i class="bi bi-pencil-fill"></i></button>
                                    </div>
                                </div>
                                <div class="row my-3">
                                    <div class="col-4">
                                        <p class="text-title">Account Created</p>
                                    </div>
                                    <div class="col-4 text-center">
                                        <p>${userInfo.account_created}</p>
                                    </div>
                                </div>
                                <div class="row my-3">
                                    <div class="col">
                                        <button type="button" class="delete-acc-btn bg-transparent text-danger fst-italic fw-bold border-0" data-bs-toggle="modal" data-bs-target="#deleteMyAccount">Delete Account</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    if (userDialogSettings.children().length > 0) {
                        userDialogSettings.empty();
                    }
                    userDialogSettings.append(content);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    });

    // Open Modal - Change Username
    $(document).on('click', '.edit-username', function () {
        var button = $(this);
        var current_user_id = button.closest('.modal-content').attr('data-currentid');
        var usernameDialog = $('#usernameDialog');
        var content = `
            <div class="modal-content settings-content" data-currentid="${current_user_id}">
                <div class="modal-header">
                    <h5 class="modal-title">Change username</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body container">
                    <div class="row">
                        <div class="col">
                            <p class="m-0">New Username</p>
                            <input type="text" class="mb-4 border-start ps-2 border-bottom bg-transparent" id="newUsername" autocomplete="off" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <p class="m-0">Password</p>
                            <div class="d-flex">
                                <input type="password" class="mb-4 border-start ps-2 border-bottom bg-transparent" id="userPassword" required>
                                <i class="ms-2 bi bi-eye-fill toggle-password"></i>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <p class="m-0">Confirm Password</p>
                            <div class="d-flex">
                                <input type="password" class="mb-4 border-start ps-2 border-bottom bg-transparent" id="userConfirmPassword" required>
                                <i class="ms-2 bi bi-eye-fill toggle-conpassword"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="modal-opt-btn" data-bs-target="#userSettings" data-bs-toggle="modal">Cancel</button>
                    <button type="button" class="modal-opt-btn confirm-change-name" data-currentid="${current_user_id}">Confirm</button>
                </div>
            </div>
        `;
        if (usernameDialog.children().length > 0) {
            usernameDialog.empty();
        }
        usernameDialog.append(content);
        // Toggle password visibility
        $('.toggle-password').click(function () {
            var passwordInput = $(this).prev('input');
            if (passwordInput.attr('type') === 'password') {
                passwordInput.attr('type', 'text');
                $(this).removeClass('bi-eye-fill').addClass('bi-eye-slash-fill');
            } else {
                passwordInput.attr('type', 'password');
                $(this).removeClass('bi-eye-slash-fill').addClass('bi-eye-fill');
            }
        });
        $('.toggle-conpassword').click(function () {
            var passwordInput = $(this).prev('input');
            if (passwordInput.attr('type') === 'password') {
                passwordInput.attr('type', 'text');
                $(this).removeClass('bi-eye-fill').addClass('bi-eye-slash-fill');
            } else {
                passwordInput.attr('type', 'password');
                $(this).removeClass('bi-eye-slash-fill').addClass('bi-eye-fill');
            }
        });
    });

    // On submit [Change Username]
    $(document).on('click', '.confirm-change-name', function () {
        var user_id = $(this).attr('data-currentid');
        var button = $(this);
        var modalContent = button.closest('.modal-content');
        var new_username = modalContent.find('#newUsername').val();
        var password = modalContent.find('#userPassword').val();
        var confirm_password = modalContent.find('#userConfirmPassword').val();
        $.ajax({
            method: "POST",
            url: "actions/user-change-username.php",
            data: { user_id: user_id,
                    new_username: new_username,
                    password: password,
                    confirm_password: confirm_password,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    var successMessage = $('<p class="m-0 text-center text-success fw-semibold">').text(response.message);
                    modalContent.find('.modal-body').append(successMessage);
                    modalContent.find('.modal-footer').remove();
                    successMessage.fadeIn(function () {
                        setTimeout(function () {
                            successMessage.fadeOut(function () {
                                location.reload();
                            });
                        }, 3000);
                    });
                } else {
                    var errorMessage = $('<p class="m-0 text-center text-danger fw-semibold">').text(response.message);
                    modalContent.find('.modal-body').append(errorMessage);
                    errorMessage.fadeIn(function () {
                        setTimeout(function () {
                            errorMessage.fadeOut(function () {
                                errorMessage.remove();
                            });
                        }, 3000);
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });

    // Open Modal - Change Password
    $(document).on('click', '.edit-password', function () {
        var button = $(this);
        var current_user_id = button.closest('.modal-content').attr('data-currentid');
        var passwordDialog = $('#passwordDialog');
        var content = `
            <<div class="modal-content settings-content" data-currentid="${current_user_id}">
                <div class="modal-header">
                    <h5 class="modal-title">Change password</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body container">
                    <div class="row">
                        <div class="col">
                            <p class="m-0">Old Password</p>
                            <div class="d-flex">
                                <input type="password" class="mb-4 border-start ps-2 border-bottom bg-transparent" id="userOldPassword" required>
                                <i class="ms-2 bi bi-eye-fill toggle-oldpassword"></i>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <p class="m-0">New Password</p>
                            <div class="d-flex">
                                <input type="password" class="mb-4 border-start ps-2 border-bottom bg-transparent" id="userNewPassword" required>
                                <i class="ms-2 bi bi-eye-fill toggle-newpassword"></i>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <p class="m-0">Confirm New Password</p>
                            <div class="d-flex">
                                <input type="password" class="mb-4 border-start ps-2 border-bottom bg-transparent" id="userConfirmPassword" required>
                                <i class="ms-2 bi bi-eye-fill toggle-conpassword"></i>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <p class="forget-password">Forgot Password? <span><button type="button" class="forget-pass-btn" data-bs-toggle="modal" data-bs-target="#forgotMyPassword">Click here.</button></span></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="modal-opt-btn" data-bs-target="#userSettings" data-bs-toggle="modal">Cancel</button>
                    <button type="button" class="modal-opt-btn confirm-change-password" data-currentid="${current_user_id}">Confirm</button>
                </div>
            </div>
        `;
        if (passwordDialog.children().length > 0) {
            passwordDialog.empty();
        }
        passwordDialog.append(content);

        // Toggle password visibility
        $('.toggle-oldpassword').click(function () {
            var passwordInput = $(this).prev('input');
            if (passwordInput.attr('type') === 'password') {
                passwordInput.attr('type', 'text');
                $(this).removeClass('bi-eye-fill').addClass('bi-eye-slash-fill');
            } else {
                passwordInput.attr('type', 'password');
                $(this).removeClass('bi-eye-slash-fill').addClass('bi-eye-fill');
            }
        });
        $('.toggle-newpassword').click(function () {
            var passwordInput = $(this).prev('input');
            if (passwordInput.attr('type') === 'password') {
                passwordInput.attr('type', 'text');
                $(this).removeClass('bi-eye-fill').addClass('bi-eye-slash-fill');
            } else {
                passwordInput.attr('type', 'password');
                $(this).removeClass('bi-eye-slash-fill').addClass('bi-eye-fill');
            }
        });
        $('.toggle-conpassword').click(function () {
            var passwordInput = $(this).prev('input');
            if (passwordInput.attr('type') === 'password') {
                passwordInput.attr('type', 'text');
                $(this).removeClass('bi-eye-fill').addClass('bi-eye-slash-fill');
            } else {
                passwordInput.attr('type', 'password');
                $(this).removeClass('bi-eye-slash-fill').addClass('bi-eye-fill');
            }
        });
    });

    // On submit [Change password]
    $(document).on('click', '.confirm-change-password', function () {
        var user_id = $(this).attr('data-currentid');
        var button = $(this);
        var modalContent = button.closest('.modal-content');
        var old_password = modalContent.find('#userOldPassword').val();
        var new_password = modalContent.find('#userNewPassword').val();
        var confirm_password = modalContent.find('#userConfirmPassword').val();
        $.ajax({
            method: "POST",
            url: "actions/user-change-password.php",
            data: { user_id: user_id,
                    old_password: old_password,
                    new_password: new_password,
                    confirm_password: confirm_password,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    var successMessage = $('<p class="m-0 text-center text-success fw-semibold">').text(response.message);
                    modalContent.find('input, .toggle-oldpassword, .toggle-newpassword, .toggle-conpassword').prop('disabled', true);
                    modalContent.find('.modal-body').append(successMessage);
                    modalContent.find('.modal-footer').remove();
                    successMessage.fadeIn(function () {
                        setTimeout(function () {
                            successMessage.fadeOut(function () {
                                location.reload();
                            });
                        }, 3000);
                    });
                } else {
                    var errorMessage = $('<p class="m-0 text-center text-danger fw-semibold">').text(response.message);
                    modalContent.find('.modal-body').append(errorMessage);
                    errorMessage.fadeIn(function () {
                        setTimeout(function () {
                            errorMessage.fadeOut(function () {
                                errorMessage.remove();
                            });
                        }, 3000);
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });

    // Open Modal - Forgot Password
    $(document).on('click', '.forget-pass-btn', function () {
        var button = $(this);
        var current_user_id = button.closest('.modal-content').attr('data-currentid');
        var forgotPassDialog = $('#forgotPasswordDialog');
        var content = `
            <div class="modal-content settings-content" data-currentid="${current_user_id}">
                <div class="modal-header">
                    <h5 class="modal-title">Forgot Password</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body container">
                    <div class="row">
                        <div class="col">
                            <p class="m-0">Email</p>
                            <div class="d-flex">
                                <input type="text" class="mb-4 border-start ps-2 border-bottom bg-transparent" placeholder="Enter your email" id="userEmail" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <p class="m-0">Username</p>
                            <div class="d-flex">
                                <input type="text" class="mb-4 border-start ps-2 border-bottom bg-transparent" placeholder="Enter your username" id="userName" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <p class="m-0">Account Created</p>
                            <div class="d-flex">
                                <input type="date" class="mb-4 ps-2" id="accDateCreated" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col text-center">
                            <button type="button" class="mb-3 generate-newpass" data-currentid="${current_user_id}">Generate New Password</button>
                        </div>
                    </div>
                    <div class="row d-none">
                        <div class="col">
                            <p class="m-0">New Password</p>
                            <div class="d-flex">
                                <input type="password" class="mb-4 border-start ps-2 border-bottom bg-transparent" id="userNewPassword" required>
                                <i class="ms-2 bi bi-eye-fill toggle-newpassword"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        if (forgotPassDialog.children().length > 0) {
            forgotPassDialog.empty();
        }
        forgotPassDialog.append(content);

        // Toggle password visibility
        $('.toggle-newpassword').click(function () {
            var passwordInput = $(this).prev('input');
            if (passwordInput.attr('type') === 'password') {
                passwordInput.attr('type', 'text');
                $(this).removeClass('bi-eye-fill').addClass('bi-eye-slash-fill');
            } else {
                passwordInput.attr('type', 'password');
                $(this).removeClass('bi-eye-slash-fill').addClass('bi-eye-fill');
            }
        });
    });

    // On submit [Generate New Password]
    $(document).on('click', '.generate-newpass', function () {
        var user_id = $(this).attr('data-currentid');
        var button = $(this);
        var modalContent = button.closest('.modal-content');
        var user_email = modalContent.find('#userEmail').val();
        var username = modalContent.find('#userName').val();
        var account_created_date = modalContent.find('#accDateCreated').val();

        $.ajax({
            method: "POST",
            url: "actions/user-generate-new-password.php",
            data: { user_id: user_id,
                    user_email: user_email,
                    username: username,
                    account_created_date: account_created_date,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    modalContent.find('.d-none').removeClass('d-none');
                    modalContent.find('#userNewPassword').val(response.new_generated_password);
                    modalContent.find('input, #userNewPassword').prop('disabled', true);

                    var footerHTML = `
                        <div class="modal-footer">
                            <button type="button" class="modal-opt-btn" data-bs-target="#userSettings" data-bs-toggle="modal">Cancel</button>
                            <button type="button" class="modal-opt-btn confirm-reset-password" data-currentid="${user_id}">Confirm</button>
                        </div>
                    `;
                    modalContent.append(footerHTML);
                } else {
                    // Remove any existing error messages
                    modalContent.find('.text-danger').remove();
                    var errorMessage = $('<p class="text-danger fw-semibold text-center">' + response.message + '</p>')
                        .hide()
                        .appendTo(modalContent.find('.modal-body'))
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

    // On submit [Confirm New Password]
    $(document).on('click', '.confirm-reset-password', function () {
        var user_id = $(this).attr('data-currentid');
        var button = $(this);
        var modalContent = button.closest('.modal-content');
        var new_password = modalContent.find('#userNewPassword').val();

        $.ajax({
            method: "POST",
            url: "actions/user-confirm-new-password.php",
            data: { user_id: user_id,
                    new_password: new_password
            },
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    modalContent.find('.modal-body').append('<p class="m-0 text-center text-success fw-semibold">' + response.message + '</p>');
                    modalContent.find('.modal-footer, .modal-title, .btn-close, .row').remove();
                    setTimeout(function () {
                        location.reload();
                    }, 3500);
                } else {
                    // Remove any existing error messages
                    modalContent.find('.text-danger').remove();
                    var errorMessage = $('<p class="text-danger fw-semibold text-center">' + response.message + '</p>')
                        .hide()
                        .appendTo(modalContent.find('.modal-body'))
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

    // Open Modal - Delete Account
    $(document).on('click', '.delete-acc-btn', function () {
        var button = $(this);
        var current_user_id = button.closest('.modal-content').attr('data-currentid');
        var deleteAccountDialog = $('#deleteAccountDialog');
        var content = `
            <div class="modal-content settings-content" data-currentid="${current_user_id}">
                <div class="modal-header">
                    <h5 class="modal-title">Delete Account</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body container">
                    <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                    <p>Deleting your account will result in:</p>
                    <ul class="fst-italic">
                        <li>Loss of all your account data and information.</li>
                        <li>Inability to access your account again.</li>
                        <li>Removal from any associated guilds.</li>
                        <li>Erasure of your profile, posts, and interactions.</li>
                    </ul>
                    <p>Additionally, if you are the creator of any guilds:</p>
                    <ul class="fst-italic">
                        <li>The guilds you've created will be removed.</li>
                        <li>All guild members will be automatically removed from those guilds.</li>
                    </ul>
                    <p>Please be aware that once you delete your account, you won't be able to recover any of your data or undo this action.</p>
                    <p>If you are sure about your decision, please enter your password to proceed with the account deletion.</p>
                    <div class="row">
                        <div class="col">
                            <div class="d-flex">
                                <input type="password" class="border-start ps-2 border-bottom bg-transparent" id="userPassword" placeholder="Enter your password">
                                <i class="ms-2 bi bi-eye-fill toggle-conpassword"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="modal-opt-btn" data-bs-target="#userSettings" data-bs-toggle="modal">Cancel</button>
                    <button type="button" class="modal-opt-btn confirm-delete-acc" data-currentid="${current_user_id}">Confirm</button>
                </div>
            </div>
        `;
        if (deleteAccountDialog.children().length > 0) {
            deleteAccountDialog.empty();
        }
        deleteAccountDialog.append(content);

        $('.toggle-conpassword').click(function () {
            var passwordInput = $(this).prev('input');
            if (passwordInput.attr('type') === 'password') {
                passwordInput.attr('type', 'text');
                $(this).removeClass('bi-eye-fill').addClass('bi-eye-slash-fill');
            } else {
                passwordInput.attr('type', 'password');
                $(this).removeClass('bi-eye-slash-fill').addClass('bi-eye-fill');
            }
        });
    });

    // On submit [Delete Account]
    $(document).on('click', '.confirm-delete-acc', function () {
        var user_id = $(this).attr('data-currentid');
        var button = $(this);
        var modalContent = button.closest('.modal-content');
        var user_password = modalContent.find('#userPassword').val();
        modalContent.find('.error-message').remove();
        $.ajax({
            method: "POST",
            url: "actions/user-delete-account.php",
            data: { user_id: user_id,
                    user_password: user_password },
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    modalContent.find('p, ul').remove();
                    modalContent.find('.modal-body').append('<p class="m-0 text-center">Account deletion processing . . .</p>');
                    setTimeout(function () {
                        modalContent.find('.modal-body p').fadeOut(200, function () {
                            location.reload();
                        });
                    }, 3000);
                } else {
                    var errorMessage = $('<p class="error-message text-danger fw-semibold text-center mb-0 mt-3">' + response.message + '</p>').hide();
                    modalContent.find('.modal-body').append(errorMessage);
                    errorMessage.fadeIn(400, function () {
                        setTimeout(function () {
                            errorMessage.fadeOut(400, function () {
                                errorMessage.remove();
                            });
                        }, 3000);
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });
}

function leaveGuild() {
    $(document).on('click', '.leave-guild-btn', function () {
        var current_user_id = $(this).attr('data-user-id');
        var guild_id = $(this).attr('data-guild-id');

        var url = window.location.href;
        var matchResult = url.match(/\/gn\/([^/]+)\/id\/([^/]+)/);
    
        if (matchResult) {
            var guildName = matchResult[1];
            guildName = decodeURIComponent(guildName);
        }

        $.ajax({
            url: "actions/user-guilds-page/get-guilds.php",
            method: "POST",
            data: { current_user_id: current_user_id },
            dataType: "json",
            success: function (response) {
                var guild = response.guilds[0];
                var leaveGuildDialog = $("#leaveGuildDialog");
                
                if (current_user_id === guild.guild_creator_id) {
                    var content = `
                        <div class="modal-content">
                            <div class="modal-header">
                            <h1 class="modal-title fs-5">Leave Guild</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p class="m-0">Your decision to leave the <span class="fw-semibold text-danger">${guildName}</span> will trigger the guild's removal, along with kicking out all members. Are you sure you want to leave the guild?</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="modal-opt-btn" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="modal-opt-btn confirm-leave" data-user-id=${current_user_id} data-guild-id=${guild_id}>Yes</button>
                            </div>
                        </div>
                    `;
                } else {
                    var content = `
                        <div class="modal-content">
                            <div class="modal-header">
                            <h1 class="modal-title fs-5">Leave Guild</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p class="m-0">Are you sure you want to leave the <span class="fw-semibold text-danger">${guildName}</span>?</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="modal-opt-btn" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="modal-opt-btn confirm-leave" data-user-id=${current_user_id} data-guild-id=${guild_id}>Yes</button>
                            </div>
                        </div>
                    `;
                }

                if (leaveGuildDialog.children().length > 0) {
                    leaveGuildDialog.empty();
                }
                leaveGuildDialog.append(content);
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });

    $(document).on('click', '.confirm-leave', function () {
        var current_user_id = $(this).attr('data-user-id');
        var guild_id = $(this).attr('data-guild-id');
        var modalContent = $(this).closest('.modal-content');
        var button = $(this);

        $.ajax({
            url: "actions/user-guilds-page/user-leave-guild.php",
            method: "POST",
            data: { current_user_id: current_user_id,
                    guild_id: guild_id },
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    modalContent.find('.modal-body p').fadeOut(300, function () {
                        $(this).remove();
                        modalContent.find('.btn-close').remove();
                        button.closest('.modal-footer').find('.modal-opt-btn').prop("disabled", true);
            
                        var successMessage = $('<p class="m-0 text-center text-success fw-semibold">' + response.message + '</p>').hide();
                        modalContent.find('.modal-body').append(successMessage);
                        successMessage.fadeIn(1500);
                
                        // Wait for a moment and then reload the page
                        setTimeout(function () {
                            var guildPageUrl = "gamers-nest/user-guilds-page.php";
                            window.location.href = guildPageUrl;
                        }, 3000);
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });
}
