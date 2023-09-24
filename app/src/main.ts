/**
 * Entry file of the balancer
 */

import { AutoScaler } from "./auto-scaler";

function main() {
    const balancer = new AutoScaler();

    balancer.init();
}

main();