import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'http://10.43.28.108:8082';

/**
 * Enhanced login function with detailed logging for debugging
 */
export async function debugLogin(username, password) {
    console.log('\n========== DEBUG LOGIN START ==========');
    console.log(`[TIME] ${new Date().toISOString()}`);
    console.log(`[URL] POST ${BASE_URL}/api/auth/login`);
    console.log(`[BODY] username="${username}", password="${password}"`);

    try {
        const body = { username, password };
        console.log(`[REQUEST] ${JSON.stringify(body)}`);

        const response = await axios.post(
            `${BASE_URL}/api/auth/login`,
            body,
            {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`[STATUS] ${response.status}`);
        console.log(`[RESPONSE] ${JSON.stringify(response.data)}`);

        const { token, username: returnedUsername, role } = response.data;

        console.log(`[TOKEN] ${token ? token.substring(0, 50) + '...' : 'MISSING'}`);
        console.log(`[USERNAME] ${returnedUsername || 'MISSING'}`);
        console.log(`[ROLE] ${role || 'MISSING'}`);

        // Validate all required fields
        if (!token) {
            throw new Error('No token in response');
        }

        // Store to AsyncStorage
        console.log('[STORAGE] Saving token, username, role to AsyncStorage');
        await AsyncStorage.multiSet([
            ['token', token],
            ['username', returnedUsername || ''],
            ['role', role || ''],
        ]);
        console.log('[STORAGE] ✅ Saved successfully');

        console.log('\n========== DEBUG LOGIN SUCCESS ✅ ==========\n');
        return { token, username: returnedUsername, role };

    } catch (err) {
        console.error('[ERROR] Login failed');
        console.error(`[ERROR MESSAGE] ${err.message}`);

        if (err.response) {
            console.error(`[ERROR STATUS] ${err.response.status}`);
            console.error(`[ERROR DATA] ${JSON.stringify(err.response.data)}`);
            console.error(`[ERROR HEADERS] ${JSON.stringify(err.response.headers)}`);
        } else if (err.request) {
            console.error('[ERROR REQUEST] Request made but no response');
            console.error(`[ERROR REQUEST] ${JSON.stringify(err.request)}`);
        }

        console.log('\n========== DEBUG LOGIN FAILED ❌ ==========\n');
        throw err;
    }
}

export async function testBackendConnection() {
    // Use a public, permitted endpoint instead of root which is protected
    const healthUrl = `${BASE_URL}/api/test/hello`;
    console.log('\n========== CONNECTIVITY TEST START ==========');
    console.log(`[TIME] ${new Date().toISOString()}`);
    console.log(`[URL] GET ${healthUrl}`);

    try {
        const response = await axios.get(healthUrl, { timeout: 5000 });
        console.log(`[STATUS] ${response.status}`);
        console.log('[RESULT] ✅ Backend is reachable');
        console.log('\n========== CONNECTIVITY TEST SUCCESS ✅ ==========\n');
        return true;
    } catch (err) {
        // If we got a response from the server (even 401/403), the server is reachable
        if (err.response) {
            console.warn('[WARN] Server responded with status:', err.response.status);
            console.warn('[WARN] Treating server as reachable (authentication/authorization issue)');
            return true;
        }

        console.error('[ERROR] Backend unreachable');
        console.error(`[ERROR] ${err.message}`);
        console.log('\n========== CONNECTIVITY TEST FAILED ❌ ==========\n');
        return false;
    }
}

