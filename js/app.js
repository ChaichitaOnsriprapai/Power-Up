const $ = (id) => document.getElementById(id);
const profiles = [];
let activeProfileId = null;
const createProfile = $("create-profile-form");

function renderProfileList() {
  const profileList = $("profile-list");
  profileList.innerHTML = "";

  if (profiles.length == 0) {
    profileList.innerHTML = '<p class="text-muted text-center">ยังไม่มีโปรไฟล์ กรุณาสร้างโปรไฟล์ก่อน</p>';
    if ($("item-form-note")) {
      $("item-form-note").textContent = "กรุณาสร้างหรือเลือกโปรไฟล์ก่อนเพิ่มผลงาน";
    }
    return;
  }

  profiles.forEach((profile) => {
    const button = document.createElement("button");
    button.type = "button";

    const isActive = profile.id == activeProfileId;

    button.className = isActive
      ? "btn btn-primary w-100 mb-2 text-start d-flex justify-content-between align-items-center"
      : "btn btn-outline-secondary w-100 mb-2 text-start d-flex justify-content-between align-items-center";

    let activeBadge = "";
    if (isActive) {
      activeBadge = "<span class='badge bg-light text-primary'>Active</span>";
    }
    button.innerHTML = "<span><strong>" + profile.name + "</strong></span>" + activeBadge;

    button.addEventListener("click", function () {
      activeProfileId = profile.id;
      renderProfileList();
      console.log("เลือกโปรไฟล์ปัจจุบัน:", profile);
    });

    profileList.appendChild(button);
  });

  const currentProfile = profiles.find((p) => p.id == activeProfileId);
  if ($("item-form-note") && currentProfile) {
    $("item-form-note").textContent = "กำลังจัดการโปรไฟล์: " + currentProfile.name;
  }
  renderItemList();
  if ($("item-errors")) $("item-errors").textContent = "";
  if ($("item-success")) $("item-success").textContent = "";
}

createProfile.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = $("name").value.trim();
  const whatIEnjoy = $("what-i-enjoy").value.trim();
  const whatIveTried = $("what-ive-tried").value.trim();
  const whatImCuriousAbout = $("what-im-curious-about").value.trim();

  const profileData = {
    id: "profile_" + String(profiles.length + 1).padStart(3, "0"),
    name: name,
    whatIEnjoy: whatIEnjoy,
    whatIveTried: whatIveTried,
    whatImCuriousAbout: whatImCuriousAbout,
    items: []
  };

  profiles.push(profileData);
  activeProfileId = profileData.id;

  console.log("บันทึกสำเร็จ:", profileData);
  console.log("รายชื่อทั้งหมด:", profiles);

  renderProfileList();
  createProfile.reset();
});

function renderItemList() {
  const itemList = $("item-list");
  if (!itemList) return;
  itemList.innerHTML = "";

  const currentProfile = profiles.find((p) => p.id == activeProfileId);

  if (!currentProfile || currentProfile.items.length === 0) {
    itemList.innerHTML = '<p class="text-muted text-center">ยังไม่มีผลงานในโปรไฟล์นี้</p>';
    return;
  }

  currentProfile.items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card mb-3 shadow-sm";
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${item.title} <span class="badge bg-info text-dark">${item.type}</span></h5>
        <h6 class="card-subtitle mb-2 text-muted">Role: ${item.role} | Date: ${item.date}</h6>
        <p class="card-text">${item.description}</p>
        <div class="mb-2">
          <strong>Skills:</strong> ${item.skills.map(s => `<span class="badge bg-secondary me-1">${s}</span>`).join("")}
        </div>
        <div class="small text-muted mb-2">
          <strong>Evidence:</strong>
          <ul>${item.evidence.map(url => `<li><a href="${url}" target="_blank">${url}</a></li>`).join("")}</ul>
        </div>
      </div>
    `;
    itemList.appendChild(card);
  });
}

renderProfileList();

const itemForm = $("item-form");

itemForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const currentProfile = profiles.find((p) => p.id == activeProfileId);
  if (currentProfile == null) {
    alert("กรุณาสร้างหรือเลือกโปรไฟล์ก่อนเพิ่มผลงาน");
    return;
  }

  const title = $("item-title").value.trim();
  const date = $("item-date").value.trim();
  const type = $("item-type").value.trim();
  const role = $("item-role").value.trim();
  const description = $("item-description").value.trim();

  const skills = $("item-skills").value.split(",").map(skill => skill.trim()).filter(skill => skill != "");

  const reflection = {
    whatIDid: $("item-what-i-did").value.trim(),
    whatILearned: $("item-what-i-learned").value.trim(),
    challenge: $("item-challenge").value.trim(),
    nextStep: $("item-next-step").value.trim()
  };

  const evidence = $("item-evidence").value.split("\n").map(url => url.trim()).filter(url => url != "");

  if (title == "" || date == "" || type == "" || role == "" || description == "") {
    $("item-errors").textContent = "กรุณากรอกข้อมูลให้ครบถ้วน";
    $("item-success").textContent = "";
    return;
  }

  if (evidence.length == 0) {
    $("item-errors").textContent = "กรุณากรอก Evidence URL อย่างน้อย 1 รายการ";
    $("item-success").textContent = "";
    return;
  }

  const hasInvalidUrl = evidence.some(url => !url.startsWith("http://") && !url.startsWith("https://"));
  if (hasInvalidUrl) {
    $("item-errors").textContent = "กรุณากรอก URL ที่ถูกต้อง (ต้องขึ้นต้นด้วย http:// หรือ https://)";
    $("item-success").textContent = "";
    return;
  }

  $("item-errors").textContent = "";
  $("item-success").textContent = "บันทึกผลงานสำเร็จ!";

  const itemId = "item_" + String(currentProfile.items.length + 1).padStart(3, "0");

  const itemData = {
    id: itemId,
    title: title,
    date: date,
    type: type,
    role: role,
    description: description,
    skills: skills,
    reflection: reflection,
    evidence: evidence
  };

  currentProfile.items.push(itemData);
  console.log("บันทึกผลงานสำเร็จ:", itemData);
  console.log("ผลงานทั้งหมดของโปรไฟล์ปัจจุบัน:", currentProfile.items);
  renderItemList();
  itemForm.reset();
});