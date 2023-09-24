import { Subprocess } from "bun";

export type ProcessParams = { host: string, port: string };
type ChildProcess = Subprocess<"pipe", "pipe", "inherit">;

export class Process {
    
    private requestsInLastMinute: number;
    private requestsPerSecond: number;
    private minutesRunning: number;

    public constructor(
        private readonly params: ProcessParams,
        private readonly childProcess: ChildProcess
    ) {
        this.requestsInLastMinute = 0;
        this.requestsPerSecond = -1;
        this.minutesRunning = 0;
    }

    public run() {
        setInterval(() => {
            this._handlerMinutePass();
        }, 60 * 1000);
    }

    public isOverloaded() { 
        return this.minutesRunning > 2 && this.requestsPerSecond > 10;
    }

    public increaseRequest() { this.requestsInLastMinute++; }

    public get process() { return this.childProcess; }
    public get host() { return this.params.host; }
    public get port() { return this.params.port; }

    private _handlerMinutePass() {
        if(this.requestsPerSecond === -1) return;

        this.requestsPerSecond = this.requestsInLastMinute / 60;
        this.requestsInLastMinute = 0;
        this.minutesRunning++;
    }

}