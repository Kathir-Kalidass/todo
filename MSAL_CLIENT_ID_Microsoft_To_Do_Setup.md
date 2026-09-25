# Microsoft To Do (Microsoft Graph API) — Getting `MSAL_CLIENT_ID`

This guide shows how to get the `MSAL_CLIENT_ID` required when using **Microsoft To Do through Microsoft Graph API with MSAL**.

## 1. What is `MSAL_CLIENT_ID`?

`MSAL_CLIENT_ID` is the **Application (client) ID** of an app registration in **Microsoft Entra ID** (formerly Azure AD).

It identifies your application to Microsoft's identity platform.

Example:

```env
MSAL_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

> Do not confuse the **Application (client) ID** with the **Object ID**.  
> For `MSAL_CLIENT_ID`, you need **Application (client) ID**.

Microsoft documentation confirms that the Application (client) ID is shown on the app's Overview page after registration.

## 2. Open Microsoft Entra App Registrations

Go to:

https://entra.microsoft.com/

Then:

1. Sign in with the Microsoft account you want to use with Microsoft To Do.
2. Open **Microsoft Entra ID**.
3. Select **App registrations**.
4. Select **New registration**.

You can also use the Microsoft Entra admin center directly.

## 3. Create the application

Use something like:

- **Name:** `My Microsoft To Do App`
- **Supported account types:** Choose according to your application.

For a personal Microsoft account (such as Outlook/Hotmail), select:

**Accounts in any organizational directory and personal Microsoft accounts**

If your application is only for an organization account, you can use:

**Accounts in this organizational directory only**

Then click:

**Register**

## 4. Copy the Client ID

After registration, Microsoft opens the application's **Overview** page.

Find:

```text
Application (client) ID
```

It will look similar to:

```text
12345678-abcd-1234-abcd-123456789abc
```

Copy that value.

That is your:

```text
MSAL_CLIENT_ID
```

### Example

```env
MSAL_CLIENT_ID=12345678-abcd-1234-abcd-123456789abc
```

## 5. Find the Tenant ID

On the same Overview page, you will also see:

```text
Directory (tenant) ID
```

Depending on your application, you may store it as:

```env
MSAL_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

For applications supporting both personal Microsoft accounts and organizational accounts, your MSAL authority may instead use:

```text
https://login.microsoftonline.com/common
```

Use the authority appropriate for the account types you selected.

## 6. Configure Microsoft Graph permissions

After creating the app:

1. Open your app registration.
2. Select **API permissions**.
3. Click **Add a permission**.
4. Select **Microsoft Graph**.
5. Select **Delegated permissions**.
6. Search for:

```text
Tasks.ReadWrite
```

7. Select **Tasks.ReadWrite**.
8. Click **Add permissions**.

For a normal Microsoft To Do application that operates on the signed-in user's tasks, `Tasks.ReadWrite` is the relevant delegated permission for creating, reading, updating, and deleting To Do tasks.

Microsoft's Graph documentation lists `Tasks.ReadWrite` as the least-privileged delegated permission for creating To Do tasks.

## 7. Recommended permissions

For a Microsoft To Do app using delegated user authentication:

| Permission | Purpose |
|---|---|
| `User.Read` | Sign in and read the basic signed-in user profile |
| `Tasks.Read` | Read To Do tasks |
| `Tasks.ReadWrite` | Read and modify To Do tasks |

If your application needs to create or update tasks, use:

```text
Tasks.ReadWrite
```

Avoid requesting permissions that your application does not need.

## 8. Redirect URI / Authentication

If you are using an interactive MSAL application, configure the appropriate redirect URI under:

**Authentication → Add a platform**

The exact platform depends on your application:

- Web application
- Single-page application
- Mobile/desktop application

For a local development web application, your redirect URI might look like:

```text
http://localhost:3000/auth/callback
```

Use the redirect URI required by your actual MSAL framework/application.

The redirect URI in your code must match the URI registered in Microsoft Entra.

## 9. Example `.env`

A typical configuration could look like:

```env
MSAL_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MSAL_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MSAL_AUTHORITY=https://login.microsoftonline.com/common

GRAPH_SCOPES=User.Read Tasks.ReadWrite
```

Do **not** commit this file if your project treats environment configuration as private.

Add it to `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

Then create a safe template:

```env
# .env.example

MSAL_CLIENT_ID=
MSAL_TENANT_ID=
MSAL_AUTHORITY=https://login.microsoftonline.com/common
GRAPH_SCOPES=User.Read Tasks.ReadWrite
```

## 10. Important: Client ID vs Client Secret

For MSAL, these are different values:

```text
Application (client) ID
        ↓
MSAL_CLIENT_ID
```

and, for confidential web/server applications:

```text
Client secret
        ↓
MSAL_CLIENT_SECRET
```

The client ID identifies the application.

A client secret is a credential and must be protected like a password.

### Never put a client secret in:

- GitHub repositories
- Frontend JavaScript
- React/Vite client-side code
- Public documentation
- Screenshots
- `.env.example`

For public client applications, use the MSAL flow appropriate to that application type instead of trying to hide a secret in the client.

## 11. How Microsoft To Do is accessed

After authentication, your application obtains an access token with the required Microsoft Graph permissions.

For example, the Graph API can access the signed-in user's To Do lists using:

```http
GET https://graph.microsoft.com/v1.0/me/todo/lists
```

A task can then be created under a To Do list:

```http
POST https://graph.microsoft.com/v1.0/me/todo/lists/{todoTaskListId}/tasks
```

with:

```http
Authorization: Bearer <access-token>
Content-Type: application/json
```

Example request body:

```json
{
  "title": "Complete DevOps assignment"
}
```

## 12. Quick checklist

Before running your application, verify:

```text
[ ] Microsoft Entra app registration created
[ ] Application (client) ID copied
[ ] MSAL_CLIENT_ID configured
[ ] Correct account type selected
[ ] Redirect URI configured
[ ] Microsoft Graph added
[ ] Delegated Tasks.ReadWrite permission added
[ ] User.Read permission available
[ ] User consent completed if required
[ ] .env excluded from Git
```

## 13. Your exact value

After registration, your configuration should contain:

```env
MSAL_CLIENT_ID=<Application (client) ID from Entra>
```

For example:

```env
MSAL_CLIENT_ID=12345678-abcd-1234-abcd-123456789abc
```

Replace the example with the **Application (client) ID shown on your own app's Overview page**.

## Official Microsoft documentation

- Microsoft Entra app registration:
  https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app

- Microsoft Graph To Do API:
  https://learn.microsoft.com/en-us/graph/api/resources/todo-overview

- Create a To Do task:
  https://learn.microsoft.com/en-us/graph/api/todotasklist-post-tasks

- Microsoft Graph authentication:
  https://learn.microsoft.com/en-us/entra/identity-platform/

