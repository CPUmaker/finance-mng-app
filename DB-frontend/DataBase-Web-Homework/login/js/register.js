$("#sign_up").click(function () {
    $.ajax({
        url: "http://localhost:8000/api/core/register",
        data: {
            "username": $("#username").val(),
            "email": $("#email").val(),
            "password": $("#password").val(),
            "password_cnfr": $("#password_cnfr").val(),
            "user_type": 2
        },
        type: "POST",
        dataType: "json",
        success: function() {       
            $(window).attr('location','./signin.html');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.statusText);
        }
    });
});
