/**
 * Simple server implementation with one GET route
 */


use actix_web::{get, App, HttpServer, Responder, HttpResponse};
use serde::Serialize;
use std::env;

#[derive(Serialize)]
struct PingResponse {
    data: String
}

#[get("/ping")]
async fn ping() -> impl Responder {
    HttpResponse::Ok()
        .json(PingResponse { data: "pong!".to_string() })
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let args: Vec<String> = env::args().collect();
    let host = args.get(1).expect("Invalid host");
    let port_str = args.get(2).expect("Invalid port");
    let port = port_str.parse::<u16>().unwrap_or(8080);

    HttpServer::new(|| {
        App::new().service(ping)
    })
    .bind((host.clone(), port))?
    .run()
    .await
}
