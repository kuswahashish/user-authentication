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
        },
        STRIPE: {
            PUBLISHABLE_KEY: "pk_test_51Pxj1lG27ccilI2VjYeCwRUHTK2tKNwEaTSMHxTKWjnyd8pjDMuaNQ4PnQjb0CAmF7U68XWYfMWXYnLB3jOFYYQ1002hQ56Ym8",
            SECRET_KEY: "sk_test_51Pxj1lG27ccilI2VCYR6XmoSaNM7f5X5dh5U1Bzf1rNp2KOpUDEmErrx7B2qUxCgTzYcuTeMd5RIj0aZDcOwIW6x00DzLMjtrz"
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
        },
        STRIPE: {
            PUBLISHABLE_KEY: "pk_test_51Pxj1lG27ccilI2VjYeCwRUHTK2tKNwEaTSMHxTKWjnyd8pjDMuaNQ4PnQjb0CAmF7U68XWYfMWXYnLB3jOFYYQ1002hQ56Ym8",
            SECRET_KEY: "sk_test_51Pxj1lG27ccilI2VCYR6XmoSaNM7f5X5dh5U1Bzf1rNp2KOpUDEmErrx7B2qUxCgTzYcuTeMd5RIj0aZDcOwIW6x00DzLMjtrz"
        }
    }
}

export function get(env: any) {
    return config[env] || config.development;
}