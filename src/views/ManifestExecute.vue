<template>
  <a-layout class="view-layout">
    <!------------------------ Modal Group ------------------------>
    <div id="modal-group">
      <a-modal
        centered
        destroyOnClose
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
          @keyup.enter="setFeePayer"
          ref="feePayerWalletPrivateKey"
          v-model:value.trim="feePayerWalletPrivateKey"
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
        destroyOnClose
        @ok="processTransaction"
        v-model:open="openConfirmTransaction"
        :title="
          $t(
            `View.TokenTransfer.MultipleToMultiple.template.confirmTransactionModal.title`,
          )
        "
      >
        <a-textarea
          allowClear
          ref="transactionMessage"
          v-model:value.trim="transactionMessage"
          @keyup.ctrl.enter="processTransaction"
          style="margin: 12px 0 8px 0"
          :autoSize="{ minRows: 10, maxRows: 10 }"
          :placeholder="
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.confirmTransactionModal.placeholder`,
            )
          "
        />
      </a-modal>
      <a-modal
        centered
        destroyOnClose
        :footer="null"
        v-model:open="openTemplateModal"
      >
        {{ $t(`View.WalletGenerate.script.address`) }},{{
          $t(`View.WalletGenerate.script.privateKey`)
        }}[,......]({{
          $t("View.TokenTransfer.SingleToMultiple.template.optional")
        }})<br />
        account_xxxxxx,xxxxxx[,......]({{
          $t("View.TokenTransfer.SingleToMultiple.template.optional")
        }})<br />
        account_xxxxxx,xxxxxx[,......]({{
          $t("View.TokenTransfer.SingleToMultiple.template.optional")
        }})<br />
        account_xxxxxx,xxxxxx[,......]({{
          $t("View.TokenTransfer.SingleToMultiple.template.optional")
        }})<br />
        account_xxxxxx,xxxxxx[,......]({{
          $t("View.TokenTransfer.SingleToMultiple.template.optional")
        }})<br />
        account_xxxxxx,xxxxxx[,......]({{
          $t("View.TokenTransfer.SingleToMultiple.template.optional")
        }})<br />[......]
      </a-modal>
    </div>
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

    <!------------------------ Content ------------------------>
    <a-layout-content class="view-layout-content">
      <a-textarea autoSize readonly :value="feeLockCode" />

      <a-textarea
        allowClear
        v-model:value="manifestText"
        style="flex: 1; margin-top: 20px"
        :placeholder="
          $t('View.ManifestExecute.template.content.textarea.placeholder')
        "
      />
    </a-layout-content>
    <!------------------------ Content ------------------------>
  </a-layout>
</template>

<script lang="ts">
import {
  CustomManifestExecutor,
  getCurrentEpoch,
  Instruction,
  Instructions,
  PrivateKey,
  PublicKey,
  RadixEngineToolkit,
  RadixNetworkChecker,
  RadixWalletGenerator,
  ResourcesOfAccount,
  Status,
  TransactionStatus,
  Wallet,
} from "@atlantis-l/radix-tool";
import { CreateIcon, formatNumber, selectXrdAddress } from "../common";
import { message } from "ant-design-vue";
import { defineComponent } from "vue";
import store from "../stores/store";
import Papa from "papaparse";

const MAX_DIFF_SENDER_AMOUNT = 16;

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
      manifestText: "",
      feeLockEstimate: "",
      isPreviewDone: false,
      feePayerXrdBalance: "",
      transactionMessage: "",
      openTemplateModal: false,
      openFeePayerModal: false,
      feePayerWalletPrivateKey: "",
      openConfirmTransaction: false,
      privateKeyList: [] as PrivateKey[],
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
    },
    feePayerAddress() {
      this.isPreviewDone = false;
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
      this.manifestExecutor.networkId = id;
    },
  },
  computed: {
    feeLockCode() {
      return this.$t("View.ManifestExecute.script.feeLockCode", [
        this.feePayerAddress ? this.feePayerAddress : "",
        this.feeLock.length ? this.feeLock : "0",
      ]);
    },
    feePayerAddress() {
      return this.feePayerWallet ? this.feePayerWallet.address : undefined;
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
    setFeePayer() {
      this.walletGenerator
        .generateWalletByPrivateKey(this.feePayerWalletPrivateKey)
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
        this.focusInput = "transactionMessage";
        this.openConfirmTransaction = true;
      }
    },
    async sendTransaction() {
      this.isPreviewDone = false;
      const key = "sendTransaction";

      this.manifestExecutor.executorWallet = this.feePayerWallet as Wallet;

      message.loading({
        key,
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.sendTransaction.loading`,
        )} 」`,
      });

      const txMessage = this.transactionMessage;

      const manifestStr = `${this.feeLockCode}\n${this.manifestText}`;

      const result = await this.manifestExecutor.execute(
        manifestStr,
        this.privateKeyList,
        txMessage.length ? txMessage : undefined,
        await getCurrentEpoch(this.store.networkId),
      );

      if (result.status === Status.FAIL) {
        message.error({
          content: `「 ${this.$t(
            `View.TokenTransfer.MultipleToMultiple.script.methods.sendTransaction.error`,
          )} 」`,
          key,
        });
      } else if (result.status === Status.DUPLICATE_TX) {
        message.warning({
          content: `「 ${this.$t(
            `View.TokenTransfer.MultipleToMultiple.script.methods.sendTransaction.warning`,
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

        this.checkTx(result.transactionId as string);
      }
    },
    activateFeePayerModal() {
      const wallet = this.feePayerWallet;
      if (wallet) this.feePayerWalletPrivateKey = wallet.privateKeyHexString();
      this.focusInput = "feePayerWalletPrivateKey";
      this.openFeePayerModal = true;
    },
    async previewTransaction() {
      let parsedManifest: Instructions | undefined;

      try {
        parsedManifest = await RadixEngineToolkit.Instructions.convert(
          {
            kind: "String",
            value: this.manifestText,
          },
          this.store.networkId,
          "Parsed",
        );

        this.manifestText = (
          await RadixEngineToolkit.Instructions.convert(
            this.removeFeeLockCode(parsedManifest.value as Instruction[]),
            this.store.networkId,
            "String",
          )
        ).value as string;
      } catch (e) {
        console.error((e as Error).message);
        message.error({
          content: `「 ${this.$t(
            "View.ManifestExecute.script.manifestParsedFailed",
          )} 」`,
          key: "manifestParsedFailed",
        });
        return;
      }

      const set = new Set<string>();

      if (parsedManifest) {
        (parsedManifest.value as Instruction[]).forEach((instruction) => {
          if (
            instruction.kind === "CallMethod" &&
            (instruction.address.value as string).startsWith("account") &&
            !instruction.methodName.startsWith("try")
          ) {
            set.add(instruction.address.value as string);
          }
        });
      }

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
          key: "needImportWalletFile",
        });
        return;
      }

      const addressList = [...set.values()];

      const pubKeyList = [] as PublicKey[];

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

      this.privateKeyList = [];

      for (let i = 0; i < addressList.length; i++) {
        const walletData = this.wallets.find((data) => {
          return addressList[i] === data[addressField];
        }) as unknown as object;

        //@ts-ignore
        const pk = walletData[privateKeyField] as string;

        const wallet =
          await this.walletGenerator.generateWalletByPrivateKey(pk);

        this.privateKeyList.push(wallet.privateKey);

        pubKeyList.push(wallet.publicKey);
      }

      this.manifestExecutor.executorWallet = this.feePayerWallet as Wallet;

      const key = "previewTransaction";

      message.loading({
        key,
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.loading`,
        )} 」`,
      });

      const manifestStr = `${this.feeLockCode}\n${this.manifestText}`;

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
    async processTransaction() {
      this.openConfirmTransaction = false;

      this.sendTransaction();
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
          this.transactionMessage = "";
          this.refreshXrdBalance();
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
    async uploadManifest({ file }: { file: File }) {
      try {
        const parsedManifest = await RadixEngineToolkit.Instructions.convert(
          {
            kind: "String",
            value: await file.text(),
          },
          this.store.networkId,
          "Parsed",
        );

        this.manifestText = (
          await RadixEngineToolkit.Instructions.convert(
            this.removeFeeLockCode(parsedManifest.value as Instruction[]),
            this.store.networkId,
            "String",
          )
        ).value as string;
      } catch (e) {
        console.error((e as Error).message);
        message.error({
          content: `「 ${this.$t(
            "View.ManifestExecute.script.manifestParsedFailed",
          )} 」`,
          key: "manifestParsedFailed",
        });
      }
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
