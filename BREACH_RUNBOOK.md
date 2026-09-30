# Data Breach Incident Response Runbook

**Compliance Context:** Digital Personal Data Protection (DPDP) Act, 2023 (India)
**Status:** [LEGAL REVIEW REQUIRED]

## 1. Initial Assessment & Containment (0-24 Hours)

1. **Identify the Breach:** Determine the scope. Which systems were affected? (e.g., Neon DB, Upstash Redis, UploadThing).
2. **Contain the Breach:**
   - Revoke compromised API keys/tokens immediately.
   - Rotate database credentials.
   - Take affected endpoints offline if necessary.
3. **Assess the Data:** Did the breach expose Personal Data of Data Principals (users/customers)?

## 2. Notification to the Data Protection Board of India (DPBI) (Within 72 Hours)

If the breach affects personal data, the DPBI must be notified.

**DPBI Notification Checklist:**

- [ ] Nature of the personal data breach.
- [ ] Number of Data Principals affected.
- [ ] Likely consequences of the breach.
- [ ] Remedial measures taken or proposed to be taken.
- [ ] Contact details of the Grievance Officer.

## 3. Notification to Affected Data Principals (Users)

If the breach is likely to result in a high risk to the rights of the users, they must be notified without undue delay.

### User Notification Email Template:

**Subject:** Important Security Notice Regarding Your Formix Account

**Body:**
Dear [User Name],

We are writing to inform you of a data security incident that may have affected your personal data associated with your Formix account.

**What Happened:**
On [Date], we identified unauthorized access to [System/Database]. We immediately secured the system and launched an investigation.

**What Data Was Involved:**
The information involved may include your [Name, Email Address, Form Submissions, etc.]. Note: Passwords and payment information are encrypted and managed securely via our third-party providers (BetterAuth/Dodo) and were NOT compromised.

**What We Are Doing:**
We have taken immediate steps to secure our platform, including [Rotating keys, patching vulnerability]. We have also notified the relevant data protection authorities as required by the DPDP Act.

**What You Can Do:**
Out of an abundance of caution, we recommend that you:

- Rotate your Formix API keys from your dashboard.
- Remain vigilant against phishing attempts.

If you have any questions, please contact our Grievance Officer at grievance@formix.rikikashyap.dev.

Sincerely,
The Formix Security Team

## 4. Post-Incident Review

- Conduct a root-cause analysis (RCA).
- Document findings and implement technical/organizational measures to prevent recurrence.
- Update this runbook based on lessons learned.
