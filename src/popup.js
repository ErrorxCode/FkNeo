/**
 * Popup script for F**k Neo settings panel
 * Handles toggle switches for autotype and question viewer features
 */

const autotypeToggle = document.getElementById('autotypeToggle');
const questionViewerToggle = document.getElementById('questionViewerToggle');

// Load current status when popup opens
document.addEventListener('DOMContentLoaded', () => {
    // Load autotype status
    chrome.runtime.sendMessage({ action: 'getAutotypeStatus' }, (response) => {
        if (response) {
            updateToggleUI(autotypeToggle, response.autotypeEnabled);
        }
    });

    // Load question viewer status
    chrome.runtime.sendMessage({ action: 'getQuestionViewerStatus' }, (response) => {
        if (response) {
            updateToggleUI(questionViewerToggle, response.questionViewerEnabled);
        }
    });
});

// Handle autotype toggle click
autotypeToggle.addEventListener('click', () => {
    chrome.storage.local.get(['autotypeEnabled'], (result) => {
        const newState = !result.autotypeEnabled;
        
        chrome.runtime.sendMessage(
            { action: 'setAutotypeStatus', enabled: newState },
            (response) => {
                if (response && response.success) {
                    updateToggleUI(autotypeToggle, newState);
                }
            }
        );
    });
});

// Handle question viewer toggle click
questionViewerToggle.addEventListener('click', () => {
    chrome.storage.local.get(['questionViewerEnabled'], (result) => {
        const newState = !result.questionViewerEnabled;
        
        chrome.runtime.sendMessage(
            { action: 'setQuestionViewerStatus', enabled: newState },
            (response) => {
                if (response && response.success) {
                    updateToggleUI(questionViewerToggle, newState);
                }
            }
        );
    });
});

/**
 * Update toggle UI based on state
 */
function updateToggleUI(toggleElement, enabled) {
    if (enabled) {
        toggleElement.classList.add('enabled');
    } else {
        toggleElement.classList.remove('enabled');
    }
}
