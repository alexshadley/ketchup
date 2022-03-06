from apscheduler.schedulers.blocking import BlockingScheduler
from email_worker import send_emails

sched = BlockingScheduler()


# here to prevent heroku from idling our jobrunner process
@sched.scheduled_job('interval', minutes=5)
def heartbeat():
    print('heartbeat')


@sched.scheduled_job('interval', hours=1)
def emails():
    print('Starting send emails job')
    send_emails()


sched.start()
