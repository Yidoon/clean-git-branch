import { exec } from "child_process";
import { LIST_LOCAL_BRANCHS } from "../commad";
const EXCLUDE_BRANCHS = ["master", "dev", "stage", "uat", "develop"];
let CURRENT_BRANCH = "";

const getBranchLatesCommit = (branch: string) => {
  const cmdStr = `git log ${branch} --oneline --date=relative --pretty=format:"%h_%ad_%s" | head -n 1`;
  return new Promise((resolve, reject) => {
    exec(cmdStr, (err, stdout, stderr) => {
      const arr = stdout.split("_");
      const obj = {
        hash: arr[0].trim(),
        date: arr[1].split("\n")[0],
        branch: branch,
        subject: arr[2].trim(),
      };
      if (!err) {
        resolve(obj);
      } else {
        reject(err);
      }
    });
  });
};
const generateBranchList = () => {
  return new Promise((resolve, reject) => {
    exec(LIST_LOCAL_BRANCHS, {}, async (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }
      let branchList = stdout.split("\n").map((name: string) => {
        return name.trim();
      });
      branchList = branchList.filter((name) => {
        if (name.indexOf("*") > -1) {
          CURRENT_BRANCH = name.replace("*", "").trim();
        }
        return name && !EXCLUDE_BRANCHS.includes(name) && name.indexOf("*") < 0;
      });
      const tempArr = [];
      let tempRes;
      for (let i = 0, len = branchList.length; i < len; i++) {
        tempRes = await getBranchLatesCommit(branchList[i]);
        tempArr.push(tempRes);
      }
      resolve(tempArr);
    });
  });
};
export default generateBranchList;
