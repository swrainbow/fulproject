<template>
  <div>
    <h1>用户center</h1>
    <div ref="drag" id="drag">
      <div>
        <input type="file" name="file" @change="handleFilerChange" />
      </div>
    </div>
    <div>
      <el-progress :stroke-width="20" :text-inside="true" :percentage="uploadProgress"></el-progress>
    </div>
    <div>
      <el-button @click="uploadFiler">上传</el-button>
    </div>
    <div>
      <p>计算hash的进度</p>
      <el-progress :stroke-width="20" :text-inside="true" :percentage="hashProgress"></el-progress>
    </div>
  </div>
</template>

<script>
const CHUNK_SIZE = 0.5 * 1024 * 1024;
export default {
  async mounted() {
    const ret = await this.$http.get("/user/info");
    console.log(ret);
    this.bindEvents();
  },
  data() {
    return {
      file: null,
      uploadProgress: 0,
      chunks: [],
      hashProgress: 0
    };
  },
  methods: {
    bindEvents() {
      const drag = this.$refs.drag;
      drag.addEventListener("dragover", e => {
        drag.style.borderColor = "red";
        e.preventDefault();
      });

      drag.addEventListener("dragleave", e => {
        drag.style.borderColor = "#eee";
        e.preventDefault();
      });
      drag.addEventListener("drop", e => {
        console.log(e.dataTransfer);
        const fileList = e.dataTransfer.files;
        drag.style.borderColor = "#eee";
        this.file = fileList[0];
        e.preventDefault();
      });
    },
    blobToString(blob) {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function() {
          console.log(reader.result);
          const ret = reader.result
            .split("")
            .map(v => v.charCodeAt())
            .map(v => v.toString(16).toUpperCase())
            .map(v => v.padStart(2, "0"))
            .join(" ");
          resolve(ret);
        };
        reader.readAsBinaryString(blob);
      });
    },
    async isGif(file) {
      //前面6个16进制  47 49 46 38 39 61
      const ret = await this.blobToString(file.slice(0, 6));
      const isGif = ret == "47 49 46 38 39 61" || ret == "47 49 46 38 37 61";
      return isGif;
    },
    async isPng(file) {
      const ret = await this.blobToString(file.slice(0, 8));
      const ispng = ret == "89 50 4E 47 0D 0A 1A 0A";
      console.log("png", ret);
      return ispng;
    },
    async isJpg(file) {
      const len = file.size;
      const start = await this.blobToString(file.slice(0, 2));
      const tail = await this.blobToString(file.slice(-2, len));
      console.log(start, tail);
      const isjpg = start == "FF D8" && tail == "FF D9";

      return isjpg;
    },
    async isImage(file) {
      return (
        (await this.isGif(file)) ||
        (await this.isPng(file)) ||
        (await this.isJpg(file))
      );
    },
    createFileChunk(file, size = CHUNK_SIZE) {
      const chunks = [];
      let cur = 0;
      while (cur < this.file.size) {
        chunks.push({ index: cur, file: this.file.slice(cur, cur + size) });
        cur += size;
      }
      return chunks;
    },
    async calculateHashWorker() {
      return new Promise(resolve => {
        this.worker = new Worker("/hash.js");
        this.worker.postMessage({ chunks: this.chunks });
        this.worker.onmessage = e => {
          const { progress, hash } = e.data;
          this.hashProgress = Number(progress.toFixed(2));
          if (hash) {
            resolve(hash);
          }
        };
      });
    },
    async uploadFiler() {
      // if (!(await this.isImage(this.file))) {
      //   alert("文件格式不对");
      //   return;
      // }
      this.chunks = this.createFileChunk(this.file);
      const hash = await this.calculateHashWorker();
      console.log(hash)
      return;
      const form = new FormData();
      form.append("name", "file");
      form.append("file", this.file);
      const ret = await this.$http.post("/uploadfile", form, {
        onUploadProgress: progress => {
          this.uploadProgress = Number(
            (progress.loaded / progress.total) * 100
          ).toFixed(2);
        }
      });
      console.log(ret);
    },
    handleFilerChange(e) {
      console.log(e);
      const [file] = e.target.files;
      if (!file) return;
      this.file = file;
    }
  }
};
</script>

<style lang="stylus" >
#drag {
  height: 100px;
  line-height: 100px;
  border: 2px dashed #eee;
  text-align: center;
  vertical-align: middle;
}
</style>