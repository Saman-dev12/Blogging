use crate::state::{authdata::{LoginPayload, RegisterPayload}, state::AppState};
use axum::{extract::{Json, State}, response::IntoResponse};
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use argon2::password_hash::{SaltString,rand_core::OsRng};
use serde_json::json;

async fn register(State(state): State<AppState>,Json(payload): Json<RegisterPayload>)  -> impl IntoResponse {
    let salt = SaltString::generate(&mut OsRng);
    let hashed_password = Argon2::default().hash_password( payload.password.as_bytes(), &salt).unwrap().to_string();


    let user = sqlx::query!("INSERT INTO USERS (username,email,password_hash) VALUES($1,$2,$3)",payload.username,payload.email,hashed_password).execute(&state.db).await;

    match user {
        Ok(_) => Json(json!({"message": "User registered"})),
        Err(e) => Json(json!({"error": format!("DB error: {}", e)})),
    }
}
async fn login(State(state): State<AppState>,Json(payload): Json<LoginPayload>)  -> impl IntoResponse {}
