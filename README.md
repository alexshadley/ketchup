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

### Testing Locally

This command will run the frontend and backend at the same time, putting the logs for both in your console:

```
yarn start
```

### Deployment setup

Heroku uses the `Procfile` in our root directory to know which processes to spin up on the deployment server. [Tutorial to learn more here](https://devcenter.heroku.com/articles/getting-started-with-python)

```
brew install heroku/brew/heroku
git remote add heroku https://git.heroku.com/ketchup-main.git
```

Test deployment locally:

```
heroku local
```

To deploy (after committing your changes):

```
git push heroku main
```
