/**
 * Entry file of the balancer
 */

import { LoadBalancer } from "./balancer";

function main() {
    const balancer = new LoadBalancer();

    balancer.init();
}

main();