use actix_web::{get, App, HttpServer, Responder};

#[get("/ping")]
async fn greet() -> impl Responder {
    format!("pong!\n")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new().service(greet)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}