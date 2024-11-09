export const env = {
  boards: {
    coldProspecting: process.env.REACT_APP_COLD_PROSPECTING_BOARD_ID,
    deals: process.env.REACT_APP_DEALS_BOARD_ID,
    leads: process.env.REACT_APP_LEADS_BOARD_ID,
    submissions: process.env.REACT_APP_SUBMISSIONS_BOARD,
    funders: process.env.REACT_APP_FUNDERS_BOARD_ID,
    clients: process.env.REACT_APP_CLIENTS_BOARD_ID,
    clientAccounts: process.env.REACT_APP_CLIENT_ACCOUNTS_BOARD_ID,
    employees: process.env.REACT_APP_EMPLOYEES_BOARD,
    salesActivities: process.env.REACT_APP_SALES_ACTIVITIES_BOARD,
    salesActivities2: process.env.REACT_APP_SALES_ACTIVITIES2_BOARD,
    salesActivities3: process.env.REACT_APP_SALES_ACTIVITIES3_BOARD,
    metrics: process.env.REACT_APP_METRICS_BOARD,
    teamLeaderBoard: process.env.REACT_APP_TEAM_LEADERBOARD_BOARD,
    commissionSettings: process.env.REACT_APP_COMMISSION_SETTINGS_BOARD,
    [process.env.REACT_APP_DEALS_BOARD_ID]: 'deals',
    [process.env.REACT_APP_LEADS_BOARD_ID]: 'leads',
  },
  pages: {
    readyForSubmission: process.env.REACT_APP_READY_FOR_SUBMISSION_PAGE_ID,
    waitingForOffer: process.env.REACT_APP_WAITING_FOR_OFFER_PAGE_ID,
    docReview: process.env.REACT_APP_DOC_REVIEW_PAGE_ID,
    offersReadyApproved: process.env.REACT_APP_OFFERS_READY_APPROVED_PAGE_ID,
    contractsOut: process.env.REACT_APP_CONTRACTS_OUT_PAGE_ID,
    contractsSigned: process.env.REACT_APP_CONTRACTS_SIGNED_PAGE_ID,
  },
  views: {
    pitcheNotClosedId: process.env.REACT_APP_PITCH_NOT_CLOSED_VIEW_ID,
    contractSignedId: process.env.REACT_APP_CONTRACTS_SIGNED_VIEW_ID,
    followupLeadsToday: process.env.REACT_APP_TODAYS_FOLLOW_UP_LEADS_VIEW_ID,
    followupDealsToday: process.env.REACT_APP_TODAYS_FOLLOW_UP_DEALS_VIEW_ID,
    coldProspecting: process.env.REACT_APP_COLD_PROSPECTING_VIEW_ID,
    docReview: process.env.REACT_APP_DOC_REVIEW_VIEW_ID,
    readyForSubmission: process.env.REACT_APP_READY_FOR_SUBMISSION_VIEW_ID,
    waitingForOffer: process.env.REACT_APP_WAITING_FOR_OFFER_VIEW_ID,
    newLeadsToday: process.env.REACT_APP_NEW_LEADS_TODAY_VIEW_ID,
  },
  boardBaseURL: process.env.REACT_APP_BOARDS_BASE_URL,
  intervalTime: process.env.REACT_APP_REFETCH_TIME_SECONDS,
  performanceRefetchTime: process.env.REACT_APP_PERFORMANCE_REFETCH_TIME_SECONDS,
  leaderEmployeeItemId: process.env.REACT_APP_LEADERBOARD_EMPLOYEES_ITEM_ID,
  metricsGoalItemId: process.env.REACT_APP_METRICS_GOALS_ITEM_ID,
  teamLeaderBoardGoalItemId: process.env.REACT_APP_TEAM_LEADERBOARD_GOALS_ITEM_ID,
  apiBaseURL: process.env.REACT_APP_API_BASE_URL,
};

export const boardNames = {
  clients: 'clients',
  deals: 'deals',
  leads: 'leads',
  clientAccount: 'clientAccount',
  funders: 'funders',
  coldProspecting: 'coldProspecting',
};
export const columnIds = {
  deals: {
    next_followup: 'date_1',
    agent: 'deal_owner',
    assginee: 'deal_owner',
    name: 'name',
    tasks: 'subitems',
    temperature: 'status2',
    subitems_gross_commission_if_selected: 'lookup1',
    client_name: 'deal_contact',
    phone: 'mirror65',
    email: 'mirror46',
    email_local: 'email_1',
    account: 'mirror4',
    industry: 'mirror68',
    state_of_incorporation: 'mirror47',
    partner: 'connect_boards',
    partner_email: 'mirror9',
    stage: 'deal_stage',
    pitched: 'check',
    deal_value: 'deal_value',
    file_type: 'status8',
    monthly_revenue: 'status_1',
    requested_amount: 'desired_funding_amount__1',
    money_due_in: 'text6',
    most_important: 'text9',
    needs_money_for: 'text57',
    existing_debt: 'text',
    goals: 'long_text_18',
    past_and_current_financial_products: 'long_text2',
    explore_mindset: 'long_text_12',
    bank_statements: 'files2',
    mtd: 'files85',
    payoff_letter_zero_balance_letters: 'files0',
    qualification_matrix: 'files857',
    drivers_license: 'files3',
    voided_check: 'files9',
    application: 'files8',
    incoming_files: 'files',
    dropbox_folder: 'link',
    dropbox_id: 'text0',
    channel: 'status6',
    application_date: 'date96',
    total_calls: 'numbers5',
    total_call_attempts: 'numbers3',
    creation_date: 'deal_creation_date',
    funded__date: 'deal_close_date',
    task_name: 'text5',
    create_task: 'button',
    creation_log: 'creation_log',
    deal_poc: 'email4',
    deal_partner: 'email',
    company_nam: 'text97',
    company_name: 'text3',
    source: 'text59',
    contract_out: 'date6',
    contract_signed: 'date7',
    doc_review: 'date1',
    last_touched: 'date9',
    rerun_round_robin: 'status0',
    previous_assignments: 'long_text_1',
    first_name: 'text66',
    last_name: 'text8',
    title: 'text24',
    folder_id: 'text78',
    text_template: 'status3',
    funders_dropdown: 'connect_boards42',
    submit_offers_docs: 'text9__1',
    submit_offers: 'button0',
    final_offer_entered: 'check8',
    submit_contract_docs: 'text5__1',
    request_contract: 'button2',
    attach_bank_statements_to_submission: 'checkbox',
    attach_mtd__to_submission: 'checkbox7',
    attach_payoff_letters_zero_balance_to_submission: 'dup__of_mtd',
    attach_bank_statements_to_contract_request: 'boolean',
    attach_mtd_to_contract_request: 'boolean8',
    attach_payoff_letters__zero_balance_to_request_contract: 'boolean0',
    additional_body_content: 'long_text99',
    add_psf: 'check76',
    intent_letter_status: 'status4',
    intent_letter_link_pandadoc: 'link2',
    intent_letter: 'files09',
    intent_letter_id_pandadoc: 'text90',
    psf_letter_status: 'color7',
    psf_link: 'link0',
    signed_psf: 'files03',
    new_leads: 'time_tracking1',
    attempted_to_contact: 'time_tracking9',
    application_out: 'duration',
    application_in: 'duration2',
    in__document_collection: 'duration0',
    hours_in_new_leads: 'formula1',
    hours_in_attempted_to_contact: 'formula02',
    hours_in_application_out: 'formula32',
    hours_in_application_in: 'formula8',
    hours_in_document_collection: 'formula38',
    response_to_pitched: 'time_tracking7',
    ready_for_submission: 'time_tracking17',
    submitted_waiting_for_offer: 'duration5',
    offers_ready_approved: 'duration4',
    text_message: 'text_message',
    send_sms: 'button4',
    last_updated: 'last_updated',
    additional_request_contract_message: 'long_text28',
    become_business_id: 'text39',
    sequence_start_additional_docs_needed: 'button6',
    sequence_additional_docs_needed: 'status5',
    sequence_start_date_additional_docs_needed: 'date95',
    files: 'files84',
    psf_id_pandadoc: 'text55',
    phone_local: 'phone_12',
    date_declined_dq: 'date44',
    decline_dq_reason: 'text03',
    sequence_declined_dq: 'status47',
    utm_campaign: 'text58',
    submissions_24_hours_from: 'status87',
    notification_24_hour: 'status51',
    underwriting_email_notification: 'checkbox6',
    offers_waiting_email_notification: 'checkbox_1',
    offer_selected_email_notification: 'checkbox_2',
    contract_signed_email_notification: 'checkbox_3',
    funded_email_notification: 'checkbox_4',
    sequence_name: 'text63',
    sequence_step: 'text_1',
    mark_as_important: 'text__1',
    qm_bank_activity: 'long_text__1',
    qm_active_position: 'long_text4__1',
    qm_suggested_funders: 'long_text_1__1',
    qualification_matrix_data: 'long_text49__1',
    last_lead_assigned: 'hour__1',
    sequence_welcome_wo_docs_w_application: 'status50__1',
    sequence_welcome_w_docs_w_application: 'color2__1',
    sequence_welcome_wo_docs_wo_application: 'color8__1',
    sequence_welcome_become_lead_w_file: 'color80__1',
    sequence_welcome_become_lead_wo_file: 'color1__1',
    sequence_manual_import: 'color11__1',
    last_rep_assigned_date: 'date_1__1',
    dq_reason: 'dropdown4__1',
    lead_creation_date: 'date_17__1',
    lead_rotation_date: 'date_11__1',
    input_previous_submission: 'status13__1',
    approvd_application: 'button__1',
    logic_application: 'button_1__1',
    create_renewal: 'button3__1',
    renewal: 'button7__1',
    submit_offers_status: 'status72__1',
    docs_needed: 'dropdown9__1',
    custom_docs: 'text68__1',
    date_last_rotated: 'date_107__1',
    date_submitted: 'date_19__1',
    date_offer_recieved: 'date_193__1',
    reassign_rep_btn: 'button0__1',
    application_doc_id: 'text2__1',
  },
  leads: {
    name: 'name',
    first_name: 'text7',
    last_name: 'text_1',
    phone: 'phone_1',
    phone2: 'phone_19__1',
    email: 'lead_email',
    temperature: 'status6',
    sales_rep: 'dialer',
    assginee: 'dialer',
    stage: 'lead_status',
    type: 'status5',
    outreach_status: 'status_1',
    days_since_assigned: 'formula_13',
    last_touched: 'date',
    next_followup: 'date_1',
    company_name: 'lead_company',
    industry: 'industry',
    state_incorporated: 'text73',
    additional_phone: 'additional_phone',
    monthly_revenue: 'color',
    dob: 'dob',
    social_security: 'text78',
    tax_id_ein: 'tax_id',
    business_start_date: 'business_start_date',
    email_2: 'email_2',
    credit_score: 'credit_score',
    requested_amount: 'text4',
    money_due_in: 'money_due_in',
    most_important: 'long_text4',
    needs_money_for: 'text0',
    business_street_address: 'text2',
    business_city: 'text5',
    business_state: 'text6',
    business_zip: 'text1',
    address: 'text96',
    city: 'city',
    state: 'state',
    zip: 'zip',
    title: 'text',
    website: 'link',
    source: 'source5',
    indications: 'formula',
    existing_contact: 'status_13',
    existing_account: 'status_138',
    account_lookup: 'connect_boards89',
    contact_lookup: 'connect_boards2',
    subitems: 'subitems',
    lead_lookup: 'connect_boards5',
    description: 'description',
    application_date: 'application_date5',
    total_calls: 'total_calls',
    total_call_attempts: 'total_call_attempts',
    goals: 'long_text7',
    company_info: 'long_text8',
    explore_mindset: 'long_text44',
    past_and_current_financial_products: 'long_text0',
    application: 'files',
    bank_statements: 'files_1',
    mtd: 'files_2',
    payoff_letter_zero_balance_letters: 'files_3',
    qualification_matrix: 'files7',
    link_to_tasks_tds: 'board_relation',
    creation_date: 'date5',
    time_in_stage: 'time_tracking',
    rerun_round_robin: 'status9',
    previous_assignments: 'long_text2',
    dropbox_id: 'text23',
    dropbox_url: 'link6',
    existing_debt: 'text92',
    dba: 'text00',
    entity_type: 'status_19',
    ownership: 'numbers4',
    partner_first_name: 'text8',
    partner_last_name: 'text_17',
    partner_email: 'partner_email3',
    partner_phone: 'partner_phone',
    partner_address: 'text3',
    partner_city: 'text_16',
    partner_state: 'text_2',
    partner_zip: 'text_3',
    partner_credit_score: 'text_4',
    partner_social_security: 'text67',
    partner_dob: 'text55',
    partner_ownership: 'numbers43',
    incoming_files: 'files1',
    new_leads: 'time_tracking0',
    attempted_to_contact: 'time_tracking065',
    application_out: 'time_tracking9',
    application_in: 'time_tracking5',
    in__document_collection: 'time_tracking6',
    hours_in_new_leads: 'formula_18',
    hours_in_attempted_to_contact: 'formula4',
    hours_in_application_out: 'formula2',
    hours_in_application_in: 'formula99',
    hours_in_document_collection: 'formula45',
    minutes_5: 'status0',
    new_lead_or_touched: 'status86',
    time_in_the_que: 'time_tracking1',
    move_to_deals: 'status43',
    notify_agent: 'status75',
    rep: 'text738',
    last_updated: 'last_updated',
    app_out_date: 'date66',
    become_business_id: 'text46',
    sequence_welcome_wo_docs_w_application: 'status98',
    utm_campaign: 'text39',
    sequence_welcome_w_docs_w_application: 'color6',
    sequence_welcome_wo_docs_wo_application: 'color4',
    sequence_name: 'text731',
    sequence_step: 'text72',
    text_message: 'text35',
    send_sms: 'button0',
    rent_or_own: 'status2',
    sequence_welcome_become_lead_w_file: 'status61',
    sequence_welcome_become_lead_wo_file: 'status69',
    sequence_manual_import: 'status85',
    start_manual_import_sequence: 'button3',
    manual_import_sequence_start_date: 'date14',
    sequence_additional_docs_needed: 'status005',
    additional_docs_sequence_date: 'date82',
    channel: 'status30',
    dq_date: 'date7',
    dq_reason: 'dropdown__1',
    sequence_dq: 'status03',
    formula: 'formula62',
    time_from_lead_creation_to_action_taken: 'time_tracking8',
    last_rep_assigned_date: 'date9',
    doc_review_timer: 'status20',
    doc_review_reminder: 'status1',
    last_action: 'status72',
    mark_as_important: 'text__1',
    last_activity: 'text8__1',
    action_required_files: 'status__1',
    action_required_emails: 'color__1',
    action_required_sms: 'color7__1',
    qm_bank_activity: 'long_text__1',
    qm_active_position: 'long_text5__1',
    qm_suggested_funders: 'long_text_1__1',
    qualification_matrix_data: 'long_text8__1',
    last_lead_assigned: 'hour5__1',
    phone_burner: 'status54__1',
    lead_rotation_date: 'date_1__1',
    new_lead_spoken_to: 'status4__1',
    docs_needed: 'dropdown04__1',
    custom_docs: 'text_10__1',
    actively_working: 'status37__1',
    renewal: 'button__1',
    date_last_rotated: 'date_17__1',
    reassign_rep_btn: 'button6__1',
    approvd_application: 'button64__1',
    logic_application: 'button_1__1',
  },
  subItem: {
    funding_accounts: 'connect_boards5',
    product_type: 'text__1',
    status: 'status',
    funding_amount: 'numbers0',
    factor_rate: 'text6',
    ach_amount: 'numbers07',
    ach_frequency: 'status_1',
    payback_period: 'formula9',
    notes: 'notes',
    date_received: 'date0',
    payback_amount: 'formula6',
    funder_fee_perc: 'numbers4',
    funder_fee: 'formula93',
    net_funding_amt: 'formula2',
    commission_calc_on: 'commission_calc__on',
    commission_perc: 'numbers5',
    gross_commision: 'formula0',
    comission_amt: 'formula',
    professional_fee_perc: 'numbers41',
    professional_service_fee: 'formula3',
    submission_to_response_time: 'time_tracking',
    thread_id: 'text4',
    create_psf_only: 'status_16',
    owner: 'person',
    dropbox_url: 'dropbox_url',
    renewal: 'color__1',
    api_submission_response: 'long_text__1',
    offers_response: 'long_text4__1',
    documents_required_response: 'long_text2__1',
  },
  coldProspecting: {
    name: 'name',
    subitems: 'subitems',
    dialer: 'people2',
    agent_transferee: 'people8',
    follow_up_date: 'date5',
    assignment_trigger: 'button7',
    phone: 'text5',
    additional_phone: 'text65',
    first_name: 'text3',
    last_name: 'text4',
    additional_name: 'text_1',
    email: 'text',
    address: 'address',
    city: 'text2',
    state: 'text27',
    zip: 'text62',
    country: 'text7',
    description: 'long_text',
    company_name: 'text6',
    application_date: 'application_date',
    amount_requested: 'amount_requested',
    revenue: 'revenue',
    business_start_date: 'business_start_date',
    tax_id: 'tax_id',
    industry: 'industry',
    credit_score: 'credit_score',
    email_2: 'email_1',
    dob: 'dob',
    total_calls: 'numbers',
    total_call_attempts: 'dup__of_total_calls',
    last_called: 'date7',
    date_added: 'creation_log',
    source: 'source0',
    prospect_status: 'status4',
    last_call_status: 'dup__of_call_status',
    monthly_gross_sales: 'numbers5',
    time_in_business: 'time_in_business',
    assignment_amount: 'numbers4',
    channel: 'status2',
    people: 'people__1',
  },
  clients: {
    name: 'name',
    subitems: 'subitems',
    account: 'contact_account',
    industry: 'mirror8',
    state_of_incorporation: 'mirror3',
    additional_name: 'additional_name',
    first_name: 'text',
    last_name: 'text_1',
    title: 'title5',
    phone: 'phone_1',
    phone2: 'phone_1__1',
    additional_phone: 'additional_phone',
    email: 'contact_email',
    email_2: 'email',
    company: 'text8',
    deals: 'contact_deal',
    address: 'address',
    city: 'city',
    state: 'state',
    zip: 'zip',
    country: 'country',
    dob: 'dob',
    social_security: 'dup__of_dob',
    credit_score: 'text2',
    ownership: 'text4',
  },
  clientAccount: {
    name: 'name',
    am: 'people',
    all_contacts: 'account_contact',
    deals: 'connect_boards__1',
    time_in_business: 'text4',
    business_start_date: 'business_start_date',
    date: 'date',
    years_in_bus: 'formula',
    tax_id_ein: 'tax_id',
    industry: 'industry6',
    business_street_address: 'text94',
    business_city: 'text90',
    business_state: 'text1',
    business_zip: 'text2',
    website: 'link2',
    dba: 'text6',
    date_added: 'date_added',
    entity_type: 'status',
    state_incorporated: 'text5',
    rent_or_own: 'status4',
    source: 'text21',
    company_name: 'text89',
  },
  metrics: {
    leadGoal: 'text__1',
    leadSubmissionGoal: 'text3__1',
    dealPitchGoal: 'text9__1',
  },
  teamLeaderBaord: {
    person: 'person',
    newLeadSpokenTo: 'numbers__1',
    followUpCalls: 'numbers3__1',
    submissions: 'numbers6__1',
    approvals: 'numbers5__1',
    dealsFunded: 'numbers59__1',
    totalFunded: 'numbers34__1',
  },
  funders: {
    paper_type: 'paper_type_3',
    min_rev_annual: 'min_rev_annual_3',
    min_rev_monthly: 'min_rev_monthly_3',
    min_credit_score: 'min_credit_score_3',
    max_position: 'max_position_3',
    first_position: 'first_position_3',
    state_restrictions: 'state_restrictions_3',
    rest_industries: 'rest_industries_3',
    insuffient_funds_30: 'insuffient_funds_30_3',
    insuffient_funds_90: 'insuffient_funds_90_3',
    negative_days_30: 'negative_days_30_3',
    negative_days_90: 'negative_days_90_3',
    min_month_dep_count: 'min_month_dep_count_3',
    min_time_in_bus_months: 'min_time_in_bus_months_3',
    min_avg_daily_balance: 'min_avg_daily_balance__1',
    min_funding_amount: 'min_funding_amount_3',
    max_funding_amount: 'max_funding_amount_3',
    tier: 'tier_3',
    past_settled_defaults: 'checkbox7__1',
    monthly_priority: 'checkbox6__1',
    accept_online_banking: 'check__1',
    testing_funder: 'checkbox3__1',
  },
  commissionSettings: {
    name: 'name',
    person: 'person',
    min_cgi: 'text__1',
    max_cgi: 'text_1__1',
    inbound: 'text_2__1',
    outbound: 'text_3__1',
  },
};
export const actionsNeeded = [
  'Email',
  'Sms',
  'Files Uploaded',
  'Ans Received',
  'Approved',
];
export const renewalTags = {
  current: 'Current',
  renewal: 'Renewal',
  old: 'Old',
};
export const stages = {
  deals: [
    {
      value: 'new_group40775',
      label: 'Ready For Submission',
    },
    {
      value: 'new_group1842__1',
      label: 'Docs Needed',
    },
    {
      value: 'new_group748',
      label: 'Submitted/Waiting for offer',
    },
    {
      value: 'new_group54418',
      label: 'Offers Ready/Approved',
    },
    {
      value: 'new_group61375',
      label: 'Contracts Requested',
    },
    {
      value: 'new_group59616',
      label: 'Contract Out',
    },
    {
      value: 'new_group26835',
      label: 'Contract Signed',
    },
    {
      value: 'closed',
      label: 'Funded',
    },
    {
      value: 'new_group94387',
      label: 'Declined',
    },
    {
      value: 'new_group',
      label: 'Lost Deals',
    },
    {
      value: 'new_group57330',
      label: 'Client Rejected',
    },
    {
      value: 'new_group91774',
      label: 'DQ',
    },
    {
      value: 'new_group55197',
      label: 'Nurtured',
    },
  ],
  leads: [
    {
      value: 'topics',
      label: 'New Leads',
    },
    {
      value: 'new_group79229',
      label: 'Application Out',
    },
    {
      value: 'new_group42384',
      label: 'Application In - No Docs',
    },
    {
      value: 'new_group7612',
      label: 'Application in - Additional Docs Needed',
    },
    {
      value: 'new_group96588',
      label: 'Application in - Doc Review',
    },
    {
      value: 'new_group38016',
      label: 'Nurtured Group',
    },
    {
      value: 'new_group18958',
      label: 'Disqualified',
    },
  ],
};

export const sequenceSteps = {
  leads: {
    sequence_additional_docs_needed: [
      {
        title: 'Step 1: Immediate',
      },
      {
        title: 'Step 2: 1 day after',
      },
      {
        title: 'Step 3: 2 days after',
      },
      {
        title: 'Completed',
      },
    ],
    sequence_welcome_wo_docs_w_application: [
      {
        title: 'Step 1 -  Immediate',
      },
      {
        title: 'Step 2 -  Next Morning',
      },
      {
        title: 'Step 3 - 5 hours after next morning',
      },
      {
        title: 'Step 4 - 3 days after',
      },
      {
        title: 'Completed',
      },
    ],
    sequence_welcome_w_docs_w_application: [
      {
        title: 'Step 1 -  Immediate',
      },
      {
        title: 'Completed',
      },
    ],
    sequence_welcome_wo_docs_wo_application: [
      {
        title: 'Step 1 -  Immediate',
      },
      {
        title: 'Step 2 -  Next Morning',
      },
      {
        title: 'Step 3 - 3 days later',
      },
      {
        title: 'Step 4 - 5 days later',
      },
      {
        title: 'Step 5 - 7 Days later',
      },
      {
        title: 'Step 6 - 12 Days later',
      },
      {
        title: 'Step 7 - 1st day of next month',
      },
      {
        title: 'Completed',
      },
    ],
    sequence_welcome_become_lead_w_file: [
      {
        title: 'Step 1 -  Immediate',
      },
      {
        title: 'Completed',
      },
    ],
    sequence_welcome_become_lead_wo_file: [
      {
        title: 'Step 1: Immediate',
      },
      {
        title: 'Step 2: Next Morning',
      },
      {
        title: 'Step 3: Two Days Later',
      },
      {
        title: 'Completed',
      },
    ],
    sequence_manual_import: [
      {
        title: 'Step 1: Immediate',
      },
      {
        title: 'Step 2: 14 days later',
      },
      {
        title: 'Step 3: 30 days later',
      },
      {
        title: 'Completed',
      },
    ],
    sequence_dq: [
      {
        title: 'Step 1: Immediate',
      },
      {
        title: 'Step 2: 45 Days Later',
      },
      {
        title: 'Completed',
      },
    ],
  },
  deals: {
    sequence_additional_docs_needed: [
      {
        title: 'Step 1: Immediate',
      },
      {
        title: 'Step 2: After 24 hours',
      },
      {
        title: 'Step 3: After 48 hours',
      },
      {
        title: 'Completed',
      },
    ],
    sequence_declined_dq: [
      {
        title: 'Step 1: Immediate',
      },
      {
        title: 'Step 2: 45 days after',
      },
      {
        title: 'Completed',
      },
    ],
    sequence_welcome_wo_docs_w_application: [
      {
        title: 'Step 1 -  Immediate',
      },
      {
        title: 'Notify',
      },
      {
        title: 'Completed',
      },
    ],
    sequence_welcome_w_docs_w_application: [
      {
        title: 'Step 1 -  Immediate',
      },
      {
        title: 'Notify',
      },
      {
        title: 'Completed',
      },
    ],
    sequence_welcome_wo_docs_wo_application: [
      {
        title: 'Step 1 -  Immediate',
      },
      {
        title: 'Notify',
      },
      {
        title: 'Completed',
      },
    ],
    sequence_welcome_become_lead_w_file: [
      {
        title: 'Step 1 -  Immediate',
      },
      {
        title: 'Notify',
      },
      {
        title: 'Completed',
      },
    ],
    sequence_welcome_become_lead_wo_file: [
      {
        title: 'Step 1 -  Immediate',
      },
      {
        title: 'Notify',
      },
      {
        title: 'Completed',
      },
    ],
    sequence_manual_import: [
      {
        title: 'Step 1 -  Immediate',
      },
      {
        title: 'Notify',
      },
      {
        title: 'Completed',
      },
    ],
  },
};

export const sources = [
  {
    value: 'Become',
    label: 'Become',
  },
  {
    value: 'metappc',
    label: 'metappc',
  },
  {
    value: 'Email',
    label: 'Email',
  },
  {
    value: 'meta',
    label: 'meta',
  },
  {
    value: 'Brochure',
    label: 'Brochure',
  },
];

export const legendColors = [
  '#FF6384', // Red
  '#36A2EB', // Blue
  '#FFCE56', // Yellow
  '#4BC0C0', // Teal
  '#9966FF', // Purple
  '#FF9F40', // Orange
  '#E7E9ED', // Light Gray
  '#7BDCB5', // Green
];

export const submissionFunders = {
  onDeck: 'OnDeck',
  cfgms: 'CFGMS',
};

export const allowedFunders = [
  6976521906,
  6948733727,
  6765205008,
  // 6765205031,
  6765204931,
];

export const fundersServices = {
  6948733727: submissionFunders.onDeck, // CW TEST
  6765205008: submissionFunders.onDeck, // ONDECK
  // 6765205031: submissionFunders.onDeck, // ONDECK canada
  6976521906: submissionFunders.cfgms, // API TEST
  6765204931: submissionFunders.cfgms, // CFGMS
};

export const entityMapping = {
  'sole proprietorship': 'SP',
  llc: 'LLC',
  corporation: 'CORP',
  corp: 'CORP',
  gp: 'GP',
  other: 'UNKNOWN',
};

export const dateFormat = {
  YYYYMD: 'YYYY-M-D',
  YYYYMMDD: 'YYYY-MM-DD',
};

export const stateSOS = {
  AL: 'https://arc-sos.state.al.us/CGI/CORPNAME.MBR/INPUT',
  AK: 'https://www.commerce.alaska.gov/cbp/main/search/entities',
  AZ: 'https://ecorp.azcc.gov/EntitySearch/Index',
  AR: 'https://www.sos.arkansas.gov/corps/search_all.php',
  CA: 'https://bizfileonline.sos.ca.gov/search/business',
  CO: 'https://www.sos.state.co.us/biz/BusinessEntityCriteriaExt.do',
  CT: 'https://service.ct.gov/business/s/onlinebusinesssearch?language=en_US',
  DE: 'https://icis.corp.delaware.gov/Ecorp/EntitySearch/NameSearch.aspx',
  FL: 'http://search.sunbiz.org/Inquiry/CorporationSearch/ByName',
  GA: 'https://ecorp.sos.ga.gov/BusinessSearch',
  HI: 'https://hbe.ehawaii.gov/documents/search.html?mobile=N&amp;site_preference=normal',
  ID: 'https://sosbiz.idaho.gov/search/business',
  IL: 'https://apps.ilsos.gov/corporatellc/',
  IN: 'https://bsd.sos.in.gov/publicbusinesssearch',
  IA: 'https://sos.iowa.gov/search/business/search.aspx',
  KS: 'https://www.kansas.gov/bess/flow/main?execution=e1s1',
  KY: 'https://web.sos.ky.gov/BusSearchNProfile/search.aspx',
  LA: 'https://coraweb.sos.la.gov/CommercialSearch/CommercialSearch.aspx',
  ME: 'https://icrs.informe.org/nei-sos-icrs/ICRS?MainPage=x',
  MD: 'https://egov.maryland.gov/BusinessExpress/EntitySearch',
  MA: 'https://corp.sec.state.ma.us/corpweb/CorpSearch/CorpSearch.aspx',
  MI: 'https://cofs.lara.state.mi.us/SearchApi/Search/Search',
  MN: 'https://mblsportal.sos.state.mn.us/Business/Search',
  MS: 'https://corp.sos.ms.gov/corp/portal/c/page/corpBusinessIdSearch/portal.aspx',
  MO: 'https://bsd.sos.mo.gov/BusinessEntity/BESearch.aspx',
  MT: 'https://biz.sosmt.gov/business',
  NE: 'https://www.nebraska.gov/sos/corp/corpsearch.cgi',
  NV: 'https://esos.nv.gov/EntitySearch/OnlineEntitySearch',
  NH: 'https://quickstart.sos.nh.gov/online/BusinessInquire',
  NJ: 'https://www.njportal.com/DOR/BusinessNameSearch',
  NM: 'https://portal.sos.state.nm.us/BFS/online/CorporationBusinessSearch',
  NY: 'https://apps.dos.ny.gov/publicInquiry',
  NC: 'https://www.sosnc.gov/search/index/corp',
  ND: 'https://firststop.sos.nd.gov/search/business',
  OH: 'https://businesssearch.ohiosos.gov/',
  OK: 'https://www.sos.ok.gov/corp/corpInquiryFind.aspx',
  OR: 'https://sos.oregon.gov/business/Pages/find.aspx',
  PA: 'https://file.dos.pa.gov/search/business',
  RI: 'https://business.sos.ri.gov/CorpWeb/CorpSearch/CorpSearch.aspx',
  SC: 'https://businessfilings.sc.gov/BusinessFiling/Entity/Search',
  SD: 'https://sosenterprise.sd.gov/BusinessServices/Business/FilingSearch.aspx',
  TN: 'https://tnbear.tn.gov/ECommerce/FilingSearch.aspx',
  TX: 'https://mycpa.cpa.state.tx.us/coa/',
  UT: 'https://secure.utah.gov/bes',
  VT: 'https://bizfilings.vermont.gov/online/BusinessInquire',
  VA: 'https://cis.scc.virginia.gov',
  WA: 'https://ccfs.sos.wa.gov/#/AdvancedSearch',
  WV: 'https://apps.sos.wv.gov/business/corporations/',
  WI: 'https://www.wdfi.org/apps/CorpSearch/Search.aspx',
  WY: 'https://wyobiz.wyo.gov/Business/FilingSearch.aspx',
};
