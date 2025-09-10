use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct CreateBlogPayload{
    pub title: String,
    pub content: String,
    pub author_id: uuid::Uuid,
}

#[derive(Serialize, Deserialize)]
pub struct UpdateBlogPayload {
    pub title: String,
    pub content: String,
}

#[derive(Serialize, Deserialize)]
pub struct Blog {
    pub id: Option<uuid::Uuid>,
    pub title: Option<String>,
    pub content: Option<String>,
    pub author_id: Option<uuid::Uuid>,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}