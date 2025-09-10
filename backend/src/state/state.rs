use sqlx::PgPool;

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub jwt_secret: String,
}

// Note: We removed the Default implementation as it was using unsafe code
// The middleware is applied at the application level instead
