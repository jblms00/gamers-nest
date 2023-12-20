<div class="modal fade" id="modal-<?php echo $get_result['user_content_id'];?>" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content modal-view-comments">
            <div class="modal-header d-flex justify-content-center">
                <?php 
                    $username_query = "SELECT * FROM users_accounts WHERE user_id = ".$get_result['user_id']."";
                    $get_username = mysqli_query($con, $username_query);
                    $result_username = mysqli_fetch_array($get_username);
                ?>

                <h1 class="modal-title fs-5 text-center mx-auto" id="exampleModalLabel">Posted by <?php echo $result_username['username']?></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="users-contents">
                    <div class="user-info">
                        <img src="src/css/images/free-display-photos/<?php echo $user_data['user_avatar'];?>" class="sm-avatar" alt="Avatar">
                        <p><?php echo $user_data['username']?></p>
                    </div>
                    <div class="content">
                        <div class="scrollable-content">
                            <p class="user-post-content"><?php echo $get_result['user_content']?></p>
                        </div>
                        <h5 class="topic">Topic Discussed: <?php echo $get_result['user_topic']?></h5>
                    </div>
                </div>
                <div class="social-buttons">
                    <button class="like-btn" onclick="likePost(<?php echo $get_result['user_content_id']?>)">Like</button>
                    <button class="comment-btn" onclick="showCommentSection(<?php echo $get_result['user_content_id']?>)">Comment</button>
                    <button class="share-btn" onclick="sharePost(<?php echo $get_result['user_content_id']?>)">Share</button>
                </div>
                <div class="comment-section" id="comment-section-<?php echo $get_result['user_content_id']?>">
                    <div class="row">
                        <div class="col">
                            <div class="comment-txtfld">
                                <img src="src/css/images/free-display-photos/<?php echo $user_data['user_avatar'];?>" class="sm-avatar comment-avatar" alt="Avatar">
                                <form action="actions/user-add-comment.php" method="POST" class="comment-form">
                                    <input type="text" name="user_comment" placeholder="Write your comment here..." autocomplete="off">

                                    <input type="hidden" name="user_id" value="<?php echo $user_data['user_id']?>">
                                    <input type="hidden" name="user_content_id" value="<?php echo $get_result['user_content_id']?>">
                                    <button type="submit" class="btn-post">Comment</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <?php
                        // Fetch only the comments for the current post
                        $query_comments = "SELECT * FROM user_contents_comments WHERE user_content_id = ".$get_result['user_content_id']." ORDER BY user_created_at DESC";
                        $get_comments = mysqli_query($con, $query_comments);

                        while ($comments_results = mysqli_fetch_array($get_comments)) {
                    ?>
                    <div class="other-comments">
                        <div class="user-info">
                            <img src="src/css/images/free-display-photos/<?php echo $user_data['user_avatar']; ?>" class="sm-avatar comment-avatar" alt="Avatar">
                        </div>
                        <div class="user-field">
                            <p><?php echo $user_data['username']; ?></p>
                            <div class="content">
                                <p class="user-comments"><?php echo $comments_results['comment_text']; ?></p>
                            </div>
                        </div>
                        <form action="actions/user-delete-comment.php" method="POST">
                            <button class="delete-button" type="submit">
                                <input type="hidden" name="user_comment" value="<?php echo $comments_results['user_comment_id'];?>">
                                <input type="hidden" name="user_id" value="<?php echo $user_data['user_id'];?>">
                                <i class="bi bi-trash3-fill"></i>
                            </button>
                        </form>
                    </div>
                    <?php } ?>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-edit" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>