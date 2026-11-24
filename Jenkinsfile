pipeline {
    agent any

    parameters {
        choice(name: 'BROWSER_PROJECT', choices: ['bdd-chrome', 'bdd-firefox', 'bdd-edge'], description: 'Playwright browser project to execute')
        choice(name: 'SUITE_FILTER', choices: ['all', '@smoke', '@regression', '@e2e'], description: 'BDD tag filter to run')
    }

    environment {
        CI = 'true'
        FORCE_COLOR = '1'
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '15'))
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Environment Check') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'node -v && npm -v'
                    } else {
                        bat 'node -v && npm -v'
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            if [ -f package-lock.json ]; then
                                npm ci || npm install
                            else
                                npm install
                            fi
                        '''
                    } else {
                        bat '''
                            if exist package-lock.json (
                                call npm ci || call npm install
                            ) else (
                                call npm install
                            )
                        '''
                    }
                }
            }
        }

        stage('Ensure Playwright Browsers') {
            steps {
                script {
                    def browserProject = params.BROWSER_PROJECT ?: 'bdd-chrome'
                    def browserName = browserProject == 'bdd-firefox' ? 'firefox' : 'chromium'
                    if (isUnix()) {
                        sh "npx playwright install ${browserName}"
                    } else {
                        bat "npx playwright install ${browserName}"
                    }
                }
            }
        }

        stage('Generate BDD Test Specs') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npx bddgen'
                    } else {
                        bat 'npx bddgen'
                    }
                }
            }
        }

        stage('Run Playwright BDD Tests') {
            steps {
                script {
                    def browserProject = params.BROWSER_PROJECT ?: 'bdd-chrome'
                    def suiteFilter = params.SUITE_FILTER ?: 'all'
                    def grepArg = (suiteFilter && suiteFilter != 'all') ? "--grep ${suiteFilter}" : ''
                    def cmd = "npx playwright test --project=${browserProject} ${grepArg}".trim()
                    if (isUnix()) {
                        sh cmd
                    } else {
                        bat cmd
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'test-results/**,playwright-report/**', allowEmptyArchive: true, fingerprint: true
            script {
                try {
                    junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
                } catch (Exception e) {
                    echo "JUnit plugin not available or skipped: ${e.message}"
                }
            }
        }
    }
}
