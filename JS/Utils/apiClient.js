//Frontend API communication helper


export default class ApiClient {
    constructor() {
        this.baseURL = window.location.origin;
        this.sessionId = localStorage.getItem('sessionId');
    }

    // Generic GET request with fallback
    async get(endpoint, fallbackPath = null) {
        try {
            const url = `${this.baseURL}/api${endpoint}`;
            console.log('API Request:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                signal: AbortSignal.timeout(5000) // 5 second timeout
            });

            if (!response.ok) {
                throw new Error(`API responded with ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);
            return data;

        } catch (error) {
            console.warn('API request failed:', error.message);
            
            // Try fallback if provided
            if (fallbackPath) {
                console.log('Trying fallback:', fallbackPath);
                try {
                    const fallbackResponse = await fetch(fallbackPath);
                    if (fallbackResponse.ok) {
                        return await fallbackResponse.json();
                    }
                } catch (fallbackError) {
                    console.error('Fallback also failed:', fallbackError.message);
                }
            }
            
            throw error;
        }
    }

    // Generic POST request
    async post(endpoint, data = {}) {
        try {
            // Add session ID if available
            if (this.sessionId) {
                data.sessionId = this.sessionId;
            }

            const url = `${this.baseURL}/api${endpoint}`;
            console.log('API POST Request:', url, data);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                signal: AbortSignal.timeout(5000)
            });

            if (!response.ok) {
                throw new Error(`API responded with ${response.status}`);
            }

            const result = await response.json();
            console.log('API POST Response:', result);
            return result;

        } catch (error) {
            console.error('API POST failed:', error.message);
            throw error;
        }
    }

    // Test if API is available
    async testConnection() {
        try {
            const response = await this.get('/test');
            console.log('API Connection Test:', response);
            return true;
        } catch (error) {
            console.warn('API is not available:', error.message);
            return false;
        }
    }

    // Update session ID
    updateSessionId(sessionId) {
        this.sessionId = sessionId;
        if (sessionId) {
            localStorage.setItem('sessionId', sessionId);
        } else {
            localStorage.removeItem('sessionId');
        }
    }
}