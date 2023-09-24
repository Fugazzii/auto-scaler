import Bun from "bun";
import { ProcessManager } from "../process";

export class LoadBalancer {
    
    private static manager = ProcessManager.create({
        minProcesses: 1,
        maxProcesses: 5
    });
    
    public constructor() {}

    public init() {

        // Initialize minimum number of processes
        this._initializeProcesses();

        Bun.serve({
            fetch(req, server) {
                // Get a child process from the manager
                const process = LoadBalancer.manager.getLastProcess();

                // If the child process is overloaded, start a new child process.
                if (process.isOverloaded()) {
                    LoadBalancer.manager.addProcess({
                        host: "localhost",
                        port: "5000"
                    });
                } else if(process.isUnderloaded()) {
                    LoadBalancer.manager.killProcess();
                }
                                
                // Forward the request to the child process.
                const childRequest = new Request(req.url, {
                    method: req.method,
                    headers: req.headers
                });

                process.write(childRequest.toString());

                // Return the response from the child process.
                return new Response();
            },
            hostname: "localhost",
            port: 5000
        });
    }

    private _initializeProcesses() {
        for(let i = 0; i < 1; i++) {
            LoadBalancer.manager.addProcess({
                host: "localhost",
                port: String(3000 + i)
            });
        }
    }
}