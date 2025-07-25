#!/bin/bash
MYSQL_PROXY=$1 # AWS RDS Proxy 주소
MYSQL_USERNAME=$2 # AWS RDS 사용자명
MYSQL_DATABASE=$3 # AWS RDS 데이터베이스명
DOCKER_CONTAINER_NAME=$4 # Docker 컨테이너 이름
DOCKER_USERNAME=$5 # Docker Hub 사용자명
DOCKER_PASSWORD=$6 # Docker Hub 비밀번호
DOMAIN=$7 # 도메인 주소
EMAIL=$8 # Certbot 이메일 주소

# 작성일 : 2025-07-14
# 내용 : 
# 1. 기본 설정
# 2. MySQL 설치
# 3. Docker 설치
# 4. SSL 설정
# 5. Nginx 설정


# MySQL접속이 안될 경우 AWS 환경 확인 필요
# 1. EC2 RDS 연결 확인
# 2. EC2 보안 그룹 확인
# 2-1. 보안그룹 [deservit-lambda-rds-security-group] 해당 EC2 3306 포트 열어두었는지 확인

# SSH 연결 안될 경우 AWS 환경 확인 필요
# 1. VPC [deservit-lambda-to-rds-vpc] 서브넷 라우팅 테이블 연결 확인
# 1-1. EC2 서브넷 -> 라우팅 [internet-gateway-routing-table] 연결 확인

# [ 기본 설정 ]
# 패키지 업데이트
sudo apt-get update
sudo apt-get upgrade -y

# 로그 디렉토리 생성 및 권한 설정
sudo mkdir -p /var/log/${DOCKER_CONTAINER_NAME}
sudo chown -R 1001:1001 /var/log/${DOCKER_CONTAINER_NAME}
sudo chmod -R 755 /var/log/${DOCKER_CONTAINER_NAME}

# [ MySQL 설치 ]
sudo apt install mysql-client

# MySql 접속 테스트
mysql -h ${MYSQL_PROXY} -u ${MYSQL_USERNAME} -p ${MYSQL_DATABASE}

# [ Docker 설치 ]
# 기존 설치된 것 제거
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done

# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Docker Hub Login
docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

# [ SSL 설정 ]
# Nginx 설치
sudo apt-get install -y nginx
sudo systemctl enable nginx

# Nginx 설정 파일 생성
sudo tee /etc/nginx/sites-available/${DOMAIN} > /dev/null <<EOF
server {
    listen 80;
    server_name ${DOMAIN};
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Nginx 사이트 활성화
sudo ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Certbot 설치 (SSL 인증서용)
sudo apt-get install -y certbot python3-certbot-nginx
# Certbot을 사용하여 SSL 인증서 발급
sudo certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos --email ${EMAIL}

# SSL 인증서 확인
sudo certbot certificates

# 발급 과정에서 오류가 있다면 상세 로그 확인
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# 인증서 자동 갱신 설정
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

# 자동 갱신 테스트
sudo certbot renew --dry-run

# [ SSL 접근 테스트 ]
# 로컬에서 Docker 컨테이너 접근 테스트
curl -I http://localhost:4000
# HTTP 접근 테스트
curl -I http://${DOMAIN}

# HTTPS 접근 테스트
curl -I https://${DOMAIN}

# 만일 접근이 안될 경우 다음과 같이 수동 설정
sudo tee /etc/nginx/sites-available/${DOMAIN} > /dev/null <<EOF
server {
    listen 80;
    server_name ${DOMAIN};
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN};
    
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF