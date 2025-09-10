use axum::{Router, routing::get};
use std::net::SocketAddr;
use tracing_subscriber;
use dotenv::dotenv;
use std::env;
use sqlx::postgres::PgPoolOptions;

mod routes;
mod state;

#[tokio::main]
async fn main() {
    // init logging + dotenv
    tracing_subscriber::fmt::init();
    dotenv().ok();

    // Load env vars
    let db_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env or environment");
    
    tracing::info!("Using database: {}", db_url);

    let _pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await
        .expect("Failed to connect to database");

    
    let app = Router::new()
        .route("/health", get(|| async { "ok" }))
        .merge(routes::auth::router()).with_state(state::state::AppState {
            db: _pool,
            jwt_secret: env::var("JWT_SECRET").unwrap_or("my-secret-key".to_string()),
        });

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    tracing::info!("🚀 Server running on http://{}", addr);

    axum::serve(listener, app).await.unwrap();
}
