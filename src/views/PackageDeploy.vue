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
      <a-modal centered :footer="null" v-model:open="openResourceModal">
        <template #title v-if="selectedValue === 1"
          >{{ $t("View.PackageDeploy.template.header.select.1") }}
        </template>

        <template #title v-if="selectedValue === 2"
          >{{ $t("View.PackageDeploy.template.header.select.2") }}
        </template>

        <a-row :class="selectedValue === 1 ? 'no-margin-row' : ''">
          <a-col flex="1">
            <a-input
              allowClear
              ref="resourceAddress"
              class="view-max-width"
              v-model:value="resourceAddress"
              @pressEnter="openResourceModal = false"
              :addonBefore="
                $t('View.HistoryCheck.template.header.input.addonBefore')
              "
              :placeholder="
                $t('View.PackageDeploy.template.modal.resourceAddress')
              "
            ></a-input>
          </a-col>
        </a-row>

        <a-row class="no-margin-row" v-if="selectedValue === 2">
          <a-col flex="1">
            <a-input
              allowClear
              addonBefore="NFT ID"
              placeholder="NFT ID"
              v-model:value="nftId"
              class="view-max-width"
              @pressEnter="openResourceModal = false"
            ></a-input>
          </a-col>
        </a-row>
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

      <a-col span="6">
        <a-select
          :disabled="!assignOwner"
          class="view-max-width"
          :options="ownerOptions"
          @select="
            (v: number) => {
              if (v === 1 || v === 2) {
                focusInput = 'resourceAddress';
                openResourceModal = true;
              }
            }
          "
          v-model:value="selectedValue"
        >
          <template #option="{ value, label }">
            <a-tooltip placement="left">
              <template #title v-if="value === 1"
                >{{ $t("View.PackageDeploy.template.header.select.tooltip.1") }}
              </template>
              <template #title v-if="value === 2"
                >{{ $t("View.PackageDeploy.template.header.select.tooltip.2") }}
              </template>
              <span>{{ label }}</span>
            </a-tooltip>
          </template>
        </a-select>
      </a-col>

      <a-col span="1" style="padding-top: 5px; text-align: end">
        <a-tooltip placement="bottom">
          <template #title>{{
            $t("View.PackageDeploy.template.header.lock")
          }}</template>

          <a-checkbox
            v-model:checked="lock"
            :disabled="!assignOwner || selectedValue === 3"
          ></a-checkbox>
        </a-tooltip>
      </a-col>

      <a-col span="2" style="text-align: center; padding-top: 4px">
        <a-tooltip placement="bottom">
          <template #title
            >{{ $t("View.PackageDeploy.template.header.switch.text") }}
          </template>
          <a-switch v-model:checked="assignOwner">
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
      >「 {{ $t("View.PackageDeploy.template.divider.text") }} 」</a-divider
    >

    <!------------------------ Content ------------------------>
    <a-layout-content class="view-layout-content">
      <a-row :gutter="gutter">
        <a-col span="12" class="view-no-padding-left">
          <a-upload-dragger name="file" :customRequest="uploadWasm">
            <p class="ant-upload-drag-icon" style="font-size: 48px">
              <CreateIcon icon="InboxOutlined" />
              WASM
            </p>
            <p class="ant-upload-text">
              <a-tag color="blue" style="font-size: 14px">{{
                wasmFileText
              }}</a-tag>
            </p>
          </a-upload-dragger>
        </a-col>

        <a-col span="12" class="view-no-padding-right">
          <a-upload-dragger name="file" :customRequest="uploadRpd">
            <p class="ant-upload-drag-icon" style="font-size: 48px">
              <CreateIcon icon="InboxOutlined" />
              RPD
            </p>
            <p class="ant-upload-text">
              <a-tag color="blue" style="font-size: 14px">{{
                rpdFileText
              }}</a-tag>
            </p>
          </a-upload-dragger>
        </a-col>
      </a-row>

      <a-row>
        <a-col>
          <a-statistic :title="$t('View.PackageDeploy.template.content.owner')">
            <template #formatter v-if="!assignOwner">
              <a-tag color="purple"
                >{{ $t("View.PackageDeploy.template.content.deployer") }}
              </a-tag>
            </template>
            <template #formatter v-else-if="selectedValue === 0">
              <a-tag color="purple"
                >{{ $t("View.PackageDeploy.template.header.select.0") }}
              </a-tag>
              <a-tag v-if="!lock" color="green">{{
                $t("View.PackageDeploy.template.content.canBeChanged")
              }}</a-tag>
              <a-tag v-else color="red">{{
                $t("View.PackageDeploy.template.content.cannotBeChanged")
              }}</a-tag>
            </template>
            <template #formatter v-else-if="selectedValue === 1">
              <a-tag color="purple"
                >{{ $t("View.PackageDeploy.template.content.resourceOwner") }}
              </a-tag>
              <a-tag v-if="!lock" color="green">{{
                $t("View.PackageDeploy.template.content.canBeChanged")
              }}</a-tag>
              <a-tag v-else color="red">{{
                $t("View.PackageDeploy.template.content.cannotBeChanged")
              }}</a-tag>
              <br />
              <a-tag v-if="resourceAddress.trim().length"
                >{{ resourceAddress }}
              </a-tag>
            </template>
            <template #formatter v-else-if="selectedValue === 2">
              <a-tag color="purple"
                >{{ $t("View.PackageDeploy.template.content.nftOwner") }}
              </a-tag>
              <a-tag v-if="!lock" color="green">{{
                $t("View.PackageDeploy.template.content.canBeChanged")
              }}</a-tag>
              <a-tag v-else color="red">{{
                $t("View.PackageDeploy.template.content.cannotBeChanged")
              }}</a-tag>
              <br />
              <a-tag v-if="resourceAddress.trim().length"
                >{{ resourceAddress }}
              </a-tag>
              <br />
              <a-tag v-if="nftId.trim().length">{{ nftId }} </a-tag>
            </template>
            <template #formatter v-else-if="selectedValue === 3">
              <a-tag color="purple"
                >{{ $t("View.PackageDeploy.template.header.select.3") }}
              </a-tag>
            </template>
          </a-statistic>
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
  Result,
  PreviewResult,
  getCurrentEpoch,
  PackageDeployer,
  TransactionStatus,
  ResourcesOfAccount,
  RadixNetworkChecker,
  RadixWalletGenerator,
} from "@atlantis-l/radix-tool";
import { CreateIcon, formatNumber, selectXrdAddress } from "../common";
import { message } from "ant-design-vue";
import { defineComponent } from "vue";
import store from "../stores/store";

export default defineComponent({
  components: {
    CreateIcon,
  },
  data() {
    return {
      nftId: "",
      gutter: 10,
      feeLock: "",
      lock: false,
      store: store(),
      focusInput: "",
      rpdFilename: "",
      wasmFilename: "",
      selectedValue: 0,
      assignOwner: false,
      resourceAddress: "",
      feeLockEstimate: "",
      isPreviewDone: false,
      feePayerXrdBalance: "",
      transactionMessage: "",
      openFeePayerModal: false,
      openResourceModal: false,
      feePayerWalletPrivateKey: "",
      openConfirmTransaction: false,
      rpd: undefined as Uint8Array | undefined,
      wasm: undefined as Uint8Array | undefined,
      feePayerWallet: undefined as Wallet | undefined,
      networkChecker: new RadixNetworkChecker(store().networkId),
      walletGenerator: new RadixWalletGenerator(store().networkId),
      packageDeployer: new PackageDeployer(
        store().networkId, //@ts-ignore
        undefined,
      ),
    };
  },
  watch: {
    rpd() {
      this.isPreviewDone = false;
    },
    wasm() {
      this.isPreviewDone = false;
    },
    lock() {
      this.isPreviewDone = false;
    },
    nftId() {
      this.isPreviewDone = false;

      if (this.nftId.includes(":")) {
        this.nftId = this.nftId.split(":")[1];
      }
    },
    assignOwner() {
      this.isPreviewDone = false;
    },
    resourceAddress() {
      this.isPreviewDone = false;
      if (this.resourceAddress.includes(":")) {
        this.resourceAddress = this.resourceAddress.split(":")[0];
      }
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
    selectedValue(value: number) {
      this.isPreviewDone = false;

      if (value === 3) {
        this.lock = true;
      } else {
        this.lock = false;
      }
    },
    "store.networkId"(id: number) {
      this.networkChecker.networkId = id;
      this.walletGenerator.networkId = id;
      this.packageDeployer.networkId = id;
    },
  },
  computed: {
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
    rpdFileText() {
      return this.rpdFilename.length
        ? this.rpdFilename
        : this.$t("View.PackageDeploy.template.content.uploadRpd");
    },
    wasmFileText() {
      return this.wasmFilename.length
        ? this.wasmFilename
        : this.$t("View.PackageDeploy.template.content.uploadWasm");
    },
    ownerOptions() {
      return [
        {
          label: this.$t("View.PackageDeploy.template.header.select.0"),
          value: 0,
        },
        {
          label: this.$t("View.PackageDeploy.template.header.select.1"),
          value: 1,
        },
        {
          label: this.$t("View.PackageDeploy.template.header.select.2"),
          value: 2,
        },
        {
          label: this.$t("View.PackageDeploy.template.header.select.3"),
          value: 3,
        },
      ];
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
      if (!this.feePayerAddress || !this.wasm || !this.rpd) {
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
    async sendTransaction() {
      this.isPreviewDone = false;
      const key = "sendTransaction";

      message.loading({
        key,
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.sendTransaction.loading`,
        )} 」`,
      });

      this.packageDeployer.feeLock = this.feeLock;

      const txMessage = this.transactionMessage.trim();

      let result: Result | undefined;

      const currentEpoch = await getCurrentEpoch(this.store.networkId);

      const wasm = this.wasm as Uint8Array;
      const rpd = this.rpd as Uint8Array;

      if (!this.assignOwner) {
        result = await this.packageDeployer.deploy(
          wasm,
          rpd,
          txMessage.length ? txMessage : undefined,
          currentEpoch,
        );
      } else {
        result = await this.packageDeployer.deployWithOwner(
          wasm,
          rpd,
          this.selectedValue,
          this.selectedValue === 2
            ? `${this.resourceAddress}:${this.nftId}`
            : this.resourceAddress,
          this.lock,
          txMessage.length ? txMessage : undefined,
          currentEpoch,
        );
      }

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
      this.packageDeployer.deployerWallet = this.feePayerWallet as Wallet;
      this.packageDeployer.feePayerWallet = this.feePayerWallet as Wallet;

      const key = "previewTransaction";

      message.loading({
        key,
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.loading`,
        )} 」`,
      });

      try {
        let result: PreviewResult | undefined;

        const currentEpoch = await getCurrentEpoch(this.store.networkId);

        const wasm = this.wasm as Uint8Array;
        const rpd = this.rpd as Uint8Array;

        if (!this.assignOwner) {
          result = await this.packageDeployer.deployPreview(
            wasm,
            rpd,
            currentEpoch,
          );
        } else {
          result = await this.packageDeployer.deployWithOwnerPreview(
            wasm,
            rpd,
            this.selectedValue,
            this.selectedValue === 2
              ? `${this.resourceAddress}:${this.nftId}`
              : this.resourceAddress,
            this.lock,
            currentEpoch,
          );
        }

        if (result && result.errorMessage) {
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

      const result = await this.previewTransaction();

      if (!result) return;

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
    async uploadWasm(data: { file: File }) {
      if (!data.file.name.toLowerCase().endsWith(".wasm")) {
        message.error({
          content: `「 ${this.$t("View.PackageDeploy.script.fileError")} 」`,
          key: "uploadError",
        });
        return;
      }

      this.wasmFilename = data.file.name;

      const radixTool = this.store.radixTool as RadixTool;

      //@ts-ignore
      this.wasm = await radixTool.getFileBuffer(data.file.path);
    },
    async uploadRpd(data: { file: File }) {
      if (!data.file.name.toLowerCase().endsWith(".rpd")) {
        message.error({
          content: `「 ${this.$t("View.PackageDeploy.script.fileError")} 」`,
          key: "uploadError",
        });
        return;
      }

      this.rpdFilename = data.file.name;

      const radixTool = this.store.radixTool as RadixTool;

      //@ts-ignore
      this.rpd = await radixTool.getFileBuffer(data.file.path);
    },
  },
});
</script>

<style scoped>
.ant-layout {
  background-color: #ffffff !important;
}

.ant-statistic .ant-tag {
  font-size: 18px !important;
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
