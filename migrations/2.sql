
-- Add password_hash column to usuarios table
ALTER TABLE usuarios ADD COLUMN password_hash TEXT;

-- Insert the initial administrator
INSERT INTO usuarios (nombre, apellido, email, rol, password_hash, is_active) 
VALUES ('Victor', 'Valdez', 'vivaldez@gmail.com', 'administrador', '$argon2id$v=19$m=65536,t=3,p=4$initial$hash', 1);
