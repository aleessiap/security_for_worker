export default {
    title: 'Users List',
    add: 'Add User',
    edit: 'Edit User',
    delete: 'Delete User',

    role: {
        super_admin: 'Super Admin',
        company_admin: 'Company Admin',
        safety_manager: 'Safety Manager',
        operator: 'Operator',
        team_leader: 'Team Leader',
    },

    table: {
        name: 'NAME',
        surname: 'SURNAME',
        email: 'EMAIL',
        role: 'ROLE',
        createdAt: 'CREATED AT',
        actions: 'ACTIONS',

        filterByRole: 'Filter by role',
    },

    form: {
        name: 'Name',
        surname: 'Surname',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        role: 'Role',
        createdAt: 'Created At',

        nameRequired: 'Name is required',
        namePlaceholder: 'Insert the name',

        surnameRequired: 'Surname is required',
        surnamePlaceholder: 'Insert the surname',

        emailValidation: 'Email must be a valid email',
        emailRequired: 'Email is required',
        emailPlaceholder: 'Insert the email',

        passwordRequired: 'Password is required',
        passwordPlaceholder: 'Insert the password',

        roleRequired: 'Role is required',
        rolePlaceholder: 'Select the role',

        confirmPasswordPlaceholder: 'Confirm the password',
        confirmPasswordValidation: 'Passwords do not match',

    },

    toast: {
        fetchFailure: 'Unable to retrieve users',

        deleteSuccess: 'User deleted successfully',
        deleteFailure: 'Unable to delete user',

        createSuccess: 'User created successfully',
        createFailure: 'Unable to create user',
        
        editSuccess: 'User updated successfully',
        editFailure: 'Unable to update user',
    },

    searchByKeyword: 'Search by keyword',

}