from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.home, name='home'),
    path('signup/', views.signup, name='signup'),
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('select_game/', views.select_game, name='select_game'),
    path('animal_hangman/', views.animal_hangman, name='animal_hangman'),
    path('african_president/', views.african_president, name='african_president'),
    path('hammy_racing/', views.hammy_racing, name='hammy_racing'),
    path('hammy_stop/', views.hammy_stop, name='hammy_stop'),
    path('cat_owner/', views.cat_owner, name='cat_owner'),
    path('bust_a_nut/', views.bust_a_nut, name='bust_a_nut'),
    path('block_by_block/', views.block_by_block, name='block_by_block'),
    path('prefecture_perfect/', views.prefecture_perfect, name='prefecture_perfect'),
]
