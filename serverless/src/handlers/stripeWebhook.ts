export const handler = async () => {
    // Nothing

    return {
        statusCode: 200,
        body: "",
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
        },
    }
}
