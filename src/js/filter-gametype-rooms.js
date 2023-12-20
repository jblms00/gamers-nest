$(document).ready(function () {
    function loadFilterGameType() {
        $.ajax({
            url: "actions/filter-rooms.php",
            type: "GET",
            dataType: "html",
            success: function (response) {
                $("#filter-game-type").html(response);

                loadFilterGameType();
            },
            error: function (xhr, status, error) {
                console.log(error);

                setTimeout(loadFilterGameType, 3000);
            },
        });
    }
    loadFilterGameType();
});
