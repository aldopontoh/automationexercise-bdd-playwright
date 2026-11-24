# PRD: Contact Us & Support (`contact-support`)

## 1. Module Overview, Business Objective & Risk Priority
- **Module Slug**: `contact-support`
- **Business Objective**: Provide a reliable support inquiry channel supporting structured text fields, file attachments, native confirmation dialogs, clear submission feedback, and return-to-home recovery.
- **Risk Priority**: **Medium** (customer communication & attachment handling).

## 2. Entry Points, Routes & Preconditions
- **Routes**: `/contact_us` → `/` (post-submission return).
- **Preconditions**: Accessible by both Guest and Authenticated users.

## 3. Atomic Functional Requirements
- **REQ-CNT-01**: Opening `/contact_us` MUST display page title `Automation Exercise - Contact Us`, headings `Contact Us`, `Get In Touch`, and `Feedback For Us`, plus all form fields (`Name`, `Email`, `Subject`, `Your Message Here`, `upload_file`, and `Submit`).
- **REQ-CNT-02**: Filling valid Contact Us form fields, attaching a local fixture file (`test-data/sample-contact-upload.txt`), clicking `Submit`, and accepting the native browser `confirm` dialog MUST display `.status.alert.alert-success` containing `"Success! Your details have been submitted successfully."`.
- **REQ-CNT-03**: After a successful Contact Us submission, clicking the `Home` button inside `#form-section` MUST navigate the user back to `/` (`Automation Exercise`).
- **REQ-CNT-04**: Attempting to submit `/contact_us` with an empty or malformed `Email` input (`input[name="email"][type="email"][required]`) MUST be blocked by native HTML5 validation without triggering form submission or displaying the success banner.

## 4. Verified UI Inventory & Resilient Locators (Live-Inspected)

| UI Element | Verified DOM Details | Resilient Locator Strategy |
| :--- | :--- | :--- |
| Get In Touch Heading | `h2` `"Get In Touch"` | `page.getByRole('heading', { name: /Get In Touch/i })` |
| Feedback Heading | `h2` `"Feedback For Us"` | `page.getByRole('heading', { name: /Feedback For Us/i })` |
| Name Input | `input[data-qa="name"][placeholder="Name"]` | `page.getByPlaceholder('Name')` |
| Email Input | `input[data-qa="email"][placeholder="Email"][type="email"][required]` | `page.getByPlaceholder('Email', { exact: true })` |
| Subject Input | `input[data-qa="subject"][placeholder="Subject"]` | `page.getByPlaceholder('Subject')` |
| Message Textarea | `textarea#message[placeholder="Your Message Here"]` | `page.getByPlaceholder('Your Message Here')` |
| File Upload Input | `input[type="file"][name="upload_file"]` | `page.locator('input[name="upload_file"]')` |
| Submit Button | `input[type="submit"][data-qa="submit-button"][value="Submit"]` | `page.getByRole('button', { name: 'Submit' })` |
| Success Banner | `.status.alert.alert-success` `"Success! Your details have been submitted successfully."` | `page.locator('#contact-page .status.alert-success')` |
| Return Home Button | `#form-section a.btn-success` `"Home"` | `page.locator('#form-section').getByRole('link', { name: /Home/i })` |

## 5. Validation Rules, Boundary Conditions, Ad/Modal Handling & Negative Scenarios
- Live DOM inspection confirmed ONLY `email` carries `required: true`; `name`, `subject`, `message`, and `upload_file` are optional.
- Clicking `Submit` triggers a native browser `window.confirm` dialog (`Press OK to proceed!`); Playwright must register `page.once('dialog', d => d.accept())` before clicking `Submit`.
- Live-Site Safety: Contact tests submit a single deterministic QA test inquiry using non-personal `@example.com` data and a tiny plain-text fixture file (`< 200 bytes`).

## 6. Testable Acceptance Criteria
- **Given** a user opens `/contact_us`, **Then** `<title>` is `Automation Exercise - Contact Us` and `Get In Touch` / `Feedback For Us` headings and inputs are visible (`REQ-CNT-01`).
- **Given** a user fills the Contact Us form, attaches `sample-contact-upload.txt`, and accepts the confirmation dialog, **Then** `"Success! Your details have been submitted successfully."` appears (`REQ-CNT-02`).
- **Given** the Contact Us success banner is visible, **When** the user clicks the `Home` button, **Then** they land on `/` (`REQ-CNT-03`).
- **Given** a user omits or enters a malformed email on `/contact_us`, **When** they click `Submit`, **Then** HTML5 validation reports invalid state and the success banner remains hidden (`REQ-CNT-04`).
