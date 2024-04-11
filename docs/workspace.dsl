workspace {

    model {
        user = person "User" "A user of andreadiotalleviart.com"
        gatsby = softwareSystem "Gatsby frontend" "Static website"
        stripe = softwareSystem "Stripe" "Payments platform" "SaaS"
        prodigi = softwareSystem "Prodigi" "Global print on demand platform & print API" "SaaS"
        serverless = softwareSystem "Serverless backend" {
            apiGateway = container "API" "" "API Gateway"
            eventBus = container "Event bus" "" "Event Bridge" "Queue"
            sqsLambdaPatterns = container "SQS + Lambda patterns" "" "SQS + Lambda" "Queue"

            eventBus -> sqsLambdaPatterns "Sends filtered events to" "AWS Rules"
        }

        user -> gatsby "Buys prints via"
        apiGateway -> stripe "Calls" "HTTP"
        gatsby -> apiGateway "Creates Stripe checkout session via" "HTTP"
        gatsby -> stripe "Confirms Stripe checkout session payment via" "HTTPS"
        stripe -> eventBus "Sends events to" "Webhooks"
        sqsLambdaPatterns -> user "Sends emails to" "AWS SES"
        sqsLambdaPatterns -> prodigi "Fulfils orders via" "HTTP"
        prodigi -> eventBus "Sends events to" "Webhooks"
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
