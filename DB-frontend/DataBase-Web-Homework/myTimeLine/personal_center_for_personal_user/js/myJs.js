var cookie_user_id = $.cookie('user_id');
var cur_user_id = 1;
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

$("#nav-acc-card-tab").click(function () {
    loadCards();
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
        url: "http://localhost:8000/api/core/user/user_status",
        data: {
            "user_id": cur_user_id
        },
        type: "GET",
        dataType: "json",
        success: function(data) {
            $("#status-total").text("$"+data.total);
            $("#status-income").text("$"+data.income);
            $("#status-pay").text("$"+data.pay);
            $("#fstatus-card-num").text("$"+data.card_num);
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
        url: "http://localhost:8000/api/core/user/check_self",
        data: {
            "user_id": cur_user_id
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
            <img src="images/resources/r-img${date_element.company_id % 6 + 1}.png" alt="">
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

function add_card() {
    let create_date = "2020-01-01";
    let valid_date = "2025-01-01";
    let balance = "12334.25";
    let bank_id = 1;
    let currency_id = "[1,2,3]";
    bootbox.prompt({
        title: "Your Card's Creating Date:",
        inputType: 'date',
        callback: function (result) {
            create_date = result;
            bootbox.prompt({
                title: "Your Card's Valid Date:",
                inputType: 'date',
                callback: function (result) {
                    valid_date = result;
                    bootbox.prompt({
                        title: "Your Card's Current Balance:",
                        callback: function (result) {
                            balance = result;
                            bootbox.prompt({
                                title: "Please Choice Your Bank:",
                                inputType: 'radio',
                                inputOptions: [{
                                    text: '中国农业银行',
                                    value: '1',
                                },
                                {
                                    text: '中国工商银行',
                                    value: '2',
                                },
                                {
                                    text: '中国建设银行',
                                    value: '3',
                                }],
                                callback: function (result) {
                                    bank_id = result;
                                    bootbox.prompt({
                                        title: "Please Choice Your Currency:",
                                        inputType: 'checkbox',
                                        inputOptions: [{
                                            text: '人民币',
                                            value: '1',
                                        },
                                        {
                                            text: '美元',
                                            value: '2',
                                        },
                                        {
                                            text: '英镑',
                                            value: '3',
                                        }],
                                        callback: function (result) {
                                            currency_id = "[" + result.toString() + "]";
                                            alert(currency_id);
                                            $.ajax({
                                                url: "http://localhost:8000/api/core/card/create",
                                                data: {
                                                    "create_date": create_date,
                                                    "valid_date": valid_date,
                                                    "balance": balance,
                                                    "user_id": cur_user_id,
                                                    "bank_id": bank_id,
                                                    "currency_id": currency_id
                                                },
                                                type: "POST",
                                                dataType: "json",
                                                success: function() {    
                                                    loadFollowers();
                                                },
                                                error: function(XMLHttpRequest, textStatus) {
                                                    alert(textStatus);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function loadCards() {
    $.ajax({
        url: "http://localhost:8000/api/core/card/query",
        data: {
            "user_id": cur_user_id
        },
        type: "GET",
        dataType: "json",
        success: function(data) {       
            updateHtmlCards(data.data);
        }
    });
}

function updateHtmlCards(date_list) {
    var append_dates = "";
    date_list.forEach(date_element => {
        if (date_element.bank_id == 1) {
            var bank_name = "中国农业银行";
            var bank_png = "abc.png";
        } else if (date_element.bank_id == 2) {
            var bank_name = "中国工商银行";
            var bank_png = "icbc.png";
        } else if (date_element.bank_id == 3) {
            var bank_name = "中国建设银行";
            var bank_png = "ccb.png";
        }
        var tmp = `<div class="profile-bx-info" style="margin: 20px 20px 20px 20px">
        <div class="pro-bx">
            <img src="images/${bank_png}" alt="">
            <div class="bx-info">
                <h1>${bank_name}</h1>
            </div>
        </div>
        <div class="pro-bx">
            <div class="bx-info">
                <h3 id="status-total">$${date_element.balance}</h3>
                <h5>Total Money</h5>
            </div>
        </div>
        <p><b>卡号：</b>${date_element.number}</p>
        <p><b>有效期：</b>${date_element.valid_date}</p>
    </div>`;
        
        append_dates = append_dates + tmp;
    });
    $("#card-list").html(append_dates);
}