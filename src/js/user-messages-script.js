$(document).ready(function () {
    modalNewMessage();
    userConversation();
    getChatList();
    openConversation();
    loadConversations();
    loadMessages();
    submitMessage();
    muteUnmuteConversation();
    deleteConversation();
    blockUser();
    reportUser();
    searchConversation();
    getUsersGuildPostOnModal();
    guildPostsComments();

    // Notification
    notifications();
    markReadNotification();
    clearNotification();
    acceptGuildRequest();

    // Profile
    goToCurrentUserPage();

    // setInterval(notifications, 30000);
    // setInterval(getChatList, 3000);
    // setInterval(loadMessages, 3000);
});

// View Profile
function goToCurrentUserPage() {
    // View Current User Profile
    $(document).on("click", "#userProfile", function () {
        var user_id = $(".user-index").attr("data-userid");
        var userProfileUrl = "/gamers-nest/user-profile-page.php?user_id=" + user_id;
        window.location.href = userProfileUrl;
    });
    // View Other User Profile
    $(document).on("click", ".view-profile-btn", function () {
        var user_id = $(this).attr("data-receiver-id");
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
                userid: userid,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    $(".user-notification.unread-notif").removeClass(
                        "unread-notif"
                    );
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
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
                notification_id: notification_id,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    $(event.target)
                        .closest(".user-notification")
                        .removeClass("unread-notif");
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
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
                user_id: user_id,
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
            },
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
                notification_id: notification_id,
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
            },
        });
    });
}

// Open Modal - Create New Message
function modalNewMessage() {
    $(document).on("click", "#NewMessage", function () {
        var userdisplay = $("#messageDisplayUser");

        var modalHTML = `
                <div class="modal-content search-user-msg">
                    <div class="modal-header">
						<h1 class="modal-title fs-5">Start New Message</h1>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
						<div class="search-bar">
                            <form class="d-flex" role="search">
                                <input class="form-control" id="searchUserToMessage" autocomplete="off" type="text" placeholder="To:">
                            </form>
						</div>
						<div class="search-result">
							<ul id="searchUserResult">
								<!-- Display results here  -->
							</ul>
						</div>
                    </div>
                </div>
			`;

        if (userdisplay.children().length > 0) {
            userdisplay.empty();
        }
        userdisplay.append(modalHTML);

        // Call the searchButton() function to enable search functionality in the modal
        searchButton();
    });
}

// Search
function searchButton() {
    $(document).on("keyup", "#searchUserToMessage", function (event) {
        event.preventDefault();

        var user_id = $(".user-index").attr("data-userid");
        var input = $(this).val();
        var displayResult = $("#searchUserResult");

        if (input != "") {
            $.ajax({
                url: "actions/user-messages-pages/get-users.php",
                method: "POST",
                data: {
                    input: input,
                    user_id: user_id,
                },
                dataType: "json",
                success: function (response) {
                    if (response.status === "success") {
                        displayResult.empty(); // Clear previous results

                        if (response.users.length > 0) {
                            // Loop through the users array and display each result
                            for (var i = 0; i < response.users.length; i++) {
                                var user = response.users[i];
                                var resultHTML = `
                                <li>
									<button class="user" data-receiver-userid="${user.user_id}">
										<div class="user-info">
											<img class="user-avatar" src="src/css/images/free-display-photos/${user.user_avatar}" alt="${user.user_avatar}">
											<p class="mb-0">${user.username}</p>
										</div>
									</button>
                                </li>
                            `;
                                displayResult.append(resultHTML);
                            }
                        } else {
                            displayResult.append('<p class="error-msg">No results found.</p>');
                        }
                    } else {
                        console.log("Error:", response.message);
                    }
                },
                error: function (xhr, status, error) {
                    // Handle errors here
                    console.log(error);
                },
            });
        } else {
            displayResult.html('<p class="error-msg">No results found.</p>');
        }
    });
}

// Create or Start Conversation
function userConversation() {
    $(document).on("click", ".user", function (event) {
        event.preventDefault();

        var receiver_user_id = $(this).attr("data-receiver-userid");
        var user_id = $(".user-index").attr("data-userid");

        $.ajax({
            url: "actions/user-messages-pages/user-create-convo.php",
            method: "POST",
            data: {
                receiver_user_id: receiver_user_id,
            },
            dataType: "json",
            success: function (response) {
                var searchUserResult = $("#searchUserResult");

                if (response.status === "success") {
                    var messageContainer = $("#messageContainer");
                    var chatListContainer = $("#chatListContainer");

                    var messageHTML = `
						<div class="msg-content" id="msgContent">
							<div class="users-messages" id="messageContent"></div>
							<form method="POST" data-convoroom-id="${response.convo_room_id}">
								<div class="text-area">
									<div class="input-field">
										<input type="text" placeholder="Aa" id="userMessageInput" autocomplete="off">
									</div>
								</div>
							</form>
						</div>
                    `;

                    var muteUnmuteBtn = "";

                    // Determine if the current user is the sender or the receiver
                    var isCurrentUserSender = user_id === response.sender_id;
                    var isCurrentUserReceiver = user_id === response.receiver_id;

                    if ((isCurrentUserSender && response.sender_muted === "true") ||
                        (isCurrentUserReceiver && response.receiver_muted === "true")) {
                        // Conversation is muted for the current user
                        muteUnmuteBtn = `
							<button class="friend-settings-btn unmute-convo-btn" data-convoroom-id="${response.convo_room_id}">
                            	<i class="bi bi-bell-slash-fill"></i>
							</button>
							<p>Unmute</p>
						`;
                    } else {
                        // Conversation is not muted for the current user
                        muteUnmuteBtn = `
							<button class="friend-settings-btn mute-convo-btn" data-convoroom-id="${response.convo_room_id}">
                            	<i class="bi bi-bell-fill"></i>
							</button>
							<p>Mute</p>
						`;
                    }

                    var optionHTML = `
						<div class="msg-right-sidebar" id="rightSidebar">
							<div class="friend-section">
								<div class="friend-info">
									<img src="src/css/images/free-display-photos/${response.receiver_user_avatar}" alt="${response.receiver_user_avatar}">
									<p class="user-information" data-receiver-id="${response.receiver_id}"  data-receiver-name="${response.receiver_username}">${response.receiver_username}</p>
								</div>
								<div class="friend-settings">
									<div class="row">
										<div class="col-4">
											<button class="friend-settings-btn view-profile-btn" data-receiver-id="${response.receiver_id}"><i class="bi bi-person-circle"></i></button>
											<p>Profile</p>
										</div>
										<div class="col-4">
											${muteUnmuteBtn}
										</div>
										<div class="col-4">
											<button type="button" id="deleteConvoButton" class="friend-settings-btn delete-convo-btn" data-bs-toggle="modal" data-bs-target="#deleteConversation" data-convoroom-id="${response.convo_room_id}"><i class="bi bi-trash-fill"></i></button>
											<p>Delete</p>
										</div>
									</div>
									<div class="row">
										<div class="col-6">
											<button type="button" id="blockUserButton" class="friend-settings-btn modal-block" data-bs-toggle="modal" data-bs-target="#blockUser"><i class="bi bi-person-fill-slash"></i></button>
											<p>Block</p>
										</div>
										<div class="col-6">
											<button type="button" id="reportUserButton" class="friend-settings-btn modal-report" data-bs-toggle="modal" data-bs-target="#reportUser"><i class="bi bi-exclamation-triangle-fill"></i></button>
											<p>Report</p>
										</div>
									</div>
								</div>
							</div>
						</div>
                    `;

                    var chatListHTML = `
						<a class="btn-message" href="user-conversation-page.php?message=${response.convo_room_id}" data-messageid="${response.convo_room_id}" data-receiverid="${response.receiver_id}">
							<li class="chat-list">
								<div class="user-img d-flex justify-content-center">
									<img class="display-img" src="src/css/images/free-display-photos/${response.receiver_user_avatar}" alt="${response.receiver_user_avatar}">
								</div>
								<div class="name-msg">
									<p class="user-name">${response.receiver_username}</p>
									<p class="user-curmsg"></p>
								</div>
								<div class="msg-option">
									<a class="option-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
										<i class="bi bi-three-dots"></i>
									</a>
									<ul class="dropdown-menu">
                                        <button type="button" class="dropdown-item modal-block" data-bs-toggle="modal" data-bs-target="#blockUser">Block</button>
                                        <button type="buton" class="dropdown-item deleteConvo" data-convoroom-id="${response.convo_room_id}">Delete conversation</button>
                                        <button class="dropdown-item mute-convo-btn" data-convoroom-id="${response.convo_room_id}">Mute notifications</button>
                                        <button class="dropdown-item view-profile-btn">View Profile</button>
									</ul>
								</div>
							</li>
						</a>
                    `;

                    messageContainer.append(messageHTML + optionHTML);
                    chatListContainer.append(chatListHTML);

                    $("#modalnewMessage").modal("hide");
                    $(".no-conversation").hide();

                    // Update the URL without reloading the page
                    window.history.pushState(
                        window.location.href,"Messages | Gamer's Nest","/gamers-nest/user-conversation-page.php?message=" + response.convo_room_id
                    );
                } else {
                    searchUserResult.html('<p class="error-msg">' + response.message + "</p>");
                }
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.log(error);
            },
        });
    });
}

// Display Chat List
function getChatList() {
    var user_id = $(".user-index").attr("data-userid");
    $.ajax({
        url: "actions/user-messages-pages/get-messages-list.php",
        type: "POST",
        dataType: "json",
        success: function (response) {
            var chatListContainer = $("#chatListContainer");
            chatListContainer.empty();
            if (response.status === "success") {
                var convo_rooms = response.convo_rooms;

                $.each(convo_rooms, function (i, convo_room) {
                    var maxWords = 5;
                    var maxCharacters = 20;
                    var messageWords = [];
                    var messageChars = [];

                    var sentAt = convo_room.users_receiver_info.sent_at;
                    var timeAgo = getTimeAgoString(sentAt);

                    var senderName = convo_room.users_receiver_info.sender_username;
                    
                    var currMsg = '';
                    if (convo_room.users_receiver_info.current_message !== null) {
                        messageWords = convo_room.users_receiver_info.current_message.messages.split(" ");
                        messageChars = convo_room.users_receiver_info.current_message.messages.split("");

                        var truncatedMessageWords = messageWords.slice(0, maxWords).join(" ");
                        var truncatedMessageChars = messageChars.slice(0, maxCharacters).join("");

                        var displayMessage = messageWords.length > maxWords ? truncatedMessageWords + "..." : truncatedMessageWords;
                        displayMessage = messageChars.length > maxCharacters ? truncatedMessageChars + "..." : truncatedMessageChars;

                        currMsg = `<p class="user-curmsg">${senderName}: ${displayMessage}`;
                    } else {
                        currMsg = '';
                    }

                    // Determine if the current user is the sender or the receiver
                    var isCurrentUserSender = user_id === convo_room.sender_id;
                    var isCurrentUserReceiver = user_id === convo_room.receiver_id;
                    var muteUnmuteBtn = "";

                    if ((isCurrentUserSender && convo_room.sender_muted === "true") ||
                        (isCurrentUserReceiver &&convo_room.receiver_muted === "true")) {
                        // Conversation is muted for the current user
                        muteUnmuteBtn = `
							<button class="dropdown-item unmute-convoBtn" data-convoroom-id="${convo_room.convo_room_id}">Unmute notifications</button>
						`;
                    } else {
                        // Conversation is not muted for the current user
                        muteUnmuteBtn = `
							<button class="dropdown-item mute-convoBtn" data-convoroom-id="${convo_room.convo_room_id}">Mute notifications</button>
						`;
                    }

                    var blockUnblockBtn = "";

                    if (convo_room.is_blocked === "true") {
                        // Conversation is blocked for the current user
                        blockUnblockBtn = `
                            <button type="button" class="dropdown-item modal-unblock" data-bs-toggle="modal" data-bs-target="#blockUser">Unblock</button>
                        `;
                    } else {
                        blockUnblockBtn = `
                            <button type="button" class="dropdown-item modal-block" data-bs-toggle="modal" data-bs-target="#blockUser">Block</button>
                        `;
                    }

                    var messageHTML = `
						<li class="chat-list">
							<a class="btn-message" href="user-conversation-page.php?message=${convo_room.convo_room_id}" data-messageid="${convo_room.convo_room_id}" data-receiverid="${convo_room.users_receiver_info.receiver_user_id}">
								<div class="user-img d-flex justify-content-center">
									<img class="display-img" src="src/css/images/free-display-photos/${convo_room.users_receiver_info.receiver_user_avatar}" alt="${convo_room.users_receiver_info.receiver_user_avatar}">
								</div>
								<div class="name-msg">
                                        <p class="user-name">${convo_room.users_receiver_info.receiver_user_name}</p>
                                        ${currMsg}
										<span class="text-danger fw-normal">${timeAgo}</span>
									</p>
								</div>
								<div class="msg-option">
									<a class="option-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
										<i class="bi bi-three-dots"></i>
									</a>
									<ul class="dropdown-menu">
                                        ${blockUnblockBtn}
                                        <button type="buton" class="dropdown-item deleteConvo" data-convoroom-id="${convo_room.convo_room_id}">Delete conversation</button>
                                        ${muteUnmuteBtn}
                                        <button class="dropdown-item view-profile-btn" data-receiver-id="${convo_room.users_receiver_info.receiver_user_id}">View Profile</button>
									</ul>
								</div>
							</a>
						</li>
                    `;
                    chatListContainer.append(messageHTML);
                });
            } else {
                chatListContainer.append('<p class="no-conversation">' + response.message + "</p>");
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        },
    });
}

// Time convert with "Ago"
function getTimeAgoString(sentAt) {
    if (sentAt === '') {
        return '';
    }

    const sentTime = new Date(sentAt);
    const currentTime = new Date();
    const timeDifference = Math.floor((currentTime - sentTime) / (1000 * 60)); // Difference in minutes

    if (timeDifference < 1) {
        return "Just now";
    } else if (timeDifference < 60) {
        return `${timeDifference}m ago`;
    } else if (timeDifference < 1440) {
        return `${Math.floor(timeDifference / 60)}h ago`;
    } else {
        return `${Math.floor(timeDifference / 1440)}d ago`;
    }
}

// View Conversation
function openConversation() {
    $(document).on("click", ".btn-message", function (event) {
        event.preventDefault();
        var convo_id = $(this).data("messageid");
        var userConversationUrl = "/gamers-nest/user-conversation-page.php?message=" + convo_id;
        window.location.href = userConversationUrl;
    });
}

// Display conversation
function loadConversations() {
    // Get the convo_id from the URL query parameter
    var urlParams = new URLSearchParams(window.location.search);
    var convo_id = urlParams.get("message");
    var user_id = $(".user-index").attr("data-userid");
    $(".btn-message").addClass("disabled");

    $.ajax({
        url: "actions/user-messages-pages/get-conversation.php",
        method: "POST",
        data: {
            convo_id: convo_id,
            user_id: user_id,
        },
        dataType: "json",
        success: function (response) {
            if (response.status === "success") {
                var msgContent = $("#msgContent");
                var rightSidebar = $("#rightSidebar");
                var convo_rooms = response.convo_rooms;
                var convo_room = convo_rooms[0];
                var user_receiver_info = convo_room.users_receiver_info;
                var textAreaHTML = "";
                var blockUnblockBtn = "";

                if (convo_room.is_blocked === "true") {
                    textAreaHTML = `
                        <p class="text-danger mb-0 fw-light">Sorry, you cannot contact this user due to blocking.</p>
                    `;
                    blockUnblockBtn = `
                        <button type="button" id="blockUserButton" class="friend-settings-btn modal-unblock" data-bs-toggle="modal" data-bs-target="#blockUser"><i class="bi bi-person-fill-slash"></i></button>
                        <p>Unblock</p>
                    `;
                } else if (convo_room.status === "block_account_by_sender" || convo_room.status === "block_account_by_receiver") {
                    textAreaHTML = `
                        <p class="text-danger mb-0 fw-light">Sorry, you cannot contact this user due to blocking.</p>
                    `;
                    blockUnblockBtn = `
                        <button type="button" id="blockUserButton" class="friend-settings-btn" disabled><i class="bi bi-person-fill-slash"></i></button>
                        <p>Block</p>
                    `;
                } else {
                    textAreaHTML = `
                        <div class="input-field">
                            <input type="text" placeholder="Aa" id="userMessageInput" autocomplete="off">
                        </div>
                    `;
                    blockUnblockBtn = `
                        <button type="button" id="blockUserButton" class="friend-settings-btn modal-block" data-bs-toggle="modal" data-bs-target="#blockUser"><i class="bi bi-person-fill-slash"></i></button>
                        <p>Block</p>
                    `;
                }

                var messageHTML = `
                    <div class="users-messages" id="messageContent"></div>
                    <form method="POST" id="messageFormSubmit" data-convoroom-id="${convo_room.convo_room_id}">
                        <div class="text-area">
                            ${textAreaHTML}
                        </div>
                    </form>
				`;

                // Determine if the current user is the sender or the receiver
                var isCurrentUserSender = user_id === convo_room.sender_id;
                var isCurrentUserReceiver = user_id === convo_room.receiver_id;
                var muteUnmuteBtn = "";

                if ((isCurrentUserSender && convo_room.sender_muted === "true") || (isCurrentUserReceiver && convo_room.receiver_muted === "true")) {
                    // Conversation is muted for the current user
                    muteUnmuteBtn = `
						<button class="friend-settings-btn unmute-convo-btn" data-convoroom-id="${convo_room.convo_room_id}">
							<i class="bi bi-bell-slash-fill"></i>
						</button>
						<p>Unmute</p>
                    `;
                } else {
                    // Conversation is not muted for the current user
                    muteUnmuteBtn = `
						<button class="friend-settings-btn mute-convo-btn" data-convoroom-id="${convo_room.convo_room_id}">
							<i class="bi bi-bell-fill"></i>
						</button>
						<p>Mute</p>
                    `;
                }
                var optionHTML = `
                    <div class="friend-section">
                        <div class="friend-info">
                            <img src="src/css/images/free-display-photos/${user_receiver_info.receiver_user_avatar}" alt="${user_receiver_info.receiver_user_avatar}">
                            <p class="user-information" data-receiver-id="${user_receiver_info.receiver_id}" data-receiver-name="${user_receiver_info.receiver_user_name}">${user_receiver_info.receiver_user_name}</p>
                        </div>
                        <div class="friend-settings">
                            <div class="row">
                                <div class="col-4">
                                    <button class="friend-settings-btn view-profile-btn" data-receiver-id="${user_receiver_info.receiver_id}"><i class="bi bi-person-circle"></i></button>
                                    <p>Profile</p>
                                </div>
                                <div class="col-4">
                                    ${muteUnmuteBtn}
                                </div>
                                <div class="col-4">
                                    <button id="deleteConvoButton" type="button" class="friend-settings-btn delete-convo-btn" data-bs-toggle="modal" data-bs-target="#deleteConversation" data-convoroom-id="${convo_room.convo_room_id}">
                                        <i class="bi bi-trash-fill"></i>
                                    </button>
                                    <p>Delete</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    ${blockUnblockBtn}
                                </div>
                                <div class="col-6">
                                    <button type="button" id="reportUserButton" class="friend-settings-btn modal-report" data-bs-toggle="modal" data-bs-target="#reportUser"><i class="bi bi-exclamation-triangle-fill"></i></button>
                                    <p>Report</p>
                                </div>
                            </div>
                        </div>
                    </div>
				`;
                rightSidebar.append(optionHTML);
                msgContent.html(messageHTML);

                // $('#emojiInputContainer').emojioneArea({
                //     pickerPosition: "top",
                //     toneStyle: "bullet",
                //     filtersPosition: "bottom",
                //     hidePickerOnBlur: false,
                //     tones: true
                // });
            }
        },
        error: function (xhr, status, error) {
            // Handle errors here
            console.log(error);
        },
    });
}

// Get messages
function loadMessages() {
    var urlParams = new URLSearchParams(window.location.search);
    var convo_id = urlParams.get("message");
    var user_id = $(".user-index").attr("data-userid");

    $.ajax({
        url: "actions/user-messages-pages/get-messages.php",
        method: "POST",
        data: {
            convo_id: convo_id,
            user_id: user_id,
        },
        dataType: "json",
        success: function (response) {
            var messageContent = $('#messageContent');
            messageContent.empty();
            if (response.status === "success") {
                var messagesHTML = "";
                var currentUserID = user_id;
                var messages = response.get_messages;

                for (var i = 0; i < messages.length; i++) {
                    var message = messages[i];
                    var isSender = message.sender_id === currentUserID;

                    if (message.messages.trim() !== "") {
                        var avatar = isSender ? message.users_info.sender_user_avatar : message.users_info.receiver_user_avatar;
                        
                        if (isSender) {
                            messagesHTML += `
                                <div class="message-wrapper">
                                    <div class="message sender">
                                        <div class="message-content">
                                            <p>${message.messages}</p>
                                        </div>
                                        <img class="avatar" src="src/css/images/free-display-photos/${avatar}" alt="${avatar}">
                                    </div>
                                </div>
                            `;
                        } else {
                            messagesHTML += `
                                <div class="message-wrapper">
                                    <div class="message receiver">
                                        <img class="avatar" src="src/css/images/free-display-photos/${avatar}" alt="${avatar}">
                                        <div class="message-content">
                                            <p>${message.messages}</p>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                        
                    }
                }
                messageContent.prepend(messagesHTML);
            } else {
                // Handle other statuses here
                console.log("Error: " + response.message);
            }
        },
        error: function (xhr, status, error) {
            // Handle errors here
            console.log(error);
        },
    });
}

function submitMessage() {
    $(document).on("submit", "#messageFormSubmit", function (event) {
        event.preventDefault();
        var message_input = $("#userMessageInput").val();
        var convo_id = $(this).data("convoroom-id");

        $.ajax({
            url: "actions/user-messages-pages/user-submit-message.php",
            method: "POST",
            data: {
                message_input: message_input,
                convo_id: convo_id,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var messageContent = $("#messageContent");

                    var messageHTML = `
						<div class="message-wrapper">
							<div class="message sender">
								<div class="message-content">
									<p>${response.message_input}</p>
								</div>
								<img class="avatar" src="src/css/images/free-display-photos/${response.sender_avatar}" alt="${response.sender_avatar}">
							</div>
						</div>
                    `;
                    messageContent.prepend(messageHTML);
                    $("#userMessageInput").val("");
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors here
                console.log(error);
            },
        });
    });
}

// Mute and Unmute Conversation
function muteUnmuteConversation() {
    // Mute Conversation [in Conversation]
    $(document).on("click", ".mute-convo-btn", function () {
        var button = $(this);
        var convo_room_id = $(this).data("convoroom-id");

        $.ajax({
            url: "actions/user-messages-pages/user-conversation-mute.php",
            method: "POST",
            data: { convo_room_id: convo_room_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    button.html('<i class="bi bi-bell-slash-fill"></i>');
                    button.removeClass("mute-convo-btn").addClass("unmute-convo-btn");
                    button.next("p").text("Unmute");
                    $('#chatListContainer').find('[data-convoroom-id='+convo_room_id+']').text('Unmute notifications');
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors here
                console.log(error);
            },
        });
    });

    // Unmute Conversation [in Conversation]
    $(document).on("click", ".unmute-convo-btn", function () {
        var button = $(this);
        var convo_room_id = $(this).data("convoroom-id");
        $.ajax({
            url: "actions/user-messages-pages/user-conversation-unmute.php",
            method: "POST",
            data: { convo_room_id: convo_room_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    button.html('<i class="bi bi-bell-fill"></i>');
                    button.removeClass("unmute-convo-btn").addClass("mute-convo-btn");
                    button.next("p").text("Mute");
                    $('#chatListContainer').find('[data-convoroom-id='+convo_room_id+']').text('Mute notifications');
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors here
                console.log(error);
            },
        });
    });

    // Mute Conversation [in Chat List]
    $(document).on("click", ".mute-convoBtn", function () {
        var button = $(this);
        var convo_room_id = $(this).data("convoroom-id");

        $.ajax({
            url: "actions/user-messages-pages/user-conversation-mute.php",
            method: "POST",
            data: { convo_room_id: convo_room_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    button.removeClass("mute-convoBtn").addClass("unmute-convoBtn");
                    button.text("Unmute notifications");
                    
                    var sidebarBtn = $('#rightSidebar').find('.mute-convo-btn[data-convoroom-id="' + convo_room_id + '"]');
                    sidebarBtn.find('i').removeClass('bi-bell-fill').addClass('bi-bell-slash-fill');
                    sidebarBtn.next('p').text('Unmute');
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors here
                console.log(error);
            },
        });
    });

    // Unmute Conversation [in Chat List]
    $(document).on("click", ".unmute-convoBtn", function () {
        var button = $(this);
        var convo_room_id = $(this).data("convoroom-id");
        $.ajax({
            url: "actions/user-messages-pages/user-conversation-unmute.php",
            method: "POST",
            data: { convo_room_id: convo_room_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    button.removeClass("unmute-convoBtn").addClass("mute-convoBtn");
                    button.text("Mute notifications");

                    var sidebarBtn = $('#rightSidebar').find('.mute-convo-btn[data-convoroom-id="' + convo_room_id + '"]');
                    sidebarBtn.find('i').removeClass('bi-bell-slash-fill').addClass('bi-bell-fill');
                    sidebarBtn.next('p').text('Mute')
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors here
                console.log(error);
            },
        });
    });

    // Mute All Conversation
    $(document).on("click", "#muteAllConversation", function () {
        var user_id = $('.user-index').data("userid");
        $.ajax({
            url: "actions/user-messages-pages/user-mute-all.php",
            method: "POST",
            data: { user_id: user_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    $(".mute-convoBtn").removeClass("mute-convoBtnn").addClass("unmute-convoBtn");
                    $(".unmute-convoBtn").text("Unmute notifications");

                    $(".mute-convo-btn").removeClass("mute-convo-btn").addClass("unmute-convo-btn");
                    $(".unmute-convo-btn").html('<i class="bi bi-bell-slash-fill"></i>');
                    $(".unmute-convo-btn").next("p").text("Unmute");
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors here
                console.log(error);
            },
        });
    });

    // Mute All Conversation
    $(document).on("click", "#unmuteAllConversation", function () {
        var user_id = $('.user-index').data("userid");

        $.ajax({
            url: "actions/user-messages-pages/user-unmute-all.php",
            method: "POST",
            data: { user_id: user_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    $(".unmute-convoBtn").removeClass("unmute-convoBtnn").addClass("mute-convoBtn");
                    $(".mute-convoBtn").text("Mute notifications");

                    $(".unmute-convo-btn").removeClass("unmute-convo-btn").addClass("mute-convo-btn");
                    $(".mute-convo-btn").html('<i class="bi bi-bell-fill"></i>');
                    $(".mute-convo-btn").next("p").text("Mute");
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors here
                console.log(error);
            },
        });
    });
}

// Delete Conversation
function deleteConversation() {
    // Open Modal
    $(document).on("click", ".delete-convo-btn", function (event) {
        event.preventDefault();
        var modalDialog = $("#deleteConvoDialog");

        var modalHTML = `
			<div class="modal-content modal-delete-convo">
				<div class="modal-header">
					<h1 class="modal-title fs-5">Delete Conversation</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<p class="mb-0 fw-light">Are you sure that you want to delete your conversation?</p>
				</div>
				<div class="modal-footer">
					<button type="button" class="modal-opt-btn" data-bs-dismiss="modal">No</button>
					<button type="button" class="modal-opt-btn delete-convo">Yes</button>
				</div>
			</div>
		`;

        if (modalDialog.children().length > 0) {
            modalDialog.empty();
        }
        modalDialog.append(modalHTML);
    });

    // If click yes, convo will delete [In conversation]
    $(document).on("click", ".delete-convo", function (event) {
        event.preventDefault();
        var convo_room_id = $("#deleteConvoButton").data("convoroom-id");
        $.ajax({
            url: "actions/user-messages-pages/user-conversation-delete.php",
            method: "POST",
            data: { convo_room_id: convo_room_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var liElement = $("#chatListContainer").find(`[data-messageid="${convo_room_id}"]`).closest(".chat-list");
                    liElement.fadeOut("slow", function () {
                        liElement.remove();
                    });
                    var msgContent = $("#msgContent");
                    var rightSidebar = $("#rightSidebar");

                    msgContent.empty();
                    rightSidebar.empty();
                    $('#deleteConversation').modal('hide');
                    window.history.pushState(window.location.href,"Messages | Gamer's Nest","/gamers-nest/user-conversation-page.php"
                    );
                } else {
                    // Handle the error or display a message if needed
                    console.error(response.message);
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors here
                console.log(error);
            },
        });
    });

    // If click yes, convo will delete [In chat list]
    $(document).on("click", ".deleteConvo", function (event) {
        event.preventDefault();
        var urlParams = new URLSearchParams(window.location.search);
        var url_convo_room_id = urlParams.get("message");
        var convo_room_id = $(this).data('convoroom-id');

        $.ajax({
            url: "actions/user-messages-pages/user-conversation-delete.php",
            method: "POST",
            data: { convo_room_id: convo_room_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var liElement = $("#chatListContainer").find(`[data-messageid="${convo_room_id}"]`).closest(".chat-list");
                    liElement.fadeOut("slow", function () {
                        liElement.remove();
                    });

                    var msgContent = $("#msgContent");
                    var rightSidebar = $("#rightSidebar");

                    if (url_convo_room_id == convo_room_id) {
                        msgContent.empty();
                        rightSidebar.empty();
                    }

                    window.history.pushState(window.location.href,"Messages | Gamer's Nest","/gamers-nest/user-conversation-page.php"
                    );
                } else {
                    // Handle the error or display a message if needed
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

// Block User
function blockUser() {
    // Open Modal [Block User]
    $(document).on("click", ".modal-block", function (event) {
        event.preventDefault();
        var receiver_name = $('.user-information').data("receiver-name");
        var receiver_id = $('.user-information').data("receiver-id");
        var modalDialog = $("#blockUserDialog");

        var modalHTML = `
            <div class="modal-content modal-block-user-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Block ${receiver_name}?</h1>
                </div>
                <div class="modal-body">
                    <p class="mb-0 fw-light">By blocking this user, you've prevented them from sending you messages.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="modal-opt-btn" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="modal-opt-btn block-user">Understood</button>
                </div>
            </div>
        `;

        if (modalDialog.children().length > 0) {
            modalDialog.empty();
        }
        modalDialog.append(modalHTML);
        $('#chatListContainer').find('.block-user').text('Unblock');
    });

    // If click understood, user will [Block User]
    $(document).on("click", ".block-user", function (event) {
        event.preventDefault();
        var urlParams = new URLSearchParams(window.location.search);
        var convo_room_id = urlParams.get("message");

        $.ajax({
            url: "actions/user-messages-pages/user-message-block.php",
            method: "POST",
            data: { convo_room_id: convo_room_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var textArea = $('.text-area');
                    var deleteButton = $('#blockUserButton');

                    var newHTML = `
                        <p class="text-danger mb-0 fw-light">Sorry, you cannot contact this user due to blocking.</p>
                    `;

                    deleteButton.removeClass("modal-block").addClass("modal-unblock");
                    deleteButton.next("p").text("Unblock");

                    textArea.empty();
                    textArea.append(newHTML);

                    $("#blockUser").modal("hide");
                    $('#chatListContainer').find('.modal-block').text('Unblock');
                    $('#chatListContainer').find('.modal-block').removeClass("modal-block").addClass("modal-unblock");
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

    // Open Modal [Unblock User]
    $(document).on("click", ".modal-unblock", function (event) {
        event.preventDefault();
        var receiver_name = $('.user-information').data("receiver-name");
        var receiver_id = $('.user-information').data("receiver-id");
        var modalDialog = $("#blockUserDialog");

        var modalHTML = `
            <div class="modal-content modal-block-user-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Unblock ${receiver_name}?</h1>
                </div>
                <div class="modal-body">
                    <p class="mb-0 fw-light">You will be able to contact this user now as they have been unblocked.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="modal-opt-btn" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="modal-opt-btn unblock-user">Understood</button>
                </div>
            </div>
        `;

        if (modalDialog.children().length > 0) {
            modalDialog.empty();
        }
        modalDialog.append(modalHTML);
    });

    // If click understood, user will [Unblock User]
    $(document).on("click", ".unblock-user", function (event) {
        event.preventDefault();
        var urlParams = new URLSearchParams(window.location.search);
        var convo_room_id = urlParams.get("message");

        $.ajax({
            url: "actions/user-messages-pages/user-message-unblock.php",
            method: "POST",
            data: { convo_room_id: convo_room_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var textArea = $('.text-area');
                    var deleteButton = $('#blockUserButton');

                    var newHTML = `
                        <div class="input-field">
                            <input type="text" placeholder="Aa" id="userMessageInput" autocomplete="off">
                        </div>
                    `;

                    deleteButton.removeClass("modal-unblock").addClass("modal-block");
                    deleteButton.next("p").text("Block");

                    textArea.empty();
                    textArea.append(newHTML);

                    $("#blockUser").modal("hide");
                    $('#chatListContainer').find('.modal-unblock').text('Block');
                    $('#chatListContainer').find('.modal-unblock').removeClass("modal-unblock").addClass("modal-block");
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

// Report User
function reportUser() {
    // Open Modal [Report User]
    $(document).on("click", ".modal-report", function () {
        var receiver_name = $('.user-information').data("receiver-name");
        var modalDialog = $("#reportUserDialog");
        var modalHTML = `
            <div class="modal-content modal-report-user">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Report ${receiver_name} </h1>
                </div>
                <div class="modal-body">
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Harassment or Bullying">Harassment or Bullying</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Hate Speech or Discrimination">Hate Speech or Discrimination</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Inappropriate Content">Inappropriate Content</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Spam or Scams">Spam or Scams</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Cheating or Hacking">Cheating or Hacking</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Impersonation">Impersonation</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Personal Information">Personal Information</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Threats or Violence">Threats or Violence</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Off-Topic Content">Off-Topic Content</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Trolling or Flamebait">Trolling or Flamebait</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Unsportsmanlike Behavior">Unsportsmanlike Behavior</button>
                        <i class="bi bi-arrow-return-left"></i>
                    </div>
                    <div class="report-option">
                        <button type="button" class="btn-report-option" data-bs-target="#reportUserSecondModal" data-bs-toggle="modal" data-report-option="Privacy Violation">Privacy Violation</button>
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
                <button type="button" class="modal-opt-btn confirm-report">Confirm</button>
            </div>
        `;
        $('#reportUserSecondModal .modal-content').append(reportDetailHTML);
    });
    
    // Event listener for confirming the report
    $(document).on("click", ".confirm-report", function() {
        var report_content = $('.report-details').text();
        var current_user_id = $(".user-index").attr("data-userid");
        var report_user_id = $(".user-information").attr("data-receiver-id");

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

// Search Conversation
function searchConversation() {
    $(document).on("input", "#searchConversation", function () {
        var current_user_id = $('.user-index').attr('data-userid');
        var input = $(this).val();
        var chatListContainer = $("#chatListContainer");
        chatListContainer.empty();
        if (input !== "") {
            $.ajax({
                method: "POST",
                url: "actions/user-messages-pages/user-search-conversation.php",
                data: {
                    input: input
                },
                dataType: "json",
                success: function (response) {
                    if (response.status === "success") {
                        response.convo_rooms.forEach(function (convoRoom) {

                            var usersnameHTML = "";
                            if (current_user_id !== convoRoom.sender_id) {
                                usersnameHTML = `<p class="user-name">${convoRoom.sender_username}</p>`;
                            } else {
                                usersnameHTML = `<p class="user-name">${convoRoom.receiver_username}</p>`;
                            }
                            var htmlElement = `
                                <li class="chat-list">
                                    <a class="btn-message" href="user-conversation-page.php?message=${convoRoom.convo_room_id}" data-messageid="${convoRoom.convo_room_id}" data-receiverid="${convoRoom.receiver_id}">
                                        <div class="user-img d-flex justify-content-center">
                                            <img class="display-img" src="src/css/images/free-display-photos/${convoRoom.receiver_avatar}" alt="${convoRoom.receiver_avatar}">
                                        </div>
                                        <div class="name-msg">
                                            ${usersnameHTML}
                                            <p class="user-curmsg">${convoRoom.sender_name}: ${convoRoom.last_message}<span class="text-danger fw-normal"> ${getTimeAgoString(convoRoom.last_message_time)}</span></p>
                                        </div>
                                    </a>
                                    <div class="msg-option">
                                        <a class="btn-message" href="user-conversation-page.php?message=${convoRoom.convo_room_id}" data-messageid="${convoRoom.convo_room_id}" data-receiverid="${convoRoom.receiver_id}"></a>
                                        <a class="option-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-three-dots"></i>
                                        </a>
                                        <ul class="dropdown-menu">
                                            <button type="button" class="dropdown-item modal-block" data-bs-toggle="modal" data-bs-target="#blockUser">Block</button>
                                            <button type="buton" class="dropdown-item deleteConvo" data-convoroom-id="${convoRoom.convo_room_id}">Delete conversation</button>
                                            <button class="dropdown-item mute-convoBtn" data-convoroom-id="${convoRoom.convo_room_id}">Mute notifications</button>
                                            <button class="dropdown-item view-profile-btn" data-receiver-id="${convoRoom.receiver_id}">View Profile</button>
                                        </ul>
                                    </div>
                                </li>
                            `;
                            
                            // Append the HTML element to the chat list container
                            chatListContainer.append(htmlElement);
                        });
                    } else {
                        chatListContainer.html('<p class="no-conversation">No conversation found.</p>');
                    }
                },
                error: function (xhr, status, error) {
                    // Handle AJAX errors
                    console.log("AJAX request error:", error);
                }
            });
        } else {
            chatListContainer.empty();
        }
    });
}

function acceptGuildRequest() {
    // On notification
    $(document).on('click', '.j-btn', function (event) {
        event.preventDefault();
        var current_user_id = $('.user-index').attr('data-userid');
        var request_guild_id = $(this).attr('data-requested-id');
        var btnContainer = $(this).closest('.notif-group-btn'); 
        var btnText = $('<p>You are now part of the guild</p>'); 
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
                    btnContainer.html(btnText);

                // Remove the text element after 3 seconds with a fadeout effect
                setTimeout(function () {
                    btnText.fadeOut(function () {
                        btnContainer.remove();
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
											<p class="users-name">${comment.commenter_username}</p>
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
												<p>${post.author_username}</p>
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

// Guild Post/Comment -- Add and Delete
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