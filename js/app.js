document.addEventListener("DOMContentLoaded", () => {
  const storeNumber = document.getElementById("storeNumber");
  const storeName = document.getElementById("storeName");
  const addItemBtn = document.getElementById("addItemBtn");
  const itemsContainer = document.getElementById("items-container");
  const form = document.getElementById("survey-form");
  const thankYouMessage = document.getElementById("thankYouMessage"); // ✅ メッセージ要素を取得

  const stores = [
    { number: "001", name: "本店" },
    { number: "002", name: "駅前店" },
    { number: "003", name: "南支店" },
    { number: "004", name: "北支店" }
  ];

  // 店番セレクトの初期化
  stores.forEach(store => {
    const option = document.createElement("option");
    option.value = store.number;
    option.textContent = store.number;
    storeNumber.appendChild(option);
  });

  // 店番選択時に店名を自動補完
  storeNumber.addEventListener("change", () => {
    const selected = stores.find(s => s.number === storeNumber.value);
    storeName.value = selected ? selected.name : "";
  });

  // 項目セット追加処理
  const addItem = () => {
    const template = document.getElementById("item-template");
    const clone = template.content.cloneNode(true);
    itemsContainer.appendChild(clone);
  };

  // 初期表示で3セット追加
  for (let i = 0; i < 3; i++) addItem();

  addItemBtn.addEventListener("click", addItem);

  // ✅ フォーム送信処理
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      storeNumber: storeNumber.value,
      storeName: storeName.value,
      userName: document.getElementById("userName").value,
      items: []
    };

    const itemBlocks = document.querySelectorAll(".item-block");
    for (const block of itemBlocks) {
      const category = block.querySelector("select[name='category']").value.trim();
      const problem = block.querySelector("textarea[name='problem']").value.trim();
      const request = block.querySelector("textarea[name='request']").value.trim();

      // 全部空のセットは送信対象から除外
      if (category || problem || request) {
        data.items.push({ category, problem, request });
      }
    }

    // 空データなら送信しない
    if (!data.items.length) {
      alert("少なくとも1つの項目を入力してください。");
      return;
    }

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbypdL44AMEiv1gpOx-EbgdUlvXriw8b7mjtRu_g8tpLIOC_rjXD0LldeuQcIFtxAvf2mw/exec", {
        method: "POST",
        mode: "no-cors",  // ⭐ これが重要！
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });


      if (response.ok) {
        // ✅ フォーム非表示 & 完了メッセージ表示
        form.style.display = "none";
        thankYouMessage.style.display = "block";
      } else {
        alert("送信に失敗しました。もう一度お試しください。");
      }
    } catch (error) {
      console.error("送信エラー:", error);
      alert("通信エラーが発生しました。");
    }
  });
});
