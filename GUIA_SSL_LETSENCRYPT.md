# Guia SSL con Let's Encrypt (Docker Compose)

Esta guia aplica a este proyecto con Nginx + Certbot en Docker Compose.

## 1. Prerrequisitos

1. El dominio y subdominio `www` deben apuntar a la IP publica del servidor.
2. Deben estar abiertos los puertos `80` y `443` en firewall/security group.
3. Debe existir el volumen de certificados en Compose:
   - `./ssl:/etc/letsencrypt`
4. Debe existir el volumen de webroot ACME en `frontend` y `certbot`:
   - `./www:/var/www/certbot`

## 2. Preparar carpetas en el servidor

Ejecuta desde la raiz del proyecto:

```bash
mkdir -p ssl www
```

## 3. Levantar frontend

Necesitas Nginx arriba para responder el challenge HTTP-01.

```bash
docker compose up -d frontend
```

## 4. Emitir certificado por primera vez

Reemplaza los valores de dominio y correo:

```bash
docker run --rm -it \
  -v $(pwd)/ssl:/etc/letsencrypt \
  -v $(pwd)/www:/var/www/certbot \
  certbot/certbot certonly --webroot -w /var/www/certbot \
  -d tu-dominio.com -d www.tu-dominio.com \
  --email tu-correo@dominio.com --agree-tos --no-eff-email
```

## 5. Configurar Nginx con dominio real

En `bu-frontend/nginx.conf`:

1. En el bloque HTTP (`listen 80`):
   - `server_name tu-dominio.com www.tu-dominio.com;`
   - conservar `location /.well-known/acme-challenge/ { root /var/www/certbot; }`
   - redirigir el resto a HTTPS.
2. En el bloque HTTPS (`listen 443 ssl`):
   - `server_name tu-dominio.com www.tu-dominio.com;`
   - `ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;`
   - `ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;`

## 6. Aplicar cambios

```bash
docker compose restart frontend
```

## 7. Activar renovacion automatica

Levanta el servicio `certbot` (renueva cada 12 horas segun tu entrypoint):

```bash
docker compose up -d certbot
```

## 8. Probar renovacion (recomendado)

```bash
docker run --rm -it \
  -v $(pwd)/ssl:/etc/letsencrypt \
  -v $(pwd)/www:/var/www/certbot \
  certbot/certbot renew --webroot -w /var/www/certbot --dry-run
```

## 9. Verificacion final

1. Abre `https://tu-dominio.com`
2. Abre `https://www.tu-dominio.com`
3. Revisa que el certificado aparezca valido en el navegador.

## Notas utiles

1. Let's Encrypt no emite certificados para `localhost`.
2. Para entorno local, usa `mkcert` o un certificado autofirmado.
3. Si falla la emision, revisa DNS, puertos 80/443 y que no haya otro servicio ocupando esos puertos fuera de Docker.
