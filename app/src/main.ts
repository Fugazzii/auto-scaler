import { ProcessManager } from "./process";

function main() {

    const manager = ProcessManager.create(1, 5);

    manager.addProcess({ host: "localhost", port: "3000" });
    manager.addProcess({ host: "localhost", port: "3001" });

    manager.killProcess();

    console.log("Running...");
}

main();