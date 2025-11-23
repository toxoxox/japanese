
// Store references to all HTML elements we need to work with
const views = {
    selection: document.getElementById('view-selection'),
    quiz: document.getElementById('view-quiz'),
    results: document.getElementById('view-results')
};

const elements = {
    hiraganaGrid: document.getElementById('hiragana-options'),
    katakanaGrid: document.getElementById('katakana-options'),
    startBtn: document.getElementById('start-btn'),
    questionChar: document.getElementById('question-char'),
    answerInput: document.getElementById('answer-input'),
    submitBtn: document.getElementById('submit-answer'),
    feedback: document.getElementById('feedback-msg'),
    progressBar: document.getElementById('progress-bar'),
    counterText: document.getElementById('counter-text'),
    finalScore: document.getElementById('final-score'),
    totalCount: document.getElementById('total-count'),
    mistakeCount: document.getElementById('mistake-count'),
    mistakesContainer: document.getElementById('mistakes-container'),
    mistakesUl: document.getElementById('mistakes-ul'),
    retryBtn: document.getElementById('retry-mistakes-btn'),
    homeBtn: document.getElementById('home-btn'),
    themeToggle: document.getElementById('theme-toggle'),
    restartTutorial: document.getElementById('restart-tutorial'),
    tutorialModal: document.getElementById('tutorial-modal'),
    closeTutorialBtn: document.getElementById('close-tutorial'),
    sunIcon: document.querySelector('.sun-icon'),
    moonIcon: document.querySelector('.moon-icon'),
    popupModal: document.getElementById('popup-modal'),
    popupTitle: document.getElementById('popup-title'),
    popupMessage: document.getElementById('popup-message'),
    popupClose: document.getElementById('popup-close'),
    botHelper: document.getElementById('bot-helper'),
    botText: document.getElementById('bot-text'),
    botNext: document.getElementById('bot-next'),
    botPrev: document.getElementById('bot-prev'),
    botSkip: document.getElementById('bot-skip'),
    botClose: document.getElementById('bot-close'),
    botHighlight: document.querySelector('.bot-highlight')
};

// --- State Variables ---
// These variables keep track of the quiz state
let quizPool = [];           // Array of all kana to quiz on
let currentIndex = 0;        // Which question we're currently on
let score = 0;               // How many questions answered correctly
let mistakes = [];           // Array of kana that were answered incorrectly
let isRetry = false;         // Whether we're retrying mistakes
let botStep = 0;             // Current step in the bot tutorial

// Tutorial steps for the bot helper
const botSteps = [
    {
        message: "  Hi! I'm KanaBot, your learning assistant. Welcome to KanaMaster!",
        highlight: null
    },
    {
        message: "Here you can select which Hiragana rows to practice. Hover over a button to see the English romaji!",
        highlight: '#hiragana-options'
    },
    {
        message: "And here are the Katakana rows. You can mix and match both scripts!",
        highlight: '#katakana-options'
    },
    {
        message: "Use these buttons to quickly select all or clear selections for each script.",
        highlight: '.script-group:first-child .group-actions',
        multiple: false 
    },
    {
        message: "Once you've selected at least one row, click here to start your quiz!",
        highlight: '#start-btn'
    },
    {
        message: "You can toggle dark mode anytime using this button in the header.",
        highlight: '#theme-toggle'
    },
    {
        message: "Ready to learn? Select some rows and start practicing! Good luck!",
        highlight: null
    }
]; 

// --- Initialization ---
// When the page loads, set everything up
document.addEventListener('DOMContentLoaded', function() {
    renderSelectionUI();
    loadSettings();
    setupEventListeners();
    checkTutorial();
    checkBotHelper();
});

// --- UI Rendering Functions ---

/**
 * Creates a checkbox button for one row (like "A" or "KA")
 * @param {string} key - The row name like "a" or "ka"
 * @param {string} scriptName - Either "hiragana" or "katakana"
 * @param {HTMLElement} container - Where to put the checkbox
 * @param {string} firstChar - The first kana character in this row
 * @param {Array} romajiList - Array of romaji strings for the tooltip
 */
function createCheckbox(key, scriptName, container, firstChar, romajiList) {
    // Create a label element to hold our checkbox
    const labelEl = document.createElement('label');
    labelEl.className = 'checkbox-label';
    
    // Join the romaji list with spaces for the tooltip
    const tooltipText = romajiList.join(' ');
    labelEl.setAttribute('data-tooltip', tooltipText);
    
    // Make the key uppercase for display (a becomes A)
    const uppercaseKey = key.toUpperCase();
    
    // Create the HTML content for this checkbox
    labelEl.innerHTML = '<span>' + firstChar + '</span>' +
                        '<span>' + uppercaseKey + '</span>' +
                        '<input type="checkbox" data-group="' + key + '" data-script="' + scriptName + '">' +
                        '<span class="tooltip">' + tooltipText + '</span>';
    
    // Find the input checkbox we just created
    const input = labelEl.querySelector('input');
    
    // When checkbox is clicked, update the styling
    input.addEventListener('change', function() {
        if (input.checked) {
            labelEl.classList.add('checked');
        } else {
            labelEl.classList.remove('checked');
        }
        saveSelections();
    });
    
    // Add this checkbox to the container
    container.appendChild(labelEl);
}

/**
 * Gets the first romaji from a kana item
 * @param {Object} item - A kana object with a romaji array
 * @returns {string} The first romaji string
 */
function getFirstRomaji(item) {
    return item.romaji[0];
}

/**
 * Gets the romaji list for all items in a row
 * @param {Array} rowData - Array of kana items in a row
 * @returns {Array} Array of romaji strings
 */
function getRomajiList(rowData) {
    const romajiList = [];
    for (let i = 0; i < rowData.length; i++) {
        const firstRomaji = getFirstRomaji(rowData[i]);
        romajiList.push(firstRomaji);
    }
    return romajiList;
}

/**
 * Creates all the checkbox buttons for Hiragana and Katakana
 */
function renderSelectionUI() {
    // Get all the keys from the hiragana data (like "a", "ka", "sa", etc.)
    const hiraganaKeys = Object.keys(KANA_DATA.hiragana);
    
    // Loop through each hiragana row
    for (let i = 0; i < hiraganaKeys.length; i++) {
        const key = hiraganaKeys[i];
        const rowData = KANA_DATA.hiragana[key];
        
        // Get the first character to display (like 'あ' for 'a' row)
        const displayChar = rowData[0].char;
        
        // Get all romaji for the tooltip
        const romajiList = getRomajiList(rowData);
        
        // Create the checkbox for this row
        createCheckbox(key, 'hiragana', elements.hiraganaGrid, displayChar, romajiList);
    }

    // Get all the keys from the katakana data
    const katakanaKeys = Object.keys(KANA_DATA.katakana);
    
    // Loop through each katakana row
    for (let i = 0; i < katakanaKeys.length; i++) {
        const key = katakanaKeys[i];
        const rowData = KANA_DATA.katakana[key];
        
        // Get the first character to display
        const displayChar = rowData[0].char;
        
        // Get all romaji for the tooltip
        const romajiList = getRomajiList(rowData);
        
        // Create the checkbox for this row
        createCheckbox(key, 'katakana', elements.katakanaGrid, displayChar, romajiList);
    }
}

// --- Quiz Logic Functions ---

/**
 * Collects all the kana from checked checkboxes into one array
 * @returns {Array} Array of kana objects to quiz on
 */
function collectSelections() {
    // Find all checkboxes that are checked
    const checked = document.querySelectorAll('input[type="checkbox"]:checked');
    const pool = [];

    // Loop through each checked checkbox
    for (let i = 0; i < checked.length; i++) {
        const cb = checked[i];
        const script = cb.dataset.script;  // "hiragana" or "katakana"
        const group = cb.dataset.group;    // "a", "ka", etc.
        
        // Get all kana items for this row
        const items = KANA_DATA[script][group];
        
        // Add each item to the pool, along with the script info
        for (let j = 0; j < items.length; j++) {
            const item = items[j];
            const itemWithScript = {
                char: item.char,
                romaji: item.romaji,
                script: script
            };
            pool.push(itemWithScript);
        }
    }

    return pool;
}

/**
 * Randomly shuffles an array to mix up the quiz order
 * Uses the Fisher-Yates shuffle algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} The shuffled array
 */
function shuffle(array) {
    // Create a copy of the array so we don't modify the original
    const shuffledArray = [];
    for (let i = 0; i < array.length; i++) {
        shuffledArray.push(array[i]);
    }
    
    // Shuffle by swapping random elements
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        
        // Swap elements at positions i and j
        const temp = shuffledArray[i];
        shuffledArray[i] = shuffledArray[j];
        shuffledArray[j] = temp;
    }
    
    return shuffledArray;
}

/**
 * Starts a new quiz
 * @param {Array|null} customPool - Optional array of kana to quiz (for retrying mistakes)
 */
function startQuiz(customPool) {
    if (customPool) {
        // Use the provided pool (for retrying mistakes)
        quizPool = shuffle(customPool);
    } else {
        // Get all selected kana
        const selection = collectSelections();
        
        // Make sure at least one row is selected
        if (selection.length === 0) {
            showPopup("Please select at least one row (e.g., 'A', 'Ka') to start.", 'No Selection');
            return;
        }
        
        // Shuffle the selections
        quizPool = shuffle(selection);
    }

    // Reset quiz state
    currentIndex = 0;
    score = 0;
    mistakes = [];
    
    // Show the quiz view and first question
    switchView('quiz');
    showQuestion();
}

/**
 * Displays the current question on the screen
 */
function showQuestion() {
    // Get the current kana item
    const item = quizPool[currentIndex];
    
    // Display the kana character
    elements.questionChar.textContent = item.char;
    
    // Clear the input field and focus it
    elements.answerInput.value = '';
    elements.answerInput.focus();
    
    // Clear any previous feedback
    elements.feedback.textContent = '';
    elements.feedback.className = 'feedback';
    
    // Calculate and display progress
    const progressPercent = (currentIndex / quizPool.length) * 100;
    elements.progressBar.style.width = progressPercent + '%';
    
    // Update counter text (e.g., "1 / 10")
    const questionNumber = currentIndex + 1;
    elements.counterText.textContent = questionNumber + ' / ' + quizPool.length;
}

/**
 * Checks if the user's answer is correct
 */
function checkAnswer() {
    // Get what the user typed and make it lowercase
    const userInput = elements.answerInput.value.trim().toLowerCase();
    
    // Don't allow empty answers
    if (userInput === '') {
        return;
    }

    // Get the current kana item
    const currentItem = quizPool[currentIndex];
    
    // Check if the user's answer matches any valid romaji
    let isCorrect = false;
    for (let i = 0; i < currentItem.romaji.length; i++) {
        if (currentItem.romaji[i] === userInput) {
            isCorrect = true;
            break;
        }
    }

    if (isCorrect) {
        // Answer is correct!
        score++;
        elements.feedback.textContent = "Correct!";
        elements.feedback.classList.add('correct');
    } else {
        // Answer is wrong
        const correctAnswer = currentItem.romaji[0];
        elements.feedback.textContent = "Incorrect. Answer: " + correctAnswer;
        elements.feedback.classList.add('incorrect');
        mistakes.push(currentItem);
    }

    // Disable input to prevent double-submission
    elements.answerInput.disabled = true;
    
    // Wait 1 second, then move to next question
    setTimeout(function() {
        elements.answerInput.disabled = false;
        currentIndex++;
        
        if (currentIndex < quizPool.length) {
            // More questions left
            showQuestion();
        } else {
            // Quiz is finished
            finishQuiz();
        }
    }, 1000);
}

/**
 * Shows the results screen after quiz is complete
 */
function finishQuiz() {
    // Set progress bar to 100%
    elements.progressBar.style.width = '100%';
    
    // Calculate accuracy percentage
    const accuracy = Math.round((score / quizPool.length) * 100);
    elements.finalScore.textContent = accuracy + '%';
    
    // Update statistics
    elements.totalCount.textContent = quizPool.length;
    elements.mistakeCount.textContent = mistakes.length;

    // Show mistakes list if there are any
    if (mistakes.length > 0) {
        // Show the mistakes container
        elements.mistakesContainer.classList.remove('hidden');
        elements.retryBtn.classList.remove('hidden');
        
        // Create HTML for each mistake
        let mistakesHTML = '';
        for (let i = 0; i < mistakes.length; i++) {
            const mistake = mistakes[i];
            const romajiText = mistake.romaji.join(' / ');
            mistakesHTML += '<li><strong style="font-size:1.2rem">' + mistake.char + '</strong> ' +
                           '<span>' + romajiText + '</span></li>';
        }
        
        elements.mistakesUl.innerHTML = mistakesHTML;
    } else {
        // No mistakes, so hide the mistakes section
        elements.mistakesContainer.classList.add('hidden');
        elements.retryBtn.classList.add('hidden');
    }

    // Switch to results view
    switchView('results');
}

// --- View Switching Functions ---

/**
 * Switches which view is currently shown (selection, quiz, or results)
 * @param {string} viewName - Name of the view to show
 */
function switchView(viewName) {
    // Hide all views first
    const viewNames = Object.keys(views);
    for (let i = 0; i < viewNames.length; i++) {
        const key = viewNames[i];
        views[key].classList.add('hidden');
    }
    
    // Show the requested view
    views[viewName].classList.remove('hidden');
    
    // Scroll to top of page
    window.scrollTo(0, 0);
}

// --- Settings & Storage Functions ---

/**
 * Toggles dark mode on and off
 */
function toggleDarkMode() {
    // Toggle the dark-mode class on the body
    document.body.classList.toggle('dark-mode');
    
    // Check if dark mode is now active
    const isDark = document.body.classList.contains('dark-mode');
    
    // Save preference to localStorage
    localStorage.setItem('kana-dark-mode', isDark);
    
    // Update the theme icons
    updateThemeIcons(isDark);
}

/**
 * Updates which theme icon is visible (sun or moon)
 * @param {boolean} isDark - True if dark mode is on
 */
function updateThemeIcons(isDark) {
    if (isDark) {
        // Dark mode is on, show sun icon (to switch to light)
        elements.moonIcon.classList.add('hidden');
        elements.sunIcon.classList.remove('hidden');
    } else {
        // Dark mode is off, show moon icon (to switch to dark)
        elements.moonIcon.classList.remove('hidden');
        elements.sunIcon.classList.add('hidden');
    }
}

/**
 * Saves which checkboxes are currently selected to localStorage
 */
function saveSelections() {
    // Get all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const state = {};
    
    // Loop through each checkbox and save its state
    for (let i = 0; i < checkboxes.length; i++) {
        const cb = checkboxes[i];
        const script = cb.dataset.script;
        const group = cb.dataset.group;
        
        // Create a unique key like "hiragana-ka"
        const key = script + '-' + group;
        state[key] = cb.checked;
    }
    
    // Save to localStorage as JSON string
    localStorage.setItem('kana-selections', JSON.stringify(state));
}

/**
 * Loads saved settings from localStorage when page loads
 */
function loadSettings() {
    // Load dark mode preference
    const darkModeValue = localStorage.getItem('kana-dark-mode');
    const isDark = darkModeValue === 'true';
    
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
    
    updateThemeIcons(isDark);

    // Load saved checkbox selections
    const savedJSON = localStorage.getItem('kana-selections');
    if (savedJSON) {
        const saved = JSON.parse(savedJSON);
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        
        // Restore each checkbox state
        for (let i = 0; i < checkboxes.length; i++) {
            const cb = checkboxes[i];
            const script = cb.dataset.script;
            const group = cb.dataset.group;
            const key = script + '-' + group;
            
            if (saved[key]) {
                cb.checked = true;
                cb.parentElement.classList.add('checked');
            }
        }
    }
}

/**
 * Checks if tutorial modal should be shown on first visit
 */
function checkTutorial() {
    const seen = localStorage.getItem('kana-tutorial-seen');
    if (!seen) {
        elements.tutorialModal.classList.remove('hidden');
    }
}

// --- Bot Helper Functions ---

/**
 * Checks if bot helper should be shown on first visit
 */
function checkBotHelper() {
    const seen = localStorage.getItem('kana-bot-helper-seen');
    if (!seen) {
        // Wait 1 second, then show the bot
        setTimeout(function() {
            showBotHelper();
        }, 1000);
    }
}

/**
 * Shows the bot helper and starts at step 0
 */
function showBotHelper() {
    elements.botHelper.classList.remove('hidden');
    botStep = 0;
    updateBotStep();
}

/**
 * Hides the bot helper and marks it as seen
 */
function hideBotHelper() {
    elements.botHelper.classList.add('hidden');
    hideHighlight();
    localStorage.setItem('kana-bot-helper-seen', 'true');
}

/**
 * Restarts the bot helper tutorial
 */
function restartBotHelper() {
    // Clear the "seen" flag so it shows again
    localStorage.removeItem('kana-bot-helper-seen');
    
    // Hide any current bot helper
    elements.botHelper.classList.add('hidden');
    hideHighlight();
    
    // Wait a bit, then show it again
    setTimeout(function() {
        showBotHelper();
    }, 200);
}

/**
 * Updates the bot helper to show the current step
 */
function updateBotStep() {
    // Check if we're past the last step
    if (botStep < 0 || botStep >= botSteps.length) {
        hideBotHelper();
        return;
    }

    // Get the current step data
    const step = botSteps[botStep];
    
    // Update the message text
    elements.botText.textContent = step.message;
    
    // Update button visibility and text
    if (botStep === 0) {
        // First step - hide previous button
        elements.botPrev.style.display = 'none';
    } else {
        // Show previous button
        elements.botPrev.style.display = 'inline-block';
    }
    
    if (botStep === botSteps.length - 1) {
        // Last step - change next button text
        elements.botNext.textContent = 'Got it!';
    } else {
        // Normal step
        elements.botNext.textContent = 'Next →';
    }
    
    // Highlight element if needed
    if (step.highlight) {
        if (step.multiple) {
            // Highlight multiple elements
            highlightMultipleElements(step.highlight);
        } else {
            // Highlight single element
            highlightElement(step.highlight);
        }
    } else {
        // No highlight needed
        hideHighlight();
    }
}

/**
 * Highlights a single element on the page
 * @param {string} selector - CSS selector to find the element
 */
function highlightElement(selector) {
    // Find the element
    const element = document.querySelector(selector);
    
    if (!element) {
        // Element not found, hide highlight
        hideHighlight();
        return;
    }

    // Hide any existing highlight first
    hideHighlight();

    // Scroll the element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    
    // Wait for scroll to complete, then highlight
    setTimeout(function() {
        // Get the element's position and size
        const rect = element.getBoundingClientRect();
        const highlight = elements.botHighlight;
        const padding = 8;
        
        // Position the highlight around the element
        const left = Math.max(0, rect.left - padding);
        const top = Math.max(0, rect.top - padding);
        const width = rect.width + (padding * 2);
        const height = rect.height + (padding * 2);
        
        highlight.style.left = left + 'px';
        highlight.style.top = top + 'px';
        highlight.style.width = width + 'px';
        highlight.style.height = height + 'px';
        highlight.classList.add('active');
    }, 400);
}

/**
 * Highlights multiple elements by creating a box around all of them
 * @param {string} selector - CSS selector to find all elements
 */
function highlightMultipleElements(selector) {
    // Find all matching elements
    const elements_list = document.querySelectorAll(selector);
    
    if (!elements_list || elements_list.length === 0) {
        // No elements found
        hideHighlight();
        return;
    }

    // Hide any existing highlight first
    hideHighlight();

    // Scroll first element into view
    elements_list[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    
    // Wait for scroll, then calculate bounding box
    setTimeout(function() {
        // Start with extreme values
        let minLeft = Infinity;
        let minTop = Infinity;
        let maxRight = -Infinity;
        let maxBottom = -Infinity;

        // Loop through all elements and find the boundaries
        for (let i = 0; i < elements_list.length; i++) {
            const element = elements_list[i];
            const rect = element.getBoundingClientRect();
            
            // Update boundaries
            if (rect.left < minLeft) {
                minLeft = rect.left;
            }
            if (rect.top < minTop) {
                minTop = rect.top;
            }
            if (rect.right > maxRight) {
                maxRight = rect.right;
            }
            if (rect.bottom > maxBottom) {
                maxBottom = rect.bottom;
            }
        }

        // Create highlight box around all elements
        const highlight = elements.botHighlight;
        const padding = 8;
        
        const left = Math.max(0, minLeft - padding);
        const top = Math.max(0, minTop - padding);
        const width = (maxRight - minLeft) + (padding * 2);
        const height = (maxBottom - minTop) + (padding * 2);
        
        highlight.style.left = left + 'px';
        highlight.style.top = top + 'px';
        highlight.style.width = width + 'px';
        highlight.style.height = height + 'px';
        highlight.classList.add('active');
    }, 400);
}

/**
 * Hides the highlight overlay
 */
function hideHighlight() {
    elements.botHighlight.classList.remove('active');
}

/**
 * Moves to the next step in the bot tutorial
 */
function nextBotStep() {
    if (botStep < botSteps.length - 1) {
        // Go to next step
        botStep++;
        updateBotStep();
    } else {
        // Last step - close the bot
        hideBotHelper();
    }
}

/**
 * Moves to the previous step in the bot tutorial
 */
function prevBotStep() {
    if (botStep > 0) {
        // Go to previous step
        botStep--;
        updateBotStep();
    }
}

// --- Popup System Functions ---

/**
 * Shows a popup message to the user
 * @param {string} message - The message to display
 * @param {string} title - The title of the popup (defaults to "Notice")
 */
function showPopup(message, title) {
    // Use default title if none provided
    if (title === undefined) {
        title = 'Notice';
    }
    
    elements.popupTitle.textContent = title;
    elements.popupMessage.textContent = message;
    elements.popupModal.classList.remove('hidden');
}

/**
 * Hides the popup
 */
function hidePopup() {
    elements.popupModal.classList.add('hidden');
}

// --- Event Listeners Setup ---

/**
 * Sets up all event listeners when page loads
 */
function setupEventListeners() {
    // Start Quiz button
    elements.startBtn.addEventListener('click', function() {
        isRetry = false;
        startQuiz();
    });

    // Submit Answer button
    elements.submitBtn.addEventListener('click', checkAnswer);
    
    // Allow Enter key to submit answer
    elements.answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // Back to Home button
    elements.homeBtn.addEventListener('click', function() {
        switchView('selection');
    });
    
    // Retry Mistakes button
    elements.retryBtn.addEventListener('click', function() {
        isRetry = true;
        startQuiz(mistakes);
    });

    // Theme toggle button
    elements.themeToggle.addEventListener('click', toggleDarkMode);
    
    // Restart Tutorial button
    elements.restartTutorial.addEventListener('click', restartBotHelper);
    
    // Close Tutorial Modal button
    elements.closeTutorialBtn.addEventListener('click', function() {
        elements.tutorialModal.classList.add('hidden');
        localStorage.setItem('kana-tutorial-seen', 'true');
    });

    // Popup close button
    elements.popupClose.addEventListener('click', hidePopup);
    
    // Close popup when clicking outside of it
    elements.popupModal.addEventListener('click', function(e) {
        if (e.target === elements.popupModal) {
            hidePopup();
        }
    });
    
    // Close popup or bot helper when Escape key is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Check if popup is visible
            const popupHidden = elements.popupModal.classList.contains('hidden');
            if (!popupHidden) {
                hidePopup();
            } else {
                // Check if bot helper is visible
                const botHidden = elements.botHelper.classList.contains('hidden');
                if (!botHidden) {
                    hideBotHelper();
                }
            }
        }
    });

    // Bot Helper navigation buttons
    elements.botNext.addEventListener('click', nextBotStep);
    elements.botPrev.addEventListener('click', prevBotStep);
    elements.botSkip.addEventListener('click', hideBotHelper);
    elements.botClose.addEventListener('click', hideBotHelper);

    // Helper function to set all checkboxes for a script type
    function setGroupState(script, state) {
        // Find all checkboxes for this script type
        const selector = 'input[data-script="' + script + '"]';
        const checkboxes = document.querySelectorAll(selector);
        
        // Loop through each checkbox
        for (let i = 0; i < checkboxes.length; i++) {
            const cb = checkboxes[i];
            cb.checked = state;
            
            // Update visual styling
            if (state) {
                cb.parentElement.classList.add('checked');
            } else {
                cb.parentElement.classList.remove('checked');
            }
        }
        
        // Save the changes
        saveSelections();
    }

    // Select All Hiragana button
    document.getElementById('select-all-h').addEventListener('click', function() {
        setGroupState('hiragana', true);
    });
    
    // Clear All Hiragana button
    document.getElementById('clear-all-h').addEventListener('click', function() {
        setGroupState('hiragana', false);
    });
    
    // Select All Katakana button
    document.getElementById('select-all-k').addEventListener('click', function() {
        setGroupState('katakana', true);
    });
    
    // Clear All Katakana button
    document.getElementById('clear-all-k').addEventListener('click', function() {
        setGroupState('katakana', false);
    });
}
