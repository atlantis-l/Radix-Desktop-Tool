<template>
  <a-layout class="view-layout">
    <a-row style="margin-bottom: 80px !important">
      <a-input
        allowClear
        v-model:value="address"
        :addonBefore="$t('View.AddressQRCode.template.input.addonbefore')"
        :placeholder="$t('View.AddressQRCode.template.input.placeholder')"
      >
      </a-input>
    </a-row>

    <a-row justify="center">
      <canvas id="canvas" />
    </a-row>
  </a-layout>
</template>

<script lang="ts">
import QRCode from "qrcode";
import { defineComponent } from "vue";
import { CreateIcon } from "../common";

export default defineComponent({
  components: { CreateIcon },
  data() {
    return {
      address: "",
    };
  },
  watch: {
    address(value: string) {
      if (value.length) {
        this.drawCanvas(value);
      }
    },
  },
  mounted() {
    const REPO_URL = "https://github.com/atlantis-l/Radix-Desktop-Tool";

    this.drawCanvas(REPO_URL);
  },
  methods: {
    drawCanvas(value: string) {
      const canvas = document.getElementById("canvas");

      //@ts-ignore
      canvas.title = value;

      QRCode.toCanvas(canvas, value, {
        width: 300,
      });
    },
  },
});
</script>

<style scoped>
.ant-layout {
  background-color: #fff;
}

#canvas {
  width: 300px !important;
  height: 300px !important;
  transition: all 0.3s ease-in-out;
  border: 1px solid #d9d9d9;
  background-position: 70% 80%;
  border-radius: 8px !important;
  background-size: 1200px 1200px;
  background-clip: padding-box, border-box;
  background-image: linear-gradient(to right, #ffffff, #ffffff),
    radial-gradient(#052cc0, #1dddbf, #ff00e6, #1dddbf, #052cc0);
}

#canvas:hover {
  border: 1px solid transparent;
  box-shadow: 0 0 15px #ceccce !important;
}
</style>
