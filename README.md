# Ketchup??

Ketchup with your friends

## Setup

### Frontend setup:

```
brew install yarn
yarn
```

Backend setup (note the dir is now `.venv` rather than `.env` due to collisions with Heroku):

```
pip3 install virtualenv
python3 -m virtualenv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### DB setup

Trent and Alex are using postgres 14.2, which seems to be working well.

```
brew install postgres
brew services start postgresql
```

DB setup a bit more (less sure about this part bear with me)

```
psql postgres
CREATE DATABASE crm;
\q
```

While dev-ing (and currently in prod), the DB will reset and update to match the tables and columns found in `models.py`.
If there's helpful test data which should always be loaded, add it in `database.py`.  If you don't want the DB to reset on each run,
you can remove the `--reset-db` flag from the calls to `app.py` found in `package.json`.

### Testing Locally

This command will run the frontend and backend at the same time in dev-mode, putting the logs for both in your console:

```
yarn start
```

Saved changes to both the front and backend should be viewable without a restart.  If you change the 'data model' though, you'll probably want
to kill the process and restart.

### Deployment setup

Heroku uses the `Procfile` in our root directory to know which processes to spin up on the deployment server. [Tutorial to learn more here](https://devcenter.heroku.com/articles/getting-started-with-python)

```
brew install heroku/brew/heroku
```

Test deployment locally (if you check out the `Procfile`, you can see the command called to start the web server):

```
heroku local
```

Deployments to https://ketchup-main.herokuapp.com/ happen automatically from main at GitHub (Spooky CD magic).  Just push and every thing will reset itself and the 
new code will be in prod in ~30 sec.

When troubleshooting a diff between your local environment (which works) and the deployment (which is broken), it's helpful to start with 
`heroku local` which will call a slightly different set of commands to start the server (parrallelized and no longer watching for updates).  If running heroku locally
doesn't work, it is worth checking out the environment provided to the local deployment.  Create a `.env` file and populate it with environment variables matching the ones found when 
running `heroku config` (this dumps the live deployment variables).  Change the DB uri to your local DB (if you wanna access the prod DB, you can always run `heroku ps:psql` and it'll
set you up.)  Mailgun API keys are also defined in the live heroku config.  If you're looking to send emails from you local setup, you'll need to export these (either via the `.env` or the old fashioned way with `export` in the shell).

Here's the heroku [dashboard link.](https://dashboard.heroku.com/apps/ketchup-main/resources)  It's interesting.

### Email

We use [MailGun's](https://app.mailgun.com/app/dashboard) add-on to Heroku to send and receive emails via API call to the mail guns server.

There's nuaince about who you can send emails to with sandbox vs prod accounts.  Long story short, you need a URL to email lots of people with DNS routing to Heroku (this stops spammers).
This means that for local dev, there's an allowlist of users who can receive emails from our Mailgun service.  You can add yourself via the heroku dashboard under the Mailgun addon.  If
you're trying to send mail locally and struggling, look at the logs.  It's likely you're either missing keys in your environment (see above in the heroku section) or you're sending
to emails which aren't on the allowlist yet.

To send emails we send a POST request to the MailGun API with our info (to, from, subject, body).  To receive an email, we first need to tell Mailgun where to send it (we send a POST
request to MailGun with our API url as the payload).  Then, when an email is sent to our domain, MailGun will convert it to an HTTP message and send it to our API.

We have an email limit of ~400/day and 10k/month.  Have to shell out a lil $$ after that (good problems to have).

#### Debugging issues with M1 Mac:

- Symbol not found: _PQbackendPID
    ```
    Remove virtual env (if already created)
    Open Rosetta terminal (if you don't know how, check this please https://www.courier.com/blog/tips-and-tricks-to-setup-your-apple-m1-for-development)
    Go to your project folder
    Create virtual env python3 -m venv venv
    Use created virtual env source venv/bin/activate
    Install binary package of psycopg2 pip install psycopg2-binary==2.9.2
    ```