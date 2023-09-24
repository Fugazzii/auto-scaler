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
            async fetch(req, server) {
                // Get a child process from the manager
                const process = LoadBalancer.manager.getLastProcess();

                // If the child process is overloaded, start a new child process.
                if (process.isOverloaded()) {
                    LoadBalancer.manager.addProcess({
                        host: "localhost",
                        port: "3000"
                    });
                } else if(process.isUnderloaded()) {
                    LoadBalancer.manager.killProcess();
                }
                                

                const { protocol, hostname, pathname } = new URL(req.url);

                const url = `${protocol}//${hostname}:${process.port}${pathname}`;

                const response = await fetch(url, {
                    headers: req.headers,
                    method: req.method
                });
                
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