<template>
  <a-layout class="view-layout">
    <!------------------------ Modal Group ------------------------>
    <PrivateKeyModal
      :title="
        $t(`View.TokenTransfer.MultipleToMultiple.template.feePayerModal.title`)
      "
      :wallet="feePayerWallet"
      :open="openFeePayerModal"
      @action="setFeePayer"
      @close="openFeePayerModal = false"
    />

    <PrivateKeyModal
      :title="
        $t(`View.TokenTransfer.MultipleToMultiple.template.senderModal.title`)
      "
      :open="openSenderModal"
      :wallet="senderWallet"
      @action="setSender"
      @close="openSenderModal = false"
    />

    <TxComfirmModal
      :open="openTxConfirmModal"
      @sendTx="sendTransaction"
      @close="openTxConfirmModal = false"
    />

    <ProgressModal
      :open="openProgressModal"
      :closable="maskClosable"
      :status="progressStatus"
      :percent="progressPercent"
      @close="openProgressModal = false"
    />

    <CSVTemplateModal
      view="SingleToMultiple"
      :open="openTemplateModal"
      @close="openTemplateModal = false"
    />
    <!------------------------ Modal Group ------------------------>

    <!------------------------ Header ------------------------>
    <a-row :gutter="gutter">
      <a-col span="10" class="view-no-padding-left">
        <a-tooltip destroyTooltipOnHide>
          <template #title>
            <span
              style="cursor: pointer"
              @click="
                copy(
                  feePayerAddress
                    ? feePayerAddress
                    : $t(
                        `View.TokenTransfer.MultipleToMultiple.template.header.feePayer.feePayerAddress`,
                      ),
                )
              "
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
            @click="openFeePayerModal = true"
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
        <a-tooltip destroyTooltipOnHide>
          <template #title>
            <span>{{
              $t(
                `View.TokenTransfer.MultipleToMultiple.template.header.feeLock.tooltip`,
              )
            }}</span>
          </template>
          <a-input
            allowClear
            v-model:value.trim="feeLock"
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
        <a-tooltip destroyTooltipOnHide placement="bottom">
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
        <a-select class="view-max-width" v-model:value="tokenType">
          <a-select-option :value="0">{{
            $t(
              "View.TokenTransfer.SingleToMultiple.template.header.tokenTypeSelect.fungibleToken",
            )
          }}</a-select-option>
          <a-select-option :value="1">{{
            $t(
              "View.TokenTransfer.SingleToMultiple.template.header.tokenTypeSelect.nonFungibleToken",
            )
          }}</a-select-option>
        </a-select>
      </a-col>
      <a-col flex="1">
        <a-tooltip destroyTooltipOnHide color="white" placement="bottom">
          <template #title>
            <a-button
              @click="openTemplateModal = !openTemplateModal"
              class="view-max-width custom-btn"
              :text="
                $t(
                  'View.TokenTransfer.SingleToMultiple.template.header.template',
                )
              "
              >{{
                $t(
                  "View.TokenTransfer.SingleToMultiple.template.header.template",
                )
              }}
            </a-button>
          </template>

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
          <a-tooltip destroyTooltipOnHide>
            <template #title>
              <span
                style="cursor: pointer"
                @click="
                  copy(
                    senderWallet
                      ? senderWallet.address
                      : $t(
                          `View.TokenTransfer.MultipleToMultiple.template.content.sender.address`,
                        ),
                  )
                "
                >{{
                  senderWallet
                    ? senderWallet.address
                    : $t(
                        `View.TokenTransfer.MultipleToMultiple.template.content.sender.address`,
                      )
                }}
              </span>
            </template>
            <a-input
              readonly
              @click="openSenderModal = true"
              :value="senderWallet?.address"
              :addonBefore="
                $t(
                  `View.TokenTransfer.MultipleToMultiple.template.content.sender.addonBefore`,
                )
              "
              :placeholder="
                $t(
                  `View.TokenTransfer.MultipleToMultiple.template.content.sender.placeholder`,
                )
              "
            />
          </a-tooltip>
        </a-col>
        <a-col span="8">
          <a-input-group compact style="display: flex">
            <a-select
              :open="false"
              :bordered="false"
              :show-arrow="false"
              class="view-nft-selector-label"
              value="label"
            >
              <a-select-option value="label">{{
                $t(`View.TokenTransfer.SingleToMultiple.template.content.token`)
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
                <a-tooltip destroyTooltipOnHide placement="left">
                  <template #title>
                    <span style="cursor: pointer" @click="copy(value)">{{
                      value
                    }}</span>
                  </template>
                  <span>{{ label }}</span>
                </a-tooltip>
              </template>
            </a-select>
          </a-input-group>
        </a-col>
        <a-col span="8" class="view-no-padding-right">
          <a-tooltip destroyTooltipOnHide v-if="!tokenType">
            <template #title
              >{{
                $t(
                  `View.TokenTransfer.SingleToMultiple.template.content.amountTip`,
                )
              }}
            </template>
            <a-input
              allowClear
              v-model:value.trim="tokenAmount"
              :title="amountPlaceholder"
              :placeholder="amountPlaceholder"
              :addonBefore="
                $t(
                  `View.TokenTransfer.SingleToMultiple.template.content.amount`,
                )
              "
            />
          </a-tooltip>

          <a-select v-else class="view-max-width" v-model:value="transferWay">
            <a-select-option :value="0">{{
              $t(
                "View.TokenTransfer.SingleToMultiple.template.content.customTransfer",
              )
            }}</a-select-option>
            <a-select-option :value="1">{{
              $t(
                "View.TokenTransfer.SingleToMultiple.template.content.randomTransfer",
              )
            }}</a-select-option>
          </a-select>
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
  Wallet,
  TokenType,
  TransferInfo,
  CustomOption,
  getCurrentEpoch,
  TransactionStatus,
  ResourcesOfAccount,
  RadixNetworkChecker,
  RadixWalletGenerator,
} from "@atlantis-l/radix-tool";
import {
  CSVTemplateModal,
  PrivateKeyModal,
  TxComfirmModal,
  ProgressModal,
} from "../../components";
import { formatNumber, selectXrdAddress, sleep } from "../../common";
import { message } from "ant-design-vue";
import store from "../../stores/store";
import { defineComponent } from "vue";
import Decimal from "decimal.js";
import Papa from "papaparse";

interface PreviewFee {
  order: number;
  fee: string;
}

let MAX_WALLET_PER_TX = 50;

export default defineComponent({
  components: {
    CSVTemplateModal,
    PrivateKeyModal,
    TxComfirmModal,
    ProgressModal,
  },
  data() {
    return {
      gutter: 10,
      feeLock: "",
      wallets: [],
      tokenType: 0,
      transferWay: 0,
      store: store(),
      tokenAmount: "",
      progressCount: 0,
      feeLockEstimate: "",
      maskClosable: false,
      feePayerXrdBalance: "",
      openSenderModal: false,
      progressStatus: "normal",
      openTemplateModal: false,
      openFeePayerModal: false,
      openTxConfirmModal: false,
      openProgressModal: false,
      commitStatusList: [] as number[],
      previewFeeList: [] as PreviewFee[],
      customOptions: [] as CustomOption[],
      senderWallet: undefined as Wallet | undefined,
      selectedToken: undefined as string | undefined,
      feePayerWallet: undefined as Wallet | undefined,
      networkChecker: new RadixNetworkChecker(store().networkId),
      walletGenerator: new RadixWalletGenerator(store().networkId),
      resourcesOfSender: undefined as ResourcesOfAccount | undefined,
    };
  },
  watch: {
    wallets() {
      this.previewFeeList = [];
    },
    tokenType(v) {
      this.previewFeeList = [];
      this.selectedToken = undefined;
      MAX_WALLET_PER_TX = v ? 36 : 50;
    },
    transferWay() {
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
    isCommitDone(flag: boolean) {
      if (flag) this.previewFeeList = [];
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
    "store.networkId"(id: number) {
      this.networkChecker.networkId = id;
      this.walletGenerator.networkId = id;
    },
  },
  computed: {
    tokenOptions() {
      //@ts-ignore
      const options = [];

      if (this.resourcesOfSender) {
        if (!this.tokenType) {
          this.resourcesOfSender.fungible.forEach((info) => {
            if (info.amount === "0") return;

            let tempLabel = info.name;

            if (info.symbol) tempLabel = info.symbol;

            if (!tempLabel)
              tempLabel = this.$t(
                `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
              );

            let label = `「 ${tempLabel} 」`;

            label += `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.balance`,
            )}: ${formatNumber(info.amount as string)} 」`;

            label += `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.address`,
            )}: ${info.resourceAddress} 」`;

            options.push({
              label,
              name: tempLabel,
              value: info.resourceAddress,
            });
          });
        } else {
          this.resourcesOfSender.nonFungible.forEach((info) => {
            if (info.ids?.length === 0) return;

            let tempLabel = info.name;

            if (info.symbol) tempLabel = info.symbol;

            if (!tempLabel)
              tempLabel = this.$t(
                `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
              );

            let label = `「 ${tempLabel} 」`;

            label += `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.balance`, //@ts-ignore
            )}: ${formatNumber(info.ids.length.toString())} 」`;

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
      if (!this.tokenType) {
        let addressField = this.$t(`View.WalletGenerate.script.address`);

        let amountText = this.$t(
          `View.TokenTransfer.SingleToMultiple.template.content.amount`,
        );

        if (this.wallets.length) {
          if (!this.wallets[0][addressField]) {
            const locale = this.$i18n.locale === "zh" ? "en" : "zh";

            amountText = this.$t(
              `View.TokenTransfer.SingleToMultiple.template.content.amount`,
              locale,
              [],
            );
          }
        }

        if (this.tokenAmount.length) {
          try {
            const singleAmount = new Decimal(this.tokenAmount);

            return singleAmount.mul(this.wallets.length);
          } catch (e) {
            return "0";
          }
        } else if (this.wallets.length && this.wallets[0][amountText]) {
          let amount = new Decimal(0);

          this.wallets.forEach((data) => {
            amount = amount.plus(data[amountText]);
          });

          return amount;
        } else {
          return "0";
        }
      } else {
        return this.wallets.length;
      }
    },
    amountPlaceholder() {
      let placeholder;

      if (this.selectedToken && this.selectedToken.length) {
        const token = this.resourcesOfSender?.fungible.find((token) => {
          return token.resourceAddress === this.selectedToken;
        });

        placeholder = formatNumber(token?.amount as string);
      } else {
        placeholder = this.$t(
          `View.TokenTransfer.SingleToMultiple.template.content.amountPlaceholder`,
        );
      }

      return placeholder;
    },
    feeLockPlaceholder() {
      return this.feeLockEstimate.length
        ? formatNumber(this.feeLockEstimate)
        : this.$t(
            `View.TokenTransfer.MultipleToMultiple.template.header.feeLock.placeholder`,
          );
    },
  },
  methods: {
    setSender(privateKey: string) {
      this.walletGenerator
        .generateWalletByPrivateKey(privateKey)
        .then(async (wallet) => {
          this.senderWallet = wallet;
          this.openSenderModal = false;

          this.getResourcesOfSender(wallet);
        })
        .catch((_e) => {
          message.error(
            `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.setSender.pkError`,
            )} 」`,
          );
        });
    },
    setFeePayer(privateKey: string) {
      this.walletGenerator
        .generateWalletByPrivateKey(privateKey)
        .then((wallet) => {
          this.feePayerWallet = wallet;
          this.openFeePayerModal = false;
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
      if (this.validateInputData()) {
        message.warn(
          `「 ${this.$t(
            `View.TokenTransfer.SingleToMultiple.template.header.dataNotValid`,
          )} 」`,
        );
        return;
      }
      this.validateTransferInfo();
      this.previewTransaction();
    },
    refreshXrdBalance() {
      this.feePayerAddress && this.getXrdBalance(this.feePayerAddress);
    },
    validateInputData() {
      let addressField = this.$t(`View.WalletGenerate.script.address`);

      let amountText = this.$t(
        `View.TokenTransfer.SingleToMultiple.template.content.amount`,
      );

      if (this.wallets.length) {
        if (!this.wallets[0][addressField]) {
          const locale = this.$i18n.locale === "zh" ? "en" : "zh";

          amountText = this.$t(
            `View.TokenTransfer.SingleToMultiple.template.content.amount`,
            locale,
            [],
          );
        }
      }

      if (!this.tokenType) {
        return (
          !this.feePayerWallet ||
          !this.wallets.length ||
          !this.senderWallet ||
          !this.selectedToken ||
          (!this.tokenAmount.length && !this.wallets[0][amountText])
        );
      } else {
        return (
          !this.feePayerWallet ||
          !this.wallets.length ||
          !this.senderWallet ||
          !this.selectedToken ||
          (this.transferWay === 0 && !this.wallets[0]["NFT ID"])
        );
      }
    },
    activateConfirmModal() {
      if (!this.customOptions.length || !this.isPreviewDone) {
        message.warning(
          `「 ${this.$t(
            `View.TokenTransfer.SingleToMultiple.script.noPreviewFee`,
          )} 」`,
        );
      } else if (!this.feeLock.length) {
        message.warn(
          `「 ${this.$t(
            `View.TokenTransfer.SingleToMultiple.template.header.dataNotValid`,
          )} 」`,
        );
      } else {
        this.openTxConfirmModal = true;
      }
    },
    validateTransferInfo() {
      let addressField = this.$t(`View.WalletGenerate.script.address`);

      let amountText = this.$t(
        `View.TokenTransfer.SingleToMultiple.template.content.amount`,
      );

      if (this.wallets.length) {
        if (!this.wallets[0][addressField]) {
          const locale = this.$i18n.locale === "zh" ? "en" : "zh";

          addressField = this.$t(
            `View.WalletGenerate.script.address`,
            locale,
            [],
          );

          amountText = this.$t(
            `View.TokenTransfer.SingleToMultiple.template.content.amount`,
            locale,
            [],
          );
        }
      }

      const fromPrivateKey = this.senderWallet?.privateKeyHexString();

      if (!this.tokenType) {
        //@ts-ignore
        this.customOptions = this.wallets.map((data) => {
          return {
            fromPrivateKey,
            toAddress: data[addressField],
            transferInfos: [
              {
                tokenType: TokenType.FUNGIBLE,
                tokenAddress: this.selectedToken,
                amount: this.tokenAmount.length
                  ? this.tokenAmount
                  : data[amountText],
              } as TransferInfo,
            ],
          };
        });
      } else {
        const getRandomIds = () => {
          const info = this.resourcesOfSender?.nonFungible.find((r) => {
            return r.resourceAddress === this.selectedToken;
          });

          if (!info) return;
          const ids = info.ids;

          if (!ids) return;

          const getRandomInt = (min: number, max: number) => {
            return Math.floor(Math.random() * (max - min + 1) + min);
          };

          const shuffle = (arr: string[]) => {
            let _arr = arr.slice();
            for (let i = 0; i < _arr.length; i++) {
              let j = getRandomInt(0, i);
              let t = _arr[i];
              _arr[i] = _arr[j];
              _arr[j] = t;
            }
            return _arr;
          };

          return shuffle(ids);
        };

        let randomIds: string[];

        if (this.transferWay) {
          randomIds = getRandomIds() as string[];
        }

        //@ts-ignore
        this.customOptions = this.wallets.map((data) => {
          return {
            fromPrivateKey,
            toAddress: data[addressField],
            transferInfos: [
              {
                tokenType: TokenType.NONFUNGIBLE,
                tokenAddress: this.selectedToken,
                nonFungibleLocalIds: this.transferWay
                  ? [randomIds.pop()]
                  : [data["NFT ID"]],
              } as TransferInfo,
            ],
          };
        });
      }
    },
    async sendTransaction(txMessage: string) {
      this.progressCount = 0;
      this.maskClosable = false;
      this.commitStatusList = [];
      this.progressStatus = "normal";
      this.openTxConfirmModal = false;

      setTimeout(() => {
        this.openProgressModal = true;
      }, 500);

      const key = "sendTransaction";

      message.loading({
        key,
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.sendTransaction.loading`,
        )} 」`,
      });

      let currentEpoch = await getCurrentEpoch(this.store.networkId);

      let startTime = Date.now();

      const feePayerPrivateKey = this.feePayerWallet?.privateKeyHexString();

      for (let i = 0; ; i++) {
        const start = i * MAX_WALLET_PER_TX;

        let end = i * MAX_WALLET_PER_TX + MAX_WALLET_PER_TX;

        end = end > this.customOptions.length ? this.customOptions.length : end;

        const options = this.customOptions.slice(start, end);

        await sleep(i, 10, 4000);

        const nowTime = Date.now();

        if (startTime + 1000 * 60 * 5 < nowTime) {
          startTime = nowTime;
          currentEpoch = await getCurrentEpoch(this.store.networkId);
        }

        this.store.worker.postMessage({
          action: "SingleToMultiple.sendCustom",
          args: [
            txMessage,
            currentEpoch,
            this.store.networkId,
            JSON.stringify(options),
            feePayerPrivateKey,
            this.feePercentList[i].mul(this.feeLock).toNumber().toFixed(18),
          ],
        });

        this.progressCount++;

        if (end === this.customOptions.length) break;
      }
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

          this.previewFeeList = [];
        } else {
          message.success({
            content: `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.success`,
            )} 」`,
            key,
          });

          let totalFee = new Decimal(0);

          feeList.forEach((fee) => {
            totalFee = totalFee.plus(fee);
          });

          this.feeLockEstimate = formatNumber(totalFee.toString());
          this.feeLock = "";
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

      let currentEpoch = await getCurrentEpoch(this.store.networkId);

      let startTime = Date.now();

      const feePayerPrivateKey = this.feePayerWallet?.privateKeyHexString();

      for (let i = 0; ; i++) {
        const start = i * MAX_WALLET_PER_TX;

        let end = i * MAX_WALLET_PER_TX + MAX_WALLET_PER_TX;

        end = end > this.customOptions.length ? this.customOptions.length : end;

        const options = this.customOptions.slice(start, end);

        await sleep(i, 50, 1000);

        const nowTime = Date.now();

        if (startTime + 1000 * 60 * 5 < nowTime) {
          startTime = nowTime;
          currentEpoch = await getCurrentEpoch(this.store.networkId);
        }

        this.store.worker.postMessage({
          action: "SingleToMultiple.sendCustomPreview",
          args: [
            i,
            currentEpoch,
            this.store.networkId,
            JSON.stringify(options),
            feePayerPrivateKey,
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
          this.maskClosable = true;
          message.success({
            key,
            content: `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.checkTx.success`,
            )} 」`,
          });
          this.refreshXrdBalance();
          this.getResourcesOfSender(this.senderWallet as Wallet);
          return;
        }

        if (
          txResult.transaction.transaction_status !== TransactionStatus.Pending
        ) {
          this.progressCount++;
          this.progressStatus = "exception";
          this.maskClosable = true;
          console.error(txResult.transaction.error_message);
          message.error({
            key,
            content: `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.checkTx.error`,
            )} 」`,
          });
          this.refreshXrdBalance();
          this.getResourcesOfSender(this.senderWallet as Wallet);
          return;
        }
      } catch (_e) {}

      setTimeout(() => {
        this.checkTx(txId);
      }, 4000);
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
          const feePayerXrd = (
            resourcesOfAccounts.pop() as ResourcesOfAccount
          ).fungible.find((resource) => {
            const xrdAddress = selectXrdAddress(this.store.networkId);
            return resource.resourceAddress === xrdAddress;
          });
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
    uploadCallback({ file }: { file: File }) {
      //@ts-ignore
      Papa.parse(file, {
        skipEmptyLines: "greedy",
        header: true,
        complete: (file) => {
          //@ts-ignore
          this.wallets = file.data;
        },
      });
    },
    async getResourcesOfSender(wallet: Wallet) {
      const key = "loadSender";

      message.loading({
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.setSender.loading`,
        )} 」`,
        key,
      });

      try {
        this.resourcesOfSender = (
          await this.networkChecker.checkResourcesOfAccounts([wallet.address])
        )[0];

        message.success({
          content: `「 ${this.$t(
            `View.TokenTransfer.MultipleToMultiple.script.methods.setSender.success`,
          )} 」`,
          key,
        });

        this.selectedToken = undefined;
      } catch (_e) {
        message.error({
          content: `「 ${this.$t(
            `View.TokenTransfer.MultipleToMultiple.script.methods.setSender.error`,
          )} 」`,
          key,
        });
      }
    },
    copy(text: string) {
      navigator.clipboard.writeText(text).then(() => {
        message.success({
          content: `「 ${this.$t("View.HistoryCheck.script.copied")} 」`,
          key: "copy",
        });
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

      if (action.executor === "SingleToMultiple") {
        switch (action.method) {
          case "addPreviewFee":
            this.addPreviewFee(msg.data);
            break;
          case "addCommitStatus":
            this.addCommitStatus(msg.data);
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
  transition: all 0.4s ease;
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
