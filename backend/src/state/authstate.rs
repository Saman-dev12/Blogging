use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterPayload {
    username: String,
    email: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginPayload {
    email: String,
    password: String,
}
