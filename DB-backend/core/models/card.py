from django.db import models

from django.contrib.auth.models import User
from core.models.currency import Currency
from core.models.bank import Bank


class Card(models.Model):
    """This model describes a comment of article.

    Attributes:
        create_date: A DateField represents the date when the card is created.
        valid_date: A DateField represents the date when the card is no longer vaild.
        balance: A FloatField holds the balance of card.
        number: A CharField represents the number of card.
        user: A ForeignKey refers to the user.
        bank: A ForeignKey refers to the bank. 
        currency: A ManyToMany refers to the Currency. 
    """

    create_date = models.DateField()
    valid_date = models.DateField()
    balance = models.FloatField()
    number = models.CharField(max_length=50)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    bank = models.ForeignKey(to=Bank, on_delete=models.CASCADE)
    currency = models.ManyToManyField(Currency)

    class Meta:
        app_label = 'core'