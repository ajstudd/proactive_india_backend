pipeline {
    agent any

    stages {
        stage('Git Checkout') {
            steps {
                git 'https://github.com/ajstudd/proact_backend.git'
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
