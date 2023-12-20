<?php

include("../database-connect.php");

$data = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $current_user_id = $_POST['user_id'];
    $sql_notifications = "SELECT * FROM user_notifications WHERE user_id = '$current_user_id' AND sender_id != '$current_user_id' ORDER BY timestamp DESC";
    $query_notifications = mysqli_query($con, $sql_notifications);
    $query_num_rows = mysqli_num_rows($query_notifications);
    $notifications = [];

    $data['id'] = $query_num_rows;

    while ($notification = mysqli_fetch_assoc($query_notifications)) {
        $current_notification = [
            'notification_id' => $notification['notification_id'],
            'user_id' => $notification['user_id'],
            'activity_type' => $notification['activity_type'],
            'activity_id' => $notification['activity_id'],
            'sender_id' => $notification['sender_id'],
            // Format timestamp as "time ago"
            'timestamp' => getTimeAgo($notification['timestamp']),
            'is_read' => $notification['is_read']
        ];

        $sender_id = $notification['sender_id'];
        $sql_sender = "SELECT * FROM users_accounts WHERE user_id = '$sender_id'";
        $query_sender_id = mysqli_query($con, $sql_sender);
        $num_rows_sender_id = mysqli_num_rows($query_sender_id);
        $sender_infos = [];

        if ($num_rows_sender_id > 0) {
            while ($fetch_sender_info = mysqli_fetch_assoc($query_sender_id)) {
                $get_guild_query = "SELECT * FROM users_guilds WHERE CONCAT(',', users_ids, ',') LIKE '%,$current_user_id,%'";
                $get_guild_result = mysqli_query($con, $get_guild_query);
                $fetch_guild = mysqli_fetch_assoc($get_guild_result);

                $sender_info = [
                    'user_avatar' => $fetch_sender_info['user_avatar'],
                    'username' => $fetch_sender_info['username'],
                    'guild_id' => $fetch_guild['guild_id'] ?? NULL,
                    'guild_name' => $fetch_guild['guild_name'] ?? NULL
                ];

                $guild_id = $fetch_guild['guild_id'] ?? NULL;
                $get_guild_request_query = "SELECT * FROM user_guild_request WHERE user_id = '$current_user_id'";
                $get_guild_request_result = mysqli_query($con, $get_guild_request_query);

                if ($get_guild_request_result) {
                    $fetch_guild_request = mysqli_fetch_assoc($get_guild_request_result);
                    $sender_info['request_guild_id'] = $fetch_guild_request['request_guild_id'] ?? 'none';
                    // $sender_info['guild_id'] = $fetch_guild['guild_id'] ?? 'none';
                    // $sender_info['guild_name'] = $fetch_guild_request['guild_name'] ?? 'none';
                }

                $get_guild_post_query = "SELECT * FROM user_guild_posts WHERE guild_id = '$guild_id'";
                $get_guild_post_result = mysqli_query($con, $get_guild_post_query);

                if ($get_guild_post_result) {
                    $fetch_guild_post = mysqli_fetch_assoc($get_guild_post_result);
                    $sender_info['guild_post_id'] = $fetch_guild_post['guild_post_id'] ?? 'none';
                }

                $sql_sender_content = "SELECT * FROM user_posted_content WHERE user_id = '$current_user_id'";
                $query_sender_content = mysqli_query($con, $sql_sender_content);

                if ($query_sender_content && mysqli_num_rows($query_sender_content) > 0) {
                    $fetch_sender_content = mysqli_fetch_assoc($query_sender_content);
                    $sender_info['user_content_id'] = $fetch_sender_content['user_content_id'];
                }

                $sql_sender_sharedpost = "SELECT * FROM user_shared_post WHERE user_id = '$current_user_id' OR user_id = '$sender_id'";
                $query_sender_sharedpost = mysqli_query($con, $sql_sender_sharedpost);

                if ($query_sender_sharedpost && mysqli_num_rows($query_sender_sharedpost) > 0) {
                    $fetch_sender_sharedpost = mysqli_fetch_assoc($query_sender_sharedpost);
                    $sender_info['shared_post_id'] = $fetch_sender_sharedpost['shared_post_id'];
                }
                $sql_get_message = "SELECT * FROM user_messages WHERE sender_id != '$current_user_id' ORDER BY sent_at DESC";
                $query_get_message = mysqli_query($con, $sql_get_message);

                if ($query_get_message && mysqli_num_rows($query_get_message) > 0) {
                    $fetch_message = mysqli_fetch_assoc($query_get_message);
                    $convo_room_id = $fetch_message['convo_room_id'];
                    $get_convo_room = "SELECT * FROM user_conversation_room WHERE convo_room_id = '$convo_room_id' AND sender_id = '$current_user_id' OR receiver_id = '$current_user_id' AND sender_muted = 'false' OR receiver_muted = 'false'";
                    $result_convo_room = mysqli_query($con, $get_convo_room);
                    $fetch_convo_room = mysqli_fetch_assoc($result_convo_room);

                    $sender_info['sender_muted'] = $fetch_convo_room['sender_muted'];
                    $sender_info['receiver_muted'] = $fetch_convo_room['receiver_muted'];

                    $sender_info['sender_id'] = $fetch_convo_room['sender_id'];
                    $sender_info['receiver_id'] = $fetch_convo_room['receiver_id'];

                    $sender_info['message_id'] = $fetch_message['message_id'];
                    $sender_info['convo_room_id'] = $convo_room_id;
                }

                array_push($sender_infos, $sender_info);
            }
        }

        $current_notification['sender_infos'] = $sender_infos;
        array_push($notifications, $current_notification);
    }

    if (!empty($notifications)) {
        $data['notifications'] = $notifications;
        $data['status'] = 'success';
    } else {
        $data['notifications'] = [];
        $data['status'] = 'empty';
    }
} else {
    $data['status'] = 'error';
    $data['message'] = 'Invalid request method.';
}

echo json_encode($data);

// Function to format timestamp as "time ago"
function getTimeAgo($timestamp)
{
    $timeAgo = strtotime($timestamp);
    $currentTime = time();
    $timeDifference = $currentTime - $timeAgo;

    $seconds = $timeDifference;
    $minutes = round($timeDifference / 60);
    $hours = round($timeDifference / 3600);
    $days = round($timeDifference / 86400);
    $weeks = round($timeDifference / 604800);
    $months = round($timeDifference / 2419200);
    $years = round($timeDifference / 29030400);

    if ($seconds <= 60) {
        return "Just now";
    } elseif ($minutes <= 60) {
        return $minutes . " minutes ago";
    } elseif ($hours <= 24) {
        return $hours . " hours ago";
    } elseif ($days <= 7) {
        return $days . " days ago";
    } elseif ($weeks <= 4) {
        return $weeks . " weeks ago";
    } elseif ($months <= 12) {
        return $months . " months ago";
    } else {
        return $years . " years ago";
    }
}
?>