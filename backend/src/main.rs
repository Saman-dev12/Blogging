use axum::{middleware::from_fn_with_state, Router, routing::get};
use std::net::SocketAddr;
use tracing_subscriber;
use dotenv::dotenv;
use std::env;
use sqlx::postgres::PgPoolOptions;
use tower::ServiceBuilder;
use tower_http::cors::CorsLayer;

mod middleware;
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

    
    let app_state = state::state::AppState {
        db: _pool,
        jwt_secret: env::var("JWT_SECRET").unwrap_or("my-secret-key".to_string()),
    };

    // Configure CORS - allow all origins for development
    let cors = CorsLayer::very_permissive();

    let app = Router::new()
        .route("/health", get(|| async { "ok" }))
        .nest("/", routes::auth::router())
        .nest("/api", 
            routes::blogs::router()
                .layer(from_fn_with_state(
                    app_state.clone(),
                    crate::middleware::auth_middleware
                ))
        )
        .layer(ServiceBuilder::new().layer(cors))
        .with_state(app_state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    tracing::info!("🚀 Server running on http://0.0.0.0:3000");

    axum::serve(listener, app).await.unwrap();
}
