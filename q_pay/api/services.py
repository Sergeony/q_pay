import hashlib
import base64
import json


def generate_data_and_signature(parameters, private_key):
    json_string = json.dumps(parameters)
    data = base64.b64encode(json_string.encode()).decode()

    signature_raw = f"{private_key}{data}{private_key}"
    signature_sha1 = hashlib.sha1(signature_raw.encode()).digest()
    signature = base64.b64encode(signature_sha1).decode()

    return data, signature


def verify_signature(private_key: str, received_data: str, received_signature: str) -> bool:
    signature_raw = f"{private_key}{received_data}{private_key}"
    signature_sha1 = hashlib.sha1(signature_raw.encode()).digest()
    calculated_signature = base64.b64encode(signature_sha1).decode()
    return received_signature == calculated_signature
