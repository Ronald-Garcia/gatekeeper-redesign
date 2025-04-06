import { parentPort, workerData } from 'node:worker_threads';
import process from 'node:process';


console.log(workerData)
console.log('Hello TypeScript!');

// signal to parent that the job is done
if (parentPort) parentPort.postMessage('done');
else process.exit(0);