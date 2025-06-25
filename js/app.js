document.addEventListener("DOMContentLoaded", () => {
  const storeNumber = document.getElementById("storeNumber");
  const storeName = document.getElementById("storeName");
  const addItemBtn = document.getElementById("addItemBtn");
  const itemsContainer = document.getElementById("items-container");
  const form = document.getElementById("survey-form");
  const thankYouMessage = document.getElementById("thankYouMessage");

  const stores = [
    { number: "001", name: "本店" },
    { number: "002", name: "駅前店" },
    { number: "003", name: "南支店" },
    { number: "004", name: "北支店" }
  ];

  stores.forEach(store => {
    const option = document.createElement("option");
    option.value = store.number;
    option.textContent = store.number;
    storeNumber.appendChild(option);
  });

  storeNumber.addEventListener("change", () => {
    const selected = stores.find(s => s.number === storeNumber.value);
    storeName.value = selected ? selected.name : "";
  });

  const addItem = () => {
    const template = document.getElementById("item-template");
    const clone = template.content.cloneNode(true);
    itemsContainer.appendChild(clone);
  };

  for (let i = 0; i < 3; i++) addItem();
  addItemBtn.addEventListener("click", addItem);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userName = document.getElementById("userName").value.trim();
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
    for (const block of itemBlocks) {
      const category = block.querySelector("select[name='category']").value.trim();
      const problem = block.querySelector("textarea[name='problem']").value.trim();
      const request = block.querySelector("textarea[name='request']").value.trim();

      if (category || problem || request) {
        data.items.push({ category, problem, request });
      }
    }

    if (!data.items.length) {
      alert("少なくとも1つの項目を入力してください。");
      return;
    }

    try {
      await fetch("https://script.google.com/macros/s/AKfycbwttsEuDzmyhs1pnOTKy6QOg-3zbeNKKyESci6juCcV0InIcRBPto5DwCOrr_B3J2Wbnw/exec", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (form) form.style.display = "none";
      if (thankYouMessage) thankYouMessage.style.display = "block";

    } catch (error) {
      console.error("送信エラー:", error);
      alert("通信エラーが発生しました。もう一度お試しください。");
    }
  });
});
