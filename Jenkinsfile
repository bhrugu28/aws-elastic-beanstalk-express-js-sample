pipeline {
    agent { label 'docker-agent' }

    options {
        skipDefaultCheckout()
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(
            numToKeepStr: '20',
            artifactNumToKeepStr: '10'
        ))
    }

    environment {
        IMAGE_REPO = 'bhrugusharma/isec6000-assessment2'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.IMAGE_TAG = sh(
                        script: 'git rev-parse --short=12 HEAD',
                        returnStdout: true
                    ).trim()
                }
                echo "Source commit: ${env.IMAGE_TAG}"
                sh 'docker version --format "Client={{.Client.Version}} Server={{.Server.Version}}"'
            }
        }

        stage('Install dependencies') {
            steps {
                sh '''
                    docker run --rm \
                      --user "$(id -u):$(id -g)" \
                      --mount "type=bind,source=$WORKSPACE,target=/app" \
                      --workdir /app \
                      --env npm_config_cache=/tmp/npm-cache \
                      node:16-bullseye-slim \
                      sh -ec 'node --version; npm ci --engine-strict --no-audit --no-fund'
                '''
            }
        }

        stage('Unit tests') {
            steps {
                sh '''
                    docker run --rm \
                      --user "$(id -u):$(id -g)" \
                      --mount "type=bind,source=$WORKSPACE,target=/app" \
                      --workdir /app \
                      --env npm_config_cache=/tmp/npm-cache \
                      node:16-bullseye-slim \
                      npm run test:ci
                '''
            }
        }

        stage('Dependency security gate') {
            steps {
                sh '''
                    docker run --rm \
                      --user "$(id -u):$(id -g)" \
                      --mount "type=bind,source=$WORKSPACE,target=/app" \
                      --workdir /app \
                      --env npm_config_cache=/tmp/npm-cache \
                      node:16-bullseye-slim \
                    sh -c 'set -u
                        mkdir -p reports
                        audit_status=0
                        npm audit --audit-level=high --json > reports/npm-audit.json || audit_status=$?
                        tail -n 16 reports/npm-audit.json
                        exit "$audit_status"'

                '''
            }
        }

        stage('Build application image') {
            steps {
                sh 'docker build --pull --tag "$IMAGE_REPO:$IMAGE_TAG" .'
            }
        }

        stage('Publish application image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-assessment2',
                    usernameVariable: 'bhrugu28',
                    passwordVariable: 'DOCKERHUB_TOKEN'
                )]) {
                    sh '''
                        set +x
                        set -eu

                        test "$DOCKERHUB_USER" = "${IMAGE_REPO%%/*}"

                        registry_config=$(mktemp -d)
                        trap 'rm -rf "$registry_config"' EXIT
                        export DOCKER_CONFIG="$registry_config"

                        printf '%s' "$DOCKERHUB_TOKEN" |
                          docker login --username "$DOCKERHUB_USER" --password-stdin

                        docker push "$IMAGE_REPO:$IMAGE_TAG"
                    '''
                }
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'reports/junit.xml'
            archiveArtifacts(
                artifacts: 'reports/*',
                allowEmptyArchive: true
            )
        }
    }
}