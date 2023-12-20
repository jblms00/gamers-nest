-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 14, 2023 at 11:30 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gamersnest_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `blocked_users`
--

CREATE TABLE `blocked_users` (
  `block_id` int(20) NOT NULL,
  `blocking_user_id` int(20) NOT NULL,
  `blocked_user_id` int(20) NOT NULL,
  `block_timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `guild_conversation_room`
--

CREATE TABLE `guild_conversation_room` (
  `guild_room_id` int(20) NOT NULL,
  `guild_name` text NOT NULL,
  `sender_id` int(20) NOT NULL,
  `status` text NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guild_conversation_room`
--

INSERT INTO `guild_conversation_room` (`guild_room_id`, `guild_name`, `sender_id`, `status`, `created_at`) VALUES
(810623, 'BlackLIST', 69737071, 'active', '2023-11-09 17:19:06');

-- --------------------------------------------------------

--
-- Table structure for table `users_accounts`
--

CREATE TABLE `users_accounts` (
  `user_id` int(12) NOT NULL,
  `username` text NOT NULL,
  `user_email` text NOT NULL,
  `user_password` text NOT NULL,
  `user_banner` text NOT NULL,
  `user_avatar` text NOT NULL,
  `user_bio` text NOT NULL,
  `user_status` text NOT NULL,
  `account_status` text NOT NULL,
  `suspended_date` text NOT NULL,
  `user_type` text NOT NULL,
  `account_created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_accounts`
--

INSERT INTO `users_accounts` (`user_id`, `username`, `user_email`, `user_password`, `user_banner`, `user_avatar`, `user_bio`, `user_status`, `account_status`, `suspended_date`, `user_type`, `account_created`) VALUES
(21292800, 'admin', 'admin@admin.com', 'dGVzdDEyMy4=', '', '', '', 'Offline', '', '', 'admin', '2023-08-16 13:08:30'),
(24200112, 'jj_', 'jj@gmail.com', 'dGVzdDEyMy4=', 'default-banner.jpg', 'default-avatar.png', '', 'Offline', 'Active', '', 'user', '2023-11-08 10:37:58'),
(49494039, 'jblms_', 'jb@gmail.com', 'dGVzdDEyMy4=', 'fb2.jpg', 'dp2.png', '', 'Offline', 'Active', '', 'user', '2023-11-07 22:56:38'),
(67524340, 'dan', '20100219@spcba.edu.ph', 'YWRvbmlzMjAwMS4=', 'default-banner.jpg', 'default-avatar.png', '', 'Offline', 'Active', '', 'user', '2023-11-11 12:10:45'),
(69737071, 'karl__', 'karl@gmail.com', 'dGVzdDEyMy4=', 'default-banner.jpg', 'default-avatar.png', '', 'Offline', 'Active', '', 'user', '2023-11-08 06:33:01'),
(72613716, 'misyel_', 'misyel@gmail.com', 'dGVzdDEyMy4=', 'fb1.jpg', 'dp9.png', 'If the King doesn\'t move, then his subject won\'t follow.', 'Offline', 'Active', '', 'user', '2023-08-11 17:12:41');

-- --------------------------------------------------------

--
-- Table structure for table `users_guilds`
--

CREATE TABLE `users_guilds` (
  `guild_id` int(30) NOT NULL,
  `guild_creator_id` int(30) NOT NULL,
  `guild_name` text NOT NULL,
  `guild_description` text NOT NULL,
  `guild_members` text NOT NULL,
  `users_ids` varchar(150) NOT NULL,
  `guild_banner` text NOT NULL,
  `guild_logo` varchar(120) NOT NULL,
  `guild_status` text NOT NULL,
  `guild_created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users_guilds`
--

INSERT INTO `users_guilds` (`guild_id`, `guild_creator_id`, `guild_name`, `guild_description`, `guild_members`, `users_ids`, `guild_banner`, `guild_logo`, `guild_status`, `guild_created_at`) VALUES
(128650, 69737071, 'BlackLIST', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum accusantium sint totam? Quia quasi reiciendis in! Fugit ipsam animi a consequuntur, praesentium cumque deserunt exercitationem corporis, perspiciatis molestias, nobis odit.', 'dan,jblms_', '67524340,49494039', 'default-banner.jpg', 'default-logo.png', 'active', '2023-11-09 02:19:06');

-- --------------------------------------------------------

--
-- Table structure for table `users_reports`
--

CREATE TABLE `users_reports` (
  `report_id` int(20) NOT NULL,
  `user_id` int(20) NOT NULL,
  `reported_user_id` int(20) NOT NULL,
  `report_option` text NOT NULL,
  `mark_as` text NOT NULL,
  `report_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_contents_comments`
--

CREATE TABLE `user_contents_comments` (
  `user_comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` text NOT NULL,
  `user_avatar` text NOT NULL,
  `user_content_id` int(11) NOT NULL,
  `comment_text` text NOT NULL,
  `user_created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_contents_comments`
--

INSERT INTO `user_contents_comments` (`user_comment_id`, `user_id`, `username`, `user_avatar`, `user_content_id`, `comment_text`, `user_created_at`) VALUES
(363654, 67524340, 'dan', 'default-avatar.png', 436908, 'adonis', '2023-11-11 04:11:13');

-- --------------------------------------------------------

--
-- Table structure for table `user_conversation_room`
--

CREATE TABLE `user_conversation_room` (
  `convo_room_id` int(30) NOT NULL,
  `convo_room_name` text NOT NULL,
  `sender_id` int(20) NOT NULL,
  `receiver_id` int(20) NOT NULL,
  `sender_muted` text NOT NULL,
  `receiver_muted` text NOT NULL,
  `status` text NOT NULL,
  `is_blocked` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_conversation_room`
--

INSERT INTO `user_conversation_room` (`convo_room_id`, `convo_room_name`, `sender_id`, `receiver_id`, `sender_muted`, `receiver_muted`, `status`, `is_blocked`, `created_at`) VALUES
(345129, 'karl__ and jblms_', 69737071, 49494039, 'false', 'false', 'active', 'false', '2023-11-09 08:49:57');

-- --------------------------------------------------------

--
-- Table structure for table `user_follows`
--

CREATE TABLE `user_follows` (
  `follow_id` int(20) NOT NULL,
  `follower_id` int(20) NOT NULL,
  `following_id` int(20) NOT NULL,
  `follow_timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_follows`
--

INSERT INTO `user_follows` (`follow_id`, `follower_id`, `following_id`, `follow_timestamp`) VALUES
(346311, 49494039, 72613716, '2023-11-07 14:57:04'),
(366843, 49494039, 69737071, '2023-11-09 08:04:56'),
(653506, 49494039, 24200112, '2023-11-09 08:04:55'),
(777033, 69737071, 49494039, '2023-11-07 22:34:18');

-- --------------------------------------------------------

--
-- Table structure for table `user_guild_posts`
--

CREATE TABLE `user_guild_posts` (
  `guild_post_id` int(30) NOT NULL,
  `guild_id` int(30) NOT NULL,
  `user_id` int(30) NOT NULL,
  `user_posted_content` text NOT NULL,
  `media_upload` text NOT NULL,
  `media_orientation` text NOT NULL,
  `post_status` text NOT NULL,
  `posted_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_guild_request`
--

CREATE TABLE `user_guild_request` (
  `request_guild_id` int(11) NOT NULL,
  `guild_id` int(20) NOT NULL,
  `guild_name` text NOT NULL,
  `user_id` int(20) NOT NULL,
  `request_type` text NOT NULL,
  `request_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_messages`
--

CREATE TABLE `user_messages` (
  `message_id` int(20) NOT NULL,
  `convo_room_id` int(20) NOT NULL,
  `sender_id` int(20) NOT NULL,
  `receiver_id` int(20) NOT NULL,
  `messages` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `media_content` varchar(120) NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_messages`
--

INSERT INTO `user_messages` (`message_id`, `convo_room_id`, `sender_id`, `receiver_id`, `messages`, `media_content`, `sent_at`) VALUES
(129203, 345129, 49494039, 69737071, 'up', '', '2023-11-12 05:01:54'),
(147307, 345129, 69737071, 49494039, 'yooow', '', '2023-11-09 08:50:04'),
(799532, 345129, 69737071, 49494039, '', '', '2023-11-09 08:49:57');

-- --------------------------------------------------------

--
-- Table structure for table `user_notifications`
--

CREATE TABLE `user_notifications` (
  `notification_id` int(20) NOT NULL,
  `user_id` int(20) NOT NULL,
  `activity_type` text NOT NULL,
  `activity_id` int(20) NOT NULL,
  `sender_id` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_notifications`
--

INSERT INTO `user_notifications` (`notification_id`, `user_id`, `activity_type`, `activity_id`, `sender_id`, `timestamp`, `is_read`) VALUES
(517542, 67524340, 'like_post', 589656, '49494039', '2023-11-11 22:20:27', 'false');

-- --------------------------------------------------------

--
-- Table structure for table `user_posted_content`
--

CREATE TABLE `user_posted_content` (
  `user_content_id` int(20) NOT NULL,
  `user_id` int(20) NOT NULL,
  `username` text NOT NULL,
  `user_avatar` text NOT NULL,
  `user_content` text NOT NULL,
  `media_upload` varchar(120) NOT NULL,
  `media_orientation` text NOT NULL,
  `user_topic` text NOT NULL,
  `user_content_status` text NOT NULL,
  `user_posted_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_posted_content`
--

INSERT INTO `user_posted_content` (`user_content_id`, `user_id`, `username`, `user_avatar`, `user_content`, `media_upload`, `media_orientation`, `user_topic`, `user_content_status`, `user_posted_date`) VALUES
(436908, 49494039, 'jblms_', 'dp2.png', 'Hello World!', '0', '0', 'League of Legends', 'Public', '2023-11-09 16:03:31'),
(677769, 67524340, 'dan', 'default-avatar.png', 'dan', '0', '0', 'League of Legends', 'Public', '2023-11-11 12:12:04');

-- --------------------------------------------------------

--
-- Table structure for table `user_posts_likes`
--

CREATE TABLE `user_posts_likes` (
  `user_like_id` int(11) NOT NULL,
  `user_content_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `liked_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_posts_likes`
--

INSERT INTO `user_posts_likes` (`user_like_id`, `user_content_id`, `user_id`, `liked_at`) VALUES
(420978, 436908, 67524340, '2023-11-11 04:11:04'),
(589656, 677769, 49494039, '2023-11-12 05:20:27');

-- --------------------------------------------------------

--
-- Table structure for table `user_sharedpost_comments`
--

CREATE TABLE `user_sharedpost_comments` (
  `sharedpost_comment_id` int(11) NOT NULL,
  `shared_post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_content_id` int(11) NOT NULL,
  `username` text NOT NULL,
  `user_avatar` text NOT NULL,
  `comment_text` text NOT NULL,
  `comment_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_shared_post`
--

CREATE TABLE `user_shared_post` (
  `shared_post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_content_id` int(11) NOT NULL,
  `shared_text_content` text NOT NULL,
  `shared_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_shared_posts_likes`
--

CREATE TABLE `user_shared_posts_likes` (
  `sharedpost_like_id` int(11) NOT NULL,
  `shared_post_id` int(11) NOT NULL,
  `user_content_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `liked_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `voice_room`
--

CREATE TABLE `voice_room` (
  `room_id` int(20) NOT NULL,
  `user_id` int(20) NOT NULL,
  `room_name` text NOT NULL,
  `member_ids` text NOT NULL,
  `room_gameType` text NOT NULL,
  `room_coverImg` text NOT NULL,
  `room_status` text NOT NULL,
  `room_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blocked_users`
--
ALTER TABLE `blocked_users`
  ADD PRIMARY KEY (`block_id`);

--
-- Indexes for table `guild_conversation_room`
--
ALTER TABLE `guild_conversation_room`
  ADD PRIMARY KEY (`guild_room_id`);

--
-- Indexes for table `users_accounts`
--
ALTER TABLE `users_accounts`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `users_guilds`
--
ALTER TABLE `users_guilds`
  ADD PRIMARY KEY (`guild_id`);

--
-- Indexes for table `users_reports`
--
ALTER TABLE `users_reports`
  ADD PRIMARY KEY (`report_id`);

--
-- Indexes for table `user_contents_comments`
--
ALTER TABLE `user_contents_comments`
  ADD PRIMARY KEY (`user_comment_id`);

--
-- Indexes for table `user_conversation_room`
--
ALTER TABLE `user_conversation_room`
  ADD PRIMARY KEY (`convo_room_id`);

--
-- Indexes for table `user_follows`
--
ALTER TABLE `user_follows`
  ADD PRIMARY KEY (`follow_id`);

--
-- Indexes for table `user_guild_posts`
--
ALTER TABLE `user_guild_posts`
  ADD PRIMARY KEY (`guild_post_id`);

--
-- Indexes for table `user_guild_request`
--
ALTER TABLE `user_guild_request`
  ADD PRIMARY KEY (`request_guild_id`);

--
-- Indexes for table `user_messages`
--
ALTER TABLE `user_messages`
  ADD PRIMARY KEY (`message_id`);

--
-- Indexes for table `user_notifications`
--
ALTER TABLE `user_notifications`
  ADD PRIMARY KEY (`notification_id`);

--
-- Indexes for table `user_posted_content`
--
ALTER TABLE `user_posted_content`
  ADD PRIMARY KEY (`user_content_id`);

--
-- Indexes for table `user_posts_likes`
--
ALTER TABLE `user_posts_likes`
  ADD PRIMARY KEY (`user_like_id`);

--
-- Indexes for table `user_sharedpost_comments`
--
ALTER TABLE `user_sharedpost_comments`
  ADD PRIMARY KEY (`sharedpost_comment_id`);

--
-- Indexes for table `user_shared_post`
--
ALTER TABLE `user_shared_post`
  ADD PRIMARY KEY (`shared_post_id`);

--
-- Indexes for table `user_shared_posts_likes`
--
ALTER TABLE `user_shared_posts_likes`
  ADD PRIMARY KEY (`sharedpost_like_id`);

--
-- Indexes for table `voice_room`
--
ALTER TABLE `voice_room`
  ADD PRIMARY KEY (`room_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users_accounts`
--
ALTER TABLE `users_accounts`
  MODIFY `user_id` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2147483648;

--
-- AUTO_INCREMENT for table `users_guilds`
--
ALTER TABLE `users_guilds`
  MODIFY `guild_id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=948138;

--
-- AUTO_INCREMENT for table `users_reports`
--
ALTER TABLE `users_reports`
  MODIFY `report_id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=946346;

--
-- AUTO_INCREMENT for table `user_contents_comments`
--
ALTER TABLE `user_contents_comments`
  MODIFY `user_comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=998652;

--
-- AUTO_INCREMENT for table `user_conversation_room`
--
ALTER TABLE `user_conversation_room`
  MODIFY `convo_room_id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=997848;

--
-- AUTO_INCREMENT for table `user_follows`
--
ALTER TABLE `user_follows`
  MODIFY `follow_id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=995502;

--
-- AUTO_INCREMENT for table `user_guild_posts`
--
ALTER TABLE `user_guild_posts`
  MODIFY `guild_post_id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=935042;

--
-- AUTO_INCREMENT for table `user_guild_request`
--
ALTER TABLE `user_guild_request`
  MODIFY `request_guild_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=977766;

--
-- AUTO_INCREMENT for table `user_messages`
--
ALTER TABLE `user_messages`
  MODIFY `message_id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=998033;

--
-- AUTO_INCREMENT for table `user_notifications`
--
ALTER TABLE `user_notifications`
  MODIFY `notification_id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=998646;

--
-- AUTO_INCREMENT for table `user_posted_content`
--
ALTER TABLE `user_posted_content`
  MODIFY `user_content_id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2147483648;

--
-- AUTO_INCREMENT for table `user_posts_likes`
--
ALTER TABLE `user_posts_likes`
  MODIFY `user_like_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=996394;

--
-- AUTO_INCREMENT for table `user_sharedpost_comments`
--
ALTER TABLE `user_sharedpost_comments`
  MODIFY `sharedpost_comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=966990;

--
-- AUTO_INCREMENT for table `user_shared_post`
--
ALTER TABLE `user_shared_post`
  MODIFY `shared_post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=996265;

--
-- AUTO_INCREMENT for table `user_shared_posts_likes`
--
ALTER TABLE `user_shared_posts_likes`
  MODIFY `sharedpost_like_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=986972;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
