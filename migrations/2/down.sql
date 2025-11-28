
-- Remove the initial administrator
DELETE FROM usuarios WHERE email = 'vivaldez@gmail.com';

-- Remove password_hash column
ALTER TABLE usuarios DROP COLUMN password_hash;
