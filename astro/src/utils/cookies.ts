// const lineItemsKey = "andreadiotalleviart:lineItems"

// // Set the line items cookie
// export const setLineItemsCookie = (
//     lineItems: { price: string; quantity: number }[],
// ) => {
//     console.log("setting cookie")
//     const cookieValue = JSON.stringify(lineItems)
//     console.log(cookieValue)
//     const expires = new Date()
//     expires.setFullYear(expires.getFullYear() + 1) // Set the cookie to expire in 1 year

//     document.cookie = `${lineItemsKey}=${encodeURIComponent(cookieValue)}; HttpOnly; Secure; SameSite=None; Path=/; Expires=${expires.toUTCString()}`
// }

// // Retrieve the line items from the cookie
// export const getLineItems = (): { price: string; quantity: number }[] => {
//     console.log(document.cookie)
//     const cookieString = document.cookie
//         .split("; ")
//         .find(row => row.startsWith(`${lineItemsKey}=`))
//     if (cookieString) {
//         const cookieValue = decodeURIComponent(cookieString.split("=")[1])
//         return JSON.parse(cookieValue)
//     }
//     return []
// }

// // Remove the line items cookie
// export const removeLineItems = () => {
//     document.cookie = `${lineItemsKey}=; HttpOnly; Secure; SameSite=None; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;`
// }

// // Add an item to the cart
// export const addToCart = ({ priceId }: { priceId: string }) => {
//     let lineItems = getLineItems()

//     const existingItemIndex = lineItems.findIndex(
//         item => item.price === priceId,
//     )

//     if (existingItemIndex === -1) {
//         lineItems.push({ price: priceId, quantity: 1 })
//     } else {
//         lineItems[existingItemIndex].quantity += 1
//     }

//     setLineItemsCookie(lineItems) // Update the cookie with new line items
// }
