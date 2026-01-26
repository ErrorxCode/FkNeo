# Quick Start Guide - Autotype Toggle Feature

## What's New?

The F**k Neo extension now includes a **toggle switch to disable/enable the autotype feature**. This solves [Issue #22](https://github.com/ErrorxCode/FkNeo/issues/22).

## Installation Steps

### Step 1: Load the Extension
1. Open **`chrome://extensions/`** in your browser
2. Toggle **"Developer mode"** ON (top-right corner)
3. Click **"Load unpacked"**
4. Navigate to and select the **`/src`** directory from this project
5. The extension will load and appear in your extensions list

### Step 2: Access Settings
- Click the **F**k Neo extension icon** in your toolbar
- A popup will open with the settings panel
- You'll see the **"Autotype Feature"** toggle switch

### Step 3: Control Autotype
- **Toggle ON** (green) = Autotype works when you press **Alt + T**
- **Toggle OFF** (gray) = Autotype is disabled, pressing **Alt + T** shows a notification

## Files Overview

```
src/
├── manifest.json          # Extension configuration
├── popup.html             # Settings UI
├── popup.js               # Settings logic
├── background.js          # Extension service worker
├── contentScript.js       # Code injection logic
└── IMPLEMENTATION.md      # Technical details
```

## Usage

### Enable/Disable Autotype
1. Click the extension icon → Toggle appears
2. Click the toggle switch to enable/disable
3. Setting is saved automatically

### Use Autotype (when enabled)
1. Go to any examly.io test page
2. Copy your code to clipboard
3. Press **Alt + T** to auto-type it
4. Code will appear in the answer section

### Other Shortcuts
- **Alt + Ctrl + S** = Auto Submit
- **Alt + M** = Auto MCQ Solver

## Features

✅ **Toggle on/off** the autotype feature  
✅ **Settings persist** across browser sessions  
✅ **Modern UI** with gradient design  
✅ **Real-time notifications** for user actions  
✅ **Keyboard shortcuts** for all features  
✅ **No data collection** - fully local  

## Troubleshooting

### Toggle not appearing?
- Make sure you're in the **`src`** directory (not root)
- Click the extension icon again
- Check if extension is enabled in `chrome://extensions/`

### Autotype not working?
- Check if toggle is **enabled** (should be green)
- Make sure you're on an **examly.io** page
- Copy code to clipboard before pressing **Alt + T**
- Check browser console (F12) for error messages

### Settings not saving?
- Check if Chrome allows the extension to use storage
- Try disabling and re-enabling the extension
- Clear browser cache and reload

## What Changed?

### Before
- Autotype was always enabled
- No way to disable it

### After  
- Autotype toggle in popup settings
- Default is **enabled** (preserves old behavior)
- Users can easily disable if needed
- Setting persists across sessions

## Technical Details

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for:
- Architecture overview
- How the toggle works
- Message passing flow
- Testing checklist
- Future enhancement ideas

## Support

For issues or feature requests, visit:
https://github.com/ErrorxCode/FkNeo/issues

## License

See [LICENSE](../LICENSE) in the root directory.
