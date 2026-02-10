import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose"

export const ADMIN_GROUP_NAME = "admin"
export const ADMIN_SESSION_COOKIE_NAME = "admin_session"
export const ADMIN_LOGIN_STATE_COOKIE_NAME = "admin_login_state"
export const ADMIN_LOGIN_RETURN_TO_COOKIE_NAME = "admin_login_return_to"

const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24
const LOGIN_STATE_MAX_AGE_SECONDS = 60 * 10

interface AuthConfig {
    clientId: string
    clientSecret: string
    cognitoBaseUrl: string
    issuer: string
}

interface TokenResponse {
    id_token?: string
}

const getRequiredEnv = (name: string): string => {
    const env = import.meta.env as Record<string, string | undefined>
    const value = env[name]

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }

    return value
}

const normaliseCognitoDomain = (domain: string): string => {
    const trimmed = domain.trim().replace(/\/+$/, "")
    if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
        return trimmed
    }
    return `https://${trimmed}`
}

const getAuthConfig = (): AuthConfig => {
    const region = (import.meta.env.COGNITO_REGION || "eu-west-2").trim()
    const userPoolId = getRequiredEnv("COGNITO_USER_POOL_ID").trim()
    const clientId = getRequiredEnv("COGNITO_CLIENT_ID").trim()
    const clientSecret = getRequiredEnv("COGNITO_CLIENT_SECRET").trim()
    const cognitoDomain = getRequiredEnv("COGNITO_AUTH_DOMAIN")
    const cognitoBaseUrl = normaliseCognitoDomain(cognitoDomain)
    const issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`

    return { clientId, clientSecret, cognitoBaseUrl, issuer }
}

const jwksByIssuer = new Map<string, ReturnType<typeof createRemoteJWKSet>>()

const getJwks = (issuer: string): ReturnType<typeof createRemoteJWKSet> => {
    const existing = jwksByIssuer.get(issuer)
    if (existing) return existing

    const jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`))
    jwksByIssuer.set(issuer, jwks)
    return jwks
}

export const getRequestOrigin = (url: URL): string => `${url.protocol}//${url.host}`

export const getSafeInternalPath = (
    path: string | null | undefined,
    fallbackPath = "/admin",
): string => {
    if (!path) return fallbackPath
    if (!path.startsWith("/")) return fallbackPath
    if (path.startsWith("//")) return fallbackPath
    return path
}

export const buildCognitoAuthorizeUrl = ({
    url,
    state,
}: {
    url: URL
    state: string
}): string => {
    const { clientId, cognitoBaseUrl } = getAuthConfig()
    const callbackUrl = `${getRequestOrigin(url)}/auth/callback`
    const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        scope: "openid email profile",
        redirect_uri: callbackUrl,
        state,
        identity_provider: "Google",
    })

    return `${cognitoBaseUrl}/oauth2/authorize?${params.toString()}`
}

export const buildCognitoLogoutUrl = ({ url }: { url: URL }): string => {
    const { clientId, cognitoBaseUrl } = getAuthConfig()
    const logoutUrl = `${getRequestOrigin(url)}/`
    const params = new URLSearchParams({
        client_id: clientId,
        logout_uri: logoutUrl,
    })

    return `${cognitoBaseUrl}/logout?${params.toString()}`
}

export const exchangeCodeForIdToken = async ({
    code,
    url,
}: {
    code: string
    url: URL
}): Promise<string> => {
    const { clientId, clientSecret, cognitoBaseUrl } = getAuthConfig()
    const callbackUrl = `${getRequestOrigin(url)}/auth/callback`
    const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: callbackUrl,
    })

    const response = await fetch(`${cognitoBaseUrl}/oauth2/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    })

    if (!response.ok) {
        throw new Error(`Cognito token exchange failed with status ${response.status}`)
    }

    const tokens = (await response.json()) as TokenResponse
    if (!tokens.id_token) {
        throw new Error("Cognito token exchange succeeded but id_token is missing")
    }

    return tokens.id_token
}

export interface AdminSessionClaims {
    email?: string
    groups: string[]
    payload: JWTPayload
}

export const verifyAdminSessionToken = async (
    token: string,
): Promise<AdminSessionClaims | null> => {
    try {
        const { issuer, clientId } = getAuthConfig()
        const jwks = getJwks(issuer)
        const { payload } = await jwtVerify(token, jwks, {
            issuer,
            audience: clientId,
        })

        if (payload.token_use !== "id") return null

        const groupsClaim = payload["cognito:groups"]
        const groups = Array.isArray(groupsClaim)
            ? groupsClaim.filter((group): group is string => typeof group === "string")
            : []

        return {
            email: typeof payload.email === "string" ? payload.email : undefined,
            groups,
            payload,
        }
    } catch (error) {
        return null
    }
}

export const isAdminUser = (groups: string[]): boolean => groups.includes(ADMIN_GROUP_NAME)

export const getAdminSessionMaxAgeSeconds = (): number => ADMIN_SESSION_MAX_AGE_SECONDS
export const getLoginStateMaxAgeSeconds = (): number => LOGIN_STATE_MAX_AGE_SECONDS
export const shouldUseSecureCookie = (url: URL): boolean => url.protocol === "https:"
