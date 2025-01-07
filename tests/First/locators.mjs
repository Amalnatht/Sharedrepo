export const envURL = {
    test : 'https://test.spendflo.com/',
    demo : 'https://demo.spendflo.com/',
    app : 'https://app.spendflo.com/'
}

export const loginLocators = {
    emailfield : '//input[@name="identifier"]',
    passwordfield : '//input[@name="password"]',
    signinButton : 'button:has-text("Sign in")',
    skipForNowButton : 'Skip for now',
    pendoGuideCloseButton : '//div[@id="pendo-base"]//button[@aria-label="Close"]'
}

export const navigationLocators = {
    orgNamefield : '//img[@alt="Rocket"]/ancestor::div[2]/preceding-sibling::div[1]//span',
    settingIcon : '//img[@alt="GearUnfilled"]',
    settings_workflows : 'Workflows',
}

export const workflowLocators = {
    addWorkflowButton : '+ Add Workflow',
    createNewWorkflowButton : 'Create a New Workflow',
    workflowNameInputField : '//input[@name="workflowName"]',
    createWorkflowButton : 'Create Workflow',
    workflowGuideCloseButton : '(//p[text()="Workflow Studio Guide"]/ancestor::div[2]//p)[2]',
    intakeForm3Dots : '//span[text()="Intake Form"]/ancestor::div[2]//button',
    editbutton : "//button[text()='Edit']",
    saveAndContinueButton : '//p[text()="Save & Continue"]',
    addSectionButton : 'Add Section',
    firstSectionLocator : '//h3[text()="Section 1"]/ancestor::div[2]/following-sibling::div',

    // Questions Locators
    vendorQuestionBox : "//p[text()='Vendor']/ancestor::div[1]",
    shortTextQuestionBox : '//p[text()="Short Text"]/ancestor::div[1]',
    longTextQuestionBox : '//p[text()="Long Text"]/ancestor::div[1]',
    dropdownQuestionBox : '//p[text()="Dropdown"]/ancestor::div[1]',
    singleChoiceQuestionBox : '//p[text()="Single Choice"]/ancestor::div[1]',
    multipleChoiceQuestionBox : '//p[text()="Multiple Choice"]/ancestor::div[1]',
    numberQuestionBox : '//p[text()="Number"]/ancestor::div[1]',
    dateQuestionBox : '//p[text()="Date"]/ancestor::div[1]',
    attachmentQuestionBox : '//p[text()="Attachment"]/ancestor::div[1]',
    currencyQuestionBox : '//p[text()="Currency"]/ancestor::div[1]',
    userSelectQuestionBox : '//p[text()="User Select"]/ancestor::div[1]',
    
    //Questions form Locators
    questionInputField : '//input[@name="title"]',
    descriptionField : "//label[@for='Description']/following-sibling::textarea",
    responseRequiredButton : "//label[@for='Response required']//following-sibling::div//button",
    formSaveButton : '(//p[text()="Save"])[2]',
    addOptionButton : "//p[text()='+ Add Option']/ancestor::button",
    addOptionInputField : "//label[@for='Add Options']/ancestor::div[1]//input[@step='any']",
    typeofAttachmentButton : "//label[@for='Select the type of attachment']/following-sibling::div//button",
    firstOptionInTheDropdown : "//div[@role='option'][1]",
    userselectAdminRoleCheckbox : "//label[text()='Users with role: Admin']",

    //Checklist Locators
    addChecklistButton :  'Add Checklist Item',
    
    completedPhase : "//h1[text()='Completed']",
    plusIconForPhaseCreation :  "(//div[@id='2']//button)[1]",
    phaseInputField : "//input[@name='phaseName']",
    createPhaseButton :  "//p[text()='Create Phase']/ancestor::button",
    addTaskButtonInEmptyPhase : "//p[text()='+ Add Task']/ancestor::button[1]",

    approvalRadioButton : "//span[text()='Approval']/ancestor::span",
    completionRadioButton : "//span[text()='Completion']/ancestor::span",
    selectaroleRadioButton : "//span[text()='Select a Role']/ancestor::span",
    selectaroledropdownButton : "//label[@for='Role:']/following-sibling::div//button",
    selectaUserButton : "//span[text()='Select a User']/ancestor::span",
    selectaUserSearchField : '//input[@name="search-input"]',
    selectaUserDropdownFirstOption : "//div[@role='listbox']/div[1]",
    emSelect : "//span[text()='Engagement Manager']/ancestor::div[@role='option']",
    csmSelect : "//span[text()='CSM']/ancestor::div[@role='option']",
    requesterManagerselect : `//span[text()="Requester's Manager"]/ancestor::div[@role='option']`,
    requesterSelect : "//div[@role='option']//span[text()='Requester']",
    addTaskfromPlusButton : "//span[text()='Add Task']",
    taskNameInputField : 'Enter task name',
    
    bottomPlusIcon : "//button[contains(@class, 'absolute bottom')]",




    

    
}