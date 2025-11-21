/**
 * script.js
 * Handles application logic, UI rendering, quiz flow, and storage.
 */

// --- DOM Elements ---
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

// --- State ---
let quizPool = [];
let currentIndex = 0;
let score = 0;
let mistakes = []; // Array of objects { char, romaji (array), userAnswer }
let isRetry = false;
let botStep = 0;
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
        highlight: '.group-actions',
        multiple: true
    },
    {
        message: "Once you've selected at least one row, click here to start your quiz!",
        highlight: '.action-area'
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
document.addEventListener('DOMContentLoaded', () => {
    renderSelectionUI();
    loadSettings();
    setupEventListeners();
    checkTutorial();
    checkBotHelper();
});

// --- UI Rendering ---

// Generates checkboxes based on the keys in KANA_DATA (a, ka, sa, etc.)
function renderSelectionUI() {
    const createCheckbox = (key, scriptName, container, firstChar, romajiList) => {
        const labelEl = document.createElement('label');
        labelEl.className = 'checkbox-label';
        labelEl.setAttribute('data-tooltip', romajiList.join(' '));
        
        // We display the first char of that row (e.g., "あ" for 'a' row) and the row name
        labelEl.innerHTML = `
            <span>${firstChar}</span>
            <span>${key.toUpperCase()}</span>
            <input type="checkbox" data-group="${key}" data-script="${scriptName}">
            <span class="tooltip">${romajiList.join(' ')}</span>
        `;
        
        // Add click styling logic
        const input = labelEl.querySelector('input');
        input.addEventListener('change', () => {
            if (input.checked) labelEl.classList.add('checked');
            else labelEl.classList.remove('checked');
            saveSelections();
        });
        
        container.appendChild(labelEl);
    };

    // Render Hiragana Rows
    Object.keys(KANA_DATA.hiragana).forEach(key => {
        // Get the first character of the group for visual reference (e.g., 'あ' for 'a' row)
        const displayChar = KANA_DATA.hiragana[key][0].char;
        // Get all romaji values in this row for tooltip (use first romaji from each item)
        const romajiList = KANA_DATA.hiragana[key].map(item => item.romaji[0]);
        createCheckbox(key, 'hiragana', elements.hiraganaGrid, displayChar, romajiList);
    });

    // Render Katakana Rows
    Object.keys(KANA_DATA.katakana).forEach(key => {
        const displayChar = KANA_DATA.katakana[key][0].char;
        // Get all romaji values in this row for tooltip (use first romaji from each item)
        const romajiList = KANA_DATA.katakana[key].map(item => item.romaji[0]);
        createCheckbox(key, 'katakana', elements.katakanaGrid, displayChar, romajiList);
    });
}

// --- Quiz Logic ---

function collectSelections() {
    const checked = document.querySelectorAll('input[type="checkbox"]:checked');
    let pool = [];

    checked.forEach(cb => {
        const script = cb.dataset.script;
        const group = cb.dataset.group;
        const items = KANA_DATA[script][group];
        // Add script info to item for internal tracking if needed
        pool = pool.concat(items.map(item => ({...item, script})));
    });

    return pool;
}

// Fisher-Yates Shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz(customPool = null) {
    if (customPool) {
        quizPool = shuffle([...customPool]);
    } else {
        const selection = collectSelections();
        if (selection.length === 0) {
            showPopup("Please select at least one row (e.g., 'A', 'Ka') to start.", 'No Selection');
            return;
        }
        quizPool = shuffle(selection);
    }

    currentIndex = 0;
    score = 0;
    mistakes = [];
    
    switchView('quiz');
    showQuestion();
}

function showQuestion() {
    const item = quizPool[currentIndex];
    elements.questionChar.textContent = item.char;
    elements.answerInput.value = '';
    elements.answerInput.focus();
    elements.feedback.textContent = '';
    elements.feedback.className = 'feedback';
    
    // Update Progress Bar
    const pct = ((currentIndex) / quizPool.length) * 100;
    elements.progressBar.style.width = `${pct}%`;
    elements.counterText.textContent = `${currentIndex + 1} / ${quizPool.length}`;
}

function checkAnswer() {
    const input = elements.answerInput.value.trim().toLowerCase();
    if (!input) return; // Prevent empty submission

    const currentItem = quizPool[currentIndex];
    // Check if input matches ANY of the valid romaji (e.g., 'shi' or 'si')
    const isCorrect = currentItem.romaji.includes(input);

    if (isCorrect) {
        score++;
        elements.feedback.textContent = "Correct!";
        elements.feedback.classList.add('correct');
    } else {
        elements.feedback.textContent = `Incorrect. Answer: ${currentItem.romaji[0]}`;
        elements.feedback.classList.add('incorrect');
        mistakes.push(currentItem);
    }

    // Temporary disable to prevent double-enter
    elements.answerInput.disabled = true;

    // Short delay to read feedback
    setTimeout(() => {
        elements.answerInput.disabled = false;
        currentIndex++;
        if (currentIndex < quizPool.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    }, 1000);
}

function finishQuiz() {
    elements.progressBar.style.width = '100%';
    
    const accuracy = Math.round((score / quizPool.length) * 100);
    elements.finalScore.textContent = `${accuracy}%`;
    elements.totalCount.textContent = quizPool.length;
    elements.mistakeCount.textContent = mistakes.length;

    // Populate Mistakes List
    if (mistakes.length > 0) {
        elements.mistakesContainer.classList.remove('hidden');
        elements.retryBtn.classList.remove('hidden');
        elements.mistakesUl.innerHTML = mistakes.map(m => 
            `<li>
                <strong style="font-size:1.2rem">${m.char}</strong> 
                <span>${m.romaji.join(' / ')}</span>
            </li>`
        ).join('');
    } else {
        elements.mistakesContainer.classList.add('hidden');
        elements.retryBtn.classList.add('hidden');
    }

    switchView('results');
}

// --- View Switching ---
function switchView(viewName) {
    Object.values(views).forEach(el => el.classList.add('hidden'));
    views[viewName].classList.remove('hidden');
    window.scrollTo(0, 0);
}

// --- Persistence & Settings ---

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('kana-dark-mode', isDark);
    updateThemeIcons(isDark);
}

function updateThemeIcons(isDark) {
    if (isDark) {
        elements.moonIcon.classList.add('hidden');
        elements.sunIcon.classList.remove('hidden');
    } else {
        elements.moonIcon.classList.remove('hidden');
        elements.sunIcon.classList.add('hidden');
    }
}

function saveSelections() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const state = {};
    checkboxes.forEach(cb => {
        // Create a unique key like "hiragana-ka"
        const key = `${cb.dataset.script}-${cb.dataset.group}`;
        state[key] = cb.checked;
    });
    localStorage.setItem('kana-selections', JSON.stringify(state));
}

function loadSettings() {
    // Theme
    const isDark = localStorage.getItem('kana-dark-mode') === 'true';
    if (isDark) document.body.classList.add('dark-mode');
    updateThemeIcons(isDark);

    // Selections
    const saved = JSON.parse(localStorage.getItem('kana-selections'));
    if (saved) {
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            const key = `${cb.dataset.script}-${cb.dataset.group}`;
            if (saved[key]) {
                cb.checked = true;
                cb.parentElement.classList.add('checked');
            }
        });
    }
}

function checkTutorial() {
    const seen = localStorage.getItem('kana-tutorial-seen');
    if (!seen) {
        elements.tutorialModal.classList.remove('hidden');
    }
}

// --- Bot Helper System ---

function checkBotHelper() {
    const seen = localStorage.getItem('kana-bot-helper-seen');
    if (!seen) {
        setTimeout(() => {
            showBotHelper();
        }, 1000); // Show after 1 second
    }
}

function showBotHelper() {
    elements.botHelper.classList.remove('hidden');
    botStep = 0;
    updateBotStep();
}

function hideBotHelper() {
    elements.botHelper.classList.add('hidden');
    hideHighlight();
    localStorage.setItem('kana-bot-helper-seen', 'true');
}

function restartBotHelper() {
    // Clear the seen flag
    localStorage.removeItem('kana-bot-helper-seen');
    // Hide any current bot helper
    elements.botHelper.classList.add('hidden');
    hideHighlight();
    // Reset and show the bot helper
    setTimeout(() => {
        showBotHelper();
    }, 200);
}

function updateBotStep() {
    if (botStep < 0 || botStep >= botSteps.length) {
        hideBotHelper();
        return;
    }

    const step = botSteps[botStep];
    elements.botText.textContent = step.message;
    
    // Update button visibility
    elements.botPrev.style.display = botStep === 0 ? 'none' : 'inline-block';
    elements.botNext.textContent = botStep === botSteps.length - 1 ? 'Got it!' : 'Next →';
    
    // Highlight element
    if (step.highlight) {
        if (step.multiple) {
            highlightMultipleElements(step.highlight);
        } else {
            highlightElement(step.highlight);
        }
    } else {
        hideHighlight();
    }
}

function highlightElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        hideHighlight();
        return;
    }

    // First hide any existing highlight
    hideHighlight();

    // Scroll element into view first
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    
    // Wait for scroll and DOM update before highlighting
    setTimeout(() => {
        // Get fresh bounding rect after scroll
        const rect = element.getBoundingClientRect();
        const highlight = elements.botHighlight;
        
        // Position fixed uses viewport coordinates (getBoundingClientRect already accounts for this)
        // Add padding for better visual effect
        highlight.style.left = `${Math.max(0, rect.left - 8)}px`;
        highlight.style.top = `${Math.max(0, rect.top - 8)}px`;
        highlight.style.width = `${rect.width + 16}px`;
        highlight.style.height = `${rect.height + 16}px`;
        highlight.classList.add('active');
    }, 400); // Wait for scroll animation to complete
}

function highlightMultipleElements(selector) {
    const elements_list = document.querySelectorAll(selector);
    if (!elements_list || elements_list.length === 0) {
        hideHighlight();
        return;
    }

    // First hide any existing highlight
    hideHighlight();

    // Scroll first element into view
    elements_list[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    
    // Wait for scroll and DOM update before highlighting
    setTimeout(() => {
        // Calculate bounding box that encompasses all elements
        let minLeft = Infinity;
        let minTop = Infinity;
        let maxRight = -Infinity;
        let maxBottom = -Infinity;

        elements_list.forEach(element => {
            const rect = element.getBoundingClientRect();
            minLeft = Math.min(minLeft, rect.left);
            minTop = Math.min(minTop, rect.top);
            maxRight = Math.max(maxRight, rect.right);
            maxBottom = Math.max(maxBottom, rect.bottom);
        });

        const highlight = elements.botHighlight;
        const padding = 8;
        
        // Position fixed uses viewport coordinates
        highlight.style.left = `${Math.max(0, minLeft - padding)}px`;
        highlight.style.top = `${Math.max(0, minTop - padding)}px`;
        highlight.style.width = `${maxRight - minLeft + (padding * 2)}px`;
        highlight.style.height = `${maxBottom - minTop + (padding * 2)}px`;
        highlight.classList.add('active');
    }, 400); // Wait for scroll animation to complete
}

function hideHighlight() {
    elements.botHighlight.classList.remove('active');
}

function nextBotStep() {
    if (botStep < botSteps.length - 1) {
        botStep++;
        updateBotStep();
    } else {
        hideBotHelper();
    }
}

function prevBotStep() {
    if (botStep > 0) {
        botStep--;
        updateBotStep();
    }
}

// --- Popup System ---

function showPopup(message, title = 'Notice') {
    elements.popupTitle.textContent = title;
    elements.popupMessage.textContent = message;
    elements.popupModal.classList.remove('hidden');
}

function hidePopup() {
    elements.popupModal.classList.add('hidden');
}

// --- Event Listeners ---

function setupEventListeners() {
    elements.startBtn.addEventListener('click', () => {
        isRetry = false;
        startQuiz();
    });

    elements.submitBtn.addEventListener('click', checkAnswer);
    
    // Allow "Enter" key to submit
    elements.answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    elements.homeBtn.addEventListener('click', () => switchView('selection'));
    
    elements.retryBtn.addEventListener('click', () => {
        isRetry = true;
        startQuiz(mistakes);
    });

    elements.themeToggle.addEventListener('click', toggleDarkMode);
    
    elements.restartTutorial.addEventListener('click', restartBotHelper);
    
    elements.closeTutorialBtn.addEventListener('click', () => {
        elements.tutorialModal.classList.add('hidden');
        localStorage.setItem('kana-tutorial-seen', 'true');
    });

    // Popup close button
    elements.popupClose.addEventListener('click', hidePopup);
    
    // Close popup when clicking outside
    elements.popupModal.addEventListener('click', (e) => {
        if (e.target === elements.popupModal) {
            hidePopup();
        }
    });
    
    // Close popup or bot helper with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!elements.popupModal.classList.contains('hidden')) {
                hidePopup();
            } else if (!elements.botHelper.classList.contains('hidden')) {
                hideBotHelper();
            }
        }
    });

    // Bot Helper Event Listeners
    elements.botNext.addEventListener('click', nextBotStep);
    elements.botPrev.addEventListener('click', prevBotStep);
    elements.botSkip.addEventListener('click', hideBotHelper);
    elements.botClose.addEventListener('click', hideBotHelper);

    // Bulk Select Helpers
    const setGroupState = (script, state) => {
        const cbs = document.querySelectorAll(`input[data-script="${script}"]`);
        cbs.forEach(cb => {
            cb.checked = state;
            if(state) cb.parentElement.classList.add('checked');
            else cb.parentElement.classList.remove('checked');
        });
        saveSelections();
    };

    document.getElementById('select-all-h').addEventListener('click', () => setGroupState('hiragana', true));
    document.getElementById('clear-all-h').addEventListener('click', () => setGroupState('hiragana', false));
    document.getElementById('select-all-k').addEventListener('click', () => setGroupState('katakana', true));
    document.getElementById('clear-all-k').addEventListener('click', () => setGroupState('katakana', false));
}