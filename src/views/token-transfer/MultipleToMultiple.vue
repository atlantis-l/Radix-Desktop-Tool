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
          @keyup.enter="setFeePayer"
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
        @ok="sendTransaction"
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
          v-model:value="transactionMessage"
          @keyup.ctrl.enter="sendTransaction"
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
        @ok="setSender"
        :forceRender="true"
        v-model:open="openSenderModal"
        :title="`${$t(
          `View.TokenTransfer.MultipleToMultiple.template.senderModal.title`,
        )}「 #${senderIndex + 1} 」`"
      >
        <a-input
          showCount
          allowClear
          ref="senderPrivateKey"
          @keyup.enter="setSender"
          v-model:value="senderPrivateKey"
          :addonBefore="
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.senderModal.addonBefore`,
            )
          "
          :placeholder="
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.senderModal.placeholder`,
            )
          "
        ></a-input>
      </a-modal>
      <a-modal
        centered
        :footer="null"
        :forceRender="true"
        v-model:open="openSelectTokenModal"
        :title="`${$t(
          `View.TokenTransfer.MultipleToMultiple.template.selectTokenModal.title`,
        )}「 #${senderIndex + 1} 」`"
      >
        <!------------------------ Header ------------------------>
        <a-select
          allowClear
          mode="multiple"
          class="view-max-width"
          optionLabelProp="name"
          :options="tokenOptions"
          optionFilterProp="label"
          max-tag-count="responsive"
          v-model:value="selectedTokens"
          :placeholder="
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.selectTokenModal.placeholder1`,
            )
          "
        >
          <template #option="{ label, address }">
            <a-tooltip placement="left">
              <template #title>
                <span style="cursor: pointer" @click="copy(address)">{{
                  address
                }}</span>
              </template>
              <span>{{ label }}</span>
            </a-tooltip>
          </template>
        </a-select>
        <!------------------------ Header ------------------------>

        <!------------------------ Content ------------------------>
        <a-layout-content class="view-50vh-max-height">
          <a-row
            v-if="openSelectTokenModal"
            v-for="transferInfo in customOptions[senderIndex].transferInfos"
          >
            <!-------------------- Fungible Token Input -------------------->
            <a-col flex="1" v-if="transferInfo.tokenType === 0">
              <a-tooltip placement="right">
                <template #title>
                  <span
                    style="cursor: pointer"
                    @click="copy(transferInfo.tokenAddress)"
                    >{{ transferInfo.tokenAddress }}</span
                  >
                </template>
                <!-- @vue-ignore -->
                <a-input
                  allowClear
                  class="view-max-width"
                  :addonBefore="
                    transferInfo.name
                      ? transferInfo.name
                      : $t(
                          `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                        )
                  "
                  v-model:value="transferInfo.amount"
                  :placeholder="transferInfo.placeholder"
                ></a-input>
              </a-tooltip>
            </a-col>
            <!-------------------- Fungible Token Input -------------------->

            <!----------------- NonFungible Token Selector ----------------->
            <a-col flex="1" v-else-if="transferInfo.tokenType === 1">
              <a-input-group compact style="display: flex">
                <!-- @vue-skip -->
                <a-select
                  value="label"
                  :bordered="false"
                  :open="false"
                  :show-arrow="false"
                  class="view-nft-selector-label"
                >
                  <a-select-option value="label">{{
                    transferInfo.name
                      ? transferInfo.name
                      : $t(
                          `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                        )
                  }}</a-select-option>
                </a-select>
                <a-tooltip placement="right">
                  <template #title>
                    <span
                      style="cursor: pointer"
                      @click="copy(transferInfo.tokenAddress)"
                      >{{ transferInfo.tokenAddress }}</span
                    >
                  </template>

                  <!-- @vue-ignore -->
                  <a-select
                    allowClear
                    mode="multiple"
                    class="view-nft-selector"
                    max-tag-count="responsive"
                    :options="transferInfo.idOptions"
                    v-model:value="transferInfo.nonFungibleLocalIds"
                    :placeholder="
                      $t(
                        `View.TokenTransfer.MultipleToMultiple.template.selectTokenModal.placeholder2`,
                      )
                    "
                  >
                    <template #option="{ label }">
                      <a-tooltip placement="left">
                        <template #title>
                          <span style="cursor: pointer" @click="copy(label)">{{
                            label
                          }}</span>
                        </template>
                        <span>{{ label }}</span>
                      </a-tooltip>
                    </template>
                  </a-select>
                </a-tooltip>
              </a-input-group>
            </a-col>
            <!----------------- NonFungible Token Selector ----------------->
          </a-row>
        </a-layout-content>
        <!------------------------ Content ------------------------>
      </a-modal>
    </div>
    <!------------------------ Modal Group ------------------------>

    <!------------------------ Header ------------------------>
    <a-row :gutter="gutter">
      <a-col span="10" class="view-no-padding-left">
        <a-tooltip>
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
        <a-button
          class="view-max-width custom-btn"
          :text="
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.header.addTransfer.button`,
            )
          "
          @click="addTransfer"
          >{{
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.header.addTransfer.button`,
            )
          }}
        </a-button>
      </a-col>
      <a-col flex="1">
        <a-button
          @click="clearAllTransfers"
          :text="
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.header.clearAll.button`,
            )
          "
          class="view-max-width custom-btn"
          >{{
            $t(
              `View.TokenTransfer.MultipleToMultiple.template.header.clearAll.button`,
            )
          }}
        </a-button>
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
      {{ $t(`View.TokenTransfer.MultipleToMultiple.template.divider.text`) }} 」
    </a-divider>

    <!------------------------ Content ------------------------>
    <a-layout-content ref="content" class="view-layout-content">
      <TransitionGroup name="list">
        <a-row
          :gutter="gutter"
          :key="option"
          v-for="(option, index) in customOptions"
        >
          <a-col flex="1" class="view-no-padding-left">
            <a-button
              type="text"
              class="view-max-width custom-btn"
              :text="`#${index + 1}`"
              >{{ `#${index + 1}` }}
            </a-button>
          </a-col>
          <a-col flex="11">
            <a-tooltip placement="left">
              <template #title>
                <span
                  style="cursor: pointer"
                  @click="
                    copy(
                      option.fromWallet
                        ? getFromWalletAddress(option)
                        : $t(
                            `View.TokenTransfer.MultipleToMultiple.template.content.sender.address`,
                          ),
                    )
                  "
                  >{{
                    option.fromWallet
                      ? getFromWalletAddress(option)
                      : $t(
                          `View.TokenTransfer.MultipleToMultiple.template.content.sender.address`,
                        )
                  }}
                </span>
              </template>
              <a-input
                readonly
                @click="activateSenderModal(index)"
                :value="getFromWalletAddress(option)"
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
          <a-col flex="3">
            <a-tooltip placement="left">
              <template #title>
                <span
                  >{{
                    $t(
                      `View.TokenTransfer.MultipleToMultiple.template.content.selectToken.tooltip`,
                    )
                  }}{{ `「 #${index + 1} 」` }}
                </span>
              </template>
              <a-button
                text="➔"
                class="view-max-width custom-btn"
                @click="activateSelectTokenModal(index)"
                >{{ `➔` }}
              </a-button>
            </a-tooltip>
          </a-col>
          <a-col flex="11">
            <a-input
              allowClear
              v-model:value="option.toAddress"
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
          <a-col flex="1" class="view-no-padding-right">
            <a-tooltip placement="left">
              <template #title>
                <span
                  >{{
                    $t(
                      `View.TokenTransfer.MultipleToMultiple.template.content.deleteBtn.tooltip`,
                    )
                  }}{{ `「 #${index + 1} 」?` }}
                </span>
              </template>
              <a-button
                text="✕"
                type="text"
                @click="deleteTransfer(index)"
                class="view-max-width custom-btn"
                >{{ `✕` }}
              </a-button>
            </a-tooltip>
          </a-col>
        </a-row>
      </TransitionGroup>
    </a-layout-content>
    <!------------------------ Content ------------------------>
  </a-layout>
</template>

<script lang="ts">
import {
  CustomOption,
  getCurrentEpoch,
  PrivateKey,
  PublicKey,
  RadixNetworkChecker,
  RadixWalletGenerator,
  ResourcesOfAccount,
  Status,
  TokenSender,
  TokenType,
  TransactionStatus,
  TransferInfo,
  Wallet,
} from "@atlantis-l/radix-tool";
import { CreateIcon, formatNumber, selectXrdAddress } from "../../common";
import { message } from "ant-design-vue";
import store from "../../stores/store";
import { defineComponent } from "vue";

interface Option {
  name: string;
  label: string;
  value: string;
  address: string;
}

interface TokenOption {
  label: string;
  address: string;
  options: Option[];
}

const MAX_DIFF_SENDER_AMOUNT = 16;

export default defineComponent({
  components: {
    CreateIcon,
  },
  data() {
    return {
      gutter: 10,
      feeLock: "",
      focusInput: "",
      store: store(),
      senderIndex: 0,
      feeLockEstimate: "",
      isPreviewDone: false,
      senderPrivateKey: "",
      feePayerXrdBalance: "",
      transactionMessage: "",
      openSenderModal: false,
      openFeePayerModal: false,
      openSelectTokenModal: false,
      loadingSelectedTokens: false,
      feePayerWalletPrivateKey: "",
      openConfirmTransaction: false,
      selectedTokens: [] as string[],
      tokenOptions: [] as TokenOption[],
      customOptions: [] as CustomOption[],
      feePayerWallet: undefined as Wallet | undefined, //@ts-ignore
      tokenSender: new TokenSender(store().networkId, undefined),
      networkChecker: new RadixNetworkChecker(store().networkId),
      walletGenerator: new RadixWalletGenerator(store().networkId),
      addressAndResourceMap: new Map<string, ResourcesOfAccount>(),
    };
  },
  watch: {
    feePayerAddress() {
      this.isPreviewDone = false;
    },
    "store.language"() {
      this.tokenOptions[0].label = this.label.ftLabel;
      this.tokenOptions[0].address = this.label.ftLabel;
      this.tokenOptions[1].label = this.label.nftLabel;
      this.tokenOptions[1].address = this.label.nftLabel;
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
    "customOptions.length"() {
      this.isPreviewDone = false;
    },
    "store.networkId"(id: number) {
      this.tokenSender.networkId = id;
      this.networkChecker.networkId = id;
      this.walletGenerator.networkId = id;
    },
    selectedTokens(newTokens: string[], oldTokens: string[]) {
      if (this.loadingSelectedTokens) {
        this.loadingSelectedTokens = false;
        return;
      }

      if (newTokens.length > oldTokens.length) {
        newTokens.forEach((tokenInfo) => {
          if (!oldTokens.includes(tokenInfo)) {
            const splited = tokenInfo.split(":");

            if (TokenType.FUNGIBLE === Number(splited[0])) {
              this.customOptions[this.senderIndex].transferInfos.push({
                tokenType: TokenType.FUNGIBLE,
                tokenAddress: splited[1],
                amount: "",
                //@ts-ignore
                name: splited[2],
                placeholder: formatNumber(splited[3]),
                optionValue: tokenInfo,
              });
            }

            if (TokenType.NONFUNGIBLE === Number(splited[0])) {
              this.customOptions[this.senderIndex].transferInfos.push({
                tokenType: TokenType.NONFUNGIBLE,
                tokenAddress: splited[1],
                nonFungibleLocalIds: [],
                //@ts-ignore
                name: splited[2],
                idOptions: splited[3]
                  .split(",")
                  .map((id) => ({ label: id, value: id })),
                optionValue: tokenInfo,
              });
            }
          }
        });
        return;
      }

      if (oldTokens.length > newTokens.length) {
        oldTokens.forEach((tokenInfo) => {
          if (!newTokens.includes(tokenInfo)) {
            const index = this.customOptions[
              this.senderIndex
            ].transferInfos.findIndex((info) => {
              //@ts-ignore
              return info.optionValue === tokenInfo;
            });

            this.customOptions[this.senderIndex].transferInfos.splice(index, 1);
          }
        });
      }
    },
  },
  computed: {
    label() {
      return {
        ftLabel: this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.mounted.ftLabel`,
        ),
        nftLabel: this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.mounted.nftLabel`,
        ),
      };
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
    setSender() {
      this.walletGenerator
        .generateWalletByPrivateKey(this.senderPrivateKey)
        .then(async (wallet) => {
          const index = this.senderIndex;

          const fromWallet = this.customOptions[index].fromWallet;

          if (
            fromWallet &&
            fromWallet.privateKeyHexString() !== this.senderPrivateKey
          ) {
            this.customOptions[index].transferInfos = [];
          }

          this.customOptions[index].fromWallet = wallet;
          this.openSenderModal = false;

          message.loading({
            duration: 0,
            content: `「 #${index + 1} ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.setSender.loading`,
            )} 」`,
            key: `#${index}`,
          });

          try {
            if (!this.addressAndResourceMap.get(wallet.address)) {
              const resourcesOfAccounts =
                await this.networkChecker.checkResourcesOfAccounts([
                  wallet.address,
                ]);

              this.addressAndResourceMap.set(
                wallet.address,
                resourcesOfAccounts.pop() as ResourcesOfAccount,
              );
            }

            message.success({
              content: `「 #${index + 1} ${this.$t(
                `View.TokenTransfer.MultipleToMultiple.script.methods.setSender.success`,
              )} 」`,
              key: `#${index}`,
            });
          } catch (_e) {
            message.error({
              content: `「 #${index + 1} ${this.$t(
                `View.TokenTransfer.MultipleToMultiple.script.methods.setSender.error`,
              )} 」`,
              key: `#${index}`,
            });
          }
        })
        .catch((_e) => {
          message.error(
            `「 ${this.$t(
              `View.TokenTransfer.MultipleToMultiple.script.methods.setSender.pkError`,
            )} 」`,
          );
        });
    },
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
    addTransfer() {
      let customOption: CustomOption = {
        //@ts-ignore
        fromWallet: undefined,
        toAddress: "",
        transferInfos: [],
      };

      const length = this.customOptions.length;

      if (length) {
        const tempOption = this.customOptions[length - 1];
        customOption.toAddress = tempOption.toAddress;
        customOption.fromWallet = tempOption.fromWallet;
        customOption.transferInfos = tempOption.transferInfos.map(
          (info) => JSON.parse(JSON.stringify(info)) as TransferInfo,
        );
      }

      this.customOptions.push(customOption);

      this.scrollContentToBottom();
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
    clearAllTransfers() {
      this.customOptions = [];
      this.addressAndResourceMap.clear();
      this.addTransfer();
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
      this.openConfirmTransaction = false;

      const key = "sendTransaction";

      this.tokenSender.feeLock = this.feeLock;

      message.loading({
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.sendTransaction.loading`,
        )} 」`,
        key,
      });

      const txMessage = this.transactionMessage.trim();

      const map = new Map<string, PrivateKey>();

      this.customOptions.forEach((option) =>
        map.set(option.fromWallet.address, option.fromWallet.privateKey),
      );

      map.delete(this.feePayerAddress as string);

      const result = await this.tokenSender.sendCustom(
        this.customOptions,
        [...map.values()],
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
    validateTransferInfos() {
      const tempOptions: CustomOption[] = [];

      this.customOptions.forEach((option) => {
        const tempInfos: TransferInfo[] = [];

        option.transferInfos.forEach((info) => {
          if (info.tokenType === TokenType.FUNGIBLE) {
            (info.amount as string).trim().length && tempInfos.push(info);
          } else {
            (info.nonFungibleLocalIds as string[]).length &&
              tempInfos.push(info);
          }
        });

        option.transferInfos = tempInfos;

        tempInfos.length &&
          option.fromWallet &&
          option.toAddress.trim().length &&
          tempOptions.push(option);
      });

      this.customOptions = tempOptions;
    },
    scrollContentToBottom() {
      setTimeout(() => {
        //@ts-ignore
        this.$refs.content.$el.scrollTo({
          left: 0,
          behavior: "smooth",
          //@ts-ignore
          top: this.$refs.content.$el.scrollHeight,
        });
      }, 100);
    },
    activateFeePayerModal() {
      const wallet = this.feePayerWallet;
      if (wallet) this.feePayerWalletPrivateKey = wallet.privateKeyHexString();
      this.focusInput = "feePayerWalletPrivateKey";
      this.openFeePayerModal = true;
    },
    async previewTransaction() {
      this.validateTransferInfos();

      const set = new Set<string>(
        this.customOptions.map(
          (customOption) => customOption.fromWallet.address,
        ),
      );

      if (set.size > MAX_DIFF_SENDER_AMOUNT) {
        message.warning({
          content: `「 ${this.$t(
            `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.exceed`,
          )}: ${MAX_DIFF_SENDER_AMOUNT} 」`,
        });

        return;
      }

      this.tokenSender.feeLock = "0";
      this.tokenSender.mainWallet = this.feePayerWallet as Wallet;
      this.tokenSender.feePayerWallet = this.feePayerWallet as Wallet;

      const key = "previewTransaction";

      message.loading({
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.loading`,
        )} 」`,
        key,
      });

      const map = new Map<string, PublicKey>();

      this.customOptions.forEach((option) =>
        map.set(option.fromWallet.address, option.fromWallet.publicKey),
      );

      try {
        const result = await this.tokenSender.sendCustomPreview(
          this.customOptions,
          [...map.values()],
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
          this.clearAllTransfers();
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
    deleteTransfer(index: number) {
      this.customOptions.splice(index, 1);
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
    activateSenderModal(index: number) {
      this.senderPrivateKey = "";
      const wallet = this.customOptions[index].fromWallet;

      if (wallet) this.senderPrivateKey = wallet.privateKeyHexString();

      this.senderIndex = index;
      this.openSenderModal = true;
      this.focusInput = "senderPrivateKey";
    },
    activateSelectTokenModal(index: number) {
      this.loadingSelectedTokens = true;

      this.selectedTokens = [];
      this.tokenOptions[0].options = [];
      this.tokenOptions[1].options = [];

      const wallet = this.customOptions[index].fromWallet;

      if (wallet) {
        const resourcesOfAccount = this.addressAndResourceMap.get(
          wallet.address,
        );

        if (resourcesOfAccount) {
          this.selectedTokens = this.customOptions[index].transferInfos.map(
            //@ts-ignore
            (info) => info.optionValue,
          );

          (resourcesOfAccount as ResourcesOfAccount).fungible.forEach(
            (info) => {
              if (info.amount === "0") return;

              let tempLabel = info.name;
              if (info.symbol) tempLabel = info.symbol;

              const name = tempLabel
                ? tempLabel
                : this.$t(
                    `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                  );

              let label = `「 ${name} 」`;

              label += `「 ${this.$t(
                `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.balance`,
              )}: ${formatNumber(info.amount as string)} 」`;

              label += `「 ${this.$t(
                `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.address`,
              )}: ${info.resourceAddress} 」`;

              const value = `0:${info.resourceAddress}:${tempLabel ? tempLabel : ""}:${info.amount}`;

              this.tokenOptions[0].options.push({
                name,
                label,
                value,
                address: info.resourceAddress,
              });
            },
          );

          (resourcesOfAccount as ResourcesOfAccount).nonFungible.forEach(
            (info) => {
              if (info.ids?.length === 0) return;

              let tempLabel = info.name;
              if (info.symbol) tempLabel = info.symbol;

              const name = tempLabel
                ? tempLabel
                : this.$t(
                    `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                  );

              let label = `「 ${name} 」`;

              label += `「 ${this.$t(
                `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.amount`,
              )}: ${formatNumber((info.ids?.length as number).toString())} 」`;

              label += `「 ${this.$t(
                `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.address`,
              )}: ${info.resourceAddress} 」`;

              const value = `1:${info.resourceAddress}:${tempLabel ? tempLabel : ""}:${info.ids?.join(",")}`;

              this.tokenOptions[1].options.push({
                name,
                label,
                value,
                address: info.resourceAddress,
              });
            },
          );
        }
      }

      this.senderIndex = index;
      this.openSelectTokenModal = true;
    },
    getFromWalletAddress(option: CustomOption) {
      return option.fromWallet ? option.fromWallet.address : "";
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
  mounted() {
    this.addTransfer();
    this.tokenOptions.push(
      {
        label: this.label.ftLabel,
        address: this.label.ftLabel,
        options: [],
      },
      {
        label: this.label.nftLabel,
        address: this.label.nftLabel,
        options: [],
      },
    );
  },
});
</script>

<style scoped>
.ant-layout {
  background-color: #ffffff !important;
}

.view-layout-content {
  overflow: scroll !important;
}

.view-layout-content::-webkit-scrollbar {
  display: none !important;
}

.view-nft-selector {
  flex: 1 !important;
  min-width: 50%;
}

.view-nft-selector-label {
  max-width: 50% !important;
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
