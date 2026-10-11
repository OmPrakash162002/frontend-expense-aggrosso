# Frontend: Expense Claim Review

Next.js (App Router) + React web app for employees and reviewers. Plain CSS, no UI framework.
It talks to the Express API in `../backend`.

Live app: `<FRONTEND_URL>`

## Requirements

- Node.js 20 or newer
- The backend running (locally on port 5000, or the deployed API)

## Run locally

```bash
npm install
cp .env.local.example .env.local     # on Windows: copy .env.local.example .env.local
npm run dev                          # http://localhost:3000
```

### Environment variable

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the API **including `/api`**, e.g. `http://localhost:5000/api` or `https://expense-review-api.onrender.com/api`. It is baked in at build time, so redeploy after changing it. If unset it defaults to `http://localhost:5000/api` |

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |

## Pages

| Route | Who | What it shows |
|---|---|---|
| `/login` | public | Employee sign in |
| `/admin/login` | public | Reviewer sign in |
| `/register` | public | Create an employee account |
| `/` | signed in | Dashboard: totals, filters and the claims table (employees see only their own) |
| `/claims/new` | signed in | Submit a claim |
| `/claims/[id]` | signed in | Claim detail. Employees: claim, automatic checks, clarifications, history. Reviewers: also the AI analysis and the review actions |
| `/policy` | signed in | The expense policy. Policy citations link here |

Signed-out visitors are redirected to the sign-in page. After signing out, or when a session expires, users are sent back
to the sign-in page they used.


## Try it now (no setup needed)

| | |
|---|---|
| **Live app** | `https://frontend-expense-aggrosso.vercel.app/` |
| **Email** | `admin@gmail.com` |
| **Password** | `kishor000101` |

> **First load can be slow.** The backend runs on a free tier that sleeps when idle. If the app looks stuck, open
> https://expense-review-api.onrender.com/api/health , wait up to a minute for `{"ok":true}`, then reload the app.

1. Sign in as an employee and submit a claim. Choose **Other / not sure** and a vague description to see an uncertain
   AI classification.
2. Sign in on `/admin/login` as a reviewer, open the claim, and use **Approve**, **Reject**,
   **Request clarification** or **Override classification**.
3. Go back to the employee account, answer the clarification, then finish the review as the reviewer.


## Project structure

```
frontend/src/
├── app/
│   ├── layout.js, globals.css
│   ├── page.js                    # dashboard
│   ├── login/, admin/login/, register/
│   ├── claims/new/, claims/[id]/
│   └── policy/
├── components/
│   ├── AuthProvider.js            # session state, login, register, logout
│   ├── AppShell.js                # header and route guard
│   ├── AuthForm.js                # employee/reviewer sign in and registration
│   ├── ClaimForm.js, ClaimTable.js, TotalsBar.js
│   ├── ValidationPanel.js         # automatic checks
│   ├── AiPanel.js, PolicyEvidence.js   # AI analysis with expandable policy citations
│   ├── ReviewActions.js, DecisionCard.js
│   ├── ClarificationList.js, HistoryTimeline.js
│   └── Badges.js
└── lib/
    ├── api.js                     # fetch wrapper, attaches the token, handles expired sessions
    ├── auth-storage.js            # token in localStorage
    └── format.js                  # money, dates, labels
```

## Notes

- The login token is stored in `localStorage`. This is simple but readable by any script on the page, so the app renders
  no untrusted HTML. An httpOnly cookie would be the stricter option.
- Role checks in the UI only hide controls. The real checks are enforced by the backend on every request.

## Deploying (Vercel)

- Import the repo, set **Root Directory** to `frontend`, add `NEXT_PUBLIC_API_URL`, and deploy.
- Then set `CORS_ORIGIN` on the backend to this app's exact URL.
- Every `git push` to the main branch redeploys automatically.
