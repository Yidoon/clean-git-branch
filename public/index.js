let branchList = [];
const checkedBranchList = [];
const reqDeleteBranchs = (branchs) => {
  fetch("http://localhost:8080/branchs/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      branchs: branchs,
    }),
  })
    .then(async (res) => {
      getBranchList();
      checkedBranchList = [];
    })
    .catch((err) => {
      console.error(err);
    });
};
const handleDeleteBranch = () => {
  const checkboxEls = document.getElementsByClassName("branch-item-checkbox");
  for (let i = 0, len = checkboxEls.length; i < len; i++) {
    if (checkboxEls[i].checked) {
      checkedBranchList.push(checkboxEls[i].getAttribute("data-branch"));
    }
  }
  reqDeleteBranchs(checkedBranchList);
};
const handleDelete = (e) => {
  const target = e.target;
  const branch = target.getAttribute("data-branch");
  reqDeleteBranchs([branch]);
};
const bindEvent = () => {
  const batchDeleteBtn = document.getElementById("batch-delete");
  console.log(batchDeleteBtn, "batchDeleteBtn");
  batchDeleteBtn.addEventListener("click", handleDeleteBranch);
};
const createNode = (branchObj) => {
  const text = `${branchObj.hash} - ${branchObj.date} - ${branchObj.subject}`;
  const li = document.createElement("li");
  li.setAttribute("data-hash", branchObj.hash);
  li.classList.add("branch-item");
  const span = document.createElement("span");
  span.classList.add("branch-item-text");
  const button = document.createElement("button");
  const input = document.createElement("input");
  input.setAttribute("data-branch", branchObj.branch);
  input.setAttribute("id", branchObj.branch);
  input.classList.add("branch-item-checkbox");
  input.type = "checkbox";
  button.innerText = "Delete";
  button.classList.add("btn-delete");
  button.setAttribute("data-branch", branchObj.branch);
  button.addEventListener("click", handleDelete);
  span.innerText = text;
  li.appendChild(input);
  li.appendChild(span);
  li.appendChild(button);
  return li;
};
const renderBranch = () => {
  const branchWrapEl = document.getElementById("branch-list-wrap");
  branchWrapEl.innerHTML = "";
  let tempEl;
  let text;
  console.log(branchWrapEl, "branchWrapEl");
  console.log(branchList, "branchList");
  for (let i = 0, len = branchList.length; i < len; i++) {
    tempNode = createNode(branchList[i]);
    branchWrapEl.appendChild(tempNode);
  }
};
const getBranchList = () => {
  fetch("http://localhost:8080/branchs")
    .then(async (res) => {
      const data = await res.json();
      branchList = data.data;
      renderBranch();
    })
    .catch((err) => {
      console.error(err);
    });
};
const init = () => {
  getBranchList();
  bindEvent();
};
init();
