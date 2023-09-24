import Bun from "bun";
import { ProcessManager } from "../process";
import { MIN_PROCESS_COUNT } from "../constants";

// Define a type for Port information
type Port = { port: number, isOccupied: boolean };

/**
 * Represents a load balancer that manages child processes.
 */
export class AutoScaler {

    // Static manager for process management
    private static manager = ProcessManager.create({
        minProcesses: 1,
        maxProcesses: 5
    });

    // Array of available ports for child processes
    private static availablePorts: Array<Port> = new Array<Port>()
        .map((_currentPort: Port, idx: number) => _currentPort = { port: 3000 + idx, isOccupied: false } );

    /**
     * Creates an instance of the AutoScaler class.
     */
    public constructor() {}

    /**
     * Initializes the load balancer.
     */
    public init() {
        // Initialize the minimum number of processes
        this._initializeProcesses();

        Bun.serve({
            async fetch(req, server) {
                // Get last child process from the manager
                const process = AutoScaler.manager.getLastProcess();

                process.increaseRequest();

                /**
                    If the child process is overloaded, start a new child process,
                    if child process is underloaded, kill it
                 */
                if (process.isOverloaded()) {
                    AutoScaler._addProcess();
                } else if (process.isUnderloaded()) {
                    AutoScaler._removeProcess();
                }

                const { protocol, hostname, pathname } = new URL(req.url);
                const url = `${protocol}//${hostname}:${process.port}${pathname}`;

                const response = await fetch(url, {
                    headers: req.headers,
                    method: req.method
                });

                const data = await response.json();

                console.log(data);

                return new Response(data);
            },
            hostname: "localhost",
            port: 5000
        });
    }

    /** 
     * Initializes the minimum number of processes
     * Thid method is only called once
    */
    private _initializeProcesses() {
        for (let i = 0; i < MIN_PROCESS_COUNT; i++) {
            AutoScaler.manager.addProcess({
                host: "localhost",
                port: String(3000 + i)
            });
        }
    }

    /**
     * Adds a process and occupies a port
     * @returns void
     */
    private static _addProcess() {
        let availablePort = AutoScaler.availablePorts.find((currentPort: Port) => !currentPort.isOccupied);

        if (!availablePort) return;

        AutoScaler.manager.addProcess({
            host: "localhost",
            port: availablePort.port.toString()
        });

        console.log(`Occupying port: ${availablePort.port}`);

        availablePort.isOccupied = true;
    }

    /**
     * Terminates child process and frees up that port
     * @returns void
     */
    private static _removeProcess() {
        let lastProcessPort = AutoScaler.manager.killProcess();

        if (lastProcessPort === -1) return;

        const targetPort = AutoScaler.availablePorts.find((currentPort: Port) => currentPort.port === lastProcessPort);

        console.log(`Freeing port: ${targetPort?.port}`);

        targetPort!.isOccupied = false;
    }
}
