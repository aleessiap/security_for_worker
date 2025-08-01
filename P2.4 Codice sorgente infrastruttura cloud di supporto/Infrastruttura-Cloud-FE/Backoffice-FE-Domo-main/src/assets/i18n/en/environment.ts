export default {
    title: 'Environments List',
    add: 'Add Environment',
    edit: 'Edit Environment',
    delete: 'Delete Environment',

    type: {
        indoor: 'Indoor',
        outdoor: 'Outdoor',
    },

    table: {
        name: 'NAME',
        type: 'TYPE',
        createdAt: 'CREATED AT',
        actions: 'ACTIONS',

        filterByEnvironmentType: 'Filter by Environment type',
    },

    form: {
        name: 'Name',
        type: 'Type',

        namePlaceholder: 'Insert the Environment name',
        nameRequired: 'The Environment name is required',

        typePlaceholder: 'Select the Environment type',
        typeRequired: 'The Environment type is required',
    },

    toast: {
        fetchFailure: 'Unable to retrieve Environments',

        deleteSuccess: 'Environment deleted successfully',
        deleteFailure: 'Unable to delete Environment',

        createSuccess: 'Environment created successfully',
        createFailure: 'Unable to create Environment',

        editSuccess: 'Environment updated successfully',
        editFailure: 'Unable to update Environment',
    },

    searchByKeyword: 'Search by keyword',
}