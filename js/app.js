document.addEventListener("DOMContentLoaded", () => {
  // === DOM取得 ===
  const storeNumber = document.getElementById("storeNumber");
  const storeName = document.getElementById("storeName");
  const addItemBtn = document.getElementById("addItemBtn");
  const itemsContainer = document.getElementById("items-container");
  const form = document.getElementById("survey-form");
  const thankYouMessage = document.getElementById("thankYouMessage");
  const userNameInput = document.getElementById("userName");
  const saveBtn = document.getElementById("saveBtn");
  const itemTemplate = document.getElementById("item-template");

  // === 店舗データ ===
  const stores = [
    { number: "001", name: "本店" },
    { number: "002", name: "駅前店" },
    { number: "003", name: "南支店" },
    { number: "004", name: "北支店" }
  ];

  // === 店番セレクト初期化 ===
  const populateStoreOptions = () => {
    stores.forEach(({ number }) => {
      const option = document.createElement("option");
      option.value = number;
      option.textContent = number;
      storeNumber.appendChild(option);
    });
  };

  // === 店番→店名連動 ===
  const syncStoreName = () => {
    const selected = stores.find(s => s.number === storeNumber.value);
    storeName.value = selected?.name || "";
  };

  // === 項目ブロック追加 ===
  const addItemBlock = () => {
    const clone = itemTemplate.content.cloneNode(true);
    itemsContainer.appendChild(clone);
  };

  // === 保存（あとで入力） ===
  const saveDraft = () => {
    const userName = userNameInput.value.trim();
    const storeNo = storeNumber.value;
    const storeNm = storeName.value;

    const itemBlocks = document.querySelectorAll(".item-block");
    const items = [];

    itemBlocks.forEach(block => {
      const category = block.querySelector("select[name='category']").value;
      const problem = block.querySelector("textarea[name='problem']").value;
      const request = block.querySelector("textarea[name='request']").value;
      items.push({ category, problem, request });
    });

    const savedData = {
      storeNumber: storeNo,
      storeName: storeNm,
      userName: userName,
      items: items
    };

    localStorage.setItem("magokoro_survey_draft", JSON.stringify(savedData));
    alert("保存しました（あとで入力を再開できます）");
  };

  // === 復元処理 ===
  const restoreDraft = () => {
    const saved = localStorage.getItem("magokoro_survey_draft");
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      storeNumber.value = data.storeNumber || "";
      syncStoreName();
      userNameInput.value = data.userName || "";

      itemsContainer.innerHTML = "";
      data.items.forEach(item => {
        const clone = itemTemplate.content.cloneNode(true);
        clone.querySelector("select[name='category']").value = item.category || "";
        clone.querySelector("textarea[name='problem']").value = item.problem || "";
        clone.querySelector("textarea[name='request']").value = item.request || "";
        itemsContainer.appendChild(clone);
      });
    } catch (err) {
      console.error("復元失敗:", err);
    }
  };

  // === 初期化処理 ===
  populateStoreOptions();
  restoreDraft();
  for (let i = 0; i < 3; i++) addItemBlock();

  storeNumber.addEventListener("change", syncStoreName);
  addItemBtn.addEventListener("click", addItemBlock);
  saveBtn.addEventListener("click", saveDraft);

  // === フォーム送信処理 ===
  // form.addEventListener("submit", async (e) => {
  // e.preventDefault();

  // const userName = userNameInput.value.trim();
  // if (!userName) {
  //   alert("お名前を入力してください。");
  //   return;
  // }

  // const itemBlocks = document.querySelectorAll(".item-block");

  // const formData = new URLSearchParams();
  // formData.append("storeId", storeNumber.value);
  // formData.append("storeName", storeName.value);
  // formData.append("name", userName);

  // itemBlocks.forEach(block => {
  //   const category = block.querySelector("select[name='category']").value.trim();
  //   const issue = block.querySelector("textarea[name='issue']").value.trim();
  //   const request = block.querySelector("textarea[name='request']").value.trim();
  //   formData.append("category[]", category);
  //   formData.append("issue[]", issue);
  //   formData.append("request[]", request);
  // });

  // try {
  //   const response = await fetch(
  //     "https://script.google.com/macros/s/AKfycbxZJtYUQKbTXP9TkFoR_MVC6KzlhmyEzINVeu6lvSkXuqxhrV-C9bZjLCgbIHaYn8w-pg/exec",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded"
  //       },
  //       body: formData.toString()
  //     }
  //   );

  //   const resultText = await response.text();
  //   console.log("📨 GASレスポンス:", resultText);

  //   if (resultText.trim().toUpperCase() === "OK") {
  //     localStorage.removeItem("magokoro_survey_draft");
  //     form.style.display = "none";
  //     thankYouMessage.style.display = "block";
  //   } else {
  //     alert("送信に失敗しました: " + resultText);
  //   }
  // } catch (error) {
  //   console.error("送信エラー:", error);
  //   alert("通信エラーが発生しました。もう一度お試しください。");
  // }
});

function saveForm() {
  const form = document.getElementById("magokoroForm");
  const formData = new FormData(form);
  const data = {};

  for (const [key, value] of formData.entries()) {
    if (!data[key]) {
      data[key] = value;
    } else {
      // 配列項目
      if (!Array.isArray(data[key])) data[key] = [data[key]];
      data[key].push(value);
    }
  }

  localStorage.setItem("magokoro_saved", JSON.stringify(data));
  alert("保存しました（この端末のブラウザに一時保存）");
}
