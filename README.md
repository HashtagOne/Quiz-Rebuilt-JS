# Quiz App

A browser-based quiz single page application built with vanilla JavaScript, HTML, and CSS. 
Rebuilt from a Python terminal app into a fully interactive web experience.

## Features

### Core Functionality
- Multi-topic quiz selection across Science and Social Sciences
- Dynamic subtopic generation based on selected topic
- Randomized question order on every playthrough
- Case-insensitive answer validation
- Real-time feedback on correct and incorrect answers
- Progress tracking displayed throughout the quiz

### User Experience
- Credential validation with name and age verification
- Personalized dialogue sequence on successful login
- Smooth staggered screen transitions with fade animations
- Single Page Application — no page reloads throughout the entire experience

### Data & Persistence
- Client-side score persistence via localStorage
- Ranked leaderboard per subtopic, sorted highest to lowest
- Duplicate save prevention
- Scores persist across sessions without a backend

### Session Management
- Full session state reset on Play Again
- Returns to topic selection without re-entering credentials

## Built With

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

## What I Learned

- DOM manipulation and dynamic content rendering
- Event-driven programming model
- Client-side data persistence with localStorage
- Async/await for sequenced animations and transitions
- CSS specificity and the separation of display control between JS and CSS
- Debugging in a live browser environment
