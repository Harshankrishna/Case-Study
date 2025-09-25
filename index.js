
        document.addEventListener('DOMContentLoaded', () => {
            // --- SCRIPT REORGANIZATION FOR BUG FIX ---
            
            // 1. CREATE CURSOR ELEMENT FIRST
            const cursorContainer = document.createElement('div');
            cursorContainer.classList.add('cursor-container');
            cursorContainer.innerHTML = `<span class="cursor-label"></span>`;
            document.body.appendChild(cursorContainer);

            // 2. NOW IT'S SAFE TO SELECT ELEMENTS
            const nameCollector = document.getElementById('name-collector-overlay');
            const nameInput = document.getElementById('name-input');
            const nameSubmitBtn = document.getElementById('name-submit-btn');
            const pageWrapper = document.getElementById('page-wrapper');
            const cursorLabel = document.querySelector('.cursor-label'); // This is now safe

            // 3. DEFINE THE START SITE FUNCTION
            const startSite = (name) => {
                if (cursorLabel) { // Check if cursorLabel exists before using it
                    cursorLabel.textContent = name;
                }
                sessionStorage.setItem('visitorName', name);
                nameCollector.classList.add('hidden');
                pageWrapper.classList.remove('hidden');
            };

            // 4. CHECK FOR SAVED NAME AND INITIALIZE SITE
            const savedName = sessionStorage.getItem('visitorName');
            if (savedName) {
                startSite(savedName);
            }

            // 5. SETUP EVENT LISTENERS
            nameSubmitBtn.addEventListener('click', () => {
                const userName = nameInput.value.trim();
                if (userName) {
                    startSite(userName);
                } else {
                    // Replaced alert with a visual cue
                    nameInput.style.borderColor = 'red';
                    setTimeout(() => { nameInput.style.borderColor = '' }, 1000);
                }
            });

            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    nameSubmitBtn.click();
                }
            });

            // Add cursor move/hover listeners
            document.addEventListener('mousemove', e => {
                cursorContainer.style.left = `${e.clientX}px`;
                cursorContainer.style.top = `${e.clientY}px`;
            });

            document.querySelectorAll('a, button, .remix-btn, .service-card, .work-card, .store-card, #chatbot-toggle, .idea-box-icons svg, #voice-input, input, textarea').forEach(el => {
                el.addEventListener('mouseenter', () => cursorContainer.classList.add('hover'));
                el.addEventListener('mouseleave', () => cursorContainer.classList.remove('hover'));
            });


            // --- REST OF THE ORIGINAL SCRIPT ---

            // Hero Title Animation
            const heroTitle = document.getElementById('hero-title');
            if (heroTitle) {
                const text = heroTitle.innerText;
                heroTitle.innerHTML = '';
                
                text.split('').forEach((char, index) => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.style.display = 'inline-block';
                    span.style.opacity = '0';
                    span.style.filter = 'blur(10px)';
                    span.style.transform = 'translateY(10px)';
                    span.style.transition = `opacity 0.5s ${index * 0.02}s, filter 0.5s ${index * 0.02}s, transform 0.5s ${index * 0.02}s`;
                    heroTitle.appendChild(span);
                });

                setTimeout(() => {
                    heroTitle.querySelectorAll('span').forEach(span => {
                        span.style.opacity = '1';
                        span.style.filter = 'blur(0)';
                        span.style.transform = 'translateY(0)';
                    });
                }, 100);
            }

            // Search Functionality
            const searchInput = document.getElementById('searchInput');
            const mainContent = document.getElementById('main-content');
            const searchResultsSection = document.getElementById('search-results');
            const searchResultsGrid = searchResultsSection.querySelector('.search-results-grid');
            const projectCards = document.querySelectorAll('.project-card');

            if (searchInput) {
                searchInput.addEventListener('keyup', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    
                    if (searchTerm.length > 0) {
                        mainContent.style.display = 'none';
                        searchResultsSection.style.display = 'block';
                        searchResultsGrid.innerHTML = '';

                        projectCards.forEach(card => {
                            const title = card.dataset.title.toLowerCase();
                            const description = card.dataset.description.toLowerCase();

                            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                                const resultItem = card.cloneNode(true);
                                searchResultsGrid.appendChild(resultItem);
                            }
                        });

                    } else {
                        mainContent.style.display = 'block';
                        searchResultsSection.style.display = 'none';
                    }
                });

                // Typing animation for search box
                const placeholderTexts = ["Search for 'Website'...", "Try 'Branding'", "Find 'Framer Templates'"];
                let textIndex = 0;
                let charIndex = 0;
                let isDeleting = false;
                let typingTimeout;

                function typeAnimation() {
                    const currentText = placeholderTexts[textIndex];
                    let displayText = '';

                    if (isDeleting) {
                        displayText = currentText.substring(0, charIndex - 1);
                        charIndex--;
                    } else {
                        displayText = currentText.substring(0, charIndex + 1);
                        charIndex++;
                    }

                    searchInput.setAttribute('placeholder', displayText);

                    if (!isDeleting && charIndex === currentText.length) {
                        isDeleting = true;
                        typingTimeout = setTimeout(typeAnimation, 2000); // Pause at end
                    } else if (isDeleting && charIndex === 0) {
                        isDeleting = false;
                        textIndex = (textIndex + 1) % placeholderTexts.length;
                        typingTimeout = setTimeout(typeAnimation, 500); // Pause before new text
                    } else {
                        const typingSpeed = isDeleting ? 100 : 150;
                        typingTimeout = setTimeout(typeAnimation, typingSpeed);
                    }
                }
                
                typeAnimation();

                searchInput.addEventListener('focus', () => {
                    clearTimeout(typingTimeout);
                    searchInput.setAttribute('placeholder', "Type your idea and we'll bring it to life (or /command)");
                });

                searchInput.addEventListener('blur', () => {
                    if (searchInput.value === '') {
                        typeAnimation();
                    }
                });
            }
            
            // Theme Toggle
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                const sunIcon = document.getElementById('sun-icon');
                const moonIcon = document.getElementById('moon-icon');

                themeToggle.addEventListener('click', () => {
                    document.body.classList.toggle('light-mode');
                    if (document.body.classList.contains('light-mode')) {
                        sunIcon.style.display = 'none';
                        moonIcon.style.display = 'block';
                    } else {
                        sunIcon.style.display = 'block';
                        moonIcon.style.display = 'none';
                    }
                });
            }


            // Gallery Navigation
            const galleryWrapper = document.querySelector('.gallery-wrapper');
            const galleryPrevBtn = document.getElementById('gallery-prev');
            const galleryNextBtn = document.getElementById('gallery-next');

            if (galleryWrapper) {
                galleryPrevBtn.addEventListener('click', () => {
                    galleryWrapper.scrollBy({ left: -316, behavior: 'smooth' });
                });
                galleryNextBtn.addEventListener('click', () => {
                    galleryWrapper.scrollBy({ left: 316, behavior: 'smooth' });
                });

                // Drag to scroll
                let isDown = false;
                let startX;
                let scrollLeft;

                galleryWrapper.addEventListener('mousedown', (e) => {
                    isDown = true;
                    galleryWrapper.classList.add('active');
                    startX = e.pageX - galleryWrapper.offsetLeft;
                    scrollLeft = galleryWrapper.scrollLeft;
                });
                galleryWrapper.addEventListener('mouseleave', () => {
                    isDown = false;
                    galleryWrapper.classList.remove('active');
                });
                galleryWrapper.addEventListener('mouseup', () => {
                    isDown = false;
                    galleryWrapper.classList.remove('active');
                });
                galleryWrapper.addEventListener('mousemove', (e) => {
                    if(!isDown) return;
                    e.preventDefault();
                    const x = e.pageX - galleryWrapper.offsetLeft;
                    const walk = (x - startX) * 2; //scroll-fast
                    galleryWrapper.scrollLeft = scrollLeft - walk;
                });
            }

            // Password Protection Logic
            const passwordPopupOverlay = document.getElementById('password-popup-overlay');
            const passwordPopup = document.getElementById('password-popup');
            const passwordInput = document.getElementById('password-input');
            const passwordSubmitBtn = document.getElementById('password-submit-btn');
            const passwordCloseBtn = document.getElementById('password-close-btn');
            const passwordError = document.getElementById('password-error');
            const protectedLinks = document.querySelectorAll('.view-case-study-btn');
            const projectDetailPage = document.getElementById('project-detail-page');
            const backToMainBtn = document.getElementById('back-to-main');
            
            const correctPassword = "1234"; // Set your password here

            protectedLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    passwordPopupOverlay.classList.remove('hidden');
                    passwordInput.focus();
                });
            });

            const closePasswordPopup = () => {
                passwordPopupOverlay.classList.add('hidden');
                passwordInput.value = '';
                passwordError.classList.add('hidden');
            };

            passwordSubmitBtn.addEventListener('click', () => {
                if (passwordInput.value === correctPassword) {
                    closePasswordPopup();
                    pageWrapper.classList.add('hidden');
                    projectDetailPage.classList.remove('hidden');
                } else {
                    passwordError.classList.remove('hidden');
                    passwordInput.value = '';
                    passwordInput.focus();
                }
            });
            
            backToMainBtn.addEventListener('click', () => {
                pageWrapper.classList.remove('hidden');
                projectDetailPage.classList.add('hidden');
            });

            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    passwordSubmitBtn.click();
                }
            });

            passwordCloseBtn.addEventListener('click', closePasswordPopup);

            passwordPopupOverlay.addEventListener('click', (e) => {
                if (e.target === passwordPopupOverlay) {
                    closePasswordPopup();
                }
            });
            
            // Chatbot Logic
            const chatbotToggle = document.getElementById('chatbot-toggle');
            const chatbotContainer = document.getElementById('chatbot-container');
            const chatMessages = document.getElementById('chat-messages');
            const chatInput = document.getElementById('chat-input');
            const chatSend = document.getElementById('chat-send');
            const voiceInput = document.getElementById('voice-input');
            let chatHistory = [];

            function addMessage(message, sender, addToHistory = true) {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', `${sender}-message`);
                messageElement.innerHTML = `<p>${message}</p>`;
                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                if (addToHistory) {
                    const role = sender === 'user' ? 'user' : 'model';
                    chatHistory.push({ role: role, parts: [{ text: message }] });
                    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
                }
                return messageElement;
            }

            function addOptions() {
                const optionsContainer = document.createElement('div');
                optionsContainer.classList.add('chat-options');
                optionsContainer.innerHTML = `
                    <button data-option="Works">Works</button>
                    <button data-option="Services">Services</button>
                    <button data-option="Contact">Contact</button>
                `;
                chatMessages.appendChild(optionsContainer);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            function handleOptionClick(e) {
                if (e.target.tagName === 'BUTTON' && e.target.dataset.option) {
                    const option = e.target.dataset.option;
                    addMessage(option, 'user');
                    handleBotResponse(option);
                    e.target.parentElement.remove();
                }
            }

            chatMessages.addEventListener('click', handleOptionClick);

            function handleBotResponse(message) {
                const lowerCaseMessage = message.toLowerCase();

                if (lowerCaseMessage.includes('work')) {
                    document.getElementById('work').scrollIntoView({ behavior: 'smooth' });
                    addMessage("Here are my projects.", 'bot');
                } else if (lowerCaseMessage.includes('service')) {
                     document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
                    addMessage("Here are the services I offer.", 'bot');
                } else if (lowerCaseMessage.includes('contact')) {
                    window.location.href = "mailto:harshanchrisdev@gmail.com";
                } else {
                    getAIResponse(message);
                }
            }

            async function getAIResponse(prompt) {
                const loadingMessage = addMessage("...", 'bot', false);

                const payload = {
                    contents: chatHistory,
                };
                // The API key is left empty here. The environment will automatically provide it.
                const apiKey = ""; 

                try {
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error.message || 'API request failed');
                    }
                    
                    const result = await response.json();
                    
                    loadingMessage.remove();

                    if (result.candidates && result.candidates.length > 0 &&
                        result.candidates[0].content && result.candidates[0].content.parts &&
                        result.candidates[0].content.parts.length > 0) {
                        const botMessage = result.candidates[0].content.parts[0].text;
                        addMessage(botMessage, 'bot');
                    } else {
                        addMessage("Sorry, I received an unexpected response. Please try again.", 'bot', false);
                    }

                } catch (error) {
                    console.error("Error fetching AI response:", error);
                    loadingMessage.remove();
                    addMessage("Sorry, I'm having trouble connecting. Please try again later.", 'bot', false);
                }
            }

            chatSend.addEventListener('click', () => {
                const userMessage = chatInput.value;
                if (userMessage.trim() !== '') {
                    addMessage(userMessage, 'user');
                    handleBotResponse(userMessage);
                    chatInput.value = '';
                }
            });

            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    chatSend.click();
                }
            });

            chatbotToggle.addEventListener('click', () => {
                chatbotContainer.classList.toggle('active');
            });

            // Auto-open chatbot on first visit
            const savedHistory = localStorage.getItem('chatHistory');
            if (savedHistory) {
                chatHistory = JSON.parse(savedHistory);
                chatHistory.forEach(item => {
                    const sender = item.role === 'user' ? 'user' : 'model';
                    addMessage(item.parts[0].text, sender, false);
                });
            } else {
                 if (!sessionStorage.getItem('chatbot-visited')) {
                    setTimeout(() => {
                        chatbotContainer.classList.add('active');
                        addMessage("Hello! How can I help you today?", 'bot');
                        addOptions();
                        sessionStorage.setItem('chatbot-visited', 'true');
                    }, 2000);
                }
            }

            // Voice Input
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.lang = 'en-US';
                recognition.interimResults = false;
                recognition.maxAlternatives = 1;

                voiceInput.addEventListener('click', () => {
                    recognition.start();
                    voiceInput.classList.add('listening');
                });

                recognition.addEventListener('result', (e) => {
                    const transcript = Array.from(e.results)
                        .map(result => result[0])
                        .map(result => result.transcript)
                        .join('');
                    chatInput.value = transcript;
                });

                recognition.addEventListener('speechend', () => {
                    recognition.stop();
                    voiceInput.classList.remove('listening');
                });

                recognition.addEventListener('error', (e) => {
                    console.error('Speech recognition error:', e.error);
                    voiceInput.classList.remove('listening');
                });
            } else {
                voiceInput.style.display = 'none';
            }
            
             // Close chatbot on outside click
            document.addEventListener('click', (e) => {
                if (!chatbotContainer.contains(e.target) && !chatbotToggle.contains(e.target)) {
                    chatbotContainer.classList.remove('active');
                }
            });
        });