use crate::state::authstate::{LoginPayload, RegisterPayload};
use axum::extract::Json;
async fn register(Json(payload): Json<RegisterPayload>) {}
async fn login(Json(payload): Json<LoginPayload>) {}
