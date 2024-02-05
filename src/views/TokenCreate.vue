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
        :forceRender="true"
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
      <!-- @vue-skip -->
      <a-modal centered :footer="null" v-model:open="openResourceModal">
        <template #title v-if="authValues.ownerRole === 1"
          >{{ $t("View.PackageDeploy.template.header.select.1") }}
        </template>

        <template #title v-if="authValues.ownerRole === 2"
          >{{ $t("View.PackageDeploy.template.header.select.2") }}
        </template>

        <a-row :class="authValues.ownerRole === 1 ? 'no-margin-row' : ''">
          <a-col flex="1">
            <a-input
              allowClear
              ref="resourceAddress"
              class="view-max-width"
              v-model:value.trim="resourceAddress"
              @keyup.enter="openResourceModal = false"
              :addonBefore="
                $t('View.HistoryCheck.template.header.input.addonBefore')
              "
              :placeholder="
                $t('View.PackageDeploy.template.modal.resourceAddress')
              "
            ></a-input>
          </a-col>
        </a-row>

        <a-row class="no-margin-row" v-if="authValues.ownerRole === 2">
          <a-col flex="1">
            <a-input
              allowClear
              addonBefore="NFT ID"
              placeholder="NFT ID"
              v-model:value.trim="nftId"
              class="view-max-width"
              @keyup.enter="openResourceModal = false"
            ></a-input>
          </a-col>
        </a-row>
      </a-modal>
      <a-modal
        centered
        :footer="null"
        class="modal-div"
        style="width: 600px"
        v-model:open="openNftModal"
      >
        <template #title>
          <a-tag
            color="blue"
            style="font-size: 18px; margin-bottom: 12px; user-select: none"
            >{{ `#${nftIndex}#` }}</a-tag
          >
        </template>

        <div
          style="max-height: 400px; overflow: scroll"
          class="modal-div"
          ref="content"
        >
          <!-- @vue-skip -->
          <a-row
            :class="
              Object.keys(nftList[nftIndex]).length - i === 1
                ? 'no-margin-row'
                : ''
            "
            v-if="nftList.length"
            v-for="(key, i) in Object.keys(nftList[nftIndex])"
          >
            <a-col flex="1">
              <a-input
                allowClear
                :addonBefore="key"
                v-model:value.trim="nftList[nftIndex][key]"
                :placeholder="
                  nftFields[nftFields?.findIndex((field) => field.name === key)]
                    .value
                    ? $t('View.TokenCreate.template.content.iconUrlPlaceholder')
                    : $t('View.TokenCreate.script.string')
                "
              />
            </a-col>
          </a-row>
        </div>
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
        <a-select
          class="view-max-width"
          :dropdownMatchSelectWidth="false"
          v-model:value="tokenType"
        >
          <a-select-option :value="0">{{
            $t("View.TokenCreate.template.header.tokenTypeSelect.fungibleToken")
          }}</a-select-option>
          <a-select-option :value="1">{{
            $t(
              "View.TokenCreate.template.header.tokenTypeSelect.nonFungibleToken",
            )
          }}</a-select-option>
        </a-select>
      </a-col>

      <a-col flex="1">
        <a-select class="view-max-width" v-model:value="settingsMode">
          <a-select-option :value="0">{{
            $t("View.TokenCreate.template.header.settingsMode.simple")
          }}</a-select-option>
          <a-select-option :value="1">{{
            $t("View.TokenCreate.template.header.settingsMode.detailed")
          }}</a-select-option>
        </a-select>
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

    <!------------------------ Content ------------------------>
    <a-layout-content class="view-layout-content">
      <div v-if="!tokenType">
        <a-divider
          >「 {{ $t("View.TokenCreate.template.divider.text") }} 」</a-divider
        >

        <a-row :gutter="gutter" class="no-margin-row">
          <a-col flex="1" class="view-no-padding-left">
            <a-input
              showCount
              allowClear
              :addonBefore="
                $t('View.TokenCreate.template.content.initialSupply')
              "
              :placeholder="
                $t('View.TokenCreate.template.content.initialSupplyPlaceholder')
              "
              v-model:value.trim="initialSupply"
            />
          </a-col>
          <a-col flex="1" class="view-no-padding-right">
            <a-input
              allowClear
              :addonBefore="
                $t('View.TokenCreate.template.content.divisiblePrecision')
              "
              :placeholder="
                $t(
                  'View.TokenCreate.template.content.divisiblePrecisionDecimal',
                )
              "
              v-model:value.trim="divisiblePrecision"
            />
          </a-col>
        </a-row>
      </div>

      <a-divider
        >「
        {{ $t("View.TokenCreate.template.content.divider.metadata") }}
        」</a-divider
      >

      <a-row :gutter="gutter">
        <a-col style="padding-top: 5px" class="view-no-padding-left">
          <a-tooltip placement="right">
            <template #title>{{
              $t("View.PackageDeploy.template.header.lock")
            }}</template>
            <a-checkbox v-model:checked="tokenNameCheck"></a-checkbox>
          </a-tooltip>
        </a-col>

        <a-col flex="1">
          <a-input
            class="view-max-width"
            showCount
            allowClear
            :addonBefore="$t('View.TokenCreate.template.content.tokenName')"
            :placeholder="
              $t('View.TokenCreate.template.content.tokenNamePlaceholder')
            "
            v-model:value.trim="tokenName"
          />
        </a-col>

        <a-col flex="1">
          <a-input
            allowClear
            showCount
            :addonBefore="$t('View.TokenCreate.template.content.tokenSymbol')"
            :placeholder="
              $t('View.TokenCreate.template.content.tokenSymbolPlaceholder')
            "
            v-model:value.trim="tokenSymbol"
          />
        </a-col>

        <a-col class="view-no-padding-right" style="padding-top: 5px">
          <a-tooltip placement="left">
            <template #title>{{
              $t("View.PackageDeploy.template.header.lock")
            }}</template>
            <a-checkbox v-model:checked="tokenSymbolCheck"></a-checkbox>
          </a-tooltip>
        </a-col>
      </a-row>

      <a-row :gutter="gutter">
        <a-col style="padding-top: 5px" class="view-no-padding-left">
          <a-tooltip placement="right">
            <template #title>{{
              $t("View.PackageDeploy.template.header.lock")
            }}</template>
            <a-checkbox v-model:checked="iconLinkCheck"></a-checkbox>
          </a-tooltip>
        </a-col>

        <a-col flex="1">
          <a-input
            class="view-max-width"
            allowClear
            :addonBefore="$t('View.TokenCreate.template.content.iconUrl')"
            :placeholder="
              $t('View.TokenCreate.template.content.iconUrlPlaceholder')
            "
            v-model:value.trim="iconLink"
          />
        </a-col>

        <a-col flex="1">
          <a-input
            allowClear
            :addonBefore="$t('View.TokenCreate.template.content.infoUrl')"
            :placeholder="
              $t('View.TokenCreate.template.content.infoUrlPlaceholder')
            "
            v-model:value.trim="infoLink"
          />
        </a-col>

        <a-col class="view-no-padding-right" style="padding-top: 5px">
          <a-tooltip placement="left">
            <template #title>{{
              $t("View.PackageDeploy.template.header.lock")
            }}</template>
            <a-checkbox v-model:checked="infoLinkCheck"></a-checkbox>
          </a-tooltip>
        </a-col>
      </a-row>

      <a-row
        :gutter="gutter"
        :class="settingsMode || tokenType ? 'no-margin-row' : ''"
      >
        <a-col style="padding-top: 5px" class="view-no-padding-left">
          <a-tooltip placement="right">
            <template #title>{{
              $t("View.PackageDeploy.template.header.lock")
            }}</template>
            <a-checkbox v-model:checked="tokenTagsCheck"></a-checkbox>
          </a-tooltip>
        </a-col>

        <a-col flex="1">
          <a-input
            class="view-max-width"
            allowClear
            :addonBefore="$t('View.TokenCreate.template.content.tokenTags')"
            :placeholder="
              $t('View.TokenCreate.template.content.tokenTagsPlaceholder')
            "
            v-model:value.trim="tokenTags"
          />
        </a-col>

        <a-col flex="1">
          <a-input
            showCount
            allowClear
            :addonBefore="
              $t('View.TokenCreate.template.content.tokenDescription')
            "
            :placeholder="
              $t(
                'View.TokenCreate.template.content.tokenDescriptionPlaceholder',
              )
            "
            v-model:value.trim="description"
          />
        </a-col>

        <a-col class="view-no-padding-right" style="padding-top: 5px">
          <a-tooltip placement="left">
            <template #title>{{
              $t("View.PackageDeploy.template.header.lock")
            }}</template>
            <a-checkbox v-model:checked="descriptionCheck"></a-checkbox>
          </a-tooltip>
        </a-col>
      </a-row>

      <!-- @vue-skip -->
      <div v-if="settingsMode">
        <a-divider
          >「
          {{ $t("View.TokenCreate.template.content.divider.authRoles") }}
          」</a-divider
        >

        <a-row :gutter="gutter" justify="center">
          <a-col span="8" class="view-no-padding-left">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.ownerRole.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="rolesAuthOptions.ownerRole.authOptions"
                v-model:value="authValues.ownerRole"
                @select="
                  (v: number) => {
                    if (v === 1 || v === 2) {
                      focusInput = 'resourceAddress';
                      openResourceModal = true;
                    }
                  }
                "
              >
                <template #option="{ value, label }">
                  <a-tooltip placement="right">
                    <template #title v-if="value === 1"
                      >{{
                        $t(
                          "View.PackageDeploy.template.header.select.tooltip.1",
                        )
                      }}
                    </template>
                    <template #title v-if="value === 2"
                      >{{
                        $t(
                          "View.PackageDeploy.template.header.select.tooltip.2",
                        )
                      }}
                    </template>
                    <span>{{ label }}</span>
                  </a-tooltip>
                </template>
              </a-select>
            </a-input-group>
          </a-col>

          <a-col style="padding-top: 5px; text-align: center">
            <a-tooltip>
              <template #title>{{
                $t("View.PackageDeploy.template.header.lock")
              }}</template>

              <a-checkbox
                v-model:checked="lock"
                :disabled="authValues.ownerRole === 3"
              />
            </a-tooltip>
          </a-col>
        </a-row>

        <a-row :gutter="gutter">
          <a-col flex="1" class="view-no-padding-left">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.minter.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.minter"
              />
            </a-input-group>
          </a-col>

          <a-col flex="1" class="view-no-padding-right">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.minterUpdater.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.minterUpdater"
              />
            </a-input-group>
          </a-col>
        </a-row>

        <a-row :gutter="gutter">
          <a-col flex="1" class="view-no-padding-left">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.burner.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.burner"
              />
            </a-input-group>
          </a-col>

          <a-col flex="1" class="view-no-padding-right">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.burnerUpdater.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.burnerUpdater"
              />
            </a-input-group>
          </a-col>
        </a-row>

        <a-row :gutter="gutter">
          <a-col flex="1" class="view-no-padding-left">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.freezer.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.freezer"
              />
            </a-input-group>
          </a-col>

          <a-col flex="1" class="view-no-padding-right">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.freezerUpdater.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.freezerUpdater"
              />
            </a-input-group>
          </a-col>
        </a-row>

        <a-row :gutter="gutter">
          <a-col flex="1" class="view-no-padding-left">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.recaller.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.recaller"
              />
            </a-input-group>
          </a-col>

          <a-col flex="1" class="view-no-padding-right">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.recallerUpdater.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.recallerUpdater"
              />
            </a-input-group>
          </a-col>
        </a-row>

        <a-row :gutter="gutter">
          <a-col flex="1" class="view-no-padding-left">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.withdrawer.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.withdrawer"
              />
            </a-input-group>
          </a-col>

          <a-col flex="1" class="view-no-padding-right">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.withdrawerUpdater.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.withdrawerUpdater"
              />
            </a-input-group>
          </a-col>
        </a-row>

        <a-row :gutter="gutter">
          <a-col flex="1" class="view-no-padding-left">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.depositor.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.depositor"
              />
            </a-input-group>
          </a-col>

          <a-col flex="1" class="view-no-padding-right">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.depositorUpdater.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.depositorUpdater"
              />
            </a-input-group>
          </a-col>
        </a-row>

        <a-row :gutter="gutter">
          <a-col flex="1" class="view-no-padding-left">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.metadataSetter.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.metadataSetter"
              />
            </a-input-group>
          </a-col>

          <a-col flex="1" class="view-no-padding-right">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.metadataSetterUpdater.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.metadataSetterUpdater"
              />
            </a-input-group>
          </a-col>
        </a-row>

        <a-row :gutter="gutter">
          <a-col flex="1" class="view-no-padding-left">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.metadataLocker.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.metadataLocker"
              />
            </a-input-group>
          </a-col>

          <a-col flex="1" class="view-no-padding-right">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.metadataLockerUpdater.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.metadataLockerUpdater"
              />
            </a-input-group>
          </a-col>
        </a-row>

        <a-row :gutter="gutter" v-if="tokenType" class="no-margin-row">
          <a-col flex="1" class="view-no-padding-left">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.nftDataSetter.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.nftDataSetter"
              />
            </a-input-group>
          </a-col>

          <a-col flex="1" class="view-no-padding-right">
            <a-input-group compact style="display: flex">
              <a-select
                value="label"
                :open="false"
                :bordered="false"
                :show-arrow="false"
                class="view-nft-selector-label"
              >
                <a-select-option value="label">{{
                  rolesAuthOptions.nftDataSetterUpdater.label
                }}</a-select-option>
              </a-select>

              <a-select
                class="view-nft-selector"
                :options="authOptions"
                v-model:value="authValues.nftDataSetterUpdater"
              />
            </a-input-group>
          </a-col>
        </a-row>
      </div>

      <div v-if="tokenType">
        <a-divider
          >「
          {{ $t("View.TokenCreate.template.content.divider.nftFields") }}
          」</a-divider
        >

        <a-row>
          <a-col flex="1">
            <a-tooltip placement="topLeft">
              <template #title
                >{{
                  $t(
                    "View.TokenCreate.template.content.nftFieldsInput.placeholder",
                  )
                }}
              </template>

              <a-input
                showCount
                allowClear
                v-model:value.trim="nftFieldsStr"
                :placeholder="
                  $t(
                    'View.TokenCreate.template.content.nftFieldsInput.placeholder',
                  )
                "
              />
            </a-tooltip>
          </a-col>
        </a-row>

        <a-row class="no-margin-row" :gutter="gutter">
          <template v-for="(field, index) in fieldsView">
            <a-col
              span="7"
              :class="index % 3 === 0 ? 'view-no-padding-left' : ''"
            >
              <a-input-group
                compact
                :style="{
                  display: 'flex',
                  marginBottom: fieldsView.length - index > 3 ? '20px' : '0',
                }"
              >
                <a-select
                  value="label"
                  :open="false"
                  :bordered="false"
                  :show-arrow="false"
                  class="view-nft-selector-label"
                >
                  <a-select-option value="label">{{
                    field.name
                  }}</a-select-option>
                </a-select>

                <a-select
                  :disabled="field.disabled"
                  class="view-nft-selector"
                  :options="nftFieldOptions"
                  v-model:value="field.value"
                />
              </a-input-group>
            </a-col>

            <a-col
              span="1"
              style="padding-top: 5px; text-align: center"
              :class="index % 3 === 2 ? 'view-no-padding-right' : ''"
            >
              <a-tooltip>
                <template #title>{{
                  $t("View.PackageDeploy.template.header.lock")
                }}</template>
                <a-checkbox v-model:checked="field.lock" />
              </a-tooltip>
            </a-col>
          </template>
        </a-row>
      </div>

      <div v-if="tokenType">
        <a-divider
          >「
          {{ $t("View.TokenCreate.template.content.nftList") }}
          」</a-divider
        >

        <a-row :gutter="20" class="no-margin-row">
          <template v-for="(_, index) in nftList">
            <a-col
              span="6"
              style="margin-bottom: 20px"
              :class="
                index % 4 === 0
                  ? 'view-no-padding-left'
                  : index % 4 === 3
                    ? 'view-no-padding-right'
                    : ''
              "
            >
              <a-tooltip color="white">
                <template #title>
                  <a-button
                    :text="`${$t(
                      'View.TokenTransfer.MultipleToMultiple.template.content.deleteBtn.tooltip',
                    )} #${index}# ?`"
                    class="custom-btn"
                    @click="deleteNFT(index)"
                    >{{
                      `${$t(
                        "View.TokenTransfer.MultipleToMultiple.template.content.deleteBtn.tooltip",
                      )} #${index}# ?`
                    }}</a-button
                  >
                </template>

                <a-card @click="activateNftModal(index)">{{
                  `#${index}#`
                }}</a-card>
              </a-tooltip>
            </a-col>
          </template>

          <a-col
            span="6"
            style="margin-bottom: 20px"
            :class="
              nftList.length % 4 === 0
                ? 'view-no-padding-left'
                : nftList.length % 4 === 3
                  ? 'view-no-padding-right'
                  : ''
            "
          >
            <a-card @click="addNFT">{{
              `${$t("View.TokenCreate.template.content.addNft")} NFT`
            }}</a-card>
          </a-col>
        </a-row>
      </div>

      <a-row>
        <a-col>
          <!-- @vue-skip -->
          <a-statistic :title="$t('View.PackageDeploy.template.content.owner')">
            <template #formatter v-if="authValues.ownerRole === 0">
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
            <template #formatter v-if="authValues.ownerRole === 1">
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
              <a-tag v-if="resourceAddress.length"
                >{{ resourceAddress }}
              </a-tag>
            </template>
            <template #formatter v-if="authValues.ownerRole === 2">
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
              <a-tag v-if="resourceAddress.length"
                >{{ resourceAddress }}
              </a-tag>
              <br />
              <a-tag v-if="nftId.length">{{ nftId }} </a-tag>
            </template>
            <template #formatter v-if="authValues.ownerRole === 3">
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
  Ownership,
  getCurrentEpoch,
  TransactionStatus,
  ResourcesOfAccount,
  RadixNetworkChecker,
  RadixWalletGenerator,
  CustomManifestExecutor,
} from "@atlantis-l/radix-tool";
import { CreateIcon, formatNumber, selectXrdAddress } from "../common";
import { message } from "ant-design-vue";
import { defineComponent } from "vue";
import store from "../stores/store";

enum AuthRule {
  Owner,
  DenyAll,
  AllowAll,
}

interface Field {
  name: string;
  value: number;
  lock: boolean;
  disabled: boolean;
}

export default defineComponent({
  components: {
    CreateIcon,
  },
  data() {
    return {
      nftId: "",
      gutter: 10,
      feeLock: "",
      nftIndex: 0,
      lock: false,
      iconLink: "",
      tokenType: 0,
      infoLink: "",
      tokenName: "",
      tokenTags: "",
      store: store(),
      focusInput: "",
      tokenSymbol: "",
      description: "",
      settingsMode: 0,
      initialSupply: "",
      openNftModal: false,
      resourceAddress: "",
      feeLockEstimate: "",
      iconLinkCheck: false,
      infoLinkCheck: false,
      isPreviewDone: false,
      tokenTagsCheck: false,
      tokenNameCheck: false,
      feePayerXrdBalance: "",
      transactionMessage: "",
      divisiblePrecision: "",
      tokenSymbolCheck: false,
      nftList: [] as object[],
      descriptionCheck: false,
      openFeePayerModal: false,
      openResourceModal: false,
      feePayerWalletPrivateKey: "",
      openConfirmTransaction: false,
      nftFields: undefined as Field[] | undefined,
      nftFieldsStr: "name,description,key_image_url",
      feePayerWallet: undefined as Wallet | undefined,
      networkChecker: new RadixNetworkChecker(store().networkId),
      walletGenerator: new RadixWalletGenerator(store().networkId),
      manifestExecutor: new CustomManifestExecutor(
        store().networkId,
        //@ts-ignore
        undefined,
      ),
      authValues: {
        ownerRole: 3,
        minter: 1,
        minterUpdater: 1,
        burner: 1,
        burnerUpdater: 1,
        freezer: 1,
        freezerUpdater: 1,
        recaller: 1,
        recallerUpdater: 1,
        withdrawer: 2,
        withdrawerUpdater: 1,
        depositor: 2,
        depositorUpdater: 1,
        metadataSetter: 0,
        metadataSetterUpdater: 0,
        metadataLocker: 0,
        metadataLockerUpdater: 0,
        nftDataSetter: 0,
        nftDataSetterUpdater: 0,
      },
    };
  },
  watch: {
    lock() {
      this.isPreviewDone = false;
    },
    nftId() {
      this.isPreviewDone = false;
      if (this.nftId.includes(":")) {
        this.nftId = this.nftId.split(":")[1];
      }
    },
    nftList() {
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
    "store.networkId"(id: number) {
      this.networkChecker.networkId = id;
      this.walletGenerator.networkId = id;
      this.manifestExecutor.networkId = id;
    },
    "authValues.ownerRole"(value: number) {
      if (value === 3) {
        this.lock = true;
      } else {
        this.lock = false;
      }
    },
  },
  computed: {
    fieldsView() {
      const fields = this.nftFieldsStr.split(",");

      this.nftFields = fields.map((field, index) => ({
        name: field,
        value: index === 2 ? 1 : 0,
        lock: false,
        disabled: index < 3,
      }));

      this.nftList = [];

      return this.nftFields;
    },
    authOptions() {
      return [
        {
          label: this.$t("View.TokenCreate.template.content.ownerRole"),
          value: 0,
        },
        {
          label: this.$t("View.TokenCreate.script.denyAll"),
          value: 1,
        },
        {
          label: this.$t("View.PackageDeploy.template.header.select.0"),
          value: 2,
        },
      ];
    },
    nftFieldOptions() {
      return [
        {
          label: this.$t("View.TokenCreate.script.string"),
          value: 0,
        },
        {
          label: this.$t(
            "View.TokenCreate.template.content.iconUrlPlaceholder",
          ),
          value: 1,
        },
      ];
    },
    feePayerAddress() {
      return this.feePayerWallet ? this.feePayerWallet.address : undefined;
    },
    rolesAuthOptions() {
      return {
        ownerRole: {
          label: this.$t("View.TokenCreate.template.content.ownerRole"),
          authOptions: [
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
          ],
        },
        minter: {
          label: this.$t("View.TokenCreate.script.minter"),
        },
        minterUpdater: {
          label: this.$t("View.TokenCreate.script.minterUpdater"),
        },
        burner: {
          label: this.$t("View.TokenCreate.script.burner"),
        },
        burnerUpdater: {
          label: this.$t("View.TokenCreate.script.burnerUpdater"),
        },
        freezer: {
          label: this.$t("View.TokenCreate.script.freezer"),
        },
        freezerUpdater: {
          label: this.$t("View.TokenCreate.script.freezerUpdater"),
        },
        recaller: {
          label: this.$t("View.TokenCreate.script.recaller"),
        },
        recallerUpdater: {
          label: this.$t("View.TokenCreate.script.recallerUpdater"),
        },
        withdrawer: {
          label: this.$t("View.TokenCreate.script.withdrawer"),
        },
        withdrawerUpdater: {
          label: this.$t("View.TokenCreate.script.withdrawerUpdater"),
        },
        depositor: {
          label: this.$t("View.TokenCreate.script.depositor"),
        },
        depositorUpdater: {
          label: this.$t("View.TokenCreate.script.depositorUpdater"),
        },
        metadataSetter: {
          label: this.$t("View.TokenCreate.script.metadataSetter"),
        },
        metadataSetterUpdater: {
          label: this.$t("View.TokenCreate.script.metadataSetterUpdater"),
        },
        metadataLocker: {
          label: this.$t("View.TokenCreate.script.metadatalocker"),
        },
        metadataLockerUpdater: {
          label: this.$t("View.TokenCreate.script.metadatalockerUpdater"),
        },
        nftDataSetter: {
          label: this.$t("View.TokenCreate.script.nftDataSetter"),
        },
        nftDataSetterUpdater: {
          label: this.$t("View.TokenCreate.script.nftDataSetterUpdater"),
        },
      };
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
    addNFT() {
      let NFT = {};

      if (this.nftList.length) {
        NFT = JSON.parse(JSON.stringify(this.nftList[this.nftList.length - 1]));
      } else {
        this.nftFields?.forEach((field) => {
          //@ts-ignore
          NFT[field.name] = "";
        });
      }

      this.nftList?.push(NFT);
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
    async estimateFee() {
      if (!this.feePayerAddress) {
        message.warn(
          `「 ${this.$t(
            `View.TokenTransfer.SingleToMultiple.template.header.dataNotValid`,
          )} 」`,
        );
        return;
      }

      if (
        this.tokenType === 0 &&
        (!this.initialSupply.length || !this.divisiblePrecision.length)
      ) {
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
    deleteNFT(id: number) {
      this.nftList?.splice(id, 1);
    },
    generateManifestStr() {
      const mutableFields = [] as string[];

      this.nftFields?.forEach((field) => {
        !field.lock && mutableFields.push(field.name);
      });

      return `
      CALL_METHOD
          Address("${this.feePayerAddress}")
          "lock_fee"
          Decimal("${this.feeLock.length ? this.feeLock : "0"}")
      ;
      ${
        this.tokenType
          ? `
      CREATE_NON_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY
          `
          : `
      CREATE_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY
          `
      }
          ${this.generateOwnerRoleStr()}
          ${
            this.tokenType
              ? `
          Enum<1u8>()
            `
              : ""
          }
          true
          ${
            this.tokenType
              ? `
          Enum<0u8>(
              Enum<0u8>(
                  Tuple(
                      Array<Enum>(
                          Enum<14u8>(
                              Array<Enum>(
                                  ${this.nftFields
                                    ?.map(
                                      (field) =>
                                        `Enum<0u8>(${
                                          field.value ? "198u8" : "12u8"
                                        })`,
                                    )
                                    .join(",\n")}
                              )
                          )
                      ),
                      Array<Tuple>(
                          Tuple(
                              Enum<1u8>(
                                  "DataSchema"
                              ),
                              Enum<1u8>(
                                  Enum<0u8>(
                                      Array<String>(
                                          ${this.nftFields
                                            ?.map((field) => `"${field.name}"`)
                                            .join(",\n")}
                                      )
                                  )
                              )
                          )
                      ),
                      Array<Enum>(
                          Enum<0u8>()
                      )
                  )
              ),
              Enum<1u8>(
                  0u64
              ),
              Array<String>(
                  ${mutableFields.map((field) => `"${field}"`).join(",\n")}
              )
          )
              `
              : ""
          }
          ${
            this.tokenType
              ? `
          Map<NonFungibleLocalId, Tuple>(
              ${this.nftList
                ?.map((nft, index) => {
                  return `
              NonFungibleLocalId("#${index}#") => Tuple(
                  Tuple(
                      ${this.nftFields
                        ?.map((field) => {
                          //@ts-ignore
                          return `"${nft[field.name]}"`;
                        })
                        .join(",\n")}
                  )
              )
                  `;
                })
                .join(",\n")}
          )
            `
              : ""
          }
          ${
            !this.tokenType
              ? `
          ${this.divisiblePrecision}u8
          Decimal("${this.initialSupply}")
            `
              : ""
          }
          Tuple(
              Enum<1u8>(
                  Tuple(
                      ${this.generateAuthRoleStr(this.authValues.minter)},
                      ${this.generateAuthRoleStr(this.authValues.minterUpdater)}
                  )
              ),
              Enum<1u8>(
                  Tuple(
                      ${this.generateAuthRoleStr(this.authValues.burner)},
                      ${this.generateAuthRoleStr(this.authValues.burnerUpdater)}
                  )
              ),
              Enum<1u8>(
                  Tuple(
                      ${this.generateAuthRoleStr(this.authValues.freezer)},
                      ${this.generateAuthRoleStr(
                        this.authValues.freezerUpdater,
                      )}
                  )
              ),
              Enum<1u8>(
                  Tuple(
                      ${this.generateAuthRoleStr(this.authValues.recaller)},
                      ${this.generateAuthRoleStr(
                        this.authValues.recallerUpdater,
                      )}
                  )
              ),
              Enum<1u8>(
                  Tuple(
                      ${this.generateAuthRoleStr(this.authValues.withdrawer)},
                      ${this.generateAuthRoleStr(
                        this.authValues.withdrawerUpdater,
                      )}
                  )
              ),
              Enum<1u8>(
                  Tuple(
                      ${this.generateAuthRoleStr(this.authValues.depositor)},
                      ${this.generateAuthRoleStr(
                        this.authValues.depositorUpdater,
                      )}
                  )
              )${this.tokenType ? "," : ""}
              ${
                this.tokenType
                  ? `
              Enum<1u8>(
                  Tuple(
                      ${this.generateAuthRoleStr(
                        this.authValues.nftDataSetter,
                      )},
                      ${this.generateAuthRoleStr(
                        this.authValues.nftDataSetterUpdater,
                      )}
                  )
              )
                `
                  : ""
              }
          )
          Tuple(
              Map<String, Tuple>(
                  "name" => Tuple(
                      Enum<1u8>(
                          Enum<0u8>(
                              "${this.tokenName}"
                          )
                      ),
                      ${this.tokenNameCheck}
                  )
                  ${
                    this.tokenSymbol.length
                      ? `
                  ,
                  "symbol" => Tuple(
                      Enum<1u8>(
                          Enum<0u8>(
                              "${this.tokenSymbol}"
                          )
                      ),
                      ${this.tokenSymbolCheck}
                  )  
                    `
                      : ""
                  }
                  ${
                    this.iconLink.length
                      ? `
                  ,
                  "icon_url" => Tuple(
                      Enum<1u8>(
                          Enum<13u8>(
                              "${this.iconLink}"
                          )
                      ),
                      ${this.iconLinkCheck}
                  )
                    `
                      : ""
                  }
                  ${
                    this.description.length
                      ? `
                  ,
                  "description" => Tuple(
                      Enum<1u8>(
                          Enum<0u8>(
                              "${this.description}"
                          )
                      ),
                      ${this.descriptionCheck}
                  )
                  `
                      : ""
                  }
                  ${
                    this.tokenTags.length
                      ? `
                  ,
                  "tags" => Tuple(
                      Enum<1u8>(
                          Enum<128u8>(
                              Array<String>(
                                  ${this.tokenTags

                                    .split(",")
                                    .map((v) => `"${v}"`)
                                    .join(",\n")}
                              )
                          )
                      ),
                      ${this.tokenTagsCheck}
                  )  
                  `
                      : ""
                  }
                  ${
                    this.infoLink.length
                      ? `
                  ,
                  "info_url" => Tuple(
                      Enum<1u8>(
                          Enum<13u8>(
                              "${this.infoLink}"
                          )
                      ),
                      ${this.infoLinkCheck}
                  )
                    `
                      : ""
                  }
              ),
              Map<String, Enum>(
                  "metadata_setter" => ${this.generateAuthRoleStr(
                    this.authValues.metadataSetter,
                  )},
                  "metadata_setter_updater" => ${this.generateAuthRoleStr(
                    this.authValues.metadataSetterUpdater,
                  )},
                  "metadata_locker" => ${this.generateAuthRoleStr(
                    this.authValues.metadataLocker,
                  )},
                  "metadata_locker_updater" => ${this.generateAuthRoleStr(
                    this.authValues.metadataLockerUpdater,
                  )}
              )
          )
          Enum<0u8>()
      ;
      CALL_METHOD
          Address("${this.feePayerAddress}")
          "try_deposit_batch_or_abort"
          Expression("ENTIRE_WORKTOP")
          Enum<0u8>()
      ;
      `;
    },
    generateOwnerRoleStr() {
      let ownerRoleStr: string | undefined;

      let ownerResource = this.resourceAddress;

      if (this.nftId.length) {
        ownerResource += `:${this.nftId}`;
      }

      const ownership = this.authValues.ownerRole;

      if (ownership === Ownership.AllowAll) {
        if (this.lock) {
          ownerRoleStr = `
            Enum<1u8>(
                Enum<0u8>()
            )
        `;
        } else {
          ownerRoleStr = `
            Enum<2u8>(
                Enum<0u8>()
            )
        `;
        }
      }

      if (ownership === Ownership.Resource) {
        if (this.lock) {
          ownerRoleStr = `
            Enum<1u8>(
                Enum<2u8>(
                    Enum<0u8>(
                        Enum<0u8>(
                            Enum<1u8>(
                                Address("${ownerResource}")
                            )
                        )
                    )
                )
            )
        `;
        } else {
          ownerRoleStr = `
            Enum<2u8>(
                Enum<2u8>(
                    Enum<0u8>(
                        Enum<0u8>(
                            Enum<1u8>(
                                Address("${ownerResource}")
                            )
                        )
                    )
                )
            )
        `;
        }
      }

      if (ownership === Ownership.NFT) {
        if (this.lock) {
          ownerRoleStr = `
            Enum<1u8>(
                Enum<2u8>(
                    Enum<0u8>(
                        Enum<0u8>(
                            Enum<0u8>(
                                NonFungibleGlobalId("${ownerResource}")
                            )
                        )
                    )
                )
            )
        `;
        } else {
          ownerRoleStr = `
            Enum<2u8>(
                Enum<2u8>(
                    Enum<0u8>(
                        Enum<0u8>(
                            Enum<0u8>(
                                NonFungibleGlobalId("${ownerResource}")
                            )
                        )
                    )
                )
            )
        `;
        }
      }

      if (ownership === Ownership.None) {
        ownerRoleStr = `
          Enum<0u8>()
      `;
      }

      return ownerRoleStr;
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

      message.loading({
        key,
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.sendTransaction.loading`,
        )} 」`,
      });

      const txMessage = this.transactionMessage;

      const result = await this.manifestExecutor.execute(
        this.generateManifestStr(),
        [],
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
      this.manifestExecutor.executorWallet = this.feePayerWallet as Wallet;

      const key = "previewTransaction";

      message.loading({
        key,
        duration: 0,
        content: `「 ${this.$t(
          `View.TokenTransfer.MultipleToMultiple.script.methods.previewTransaction.loading`,
        )} 」`,
      });

      try {
        const result = await this.manifestExecutor.executePreview(
          this.generateManifestStr(),
          [],
          await getCurrentEpoch(this.store.networkId),
        );

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
    activateNftModal(index: number) {
      this.nftIndex = index;

      this.openNftModal = true;
    },
    generateAuthRoleStr(rule: AuthRule) {
      let authRoleStr: string | undefined;

      if (rule === AuthRule.Owner) {
        authRoleStr = `
        Enum<0u8>()
        `;
      }

      if (rule === AuthRule.DenyAll) {
        authRoleStr = `
        Enum<1u8>(
            Enum<1u8>()
        )
        `;
      }

      if (rule === AuthRule.AllowAll) {
        authRoleStr = `
        Enum<1u8>(
            Enum<0u8>()
        )
        `;
      }

      return authRoleStr;
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
    if (this.authValues.ownerRole === 3) {
      this.lock = true;
    } else {
      this.lock = false;
    }
  },
});
</script>

<style scoped>
.ant-layout {
  background-color: #ffffff !important;
}

.modal-div::-webkit-scrollbar {
  display: none !important;
}

.ant-statistic .ant-tag {
  font-size: 18px !important;
}

.view-nft-selector {
  flex: 1 !important;
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

.ant-card {
  cursor: pointer;
  user-select: none !important;
  background-position: 70% 45%;
  text-align: center !important;
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

.ant-card {
  font-size: 23px !important;
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
