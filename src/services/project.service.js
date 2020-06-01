import http from "../http-common";

class ProjectService {


    getProject() {
        return http.get('/project');
    }

    deleteProject(projectDto) {
        return http.get("/project/" + projectDto.id);
    }

    saveProject(projectDto) {
        return http.post('/project', projectDto)
            .then(response => {
                return response.data;
            });
    }
}

export default new ProjectService();