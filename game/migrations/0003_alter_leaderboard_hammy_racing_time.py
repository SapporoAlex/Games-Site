# Generated by Django 4.2.5 on 2024-10-14 12:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_rename_hammy_racing_games_won_leaderboard_hammy_stop_score_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='leaderboard',
            name='hammy_racing_time',
            field=models.CharField(default='NA', max_length=100),
        ),
    ]