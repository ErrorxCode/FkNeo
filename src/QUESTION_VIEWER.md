# Question Viewer Feature Documentation

## Overview

The Question Viewer is a powerful feature that allows users to view test questions **without attempting the test** or **after the test time period has expired**. This solves [Issue #17](https://github.com/ErrorxCode/FkNeo/issues/17).

## Problem It Solves

**Before:**
- Users could only view questions during the active test window
- After the test time expired, questions were inaccessible
- Reviewing test questions was not possible without attempting the test

**After:**
- Users can view questions anytime (before, during, or after the test)
- A floating "View Questions" button appears on test pages
- Questions are displayed in an organized sidebar or modal
- No time restrictions apply to viewing

## Features

### Core Features
✅ **View all questions** on any test page  
✅ **Floating action button** ("📋 View Questions")  
✅ **Questions sidebar** with quick navigation  
✅ **Modal popups** for detailed question viewing  
✅ **Option panels** showing all answer choices  
✅ **Real-time access** bypassing time restrictions  
✅ **Persistent toggle** in extension settings  

### How It Works

1. **Detection**: Automatically detects when on examly.io test pages
2. **Bypass**: Overrides CSS hiding and access control APIs
3. **Display**: Shows questions in a user-friendly interface
4. **Navigation**: Click any question to view details in a modal

### User Interface

#### Floating Button
```
┌─────────────────────┐
│ 📋 View Questions   │  ← Appears bottom-right
└─────────────────────┘
```

#### Questions Sidebar (when clicked)
```
┌──────────────────────────────────┐
│ Questions (12)            ×      │
├──────────────────────────────────┤
│ Q1: What is React?               │
│ Q2: Explain hooks...             │
│ Q3: What is JSX?                 │
│ Q4: Component lifecycle...       │
│ ... (all questions)              │
└──────────────────────────────────┘
```

#### Question Modal (detailed view)
```
┌─────────────────────────────────────────┐
│ Question 3                            × │
├─────────────────────────────────────────┤
│                                         │
│ What is the purpose of React hooks?     │
│                                         │
│ Options:                                │
│ ─────────────────────────────────────   │
│ A. Manage state in functional components│
│ B. Only for class components            │
│ C. Replace lifecycle methods     ✓      │
│ D. Not recommended to use               │
│                                         │
│ ┌─────────────────────────────┐         │
│ │ Close                       │         │
│ └─────────────────────────────┘         │
└─────────────────────────────────────────┘
```

## Technical Implementation

### File Structure
```
questionViewer.js
├── QuestionViewer object
├── bypassQuestionHiding() - Override CSS restrictions
├── enableQuestionNavigation() - Enable button clicks
├── displayQuestion() - Show individual questions
├── showAllQuestions() - Display sidebar with all questions
├── showQuestionModal() - Detailed modal view
├── interceptQuestionAPIs() - Bypass API calls
└── addQuestionViewerUI() - Add floating button
```

### How It Bypasses Restrictions

1. **CSS Override**
   - Finds elements hidden with `display: none`
   - Adds `!important` styles to force visibility
   - Removes locked/hidden classes

2. **API Interception**
   - Intercepts `fetch()` calls to test APIs
   - Bypasses access check endpoints
   - Returns success for test status queries

3. **Event Handling**
   - Enables disabled buttons
   - Adds click handlers to question elements
   - Allows navigation between questions

### Code Structure

```javascript
const QuestionViewer = {
    config: { enabled: true, showNotifications: true },
    
    init() { /* Initialize module */ },
    setupQuestionAccess() { /* Main setup */ },
    bypassQuestionHiding() { /* CSS overrides */ },
    enableQuestionNavigation() { /* Button/link enabling */ },
    displayQuestion(element) { /* Show single question */ },
    showAllQuestions() { /* Show questions list */ },
    showQuestionModal(id, content) { /* Detailed modal */ },
    interceptQuestionAPIs() { /* API bypassing */ },
    addQuestionViewerUI() { /* Floating button */ },
    showNotification(message) { /* User feedback */ }
};
```

## Usage

### For Users

1. **Enable the Feature**
   - Open extension popup
   - Toggle "Question Viewer" ON (green)

2. **View Questions**
   - Go to any examly.io test page
   - Click "📋 View Questions" button (bottom-right)
   - Questions sidebar appears with all available questions

3. **See Details**
   - Click any question in the sidebar
   - Modal opens with full question text and answer options
   - Click "Close" to dismiss

### Example Workflow

```
┌─────────────────────────────────────────────┐
│ 1. User goes to examly.io test page        │
└────────────────────┬────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│ 2. Floating button appears (bottom-right)   │
│    "📋 View Questions"                      │
└────────────────────┬────────────────────────┘
                     │
                     ▼ (User clicks button)
┌─────────────────────────────────────────────┐
│ 3. Questions sidebar appears (right side)   │
│    Shows: Q1, Q2, Q3, ... Q12               │
└────────────────────┬────────────────────────┘
                     │
                     ▼ (User clicks Q3)
┌─────────────────────────────────────────────┐
│ 4. Question 3 modal opens                   │
│    Shows full question + all options        │
└─────────────────────────────────────────────┘
```

## Settings Integration

### In Popup Settings
```
Settings Panel
├─ Autotype Feature        [●——]  Enable/Disable
│
└─ Question Viewer         [●——]  Enable/Disable
   "View questions without attempting the test"
```

### Storage
```javascript
chrome.storage.local = {
    autotypeEnabled: true,
    questionViewerEnabled: true  // New
}
```

## Configuration

### Enable/Disable Per Feature
- Users can toggle via extension popup
- Settings persist across sessions
- Changes apply immediately to all tabs

### Customize Behavior
Edit `questionViewer.js` config:
```javascript
config: {
    enabled: true,                  // Master on/off
    showNotifications: true,        // Show alerts
    autoExpandQuestions: true,      // Auto-expand all
    preserveFormatting: true        // Keep HTML formatting
}
```

## Message Flow

```
popup.js (user toggles Question Viewer)
    ↓ (chrome.runtime.sendMessage)
background.js (setQuestionViewerStatus)
    ↓ (chrome.storage.local.set)
    ↓ (broadcast to all tabs)
contentScript.js (questionViewerStatusChanged)
    ↓ (updates questionViewerEnabled flag)
questionViewer.js (checks flag before showing UI)
```

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Primary target |
| Edge | ✅ Full | Manifest V3 compatible |
| Brave | ✅ Full | Works normally |
| Opera | ✅ Full | Manifest V3 compatible |

## Security & Privacy

✅ **No external APIs** - Works entirely on-device  
✅ **No data collection** - Only reads from page  
✅ **No server communication** - Everything is local  
✅ **CSS + API bypassing** - Safe technique  
✅ **User controlled** - Can be toggled off anytime  

## Limitations & Considerations

### Limitations
- Only works on examly.io pages
- Requires JavaScript enabled
- Some question formatting might be lost
- Dynamic questions may not load properly

### Considerations
- Platform might detect the bypass
- Use responsibly - this is for learning
- Not intended for unauthorized access
- Respect academic integrity policies

## Troubleshooting

### Q: Button not appearing?
**A**: 
1. Make sure you're on an examly.io page
2. Toggle "Question Viewer" ON in popup
3. Refresh the page
4. Check if extension is enabled

### Q: Questions not showing?
**A**:
1. The page might have no questions loaded
2. Questions might be in a different format
3. Try refreshing the page
4. Check browser console (F12) for errors

### Q: Getting access denied error?
**A**:
1. The server might be blocking the bypass
2. Try with a different test/course
3. The platform may have added new restrictions
4. Report issue if persistent

### Q: Settings not saving?
**A**:
1. Check if extension has storage permission
2. Try disabling/re-enabling extension
3. Clear browser cache
4. Check chrome:// extension settings

## Future Enhancements

Possible improvements:
- [ ] Export questions as PDF
- [ ] Download questions as text
- [ ] Search/filter questions
- [ ] Bookmark favorite questions
- [ ] Add notes to questions
- [ ] Support more platforms
- [ ] Better formatting preservation
- [ ] Question statistics

## API Methods

### Main Module Methods
```javascript
QuestionViewer.init()                    // Initialize module
QuestionViewer.setupQuestionAccess()    // Setup access
QuestionViewer.displayQuestion(element) // Show question modal
QuestionViewer.showAllQuestions()       // Show questions sidebar
QuestionViewer.bypassQuestionHiding()   // Override CSS
QuestionViewer.enableQuestionNavigation()// Enable buttons
QuestionViewer.interceptQuestionAPIs()  // Bypass API calls
QuestionViewer.addQuestionViewerUI()    // Add floating button
QuestionViewer.showNotification(msg)    // Show alert
```

### External API Calls
```javascript
chrome.storage.local.get(['questionViewerEnabled'])
chrome.storage.local.set({ questionViewerEnabled: true })
chrome.runtime.sendMessage({ action: 'getQuestionViewerStatus' })
chrome.runtime.sendMessage({ action: 'setQuestionViewerStatus', enabled: true })
```

## Development Notes

### Adding Question Detection
To add custom question selectors:
```javascript
// In bypassQuestionHiding()
const customSelectors = [
    '[data-custom-question]',
    '.my-question-class',
    '#question-wrapper'
];
```

### Modifying UI
To customize the floating button:
```javascript
// In addQuestionViewerUI()
button.style.bottom = '50px';  // Change position
button.style.backgroundColor = '#your-color';
button.textContent = 'Your text';  // Change label
```

### Debugging
Enable console logging:
```javascript
console.log('[F**k Neo] Question Viewer:', message);
```

## Related Issues

- **#17**: Feature request for question viewing
- **#22**: Autotype toggle feature (separate)
- **#23**: Pull request implementing both features

## References

- Issue: https://github.com/ErrorxCode/FkNeo/issues/17
- Pull Request: https://github.com/ErrorxCode/FkNeo/pull/23

## Support

For issues or questions about the Question Viewer feature:
1. Check this documentation
2. Open an issue on GitHub
3. Provide reproduction steps
4. Include browser and extension version

---

**Feature Added**: January 26, 2026  
**Version**: 1.2.4  
**Status**: Complete & Ready for Use
