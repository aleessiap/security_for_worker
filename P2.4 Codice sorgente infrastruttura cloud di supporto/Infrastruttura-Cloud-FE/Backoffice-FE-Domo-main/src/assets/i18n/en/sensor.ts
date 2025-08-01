export default {
    title: 'Sensors List',
    add: 'Add Sensor',
    edit: 'Edit Sensor',
    delete: 'Delete Sensor',

    table: {
        identifierCode: 'IDENTIFIER CODE',  
        containedWithin: 'CONTAINED WITHIN',
        createdAt: 'CREATED AT',
        actions: 'ACTIONS',
    },

    form: {
        identifierCode: 'Identifier Code',
        iotDevice: 'IoT Device',

        identifierCodePlaceholder: 'Insert the Sensor identifier code',
        identifierCodeRequired: 'The Sensor identifier code is required',
        identifierCodeAlphaNumeric: 'The identifier code must be alphanumeric',
        identifierCodeLength: 'The identifier code must be 8 characters long',

        searchIoTDevice: 'Search IoT Device',
        iotDevicePlaceholder: 'Select the IoT Device',
    },

    toast: {
        fetchFailure: 'Unable to retrieve Sensors',

        deleteSuccess: 'Sensor deleted successfully',
        deleteFailure: 'Unable to delete Sensor',

        createSuccess: 'Sensor created successfully',
        createFailure: 'Unable to create Sensor',

        editSuccess: 'Sensor updated successfully',
        editFailure: 'Unable to update Sensor',
    },

    searchByKeyword: 'Search by keyword',

}