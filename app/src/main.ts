import { ProcessManager } from "./process";

function main() {

    const manager = ProcessManager.create();

    manager.addProcess({ host: "localhost", port: "3000" });
    manager.addProcess({ host: "localhost", port: "3001" });

    console.log("Running...");
}

main();