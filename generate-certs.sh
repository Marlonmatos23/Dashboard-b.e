#!/bin/bash

# Cria a pasta certs se não existir
mkdir -p certs

# Gera a chave privada e o certificado auto-assinado válido por 365 dias
# -subj evita que o comando pergunte país, estado, etc. interativamente
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout certs/nginx-selfsigned.key \
  -out certs/nginx-selfsigned.crt \
  -subj "/C=BR/ST=Para/L=Belem/O=BarcoEletrico/OU=TI/CN=localhost"

echo "✅ Certificados SSL gerados na pasta ./certs"