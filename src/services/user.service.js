import http from "../http-common";
import authHeader from './auth.header';

class UserService {

    getUserBoard() {
        return http.get('/catalog/customers', {headers: authHeader()});
    }

    /*    getUserBoard2() {
            return http.get('/api/public/users');
        }*/

    getUserBoard2() {
        return http.get('/catalog/public/users');
    }

    getModeratorBoard() {
        return http.get('mod', {headers: authHeader()});
    }

    getAdminBoard() {
        return http.get('admin', {headers: authHeader()});
    }
}

export default new UserService();
