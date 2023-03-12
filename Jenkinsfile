pipeline {
  environment { 
    dockerRepository = "devwhoan/kcs-apigateway"
    dockerCredential = credentials('docker')
    dockerImage = '' 
  }
  agent { 
    kubernetes {
      defaultContainer 'jnlp'
      yaml """
      apiVersion: v1
      kind: Pod
      metadata:
        labels:
          app: jenkins-worker
      spec:
        containers:
        - name: docker
          image: docker:23.0.1-dind
          securityContext:
            privileged: true
          env:
            - name: DOCKER_TLS_CERTDIR
              value: ""
      """

    }
  }
  tools {nodejs "nodejs-16.16.0"}
  
  stages {
    stage('NestJS Build') { 
      steps {
        echo "Install and Testing.."
        sh '''
        npm install
        npm test
        '''
        sh 'npm install'
      }
    }

    stage('Check Credential') {
      steps {
        container('docker') {
          echo "Cred: ${dockerCredential}"
        }
      }
    }
    stage('Start Docker') {
      steps {
        container('docker') {
          sh '''
          cat ${dockerCredential} | docker login --username devwhoan --password-stdin
          docker build -t $dockerRepository:$BUILD_NUMBER .
          docker push $dockerRepository:$BUILD_NUMBER
          '''
        }
      }
    }
  }
}
