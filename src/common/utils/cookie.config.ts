export function getCookieConfig() {
    return {
        httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none',
    };
}

export function getCookieConfigWithExpiry() {
    return {
        ...getCookieConfig(),
        maxAge: Number(process.env.COOKIE_MAX_AGE),
    };
}