import requests
import json
from flask import current_app as app


headers = {
    'Content-type': 'application/json',
    'Accept': 'application/json'
}


def get(url):
    url = '%s/%s' % (app.config['API_URL'], url)
    response = requests.get(url, headers=headers)
    if response.status_code in [200, 304]:
        return json.loads(response.content)
    print('Error: ', response.status_code)


def post(url, json_data):
    url = '%s/%s' % (app.config['API_URL'], url)
    headers = {'content-type': 'application/json'}
    response = requests.post(
        url,
        headers=headers,
        data=json.dumps(json_data)
    )
    if response.status_code in [200, 304]:
        return json.loads(response.content)
    print('Error: ', response.status_code)
