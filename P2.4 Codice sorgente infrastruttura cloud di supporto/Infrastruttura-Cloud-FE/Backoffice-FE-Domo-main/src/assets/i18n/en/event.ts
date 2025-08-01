export default {
    operator: {
        title: 'Operators Events',

        table: {
            name: 'NAME',
            surname: 'SURNAME',
            email: 'EMAIL',
            ppe: 'PPE TYPE',
            eventType: 'EVENT TYPE',
            timestamp: 'TIMESTAMP',
            relatedJob: 'RELATED JOB',
            relatedJobs: 'RELATED JOBS',

            filterByPpes: 'Filter by PPEs',
            filterByEvents: 'Filter by Events',
        },

        toast: {
            fetchFailure: 'Unable to retrieve operators events',
        }
    },

    environment: {
        title: 'Environments Events',

        table: {
            name: 'NAME',
            environmentType: 'ENVIRONMENT TYPE',
            eventType: 'EVENT TYPE',
            timestamp: 'TIMESTAMP',

            filterByEnvironments: 'Filter by Environments',
            filterByEvents: 'Filter by Events',
        },

        toast: {
            fetchFailure: 'Unable to retrieve environments events',
        }
    },

    eventType: {
        wildfire: 'Wildfire',
        gas_leak: 'Gas Leak',
        no_danger: 'No Danger',
        low_air_quality: 'Low Air Quality',
        good_air_quality: 'Good Air Quality',
        not_wearing_hard_hat: 'Not Wearing Hard Hat',
        not_wearing_shoe1: 'Not Wearing Shoe1',
        not_wearing_shoe2: 'Not Wearing Shoe2',
        fully_equipped: 'Fully Equipped',
        near_miss: 'Near Miss',
    },

    searchByKeyword: 'Search by keyword',
}