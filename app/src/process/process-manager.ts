import { Subprocess, spawn } from "bun";

type ProcessParams = { host: string, port: string };
type ChildProcess = Subprocess<"pipe", "pipe", "inherit">;

export class ProcessManager {
    
    private readonly processes: Array<ChildProcess>;

    private constructor(
        private minProcessCount = 1,
        private maxProcessCount = 5    
    ) {
        this.processes = [];
    }

    public static create(minProc: number, maxProc: number) {
        return new ProcessManager(minProc, maxProc);
    }

    public addProcess({ host, port } : ProcessParams) {

        if(this.processes.length === this.maxProcessCount) {
            console.log(`You can not run more than ${this.maxProcessCount} processes`);
            return;
        }

        const path = "/home/ilia/Desktop/Node/load-balancer/examples/simple-server/target/debug/simple-server";

        let process = spawn([path, host, port], {
            stdin: "pipe",
            stdout: "pipe"
        });

        this.processes.push(process);
    }

    public killProcess() {
        if(this.processes.length === this.minProcessCount) {
            console.log(`You can not run less than ${this.minProcessCount} processes`);
            return;
        }

        let lastProcess = this.processes.pop() as ChildProcess;
        lastProcess.stdin.flush();
        lastProcess.stdin.end();
        lastProcess.kill();
    }

}