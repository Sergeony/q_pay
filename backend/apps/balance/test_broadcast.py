import requests

url = "https://api.shasta.trongrid.io/wallet/broadcasttransaction"

payload = {
    "raw_data": {
        "data": "6d792065787472612064617461",
        "contract": [
            {
                "parameter": {
                    "value": {
                        "amount": 12,
                        "owner_address": "TGWPHTYuPWbMAbSaoZBNLfdn6q45dJmv5a",
                        "to_address": "TXmuKrikMcTH1KXSzSbHhycTWFrHWzZpGC"
                    },
                    "type_url": "type.googleapis.com/protocol.TransferContract"
                },
                "type": "TransferContract"
            }
        ],
        "ref_block_bytes": "8e7d",
        "ref_block_hash": "e9a5cbcdaa02ae50",
        "expiration": 1711978605000,
        "timestamp": 1711978548161
    },
    "raw_data_hex": "0a028e7d2208e9a5cbcdaa02ae5040c8d381cfe931520d6d7920657874726120646174615a65080112610a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412300a154147b63bae308675f8e86509e1ca19ec839fa5ecc4121541ef2f6fc3eb20b5659712d532ad2fb1e348a243c7180c70c197fecee931",
    "txID": "df717e3db2ce6dff94b89f17acc5444bbd6d6b3e5c9cfe5e5209a27dbf4b6d63",
    "visible": True
}

headers = {
    "accept": "application/json",
    "content-type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

print(response.text)
