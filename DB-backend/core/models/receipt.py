"""
declare Receipt model
"""

from django.db import models

class Receipt(models.Model):
    """This model describes a bill for payment or receiving.

    Attributes:
        category: A CharFiled represents the type of receipt.
        direction: A boolean field to demonstrate payment or receiving.
    """
    RECEIPT_CATEGORIES = (
        ('工资', '工资'),
        ('兼职', '兼职'),
        ('理财', '理财'),
        ('红包', '红包'),
        ('其他收入', '其他收入'),

        ('餐饮', '餐饮'),
        ('购物', '购物'),
        ('运动', '运动'),
        ('交通', '交通'),
        ('娱乐', '娱乐'),
        ('通讯', '通讯'),
        ('学习', '学习'),
        ('其他支出', '其他支出'),
    )

    category = models.CharField(max_length=100, choices=RECEIPT_CATEGORIES, unique=True)
    direction = models.BooleanField(default=False) # default to be payment

    class Meta:
        app_label = 'core'
