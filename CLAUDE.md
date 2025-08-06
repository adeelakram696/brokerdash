# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server with Monday.com tunnel
npm start
# This runs the app on port 8301 and creates a Monday tunnel for testing

# Run linting with auto-fix
npm run lintFix
```

### Building and Deployment
```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy

# Deploy to Monday.com platform
npm run mondayDeploy
```

### Testing
```bash
# Run tests (note: no tests currently exist in the codebase)
npm test
```

## Architecture Overview

This is a Monday.com application built with React (Create React App) that serves as a comprehensive broker/sales management dashboard. The application integrates deeply with Monday.com's platform for data storage and user authentication.

### Key Architectural Components

1. **Monday.com Integration**
   - All data operations go through Monday SDK JS
   - Authentication handled via Monday.com API tokens
   - Multiple boards used for different data types (Leads, Deals, Submissions, Funders, etc.)
   - Board IDs are hardcoded in the application

2. **API Layer Structure**
   - Shared GraphQL queries in `/app/apis/query.js` (user, board metadata, etc.)
   - Shared GraphQL mutations in `/app/apis/mutation.js` (updateStage, updateClientInformation, etc.)
   - Module-specific queries/mutations in respective module folders (e.g., `/app/modules/LeadModal/queries/`)
   - External API endpoint: `https://e9ee1-service-19920336-a1cfdd9d.us.monday.app/api`
   - Complex queries use pagination and nested data fetching

3. **State Management**
   - Context API for shared state (LeadContext, MatrixContext)
   - Local component state with React hooks
   - Client-side caching using drawerjs library

4. **Routing Structure**
   - React Router v5 with HashRouter
   - Lazy loading for route-based code splitting
   - Main routes: Dashboard, LeadView, LeaderBoard, DailyMatrics, TeamLeaderBoard, ManagerFunnelBoard, ApprovalsBoard, OpenApprovalsBoard, TeamCommissions

5. **Module Organization**
   ```
   /src/app/modules/
   ├── DashboardCards/    # Main dashboard components
   │   └── queries/       # Module-specific queries
   ├── LeadModal/         # Lead management interface
   │   ├── queries/       # Module-specific queries
   │   └── mutations/     # Module-specific mutations
   ├── LeaderBoard/       # Performance tracking
   │   └── queries/       # Module-specific queries
   ├── TeamLeaderBoard/   # Team performance
   │   └── queries/       # Module-specific queries
   ├── DailyMatrics/      # Daily metrics dashboard
   │   └── queries/       # Module-specific queries
   ├── ManagerFunnelBoard/# Manager funnel view
   │   └── queries/       # Module-specific queries
   ├── ApprovalsBoard/    # Approvals management
   │   └── queries/       # Module-specific queries
   ├── OpenApprovalsBoard/# Open approvals view
   │   └── queries/       # Module-specific queries
   ├── TeamCommissions/   # Commission tracking
   │   └── queries/       # Module-specific queries
   └── [other modules]
   ```

6. **Data Transformation**
   - Each module has dedicated transform functions
   - Normalization of Monday.com column values
   - Schema validation using Yup for submissions

### Important Technical Details

1. **ESLint Configuration**
   - Uses Airbnb style guide with custom rules
   - Key disabled rules: camelcase, react/prop-types, import/prefer-default-export
   - Absolute imports configured with 'src' as base path

2. **UI Framework**
   - Ant Design (antd) as primary component library
   - Ant Design Charts for data visualization
   - CSS Modules for component styling (.module.scss files)

3. **Critical Dependencies**
   - monday-sdk-js: Monday.com integration
   - react-quill: Rich text editing
   - dayjs: Date manipulation
   - pako: Data compression
   - js-base64: Encoding for API calls

4. **Environment Variables**
   - Monday.com API tokens stored in environment variables
   - Session tokens passed via URL parameters when available

### Common Development Patterns

1. **API Calls Pattern**
   ```javascript
   // Use monday SDK for GraphQL queries
   const response = await monday.api(query);
   
   // External API calls use axios with proper headers
   const config = { headers: { Authorization: sessionToken } };
   ```

2. **Component Structure**
   - Pages contain route-level components
   - Modules contain feature-specific logic
   - Components are reusable UI elements
   - Use CSS modules for styling isolation

3. **Data Fetching**
   - Real-time updates with configurable intervals (20-30s)
   - Monday.com webhooks for instant updates
   - Transform functions normalize data before use

4. **Form Handling**
   - Yup schemas for validation
   - Ant Design form components
   - Submission schemas for different funders (CFGMS, OnDeck)

### Monday.com Board References
- Leads Board: 5544986470
- Deals Board: 5544986478
- Submissions Board: 5544986688
- Funders Board: 5671699400
- Commission Settings Board: Various per user

### Performance Considerations
- Lazy loading implemented for routes
- Configurable refresh intervals for data polling
- Client-side caching for user data and stages
- Batch GraphQL queries where possible

## Submission Flow

The submission flow is a critical part of the application that handles lead submissions to various funders. Here's how it works:

### Overview
1. **Lead Selection**: Users select funders to submit a lead to
2. **Validation**: System validates the submission against funder requirements
3. **Subitem Creation**: Monday.com creates subitems for each selected funder
4. **Async Processing**: System monitors and processes newly created subitems
5. **Completion**: Updates lead status and notifies relevant parties

### Key Components

1. **SubmissionForm Component** (`/src/app/modules/LeadModal/SubmissionForm/index.js`)
   - Multi-step form (qualification → funders → documents)
   - Handles new submissions, resubmissions, and contract requests
   - Manages state for selected funders, documents, and notes

2. **Submission Process**
   - `handleSubmit()`: Initiates the submission process
   - Creates payload with funder IDs, documents, and notes
   - Triggers Monday.com to create subitems for each funder
   - Sets up event listeners for new subitem creation

3. **Async Subitem Processing**
   - `submitDeal()`: Processes individual subitems as they're created
   - `handleSubmissionTimeout()`: Fallback mechanism for missed events
   - Tracks processed subitems to avoid duplicates
   - Only processes newly selected funders (not previously submitted ones)

4. **Important Logic**
   - **Unique Funders**: System calculates which funders are newly selected vs. already submitted
   - **Timeout Handler**: Ensures all subitems are processed even if webhook events are missed
   - **Processed Tracking**: Maintains a Set of processed subitem IDs to prevent duplicate submissions

### Critical Variables
- `selectedFunders`: Array of funder IDs selected by the user
- `submittedFunders`: Array of funder IDs already submitted for this lead
- `processedSubitems`: Set tracking which subitems have been processed
- `totalSubitems`: Expected number of subitems to be created
- `allowedFunders`: List of funders that require additional processing

### Error Handling
- Validates submissions before processing
- Handles timeout scenarios with retry logic
- Cleans up state and event listeners on completion or error

## Query and Mutation Organization

### Shared vs Module-Specific

The codebase follows a pattern where:
- **Shared queries/mutations** that are used across multiple modules remain in `/app/apis/`
- **Module-specific queries/mutations** are co-located within their respective module folders

### Shared Queries (in `/app/apis/query.js`)
- `fetchUser()` - Returns cached user data
- `fetchCurrentUser()` - Fetches current user from Monday API
- `fetchUsers()` - Fetches all users list
- `fetchGroups()` - Fetches board groups/stages
- `fetchBoardColorColumnStrings()` - Fetches column color labels
- `fetchBoardDropDownColumnStrings()` - Fetches dropdown column options
- `fetchBoardValuesForSelect()` - Fetches board items for select fields
- `fetchAllUsers()` - Fetches all team users

### Shared Mutations (in `/app/apis/mutation.js`)
- `updateStage()` - Moves items between groups/stages
- `ctaBtn()` - Triggers CTA button actions
- `updateClientInformation()` - Updates multiple column values
- `createClientInformation()` - Creates new client items
- `updateSimpleColumnValue()` - Updates single column value

### Module-Specific Organization Examples

1. **LeadModal Module** (`/app/modules/LeadModal/`)
   - **queries/**: `fetchLeadClientDetails`, `fetchLeadDocs`, `fetchLeadUpdates`, etc.
   - **mutations/**: `createNewUpdate`, `sendSubmission`, `sendSmsToClient`, etc.

2. **DashboardCards Module** (`/app/modules/DashboardCards/`)
   - **queries/**: `fetchNewLeadsData`, `fetchApprovalsList`, `fetchContractsOutData`, etc.
   - Uses shared mutations from central file

3. **LeaderBoard Module** (`/app/modules/LeaderBoard/`)
   - **queries/**: `fetchLeadersBoardEmployees`, `getAllLeadsAssigned`, etc.
   - Already had its own queries file that was expanded

### Import Patterns
```javascript
// Importing shared queries/mutations
import { fetchUser, fetchUsers } from 'app/apis/query';
import { updateClientInformation } from 'app/apis/mutation';

// Importing module-specific queries/mutations
import { fetchLeadClientDetails } from './queries';
import { sendSubmission } from '../mutations';
```

### Benefits of This Organization
1. **Better code locality** - Related code stays together
2. **Clearer dependencies** - Easy to see what each module uses
3. **Easier maintenance** - Module-specific changes don't affect other modules
4. **Reduced central file size** - Prevents query.js and mutation.js from becoming too large
5. **Better testability** - Module-specific tests can focus on their own queries/mutations

## BatchManagerFunnelBoard Module

### Overview
The BatchManagerFunnelBoard is a specialized version of ManagerFunnelBoard designed to handle large date ranges by fetching data in batches. It was created to solve timeout issues when fetching extensive historical data.

### Key Features
1. **Weekly Batch Processing**: Automatically splits date ranges into weekly intervals (Monday-Sunday)
2. **Parallel Processing**: Fetches up to 5 weeks simultaneously in each batch
3. **Progressive Loading**: Shows data incrementally as it arrives, rather than waiting for all data
4. **Retry Mechanism**: Automatically retries failed API calls up to 3 times with exponential backoff
5. **Visual Progress Tracking**: Displays a progress bar showing fetch status and completed weeks

### Implementation Details

#### Data Fetching Strategy
- **Date Splitting**: Breaks date range into weekly batches
- **Chunk Processing**: Groups weeks into chunks of 5 for parallel processing
- **5-Second Delays**: Waits 5 seconds between chunk processing to avoid API overload
- **Real-time Updates**: Updates UI immediately as each week's data arrives

#### Error Handling
- **Retry Logic**: 
  - Maximum 3 retry attempts per week
  - Exponential backoff: 2s, 4s, 6s delays between retries
  - Failed weeks return empty arrays but don't stop the process
- **Abort Controller**: Can cancel ongoing fetch operations if user changes date range

#### User Experience
- **Initial Loader**: Shows full-screen loader only for the first week's data
- **Progress Display**: After first week, shows progress bar with:
  - Percentage completed
  - X/Y weeks completed counter
  - Current date range being fetched
- **Incremental Display**: Data appears in funnel chart and list as it's fetched

### Routes
- **Manager View**: `/#/batch-funnel-board`
- **User View**: `/#/batch-user-funnel-board`

### File Locations
- **Module**: `/src/app/modules/BatchManagerFunnelBoard/`
- **Page Component**: `/src/app/pages/BatchManagerFunnelBoard/`
- **Queries**: `/src/app/modules/BatchManagerFunnelBoard/queries/`

### Usage Notes
- Best suited for fetching large date ranges (months/years of data)
- Automatically removes duplicate entries by ID
- Progress bar remains visible for 2 seconds after completion
- All API calls use the same authentication as ManagerFunnelBoard