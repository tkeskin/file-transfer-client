import http from "../http-common";

class PublicService {


    getJobList() {
        return http.get('/job');
    }

    getFtpServer() {
        return http.get('/ftp-server');
    }

    deleteFtpServer(fts) {
        return http.get("/ftp-server/" + fts.id);
    }

    startJob(fts) {
        return http.get("/start-job/" + fts.id);
    }

    startDownload(fts) {
        return http.get("/start-download/" + fts.id);
    }

    deleteJob(fts) {
        return http.get("/delete-job/" + fts.id);
    }

    detail(fts) {
        return http.get("/job-destination/" + fts.id);
    }

    testConnection(ftpServerDto) {
        return http.post('/test-connection', ftpServerDto)
            .then(response => {
                return response.data;
            });
    }

    saveFtpServer(ftpServer) {
        return http.post('/ftp-server', ftpServer)
            .then(response => {
                return response.data;
            });
    }

    saveJob(job) {
        return http.post('/job', job)
            .then(response => {
                return response.data;
            });
    }
}

export default new PublicService();