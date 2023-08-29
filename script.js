document.addEventListener("DOMContentLoaded", () => {
    const getQuestionBtn = document.getElementById("getQuestionBtn");
    const player1NameInput = document.getElementById("player1Name");
    const player2NameInput = document.getElementById("player2Name");
    const player1QuestionContainer = document.getElementById("player1QuestionContainer");
    const player2QuestionContainer = document.getElementById("player2QuestionContainer");
    const answerInput = document.getElementById("answerInput");
    const submitAnswerBtn = document.getElementById("submitAnswer");
    const player1ScoreDisplay = document.getElementById("player1Score");
    const player2ScoreDisplay = document.getElementById("player2Score");

    let currentPlayer = 1;
    let player1Score = 0;
    let player2Score = 0;

    function checkAnswer(playerAnswer, correctAnswer, playerName, questionContainer) {
        const formattedCorrectAnswer = correctAnswer.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags if any
    
        if (playerAnswer.toLowerCase() === formattedCorrectAnswer.toLowerCase()) {
            questionContainer.innerHTML = `${playerName}'s Answer: Correct!`;
            if (currentPlayer === 2) {
                player1Score++;
            } else {
                player2Score++;
            }
        } else {
            questionContainer.innerHTML = `${playerName}'s Answer: Incorrect. The correct answer is: ${formattedCorrectAnswer}`;
        }
    
        updateScoreDisplays();
    }
    
    function updateScoreDisplays() {
        player1ScoreDisplay.textContent = `Player 1 Score: ${player1Score}`;
        player2ScoreDisplay.textContent = `Player 2 Score: ${player2Score}`;
    }
   
let currentPlayerQuestionContainer;

getQuestionBtn.addEventListener("click", () => {
    const currentPlayerName = currentPlayer === 1 ? player1NameInput.value : player2NameInput.value;
    currentPlayerQuestionContainer = currentPlayer === 1 ? player1QuestionContainer : player2QuestionContainer;

    // Clear previous question and answer
    currentPlayerQuestionContainer.innerHTML = "";
    answerInput.value = "";

    fetch("http://jservice.io/api/random")
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const question = data[0].question;
                const correctAnswer = data[0].answer;
                currentPlayerQuestionContainer.innerHTML = `${currentPlayerName}'s Question: ${question}</p>`;
                currentPlayer = currentPlayer === 1 ? 2 : 1; // Switch players

                // Store the correct answer and player name in a data attribute
                submitAnswerBtn.dataset.correctAnswer = correctAnswer;
                submitAnswerBtn.dataset.playerName = currentPlayerName;

            } else {
                currentPlayerQuestionContainer.innerHTML = `No question found for ${currentPlayerName}.`;
            }
        })
        .catch(error => {
            console.error("Error fetching question:", error);
            currentPlayerQuestionContainer.innerHTML = `Error fetching question for ${currentPlayerName}. Please try again later.`;
        });
});


submitAnswerBtn.addEventListener("click", () => {
    const answer = answerInput.value;
    const correctAnswer = submitAnswerBtn.dataset.correctAnswer;
    const playerName = submitAnswerBtn.dataset.playerName;

    console.log(`Correct Answer: ${correctAnswer}`);
    console.log(`Player's Answer: ${answer}`);
    checkAnswer(answer, correctAnswer, playerName, currentPlayerQuestionContainer);

    if (currentPlayer === 1) {
        player1ScoreDisplay.textContent = `Player 1 Score: ${player1Score}`;
    } else {
        player2ScoreDisplay.textContent = `Player 2 Score: ${player2Score}`;
    }

    answerInput.value = "";
});

});