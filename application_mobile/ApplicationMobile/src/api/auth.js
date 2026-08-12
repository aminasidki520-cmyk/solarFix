import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './axiosConfig';

export async function login(username, password) {
    try {
        console.log('\n========== LOGIN START ==========');
        console.log(`[TIME] ${new Date().toISOString()}`);
        console.log(`[CREDENTIALS] username="${username}"`);

        const response = await apiClient.post('/api/auth/login', { username, password });
        const data = response.data || {};

        console.log(`[STATUS] ${response.status}`);
        console.log(`[RESPONSE] ${JSON.stringify(data)}`);

        // Support several possible token property names returned by different backends
        const token = data.token || data.access_token || data.jwt || data.data?.token;
        const returnedUsername = data.username || data.user?.username || data.data?.username;
        const role = data.role || data.user?.role || data.data?.role;

        // Detect common mistake: hitting the Expo dev server instead of your backend
        if (data?.runtimeVersion || data?.launchAsset) {
            const msg = 'Received Expo dev server metadata. Your app is pointing to the wrong server (BASE_URL)';
            console.error(`[ERROR] ${msg}`);
            throw new Error(msg);
        }

        // Validate server response before writing to AsyncStorage
        if (!token) {
            const preview = JSON.stringify(data).slice(0, 500);
            const msg = `No token received from server - response=${preview}`;
            console.error(`[ERROR] ${msg}`);
            throw new Error(msg);
        }

        console.log(`[TOKEN] ${token.substring(0, 50)}...`);
        console.log(`[USERNAME] ${returnedUsername}`);
        console.log(`[ROLE] ${role}`);

        // 1. Save the token to AsyncStorage (used for app restarts)
        await AsyncStorage.multiSet([
            ['token', token],
            ['username', returnedUsername || ''],
            ['role', role || ''],
        ]);
        console.log('[STORAGE] ✅ Token saved to AsyncStorage');

        // 2. Immediately attach the token to Axios global headers
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('[HEADERS] ✅ Authorization header set');

        console.log('========== LOGIN SUCCESS ✅ ==========\n');
        return { token, username: returnedUsername, role };
    } catch (err) {
        console.error('\n========== LOGIN FAILED ❌ ==========');
        const message = err?.response?.data?.message || err.message || 'Login failed';
        console.error(`[ERROR] ${message}`);

        if (err?.response) {
            console.error(`[ERROR STATUS] ${err.response.status}`);
            console.error(`[ERROR DATA] ${JSON.stringify(err.response.data)}`);
        } else {
            console.error(`[ERROR] ${err.toString()}`);
        }
        console.log('========== END ==========\n');

        // Avoid attempting to write undefined values to AsyncStorage
        throw new Error(message);
    }
}

export async function logout() {
    // 1. Clear AsyncStorage
    await AsyncStorage.multiRemove(['token', 'username', 'role']);
    
    // 2. 🔥 CRITICAL FIX: Remove the token from the global Axios headers
    delete apiClient.defaults.headers.common['Authorization'];
}

export async function getStoredSession() {
    const entries = await AsyncStorage.multiGet(['token', 'username', 'role']);
    const values = Object.fromEntries(entries);
    if (!values.token) return null;
    return { token: values.token, username: values.username, role: values.role };
}