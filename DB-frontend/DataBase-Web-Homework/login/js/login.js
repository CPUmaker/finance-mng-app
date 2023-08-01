$.cookie('user_id', null, {path: '/', secure: false});

function sendMassage() {
    $.ajax({
        url: "http://localhost:8000/api/core/token-auth",
        data: {
            "username": $("#username").val(),
            "password": $("#password").val()
        },
        type: "POST",
        dataType: "json",
        success: function (data) {
            $.cookie('user_id', data.user_id, {path: '/', secure: false});
            if (data.user_type == 2) {
                $(window).attr('location', '../myTimeLine/index.html');
            } else if (data.user_type == 3) {
                $(window).attr('location', '../CompanyTimeline/index.html');
            }
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR.statusText);
        }
    });
}