'''
API set for bill statistics operations
'''
from django.views.decorators.http import require_GET
from django.http.request import HttpRequest

from core.models.bill import Bill

from core.api.utils import response_wrapper, success_api_response


@response_wrapper
@require_GET
def list_capital_flow(request: HttpRequest):
    """retrieve all bill to get total capital flow

    [method]: GET

    [route]: /api/core/bill/check_cost
    """
    user_id = request.GET.get('user_id')
    month = request.GET.get('month')
    bill_list = Bill.objects.all().filter(user__id=user_id, date__month=month)
    capital_flow_dic = {
        "food": 0.0,
        "medical": 0.0,
        "transportation": 0.0,
        "income": 0.0,
        "other": 0.0,
    }
    for bill in bill_list:
        if bill.receipt.direction:
            capital_flow_dic['income'] += bill.quantity
        elif bill.receipt.category == "Meal":
            capital_flow_dic['food'] += bill.quantity
        elif bill.receipt.category == "Treatment":
            capital_flow_dic['medical'] += bill.quantity
        elif bill.receipt.category == "Transportation":
            capital_flow_dic['transportation'] += bill.quantity
        else:
            capital_flow_dic['other'] += bill.quantity
    return success_api_response(capital_flow_dic)


@response_wrapper
@require_GET
def list_highest_bill(request: HttpRequest):
    """retrieve all bill to get highest expenditure

    [method]: GET

    [route]: /api/core/bill/check_high
    """
    user_id = request.GET.get('user_id')
    month = request.GET.get('month')
    highest_bill = Bill.objects.all().filter(
        user__id=user_id, date__month=month,
        receipt__direction=False).order_by('-quantity').first()
    return success_api_response({
        'category': highest_bill.receipt.category,
        'cost': highest_bill.quantity
    })


@response_wrapper
@require_GET
def list_total_capital_flow(request: HttpRequest):
    """retrieve all bill to get total capital flow

    [method]: GET

    [route]: /api/core/bill/check_allyear

    """
    user_id = request.GET.get('user_id')
    year = request.GET.get('year')
    bill_list = Bill.objects.all().filter(user__id=user_id, date__year=year)
    total_cost = sum(
        bill_list.filter(receipt__direction=False).values_list('quantity',
                                                               flat=True))
    total_income = sum(
        bill_list.filter(receipt__direction=True).values_list('quantity',
                                                              flat=True))
    return success_api_response({'cost': total_cost, 'income': total_income})
