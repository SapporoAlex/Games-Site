from django.db import models
from django.contrib.auth.models import User


class Leaderboard(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    african_president_games_won = models.IntegerField(default=0)
    animal_hangman_games_won = models.IntegerField(default=0)
    hammy_racing_games_won = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}- African President: {self.african_president_games_won} Animal Hangman: {self.animal_hangman_games_won} Hammy Racing: {self.hammy_racing_games_won}"
