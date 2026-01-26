/**
 * Popup script for F**k Neo settings panel
 * Handles toggle switch for autotype feature
 */

const autotypeToggle = document.getElementById('autotypeToggle');

// Load current autotype status when popup opens
document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: 'getAutotypeStatus' }, (response) => {
        if (response) {
            updateToggleUI(response.autotypeEnabled);
        }
    });
});

// Handle toggle click
autotypeToggle.addEventListener('click', () => {
    chrome.storage.local.get(['autotypeEnabled'], (result) => {
        const newState = !result.autotypeEnabled;
        
        chrome.runtime.sendMessage(
            { action: 'setAutotypeStatus', enabled: newState },
            (response) => {
                if (response && response.success) {
                    updateToggleUI(newState);
                }
            }
        );
    });
});

/**
 * Update toggle UI based on state
 */
function updateToggleUI(enabled) {
    if (enabled) {
        autotypeToggle.classList.add('enabled');
    } else {
        autotypeToggle.classList.remove('enabled');
    }
}
