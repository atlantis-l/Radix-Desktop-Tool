<template>
  <a-layout class="view-layout">
    <a-modal
      centered
      :footer="null"
      destroyOnClose
      style="width: 900px"
      v-model:open="openManifestModal"
    >
      <template #title>
        <a-row :gutter="gutter">
          <a-col class="view-no-padding-left">
            <a-tag color="blue">{{ `#${transactionIndex + 1}` }} </a-tag>
          </a-col>

          <a-col class="view-no-padding-right">
            <a-tag
              style="cursor: pointer"
              @click="
                copy(transactionList[transactionIndex].intent_hash as string)
              "
            >
              <template #icon>
                <TagTwoTone two-tone-color="#1677ff" /> </template
              >{{ transactionList[transactionIndex].intent_hash }}
            </a-tag>
          </a-col>
        </a-row>
      </template>

      <a-textarea
        autoSize
        readonly
        style="max-height: 500px; overflow: scroll"
        :value="manifest"
      ></a-textarea>
    </a-modal>

    <a-modal
      centered
      :footer="null"
      destroyOnClose
      style="width: 800px"
      v-model:open="openModal"
    >
      <template #title>
        <a-row :gutter="gutter">
          <a-col class="view-no-padding-left">
            <a-tag color="blue">{{ `#${transactionIndex + 1}` }} </a-tag>
          </a-col>

          <a-col class="view-no-padding-right">
            <a-tag
              style="cursor: pointer !important"
              @click="
                copy(transactionList[transactionIndex].intent_hash as string)
              "
            >
              <template #icon>
                <TagTwoTone two-tone-color="#1677ff" /> </template
              >{{ transactionList[transactionIndex].intent_hash }}
            </a-tag>
          </a-col>
        </a-row>
      </template>

      <div
        style="max-height: 500px; overflow: scroll"
        class="modal-div"
        ref="content"
      >
        <a-row v-if="newEntities">
          <a-card
            class="view-max-width"
            :title="$t('View.HistoryCheck.template.modal.newEntities')"
          >
            <template v-for="(entityAddress, index) in newEntities">
              <a-card
                :style="{
                  marginTop: index ? `20px !important` : `0`,
                }"
                class="view-max-width"
                hoverable
              >
                <a-row>
                  <a-col>
                    <a-tag color="blue">{{
                      entityAddress
                        .split("_")[0]
                        .split("")
                        .map((char: string, index: number) => {
                          return index ? char : char.toUpperCase();
                        })
                        .join("")
                    }}</a-tag>
                  </a-col>
                </a-row>

                <a-row class="no-margin-row">
                  <a-col>
                    <a-tag
                      class="view-tag-cursor-pointer"
                      @click="copy(entityAddress as string)"
                      >{{ entityAddress }}</a-tag
                    >
                  </a-col>
                </a-row>
              </a-card>
            </template>
          </a-card>
        </a-row>

        <span v-for="(changeList, i) in balanceChanges">
          <a-row
            v-if="changeList[0].type"
            :class="balanceChanges.length - i === 1 ? 'no-margin-row' : ''"
          >
            <a-card
              class="view-max-width"
              :title="changeList[0]['entity_address']"
            >
              <template v-for="(change, index) in changeList">
                <a-row
                  :style="{
                    marginTop: index ? `20px !important` : `0`,
                  }"
                  class="no-margin-row"
                >
                  <a-card class="view-max-width" hoverable>
                    <a-row
                      class="no-margin-row"
                      :gutter="gutter"
                      v-if="change[`balance_change`]"
                    >
                      <a-col class="view-no-padding-left">
                        <a-tag color="purple"
                          >{{
                            addressAndSymbolMap?.get(change[`resource_address`])
                              ? addressAndSymbolMap?.get(
                                  change[`resource_address`],
                                )
                              : $t(
                                  `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                                )
                          }}
                        </a-tag>
                      </a-col>

                      <a-col>
                        <a-tooltip destroyTooltipOnHide placement="right">
                          <template #title
                            >{{ change[`resource_address`] }}
                          </template>

                          <a-tag
                            class="view-tag-cursor-pointer"
                            @click="copy(change[`resource_address`] as string)"
                            >{{
                              `${change[`resource_address`].slice(
                                0,
                                8,
                              )}...${change[`resource_address`].slice(
                                change[`resource_address`].length - 6,
                              )}`
                            }}
                          </a-tag>
                        </a-tooltip>
                      </a-col>

                      <a-col flex="1" />

                      <a-col v-if="change.type">
                        <a-tag color="blue"
                          >{{ $t("View.HistoryCheck.template.modal.txFee") }}
                        </a-tag>
                      </a-col>

                      <a-col v-else>
                        <a-tag
                          :color="
                            change[`balance_change`].startsWith(`-`)
                              ? `error`
                              : `green`
                          "
                          >{{
                            change["balance_change"].startsWith("-")
                              ? $t("View.HistoryCheck.template.modal.withdraw")
                              : $t("View.HistoryCheck.template.modal.deposit")
                          }}
                        </a-tag>
                      </a-col>

                      <a-col class="view-no-padding-right">
                        <a-tag
                          class="view-tag-cursor-pointer"
                          @click="copy(change[`balance_change`] as string)"
                          >{{
                            formatNumber(
                              (change["balance_change"].startsWith("-")
                                ? change["balance_change"]
                                : `+${change["balance_change"]}`) as string,
                            )
                          }}
                        </a-tag>
                      </a-col>
                    </a-row>

                    <div v-else>
                      <a-row class="no-margin-row" :gutter="gutter">
                        <a-col class="view-no-padding-left">
                          <a-tag color="purple"
                            >{{
                              addressAndSymbolMap?.get(
                                change[`resource_address`],
                              )
                                ? addressAndSymbolMap?.get(
                                    change[`resource_address`],
                                  )
                                : $t(
                                    `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                                  )
                            }}
                          </a-tag>
                        </a-col>

                        <a-col class="view-no-padding-right">
                          <a-tooltip destroyTooltipOnHide placement="right">
                            <template #title
                              >{{ change[`resource_address`] }}
                            </template>

                            <a-tag
                              class="view-tag-cursor-pointer"
                              @click="
                                copy(change[`resource_address`] as string)
                              "
                              >{{
                                `${change[`resource_address`].slice(
                                  0,
                                  8,
                                )}...${change[`resource_address`].slice(
                                  change[`resource_address`].length - 6,
                                )}`
                              }}
                            </a-tag>
                          </a-tooltip>
                        </a-col>
                      </a-row>

                      <template v-for="nft in change.added">
                        <a-row
                          :gutter="gutter"
                          class="no-margin-row"
                          style="margin-top: 20px !important"
                        >
                          <a-col class="view-no-padding-left">
                            <a-tag color="green"
                              >{{
                                $t("View.HistoryCheck.template.modal.deposit")
                              }}
                            </a-tag>
                          </a-col>

                          <a-col class="view-no-padding-right">
                            <a-tag
                              class="view-tag-cursor-pointer"
                              @click="copy(nft as string)"
                              >{{ nft }}
                            </a-tag>
                          </a-col>
                        </a-row>
                      </template>

                      <template v-for="nft in change.removed">
                        <a-row
                          :gutter="gutter"
                          class="no-margin-row"
                          style="margin-top: 20px !important"
                        >
                          <a-col class="view-no-padding-left">
                            <a-tag color="error"
                              >{{
                                $t("View.HistoryCheck.template.modal.withdraw")
                              }}
                            </a-tag>
                          </a-col>

                          <a-col class="view-no-padding-right">
                            <a-tag
                              class="view-tag-cursor-pointer"
                              @click="copy(nft as string)"
                              >{{ nft }}
                            </a-tag>
                          </a-col>
                        </a-row>
                      </template>
                    </div>
                  </a-card>
                </a-row>
              </template>
            </a-card>
          </a-row>
        </span>

        <span v-for="(changeList, i) in balanceChanges">
          <a-row
            v-if="!changeList[0].type"
            :class="balanceChanges.length - i === 1 ? 'no-margin-row' : ''"
          >
            <a-card
              :title="changeList[0]['entity_address']"
              class="view-max-width"
            >
              <template v-for="(change, index) in changeList">
                <a-row
                  :style="{
                    'margin-top': index ? `20px !important` : `0`,
                  }"
                  class="no-margin-row"
                >
                  <a-card class="view-max-width" hoverable>
                    <a-row
                      class="no-margin-row"
                      :gutter="gutter"
                      v-if="change[`balance_change`]"
                    >
                      <a-col class="view-no-padding-left">
                        <a-tag color="purple"
                          >{{
                            addressAndSymbolMap?.get(change[`resource_address`])
                              ? addressAndSymbolMap?.get(
                                  change[`resource_address`],
                                )
                              : $t(
                                  `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                                )
                          }}
                        </a-tag>
                      </a-col>

                      <a-col>
                        <a-tooltip destroyTooltipOnHide placement="right">
                          <template #title
                            >{{ change[`resource_address`] }}
                          </template>

                          <a-tag
                            class="view-tag-cursor-pointer"
                            @click="copy(change[`resource_address`] as string)"
                            >{{
                              `${change[`resource_address`].slice(
                                0,
                                8,
                              )}...${change[`resource_address`].slice(
                                change[`resource_address`].length - 6,
                              )}`
                            }}
                          </a-tag>
                        </a-tooltip>
                      </a-col>

                      <a-col flex="1" />

                      <a-col>
                        <a-tag
                          :color="
                            change[`balance_change`].startsWith(`-`)
                              ? `error`
                              : `green`
                          "
                          >{{
                            change["balance_change"].startsWith("-")
                              ? $t("View.HistoryCheck.template.modal.withdraw")
                              : $t("View.HistoryCheck.template.modal.deposit")
                          }}
                        </a-tag>
                      </a-col>

                      <a-col class="view-no-padding-right">
                        <a-tag
                          class="view-tag-cursor-pointer"
                          @click="copy(change[`balance_change`] as string)"
                          >{{
                            formatNumber(
                              (change["balance_change"].startsWith("-")
                                ? change["balance_change"]
                                : `+${change["balance_change"]}`) as string,
                            )
                          }}
                        </a-tag>
                      </a-col>
                    </a-row>

                    <div v-else>
                      <a-row class="no-margin-row" :gutter="gutter">
                        <a-col class="view-no-padding-left">
                          <a-tag color="purple"
                            >{{
                              addressAndSymbolMap?.get(
                                change[`resource_address`],
                              )
                                ? addressAndSymbolMap?.get(
                                    change[`resource_address`],
                                  )
                                : $t(
                                    `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                                  )
                            }}
                          </a-tag>
                        </a-col>

                        <a-col class="view-no-padding-right">
                          <a-tooltip destroyTooltipOnHide placement="right">
                            <template #title
                              >{{ change[`resource_address`] }}
                            </template>

                            <a-tag
                              class="view-tag-cursor-pointer"
                              @click="
                                copy(change[`resource_address`] as string)
                              "
                              >{{
                                `${change[`resource_address`].slice(
                                  0,
                                  8,
                                )}...${change[`resource_address`].slice(
                                  change[`resource_address`].length - 6,
                                )}`
                              }}
                            </a-tag>
                          </a-tooltip>
                        </a-col>
                      </a-row>

                      <template v-for="nft in change.added">
                        <a-row
                          :gutter="gutter"
                          class="no-margin-row"
                          style="margin-top: 20px !important"
                        >
                          <a-col class="view-no-padding-left">
                            <a-tag color="green"
                              >{{
                                $t("View.HistoryCheck.template.modal.deposit")
                              }}
                            </a-tag>
                          </a-col>

                          <a-col class="view-no-padding-right">
                            <a-tag
                              class="view-tag-cursor-pointer"
                              @click="copy(nft as string)"
                              >{{ nft }}
                            </a-tag>
                          </a-col>
                        </a-row>
                      </template>

                      <template v-for="nft in change.removed">
                        <a-row
                          :gutter="gutter"
                          class="no-margin-row"
                          style="margin-top: 20px !important"
                        >
                          <a-col class="view-no-padding-left">
                            <a-tag color="error"
                              >{{
                                $t("View.HistoryCheck.template.modal.withdraw")
                              }}
                            </a-tag>
                          </a-col>

                          <a-col class="view-no-padding-right">
                            <a-tag
                              class="view-tag-cursor-pointer"
                              @click="copy(nft as string)"
                              >{{ nft }}
                            </a-tag>
                          </a-col>
                        </a-row>
                      </template>
                    </div>
                  </a-card>
                </a-row>
              </template>
            </a-card>
          </a-row>
        </span>
      </div>
    </a-modal>

    <!------------------------ Header ------------------------>
    <a-row :gutter="gutter" class="no-margin-row">
      <a-col span="8" class="view-no-padding-left">
        <a-input
          ref="address"
          allowClear
          :placeholder="
            $t(`View.HistoryCheck.template.header.input.placeholder`)
          "
          @keyup.enter="check"
          v-model:value.trim="address"
        />
      </a-col>

      <a-col span="4">
        <a-button
          class="view-max-width custom-btn"
          :text="$t('View.EntityCheck.template.check')"
          @click="check"
          >{{ $t("View.EntityCheck.template.check") }}</a-button
        >
      </a-col>

      <a-col span="4">
        <a-button
          @click="getPreviousPage"
          class="view-max-width custom-btn"
          :text="$t('View.HistoryCheck.template.header.previous')"
          >{{ $t("View.HistoryCheck.template.header.previous") }}
        </a-button>
      </a-col>

      <a-col span="4">
        <a-button
          @click="getNextPage"
          class="view-max-width custom-btn"
          :text="$t('View.HistoryCheck.template.header.next')"
          >{{ $t("View.HistoryCheck.template.header.next") }}
        </a-button>
      </a-col>

      <a-col span="4" class="view-no-padding-right">
        <a-select class="view-max-width" v-model:value="store.pageSize">
          <a-select-option :value="10"
            >{{ `10 ${$t("View.HistoryCheck.template.header.perPage")}` }}
          </a-select-option>
          <a-select-option :value="20"
            >{{ `20 ${$t("View.HistoryCheck.template.header.perPage")}` }}
          </a-select-option>
          <a-select-option :value="50"
            >{{ `50 ${$t("View.HistoryCheck.template.header.perPage")}` }}
          </a-select-option>
          <a-select-option :value="100"
            >{{ `100 ${$t("View.HistoryCheck.template.header.perPage")}` }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <!------------------------ Header ------------------------>

    <a-divider
      >「 {{ $t(`View.HistoryCheck.template.divider.text`) }} 」</a-divider
    >

    <!------------------------ Content ------------------------>
    <a-layout-content class="view-layout-content">
      <template v-for="(tx, i) in transactionList">
        <a-row :class="transactionList.length - i === 1 ? 'no-margin-row' : ''">
          <a-card class="view-max-width" @click="activateModal(i)">
            <a-row :gutter="gutter" class="no-margin-row">
              <a-col class="view-no-padding-left">
                <a-tooltip>
                  <template #title>{{
                    $t("View.ManifestExecute.template.divider.text")
                  }}</template>
                  <a-tag color="blue" @click.stop="activateManifestModal(i)">{{
                    `#${i + 1}`
                  }}</a-tag>
                </a-tooltip>
              </a-col>

              <a-col>
                <a-tag>
                  <template #icon>
                    <ClockCircleTwoTone two-tone-color="#531dab" /> </template
                  >{{ tx.confirmed_at?.toLocaleString() }}
                </a-tag>
              </a-col>

              <a-col>
                <a-tooltip destroyTooltipOnHide placement="left">
                  <template #title>{{ tx.intent_hash }} </template>

                  <a-tag @click.stop="copy(tx.intent_hash as string)">
                    <template #icon>
                      <TagTwoTone two-tone-color="#1677ff" /> </template
                    >{{ tx.intent_hash?.slice(0, 4) }}...{{
                      tx.intent_hash?.slice(tx.intent_hash.length - 6)
                    }}
                  </a-tag>
                </a-tooltip>
              </a-col>

              <a-col>
                <!-- @vue-skip -->
                <a-tooltip destroyTooltipOnHide placement="left">
                  <template #title
                    >{{
                      $t("View.HistoryCheck.template.content.affectedEntities")
                    }}
                  </template>
                  <a-tag>
                    <template #icon>
                      <BuildTwoTone two-tone-color="#eb2f96" /> </template
                    >{{ affectedEntities(tx.balance_changes) }}
                  </a-tag>
                </a-tooltip>
              </a-col>

              <div style="width: 5px"></div>

              <a-col v-if="tx.message">
                <!-- @vue-skip -->
                <a-tooltip destroyTooltipOnHide placement="right">
                  <template #title>{{ tx.message.content.value }} </template>
                  <MessageTwoTone
                    two-tone-color="#18b7ac"
                    @click.stop="copy(tx.message.content.value as string)"
                  />
                </a-tooltip>
              </a-col>

              <a-col flex="1" />

              <a-col>
                <a-tag @click.stop="copy(tx.fee_paid as string)">
                  <template #icon>
                    <FireTwoTone two-tone-color="#cf1322" /> </template
                  >{{ `${formatNumber(tx.fee_paid as string)} `
                  }}<span class="custom-span" text="XRD">XRD</span>
                </a-tag>
              </a-col>

              <a-col class="view-no-padding-right">
                <a-tooltip destroyTooltipOnHide placement="left">
                  <template #title
                    >{{
                      tx.transaction_status === `CommittedSuccess`
                        ? $t(
                            "View.TokenTransfer.MultipleToMultiple.script.methods.checkTx.success",
                          )
                        : tx.error_message
                    }}
                  </template>
                  <CheckCircleTwoTone
                    two-tone-color="#18b7ac"
                    v-if="tx.transaction_status === `CommittedSuccess`"
                  />
                  <CloseCircleTwoTone two-tone-color="#cf1322" v-else />
                </a-tooltip>
              </a-col>
            </a-row>
          </a-card>
        </a-row>
      </template>
    </a-layout-content>
    <!------------------------ Content ------------------------>
  </a-layout>
</template>

<script lang="ts">
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  CloseCircleTwoTone,
  DollarCircleTwoTone,
  FireTwoTone,
  MessageTwoTone,
  TagTwoTone,
  BuildTwoTone,
} from "@ant-design/icons-vue";
import store from "../stores/store";
import { defineComponent } from "vue";
import { formatNumber } from "../common";
import { message } from "ant-design-vue";
import {
  CommittedTransactionInfo,
  TransactionBalanceChanges,
  TransactionFungibleFeeBalanceChangeType,
} from "@radixdlt/babylon-gateway-api-sdk";
import {
  Convert,
  selectNetwork,
  convertManifestTo,
  RadixEngineToolkit,
  RadixNetworkChecker,
} from "@atlantis-l/radix-tool";

export default defineComponent({
  components: {
    TagTwoTone,
    FireTwoTone,
    BuildTwoTone,
    MessageTwoTone,
    ClockCircleTwoTone,
    CheckCircleTwoTone,
    CloseCircleTwoTone,
    DollarCircleTwoTone,
  },
  data() {
    return {
      gutter: 10,
      address: "",
      formatNumber,
      manifest: "",
      store: store(),
      openModal: false,
      transactionIndex: 0,
      openManifestModal: false,
      cursorList: [] as string[],
      addressAndSymbolMap: new Map<string, string | null>(),
      currentCursor: undefined as string | undefined,
      transactionList: [] as CommittedTransactionInfo[],
      networkChecker: new RadixNetworkChecker(store().networkId),
      addressAndBalanceChangesMap: undefined as Map<string, any[]> | undefined,
    };
  },
  watch: {
    address() {
      this.check();
    },
    "store.pageSize"(size: number) {
      this.store.setPageSize(size);
      this.address.length && this.getTransactionList();
    },
    "store.networkId"(id: number) {
      this.networkChecker.networkId = id;
    },
  },
  computed: {
    NETWORK_API() {
      return selectNetwork(this.store.networkId);
    },
    newEntities() {
      if (
        this.transactionList[this.transactionIndex].receipt?.state_updates //@ts-ignore
          ?.new_global_entities &&
        this.transactionList[this.transactionIndex].receipt?.state_updates //@ts-ignore
          ?.new_global_entities.length
      ) {
        return this.transactionList[
          this.transactionIndex //@ts-ignore
        ].receipt?.state_updates?.new_global_entities.map(
          //@ts-ignore
          (entity) => entity.entity_address,
        );
      }

      return undefined;
    },
    balanceChanges() {
      let fungible_fee_balance_changes =
        this.transactionList[this.transactionIndex].balance_changes
          ?.fungible_fee_balance_changes;

      if (fungible_fee_balance_changes) {
        const changeList:
          | {
              type: TransactionFungibleFeeBalanceChangeType;
              entity_address: string;
              resource_address: string;
              balance_change: string;
            }[]
          | undefined = [];

        fungible_fee_balance_changes.forEach((change) => {
          if (change.type === "FeePayment") {
            changeList.push(change);
          }
        });

        fungible_fee_balance_changes = changeList;
      }

      const fungible_balance_changes =
        this.transactionList[this.transactionIndex].balance_changes
          ?.fungible_balance_changes;

      const non_fungible_balance_changes =
        this.transactionList[this.transactionIndex].balance_changes
          ?.non_fungible_balance_changes;

      const addressAndBalanceChangesMap = new Map<string, any[]>();

      fungible_fee_balance_changes?.forEach((change) => {
        addressAndBalanceChangesMap.set(change.entity_address, [change]);
      });

      fungible_balance_changes?.forEach((change) => {
        const changeList = addressAndBalanceChangesMap.get(
          change.entity_address,
        );

        if (changeList) {
          changeList.push(change);
        } else {
          addressAndBalanceChangesMap.set(change.entity_address, [change]);
        }
      });

      non_fungible_balance_changes?.forEach((change) => {
        const changeList = addressAndBalanceChangesMap.get(
          change.entity_address,
        );

        if (changeList) {
          changeList.push(change);
        } else {
          addressAndBalanceChangesMap.set(change.entity_address, [change]);
        }
      });

      this.addressAndBalanceChangesMap = addressAndBalanceChangesMap;

      return [...addressAndBalanceChangesMap.values()];
    },
  },
  methods: {
    getNextPage() {
      if (!this.address.length) return;

      if (this.currentCursor) {
        const index = this.cursorList.indexOf(this.currentCursor);

        const nextCursor = this.cursorList[index + 1];

        if (nextCursor) {
          this.getTransactionList(nextCursor);
        } else {
          message.info({
            content: `「 ${this.$t("View.HistoryCheck.script.noNext")} 」`,
            key: "noNext",
          });
        }
      } else if (this.cursorList.length) {
        this.getTransactionList(this.cursorList[0]);
      } else {
        message.info({
          content: `「 ${this.$t("View.HistoryCheck.script.noNext")} 」`,
          key: "noNext",
        });
      }
    },
    getPreviousPage() {
      if (!this.address.length) return;

      if (this.currentCursor) {
        const index = this.cursorList.indexOf(this.currentCursor);

        const previousCursor = this.cursorList[index - 1];

        if (previousCursor) {
          this.getTransactionList(previousCursor);
        } else {
          this.getTransactionList();
        }
      } else {
        message.info({
          content: `「 ${this.$t("View.HistoryCheck.script.noPrevious")} 」`,
          key: "noPrevious",
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
    activateModal(index: number) {
      this.transactionIndex = index;

      const headOnClick = () => {
        setTimeout(() => {
          //@ts-ignore
          const headList = this.$refs.content.getElementsByClassName(
            "ant-card-head",
          ) as HTMLElement[];

          if (headList && headList.length) {
            [...headList].forEach((e) => {
              const title = e.getElementsByClassName("ant-card-head-title")[0]
                .textContent;

              e.onclick = () => {
                this.copy(title as string);
              };
            });
          }
        }, 100);
      };

      if (this.balanceChanges && this.addressAndBalanceChangesMap) {
        let hasAllSymbols = true;

        this.addressAndBalanceChangesMap.forEach((changes) => {
          changes.forEach((change) => {
            if (
              this.addressAndSymbolMap.get(change.resource_address) ===
              undefined
            ) {
              hasAllSymbols = false;
            }
          });
        });

        if (!hasAllSymbols) {
          const key = "activateModal";

          message.loading({
            duration: 0,
            content: `「 ${this.$t("View.HistoryCheck.script.getTxInfo")} 」`,
            key,
          });

          this.networkChecker
            .checkResourcesOfAccounts([
              ...this.addressAndBalanceChangesMap.keys(),
            ])
            .then((resourcesOfAccountList) => {
              resourcesOfAccountList.forEach((rs) => {
                rs.fungible.forEach((info) => {
                  this.addressAndSymbolMap?.set(
                    info.resourceAddress,
                    info.symbol ? info.symbol : info.name ? info.name : null,
                  );
                });

                rs.nonFungible.forEach((info) => {
                  this.addressAndSymbolMap?.set(
                    info.resourceAddress,
                    info.symbol ? info.symbol : info.name ? info.name : null,
                  );
                });
              });

              message.success({
                content: `「 ${this.$t(
                  "View.HistoryCheck.script.gotTxInfo",
                )} 」`,
                key,
              });

              this.openModal = true;

              headOnClick();
            })
            .catch(() => {
              message.error({
                content: `「 ${this.$t(
                  "View.HistoryCheck.script.getTxInfoError",
                )} 」`,
                key,
              });
            });
        } else {
          this.openModal = true;

          headOnClick();
        }
      }
    },
    async activateManifestModal(index: number) {
      const tx = this.transactionList[index];

      const transactionHex = tx.raw_hex;

      if (transactionHex) {
        const transactionBytes = Convert.HexString.toUint8Array(transactionHex);

        const notarizedTransaction =
          await RadixEngineToolkit.NotarizedTransaction.decompile(
            transactionBytes,
          );

        const manifest = notarizedTransaction.signedIntent.intent.manifest;

        await convertManifestTo("String", manifest, this.store.networkId);

        this.manifest = manifest.instructions.value as string;

        this.transactionIndex = index;
        this.openManifestModal = true;
      }
    },
    getTransactionList(cursor?: string) {
      const key = "getTransactionList";

      message.loading({
        duration: 0,
        content: `「 ${this.$t("View.HistoryCheck.script.getTxList")} 」`,
        key,
      });

      this.NETWORK_API.stream.innerClient
        .streamTransactions({
          streamTransactionsRequest: {
            cursor: cursor,
            limit_per_page: this.store.pageSize,
            affected_global_entities_filter: [this.address],
            opt_ins: {
              raw_hex: true,
              balance_changes: true,
              receipt_fee_summary: true,
              receipt_state_changes: true,
              receipt_costing_parameters: true,
            },
          },
        })
        .then((res) => {
          if (cursor) {
            this.currentCursor = cursor;
          } else {
            this.cursorList = [];
            this.currentCursor = undefined;
          }

          if (res.next_cursor && !this.cursorList.includes(res.next_cursor)) {
            this.cursorList.push(res.next_cursor);
          }

          this.transactionIndex = 0;
          this.transactionList = res.items;

          message.success({
            content: `「 ${this.$t("View.HistoryCheck.script.gotTxList")} 」`,
            key,
          });
        })
        .catch(() => {
          message.error({
            content: `「 ${this.$t("View.HistoryCheck.script.txListError")} 」`,
            key,
          });
        });
    },
    affectedEntities(changes: TransactionBalanceChanges | null) {
      if (!changes) return;

      let entitySet = new Set<String>();

      changes.fungible_balance_changes.forEach((change) => {
        entitySet.add(change.entity_address);
      });

      changes.non_fungible_balance_changes.forEach((change) => {
        entitySet.add(change.entity_address);
      });

      changes.fungible_fee_balance_changes.forEach((change) => {
        if (change.entity_address.startsWith("consensusmanager")) return;

        entitySet.add(change.entity_address);
      });

      return entitySet.size;
    },
    check() {
      if (this.address.length && this.address.includes("_")) {
        this.getTransactionList();
      } else {
        this.currentCursor = undefined;
        this.cursorList = [];
      }
    },
  },
  activated() {
    setTimeout(() => {
      //@ts-ignore
      this.$refs.address.focus();
    }, 100);
  },
});
</script>

<style scoped>
.ant-layout {
  background-color: #fff;
}

.ant-tag {
  user-select: none !important;
  margin-inline-end: 0 !important;
}

.ant-modal .ant-card {
  cursor: auto !important;
}

.ant-modal .ant-tag {
  font-size: 14px !important;
}

.ant-card {
  cursor: pointer;
  background-position: 70% 45%;
  border-radius: 8px !important;
  background-size: 1200px 1200px;
  border: 1px solid #d9d9d9 !important;
  background-clip: padding-box, border-box;
  background-image: linear-gradient(to right, #ffffff, #ffffff),
    radial-gradient(#052cc0, #1dddbf, #ff00e6, #1dddbf, #052cc0);
  transition: all 0.4s ease;
}

.ant-card:hover {
  background-position: 70% 45%;
  border-radius: 8px !important;
  background-size: 1200px 1200px;
  background-clip: padding-box, border-box;
  border: 1px solid transparent !important;
  background-image: linear-gradient(to right, #ffffff, #ffffff),
    radial-gradient(#052cc0, #1dddbf, #ff00e6, #1dddbf, #052cc0);
}

.ant-card * {
  font-size: 14px !important;
}

.no-margin-row {
  margin: 0 !important;
}

.custom-span {
  color: #00ccff;
}

.custom-span::before {
  color: #ff00ae;
  position: absolute;
  content: attr(text);
  -webkit-mask-box-image: linear-gradient(35deg, transparent, white);
}

.view-tag-cursor-pointer {
  cursor: pointer !important;
}

.view-layout-content {
  overflow: scroll !important;
}

.view-layout-content::-webkit-scrollbar {
  display: none !important;
}

.modal-div::-webkit-scrollbar {
  display: none !important;
}
</style>
