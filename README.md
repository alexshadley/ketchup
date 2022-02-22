# Ketchup??

Ketchup with your friends

## Setup

Frontend setup:

```
brew install yarn
yarn
```

Backend setup:

```
pip3 install virtualenv
python3 -m virtualenv .env
source .env/bin/activate
pip install -r requirements.txt
```

DB setup:

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

Also go into database.py and change the username to your own. This part sucks but not a big priority rn.

This command will run the frontend and backend at the same time, putting the logs for both in your console:

```
yarn start
```
