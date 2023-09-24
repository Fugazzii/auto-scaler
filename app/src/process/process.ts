import { Subprocess } from "bun";
import { TOO_FEW_REQUESTS, TOO_MANY_REQUESTS } from "../constants";

/** Define Reusable types */
export type ProcessParams = { host: string, port: string };
type ChildProcess = Subprocess<"pipe", "pipe", "inherit">;

/**
 * Class for each process
 * By process I mean a single server that is running
 */
export class Process {

    private requestsInLastMinute: number; // Number of incoming requests in the process
    private requestsPerSecond: number; // Rate of the request in overall
    private minutesRunning: number; // Time since this process is running

    /**
     * Creates an instance of the Process class.
     * @param params - An object containing process configuration parameters.
     *   - `port`: The port on which the process is running.
     *   - `host`: The host or IP address on which the process is accessible.
     * @param process - The ChildProcess object representing the subprocess imported from Bun.
     */
    public constructor(
        private readonly params: ProcessParams,
        private readonly process: ChildProcess
    ) {
        this.requestsInLastMinute = 0; // Number of requests received in the last minute
        this.requestsPerSecond = -1; // Requests per second (initialized to -1)
        this.minutesRunning = 0; // Number of minutes the process has been running
    }

    /** 
     * After running the process we need update information in every second
     * to determine server overloaded or underloaded
     * */
    public run() {
        setInterval(() => {
            this._handlerMinutePass();
        }, 60 * 1000);    
    }

    /**
     * Defining what is considered as overloaded/underloaded server
     * */
    public isOverloaded() { return this.minutesRunning > 2 && this.requestsPerSecond > TOO_MANY_REQUESTS; }
    public isUnderloaded() { return this.minutesRunning > 2 && this.requestsInLastMinute < TOO_FEW_REQUESTS; }

    public increaseRequest() { this.requestsInLastMinute++; }

    public get host() { return this.params.host; }
    public get port() { return this.params.port; }

    /**
     * Abstraction for bun child process module
     */
    public flush() { return this.process.stdin.flush(); }
    public end() { return this.process.stdin.end(); }
    public kill() { this.process.kill(); }
    public write(str: string) { return this.process.stdin.write(str); }

    /**
     * Handling updating process information after a minute
     * If it is very first minute after running the process, just ignoring it
     */
    private _handlerMinutePass() {
        if(this.requestsInLastMinute === -1) return;

        this.requestsPerSecond = this.requestsInLastMinute / 60;
        this.requestsInLastMinute = 0;
        this.minutesRunning++;
    }


}