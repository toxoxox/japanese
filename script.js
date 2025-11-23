
const views = {
    scriptSelection: document.getElementById('view-script-selection'),
    rowSelection: document.getElementById('view-row-selection'),
    overview: document.getElementById('view-overview'),
    quiz: document.getElementById('view-quiz'),
    results: document.getElementById('view-results')
};

const elements = {
    rowSelectionContainer: document.getElementById('row-selection-container'),
    scriptNextBtn: document.getElementById('script-next-btn'),
    rowNextBtn: document.getElementById('row-next-btn'),
    rowBackBtn: document.getElementById('row-back-btn'),
    overviewBackBtn: document.getElementById('overview-back-btn'),
    startQuizBtn: document.getElementById('start-quiz-btn'),
    overviewScripts: document.getElementById('overview-scripts'),
    overviewRows: document.getElementById('overview-rows'),
    startBtn: document.getElementById('start-btn'),
    questionChar: document.getElementById('question-char'),
    answerInput: document.getElementById('answer-input'),
    submitBtn: document.getElementById('submit-answer'),
    skipBtn: document.getElementById('skip-question'),
    quizHomeBtn: document.getElementById('quiz-home-btn'),
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
    popupButtons: document.getElementById('popup-buttons')
};

let quizPool = [];
let currentIndex = 0;
let score = 0;
let mistakes = [];
let isRetry = false;
let currentConfirmCancel = null;
let selectedScripts = [];
let selectedRows = {};

const mainKanaKeys = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa'];
const dakutenKeys = ['ga', 'za', 'da', 'ba', 'pa'];
const combinedKeys = ['kya', 'sha', 'cha', 'nya', 'hya', 'mya', 'rya', 'gya', 'ja', 'bya', 'pya'];

document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    setupEventListeners();
    checkTutorial();
});

function createCheckbox(key, scriptName, container, firstChar, romajiList) {
    const labelEl = document.createElement('label');
    labelEl.className = 'checkbox-label';
    
    const tooltipText = romajiList.join(' ');
    labelEl.setAttribute('data-tooltip', tooltipText);
    
    const uppercaseKey = key.toUpperCase();
    
    labelEl.innerHTML = '<span>' + firstChar + '</span>' +
                        '<span>' + uppercaseKey + '</span>' +
                        '<input type="checkbox" data-group="' + key + '" data-script="' + scriptName + '">' +
                        '<span class="tooltip">' + tooltipText + '</span>';
    
    const input = labelEl.querySelector('input');
    
    input.addEventListener('change', function() {
        if (input.checked) {
            labelEl.classList.add('checked');
        } else {
            labelEl.classList.remove('checked');
        }
        saveSelections();
    });
    
    container.appendChild(labelEl);
}

function getFirstRomaji(item) {
    return item.romaji[0];
}

function getRomajiList(rowData) {
    const romajiList = [];
    for (let i = 0; i < rowData.length; i++) {
        const firstRomaji = getFirstRomaji(rowData[i]);
        romajiList.push(firstRomaji);
    }
    return romajiList;
}

function renderRowSelection() {
    elements.rowSelectionContainer.innerHTML = '';
    
    if (selectedScripts.length === 0) {
        return;
    }
    
    for (let i = 0; i < selectedScripts.length; i++) {
        const scriptName = selectedScripts[i];
        const scriptData = KANA_DATA[scriptName];
        const keys = Object.keys(scriptData);
        
        const scriptGroup = document.createElement('div');
        scriptGroup.className = 'script-group';
        
        const groupHeader = document.createElement('div');
        groupHeader.className = 'group-header';
        groupHeader.innerHTML = '<h3>' + (scriptName === 'hiragana' ? 'Hiragana' : 'Katakana') + '</h3>' +
            '<div class="group-actions">' +
            '<button class="text-btn script-select-all" data-script="' + scriptName + '">All</button>' +
            '<button class="text-btn script-clear-all" data-script="' + scriptName + '">None</button>' +
            '</div>';
        scriptGroup.appendChild(groupHeader);
        
        const mainSection = document.createElement('div');
        mainSection.className = 'kana-section';
        mainSection.innerHTML = '<h4 class="section-title">Main Kana</h4><div class="checkbox-grid" id="' + scriptName + '-main"></div>';
        scriptGroup.appendChild(mainSection);
        
        const dakutenSection = document.createElement('div');
        dakutenSection.className = 'kana-section';
        dakutenSection.innerHTML = '<h4 class="section-title">Dakuten</h4><div class="checkbox-grid" id="' + scriptName + '-dakuten"></div>';
        scriptGroup.appendChild(dakutenSection);
        
        const combinedSection = document.createElement('div');
        combinedSection.className = 'kana-section';
        combinedSection.innerHTML = '<h4 class="section-title">Combined</h4><div class="checkbox-grid" id="' + scriptName + '-combined"></div>';
        scriptGroup.appendChild(combinedSection);
        
        elements.rowSelectionContainer.appendChild(scriptGroup);
        
        const mainContainer = document.getElementById(scriptName + '-main');
        const dakutenContainer = document.getElementById(scriptName + '-dakuten');
        const combinedContainer = document.getElementById(scriptName + '-combined');
        
        for (let j = 0; j < keys.length; j++) {
            const key = keys[j];
            const rowData = scriptData[key];
            const displayChar = rowData[0].char;
            const romajiList = getRomajiList(rowData);
            
            let targetContainer;
            if (mainKanaKeys.indexOf(key) !== -1) {
                targetContainer = mainContainer;
            } else if (dakutenKeys.indexOf(key) !== -1) {
                targetContainer = dakutenContainer;
            } else if (combinedKeys.indexOf(key) !== -1) {
                targetContainer = combinedContainer;
            } else {
                targetContainer = mainContainer;
            }
            
            createCheckbox(key, scriptName, targetContainer, displayChar, romajiList);
        }
    }
    
    loadRowSelections();
    setupRowSelectionListeners();
}

function renderOverview() {
    let scriptsText = '';
    if (selectedScripts.length === 2) {
        scriptsText = 'Hiragana and Katakana';
    } else if (selectedScripts[0] === 'hiragana') {
        scriptsText = 'Hiragana';
    } else {
        scriptsText = 'Katakana';
    }
    elements.overviewScripts.textContent = scriptsText;
    
    const rowsList = [];
    for (let script in selectedRows) {
        if (selectedRows[script].length > 0) {
            const scriptName = script === 'hiragana' ? 'Hiragana' : 'Katakana';
            const rows = selectedRows[script].map(function(key) {
                return key.toUpperCase();
            }).join(', ');
            rowsList.push(scriptName + ': ' + rows);
        }
    }
    
    if (rowsList.length === 0) {
        elements.overviewRows.innerHTML = '<p>No rows selected</p>';
    } else {
        elements.overviewRows.innerHTML = '<p>' + rowsList.join('<br>') + '</p>';
    }
}

function collectSelections() {
    const pool = [];
    
    for (let script in selectedRows) {
        const rows = selectedRows[script];
        for (let i = 0; i < rows.length; i++) {
            const group = rows[i];
            const items = KANA_DATA[script][group];
            
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
    }

    return pool;
}

function updateSelectedRows() {
    selectedRows = {};
    const checkboxes = document.querySelectorAll('#row-selection-container input[type="checkbox"]:checked');
    
    for (let i = 0; i < checkboxes.length; i++) {
        const cb = checkboxes[i];
        const script = cb.dataset.script;
        const group = cb.dataset.group;
        
        if (!selectedRows[script]) {
            selectedRows[script] = [];
        }
        selectedRows[script].push(group);
    }
    
    elements.rowNextBtn.disabled = checkboxes.length === 0;
    saveRowSelections();
}

function saveRowSelections() {
    const state = {};
    for (let script in selectedRows) {
        state[script] = selectedRows[script];
    }
    localStorage.setItem('kana-row-selections', JSON.stringify(state));
}

function loadRowSelections() {
    const savedJSON = localStorage.getItem('kana-row-selections');
    if (savedJSON) {
        const saved = JSON.parse(savedJSON);
        const checkboxes = document.querySelectorAll('#row-selection-container input[type="checkbox"]');
        
        for (let i = 0; i < checkboxes.length; i++) {
            const cb = checkboxes[i];
            const script = cb.dataset.script;
            const group = cb.dataset.group;
            
            if (saved[script] && saved[script].indexOf(group) !== -1) {
                cb.checked = true;
                cb.parentElement.classList.add('checked');
            }
        }
        
        updateSelectedRows();
    }
}

function shuffle(array) {
    const shuffledArray = [];
    for (let i = 0; i < array.length; i++) {
        shuffledArray.push(array[i]);
    }
    
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        
        const temp = shuffledArray[i];
        shuffledArray[i] = shuffledArray[j];
        shuffledArray[j] = temp;
    }
    
    return shuffledArray;
}

function startQuiz(customPool) {
    if (customPool) {
        quizPool = shuffle(customPool);
    } else {
        const selection = collectSelections();
        
        if (selection.length === 0) {
            showPopup("Please select at least one row to start.", 'No Selection');
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
    
    elements.answerInput.disabled = false;
    elements.submitBtn.disabled = false;
    elements.skipBtn.disabled = false;
    
    const progressPercent = (currentIndex / quizPool.length) * 100;
    elements.progressBar.style.width = progressPercent + '%';
    
    const questionNumber = currentIndex + 1;
    elements.counterText.textContent = questionNumber + ' / ' + quizPool.length;
}

function checkAnswer() {
    const userInput = elements.answerInput.value.trim().toLowerCase();
    
    if (userInput === '') {
        return;
    }

    const currentItem = quizPool[currentIndex];
    
    let isCorrect = false;
    for (let i = 0; i < currentItem.romaji.length; i++) {
        if (currentItem.romaji[i] === userInput) {
            isCorrect = true;
            break;
        }
    }

    if (isCorrect) {
        score++;
        elements.feedback.textContent = "Correct!";
        elements.feedback.classList.add('correct');
    } else {
        const correctAnswer = currentItem.romaji[0];
        elements.feedback.textContent = "Incorrect. Answer: " + correctAnswer;
        elements.feedback.classList.add('incorrect');
        mistakes.push(currentItem);
    }

    elements.answerInput.disabled = true;
    elements.submitBtn.disabled = true;
    elements.skipBtn.disabled = true;
    
    setTimeout(function() {
        elements.answerInput.disabled = false;
        elements.submitBtn.disabled = false;
        elements.skipBtn.disabled = false;
        currentIndex++;
        
        if (currentIndex < quizPool.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    }, 1000);
}

function skipQuestion() {
    const currentItem = quizPool[currentIndex];
    mistakes.push(currentItem);
    
    const correctAnswer = currentItem.romaji[0];
    elements.feedback.textContent = "Skipped. Answer: " + correctAnswer;
    elements.feedback.classList.remove('correct', 'incorrect');
    elements.feedback.classList.add('incorrect');
    
    elements.answerInput.disabled = true;
    elements.submitBtn.disabled = true;
    elements.skipBtn.disabled = true;
    
    setTimeout(function() {
        elements.answerInput.disabled = false;
        elements.submitBtn.disabled = false;
        elements.skipBtn.disabled = false;
        currentIndex++;
        
        if (currentIndex < quizPool.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    }, 1000);
}

function returnHomeFromQuiz() {
    showConfirmPopup(
        'Are you sure you want to return home? Your progress will be lost.',
        'Return Home?',
        function() {
            switchView('scriptSelection');
            selectedScripts = [];
            selectedRows = {};
        },
        function() {
        }
    );
}

function finishQuiz() {
    elements.progressBar.style.width = '100%';
    
    const accuracy = Math.round((score / quizPool.length) * 100);
    elements.finalScore.textContent = accuracy + '%';
    
    elements.totalCount.textContent = quizPool.length;
    elements.mistakeCount.textContent = mistakes.length;

    if (mistakes.length > 0) {
        elements.mistakesContainer.classList.remove('hidden');
        elements.retryBtn.classList.remove('hidden');
        
        let mistakesHTML = '';
        for (let i = 0; i < mistakes.length; i++) {
            const mistake = mistakes[i];
            const romajiText = mistake.romaji.join(' / ');
            mistakesHTML += '<li><strong style="font-size:1.2rem">' + mistake.char + '</strong> ' +
                           '<span>' + romajiText + '</span></li>';
        }
        
        elements.mistakesUl.innerHTML = mistakesHTML;
    } else {
        elements.mistakesContainer.classList.add('hidden');
        elements.retryBtn.classList.add('hidden');
    }

    switchView('results');
}

function switchView(viewName) {
    const viewNames = Object.keys(views);
    for (let i = 0; i < viewNames.length; i++) {
        const key = viewNames[i];
        views[key].classList.add('hidden');
    }
    
    views[viewName].classList.remove('hidden');
    
    window.scrollTo(0, 0);
}

function getCurrentView() {
    if (!views.scriptSelection.classList.contains('hidden')) {
        return 'view-script-selection';
    }
    if (!views.rowSelection.classList.contains('hidden')) {
        return 'view-row-selection';
    }
    if (!views.overview.classList.contains('hidden')) {
        return 'view-overview';
    }
    if (!views.quiz.classList.contains('hidden')) {
        return 'view-quiz';
    }
    if (!views.results.classList.contains('hidden')) {
        return 'view-results';
    }
    return 'view-script-selection';
}

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

function loadSettings() {
    const darkModeValue = localStorage.getItem('kana-dark-mode');
    const isDark = darkModeValue === 'true';
    
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
    
    updateThemeIcons(isDark);
    
    const savedScripts = localStorage.getItem('kana-selected-scripts');
    if (savedScripts) {
        selectedScripts = JSON.parse(savedScripts);
        if (selectedScripts.length > 0) {
            document.querySelectorAll('.script-option').forEach(function(opt) {
                opt.classList.remove('selected');
                if (opt.dataset.script === 'both' && selectedScripts.length === 2) {
                    opt.classList.add('selected');
                } else if (opt.dataset.script === selectedScripts[0] && selectedScripts.length === 1) {
                    opt.classList.add('selected');
                }
            });
            elements.scriptNextBtn.disabled = false;
        }
    }
}

function checkTutorial() {
    const seen = localStorage.getItem('kana-tutorial-seen');
    if (!seen) {
        elements.tutorialModal.classList.remove('hidden');
    }
}

function showPopup(message, title) {
    if (title === undefined) {
        title = 'Notice';
    }
    
    elements.popupTitle.textContent = title;
    elements.popupMessage.textContent = message;
    
    elements.popupButtons.innerHTML = '<button id="popup-close" class="btn-primary">OK</button>';
    const closeBtn = document.getElementById('popup-close');
    closeBtn.addEventListener('click', hidePopup);
    
    currentConfirmCancel = null;
    
    elements.popupModal.classList.remove('hidden');
}

function showConfirmPopup(message, title, onConfirm, onCancel) {
    if (title === undefined) {
        title = 'Confirm';
    }
    
    elements.popupTitle.textContent = title;
    elements.popupMessage.textContent = message;
    
    elements.popupButtons.innerHTML = '<button id="popup-confirm" class="btn-primary">Yes</button><button id="popup-cancel" class="btn-secondary">No</button>';
    
    const confirmBtn = document.getElementById('popup-confirm');
    const cancelBtn = document.getElementById('popup-cancel');
    
    currentConfirmCancel = onCancel;
    
    confirmBtn.addEventListener('click', function() {
        hidePopup();
        currentConfirmCancel = null;
        if (onConfirm) {
            onConfirm();
        }
    });
    
    cancelBtn.addEventListener('click', function() {
        hidePopup();
        currentConfirmCancel = null;
        if (onCancel) {
            onCancel();
        }
    });
    
    elements.popupModal.classList.remove('hidden');
}

function hidePopup() {
    elements.popupModal.classList.add('hidden');
}

function setupEventListeners() {
    const scriptOptions = document.querySelectorAll('.script-option');
    for (let i = 0; i < scriptOptions.length; i++) {
        scriptOptions[i].addEventListener('click', function() {
            const script = this.dataset.script;
            selectedScripts = [];
            
            if (script === 'both') {
                selectedScripts = ['hiragana', 'katakana'];
            } else {
                selectedScripts = [script];
            }
            
            document.querySelectorAll('.script-option').forEach(function(opt) {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            elements.scriptNextBtn.disabled = false;
        });
    }
    
    elements.scriptNextBtn.addEventListener('click', function() {
        localStorage.setItem('kana-selected-scripts', JSON.stringify(selectedScripts));
        renderRowSelection();
        switchView('rowSelection');
    });
    
    elements.rowNextBtn.addEventListener('click', function() {
        updateSelectedRows();
        if (Object.keys(selectedRows).length > 0 && 
            Object.values(selectedRows).some(function(arr) { return arr.length > 0; })) {
            renderOverview();
            switchView('overview');
        } else {
            showPopup('Please select at least one row to continue.', 'No Selection');
        }
    });
    
    elements.rowBackBtn.addEventListener('click', function() {
        switchView('scriptSelection');
    });
    
    elements.overviewBackBtn.addEventListener('click', function() {
        switchView('rowSelection');
    });
    
    elements.startQuizBtn.addEventListener('click', function() {
        isRetry = false;
        startQuiz();
    });

    elements.submitBtn.addEventListener('click', checkAnswer);
    
    elements.skipBtn.addEventListener('click', skipQuestion);
    
    elements.quizHomeBtn.addEventListener('click', returnHomeFromQuiz);
    
    elements.answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    elements.homeBtn.addEventListener('click', function() {
        switchView('scriptSelection');
        selectedScripts = [];
        selectedRows = {};
    });
    
    elements.retryBtn.addEventListener('click', function() {
        isRetry = true;
        startQuiz(mistakes);
    });

    elements.themeToggle.addEventListener('click', toggleDarkMode);
    
    elements.closeTutorialBtn.addEventListener('click', function() {
        elements.tutorialModal.classList.add('hidden');
        localStorage.setItem('kana-tutorial-seen', 'true');
    });

    elements.popupModal.addEventListener('click', function(e) {
        if (e.target === elements.popupModal) {
            hidePopup();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const popupHidden = elements.popupModal.classList.contains('hidden');
            if (!popupHidden) {
                if (currentConfirmCancel) {
                    currentConfirmCancel();
                }
                hidePopup();
                currentConfirmCancel = null;
            } else {
                const botHidden = elements.botHelper.classList.contains('hidden');
                if (!botHidden) {
                    hideBotHelper();
                }
            }
        }
    });

    elements.botClose.addEventListener('click', hideBotHelper);
}

function setupRowSelectionListeners() {
    const checkboxes = document.querySelectorAll('#row-selection-container input[type="checkbox"]');
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', function() {
            if (this.checked) {
                this.parentElement.classList.add('checked');
            } else {
                this.parentElement.classList.remove('checked');
            }
            updateSelectedRows();
        });
    }
    
    const selectAllBtns = document.querySelectorAll('.script-select-all');
    for (let i = 0; i < selectAllBtns.length; i++) {
        selectAllBtns[i].addEventListener('click', function() {
            const script = this.dataset.script;
            const selector = '#row-selection-container input[data-script="' + script + '"]';
            const checkboxes = document.querySelectorAll(selector);
            for (let j = 0; j < checkboxes.length; j++) {
                checkboxes[j].checked = true;
                checkboxes[j].parentElement.classList.add('checked');
            }
            updateSelectedRows();
        });
    }
    
    const clearAllBtns = document.querySelectorAll('.script-clear-all');
    for (let i = 0; i < clearAllBtns.length; i++) {
        clearAllBtns[i].addEventListener('click', function() {
            const script = this.dataset.script;
            const selector = '#row-selection-container input[data-script="' + script + '"]';
            const checkboxes = document.querySelectorAll(selector);
            for (let j = 0; j < checkboxes.length; j++) {
                checkboxes[j].checked = false;
                checkboxes[j].parentElement.classList.remove('checked');
            }
            updateSelectedRows();
        });
    }
}
