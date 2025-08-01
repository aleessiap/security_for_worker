export default {
    title: 'IoT Devices List',
    add: 'Add IoT Device',
    edit: 'Edit IoT Device',
    delete: 'Delete IoT Device',

    type: {
        operator: 'Operator',
        enviroment: 'Environment',
        gateway: 'Gateway',
    },

    table: {
        identifierCode: 'IDENTIFIER CODE',
        type: 'TYPE',
        installedOn: 'INSTALLED ON',
        createdAt: 'CREATED AT',
        actions: 'ACTIONS',

        filterByType: 'Filter by IoT device type',
    },

    form: {
        identifierCode: 'Identifier Code',
        type: 'Type',
        environment: 'Environment',
        ppe: 'Personal Protective Equipment',

        identifierCodePlaceholder: 'Insert the IoT device identifier code',
        identifierCodeRequired: 'The IoT device identifier code is required',
        identifierCodeAlphaNumeric: 'The identifier code must be alphanumeric',
        identifierCodeLength: 'The identifier code must be 8 characters long',

        typePlaceholder: 'Select the IoT device type',
        typeRequired: 'The IoT device type is required',

        environmentPlaceholder: 'Select the Environment',
        searchEnvironments: 'Search environments by keyword',

        ppePlaceholder: 'Select the Personal Protective Equipment',
        searchPPEs: 'Search PPEs by keyword',
    },

    toast: {
        fetchFailure: 'Unable to retrieve IoT devices',

        deleteSuccess: 'IoT device deleted successfully',
        deleteFailure: 'Unable to delete IoT device',

        createSuccess: 'IoT device created successfully',
        createFailure: 'Unable to create IoT device',

        editSuccess: 'IoT device updated successfully',
        editFailure: 'Unable to update IoT device',
    },

    searchByKeyword: 'Search by keyword',
}