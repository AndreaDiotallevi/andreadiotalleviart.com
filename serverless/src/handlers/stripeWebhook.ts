import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"
import Stripe from "stripe"

import { processStripeWebhook } from "../services/stripe"

const ssmClient = new SSMClient({ region: process.env.AWS_REGION })

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try {
        const getParameterCommand = new GetParameterCommand({
            Name: "STRIPE_SIGNING_SECRET",
        })
        const { Parameter } = await ssmClient.send(getParameterCommand)
        const stripeSigningSecret = Parameter?.Value as string

        const { body, headers } = event
        const stripeSignatureHeader = headers["Stripe-Signature"]

        const stripeEvent = Stripe.webhooks.constructEvent(
            body || "",
            stripeSignatureHeader || "",
            stripeSigningSecret
        )

        const { entries } = await processStripeWebhook({ stripeEvent })

        // const statusCode = error ? 500 : 200

        // const responseBody = error
        //     ? JSON.stringify({ error })
        //     : JSON.stringify({ entries })

        return {
            statusCode: 200,
            body: JSON.stringify({ entries }),
            headers: {
                "Access-Control-Allow-Headers": "Content-Type, X-Api-Key",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
            },
        }
    } catch (error) {
        console.log(`Error handling webhook`)
        console.error(error)

        return { statusCode: 400, body: "Webhook error" }
    }

    // console.log(event)
    // const payload = event.body || ""
    // const parsedPayload = JSON.parse(payload) as {
    //     data: { object: { id: string } }
    // }
    // console.log(parsedPayload)

    // const response = await processStripeWebhook({
    //     sessionId: parsedPayload.data.object.id,
    // })
}

// // server.js
// //
// // Use this sample code to handle webhook events in your integration.
// //
// // 1) Paste this code into a new file (server.js)
// //
// // 2) Install dependencies
// //   npm install stripe
// //   npm install express
// //
// // 3) Run the server on http://localhost:4242
// //   node server.js

// // The library needs to be configured with your account's secret key.
// // Ensure the key is kept out of any version control system you might be using.
// const stripe = require('stripe')('sk_test_...');
// const express = require('express');
// const app = express();

// // This is your Stripe CLI webhook secret for testing your endpoint locally.
// const endpointSecret = "whsec_bb6e222034431a73ba274d9f3e044c5c19b1a21db64336b914bbd46d53dff78a";

// app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
//   const sig = request.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'checkout.session.completed':
//       const checkoutSessionCompleted = event.data.object;
//       // Then define and call a function to handle the event checkout.session.completed
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });

// app.listen(4242, () => console.log('Running on port 4242'));
