import axios from "axios"
import fs from 'fs'
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:56.0) Gecko/20100101 Firefox/56.0";
export default axios.create({
  timeout: 10000,
  headers: { "User-Agent": UA },
}); 


type onProgressFunc = (total: number, sum: number) => void;

export const downloadFile = async (
  url: string,
  filename: string,
  onProgress?: onProgressFunc
) => {
  const { data, headers } = await axios({
    url: url,
    method: "GET",
    responseType: "stream",
  });
  const contentLength = headers["content-length"];
  let total = 0;
  if (contentLength) {
    total = Number.parseInt(contentLength);
  }
  let sum = 0;
  data.on("data", (chunk) => {
    if (total !== 0) {
      sum += chunk.length;
      if (onProgress) {
        onProgress(total, sum);
      }
    }
  });
  await data.pipe(fs.createWriteStream(filename));
};