export default class ApiClient {
    constructor() {
        this.baseURL = window.location.origin;
        this.sessionId = localStorage.getItem('sessionId');
        this.isOnline = navigator.onLine;
        
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🟢 API Client: Back online');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('🔴 API Client: Offline mode');
        });
    }

    async get(endpoint, fallbackPath = null) {
        try {
            const url = `${this.baseURL}/api${endpoint}`;
            console.log('📡 API Request:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                signal: AbortSignal.timeout(5000)
            });

            if (!response.ok) {
                throw new Error(`API responded with ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ API Response received');
            return data;

        } catch (error) {
            console.warn('⚠️ API request failed:', error.message);
            if (fallbackPath) {
                console.log('🔄 Trying fallback:', fallbackPath);
                try {
                    const fallbackResponse = await fetch(fallbackPath);
                    if (fallbackResponse.ok) {
                        const data = await fallbackResponse.json();
                        console.log('✅ Fallback successful');
                        return data;
                    }
                } catch (fallbackError) {
                    console.error('❌ Fallback also failed:', fallbackError.message);
                }
            }
            
            throw error;
        }
    }

    // Enhanced POST request
    async post(endpoint, data = {}) {
        try {
            if (this.sessionId) {
                data.sessionId = this.sessionId;
            }

            const url = `${this.baseURL}/api${endpoint}`;
            console.log('📡 API POST Request:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(5000)
            });

            if (!response.ok) {
                throw new Error(`API responded with ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ API POST Response received');
            return result;

        } catch (error) {
            console.error('❌ API POST failed:', error.message);
            throw error;
        }
    }

    // Test if API is available
    async testConnection() {
        try {
            const response = await this.get('/test');
            console.log('🟢 API Connection Test: SUCCESS');
            return true;
        } catch (error) {
            console.warn('🔴 API Connection Test: FAILED -', error.message);
            return false;
        }
    }

    // Update session ID
    updateSessionId(sessionId) {
        this.sessionId = sessionId;
        if (sessionId) {
            localStorage.setItem('sessionId', sessionId);
            console.log('✅ Session ID updated');
        } else {
            localStorage.removeItem('sessionId');
            console.log('🗑️ Session ID removed');
        }
    }

    // Get course data with automatic fallback to JSON files
    async getCourseData(level, stage, type) {
        const apiEndpoint = `/courses/chinese/HSK${level}/stage${stage}/${type}`;
        const fallbackPath = `../Json/HSK${level}/stage${stage}/${type}.json`;
        
        return this.get(apiEndpoint, fallbackPath);
    }

    // Save progress
    async saveProgress(course, level, stage, exerciseId, score) {
        if (!this.sessionId) {
            console.warn('⚠️ No session ID, cannot save to server');
            return null;
        }

        return this.post('/progress', {
            course,
            level,
            stage,
            exerciseId,
            score
        });
    }

    // Get user progress
    async getProgress(course, level, stage) {
        if (!this.sessionId) {
            console.warn('⚠️ No session ID, cannot fetch from server');
            return {};
        }

        try {
            const response = await this.get(`/progress?course=${course}&level=${level}&stage=${stage}`);
            return response.progress || {};
        } catch (error) {
            console.warn('⚠️ Could not fetch progress from server');
            return {};
        }
    }
}