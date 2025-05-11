// Get elements
const initialPopup = document.getElementById('initial-popup');
const popupButton = document.getElementById('popup-button');
const introScreen = document.querySelector('.intro-screen');
const quizScreen = document.querySelector('.quiz-screen');
const videoScreen = document.querySelector('.video-screen');
const startButton = document.getElementById('start-button');
const questionText = document.getElementById('question-text');
const mapInstructions = document.getElementById('map-instructions');
const currentQuestionNum = document.getElementById('current-question');
const totalQuestions = document.getElementById('total-questions');
const progressFill = document.querySelector('.progress-fill');
const europeMap = document.getElementById('europe-map');
const feedbackOverlay = document.getElementById('feedback-overlay');
const unmuteButton = document.getElementById('unmute-button');
const promoVideo = document.getElementById('promo-video');

// State
let currentQuestion = 0;
let totalQuestionsCount = quizData.length;

// Initialize the application
function initApp() {
    // Show initial popup
    setTimeout(() => {
        initialPopup.classList.add('active');
    }, 500);

    // Set question count
    totalQuestions.textContent = totalQuestionsCount;

    // Create map pins
    createMapPins(europeMap, handlePinClick);

    // Event listeners
    popupButton.addEventListener('click', closePopup);
    startButton.addEventListener('click', startQuiz);
    unmuteButton.addEventListener('click', toggleSound);

    // Initialize unmute button state
    const unmuteIcon = unmuteButton.querySelector('.unmute-icon');
    unmuteIcon.classList.add('muted');
}

// Close popup
function closePopup() {
    initialPopup.classList.remove('active');
}

// Start the quiz
function startQuiz() {
    introScreen.classList.remove('active');
    quizScreen.classList.add('active');
    loadQuestion(currentQuestion);
}

// Load question
function loadQuestion(index) {
    const question = quizData[index];
    questionText.textContent = question.question;
    mapInstructions.textContent = question.mapInstructions;
    currentQuestionNum.textContent = index + 1;
    updateProgress();
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestion + 1) / totalQuestionsCount) * 100;
    progressFill.style.width = `${progress}%`;
}

// Handle pin click
function handlePinClick(country) {
    const correctAnswer = quizData[currentQuestion].correctAnswer;
    const isCorrect = country === correctAnswer;

    showFeedback(isCorrect);

    // Wait before proceeding
    setTimeout(() => {
        hideFeedback();

        if (isCorrect) {
            if (currentQuestion < totalQuestionsCount - 1) {
                currentQuestion++;
                loadQuestion(currentQuestion);

                // Show video after question 2
                if (currentQuestion === 2) {
                    showVideoScreen();
                }
            } else {
                showVideoScreen();
            }
        }
    }, 1500);
}

// Show feedback
function showFeedback(isCorrect) {
    feedbackOverlay.classList.add('active');

    if (isCorrect) {
        feedbackOverlay.classList.add('correct');
        feedbackOverlay.classList.remove('incorrect');
        feedbackOverlay.querySelector('.feedback-text').textContent = 'CORRECT!';
    } else {
        feedbackOverlay.classList.add('incorrect');
        feedbackOverlay.classList.remove('correct');
        feedbackOverlay.querySelector('.feedback-text').textContent = 'INCORRECT!';
    }
}

// Hide feedback
function hideFeedback() {
    feedbackOverlay.classList.remove('active');
}

// Show video screen
function showVideoScreen() {
    quizScreen.classList.remove('active');
    videoScreen.classList.add('active');

    // Set video source
    promoVideo.src = '_materials/ulajh.mp4';
    promoVideo.muted = true; // Start muted by default

    // Start video with a slight delay
    setTimeout(() => {
        promoVideo.play().catch(error => {
            console.log("Video play failed:", error);
        });
    }, 500);
}

// Toggle sound
function toggleSound() {
    promoVideo.muted = !promoVideo.muted;
    const unmuteIcon = unmuteButton.querySelector('.unmute-icon');

    if (promoVideo.muted) {
        unmuteIcon.classList.add('muted');
    } else {
        unmuteIcon.classList.remove('muted');
    }
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', initApp);