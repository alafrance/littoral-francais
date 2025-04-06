import os
import requests
import urllib3
from const import TOKEN_URL
from datetime import datetime
import time


class Client(object):

    def __init__(self):
        self.APPLICATION_ID = os.getenv("APPLICATION_ID")
        self.session = requests.Session()
        urllib3.disable_warnings()

    def request(self, method, url, **kwargs):
        # First request will always need to obtain a token first
        if 'Authorization' not in self.session.headers:
            self.obtain_token()

        # Optimistically attempt to dispatch reqest
        response = self.session.request(method, url, **kwargs)
        if self.token_has_expired(response) or self.need_to_wait(response):
            # We got an 'Access token expired' response => refresh token
            self.obtain_token()
            # Re-dispatch the request that previously failed
            response = self.session.request(method, url, **kwargs)


        return response

    def need_to_wait(self, response):
        try:
            if "nextAccessTime" in response.json():
                next_access_time = response.json()["nextAccessTime"]
                wait_until_next_access_time(next_access_time)
                return True
        except Exception:
            pass
        return False


    def token_has_expired(self, response):
        status = response.status_code
        content_type = response.headers['Content-Type']
        if status == 401 and 'application/json' in content_type:
            repJson = response.text
            # if 'Invalid JWT token' in repJson['description']:
            return True
        return False

    def obtain_token(self):
        # Obtain new token
        data = {'grant_type': 'client_credentials'}
        headers = {'Authorization': 'Basic ' + self.APPLICATION_ID}
        access_token_response = requests.post(TOKEN_URL, data=data, verify=False, allow_redirects=False, headers=headers)
        token = access_token_response.json()['access_token']
        # Update session with fresh token
        self.session.headers.update({'Authorization': 'Bearer %s' % token})


def parse_french_datetime(date_str):
    mois_fr = {
        "janv.": "01", "févr.": "02", "mars": "03", "avr.": "04",
        "mai": "05", "juin": "06", "juil.": "07", "août": "08",
        "sept.": "09", "oct.": "10", "nov.": "11", "déc.": "12"
    }
    for mois_txt, mois_num in mois_fr.items():
        if mois_txt in date_str:
            date_str = date_str.replace(mois_txt, mois_num)
            break
    # On enlève le " UTC" et on parse
    cleaned = date_str.replace(" UTC", "")
    return datetime.strptime(cleaned, "%Y-%m-%d %H:%M:%S%z")


def wait_until_next_access_time(next_access_time):
    target_time = parse_french_datetime(next_access_time)
    now = datetime.utcnow().replace(tzinfo=target_time.tzinfo)
    delta = (target_time - now).total_seconds()
    if delta > 0:
        print(f"On attend {delta:.1f} secondes")
        time.sleep(delta)
    else:
        print("Pas besoin d’attendre.")
