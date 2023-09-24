import { ProcessManager } from "./process";

function main() {

    const servers = [
        { host: "127.0.0.1", port: 8080 }
    ];

    const manager = ProcessManager.create(servers);

    manager.addProcess();

    console.log("Running...");
}

main();