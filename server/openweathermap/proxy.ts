import http from 'http';
import {Request, Response} from 'express-serve-static-core';

export const proxyOpenRain = (req: Request, res: Response) => {
    const options = {
        port: 8087,
        host: 'localhost',
        path: req.params.step ? `/openrain/${req.params.step}` : '/openrain',
    };
    const proxyRequest = http.request(options);
    const chunks: Array<any> = [];
    proxyRequest.on('response', function(proxyResponse) {
        proxyResponse.on('data', function(chunk: Buffer) {
            chunks.push(chunk)
        });
        proxyResponse.on('end', function() {
            res.send(Buffer.concat(chunks))
        });
    });
    proxyRequest.on('error', function(err) {
        console.error('proxyOpenRain history err3 ->'.red, err);
        res.send(err)
    });
    req.on('data', function(chunk) {
        proxyRequest.write(chunk, 'binary');
    });
    req.on('end', function() {
        proxyRequest.end();
    });
};
