<template>
  <a-layout class="view-layout">
    <!------------------------ Modal Group ------------------------>
    <div id="modal-group">
      <a-modal
        centered
        @ok="setFeePayer"
        v-model:open="openFeePayerModal"
        :title="
          $t(
            `View.TokenTransfer.MultipleToMultiple.template.feePayerModal.title`,
          )
        "
      >
        <a-input
          showCount
          allowClear
          @pressEnter="setFeePayer"
          v-model:value="feePayerWalletPrivateKey"
          :addonBefore="
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.feePayerModal.addonBefore`,
            )
          "
          :placeholder="
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.feePayerModal.placeholder`,
            )
          "
        ></a-input>
      </a-modal>
      <a-modal
        centered
        @ok="sendTransaction"
        v-model:open="openConfirmTransaction"
        :title="
          $t(
            `View.TokenTransfer.MultipleToMultiple.template.confirmTransactionModal.title`,
          )
        "
      >
        <a-input
          allowClear
          @pressEnter="sendTransaction"
          v-model:value="transactionMessage"
          :addonBefore="
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.confirmTransactionModal.addonBefore`,
            )
          "
          :placeholder="
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.confirmTransactionModal.placeholder`,
            )
          "
        />
      </a-modal>
    </div>
    <!------------------------ Modal Group ------------------------>

    <!------------------------ Header ------------------------>
    <a-row :gutter="gutter">
      <a-col span="11" class="view-no-padding-left">
        <a-tooltip>
          <template #title>
            <span>
              {{
                feePayerAddress
                  ? feePayerAddress
                  : $t(
                      `View.TokenTransfer.MultipleToMultiple.template.header.feePayer.feePayerAddress`,
                    )
              }}
            </span>
          </template>
          <a-input
            readonly
            :value="feePayerAddress"
            @click="activateFeePayerModal"
            :addonBefore="
              $t(
                `View.TokenTransfer.MultipleToMultiple.template.header.feePayer.addonBefore`,
              )
            "
            :placeholder="
              $t(
                `View.TokenTransfer.MultipleToMultiple.template.header.feePayer.placeholder`,
              )
            "
          />
        </a-tooltip>
      </a-col>
      <a-col span="8">
        <a-tooltip>
          <template #title>
            <span>{{
              $t(
                `View.TokenTransfer.MultipleToMultiple.template.header.feeLock.tooltip`,
              )
            }}</span>
          </template>
          <a-input
            allowClear
            v-model:value="feeLock"
            :addonBefore="
              $t(
                `View.TokenTransfer.MultipleToMultiple.template.header.feeLock.addonBefore`,
              )
            "
            :placeholder="
              $t(
                `View.TokenTransfer.MultipleToMultiple.template.header.feeLock.placeholder`,
              )
            "
          />
        </a-tooltip>
      </a-col>
      <a-col span="5" class="view-no-padding-right">
        <a-button
          class="view-max-width custom-btn"
          :text="
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.header.estimateFee.button`,
            )
          "
          @click="estimateFee"
        >
          {{
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.header.estimateFee.button`,
            )
          }}
        </a-button>
      </a-col>
    </a-row>
    <a-row :gutter="gutter" class="no-margin-row">
      <a-col span="11" class="view-no-padding-left">
        <a-tooltip>
          <template #title>
            <span>
              {{
                $t(
                  `View.TokenTransfer.MultipleToMultiple.template.header.feePayerXrdBalance.tooltip`,
                )
              }}
            </span>
          </template>
          <a-input
            readonly
            @click="refreshXrdBalance"
            :value="feePayerXrdBalance"
            :placeholder="
              $t(
                `View.TokenTransfer.MultipleToMultiple.template.header.feePayerXrdBalance.placeholder`,
              )
            "
            :addonBefore="
              $t(
                `View.TokenTransfer.MultipleToMultiple.template.header.feePayerXrdBalance.addonBefore`,
              )
            "
          />
        </a-tooltip>
      </a-col>
      <a-col span="4">
        <a-upload name="file" :maxCount="1" :customRequest="uploadCallback">
          <a-button
            class="view-max-width custom-btn"
            :text="
              $t(
                `View.TokenTransfer.SingleToMultiple.template.header.importWallets.button`,
              )
            "
          >
            {{
              $t(
                `View.TokenTransfer.SingleToMultiple.template.header.importWallets.button`,
              )
            }}
          </a-button>
        </a-upload>
      </a-col>
      <a-col span="4" style="text-align: center; padding-top: 4px">
        <a-tooltip>
          <template #title>
            {{
              $t(`View.TokenTransfer.SingleToMultiple.template.header.simTx`)
            }}
          </template>
          <a-switch v-model:checked="store.simTx">
            <template #checkedChildren>
              <CreateIcon icon="CheckOutlined" />
            </template>
            <template #unCheckedChildren>
              <CreateIcon icon="LockOutlined" />
            </template>
          </a-switch>
        </a-tooltip>
      </a-col>
      <a-col span="5" class="view-no-padding-right">
        <a-button
          class="view-max-width custom-btn"
          :text="
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.header.sendTransaction.button`,
            )
          "
          @click="openConfirmModal"
        >
          {{
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.header.sendTransaction.button`,
            )
          }}
        </a-button>
      </a-col>
    </a-row>
    <!------------------------ Header ------------------------>

    <a-divider>
      {{ $t(`View.TokenTransfer.SingleToMultiple.template.divider.text`) }}
    </a-divider>

    <!------------------------ Content ------------------------>
    <a-layout-content ref="content" class="view-layout-content">
      <a-row :gutter="gutter">
        <a-col span="8" class="view-no-padding-left">
          <a-input
            v-model:value="receiverWalletAddress"
            :addonBefore="
              $t(
                `View.TokenTransfer.MultipleToSingle.template.content.receiver.addonBefore`,
              )
            "
            :placeholder="
              $t(
                `View.TokenTransfer.MultipleToSingle.template.content.receiver.placeholder`,
              )
            "
          />
        </a-col>
        <a-col span="8">
          <a-tooltip>
            <template #title>
              {{
                $t(
                  `View.TokenTransfer.SingleToMultiple.template.content.tokenTip`,
                )
              }}
            </template>
            <a-input-group compact style="display: flex">
              <a-select
                :open="false"
                :show-arrow="false"
                class="view-nft-selector-label"
                :defaultValue="
                  $t(
                    `View.TokenTransfer.SingleToMultiple.template.content.token`,
                  )
                "
              />
              <a-select
                allowClear
                style="flex: 1"
                :showSearch="true"
                optionLabelProp="name"
                :options="tokenOptions"
                optionFilterProp="label"
                v-model:value="selectedToken"
                :placeholder="
                  $t(
                    `View.TokenTransfer.MultipleToMultiple.template.selectTokenModal.placeholder1`,
                  )
                "
              >
                <template #option="{ label, value }">
                  <a-tooltip placement="left">
                    <template #title>
                      <span>{{ value }}</span>
                    </template>
                    <span>{{ label }}</span>
                  </a-tooltip>
                </template>
              </a-select>
            </a-input-group>
          </a-tooltip>
        </a-col>
        <a-col span="8" class="view-no-padding-right">
          <a-tooltip>
            <template #title>
              {{
                $t(
                  `View.TokenTransfer.SingleToMultiple.template.content.amountTip`,
                )
              }}
            </template>
            <a-input
              allowClear
              v-model:value="tokenAmount"
              :title="amountPlaceholder"
              :placeholder="amountPlaceholder"
              :addonBefore="
                $t(
                  `View.TokenTransfer.SingleToMultiple.template.content.amount`,
                )
              "
            />
          </a-tooltip>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-statistic
            :value="selectedToken"
            :title="
              $t(
                `View.TokenTransfer.SingleToMultiple.template.content.tokenAddress`,
              )
            "
          />
        </a-col>
      </a-row>
      <a-row>
        <a-col span="8">
          <a-statistic
            :value="wallets.length"
            :title="
              $t(
                `View.TokenTransfer.SingleToMultiple.template.content.walletAmount`,
              )
            "
          />
        </a-col>
        <a-col span="16">
          <a-statistic
            :value="totalTokenAmount"
            :title="
              $t(
                `View.TokenTransfer.SingleToMultiple.template.content.totalTokenAmount`,
              )
            "
          />
        </a-col>
      </a-row>
    </a-layout-content>
    <!------------------------ Content ------------------------>
  </a-layout>
</template>

<script lang="ts">
import {
  Status,
  Wallet,
  TokenType,
  TokenSender,
  CustomOption,
  TransferInfo,
  PreviewResult,
  getCurrentEpoch,
  TransactionStatus,
  ResourcesOfAccount,
  RadixNetworkChecker,
  RadixWalletGenerator,
} from "@atlantis-l/radix-tool";
import { CreateIcon, formatNumber, selectXrdAddress } from "../../common";
import { message } from "ant-design-vue";
import store from "../../stores/store";
import { defineComponent } from "vue";
import Decimal from "decimal.js";
import Papa from "papaparse";

const MAX_WALLET_PER_TX = 50;

export default defineComponent({
  components: {
    CreateIcon,
  },
  data() {
    return {
      feeLock: "",
      wallets: [],
      store: store(),
      tokenAmount: "",
      senderPrivateKey: "",
      feePayerXrdBalance: "",
      transactionMessage: "",
      openSenderModal: false,
      openFeePayerModal: false,
      receiverWalletAddress: "",
      feePayerWalletPrivateKey: "",
      selectedToken: [] as string[],
      openConfirmTransaction: false,
      previewFeeList: [] as string[],
      customOptions: [] as CustomOption[],
      senderWallet: undefined as Wallet | undefined,
      feePayerWallet: undefined as Wallet | undefined,
      //@ts-ignore
      tokenSender: new TokenSender(store().networkId, undefined),
      networkChecker: new RadixNetworkChecker(store().networkId),
      walletGenerator: new RadixWalletGenerator(store().networkId),
      resourcesOfSendersMap: new Map<string, ResourcesOfAccount>(),
      resourcesOfSenders: undefined as ResourcesOfAccount | undefined,
    };
  },
  watch: {
    "store.simTx"(flag: boolean) {
      this.store.setSimTx(flag);

      let msg = flag
        ? this.$t(`View.TokenTransfer.SingleToMultiple.script.enableSimTx`)
        : this.$t(`View.TokenTransfer.SingleToMultiple.script.disableSimTx`);

      message.success({ content: `「 ${msg} 」`, key: "simTx" });
    },
    "store.networkId"(id: number) {
      this.tokenSender.networkId = id;
      this.networkChecker.networkId = id;
      this.walletGenerator.networkId = id;
    },
    tokenAmount() {
      this.previewFeeList = [];
    },
    selectedToken() {
      this.previewFeeList = [];
    },
  },
  computed: {
    gutter() {
      return 10;
    },
    tokenOptions() {
      //@ts-ignore
      const options = [];

      if (this.resourcesOfSenders) {
        this.resourcesOfSenders.fungible.forEach((info) => {
          // if (info.amount === "0") return;

          let tempLabel = info.name;

          if (info.symbol) tempLabel = info.symbol;

          if (!tempLabel)
            tempLabel = this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
            );

          let label = `「 ${tempLabel} 」`;

          label += `「 ${this.$t(
            `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.address`,
          )}: ${info.resourceAddress} 」`;

          options.push({
            label,
            name: tempLabel,
            value: info.resourceAddress,
          });
        });
      }
      //@ts-ignore
      return options;
    },
    feePayerAddress() {
      return this.feePayerWallet ? this.feePayerWallet.address : undefined;
    },
    totalTokenAmount() {
      if (this.tokenAmount.trim().length) {
        const singleAmount = parseFloat(this.tokenAmount);
        return !singleAmount
          ? "0"
          : new Decimal(singleAmount * this.wallets.length);
      } else if (
        this.wallets.length &&
        this.wallets[0][
          this.$t(`View.TokenTransfer.SingleToMultiple.template.content.amount`)
        ]
      ) {
        let amount = new Decimal(0);

        this.wallets.forEach((data) => {
          amount = amount.plus(
            data[
              this.$t(
                `View.TokenTransfer.SingleToMultiple.template.content.amount`,
              )
            ],
          );
        });

        return amount;
      } else {
        return "0";
      }
    },
    amountPlaceholder() {
      return this.$t(
        `View.TokenTransfer.SingleToMultiple.template.content.amountPlaceholder`,
      );
    },
  },
  methods: {
    setFeePayer() {
      this.previewFeeList = [];

      this.walletGenerator
        .generateWalletByPrivateKey(this.feePayerWalletPrivateKey)
        .then((wallet) => {
          //扣费钱包
          this.feePayerWallet = wallet;
          this.tokenSender.mainWallet = wallet;
          this.tokenSender.feePayerWallet = wallet;
          //关闭对话框
          this.openFeePayerModal = false;
          //获取钱包XRD余额
          this.getXrdBalance(wallet.address);
        })
        .catch((_error) => {
          message.error(
            `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.setFeePayer.pkError`,
            )} 」`,
          );
        });
    },
    uploadCallback(payload: object) {
      this.previewFeeList = [];
      //@ts-ignore
      Papa.parse(payload.file, {
        skipEmptyLines: "greedy",
        header: true,
        complete: (file) => {
          //@ts-ignore
          this.wallets = file.data;
          this.getResourcesOfSenders();
        },
      });
    },
    openConfirmModal() {
      if (!this.previewFeeList.length) {
        message.warning(
          `「 ${this.$t(
            `View.TokenTransfer.SingleToMultiple.script.noPreviewFee`,
          )} 」`,
        );
        return;
      }
      this.openConfirmTransaction = true;
    },
    async estimateFee() {
      const result = await this.previewTransaction();

      if (!result) return;

      this.feeLock = result.fee;
    },
    refreshXrdBalance() {
      this.feePayerAddress && this.getXrdBalance(this.feePayerAddress);
    },
    async sendTransaction() {
      this.openConfirmTransaction = false;

      if (this.store.simTx) {
        const previwResult = await this.previewTransaction();

        if (!previwResult) {
          return;
        }
      } else {
        this.validateTransferInfo();
      }

      const key = "sendTransaction";

      message.loading({
        key,
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.sendTransaction.loading`,
        )} 」`,
      });

      const txMessage = this.transactionMessage.trim();

      let totalPreviewFee = new Decimal(0);

      this.previewFeeList.forEach((fee) => {
        totalPreviewFee = totalPreviewFee.plus(fee);
      });

      const feePercentList = this.previewFeeList.map((fee) =>
        new Decimal(fee).div(totalPreviewFee),
      );

      let result;

      for (let i = 0; ; i++) {
        const start = i * MAX_WALLET_PER_TX;

        const end =
          i * MAX_WALLET_PER_TX + MAX_WALLET_PER_TX > this.customOptions.length
            ? this.customOptions.length
            : i * MAX_WALLET_PER_TX + MAX_WALLET_PER_TX;

        const options = this.customOptions.slice(start, end);

        this.tokenSender.feeLock = feePercentList[i]
          .mul(this.feeLock)
          .toNumber()
          .toFixed(18);

        result = await this.tokenSender.sendCustom(
          options,
          txMessage.length ? txMessage : undefined,
          await getCurrentEpoch(this.store.networkId),
        );

        if (result.status === Status.FAIL) {
          this.previewFeeList = [];
          message.error({
            content: `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.sendTransaction.error`,
            )} 」`,
            key,
          });
          return;
        } else if (result.status === Status.DUPLICATE_TX) {
          this.previewFeeList = [];
          message.warning({
            content: `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.sendTransaction.warning`,
            )} 」`,
            key,
          });
          return;
        }

        if (end === this.customOptions.length) break;
      }
      this.previewFeeList = [];

      message.success({
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.sendTransaction.success`,
        )} 」`,
        key,
      });

      message.loading({
        duration: 0,
        key: "checkTx",
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.checkTx.loading`,
        )} 」`,
      });

      this.checkTx(result.transactionId as string);
    },
    validateTransferInfo() {
      //@ts-ignore
      this.customOptions = this.wallets.map((data) => {
        return {
          fromWallet: this.senderWallet,
          toAddress: data[this.$t(`View.WalletCreate.script.address`)],
          transferInfos: [
            {
              tokenType: TokenType.FUNGIBLE,
              tokenAddress: this.selectedToken as unknown as string,
              amount: this.tokenAmount.trim().length
                ? this.tokenAmount.trim()
                : data[
                    this.$t(
                      `View.TokenTransfer.SingleToMultiple.template.content.amount`,
                    )
                  ],
            } as TransferInfo,
          ],
        };
      });
    },
    activateFeePayerModal() {
      const wallet = this.feePayerWallet;
      if (wallet) this.feePayerWalletPrivateKey = wallet.privateKeyHexString();
      this.openFeePayerModal = true;
    },
    async previewTransaction() {
      this.validateTransferInfo();

      this.previewFeeList = [];

      this.tokenSender.feeLock = "0";

      const key = "previewTransaction";

      message.loading({
        key,
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.loading`,
        )} 」`,
      });

      try {
        let result: PreviewResult;

        let fee = new Decimal(0);

        for (let i = 0; ; i++) {
          const start = i * MAX_WALLET_PER_TX;

          const end =
            i * MAX_WALLET_PER_TX + MAX_WALLET_PER_TX >
            this.customOptions.length
              ? this.customOptions.length
              : i * MAX_WALLET_PER_TX + MAX_WALLET_PER_TX;

          const options = this.customOptions.slice(start, end);

          result = await this.tokenSender.sendCustomPreview(
            options,
            await getCurrentEpoch(this.store.networkId),
          );

          if (result.errorMessage) {
            this.previewFeeList = [];
            console.error(result.errorMessage);
            message.error({
              content: `「 ${this.$t(
                `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.error`,
              )} 」`,
              key,
            });
            return;
          }

          fee = fee.plus(result.fee);

          this.previewFeeList.push(result.fee);

          if (end === this.customOptions.length) break;
        }

        message.success({
          content: `「 ${this.$t(
            `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.success`,
          )} 」`,
          key,
        });

        result.fee = fee.toString();

        return result;
      } catch (e) {
        this.previewFeeList = [];
        console.error((e as Error).message);
        message.error({
          content: `「 ${this.$t(
            `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.error`,
          )} 」`,
          key,
        });
      }
    },
    async checkTx(txId: string) {
      const key = "checkTx";

      try {
        const txResult = await this.networkChecker.checkTransaction(txId);

        if (
          txResult.transaction.transaction_status ===
          TransactionStatus.CommittedSuccess
        ) {
          message.success({
            key,
            content: `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.checkTx.success`,
            )} 」`,
          });
          this.refreshXrdBalance();
          this.getResourcesOfSenders();
          return;
        }

        if (
          txResult.transaction.transaction_status !== TransactionStatus.Pending
        ) {
          console.error(txResult.transaction.error_message);
          message.error({
            key,
            content: `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.checkTx.error`,
            )} 」`,
          });
          this.refreshXrdBalance();
          this.getResourcesOfSenders();
          return;
        }
      } catch (_e) {}

      setTimeout(() => {
        this.checkTx(txId);
      }, 4000);
    },
    formatNumber(number: string) {
      return formatNumber(number);
    },
    getXrdBalance(address: string) {
      const key = "XRD Balance";

      message.loading({
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.getXrdBalance.loading`,
        )} 」`,
        key,
      });

      this.networkChecker
        .checkResourcesOfAccounts([address])
        .then((resourcesOfAccounts) => {
          //检索XRD代币信息
          const feePayerXrd = (
            resourcesOfAccounts.pop() as ResourcesOfAccount
          ).fungible.find((resource) => {
            const xrdAddress = selectXrdAddress(this.store.networkId);
            return resource.resourceAddress === xrdAddress;
          });
          //扣费钱包的XRD余额
          this.feePayerXrdBalance = feePayerXrd
            ? formatNumber(feePayerXrd.amount as string)
            : "0";

          message.success({
            content: `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.getXrdBalance.success`,
            )} 」`,
            key,
          });
        });
    },
    async getResourcesOfSenders() {
      const key = "loadSender";

      message.loading({
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.setSender.loading`,
        )} 」`,
        key,
      });

      try {
        const addressList = this.wallets.map((wallet) => {
          return wallet[this.$t(`View.WalletCreate.script.address`)] as string;
        });

        const resourcesOfSenderList =
          await this.networkChecker.checkResourcesOfAccounts(addressList);

        const deduplicatedMap = new Map();

        resourcesOfSenderList.forEach((r) => {
          this.resourcesOfSendersMap.set(r.address, r);

          r.fungible.forEach((info) => {
            deduplicatedMap.set(info.resourceAddress, info);
          });
        });

        //获取Senders代币信息
        this.resourcesOfSenders = {
          address: "",
          fungible: [...deduplicatedMap.values()],
          nonFungible: [],
        };

        message.success({
          content: `「 ${this.$t(
            `View.TokenTransfer.MultipleToMultiple.script.methods.setSender.success`,
          )} 」`,
          key,
        });
      } catch (_e) {
        message.error({
          content: `「 ${this.$t(
            `View.TokenTransfer.MultipleToMultiple.script.methods.setSender.error`,
          )} 」`,
          key,
        });
      }
    },
  },
});
</script>

<style scoped>
.ant-layout {
  background-color: #ffffff !important;
}

.ant-switch {
  background: transparent;
  background-size: 250% 400%;
  background-position: 83% 55% !important;
  background-clip: padding-box, content-box;
  background-image: linear-gradient(to left, #ffffff00, #ffffff00),
    radial-gradient(
      #052cc0,
      #1dddbf,
      #ff00e6,
      rgb(0, 255, 47),
      rgb(255, 115, 0)
    );
}

.ant-switch:hover {
  background: transparent;
  background-size: 250% 400%;
  background-position: 83% 55% !important;
  background-clip: padding-box, content-box;
  background-image: linear-gradient(to left, #ffffff00, #ffffff00),
    radial-gradient(
      #052cc0,
      #1dddbf,
      #ff00e6,
      rgb(0, 255, 47),
      rgb(255, 115, 0)
    );
}

.ant-switch-checked {
  background: transparent;
  background-size: 250% 400%;
  background-position: 83% 55% !important;
  background-clip: padding-box, content-box;
  background-image: linear-gradient(to left, #ffffff00, #ffffff00),
    radial-gradient(
      #052cc0,
      #1dddbf,
      #ff00e6,
      rgb(0, 255, 47),
      rgb(255, 115, 0)
    );
}

.ant-switch-checked:hover:not(.ant-switch-disabled) {
  background: transparent;
  background-size: 250% 400%;
  background-position: 83% 55% !important;
  background-image: linear-gradient(to left, #ffffff00, #ffffff00),
    radial-gradient(
      #052cc0,
      #1dddbf,
      #ff00e6,
      rgb(0, 255, 47),
      rgb(255, 115, 0)
    );
}

.view-layout-content {
  margin-top: -5px !important;
  padding-top: 5px !important;
  overflow: scroll !important;
}

.view-layout-content::-webkit-scrollbar {
  display: none !important;
}

.view-nft-selector-label {
  cursor: default !important;
}

.no-margin-row {
  margin: 0 !important;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease-in-out;
}

.list-enter-from,
.list-leave-to {
  opacity: 0 !important;
  transform: scale(0.8, 0.8) !important;
}

.list-leave-active {
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
}
</style>
