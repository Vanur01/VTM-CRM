# VTM CRM - User Guide & Feature Documentation

**Version:** 0.1.0  
**Last Updated:** October 18, 2025  
**Document Type:** User Manual & Feature Guide

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Sales CRM Features](#sales-crm-features)
5. [Finance Management](#finance-management)
6. [Dashboard & Analytics](#dashboard--analytics)
7. [Settings & Configuration](#settings--configuration)
8. [Mobile Experience](#mobile-experience)
9. [Notifications & Alerts](#notifications--alerts)
10. [Tips & Best Practices](#tips--best-practices)
11. [FAQ](#faq)
12. [Glossary](#glossary)

---

## 1. Introduction

### 1.1 About VTM CRM

VTM CRM is a comprehensive Customer Relationship Management platform designed to streamline your business operations. It combines powerful sales tools, financial management, and team collaboration features into one unified system.

### 1.2 Key Benefits

✅ **Centralized Data Management**: All customer information in one place  
✅ **Automated Workflows**: Reduce manual tasks and increase efficiency  
✅ **Real-time Analytics**: Make data-driven decisions instantly  
✅ **Role-based Access**: Secure data with granular permissions  
✅ **Mobile-Friendly**: Access your CRM anywhere, anytime  
✅ **Scalable**: Grows with your business needs  

### 1.3 System Requirements

**Minimum Requirements:**
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Internet connection (minimum 1 Mbps)
- Screen resolution: 1280x720 or higher

**Recommended:**
- Google Chrome (latest version)
- Broadband internet connection (5+ Mbps)
- Screen resolution: 1920x1080 or higher

### 1.4 Supported Platforms

- 💻 Desktop: Windows, macOS, Linux
- 📱 Mobile: iOS 13+, Android 8+
- 🌐 Browsers: Chrome, Firefox, Safari, Edge

---

## 2. Getting Started

### 2.1 Account Registration

#### Step 1: Access Registration Page
1. Navigate to the registration page: `/auth/register`
2. You'll see the registration form

#### Step 2: Fill Registration Details
```
Required Information:
- Full Name
- Email Address
- Mobile Number
- Password (minimum 8 characters)
- Confirm Password
```

#### Step 3: Email Verification
1. Check your email inbox
2. Click the verification link
3. Your account is now active

#### Step 4: Complete Profile Setup
1. Add company information
2. Select your industry
3. Set your preferences

### 2.2 Logging In

#### Standard Login:
1. Go to `/auth/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to your dashboard

#### Google Sign-In:
1. Click "Sign in with Google"
2. Select your Google account
3. Grant permissions
4. Automatic redirect to dashboard

### 2.3 Password Reset

**Forgot Your Password?**
1. Click "Forgot Password" on login page
2. Enter your registered email
3. Check your email for reset link
4. Click the link and create new password
5. Log in with new credentials

### 2.4 First-Time Setup

After logging in for the first time:

1. **Complete Your Profile**
   - Add profile picture
   - Update contact information
   - Set timezone and language preferences

2. **Configure Company Settings**
   - Company name and logo
   - Business address
   - Tax information (if applicable)

3. **Invite Team Members**
   - Go to Settings → User Management
   - Click "Invite User"
   - Enter email addresses
   - Assign roles

4. **Customize Dashboard**
   - Choose which widgets to display
   - Set default views
   - Configure notification preferences

---

## 3. User Roles & Permissions

### 3.1 Role Overview

VTM CRM supports three primary user roles:

| Role | Access Level | Key Capabilities |
|------|--------------|------------------|
| **Admin** | Full Access | All features, user management, system configuration |
| **Manager** | Team Management | Team oversight, reporting, limited settings |
| **User** | Standard Access | Basic CRM operations, own tasks and leads |

### 3.2 Admin Role

**Access Areas:**
- ✅ All Sales CRM features
- ✅ All Finance modules
- ✅ Full Settings access
- ✅ User management
- ✅ Analytics & Reports
- ✅ System configuration
- ✅ Recycle bin management

**Key Responsibilities:**
- System configuration and maintenance
- User account management
- Data security and compliance
- Performance monitoring
- Subscription management

**Route Pattern:** `/sales-crm/*`, `/finance/*`, `/settings/*`

### 3.3 Manager Role

**Access Areas:**
- ✅ Sales CRM features
- ✅ Finance modules (view/edit)
- ✅ Team member management
- ✅ Team performance reports
- ✅ Limited settings (profile, email)

**Key Responsibilities:**
- Team supervision and guidance
- Lead assignment
- Performance tracking
- Report generation
- Task delegation

**Route Pattern:** `/manager/sales-crm/*`, `/manager/finance/*`

### 3.4 User Role

**Access Areas:**
- ✅ Assigned leads and contacts
- ✅ Personal tasks and activities
- ✅ Calls and meetings
- ✅ Basic reporting
- ✅ Profile settings

**Restrictions:**
- ❌ Cannot manage other users
- ❌ Limited analytics access
- ❌ Cannot access recycle bin
- ❌ Cannot modify system settings

**Route Pattern:** `/user/sales-crm/*`, `/user/finance/*`

### 3.5 Permission Matrix

| Feature | Admin | Manager | User |
|---------|-------|---------|------|
| Create Leads | ✅ | ✅ | ✅ |
| Edit All Leads | ✅ | ✅ | ❌ |
| Delete Leads | ✅ | ✅ | ❌ |
| Assign Leads | ✅ | ✅ | ❌ |
| View Analytics | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ✅ (Team only) | ❌ |
| System Settings | ✅ | ❌ | ❌ |
| Financial Reports | ✅ | ✅ | ❌ |
| Export Data | ✅ | ✅ | ✅ (Own data) |

---

## 4. Sales CRM Features

### 4.1 Dashboard

**Location:** `/sales-crm/home`

The dashboard provides a comprehensive overview of your sales activities.

**Key Widgets:**

1. **Performance Metrics**
   - Total Leads
   - Conversion Rate
   - Revenue Generated
   - Active Tasks

2. **Recent Activities**
   - Latest lead updates
   - Upcoming meetings
   - Pending tasks
   - Recent calls

3. **Sales Funnel**
   - Visual representation of lead stages
   - Conversion rates per stage
   - Bottleneck identification

4. **Quick Actions**
   - Add New Lead
   - Schedule Meeting
   - Create Task
   - Log Call

**Customization:**
- Drag and drop widgets to rearrange
- Show/hide specific widgets
- Set date ranges for metrics
- Choose display preferences

### 4.2 Lead Management

**Location:** `/sales-crm/leads`

Lead management is the core of the CRM system.

#### 4.2.1 Creating a Lead

**Method 1: Manual Entry**
1. Click "Add Lead" button
2. Fill in the lead form:
   ```
   Basic Information:
   - First Name *
   - Last Name *
   - Email *
   - Phone *
   - Company
   
   Lead Details:
   - Status (New, Contacted, Qualified, etc.)
   - Source (Website, Referral, Cold Call, etc.)
   - Industry
   - Priority (Low, Medium, High)
   
   Additional:
   - Address
   - Notes
   - Tags
   - Custom Fields
   ```
3. Click "Save Lead"

**Method 2: Import from CSV**
1. Click "Import Leads"
2. Download sample CSV template
3. Fill in your lead data
4. Upload the CSV file
5. Map columns to CRM fields
6. Review and confirm import

**Method 3: Quick Add**
1. Use the quick add form in the sidebar
2. Enter minimal information (Name, Email, Phone)
3. Lead is created with default values
4. Complete details later

#### 4.2.2 Lead Stages

The system supports multiple lead stages:

```
New → Contacted → Qualified → Proposal → 
Negotiation → Won / Lost
```

**Stage Descriptions:**

- **New**: Fresh lead, not yet contacted
- **Contacted**: Initial contact made
- **Qualified**: Meets criteria, potential customer
- **Proposal**: Proposal/quote sent
- **Negotiation**: In discussion phase
- **Won**: Successfully converted
- **Lost**: Did not convert (with reason)

**Moving Leads Between Stages:**
1. Open lead details
2. Click on current stage
3. Select new stage from dropdown
4. Add notes about the stage change
5. Save changes

#### 4.2.3 Lead Assignment

**Individual Assignment:**
1. Select a lead from the list
2. Click "Assign" button
3. Choose team member from dropdown
4. Add assignment notes (optional)
5. Click "Assign Lead"

**Bulk Assignment:**
1. Select multiple leads using checkboxes
2. Click "Bulk Actions" → "Assign"
3. Choose team member
4. Confirm assignment
5. Notification sent to assignee

**Auto-Assignment Rules:**
- Round-robin distribution
- Based on territory
- Based on expertise
- Load balancing

#### 4.2.4 Lead Filters

**Quick Filters:**
- My Leads
- All Leads
- Unassigned
- Hot Leads
- This Week's Leads
- Overdue Follow-ups

**Advanced Filters:**
```
Filter By:
- Status
- Source
- Industry
- Date Range
- Assigned To
- Tags
- Custom Fields
```

**Saved Filters:**
1. Configure your filters
2. Click "Save Filter"
3. Name your filter
4. Access from "My Filters" dropdown

#### 4.2.5 Lead Details View

**Information Sections:**

1. **Overview**
   - Contact information
   - Company details
   - Lead status and source
   - Assignment info

2. **Timeline**
   - All activities (chronological)
   - Calls, meetings, tasks
   - Status changes
   - Notes and comments

3. **Activities**
   - Open activities (pending)
   - Closed activities (completed)
   - Activity summary

4. **Documents**
   - Uploaded files
   - Proposals
   - Contracts
   - Email attachments

5. **Related Records**
   - Associated deals
   - Related contacts
   - Company information
   - Quotes/Invoices

### 4.3 Lead Chain Analytics

**Location:** `/sales-crm/lead-chain`

Visualize and analyze your sales pipeline performance.

**Features:**

1. **Sales Funnel Visualization**
   - 6-stage funnel (New → Won)
   - Lead count per stage
   - Conversion rates
   - Average time in each stage

2. **Performance Metrics**
   ```
   - Total Leads: 1,247
   - Active Leads: 856
   - Conversion Rate: 12.5%
   - Average Deal Size: $15,450
   - Total Revenue: $2.4M
   ```

3. **Charts & Graphs**
   - Lead distribution by stage (Pie Chart)
   - Conversion trends over time (Area Chart)
   - Lead source performance (Bar Chart)
   - Team performance comparison

4. **Team Performance**
   - Individual member statistics
   - Leads assigned vs converted
   - Average conversion time
   - Revenue generated

5. **Recent Chains**
   - Latest lead progressions
   - Time spent in each stage
   - Current stage and next action
   - Deal value

**How to Use:**
1. Access Lead Chain page
2. Select date range
3. Choose team members (optional)
4. Apply filters as needed
5. Export reports for sharing

### 4.4 Task Management

**Location:** `/sales-crm/tasks`

Organize and track all your tasks efficiently.

#### 4.4.1 Creating Tasks

**Quick Create:**
1. Click "New Task" button
2. Fill in:
   ```
   - Task Title *
   - Due Date *
   - Priority (Low/Medium/High)
   - Assigned To
   - Related Lead
   ```
3. Click "Create"

**Detailed Create:**
1. Use the full task form
2. Add additional fields:
   ```
   - Description
   - Checklist items
   - Attachments
   - Tags
   - Reminders
   - Recurring settings
   ```
3. Save task

#### 4.4.2 Task Views

**List View:**
- Tabular display of all tasks
- Sortable columns
- Quick actions (Edit, Delete, Complete)

**Board View:**
- Kanban-style task board
- Drag and drop between columns
- Visual workflow management

**Calendar View:**
- Tasks displayed on calendar
- Day/Week/Month views
- Drag to reschedule

**My Tasks:**
- Personal task list
- Quick access to assigned tasks
- Priority sorting

#### 4.4.3 Task Management

**Marking Complete:**
1. Check the task checkbox, or
2. Open task and click "Mark Complete"
3. Add completion notes (optional)

**Editing Tasks:**
1. Click on task to open details
2. Click "Edit" button
3. Modify fields as needed
4. Save changes

**Setting Reminders:**
1. Open task details
2. Click "Add Reminder"
3. Choose reminder time:
   - 15 minutes before
   - 1 hour before
   - 1 day before
   - Custom time
4. Save settings

**Recurring Tasks:**
1. Create or edit task
2. Enable "Recurring" option
3. Set recurrence pattern:
   - Daily
   - Weekly (select days)
   - Monthly (select date)
   - Custom pattern
4. Save task

### 4.5 Call Management

**Location:** `/sales-crm/calls`

Log and track all phone interactions with leads and customers.

#### 4.5.1 Logging a Call

**During/After Call:**
1. Click "Log Call" button
2. Enter details:
   ```
   - Call Purpose *
   - Lead/Contact *
   - Call Type (Inbound/Outbound)
   - Duration
   - Outcome
   - Notes
   ```
3. Save call log

**Features:**
- Automatic duration tracking
- Call recordings (if configured)
- Outcome categorization
- Follow-up task creation

#### 4.5.2 Scheduling Calls

1. Click "Schedule Call"
2. Select date and time
3. Choose lead/contact
4. Set reminder
5. Add agenda/notes
6. Save schedule

**Reminders:**
- Desktop notification
- Email reminder
- Mobile push notification

#### 4.5.3 Call Analytics

**Metrics Tracked:**
- Total calls made/received
- Average call duration
- Call outcomes
- Conversion rate from calls
- Best time to call

**Reports Available:**
- Daily call summary
- Weekly call performance
- Team call statistics
- Lead-wise call history

### 4.6 Meeting Management

**Location:** `/sales-crm/meetings`

Schedule, organize, and track meetings effectively.

#### 4.6.1 Creating Meetings

**Basic Meeting:**
1. Click "New Meeting"
2. Fill meeting details:
   ```
   Required:
   - Title *
   - Date & Time *
   - Duration *
   - Participants *
   
   Optional:
   - Location/Meeting Link
   - Agenda
   - Related Lead/Contact
   - Attachments
   - Notes
   ```
3. Click "Schedule Meeting"

**Meeting Types:**
- In-Person Meeting
- Video Conference
- Phone Conference
- Client Visit

#### 4.6.2 Managing Participants

**Adding Participants:**
1. Search for team members
2. Add external participants by email
3. Set participant roles:
   - Organizer
   - Required
   - Optional

**Participant Features:**
- Accept/Decline invitations
- Propose new time
- Add to calendar
- View participant status

#### 4.6.3 Meeting Features

**Calendar Integration:**
- Sync with Google Calendar
- Export to .ics file
- Two-way synchronization
- Conflict detection

**Video Conferencing:**
- Integrated meeting links
- One-click join
- Screen sharing
- Recording options

**Meeting Notes:**
- Take notes during meeting
- Rich text formatting
- Assign action items
- Share notes with participants

**Follow-ups:**
- Automatically create tasks
- Schedule follow-up meeting
- Send thank you emails
- Update lead status

#### 4.6.4 Meeting Views

**List View:**
- All meetings in list format
- Filter by status (Upcoming, Past, Cancelled)
- Search functionality

**Calendar View:**
- Visual calendar display
- Day/Week/Month views
- Color-coded by type
- Drag to reschedule

**My Meetings:**
- Meetings you're invited to
- Your organized meetings
- Accepted/Pending status

### 4.7 Reports

**Location:** `/sales-crm/reports`

Generate comprehensive reports for insights and decision-making.

#### 4.7.1 Standard Reports

**Lead Reports:**
- Lead Source Analysis
- Lead Status Distribution
- Conversion Rate Report
- Lead Age Report
- Lead Assignment Report

**Activity Reports:**
- Activity Summary
- Task Completion Rate
- Call Log Report
- Meeting Summary
- Email Activity Report

**Performance Reports:**
- Team Performance
- Individual Performance
- Revenue Report
- Deal Velocity
- Pipeline Health

**Sales Reports:**
- Sales by Region
- Sales by Product
- Sales Trends
- Forecast Report
- Win/Loss Analysis

#### 4.7.2 Custom Reports

**Creating Custom Reports:**
1. Go to Reports page
2. Click "Create Custom Report"
3. Select report type:
   - Tabular Report
   - Summary Report
   - Matrix Report
4. Choose fields to include
5. Set filters and conditions
6. Configure grouping
7. Preview report
8. Save and name your report

**Report Builder Features:**
- Drag and drop fields
- Multiple grouping levels
- Conditional formatting
- Calculated fields
- Cross-filters

#### 4.7.3 Report Scheduling

**Schedule Reports:**
1. Open any report
2. Click "Schedule"
3. Set frequency:
   - Daily
   - Weekly (choose day)
   - Monthly (choose date)
4. Add recipients
5. Choose format (PDF, Excel, CSV)
6. Save schedule

**Automatic Delivery:**
- Email delivery to specified recipients
- Attached in selected format
- Delivered at scheduled time
- Option to include dashboard link

#### 4.7.4 Report Export

**Export Options:**
- PDF: For sharing and presentations
- Excel: For further analysis
- CSV: For data import to other systems
- Print: For hard copies

**Export Process:**
1. Generate report
2. Click "Export" button
3. Select format
4. Choose options (page size, orientation)
5. Download file

### 4.8 Analytics (Admin Only)

**Location:** `/sales-crm/analytics`

Advanced analytics and business intelligence dashboard.

**Analytics Modules:**

1. **Sales Analytics**
   - Revenue trends
   - Sales forecasting
   - Product performance
   - Territory analysis

2. **Lead Analytics**
   - Lead source effectiveness
   - Conversion funnel analysis
   - Lead scoring
   - Attribution reporting

3. **Team Analytics**
   - Individual performance metrics
   - Productivity analysis
   - Activity benchmarking
   - Workload distribution

4. **Customer Analytics**
   - Customer lifetime value
   - Churn analysis
   - Engagement metrics
   - Satisfaction scores

**Interactive Features:**
- Interactive charts and graphs
- Drill-down capabilities
- Custom date ranges
- Comparative analysis
- Trend identification

**Key Metrics:**
```
Performance KPIs:
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Customer Lifetime Value (CLV)
- Churn Rate
- Average Deal Size
- Sales Cycle Length
```

### 4.9 Support Tickets

**Location:** `/sales-crm/support`

Manage customer support and service requests.

#### 4.9.1 Creating Support Tickets

**Customer Portal:**
1. Customer submits ticket via portal
2. Auto-assignment to support team
3. Notification sent to assigned agent

**Internal Creation:**
1. Click "New Ticket"
2. Fill ticket details:
   ```
   - Subject *
   - Customer *
   - Category
   - Priority (Low/Medium/High/Urgent)
   - Description
   - Attachments
   ```
3. Submit ticket

#### 4.9.2 Ticket Management

**Ticket Statuses:**
- New
- Open
- Pending
- On Hold
- Resolved
- Closed

**Workflow:**
```
New Ticket → Assigned → In Progress → 
Pending Customer Response → Resolved → Closed
```

**Features:**
- Internal notes (not visible to customer)
- Public responses (sent to customer)
- Ticket history and audit trail
- SLA tracking
- Escalation rules

#### 4.9.3 Support Features

**Knowledge Base Integration:**
- Suggested articles for agents
- Customer self-service portal
- FAQ management

**Canned Responses:**
- Pre-written responses
- Quick replies
- Template library

**Collaboration:**
- Assign to multiple agents
- Internal discussions
- Supervisor review

**Customer Communication:**
- Email notifications
- Status updates
- Satisfaction surveys

---

## 5. Finance Management

### 5.1 Finance Overview

The Finance module provides comprehensive tools for managing sales and purchase transactions, inventory, and financial reporting.

**Main Sections:**
- Sales
- Purchases
- Inventory
- Reports

### 5.2 Sales Module

#### 5.2.1 Client Management

**Location:** `/finance/clients`

Manage your customer database.

**Adding Clients:**
1. Click "Add Client"
2. Enter client information:
   ```
   Basic Details:
   - Client Name *
   - Email *
   - Phone *
   - Company
   
   Business Details:
   - GSTIN (if applicable)
   - PAN
   - Billing Address
   - Shipping Address
   
   Payment Terms:
   - Credit Period
   - Credit Limit
   - Payment Method Preference
   ```
3. Save client

**Client Features:**
- Contact person management
- Multiple addresses
- Transaction history
- Outstanding balance
- Document repository

#### 5.2.2 Quotations

**Location:** `/finance/quotations`

Create and manage price quotations.

**Creating Quotation:**
1. Navigate to Quotations page
2. Click "Create Quotation"
3. Select client
4. Add items/services:
   ```
   For Each Item:
   - Item Name/Description
   - Quantity
   - Rate
   - Tax Rate
   - Discount (if any)
   ```
5. Configure settings:
   - Quote validity period
   - Terms and conditions
   - Payment terms
   - Phase-wise payment (optional)
6. Preview quotation
7. Save and send to client

**Quotation Features:**
- **Phase-wise Payment**: Break total into installments
  - Define payment phases
  - Set due dates for each phase
  - Automatic amount calculation
  - Track payment against each phase

- **PDF Generation**: Professional quote documents
- **Email Integration**: Send directly to client
- **Version Control**: Track quote revisions
- **Convert to Invoice**: One-click conversion
- **Approval Workflow**: Manager approval required

**Quotation Status:**
- Draft
- Sent
- Viewed (client opened)
- Accepted
- Rejected
- Expired
- Converted to Invoice

#### 5.2.3 Proforma Invoices

**Location:** `/finance/performa-invoices`

Generate proforma invoices for advance payments or customs.

**Creating Proforma Invoice:**
1. Click "New Proforma Invoice"
2. Select client
3. Add items (similar to quotation)
4. Set payment terms
5. Generate document

**Use Cases:**
- International shipments
- Advance payment requests
- Price confirmation
- Budget approval

**Features:**
- Convert from quotation
- Multi-currency support
- Custom numbering
- Multiple tax rates

#### 5.2.4 Invoices

**Location:** `/finance/invoices`

Create and manage tax invoices.

**Invoice Creation:**
1. Click "Create Invoice"
2. Select client
3. Choose from options:
   - Create fresh invoice
   - Convert from quotation
   - Convert from proforma invoice
4. Add items/services
5. Calculate taxes (GST/VAT)
6. Set payment due date
7. Generate invoice

**Invoice Features:**
- **Automatic Numbering**: Sequential invoice numbers
- **Tax Calculation**: Automatic GST/VAT computation
- **Payment Tracking**: Track paid/unpaid amounts
- **Reminder System**: Auto-reminders for overdue
- **Credit Notes**: Issue credit notes for returns
- **Recurring Invoices**: Set up automatic generation

**Invoice Status:**
- Draft
- Sent
- Partially Paid
- Fully Paid
- Overdue
- Cancelled

#### 5.2.5 Sales Orders

**Location:** `/finance/sales-orders`

Manage customer orders before invoicing.

**Creating Sales Order:**
1. New Sales Order
2. Select customer
3. Add order items
4. Set delivery date
5. Specify shipping details
6. Save order

**Order Fulfillment:**
1. Pick and pack items
2. Create delivery challan
3. Ship order
4. Update tracking info
5. Convert to invoice upon delivery

#### 5.2.6 Payment Received

**Location:** `/finance/payment-received`

Record and track customer payments.

**Recording Payment:**
1. Click "Record Payment"
2. Select customer
3. Choose payment method:
   - Cash
   - Cheque
   - Bank Transfer
   - Credit Card
   - UPI
   - Other
4. Enter amount
5. Link to invoice(s)
6. Add reference number
7. Save payment

**Features:**
- Partial payment allocation
- Multiple invoice payment
- Advance payments
- Payment reconciliation
- Receipt generation

#### 5.2.7 Delivery Challans

**Location:** `/finance/delivery-challans`

Generate delivery notes for shipments.

**Creating Delivery Challan:**
1. New Delivery Challan
2. Select customer and order
3. Add items being delivered
4. Enter vehicle/transport details
5. Add e-Way bill number (if required)
6. Generate challan

**Features:**
- Partial deliveries
- Multiple orders in one challan
- E-Way bill integration
- Proof of delivery
- Convert to invoice

#### 5.2.8 Credit Notes

**Location:** `/finance/credit-notes`

Issue credit notes for returns or adjustments.

**Creating Credit Note:**
1. Click "New Credit Note"
2. Select customer and invoice
3. Choose reason:
   - Product return
   - Service cancellation
   - Price adjustment
   - Damaged goods
4. Enter credit amount
5. Select items being credited
6. Generate credit note

**Credit Note Processing:**
- Applied to customer account
- Can be used for future invoices
- Refund issued to customer
- Adjust against outstanding

### 5.3 Purchases Module

#### 5.3.1 Vendors

**Location:** `/finance/vendors`

Manage your supplier database.

**Adding Vendors:**
1. Click "Add Vendor"
2. Enter vendor details:
   ```
   - Vendor Name *
   - Contact Person
   - Email *
   - Phone *
   - GSTIN
   - PAN
   - Address
   ```
3. Set payment terms
4. Add bank details
5. Save vendor

#### 5.3.2 Purchase Orders

**Location:** `/finance/purchase-orders`

Create purchase orders for procurement.

**Creating Purchase Order:**
1. New Purchase Order
2. Select vendor
3. Add items to order
4. Set delivery date
5. Specify delivery location
6. Add terms and conditions
7. Send to vendor

**PO Features:**
- Approval workflow
- Budget checking
- Vendor comparison
- Delivery tracking
- GRN (Goods Receipt Note)

#### 5.3.3 Purchases & Expenses

**Location:** `/finance/expenses`

Record business purchases and expenses.

**Adding Purchase:**
1. Click "Add Purchase"
2. Select vendor
3. Enter purchase details:
   - Bill number
   - Bill date
   - Items purchased
   - Amounts and taxes
4. Attach bill copy
5. Save purchase

**Expense Categories:**
- Office Supplies
- Travel and Conveyance
- Utilities
- Rent
- Marketing
- Professional Fees
- Miscellaneous

#### 5.3.4 Payments Made

**Location:** `/finance/payments-made`

Track payments to vendors.

**Recording Payment:**
1. Click "Record Payment"
2. Select vendor
3. Choose payment mode
4. Enter amount
5. Link to bills
6. Add transaction reference
7. Save payment

#### 5.3.5 Debit Notes

**Location:** `/finance/debit-notes`

Issue debit notes for purchase returns.

**Creating Debit Note:**
1. New Debit Note
2. Select vendor and bill
3. Enter reason for return
4. Add returned items
5. Calculate debit amount
6. Generate debit note

### 5.4 Inventory Module

#### 5.4.1 Categories

**Location:** `/finance/inventory/category`

Organize products into categories.

**Creating Category:**
1. Click "Add Category"
2. Enter category name
3. Add description
4. Set parent category (for subcategory)
5. Save category

**Category Hierarchy:**
```
Electronics
├── Computers
│   ├── Laptops
│   └── Desktops
└── Mobile Devices
    ├── Smartphones
    └── Tablets
```

#### 5.4.2 Items

**Location:** `/finance/inventory/items`

Manage inventory items/products.

**Adding Item:**
1. Click "Add Item"
2. Enter item details:
   ```
   Basic Info:
   - Item Name *
   - SKU *
   - Category
   - Description
   
   Pricing:
   - Purchase Price
   - Selling Price
   - Tax Rate
   
   Inventory:
   - Unit of Measure
   - Opening Stock
   - Reorder Level
   - Reorder Quantity
   
   Additional:
   - Barcode
   - Images
   - Custom Fields
   ```
3. Save item

**Inventory Features:**
- Stock tracking
- Low stock alerts
- Batch/Serial number tracking
- Multiple warehouses
- Stock adjustments
- Inventory valuation

**Stock Management:**
- Real-time stock updates
- Automatic calculation on transactions
- Stock transfer between locations
- Physical stock verification
- Stock aging reports

### 5.5 Finance Reports

#### 5.5.1 Standard Reports

**Sales Reports:**
- Sales by Customer
- Sales by Item
- Sales by Category
- Sales Tax Summary
- Outstanding Receivables

**Purchase Reports:**
- Purchase by Vendor
- Purchase by Item
- Purchase Analysis
- Outstanding Payables

**Inventory Reports:**
- Stock Summary
- Stock Value
- Inventory Movement
- Low Stock Items
- Dead Stock

**Financial Reports:**
- Profit & Loss Statement
- Balance Sheet
- Cash Flow Statement
- Trial Balance

#### 5.5.2 GST Reports

**GSTR-1 Summary**

**Location:** `/finance/reports/gstr1summary`

Generate GST sales return summary.

**Features:**
- B2B transactions summary
- B2C transactions summary
- HSN-wise summary
- Document summary
- Export format for filing

**Using GSTR-1:**
1. Select month/quarter
2. Click "Generate Report"
3. Review transactions
4. Export JSON file
5. Upload to GST portal

**GSTR-2 Summary**

**Location:** `/finance/reports/gstr2summary`

Generate GST purchase return summary.

**Features:**
- Purchase from registered dealers
- Purchase from unregistered dealers
- Import transactions
- ITC (Input Tax Credit) summary
- Reverse charge transactions

**Using GSTR-2:**
1. Select reporting period
2. Generate report
3. Reconcile with vendor GSTR-1
4. Export for filing
5. Claim ITC

---

## 6. Dashboard & Analytics

### 6.1 Main Dashboard

The main dashboard provides a bird's-eye view of your business.

**Dashboard Sections:**

1. **Key Metrics Cards**
   ```
   - Total Revenue (MTD)
   - Active Leads
   - Conversion Rate
   - Tasks Pending
   - Upcoming Meetings
   - Support Tickets Open
   ```

2. **Sales Performance Graph**
   - Revenue trends
   - Month-over-month comparison
   - Target vs achievement

3. **Lead Pipeline**
   - Visual funnel
   - Stage-wise distribution
   - Conversion percentages

4. **Recent Activities**
   - Latest lead updates
   - Recent calls
   - Completed tasks
   - New support tickets

5. **Team Performance**
   - Top performers
   - Activity summary
   - Target achievement

6. **Notifications Center**
   - System alerts
   - Task reminders
   - Meeting notifications
   - Approval requests

**Dashboard Customization:**
1. Click "Customize Dashboard"
2. Drag widgets to reorder
3. Hide/show widgets
4. Resize widget areas
5. Save layout

### 6.2 Analytics Dashboard

**Advanced Analytics Features:**

1. **Interactive Charts**
   - Hover for details
   - Click to drill down
   - Export chart images
   - Customize colors

2. **Date Range Selector**
   - Today
   - This Week
   - This Month
   - This Quarter
   - This Year
   - Custom Range

3. **Comparative Analysis**
   - Year-over-year
   - Month-over-month
   - Period comparison

4. **Forecasting**
   - AI-powered predictions
   - Trend analysis
   - What-if scenarios

**Key Analytics:**

**Revenue Analytics:**
- Revenue by product/service
- Revenue by region
- Revenue by customer segment
- Recurring vs one-time revenue

**Lead Analytics:**
- Lead source ROI
- Conversion rate by source
- Time to conversion
- Lead scoring distribution

**Activity Analytics:**
- Activity heatmap
- Peak activity times
- Team utilization
- Activity vs conversion correlation

**Customer Analytics:**
- Customer segmentation
- Purchase patterns
- Customer churn prediction
- Lifetime value analysis

### 6.3 Real-time Monitoring

**Live Dashboard Features:**
- Auto-refresh every 5 minutes
- Real-time notifications
- Live activity feed
- Instant metric updates

**Alerts and Triggers:**
- Revenue milestones
- Target achievements
- Critical tasks overdue
- High-value lead activity
- System issues

---

## 7. Settings & Configuration

### 7.1 Profile Settings

**Location:** `/settings/profile` (admin), `/user/settings/profile` (user)

**Configurable Options:**

1. **Personal Information**
   - Name
   - Email
   - Phone
   - Profile picture
   - Department
   - Designation

2. **Preferences**
   - Language
   - Timezone
   - Date format
   - Number format
   - Currency

3. **Notifications**
   - Email notifications
   - Push notifications
   - SMS alerts
   - Notification frequency

4. **Security**
   - Change password
   - Two-factor authentication
   - Active sessions
   - Login history

**Updating Profile:**
1. Go to Profile Settings
2. Edit desired fields
3. Upload new profile picture (optional)
4. Click "Save Changes"

### 7.2 Email Settings

**Location:** `/settings/email`

Configure email integration and templates.

#### 7.2.1 Email Account Setup

**Connecting Email:**
1. Go to Email Settings
2. Click "Connect Email"
3. Choose provider:
   - Gmail
   - Outlook
   - IMAP/SMTP (custom)
4. Authorize access
5. Configure sync settings

**SMTP Configuration:**
```
SMTP Settings:
- Host: smtp.example.com
- Port: 587
- Encryption: TLS
- Username: your-email@example.com
- Password: ********
```

#### 7.2.2 Email Templates

**Creating Templates:**
1. Go to Email Templates
2. Click "New Template"
3. Choose template type:
   - Welcome Email
   - Follow-up Email
   - Quote Sent
   - Invoice Reminder
   - Meeting Confirmation
   - Custom
4. Compose template:
   - Subject line
   - Body (HTML editor)
   - Variables ({{name}}, {{company}}, etc.)
   - Attachments
5. Save template

**Using Templates:**
1. Compose email
2. Click "Use Template"
3. Select template
4. Variables auto-filled
5. Edit if needed
6. Send email

**Available Variables:**
```
Lead Variables:
{{lead.name}}
{{lead.email}}
{{lead.company}}
{{lead.phone}}

User Variables:
{{user.name}}
{{user.email}}
{{user.signature}}

System Variables:
{{company.name}}
{{company.address}}
{{current.date}}
{{current.time}}
```

### 7.3 User Management (Admin/Manager)

**Location:** `/settings/users`

Manage team members and their access.

#### 7.3.1 Adding Users

**Inviting New User:**
1. Click "Invite User"
2. Enter email address
3. Select role (Admin/Manager/User)
4. Set permissions (optional)
5. Send invitation

**Invitation Process:**
1. User receives email invitation
2. Clicks activation link
3. Sets password
4. Completes profile
5. Gains access to system

#### 7.3.2 Managing Users

**User List View:**
- User name and email
- Role and status
- Last login
- Actions (Edit, Deactivate, Delete)

**User Actions:**

**Edit User:**
1. Click on user
2. Modify details:
   - Name
   - Role
   - Department
   - Permissions
3. Save changes

**Deactivate User:**
1. Select user
2. Click "Deactivate"
3. Confirm action
4. User loses access immediately
5. Can be reactivated later

**Delete User:**
1. Select user
2. Click "Delete"
3. Choose reassignment option:
   - Transfer leads to another user
   - Unassign all records
4. Confirm deletion

**Reset Password:**
1. Select user
2. Click "Reset Password"
3. Choose method:
   - Send reset email to user
   - Set temporary password
4. Notify user

#### 7.3.3 Teams & Departments

**Creating Teams:**
1. Go to Teams section
2. Click "Create Team"
3. Enter team name
4. Select team manager
5. Add team members
6. Save team

**Team Features:**
- Team-based filtering
- Team performance reports
- Team targets
- Shared resources

### 7.4 Company Settings (Admin Only)

**Configurable Options:**

1. **Company Profile**
   - Company name
   - Logo
   - Address
   - Contact details
   - Tax registration numbers

2. **Business Settings**
   - Fiscal year
   - Currency
   - Tax rates
   - Business hours

3. **Integrations**
   - Payment gateways
   - SMS providers
   - Email services
   - Third-party apps

4. **Branding**
   - Color scheme
   - Email header/footer
   - Invoice template
   - Watermarks

### 7.5 Recycle Bin (Admin Only)

**Location:** `/settings/recyclebin`

Recover or permanently delete records.

**Features:**
- View deleted records
- Restore deleted items
- Permanently delete
- Auto-purge after 30 days

**Using Recycle Bin:**

**Viewing Deleted Items:**
1. Go to Recycle Bin
2. Select item type:
   - Leads
   - Contacts
   - Tasks
   - etc.
3. View deleted items list

**Restoring Items:**
1. Select items to restore
2. Click "Restore"
3. Items return to original location
4. Related records also restored

**Permanent Deletion:**
1. Select items
2. Click "Delete Permanently"
3. Confirm action (irreversible)
4. Items removed from system

---

## 8. Mobile Experience

### 8.1 Mobile Access

VTM CRM is fully responsive and accessible on mobile devices.

**Supported Platforms:**
- iOS (Safari, Chrome)
- Android (Chrome, Samsung Internet)

**Mobile Features:**
- Touch-optimized interface
- Swipe gestures
- Pull-to-refresh
- Offline mode (limited)

### 8.2 Mobile Navigation

**Navigation Menu:**
- Hamburger menu (☰) for main navigation
- Bottom navigation bar for quick access
- Search bar at top
- Quick action button (floating)

**Quick Actions:**
- Add Lead
- Log Call
- Create Task
- Schedule Meeting

### 8.3 Mobile-Specific Features

**Call Integration:**
- Tap phone number to call
- Log call directly after
- Call duration tracking

**Location Services:**
- Check-in at customer location
- View nearby leads
- Distance calculation
- Route optimization

**Camera Integration:**
- Scan business cards
- Take photos of documents
- Add images to records

**Voice Input:**
- Voice-to-text for notes
- Voice commands
- Hands-free operation

### 8.4 Mobile Best Practices

**Optimized for Mobile:**
- Simplified forms
- Larger touch targets
- Reduced data usage
- Faster load times

**Tips:**
- Use quick actions for common tasks
- Enable push notifications
- Sync offline changes when online
- Use voice input for notes

---

## 9. Notifications & Alerts

### 9.1 Notification Types

**System Notifications:**
- System updates
- Maintenance schedules
- Feature releases
- Security alerts

**Activity Notifications:**
- New lead assigned
- Task reminder
- Meeting invitation
- Overdue tasks

**Transaction Notifications:**
- Quote sent/viewed
- Invoice generated
- Payment received
- Order placed

**Team Notifications:**
- Team member mentions
- Shared records
- Collaboration updates
- Comments and replies

### 9.2 Notification Channels

**Push Notifications:**
- Browser notifications (desktop)
- Mobile app notifications
- Real-time delivery
- Action buttons

**Email Notifications:**
- Digest emails (daily/weekly)
- Instant alerts
- HTML formatted
- Unsubscribe options

**In-App Notifications:**
- Notification bell icon
- Unread count badge
- Notification center
- Mark as read/unread

**SMS Notifications:**
- Critical alerts only
- OTP for 2FA
- High-priority reminders
- Configurable per user

### 9.3 Notification Settings

**Configuring Notifications:**
1. Go to Profile Settings
2. Click "Notifications"
3. Choose notification types:
   - All Notifications
   - Important Only
   - None
4. Select delivery channels:
   - Push
   - Email
   - SMS
5. Set quiet hours
6. Save preferences

**Notification Preferences:**
```
Categories:
☑ Leads & Contacts
☑ Tasks
☑ Meetings
☑ Calls
☑ Support Tickets
☐ System Updates
☐ Marketing Emails

Frequency:
○ Real-time
○ Hourly Digest
● Daily Digest
○ Weekly Digest

Quiet Hours:
From: 10:00 PM
To: 8:00 AM
```

### 9.4 Managing Notifications

**Notification Center:**
1. Click bell icon in header
2. View all notifications
3. Click to view details
4. Mark as read
5. Clear all

**Notification Actions:**
- Mark as read/unread
- Delete notification
- Snooze reminder
- Take action directly

---

## 10. Tips & Best Practices

### 10.1 Lead Management Tips

1. **Respond Quickly**: Contact new leads within 5 minutes for best results
2. **Qualify Early**: Use qualification criteria to prioritize leads
3. **Regular Follow-ups**: Set reminders for follow-up activities
4. **Detailed Notes**: Always add context to your activities
5. **Use Tags**: Tag leads for easy categorization and filtering

### 10.2 Task Management Tips

1. **Prioritize**: Use High/Medium/Low priority effectively
2. **Break Down**: Split large tasks into smaller subtasks
3. **Set Realistic Deadlines**: Don't overcommit
4. **Use Checklists**: Track progress with task checklists
5. **Review Daily**: Start each day by reviewing tasks

### 10.3 Meeting Best Practices

1. **Always Have Agenda**: Prepare meeting agenda beforehand
2. **Send Calendar Invites**: Use calendar integration
3. **Be On Time**: Respect everyone's time
4. **Take Notes**: Document key discussion points
5. **Set Action Items**: Define clear next steps

### 10.4 Finance Best Practices

1. **Regular Invoicing**: Send invoices promptly after delivery
2. **Track Payments**: Monitor receivables regularly
3. **Reconcile Accounts**: Match payments with invoices
4. **Backup Documents**: Keep copies of all financial documents
5. **Stay Compliant**: Follow tax regulations and filing deadlines

### 10.5 Security Best Practices

1. **Strong Passwords**: Use complex passwords with 12+ characters
2. **Enable 2FA**: Turn on two-factor authentication
3. **Regular Logout**: Don't stay logged in on shared devices
4. **Review Access**: Periodically review user permissions
5. **Report Issues**: Immediately report suspicious activity

### 10.6 Productivity Tips

1. **Use Keyboard Shortcuts**: Learn shortcuts for common actions
2. **Saved Filters**: Create filters for frequent searches
3. **Email Templates**: Use templates for repetitive emails
4. **Bulk Actions**: Use bulk operations when possible
5. **Mobile App**: Install mobile app for on-the-go access

---

## 11. FAQ

### 11.1 General Questions

**Q: How do I reset my password?**
A: Click "Forgot Password" on login page, enter your email, and follow the reset link sent to your inbox.

**Q: Can I use VTM CRM offline?**
A: Limited offline access is available on mobile. Core features require internet connection.

**Q: Is my data secure?**
A: Yes. We use industry-standard encryption and security measures. Data is backed up regularly.

**Q: How many users can I add?**
A: Depends on your subscription plan. Check your plan details or contact admin.

**Q: Can I export my data?**
A: Yes. Most data can be exported to CSV/Excel format. Contact support for bulk exports.

### 11.2 Lead Management

**Q: How do I assign leads to team members?**
A: Select lead(s), click "Assign", choose team member, and confirm.

**Q: Can I import leads from Excel?**
A: Yes. Go to Leads → Import, download template, fill data, and upload.

**Q: How do I track lead sources?**
A: Assign source when creating lead. Generate reports by source to track performance.

**Q: What happens to leads when a user is deactivated?**
A: Leads can be reassigned to another user or left unassigned.

### 11.3 Tasks & Activities

**Q: How do I set recurring tasks?**
A: Create task, enable "Recurring" option, set pattern, and save.

**Q: Can I delegate tasks?**
A: Yes. Create task and assign to team member.

**Q: How do I get reminders?**
A: Reminders are automatically sent based on task due dates. Configure in settings.

**Q: Can I attach files to tasks?**
A: Yes. Click "Attach" button when creating/editing task.

### 11.4 Finance

**Q: How do I create an invoice?**
A: Go to Finance → Invoices → New Invoice, fill details, and save.

**Q: Can I customize invoice templates?**
A: Yes (Admin only). Go to Settings → Templates → Invoice Template.

**Q: How do I track GST?**
A: System automatically calculates GST. Generate GST reports from Finance → Reports.

**Q: Can I accept online payments?**
A: Yes, if payment gateway is configured by admin.

### 11.5 Technical

**Q: Which browsers are supported?**
A: Chrome, Firefox, Safari, and Edge (latest versions).

**Q: Why am I not receiving notifications?**
A: Check notification permissions in browser and your notification settings in profile.

**Q: The page is loading slowly. What should I do?**
A: Clear browser cache, check internet connection, or try a different browser.

**Q: Can I use this on my phone?**
A: Yes. Access via mobile browser or install the mobile app (if available).

---

## 12. Glossary

**Activity**: Any interaction with a lead or contact (call, meeting, email, task)

**CRM**: Customer Relationship Management

**Dashboard**: Main overview screen showing key metrics and activities

**Deal**: A potential sale or business opportunity

**FCM**: Firebase Cloud Messaging - for push notifications

**Funnel**: Visual representation of lead progression through stages

**GST**: Goods and Services Tax

**GSTIN**: GST Identification Number

**Integration**: Connection between VTM CRM and external services

**Invoice**: Bill sent to customer for payment

**KPI**: Key Performance Indicator

**Lead**: Potential customer or business contact

**Pipeline**: Collection of deals in various stages

**Proforma Invoice**: Preliminary bill, not for tax purposes

**Quote/Quotation**: Price proposal sent to potential customer

**RBAC**: Role-Based Access Control

**Recurring**: Repeating automatically (tasks, invoices)

**SLA**: Service Level Agreement

**Tag**: Label used to categorize records

**Template**: Pre-designed format for documents or emails

**Widget**: Dashboard component showing specific information

**Workflow**: Automated sequence of actions

---

## Document Information

**Version History:**

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | Oct 18, 2025 | Initial documentation |

**Contributors:**
- Development Team
- Product Management
- Documentation Team

**Feedback:**
For suggestions or corrections, please contact your system administrator or support team.

---

**End of User Guide**

*VTM CRM - Empowering Your Business Growth*
