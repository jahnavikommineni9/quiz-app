// Quiz Application JavaScript

// Quiz data embedded directly
const quizData = {
  questions: [
    {
      question: "What does JSON stand for?",
      options: ["JavaScript Object Notation", "JavaScript Online Network", "Java Standard Object Notation", "JavaScript Operational Notation"],
      correct: 0,
      category: "Web Development"
    },
    {
      question: "Which HTML element is used for the largest heading?",
      options: ["&lt;h6&gt;", "&lt;h1&gt;", "&lt;head&gt;", "&lt;heading&gt;"],
      correct: 1,
      category: "HTML"
    },
    {
      question: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
      correct: 2,
      category: "CSS"
    },
    {
      question: "Which JavaScript method is used to add an element to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      correct: 0,
      category: "JavaScript"
    },
    {
      question: "What is the correct way to create a function in JavaScript?",
      options: ["function = myFunction() {}", "function myFunction() {}", "create myFunction() {}", "function:myFunction() {}"],
      correct: 1,
      category: "JavaScript"
    },
    {
      question: "Which HTML attribute specifies an alternate text for an image?",
      options: ["title", "src", "alt", "href"],
      correct: 2,
      category: "HTML"
    },
    {
      question: "What does DOM stand for in web development?",
      options: ["Document Object Model", "Data Object Management", "Dynamic Object Method", "Document Operational Mode"],
      correct: 0,
      category: "Web Development"
    },
    {
      question: "Which CSS property is used to change the text color?",
      options: ["font-color", "text-color", "color", "text-style"],
      correct: 2,
      category: "CSS"
    },
    {
      question: "What is the correct syntax for creating an array in JavaScript?",
      options: ["var colors = \"red\", \"green\", \"blue\"", "var colors = (1:\"red\", 2:\"green\", 3:\"blue\")", "var colors = [\"red\", \"green\", \"blue\"]", "var colors = 1 = (\"red\"), 2 = (\"green\"), 3 = (\"blue\")"],
      correct: 2,
      category: "JavaScript"
    },
    {
      question: "Which method is used to remove the last element from an array in JavaScript?",
      options: ["pop()", "push()", "shift()", "splice()"],
      correct: 0,
      category: "JavaScript"
    }
  ],
  settings: {
    timePerQuestion: 30,
    totalQuestions: 10,
    passingScore: 70
  }
};

// Quiz state
class QuizApp {
  constructor() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.timeLeft = quizData.settings.timePerQuestion;
    this.timer = null;
    this.selectedAnswer = null;
    this.isAnswered = false;
    this.userAnswers = [];
    
    this.initializeElements();
    this.attachEventListeners();
    this.showScreen('start'); // Ensure start screen is visible
  }
  
  initializeElements() {
    // Screens
    this.startScreen = document.getElementById('start-screen');
    this.quizScreen = document.getElementById('quiz-screen');
    this.resultsScreen = document.getElementById('results-screen');
    
    // Start screen elements
    this.startBtn = document.getElementById('start-btn');
    
    // Quiz screen elements
    this.questionNumber = document.getElementById('question-number');
    this.totalQuestions = document.getElementById('total-questions');
    this.progressFill = document.getElementById('progress-fill');
    this.timerCountdown = document.getElementById('timer-countdown');
    this.questionText = document.getElementById('question-text');
    this.optionsContainer = document.getElementById('options-container');
    this.optionBtns = document.querySelectorAll('.option-btn');
    this.nextBtn = document.getElementById('next-btn');
    
    // Results screen elements
    this.finalScore = document.getElementById('final-score');
    this.totalScore = document.getElementById('total-score');
    this.percentageScore = document.getElementById('percentage-score');
    this.performanceMessage = document.getElementById('performance-message');
    this.correctCount = document.getElementById('correct-count');
    this.incorrectCount = document.getElementById('incorrect-count');
    this.restartBtn = document.getElementById('restart-btn');
    
    // Set total questions display
    this.totalQuestions.textContent = quizData.settings.totalQuestions;
    this.totalScore.textContent = quizData.settings.totalQuestions;
  }
  
  attachEventListeners() {
    this.startBtn.addEventListener('click', () => this.startQuiz());
    this.nextBtn.addEventListener('click', () => this.nextQuestion());
    this.restartBtn.addEventListener('click', () => this.restartQuiz());
    
    // Option buttons
    this.optionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.selectAnswer(e));
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }
  
  startQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.showScreen('quiz');
    this.loadQuestion();
  }
  
  showScreen(screenName) {
    // Hide all screens first
    const screens = [this.startScreen, this.quizScreen, this.resultsScreen];
    screens.forEach(screen => {
      screen.classList.remove('active');
      screen.classList.add('hidden');
    });
    
    // Show target screen after a brief delay
    setTimeout(() => {
      let targetScreen;
      switch (screenName) {
        case 'start':
          targetScreen = this.startScreen;
          break;
        case 'quiz':
          targetScreen = this.quizScreen;
          break;
        case 'results':
          targetScreen = this.resultsScreen;
          break;
      }
      
      if (targetScreen) {
        targetScreen.classList.remove('hidden');
        targetScreen.classList.add('active');
      }
    }, 50);
  }
  
  loadQuestion() {
    const question = quizData.questions[this.currentQuestionIndex];
    this.isAnswered = false;
    this.selectedAnswer = null;
    
    // Update question counter and progress
    this.questionNumber.textContent = this.currentQuestionIndex + 1;
    const progressPercent = ((this.currentQuestionIndex + 1) / quizData.settings.totalQuestions) * 100;
    this.progressFill.style.width = `${progressPercent}%`;
    
    // Display question
    this.questionText.textContent = question.question;
    
    // Display options and reset their states
    this.optionBtns.forEach((btn, index) => {
      const optionText = btn.querySelector('.option-text');
      optionText.innerHTML = question.options[index];
      
      // Reset button states completely
      btn.classList.remove('selected', 'correct', 'incorrect');
      btn.disabled = false;
      btn.style.backgroundColor = '';
      btn.style.borderColor = '';
    });
    
    // Hide next button initially
    this.nextBtn.classList.add('hidden');
    
    // Start timer
    this.startTimer();
  }
  
  startTimer() {
    this.timeLeft = quizData.settings.timePerQuestion;
    this.updateTimerDisplay();
    
    // Clear any existing timer
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();
      
      if (this.timeLeft <= 0) {
        this.handleTimeout();
      }
    }, 1000);
  }
  
  updateTimerDisplay() {
    this.timerCountdown.textContent = this.timeLeft;
    
    // Add warning classes based on remaining time
    this.timerCountdown.classList.remove('warning', 'danger');
    
    if (this.timeLeft <= 5) {
      this.timerCountdown.classList.add('danger');
    } else if (this.timeLeft <= 10) {
      this.timerCountdown.classList.add('warning');
    }
  }
  
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  selectAnswer(event) {
    if (this.isAnswered) return;
    
    const selectedBtn = event.currentTarget;
    const selectedOption = parseInt(selectedBtn.dataset.option);
    
    this.selectedAnswer = selectedOption;
    this.isAnswered = true;
    this.stopTimer();
    
    // Mark selected answer
    selectedBtn.classList.add('selected');
    
    // Show correct answer and feedback immediately
    this.showAnswerFeedback();
    
    // Store user answer
    const isCorrect = selectedOption === quizData.questions[this.currentQuestionIndex].correct;
    this.userAnswers.push({
      questionIndex: this.currentQuestionIndex,
      selectedAnswer: selectedOption,
      correctAnswer: quizData.questions[this.currentQuestionIndex].correct,
      isCorrect: isCorrect
    });
    
    // Update score
    if (isCorrect) {
      this.score++;
    }
    
    // Show next button after a brief delay for feedback
    setTimeout(() => {
      this.nextBtn.classList.remove('hidden');
    }, 1000);
  }
  
  showAnswerFeedback() {
    const correctIndex = quizData.questions[this.currentQuestionIndex].correct;
    
    this.optionBtns.forEach((btn, index) => {
      btn.disabled = true;
      
      if (index === correctIndex) {
        btn.classList.add('correct');
      } else if (index === this.selectedAnswer && index !== correctIndex) {
        btn.classList.add('incorrect');
      }
    });
  }
  
  handleTimeout() {
    if (this.isAnswered) return;
    
    this.isAnswered = true;
    this.selectedAnswer = null;
    this.stopTimer();
    
    // Show correct answer
    this.showAnswerFeedback();
    
    // Store timeout as wrong answer
    this.userAnswers.push({
      questionIndex: this.currentQuestionIndex,
      selectedAnswer: null,
      correctAnswer: quizData.questions[this.currentQuestionIndex].correct,
      isCorrect: false
    });
    
    // Show next button after a brief delay
    setTimeout(() => {
      this.nextBtn.classList.remove('hidden');
    }, 1000);
  }
  
  nextQuestion() {
    this.currentQuestionIndex++;
    
    if (this.currentQuestionIndex < quizData.settings.totalQuestions) {
      this.loadQuestion();
    } else {
      this.showResults();
    }
  }
  
  showResults() {
    this.showScreen('results');
    
    // Calculate results
    const percentage = Math.round((this.score / quizData.settings.totalQuestions) * 100);
    const incorrectCount = quizData.settings.totalQuestions - this.score;
    
    // Display scores
    this.finalScore.textContent = this.score;
    this.percentageScore.textContent = percentage;
    this.correctCount.textContent = this.score;
    this.incorrectCount.textContent = incorrectCount;
    
    // Show performance message
    this.showPerformanceMessage(percentage);
  }
  
  showPerformanceMessage(percentage) {
    let message = '';
    let messageClass = '';
    
    if (percentage >= 90) {
      message = 'Outstanding! You have excellent knowledge of web development!';
      messageClass = 'excellent';
    } else if (percentage >= 80) {
      message = 'Great job! You have a solid understanding of web development concepts.';
      messageClass = 'good';
    } else if (percentage >= 70) {
      message = 'Good work! You passed the quiz. Keep studying to improve further.';
      messageClass = 'good';
    } else if (percentage >= 50) {
      message = 'Not bad, but there\'s room for improvement. Review the concepts and try again.';
      messageClass = 'fair';
    } else {
      message = 'Keep studying! Web development takes practice. Don\'t give up!';
      messageClass = 'poor';
    }
    
    this.performanceMessage.innerHTML = `<p>${message}</p>`;
    this.performanceMessage.className = `performance-message ${messageClass}`;
  }
  
  restartQuiz() {
    // Reset all state
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.selectedAnswer = null;
    this.isAnswered = false;
    this.stopTimer();
    
    // Show start screen
    this.showScreen('start');
  }
  
  handleKeyDown(event) {
    // Only handle keys during quiz
    if (!this.quizScreen.classList.contains('active')) return;
    
    const key = event.key.toLowerCase();
    
    // Handle A, B, C, D keys for answer selection
    if (['a', 'b', 'c', 'd'].includes(key) && !this.isAnswered) {
      const optionIndex = key.charCodeAt(0) - 97; // Convert 'a' to 0, 'b' to 1, etc.
      if (optionIndex < this.optionBtns.length) {
        this.optionBtns[optionIndex].click();
      }
    }
    
    // Handle Enter key for next question
    if (key === 'enter' && !this.nextBtn.classList.contains('hidden')) {
      this.nextBtn.click();
    }
    
    // Handle number keys 1-4 for answer selection
    if (['1', '2', '3', '4'].includes(key) && !this.isAnswered) {
      const optionIndex = parseInt(key) - 1;
      if (optionIndex < this.optionBtns.length) {
        this.optionBtns[optionIndex].click();
      }
    }
  }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const quiz = new QuizApp();
  
  // Ensure start screen is visible on load
  setTimeout(() => {
    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
      startScreen.classList.remove('hidden');
      startScreen.classList.add('active');
    }
  }, 100);
});

// Prevent context menu on right click to avoid cheating
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Quiz tab is now hidden');
  } else {
    console.log('Quiz tab is now visible');
  }
});

// Warn user before leaving page during quiz
window.addEventListener('beforeunload', (e) => {
  const quizScreen = document.getElementById('quiz-screen');
  if (quizScreen && quizScreen.classList.contains('active')) {
    e.preventDefault();
    e.returnValue = 'Are you sure you want to leave? Your quiz progress will be lost.';
    return e.returnValue;
  }
});