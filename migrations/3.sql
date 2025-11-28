
-- Add session_token column to usuarios table
ALTER TABLE usuarios ADD COLUMN session_token TEXT;

-- Create index for faster session lookups
CREATE INDEX idx_usuarios_session_token ON usuarios(session_token);
