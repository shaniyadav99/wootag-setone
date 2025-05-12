document.addEventListener("DOMContentLoaded", function () {
  const stage1 = document.getElementById("stage1");
  const bannerCta = document.getElementById("banner-cta");
  const quizContainer = document.getElementById("quiz-container");

  const initialPopup = document.getElementById("initial-popup");
  const popupButton = document.getElementById("popup-button");
  const introScreen = document.querySelector(".intro-screen");
  const quizScreen = document.querySelector(".quiz-screen");
  const videoScreen = document.querySelector(".video-screen");
  const startButton = document.getElementById("start-button");
  const questionText = document.getElementById("question-text");
  const mapInstructions = document.getElementById("map-instructions");
  const currentQuestionNum = document.getElementById("current-question");
  const totalQuestions = document.getElementById("total-questions");
  const progressFill = document.querySelector(".progress-fill");
  const europeMap = document.getElementById("europe-map");
  const feedbackOverlay = document.getElementById("feedback-overlay");
  const unmuteButton = document.getElementById("unmute-button");
  const promoVideo = document.getElementById("promo-video");

  let currentQuestion = 0;
  let totalQuestionsCount = quizData.length;

  // Map dragging variables
  let isDragging = false;
  let startX, startY;
  let currentX = 0;
  let currentY = 0;
  let offsetX = 0;
  let offsetY = 0;

  // Prevent default touch behavior
  document.addEventListener(
    "touchmove",
    function (e) {
      if (e.target.closest(".map-container")) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  setTimeout(() => {
    stage1.classList.add("active");
  }, 500);

  bannerCta.addEventListener("click", function () {
    stage1.classList.add("hidden");
    quizContainer.classList.remove("hidden");

    setTimeout(() => {
      initialPopup.classList.add("active");
    }, 500);
  });

  function initQuiz() {
    totalQuestions.textContent = totalQuestionsCount;
    createMapPins(europeMap, handlePinClick);

    popupButton.addEventListener("click", closePopup);
    startButton.addEventListener("click", startQuiz);
    unmuteButton.addEventListener("click", toggleSound);

    const unmuteIcon = unmuteButton.querySelector(".unmute-icon");
    unmuteIcon.classList.add("muted");

    // Initialize map dragging functionality
    initMapDragging();
  }

  function initMapDragging() {
    // Mouse Events
    europeMap.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", endDrag);

    // Touch Events with improved handling
    europeMap.addEventListener("touchstart", startDragTouch, { passive: true });
    document.addEventListener("touchmove", dragTouch, { passive: true });
    document.addEventListener("touchend", endDragTouch);
  }

  function startDrag(e) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    offsetX = currentX;
    offsetY = currentY;
    europeMap.classList.add("grabbing");
    e.preventDefault();
  }

  function startDragTouch(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      offsetX = currentX;
      offsetY = currentY;
      europeMap.classList.add("grabbing");
    }
  }

  function drag(e) {
    if (!isDragging) return;

    const x = e.clientX;
    const y = e.clientY;

    updateMapPosition(x, y);
    e.preventDefault();
  }

  function dragTouch(e) {
    if (!isDragging || e.touches.length !== 1) return;

    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;

    updateMapPosition(x, y);
  }

  function updateMapPosition(x, y) {
    // Calculate the new position
    const deltaX = x - startX;
    const deltaY = y - startY;

    // Apply movement boundaries with larger range for mobile
    const maxX = window.innerWidth < 768 ? -400 : -300;
    const maxY = window.innerWidth < 768 ? -300 : -200;

    currentX = Math.min(Math.max(offsetX + deltaX, maxX), 0);
    currentY = Math.min(Math.max(offsetY + deltaY, maxY), 0);

    // Update map position with hardware acceleration
    europeMap.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  }

  function endDrag() {
    isDragging = false;
    europeMap.classList.remove("grabbing");
  }

  function endDragTouch(e) {
    if (isDragging) {
      isDragging = false;
      europeMap.classList.remove("grabbing");

      // Check if this was a tap/click rather than a drag
      const touch = e.changedTouches[0];
      const deltaX = Math.abs(touch.clientX - startX);
      const deltaY = Math.abs(touch.clientY - startY);

      // If the movement was minimal, treat it as a click
      if (deltaX < 10 && deltaY < 10) {
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element && element.closest(".map-pin")) {
          const country = element
            .closest(".map-pin")
            .querySelector(".map-pin-label").textContent;
          handlePinClick(country);
        }
      }
    }
  }

  function closePopup() {
    initialPopup.classList.remove("active");
  }

  function startQuiz() {
    introScreen.classList.remove("active");
    quizScreen.classList.add("active");
    loadQuestion(currentQuestion);
  }

  function loadQuestion(index) {
    const question = quizData[index];
    questionText.textContent = question.question;
    mapInstructions.textContent = question.mapInstructions;
    currentQuestionNum.textContent = index + 1;
    updateProgress();
  }

  function updateProgress() {
    const progress = ((currentQuestion + 1) / totalQuestionsCount) * 100;
    progressFill.style.width = `${progress}%`;
  }

  function handlePinClick(country) {
    const correctAnswer = quizData[currentQuestion].correctAnswer;
    const isCorrect = country === correctAnswer;

    showFeedback(isCorrect);

    setTimeout(() => {
      hideFeedback();

      if (isCorrect) {
        if (currentQuestion < totalQuestionsCount - 1) {
          currentQuestion++;
          loadQuestion(currentQuestion);

          if (currentQuestion === 2) {
            showVideoScreen();
          }
        } else {
          showVideoScreen();
        }
      }
    }, 1500);
  }

  function showFeedback(isCorrect) {
    feedbackOverlay.classList.add("active");
    const text = feedbackOverlay.querySelector(".feedback-text");

    if (isCorrect) {
      feedbackOverlay.classList.add("correct");
      feedbackOverlay.classList.remove("incorrect");
      text.textContent = "CORRECT!";
    } else {
      feedbackOverlay.classList.add("incorrect");
      feedbackOverlay.classList.remove("correct");
      text.textContent = "INCORRECT!";
    }
  }

  function hideFeedback() {
    feedbackOverlay.classList.remove("active");
  }

  function showVideoScreen() {
    quizScreen.classList.remove("active");
    videoScreen.classList.add("active");

    // Reset video state
    promoVideo.pause();
    promoVideo.currentTime = 0;
    promoVideo.muted = true;
    promoVideo.src = "_materials/ulajh.mp4";

    // Add playsinline attribute for iOS
    promoVideo.setAttribute("playsinline", "");
    promoVideo.setAttribute("webkit-playsinline", "");

    // Force video to load
    promoVideo.load();

    // Update unmute icon
    const unmuteIcon = unmuteButton.querySelector(".unmute-icon");
    unmuteIcon.classList.add("muted");

    // Try to play video with user interaction
    const playVideo = () => {
      const playPromise = promoVideo.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Video started playing successfully
            console.log("Video playback started");
          })
          .catch((error) => {
            console.log("Video play failed:", error);
          });
      }
    };

    // Try to play immediately
    playVideo();

    // Also try to play after a short delay
    setTimeout(playVideo, 500);
  }

  function toggleSound() {
    if (promoVideo.paused) {
      promoVideo.play().catch((error) => {
        console.log("Video play failed on unmute:", error);
      });
    }
    promoVideo.muted = !promoVideo.muted;
    const unmuteIcon = unmuteButton.querySelector(".unmute-icon");

    if (promoVideo.muted) {
      unmuteIcon.classList.add("muted");
    } else {
      unmuteIcon.classList.remove("muted");
    }
  }

  initQuiz();
});
