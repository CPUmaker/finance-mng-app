var bills_dic = new Array();
var cookie_user_id = $.cookie('user_id');
var cur_user_id = 1;
query_bill();

function query_bill() {
    $.ajax({
        url: "http://localhost:8000/api/core/bill/query-reversed",
        data: {
            "user_id": cur_user_id
        },
        type: "GET",
        dataType: "json",
        success: function(data) {       
            update_timeline(data.data);
        }
    });
}

function update_timeline(date_list) {
    var bill_direction = ["支出", "收入"]
    var label_type = ["success", "info"]
    var bill_type = {
        "1": "工资",
        "2": "兼职",
        "3": "理财",
        "4": "红包",
        "5": "其他收入",
        "6": "餐饮",
        "7": "购物",
        "8": "运动",
        "9": "交通",
        "10": "娱乐",
        "11": "通讯",
        "12": "学习",
        "13": "其他支出",
    }
    var append_dates = "";
    date_list.forEach(date_element => {
        var append_lists = "";
        append_dates = append_dates + "<span class='timeline-label'><span class='label label-primary'>" + date_element[0] + "</span></span>";
        date_element[1].forEach(list_element => {
            bills_dic[list_element.bill_id] = list_element;
            var direction_id = eval(list_element.direction)
            var type_id = eval(list_element.category);
            append_lists = append_lists +
                '<div class="timeline-item" id="modify_bill" name=' + list_element.bill_id +
                '><div class="timeline-point timeline-point-' +
                label_type[direction_id] +
                '"><i class="fa fa-money"></i></div><div class="timeline-event"><div class="timeline-heading">' +
                '<h4>' + bill_direction[direction_id] + ": " + bill_type[type_id] + '</h4>' +
                '</div><div class="timeline-body">' +
                    '<p>金额: ' + list_element.quantity + '¥</p>' +
                '</div><div class="timeline-footer">' +
                    '<p class="text-right">' + list_element.date + '</p>' +
                '</div></div></div>';
        });
        append_dates = append_dates + append_lists;
    });
    append_dates = '<span class="timeline-label"><a href="#" class="btn btn-default" title="Add..." id="create_bill"><i class="fa fa-plus-square" aria-hidden="true"></i></a></span>' +
        append_dates + 
        '<span class="timeline-label"><a href="#" class="btn btn-default" title="More..." onclick="query_bill();"><i class="fa fa-fw fa-history"></i></a></span>';
    $("#add_there").html(append_dates);
}
