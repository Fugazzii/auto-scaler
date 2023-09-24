import { Subprocess, spawn } from "bun";

type ProcessData = {
    host: string,
    port: number
}

export class ProcessManager {
    
    private readonly processes: Array<Subprocess<"pipe", "pipe", "inherit">>;

    private constructor(
        private readonly servers: Array<ProcessData> = []
    ) {
        this.processes = [];
    }

    public static create(servers: Array<ProcessData> = []) {
        return new ProcessManager(servers);
    }

    public addProcess() {
        const path = "/home/ilia/Desktop/Node/load-balancer/examples/simple-server/target/debug/simple-server";
        const args = [];

        let process = spawn([path], {
            stdin: "pipe",
            stdout: "pipe"
        });

        this.processes.push(process);
    }

    public killProcess() {}

}