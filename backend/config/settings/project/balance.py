from ..env import env

from ..django import DEBUG

__all__ = [
    "QPAY_WALLET_ADDRESS",
    "QPAY_TRON_TRANSACTIONS_FETCH_LIMIT",
    "QPAY_NETWORK_URL",
    "QPAY_TRON_GRID_API_KEY",
]


QPAY_WALLET_ADDRESS = env("WALLET_ADDRESS")


QPAY_TRON_TRANSACTIONS_FETCH_LIMIT = 10


QPAY_NETWORK_URL = "https://nile.trongrid.io" if DEBUG else "https://api.trongrid.io"


QPAY_TRON_GRID_API_KEY = env("TRON_GRID_API_KEY")


QPAY_TRON_NODE = {
    "full_node": "https://nile.trongrid.io",
    "solidity_node": "https://nile.trongrid.io",
    "event_server": "https://nile.trongrid.io"
} if DEBUG else {
    "full_node": "https://api.trongrid.io",
    "solidity_node": "https://api.trongrid.io",
    "event_server": "https://api.trongrid.io"
}


TRON_PRIVATE_KEY = "ваш_приватный_ключ"
