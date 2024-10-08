from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
    path('select_game/', views.select_game, name='select_game'),
    path('animal_hangman/', views.animal_hangman, name='animal_hangman'),
    path('african_president/', views.african_president, name='african_president'),
    path('hammy_racing/', views.hammy_racing, name='hammy_racing'),
]
