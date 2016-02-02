# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-02-02 07:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=300)),
                ('short_description', models.CharField(blank=True, max_length=500)),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='date created')),
            ],
        ),
    ]
