# Visual Guide - Autotype Toggle Feature

## Extension Popup UI

```
┌─────────────────────────────────────────────┐
│                                             │
│    F**k Neo Settings                        │
│    Control your extension features          │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│   Autotype Feature                    [ON]  │
│   Auto-type code in answer sections         │
│                                             │
├─────────────────────────────────────────────┤
│   Keyboard Shortcuts                        │
│                                             │
│   → Autowrite Code       Alt + T            │
│   → Auto Submit          Alt + Ctrl + S     │
│   → Auto MCQ Solver      Alt + M            │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│   ℹ️  Disable the autotype feature if you   │
│   want to manually control when code is     │
│   typed.                                    │
│                                             │
├─────────────────────────────────────────────┤
│   F**k Neo v1.2.3                           │
│   Autotype Toggle Edition                   │
│                                             │
└─────────────────────────────────────────────┘
```

## Toggle Switch States

### Enabled (ON) - Default
```
┌────────────────────────────────────┐
│ Autotype Feature              [●——] │  ← Green
│ Auto-type code in sections          │
└────────────────────────────────────┘
```
**Status**: Autotype active  
**Alt+T**: Works normally  
**User Action**: Code gets typed automatically  

### Disabled (OFF)
```
┌────────────────────────────────────┐
│ Autotype Feature              [——●] │  ← Gray
│ Auto-type code in sections          │
└────────────────────────────────────┘
```
**Status**: Autotype inactive  
**Alt+T**: Shows notification  
**User Action**: "Autotype feature is disabled"  

## User Flow Diagram

### Scenario 1: First Use
```
┌──────────────────┐
│  Install & Open  │  → Extension loads
│                  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Check Storage for autotype      │
│  NOT FOUND                       │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Set autotype = true (default)   │
│  Save to chrome.storage.local    │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Show Popup with Toggle ON       │ ✅
│  User can now toggle it          │
└──────────────────────────────────┘
```

### Scenario 2: User Disables Autotype
```
┌──────────────────┐
│ Click Extension  │
│     Icon         │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Popup Opens                     │
│  Toggle is ON (green)            │
└────────┬─────────────────────────┘
         │ (User clicks toggle)
         ▼
┌──────────────────────────────────┐
│  popup.js sends message to       │
│  background service worker       │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  background.js updates storage   │
│  autotype = false                │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  background.js sends message to  │
│  all content scripts             │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  contentScript.js updates local  │
│  autotypeEnabled = false         │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Toggle switches to OFF (gray)   │
│  Setting is SAVED                │ ✅
└──────────────────────────────────┘
```

### Scenario 3: User Presses Alt+T
```
┌──────────────────┐
│  User Presses    │
│    Alt + T       │
└────────┬─────────┘
         │
         ▼
    ┌────────────────────┐
    │ contentScript.js   │
    │ Keyboard handler   │
    │ triggered          │
    └────────┬───────────┘
             │
         ┌───▼───────────────────┐
         │ Is autotype enabled?  │
         └───┬─────────┬─────────┘
             │         │
      YES   │         │   NO
            ▼         ▼
    ┌──────────┐  ┌─────────────────┐
    │  Execute │  │ Show Notification
    │ Autotype │  │ "Feature Disabled"
    │          │  │                  
    │ Type code│  │ Alert user about │
    │ in editor│  │ disabled feature  
    └──────────┘  └─────────────────┘
         │               │
         ▼               ▼
    ✅ Code typed   ℹ️ User notified
```

## Message Flow Sequence

```
Extension Lifecycle:
─────────────────────

  INSTALL
    │
    ▼
  background.js
  chrome.runtime.onInstalled
    │
    ├─→ Check storage for 'autotypeEnabled'
    │
    └─→ If not found: Set to TRUE (default)
           │
           └─→ chrome.storage.local.set({ autotypeEnabled: true })
                  │
                  ▼
                  READY FOR USE

─────────────────────

  USER OPENS POPUP
    │
    ▼
  popup.js
  DOMContentLoaded event
    │
    └─→ Send: { action: 'getAutotypeStatus' }
           │
           ▼
        background.js
        chrome.runtime.onMessage
           │
           └─→ Read from storage
                  │
                  └─→ Send back: { autotypeEnabled: true }
                     │
                     ▼
                  popup.js
                  Update toggle UI

─────────────────────

  USER CLICKS TOGGLE
    │
    ▼
  popup.js
  toggle.addEventListener('click')
    │
    └─→ Send: { action: 'setAutotypeStatus', enabled: false }
           │
           ▼
        background.js
        chrome.runtime.onMessage
           │
           ├─→ Save to storage
           │
           ├─→ Get all tabs
           │
           └─→ Send to each tab:
                  { action: 'autotypeStatusChanged', enabled: false }
                     │
                     ▼
                  contentScript.js
                  chrome.runtime.onMessage
                     │
                     └─→ Update local flag:
                        autotypeEnabled = false

─────────────────────

  USER PRESSES Alt+T
    │
    ▼
  contentScript.js
  keydown event listener
    │
    └─→ Check: if (autotypeEnabled)
        │
        ├─→ YES: handleAutotype()
        │        └─→ Type code
        │
        └─→ NO: showNotification('disabled')
               └─→ Show alert to user
```

## Data Flow Diagram

```
                      POPUP.HTML
                         │
                         │ (User clicks)
                         ▼
                      POPUP.JS
                         │
                         │ (sendMessage)
                         ▼
                   BACKGROUND.JS
                      │       │
                      │       └─→ chrome.storage.local
                      │           (read/write)
                      │
                      │ (sendMessage to all tabs)
                      ▼
                  CONTENTSCRIPT.JS
                      │
                      │ (checks autotypeEnabled)
                      │
                      ├─→ Alt+T pressed
                      │   └─→ If enabled: Type code
                      │   └─→ If disabled: Show notification
                      │
                      ├─→ Alt+Ctrl+S pressed
                      │   └─→ Auto submit
                      │
                      └─→ Alt+M pressed
                          └─→ Auto MCQ
```

## UI Component States

### Toggle Switch Transitions

```
Initial State (First Install)
┌───────────────────┐
│ Autotype Feature  │ [●————]  ← Enabled (green)
└───────────────────┘
     Default: ON

User clicks once:
┌───────────────────┐
│ Autotype Feature  │ [————●]  ← Disabled (gray)
└───────────────────┘
     State: OFF

User clicks again:
┌───────────────────┐
│ Autotype Feature  │ [●————]  ← Enabled (green)
└───────────────────┘
     State: ON
```

## Error Handling Flow

```
User Presses Alt+T
    │
    ▼
contentScript.js
    │
    ├─→ Check if editor found
    │   │
    │   └─→ NOT FOUND: Show notification
    │                  "No code editor found"
    │
    ├─→ Try to read clipboard
    │   │
    │   └─→ FAIL: Show notification
    │            "Clipboard access denied"
    │
    └─→ Type code in editor
        │
        └─→ SUCCESS: Show notification
                     "Code typed successfully!"
```

## Settings Persistence

```
Timeline: Browser Restart Cycle

Day 1 - 10:00 AM
┌──────────────────────────┐
│ Install Extension        │
│ autotypeEnabled = true   │  ← Default
└──────┬───────────────────┘
       │
       ▼
User disables toggle
┌──────────────────────────┐
│ autotypeEnabled = false  │
│ Saved to storage         │  ← Persisted
└──────┬───────────────────┘
       │
       ▼
Close Browser
┌──────────────────────────┐
│ All data in memory lost  │
│ Storage on disk intact   │  ← Persistent
└──────────────────────────┘

Day 1 - 3:00 PM
┌──────────────────────────┐
│ Reopen Browser           │
│ Load extension           │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Read from storage:       │
│ autotypeEnabled = false  │  ← Restored!
└──────────────────────────┘
       │
       ▼
Popup shows toggle OFF
┌──────────────────────────┐
│ User setting preserved   │  ✅
│ across sessions          │
└──────────────────────────┘
```

---

This visual guide helps understand the complete flow of the autotype toggle feature!
