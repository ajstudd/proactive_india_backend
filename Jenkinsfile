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

        stage('Build & Push Images') {
            steps {
                sh 'docker compose build'
                sh 'docker compose push'
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
