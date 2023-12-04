export default {
  Network: {
    mainnet: "Mainnet",
    stokenet: "Stokenet",
  },
  // --------------------------- Menu --------------------------- //
  Menu: {
    StartToUse: {
      title: "Start To Use",
    },
    TokenTransfer: {
      title: "Token Transfer",
      multipleToMultiple: "Multiple To Multiple",
      singleToMultiple: "Single To Multiple",
      multipleToSingle: "Multiple To Single",
    },
    BalanceCheck: {
      title: "Balance Check",
      singleWallet: "Single Wallet",
      multipleWallets: "Wallets",
    },
    HistoryCheck: {
      title: "History Check",
    },
    WalletCreate: {
      title: "Wallet Create",
    },
    TokenCreate: {
      title: "Token Create",
    },
    ManifestExecute: {
      title: "Manifest Execute",
    },
    PackageDeploy: {
      title: "Package Deploy",
    },
    XRDFaucet: {
      title: "XRD Faucet",
    },
  },
  // --------------------------- Menu --------------------------- //

  // --------------------------- View --------------------------- //
  View: {
    StartToUse: {
      message: "Hello World!",
    },
    TokenTransfer: {
      MultipleToMultiple: {
        template: {
          feePayerModal: {
            title: "Payer Wallet",
            addonBefore: "Private Key",
            placeholder: "Use private key to generate Radix address",
          },
          confirmTransactionModal: {
            title: "Transaction Send Confirmation",
            addonBefore: "Text Message",
            placeholder: "On-chain text message (optional)",
          },
          senderModal: {
            title: "Sender Wallet",
            addonBefore: "Private Key",
            placeholder: "Use private key to generate Radix address",
          },
          selectTokenModal: {
            title: "Select Token",
            placeholder1: "Select Tokens",
            placeholder2: "Select NFT IDs",
          },
          header: {
            feePayer: {
              addonBefore: "Fee Payer",
              feePayerAddress: "Fee Payer Address",
              placeholder: "Transaction Fee Payment Wallet",
            },
            feeLock: {
              addonBefore: "Fee Lock",
              placeholder: "Transaction Fee",
              tooltip:
                "Pay with XRD(An appropriate increase must be made based on the estimated fee to ensure successful transaction)",
            },
            estimateFee: {
              button: "Estimate Fee",
            },
            addTransfer: {
              button: "Add Transfer",
            },
            clearAll: {
              button: "Clear Transfer",
            },
            feePayerXrdBalance: {
              tooltip: "Click to refresh balance",
              addonBefore: "XRD Balance",
              placeholder: "Fee Payer XRD Balance",
            },
            sendTransaction: {
              button: "Send Transaction",
            },
          },
          divider: {
            text: "Transfer List",
          },
          content: {
            sender: {
              address: "Sender address",
              addonBefore: "Sender",
              placeholder: "Sender wallet",
            },
            selectToken: {
              tooltip: "Select Token",
            },
            receiver: {
              addonBefore: "Receiver",
              placeholder: "Receiver address",
            },
            deleteBtn: {
              tooltip: "Delete",
            },
          },
        },
        script: {
          mounted: {
            ftLabel: "Fungible Token (FT)",
            nftLabel: "NonFungible Token (NFT)",
          },
          methods: {
            setSender: {
              loading: "Token information is being obtained",
              success: "Token information has been obtained",
              error: "Failed to obtain token information",
              pkError: "Private Key format does not match",
            },
            setFeePayer: {
              pkError: "Private Key format does not match",
            },
            sendTransaction: {
              error: "Transaction sending failed",
              loading: "Transaction is being sent",
              warning: "Repeat sending transaction",
              success: "Transaction sent completed",
            },
            previewTransaction: {
              loading: "Simulated trading in progress",
              error: "Simulated transaction failed",
              success: "Simulated transaction successful",
            },
            checkTx: {
              loading: "Waiting for transaction to complete",
              success: "Transaction successful",
              error: "Transaction failed",
            },
            getXrdBalance: {
              loading: "XRD balance is being obtained",
              success: "XRD balance has been refreshed",
            },
            activateSelectTokenModal: {
              unnamedToken: "Unnamed Token",
              balance: "Balance",
              amount: "Quantity",
              address: "Address",
            },
          },
        },
      },
      SingleToMultiple: {
        message: "Single To Multiple",
      },
      MultipleToSingle: {
        message: "Multiple To Single",
      },
    },
    BalanceCheck: {
      SingleWallet: {
        message: "Single Wallet",
      },
      MultipleWallets: {
        message: "Multiple Wallets",
      },
    },
    HistoryCheck: {
      message: "History Check",
    },
    WalletCreate: {
      message: "Wallet Create",
    },
    TokenCreate: {
      message: "Token Create",
    },
    ManifestExecute: {
      message: "Manifest Execute",
    },
    PackageDeploy: {
      message: "Package Deploy",
    },
    XRDFaucet: {
      message: "XRD Faucet",
    },
  },
  // --------------------------- View --------------------------- //
};