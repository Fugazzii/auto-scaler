import { describe, test, expect } from "bun:test";

// Define the URL of your Actix Web server
const serverUrl = 'http://localhost:8080';

describe('Process Manager', () => {

    test('GET /ping should return "pong!"', async () => {

        const path = "/home/ilia/Desktop/Node/load-balancer/examples/simple-server/target/debug/simple-server";
        const args = [];

        const process = Bun.spawn([path], {
            stdin: "pipe",
            stdout: "pipe"
        });

        // Send a GET request to the /ping endpoint
        const response: Response = await fetch(`${serverUrl}/ping`);

        // Assert that the response status code is 200 OK
        expect(response.status).toBe(200);
      
        // Assert that the response body is "pong!"
        expect(response.ok).toBe(true);

        process.kill();
    });

});