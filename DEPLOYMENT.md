# MERN ThinkBoard - AWS EC2 Deployment

## Prerequisites
- AWS EC2 instance (Ubuntu/Amazon Linux)
- Docker and Docker Compose installed
- Security groups configured for ports 3000, 5000, 27017

## Deployment Steps

### 1. Connect to EC2 Instance
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 2. Install Docker (if not installed)
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER
```

### 3. Clone and Deploy
```bash
git clone <your-repo-url>
cd MERN-THINKBOARD
chmod +x deploy.sh
./deploy.sh
```

### 4. Access Application
- Frontend: http://your-ec2-ip:3000
- Backend API: http://your-ec2-ip:5000
- MongoDB: your-ec2-ip:27017

## Environment Variables
Update .env files in backend and frontend directories with production values.

## Security Group Rules
- Port 22: SSH access
- Port 3000: Frontend
- Port 5000: Backend API
- Port 27017: MongoDB (restrict to application only)

## Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up --build -d
```