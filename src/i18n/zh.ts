export default {
  Network: {
    mainnet: "主网",
    stokenet: "测试网",
  },
  // --------------------------- Menu --------------------------- //
  Menu: {
    StartToUse: {
      title: "开始使用",
    },
    TokenTransfer: {
      title: "代币转账",
      multipleToMultiple: "多对多",
      singleToMultiple: "一对多",
      multipleToSingle: "多对一",
    },
    BalanceCheck: {
      title: "余额检查",
      singleWallet: "单个钱包",
      multipleWallets: "多个钱包",
    },
    HistoryCheck: {
      title: "历史检查",
    },
    WalletCreate: {
      title: "钱包创建",
    },
    TokenCreate: {
      title: "代币创建",
    },
    ManifestExecute: {
      title: "清单执行",
    },
    PackageDeploy: {
      title: "代码部署",
    },
    XRDFaucet: {
      title: "XRD领取",
    },
  },
  // --------------------------- Menu --------------------------- //

  // --------------------------- View --------------------------- //
  View: {
    StartToUse: {
      message: "你好, 世界!",
    },
    TokenTransfer: {
      MultipleToMultiple: {
        template: {
          feePayerModal: {
            title: "付费方钱包",
            addonBefore: "私钥",
            placeholder: "利用私钥生成Radix地址",
          },
          confirmTransactionModal: {
            title: "交易发送确认",
            addonBefore: "文本信息",
            placeholder: "链上文本消息(可选项)",
          },
          senderModal: {
            title: "发送方钱包",
            addonBefore: "私钥",
            placeholder: "利用私钥生成Radix地址",
          },
          selectTokenModal: {
            title: "选择代币",
            placeholder1: "选择要发送的代币",
            placeholder2: "选择要发送的NFT ID",
          },
          header: {
            feePayer: {
              addonBefore: "付费方",
              feePayerAddress: "付费方地址",
              placeholder: "点击指定付费钱包",
            },
            feeLock: {
              addonBefore: "费用锁定",
              placeholder: "交易费用",
              tooltip: "必须在预估费用的基础上适当增加, 确保交易成功",
            },
            estimateFee: {
              button: "预估费用",
            },
            addTransfer: {
              button: "添加转账",
            },
            clearAll: {
              button: "清除全部",
            },
            feePayerXrdBalance: {
              tooltip: "点击刷新余额",
              addonBefore: "XRD 余额",
              placeholder: "付费方的XRD余额",
            },
            sendTransaction: {
              button: "发送交易",
            },
          },
          divider: {
            text: "转账列表",
          },
          content: {
            sender: {
              address: "发送方地址",
              addonBefore: "发送方",
              placeholder: "点击设置发送方钱包",
            },
            selectToken: {
              tooltip: "选择代币",
            },
            receiver: {
              addonBefore: "接收方",
              placeholder: "接收方地址",
            },
            deleteBtn: {
              tooltip: "删除",
            },
          },
        },
        script: {
          mounted: {
            ftLabel: "同质化代币(FT)",
            nftLabel: "非同质化代币(NFT)",
          },
          methods: {
            setSender: {
              loading: "代币信息正在获取",
              success: "代币信息已获取",
              error: "代币信息获取失败",
              pkError: "私钥格式不匹配",
            },
            setFeePayer: {
              pkError: "私钥格式不匹配",
            },
            sendTransaction: {
              error: "交易发送失败",
              loading: "交易发送中",
              warning: "重复发送交易",
              success: "交易发送完成",
            },
            previewTransaction: {
              loading: "正在进行模拟交易",
              error: "模拟交易失败",
              success: "模拟交易成功",
            },
            checkTx: {
              loading: "等待交易完成",
              success: "交易成功",
              error: "交易失败",
            },
            getXrdBalance: {
              loading: "XRD余额正在获取",
              success: "XRD余额已刷新",
            },
            activateSelectTokenModal: {
              unnamedToken: "未命名代币",
              balance: "余额",
              amount: "数量",
              address: "地址",
            },
          },
        },
      },
      SingleToMultiple: {
        message: "一对多",
      },
      MultipleToSingle: {
        message: "多对一",
      },
    },
    BalanceCheck: {
      SingleWallet: {
        message: "单个钱包",
      },
      MultipleWallets: {
        message: "多个钱包",
      },
    },
    HistoryCheck: {
      message: "历史检查",
    },
    WalletCreate: {
      message: "钱包创建",
    },
    TokenCreate: {
      message: "代币创建",
    },
    ManifestExecute: {
      message: "清单执行",
    },
    PackageDeploy: {
      message: "代码部署",
    },
    XRDFaucet: {
      message: "XRD领取",
    },
  },
  // --------------------------- View --------------------------- //
};
