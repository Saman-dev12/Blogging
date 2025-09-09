use axum::{Router, routing::get};
use std::net::SocketAddr;
use tracing_subscriber;

mod routes;
mod state;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let app = Router::new().route("/health", get(|| async { "ok" }));
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listner = tokio::net::TcpListener::bind(addr).await.unwrap();
    print!("server is running on 3000");
    axum::serve(listner, app).await.unwrap();
}
