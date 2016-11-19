import glob from 'glob';
import path from 'path';
import { spawn } from 'child_process';

export default function run(done) {
    glob(path.join(__dirname, 'benchs/memory-*'), (err, files) => {
        if (err) {
            return done(err);
        }

        console.log('Found files', files.length);

        const next = () => {
            if (!files.length) {
                return done();
            }

            const file = files.shift();
            const proc = spawn('node', [
                '--expose-gc',
                '-e',
                `require("babel-register"); require("${file}");`
            ]);

            proc.on('error', done);
            proc.on('exit', next);

            proc.stderr.on('data', (data) => {
                done(data.toString());
            });

            proc.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            return null;
        };

        return next();
    });
}
