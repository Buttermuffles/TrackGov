# Document Lifecycle Process

## Purpose

Define the end-to-end process for government document intake, routing, action, and archival.

## Flow

1. Intake
- Receive document from citizen/agency/internal office.
- Register metadata and generate tracking code.
- Upload initial attachment(s).

2. Classification
- Set `documentType`, `classification`, `priority`, and due date.
- Assign originating office and receiving office.

3. Routing
- Add routing entry with required action and remarks.
- Set `toOfficeId`, optional `toUserId`, and expected SLA.
- Require confirmation dialog before forwarding.

4. Acknowledgment
- Receiving office acknowledges the routing entry.
- Timestamp receipt and update status.

5. Processing
- Add remarks, attachments, approvals/disapprovals.
- Keep an auditable trail for each action.

6. Completion
- Mark as completed when action is fulfilled.
- Validate all required approvals before closure.

7. Archival
- Archive completed records by retention policy.
- Keep public-safe lookup for tracking history.

## Control Points

- Confirm before significant actions (forward/return/void).
- Enforce role-based access by office and role.
- Preserve immutable audit entries for every status transition.
