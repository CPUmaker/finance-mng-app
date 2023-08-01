var cookie_user_id = $.cookie('user_id');
var cur_user_id = 2;
loadPersonalInfo();

$("#nav-acc-tab").click(function () {
    loadPersonalInfo();
});

$("#nav-status-tab").click(function () {
    loadStatus();
});

$("#acc-info-save-btn").click(function () {
    modifyPersonalInfo();
});

$("#password-save-btn").click(function () {
    changePasswd();
});

$("#nav-requests-tab").click(function () {
    loadFollowers();
});

function loadPersonalInfo() {
    $.ajax({
        url: "http://localhost:8000/api/core/user/info",
        data: {
            "user_id": cur_user_id
        },
        type: "GET",
        dataType: "json",
        success: function(data) {       
            let username = data.username;
            let email = data.email;
            $("#acc-info-username").val(username);
            $("#acc-info-email").val(email);
        }
    });
}

function modifyPersonalInfo() {
    $.ajax({
        url: "http://localhost:8000/api/core/user/info_modify",
        data: {
            "user_id": cur_user_id,
            "username": $("#acc-info-username").val(),
            "email": $("#acc-info-email").val()
        },
        type: "POST",
        dataType: "json",
        success: function(data) {       
            alert(data.success);
        }
    });
}

function loadStatus() {
    $.ajax({
        url: "http://localhost:8000/api/core/user/company_status",
        data: {
            "company_id": cur_user_id
        },
        type: "GET",
        dataType: "json",
        success: function(data) {
            $("#article-number").text(data.article_num);
            $("#follower-number").text(data.follower_num);
        }
    });
}

function changePasswd() {
    $.ajax({
        url: "http://localhost:8000/api/core/user/password_modify",
        data: {
            "user_id": cur_user_id,
            "old_password": $("#password-old").val(),
            "new_password": $("#password-new").val(),
            "repeat_password": $("#password-repeat").val()
        },
        type: "POST",
        dataType: "json",
        success: function(data) {       
            alert(data.success);
        },
        error: function (xhr, textStatus, errorThrown) {
            alert("错误信息: " + xhr.statusText);
        }
    });
}

function loadFollowers() {
    $.ajax({
        url: "http://localhost:8000/api/core/user/check_self_company",
        data: {
            "company_id": cur_user_id
        },
        type: "GET",
        dataType: "json",
        success: function(data) {       
            updateHtmlFollowers(data.list);
        }
    });
}

function updateHtmlFollowers(date_list) {
    var append_dates = "";
    date_list.forEach(date_element => {
        var tmp = `<div class="request-details">
        <div class="noty-user-img">
            <img src="images/resources/r-img${date_element.user_id % 6 + 1}.png" alt="">
        </div>
        <div class="request-info">
            <h3>${date_element.username}</h3>
            <span>${date_element.email}</span>
        </div>
    </div>`;
        
        append_dates = append_dates + tmp;
    });
    $(".requests-list").html(append_dates);
}