export const env = {
  boards: {
    coldProspecting: process.env.REACT_APP_COLD_PROSPECTING_BOARD_ID,
    deals: process.env.REACT_APP_DEALS_BOARD_ID,
    leads: process.env.REACT_APP_LEADS_BOARD_ID,
    funders: process.env.REACT_APP_FUNDERS_BOARD_ID,
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
    followupToday: process.env.REACT_APP_TODAYS_FOLLOW_UP_VIEW_ID,
    coldProspecting: process.env.REACT_APP_COLD_PROSPECTING_VIEW_ID,
    docReview: process.env.REACT_APP_DOC_REVIEW_VIEW_ID,
    readyForSubmission: process.env.REACT_APP_READY_FOR_SUBMISSION_VIEW_ID,
    waitingForOffer: process.env.REACT_APP_WAITING_FOR_OFFER_VIEW_ID,
  },
  boardBaseURL: process.env.REACT_APP_BOARDS_BASE_URL,
  intervalTime: process.env.REACT_APP_REFETCH_TIME_SECONDS,
};

export const columnIds = {
  deals: {
    next_followup: 'date_1',
    agent: 'deal_owner',
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
    desired_funding_amount: 'text7',
    money_due_in: 'text6',
    most_important_for: 'text9',
    needs_money_for: 'text57',
    existing_debt_balance: 'text',
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
    company_name: 'text97',
    source: 'text59',
    contract_out: 'duration7',
    contract_signed: 'time_tracking6',
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
    submit_offers: 'button0',
    final_offer_entered: 'check8',
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
  },
  leads: {
    name: 'name',
    first_name: 'text7',
    last_name: 'text_1',
    phone: 'phone_1',
    email: 'lead_email',
    temperature: 'status6',
    sales_rep: 'dialer',
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
    monthly_revenue_dropdown: 'color',
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
    home_street_address: 'text96',
    home_city: 'city',
    home_state: 'state',
    home_zip: 'zip',
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
    partner_ssn: 'text67',
    partner_dob: 'text55',
    partner_ownership_percentage: 'numbers43',
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
    sequence_welcome__become_lead_w_file: 'status61',
    sequence_welcome_become_lead_wo_file: 'status69',
    sequence_manual_import: 'status85',
    start_manual_import_sequence: 'button3',
    manual_import_sequence_start_date: 'date14',
    sequence_additional_docs_needed: 'status005',
    additional_docs_sequence_date: 'date82',
    channel: 'status30',
    dq_date: 'date7',
    dq_reason: 'text22',
    sequence_dq: 'status03',
    formula: 'formula62',
    time_from_lead_creation_to_action_taken: 'time_tracking8',
    last_rep_assigned_date: 'date9',
    doc_review_timer: 'status20',
    doc_review_reminder: 'status1',
    last_action: 'status72',
    mark_as_important: 'text__1',
    last_activity: 'text8__1',
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
  },
};
export const actionsNeeded = [
  'Email',
  'Sms',
  'Files Uploaded',
  'Ans Received',
  'Approved',
];
export const stages = {
  deals: [
    {
      value: 'new_group40775',
      label: 'Ready For Submission',
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
