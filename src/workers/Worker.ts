import {
  Wallet,
  TokenSender,
  TransferInfo,
  RadixWalletGenerator,
} from "@atlantis-l/radix-tool";

interface TempOption {
  toAddress: string;
  fromWallet: Wallet;
  fromPrivateKey: string;
  transferInfos: TransferInfo[];
}

onmessage = (msg: MessageEvent<Data>) => {
  const actionList = msg.data.action.split(".");

  const action = {
    executor: actionList[0],
    method: actionList[1],
  };

  if (action.executor === "SingleToMultiple") {
    switch (action.method) {
      case "sendCustom":
        SingleToMultiple.sendCustom(msg.data);
        break;
      case "sendCustomPreview":
        SingleToMultiple.sendCustomPreview(msg.data);
        break;
    }
  }
};

const SingleToMultiple = {
  sendCustom: async (data: Data) => {
    const feeLock = data.args[5] as string;
    const txMessage = data.args[0] as string;
    const networkId = data.args[2] as number;
    const currentEpoch = data.args[1] as number;
    const feePayerPrivateKey = data.args[4] as string;
    const walletGenerator = new RadixWalletGenerator(networkId);
    const tempOptions = JSON.parse(data.args[3]) as TempOption[];

    for (let i = 0; i < tempOptions.length; i++) {
      tempOptions[i].fromWallet =
        await walletGenerator.generateWalletByPrivateKey(
          tempOptions[i].fromPrivateKey,
        );
    }

    const feePayerWallet =
      await walletGenerator.generateWalletByPrivateKey(feePayerPrivateKey);

    const tokenSender = new TokenSender(networkId, feePayerWallet);

    tokenSender.feeLock = feeLock;

    tokenSender
      .sendCustom(
        tempOptions,
        [tempOptions[0].fromWallet.privateKey],
        txMessage.length ? txMessage : undefined,
        currentEpoch,
      )
      .then((result) => {
        postMessage({
          action: "SingleToMultiple.addCommitStatus",
          args: [
            { status: result.status, transactionId: result.transactionId },
          ],
        } as Data);
      });
  },
  sendCustomPreview: async (data: Data) => {
    const order = data.args[0] as number;
    const networkId = data.args[2] as number;
    const currentEpoch = data.args[1] as number;
    const feePayerPrivateKey = data.args[4] as string;
    const walletGenerator = new RadixWalletGenerator(networkId);
    const tempOptions = JSON.parse(data.args[3]) as TempOption[];

    for (let i = 0; i < tempOptions.length; i++) {
      tempOptions[i].fromWallet =
        await walletGenerator.generateWalletByPrivateKey(
          tempOptions[i].fromPrivateKey,
        );
    }

    const feePayerWallet =
      await walletGenerator.generateWalletByPrivateKey(feePayerPrivateKey);

    const tokenSender = new TokenSender(networkId, feePayerWallet);

    tokenSender
      .sendCustomPreview(
        tempOptions,
        [tempOptions[0].fromWallet.publicKey],
        currentEpoch,
      )
      .then((result) => {
        if (result.errorMessage) {
          console.error(result.errorMessage);
          result.fee = "error";
        }

        postMessage({
          action: "SingleToMultiple.addPreviewFee",
          args: [{ order, fee: result.fee }],
        } as Data);
      })
      .catch((e) => {
        console.error((e as Error).message);
        postMessage({
          action: "SingleToMultiple.addPreviewFee",
          args: [{ order, fee: "error" }],
        } as Data);
      });
  },
};
