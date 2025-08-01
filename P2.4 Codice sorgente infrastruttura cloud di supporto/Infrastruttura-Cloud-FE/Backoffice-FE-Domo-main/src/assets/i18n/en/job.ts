export default {
    title: 'Jobs List',
    add: 'Add Job',

    jobOperators: 'Job Operators',

    noJobsWarning: 'No open jobs found',

    confirmedJob: 'Confirmed',
    negatedJob: 'Not Confirmed',
    noResponseJob: 'No Response',

    table: {
        startDate: 'START DATE',
        endDate: 'END DATE',
        jobName: 'JOB NAME',

        environmentName: 'ENVIRONMENT NAME',
        environmentType: 'ENVIRONMENT TYPE',

        operators: 'OPERATORS',

        createdBy: 'CREATED BY',

        status: 'STATUS',

        showOperators: 'Show'
    },

    form: {
        name: 'Job Name',
        environment: 'Environment',
        operators: 'Operators',

        selectedOperators: 'Selected Operators',
        
        nameRequired: 'Job Name is required',
        namePlaceholder: 'Enter the job name',

        environmentRequired: 'Environment is required',
        environmentPlaceholder: 'Select the environment for this job',

        operatorsRequired: 'At least one operator is required',
        operatorsPlaceholder: 'Find operators to assign to this job',
    },

    toast: {
        fetchFailure: 'Unable to retrieve jobs',

        deleteSuccess: 'Job deleted successfully',
        deleteFailure: 'Unable to delete job',

        createSuccess: 'Job created successfully',
        createFailure: 'Unable to create job',

        endJobSuccess: 'Job ended successfully',
        endJobFailure: 'Unable to end job',

        confirmJobSuccess: 'Job confirmed successfully',
        confirmJobFailure: 'Unable to confirm job',

        denyJobSuccess: 'Job denied successfully',
        denyJobFailure: 'Unable to deny job',
    },

    confirmJobModal: {
        title: 'Confirm Job',

        warning: 'There\'s a job assigned to you, click to see more details and confirm it',

        description: 'You\'ve been assigned to this job.',
        question: 'Do you confirm this job?',

        confirm: 'Confirm',
        deny: 'Deny',

        jobInfo: 'Job Information',
        jobsInfo: 'Jobs Information',
        jobName: 'Job Name',
        startDate: 'Start Date',
        endDate: 'End Date',
        environmentName: 'Environment Name',
        environmentType: 'Environment Type',
        createdBy: 'Created By',
    },

    deleteJobModal: {
        title: 'Delete Job',
    },

    endJobModal: {
        title: 'End Job',
        description: 'It will be marked as finished and it will be archived.',
        confirmattion: 'Are you sure you want to finish this job?',

        supposedEndDate: 'Supposed End Date',
    },

    searchByKeyword: 'Search by keyword',
}