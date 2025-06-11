document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('start-screen');
  const quizScreen = document.getElementById('quiz-screen');
  const resultScreen = document.getElementById('result-screen');
  const loadingScreen = document.getElementById('loading-screen');

  const startQuizBtn = document.getElementById('start-quiz-btn');
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('options-container');
  const questionCount = document.getElementById('question-count');
  const progressBar = document.getElementById('progress-bar');

  const resultTitle = document.getElementById('result-title');
  const resultDescription = document.getElementById('result-description');
  const birthdayMessageElem = document.getElementById('birthday-message');
  const retakeQuizBtn = document.getElementById('retake-quiz-btn');

  let currentQuestionIndex = 0;
  let scores = {}; // To store points for each Sim Ho type

  // Define all Sim Ho archetypes and their full descriptions
  const simHoArchetypes = {
    'Coder God': 'You possess a divine ability to wrangle code, debugging with the precision of a surgeon and optimizing like a deity. Your mind is a beautifully organized circuit board, always seeking the most elegant solution. It is still undetermined if you are in fact AI.',
    'Hiker/Adventurist': 'Okaaay, he loves nature or whatever! You enjoy discovering new things, seeing pretty places, and not sitting still!',
    'Lazy': 'While a rare sight, the Lazy Sim Ho can occassionally be caught doing absolutely nothing. You enjoy the stressless activity of not having anything to do, and I respect that. It\'s okay to just chill sometimes.',
    'Cat Dad': 'A cat lover who is also loved by cats. You love those dumb little rats and find your real call to nurture by being a cat parent. No one is surprised to see a little kitty by your side at any given time.',
    'Rare Edition': 'You\'re the rare, limited-edition Sim Ho, full of unique quirks and endearing eccentricities. Congratulations, you have unlocked the secret rare so keep being your unique little self',
    'Bird Watcher': 'No one knows why you like these things, but you sure do. You move without thought and will probably get attacked by a goose one day. We can\'t fault you for a silly quirk, or the even sillier pictures you take',
    'Bald': 'You\'re in a rough era, and that\'s okay! It may seem like nothing\'s going for you right now, but it will change! Your hair doesn\'t loook THAT bad, I swear!',
    'Baby': 'A baby Sim Ho is a sweet and naive Sim Ho. You probably have a lot to figure out, or are like under the age of 22. Either way, you are a huge cutie!!!'
  };

  // Quiz Questions and their scoring logic
  const quizQuestions = [
    {
      question: "What's your ideal way to spend a Saturday morning?",
      options: [
        { text: "Diving deep into a new coding project or troubleshooting a tricky bug.", points: { 'Coder God': 3, 'Bald': 3 } },
        { text: "Hitting the trails for a long hike, exploring new paths in nature.", points: { 'Hiker/Adventurist': 3 } },
        { text: "Sleeping in, cuddling with the cat, or playing a video game.", points: { 'Lazy': 3, 'Cat Dad': 2 } },
        { text: "Spending the day with my beautiful wife, taking a walk and chasing ducks.", points: { 'Bird Watcher': 3, 'Holiday Edition': 2 } }
      ]
    },
    {
      question: "Which look are you feeling most right now?",
      options: [
        { text: "Something comfortable and casual, probably beige or cream, perfect for a day out.", points: { 'Lazy': 2, 'Cat Dad': 2 } },
        { text: "Practical and sporty gear, ready for any outdoor adventure, rain or shine.", points: { 'Hiker/Adventurist': 3 } },
        { text: "A simple, functional look, monochromatic or basic.", points: { 'Bald': 3, 'Coder God': 1 } },
        { text: "A button down or sweater. Probably striped, pink or gray.", points: { 'Baby': 3 } }
      ]
    },
    {
      question: "Your go-to stress reliever is...",
      options: [
        { text: "Systematically debugging complex code until the solution clicks perfectly.", points: { 'Coder God': 3 } },
        { text: "Escaping into the great outdoors for a refreshing trek.", points: { 'Hiker/Adventurist': 2 } },
        { text: "Doing nothing at home.", points: { 'Cat Dad': 3, 'Lazy': 2 } },
        { text: "Indulging in a very specific, perhaps obscure, hobby or interest that's uniquely *you*.", points: { 'Holiday Edition': 3 } }
      ]
    },
    {
      question: "When you think about your wife, what do you think is your most redeeming quality?",
      options: [
        { text: "Encouraging adventures and exercise together.", points: { 'Hiker/Adventurist': 2 } },
        { text: "Planning dates like board game cafes and walks in the park.", points: { 'Baby': 3, 'Holiday Edition': 1 } },
        { text: "Being able to do anything together, even if its rotting at home.", points: { 'Lazy': 2, 'Cat Dad': 3 } },
        { text: "The amount of times I’ve helped her with her projects for school.", points: { 'Coder God': 2 } }
      ]
    },
    {
      question: "Pick only one movie to watch everyday for a month straight.",
      options: [
        { text: "The Imitation Game", points: { 'Coder God': 3 } },
        { text: "Nature documentary", points: { 'Bird Watcher': 2, 'Hiker/Adventurist': 1 } },
        { text: "Megamind", points: { 'Lazy': 3, 'Cat Dad': 1 } },
        { text: "살인의 추억 (Memories of Murder)", points: { 'Holiday Edition': 3 } }
      ]
    },
    {
      question: "Which meal best describes your current food mood?",
      options: [
        { text: "Healthy foods, Factor meals, protein shakes", points: { 'Hiker/Adventurist': 2, 'Bald': 1 } },
        { text: "Donkatsu", points: { 'Lazy': 3, 'Cat Dad': 2 } },
        { text: "McDonalds", points: { 'Coder God': 2 } },
        { text: "Kimchi Spam Fried Rice", points: { 'Baby': 3, 'Holiday Edition': 1 } }
      ]
    },
    {
      question: "What do you find yourself saying most often?",
      options: [
        { text: "\"Efficiency is key,\" or \"How can I optimize this?\"", points: { 'Coder God': 3, 'Bald': 2 } },
        { text: "\"Why do it today if you can do it tomorrow?\" or \"Let's just chill.\"", points: { 'Lazy': 3 } },
        { text: "\"Adventure awaits!\" or \"Let's explore that!\"", points: { 'Hiker/Adventurist': 3 } },
        { text: "\"I must go as close to that bird as possible!\"", points: { 'Bird Watcher': 3 } },
        { text: "\"I keep changing my mind about what I want to do\"", points: { 'Baby': 3 } },
        { text: "*white noise*", points: { 'Holiday Edition': 3 } }
      ]
    }
  ];

  // Tie-breaker priority (order matters for ties)
  const tieBreakerOrder = [
    'Coder God', 'Hiker/Adventurist', 'Lazy', 'Cat Dad',
    'Holiday Edition', 'Bird Watcher', 'Bald', 'Baby'
  ];

  // Placeholder for your personalized birthday message
  const birthdayMessage = "~happy bday to my cutie husband. I thought this was funnier than sending you a card or something. ultimately, i love every version of you. see ya soon~";

  // Function to initialize scores
  function initializeScores() {
    scores = {};
    Object.keys(simHoArchetypes).forEach(type => {
      scores[type] = 0;
    });
  }

  // Function to display a specific screen
  function showScreen(screenId) {
    startScreen.classList.add('hidden');
    quizScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    loadingScreen.classList.add('hidden');

    document.getElementById(screenId).classList.remove('hidden');
    document.getElementById(screenId).classList.add('flex'); // Ensure flex display for proper centering
  }

  // Function to render the current question
  function renderQuestion() {
    if (currentQuestionIndex < quizQuestions.length) {
      showScreen('quiz-screen');
      const questionData = quizQuestions[currentQuestionIndex];
      questionText.textContent = questionData.question;
      optionsContainer.innerHTML = ''; // Clear previous options

      // Update progress bar
      const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
      progressBar.style.width = `${progress}%`;
      questionCount.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;

      questionData.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.classList.add('option-btn');
        button.addEventListener('click', () => handleAnswer(option));
        optionsContainer.appendChild(button);
      });
    } else {
      // All questions answered, show loading then results
      showScreen('loading-screen');
      setTimeout(showResult, 2000); // Simulate calculation time
    }
  }

  // Function to handle answer selection
  function handleAnswer(selectedOption) {
    // Apply points to scores
    for (const type in selectedOption.points) {
      if (scores.hasOwnProperty(type)) {
        scores[type] += selectedOption.points[type];
      }
    }
    currentQuestionIndex++;
    renderQuestion(); // Move to the next question
  }

  // Function to calculate and display the final result
  function showResult() {
    showScreen('result-screen');
    let maxScore = -1;
    let resultType = '';

    // Find the highest score
    for (const type in scores) {
      if (scores[type] > maxScore) {
        maxScore = scores[type];
        resultType = type;
      } else if (scores[type] === maxScore) {
        // Handle ties using the tieBreakerOrder
        const currentPriority = tieBreakerOrder.indexOf(resultType);
        const newPriority = tieBreakerOrder.indexOf(type);
        if (newPriority < currentPriority) {
          resultType = type;
        }
      }
    }

    resultTitle.textContent = `${resultType} Sim Ho!`;

    // Set result image
    const resultImageElem = document.getElementById('result-image');
    const imageMap = {
      'Coder God': 'god.jpeg',
      'Hiker/Adventurist': 'hiker.jpg',
      'Lazy': 'lazy.jpeg',
      'Cat Dad': 'cat.jpeg',
      'Holiday Edition': 'rare.jpeg',
      'Bird Watcher': 'bird.jpg',
      'Bald': 'bald.jpg',
      'Baby': 'baby.jpeg'
    };
    let imageFile = imageMap[resultType] || 'default.jpg';
    resultImageElem.src = imageFile;
    resultImageElem.alt = `${resultType} Sim Ho`;

    resultDescription.textContent = simHoArchetypes[resultType];
    birthdayMessageElem.textContent = birthdayMessage; // Set the actual birthday message
  }

  // Event Listeners
  startQuizBtn.addEventListener('click', () => {
    initializeScores(); // Reset scores for a new game
    currentQuestionIndex = 0; // Start from the first question
    renderQuestion(); // Display the first question
  });

  retakeQuizBtn.addEventListener('click', () => {
    initializeScores();
    currentQuestionIndex = 0;
    renderQuestion(); // Go back to the first question
  });

  // Initial display: Show the start screen
  showScreen('start-screen');
});
