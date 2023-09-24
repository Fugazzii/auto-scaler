import { Subprocess, spawn } from "bun";
import { ProcessParams } from ".";
import { Process } from ".";

type ManagerParams = { minProcesses: number, maxProcesses: number };

export class ProcessManager {
    
    private readonly processes: Array<Process>;

    private constructor(
        private minProcessCount = 1,
        private maxProcessCount = 5    
    ) {
        this.processes = [];
    }

    public static create({ minProcesses, maxProcesses }: ManagerParams) {
        return new ProcessManager(minProcesses, maxProcesses);
    }

    public addProcess({ host, port } : ProcessParams) {

        if(this.processes.length === this.maxProcessCount) {
            console.log(`You can not run more than ${this.maxProcessCount} processes`);
            return;
        }

        const path = "/home/ilia/Desktop/Node/load-balancer/examples/simple-server/target/debug/simple-server";

        const bunProcess = spawn([path, host, port], {
            stdin: "pipe",
            stdout: "pipe"
        });

        const process = new Process({ host, port }, bunProcess);

        this.processes.push(process);
    }

    public killProcess() {
        if(this.processes.length === this.minProcessCount) {
            console.log(`You can not run less than ${this.minProcessCount} processes`);
            return -1;
        }

        let lastProcess = this.processes.pop() as Process;
        const { port } = lastProcess;
        lastProcess.flush();
        lastProcess.end();
        lastProcess.kill();

        return Number(port);
    }

    public getLastProcess() {
        return this.processes[this.processes.length - 1];
    }

}