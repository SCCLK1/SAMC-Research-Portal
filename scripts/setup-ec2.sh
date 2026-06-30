#!/usr/bin/env bash
# EC2 first-time bootstrap for AMC Research Portal
# Tested on: Ubuntu 22.04 / 24.04 LTS (t3.micro)
#
# Usage (run as root or with sudo):
#   curl -fsSL https://raw.githubusercontent.com/SCCLK1/SAMC-Research-Portal/main/scripts/setup-ec2.sh | sudo bash
# OR
#   sudo bash setup-ec2.sh

set -euo pipefail

echo ""
echo "============================================"
echo " AMC Research Portal — EC2 Bootstrap"
echo "============================================"
echo ""

# ── 1. System packages ─────────────────────────────────────────────────────
apt-get update -y
apt-get install -y git curl rsync nginx

# ── 2. Node.js 20 LTS ─────────────────────────────────────────────────────
if ! command -v node &>/dev/null || [[ "$(node -e 'process.stdout.write(process.versions.node.split(".")[0])')" -lt 20 ]]; then
  echo "==> Installing Node.js 20 LTS"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo "    Node $(node -v) / npm $(npm -v)"

# ── 3. PM2 (process manager) ───────────────────────────────────────────────
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
fi

# ── 4. Swap — 2 GB prevents OOM during next build on 1 GB RAM ─────────────
if [ ! -f /swapfile ]; then
  echo "==> Configuring 2 GB swap"
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# ── 5. App directory ───────────────────────────────────────────────────────
APP_USER="${SUDO_USER:-ubuntu}"
mkdir -p /app/samc-research-portal/portal
chown -R "$APP_USER:$APP_USER" /app

# ── 6. Nginx — reverse proxy port 80 → 3000 ───────────────────────────────
cat > /etc/nginx/sites-available/samc-portal << 'NGINX'
server {
    listen 80 default_server;
    server_name _;

    # Increase timeouts for SSE / long-running agent requests
    proxy_read_timeout    300;
    proxy_connect_timeout 60;
    send_timeout          300;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header   Connection        'upgrade';
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/samc-portal /etc/nginx/sites-enabled/samc-portal
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl restart nginx

# ── 7. PM2 — auto-start on reboot ─────────────────────────────────────────
# Run as the app user, not root
su - "$APP_USER" -c "pm2 startup systemd -u $APP_USER --hp /home/$APP_USER" | tail -1 | bash || true

echo ""
echo "============================================"
echo " Bootstrap complete!"
echo "============================================"
echo ""
echo "Required GitHub Secrets (Settings → Secrets → Actions):"
echo ""
echo "  EC2_HOST         — public IP or DNS of this instance"
echo "  EC2_USER         — SSH user (e.g. ubuntu)"
echo "  EC2_SSH_KEY      — contents of the private PEM key"
echo ""
echo "  AUTH_SECRET      — 32-char random string (openssl rand -base64 32)"
echo "  NEXTAUTH_SECRET  — same value as AUTH_SECRET"
echo "  NEXTAUTH_URL     — http://<EC2_PUBLIC_IP>"
echo ""
echo "  GEMINI_API_KEY   — (or OPENAI_API_KEY / ANTHROPIC_API_KEY)"
echo "  SEARCH_API_KEY   — Serper or Brave API key"
echo ""
echo "Required GitHub Variables (Settings → Variables → Actions):"
echo "  ACTIVE_LLM       — gemini | openai | claude"
echo "  SEARCH_PROVIDER  — serper | brave"
echo ""
echo "Push to main to trigger the first deployment."
echo ""
