"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const privateKey = fs_1.default.readFileSync('key.pem', 'utf8');
const certificate = fs_1.default.readFileSync('cert.pem', 'utf8');
const port = 3000;
const sslPort = 3443;
class App {
    constructor(port, sslPort) {
        this.port = port;
        this.sslPort = sslPort;
        const app = express_1.default();
        app.use(express_1.default.static(path_1.default.join(__dirname, "../client")));
        app.use("/build/three.module.js", express_1.default.static(path_1.default.join(__dirname, "../../node_modules/three/build/three.module.js")));
        app.use("/jsm/:folder/:file", (req, res) => {
            res.sendFile(path_1.default.join(__dirname, "../../node_modules/three/examples/jsm/" + req.params.folder + "/" + req.params.file + ".js"));
        });
        app.use("/assets/:folder/:file", (req, res) => {
            res.sendFile(path_1.default.join(__dirname, "../../dist/client/assets/" + req.params.folder + "/" + req.params.file));
        });
        this.server = new http_1.default.Server(app);
        this.sslServer = new https_1.default.Server({ key: privateKey, cert: certificate }, app);
    }
    Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`);
        });
        this.sslServer.listen(this.sslPort, () => {
            console.log(`SSL server listening on port ${this.sslPort}.`);
        });
    }
}
new App(port, sslPort).Start();
//# sourceMappingURL=server.js.map