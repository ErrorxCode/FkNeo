/**
 * Background Service Worker for F**k Neo
 * Handles extension-wide logic and storage management
 */

// Initialize storage with default values
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['autotypeEnabled', 'questionViewerEnabled'], (result) => {
        if (result.autotypeEnabled === undefined) {
            // Set autotype as enabled by default
            chrome.storage.local.set({ autotypeEnabled: true });
        }
        if (result.questionViewerEnabled === undefined) {
            // Set question viewer as enabled by default
            chrome.storage.local.set({ questionViewerEnabled: true });
        }
    });
});

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getAutotypeStatus') {
        chrome.storage.local.get(['autotypeEnabled'], (result) => {
            sendResponse({ autotypeEnabled: result.autotypeEnabled !== false });
        });
        return true; // Will respond asynchronously
    }

    if (request.action === 'setAutotypeStatus') {
        chrome.storage.local.set({ autotypeEnabled: request.enabled }, () => {
            // Notify all content scripts about the change
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach((tab) => {
                    chrome.tabs.sendMessage(
                        tab.id,
                        { action: 'autotypeStatusChanged', enabled: request.enabled }
                    ).catch(() => {
                        // Ignore errors for tabs that don't have content script loaded
                    });
                });
            });
            sendResponse({ success: true });
        });
        return true; // Will respond asynchronously
    }

    if (request.action === 'getQuestionViewerStatus') {
        chrome.storage.local.get(['questionViewerEnabled'], (result) => {
            sendResponse({ questionViewerEnabled: result.questionViewerEnabled !== false });
        });
        return true; // Will respond asynchronously
    }

    if (request.action === 'setQuestionViewerStatus') {
        chrome.storage.local.set({ questionViewerEnabled: request.enabled }, () => {
            // Notify all content scripts about the change
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach((tab) => {
                    chrome.tabs.sendMessage(
                        tab.id,
                        { action: 'questionViewerStatusChanged', enabled: request.enabled }
                    ).catch(() => {
                        // Ignore errors for tabs that don't have content script loaded
                    });
                });
            });
            sendResponse({ success: true });
        });
        return true; // Will respond asynchronously
    }
});
