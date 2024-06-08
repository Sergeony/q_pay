# TRX_MESSAGE_HEADER = '\x19TRON Signed Message:\n'
#
#
# def sign(self, transaction: Any, use_tron: bool = True, multisig: bool = False):
#     """Safe method for signing your transaction
#
#     Warnings:
#         method: online_sign() - Use only in extreme cases.
#
#     Args:
#         transaction (Any): transaction details
#         use_tron (bool): is Tron header
#         multisig (bool): multi sign
#
#     """
#
#     if is_string(transaction):
#         if not is_hex(transaction):
#             raise TronError('Expected hex message input')
#
#         # Determine which header to attach to the message
#         # before encrypting or decrypting
#         header = TRX_MESSAGE_HEADER if use_tron else ETH_MESSAGE_HEADER
#         header += str(len(transaction))
#
#         message_hash = self.tron.keccak(text=header + transaction)
#
#         signed_message = Account.sign_hash(self.tron.toHex(message_hash), self.tron.private_key)
#         return signed_message
# import requests
#
# url = "https://nile.trongrid.io/walletsolidity/gettransactionbyid"
# body = {
#     "value": "fb11fb316c30eb0776561d01d2bec71b9fe8e19c9bc5ec3c8b679cbf96f23de1",
# }
# response = requests.request("POST", url, data=body)
#
#
# print(response.text)
