const gameImage = document.getElementById("zoomed-img");
const messageBox = document.getElementById("message-box");


// Create and display the keyboard dynamically
function createKeyboard() {
    const keyboardContainer = document.getElementById('keyboard');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    alphabet.split('').forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.className = 'keyboard-button';
        button.onclick = () => handleGuess(letter.toLowerCase());
        keyboardContainer.appendChild(button);
    });
}

// Handle guess submission to the Django backend
function handleGuess(guess) {
    fetch('/animal_hangman/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()  // Django requires CSRF tokens for POST requests
        },
        body: JSON.stringify({ 'guess': guess })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            // Update the word tiles on the screen
            document.getElementById('word-tiles').textContent = data.word_tiles;
            document.getElementById('guessed-letters').textContent = data.guessed_letters;
    
            // Handle the game-over state
            if (data.game_over) {
                alert(data.message);
                gameImage.className = "zoomed-image-5";
                setTimeout(() => {
                    location.reload();  // Reload the page after a delay to allow the user to see the message
                }, 2000);  // Delay of 2 seconds
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to get the CSRF token for Django's protection
function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

// Call the createKeyboard function to initialize the keyboard on page load
document.addEventListener('DOMContentLoaded', createKeyboard);
