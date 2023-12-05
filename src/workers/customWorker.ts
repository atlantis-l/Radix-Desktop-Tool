import {
  Wallet,
  PublicKey,
  PrivateKey,
  TokenSender,
  TransferInfo,
  ResourcesOfAccount,
  RadixNetworkChecker,
  RadixWalletGenerator,
} from "@atlantis-l/radix-tool";
import { sleep } from "../common";

interface TempOption {
  toAddress: string;
  fromWallet: Wallet;
  fromPrivateKey: string;
  transferInfos: TransferInfo[];
}

const MAX_ADDRESS_PER_CHECK = 1000;

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

  if (action.executor === "MultipleToSingle") {
    switch (action.method) {
      case "sendCustom":
        MultipleToSingle.sendCustom(msg.data);
        break;
      case "sendCustomPreview":
        MultipleToSingle.sendCustomPreview(msg.data);
        break;
      case "getResourcesOfSenders":
        MultipleToSingle.getResourcesOfSenders(msg.data);
        break;
    }
  }
};

const sendCustom = async (data: Data) => {
  const feeLock = data.args[5] as string;
  const txMessage = data.args[0] as string;
  const networkId = data.args[2] as number;
  const currentEpoch = data.args[1] as number;
  const feePayerPrivateKey = data.args[4] as string;
  const walletGenerator = new RadixWalletGenerator(networkId);
  const tempOptions = JSON.parse(data.args[3]) as TempOption[];

  const feePayerWallet =
    await walletGenerator.generateWalletByPrivateKey(feePayerPrivateKey);

  const addressAndPrivateKeyMap = new Map<string, PrivateKey>();

  for (let i = 0; i < tempOptions.length; i++) {
    tempOptions[i].fromWallet =
      await walletGenerator.generateWalletByPrivateKey(
        tempOptions[i].fromPrivateKey,
      );

    addressAndPrivateKeyMap.set(
      tempOptions[i].fromWallet.address,
      tempOptions[i].fromWallet.privateKey,
    );
  }

  addressAndPrivateKeyMap.delete(feePayerWallet.address);

  const tokenSender = new TokenSender(networkId, feePayerWallet);

  tokenSender.feeLock = feeLock;

  tokenSender
    .sendCustom(
      tempOptions,
      [...addressAndPrivateKeyMap.values()],
      txMessage.length ? txMessage : undefined,
      currentEpoch,
    )
    .then((result) => {
      postMessage({
        action: `${data.action.split(".")[0]}.addCommitStatus`,
        args: [{ status: result.status, transactionId: result.transactionId }],
      } as Data);
    });
};

const sendCustomPreview = async (data: Data) => {
  const order = data.args[0] as number;
  const networkId = data.args[2] as number;
  const currentEpoch = data.args[1] as number;
  const feePayerPrivateKey = data.args[4] as string;
  const walletGenerator = new RadixWalletGenerator(networkId);
  const tempOptions = JSON.parse(data.args[3]) as TempOption[];

  const feePayerWallet =
    await walletGenerator.generateWalletByPrivateKey(feePayerPrivateKey);

  const addressAndPublicKeyMap = new Map<string, PublicKey>();

  for (let i = 0; i < tempOptions.length; i++) {
    tempOptions[i].fromWallet =
      await walletGenerator.generateWalletByPrivateKey(
        tempOptions[i].fromPrivateKey,
      );

    addressAndPublicKeyMap.set(
      tempOptions[i].fromWallet.address,
      tempOptions[i].fromWallet.publicKey,
    );
  }

  addressAndPublicKeyMap.delete(feePayerWallet.address);

  const tokenSender = new TokenSender(networkId, feePayerWallet);

  tokenSender
    .sendCustomPreview(
      tempOptions,
      [...addressAndPublicKeyMap.values()],
      currentEpoch,
    )
    .then((result) => {
      if (result.errorMessage) {
        console.error(result.errorMessage);
        result.fee = "error";
      }

      postMessage({
        action: `${data.action.split(".")[0]}.addPreviewFee`,
        args: [{ order, fee: result.fee }],
      } as Data);
    })
    .catch((e) => {
      console.error((e as Error).message);
      postMessage({
        action: `${data.action.split(".")[0]}.addPreviewFee`,
        args: [{ order, fee: "error" }],
      } as Data);
    });
};

const SingleToMultiple = {
  sendCustom,
  sendCustomPreview,
};

const MultipleToSingle = {
  sendCustom,
  sendCustomPreview,
  getResourcesOfSenders: async (data: Data) => {
    const addressList = data.args[0] as string[];
    const networkId = data.args[1] as number;

    const checker = new RadixNetworkChecker(networkId);

    try {
      const resouresOfAccountList = [] as ResourcesOfAccount[];

      for (let i = 0; ; i++) {
        const start = i * MAX_ADDRESS_PER_CHECK;

        let end = i * MAX_ADDRESS_PER_CHECK + MAX_ADDRESS_PER_CHECK;

        end = end > addressList.length ? addressList.length : end;

        const subList = addressList.slice(start, end);

        await sleep(i, 1, 1000);

        const resouresOfAccountSubList =
          await checker.checkResourcesOfAccounts(subList);

        resouresOfAccountList.push(...resouresOfAccountSubList);

        if (end === addressList.length) break;
      }

      postMessage({
        action: `${data.action.split(".")[0]}.setResourcesOfSenders`,
        args: [JSON.stringify(resouresOfAccountList)],
      } as Data);
    } catch (_e) {
      postMessage({
        action: `${data.action.split(".")[0]}.setResourcesOfSenders`,
        args: [],
      } as Data);
    }
  },
};
