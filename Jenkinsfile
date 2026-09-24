pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15', artifactNumToKeepStr: '5'))
        disableConcurrentBuilds()
    }

    triggers {
        githubPush()
    }

    parameters {
        booleanParam(name: 'BUILD_DOCKER', defaultValue: true, description: 'Build Docker container image')
        booleanParam(name: 'PUSH_IMAGE', defaultValue: true, description: 'Push image to container registry')
        booleanParam(name: 'UPDATE_GITOPS', defaultValue: true, description: 'Update image tag in GitOps Helm repository for ArgoCD')
    }



    environment {
        APP_NAME          = 'nexus-store'
        DOCKER_IMAGE_NAME = 'nexus-store'
        IMAGE_TAG         = "${env.BUILD_NUMBER}-${env.GIT_COMMIT ? env.GIT_COMMIT.take(7) : 'dev'}"
        DOCKER_CREDS_ID   = 'docker-registry-credentials'
        
        GITOPS_REPO_URL   = 'git@github.com:itme-roa15/nexus-store-gitops-demo.git'
        GITOPS_CREDS_ID   = 'gitops-git-credentials'
        GITOPS_BRANCH     = 'main'
        VALUES_FILE_PATH  = 'values.yaml'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source repository...'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            when {
                expression { return params.BUILD_DOCKER }
            }
            steps {
                echo "Building Docker image: ${env.DOCKER_IMAGE_NAME}:${env.IMAGE_TAG}..."
                sh """
                    docker build -t ${env.DOCKER_IMAGE_NAME}:${env.IMAGE_TAG} -t ${env.DOCKER_IMAGE_NAME}:latest .
                """
            }
        }

        stage('Push Docker Image') {
            when {
                allOf {
                    branch 'main'
                    expression { return params.PUSH_IMAGE }
                }
            }
            steps {
                echo "Pushing image to container registry..."
                withCredentials([usernamePassword(
                    credentialsId: env.DOCKER_CREDS_ID,
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin
                        docker push ${env.DOCKER_IMAGE_NAME}:${env.IMAGE_TAG}
                        docker push ${env.DOCKER_IMAGE_NAME}:latest
                        docker logout
                    """
                }
            }
        }

        stage('Update GitOps Config Repo') {
            when {
                allOf {
                    branch 'main'
                    expression { return params.UPDATE_GITOPS }
                }
            }
            steps {
                echo "Updating image tag to ${env.IMAGE_TAG} in GitOps repo (${env.GITOPS_REPO_URL})..."
                withCredentials([sshUserPrivateKey(
                    credentialsId: env.GITOPS_CREDS_ID,
                    keyFileVariable: 'SSH_KEY'
                )]) {
                    sh """
                        export GIT_SSH_COMMAND="ssh -i \$SSH_KEY -o StrictHostKeyChecking=no"
                        rm -rf gitops-repo || true
                        git clone --branch ${env.GITOPS_BRANCH} ${env.GITOPS_REPO_URL} gitops-repo
                        cd gitops-repo

                        if ! command -v yq &> /dev/null; then
                            echo "Downloading portable yq..."
                            curl -sL https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -o ./yq
                            chmod +x ./yq
                            YQ_BIN="./yq"
                        else
                            YQ_BIN="yq"
                        fi

                        \$YQ_BIN -i '.image.tag = "'"${env.IMAGE_TAG}"'"' ${env.VALUES_FILE_PATH}

                        git config user.name "roa-jenkins-bot"
                        git config user.email "roa-jenkins-bot@ci.local"
                        git add ${env.VALUES_FILE_PATH}
                        
                        if git diff --staged --quiet; then
                            echo "No changes in values.yaml to commit."
                        else
                            git commit -m "chore(gitops): bump ${env.APP_NAME} image tag to ${env.IMAGE_TAG} [skip ci]"
                            git push origin ${env.GITOPS_BRANCH}
                            echo "GitOps repository updated. ArgoCD will synchronize automatically soon!"
                        fi
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs(deleteDirs: true, notFailBuild: true)
        }
        success {
            echo "Pipeline succeeded! Built image: ${env.DOCKER_IMAGE_NAME}:${env.IMAGE_TAG}"
        }
        failure {
            echo "Pipeline failed! Please check stage console outputs."
        }
    }
}
