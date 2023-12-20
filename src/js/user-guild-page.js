$(document).ready(function () {
    loadGuilds();
    createGuild();
    requestJoinGuild();
    goToUserGuild();
    acceptGuildRequest();
    searchGuilds();
    userGuilds();
    reportUser();
    leaveGuild();
    userSettings();

    // Notification
    notifications();
    markReadNotification();
    clearNotification();

    // Profile
    goToCurrentUserPage();

    // Fetch notifications periodically (e.g., every 30 seconds)
    setInterval(notifications, 30000);
    setInterval(loadGuilds, 3000);
    setInterval(userGuilds, 3000);

    var ascending = true;
    $('.za-filter-guilds').click(function() {
        ascending = !ascending;
        var icon = $(this).find('i');
        icon.toggleClass('bi-sort-alpha-down-alt', ascending);
        icon.toggleClass('bi-sort-alpha-up', !ascending);
        sortGuilds(ascending);
    });
});

// View Profile
function goToCurrentUserPage() {
    // View Current User Profile
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

// Create Guild
function createGuild() {
    // Open Modal
    $(document).on("click", "#createGuildModal", function () {
        guildMemberSuggestions();
        var modalDialog = $("#createGuildDialog");
        var modalHTML = `
            <div class="modal-content create-guild-content">
                <form method="POST" id="createGuildForm">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5 fw-bolder">Create Guild</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col">
                                <p class="mb-0">Guild Name:</p>
                                <input type="text" id="guildName" class="mb-3" placeholder="Enter your guild name" autocomplete="off">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <p class="mb-0">Guild Description:</p>
                                <textarea type="text" id="guildDescription" class="mb-3" cols="40" rows="4" placeholder="Enter a brief guild description (at least 30 words)" autocomplete="off"></textarea>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <p class="mb-0">Members:</p>
                                <input type="text" id="guildMembers" placeholder="Invite people" autocomplete="off">
                                <ul id="memberSuggestions" class="member-suggestions"></ul>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="modal-opt-btn" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="modal-opt-btn">Create</button>
                    </div>
                </form>
            </div>
        `;

        if (modalDialog.children().length > 0) {
            modalDialog.empty();
        }
        modalDialog.append(modalHTML);
    });

    // Create Guild
    $(document).on("submit", "#createGuildForm", function (event) {
        event.preventDefault();

        var current_user_id = $('.user-index').attr('data-userid');
        var guildName = $('#guildName').val();
        var guildDescription = $('#guildDescription').val();
        var guildMembers = $('#guildMembers').val();
        var form = $(this);
        $('#createGuildDialog .display-error').remove();

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/user-create-guild.php",
            data: {
                current_user_id: current_user_id,
                guild_name: guildName,
                guild_description: guildDescription,
                guild_members: guildMembers
            },
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    var successMessage = $('<p class="text-center text-success mb-0 fw-semibold" id="successMessage">Guild created successfully!</p>');
                    
                    $('.display-error').remove();
                    form.find('.modal-body .row').remove();
                    form.find('.modal-footer').remove();
                    form.find('.modal-body').append(successMessage);
                
                    setTimeout(function () {
                        successMessage.fadeOut(function () {
                            successMessage.text("Please wait a moment...").fadeIn();
                            setTimeout(function () {
                                successMessage.fadeOut(function () {
                                    var guildPage = "user-guild-page.php?/gn/"+response.guild_name+"/id/"+response.guild_id;
                                    window.location.href = guildPage;
                                });
                            }, 2000);
                        });
                    }, 2000);
                } else {
                    var errorDisplay = `
                        <div class="row">
                            <div class="col">
                                <p class="mb-4 mt-5 display-error text-center">${response.message}</p>
                            </div>
                        </div>
                    `;
                    $('#createGuildDialog .modal-body').append(errorDisplay);
                    $('#createGuildDialog .display-error').delay(3000).fadeOut(500, function () {
                        $(this).remove();
                    });
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });
}

// Display Guild Member Suggestions
function guildMemberSuggestions() {
    $(document).on("click", "#guildMembers", function (event) {
        event.preventDefault();
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
    $(document).on("click", function (event) {
        var suggestionsList = $("#memberSuggestions");
        if (!event.target.matches("#guildMembers")) {
            suggestionsList.hide();
        }
    });

    // Add selected suggestion to the input when clicking on it
    $(document).on("click", "#memberSuggestions li", function (event) {
        event.preventDefault();
        var selectedSuggestion = $(this).text().trim();
        var guildMembersInput = $("#guildMembers");
        var currentMembers = guildMembersInput.val().split(",").map(member => member.trim());
    
        // Check if the suggestion is not already present and if there's room for more suggestions
        if (!currentMembers.includes(selectedSuggestion) && currentMembers.length <= 5) {
            if (guildMembersInput.val().trim() !== '') {
                guildMembersInput.val(guildMembersInput.val().trim() + ", " + selectedSuggestion);
            } else {
                guildMembersInput.val(selectedSuggestion);
            }
        }
        $("#memberSuggestions").hide();
    });
}

function loadGuilds() {
    var current_user_id = $('.user-index').attr('data-userid');
    $.ajax({
        url: "actions/user-guilds-page/get-guilds.php",
        type: "POST",
        dataType: "json",
        success: function (response) {
            var guildsContainer = $('#guildsContainer');
            guildsContainer.empty();
            if (response.status === "success") {
                var guilds = response.guilds;

                if (guilds.length === 0) {
                    guildsContainer.html('<p class="display-error">'+response.message+'</p>');
                } else {
                    $.each(guilds, function (i, guild) { 
                        var guildOption = '';
                        if (current_user_id === guild.guild_creator_id || guild.is_member === true) {
                            guildOption = `
                                <div class="card-footer d-flex">
                                    <a class="view-guild-btn" data-guild-name="${guild.guild_name}" data-guild-id="${guild.guild_id}">View</a>
                                    <button type="button" class="ms-2 guild-option-btn" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
                                    <ul class="dropdown-menu py-1" data-popper-placement="right-end">
                                        <li><button type="button" class="dropdown-item leave-guild-btn" data-bs-toggle="modal" data-bs-target="#leaveGuild" data-user-id="${current_user_id}" data-guild-id="${guild.guild_id}">Leave Guild</button></li>
                                    </ul>
                                </div>
                            `;
                        } else {

                            if (guild.guild_request === "guild_invitation") {
                                guildOption = `
                                    <div class="card-footer d-flex">
                                        <button class="accept-join-btn" data-requested-id="${guild.request_guild_id}">Accept Guild Invite</button>
                                        <button type="button" class="ms-2 guild-option-btn" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
                                        <ul class="dropdown-menu py-1" style="">
                                            <li><button class="dropdown-item guild-req-btn">Remove Invite Request</button></li>
                                        </ul>
                                    </div>
                                `;
                            } else if (guild.guild_request === "requested_to_join_guild") {
                                guildOption = `
                                    <div class="card-footer d-flex">
                                        <button class="req-inv-btn" data-requested-id="${guild.request_guild_id}">Join Requested</button>
                                    </div>
                                `;
                            } else {
                                guildOption = `
                                    <div class="card-footer d-flex">
                                        <button class="join-guild-btn">Ask to join</button>
                                        <button type="button" class="ms-2 guild-option-btn" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
                                        <ul class="dropdown-menu py-1" data-popper-placement="right-end">
                                            <li>
                                                <button type="button" id="reportUserButton" class="dropdown-item menu-option modal-report" data-bs-toggle="modal" data-bs-target="#reportUser" data-reported-id="${guild.guild_creator_id}" data-reportedname="${guild.creator_name}">Report</button>
                                            </li>
                                        </ul>
                                    </div>
                                `;
                            }
                        }

                        var cardHTML = `
                            <div class="card" data-guild-id="${guild.guild_id}" style="background-image: url(src/css/images/guilds-media/guild-banners/${guild.guild_banner});">
                                <div class="card-body">
                                    <h5 class="card-title fw-semibold">${guild.guild_name}</h5>
                                    <p class="card-text">${guild.guild_description}</p>
                                </div>
                                ${guildOption}
                            </div>
                        `;
                        guildsContainer.append(cardHTML);
                        sortGuilds(true);
                    });
                }
            } else {
                guildsContainer.css({
                    alignItems: "center",
                    height: "100%"
                });
                guildsContainer.html("<p class='display-error mt-0 fs-5'>There are no guilds available.</p>");
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        },
    });
}

function sortGuilds(ascending) {
    var guildsContainer = $('#guildsContainer');
    var guildCards = guildsContainer.find('.card');

    guildCards.sort(function(a, b) {
        var titleA = $(a).find('.card-title').text().toUpperCase();
        var titleB = $(b).find('.card-title').text().toUpperCase();

        if (ascending) {
            return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
        } else {
            return (titleA > titleB) ? -1 : (titleA < titleB) ? 1 : 0;
        }
    });

    guildCards.detach().appendTo(guildsContainer);
}

function requestJoinGuild() {
    // Request to Join
    $(document).on('click', '.join-guild-btn', function (event) {
        event.preventDefault();
        var current_user_id = $('.user-index').attr('data-userid');
        var guild_id = $(this).closest('.card').attr('data-guild-id');
        var joinButton = $(this);

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/user-request-join-guild.php",
            data: {
                current_user_id: current_user_id,
                guild_id: guild_id
            },
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    var cardFooter = joinButton.closest('.card-footer');

                    joinButton.removeClass("join-guild-btn").addClass("req-inv-btn");
                    joinButton.text("Join Requested");

                    joinButton.attr('data-requested-id', response.request_guild_id);

                    cardFooter.find('.dropdown-item').addClass("guild-req-btn");
                    cardFooter.find('.dropdown-item').text("Cancel Request");
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });

    // Cancel Request
    $(document).on('click', '.req-inv-btn', function (event) {
        event.preventDefault();
        var current_user_id = $('.user-index').attr('data-userid');
        var guild_id = $(this).closest('.card').attr('data-guild-id');
        var join_request_id = $(this).attr('data-requested-id');
        var cancelButton = $(this);

        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/user-cancel-request.php",
            data: {
                current_user_id: current_user_id,
                guild_id: guild_id,
                join_request_id: join_request_id
            },
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    var cardFooter = cancelButton.closest('.card-footer');

                    cancelButton.removeClass("req-inv-btn").addClass("join-guild-btn");
                    cancelButton.text("Ask to Join");

                    cancelButton.removeAttr("data-requested-id");

                    cardFooter.find('.dropdown-item').removeClass("guild-req-btn");
                    cardFooter.find('.dropdown-item').text("Report");
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });

    $(document).on('click', '.guild-req-btn', function (event) {
        event.preventDefault();
        var current_user_id = $('.user-index').attr('data-userid');
        var guild_id = $(this).closest('.card').attr('data-guild-id');
        var join_request_id = $(this).closest('.card-footer').find('.accept-join-btn').attr('data-requested-id');
        var cancelButton = $(this);
        
        $.ajax({
            method: "POST",
            url: "actions/user-guilds-page/user-cancel-request.php",
            data: {
                current_user_id: current_user_id,
                guild_id: guild_id,
                join_request_id: join_request_id
            },
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    var mainBtn = cancelButton.closest('.card-footer').find('.accept-join-btn');
                    mainBtn.removeClass("accept-join-btn").addClass("join-guild-btn");
                    mainBtn.removeAttr("data-requested-id");
                    mainBtn.text("Ask to Join")
                    cancelButton.text("Report");
                    cancelButton.find('.dropdown-item').removeClass("guild-req-btn");
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });
}

function acceptGuildRequest() {
    // On card
    $(document).on('click', '.accept-join-btn', function (event) {
        event.preventDefault();
        var current_user_id = $('.user-index').attr('data-userid');
        var request_guild_id = $(this).attr('data-requested-id');

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
                    var userGuildPage = "/gamers-nest/user-guild-page.php?/gn/"+guild_name+"/id/"+guild_id;
                    setTimeout(function () {
                        window.location.href = userGuildPage;
                    }, 1000);
                }
            },
            error: function (xhr, status, error) {
                console.log("AJAX Error:", error);
            }
        });
    });

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

function goToUserGuild() {
    // User guild page
    $(document).on('click', '.view-guild-btn', function () {
        var guild_id = $(this).attr('data-guild-id');
        var guild_name = $(this).attr('data-guild-name');

        var userGuildPage = "/gamers-nest/user-guild-page.php?/gn/" + guild_name + "/id/" + guild_id;
        window.location.href = userGuildPage;
    });
}

function searchGuilds() {
    $(document).on("input", "#searchAllGuilds", function () {
        var current_user_id = $('.user-index').attr('data-userid');
        var input = $(this).val();

        var guildsContainer = $("#guildsContainer");
        guildsContainer.empty();

        if (input !== "") {
            $.ajax({
                method: "POST",
                url: "actions/user-guilds-page/user-search-all-guilds.php",
                data: {
                    input: input
                },
                dataType: "json",
                success: function (response) {
                    if (response.status === "success") {
                        response.guilds_information.forEach(function (guild) {
                            var guildOption = '';
                            if (current_user_id === guild.guild_creator_id) {
                                guildOption = `
                                    <div class="card-footer d-flex">
                                        <a class="view-guild-btn" data-guild-name="${guild.guild_name}" data-guild-id="${guild.guild_id}">View</a>
                                        <button type="button" class="ms-2 guild-option-btn" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
                                        <ul class="dropdown-menu py-1" data-popper-placement="right-end">
                                            <li><button class="dropdown-item" href="#">Remove Guild</button></li>
                                        </ul>
                                    </div>
                                `;
                            } else {
                                if (guild.guild_request === "guild_invitation") {
                                    guildOption = `
                                        <div class="card-footer d-flex">
                                            <button class="accept-join-btn" data-requested-id="${guild.request_guild_id}">Accept Guild Invite</button>
                                            <button type="button" class="ms-2 guild-option-btn" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
                                            <ul class="dropdown-menu py-1" style="">
                                                <li><button class="dropdown-item guild-req-btn">Remove Invite Request</button></li>
                                            </ul>
                                        </div>
                                    `;
                                } else if (guild.guild_request === "requested_to_join_guild") {
                                    guildOption = `
                                        <div class="card-footer d-flex">
                                            <button class="req-inv-btn" data-requested-id="${guild.request_guild_id}">Join Requested</button>
                                        </div>
                                    `;
                                } else {
                                    guildOption = `
                                        <div class="card-footer d-flex">
                                            <button class="join-guild-btn">Ask to join</button>
                                            <button type="button" class="ms-2 guild-option-btn" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
                                            <ul class="dropdown-menu py-1" data-popper-placement="right-end">
                                                <button type="button" id="reportUserButton" class="dropdown-item menu-option modal-report" data-bs-toggle="modal" data-bs-target="#reportUser" data-reported-id="${guild.guild_creator_id}" data-reportedname="${guild.creator_name}">Report</button>
                                            </ul>
                                        </div>
                                    `;
                                }
                            }

                            var cardHTML = `
                                <div class="card" data-guild-id="${guild.guild_id}" style="background-image: url(src/css/images/guilds-media/guild-banners/${guild.guild_banner});">
                                    <div class="card-body">
                                        <h5 class="card-title fw-semibold">${guild.guild_name}</h5>
                                        <p class="card-text">${guild.guild_description}</p>
                                    </div>
                                    ${guildOption}
                                </div>
                            `;
                            guildsContainer.append(cardHTML);
                        });
                    } else {
                        guildsContainer.css({
                            alignItems: "center",
                            height: "100%"
                        });
                        guildsContainer.html('<p class="display-error mt-0 fs-5">No guilds found</p>');
                    }
                },
                error: function (xhr, status, error) {
                    // Handle AJAX errors
                    console.log("AJAX request error:", error);
                }
            });
        } else {
            guildsContainer.css({
                alignItems: "center",
                height: "100%"
            });
            guildsContainer.html('<p class="display-error mt-0 fs-5">No guilds found</p>');
        }
    });
}

function userGuilds() {
    var current_user_id = $('.user-index').attr('data-userid');
    $.ajax({
        url: "actions/user-guilds-page/get-user-guilds.php",
        data: { current_user_id: current_user_id },
        type: "POST",
        dataType: "json",
        success: function (response) {
            var guildsContainer = $('#myguildsContainer');
            // guildsContainer.empty();
            if (response.status === "success") {
                var guilds = response.guilds_information;
                var guildsDisplayed = false;
                guildsContainer.empty();

                $.each(guilds, function (i, guild) {
                    if (guild.is_creator === true || guild.is_member === true) {
                        guildsDisplayed = true;
                        var cardHTML = `
                            <div class="card" data-guild-id="${guild.guild_id}" style="background-image: url(src/css/images/guilds-media/guild-banners/${guild.guild_banner});">
                                <div class="card-body">
                                    <h5 class="card-title fw-semibold">${guild.guild_name}</h5>
                                    <p class="card-text">${guild.guild_description}</p>
                                </div>
                                <div class="card-footer d-flex">
                                    <a class="view-guild-btn" data-guild-name="${guild.guild_name}" data-guild-id="${guild.guild_id}">View</a>
                                    <button type="button" class="ms-2 guild-option-btn" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-three-dots"></i></button>
                                    <ul class="dropdown-menu py-1" data-popper-placement="right-end">
                                        <li><button type="button" class="dropdown-item leave-guild-btn" data-bs-toggle="modal" data-bs-target="#leaveGuild" data-user-id="${current_user_id}" data-guild-id="${guild.guild_id}">Leave Guild</button></li>
                                    </ul>
                                </div>
                            </div>
                        `;
                        guildsContainer.append(cardHTML);
                    }
                });
                // If no guilds were displayed, show the "No guilds" message
                if (!guildsDisplayed) {
                    guildsContainer.css({
                        alignItems: "center",
                        height: "100%"
                    });
                    guildsContainer.html("<p class='display-error mt-0 fs-5'>You currently have no guilds to display.</p>");
                }
            } else {
                guildsContainer.css({
                    alignItems: "center",
                    height: "100%"
                });
                guildsContainer.html("<p class='display-error mt-0 fs-5'>You currently have no guilds to display.</p>");
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
        var receiver_name = $('.modal-report').data("reportedname");
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
        var report_user_id = $(".posted-feed").attr("data-postuser-id");

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
                console.log(error);
            },
        });
    });
}

function leaveGuild() {
    $(document).on('click', '.leave-guild-btn', function () {
        var current_user_id = $(this).attr('data-user-id');
        var guild_id = $(this).attr('data-guild-id');

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
                                <p class="m-0">Your decision to leave the <span class="fw-semibold text-danger">${guild.guild_name}</span> will trigger the guild's removal, along with kicking out all members. Are you sure you want to leave the guild?</p>
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
                                <p class="m-0">Are you sure you want to leave the <span class="fw-semibold text-danger">${guild.guild_name}</span>?</p>
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