import { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
    useDotenv: true,
    service: 'andrei-karotkin-cart-service',
    frameworkVersion: '3',
    plugins: ['serverless-offline',  'serverless-dotenv-plugin'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        region: 'eu-central-1',
        iam: {
            role: {
                permissionsBoundary:
                    'arn:aws:iam::${aws:accountId}:policy/eo_role_boundary',
            },
        },
        vpc: {
            securityGroupIds: ['sg-02046ca8c1f7f5d46', 'sg-02046ca8c1f7f5d46'],
            subnetIds: ['subnet-7d955331', 'subnet-0417926e', 'subnet-cb5aaab7'],
        },
        environment: {
            PG_HOST: '${env:PG_HOST}',
            PG_PORT: '${env:PG_PORT}',
            PG_DATABASE: '${env:PG_DATABASE}',
            PG_USERNAME: '${env:PG_USERNAME}',
            PG_PASSWORD: '${env:PG_PASSWORD}',
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
    },
    functions: {
        main: {
            handler: 'dist/src/main.handler',
            events: [
                {
                    http: {
                        method: 'ANY',
                        path: '/',
                        cors: true
                    },
                },
                {
                    http: {
                        method: 'ANY',
                        path: '{proxy+}',
                        cors: true
                    },
                },
            ],
        },
    },
};

module.exports = serverlessConfiguration;