import { spawn } from "bun";
import { ProcessParams } from ".";
import { Process } from ".";

// We should define max and min amount of process we can have
type ManagerParams = { minProcesses: number, maxProcesses: number };

/**
 * Class that manages processes
 */
export class ProcessManager {
    
    /** Represents an array of process instances managed by the ProcessManager. */
    private readonly processes: Array<Process>;

    /**
     * Creates a new instance of the ProcessManager class.
     * @param minProcessCount - The minimum number of processes to maintain (default: 1).
     * @param maxProcessCount - The maximum number of processes to create (default: 5).
     */
    private constructor(
        private minProcessCount = 1,
        private maxProcessCount = 5
    ) {
        this.processes = []; // Array to store process instances
    }


    /**
     * Constructor method
     * @param ManagerParams 
     * @returns ProcessManager
     */
    public static create({ minProcesses, maxProcesses }: ManagerParams) {
        return new ProcessManager(minProcesses, maxProcesses);
    }

    /**
    * Adds a new process to the ProcessManager with the specified host and port.
    *
    * @param ProcessParams - An object containing process configuration parameters.
    *   - `host`: The host or IP address on which the new process will run.
    *   - `port`: The port on which the new process will listen.
    * @returns void
    */
    public addProcess({ host, port } : ProcessParams): void {
        if(this.processes.length === this.maxProcessCount) {
            console.log(`You can not run more than ${this.maxProcessCount} processes`);
            return;
        }

        const path = Bun.env.EXE_FILE_PATH as string;

        const bunProcess = spawn([path, host, port], {
            stdin: "pipe",
            stdout: "pipe"
        });

        const process = new Process({ host, port }, bunProcess);

        this.processes.push(process);
        process.run();
    }

    /**
     * Terminates and kills the associated process.
     * @returns The exit code of the terminated process.
     */
    public killProcess(): number {
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

    public getLastProcess() { return this.processes[this.processes.length - 1]; }
}