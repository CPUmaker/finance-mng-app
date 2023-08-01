from django.db import models


class Currency(models.Model):
    """This model describes a currency.

    Attributes:
        currency_type: A CharField represents the name of this currency.
        exchange_rate: A FloatField describes the rate of excharging with dollors.
    """

    currency_type = models.CharField(max_length=50)
    exchange_rate = models.FloatField()

    class Meta:
        app_label = 'core'