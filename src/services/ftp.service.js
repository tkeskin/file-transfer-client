import http from "../http-common";

class FtpService {

    getFtpServer() {
        return http.get('/ftp-server');
    }

    deleteFtpServer(fts) {
        return http.get("/ftp-server/" + fts.id);
    }

    saveFtpServer(ftpServer) {
        return http.post('/ftp-server', ftpServer)
            .then(response => {
                return response.data;
            });
    }

    testConnection(ftpServerDto) {
        return http.post('/test-connection', ftpServerDto)
            .then(response => {
                return response.data;
            });
    }
}

export default new FtpService();