/**
 * Entry file of the scaler
 */

import { AutoScaler } from "./auto-scaler";

function main() {
    const scaler = new AutoScaler();

    scaler.init();
}

main();