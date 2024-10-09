from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.http import JsonResponse
from .models import Leaderboard
import random
import json


games = ['Animal Hangman', 'African President', 'Hammy Racing']
animals = ['tiger', 'elephant', 'giraffe', 'hippopotamus', 'cheetah']

wrong_messages = ["Better luck next time!", "Try again!"]


def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})

@login_required
def logout_view(request):
    auth_logout(request)  # Logs out the user
    return redirect('home')  # Redirects to the 'home' view

def home(request):
    return render(request, 'home.html')

def select_game(request):
    return render(request, 'select_game.html')
    

def animal_hangman(request):
    if request.method == "POST":
        # Parse JSON data from the request body
        data = json.loads(request.body)
        guess = data.get('guess', '').lower()

        # Validate guess
        if len(guess) != 1 or not guess.isalpha():
            return JsonResponse({'error': 'Invalid guess. Please enter a single letter.'})

        # Get the current game state from session
        word = request.session.get('word')
        guessed_letters = request.session.get('guessed_letters', "")
        guessed_wrong_amount = request.session.get('guessed_wrong_amount', 0)

        # Check if the guess was already made
        if guess in guessed_letters:
            return JsonResponse({'error': 'You already guessed that letter!'})

        # Process correct or incorrect guess
        if guess in word:
            # Update the word_tiles with the correctly guessed letter
            word_tiles = list(request.session['word_tiles'])
            for i, letter in enumerate(word):
                if letter == guess:
                    word_tiles[i] = guess
            # Join the list back into a string before saving it to the session
            word_tiles = ''.join(word_tiles)
            request.session['word_tiles'] = word_tiles
        else:
            guessed_wrong_amount += 1
            request.session['guessed_wrong_amount'] = guessed_wrong_amount

        # Update guessed letters
        guessed_letters += guess + ", "
        request.session['guessed_letters'] = guessed_letters

        # Check for losing condition
        if guessed_wrong_amount >= 5:
            wrong_message = random.choice(wrong_messages)
            return JsonResponse({
                'word_tiles': request.session['word_tiles'],
                'guessed_letters': guessed_letters,
                'guessed_wrong_amount': 5,
                'message': f'You lost! The word was {word}. {wrong_message}',
                'game_over': True,
            })

        # Check for winning condition
        if '_' not in word_tiles:  # Use the updated word_tiles here
            if request.user.is_authenticated:
                leaderboard, created = Leaderboard.objects.get_or_create(user=request.user)
                leaderboard.animal_hangman_games_won += 1
                leaderboard.save()
            return JsonResponse({
                'word_tiles': word_tiles,
                'guessed_letters': guessed_letters,
                'message': 'You won!',
                'game_over': True,
            })

        # Continue the game
        return JsonResponse({
            'word_tiles': request.session['word_tiles'],
            'guessed_letters': guessed_letters,
            'guessed_wrong_amount': guessed_wrong_amount,
            'message': 'Keep guessing!',
            'game_over': False,
        })
    else:
        # Pick a random word from the selected category
        word = random.choice(animals)
        
        # Initialize the game state in session
        request.session['word'] = word
        request.session['word_tiles'] = "_" * len(word)
        request.session['guessed_letters'] = ""
        request.session['guessed_wrong_amount'] = 0

        return render(request, 'animal_hangman.html', {
            'word_tiles': request.session['word_tiles'],
            'guessed_letters': request.session['guessed_letters'],
            'word': request.session['word'],
            'guessed_wrong_amount': request.session['guessed_wrong_amount']
        })

def african_president(request):
    return render(request, 'african_president.html')

def hammy_racing(request):
    return render(request, 'hammy_racing.html')

def leaderboard(request):
    # Get all leaderboard entries, ordered by games won in descending order
    leaderboard_entries = Leaderboard.objects.order_by('-animal_hangman_games_won')
    return render(request, 'leaderboard.html', {'leaderboard_entries': leaderboard_entries})