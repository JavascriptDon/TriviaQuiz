import { quizzes } from './quiz.js';

        let currentRound = 1;
        let currentQuestionIndex = 0;
        let totalScore = 0;
        let roundScores = {};
        let quizQuestions = [];
        let selectedQuiz = null;
        let totalRounds = 5;

        function initializeQuiz() {
            // Show quiz selection
            document.getElementById('quiz-selection').classList.remove('hidden');
            document.getElementById('quiz-container').classList.add('hidden');
        }

        function startSelectedQuiz() {
            const selectElement = document.getElementById('quiz-type-select');
            selectedQuiz = selectElement.value;
            const quiz = quizzes[selectedQuiz];
            totalRounds = quiz.rounds;
            
            // Update title
            document.getElementById('quiz-title').textContent = quiz.title;
            document.getElementById('total-rounds').textContent = totalRounds;
            
            // Hide selection, show quiz
            document.getElementById('quiz-selection').classList.add('hidden');
            document.getElementById('quiz-container').classList.remove('hidden');
            
            // Reset variables
            currentRound = 1;
            currentQuestionIndex = 0;
            totalScore = 0;
            roundScores = {};
            
            loadRound(currentRound);
        }

        function loadRound(roundNumber) {
            const roundKey = `round${roundNumber}`;
            quizQuestions = shuffleArray([...quizzes[selectedQuiz].data[roundKey]]);
            currentQuestionIndex = 0;
            document.getElementById('current-round').textContent = roundNumber;
            document.getElementById('total-questions').textContent = '10';
            displayQuestion();
        }

        function shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        function displayQuestion() {
            const currentQuestion = quizQuestions[currentQuestionIndex];
            document.getElementById('question').textContent = currentQuestion.question;
            document.getElementById('current-question').textContent = currentQuestionIndex + 1;

            const optionsContainer = document.getElementById('options-container');
            optionsContainer.innerHTML = '';

            const shuffledOptions = shuffleArray([...currentQuestion.options]);

            shuffledOptions.forEach(option => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.textContent = option;
                button.onclick = () => selectAnswer(option, currentQuestion.correct, button);
                optionsContainer.appendChild(button);
            });

            updateProgressBar();
            clearFeedback();
        }

        function selectAnswer(selected, correct, buttonElement) {
            disableAllButtons();

            const isCorrect = selected === correct;

            if (isCorrect) {
                totalScore++;
                buttonElement.classList.add('correct');
                showFeedback('Correct!', true);
            } else {
                buttonElement.classList.add('incorrect');
                highlightCorrectAnswer(correct);
                showFeedback(`Incorrect! The correct answer is: ${correct}`, false);
            }

            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < quizQuestions.length) {
                    displayQuestion();
                } else {
                    completeRound();
                }
            }, 2000);
        }

        function highlightCorrectAnswer(correct) {
            const buttons = document.querySelectorAll('.option-btn');
            buttons.forEach(btn => {
                if (btn.textContent === correct) {
                    btn.classList.add('correct');
                }
            });
        }

        function disableAllButtons() {
            const buttons = document.querySelectorAll('.option-btn');
            buttons.forEach(btn => btn.disabled = true);
        }

        function showFeedback(message, isCorrect) {
            const feedbackContainer = document.getElementById('feedback');
            feedbackContainer.className = isCorrect ? 'feedback-message feedback-correct' : 'feedback-message feedback-incorrect';
            feedbackContainer.innerHTML = `<span class="feedback-icon">${isCorrect ? '✓' : '✗'}</span>${message}`;
            feedbackContainer.classList.remove('hidden');
        }

        function clearFeedback() {
            const feedbackContainer = document.getElementById('feedback');
            feedbackContainer.classList.add('hidden');
        }

        function updateProgressBar() {
            const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
            document.querySelector('.progress-bar').style.width = progress + '%';
        }

        function completeRound() {
            const baseScore = (currentRound - 1) * 10;
            const roundScore = totalScore - baseScore;
            roundScores[currentRound] = roundScore;

            document.getElementById('quiz-section').classList.add('hidden');
            document.getElementById('round-complete-section').classList.remove('hidden');
            document.getElementById('round-number').textContent = currentRound;
            document.getElementById('round-score').textContent = roundScore;
            document.getElementById('round-percentage').textContent = Math.round((roundScore / 10) * 100) + '%';

            if (currentRound < 5) {
                document.getElementById('next-round-num').textContent = currentRound + 1;
            }
        }

        function startNextRound() {
            currentRound++;
            document.getElementById('round-complete-section').classList.add('hidden');
            document.getElementById('quiz-section').classList.remove('hidden');

            if (currentRound <= totalRounds) {
                loadRound(currentRound);
            } else {
                showFinalScore();
            }
        }


      function goBackToSelection() {
    // Hide quiz, show selection
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('quiz-selection').classList.remove('hidden');

    // Optional: reload the page to fully reset everything
    location.reload();
}
        function playSound() {
        const clickSound = new Audio("/sounds/mouse-click.mp3");

        function playClick() {
            clickSound.currentTime = 0;
            clickSound.play();
        }

        function attachListeners() {
            const clickableButtons = document.querySelectorAll(
            ".option-btn, .back-btn, .continue-btn, .restart-btn"
            );

            clickableButtons.forEach(btn => {
            btn.removeEventListener("click", playClick);
            btn.addEventListener("click", playClick);
            });
        }

        // Attach to static buttons (header, continue, restart)
        attachListeners();

        // Re-attach to dynamic option buttons
        const observer = new MutationObserver(attachListeners);
        observer.observe(document.getElementById("options-container"), {
            childList: true,
            subtree: true
        });
        };
        
        function showFinalScore() {
            document.getElementById('quiz-section').classList.add('hidden');
            document.getElementById('round-complete-section').classList.add('hidden');
            document.getElementById('final-score-section').classList.remove('hidden');

            const maxScore = totalRounds * 10;
            const percentage = Math.round((totalScore / maxScore) * 100);
            document.getElementById('final-score').textContent = totalScore;
            document.getElementById('final-percentage').textContent = `${percentage}%`;

            // Display round breakdown
            for (let i = 1; i <= 5; i++) {
                const roundElement = document.getElementById(`final-round${i}`);
                if (i <= totalRounds) {
                    roundElement.parentElement.style.display = 'block';
                    roundElement.textContent = roundScores[i] || 0;
                } else {
                    roundElement.parentElement.style.display = 'none';
                }
            }

            let message = '';
            if (percentage === 100) {
                message = '🌟 Outstanding! You\'re a true trivia master!';
            } else if (percentage >= 80) {
                message = '🎉 Excellent! You\'re a trivia expert!';
            } else if (percentage >= 60) {
                message = '👍 Great job! You know your trivia!';
            } else if (percentage >= 40) {
                message = '📚 Not bad! You\'re learning!';
            } else {
                message = '💪 Keep trying! Learn more!';
            }

            document.getElementById('score-message').textContent = message;
        }

        // Start the quiz selection
        initializeQuiz();
        playSound();
        // Add event listener for start button
        document.getElementById('start-quiz-btn').addEventListener('click', startSelectedQuiz);

        // Expose functions globally for HTML onclick
        window.startNextRound = startNextRound;
        window.startSelectedQuiz = startSelectedQuiz;
        window.goBackToSelection = goBackToSelection;
