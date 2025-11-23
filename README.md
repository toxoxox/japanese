# KanaMaster - Japanese Kana Learning Application

## Overview

KanaMaster is a web-based educational application designed to help users learn and practice Japanese Kana characters (Hiragana and Katakana). The application provides an interactive quiz system where users can select specific kana groups to practice, test their knowledge by typing romaji (Romanized Japanese), and track their progress.

## Purpose

The application serves as a learning tool for:
- Beginners learning Japanese writing systems
- Students practicing kana recognition and romaji conversion
- Anyone wanting to improve their Japanese character recognition skills

## Core Functionality

### 1. Kana Selection System
- Users can select which kana rows/groups to practice from both Hiragana and Katakana scripts
- Kana are organized into three categories:
  - **Main Kana**: Basic characters (a, ka, sa, ta, na, ha, ma, ya, ra, wa)
  - **Dakuten**: Voiced characters with diacritical marks (ga, za, da, ba, pa)
  - **Combined**: Yōon (contracted sounds like kya, sha, cha, etc.)
- Users can select individual rows or use "All/None" buttons for quick selection
- Selected preferences are saved to localStorage

### 2. Quiz System
- Randomized quiz questions from selected kana groups
- Users type the romaji equivalent of displayed kana characters
- Multiple valid romaji forms are accepted (e.g., "shi" or "si" for し)
- Real-time feedback with correct/incorrect indicators
- Progress tracking with visual progress bar
- Question counter (e.g., "5 / 20")
- Skip functionality to move to next question
- Return home option with confirmation dialog

### 3. Results and Review
- Score calculation and accuracy percentage
- Statistics display (total items, mistakes count)
- Mistakes list showing incorrect answers with correct romaji
- Retry mistakes feature to practice only incorrect answers
- Visual feedback with color-coded results

### 4. User Interface Features
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Interactive Tutorial**: Bot helper (KanaBot) guides new users through the interface
- **Modal System**: Custom popup dialogs for notifications and confirmations
- **Visual Feedback**: Animations, hover effects, and transitions
- **Accessibility**: Keyboard navigation support, ARIA labels

## File Structure

```
japanese/
├── index.html      # Main HTML structure and layout
├── script.js       # All JavaScript functionality and logic
├── style.css       # All CSS styling and responsive design
├── data.js         # Kana character data (Hiragana and Katakana)
└── README.md       # This documentation file
```

## Technical Architecture

### HTML Structure (`index.html`)
- **Header**: Contains app title, theme toggle, and tutorial restart button
- **Main Container**: Three view sections:
  - `view-selection`: Kana selection interface
  - `view-quiz`: Quiz interface with question display
  - `view-results`: Results and statistics display
- **Modals**: Tutorial modal and popup modal for messages/confirmations
- **Bot Helper**: Interactive tutorial assistant component

### JavaScript Architecture (`script.js`)

#### State Management
- `quizPool`: Array of kana items for current quiz
- `currentIndex`: Current question index
- `score`: Number of correct answers
- `mistakes`: Array of incorrectly answered kana
- `isRetry`: Boolean flag for retry mode
- `botStep`: Current step in tutorial
- `currentConfirmCancel`: Callback for confirmation dialogs

#### Key Functions

**UI Rendering:**
- `renderSelectionUI()`: Creates checkbox buttons for all kana groups
- `renderKanaIntoSection()`: Categorizes and renders kana into appropriate sections
- `createCheckbox()`: Creates individual kana row checkbox elements

**Quiz Logic:**
- `startQuiz(customPool)`: Initializes quiz with selected or custom kana pool
- `showQuestion()`: Displays current question and updates progress
- `checkAnswer()`: Validates user input against correct romaji
- `skipQuestion()`: Skips current question and marks as mistake
- `finishQuiz()`: Calculates results and displays statistics

**Data Management:**
- `collectSelections()`: Gathers all selected kana from checkboxes
- `shuffle()`: Randomizes array order using Fisher-Yates algorithm
- `saveSelections()`: Persists checkbox states to localStorage
- `loadSettings()`: Restores saved preferences on page load

**View Management:**
- `switchView(viewName)`: Switches between selection, quiz, and results views

**Popup System:**
- `showPopup(message, title)`: Displays simple notification popup
- `showConfirmPopup(message, title, onConfirm, onCancel)`: Displays confirmation dialog
- `hidePopup()`: Closes popup modal

**Bot Helper:**
- `showBotHelper()`: Displays interactive tutorial
- `updateBotStep()`: Updates tutorial step and highlights elements
- `highlightElement(selector)`: Highlights specific page elements
- `highlightMultipleElements(selector)`: Highlights multiple elements

### Data Structure (`data.js`)

The `KANA_DATA` object contains all kana characters organized by script type:

```javascript
KANA_DATA = {
    hiragana: {
        [rowKey]: [
            { char: 'あ', romaji: ['a'] },
            { char: 'い', romaji: ['i'] },
            // ... more characters
        ],
        // ... more rows
    },
    katakana: {
        // Same structure as hiragana
    }
}
```

**Kana Categories:**
- **Main Kana**: `a, ka, sa, ta, na, ha, ma, ya, ra, wa`
- **Dakuten**: `ga, za, da, ba, pa`
- **Combined (Yōon)**: `kya, sha, cha, nya, hya, mya, rya, gya, ja, bya, pya`

### CSS Architecture (`style.css`)

**Design System:**
- CSS custom properties (variables) for theming
- Dark mode support via `body.dark-mode` class
- Responsive breakpoints at 768px and 600px
- Modern card-based layout with shadows and hover effects

**Key Components:**
- `.card`: Main content containers
- `.kana-section`: Individual kana category cards
- `.checkbox-grid`: Grid layout for kana selection buttons
- `.group-header`: Gradient headers for script groups
- `.modal`: Overlay modals for popups
- `.bot-helper`: Tutorial assistant component

## User Flow

1. **Initial Load**: 
   - Tutorial modal appears (first visit only)
   - Bot helper appears after 1 second (first visit only)
   - Saved preferences are restored

2. **Selection Phase**:
   - User selects kana rows from Main Kana, Dakuten, or Combined sections
   - Can use "All/None" buttons for quick selection
   - Selections are saved automatically

3. **Quiz Phase**:
   - User clicks "Start Quiz"
   - Questions appear one at a time
   - User types romaji and submits or skips
   - Progress bar and counter update
   - Feedback shown after each answer

4. **Results Phase**:
   - Score and statistics displayed
   - Mistakes listed with correct answers
   - Option to retry mistakes or return home

## Key Features Explained

### Multiple Romaji Support
The application accepts multiple valid romaji forms. For example:
- し can be answered as "shi" or "si"
- つ can be answered as "tsu" or "tu"
- じ can be answered as "ji" or "zi"

### LocalStorage Persistence
- Dark mode preference
- Selected kana rows
- Tutorial completion status
- Bot helper completion status

### Responsive Design
- Desktop: Two-column layout for Hiragana/Katakana
- Tablet (≤768px): Single column, adjusted spacing
- Mobile (≤600px): Compact layout, smaller grid items

### Accessibility
- Keyboard navigation (Enter to submit, Escape to close modals)
- ARIA labels on icon buttons
- Semantic HTML structure
- Focus management

## Browser Compatibility

- Modern browsers with ES6+ support
- localStorage API required
- CSS Grid and Flexbox support needed
- No external dependencies (vanilla JavaScript)

## Development Notes

- No build process required - pure HTML/CSS/JavaScript
- No external libraries or frameworks
- All code is commented-free (as per project requirements)
- Beginner-friendly code style with explicit variable names and clear function structure

## Future Enhancement Possibilities

- User accounts and progress tracking
- Spaced repetition algorithm
- Audio pronunciation
- Stroke order animations
- Statistics and analytics
- Custom quiz creation
- Export/import progress

