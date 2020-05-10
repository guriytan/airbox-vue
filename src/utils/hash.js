import SparkMD5 from 'spark-md5'

export default function CalcMD5(file) {
  return new Promise(resolve => {
    let blobSlice = File.prototype.slice || File.prototype.webkitSlice || File.prototype.mozSlice,
      chunkSize = 1024 * 1024 * 4,
      chunks = file.size / chunkSize,
      currentChunk = 0,
      spark = new SparkMD5.ArrayBuffer(),
      fileReader = new FileReader();

    fileReader.onload = function (e) {
      spark.append(this.result);
      currentChunk++;

      if (currentChunk < chunks) {
        loadNext();
      } else {
        resolve(spark.end());
      }
    }

    function loadNext() {
      let start = currentChunk * chunkSize,
        end = ((start + chunkSize) >= file.size) ? file.size : (start + chunkSize);

      fileReader.readAsArrayBuffer(blobSlice.apply(file, [start, end]));
    }

    loadNext();
  })
}
