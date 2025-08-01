export default {
    title: 'Personal Protective Equipments List',
    add: 'Add PPE',
    edit: 'Edit PPE',
    delete: 'Delete PPE',

    type: {
        hard_hat: 'Hard Hat',
        safety_glasses: 'Safety Glasses',
        gloves: 'Gloves',
        respirator: 'Respirator',
        ear_plugs: 'Ear Plugs',
        ear_muff: 'Ear Muff',
        face_mask: 'Face Mask',
        safety_shoes: 'Safety Shoes',
        safety_vest: 'Safety Vest',
        belt: 'Belt',
        safety_harness: 'Safety Harness',
    },

    table: {
        name: 'NAME',
        type: 'TYPE',
        availability: 'AVAILABILITY',
        createdAt: 'CREATED AT',
        belongsTo: 'BELONGS TO',

        filterByPPEs: 'Filter by PPEs',
        filterByAvailability: 'Filter by availability',
        filterByOperators: 'Filter by operators',
    },

    form: {
        name: 'PPE Name',
        type: 'Type',
        available: 'Available',
        notAvailable: 'Not Available',
        operator: 'Operator',

        namePlaceholder: 'Insert the PPE name',
        nameRequired: 'The PPE name is required',

        typePlaceholder: 'Select the PPE type',
        typeRequired: 'The PPE type is required',

        operatorPlaceholder: 'Select the operator',

        searchOperators: 'Search operators by keyword',
    },

    toast: {
        fetchFailure: 'Unable to retrieve PPEs',

        deleteSuccess: 'PPE deleted successfully',
        deleteFailure: 'Unable to delete PPE',

        createSuccess: 'PPE created successfully',
        createFailure: 'Unable to create PPE',

        editSuccess: 'PPE updated successfully',
        editFailure: 'Unable to update PPE',
    },

    searchByKeyword: 'Search by keyword',

}