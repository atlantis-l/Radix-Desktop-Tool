<template>
  <a-layout class="view-layout">
    <a-row>
      <a-input
        ref="address"
        class="view-max-width"
        :placeholder="$t('shu-ru-zhang-hu-huo-zu-jian-di-zhi')"
        allowClear
        v-model:value="mainAddress"
      />
    </a-row>

    <a-row>
      <a-input
        class="view-max-width"
        :placeholder="$t('shu-ru-zi-yuan-di-zhi')"
        allowClear
        v-model:value="resourceAddress"
      />
    </a-row>

    <a-row :gutter="gutter">
      <a-col flex="1" class="view-no-padding-left" />

      <a-col style="padding-top: 5px; text-align: end">
        <a-checkbox v-model:checked="isVault" class="select-none">
          {{ $t("yi-jin-ku-hua-fen-lie") }}
        </a-checkbox>
      </a-col>

      <a-col style="padding-top: 5px; text-align: end">
        <a-checkbox v-model:checked="isGlobalId" class="select-none">
          {{ $t("zhuan-huan-wei-quan-ju-id") }}
        </a-checkbox>
      </a-col>

      <a-col class="view-no-padding-right">
        <a-button
          @click="getNftIDList"
          class="custom-btn"
          :text="$t('huo-qu-nft-id-lie-biao')"
        >
          {{ $t("huo-qu-nft-id-lie-biao") }}
        </a-button>
      </a-col>
    </a-row>
  </a-layout>
</template>

<script lang="ts">
import Papa from "papaparse";
import FileSaver from "file-saver";
import store from "../stores/store";
import { defineComponent } from "vue";
import { message } from "ant-design-vue";
import { RadixNetworkChecker } from "@atlantis-l/radix-tool";

export default defineComponent({
  data() {
    return {
      gutter: 10,
      isVault: false,
      store: store(),
      mainAddress: "",
      isGlobalId: false,
      resourceAddress: "",
      networkChecker: new RadixNetworkChecker(store().networkId),
      fileData: {
        fields: [] as string[],
        data: [] as string[][],
      },
    };
  },
  watch: {
    "store.networkId"(id: number) {
      this.networkChecker.networkId = id;
    },
  },
  methods: {
    async getNftIDList() {
      const key = "getNftIDList";

      message.loading({
        key,
        duration: 0,
        content: `「 ${this.$t("zheng-zai-huo-qu-nft-id-lie-biao")} 」`,
      });

      if (
        this.mainAddress.includes("_") &&
        this.resourceAddress.includes("_")
      ) {
        this.fileData.data = [];
        this.fileData.fields = [];

        const entityData = await this.networkChecker.checkEntities([
          this.mainAddress,
        ]);

        const resources = entityData.items[0].non_fungible_resources;

        const vaultMap = new Map<string, string[]>();

        if (resources && resources.total_count) {
          for (let i = 0; i < resources.items.length; i++) {
            const item = resources.items[i];

            if (item.resource_address === this.resourceAddress) {
              //@ts-ignore
              const vaults = item.vaults;

              if (vaults && vaults.total_count) {
                for (let j = 0; j < vaults.total_count; j++) {
                  const vault = vaults.items[j];
                  const address = vault.vault_address;

                  if (vault && vault.total_count) {
                    const vaultItems = vault.items;

                    vaultMap.set(
                      address,
                      (vaultItems as string[]).map((it) => {
                        return this.isGlobalId
                          ? `${this.resourceAddress}:${it}`
                          : it;
                      }),
                    );
                  }
                }
              }
            }
          }
        }

        const values = [...vaultMap.values()];

        if (this.isVault) {
          for (let i = 0; i < vaultMap.size; i++) {
            this.fileData.fields.push(`Vault_${i + 1}`);
          }

          const addAll = (v: string[][]) => {
            let i = 0;

            v.forEach((vv) => (i += vv.length));

            return i;
          };

          while (true) {
            const line: string[] = [];

            values.forEach((v) => {
              if (v.length) {
                line.push(v.pop() as string);
              } else {
                line.push("");
              }
            });

            this.fileData.data.push(line);

            if (!addAll(values)) {
              break;
            }
          }
        } else {
          this.fileData.fields.push("NFT ID");

          values.forEach((v) => {
            v.forEach((vv) => {
              this.fileData.data.push([vv]);
            });
          });
        }

        message.success({
          key,
          content: `「 ${this.$t("View.AssetCheck.script.NFDataLoaded")} 」`,
        });

        const result = Papa.unparse(this.fileData);

        FileSaver.saveAs(
          new Blob([result], { type: "text/plain;charset=utf-8" }),
          `NFT ID.csv`,
        );
      } else {
        message.warn({
          key,
          content: `「 ${this.$t("cuo-wu-de-di-zhi")} 」`,
        });
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

.select-none {
  user-select: none;
}
</style>
