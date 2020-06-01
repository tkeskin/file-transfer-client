import http from "../http-common";

class JobService {

    getJobList() {
        return http.get('/job');
    }

    startUpload(fts) {
        return http.get("/start-upload/" + fts.id);
    }

    startDownload(fts) {
        return http.get("/start-download/" + fts.id);
    }

    deleteJob(fts) {
        return http.get("/delete-job/" + fts.id);
    }

    detailJob(fts) {
        return http.get("/detail-job/" + fts.id);
    }

    queryJob(createdById) {
        return http.get("/query-job/" + createdById.createdById);
    }

    saveJob(job) {
        return http.post('/job', job)
            .then(response => {
                return response.data;
            });
    }
}

export default new JobService();