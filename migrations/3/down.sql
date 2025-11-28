
-- Remove the index
DROP INDEX idx_usuarios_session_token;

-- Remove session_token column
ALTER TABLE usuarios DROP COLUMN session_token;
