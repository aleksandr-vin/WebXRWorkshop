import express from "express";
import path from "path";
import http from "http";
import https from "https";
import fs from "fs";

const privateKey = fs.readFileSync( 'key.pem', 'utf8' );
const certificate = fs.readFileSync( 'cert.pem', 'utf8' );

const port: number = 3000;
const sslPort: number = 3443;

class App {
    private server: http.Server;
    private sslServer: https.Server;
    private port: number;
    private sslPort: number;

    constructor( port: number, sslPort: number ) {
        this.port = port;
        this.sslPort = sslPort;
        const app = express();
        app.use( express.static( path.join( __dirname, "../client" ) ) );
        app.use(
            "/build/three.module.js",
            express.static( path.join( __dirname, "../../node_modules/three/build/three.module.js" ) )
        );

        app.use( "/jsm/:folder/:file", ( req, res ) => {
            res.sendFile(
                path.join(
                    __dirname,
                    "../../node_modules/three/examples/jsm/" + req.params.folder + "/" + req.params.file + ".js"
                )
            );
        } );

        app.use( "/assets/:folder/:file", ( req, res ) => {
            res.sendFile( path.join( __dirname, "../../dist/client/assets/" + req.params.folder + "/" + req.params.file ) );
        } );

        this.server = new http.Server( app );
        this.sslServer = new https.Server( { key: privateKey, cert: certificate }, app );
    }

    public Start () {
        this.server.listen( this.port, () => {
            console.log( `Server listening on port ${ this.port }.` );
        } );
        this.sslServer.listen( this.sslPort, () => {
            console.log( `SSL server listening on port ${ this.sslPort }.` );
        } );
    }
}

new App( port, sslPort ).Start();
