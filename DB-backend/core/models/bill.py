"""
declare Bill model
"""

from django.db import models

from core.models.receipt import Receipt
from django.contrib.auth.models import User

class Bill(models.Model):
    """This model describes a bill for payment or receiving.

    Attributes:
        date: A DateField represents the date when the bill is created.
        quantity: A FloatField holds the exactly number of bill.
        receipt: A ForeignKey refers to the receipt.
        user: A ForeignKey refers to the user. 
    """

    date = models.DateField()
    quantity = models.FloatField()
    receipt = models.ForeignKey(to=Receipt, on_delete=models.CASCADE)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)

    class Meta:
        app_label = 'core'
