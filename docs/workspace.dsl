workspace {

    model {
        user = person "User" "An art lover"
        astro = softwareSystem "Astro frontend" "Static website"
        stripe = softwareSystem "Stripe" "Payments platform" "SaaS"
        theprintspace = softwareSystem "The Print Space" "Professional art printing API" "SaaS"
        serverless = softwareSystem "Serverless backend" {
            apiGateway = container "API" "" "API Gateway"
            eventBus = container "Event bus" "" "Event Bridge" "Queue"
            sqsLambda = container "SQS + lambda" "" "SQS + Lambda" "Queue"
            eventBus -> sqsLambda "Sends filtered events to" "AWS Rules"
        }
        user -> astro "Buys prints via"
        apiGateway -> stripe "Calls" "HTTP"
        astro -> apiGateway "Creates Stripe checkout session via" "HTTP"
        astro -> stripe "Confirms Stripe checkout session payment via" "HTTPS"
        stripe -> eventBus "Sends events to" "Webhooks"
        sqsLambda -> user "Sends emails to" "AWS SES"
        sqsLambda -> theprintspace "Fulfils orders via" "HTTP"
        theprintspace -> eventBus "Sends events to" "Webhooks"
    }

    views {
        systemlandscape "SystemLandscape" {
            include *
            autoLayout
        }
        
        container serverless "SystemContainer" {
            include *
            autoLayout
        }

        styles {
            element "Person" {
                shape person
                background #08427b
                color #ffffff
            }

            element "Database" {
                shape Cylinder
            }

            element "Queue" {
                shape Pipe
            }

            element "File" {
                shape Folder
            }

            element "SaaS" {
                background #7C7C7C
                color #ffffff
            }
        }
    }
}
