import { exec } from "child_process";
import { LIST_LOCAL_BRANCHS } from "./command";
const EXCLUDE_BRANCHS = ["master", "dev", "stage", "uat", "develop"];
let CURRENT_BRANCH = "";
const SPLITE_CHARACTER = "_cgb_";

const getBranchLatesCommit = (branch: string, path?: string) => {
  const cmdStr = `git log ${branch} --oneline --date=relative --pretty=format:"%h%${SPLITE_CHARACTER}%ad${SPLITE_CHARACTER}%s${SPLITE_CHARACTER}%ct" | head -n 1`;

  return new Promise((resolve, reject) => {
    exec(cmdStr, { cwd: path }, (err, stdout, stderr) => {
      const arr = stdout.split("_cgb_");
      const obj = {
        hash: arr[0].trim(),
        date: arr[1].split("\n")[0],
        date_unix: Number(arr[3].split("\n")[0]),
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
const generateBranchList = (path?: string) => {
  return new Promise((resolve, reject) => {
    exec(LIST_LOCAL_BRANCHS, { cwd: path }, async (err, stdout, stderr) => {
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
      const tempArr: any[] = [];
      let tempRes;
      for (let i = 0, len = branchList.length; i < len; i++) {
        if (branchList[i]) {
          tempRes = await getBranchLatesCommit(branchList[i]);
          tempArr.push(tempRes);
        }
      }
      tempArr.sort((a, b) => a.date_unix - b.date_unix);
      resolve(tempArr);
    });
  });
};
export const deleteBranchs = (branch: string[]) => {
  const cmdStr = `git branch -D ${branch.join(" ")}`;
  return new Promise((resolve, reject) => {
    exec(cmdStr, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }
      resolve(stdout);
    });
  });
};
export default generateBranchList;
