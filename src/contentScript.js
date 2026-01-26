/**
 * Content Script for F**k Neo
 * Handles autotype feature with toggle control
 * Includes question viewer for accessing test questions
 */

let autotypeEnabled = true;
let questionViewerEnabled = true;

// Get initial autotype status from storage
chrome.runtime.sendMessage({ action: 'getAutotypeStatus' }, (response) => {
    if (response) {
        autotypeEnabled = response.autotypeEnabled;
    }
});

// Get initial question viewer status from storage
chrome.runtime.sendMessage({ action: 'getQuestionViewerStatus' }, (response) => {
    if (response) {
        questionViewerEnabled = response.questionViewerEnabled;
    }
});

// Listen for autotype status changes
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'autotypeStatusChanged') {
        autotypeEnabled = request.enabled;
        console.log('[F**k Neo] Autotype feature:', autotypeEnabled ? 'enabled' : 'disabled');
    }
    
    if (request.action === 'questionViewerStatusChanged') {
        questionViewerEnabled = request.enabled;
        console.log('[F**k Neo] Question Viewer feature:', questionViewerEnabled ? 'enabled' : 'disabled');
    }
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (event) => {
    // Alt + T for autotype/autowrite
    if (event.altKey && event.key === 't') {
        event.preventDefault();
        if (autotypeEnabled) {
            handleAutotype();
        } else {
            showNotification('Autotype feature is disabled. Enable it in extension settings.');
        }
    }

    // Alt + Ctrl + S for auto submit
    if (event.altKey && event.ctrlKey && event.key === 's') {
        event.preventDefault();
        handleAutoSubmit();
    }

    // Alt + M for auto MCQ solver
    if (event.altKey && event.key === 'm') {
        event.preventDefault();
        handleAutoMCQ();
    }
});

/**
 * Handle autotype functionality
 * Types code into answer sections
 */
function handleAutotype() {
    console.log('[F**k Neo] Autotype triggered');
    
    // Find all code editors/answer sections
    const codeEditors = document.querySelectorAll(
        '[contenteditable="true"], textarea, .ace_editor, .monaco-editor'
    );

    if (codeEditors.length === 0) {
        showNotification('No code editor found on this page.');
        return;
    }

    // Get code from clipboard or show dialog
    navigator.clipboard.read().then((items) => {
        if (items.length > 0) {
            items[0].getType('text/plain').stream().then((stream) => {
                const reader = stream.getReader();
                let result = '';
                
                const readStream = () => {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            typeCodeInEditor(codeEditors[0], result);
                            return;
                        }
                        result += new TextDecoder().decode(value);
                        readStream();
                    });
                };
                readStream();
            });
        } else {
            showNotification('No code found in clipboard. Copy your code first!');
        }
    }).catch(() => {
        navigator.clipboard.readText().then((text) => {
            if (text) {
                typeCodeInEditor(codeEditors[0], text);
            } else {
                showNotification('Cannot access clipboard. Make sure to grant clipboard permissions.');
            }
        }).catch(() => {
            showNotification('Autotype requires clipboard access. Please grant the permission.');
        });
    });
}

/**
 * Type code into an editor element
 */
function typeCodeInEditor(editor, code) {
    if (editor.contentEditable === 'true') {
        // For contenteditable elements
        editor.textContent = code;
        editor.dispatchEvent(new Event('input', { bubbles: true }));
        editor.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (editor.tagName === 'TEXTAREA') {
        // For textarea elements
        editor.value = code;
        editor.dispatchEvent(new Event('input', { bubbles: true }));
        editor.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    showNotification('Code typed successfully!');
}

/**
 * Handle auto submit functionality
 */
function handleAutoSubmit() {
    console.log('[F**k Neo] Auto submit triggered');
    
    // Look for submit button
    const submitButton = document.querySelector(
        'button[type="submit"], [data-action="submit"], .submit-btn, #submit'
    );

    if (submitButton) {
        submitButton.click();
        showNotification('Code submitted!');
    } else {
        showNotification('Submit button not found.');
    }
}

/**
 * Handle auto MCQ solver functionality
 */
function handleAutoMCQ() {
    console.log('[F**k Neo] Auto MCQ solver triggered');
    
    const mcqItems = document.querySelectorAll(
        '[data-question], .question, .mcq-item'
    );

    if (mcqItems.length === 0) {
        showNotification('No MCQ questions found.');
        return;
    }

    // This is a placeholder - actual implementation would analyze questions
    showNotification(`Found ${mcqItems.length} MCQ items. Auto-solver would process them here.`);
}

/**
 * Show notification toast
 */
function showNotification(message) {
    const notificationId = 'fkneo-notification-' + Date.now();
    const notification = document.createElement('div');
    notification.id = notificationId;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

console.log('[F**k Neo] Content script loaded. Autotype:', autotypeEnabled ? 'enabled' : 'disabled');
