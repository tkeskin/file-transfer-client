import http from "../http-common";

class AppConfigService {


    getAppConfig() {
        return http.get('/app-config');
    }

    deleteAppConfig(appConfigDto) {
        return http.get("/app-config/" + appConfigDto.configKey);
    }

    saveAppConfig(appConfigDto) {
        return http.post('/app-config', appConfigDto)
            .then(response => {
                return response.data;
            });
    }
}

export default new AppConfigService();