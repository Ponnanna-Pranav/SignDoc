import api from './axios';

const register = (name, email, password) => {
    return api.post('/auth/register', {
        name,
        email,
        password,
    });
};

const login = async (email, password) => {
    const response = await api.post('/auth/login', {
        email,
        password,
    });

    if (response.data && response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
