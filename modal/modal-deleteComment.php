<div class="modal fade" id="modal-<?php echo $comments_results['user_comment_id'];?>" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content delete-comment-modal">
            <form action="actions/user-delete-comment.php" method="POST">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Delete Comment</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" name="user_comment" value="<?php echo $comments_results['user_comment_id'];?>">
                    <input type="hidden" name="user_id" value="<?php echo $user_data['user_id'];?>">
                    <p>Are you sure you want to delete your comment?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-edit" data-bs-dismiss="modal">No</button>
                    <button type="submit" class="btn btn-edit">Yes</button>
                </div>
            </form>
        </div>
    </div>
</div>
