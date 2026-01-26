/**
 * Question Viewer Module
 * Allows users to view test questions without attempting the test
 * Bypasses time restrictions and question access controls
 */

const QuestionViewer = {
    // Configuration
    config: {
        enabled: true,
        showNotifications: true,
        autoExpandQuestions: true,
        preserveFormatting: true
    },

    // Initialize the module
    init() {
        if (!this.config.enabled) return;
        
        console.log('[F**k Neo] Question Viewer initialized');
        
        // Wait for page to fully load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupQuestionAccess());
        } else {
            this.setupQuestionAccess();
        }
    },

    /**
     * Main function to enable question viewing
     */
    setupQuestionAccess() {
        // Bypass question visibility restrictions
        this.bypassQuestionHiding();
        
        // Enable question navigation
        this.enableQuestionNavigation();
        
        // Add question viewer UI
        this.addQuestionViewerUI();
        
        // Intercept API calls that restrict question access
        this.interceptQuestionAPIs();
        
        console.log('[F**k Neo] Question access enabled');
    },

    /**
     * Bypass CSS hiding and display restrictions on questions
     */
    bypassQuestionHiding() {
        // Remove common question hiding classes
        const hidingSelectors = [
            '[style*="display:none"]',
            '[style*="display: none"]',
            '.question-hidden',
            '.hidden',
            '[hidden]',
            '.locked-question',
            '.disabled-question'
        ];

        // Create CSS override
        const style = document.createElement('style');
        style.textContent = `
            [style*="display:none"],
            [style*="display: none"],
            .question-hidden,
            .locked-question,
            .disabled-question {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
            
            .question-container,
            .exam-question,
            .test-question {
                display: block !important;
                pointer-events: auto !important;
            }
            
            .question-lock,
            .test-lock,
            .access-denied {
                display: none !important;
            }
            
            button:disabled[data-question],
            a:disabled[data-question] {
                pointer-events: auto !important;
                opacity: 1 !important;
                cursor: pointer !important;
            }
        `;
        document.head.appendChild(style);

        // Remove inline style restrictions
        document.querySelectorAll('[style*="display:none"], [style*="display: none"]').forEach(el => {
            el.style.display = 'block';
            el.style.visibility = 'visible';
            el.style.opacity = '1';
        });
    },

    /**
     * Enable question navigation and selection
     */
    enableQuestionNavigation() {
        // Enable all disabled buttons related to questions
        document.querySelectorAll('button[data-question], button.question-btn, button.next-question, button.prev-question').forEach(btn => {
            btn.disabled = false;
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        });

        // Enable question links
        document.querySelectorAll('a[data-question], a.question-link').forEach(link => {
            link.style.pointerEvents = 'auto';
            link.style.opacity = '1';
            link.onclick = null;
            link.style.cursor = 'pointer';
        });

        // Add click handlers for question panels
        document.querySelectorAll('.question-item, .question-panel, [data-question-id]').forEach(el => {
            if (!el.hasClickHandler) {
                el.addEventListener('click', (e) => this.displayQuestion(e.currentTarget));
                el.hasClickHandler = true;
            }
        });
    },

    /**
     * Display a specific question
     */
    displayQuestion(questionElement) {
        if (!questionElement) return;

        const questionId = questionElement.getAttribute('data-question-id') || 
                          questionElement.getAttribute('data-question') ||
                          questionElement.textContent.match(/\d+/)?.[0];

        if (questionId) {
            const questionContent = this.extractQuestionContent(questionElement);
            this.showQuestionModal(questionId, questionContent);
        }
    },

    /**
     * Extract question content from the element
     */
    extractQuestionContent(element) {
        return {
            id: element.getAttribute('data-question-id') || 'Unknown',
            text: element.querySelector('.question-text, .question-content, p')?.textContent || element.textContent,
            options: Array.from(element.querySelectorAll('.option, .choice, [data-option]')).map(opt => ({
                id: opt.getAttribute('data-option'),
                text: opt.textContent.trim(),
                selected: opt.classList.contains('selected')
            })),
            html: element.innerHTML
        };
    },

    /**
     * Show question in a modal overlay
     */
    showQuestionModal(id, content) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('fkneo-question-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'fkneo-question-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            `;
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.style.display = 'none';
            });
            document.body.appendChild(modal);
        }

        // Create modal content
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 700px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333;">Question ${id}</h2>
                    <button onclick="this.closest('#fkneo-question-modal').style.display='none'" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #999;
                    ">×</button>
                </div>
                
                <div style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                    ${content.text}
                </div>
                
                ${content.options.length > 0 ? `
                    <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
                        <h4 style="color: #666; margin-top: 0;">Options:</h4>
                        ${content.options.map((opt, idx) => `
                            <div style="
                                padding: 12px;
                                margin: 10px 0;
                                border: 1px solid #ddd;
                                border-radius: 6px;
                                background: ${opt.selected ? '#e3f2fd' : '#fff'};
                                cursor: pointer;
                            ">
                                <strong>${String.fromCharCode(65 + idx)}.</strong> ${opt.text}
                                ${opt.selected ? '<span style="color: green; margin-left: 10px;">✓ Selected</span>' : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div style="margin-top: 20px; text-align: right;">
                    <button onclick="this.closest('#fkneo-question-modal').style.display='none'" style="
                        padding: 10px 20px;
                        background: #667eea;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                    ">Close</button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
    },

    /**
     * Add Question Viewer UI to the page
     */
    addQuestionViewerUI() {
        // Check if UI already exists
        if (document.getElementById('fkneo-question-viewer-btn')) return;

        // Create floating button
        const button = document.createElement('button');
        button.id = 'fkneo-question-viewer-btn';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
        `;

        button.textContent = '📋 View Questions';
        
        button.onmouseover = () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.6)';
        };
        
        button.onmouseout = () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        };

        button.addEventListener('click', () => this.showAllQuestions());
        document.body.appendChild(button);
    },

    /**
     * Show all questions in a panel
     */
    showAllQuestions() {
        const questions = document.querySelectorAll(
            '.question-item, .question-panel, [data-question-id], .exam-question, .test-question'
        );

        if (questions.length === 0) {
            this.showNotification('No questions found on this page', 'info');
            return;
        }

        // Create questions panel
        let panel = document.getElementById('fkneo-questions-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'fkneo-questions-panel';
            document.body.appendChild(panel);
        }

        panel.style.cssText = `
            position: fixed;
            right: 0;
            top: 0;
            width: 350px;
            height: 100vh;
            background: white;
            box-shadow: -2px 0 10px rgba(0,0,0,0.1);
            overflow-y: auto;
            z-index: 9998;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        panel.innerHTML = `
            <div style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #333;">Questions (${questions.length})</h3>
                    <button id="close-questions-panel" style="
                        background: none;
                        border: none;
                        font-size: 20px;
                        cursor: pointer;
                        color: #999;
                    ">×</button>
                </div>
                
                <div id="questions-list" style="display: flex; flex-direction: column; gap: 10px;">
                    ${Array.from(questions).map((q, idx) => `
                        <button class="question-btn-panel" data-question-idx="${idx}" style="
                            padding: 12px;
                            background: #f5f5f5;
                            border: 1px solid #ddd;
                            border-radius: 6px;
                            cursor: pointer;
                            text-align: left;
                            font-size: 13px;
                            transition: all 0.2s;
                        ">
                            <strong>Q${idx + 1}:</strong> ${q.textContent.substring(0, 40)}...
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Add close handler
        document.getElementById('close-questions-panel').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        // Add click handlers for each question
        document.querySelectorAll('.question-btn-panel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-question-idx');
                const question = Array.from(questions)[idx];
                this.displayQuestion(question);
            });
            
            btn.addEventListener('mouseover', () => {
                btn.style.background = '#efefef';
                btn.style.borderColor = '#667eea';
            });
            
            btn.addEventListener('mouseout', () => {
                btn.style.background = '#f5f5f5';
                btn.style.borderColor = '#ddd';
            });
        });

        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
    },

    /**
     * Intercept and bypass API calls that restrict question access
     */
    interceptQuestionAPIs() {
        // Override fetch to bypass question restrictions
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const [resource] = args;
            const url = typeof resource === 'string' ? resource : resource.url;

            // If it's a question access check, return success
            if (url.includes('check-access') || url.includes('verify-test') || url.includes('test-status')) {
                console.log('[F**k Neo] Bypassed test access check');
                return Promise.resolve(new Response(JSON.stringify({ 
                    success: true, 
                    access: true, 
                    canView: true 
                })));
            }

            // If it's a questions API call, allow it
            if (url.includes('questions') || url.includes('exam')) {
                return originalFetch.apply(this, args).then(response => {
                    // Ensure the response is readable
                    return response.clone();
                }).catch(err => {
                    console.log('[F**k Neo] Question API error (bypassed):', err);
                    return Promise.resolve(new Response(JSON.stringify({ data: [] })));
                });
            }

            return originalFetch.apply(this, args);
        };

        // Override XMLHttpRequest
        const XHRopen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            if (url.includes('test-status') || url.includes('verify-access')) {
                this.bypassedRequest = true;
            }
            return XHRopen.apply(this, [method, url, ...rest]);
        };

        const XHRsend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(...args) {
            if (this.bypassedRequest) {
                this.onreadystatechange?.();
                this.readyState = 4;
                this.status = 200;
                this.responseText = JSON.stringify({ success: true, access: true });
                return;
            }
            return XHRsend.apply(this, args);
        };
    },

    /**
     * Show notification to user
     */
    showNotification(message, type = 'info') {
        if (!this.config.showNotifications) return;

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            animation: slideIn 0.3s ease-out;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => QuestionViewer.init());
} else {
    QuestionViewer.init();
}

console.log('[F**k Neo] Question Viewer module loaded');
