workspace {

    model {
        user = person "User" "A user of andreadiotalleviart.com"
        gatsby = softwareSystem "Gatsby frontend" "Static website"
        stripe = softwareSystem "Stripe" "Payments platform" "SaaS"
        prodigi = softwareSystem "Prodigi" "Global print on demand platform & print API" "SaaS"
        serverless = softwareSystem "Serverless backend" {
            apiGateway = container "API" "" "API Gateway"
            eventBus = container "Event bus" "" "Event Bridge" "Queue"
            sendEmailQueue = container "Send email queue" "" "SQS" "Queue"
            sendEmailLambda = container "Send email function" "" "Lambda"
            fulfilOrderQueue = container "Fulfil order queue" "" "" "Queue"
            fulfilOrderLambda = container "Fulfil order function" "" "Lambda"

            eventBus -> sendEmailQueue "Sends filtered events to"
            sendEmailQueue -> sendEmailLambda "Sends filtered events to"
            eventBus -> fulfilOrderQueue "Sends events to"
            fulfilOrderQueue -> fulfilOrderLambda "Sends events to"
        }

        user -> gatsby "Buys prints via"
        gatsby -> apiGateway "Creates a stripe session via"
        gatsby -> stripe "Confirms session payment via"
        stripe -> eventBus "Sends events to" "Webhooks"
        sendEmailLambda -> user "Sends emails to"
        fulfilOrderLambda -> prodigi "Fulfils orders via"
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
