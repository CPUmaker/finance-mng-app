'''
API set for bill CRUD operations
'''
from django.views.decorators.http import require_POST, require_GET
from django.http.request import HttpRequest
from django.contrib.auth.models import User
from django.utils.datastructures import MultiValueDictKeyError

from core.api.utils import response_wrapper, success_api_response, failed_api_response, ErrorCode
from core.models.bill import Bill
from core.models.receipt import Receipt


@response_wrapper
@require_POST
def create_bill(request: HttpRequest):
    """create a bill

    [method]: POST

    [route]: /api/core/bill/create
    """
    try:
        date = request.POST.get('date')
        quantity = request.POST.get('quantity')
        receipt_id = request.POST.get('receipt_id')
        user_id = request.POST.get('user_id')
    except MultiValueDictKeyError:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find some args.")

    user = User.objects.filter(pk=user_id).first()
    if not user:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find user.")
    receipt = Receipt.objects.filter(pk=receipt_id).first()
    if not receipt:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find receipt.")
    bill = Bill.objects.create(date=date,
                               quantity=quantity,
                               user=user,
                               receipt=receipt)
    bill.save()
    return success_api_response({"bill_id": str(bill.pk)})


@response_wrapper
@require_GET
def query_bill(request: HttpRequest):
    """query the bills

    [method]: GET

    [route]: /api/core/bill/query
    """
    try:
        user_id = request.GET['user_id']
    except MultiValueDictKeyError:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find some args.")
    user = User.objects.filter(pk=user_id).first()
    if not user:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find user.")
    bills = user.bill_set.all()
    bills_arr = []
    for bill in bills:
        bill_dict = {
            'id': str(bill.pk),
            'date': bill.date,
            'quantity': bill.quantity,
            'category': bill.receipt.category,
            'direction': 'payment' if bill.receipt.direction == 0 else 'income'
        }
        bills_arr.append(bill_dict)
    return success_api_response({'data': bills_arr})


@response_wrapper
@require_POST
def modify_bill(request: HttpRequest):
    """modify a bill

    [method]: POST

    [route]: /api/core/bill/modify
    """
    try:
        bill_id = request.POST.get('bill_id')
        date = request.POST.get('date')
        quantity = request.POST.get('quantity')
        receipt_id = request.POST.get('receipt_id')
    except MultiValueDictKeyError:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find some args.")
    bill = Bill.objects.filter(pk=bill_id).first()
    if not bill:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find bill.")
    receipt = Receipt.objects.filter(pk=receipt_id).first()
    if not receipt:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find receipt.")
    bill.date = date
    bill.quantity = quantity
    bill.receipt = receipt
    bill.save()
    return success_api_response({'success': 'The bill is updated.'})


@response_wrapper
@require_POST
def delete_bill(request: HttpRequest):
    """delete a bill

    [method]: POST

    [route]: /api/core/bill/delete
    """
    try:
        bill_id = request.POST.get('bill_id')
    except MultiValueDictKeyError:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find some args.")
    bill = Bill.objects.filter(pk=bill_id).first()
    if not bill:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find bill.")
    bill.delete()
    return success_api_response({'success': 'The bill is deleted.'})


@response_wrapper
@require_GET
def query_all_bill(request: HttpRequest):
    """query all bills with time order reversed

    [method]: GET

    [route]: /api/core/bill/query-reversed
    """
    try:
        user_id = request.GET['user_id']
    except MultiValueDictKeyError:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find some args.")
    user = User.objects.filter(pk=user_id).first()
    if not user:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find user.")
    bills = user.bill_set.all()
    ret_dict = {}
    for bill in bills:
        bill_dict = {
            'bill_id': str(bill.pk),
            'date': bill.date,
            'quantity': bill.quantity,
            'category': str(bill.receipt.pk),
            'direction': '0' if bill.receipt.direction == 0 else '1'
        }
        if str(bill.date) in ret_dict:
            ret_dict[str(bill.date)].append(bill_dict)
        else:
            ret_dict[str(bill.date)] = [bill_dict]
    ret_dict = dict(
        sorted(ret_dict.items(), key=lambda item: item[0], reverse=True))
    new_ret_dict = []
    for date in ret_dict:
        new_ret_dict.append([date, list(ret_dict[date])])
    return success_api_response({'data': new_ret_dict})
