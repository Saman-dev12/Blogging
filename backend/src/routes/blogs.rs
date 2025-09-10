use axum::{
    extract::{Extension, Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde_json::json;
use uuid::Uuid;

use crate::state::blogdata::{Blog, CreateBlogPayload, UpdateBlogPayload};
use crate::state::state::AppState;

pub fn router() -> axum::Router<AppState> {
    axum::Router::new()
        .route("/blogs", axum::routing::post(create_blog))
        .route("/blogs/:id", axum::routing::delete(delete_blog))
        .route("/blogs/:id", axum::routing::put(update_blog))
        .route("/blogs/:id", axum::routing::get(get_blog))
        .route("/blogs", axum::routing::get(get_blogs))
}

pub async fn create_blog(
    State(state): State<AppState>,
    Extension(user_id): Extension<String>,
    Json(payload): Json<CreateBlogPayload>,
) -> impl IntoResponse {
    let user_uuid = match Uuid::parse_str(&user_id) {
        Ok(id) => id,
        Err(_) => return (StatusCode::BAD_REQUEST, Json(json!({"error": "Invalid user ID"}))).into_response(),
    };

    let result = sqlx::query!(
        "INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING id, created_at, updated_at",
        payload.title,
        payload.content,
        user_uuid
    )
    .fetch_one(&state.db)
    .await;

    match result {
        Ok(blog) => {
            let blog_response = Blog {
                id: Some(blog.id),
                title: Some(payload.title),
                content: Some(payload.content),
                author_id: Some(user_uuid),
                created_at: blog.created_at,
                updated_at: blog.updated_at,
            };
            (StatusCode::CREATED, Json(json!({"blog": blog_response}))).into_response()
        }
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": format!("Database error: {}", e)}))).into_response(),
    }
}

pub async fn delete_blog(
    State(state): State<AppState>,
    Extension(user_id): Extension<String>,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    let user_uuid = match Uuid::parse_str(&user_id) {
        Ok(id) => id,
        Err(_) => return (StatusCode::BAD_REQUEST, Json(json!({"error": "Invalid user ID"}))).into_response(),
    };

    let result = sqlx::query!(
        "DELETE FROM posts WHERE id = $1 AND author_id = $2",
        id,
        user_uuid
    )
    .execute(&state.db)
    .await;

    match result {
        Ok(rows) => {
            if rows.rows_affected() == 0 {
                (StatusCode::NOT_FOUND, Json(json!({"error": "Blog not found or not authorized"}))).into_response()
            } else {
                (StatusCode::OK, Json(json!({"message": "Blog deleted successfully"}))).into_response()
            }
        }
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": format!("Database error: {}", e)}))).into_response(),
    }
}

pub async fn update_blog(
    State(state): State<AppState>,
    Extension(user_id): Extension<String>,
    Path(id): Path<Uuid>,
    Json(payload): Json<UpdateBlogPayload>,
) -> impl IntoResponse {
    let user_uuid = match Uuid::parse_str(&user_id) {
        Ok(id) => id,
        Err(_) => return (StatusCode::BAD_REQUEST, Json(json!({"error": "Invalid user ID"}))).into_response(),
    };

    let result = sqlx::query!(
        "UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 AND author_id = $4 RETURNING created_at, updated_at",
        payload.title,
        payload.content,
        id,
        user_uuid
    )
    .fetch_one(&state.db)
    .await;

    match result {
        Ok(blog) => {
            let blog_response = Blog {
                id: Some(id),
                title: Some(payload.title),
                content: Some(payload.content),
                author_id: Some(user_uuid),
                created_at: blog.created_at,
                updated_at: blog.updated_at,
            };
            (StatusCode::OK, Json(json!({"blog": blog_response}))).into_response()
        }
        Err(sqlx::Error::RowNotFound) => (StatusCode::NOT_FOUND, Json(json!({"error": "Blog not found or not authorized"}))).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": format!("Database error: {}", e)}))).into_response(),
    }
}

pub async fn get_blog(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> impl IntoResponse {
    let result = sqlx::query_as!(
        Blog,
        "SELECT id, title, content, author_id, created_at, updated_at FROM posts WHERE id = $1",
        id
    )
    .fetch_one(&state.db)
    .await;

    match result {
        Ok(blog) => (StatusCode::OK, Json(json!({"blog": blog}))).into_response(),
        Err(sqlx::Error::RowNotFound) => (StatusCode::NOT_FOUND, Json(json!({"error": "Blog not found"}))).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": format!("Database error: {}", e)}))).into_response(),
    }
}

pub async fn get_blogs(
    State(state): State<AppState>,
    Extension(user_id): Extension<String>,
) -> impl IntoResponse {
    let user_uuid = match Uuid::parse_str(&user_id) {
        Ok(id) => id,
        Err(_) => return (StatusCode::BAD_REQUEST, Json(json!({"error": "Invalid user ID"}))).into_response(),
    };

    let result = sqlx::query_as!(
        Blog,
        "SELECT id, title, content, author_id, created_at, updated_at FROM posts WHERE author_id = $1 ORDER BY created_at DESC",
        user_uuid
    )
    .fetch_all(&state.db)
    .await;

    match result {
        Ok(blogs) => (StatusCode::OK, Json(json!({"blogs": blogs}))).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": format!("Database error: {}", e)}))).into_response(),
    }
}
