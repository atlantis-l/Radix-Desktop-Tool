<template>
  <a-layout class="view-layout">
    <a-modal
      centered
      :footer="null"
      destroyOnClose
      style="width: 800px"
      v-model:open="openVaultModal"
    >
      <template #title>
        <a-row :gutter="gutter">
          <a-col class="view-no-padding-left">
            <a-tag color="blue" style="cursor: default !important"
              >{{ `#${vaultIndex + 1}` }}
            </a-tag>
          </a-col>

          <a-col class="view-no-padding-right">
            <a-tag @click="copy(vaultAddress)">
              <template #icon>
                <TagTwoTone two-tone-color="#1677ff" /> </template
              >{{ vaultAddress }}
            </a-tag>
          </a-col>
        </a-row>
      </template>

      <a-card style="max-height: 500px; overflow: scroll">
        <!-- @vue-skip -->
        <a-card
          hoverable
          :style="{
            marginBottom:
              vaultMap.get(vaultAddress).length - index === 1 ? '0' : '20px',
          }"
          v-for="(id, index) in vaultMap.get(vaultAddress)"
        >
          <a-row justify="center" class="no-margin-row">
            <a-col>
              <a-tag color="purple" style="display: inline" @click="copy(id)">
                {{ id }}
              </a-tag>
            </a-col>
          </a-row>
        </a-card>
      </a-card>
    </a-modal>

    <!------------------------ Header ------------------------>
    <a-row :gutter="gutter">
      <a-col span="20" class="view-no-padding-left">
        <a-input
          allowClear
          ref="address"
          :placeholder="
            $t(`View.HistoryCheck.template.header.input.placeholder`)
          "
          @keyup.enter="check"
          v-model:value.trim="address"
        />
      </a-col>
      <a-col span="4" class="view-no-padding-right">
        <a-button
          class="view-max-width custom-btn"
          :text="$t('View.EntityCheck.template.check')"
          @click="check"
          >{{ $t("View.EntityCheck.template.check") }}</a-button
        >
      </a-col>
    </a-row>

    <a-row :gutter="20">
      <a-col span="12" class="view-no-padding-left">
        <a-segmented
          block
          size="middle"
          style="user-select: none"
          v-model:value="segmented"
          @change="switchPage"
          :options="[
            {
              label: $t('View.AssetCheck.template.fungible'),
              value: 0,
            },
            {
              label: $t('View.AssetCheck.template.non-fungible'),
              value: 1,
            },
          ]"
        />
      </a-col>

      <a-col span="12" class="view-no-padding-right">
        <a-input
          allowClear
          v-model:value.trim="search"
          :placeholder="$t('View.AssetCheck.template.search.placeholder')"
        />
      </a-col>
    </a-row>
    <!------------------------ Header ------------------------>

    <!------------------------ Content ------------------------>
    <a-layout-content class="view-layout-content">
      <Transition name="fade" mode="out-in">
        <!------------------------ Fungible Token ------------------------>
        <div v-if="isFungiblePage">
          <a-row :gutter="20" class="no-margin-row">
            <a-col span="12" class="view-no-padding-left">
              <TransitionGroup name="list">
                <template v-for="(item, index) in items[0]">
                  <div
                    class="view-card asset-check-card"
                    v-if="index % 2 === 0"
                    :style="{
                      marginBottom:
                        index === 0
                          ? '20px'
                          : items[0].length % 2 === 0
                            ? items[0].length - index === 2
                              ? '0'
                              : '20px'
                            : items[0].length - index === 1
                              ? '0'
                              : '20px',
                    }"
                  >
                    <a-card
                      class="view-max-width"
                      :tabList="tabList"
                      :activeTabKey="fungibleKeyArr[index]"
                      @tabChange="
                        (key: string) => onFungibleTabChange(key, index)
                      "
                    >
                      <!-- @vue-skip -->
                      <template #title>
                        <a-avatar
                          style="user-select: none; width: 64px; height: 64px"
                        >
                          <template #icon>
                            <img
                              draggable="false"
                              v-if="
                                resourceMap.get(item.resource_address).icon_url
                              "
                              :src="
                                isXrdAddress(item.resource_address)
                                  ? 'Radix.webp'
                                  : resourceMap.get(item.resource_address)
                                      .icon_url
                              "
                              onerror="this.src='img_onerror.png'"
                            />
                          </template>
                        </a-avatar>

                        <a-tooltip destroyTooltipOnHide placement="topLeft">
                          <template #title
                            >{{
                              resourceMap.get(item.resource_address).name
                                ? resourceMap.get(item.resource_address).name
                                : resourceMap.get(item.resource_address).symbol
                                  ? resourceMap.get(item.resource_address)
                                      .symbol
                                  : $t(
                                      `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                                    )
                            }}
                          </template>
                          <span class="token-title">
                            {{
                              resourceMap.get(item.resource_address).symbol
                                ? resourceMap.get(item.resource_address).symbol
                                : resourceMap.get(item.resource_address).name
                                  ? resourceMap.get(item.resource_address).name
                                  : $t(
                                      `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                                    )
                            }}
                          </span>
                        </a-tooltip>
                      </template>

                      <template #extra>
                        <a-tooltip destroyTooltipOnHide placement="left">
                          <template #title>
                            <span
                              style="cursor: pointer"
                              @click="copy(item.resource_address)"
                              >{{ item.resource_address }}
                            </span>
                          </template>

                          <a-tag
                            color="blue"
                            @click="copy(item.resource_address)"
                          >
                            {{
                              `${item.resource_address.slice(
                                0,
                                8,
                              )}...${item.resource_address.slice(
                                item.resource_address.length - 6,
                              )}`
                            }}
                          </a-tag>
                        </a-tooltip>
                      </template>

                      <span v-if="fungibleKeyArr[index] === '0'">
                        <a-card
                          hoverable
                          v-for="(vault, i) in item.vaults.items"
                          :style="{
                            marginBottom:
                              i + 1 === item.vaults.items.length ? '0' : '20px',
                          }"
                        >
                          <a-row class="no-margin-row">
                            <a-col>
                              <a-tooltip destroyTooltipOnHide placement="left">
                                <template #title>
                                  <span
                                    style="cursor: pointer"
                                    @click="copy(vault.vault_address)"
                                  >
                                    {{ vault.vault_address }}
                                  </span>
                                </template>
                                <a-tag
                                  color="blue"
                                  @click="copy(vault.vault_address)"
                                  >{{ `#${i + 1}` }}</a-tag
                                >
                              </a-tooltip>
                            </a-col>

                            <a-col flex="1" />

                            <a-col>
                              <a-tooltip destroyTooltipOnHide placement="left">
                                <template #title>
                                  <span
                                    style="cursor: pointer"
                                    @click="copy(vault.amount)"
                                  >
                                    {{ formatNumber(vault.amount) }}
                                  </span>
                                </template>
                                <a-tag
                                  color="purple"
                                  @click="copy(vault.amount)"
                                >
                                  {{ formatNumber(vault.amount) }}
                                </a-tag>
                              </a-tooltip>
                            </a-col>
                          </a-row>
                        </a-card>
                      </span>

                      <span v-else-if="fungibleKeyArr[index] === '1'">
                        <!-- @vue-skip -->
                        <a-card
                          hoverable
                          v-for="(info, info_index) in resourceMap.get(
                            item.resource_address,
                          ).infos"
                          :style="{
                            marginBottom:
                              info_index + 1 ===
                              resourceMap.get(item.resource_address).infos
                                .length
                                ? '0'
                                : '20px',
                          }"
                        >
                          <a-row class="no-margin-row">
                            <a-col>
                              <a-tag
                                color="blue"
                                style="cursor: default !important"
                              >
                                {{ $t(`View.AssetCheck.template.${info.t}`) }}
                              </a-tag>
                            </a-col>
                            <a-col flex="1" />
                            <!-- @vue-skip -->
                            <a-col>
                              <a-tooltip destroyTooltipOnHide placement="left">
                                <template #title>
                                  <span
                                    @click="copy(info.value)"
                                    style="cursor: pointer"
                                    >{{
                                      info.key === "tags"
                                        ? info.value.join(", ")
                                        : info.key.startsWith("total")
                                          ? formatNumber(info.value)
                                          : info.value
                                    }}</span
                                  >
                                </template>

                                <a-tag @click="copy(info.value)" color="purple">
                                  {{
                                    info.key === "tags"
                                      ? info.value.join(", ")
                                      : info.key.startsWith("total")
                                        ? formatNumber(info.value)
                                        : info.value
                                  }}
                                </a-tag>
                              </a-tooltip>
                            </a-col>
                          </a-row>
                        </a-card>
                      </span>

                      <span v-else-if="fungibleKeyArr[index] === '2'">
                        <!-- @vue-skip -->
                        <a-card
                          hoverable
                          v-for="(
                            permission, permission_index
                          ) in resourceMap.get(item.resource_address)
                            .permissions"
                          :style="{
                            marginBottom:
                              permission_index + 1 ===
                              resourceMap.get(item.resource_address).permissions
                                .length
                                ? '0'
                                : '20px',
                          }"
                        >
                          <a-row class="no-margin-row">
                            <a-col>
                              <a-tag
                                color="blue"
                                style="cursor: default !important"
                                >{{
                                  $t(
                                    `View.AssetCheck.template.${permission.split(":")[0]}`,
                                  )
                                }}</a-tag
                              >
                            </a-col>
                            <a-col flex="1" />
                            <a-col>
                              <a-tag
                                color="purple"
                                style="cursor: default !important"
                                >{{
                                  permission.includes(":")
                                    ? $t(
                                        `View.AssetCheck.template.${permission.split(":")[1]}`,
                                      )
                                    : $t(`View.AssetCheck.template.Allow`)
                                }}</a-tag
                              >
                            </a-col>
                          </a-row>
                        </a-card>
                      </span>
                    </a-card>
                  </div>
                </template>
              </TransitionGroup>
            </a-col>

            <a-col span="12" class="view-no-padding-right">
              <TransitionGroup name="list">
                <template v-for="(item, index) in items[0]">
                  <div
                    class="view-card asset-check-card"
                    v-if="index % 2 === 1"
                    :style="{
                      marginBottom:
                        index === 1
                          ? '20px'
                          : items[0].length % 2 === 0
                            ? items[0].length - index === 1
                              ? '0'
                              : '20px'
                            : items[0].length - index === 2
                              ? '0'
                              : '20px',
                    }"
                  >
                    <a-card
                      class="view-max-width"
                      :tabList="tabList"
                      :activeTabKey="fungibleKeyArr[index]"
                      @tabChange="
                        (key: string) => onFungibleTabChange(key, index)
                      "
                    >
                      <!-- @vue-skip -->
                      <template #title>
                        <a-avatar
                          style="user-select: none; width: 64px; height: 64px"
                        >
                          <template #icon>
                            <img
                              draggable="false"
                              v-if="
                                resourceMap.get(item.resource_address).icon_url
                              "
                              :src="
                                isXrdAddress(item.resource_address)
                                  ? 'Radix.webp'
                                  : resourceMap.get(item.resource_address)
                                      .icon_url
                              "
                              onerror="this.src='img_onerror.png'"
                            />
                          </template>
                        </a-avatar>

                        <a-tooltip destroyTooltipOnHide placement="topLeft">
                          <template #title
                            >{{
                              resourceMap.get(item.resource_address).name
                                ? resourceMap.get(item.resource_address).name
                                : resourceMap.get(item.resource_address).symbol
                                  ? resourceMap.get(item.resource_address)
                                      .symbol
                                  : $t(
                                      `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                                    )
                            }}
                          </template>
                          <span class="token-title">
                            {{
                              resourceMap.get(item.resource_address).symbol
                                ? resourceMap.get(item.resource_address).symbol
                                : resourceMap.get(item.resource_address).name
                                  ? resourceMap.get(item.resource_address).name
                                  : $t(
                                      `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                                    )
                            }}
                          </span>
                        </a-tooltip>
                      </template>

                      <template #extra>
                        <a-tooltip destroyTooltipOnHide placement="left">
                          <template #title>
                            <span
                              style="cursor: pointer"
                              @click="copy(item.resource_address)"
                              >{{ item.resource_address }}
                            </span>
                          </template>

                          <a-tag
                            color="blue"
                            @click="copy(item.resource_address)"
                          >
                            {{
                              `${item.resource_address.slice(
                                0,
                                8,
                              )}...${item.resource_address.slice(
                                item.resource_address.length - 6,
                              )}`
                            }}
                          </a-tag>
                        </a-tooltip>
                      </template>

                      <span v-if="fungibleKeyArr[index] === '0'">
                        <a-card
                          hoverable
                          v-for="(vault, i) in item.vaults.items"
                          :style="{
                            marginBottom:
                              i + 1 === item.vaults.items.length ? '0' : '20px',
                          }"
                        >
                          <a-row class="no-margin-row">
                            <a-col>
                              <a-tooltip destroyTooltipOnHide placement="left">
                                <template #title>
                                  <span
                                    style="cursor: pointer"
                                    @click="copy(vault.vault_address)"
                                  >
                                    {{ vault.vault_address }}
                                  </span>
                                </template>
                                <a-tag
                                  color="blue"
                                  @click="copy(vault.vault_address)"
                                  >{{ `#${i + 1}` }}</a-tag
                                >
                              </a-tooltip>
                            </a-col>

                            <a-col flex="1" />

                            <a-col>
                              <a-tooltip destroyTooltipOnHide placement="left">
                                <template #title>
                                  <span
                                    style="cursor: pointer"
                                    @click="copy(vault.amount)"
                                  >
                                    {{ formatNumber(vault.amount) }}
                                  </span>
                                </template>
                                <a-tag
                                  color="purple"
                                  @click="copy(vault.amount)"
                                >
                                  {{ formatNumber(vault.amount) }}
                                </a-tag>
                              </a-tooltip>
                            </a-col>
                          </a-row>
                        </a-card>
                      </span>

                      <span v-else-if="fungibleKeyArr[index] === '1'">
                        <!-- @vue-skip -->
                        <a-card
                          hoverable
                          v-for="(info, info_index) in resourceMap.get(
                            item.resource_address,
                          ).infos"
                          :style="{
                            marginBottom:
                              info_index + 1 ===
                              resourceMap.get(item.resource_address).infos
                                .length
                                ? '0'
                                : '20px',
                          }"
                        >
                          <a-row class="no-margin-row">
                            <a-col>
                              <a-tag
                                color="blue"
                                style="cursor: default !important"
                              >
                                {{ $t(`View.AssetCheck.template.${info.t}`) }}
                              </a-tag>
                            </a-col>
                            <a-col flex="1" />
                            <!-- @vue-skip -->
                            <a-col>
                              <a-tooltip destroyTooltipOnHide placement="left">
                                <template #title>
                                  <span
                                    @click="copy(info.value)"
                                    style="cursor: pointer"
                                    >{{
                                      info.key === "tags"
                                        ? info.value.join(", ")
                                        : info.key.startsWith("total")
                                          ? formatNumber(info.value)
                                          : info.value
                                    }}</span
                                  >
                                </template>

                                <a-tag @click="copy(info.value)" color="purple">
                                  {{
                                    info.key === "tags"
                                      ? info.value.join(", ")
                                      : info.key.startsWith("total")
                                        ? formatNumber(info.value)
                                        : info.value
                                  }}
                                </a-tag>
                              </a-tooltip>
                            </a-col>
                          </a-row>
                        </a-card>
                      </span>

                      <span v-else-if="fungibleKeyArr[index] === '2'">
                        <!-- @vue-skip -->
                        <a-card
                          hoverable
                          v-for="(
                            permission, permission_index
                          ) in resourceMap.get(item.resource_address)
                            .permissions"
                          :style="{
                            marginBottom:
                              permission_index + 1 ===
                              resourceMap.get(item.resource_address).permissions
                                .length
                                ? '0'
                                : '20px',
                          }"
                        >
                          <a-row class="no-margin-row">
                            <a-col>
                              <a-tag
                                color="blue"
                                style="cursor: default !important"
                                >{{
                                  $t(
                                    `View.AssetCheck.template.${permission.split(":")[0]}`,
                                  )
                                }}</a-tag
                              >
                            </a-col>
                            <a-col flex="1" />
                            <a-col>
                              <a-tag
                                color="purple"
                                style="cursor: default !important"
                                >{{
                                  permission.includes(":")
                                    ? $t(
                                        `View.AssetCheck.template.${permission.split(":")[1]}`,
                                      )
                                    : $t(`View.AssetCheck.template.Allow`)
                                }}</a-tag
                              >
                            </a-col>
                          </a-row>
                        </a-card>
                      </span>
                    </a-card>
                  </div>
                </template>
              </TransitionGroup>
            </a-col>
          </a-row>
        </div>
        <!------------------------ Fungible Token ------------------------>

        <!------------------------ NonFungible Token ------------------------>
        <div v-else>
          <a-row :gutter="20" class="no-margin-row">
            <a-col span="12" class="view-no-padding-left">
              <TransitionGroup name="list">
                <template v-for="(item, index) in items[1]">
                  <div
                    class="view-card asset-check-card"
                    v-if="index % 2 === 0"
                    :style="{
                      marginBottom:
                        index === 0
                          ? '20px'
                          : items[1].length % 2 === 0
                            ? items[1].length - index === 2
                              ? '0'
                              : '20px'
                            : items[1].length - index === 1
                              ? '0'
                              : '20px',
                    }"
                  >
                    <a-card
                      class="view-max-width"
                      :tabList="tabList"
                      :activeTabKey="nonFungibleKeyArr[index]"
                      @tabChange="
                        (key: string) => onNonFungibleTabChange(key, index)
                      "
                    >
                      <!-- @vue-skip -->
                      <template #title>
                        <a-avatar
                          style="user-select: none; width: 64px; height: 64px"
                        >
                          <template #icon>
                            <img
                              draggable="false"
                              v-if="
                                resourceMap.get(item.resource_address).icon_url
                              "
                              :src="
                                resourceMap.get(item.resource_address).icon_url
                              "
                              onerror="this.src='img_onerror.png'"
                            />
                          </template>
                        </a-avatar>

                        <a-tooltip destroyTooltipOnHide placement="topLeft">
                          <template #title
                            >{{
                              resourceMap.get(item.resource_address).name
                                ? resourceMap.get(item.resource_address).name
                                : resourceMap.get(item.resource_address).symbol
                                  ? resourceMap.get(item.resource_address)
                                      .symbol
                                  : $t(
                                      `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                                    )
                            }}
                          </template>
                          <span class="token-title">
                            {{
                              resourceMap.get(item.resource_address).symbol
                                ? resourceMap.get(item.resource_address).symbol
                                : resourceMap.get(item.resource_address).name
                                  ? resourceMap.get(item.resource_address).name
                                  : $t(
                                      `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                                    )
                            }}
                          </span>
                        </a-tooltip>
                      </template>

                      <template #extra>
                        <a-tooltip destroyTooltipOnHide placement="left">
                          <template #title>
                            <span
                              style="cursor: pointer"
                              @click="copy(item.resource_address)"
                              >{{ item.resource_address }}
                            </span>
                          </template>

                          <a-tag
                            color="blue"
                            @click="copy(item.resource_address)"
                          >
                            {{
                              `${item.resource_address.slice(
                                0,
                                8,
                              )}...${item.resource_address.slice(
                                item.resource_address.length - 6,
                              )}`
                            }}
                          </a-tag>
                        </a-tooltip>
                      </template>

                      <span v-if="nonFungibleKeyArr[index] === '0'">
                        <a-card
                          hoverable
                          v-for="(vault, i) in item.vaults.items"
                          :style="{
                            marginBottom:
                              i + 1 === item.vaults.items.length ? '0' : '20px',
                            cursor: 'pointer !important',
                          }"
                          @click="showVault(vault.vault_address, i)"
                        >
                          <a-row class="no-margin-row">
                            <a-col>
                              <a-tooltip destroyTooltipOnHide placement="left">
                                <template #title>
                                  <span
                                    style="cursor: pointer"
                                    @click="copy(vault.vault_address)"
                                  >
                                    {{ vault.vault_address }}
                                  </span>
                                </template>
                                <a-tag
                                  color="blue"
                                  @click.stop="copy(vault.vault_address)"
                                  >{{ `#${i + 1}` }}</a-tag
                                >
                              </a-tooltip>
                            </a-col>

                            <a-col flex="1" />

                            <a-col>
                              <a-tooltip destroyTooltipOnHide placement="left">
                                <template #title>
                                  <span
                                    style="cursor: pointer"
                                    @click="copy(vault.total_count)"
                                  >
                                    {{ formatNumber(vault.total_count) }}
                                  </span>
                                </template>
                                <a-tag
                                  color="purple"
                                  @click.stop="copy(vault.total_count)"
                                >
                                  {{ formatNumber(vault.total_count) }}
                                </a-tag>
                              </a-tooltip>
                            </a-col>
                          </a-row>
                        </a-card>
                      </span>

                      <span v-else-if="nonFungibleKeyArr[index] === '1'">
                        <!-- @vue-skip -->
                        <a-card
                          hoverable
                          v-for="(info, info_index) in resourceMap.get(
                            item.resource_address,
                          ).infos"
                          :style="{
                            marginBottom:
                              info_index + 1 ===
                              resourceMap.get(item.resource_address).infos
                                .length
                                ? '0'
                                : '20px',
                          }"
                        >
                          <a-row class="no-margin-row">
                            <a-col>
                              <a-tag
                                color="blue"
                                style="cursor: default !important"
                              >
                                {{ $t(`View.AssetCheck.template.${info.t}`) }}
                              </a-tag>
                            </a-col>
                            <a-col flex="1" />
                            <!-- @vue-skip -->
                            <a-col>
                              <a-tooltip destroyTooltipOnHide placement="left">
                                <template #title>
                                  <span
                                    @click="copy(info.value)"
                                    style="cursor: pointer"
                                    >{{
                                      info.key === "tags"
                                        ? info.value.join(", ")
                                        : info.key.startsWith("total")
                                          ? formatNumber(info.value)
                                          : info.value
                                    }}</span
                                  >
                                </template>

                                <a-tag @click="copy(info.value)" color="purple">
                                  {{
                                    info.key === "tags"
                                      ? info.value.join(", ")
                                      : info.key.startsWith("total")
                                        ? formatNumber(info.value)
                                        : info.value
                                  }}
                                </a-tag>
                              </a-tooltip>
                            </a-col>
                          </a-row>
                        </a-card>
                      </span>

                      <span v-else-if="nonFungibleKeyArr[index] === '2'">
                        <!-- @vue-skip -->
                        <a-card
                          hoverable
                          v-for="(
                            permission, permission_index
                          ) in resourceMap.get(item.resource_address)
                            .permissions"
                          :style="{
                            marginBottom:
                              permission_index + 1 ===
                              resourceMap.get(item.resource_address).permissions
                                .length
                                ? '0'
                                : '20px',
                          }"
                        >
                          <a-row class="no-margin-row">
                            <a-col>
                              <a-tag
                                color="blue"
                                style="cursor: default !important"
                                >{{
                                  $t(
                                    `View.AssetCheck.template.${permission.split(":")[0]}`,
                                  )
                                }}</a-tag
                              >
                            </a-col>
                            <a-col flex="1" />
                            <a-col>
                              <a-tag
                                color="purple"
                                style="cursor: default !important"
                                >{{
                                  permission.includes(":")
                                    ? $t(
                                        `View.AssetCheck.template.${permission.split(":")[1]}`,
                                      )
                                    : $t(`View.AssetCheck.template.Allow`)
                                }}</a-tag
                              >
                            </a-col>
                          </a-row>
                        </a-card>
                      </span>
                    </a-card>
                  </div>
                </template>
              </TransitionGroup>
            </a-col>

            <a-col span="12" class="view-no-padding-right">
              <TransitionGroup name="list">
                <template v-for="(item, index) in items[1]">
                  <div
                    class="view-card asset-check-card"
                    v-if="index % 2 === 1"
                    :style="{
                      marginBottom:
                        index === 1
                          ? '20px'
                          : items[1].length % 2 === 0
                            ? items[1].length - index === 1
                              ? '0'
                              : '20px'
                            : items[1].length - index === 2
                              ? '0'
                              : '20px',
                    }"
                  >
                    <a-card
                      class="view-max-width"
                      :tabList="tabList"
                      :activeTabKey="nonFungibleKeyArr[index]"
                      @tabChange="
                        (key: string) => onNonFungibleTabChange(key, index)
                      "
                    >
                      <!-- @vue-skip -->
                      <template #title>
                        <a-avatar
                          style="user-select: none; width: 64px; height: 64px"
                        >
                          <template #icon>
                            <img
                              draggable="false"
                              v-if="
                                resourceMap.get(item.resource_address).icon_url
                              "
                              :src="
                                resourceMap.get(item.resource_address).icon_url
                              "
                              onerror="this.src='img_onerror.png'"
                            />
                          </template>
                        </a-avatar>

                        <a-tooltip destroyTooltipOnHide placement="topLeft">
                          <template #title
                            >{{
                              resourceMap.get(item.resource_address).name
                                ? resourceMap.get(item.resource_address).name
                                : resourceMap.get(item.resource_address).symbol
                                  ? resourceMap.get(item.resource_address)
                                      .symbol
                                  : $t(
                                      `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                                    )
                            }}
                          </template>
                          <span class="token-title">
                            {{
                              resourceMap.get(item.resource_address).symbol
                                ? resourceMap.get(item.resource_address).symbol
                                : resourceMap.get(item.resource_address).name
                                  ? resourceMap.get(item.resource_address).name
                                  : $t(
                                      `View.TokenTransfer.MultipleToMultiple.script.methods.activateSelectTokenModal.unnamedToken`,
                                    )
                            }}
                          </span>
                        </a-tooltip>
                      </template>

                      <template #extra>
                        <a-tooltip destroyTooltipOnHide placement="left">
                          <template #title>
                            <span
                              style="cursor: pointer"
                              @click="copy(item.resource_address)"
                              >{{ item.resource_address }}
                            </span>
                          </template>

                          <a-tag
                            color="blue"
                            @click="copy(item.resource_address)"
                          >
                            {{
                              `${item.resource_address.slice(
                                0,
                                8,
                              )}...${item.resource_address.slice(
                                item.resource_address.length - 6,
                              )}`
                            }}
                          </a-tag>
                        </a-tooltip>
                      </template>

                      <span v-if="nonFungibleKeyArr[index] === '0'">
                        <a-card
                          hoverable
                          v-for="(vault, i) in item.vaults.items"
                          :style="{
                            marginBottom:
                              i + 1 === item.vaults.items.length ? '0' : '20px',
                            cursor: 'pointer !important',
                          }"
                          @click="showVault(vault.vault_address, i)"
                        >
                          <a-row class="no-margin-row">
                            <a-col>
                              <a-tooltip destroyTooltipOnHide placement="left">
                                <template #title>
                                  <span
                                    style="cursor: pointer"
                                    @click="copy(vault.vault_address)"
                                  >
                                    {{ vault.vault_address }}
                                  </span>
                                </template>
                                <a-tag
                                  color="blue"
                                  @click.stop="copy(vault.vault_address)"
                                  >{{ `#${i + 1}` }}</a-tag
                                >
                              </a-tooltip>
                            </a-col>

                            <a-col flex="1" />

                            <a-col>
                              <a-tooltip destroyTooltipOnHide placement="left">
                                <template #title>
                                  <span
                                    style="cursor: pointer"
                                    @click="copy(vault.total_count)"
                                  >
                                    {{ formatNumber(vault.total_count) }}
                                  </span>
                                </template>
                                <a-tag
                                  color="purple"
                                  @click.stop="copy(vault.total_count)"
                                >
                                  {{ formatNumber(vault.total_count) }}
                                </a-tag>
                              </a-tooltip>
                            </a-col>
                          </a-row>
                        </a-card>
                      </span>

                      <span v-else-if="nonFungibleKeyArr[index] === '1'">
                        <!-- @vue-skip -->
                        <a-card
                          hoverable
                          v-for="(info, info_index) in resourceMap.get(
                            item.resource_address,
                          ).infos"
                          :style="{
                            marginBottom:
                              info_index + 1 ===
                              resourceMap.get(item.resource_address).infos
                                .length
                                ? '0'
                                : '20px',
                          }"
                        >
                          <a-row class="no-margin-row">
                            <a-col>
                              <a-tag
                                color="blue"
                                style="cursor: default !important"
                              >
                                {{ $t(`View.AssetCheck.template.${info.t}`) }}
                              </a-tag>
                            </a-col>
                            <a-col flex="1" />
                            <!-- @vue-skip -->
                            <a-col>
                              <a-tooltip destroyTooltipOnHide placement="left">
                                <template #title>
                                  <span
                                    @click="copy(info.value)"
                                    style="cursor: pointer"
                                    >{{
                                      info.key === "tags"
                                        ? info.value.join(", ")
                                        : info.key.startsWith("total")
                                          ? formatNumber(info.value)
                                          : info.value
                                    }}</span
                                  >
                                </template>

                                <a-tag @click="copy(info.value)" color="purple">
                                  {{
                                    info.key === "tags"
                                      ? info.value.join(", ")
                                      : info.key.startsWith("total")
                                        ? formatNumber(info.value)
                                        : info.value
                                  }}
                                </a-tag>
                              </a-tooltip>
                            </a-col>
                          </a-row>
                        </a-card>
                      </span>

                      <span v-else-if="nonFungibleKeyArr[index] === '2'">
                        <!-- @vue-skip -->
                        <a-card
                          hoverable
                          v-for="(
                            permission, permission_index
                          ) in resourceMap.get(item.resource_address)
                            .permissions"
                          :style="{
                            marginBottom:
                              permission_index + 1 ===
                              resourceMap.get(item.resource_address).permissions
                                .length
                                ? '0'
                                : '20px',
                          }"
                        >
                          <a-row class="no-margin-row">
                            <a-col>
                              <a-tag
                                color="blue"
                                style="cursor: default !important"
                                >{{
                                  $t(
                                    `View.AssetCheck.template.${permission.split(":")[0]}`,
                                  )
                                }}</a-tag
                              >
                            </a-col>
                            <a-col flex="1" />
                            <a-col>
                              <a-tag
                                color="purple"
                                style="cursor: default !important"
                                >{{
                                  permission.includes(":")
                                    ? $t(
                                        `View.AssetCheck.template.${permission.split(":")[1]}`,
                                      )
                                    : $t(`View.AssetCheck.template.Allow`)
                                }}</a-tag
                              >
                            </a-col>
                          </a-row>
                        </a-card>
                      </span>
                    </a-card>
                  </div>
                </template>
              </TransitionGroup>
            </a-col>
          </a-row>
        </div>
        <!------------------------ NonFungible Token ------------------------>
      </Transition>
    </a-layout-content>
    <!------------------------ Content ------------------------>
  </a-layout>
</template>

<script lang="ts">
import store from "../stores/store";
import { defineComponent } from "vue";
import { message } from "ant-design-vue";
import { TagTwoTone } from "@ant-design/icons-vue";
import { formatNumber, selectXrdAddress } from "../common";
import { RadixNetworkChecker } from "@atlantis-l/radix-tool";

export default defineComponent({
  components: { TagTwoTone },
  data() {
    return {
      gutter: 10,
      search: "",
      address: "",
      segmented: 0,
      vaultIndex: 0,
      store: store(),
      vaultAddress: "",
      isFungiblePage: true,
      openVaultModal: false,
      respArr: [] as boolean[],
      fungibleKeyArr: [] as string[],
      nonFungibleKeyArr: [] as string[],
      data: undefined as object | undefined,
      vaultMap: new Map<string, string[]>(),
      resourceMap: new Map<string, object>(),
      networkChecker: new RadixNetworkChecker(store().networkId),
    };
  },
  watch: {
    "store.networkId"() {
      this.networkChecker.networkId = this.store.networkId;
    },
    address() {
      this.check();
    },
  },
  computed: {
    items() {
      if (this.data) {
        const fungible_items = [];
        const non_fungible_items = [];
        this.fungibleKeyArr = [];
        this.nonFungibleKeyArr = [];

        //@ts-ignore
        let temp_items = this.data.fungible_resources.items;

        if (!this.segmented) {
          //@ts-ignore
          for (let i = 0; i < temp_items.length; i++) {
            let show = false;
            //@ts-ignore
            const vaults = temp_items[i].vaults.items;
            //@ts-ignore
            for (let j = 0; j < vaults.length; j++) {
              //@ts-ignore
              if (vaults[j].amount && vaults[j].amount !== "0") {
                show = true;
                break;
              }
            }

            if (show) {
              if (this.search.length) {
                //@ts-ignore
                const includes_address = temp_items[
                  i
                ].resource_address.includes(this.search);

                //@ts-ignore
                const resource = this.resourceMap.get(
                  temp_items[i].resource_address,
                );

                //@ts-ignore
                const name = resource.name;

                //@ts-ignore
                const symbol = resource.symbol;

                let includes_name_or_symbol = false;

                if (
                  (name &&
                    name.toLowerCase().includes(this.search.toLowerCase())) ||
                  (symbol &&
                    symbol.toLowerCase().includes(this.search.toLowerCase()))
                ) {
                  includes_name_or_symbol = true;
                }

                if (includes_address || includes_name_or_symbol) {
                  this.fungibleKeyArr.push("0");
                  //@ts-ignore
                  fungible_items.push(temp_items[i]);
                }
              } else {
                this.fungibleKeyArr.push("0");
                //@ts-ignore
                fungible_items.push(temp_items[i]);
              }
            }
          }
        } else {
          //@ts-ignore
          temp_items = this.data.non_fungible_resources.items;

          this.vaultMap.clear();

          //@ts-ignore
          for (let i = 0; i < temp_items.length; i++) {
            let show = false;
            //@ts-ignore
            const vaults = temp_items[i].vaults.items;
            //@ts-ignore
            for (let j = 0; j < vaults.length; j++) {
              //@ts-ignore
              if (vaults[j].total_count) {
                const nftIds = vaults[j].items;
                const vaultAddress = vaults[j].vault_address;

                this.vaultMap.set(vaultAddress, nftIds);

                show = true;
                break;
              }
            }

            if (show) {
              if (this.search.length) {
                //@ts-ignore
                const includes_address = temp_items[
                  i
                ].resource_address.includes(this.search);

                //@ts-ignore
                const resource = this.resourceMap.get(
                  temp_items[i].resource_address,
                );

                //@ts-ignore
                const name = resource.name;

                //@ts-ignore
                const symbol = resource.symbol;

                let includes_name_or_symbol = false;

                if (
                  (name &&
                    name.toLowerCase().includes(this.search.toLowerCase())) ||
                  (symbol &&
                    symbol.toLowerCase().includes(this.search.toLowerCase()))
                ) {
                  includes_name_or_symbol = true;
                }

                if (includes_address || includes_name_or_symbol) {
                  this.nonFungibleKeyArr.push("0");
                  //@ts-ignore
                  non_fungible_items.push(temp_items[i]);
                }
              } else {
                this.nonFungibleKeyArr.push("0");
                //@ts-ignore
                non_fungible_items.push(temp_items[i]);
              }
            }
          }
        }

        return [
          //@ts-ignore
          [...fungible_items],
          //@ts-ignore
          [...non_fungible_items],
        ];
      } else {
        return [[], []];
      }
    },
    tabList() {
      return [
        {
          key: "0",
          tab: this.$t("View.AssetCheck.template.vaults"),
        },
        {
          key: "1",
          tab: this.$t("View.AssetCheck.template.Info"),
        },
        {
          key: "2",
          tab: this.$t("View.AssetCheck.template.permission"),
        },
      ];
    },
  },
  methods: {
    check() {
      if (this.address.length && this.address.includes("_")) {
        message.loading({
          duration: 0,
          content: `「 ${this.$t(
            "View.EntityCheck.script.message.loading",
          )} 」`,
          key: "checkEntity",
        });
        this.checkEntity();
      }
    },
    checkEntity() {
      this.networkChecker
        .checkEntities([this.address])
        .then((res) => {
          if (res.items && res.items.length) {
            const address_array: string[] = [];

            res.items[0].fungible_resources?.items.forEach((item) => {
              address_array.push(item.resource_address);
            });

            res.items[0].non_fungible_resources?.items.forEach((item) => {
              address_array.push(item.resource_address);
            });

            if (!address_array.length) {
              this.data = undefined;
              message.success({
                content: `「 ${this.$t(
                  "View.EntityCheck.script.message.success",
                )} 」`,
                key: "checkEntity",
              });
              return;
            }

            const ADDRESS_COUNT = 20;

            const count = Math.ceil(address_array.length / ADDRESS_COUNT);

            for (let i = 0; ; i++) {
              const start = i * ADDRESS_COUNT;

              let end = i * ADDRESS_COUNT + ADDRESS_COUNT;

              end = end > address_array.length ? address_array.length : end;

              const addresses = address_array.slice(start, end);

              this.networkChecker.checkEntities(addresses).then((r) => {
                r.items.forEach((item) => {
                  let name = undefined;
                  let symbol = undefined;
                  let icon_url = undefined;

                  const infos: {
                    key: string;
                    value: object;
                    t: string;
                  }[] = [];

                  for (let i = 0; i < item.metadata.items.length; i++) {
                    const key = item.metadata.items[i].key; //@ts-ignore
                    const value = item.metadata.items[i].value.typed.value; //@ts-ignore
                    const values = item.metadata.items[i].value.typed.values;

                    switch (key) {
                      case "name":
                        name = value;

                        value &&
                          infos.push({
                            key,
                            value,
                            t: key,
                          });
                        break;
                      case "symbol":
                        symbol = value;

                        value &&
                          infos.push({
                            key,
                            value,
                            t: key,
                          });
                        break;
                      case "tags":
                        values &&
                          values.length &&
                          infos.push({
                            key,
                            value: values,
                            t: key,
                          });
                        break;
                      case "icon_url":
                        icon_url = value;
                        break;
                      case "info_url":
                        value &&
                          infos.push({
                            key,
                            value,
                            t: "link",
                          });
                        break;
                      case "description":
                        value &&
                          infos.push({
                            key,
                            value,
                            t: key,
                          });
                        break;
                    }
                  }

                  if (item.details) {
                    //@ts-ignore
                    Number.isInteger(item.details.divisibility) &&
                      infos.push({
                        key: "divisibility", //@ts-ignore
                        value: item.details.divisibility,
                        t: "divisibility",
                      });

                    //@ts-ignore
                    item.details.total_supply &&
                      infos.push({
                        key: "total_supply", //@ts-ignore
                        value: item.details.total_supply,
                        t: "total_supply",
                      });

                    //@ts-ignore
                    item.details.total_minted &&
                      infos.push({
                        key: "total_minted", //@ts-ignore
                        value: item.details.total_minted,
                        t: "total_minted",
                      });

                    //@ts-ignore
                    item.details.total_burned &&
                      infos.push({
                        key: "total_burned", //@ts-ignore
                        value: item.details.total_burned,
                        t: "total_burned",
                      });
                  }

                  const permissions: string[] = [];

                  if (item.details) {
                    const hasOwner = //@ts-ignore
                      item.details.role_assignments.owner.rule.type !==
                      "DenyAll";
                    //@ts-ignore
                    const entries = item.details.role_assignments.entries;

                    const updaterMap = new Map<string, object>();

                    for (let i = 0; i < entries.length; i++) {
                      const entry = entries[i];
                      const name = entry.role_key.name;
                      const resolution = entry.assignment.resolution;
                      const type = entry.assignment.explicit_rule?.type;
                      updaterMap.set(name, { resolution, type });
                    }

                    for (let i = 0; i < entries.length; i++) {
                      const entry = entries[i];
                      const name = entry.role_key.name;
                      const type = entry.assignment.explicit_rule?.type;

                      if (name === "withdrawer" || name === "depositor") {
                        if (type === "AllowAll" || type === "DenyAll") {
                          permissions.push(`${name}:${type}`);
                        } else {
                          permissions.push(`${name}:Restricted`);
                        }
                      }
                    }

                    for (let i = 0; i < entries.length; i++) {
                      const entry = entries[i];
                      const name = entry.role_key.name;
                      const resolution = entry.assignment.resolution;
                      const type = entry.assignment.explicit_rule?.type;

                      if (
                        name === "withdrawer_updater" ||
                        name === "depositor_updater"
                      ) {
                        if (resolution === "Explicit") {
                          if (type !== "DenyAll") {
                            permissions.push(name);
                          }
                        } else if (hasOwner) {
                          permissions.push(name);
                        }
                      }
                    }

                    for (let i = 0; i < entries.length; i++) {
                      const entry = entries[i];
                      const name = entry.role_key.name;
                      const resolution = entry.assignment.resolution;
                      const type = entry.assignment.explicit_rule?.type;
                      const updater = "_updater";

                      if (
                        !name.endsWith("updater") &&
                        !name.startsWith("royalty") &&
                        name !== "withdrawer" &&
                        name !== "depositor"
                      ) {
                        if (resolution === "Explicit") {
                          // E
                          if (type === "DenyAll") {
                            // E:D
                            if (
                              // Updater E
                              //@ts-ignore
                              updaterMap.get(name + updater).resolution ===
                              "Explicit"
                            ) {
                              if (
                                // E:!D
                                //@ts-ignore
                                updaterMap.get(name + updater).type !==
                                "DenyAll"
                              ) {
                                permissions.push(name);
                              }
                            } else {
                              // Updater O
                              if (hasOwner) {
                                // O:!D
                                permissions.push(name);
                              }
                            }
                          } else {
                            // E!D
                            permissions.push(name);
                          }
                        } else {
                          // O
                          if (
                            // Updater E
                            //@ts-ignore
                            updaterMap.get(name + updater).resolution ===
                            "Explicit"
                          ) {
                            if (
                              // E:!D
                              //@ts-ignore
                              updaterMap.get(name + updater).type !== "DenyAll"
                            ) {
                              permissions.push(name);
                            }
                          }

                          if (hasOwner) {
                            // O:!D
                            permissions.push(name);
                          }
                        }
                      }

                      if (name === "non_fungible_data_updater") {
                        if (resolution === "Explicit") {
                          // E
                          if (type === "DenyAll") {
                            // E:D
                            if (
                              // Updater E
                              //@ts-ignore
                              updaterMap.get(name + updater).resolution ===
                              "Explicit"
                            ) {
                              if (
                                // E:!D
                                //@ts-ignore
                                updaterMap.get(name + updater).type !==
                                "DenyAll"
                              ) {
                                permissions.push(name);
                              }
                            } else {
                              // Updater O
                              if (hasOwner) {
                                // O:!D
                                permissions.push(name);
                              }
                            }
                          } else {
                            // E!D
                            permissions.push(name);
                          }
                        } else {
                          // O
                          if (
                            // Updater E
                            //@ts-ignore
                            updaterMap.get(name + updater).resolution ===
                            "Explicit"
                          ) {
                            if (
                              // E:!D
                              //@ts-ignore
                              updaterMap.get(name + updater).type !== "DenyAll"
                            ) {
                              permissions.push(name);
                            }
                          }

                          if (hasOwner) {
                            // O:!D
                            permissions.push(name);
                          }
                        }
                      }
                    }
                  }

                  this.resourceMap.set(item.address, {
                    name,
                    infos,
                    symbol,
                    icon_url,
                    permissions,
                  });
                });

                this.respArr.push(true);

                if (this.respArr.length === count) {
                  this.respArr = [];

                  this.data = res.items[0];

                  message.success({
                    content: `「 ${this.$t(
                      "View.EntityCheck.script.message.success",
                    )} 」`,
                    key: "checkEntity",
                  });
                }
              });

              if (end === address_array.length) break;
            }
          }
        })
        .catch((_e) => {
          message.error({
            content: `「 ${this.$t(
              "View.EntityCheck.script.message.error",
            )} 」`,
            key: "checkEntity",
          });
        });
    },
    copy(text: string) {
      navigator.clipboard.writeText(text).then(() => {
        message.success({
          content: `「 ${this.$t("View.HistoryCheck.script.copied")} 」`,
          key: "copy",
        });
      });
    },
    switchPage(key: number) {
      this.isFungiblePage = key === 0;
    },
    formatNumber(num: string) {
      return formatNumber(num);
    },
    openExternalLink(url: string) {
      //@ts-ignore
      (window.RadixTool as RadixTool).openExternalLink(url);
    },
    isXrdAddress(address: string) {
      return address === selectXrdAddress(1) || address === selectXrdAddress(2);
    },
    showVault(address: string, index: number) {
      this.vaultIndex = index;
      this.vaultAddress = address;

      this.openVaultModal = true;
    },
    onFungibleTabChange(key: string, index: number) {
      this.fungibleKeyArr[index] = key;
    },
    onNonFungibleTabChange(key: string, index: number) {
      this.nonFungibleKeyArr[index] = key;
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
  cursor: pointer !important;
}

.no-margin-row {
  margin: 0 !important;
}

.view-layout-content {
  overflow: scroll !important;
}

.view-layout-content::-webkit-scrollbar {
  display: none !important;
}

.ant-card {
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

.ant-tag {
  margin-inline-end: 0 !important;
  font-size: 14px;
}

.ant-card-body .ant-tag {
  display: block;
  font-size: 14px;
  max-width: 200px;
  overflow: hidden;
  user-select: none;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ant-card-body .ant-card {
  cursor: auto;
}

.ant-card::-webkit-scrollbar {
  display: none !important;
}

.token-title {
  top: 4.5px;
  font-size: 24px;
  user-select: none;
  margin-left: 10px;
  position: relative;
}

.list-move,
.list-leave-active,
.list-enter-active {
  transition: all 0.4s ease;
}

.list-leave-to,
.list-enter-from {
  opacity: 0;
}
</style>
