type Process = {
    host: string,
    port: number
}

export class ProcessManager {
    
    public constructor(private readonly servers: Array<Process>) {}

    public start() {}

    public kill() {}
    
}