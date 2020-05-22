import http from "../http-common";

class AuthService {
    login(user) {
        return http
            .post('/api/signin', {
                username: user.username,
                password: user.password
            })
            .then(this.handleResponse)
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(user) {
        return http.post('/api/signup', {
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            password: user.password
        });
    }

    handleResponse(response) {
        if (response.status === 401) {
            this.logout();
            location.reload(true);

            const error = response.data && response.data.message;
            return Promise.reject(error);
        }

        return Promise.resolve(response);
    }
}

export default new AuthService();
