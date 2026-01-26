# F**k Neo - Autotype Toggle Feature Implementation

## Overview
This implementation adds a toggle switch to disable/enable the **autotype feature** in the F**k Neo browser extension, as requested in [Issue #22](https://github.com/ErrorxCode/FkNeo/issues/22).

## Files Created

### 1. **manifest.json** (`src/manifest.json`)
- Extension configuration file
- Version: 1.2.3 (with Autotype Toggle)
- Defines permissions, content scripts, and background service worker
- Uses Manifest V3 for modern Chrome extensions

### 2. **popup.html** (`src/popup.html`)
- User-facing settings interface
- Features:
  - Toggle switch for autotype feature control
  - Display of all keyboard shortcuts
  - Modern, gradient UI design
  - Informational box about the feature
  - Responsive design that works on all screen sizes

### 3. **popup.js** (`src/popup.js`)
- Handles popup interactivity
- Loads autotype status from storage on popup open
- Updates UI toggle when user clicks
- Communicates with background service worker via `chrome.runtime.sendMessage`

### 4. **background.js** (`src/background.js`)
- Service worker that manages extension-wide logic
- Initializes autotype setting as **enabled by default** on first install
- Handles inter-script communication
- Stores autotype state in Chrome's `storage.local` API
- Broadcasts status changes to all content scripts

### 5. **contentScript.js** (`src/contentScript.js`)
- Injects into examly.io pages
- Listens for keyboard shortcuts:
  - **Alt + T**: Autotype/Autowrite (respects toggle setting)
  - **Alt + Ctrl + S**: Auto Submit
  - **Alt + M**: Auto MCQ Solver
- Shows user-friendly notifications for actions
- Respects the autotype disable toggle:
  - If disabled: Shows notification instead of executing
  - If enabled: Performs autotype normally
- Handles clipboard access and code injection into editors

## How It Works

### User Flow:
1. **User opens extension popup** → Sees autotype toggle switch
2. **Toggle is enabled by default** → Green/active state
3. **User clicks toggle** → Feature is disabled
4. **Background worker updates storage** → Notifies all tabs
5. **Content scripts receive update** → Autotype becomes inactive
6. **User presses Alt+T** → Shows notification instead of typing code

### Technical Flow:
```
Popup UI (popup.js)
    ↓ (click event)
Background Worker (background.js)
    ↓ (chrome.storage.local.set)
Content Scripts (contentScript.js)
    ↓ (chrome.runtime.onMessage)
Handle Keyboard Shortcuts
    ↓ (check autotypeEnabled flag)
Either Execute or Show "Disabled" Message
```

## Default Behavior
- **Autotype is ENABLED by default** when the extension is first installed
- Users can toggle it off in the popup settings
- Setting persists across browser sessions (stored in local storage)

## Installation Instructions

1. **For Development:**
   ```bash
   # Navigate to chrome://extensions/
   # Enable "Developer mode" (top right)
   # Click "Load unpacked"
   # Select the /workspaces/FkNeo/src directory
   ```

2. **For Production:**
   - Package the `src/` directory as a `.zip` file
   - Upload to Chrome Web Store

## Testing Checklist

- [ ] Toggle switch appears in popup
- [ ] Clicking toggle changes the visual state
- [ ] Disabling autotype shows notification when Alt+T pressed
- [ ] Enabling autotype allows Alt+T to work normally
- [ ] Settings persist after browser restart
- [ ] All three shortcuts (Alt+T, Alt+Ctrl+S, Alt+M) work

## Keyboard Shortcuts

| Shortcut | Function | Respects Toggle |
|----------|----------|-----------------|
| `Alt + T` | Autowrite/Autotype code | ✅ Yes |
| `Alt + Ctrl + S` | Auto submit | ❌ No |
| `Alt + M` | Auto MCQ solver | ❌ No |

## Future Enhancements

- [ ] Add toggle for other features (auto-submit, auto-MCQ)
- [ ] Add settings page with more granular controls
- [ ] Add logging/debugging panel
- [ ] Add whitelist/blacklist for specific websites
- [ ] Add custom hotkey configuration
- [ ] Add statistics tracking

## Notes

- The extension respects user privacy by using local storage only
- No data is sent to external servers
- Compatible with Chrome, Edge, Brave, and Opera browsers
- Uses modern Manifest V3 API
