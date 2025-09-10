use crate::state::{authdata::{LoginPayload, RegisterPayload}, state::AppState};
use axum::{extract::{Json, State}, response::IntoResponse};
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use argon2::password_hash::{SaltString,rand_core::OsRng};
use serde_json::json;
use serde::{Deserialize, Serialize};


pub fn router() -> axum::Router<AppState> {
    axum::Router::new()
        .route("/register", axum::routing::post(register))
        .route("/login", axum::routing::post(login))
}


#[derive(Serialize, Deserialize)]
struct Claim {
    sub: String,
    exp: usize,
}

pub async fn register(State(state): State<AppState>,Json(payload): Json<RegisterPayload>)  -> impl IntoResponse {
    let salt = SaltString::generate(&mut OsRng);
    let hashed_password = Argon2::default().hash_password( payload.password.as_bytes(), &salt).unwrap().to_string();


    let user = sqlx::query!("INSERT INTO USERS (username,email,password_hash) VALUES($1,$2,$3)",payload.username,payload.email,hashed_password).execute(&state.db).await;

    match user {
        Ok(_) => Json(json!({"message": "User registered"})),
        Err(e) => Json(json!({"error": format!("DB error: {}", e)})),
    }
}
pub async fn login(State(state): State<AppState>,Json(payload): Json<LoginPayload>)  -> impl IntoResponse {
    let user = sqlx::query!("SELECT * FROM USERS WHERE email=$1",payload.email).fetch_one(&state.db).await;

    match user {
        Ok(user) => {
            let parsed_hash = PasswordHash::new(&user.password_hash).unwrap();
            if Argon2::default().verify_password(payload.password.as_bytes(), &parsed_hash).is_ok() {
                let claim = Claim{
                    sub : user.id.to_string(),
                    exp : (chrono::Utc::now() + chrono::Duration::hours(24)).timestamp() as usize,
                };
                let token = jsonwebtoken::encode(&jsonwebtoken::Header::default(), &claim, &jsonwebtoken::EncodingKey::from_secret(state.jwt_secret.as_ref())).unwrap();
                Json(json!({"message": "Login successful", "token": token}))
            } else {
                Json(json!({"error": "Invalid credentials"}))
            }
        },
        Err(_) => Json(json!({"error": "User not found"})),
    }
}
