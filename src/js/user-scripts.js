$(document).ready(function () {
    // Profile
    loadCurrentUserPage();
    editUserProfile();
    reportUserAccount();
    blockUsersAccount();
    followsUsers();

    // Notification
    notifications();
    markReadNotification();
    clearNotification();
    acceptGuildRequest();

    setInterval(notifications, 30000);
    setInterval(loadFollowers, 3000);
    setInterval(loadFollowing, 3000);

    // User Post
    userCreatPost();
    load_posts();
    getUsersPostOnModal();
    getUsersSharedPostOnModal();
    addComment();
    deleteComment();
    deletePost();
    likeButton();
    modalGetSharePostData();
    sharePost();
    sharedPostAddComment();
    getUsersGuildPostOnModal();
    guildPostsComments();
    followerFollowing();
    userSettings();
    loadFollowers();
    loadFollowing();
});

// Display Profile
function loadCurrentUserPage() {
    var urlParams = new URLSearchParams(window.location.search);
    var user_id = urlParams.get("user_id");

    var current_user_id = $(".user-index").attr("data-userid");

    $.ajax({
        url: "actions/get-user-information.php",
        method: "POST",
        data: {
            user_id: user_id,
            current_user_id: current_user_id
        },
        dataType: "json",
        success: function (response) {
            if (response.status === "success") {
                var mainContainer = $("#mainContainer");
                var profileEdit = "";
                var profilePostHTML = "";
                var postFeeds = '';
                var blockOption = '';

                // Check for blocking
                if (current_user_id === response.user_id) { // current user id is equal to URL user id
                    postFeeds = `
                        <div class="feeds" id="postFeeds">
                            <!-- Display all users posts here -->
                        </div>
                    `;
                    blockOption = '';
                } else if (response.blocked_user_id == user_id) { // blocked user id is equal to URL user id
                    postFeeds = `
                        <div class="feeds">
                            <p class="block-message">Unblock ${response.username} to view his/her profile.</p>
                        </div>
                    `;
                    blockOption = `
                        <button type="button" id="blockUserAccButton" class="action-button modal-unblock-useracc" data-bs-toggle="modal" data-bs-target="#unblockUserAccount">
                            <i class="bi bi-person-fill-slash me-3"></i>
                            <label>Unblock</label>
                        </button>
                    `;
                } else if (response.blocking_user_id == user_id) { // blocking user id is equal to URL user id
                    postFeeds = `
                        <div class="feeds">
                            <p class="block-message">Sorry, you cannot view this user due to blocking.</p>
                        </div>
                    `;
                    blockOption = `
                        <button type="button" class="action-button">
                            <i class="bi bi-person-fill-slash me-3"></i>
                            <label>Block</label>
                        </button>
                    `;
                } else { 
                    postFeeds = `
                        <div class="feeds" id="postFeeds">
                            <!-- Display all users posts here -->
                        </div>
                    `;
                    blockOption = `
                        <button type="button" id="blockUserAccButton" class="action-button modal-block-useracc" data-bs-toggle="modal" data-bs-target="#blockUserAccount">
                            <i class="bi bi-person-fill-slash me-3"></i>
                            <label>Block</label>
                        </button>
                    `;
                }

                // Check for follow user or not
                var followUnfollowBtn = '';
                if (user_id === response.follower_id) {
                    followUnfollowBtn = `
                        <button type="button" id="followUser" class="action-button follow-user" data-followid="">
                            <i class="bi bi-person-fill me-3"></i>
                            <label>Follow</label>
                        </button>
                    `;
                } else if (user_id === response.following_id) {
                    followUnfollowBtn = `
                        <button type="button" id="unfollowUser" class="action-button unfollow-user" data-followid=${response.follow_id}>
                            <i class="bi bi-person-check-fill me-3"></i>
                            <label>Followed</label>
                        </button>
                    `;
                } else {
                    followUnfollowBtn = `
                        <button type="button" id="followUser" class="action-button follow-user" data-followid="">
                            <i class="bi bi-person-fill me-3"></i>
                            <label>Follow</label>
                        </button>
                    `;
                }

                var buttonFollower = '';
                var buttonFollowing = '';
                if (user_id == current_user_id) {
                    profilePostHTML = `
                        <div class="user-posted-contents">
                            <div class="avatar-display">
                                <img src="src/css/images/free-display-photos/${response.user_avatar}"
                                    class="sm-avatar" alt="${response.user_avatar}">
                            </div>
                            <div class="post-input">
                                <button type="button" class="btn btn-post profile-btn-post" data-bs-toggle="modal"data-bs-target="#postSomething">
                                    Post something here ${response.username}
                                </button>
                            </div>
                        </div>
                    `;
                    profileEdit = `
                        <div class="row">
                            <div class="col">
                                <div class="user-bio">
                                    <p class="mb-0">Bio:<label class="ms-1">${response.user_bio}</label></p>
                                    <span class="badge">
                                        <button type="button" data-bs-toggle="modal" data-bs-target="#editBio">
                                            <i class="bi bi-pencil-square"></i>
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <button class="btn btn-edit-profile" type="button" data-bs-toggle="modal"
                                    data-bs-target="#editProfileModal">
                                    <i class="bi bi-pencil-square btn-profile"></i>
                                    <label>Edit Profile</label>
                                </button>
                            </div>
                        </div>
                    `;
                    buttonFollower = `type="button" data-bs-toggle="modal" data-bs-target="#userFollowers"`;
                    buttonFollowing = `type="button" data-bs-toggle="modal" data-bs-target="#userFollowing"`;
                } else {
                    profilePostHTML = "";
                    profileEdit = `
                        <div class="row">
                            <div class="col">
                                <div class="user-bio">
                                    <p class="mb-0">Bio:<label class="ms-1">${response.user_bio}</label></p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="button-group">
                                    ${followUnfollowBtn}
                                    ${blockOption}
                                    <button type="button" id="reportUserButton" class="action-button modal-report" data-bs-toggle="modal" data-bs-target="#reportUser">
                                        <i class="bi bi-person-fill-exclamation me-3"></i>
                                        <label>Report</label>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    buttonFollower = `type="button"`;
                    buttonFollowing = `type="button"`;
                }

                var profileFeedHTML = `
                    <div class="profile-feed">
                        <div class="container-fluid">
                            <div class="cover-bg">
                                <img src="src/css/images/free-cover-banner/${response.user_banner}"
                                    alt="Cover Photo">
                            </div>
                            <div class="user-profile-img">
                                <img src="src/css/images/free-display-photos/${response.user_avatar}" alt="${response.user_avatar}">
                            </div>
                            <div class="container">
                                <div class="row">
                                    <div class="col">
                                        <h2 class="mb-0 user-name">${response.username}</h2>
                                    </div>
                                </div>
                                ${profileEdit}
                            </div>
                        </div>
                        ${profilePostHTML}
                        ${postFeeds}
                    </div>
                `;

                var rightSideBar = `
                    <div class="right-sidebar">
                        <div class="sidebar-wrapper">
                            <button class="users-fws followers" ${buttonFollower}>
                                <div class="users-followers banner-bg">
                                    <p class="fw-semibold fw-count text-center mb-2">Followers</p>
                                    <p class="text-center mb-0">${response.followers_count}</p>
                                </div>
                            </button>
                            <button class="users-fws following" ${buttonFollowing}>
                                <div class="users-following banner-bg">
                                    <p class="fw-semibold fw-count text-center mb-2">Following</p>
                                    <p class="text-center mb-0">${response.following_count}</p>
                                </div>
                            </button>
                            <div class="find-people-banner banner-bg">
                                <p class="fw-semibold fw-count text-center mb-2">Find people</p>
                                <ul class="list find-people-list" id="nonFollowersList">
                                    <!-- Non-follower items will be appended here -->
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
                mainContainer.append(profileFeedHTML + rightSideBar);

                var nonFollowersList = $("#nonFollowersList");
                var nonFollowerItem = '';
                nonFollowersList.empty();
                if (user_id == current_user_id && response.non_followers && response.non_followers.length > 0) {
                    response.non_followers.forEach(function (nonFollower) {
                        nonFollowerItem = `
                            <li class="d-flex justify-content-between align-items-center mb-2">
                                <div class="following-info">
                                    <a class="text-decoration-none text-light" href="user-profile-page.php?user_id=${nonFollower.user_id}">
                                        <img class="bi sidebar-dp me-2" src="src/css/images/free-display-photos/${nonFollower.user_avatar}" alt="${nonFollower.username}">
                                        <label>${nonFollower.username}</label>
                                    </a>
                                </div>
                                <button class="follow-btn" type="button" data-follow-id="" data-following-id="${nonFollower.user_id}">
                                    Follow
                                </button>
                            </li>
                        `;
                        nonFollowersList.append(nonFollowerItem);
                    });
                } else {
                    $('.find-people-banner').remove()
                }
            }
        },
        error: function (xhr, status, error) {
            // Handle errors here
            console.log(error);
        },
    });
}

function editUserProfile() {
    $(document).on("click", ".btn-edit-profile", function () {
        var current_user_id = $('.user-index').attr('data-userid');
        var editProfileDialog = $('#editProfileDialog');
        var contentHTML = `
            <div class="modal-content edit-profile">
                <form id="editProfileForm" method="post">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Edit Profile</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-6">
                                <p>Change Banner Here:</p>
                                <div class="choose-banner">
                                    <p>
                                        <input type="radio" name="user_banner_cover" id="photo1" value="fb1.jpg">
                                        <label for="photo1">
                                            <img class="display-img" src="src/css/images/free-cover-banner/fb1.jpg" alt="Photo 1">
                                        </label>
                                    </p>

                                    <p>
                                        <input type="radio" name="user_banner_cover" id="photo3" value="fb2.jpg">
                                        <label for="photo3">
                                            <img class="display-img" src="src/css/images/free-cover-banner/fb2.jpg" alt="Photo 3">
                                        </label>
                                    </p>

                                    <p>
                                        <input type="radio" name="user_banner_cover" id="photo5" value="fb5.jpg">
                                        <label for="photo5">
                                            <img class="display-img" src="src/css/images/free-cover-banner/fb5.jpg" alt="Photo 5">
                                        </label>
                                    </p>
                                </div>
                            </div>
                            <div class="col-6">
                                <p>Change Avatar Here:</p>
                                <div class="choose-avatar">
                                    <p>
                                        <input type="radio" name="user_avatar" id="avatar1" value="dp1.png">
                                        <label for="avatar1">
                                            <img class="display-avatar" src="src/css/images/free-display-photos/dp1.png" alt="Photo 1">
                                        </label>
                                    </p>

                                    <p>
                                        <input type="radio" name="user_avatar" id="avatar2" value="dp2.png">
                                        <label for="avatar2">
                                            <img class="display-avatar" src="src/css/images/free-display-photos/dp2.png" alt="Photo 2">
                                        </label>
                                    </p>

                                    <p>
                                        <input type="radio" name="user_avatar" id="avatar3" value="dp3.png">
                                        <label for="avatar3">
                                            <img class="display-avatar" src="src/css/images/free-display-photos/dp3.png" alt="Photo 3">
                                        </label>
                                    </p>

                                    <p>
                                        <input type="radio" name="user_avatar" id="avatar4" value="dp4.png">
                                        <label for="avatar4">
                                            <img class="display-avatar" src="src/css/images/free-display-photos/dp4.png" alt="Photo 4">
                                        </label>
                                    </p>

                                    <p>
                                        <input type="radio" name="user_avatar" id="avatar5" value="dp5.png">
                                        <label for="avatar5">
                                            <img class="display-avatar" src="src/css/images/free-display-photos/dp5.png" alt="Photo 5">
                                        </label>
                                    </p>

                                    <p>
                                        <input type="radio" name="user_avatar" id="avatar6" value="dp6.png">
                                        <label for="avatar6">
                                            <img class="display-avatar" src="src/css/images/free-display-photos/dp6.png" alt="Photo 6">
                                        </label>
                                    </p>

                                    <p>
                                        <input type="radio" name="user_avatar" id="avatar7" value="dp7.png">
                                        <label for="avatar7">
                                            <img class="display-avatar" src="src/css/images/free-display-photos/dp7.png" alt="Photo 5">
                                        </label>
                                    </p>

                                    <p>
                                        <input type="radio" name="user_avatar" id="avatar8" value="dp8.png">
                                        <label for="avatar8">
                                            <img class="display-avatar" src="src/css/images/free-display-photos/dp8.png" alt="Photo 5">
                                        </label>
                                    </p>

                                    <p>
                                        <input type="radio" name="user_avatar" id="avatar9" value="dp9.png">
                                        <label for="avatar9">
                                            <img class="display-avatar" src="src/css/images/free-display-photos/dp9.png" alt="Photo 5">
                                        </label>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-edit" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-edit confirm-edit" data-user-id="${current_user_id}">Save changes</button>
                    </div>
                </form>
            </div>
        `;

        if (editProfileDialog.children().length > 0) {
            editProfileDialog.empty();
        }
        editProfileDialog.append(contentHTML);
    });

    // On submit
    $(document).on("submit", "#editProfileForm", function (event) {
        event.preventDefault();
        var userid = $(".user-index").attr("data-userid");
        var form = $(this);
        var user_banner_cover = form.find('input[name="user_banner_cover"]:checked').val();
        var user_avatar = form.find('input[name="user_avatar"]:checked').val();

        $.ajax({
            url: "actions/user-change-images.php",
            method: "POST",
            data: {
                user_id: userid,
                user_banner_cover: user_banner_cover,
                user_avatar: user_avatar,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    form.find('input, button').prop("disabled", true);
                    setTimeout(function () {
                        location.reload();
                    }, 200);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
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
                    $(".user-notification.unread-notif").removeClass("unread-notif");
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
                    $(event.target).closest(".user-notification").removeClass("unread-notif");
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

// Create Post
function userCreatPost() {
    // Open Modal
    $(document).on('click', '.btn-post', function () {
        var createPostDialog = $('#createPostDialog');
        var contentHTML = `
            <div class="modal-content modal-post-input">
                <form id="postContentForm" enctype="multipart/form-data">
                    <div class="modal-header">
                        <h1 class="modal-title fs-3" id="exampleModalLabel">Share Something</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="input-data">
                            <textarea id="userContent" cols="30" rows="5"
                                placeholder="Write something you want to share."></textarea>
                            <div id="previewContainer" class="preview-container mb-4 d-none"></div>
                            <div class="buttons">
                                <div class="upload-btn">
                                    <label for="mediaInput" class="upload-button">
                                        <i class="bi bi-images"></i>
                                    </label>
                                    <input type="file" class="form-control visually-hidden" id="mediaInput"
                                        name="media[]"
                                        accept="image/jpeg, image/jpg, image/png, video/mp4, video/webm, video/mov"
                                        multiple>
                                </div>
                                <div class="dropdown">
                                    <select class="form-select dropdown-selector" id="userTopic">
                                        <option value="League of Legends">League of Legends</option>
                                        <option value="League of Legends: Wild Rift">League of Legends: Wild Rift
                                        </option>
                                        <option value="Dota 2">Dota 2</option>
                                        <option value="Defense of the Ancients">Defense of the Ancients</option>
                                        <option value="Valorant">Valorant</option>
                                        <option value="Mobile Legends: Bang Bang">Mobile Legends: Bang Bang</option>
                                        <option value="Call of Duty: Mobile">Call of Duty: Mobile</option>
                                        <option value="Roblox">Roblox</option>
                                        <option value="Fortnite">Fortnite</option>
                                        <option value="PUBG: BATTLEGROUNDS">PUBG: BATTLEGROUNDS</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div id="otherTopicContainer" class="other-topics" style="display: none;">
                                    <input type="text" id="otherTopic" name="otherTopic"
                                        placeholder="Enter your chosen topic" autocomplete="off">
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
        if (createPostDialog.children().length > 0) {
            createPostDialog.empty();
        }
        createPostDialog.append(contentHTML);
        $('#userTopic').on('change', function () {
            var selectedOption = $(this).val();
    
            // Toggle the visibility of the input field based on the selected option
            if (selectedOption === 'Other') {
                $('#otherTopicContainer').show();
            } else {
                $('#otherTopicContainer').hide();
            }
        });
        handleFileInput();
    });

    // Image/Video Preview for Posting
    function handleFileInput() {
        var maxImageFiles = 2;
        var maxVideoFiles = 1;
        var uploadedImageFiles = 0;
        var uploadedVideoFiles = 0;
    
        $("#mediaInput").change(function (event) {
            var files = event.target.files;
            var previewContainer = $("#previewContainer");
    
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var fileType = file.type;
    
                if (fileType.startsWith("image/") && uploadedImageFiles < maxImageFiles) {
                    uploadedImageFiles++;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = new Image();
                        img.onload = function () {
                            var imgClass = this.naturalWidth > this.naturalHeight ? "landscape" : "portrait";
                            $(img).addClass(imgClass);
                        };
                        img.src = e.target.result;
    
                        var removeButton = $('<button class="remove-media-btn"><i class="bi bi-x-circle-fill"></i></button>');
                        removeButton.click(function () {
                            $(this).parent().remove();
                            uploadedImageFiles--;
                            if (uploadedImageFiles < maxImageFiles) {
                                $("#mediaInput").prop("disabled", false);
                            }
                            if (uploadedVideoFiles < maxVideoFiles) {
                                $("#mediaInput").prop("disabled", false);
                            }
                            if (previewContainer.children().length === 0) {
                                previewContainer.addClass("d-none");
                            }
                        });
    
                        var mediaContainer = $('<div class="media-container"></div>').append(img, removeButton);
                        previewContainer.append(mediaContainer);
                    };
                    reader.readAsDataURL(file);
                } else if (fileType.startsWith("video/") && uploadedVideoFiles < maxVideoFiles) {
                    uploadedVideoFiles++;
                    var video = document.createElement("video");
                    video.controls = true;
                    video.preload = "metadata";
    
                    var source = document.createElement("source");
                    source.src = URL.createObjectURL(file);
                    video.appendChild(source);
    
                    var removeButton = $('<button class="remove-media-btn"><i class="bi bi-x-circle-fill"></i></button>');
                    removeButton.click(function () {
                        $(this).parent().remove();
                        uploadedVideoFiles--;
                        if (uploadedImageFiles < maxImageFiles) {
                            $("#mediaInput").prop("disabled", false);
                        }
                        if (uploadedVideoFiles < maxVideoFiles) {
                            $("#mediaInput").prop("disabled", false);
                        }
                        if (previewContainer.children().length === 0) {
                            previewContainer.addClass("d-none");
                        }
                    });
    
                    var mediaContainer = $('<div class="media-container"></div>').append(video, removeButton);
                    previewContainer.append(mediaContainer);
                }
            }
    
            // Disable the input if the limit is reached for both image and video files
            if (uploadedImageFiles >= maxImageFiles) {
                $("#mediaInput").prop("disabled", true);
            }
            if (uploadedVideoFiles >= maxVideoFiles) {
                $("#mediaInput").prop("disabled", true);
            }
    
            // Toggle the visibility of previewContainer
            if (files.length > 0) {
                previewContainer.removeClass("d-none");
            }
        });
    }

    // Form submit
    $(document).on('submit', '#postContentForm', function (event) {
        event.preventDefault();
        loadTrendingTopics();

        var userId = $('.user-index').attr('data-userid');
        var userContent = $("#userContent").val();
        var userTopic = $("#userTopic").val();
        var otherTopic = $("#otherTopic").val();
        var mediaFiles = $("#mediaInput")[0].files;
        var maxImageFiles = 2;
        var maxVideoFiles = 1;
        var imageFilesCount = 0;
        var videoFilesCount = 0;

        var formData = new FormData();
        formData.append("user_content", userContent);
        formData.append("other_topic", otherTopic);
        formData.append("user_topic", userTopic);
        formData.append("user_id", userId);
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

        var mediaContainers = $(".media-container"); // Get all media containers
        for (var i = 0; i < mediaContainers.length; i++) {
            var mediaElement = mediaContainers.eq(i).find('img, video')[0];
            var mediaName = $(mediaElement).data('media-name');
            formData.append("media[]", mediaFiles[i], mediaName); // Add media with original name
        }

        $.ajax({
            method: "POST",
            url: "actions/user-discussion-feed/user-posted-contents.php",
            data: formData,
            dataType: "json",
            contentType: false,
            processData: false,
            success: function (response) {
                var createPostDialog = $("#createPostDialog");
                createPostDialog.find('.display-error').remove();
                if (response.status === "success") {
                    var username = response.username;
                    var mediaNames = response.media_names;
                    var mediaOrientations = response.media_orientation;
                    var postFeeds = $("#postFeeds");
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
										<img src="/gamers-nest/src/css/media_upload/${media1}" class="uploaded-media ${mediaOrientations[0]}" alt="Uploaded Image">
										<img src="/gamers-nest/src/css/media_upload/${media2}" class="uploaded-media ${mediaOrientations[1]}" alt="Uploaded Image">
									</div>
								`;
                            } else if (mediaNames.length === 1) {
                                var media = mediaNames[0];
                                mediaHTML = `
									<div class="upload-media">
										<img src="/gamers-nest/src/css/media_upload/${media}" class="uploaded-media ${mediaOrientations[0]}" alt="Uploaded Image">
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
									<source src="/gamers-nest/src/css/media_upload/${media}" type="video/${fileExtension}">
									Your browser does not support the video tag.
								</video>
							</div>
						`;
                    }

                    var postHTML = `
                        <div class="posted-feed" data-postuser-id="${response.user_id}">
                            <div class="users-contents">
                                <div class="user-info">
                                    <img src="src/css/images/free-display-photos/${response.user_avatar}" class="sm-avatar" alt="${response.user_avatar}">
                                    <p>${username}</p>
                                    <div class="dropdown menu-btn">
                                        <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-three-dots"></i>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <form class="deletePostForm">
                                                    <input type="hidden" name="user_id" value="${response.user_id}">
                                                    <input type="hidden" name="user_content_id" value="${response.content_id}">
                                                    <button type="submit" class="dropdown-item menu-option">Delete</button>
                                                </form>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="content">
									<p class="user-post-content">${userContent}</p>
									${mediaHTML}
                                    <h5 class="topic">Topic Discussed: ${response.post_topic}</h5>
                                </div>
                            </div>
                            <div class="social-buttons">
                                <button class="like-btn" type="submit" data-content-id="${response.content_id}" data-user-id="${response.user_id}"><i class="bi bi-hand-thumbs-up-fill"> <span class="like-count"></span></i></button>
                                <button class="comment-btn"><i class="bi bi-chat-square-text-fill"></i></button>
                                <button type="button" class="share-btn" data-bs-toggle="modal" data-bs-target="#sharePost" data-userid="${response.user_id}" data-postid="${response.content_id}"><i class="bi bi-box-arrow-in-up-right"></i></button>
                            </div>
                            <div class="comment-section">
                                <div class="row">
                                    <div class="col">
                                        <div class="comment-txtfld">
                                            <img src="src/css/images/free-display-photos/${response.user_avatar}" class="sm-avatar comment-avatar" alt="Avatar">
                                            <form id="commentForm" method="POST" class="comment-form all-comment-form" >
                                                <input type="text" class="input-comment" name="user_comment" placeholder="Write your comment here..." autocomplete="off" required>
                                                <input type="hidden" name="user_id">
                                                <input type="hidden" name="username">
                                                <input type="hidden" name="user_avatar">
                                                <input type="hidden" name="user_content_id" value="${response.content_id}">
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    $("#userContent").val("");
                    $("#mediaInput").val("");
                    $("#previewContainer").empty();
                    $("#userContent").removeAttr("disabled", "disabled");
                    $("#postSomething").modal("hide");
                    postFeeds.prepend(postHTML);
                } else {
                    var errorMessage = $('<p class="text-danger text-center my-2 fw-bold display-error">' + response.message + '</p>');
                    createPostDialog.find('.modal-footer')
                        .append(errorMessage)
                        .css('justify-content', 'center');
                    errorMessage.hide().fadeIn();

                    setTimeout(function () {
                        errorMessage.fadeOut(function () {
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

// Display posts and shared posts
function load_posts() {
    var urlParams = new URLSearchParams(window.location.search);
    var other_user_id = urlParams.get("user_id");
    var current_user_id = $(".user-index").attr("data-userid");

    if (other_user_id != current_user_id) {
        user_id = other_user_id;
    } else {
        user_id = current_user_id;
    }

    $.ajax({
        url: "actions/user-profile-feed/profile-get-posts-comments.php",
        data: {
            user_id: user_id,
        },
        type: "POST",
        dataType: "json",
        success: function (response) {
            var posts = response.posts;
            var postFeeds = $("#postFeeds");
            var displayError = $(".display-error");

            if (posts.length === 0) {
                if (displayError.length === 0) {
                    postFeeds.append('<p class="display-error">No posted contents</p>');
                } else {
                    displayError.show();
                }
            } else {
                displayError.hide();
                postFeeds.empty();
                $.each(posts, function (i, post) {
                    var postOptions = "";
                    if (user_id === post.user_id) {
                        postOptions = `
                            <ul class="dropdown-menu">
                                <li>
                                    <form class="deletePostForm">
                                        <input type="hidden" name="user_id" value="${post.user_id}">
                                        <input type="hidden" name="user_content_id" value="${post.content_id}">
                                        <button type="submit" class="dropdown-item menu-option">Delete</button>
                                    </form>
                                </li>
                            </ul>
                        `;
                    } else {
                        postOptions = `
                            <ul class="dropdown-menu">
                                <li><button class="dropdown-item menu-option" href="#">Report</button></li>
                            </ul>
                        `;
                    }

                    var likePost = "";
                    var likeBtnClass = post.liked_by_user ? "already-like-btn" : "like-btn";
                    likePost = `
                        <button class="${likeBtnClass}" type="submit" data-likepost-id="${post.likepost_id}" data-content-id="${post.content_id}" data-user-id="${post.user_id}">
                            <i class="bi bi-hand-thumbs-up-fill"> 
                                <span class="like-count">${post.likes}</span>
                            </i>
                        </button>
                    `;

                    var postColumn = `
                        <div class="posted-feed">
                            <div class="users-contents">
                                <div class="user-info">
                                    <img src="src/css/images/free-display-photos/${post.user_avatar}" class="sm-avatar" alt="Avatar">
                                    <p>${post.username}</p>
                                    <div class="dropdown menu-btn">
                                        <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-three-dots"></i>
                                        </button>
                                        ${postOptions}
                                    </div>
                                </div>
                                <div class="content">
                                    <p class="user-post-content">${post.user_content}</p>
                                    ${generateMediaHTML(post.media_upload,post.media_orientation)}
                                    <h5 class="topic">Topic Discussed: ${post.user_topic}</h5>
                                </div>
                            </div>
                            <div class="social-buttons">
                                ${likePost}
                                <button class="comment-btn"><i class="bi bi-chat-square-text-fill"></i></button>
                                <button type="button" class="share-btn" data-bs-toggle="modal" data-bs-target="#sharePost" data-userid="${post.user_id}" data-postid="${post.content_id}"><i class="bi bi-box-arrow-in-up-right"></i></button>
                            </div>
                            <div class="comment-section" id="userComments">
                                <!-- Display comments using a loop -->
                                ${getCommentsHtml(post.comments)}
                                <div class="row">
                                    <div class="col">
                                        <div class="comment-txtfld">
                                            <img src="" class="sm-avatar${i} comment-avatar" alt="Avatar">
                                            <form id="commentForm" method="POST" class="comment-form all-comment-form">
                                                <input type="text" name="user_comment" class="input-comment" placeholder="Write your comment here..." autocomplete="off" required>
                                                <input type="hidden" name="user_id">
                                                <input type="hidden" name="username">
                                                <input type="hidden" name="user_avatar">
                                                <input type="hidden" name="user_content_id" value="${post.content_id}">
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    postFeeds.append(postColumn);

                    post.shared_by.forEach(function (sharedUser) {
                        var likeSharedPost = "";
                        var sharedPostBtnClass = sharedUser.sharedpost_liked_by_user ? "sharedpost-liked-btn" : "like-shared-post";

                        likeSharedPost = `
                            <button class="${sharedPostBtnClass}" type="submit" data-sharedpost_likeid="${sharedUser.sharedpost_like_id}" data-sharedpostid="${sharedUser.shared_post_id}" data-content-id="${sharedUser.shared_post_content_id}" data-user-id="${sharedUser.user_id}">
                                <i class="bi bi-hand-thumbs-up-fill"> 
                                    <span class="like-count">${sharedUser.sharedpost_likes}</span>
                                </i>
                            </button>
                        `;

                        var sharepostHTML = `
                            <div class="posted-feed">
                                <div class="users-contents">
                                    <div class="user-info">
                                        <img src="src/css/images/free-display-photos/${sharedUser.user_avatar}" class="sm-avatar" alt="${sharedUser.user_avatar}">
                                        <p>${sharedUser.username}</p>
                                        <div class="dropdown menu-btn">
                                            <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="bi bi-three-dots"></i>
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <form class="deleteSharedPostForm">
                                                        <input type="hidden" name="sharedpost_id" value="${sharedUser.shared_post_id}">
                                                        <button type="submit" class="dropdown-item menu-option">Delete</button>
                                                    </form>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="content">
                                        <p class="user-post-content">${sharedUser.shared_text_content}</p>
                                    </div>
                                    <div class="box">
                                        <div class="user-content">
                                            <div class="user-info">
                                                <img src="src/css/images/free-display-photos/${post.user_avatar}"
                                                    class="sm-avatar" alt="${post.user_avatar}">
                                                <p>${post.username}</p>
                                            </div>
                                            <div class="content">
                                                <p class="user-post-content">${post.user_content}</p>
                                                ${generateMediaHTML(post.media_upload,post.media_orientation)}
                                                <h5 class="topic">Topic Discussed: ${post.user_topic}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="social-buttons">
                                    ${likeSharedPost}
                                    <button class="comment-btn"><i class="bi bi-chat-square-text-fill"></i></button>
                                    <button type="button" class="share-btn" data-bs-toggle="modal" data-bs-target="#sharePost" data-userid="${post.user_id}" data-sharedpost-id="${sharedUser.shared_post_id}" data-postid="${sharedUser.shared_post_content_id}"><i class="bi bi-box-arrow-in-up-right"></i></button>
                                </div>
                                <div class="sharedpost-comment-section">
                                    <!-- Display comments in shared post using a loop -->
                                    ${getSharedPostCommentsHtml(sharedUser.sharedpost_comments)}
                                    <div class="row">
                                        <div class="col">
                                            <div class="comment-txtfld">
                                                <img src="" class="sm-avatar${i} comment-avatar" alt="Avatar">
                                                <form id="sharedpost_commentForm" method="POST" class="sharedpost-comment-form all-comment-form">
                                                    <input type="text" name="user_comment" class="input-comment" placeholder="Write your comment here..." autocomplete="off" required="">
                                                    <input type="hidden" name="shared_post_id" value="${sharedUser.shared_post_id}">
                                                    <input type="hidden" name="user_content_id" value="${sharedUser.shared_post_content_id}">
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        postFeeds.prepend(sharepostHTML);
                    });

                    getCurrentUserAvatar(i, function (response) {
                        if (response.status === "success") {
                            $(".sm-avatar" + i).attr(
                                "src",
                                "src/css/images/free-display-photos/" +
                                    response.user_avatar
                            );
                        } else {
                            console.log("Error:", response.message);
                        }
                    });
                });
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        },
    });
}

function generateMediaHTML(mediaUpload, mediaOrientation) {
    var mediaHTML = "";

    if (
        mediaUpload &&
        typeof mediaUpload === "string" &&
        mediaOrientation &&
        typeof mediaOrientation === "string"
    ) {
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

                    if (
                        mediaFile === "jpg" ||
                        mediaFile === "jpeg" ||
                        mediaFile === "png"
                    ) {
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

                if (
                    mediaFile === "jpg" ||
                    mediaFile === "jpeg" ||
                    mediaFile === "png"
                ) {
                    // Image file
                    mediaHTML += '<div class="upload-media">';
                    mediaHTML += '<img src="/gamers-nest/src/css/media_upload/' + mediaUrl + '" class="uploaded-media ' + orientation + '" alt="Uploaded Image">';
                    mediaHTML += "</div>";
                } else if (
                    mediaFile === "mp4" ||
                    mediaFile === "mov" ||
                    mediaFile === "avi"
                ) {
                    // Video file
                    mediaHTML += '<div class="upload-media">';
                    mediaHTML += '<video controls class="uploaded-media ' + orientation + '"><source src="/gamers-nest/src/css/media_upload/' +  mediaUrl + '" type="video/' + mediaFile + '">Your browser does not support the video tag.</video>';
                    mediaHTML += "</div>";
                }
            }
        }
    }

    return mediaHTML;
}

// Function to add comment on post
function addComment() {
    $(document).on("submit", ".comment-form", function (event) {
        event.preventDefault();
        var form_data = $(this).serialize();
        var commentForm = $(this);

        $.ajax({
            method: "POST",
            url: "actions/user-discussion-feed/user-add-comment.php",
            data: form_data,
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var userComments = commentForm.closest(".comment-section");
                    var commentHTML = `
                        <div class="row">
                            <div class="col">
                                <div class="comment-txtfld">
                                    <img src="src/css/images/free-display-photos/${response.user_avatar}" class="sm-avatar comment-avatar" alt="Avatar">
                                    <div class="comment-content">
                                        <p class="users-name">${response.username}</p>
                                        <p class="users-comment">${response.user_comment}</p>
                                    </div>
                                    <div class="dropdown">
                                        <button class="delete-comment-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-three-dots"></i> 
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <form class="deleteCommentForm">
                                                    <input type="hidden" name="user_id" value="${response.user_id}">
                                                    <input type="hidden" name="user_content_id" value="${response.user_content_id}">
                                                    <input type="hidden" name="user_comment_id" value="${response.user_comment_id}">
                                                    <button type="submit" class="dropdown-item menu-option">Delete</button>
                                                </form>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    userComments.prepend(commentHTML);
                    commentForm.find('input[name="user_comment"]').val("");
                } else {
                    console.log("Error:", response.message);
                }
            },
        });
    });
}

// Display comments
function getCommentsHtml(comments) {
    getUsersPostOnModal();
    var userid = $(".user-index").attr("data-userid");
    var commentsHtml = "";
    var commentCount = 0;
    var showMoreButton = false;

    $.each(comments, function (i, comment) {
        if (commentCount < 3) {
            var postOptions = "";
            if (userid === comment.user_id) {
                postOptions = `
                    <ul class="dropdown-menu">
                        <li>
                            <form class="deleteCommentForm" method="POST">
                                <input type="hidden" name="user_id" value="${comment.user_id}">
                                <input type="hidden" name="user_content_id" value="${comment.content_id}">
                                <input type="hidden" name="user_comment_id" value="${comment.comment_id}">
                                <button type="submit" class="dropdown-item menu-option">Delete</button>
                            </form>
                        </li>
                    </ul>
                `;
            } else {
                postOptions = `
                    <ul class="dropdown-menu">
                        <li><button type="submit" class="dropdown-item menu-option">Report</button></li>
                    </ul>
                `;
            }
            var commentHtml = `
                <div class="row">
                    <div class="col">
                        <div class="comment-txtfld">
                            <img src="src/css/images/free-display-photos/${comment.user_avatar}" class="sm-avatar comment-avatar" alt="${comment.user_avatar}">
                            <div class="comment-content">
                                <p class="users-name">${comment.username}</p>
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
            post_id = comment.content_id;
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
                        <button class="show-more-btn smore-btn" type="button" data-bs-toggle="modal" data-bs-target="#viewPost" data-userpostid="${post_id}">Show More</button>
                    </div>
                </div>
            </div>
        `;
    }
    return commentsHtml;
}

// Get user's avatar
function getCurrentUserAvatar(i, callback) {
    $.ajax({
        url: "actions/user-discussion-feed/get-user-avatar.php",
        type: "POST",
        dataType: "json",
        success: function (response) {
            callback(response);
        },
        error: function (xhr, status, error) {
            console.log(error);
        },
    });
}

// Display and get post on modal
function getUsersPostOnModal() {
    $(document).on("click", ".show-more-btn", function () {
        var userpostid = $(this).attr("data-userpostid");
        $.ajax({
            url: "actions/user-discussion-feed/get-modal-post-content-details.php",
            method: "POST",
            data: {
                userpostid: userpostid,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var post = response.posts[0];
                    var user_post = $("#modalUserPost");
                    var commentsHtml = "";

                    for (var i = 0; i < post.comments.length; i++) {
                        var comment = post.comments[i];
                        var postOptions = "";
                        if (userpostid != post.user_id) {
                            postOptions = `
                                <ul class="dropdown-menu">
                                    <li>
                                        <form class="deleteCommentForm" method="POST">
                                            <input type="hidden" name="user_id" value="${comment.user_id}">
                                            <input type="hidden" name="user_content_id" value="${comment.content_id}">
                                            <input type="hidden" name="user_comment_id" value="${comment.comment_id}">
                                            <button type="submit" class="dropdown-item menu-option">Delete</button>
                                        </form>
                                    </li>
                                </ul>
                            `;
                        } else {
                            postOptions = `
                                <ul class="dropdown-menu">
                                    <li><button type="submit" class="dropdown-item menu-option">Report</button></li>
                                </ul>
                            `;
                        }
                        var commentHtml = `
                            <div class="row">
                                <div class="col">
                                    <div class="comment-txtfld">
                                        <img src="src/css/images/free-display-photos/${comment.user_avatar}" class="sm-avatar comment-avatar" alt="${comment.user_avatar}">
                                        <div class="comment-content">
                                            <p class="users-name">${comment.username}</p>
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
                                <h1 class="modal-title fs-5" id="users_name">${post.username}'s Post</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="container-fluid" id="users-post">
                                    <div class="row">
                                        <div class="col">
                                            <div class="users-info">
                                                <img src="src/css/images/free-display-photos/${post.user_avatar}" class="sm-avatar" alt="${post.user_avatar}">
                                                <p>${post.username}</p>
                                            </div>
                                            <div class="user-content">
                                                <p class="users-post">${post.user_content}</p>
                                                <h5 class="topic">Topic Discussed: ${post.user_topic}</h5>
                                            </div>
                                            <div class="social-buttons">
                                                ${likePost}
                                                <button class="comment-btn"><i class="bi bi-chat-square-text-fill"></i></button>
                                                <button type="button" class="share-btn" data-bs-toggle="modal" data-bs-target="#sharePost" data-userid="${post.user_id}" data-postid="${userpostid}"><i class="bi bi-box-arrow-in-up-right"></i></button>
                                            </div>
                                            <div class="comment-section" id="userComments">
                                            ${commentsHtml} <!-- Display the generated comments HTML -->
                                                <div class="row">
                                                    <div class="col">
                                                        <div class="comment-txtfld">
                                                            <img src="src/css/images/free-display-photos/${post.user_avatar}" class="sm-avatar comment-avatar" alt="${post.user_avatar}" id="usersuser_avatar">
                                                            <form id="commentForm" method="POST" class="comment-form all-comment-form">
                                                                <input type="text" class="input-comment" name="user_comment" placeholder="Write your comment here..." autocomplete="off" required>
                                                                <input type="hidden" name="user_id">
                                                                <input type="hidden" name="username">
                                                                <input type="hidden" name="user_avatar">
                                                                <input type="hidden" name="user_content_id" value="${userpostid}">
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
                    if (user_post.children().length > 0) {
                        user_post.empty();
                    }
                    user_post.append(userpostHTML);
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.log(error);
            },
        });
    });
}

// Load trending topics
// function loadTrendingTopics() {
// 	$.ajax({
// 		url: 'actions/user-discussion-feed/get_trending_topics.php',
// 		type: 'GET',
// 		dataType: 'html',
// 		success: function(response) {
// 			$('#topic-list').html(response);

// 			// Immediately send another request to wait for the next update
// 			loadTrendingTopics();
// 		},
// 		error: function(xhr, status, error) {
// 			console.log(error); // Handle error if any

// 			// Retry after a short delay
// 			setTimeout(loadTrendingTopics, 3000);
// 		}
// 	});
// }

// Delete comment
function deleteComment() {
    // Post
    $(document).on("submit", ".deleteCommentForm", function (event) {
        event.preventDefault();
        var deleteForm = $(this);
        var user_id = deleteForm.find('input[name="user_id"]').val();
        var user_comment_id = deleteForm.find('input[name="user_comment_id"]').val();
        var user_content_id = deleteForm.find('input[name="user_content_id"]').val();

        $.ajax({
            method: "POST",
            url: "actions/user-discussion-feed/user-delete-comment.php",
            data: {
                user_id: user_id,
                user_comment_id: user_comment_id,
                user_content_id: user_content_id,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    deleteForm.closest(".row").fadeOut(1000, function () {
                        $(this).remove();
                    });
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });
    // Shared Post
    $(document).on("submit", ".deleteSPCommentForm", function (event) {
        event.preventDefault();
        var deleteForm = $(this);
        var user_id = deleteForm.find('input[name="user_id"]').val();
        var sharedpost_comment_id = deleteForm.find('input[name="sharedpost_comment_id"]').val();
        var shared_post_id = deleteForm.find('input[name="shared_post_id"]').val();

        $.ajax({
            method: "POST",
            url: "actions/user-discussion-feed/user-delete-sharedpost-comment.php",
            data: {
                user_id: user_id,
                sharedpost_comment_id: sharedpost_comment_id,
                shared_post_id: shared_post_id,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    deleteForm.closest(".row").fadeOut(1000, function () {
                        $(this).remove();
                    });
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });
}

// Delete post and shared post
function deletePost() {
    // Post
    $(document).on("submit", ".deletePostForm", function (event) {
        event.preventDefault();
        var form_data = $(this).serialize();
        var postContainer = $(this).closest(".posted-feed");

        $.ajax({
            method: "POST",
            url: "actions/user-discussion-feed/user-delete-post.php",
            data: form_data,
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    postContainer.fadeOut("slow", function () {
                        $(this).remove();
                    });
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });
    // Shared post
    $(document).on("submit", ".deleteSharedPostForm", function (event) {
        event.preventDefault();
        var form_data = $(this).serialize();
        var postContainer = $(this).closest(".posted-feed");

        $.ajax({
            method: "POST",
            url: "actions/user-discussion-feed/user-delete-shared-post.php",
            data: form_data,
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    postContainer.fadeOut("slow", function () {
                        $(this).remove();
                    });
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log(error); // Check the error details
            },
        });
    });
}

// Like and Unlike
function likeButton() {
    // Like post
    $(document).on("click", ".like-btn", function () {
        var button = $(this);
        var user_id = $(".user-index").attr("data-userid");
        var user_content_id = button.data("content-id");

        $.ajax({
            method: "POST",
            url: "actions/user-discussion-feed/user-like-post.php",
            data: {
                user_id: user_id,
                user_content_id: user_content_id,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var likeHTML = `
                        <button class="already-like-btn" type="submit" data-likepost-id="${response.like_id}" data-content-id="${user_content_id}"><i class="bi bi-hand-thumbs-up-fill"><span class="like-count">${response.count}</span></i></button>
                    `;

                    button.replaceWith(likeHTML);
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });
    // Unlike post
    $(document).on("click", ".already-like-btn", function () {
        var button = $(this);
        var user_id = $(".user-index").attr("data-userid");
        var user_content_id = button.data("content-id");
        var like_post_id = button.data("likepost-id");

        $.ajax({
            method: "POST",
            url: "actions/user-discussion-feed/user-unlike-post.php",
            data: {
                user_id: user_id,
                user_content_id: user_content_id,
                like_post_id: like_post_id,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var unlikeHTML = `
                        <button class="like-btn" type="submit" data-content-id="${user_content_id}"><i class="bi bi-hand-thumbs-up-fill"><span class="like-count">${response.count}</span></i></button>
                    `;

                    button.replaceWith(unlikeHTML);
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });
    // Like shared post
    $(document).on("click", ".like-shared-post", function () {
        var button = $(this);
        var user_id = $(".user-index").attr("data-userid");
        var user_content_id = button.data("content-id");
        var shared_post_id = button.data("sharedpostid");

        $.ajax({
            method: "POST",
            url: "actions/user-discussion-feed/user-like-sharedpost.php",
            data: {
                user_id: user_id,
                user_content_id: user_content_id,
                shared_post_id: shared_post_id,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var likeHTML = `
                        <button class="sharedpost-liked-btn" type="submit" data-sharedpost_likeid="${response.sharedpost_like_id}" data-sharedpostid="${shared_post_id}" data-content-id="${user_content_id}" data-user-id="${user_id}"><i class="bi bi-hand-thumbs-up-fill"><span class="like-count">${response.count}</span></i></button>
                    `;
                    button.replaceWith(likeHTML);
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });
    // Unlike shared post
    $(document).on("click", ".sharedpost-liked-btn", function () {
        var button = $(this);
        var user_id = $(".user-index").attr("data-userid");
        var user_content_id = button.data("content-id");
        var sharedpost_like_id = button.data("sharedpost_likeid");
        var shared_post_id = button.data("sharedpostid");

        $.ajax({
            method: "POST",
            url: "actions/user-discussion-feed/user-unlike-sharedpost.php",
            data: {
                user_id: user_id,
                user_content_id: user_content_id,
                sharedpost_like_id: sharedpost_like_id,
                shared_post_id: shared_post_id,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var unlikeHTML = `
                        <button class="like-shared-post" type="submit" data-sharedpostid="${shared_post_id}" data-content-id="${user_content_id}" data-user-id="${user_id}"><i class="bi bi-hand-thumbs-up-fill"><span class="like-count">${response.count}</span></i></button>
                    `;
                    button.replaceWith(unlikeHTML);
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });
}

// Modal Share - Get Post Data
function modalGetSharePostData() {
    $(document).on("click", ".share-btn", function () {
        var post_id = $(this).attr("data-postid");
        var user_id = $(this).attr("data-userid");
        var sharedpost_id = $(this).attr("data-sharedpost-id");

        if (sharedpost_id === undefined) {
            sharedpost_id = "";
        }

        $.ajax({
            url: "actions/user-discussion-feed/user-share-post-get-data.php",
            method: "POST",
            data: {
                post_id: post_id,
                sharedpost_id: sharedpost_id,
                user_id: user_id,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var user_post = $("#modalSharePost");

                    var modalshareHTML = `
                        <div class="modal-content shared-post-content">
                            <form id="sharepostForm" class="sharepost-form">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5">Share ${response.username}'s post</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="user-info">
                                        <img src="src/css/images/free-display-photos/${response.current_user_avatar}" class="sm-avatar" alt="${response.current_user_avatar}">
                                        <p>${response.current_user_name}</p>
                                    </div>
                                    <div class="input-data">
                                        <textarea name="shared_text_content" cols="30" rows="2" placeholder="Write something you want to share. . ."></textarea>
                                    </div>
                                    <div class="box">
                                        <div class="user-content">
                                            <div class="user-info">
                                                <img src="src/css/images/free-display-photos/${response.user_avatar}" class="sm-avatar" alt="${response.user_avatar}">
                                                <p>${response.username}</p>
                                            </div>
                                            <div class="content">
                                                <p class="user-post-content">${response.user_content}</p>
                                                ${generateMediaHTML(response.media_upload,response.media_orientation)}
                                                <h5 class="topic">Topic Discussed: ${response.user_topic}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <input type="hidden" name="post_id" value="${post_id}">
                                    <input type="hidden" name="user_id" value="${user_id}">
                                    <button type="submit" method="POST" class="shareBtn">Share</button>
                                </div>
                            </form>
                        </div>
                    `;

                    if (user_post.children().length > 0) {
                        user_post.empty();
                    }
                    user_post.append(modalshareHTML);
                    // Clear the text area after submitting the form
                    $(this).find('textarea[name="shared_text_content"]').val("");
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.log(error);
            },
        });
    });
}

// Modal Share - Share Post [Form]
function sharePost() {
    $(document).on("submit", ".sharepost-form", function (event) {
        event.preventDefault();
        var form_data = $(this).serialize();
        var form = $(this);

        $.ajax({
            url: "actions/user-discussion-feed/user-share-post.php",
            method: "POST",
            data: form_data,
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var postFeeds = $("#postFeeds");

                    var sharepostHTML = `
                        <div class="posted-feed">
                            <div class="users-contents">
                                <div class="user-info">
                                    <img src="src/css/images/free-display-photos/${response.current_user_avatar}" class="sm-avatar" alt="${response.current_user_avatar}">
                                    <p>${response.current_user_name}</p>
                                    <div class="dropdown menu-btn">
                                        <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-three-dots"></i>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <form class="deleteSharedPostForm">
                                                    <input type="hidden" name="sharedpost_id" value="${response.shared_post_id}">
                                                    <button type="submit" class="dropdown-item menu-option">Delete</button>
                                                </form>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="content">
                                    <p class="user-post-content">${response.shared_text_content}</p>
                                </div>
                                <div class="box">
                                    <div class="user-content">
                                        <div class="user-info">
                                            <img src="src/css/images/free-display-photos/${response.user_avatar}"
                                                class="sm-avatar" alt="${response.user_avatar}">
                                            <p>${response.username}</p>
                                        </div>
                                        <div class="content">
                                            <p class="user-post-content">${response.user_content}</p>
                                            ${generateMediaHTML(response.media_upload,response.media_orientation)}
                                            <h5 class="topic">Topic Discussed: ${response.user_topic}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="social-buttons">
                                <button class="like-shared-post" type="submit" data-sharedpostid="${response.shared_post_id}" data-content-id="${response.user_content_id}" data-user-id="${response.current_user_id}"><i class="bi bi-hand-thumbs-up-fill"> <span class="like-count"></span></i></button>
                                <button class="comment-btn"><i class="bi bi-chat-square-text-fill"></i></button>
                                <button type="button" class="share-btn" data-bs-toggle="modal" data-bs-target="#sharePost" data-userid="${response.user_id}" data-sharedpost-id="${response.shared_post_id}" data-postid="${response.user_content_id}"><i class="bi bi-box-arrow-in-up-right"></i></button>
                            </div>
                            <div class="sharedpost-comment-section" id="userComments">
                                <!-- Display comments using a loop -->
                                <div class="row">
                                    <div class="col">
                                        <div class="comment-txtfld">
                                            <img src="src/css/images/free-display-photos/${response.current_user_avatar}" class="sm-avatar comment-avatar" alt="${response.current_user_avatar}" id="usersAvatar">
                                            <form id="sharedpost_commentForm" method="POST" class="sharedpost-comment-form all-comment-form">
                                                <input type="text" name="user_comment" class="input-comment" placeholder="Write your comment here..." autocomplete="off" required="">
                                                <input type="hidden" name="shared_post_id" value="${response.shared_post_id}">
                                                <input type="hidden" name="user_content_id" value="${response.current_user_id}">
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    postFeeds.prepend(sharepostHTML);
                    $("#sharePost").modal("hide");
                    // Clear the text area after submitting the form
                    form.find('textarea[name="shared_text_content"]').val("");
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.log(error);
            },
        });
    });
}

// Function to add comment on shared post
function sharedPostAddComment() {
    $(document).on("submit", ".sharedpost-comment-form", function (event) {
        event.preventDefault();
        var sharedpost_commentForm = $(this);

        // Retrieve the values from the form inputs
        var shared_post_id = sharedpost_commentForm.find('input[name="shared_post_id"]').val();
        var user_content_id = sharedpost_commentForm.find('input[name="user_content_id"]').val();
        var comment_text = sharedpost_commentForm.find('input[name="user_comment"]').val();

        $.ajax({
            url: "actions/user-discussion-feed/user-sharedpost-add-comment.php",
            method: "POST",
            data: {
                shared_post_id: shared_post_id,
                user_content_id: user_content_id,
                comment_text: comment_text,
            },
            dataType: "json",
            success: function (response) {
                console.log(response.username);
                if (response.status === "success") {
                    var userComments = sharedpost_commentForm.closest(
                        ".sharedpost-comment-section"
                    );
                    var commentHTML = `
                        <div class="row">
                            <div class="col">
                                <div class="comment-txtfld">
                                    <img src="src/css/images/free-display-photos/${response.user_avatar}" class="sm-avatar comment-avatar" alt="Avatar">
                                    <div class="comment-content">
                                        <p class="users-name">${response.username}</p>
                                        <p class="users-comment">${response.user_comment}</p>
                                    </div>
                                    <div class="dropdown">
                                        <button class="delete-comment-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="bi bi-three-dots"></i> 
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <form class="deleteSPCommentForm">
                                                    <input type="hidden" name="user_id" value="${response.user_id}">
                                                    <input type="hidden" name="shared_post_id" value="${response.shared_post_id}">
                                                    <input type="hidden" name="sharedpost_comment_id" value="${response.sharedpost_comment_id}">
                                                    <button type="submit" class="dropdown-item menu-option">Delete</button>
                                                </form>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    userComments.prepend(commentHTML);
                    sharedpost_commentForm.find('input[name="user_comment"]').val("");
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
            },
        });
    });
}

// Display comments on shared posts
function getSharedPostCommentsHtml(sharedpost_comments) {
    getUsersSharedPostOnModal();
    var userid = $(".user-index").attr("data-userid");
    var sharedpost_commentsHtml = "";
    var sharedpost_commentCount = 0;
    var sharedpost_showMoreButton = false;

    $.each(sharedpost_comments, function (i, sharedpost_comment) {
        if (sharedpost_commentCount < 3) {
            var postOptions = "";
            if (userid === sharedpost_comment.user_id) {
                postOptions = `
                    <ul class="dropdown-menu">
                        <li>
                            <form class="deleteSPCommentForm" method="POST">
                                <input type="hidden" name="user_id" value="${sharedpost_comment.user_id}">
                                <input type="hidden" name="shared_post_id" value="${sharedpost_comment.shared_post_id}">
                                <input type="hidden" name="sharedpost_comment_id" value="${sharedpost_comment.sharedpost_comment_id}">
                                <button type="submit" class="dropdown-item menu-option">Delete</button>
                            </form>
                        </li>
                    </ul>
                `;
            } else {
                postOptions = `
                    <ul class="dropdown-menu">
                        <li><button type="submit" class="dropdown-item menu-option">Report</button></li>
                    </ul>
                `;
            }
            var sharedpost_commentHtml = `
                <div class="row">
                    <div class="col">
                        <div class="comment-txtfld">
                            <img src="src/css/images/free-display-photos/${sharedpost_comment.user_avatar}" class="sm-avatar comment-avatar" alt="${sharedpost_comment.user_avatar}">
                            <div class="comment-content">
                                <p class="users-name">${sharedpost_comment.username}</p>
                                <p class="users-comment">${sharedpost_comment.comment_text}</p>
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
            sharedpost_commentsHtml += sharedpost_commentHtml;
        } else {
            shared_post_id = sharedpost_comment.shared_post_id;
            sharedpost_showMoreButton = true;
            return false;
        }
        sharedpost_commentCount++;
    });

    if (sharedpost_showMoreButton) {
        sharedpost_commentsHtml += `
            <div class="row">
                <div class="col">
                    <div class="show-more-comments">
                        <button class="sharedpost-show-more smore-btn" type="button" data-bs-toggle="modal" data-bs-target="#viewSharedPost" data-sharedpost-id="${shared_post_id}">Show More</button>
                    </div>
                </div>
            </div>
        `;
    }
    return sharedpost_commentsHtml;
}

// Display and get shared post on modal
function getUsersSharedPostOnModal() {
    $(document).on("click", ".sharedpost-show-more", function () {
        var sharedpost_id = $(this).attr("data-sharedpost-id");

        $.ajax({
            url: "actions/user-discussion-feed/get-modal-sharedpost-content-details.php",
            method: "POST",
            data: {
                sharedpost_id: sharedpost_id,
            },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    var post = response.posts[0];
                    var user_post = $("#modalUserSharedPost");
                    var commentsHtml = "";

                    for (var i = 0; i < post.comments.length; i++) {
                        var comment = post.comments[i];
                        var postOptions = "";

                        if (sharedpost_id != post.user_id) {
                            postOptions = `
                                <ul class="dropdown-menu">
                                    <li>
                                        <form class="deleteSPCommentForm" method="POST">
                                            <input type="hidden" name="user_id" value="${comment.user_id}">
                                            <input type="hidden" name="shared_post_id" value="${comment.shared_post_id}">
                                            <input type="hidden" name="sharedpost_comment_id" value="${comment.sharedpost_comment_id}">
                                            <button type="submit" class="dropdown-item menu-option">Delete</button>
                                        </form>
                                    </li>
                                </ul>
                            `;
                        } else {
                            postOptions = `
                                <ul class="dropdown-menu">
                                    <li><button type="submit" class="dropdown-item menu-option">Report</button></li>
                                </ul>
                            `;
                        }

                        var commentHtml = `
                            <div class="row">
                                <div class="col">
                                    <div class="comment-txtfld">
                                        <img src="src/css/images/free-display-photos/${comment.user_avatar}" class="sm-avatar comment-avatar" alt="${comment.user_avatar}">
                                        <div class="comment-content">
                                            <p class="users-name">${comment.username}</p>
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
                    }

                    var likeSharedPost = "";
                    var sharedPostBtnClass = post.sharedpost_liked_by_user ? "sharedpost-liked-btn" : "like-shared-post";

                    likeSharedPost = `
                        <button class="${sharedPostBtnClass}" type="submit" data-sharedpostid="${post.shared_post_id}" data-content-id="${post.content_id}" data-user-id="${post.current_user_id}">
                            <i class="bi bi-hand-thumbs-up-fill"> 
                                <span class="like-count">${post.sharedpost_likes}</span>
                            </i>
                        </button>
                    `;

                    var userpostHTML = `
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="users_name">${post.sharedpost_username}'s Shared Post</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="users-contents">
                                    <div class="user-info">
                                        <img src="src/css/images/free-display-photos/${post.sharedpost_user_avatar}" class="sm-avatar" alt="${post.sharedpost_user_avatar}">
                                        <p>${post.sharedpost_username}</p>
                                    </div>
                                    <div class="content">
                                        <p class="user-post-content">${post.shared_text_content}</p>
                                    </div>
                                    <div class="box">
                                        <div class="user-content">
                                            <div class="user-info">
                                                <img src="src/css/images/free-display-photos/${post.post_user_avatar}"
                                                    class="sm-avatar" alt="${post.post_user_avatar}">
                                                <p>${post.post_username}</p>
                                            </div>
                                            <div class="content">
                                                <p class="user-post-content">${post.post_content}</p>
                                                <h5 class="topic">Topic Discussed: ${post.post_topic}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="social-buttons">
                                    ${likeSharedPost}
                                    <button class="comment-btn"><i class="bi bi-chat-square-text-fill"></i></button>
                                    <button type="button" class="share-btn" data-bs-toggle="modal" data-bs-target="#sharePost" data-userid="${post.current_user_id}" data-sharedpost-id="${post.shared_post_id}" data-postid="${post.content_id}"><i class="bi bi-box-arrow-in-up-right"></i></button>
                                </div>
                                <div class="sharedpost-comment-section" id="userComments">
                                    <!-- Display comments using a loop -->
                                    ${commentsHtml}
                                    <div class="row">
                                        <div class="col">
                                            <div class="comment-txtfld">
                                                <img src="src/css/images/free-display-photos/${post.current_user_avatar}" class="sm-avatar comment-avatar" alt="${post.current_user_avatar}" id="usersAvatar">
                                                <form id="sharedpost_commentForm" method="POST" class="sharedpost-comment-form all-comment-form">
                                                    <input type="text" name="user_comment" class="input-comment" placeholder="Write your comment here..." autocomplete="off" required="">
                                                    <input type="hidden" name="shared_post_id" value="${post.shared_post_id}">
                                                    <input type="hidden" name="user_content_id" value="${post.current_user_id}">
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    // Check if modal already exists
                    if (user_post.children().length > 0) {
                        user_post.empty();
                    }
                    user_post.append(userpostHTML);
                } else {
                    console.log("Error:", response.message);
                }
            },
            error: function (xhr, status, error) {
                // Handle errors here
                console.log(error);
            },
        });
    });
}

// Report user's account
function reportUserAccount() {
    // Open Modal [Report User]
    $(document).on("click", ".modal-report", function () {
        var receiver_name = $('.user-name').text();
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
        var urlParams = new URLSearchParams(window.location.search);
        var report_content = $('.report-details').text();
        var current_user_id = $(".user-index").attr("data-userid");
        var report_user_id = urlParams.get("user_id");

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

// Block and Unblock user's account
function blockUsersAccount() {
    // Open Modal [Block User]
    $(document).on("click", ".modal-block-useracc", function (event) {
        event.preventDefault();
        var block_username = $('.user-name').text();
        var modalDialog = $("#blockUserAccDialog");

        var modalHTML = `
            <div class="modal-content modal-block-user-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Block ${block_username}?</h1>
                </div>
                <div class="modal-body">
                    <p class="fw-light">${block_username} will no longer be able to:</p>
                    <ul class="mt-4 mb-4 fw-light">
                        <li>View your posts on your profile.</li>
                        <li>Send you invitations to join guilds.</li>
                        <li>Send you private messages or direct messages.</li>
                        <li>Follow your account.</li>
                    </ul>
                    <p class="fw-light">Please note that if you were previously following each other, blocking ${block_username} will also automatically unfollow his account.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="modal-opt-btn" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="modal-opt-btn block-useracc">Understood</button>
                </div>
            </div>
        `;

        if (modalDialog.children().length > 0) {
            modalDialog.empty();
        }
        modalDialog.append(modalHTML);
    });

    // If click understood, user will [Block]
    $(document).on("click", ".block-useracc", function (event) {
        event.preventDefault();
        var urlParams = new URLSearchParams(window.location.search);
        var current_user_id = $(".user-index").attr("data-userid");
        var reported_user_id = urlParams.get("user_id");

        $.ajax({
            url: "actions/user-profile-feed/user-block-account.php",
            method: "POST",
            data: { current_user_id: current_user_id,
                    reported_user_id: reported_user_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    $("#blockUserAccount").modal("hide");
                    $('#blockUserAccButton label').text('Unblock');
                    $('#blockUserAccButton').removeClass("modal-block-useracc").addClass("modal-unblock-useracc");
                    location.reload();
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors here
                console.log(error);
            },
        });
    });

    // Open Modal [Unblock User]
    $(document).on("click", ".modal-unblock-useracc", function (event) {
        event.preventDefault();
        var block_username = $('.user-name').text();
        var receiver_id = $('.user-information').data("receiver-id");
        var modalDialog = $("#unblockUserAccDialog");

        var modalHTML = `
            <div class="modal-content modal-block-user-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Unblock ${block_username}?</h1>
                </div>
                <div class="modal-body">
                    <p class="mb-0 fw-light">Do you confirm that you want to unblock ${block_username}? By unblocking it, ${block_username} may gain visibility into your profile and be able to contact you.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="modal-opt-btn" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="modal-opt-btn unblock-user">Confirm</button>
                </div>
            </div>
        `;

        if (modalDialog.children().length > 0) {
            modalDialog.empty();
        }
        modalDialog.append(modalHTML);
    });

    // If click confirm, user will [Unblock]
    $(document).on("click", ".unblock-user", function () {
        var urlParams = new URLSearchParams(window.location.search);
        var current_user_id = $(".user-index").attr("data-userid");
        var reported_user_id = urlParams.get("user_id");

        $.ajax({
            url: "actions/user-profile-feed/user-unblock-account.php",
            method: "POST",
            data: { current_user_id: current_user_id,
                    reported_user_id: reported_user_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    $("#unblockUserAccount").modal("hide");
                    $('#unblockUserAccButton label').text('Block');
                    $('#unblockUserAccButton').removeClass("modal-unblock-useracc").addClass("modal-block-useracc");
                    location.reload();
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors here
                console.log(error);
            },
        });
    });
}

// Follow and Unfollow User
function followsUsers() {
    // Follow
    $(document).on("click", ".follow-user", function (event) {
        event.preventDefault();
        var urlParams = new URLSearchParams(window.location.search);
        var follower_id = $(".user-index").attr("data-userid");
        var following_id = urlParams.get("user_id");

        $.ajax({
            url: "actions/user-profile-feed/user-follow.php",
            method: "POST",
            data: { follower_id: follower_id,
                    following_id: following_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    $('#followUser').attr("data-followid", response.follow_id);
                    $('#followUser label').text('Followed');
                    $('#followUser').attr("id", "unfollowUser");
                    $('#unfollowUser').removeClass("follow-user").addClass("unfollow-user");
                    $("#unfollowUser i").removeClass("bi-person-fill").addClass("bi-person-check-fill");
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors here
                console.log(error);
            },
        });
    });

    // Unfollow
    $(document).on("click", ".unfollow-user", function (event) {
        event.preventDefault();
        var urlParams = new URLSearchParams(window.location.search);
        var follow_id = $("#unfollowUser").attr("data-followid");
        var follower_id = $(".user-index").attr("data-userid");
        var following_id = urlParams.get("user_id");

        $.ajax({
            url: "actions/user-profile-feed/user-unfollow.php",
            method: "POST",
            data: { follow_id: follow_id,
                    follower_id: follower_id,
                    following_id: following_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    $('#unfollowUser').attr("data-followid", "");
                    $('#unfollowUser label').text('Follow');
                    $('#unfollowUser').attr("id", "followUser");
                    $('#followUser').removeClass("unfollow-user").addClass("follow-user");
                    $("#followUser i").removeClass("bi-person-fill").addClass("bi-person-fill");
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors here
                console.log(error);
            },
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

function followerFollowing() {
    // Followers
    $(document).on('click', '.followers', function () {
        loadFollowers();
        var followersDialog = $("#followersDialog");
        var modalContent = `
            <div class="modal-content modal-follows-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5 text-pink">Followers</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul id="followersList"></ul>
                </div>
            </div>
        `;

        // Check if modal already exists
        if (followersDialog.children().length > 0) {
            followersDialog.empty();
        }
        followersDialog.append(modalContent);
    });

    // Follow
    $(document).on("click", ".follow-btn", function () {
        var follower_id = $(".user-index").attr("data-userid");
        var following_id = $(this).attr("data-following-id");
        var button = $(this);

        $.ajax({
            url: "actions/user-profile-feed/user-follow.php",
            method: "POST",
            data: { follower_id: follower_id,
                    following_id: following_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    button.text('Followed');
                    button.attr('data-follow-id', response.follow_id);
                    button.removeClass('follow-btn').addClass('unfollow-btn');
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors here
                console.log(error);
            },
        });
    });

    // Following
    $(document).on('click', '.following', function () {
        loadFollowing();
        var followingDialog = $("#followingDialog");

        var modalContent = `
            <div class="modal-content modal-follows-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5 text-pink">Following</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul id="followingList"></ul>
                </div>
            </div>
        `;

        // Check if modal already exists
        if (followingDialog.children().length > 0) {
            followingDialog.empty();
        }
        followingDialog.append(modalContent);
    });

    // Unfollow
    $(document).on("click", ".unfollow-btn", function () {
        var follower_id = $(".user-index").attr("data-userid");
        var following_id = $(this).attr("data-following-id");
        var follow_id = $(this).attr("data-follow-id");
        var button = $(this);

        $.ajax({
            url: "actions/user-profile-feed/user-unfollow.php",
            method: "POST",
            data: { follow_id: follow_id,
                    follower_id: follower_id,
                    following_id: following_id },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    button.text('Follow');
                    button.attr('data-follow-id', " ");
                    button.removeClass('unfollow-btn').addClass('follow-btn');
                }
            },
            error: function (xhr, status, error) {
                // Handle AJAX errors here
                console.log(error);
            },
        });
    });
}

function loadFollowers() {
    var current_user_id = $('.user-index').attr('data-userid');
    $.ajax({
        method: "POST",
        url: "actions/user-profile-feed/get-user-followers.php",
        data: {
            current_user_id: current_user_id,
        },
        dataType: "json",
        success: function (response) {
            var followersList = $("#followersList");
            followersList.empty();
            if (response.status === 'success') {
                if (response.followers.length > 0) {
                    response.followers.forEach(function (follower) {
                        var button = '';

                        if (follower.is_following) {
                            button = `<button class="unfollow-btn" data-follow-id="${follower.follow_id}" data-following-id="${follower.follower_user_id}">Followed</button>`;
                        } else {
                            button = `<button class="follow-btn" data-follow-id="" data-following-id="${follower.follower_user_id}">Follow</button>`;
                        }
            
                        var followerHtml = `
                            <li>
                                <div class="follower-info">
                                    <a class="text-light text-decoration-none" href="user-profile-page.php?user_id=${follower.follower_user_id}">
                                        <img src="src/css/images/free-display-photos/${follower.follower_avatar}" class="mx-2 bi sidebar-dp" alt="${follower.follower_avatar}">
                                        <label>${follower.follower_name}</label>
                                    </a>
                                </div>
                                ${button}
                            </li>
                        `; 
                        followersList.append(followerHtml);
                    });
                } else {
                    followersList.append('<p class="mb-0 text-center">'+ response.message +'</p>');
                }
            } else {
                followersList.append('<p class="mb-0 text-center">'+ response.message +'</p>');
            }
            
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function loadFollowing() {
    var current_user_id = $('.user-index').attr('data-userid');
    $.ajax({
        method: "POST",
        url: "actions/user-profile-feed/get-user-following.php",
        data: {
            current_user_id: current_user_id,
        },
        dataType: "json",
        success: function (response) {
            var followingList = $("#followingList");
            followingList.empty();
            if (response.status === "success") {
                response.following.forEach(function (follow) {
                    var followingHtml = `
                        <li>
                            <div class="following-info">
                                <a class="text-light text-decoration-none" href="user-profile-page.php?user_id=${follow.following_user_id}">
                                    <img src="src/css/images/free-display-photos/${follow.following_avatar}" class="mx-2 bi sidebar-dp" alt="${follow.following_avatar}">
                                    <label>${follow.following_name}</label>
                                </a>
                            </div>
                            <button class="unfollow-btn" data-follow-id=${follow.follow_id} data-following-id="${follow.following_user_id}">
                                Unfollow
                            </button>
                        </li>
                    `;
                    followingList.append(followingHtml);
                });
            } else {
                followingList.append('<p class="mb-0 text-center">'+ response.message +'</p>');
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
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