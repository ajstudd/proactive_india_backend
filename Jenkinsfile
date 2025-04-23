pipeline {
    agent any
    
    environment {
        DOCKERHUB_USERNAME = ''
        DOCKERHUB_PASSWORD = ''
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-credentials',
                    url: 'https://github.com/ajstudd/proactive_india_backend.git'
            }
        }
        
        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                    sh '''
                        echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
                    '''
                }
            }
        }
        
        stage('Create Environment Files') {
            steps {
                withCredentials([
                    string(credentialsId: 'mongo-url', variable: 'MONGO_URL'),
                    string(credentialsId: 'jwt-token-secret', variable: 'JWT_SECRET'),
                    string(credentialsId: 'twilio-account-sid', variable: 'TWILIO_SID'),
                    string(credentialsId: 'twilio-auth-token', variable: 'TWILIO_TOKEN'),
                    string(credentialsId: 'twilio-message-service-id', variable: 'TWILIO_MSG_ID'),
                    string(credentialsId: 'nodemailer-password', variable: 'EMAIL_PASS'),
                    string(credentialsId: 'test-admin-password', variable: 'ADMIN_PASS'),
                    string(credentialsId: 'gemini-api-key', variable: 'GEMINI_KEY')
                ]) {
                    sh '''
                        # Create platform-service .env file
                        mkdir -p platform-service
                        cat << EOF > platform-service/.env
PORT=5002
NODE_ENV="development"
MONGO_URL="$MONGO_URL"
JWT_TOKEN_SECRET="$JWT_SECRET"
JWT_TOKEN_EXPIRES_IN="30d"
TWILIO_ACCOUNT_SID="$TWILIO_SID"
TWILIO_AUTH_TOKEN="$TWILIO_TOKEN"
TWILIO_MESSAGE_SERVICE_ID="$TWILIO_MSG_ID"
NODEMAILER_HOST="smtp.gmail.com"
NODEMAILER_PORT=587
NODEMAILER_SECURE=false
NODEMAILER_REQUIRE_TLS=true
NODEMAILER_USER="ajx.office@gmail.com"
NODEMAILER_PASSWORD="$EMAIL_PASS"
NODEMAILER_FROM="ajx.office@gmail.com"
TEST_ADMIN_EMAIL="admin@hyathi.com"
TEST_ADMIN_PASSWORD="$ADMIN_PASS"
GEMINI_API_KEY="$GEMINI_KEY"
FRONTEND_URL="https://www.proactiveindia.site"
EOF
                        
                        # Create auth-service .env file with different PORT
                        mkdir -p auth-service
                        cat << EOF > auth-service/.env
PORT=5001
NODE_ENV="development"
MONGO_URL="$MONGO_URL"
JWT_TOKEN_SECRET="$JWT_SECRET"
JWT_TOKEN_EXPIRES_IN="30d"
TWILIO_ACCOUNT_SID="$TWILIO_SID"
TWILIO_AUTH_TOKEN="$TWILIO_TOKEN"
TWILIO_MESSAGE_SERVICE_ID="$TWILIO_MSG_ID"
NODEMAILER_HOST="smtp.gmail.com"
NODEMAILER_PORT=587
NODEMAILER_SECURE=false
NODEMAILER_REQUIRE_TLS=true
NODEMAILER_USER="ajx.office@gmail.com"
NODEMAILER_PASSWORD="$EMAIL_PASS"
NODEMAILER_FROM="ajx.office@gmail.com"
TEST_ADMIN_EMAIL="admin@hyathi.com"
TEST_ADMIN_PASSWORD="$ADMIN_PASS"
GEMINI_API_KEY="$GEMINI_KEY"
FRONTEND_URL="https://www.proactiveindia.site"
EOF
                    '''
                    
                    // Set secure permissions
                    sh 'chmod 600 platform-service/.env auth-service/.env'
                }
            }
        }
        
        stage('Build & Push Images') {
            steps {
                    sh '''
                        docker compose build
                        docker compose push
                    '''
                }
        }
        
        stage('Deploy Locally') {
            steps {
                sh '''
                    docker compose down
                    docker compose pull
                    docker compose up -d
                    docker image prune -f
                '''
            }
        }
    }
}