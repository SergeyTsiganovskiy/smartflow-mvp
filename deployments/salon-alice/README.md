# Salon Alice production deployment

This directory describes the first client production deployment. It contains no Telegram tokens, customer data or Google credentials.

## One-time preparation

1. Create the client Google Spreadsheet from `outputs/smartflow-client-template/SmartFlow Beauty Client Template.xlsx`.
2. Open Extensions → Apps Script from that spreadsheet.
3. In Apps Script → Project Settings, copy the Script ID.
4. Copy `deployment.example.json` to `deployment.local.json` if the local file is missing.
5. Put the Script ID into `deployment.local.json`. This local file is ignored by Git.
6. Run `clasp login` and authorize the Google account that owns the client Apps Script project.
7. Add these Script Properties in Apps Script:
   - `SMARTFLOW_CLIENT_BOT_TOKEN`
   - `SMARTFLOW_ADMIN_BOT_TOKEN`

Do not put bot tokens into this directory, Settings, Git, PowerShell history or screenshots.

## Safe upload

Run the non-mutating preflight first from the repository root:

```powershell
.\Scripts\deploy-client.cmd -Client salon-alice
```

It validates the project, runs all tests, checks that Git is clean, temporarily selects the client Script ID, calls `clasp status` and verifies access by listing deployments. The original local `AppsScript/.clasp.json` is restored even if a command fails.

If the displayed client and Script ID are correct, upload the code:

```powershell
.\Scripts\deploy-client.cmd -Client salon-alice -Push
```

The script requires typing `salon-alice` exactly before `clasp push`.

The `.cmd` launcher applies `ExecutionPolicy Bypass` only to this one PowerShell process. It does not change the Windows execution policy for the user or the computer.

## First production activation

After the first upload:

1. Run the installation migrations listed in `Docs/Guides/Version 1.0/DEPLOYMENT_GUIDE.md`.
2. Create the installable reminder and completed-visit triggers as described in the guide.
3. Create a Web App deployment executed as the deploying user and accessible to anyone.
4. Copy its `/exec` URL into the `AppsScriptUrl` Settings row.
5. Run `setClientWebhook()` and `setAdminWebhook()` once.
6. Verify `getClientWebhookInfo()` and `getAdminWebhookInfo()`.
7. Run `runSmartFlowHealthCheck()` and require `ok: true`.
8. Perform the client/admin/Calendar release regression before handing the bots to the salon.

For later source updates with the same Web App URL, upload the code and update the production deployment version. Webhooks do not need to be reinstalled unless the `/exec` URL or bot token changed.

## Safety boundaries

- The utility uploads source code but does not create or switch the production Web App version automatically.
- It never reads or writes Telegram tokens.
- It refuses a production push from a dirty Git worktree.
- It refuses placeholder or non-production profiles.
- It restores the developer `.clasp.json` after preflight or upload.
