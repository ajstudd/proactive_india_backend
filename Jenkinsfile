pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', git credentialsId: 'github-credentials', url: 'https://github.com/ajstudd/proactive_india_backend.git'
            }
        }

        stage('Security Audit') {
            steps {
                sh 'npm install'
                sh 'npm audit --audit-level=moderate || true'
            }
        }

        stage('Build and Deploy') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d --build'
            }
        }
    }
}
