import Bun from "bun";
import { ProcessManager } from "../process";
import { MAX_PROCESS_COUNT, MIN_PROCESS_COUNT } from "../constants";

type Port = { port: number, isOccupied: boolean };

export class LoadBalancer {
    
    private static manager = ProcessManager.create({
        minProcesses: 1,
        maxProcesses: 5
    });
    
    private static avalaiblePorts: Array<Port> = new Array<Port>()
        .map((currentPort: Port, idx: number) => currentPort = { port: 3000 + idx, isOccupied: false} );

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
                    LoadBalancer._addProcess();
                } else if(process.isUnderloaded()) {
                    LoadBalancer._removeProcess();
                }
                                

                const { protocol, hostname, pathname } = new URL(req.url);

                const url = `${protocol}//${hostname}:${process.port}${pathname}`;

                const response = await fetch(url, {
                    headers: req.headers,
                    method: req.method
                });
                
                const data = await response.json();

                console.log(data);

                // Return the response from the child process.
                return new Response(data);
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

    private static _addProcess() {
        let avalaiblePort = LoadBalancer.avalaiblePorts.find((currentPort: Port) => currentPort.isOccupied = true);
        
        if(!avalaiblePort) return null;

        LoadBalancer.manager.addProcess({
            host: "localhost",
            port: avalaiblePort.port.toString()
        });

        console.log(`Occupying port: ${avalaiblePort}`);

        avalaiblePort.isOccupied = true;
    }

    private static _removeProcess() {
        let lastProcessPort = LoadBalancer.manager.killProcess();

        if(lastProcessPort === -1) return;

        const targetPort = LoadBalancer.avalaiblePorts.find((currentPort: Port) => currentPort.port = lastProcessPort);

        console.log(`Freeing port: ${targetPort}`);

        targetPort!.isOccupied = false;
    }
}