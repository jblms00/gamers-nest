$(document).ready(function () {
    resetPassword();
});

function resetPassword() {
    $(document).on('submit', '#resetPasswordForm', function (event) {
        event.preventDefault();

        var user_email = $('#userEmail').val();
        var user_name = $('#userName').val();
        var resetPasswordForm = $('#resetPasswordForm');
        resetPasswordForm.find('.text-danger').remove();

        $.ajax({
            type: 'POST',
            url: 'actions/user-reset-password.php',
            data: { user_email: user_email,
                    user_name: user_name },
            dataType: "json",
            success: function (response) {
                if (response.status === 'success') {
                    var contentHTML = `
                        <div id="resetCodeForm">
                            <form id="verifyResetCodeForm">
                                <div class="form-group">
                                    <div class="row">
                                        <div class="col">
                                            <div class="form-floating mb-3">
                                                <p class="text-start text-secondary mt-3 mb-0 mx-2">New Password</p>
                                                <div class="d-flex align-items-center">
                                                    <input type="text" id="newPassword" value="${response.new_generated_password}" class="form-control" disabled="disabled">
                                                    <span id="clipboardIcon"><i class="bi bi-clipboard-fill"></i></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <p class="mb-2">Click here <a href="login-page.php">to login.</a></p>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    `;
                    resetPasswordForm.html(contentHTML);
                    resetPasswordForm.closest('#container').css('height', '16rem');
                    var clipboardAlert = $('<div class="alert alert-success p-0" role="alert">Copy to clipboard</div>');
        
                    // Toggle clipboard icon and revert after 3 seconds
                    $('#clipboardIcon').click(function () {
                        var icon = $(this).find('i');
                        icon.removeClass('bi-clipboard-fill').addClass('bi-clipboard-check-fill');

                        var newPasswordInput = $('#newPassword');
                        newPasswordInput.prop('disabled', false);
                        newPasswordInput.select();
                        document.execCommand('copy');
                        newPasswordInput.prop('disabled', true); 

                        // Clear existing clipboard alerts and append new one
                        resetPasswordForm.find('.alert-success').remove();
                        resetPasswordForm.append(clipboardAlert);

                        // Fade in and fade out the clipboard alert
                        clipboardAlert.fadeIn();
                        setTimeout(function () {
                            icon.removeClass('bi-clipboard-check-fill').addClass('bi-clipboard-fill');
                            clipboardAlert.fadeOut(function() {
                                clipboardAlert.remove();
                            });
                        }, 3000);
                    });
                } else {
                    var errorMessage = '<p class="mt-4 text-danger fw-semibold">'+ response.message +'</p>';
                    // Add fadeIn and fadeOut effect for the error message
                    var errorElement = $(errorMessage);
                    errorElement.hide().appendTo(resetPasswordForm).fadeIn();
                    setTimeout(function() {
                        errorElement.fadeOut(function() {
                            errorElement.remove();
                        });
                    }, 3000);
                }
            }
        });
    });
}