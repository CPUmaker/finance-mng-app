'''
API set for bill CRUD operations
'''
import random
from django.views.decorators.http import require_POST, require_GET
from django.http.request import HttpRequest
from django.contrib.auth.models import User
from django.utils.datastructures import MultiValueDictKeyError

from core.api.utils import response_wrapper, success_api_response, failed_api_response, ErrorCode
from core.models.card import Card
from core.models.currency import Currency
from core.models.bank import Bank


@response_wrapper
@require_POST
def create_card(request: HttpRequest):
    """create a card

    [method]: POST

    [route]: /api/core/card/create
    """
    try:
        create_date = request.POST.get('create_date')
        valid_date = request.POST.get('valid_date')
        balance = request.POST.get('balance')
        user_id = request.POST.get('user_id')
        bank_id = request.POST.get('bank_id')
        currency_id = request.POST.get('currency_id')
        print(currency_id)
    except MultiValueDictKeyError:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find some args.")

    user = User.objects.filter(pk=user_id).first()
    if not user:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find user.")
    bank = Bank.objects.filter(pk=bank_id).first()
    if not bank:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find bank.")
    card = Card.objects.create(create_date=create_date,
                               valid_date=valid_date,
                               balance=balance,
                               number="".join(random.sample('01234567890123456789',16)),
                               user=user,
                               bank=bank)
    card.currency.set(eval(currency_id))
    card.save()
    return success_api_response({"card_id": str(card.pk)})


@response_wrapper
@require_GET
def query_card(request: HttpRequest):
    """query the cards

    [method]: GET

    [route]: /api/core/card/query
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
    cards = user.card_set.all()
    cards_arr = []
    for card in cards:
        card_dict = {
            'card_id': str(card.pk),
            'number': card.number,
            'balance': card.balance,
            'valid_date': card.valid_date,
            'bank_id': card.bank.pk,
        }
        cards_arr.append(card_dict)
    return success_api_response({'data': cards_arr})


@response_wrapper
@require_POST
def modify_card(request: HttpRequest):
    """modify a card

    [method]: POST

    [route]: /api/core/card/modify
    """
    try:
        card_id = request.POST.get('card_id')
        balance = request.POST.get('balance')
    except MultiValueDictKeyError:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find some args.")
    card = Card.objects.filter(pk=card_id).first()
    if not card:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find card.")
    card.balance = balance
    card.save()
    return success_api_response({'success': 'The card is updated.'})


@response_wrapper
@require_POST
def delete_card(request: HttpRequest):
    """delete a card

    [method]: POST

    [route]: /api/core/card/delete
    """
    try:
        card_id = request.POST.get('card_id')
    except MultiValueDictKeyError:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find some args.")
    card = Card.objects.filter(pk=card_id).first()
    if not card:
        return failed_api_response(ErrorCode.INVALID_REQUEST_ARGS,
                                   "Cannot find card.")
    card.delete()
    return success_api_response({'success': 'The card is deleted.'})
