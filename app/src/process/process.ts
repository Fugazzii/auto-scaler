import { Subprocess } from "bun";

export type ProcessParams = { host: string, port: string };
type ChildProcess = Subprocess<"pipe", "pipe", "inherit">;

export class Process {
    
    private requestsInLastMinute: number;
    private requestsPerSecond: number;
    private minutesRunning: number;

    public constructor(
        private readonly params: ProcessParams,
        private readonly process: ChildProcess
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

    public isOverloaded() { return this.minutesRunning > 2 && this.requestsPerSecond > 10; }
    public isUnderloaded() { return this.minutesRunning > 2 && this.requestsInLastMinute < 3; }

    public increaseRequest() { this.requestsInLastMinute++; }

    public get host() { return this.params.host; }
    public get port() { return this.params.port; }

    public flush() { return this.process.stdin.flush(); }
    public end() { return this.process.stdin.end(); }
    public kill() { this.process.kill(); }
    public write(str: string) { return this.process.stdin.write(str); }

    private _handlerMinutePass() {
        if(this.requestsPerSecond === -1) return;

        this.requestsPerSecond = this.requestsInLastMinute / 60;
        this.requestsInLastMinute = 0;
        this.minutesRunning++;
    }


}