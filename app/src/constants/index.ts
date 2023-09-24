/**
 * Variables that defined how much process can server have (min-max)
 */
export const MIN_PROCESS_COUNT = 1;
export const MAX_PROCESS_COUNT = 5;
export const TOTAL_PORTS = MAX_PROCESS_COUNT - MIN_PROCESS_COUNT;

/**
 * Constants that define what is considered as too many/few requests for process
 * We generate or kill processes depending on them
 */
export const TOO_MANY_REQUESTS = 10;
export const TOO_FEW_REQUESTS = 10;