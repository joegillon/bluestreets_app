import requests
import json
from flask import current_app as app


class ApiClient(object):

    headers = {
        'Content-type': 'application/json',
        'Accept': 'application/json'
    }

    @staticmethod
    def get(url):
        url = '%s/%s' % (app.config['API_URL'], url)
        response = requests.get(url, headers=ApiClient.headers)
        if response.status_code in [200, 304]:
            return json.loads(response.content)
        print('Error: ', response.status_code)

    @staticmethod
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


