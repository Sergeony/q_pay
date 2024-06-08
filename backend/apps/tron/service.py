import codecs
from tronpy.keys import PrivateKey
from tronpy import AsyncTron
import asyncio


# add this before build: .fee_limit(5_000_000)
# add this before build to send note along with Tx: .memo("test memo")


# TRANSFER TRX AND TRC20 FROM GPT
#
# async def transfer(private_key: str, to_address: str, amount: int, contract_address: str = None):
#     pk = PrivateKey(bytes.fromhex(private_key))
#
#     try:
#         async with AsyncTron(network="nile") as client:
#             if contract_address:
#                 # This is a TRC20 transfer
#                 contract = await client.get_contract(contract_address)
#                 txb = await contract.functions.transfer(to_address, amount)
#             else:
#                 # This is a TRX transfer
#                 txb = client.trx.transfer(
#                     from_=pk.public_key.to_base58check_address(),
#                     to=to_address,
#                     amount=amount
#                 )
#
#             txn = await txb.with_owner(addr=pk.public_key.to_base58check_address()).build()
#             txn_ret = await txn.sign(pk).broadcast()
#             await txn_ret.wait()
#             # logger.info(f"Transaction successful: {txn_ret}")
#
#     except Exception as e:
#         # logger.error(f"Transaction failed: {e}")
#         pass


if __name__ == "__main__":
    # res = asyncio.run(transferTRC20(
    #     private_key="a1d360fea93ac72b50991cb3591b2253087d11ddab6af8cbb849a5b891cafb2d",
    #     to_address="TGWPHTYuPWbMAbSaoZBNLfdn6q45dJmv5a",
    #     amount=11 * 10**6,
    #     contract_address="TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj",
    # ))
    # print(f"HEX: {res}\n{'='*10}")

    # asyncio.run(transferTRX(
    #     private_key="a1d360fea93ac72b50991cb3591b2253087d11ddab6af8cbb849a5b891cafb2d",
    #     to_address="TGWPHTYuPWbMAbSaoZBNLfdn6q45dJmv5a",
    #     amount=1_000_000
    # ))

    asyncio.run(get_energy(
        private_key="a1d360fea93ac72b50991cb3591b2253087d11ddab6af8cbb849a5b891cafb2d",
        to_address="TGWPHTYuPWbMAbSaoZBNLfdn6q45dJmv5a",
        amount=10_000_000
    ))


class TronService:
    async def rent_energy(self, private_key: str, to_address: str, amount: int):
        pk = PrivateKey(bytes.fromhex(private_key))

        async with AsyncTron(network="nile") as client:
            txb = client.trx.delegate_resource(
                owner=pk.public_key.to_base58check_address(),
                receiver=to_address,
                balance=amount,
                resource="ENERGY",
                lock=True,
                lock_period=60
            )

            txn = await txb.build()
            txn_ret = await txn.sign(pk).broadcast()
            print(txn_ret)
            print(await txn_ret.wait())

    async def _transfer_trc20(self, private_key: str, to_address: str, amount: int, contract_address: str):
        pk = PrivateKey(bytes.fromhex(private_key))

        async with AsyncTron(network="nile") as client:
            contract = await client.get_contract(contract_address)
            txb = await contract.functions.transfer(to_address, amount)

            txn = await txb.with_owner(addr=pk.public_key.to_base58check_address()).build()
            txn_ret = await txn.sign(pk).broadcast()
            print(txn_ret)
            print(await txn_ret.wait())

    async def _transfer_trx(self, private_key: str, to_address: str, amount: int):
        pk = PrivateKey(bytes.fromhex(private_key))

        async with AsyncTron(network="nile") as client:
            txb = client.trx.transfer(
                from_=pk.public_key.to_base58check_address(),
                to=to_address,
                amount=amount
            )

            txn = await txb.build()
            txn_ret = await txn.sign(pk).broadcast()
            print(txn_ret)
            print(await txn_ret.wait())

    def crate_wallet(self):
        pass
