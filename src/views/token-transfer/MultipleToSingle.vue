<template>
  <a-layout class="view-layout">
    <!------------------------ Modal Group ------------------------>
    <div id="modal-group">
      <a-modal
        centered
        @ok="setFeePayer"
        :forceRender="true"
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
          ref="feePayerWalletPrivateKey"
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
        :forceRender="true"
        @ok="processTransaction"
        v-model:open="openConfirmTransaction"
        :title="
          $t(
            `View.TokenTransfer.MultipleToMultiple.template.confirmTransactionModal.title`,
          )
        "
      >
        <a-input
          allowClear
          ref="transactionMessage"
          @pressEnter="processTransaction"
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
      <a-modal
        centered
        :width="270"
        :footer="null"
        :forceRender="true"
        :maskClosable="false"
        v-model:open="openTransactionProgress"
        style="text-align: center; user-select: none"
        :title="
          $t(
            `View.TokenTransfer.SingleToMultiple.template.modal.transactionProgress`,
          )
        "
      >
        <a-progress
          type="circle"
          :stroke-color="{
            '0%': '#052cc0',
            '50%': '#1dddbf',
            '100%': '#ff00e6',
          }"
          style="margin-top: 8px"
          :status="progressStatus"
          :percent="progressPercent"
        />
      </a-modal>
    </div>
    <!------------------------ Modal Group ------------------------>

    <!------------------------ Header ------------------------>
    <a-row :gutter="gutter">
      <a-col span="10" class="view-no-padding-left">
        <a-tooltip>
          <template #title>
            <span
              >{{
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
      <a-col span="9">
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
            addonAfter="XRD"
            :placeholder="feeLockPlaceholder"
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
          >{{
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.header.estimateFee.button`,
            )
          }}
        </a-button>
      </a-col>
    </a-row>
    <a-row :gutter="gutter" class="no-margin-row">
      <a-col span="10" class="view-no-padding-left">
        <a-tooltip placement="bottom">
          <template #title>
            <span
              >{{
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
            addonAfter="XRD"
          />
        </a-tooltip>
      </a-col>
      <a-col flex="1">
        <a-upload name="file" :maxCount="1" :customRequest="uploadCallback">
          <a-button
            class="view-max-width custom-btn"
            :text="
              $t(
                `View.TokenTransfer.SingleToMultiple.template.header.importWallets.button`,
              )
            "
            >{{
              $t(
                `View.TokenTransfer.SingleToMultiple.template.header.importWallets.button`,
              )
            }}
          </a-button>
        </a-upload>
      </a-col>
      <a-col flex="1" style="text-align: center; padding-top: 4px">
        <a-tooltip placement="bottom">
          <template #title
            >{{
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
          @click="activateConfirmModal"
          >{{
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.header.sendTransaction.button`,
            )
          }}
        </a-button>
      </a-col>
    </a-row>
    <!------------------------ Header ------------------------>
    <a-divider
      >「
      {{ $t(`View.TokenTransfer.SingleToMultiple.template.divider.text`) }} 」
    </a-divider>

    <!------------------------ Content ------------------------>
    <a-layout-content class="view-layout-content">
      <a-row :gutter="gutter">
        <a-col span="8" class="view-no-padding-left">
          <a-tooltip>
            <template #title
              >{{
                $t(
                  `View.TokenTransfer.SingleToMultiple.template.content.tokenTip`,
                )
              }}
            </template>
            <a-input-group compact style="display: flex">
              <a-select
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
                value="label"
              >
                <a-select-option value="label">{{
                  $t(
                    `View.TokenTransfer.SingleToMultiple.template.content.token`,
                  )
                }}</a-select-option>
              </a-select>
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
                  <a-tooltip placement="right">
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
        <a-col span="8">
          <a-tooltip>
            <template #title
              >{{
                $t(
                  `View.TokenTransfer.MultipleToSingle.template.content.amountTip`,
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
        <a-col span="8" class="view-no-padding-right">
          <a-input
            allowClear
            v-model:value="receiverAddress"
            :addonBefore="
              $t(
                `View.TokenTransfer.MultipleToMultiple.template.content.receiver.addonBefore`,
              )
            "
            :placeholder="
              $t(
                `View.TokenTransfer.MultipleToMultiple.template.content.receiver.placeholder`,
              )
            "
          />
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
  CustomOption,
  getCurrentEpoch,
  RadixNetworkChecker,
  RadixWalletGenerator,
  ResourceInfo,
  ResourcesOfAccount,
  TokenType,
  TransactionStatus,
  TransferInfo,
  Wallet,
} from "@atlantis-l/radix-tool";
import {
  CreateIcon,
  formatNumber,
  selectXrdAddress,
  sleep,
} from "../../common";
import { message } from "ant-design-vue";
import store from "../../stores/store";
import { defineComponent } from "vue";
import Decimal from "decimal.js";
import Papa from "papaparse";

interface PreviewFee {
  order: number;
  fee: string;
}

enum CustomMethod {
  ESTIMATE_FEE,
  SEND_TRANSACTION,
}

const MAX_WALLET_PER_TX = 16;

export default defineComponent({
  components: {
    CreateIcon,
  },
  data() {
    return {
      gutter: 10,
      feeLock: "",
      wallets: [],
      store: store(),
      focusInput: "",
      tokenAmount: "",
      progressCount: 0,
      receiverAddress: "",
      feeLockEstimate: "",
      feePayerXrdBalance: "",
      transactionMessage: "",
      progressStatus: "normal",
      openFeePayerModal: false,
      feePayerWalletPrivateKey: "",
      openConfirmTransaction: false,
      openTransactionProgress: false,
      commitStatusList: [] as number[],
      previewFeeList: [] as PreviewFee[],
      customOptions: [] as CustomOption[],
      selectedToken: undefined as string | undefined,
      feePayerWallet: undefined as Wallet | undefined,
      customMethod: undefined as CustomMethod | undefined,
      networkChecker: new RadixNetworkChecker(store().networkId),
      walletGenerator: new RadixWalletGenerator(store().networkId),
      addressAndResourcesMap: new Map<string, ResourcesOfAccount>(),
      resourcesOfSenders: undefined as ResourcesOfAccount | undefined,
    };
  },
  watch: {
    wallets() {
      this.previewFeeList = [];
    },
    tokenAmount() {
      this.previewFeeList = [];
    },
    senderWallet() {
      this.previewFeeList = [];
    },
    selectedToken() {
      this.previewFeeList = [];
    },
    feePayerWallet() {
      this.previewFeeList = [];
    },
    focusInput(ref: string) {
      if (ref.length) {
        setTimeout(() => {
          //@ts-ignore
          this.$refs[ref].focus();
          this.focusInput = "";
        }, 100);
      }
    },
    isCommitDone(flag: boolean) {
      if (flag) {
        this.previewFeeList = [];
      }
    },
    isPreviewDone(flag: boolean) {
      if (flag) {
        if (this.previewFeeList.map((fee) => fee.fee).includes("error")) {
          this.previewFeeList = [];
          return;
        }
        this.previewFeeList.sort((a, b) => a.order - b.order);
      }
    },
    "store.simTx"(flag: boolean) {
      this.store.setSimTx(flag);

      let msg = flag
        ? this.$t(`View.TokenTransfer.SingleToMultiple.script.enableSimTx`)
        : this.$t(`View.TokenTransfer.SingleToMultiple.script.disableSimTx`);

      message.success({ content: `「 ${msg} 」`, key: "simTx" });
    },
    "store.networkId"(id: number) {
      this.networkChecker.networkId = id;
      this.walletGenerator.networkId = id;
    },
  },
  computed: {
    tokenOptions() {
      //@ts-ignore
      const options = [];

      if (this.resourcesOfSenders) {
        this.resourcesOfSenders.fungible.forEach((info) => {
          if (info.amount === "0") return;

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
    requestCount() {
      return Math.ceil(this.customOptions.length / MAX_WALLET_PER_TX);
    },
    isPreviewDone() {
      return this.previewFeeList.length === this.requestCount;
    },
    isCommitDone() {
      return this.commitStatusList.length === this.requestCount;
    },
    feePercentList() {
      let totalPreviewFee = new Decimal(0);

      this.previewFeeList.forEach((fee) => {
        totalPreviewFee = totalPreviewFee.plus(fee.fee);
      });

      return this.previewFeeList.map((fee) =>
        new Decimal(fee.fee).div(totalPreviewFee),
      );
    },
    feePayerAddress() {
      return this.feePayerWallet ? this.feePayerWallet.address : undefined;
    },
    progressPercent() {
      const totalCount =
        Math.ceil(this.customOptions.length / MAX_WALLET_PER_TX) * 2 + 1;
      return Math.floor(
        ((this.progressCount + this.commitStatusList.length) / totalCount) *
          100,
      );
    },
    totalTokenAmount() {
      if (this.selectedToken && this.selectedToken.length) {
        let amount = this.selectedTokenAmount;

        if (this.tokenAmount.trim().length) {
          const singleAmount = parseFloat(this.tokenAmount.trim());

          if (singleAmount) {
            const totalAmount = new Decimal(singleAmount * this.wallets.length);

            return amount.greaterThan(totalAmount) ? totalAmount : amount;
          } else {
            return "0";
          }
        } else {
          return amount;
        }
      } else {
        return "0";
      }
    },
    amountPlaceholder() {
      if (this.selectedToken && this.selectedToken.length) {
        return formatNumber(this.selectedTokenAmount.toString());
      } else {
        return this.$t(
          `View.TokenTransfer.SingleToMultiple.template.content.amountPlaceholder`,
        );
      }
    },
    feeLockPlaceholder() {
      return this.feeLockEstimate.length
        ? formatNumber(this.feeLockEstimate)
        : this.$t(
            `View.TokenTransfer.MultipleToMultiple.template.header.feeLock.placeholder`,
          );
    },
    selectedTokenAmount() {
      let amount = new Decimal(0);

      [...this.addressAndResourcesMap.values()].forEach(
        (resourcesOfAccount) => {
          const info = resourcesOfAccount.fungible.find(
            (fungible) => fungible.resourceAddress === this.selectedToken,
          );
          if (info) {
            amount = amount.plus(info.amount as string);
          }
        },
      );

      return amount;
    },
  },
  methods: {
    setFeePayer() {
      this.walletGenerator
        .generateWalletByPrivateKey(this.feePayerWalletPrivateKey)
        .then((wallet) => {
          //扣费钱包
          this.feePayerWallet = wallet;
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
    estimateFee() {
      if (!this.validateInputData()) {
        message.warn(
          `「 ${this.$t(
            `View.TokenTransfer.SingleToMultiple.template.header.dataNotValid`,
          )} 」`,
        );
        return;
      }
      this.customMethod = CustomMethod.ESTIMATE_FEE;
      this.validateTransferInfo();
      this.previewTransaction();
    },
    refreshXrdBalance() {
      this.feePayerAddress && this.getXrdBalance(this.feePayerAddress);
    },
    validateInputData() {
      return !(
        !this.selectedToken ||
        !this.feePayerWallet ||
        !this.wallets.length ||
        !this.receiverAddress.trim().length
      );
    },
    processTransaction() {
      this.openConfirmTransaction = false;

      if (this.store.simTx) {
        this.customMethod = CustomMethod.SEND_TRANSACTION;
        this.previewTransaction();
      } else {
        this.sendTransaction();
      }
    },
    activateConfirmModal() {
      if (!this.customOptions.length || !this.isPreviewDone) {
        message.warning(
          `「 ${this.$t(
            `View.TokenTransfer.SingleToMultiple.script.noPreviewFee`,
          )} 」`,
        );
      } else if (!this.feeLock.trim().length) {
        message.warn(
          `「 ${this.$t(
            `View.TokenTransfer.SingleToMultiple.template.header.dataNotValid`,
          )} 」`,
        );
      } else {
        this.focusInput = "transactionMessage";
        this.openConfirmTransaction = true;
      }
    },
    validateTransferInfo() {
      //@ts-ignore
      const customOptions = [];

      let addressField = this.$t(`View.WalletGenerate.script.address`);

      let privateKeyField = this.$t(`View.WalletGenerate.script.privateKey`);

      if (this.wallets.length) {
        if (!this.wallets[0][addressField]) {
          const locale = this.$i18n.locale === "zh" ? "en" : "zh";

          addressField = this.$t(
            `View.WalletGenerate.script.address`,
            locale,
            [],
          );

          privateKeyField = this.$t(
            `View.WalletGenerate.script.privateKey`,
            locale,
            [],
          );
        }
      }

      this.wallets
        .map((data) => {
          const privateKey = data[privateKeyField] as string;

          const address = data[addressField] as string;

          let amount: string | undefined;

          const resources = this.addressAndResourcesMap.get(address);

          if (resources) {
            const fungible = resources.fungible.find(
              (fungible) => fungible.resourceAddress === this.selectedToken,
            );

            if (fungible) {
              amount = fungible.amount;
            } else {
              amount = "0";
            }
          }

          if (this.tokenAmount.trim().length) {
            if (
              new Decimal(amount as string).greaterThan(
                new Decimal(this.tokenAmount.trim()),
              )
            ) {
              amount = this.tokenAmount.trim();
            }
          }

          return {
            fromPrivateKey: privateKey,
            toAddress: this.receiverAddress,
            transferInfos: [
              {
                tokenType: TokenType.FUNGIBLE,
                tokenAddress: this.selectedToken,
                amount,
              } as TransferInfo,
            ],
          };
        })
        .forEach((customOption) => {
          const amount = customOption.transferInfos[0].amount as string;
          if (amount !== "0") {
            //@ts-ignore
            customOptions.push(customOption);
          }
        });

      //@ts-ignore
      this.customOptions = customOptions;
    },
    async sendTransaction() {
      this.progressCount = 0;
      this.commitStatusList = [];
      this.progressStatus = "normal";

      setTimeout(() => {
        this.openTransactionProgress = true;
      }, 500);

      const key = "sendTransaction";

      message.loading({
        key,
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.sendTransaction.loading`,
        )} 」`,
      });

      const txMessage = this.transactionMessage.trim();

      const currentEpoch = await getCurrentEpoch(this.store.networkId);

      for (let i = 0; ; i++) {
        const start = i * MAX_WALLET_PER_TX;

        let end = i * MAX_WALLET_PER_TX + MAX_WALLET_PER_TX;

        end = end > this.customOptions.length ? this.customOptions.length : end;

        const options = this.customOptions.slice(start, end);

        await sleep(i, 10, 4000);

        this.store.worker.postMessage({
          action: "MultipleToSingle.sendCustom",
          args: [
            txMessage,
            currentEpoch,
            this.store.networkId,
            JSON.stringify(options),
            this.feePayerWallet?.privateKeyHexString(),
            this.feePercentList[i].mul(this.feeLock).toNumber().toFixed(18),
          ],
        });

        this.progressCount++;

        if (end === this.customOptions.length) break;
      }
    },
    activateFeePayerModal() {
      const wallet = this.feePayerWallet;
      if (wallet) this.feePayerWalletPrivateKey = wallet.privateKeyHexString();
      this.focusInput = "feePayerWalletPrivateKey";
      this.openFeePayerModal = true;
    },
    addPreviewFee(data: Data) {
      this.previewFeeList.push(data.args[0]);

      const key = "previewTransaction";

      if (this.isPreviewDone) {
        const feeList = this.previewFeeList.map((fee) => fee.fee);

        if (feeList.includes("error")) {
          message.error({
            content: `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.error`,
            )} 」`,
            key,
          });
        } else {
          message.success({
            content: `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.success`,
            )} 」`,
            key,
          });

          if (CustomMethod.ESTIMATE_FEE === this.customMethod) {
            let totalFee = new Decimal(0);

            feeList.forEach((fee) => {
              totalFee = totalFee.plus(fee);
            });

            this.feeLockEstimate = formatNumber(totalFee.toString());
            this.feeLock = "";
          } else if (CustomMethod.SEND_TRANSACTION === this.customMethod) {
            this.sendTransaction();
          }
        }
      }
    },
    async previewTransaction() {
      this.previewFeeList = [];

      const key = "previewTransaction";

      message.loading({
        key,
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.loading`,
        )} 」`,
      });

      const currentEpoch = await getCurrentEpoch(this.store.networkId);

      for (let i = 0; ; i++) {
        const start = i * MAX_WALLET_PER_TX;

        let end = i * MAX_WALLET_PER_TX + MAX_WALLET_PER_TX;

        end = end > this.customOptions.length ? this.customOptions.length : end;

        const options = this.customOptions.slice(start, end);

        await sleep(i, 50, 1000);

        this.store.worker.postMessage({
          action: "MultipleToSingle.sendCustomPreview",
          args: [
            i,
            currentEpoch,
            this.store.networkId,
            JSON.stringify(options),
            this.feePayerWallet?.privateKeyHexString(),
          ],
        });

        if (end === this.customOptions.length) break;
      }
    },
    addCommitStatus(data: Data) {
      this.commitStatusList.push(data.args[0].status ? 0 : 1);

      const key = "sendTransaction";

      if (this.isCommitDone) {
        if (this.commitStatusList.includes(0)) {
          message.error({
            content: `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.sendTransaction.error`,
            )} 」`,
            key,
          });
        } else {
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

          this.checkTx(data.args[0].transactionId as string);
        }
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
          this.progressCount++;
          this.progressStatus = "success";
          message.success({
            key,
            content: `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.checkTx.success`,
            )} 」`,
          });
          this.transactionMessage = "";
          this.refreshXrdBalance();
          this.getResourcesOfSenders();
          return;
        }

        if (
          txResult.transaction.transaction_status !== TransactionStatus.Pending
        ) {
          this.progressCount++;
          this.progressStatus = "exception";
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
    async getResourcesOfSenders() {
      const key = "loadSender";

      message.loading({
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.setSender.loading`,
        )} 」`,
        key,
      });

      let addressField = this.$t(`View.WalletGenerate.script.address`);

      if (this.wallets.length) {
        if (!this.wallets[0][addressField]) {
          const locale = this.$i18n.locale === "zh" ? "en" : "zh";

          addressField = this.$t(
            `View.WalletGenerate.script.address`,
            locale,
            [],
          );
        }
      }

      const addressList = this.wallets.map((data) => data[addressField]);

      this.store.worker.postMessage({
        action: "MultipleToSingle.getResourcesOfSenders",
        args: [addressList, this.store.networkId],
      });
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
    setResourcesOfSenders(data: Data) {
      const key = "loadSender";

      if (data.args.length) {
        const resouresOfAccountList = JSON.parse(
          data.args[0],
        ) as ResourcesOfAccount[];

        const fungibleMap = new Map<string, ResourceInfo>();
        this.addressAndResourcesMap = new Map<string, ResourcesOfAccount>();

        resouresOfAccountList.forEach((resouresOfAccount) => {
          this.addressAndResourcesMap.set(
            resouresOfAccount.address,
            resouresOfAccount,
          );

          resouresOfAccount.fungible.forEach((fungible) => {
            if (fungible.amount && fungible.amount !== "0") {
              fungibleMap.set(fungible.resourceAddress, fungible);
            }
          });
        });

        this.resourcesOfSenders = {
          address: "",
          fungible: [...fungibleMap.values()],
          nonFungible: [],
        };

        message.success({
          content: `「 ${this.$t(
            `View.TokenTransfer.MultipleToMultiple.script.methods.setSender.success`,
          )} 」`,
          key,
        });
      } else {
        message.error({
          content: `「 ${this.$t(
            `View.TokenTransfer.MultipleToMultiple.script.methods.setSender.error`,
          )} 」`,
          key,
        });
      }
    },
    uploadCallback({ file }: { file: File }) {
      //@ts-ignore
      Papa.parse(file, {
        skipEmptyLines: "greedy",
        header: true,
        complete: (file) => {
          //@ts-ignore
          this.wallets = file.data;
          this.getResourcesOfSenders();
        },
      });
    },
  },
  activated() {
    this.store.worker.onmessage = (msg: MessageEvent<Data>) => {
      const actionList = msg.data.action.split(".");

      const action = {
        executor: actionList[0],
        method: actionList[1],
      };

      if (action.executor === "MultipleToSingle") {
        switch (action.method) {
          case "addPreviewFee":
            this.addPreviewFee(msg.data);
            break;
          case "addCommitStatus":
            this.addCommitStatus(msg.data);
            break;
          case "setResourcesOfSenders":
            this.setResourcesOfSenders(msg.data);
            break;
        }
      }
    };
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
