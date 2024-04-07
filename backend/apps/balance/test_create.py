import requests

url = "https://api.shasta.trongrid.io/wallet/createtransaction"

payload = {
    "owner_address": "TGWPHTYuPWbMAbSaoZBNLfdn6q45dJmv5a",
    "to_address": "TXmuKrikMcTH1KXSzSbHhycTWFrHWzZpGC",
    "amount": 12,
    "visible": True,
    "extra_data": "my extra data"
}
headers = {
    "accept": "application/json",
    "content-type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

print(response.text)
