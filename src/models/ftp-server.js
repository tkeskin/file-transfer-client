export default class FtpServerDto {
    constructor(id, name, protocol, hostAdress, port, username, password) {
        this.id = id;
        this.name = name;
        this.protocol = protocol;
        this.hostAdress = hostAdress;
        this.port = port;
        this.username = username;
        this.password = password;
    }
}
