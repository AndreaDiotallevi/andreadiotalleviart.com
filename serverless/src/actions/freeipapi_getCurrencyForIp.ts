export const getCurrencyForIp = async (ip: string): Promise<string> => {
    const response = await fetch(`https://freeipapi.com/api/json/${ip}`)

    const data = (await response.json()) as {
        currency: { code: string; name: string }
    }

    console.log(`GetCurrencyForIpResponse: `, JSON.stringify(data))

    if (!response.ok) {
        throw new Error(`Failed to fetch currency data for IP: ${ip}`)
    }

    return data.currency.code
}
