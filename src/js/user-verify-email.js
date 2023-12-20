$(document).ready(function () {
    verifyEmail();
});

function verifyEmail() {
    $(document).on("submit", "#verifyEmailForm", function (event) {
        event.preventDefault();
        var urlParams = new URLSearchParams(window.location.search);
        var userEmailAndUsername = urlParams.get('user_email');

        var parts = userEmailAndUsername.split('?username=');
        var user_email = parts[0];
        var user_name = parts[1];
        var input_code = $('#inputCode').val();

        $.ajax({
            type: "POST",
            dataType: "json",
            data: { user_email, user_name, input_code },
            url: "actions/user-verify-code.php",
            success: function (response) {
                if (response.status == "success") {
                    $('#verifyEmailForm').find('button, input').prop('disabled', true);

                    $('#errorMessage').html(response.message).removeClass('alert-danger').addClass('alert-success').fadeIn().delay(3000).fadeOut(function() {
                        window.location.href = "login-page.php";
                    });

                } else {
                    $('#errorMessage').html(response.message).fadeIn().delay(3000).fadeOut();
                }
            },
        });
    });
}