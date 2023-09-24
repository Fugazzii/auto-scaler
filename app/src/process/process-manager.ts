import { Subprocess, spawn } from "bun";

type ProcessParams = { host: string, port: string };
type ChildProcess = Subprocess<"pipe", "pipe", "inherit">;

export class ProcessManager {
    
    private static minProcessCount = 1;
    private static maxProcessCount = 5;
    private readonly processes: Array<ChildProcess>;

    private constructor() {
        this.processes = [];
    }

    public static create() {
        return new ProcessManager();
    }

    public addProcess({ host, port } : ProcessParams) {

        if(this.processes.length === ProcessManager.maxProcessCount) {
            console.log(`You can not run more than ${ProcessManager.maxProcessCount} processes`);
            return;
        }

        const path = "/home/ilia/Desktop/Node/load-balancer/examples/simple-server/target/debug/simple-server";
        const args = [];

        let process = spawn([path, host, port], {
            stdin: "pipe",
            stdout: "pipe"
        });

        this.processes.push(process);
    }

    public killProcess() {
        if(this.processes.length <= ProcessManager.minProcessCount) {
            console.log(`You can not run less than ${ProcessManager.minProcessCount} processes`);
            return;
        }

        let lastProcess = this.processes.pop() as ChildProcess;
        lastProcess.kill();
    }

}