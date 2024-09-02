var config: any = {
    production: {
        DATABASE_CONNECTION_URL: "mongodb://localhost:27017/user-authentication",
        SECURITY_TOKEN: 'Fuse2ServerSecurityKey',
        SERVER_PORT: '3002',
        TOKEN_EXPIRES_IN: '2h',
        REFRESH_TOKEN_EXPIRES_IN: '1d',
        FORGOT_PASSWORD_TOKEN_EXPIRES_IN: '2m',
        EMAIL: {
            HOST: "smtp.gmail.com",
            SMTP_PORT: "465",
            EMAIL_USERNAME: "tanviransari13@gmail.com",
            EMAIL_PASSWORD: "xcbj jlzg kpbj amby"
        }
    },
    development: {
        DATABASE_CONNECTION_URL: "mongodb://localhost:27017/user-authentication",
        SECURITY_TOKEN: 'Fuse2ServerSecurityKey',
        SERVER_PORT: '3002',
        TOKEN_EXPIRES_IN: '2h',
        REFRESH_TOKEN_EXPIRES_IN: '1d',
        FORGOT_PASSWORD_TOKEN_EXPIRES_IN: '2m',
        EMAIL_USERNAME: "tanviransari13@gmail.com",
        EMAIL_PASSWORD: "xcbj jlzg kpbj amby",
        EMAIL: {
            HOST: "smtp.gmail.com",
            SMTP_PORT: "465",
            EMAIL_USERNAME: "tanviransari13@gmail.com",
            EMAIL_PASSWORD: "xcbj jlzg kpbj amby"
        }
    }
}

export function get(env: any) {
    return config[env] || config.development;
}