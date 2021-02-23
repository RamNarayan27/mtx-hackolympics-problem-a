const { exec } = require('child_process');
const { Storage } = require('@google-cloud/storage');

let args = process.argv.slice(2);

function cmdExec(cmd){
    let prom = new Promise((resolve,reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log(`command error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`command stderr: ${stderr}`);
                return;
            }
            console.log(`command stdout: ${stdout}`);
            resolve(1);
        });
    })
    return prom;
}

function gcpGet(args){
    const projectId = 'mtx-hackolympics';
    const keyFilename = '/home/ram/Downloads/MTX-Hackolympics-47e0b52adc45.json';
    const storage = new Storage({projectId, keyFilename});
    const bucket = storage.bucket('mtx-hackolympics-problem-a-bucket');
    let command = 's3cmd ';
    let i = 0;
    if(args[0] != 'gcp-get'){
        if(args[0] == 'upload') args[0] = 'put';
        for(i = 0; i < args.length; i++){
            command += args[i] + ' ';
        }
        console.log('final command is ',command);
        cmdExec(command);
    }
    else{
        command = 's3cmd get ';
        for(i = 1; i < args.length; i++){
            command += args[i] + ' ';
        }
        cmdExec(command).then((result) => {
            bucket.upload(args[args.length - 1],(err,file,apiResponse) => {
                if(err) console.log('error',err);
                console.log('finis')
            });
        });
    } 
}

gcpGet(args);