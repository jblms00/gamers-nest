<?php
include("database-connect.php");
$data = [];

function getUpdatedUserStatus($con, $current_user_id)
{
    $current_user_id = mysqli_real_escape_string($con, $current_user_id);

    // Query your database to get updated statuses
    $query = "SELECT user_id, user_status FROM users_accounts WHERE user_id != '$current_user_id'";
    $result = mysqli_query($con, $query);

    $updated_users = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $updated_users[] = $row;
    }
    return $updated_users;
}

function getUpdatedUserPosts($con)
{
    // Query your database to get updated user posts
    $query_posts = "SELECT * FROM user_posted_content";
    $result_posts = mysqli_query($con, $query_posts);

    $updated_posts = array();
    while ($row = mysqli_fetch_assoc($result_posts)) {
        $updated_posts[] = $row;
    }
    return $updated_posts;
}

function getUpdatedUserComments($con)
{
    $query_comments = "SELECT * FROM user_contents_comments";
    $result_comments = mysqli_query($con, $query_comments);

    $updated_comments = array();
    while ($row = mysqli_fetch_assoc($result_comments)) {
        $updated_comments[] = $row;
    }
    return $updated_comments;
}

function getUpdatedUserSharePosts($con)
{
    $query_sharedposts = "SELECT * FROM user_shared_post";
    $result_sharedposts = mysqli_query($con, $query_sharedposts);

    $updated_sharedposts = array();
    while ($row = mysqli_fetch_assoc($result_sharedposts)) {
        $updated_sharedposts[] = $row;
    }
    return $updated_sharedposts;
}

function getUpdatedUserSharedPostsComments($con)
{
    $query_spcomments = "SELECT * FROM user_sharedpost_comments";
    $result_spcomments = mysqli_query($con, $query_spcomments);

    $updated_spcomments = array();
    while ($row = mysqli_fetch_assoc($result_spcomments)) {
        $updated_spcomments[] = $row;
    }
    return $updated_spcomments;
}

function getUpdatedUserPostsLikes($con)
{
    $query_posts_likes = "SELECT * FROM user_posts_likes";
    $result_posts_likes = mysqli_query($con, $query_posts_likes);

    $updated_posts_likes = array();
    while ($row = mysqli_fetch_assoc($result_posts_likes)) {
        $updated_posts_likes[] = $row;
    }
    return $updated_posts_likes;
}

function getUpdatedUserSharedPostsLikes($con)
{
    $query_sposts_likes = "SELECT * FROM user_shared_posts_likes";
    $result_sposts_likes = mysqli_query($con, $query_sposts_likes);

    $updated_sposts_likes = array();
    while ($row = mysqli_fetch_assoc($result_sposts_likes)) {
        $updated_sposts_likes[] = $row;
    }
    return $updated_sposts_likes;
}

function getUpdatedConversation($con, $current_user_id)
{
    $current_user_id = mysqli_real_escape_string($con, $current_user_id);

    $query_convos = "SELECT * FROM user_conversation_room";
    $result_convos = mysqli_query($con, $query_convos);

    $query_messages = "SELECT * FROM user_messages";
    $result_messages = mysqli_query($con, $query_messages);

    $updated_convos = array();
    while ($row_convos = mysqli_fetch_assoc($result_convos)) {
        $updated_convos[] = $row_convos;
    }

    $updated_messages = array();
    while ($row_messages = mysqli_fetch_assoc($result_messages)) {
        $updated_messages[] = $row_messages;
    }

    return array('updated_convos' => $updated_convos, 'updated_messages' => $updated_messages);
}

function getUpdatedUserGuilds($con)
{
    $query_guilds_likes = "SELECT * FROM users_guilds";
    $result_guilds_likes = mysqli_query($con, $query_guilds_likes);

    $updated_guilds_likes = array();
    while ($row = mysqli_fetch_assoc($result_guilds_likes)) {
        $updated_guilds_likes[] = $row;
    }
    return $updated_guilds_likes;
}

function getUpdatedUserGuildConversation($con, $guild_id, $guild_name)
{
    $query_guilds_convo = "SELECT * FROM guild_conversation_room WHERE guild_name = '$guild_name'";
    $result_guilds_convo = mysqli_query($con, $query_guilds_convo);

    $updated_guilds_gconvo = array();
    while ($row = mysqli_fetch_assoc($result_guilds_convo)) {
        $updated_guilds_gconvo[] = $row;
    }

    // You need to extract the conversation room IDs from the guild conversation rooms
    $convo_room_ids = array_column($updated_guilds_gconvo, 'convo_room_id');
    $convo_room_ids_str = implode(',', $convo_room_ids);

    // Now fetch the messages for the extracted conversation room IDs
    $query_guilds_gmessage = "SELECT * FROM user_messages WHERE convo_room_id IN ($convo_room_ids_str)";
    $result_guilds_gmessage = mysqli_query($con, $query_guilds_gmessage);

    $updated_guilds_gmessage = array();
    while ($row = mysqli_fetch_assoc($result_guilds_gmessage)) {
        $updated_guilds_gmessage[] = $row;
    }
    return array('updated_gmessages' => $updated_guilds_gmessage, 'updated_gconvo' => $updated_guilds_gconvo);
}

function getUpdatedUserGuildPosts($con, $guild_id)
{
    $query_guilds_posts = "SELECT * FROM user_guild_posts WHERE guild_id = '$guild_id'";
    $result_guilds_posts = mysqli_query($con, $query_guilds_posts);

    $updated_guilds_gposts = array();
    while ($row = mysqli_fetch_assoc($result_guilds_posts)) {
        $updated_guilds_gposts[] = $row;
    }

    return $updated_guilds_gposts;
}

function getUpdatedUserGuildRequest($con)
{
    $query_guilds_request = "SELECT * FROM user_guild_request";
    $result_guilds_request = mysqli_query($con, $query_guilds_request);

    $updated_guilds_request = array();
    while ($row = mysqli_fetch_assoc($result_guilds_request)) {
        $updated_guilds_request[] = $row;
    }

    return $updated_guilds_request;
}

function getUpdatedVoiceRoom($con)
{
    $query_vroom = "SELECT * FROM voice_room";
    $result_vroom = mysqli_query($con, $query_vroom);

    $updated_vroom = array();
    while ($row = mysqli_fetch_assoc($result_vroom)) {
        $updated_vroom[] = $row;
    }

    return $updated_vroom;
}

$current_user_id = $_POST['current_user_id'];

$updated_users = getUpdatedUserStatus($con, $current_user_id);
$updated_posts = getUpdatedUserPosts($con);
$updated_sharedposts = getUpdatedUserSharePosts($con);
$updated_comments = getUpdatedUserComments($con);
$updated_spcomments = getUpdatedUserSharedPostsComments($con);
$updated_posts_likes = getUpdatedUserPostsLikes($con);
$updated_sposts_likes = getUpdatedUserSharedPostsLikes($con);
$updated_data = getUpdatedConversation($con, $current_user_id);
$updated_convos = $updated_data['updated_convos'];
$updated_messages = $updated_data['updated_messages'];
$updated_guilds_likes = getUpdatedUserGuilds($con);
$updated_guild_data = getUpdatedUserGuildConversation($con, $guild_id, $guild_name);
$updated_gmessages = $updated_data['updated_gmessages'];
$updated_gconvo = $updated_data['updated_gconvo'];
$updated_guilds_gposts = getUpdatedUserGuildPosts($con, $guild_id);
$updated_guilds_request = getUpdatedUserGuildRequest($con);
$updated_vroom = getUpdatedVoiceRoom($con);

mysqli_close($con);

$data['status'] = "success";
$data['message'] = "Updated data complete.";
$data['updated_guild_data'] = $updated_guild_data;
$data['updated_users'] = $updated_users;
$data['updated_posts'] = $updated_posts;
$data['updated_comments'] = $updated_comments;
$data['updated_sharedposts'] = $updated_sharedposts;
$data['updated_spcomments'] = $updated_spcomments;
$data['updated_posts_likes'] = $updated_posts_likes;
$data['updated_sposts_likes'] = $updated_sposts_likes;
$data['updated_convos'] = $updated_convos;
$data['updated_messages'] = $updated_messages;
$data['updated_guilds_likes'] = $updated_guilds_likes;
$data['updated_guilds_gposts'] = $updated_guilds_gposts;
$data['updated_guilds_request'] = $updated_guilds_request;
$data['updated_vroom'] = $updated_vroom;

echo json_encode($data);