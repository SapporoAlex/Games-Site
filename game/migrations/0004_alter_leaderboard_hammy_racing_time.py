# Generated by Django 4.2.5 on 2024-10-14 12:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0003_alter_leaderboard_hammy_racing_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='leaderboard',
            name='hammy_racing_time',
            field=models.FloatField(default=100.0),
        ),
    ]