$(document).ready(function () {
    let container = document.getElementById("container");

    toggle = () => {
        container.classList.toggle("sign-up");
    };

    // Signup Form
    $("#signupForm").submit(function (event) {
        event.preventDefault();

        var form_data = $(this).serialize();

        $.ajax({
            type: "POST",
            dataType: "json",
            data: form_data,
            url: "actions/user-signup.php",
            success: function (response) {
                if (response.status == "success") {
                    $("#signupMessage").html(response.message);

                    $("#signupForm .form-control").attr("disabled", true);
                    $("#signupForm .signup-btn").attr("disabled", true);
                    $("#displayMessage").html('<div class="alert alert-success message">' + response.message + "</div>");

                    // Redirect to user-verify-email.php after a delay
                    setTimeout(function () {
                        window.location.href = "user-verify-email.php?user_email=" + response.user_email +"?username="+ response.user_name +"";
                    }, 4000);
                } else {
                    grecaptcha.reset();
                    $("#signupMessage").html(response.message);
                    $("#displayMessage").html('<div class="alert alert-danger message">' + response.message + "</div>");
                }
            },
        });
    });
});
