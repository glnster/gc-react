#!/bin/sh
set -e

CONFIG_FILE="/etc/nginx/conf.d/default.conf"

# Check if SSL certificates exist
if [ -f "/etc/nginx/ssl/cert.pem" ] && [ -f "/etc/nginx/ssl/key.pem" ]; then
    # SSL certificates exist - enable HTTPS redirect in HTTP server block
    sed -i 's/# return 301 https:\/\/\$host\$request_uri;/return 301 https:\/\/$host$request_uri;/' "$CONFIG_FILE"
    echo "SSL certificates found - HTTPS enabled with HTTP to HTTPS redirect"
else
    echo "Warning: SSL certificates not found at /etc/nginx/ssl/"
    echo "The HTTPS server block will fail to start."
    echo "For production, ensure SSL certificates are mounted."
    echo "For testing without SSL, modify nginx.conf to comment out the HTTPS block."
fi

# Test nginx configuration
nginx -t

# Start nginx
exec nginx -g "daemon off;"
