import { ProcessManager } from "./process";

export class LoadBalancer {
    
    private readonly manager: ProcessManager;
    
    public constructor() {
        this.manager = ProcessManager.create({
            minProcesses: 1,
            maxProcesses: 5
        });
    }

    public init() {
        Bun.serve({
            fetch(req, server) {
                return new Response();
            },
            hostname: "localhost",
            port: 5000
        });
    }
}

function main() {
    const manager = ProcessManager.create({
        minProcesses: 1,
        maxProcesses: 5
    });

    manager.addProcess({ host: "localhost", port: "3000" });
    manager.addProcess({ host: "localhost", port: "3001" });

    manager.killProcess();

    console.log("Running...");
}

main();