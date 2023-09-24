use actix_web::{get, App, HttpServer, Responder};
use std::env;

#[get("/ping")]
async fn ping() -> impl Responder {
    format!("pong!\n")
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
