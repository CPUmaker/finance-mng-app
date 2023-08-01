window.onload = function () {
    var directionArray = "";
    var directionSelectStr = "";
    for (var i = 0, len = bill_direction.length; i < len; i++) {
        directionArray = bill_direction[i];
        directionSelectStr = directionSelectStr + "<option value='" + directionArray[0] + "'>" + directionArray[1] + "</option>"
    }
    $("#direction_pop").html(directionSelectStr);

    var selectType = $("#direction_pop").val();
    var typelist = bill_type[selectType];
    var typeArray = "";
    var typeSelectStr = "";
    for (var i = 0, len = typelist.length; i < len; i++) {
        typeArray = typelist[i];
        typeSelectStr = typeSelectStr + "<option value='" + typeArray[0] + "'>" + typeArray[1] + "</option>"
    }
    $("#type_pop").html(typeSelectStr);

    var typeCode = $("#type_pop").val();
    //DIRECTION切换事件
    $("#direction_pop").change(function () {
        var selectType = $("#direction_pop").val();
        var typelist = bill_type[selectType];
        var typeArray = "";
        var typeSelectStr = "";
        if (typelist != null) {
            for (var i = 0, len = typelist.length; i < len; i++) {
                typeArray = typelist[i];
                typeSelectStr = typeSelectStr + "<option value='" + typeArray[0] + "'>" + typeArray[1] + "</option>"
            }
        }

        $("#type_pop").html(typeSelectStr);
    });
    
}