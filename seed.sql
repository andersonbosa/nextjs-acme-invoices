-- Habilita a extensão UUID se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS revenue;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS users;

-- Criação da tabela "users"
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Inserção de dados na tabela "users"
-- Exemplo de inserção com UUID gerado automaticamente
-- Substitua com os dados reais
INSERT INTO users (name, email, password)
VALUES ('John Doe', 'john@example.com', 'hashed-password')
ON CONFLICT (id) DO NOTHING;

-- Criação da tabela "invoices"
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID NOT NULL,
  amount INT NOT NULL,
  status VARCHAR(255) NOT NULL,
  date DATE NOT NULL
);

-- Inserção de dados na tabela "invoices"
-- Substitua com os dados reais
INSERT INTO invoices (customer_id, amount, status, date)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 100, 'paid', '2023-09-01')
ON CONFLICT (id) DO NOTHING;

-- Criação da tabela "customers"
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) NOT NULL
);

-- Inserção de dados na tabela "customers"
-- Substitua com os dados reais
INSERT INTO customers (name, email, image_url)
VALUES ('ACME Corp', 'contact@acme.com', 'https://example.com/image.png')
ON CONFLICT (id) DO NOTHING;

-- Criação da tabela "revenue"
CREATE TABLE IF NOT EXISTS revenue (
  month VARCHAR(4) NOT NULL UNIQUE,
  revenue INT NOT NULL
);

-- Inserção de dados na tabela "revenue"
-- Substitua com os dados reais
INSERT INTO revenue (month, revenue)
VALUES ('2023', 5000)
ON CONFLICT (month) DO NOTHING;
