document.addEventListener("DOMContentLoaded", () => {
  // === DOM取得 ===
  const storeNumber = document.getElementById("storeNumber");
  const storeName = document.getElementById("storeName");
  const addItemBtn = document.getElementById("addItemBtn");
  const itemsContainer = document.getElementById("items-container");
  const form = document.getElementById("survey-form");
  const thankYouMessage = document.getElementById("thankYouMessage");
  const userNameInput = document.getElementById("userName");
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

  // === 初期化 ===
  populateStoreOptions();
  for (let i = 0; i < 3; i++) addItemBlock();

  storeNumber.addEventListener("change", syncStoreName);
  addItemBtn.addEventListener("click", addItemBlock);

  // === フォーム送信処理 ===
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userName = userNameInput.value.trim();
    if (!userName) {
      alert("お名前を入力してください。");
      return;
    }

    const data = {
      storeNumber: storeNumber.value,
      storeName: storeName.value,
      userName,
      items: []
    };

    const itemBlocks = document.querySelectorAll(".item-block");
    itemBlocks.forEach(block => {
      const category = block.querySelector("select[name='category']").value.trim();
      const problem = block.querySelector("textarea[name='problem']").value.trim();
      const request = block.querySelector("textarea[name='request']").value.trim();
      if (category || problem || request) {
        data.items.push({ category, problem, request });
      }
    });

    if (data.items.length === 0) {
      alert("少なくとも1つの項目を入力してください。");
      return;
    }

    const formData = new FormData();  // ← URLSearchParams から FormData に変更
    formData.append("storeNumber", data.storeNumber);
    formData.append("storeName", data.storeName);
    formData.append("userName", data.userName);

    // 配列の items を1件ずつ送信（GAS側が単一処理に対応している場合）
    for (const item of data.items) {
      formData.append("category", item.category);
      formData.append("problem", item.problem);
      formData.append("request", item.request);
    }

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbw-gH18e3mJLpiHG7r0b1aKyGNSSVaRvcIWBC6zjvHj-0-c9U6YaqtXUg7HxRE5--I_YQ/exec", {
        method: "POST",
        body: formData  // ← Content-Type自動設定されるため CORS回避
      });

      const resultText = await response.text();
      console.log("📨 GASレスポンス:", resultText);

      if (resultText.trim().toUpperCase() === "OK") {
        form.style.display = "none";
        thankYouMessage.style.display = "block";
      } else {
        alert("送信に失敗しました: " + resultText);
      }
    } catch (error) {
      console.error("送信エラー:", error);
      alert("通信エラーが発生しました。もう一度お試しください。");
    }
  });
});
