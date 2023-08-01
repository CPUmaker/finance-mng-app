from django.db import models


class Bank(models.Model):
    """This model describes a bank.

    Attributes:
        name: A CharField represents the name of the bank.
    """

    name = models.CharField(max_length=100)

    class Meta:
        app_label = 'core'