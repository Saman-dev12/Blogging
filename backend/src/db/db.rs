use anyhow::Result;
use sqlx::PgPool;

pub async fn connect(database_url: &str) -> Result<PgPool> {
    let pool = PgPool::connect(database_url).await?;
    Ok(pool)
}
