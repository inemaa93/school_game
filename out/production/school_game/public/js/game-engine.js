/**
 * Avansert JavaScript Spill-motor for Virtuell Lærerassistent
 * Inneholder lydeffekter, animasjoner, localStorage og avanserte spillfunksjoner
 */

class AdvancedGameEngine {
    constructor() {
        this.soundEnabled = true;
        this.animationsEnabled = true;
        this.achievements = [];
        this.gameStats = {
            totalQuestions: 0,
            correctAnswers: 0,
            streak: 0,
            maxStreak: 0,
            timeSpent: 0,
            sessionsPlayed: 0
        };
        
        this.initSounds();
        this.initLocalStorage();
        this.initPerformanceTracking();
        this.initNotifications();
    }

    // ===== LYDEFFEKTER =====
    initSounds() {
        this.sounds = {
            correct: this.createSound('data:audio/wav;base64,UklGRoQDAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWADAABhYmNkZWZnaGlqS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w=='),
            incorrect: this.createSound('data:audio/wav;base64,UklGRuQCAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YcACAAC+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+'),
            achievement: this.createSound('data:audio/wav;base64,UklGRhAEAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YewDAADR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR'),
            levelUp: this.createSound('data:audio/wav;base64,UklGRjgDAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRADAAA=')
        };
    }

    createSound(dataUri) {
        try {
            const audio = new Audio(dataUri);
            audio.volume = 0.3;
            return audio;
        } catch (error) {
            console.warn('Kunne ikke lage lydeffekt:', error);
            return { play: () => {}, pause: () => {} };
        }
    }

    playSound(soundName) {
        if (!this.soundEnabled || !this.sounds[soundName]) return;
        
        try {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => console.warn('Lydavspilling feilet:', e));
        } catch (error) {
            console.warn('Feil ved lydavspilling:', error);
        }
    }

    // ===== LOKALSTORAGE =====
    initLocalStorage() {
        this.storageKey = 'virtuell-laererassistent-data';
        this.loadGameData();
    }

    saveGameData() {
        try {
            const data = {
                gameStats: this.gameStats,
                achievements: this.achievements,
                settings: {
                    soundEnabled: this.soundEnabled,
                    animationsEnabled: this.animationsEnabled
                },
                lastPlayed: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.warn('Kunne ikke lagre spilldata:', error);
        }
    }

    loadGameData() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                this.gameStats = { ...this.gameStats, ...data.gameStats };
                this.achievements = data.achievements || [];
                
                if (data.settings) {
                    this.soundEnabled = data.settings.soundEnabled !== false;
                    this.animationsEnabled = data.settings.animationsEnabled !== false;
                }
            }
        } catch (error) {
            console.warn('Kunne ikke laste spilldata:', error);
        }
    }

    // ===== PRESTASJONER =====
    checkAchievements(context) {
        const newAchievements = [];

        // Første riktige svar
        if (context.isCorrect && this.gameStats.correctAnswers === 1) {
            newAchievements.push({
                id: 'first_correct',
                title: 'Første suksess! 🎯',
                description: 'Du svarte riktig på din første oppgave!',
                icon: '🎯',
                points: 50
            });
        }

        // 10 riktige på rad
        if (this.gameStats.streak === 10) {
            newAchievements.push({
                id: 'streak_10',
                title: 'Mesterskytter! 🔥',
                description: '10 riktige svar på rad!',
                icon: '🔥',
                points: 200
            });
        }

        // 50 spørsmål totalt
        if (this.gameStats.totalQuestions === 50) {
            newAchievements.push({
                id: 'questions_50',
                title: 'Stålhode! 🧠',
                description: 'Løste 50 oppgaver totalt!',
                icon: '🧠',
                points: 300
            });
        }

        // Perfekt sesjon (alle riktige)
        if (context.sessionComplete && context.sessionAccuracy === 100) {
            newAchievements.push({
                id: 'perfect_session',
                title: 'Perfekt! ⭐',
                description: 'Alle svar riktige i en sesjon!',
                icon: '⭐',
                points: 500
            });
        }

        // Vis nye prestasjoner
        newAchievements.forEach(achievement => {
            if (!this.achievements.find(a => a.id === achievement.id)) {
                this.achievements.push(achievement);
                this.showAchievementNotification(achievement);
                this.playSound('achievement');
            }
        });

        this.saveGameData();
        return newAchievements;
    }

    showAchievementNotification(achievement) {
        if (!this.animationsEnabled) return;

        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <h3>${achievement.title}</h3>
                <p>${achievement.description}</p>
                <div class="achievement-points">+${achievement.points} poeng</div>
            </div>
        `;

        // Legg til CSS hvis det ikke finnes
        if (!document.querySelector('#achievement-styles')) {
            this.addAchievementStyles();
        }

        document.body.appendChild(notification);

        // Animasjon
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    addAchievementStyles() {
        const style = document.createElement('style');
        style.id = 'achievement-styles';
        style.textContent = `
            .achievement-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 12px;
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                transform: translateX(400px);
                transition: transform 0.5s ease;
                z-index: 1000;
                max-width: 350px;
            }
            
            .achievement-notification.show {
                transform: translateX(0);
            }
            
            .achievement-notification.hide {
                transform: translateX(400px);
            }
            
            .achievement-icon {
                font-size: 24px;
                min-width: 24px;
            }
            
            .achievement-content h3 {
                margin: 0 0 5px 0;
                font-size: 16px;
            }
            
            .achievement-content p {
                margin: 0 0 5px 0;
                font-size: 14px;
                opacity: 0.9;
            }
            
            .achievement-points {
                font-size: 12px;
                font-weight: bold;
                color: #ffd700;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== YTELSESOVERVÅKING =====
    initPerformanceTracking() {
        this.startTime = Date.now();
        this.questionStartTime = null;
        this.responseTimeHistory = [];
    }

    startQuestionTimer() {
        this.questionStartTime = Date.now();
    }

    recordResponse(isCorrect) {
        if (this.questionStartTime) {
            const responseTime = Date.now() - this.questionStartTime;
            this.responseTimeHistory.push(responseTime);
            
            // Behold kun de siste 50 responsetidene
            if (this.responseTimeHistory.length > 50) {
                this.responseTimeHistory.shift();
            }
        }

        // Oppdater statistikk
        this.gameStats.totalQuestions++;
        
        if (isCorrect) {
            this.gameStats.correctAnswers++;
            this.gameStats.streak++;
            this.gameStats.maxStreak = Math.max(this.gameStats.maxStreak, this.gameStats.streak);
        } else {
            this.gameStats.streak = 0;
        }

        this.saveGameData();
    }

    getAverageResponseTime() {
        if (this.responseTimeHistory.length === 0) return 0;
        const sum = this.responseTimeHistory.reduce((a, b) => a + b, 0);
        return Math.round(sum / this.responseTimeHistory.length / 1000 * 10) / 10; // sekunder
    }

    getAccuracy() {
        if (this.gameStats.totalQuestions === 0) return 0;
        return Math.round((this.gameStats.correctAnswers / this.gameStats.totalQuestions) * 100);
    }

    // ===== NOTIFIKASJONER =====
    initNotifications() {
        this.requestNotificationPermission();
    }

    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            try {
                await Notification.requestPermission();
            } catch (error) {
                console.warn('Kunne ikke be om notifikasjonsstillatelse:', error);
            }
        }
    }

    showNotification(title, body, icon = '🎓') {
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                new Notification(title, {
                    body: body,
                    icon: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${icon}</text></svg>`,
                    tag: 'virtuell-laererassistent'
                });
            } catch (error) {
                console.warn('Kunne ikke vise notifikasjon:', error);
            }
        }
    }

    // ===== ANIMASJONER =====
    animateElement(element, animation) {
        if (!this.animationsEnabled || !element) return;

        const animations = {
            bounce: 'bounce 0.6s ease',
            shake: 'shake 0.5s ease',
            pulse: 'pulse 1s ease',
            fadeIn: 'fadeIn 0.5s ease',
            slideUp: 'slideUp 0.5s ease',
            celebration: 'celebration 1s ease'
        };

        const animationValue = animations[animation] || animation;
        element.style.animation = animationValue;

        setTimeout(() => {
            element.style.animation = '';
        }, 1000);
    }

    // ===== MOTIVASJONSSYSTEM =====
    generateMotivationalMessage(context) {
        const messages = {
            correct: [
                'Fantastisk! Du er på riktig vei! 🌟',
                'Perfekt! Du mestrer dette! 💪',
                'Utmerket! Fortsett sånn! 🎯',
                'Bravo! Du imponerer! 👏',
                'Supert! Du lærer raskt! 🚀'
            ],
            incorrect: [
                'Ikke gi opp! Neste gang får du det til! 💪',
                'Bra forsøk! Læring krever øvelse! 📚',
                'Det går bedre neste gang! 🌟',
                'Fortsett å prøve! Du blir stadig bedre! 🎯',
                'Alle gjør feil - det er sånn vi lærer! 💡'
            ],
            streak: [
                'Du er på fire! 🔥',
                'Hvilket talent! 🌟',
                'Unstoppelig! 🚀',
                'Mesteren i aksjon! 👑',
                'Legendarisk! ⚡'
            ]
        };

        let messageType = context.isCorrect ? 'correct' : 'incorrect';
        
        if (context.isCorrect && this.gameStats.streak >= 5) {
            messageType = 'streak';
        }

        const messageList = messages[messageType];
        return messageList[Math.floor(Math.random() * messageList.length)];
    }

    // ===== ADAPTIV VANSKELIGHETSGRAD =====
    calculateDifficultyAdjustment() {
        const recentPerformance = this.getRecentPerformance(10); // Siste 10 spørsmål
        const accuracy = recentPerformance.accuracy;
        const avgResponseTime = recentPerformance.avgResponseTime;

        let adjustment = 0;

        // Juster basert på nøyaktighet
        if (accuracy >= 90) {
            adjustment += 1; // Øk vanskelighetsgrad
        } else if (accuracy <= 50) {
            adjustment -= 1; // Senk vanskelighetsgrad
        }

        // Juster basert på responsetid
        if (avgResponseTime < 5000 && accuracy >= 80) {
            adjustment += 0.5; // Øk litt hvis eleven er både rask og nøyaktig
        } else if (avgResponseTime > 15000) {
            adjustment -= 0.5; // Senk litt hvis eleven bruker lang tid
        }

        return Math.max(-2, Math.min(2, adjustment)); // Begrens justering
    }

    getRecentPerformance(count = 10) {
        const recentQuestions = Math.min(count, this.gameStats.totalQuestions);
        const recentCorrect = Math.min(this.gameStats.correctAnswers, recentQuestions);
        const recentResponseTimes = this.responseTimeHistory.slice(-count);
        
        return {
            accuracy: recentQuestions > 0 ? (recentCorrect / recentQuestions) * 100 : 0,
            avgResponseTime: recentResponseTimes.length > 0 
                ? recentResponseTimes.reduce((a, b) => a + b, 0) / recentResponseTimes.length 
                : 0
        };
    }

    // ===== INNSTILLINGER =====
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.saveGameData();
        return this.soundEnabled;
    }

    toggleAnimations() {
        this.animationsEnabled = !this.animationsEnabled;
        this.saveGameData();
        return this.animationsEnabled;
    }

    // ===== STATISTIKK =====
    getDetailedStats() {
        const totalTime = Math.round((Date.now() - this.startTime) / 1000);
        
        return {
            ...this.gameStats,
            accuracy: this.getAccuracy(),
            averageResponseTime: this.getAverageResponseTime(),
            totalTimeSpent: totalTime,
            questionsPerMinute: this.gameStats.totalQuestions > 0 
                ? Math.round((this.gameStats.totalQuestions / totalTime) * 60 * 10) / 10 
                : 0,
            achievements: this.achievements.length,
            difficultyAdjustment: this.calculateDifficultyAdjustment()
        };
    }

    // ===== RESET =====
    resetStats() {
        this.gameStats = {
            totalQuestions: 0,
            correctAnswers: 0,
            streak: 0,
            maxStreak: 0,
            timeSpent: 0,
            sessionsPlayed: 0
        };
        this.achievements = [];
        this.responseTimeHistory = [];
        this.saveGameData();
    }
}

// Eksporter for bruk i andre moduler
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedGameEngine;
} else {
    window.AdvancedGameEngine = AdvancedGameEngine;
} 