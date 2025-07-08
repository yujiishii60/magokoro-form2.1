document.addEventListener("DOMContentLoaded", () => {
  // === アンケート締切チェック ===
  const DEADLINE = new Date("2025-07-08T23:59:59+09:00");
  if (new Date() > DEADLINE) {
    document.getElementById("survey-form").style.display = "none";
    document.getElementById("closedMessage").style.display = "block";
    return; // 初期化処理はスキップ
  }
  
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
  form.addEventListener("submit", async (e) => {
  // e.preventDefault(); ← 🚫 フォームの送信を止めない（コメントアウト or 削除）

  // 以下はローカル保存のみに使う（通信はしない）
  const userName = userNameInput.value.trim();
  if (!userName) {
    alert("お名前を入力してください。");
    e.preventDefault(); // 🚨このバリデーションだけは送信を止める
    return;
  }

  // localStorage に保存（入力途中保存用）
  const draft = {
    storeId: storeNumber.value,
    storeName: storeName.value,
    name: userName,
    items: [],
  };

  const itemBlocks = document.querySelectorAll(".item-block");
  itemBlocks.forEach(block => {
    const category = block.querySelector("select[name='category']").value.trim();
    const issue = block.querySelector("textarea[name='issue']").value.trim();
    const request = block.querySelector("textarea[name='request']").value.trim();
    draft.items.push({ category, issue, request });
  });

  localStorage.setItem("magokoro_survey_draft", JSON.stringify(draft));

  // ✅ 送信後の画面切り替えはGAS側で処理してもらうためここでは何もしない

  // ↓↓↓ fetch送信処理は完全にコメントアウト ↓↓↓

  /*
  try {
    const response = await fetch("https://script.google.com/macros/s/xxxxx/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString()
    });

    const resultText = await response.text();
    console.log("📨 GASレスポンス:", resultText);

    if (resultText.trim().toUpperCase() === "OK") {
      localStorage.removeItem("magokoro_survey_draft");
      form.style.display = "none";
      thankYouMessage.style.display = "block";
    } else {
      alert("送信に失敗しました: " + resultText);
    }
  } catch (error) {
    console.error("送信エラー:", error);
    alert("通信エラーが発生しました。もう一度お試しください。");
  }
  */
   });  // 👈 ← submit イベントの終わり
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
