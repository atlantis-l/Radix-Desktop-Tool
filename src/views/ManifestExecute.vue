<template>
  <a-layout class="view-layout" style="position: relative">
    <!------------------------ Modal Group ------------------------>
    <PrivateKeyModal
      :title="
        $t(`View.TokenTransfer.MultipleToMultiple.template.feePayerModal.title`)
      "
      :wallet="feePayerWallet"
      :open="openFeePayerModal"
      @close="openFeePayerModal = false"
      @action="setFeePayer"
    />

    <TxComfirmModal
      :open="openTxConfirmModal"
      @close="openTxConfirmModal = false"
      @sendTx="sendTransaction"
    />

    <ProgressModal
      :open="openProgressModal"
      :closable="maskClosable"
      :status="progressStatus"
      :percent="progressPercent"
      @close="openProgressModal = false"
    />

    <CSVTemplateModal
      view="ManifestExecute"
      :open="openTemplateModal"
      @close="openTemplateModal = false"
    />

    <CSVTemplateModal
      view="ManifestExecuteFieldCSV"
      :open="openNftIdTemplateModal"
      @close="openNftIdTemplateModal = false"
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

          <a-upload name="file" :maxCount="1" :customRequest="uploadWallet">
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

      <a-col flex="1">
        <a-upload name="file" :maxCount="1" :customRequest="uploadManifest">
          <a-button
            class="view-max-width custom-btn"
            :text="$t('View.ManifestExecute.template.header.importManifest')"
            >{{ $t("View.ManifestExecute.template.header.importManifest") }}
          </a-button>
        </a-upload>
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
      >「 {{ $t("View.ManifestExecute.template.divider.text") }} 」
    </a-divider>

    <a-tooltip placement="bottom" color="white">
      <template #title>
        <a-button
          @click="openNftIdTemplateModal = true"
          class="view-max-width custom-btn"
          :text="
            $t(
              'View.TokenTransfer.SingleToMultiple.template.header.fieldTemplate',
            )
          "
          >{{
            $t(
              "View.TokenTransfer.SingleToMultiple.template.header.fieldTemplate",
            )
          }}
        </a-button>
      </template>

      <a-upload
        name="file"
        :maxCount="1"
        :customRequest="uplodaField"
        style="
          position: absolute;
          width: 130px;
          top: 205px;
          right: 290px;
          z-index: 999;
        "
      >
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

    <a-tooltip>
      <template #title>
        {{ $t("qing-dan-nei-rong-zai-dan-ci-shi-wu-zhong-de-zhong-fu-ci-shu") }}
      </template>

      <a-input-number
        style="
          position: absolute;
          width: 130px;
          top: 205px;
          right: 150px;
          z-index: 999;
        "
        :min="1"
        v-model:value="manifestContentTimes"
      >
        <template #addonBefore>
          <CreateIcon icon="BuildTwoTone" />
        </template>
      </a-input-number>
    </a-tooltip>

    <a-tooltip>
      <template #title>
        {{
          hasFields
            ? $t("xu-yao-zhi-hang-de-csv-hang-shu")
            : $t("View.ManifestExecute.template.executionTimes")
        }}
      </template>

      <a-input-number
        style="
          position: absolute;
          width: 130px;
          top: 205px;
          right: 10px;
          z-index: 999;
        "
        :min="1"
        v-model:value="executionTimes"
      >
        <template #addonBefore>
          <CreateIcon icon="ThunderboltTwoTone" />
        </template>
      </a-input-number>
    </a-tooltip>

    <!------------------------ Content ------------------------>
    <a-layout-content class="view-layout-content">
      <a-textarea autoSize readonly :value="feeLockCode" />

      <a-textarea
        allowClear
        class="manifest-execute"
        v-model:value="manifestText"
        style="flex: 1; margin-top: 20px"
        :placeholder="
          $t('View.ManifestExecute.template.content.textarea.placeholder', [
            `{${$t('View.ManifestExecute.template.content.textarea.fieldName')}}`,
          ])
        "
      />
    </a-layout-content>
    <!------------------------ Content ------------------------>
  </a-layout>
</template>

<script lang="ts">
import {
  Wallet,
  PublicKey,
  Instruction,
  Instructions,
  getCurrentEpoch,
  TransactionStatus,
  ResourcesOfAccount,
  RadixEngineToolkit,
  RadixNetworkChecker,
  RadixWalletGenerator,
  CustomManifestExecutor,
} from "@atlantis-l/radix-tool";
import {
  CSVTemplateModal,
  PrivateKeyModal,
  TxComfirmModal,
  ProgressModal,
} from "../components";
import { formatNumber, selectXrdAddress, CreateIcon, sleep } from "../common";
import { message } from "ant-design-vue";
import { defineComponent } from "vue";
import store from "../stores/store";
import Decimal from "decimal.js";
import Papa from "papaparse";

const MAX_DIFF_SENDER_AMOUNT = 16;

interface ManifestKindAndValue {
  kind: string;
  value: string;
}

export default defineComponent({
  components: {
    CSVTemplateModal,
    PrivateKeyModal,
    TxComfirmModal,
    ProgressModal,
    CreateIcon,
  },
  data() {
    return {
      gutter: 10,
      feeLock: "",
      wallets: [],
      store: store(),
      fieldData: [],
      manifestText: "",
      progressCount: 0,
      executionTimes: 1,
      feeLockEstimate: "",
      maskClosable: false,
      isPreviewDone: false,
      feePayerXrdBalance: "",
      manifestContentTimes: 1,
      progressStatus: "normal",
      openTemplateModal: false,
      openProgressModal: false,
      openFeePayerModal: false,
      openTxConfirmModal: false,
      fieldList: [] as string[],
      openNftIdTemplateModal: false,
      privateKeyList: [] as string[],
      commitStatusList: [] as number[],
      replaceValueList: [] as ManifestKindAndValue[],
      feePayerWallet: undefined as Wallet | undefined,
      networkChecker: new RadixNetworkChecker(store().networkId),
      walletGenerator: new RadixWalletGenerator(store().networkId),
      manifestExecutor: new CustomManifestExecutor(
        store().networkId, //@ts-ignore
        undefined,
      ),
    };
  },
  watch: {
    manifestText() {
      this.isPreviewDone = false;
      this.fieldData = [];
    },
    manifestContentTimes(v) {
      this.isPreviewDone = false;
      if (!v) this.manifestContentTimes = 1;
    },
    executionTimes(v) {
      if (!v) this.executionTimes = 1;
    },
    feePayerAddress() {
      this.isPreviewDone = false;
    },
    "store.networkId"(id: number) {
      this.networkChecker.networkId = id;
      this.walletGenerator.networkId = id;
      this.manifestExecutor.networkId = id;
    },
  },
  computed: {
    hasFields() {
      return /\$\{(.+?)\}/g.exec(this.manifestText);
    },
    feeLockCode() {
      return this.$t("View.ManifestExecute.script.feeLockCode", [
        this.feePayerAddress ? this.feePayerAddress : "",
        this.feeLock.length
          ? new Decimal(this.feeLock)
              .div(this.actulExecutionTimes)
              .toFixed(
                new Decimal(this.feeLock)
                  .div(this.actulExecutionTimes)
                  .toString().length > 18
                  ? 18
                  : new Decimal(this.feeLock)
                      .div(this.actulExecutionTimes)
                      .toString().length,
              )
          : "0",
      ]);
    },
    isCommitDone() {
      return this.commitStatusList.length === this.actulExecutionTimes;
    },
    progressPercent() {
      let totalCount = this.actulExecutionTimes * 2 + 1;

      return Math.floor(
        ((this.progressCount + this.commitStatusList.length) / totalCount) *
          100,
      );
    },
    feeLockPlaceholder() {
      return this.feeLockEstimate.length
        ? formatNumber(
            new Decimal(this.feeLockEstimate)
              .mul(this.actulExecutionTimes)
              .toString(),
          )
        : this.$t(
            `View.TokenTransfer.MultipleToMultiple.template.header.feeLock.placeholder`,
          );
    },
    actulExecutionTimes() {
      return this.hasFields
        ? Math.ceil(this.executionTimes / this.manifestContentTimes)
        : Math.floor(this.executionTimes);
    },
    feePayerAddress() {
      return this.feePayerWallet ? this.feePayerWallet.address : undefined;
    },
  },
  methods: {
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
    async estimateFee() {
      if (!this.feePayerAddress) {
        message.warn(
          `「 ${this.$t(
            `View.TokenTransfer.SingleToMultiple.template.header.dataNotValid`,
          )} 」`,
        );
        return;
      }

      const result = await this.previewTransaction();

      if (!result) return;

      this.isPreviewDone = true;
      this.feeLockEstimate = formatNumber(result.fee);
      this.feeLock = "";
    },
    refreshXrdBalance() {
      this.feePayerAddress && this.getXrdBalance(this.feePayerAddress);
    },
    activateConfirmModal() {
      if (!this.feePayerAddress) {
        message.warn(
          `「 ${this.$t(
            `View.TokenTransfer.SingleToMultiple.template.header.dataNotValid`,
          )} 」`,
        );
      } else if (!this.isPreviewDone) {
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
    async replaceAll(fieldData: object) {
      let text = this.manifestText;

      for (let i = 0; i < this.replaceValueList.length; i++) {
        const value = `${this.replaceValueList[i].kind}("${this.replaceValueList[i].value}")`;

        const replace = `${this.replaceValueList[i].kind}("${(
          await this.walletGenerator.generateNewWallet()
        ).privateKeyHexString()}")`;

        text = text.replaceAll(value, replace);
      }

      for (let i = 0; i < this.fieldList.length; i++) {
        const field = this.fieldList[i];

        const value = `\$\{${field}\}`;
        //@ts-ignore
        const replace = fieldData[field];

        text = text.replaceAll(value, replace);
      }

      return text;
    },
    async sendTransaction(txMessage: string) {
      this.progressCount = 0;
      this.maskClosable = false;
      this.commitStatusList = [];
      this.isPreviewDone = false;
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

      if (this.hasFields) {
        const csvData: object[] = JSON.parse(JSON.stringify(this.fieldData));

        let singleFee: Decimal | undefined = undefined;

        if (this.executionTimes > csvData.length) {
          singleFee = new Decimal(this.feeLock).div(
            Math.ceil(this.executionTimes / this.manifestContentTimes),
          );

          this.executionTimes = csvData.length;
        }

        const realExecutionTimes = Math.ceil(
          this.executionTimes / this.manifestContentTimes,
        );

        if (singleFee) {
          this.feeLock = singleFee.mul(realExecutionTimes).toString();
        }

        for (let i = 0; i < realExecutionTimes; i++) {
          let manifestStr = this.feeLockCode;

          let contentTimes = csvData.length;

          if (csvData.length > this.manifestContentTimes) {
            contentTimes = this.manifestContentTimes;
          }

          for (let j = 0; j < contentTimes; j++) {
            const data = csvData.reverse().pop();
            csvData.reverse();
            manifestStr += `\n${await this.replaceAll(data as object)}`;
          }

          await sleep(i, 10, 4000);

          const nowTime = Date.now();

          if (startTime + 1000 * 60 * 5 < nowTime) {
            startTime = nowTime;
            currentEpoch = await getCurrentEpoch(this.store.networkId);
          }

          this.store.worker.postMessage({
            action: "ManifestExecute.execute",
            args: [
              txMessage,
              manifestStr,
              currentEpoch,
              feePayerPrivateKey,
              JSON.stringify(this.privateKeyList),
              this.store.networkId,
            ],
          });

          this.progressCount++;
        }
      } else {
        let manifestStr = this.feeLockCode;

        for (let i = 0; i < this.manifestContentTimes; i++) {
          manifestStr += `\n${await this.replaceAll({})}`;
        }

        const executionTimes = Math.floor(this.executionTimes);

        for (let i = 0; i < executionTimes; i++) {
          await sleep(i, 10, 4000);

          const nowTime = Date.now();

          if (startTime + 1000 * 60 * 5 < nowTime) {
            startTime = nowTime;
            currentEpoch = await getCurrentEpoch(this.store.networkId);
          }

          this.store.worker.postMessage({
            action: "ManifestExecute.execute",
            args: [
              txMessage,
              manifestStr,
              currentEpoch,
              feePayerPrivateKey,
              JSON.stringify(this.privateKeyList),
              this.store.networkId,
            ],
          });

          this.progressCount++;
        }
      }

      this.fieldData = [];
    },
    async previewTransaction() {
      this.fieldList = [];
      this.replaceValueList = [];

      const key = "previewTransaction";

      message.loading({
        key,
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.loading`,
        )} 」`,
      });

      {
        const replaceKindList = [
          "Proof",
          "Bucket",
          "NamedAddress",
          "AddressReservation",
        ];

        for (let i = 0; i < replaceKindList.length; i++) {
          let reg_g = new RegExp(`${replaceKindList[i]}\\("(.+?)"\\)`, "g");

          //@ts-ignore
          let result = undefined;

          do {
            result = reg_g.exec(this.manifestText);

            if (result) {
              const pushed = this.replaceValueList.find((v) => {
                //@ts-ignore
                return v.kind === replaceKindList[i] && v.value === result[1];
              });

              !pushed &&
                this.replaceValueList.push({
                  kind: replaceKindList[i],
                  value: result[1],
                });
            }
          } while (result);
        }

        const reg_g = /\$\{(.+?)\}/g;

        let result = undefined;

        do {
          result = reg_g.exec(this.manifestText);
          result &&
            !this.fieldList.includes(result[1]) &&
            this.fieldList.push(result[1]);
        } while (result);

        if (this.fieldList.length) {
          if (!this.fieldData.length) {
            message.warn({
              key,
              content: `「 ${this.$t("xu-dao-ru-csv-wen-jian")} 」`,
            });
            return;
          } else {
            for (let i = 0; i < this.fieldList.length; i++) {
              if (!this.fieldData[0][this.fieldList[i]]) {
                message.warn({
                  key,
                  content: `「 ${this.$t("csv-wen-jian-que-shao-zi-duan")} \`${this.fieldList[i]}\` 」`,
                });
                return;
              }
            }
          }
        }
      }

      let manifestStr = this.feeLockCode;

      for (let i = 0; i < this.manifestContentTimes; i++) {
        manifestStr += `\n${await this.replaceAll(this.fieldData[i])}`;
      }

      let parsed: Instructions | undefined;

      try {
        parsed = await RadixEngineToolkit.Instructions.convert(
          {
            kind: "String",
            value: manifestStr,
          },
          this.store.networkId,
          "Parsed",
        );
      } catch (e) {
        console.error((e as Error).message);
        message.error({
          content: `「 ${this.$t(
            "View.ManifestExecute.script.manifestParsedFailed",
          )} 」`,
          key,
        });
        return;
      }

      if (!parsed) return;

      const set = new Set<string>();

      (parsed.value as Instruction[]).forEach((instruction) => {
        if (
          instruction.kind === "CallMethod" &&
          (instruction.address.value as string).startsWith("account") &&
          !instruction.methodName.startsWith("try")
        ) {
          set.add(instruction.address.value as string);
        }
      });

      set.delete(this.feePayerAddress as string);

      if (set.size > MAX_DIFF_SENDER_AMOUNT) {
        message.warning({
          content: `「 ${this.$t(
            `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.exceed`,
          )}: ${MAX_DIFF_SENDER_AMOUNT} 」`,
        });

        return;
      }

      if (set.size && !this.wallets.length) {
        message.warning({
          content: `「 ${this.$t(
            "View.ManifestExecute.script.needImportWalletFile",
          )} 」`,
          key,
        });
        return;
      }

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

      const addressList = [...set.values()];

      const pubKeyList = [] as PublicKey[];

      this.privateKeyList = [];

      for (let i = 0; i < addressList.length; i++) {
        const walletData = this.wallets.find((data) => {
          return addressList[i] === data[addressField];
        }) as unknown as object;

        //@ts-ignore
        const pk = walletData[privateKeyField] as string;

        const wallet =
          await this.walletGenerator.generateWalletByPrivateKey(pk);

        this.privateKeyList.push(wallet.privateKeyHexString());

        pubKeyList.push(wallet.publicKey);
      }

      this.manifestExecutor.executorWallet = this.feePayerWallet as Wallet;

      try {
        const result = await this.manifestExecutor.executePreview(
          manifestStr,
          pubKeyList,
          await getCurrentEpoch(this.store.networkId),
        );

        if (result.errorMessage) {
          console.error(result.errorMessage);
          message.error({
            content: `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.error`,
            )} 」`,
            key,
          });
          return;
        }

        message.success({
          content: `「 ${this.$t(
            `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.success`,
          )} 」`,
          key,
        });

        return result;
      } catch (e) {
        console.error((e as Error).message);
        message.error({
          content: `「 ${this.$t(
            `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.error`,
          )} 」`,
          key,
        });
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
    uploadWallet({ file }: { file: File }) {
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
    uplodaField({ file }: { file: File }) {
      //@ts-ignore
      Papa.parse(file, {
        skipEmptyLines: "greedy",
        header: true,
        complete: (file) => {
          //@ts-ignore
          this.fieldData = file.data;
          this.executionTimes = this.fieldData.length;
        },
      });
    },
    async uploadManifest({ file }: { file: File }) {
      this.manifestText = await file.text();
    },
    removeFeeLockCode(parsedManifest: Instruction[]) {
      const feeLockIndex = parsedManifest.findIndex((instruction) => {
        return (
          instruction.kind === "CallMethod" &&
          instruction.methodName === "lock_fee"
        );
      });

      if (feeLockIndex > -1) {
        parsedManifest.splice(feeLockIndex, 1);
      }

      return {
        kind: "Parsed",
        value: parsedManifest,
      } as Instructions;
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

      if (action.executor === "ManifestExecute") {
        switch (action.method) {
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
  display: flex !important;
  flex-direction: column !important;
}

.view-layout-content::-webkit-scrollbar {
  display: none !important;
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
