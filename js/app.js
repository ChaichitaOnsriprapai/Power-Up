const $ = (id) => document.getElementById(id);

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function formatDisplayDate(date) {
  const match = String(date ?? "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : date;
}

function loadProfiles() {
  const savedProfiles = localStorage.getItem("profiles");
  return savedProfiles ? JSON.parse(savedProfiles) : [];
}

function saveProfiles() {
  localStorage.setItem("profiles", JSON.stringify(profiles));
}

const profiles = loadProfiles();
let activeProfileId = profiles.length > 0 ? profiles[0].id : null;
const createProfile = $("create-profile-form");
const createProfileButton = $("create-profile");

function updateCreateProfileButton() {
  const requiredFields = ["name", "what-i-enjoy", "what-ive-tried", "what-im-curious-about"];
  const isComplete = requiredFields.every((id) => $(id).value.trim() !== "");
  createProfileButton.classList.toggle("is-ready", isComplete);
}

["name", "what-i-enjoy", "what-ive-tried", "what-im-curious-about"].forEach((id) => {
  $(id).addEventListener("input", updateCreateProfileButton);
});
updateCreateProfileButton();

function renderItemList() {
  const itemList = $("item-list");
  itemList.innerHTML = "";

  const currentProfile = profiles.find((p) => p.id == activeProfileId);
  if (currentProfile == null || currentProfile.items.length == 0) {
    itemList.innerHTML = '<p class="text-muted text-center">ยังไม่มีผลงานในโปรไฟล์นี้</p>';
    return;
  }

  currentProfile.items.forEach((item) => {
    itemList.innerHTML +=
    `<article class="card portfolio-item-card">
      <div class="card-body">
        <div class="portfolio-item-heading">
          <div><div class="item-meta"><span class="item-type">${escapeHtml(item.type)}</span><span>${escapeHtml(formatDisplayDate(item.date))}</span></div>
          <h3>${escapeHtml(item.title)}</h3></div>
          <span class="item-role">${escapeHtml(item.role)}</span>
        </div>
        <p class="item-description">${escapeHtml(item.description)}</p>
        <div class="skills-list" aria-label="Skills">${item.skills.map(skill => `<span class="skill-chip">${escapeHtml(skill)}</span>`).join("")}</div>
        <section class="reflection" aria-label="Reflection">
          <h4><span class="reflection-mark">✳</span> Reflection</h4>
          <div class="reflection-grid">
            <div><span class="reflection-label">What I did</span><p>${escapeHtml(item.reflection.whatIDid)}</p></div>
            <div><span class="reflection-label">What I learned</span><p>${escapeHtml(item.reflection.whatILearned)}</p></div>
            <div><span class="reflection-label">Challenge</span><p>${escapeHtml(item.reflection.challenge)}</p></div>
            <div><span class="reflection-label">Next step</span><p>${escapeHtml(item.reflection.nextStep)}</p></div>
          </div>
        </section>
        <div class="evidence">
          <h4>Evidence</h4>
          <div class="evidence-links">${item.evidence.map(url => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">View evidence <span aria-hidden="true">↗</span></a>`).join("")}</div>
        </div>
      </div>
    </article>`;
  });
}

function renderProfileInfo() {
  const profileInfo = $("profile-info");
  profileInfo.innerHTML = "";
  const currentProfile = profiles.find((p) => p.id == activeProfileId);

  if (currentProfile) {
    profileInfo.innerHTML +=
      `<section class="profile-summary">
        <div class="profile-summary-heading"><span class="profile-avatar" aria-hidden="true">${escapeHtml(currentProfile.name.trim().charAt(0).toUpperCase())}</span><div><span class="profile-kicker">LEARNING PORTFOLIO</span><h2>${escapeHtml(currentProfile.name)}</h2></div></div>
        <div class="profile-facts">
          <div><span>What I enjoy</span><p>${escapeHtml(currentProfile.whatIEnjoy)}</p></div>
          <div><span>What I’ve tried</span><p>${escapeHtml(currentProfile.whatIveTried)}</p></div>
          <div><span>What I’m curious about</span><p>${escapeHtml(currentProfile.whatImCuriousAbout)}</p></div>
        </div>
      </section>`;
  }
}

function renderProfileList() {
  const profileList = $("profile-list");
  profileList.innerHTML = "";

  if (profiles.length == 0) {
    profileList.innerHTML = '<p class="text-muted text-center">ยังไม่มีโปรไฟล์ กรุณาสร้างโปรไฟล์ก่อน</p>';
    if ($("item-form-note")) {
      $("item-form-note").textContent = "กรุณาสร้างหรือเลือกโปรไฟล์ก่อนเพิ่มผลงาน";
    }
    renderItemList();
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
    });

    profileList.appendChild(button);
  });

  const currentProfile = profiles.find((p) => p.id == activeProfileId);
  if ($("item-form-note") && currentProfile) {
    $("item-form-note").innerHTML =
      "กำลังจัดการโปรไฟล์: <strong>" + currentProfile.name + "</strong>";
  }

  renderItemList();
  renderProfileInfo();
}

createProfile.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = $("name").value.trim();
  const whatIEnjoy = $("what-i-enjoy").value.trim();
  const whatIveTried = $("what-ive-tried").value.trim();
  const whatImCuriousAbout = $("what-im-curious-about").value.trim();

  if (name == "" || whatIEnjoy == "" || whatIveTried == "" || whatImCuriousAbout == "") {
    $("profile-errors").textContent = "กรุณากรอกข้อมูลโปรไฟล์ให้ครบทุกช่อง";
    $("profile-success").textContent = "";
    return;
  }

  $("profile-errors").textContent = "";
  $("profile-success").textContent = "";

  const profileData = {
    id: "profile_" + String(profiles.length + 1).padStart(3, "0"),
    name: name,
    whatIEnjoy: whatIEnjoy,
    whatIveTried: whatIveTried,
    whatImCuriousAbout: whatImCuriousAbout,
    items: []
  };

  profiles.push(profileData);
  saveProfiles();
  activeProfileId = profileData.id;

  renderProfileList();
  createProfile.reset();
  updateCreateProfileButton();
  $("profile-success").textContent = "บันทึกโปรไฟล์สำเร็จ!";
});

const itemForm = $("item-form");
const saveItemButton = $("save-item-button");

function updateSaveItemButton() {
  const requiredFields = [
    "item-title", "item-date", "item-type", "item-role", "item-description",
    "item-what-i-did", "item-what-i-learned", "item-challenge", "item-next-step"
  ];
  const fieldsComplete = requiredFields.every((id) => $(id).value.trim() !== "");
  const hasSkill = $("item-skills").value.split(",").some((skill) => skill.trim() !== "");
  const evidenceUrls = $("item-evidence").value.split("\n").map((url) => url.trim()).filter((url) => url !== "");
  const hasHttpEvidence = evidenceUrls.some((url) => url.startsWith("http://") || url.startsWith("https://"));
  const evidenceIsValid = evidenceUrls.every((url) => url.startsWith("http://") || url.startsWith("https://"));

  saveItemButton.classList.toggle("is-ready", fieldsComplete && hasSkill && hasHttpEvidence && evidenceIsValid);
}

["item-title", "item-date", "item-type", "item-role", "item-description", "item-skills",
  "item-what-i-did", "item-what-i-learned", "item-challenge", "item-next-step", "item-evidence"
].forEach((id) => {
  $(id).addEventListener("input", updateSaveItemButton);
});
updateSaveItemButton();

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

  const hasMissingInformation =
    title == "" || date == "" || type == "" || role == "" || description == "" ||
    skills.length == 0 || reflection.whatIDid == "" || reflection.whatILearned == "" ||
    reflection.challenge == "" || reflection.nextStep == "";

  if (hasMissingInformation) {
    $("item-errors").textContent = "กรุณากรอกข้อมูลให้ครบทุกช่อง";
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
  $("item-success").textContent = "เพิ่มผลงานของคุณ " + currentProfile.name + " สำเร็จ!";

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
  saveProfiles();
  renderItemList();
  itemForm.reset();
  updateSaveItemButton();
});

renderProfileList();

function validateImportedItem(item) {
  if (item === null || typeof item !== "object" || Array.isArray(item)) {
    return "JSON ต้องเป็นผลงาน 1 รายการ";
  }

  const textFields = [
    "id", "title", "date", "type", "role", "description"
  ];

  for (const field of textFields) {
    if (typeof item[field] !== "string" || item[field].trim() === "") {
      return field + " ต้องเป็นข้อความและห้ามว่าง";
    }
  }

  for (const field of ["skills", "evidence"]) {
    if (
      !Array.isArray(item[field]) ||
      item[field].length === 0 ||
      !item[field].every(value =>
        typeof value === "string" && value.trim() !== ""
      )
    ) {
      return field + " ต้องเป็น Array ของข้อความอย่างน้อย 1 รายการ";
    }
  }

  if (
    item.reflection === null ||
    typeof item.reflection !== "object" ||
    Array.isArray(item.reflection)
  ) {
    return "ต้องมี reflection เป็น Object";
  }

  const reflectionFields = [
    "whatIDid", "whatILearned", "challenge", "nextStep"
  ];

  for (const field of reflectionFields) {
    if (
      typeof item.reflection[field] !== "string" ||
      item.reflection[field].trim() === ""
    ) {
      return "reflection." + field + " ต้องเป็นข้อความและห้ามว่าง";
    }
  }

  for (const evidence of item.evidence) {
    try {
      const url = new URL(evidence);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return "Evidence URL ต้องใช้ http:// หรือ https://";
      }
    } catch {
      return "Evidence URL ไม่ถูกต้อง";
    }
  }

  return "";
}

$("import-item-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  $("import-errors").textContent = "";
  $("import-success").textContent = "";

  const currentProfile = profiles.find(p => p.id == activeProfileId);

  if (!currentProfile) {
    $("import-errors").textContent = "กรุณาสร้างหรือเลือกโปรไฟล์ก่อน";
    return;
  }

  let item;

  try {
    item = JSON.parse($("import-json").value);
  } catch {
    $("import-errors").textContent = "รูปแบบ JSON ไม่ถูกต้อง";
    return;
  }

  const error = validateImportedItem(item);

  if (error) {
    $("import-errors").textContent = error;
    return;
  }

  if (currentProfile.items.some(existing => existing.id === item.id)) {
    $("import-errors").textContent = "มี Item ID นี้ในโปรไฟล์แล้ว";
    return;
  }

  currentProfile.items.push(item);

  try {
    await saveProfiles();
  } catch {
    currentProfile.items.splice(currentProfile.items.indexOf(item), 1);
    $("import-errors").textContent = "บันทึกไม่สำเร็จ กรุณาลองใหม่";
    return;
  }

  renderItemList();
  $("import-json").value = "";
  $("import-success").textContent = "Import ผลงานสำเร็จ!";
});