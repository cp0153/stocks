import express from 'express'
import multer from 'multer';
import { readTradesFromCsv } from './services/TradesFromCsv';

const upload = multer();

class App {
    public express

    constructor() {
        this.express = express()
        this.mountRoutes()
    }

    private mountRoutes(): void {
        const router = express.Router()
        router.get('/about', (req, res) => {
            res.status(200).json({ 'temp': 'temp' });
        });

        router.get('/about2', (req, res) => {
            res.status(200).json({ 'fdfd': 'fdfd' });
        });

        router.post('/file', upload.single('trades'), (req, res) => {
                let file = req.file;
                console.log(file);
                console.log(req.body.user);
                if (file) {
                    readTradesFromCsv(file.buffer);
                    res.status(200).json("file uploaded");
                } else {
                    throw Error("problem uploading file");
                }
        });


        this.express.use('/', router);
    }
}

export default new App().express