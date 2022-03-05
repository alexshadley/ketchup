from apscheduler.schedulers.blocking import BlockingScheduler
from email_worker import send_emails

sched = BlockingScheduler()


@sched.scheduled_job('interval', minutes=5)
def timed_job():
    print('Starting send emails job')
    send_emails()


sched.start()
