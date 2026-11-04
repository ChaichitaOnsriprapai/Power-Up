const $ = (id) => document.getElementById(id);

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
    `<div class="card mb-3">
      <div class="card-body">
        <h3 class="mb-3">${item.title}</h3>
        <p><strong>Date:</strong> ${item.date}</p>
        <p><strong>Type:</strong> ${item.type}</p>
        <p><strong>Role:</strong> ${item.role}</p>
        <p><strong>Description:</strong> ${item.description}</p>
        <p><strong>Skills:</strong> ${item.skills.join(", ")}</p>
        <div class="reflection">
          <h4>Reflection</h4>
          <p><strong>What I Did:</strong> ${item.reflection.whatIDid}</p>
          <p><strong>What I Learned:</strong> ${item.reflection.whatILearned}</p>
          <p><strong>Challenge:</strong> ${item.reflection.challenge}</p>
          <p><strong>Next Step:</strong> ${item.reflection.nextStep}</p>
        </div>
        <div class="evidence">
          <h4>Evidence</h4>
          ${item.evidence.map(url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`).join("<br>")}
        </div>
      </div>
      </div>`;
  });
}

function renderProfileInfo() {
  const profileInfo = $("profile-info");
  profileInfo.innerHTML = "";
  const currentProfile = profiles.find((p) => p.id == activeProfileId);

  if (currentProfile) {
    profileInfo.innerHTML +=
      `<div class="card mb-3">
        <div class="card-body">
        <h2>${currentProfile.name}</h2>
        <p><strong>What I Enjoy:</strong> ${currentProfile.whatIEnjoy}</p>
        <p><strong>What I've Tried:</strong> ${currentProfile.whatIveTried}</p>
        <p><strong>What I'm Curious About:</strong> ${currentProfile.whatImCuriousAbout}</p>
        </div>
      </div>`;
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
      console.log("เลือกโปรไฟล์ปัจจุบัน:", profile);
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

  console.log("บันทึกสำเร็จ:", profileData);
  console.log("รายชื่อทั้งหมด:", profiles);

  renderProfileList();
  createProfile.reset();
});

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
  saveProfiles();
  console.log("บันทึกผลงานสำเร็จ:", itemData);
  console.log("ผลงานทั้งหมดของโปรไฟล์ปัจจุบัน:", currentProfile.items);
  renderItemList();
  itemForm.reset();
});

// Script สำหรับกดปุ่มเพื่อเพิ่มผลงานตัวอย่างเข้าโปรไฟล์ Active ใช้ทดสอบการแสดงผล made by AI!!!
$("add-test-item").addEventListener("click", function () {
  const currentProfile = profiles.find((p) => p.id == activeProfileId);
  if (currentProfile == null) {
    alert("กรุณาสร้างหรือเลือกโปรไฟล์ก่อนเพิ่มผลงานทดสอบ");
    return;
  }

  const today = new Date();
  const todayString = today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

  const testItem = {
    id: "item_" + String(currentProfile.items.length + 1).padStart(3, "0"),
    title: "Test Portfolio Item " + String(currentProfile.items.length + 1),
    type: "Test Activity",
    date: todayString,
    role: "Student",
    description: "ผลงานตัวอย่างที่เพิ่มด้วยปุ่มทดสอบ",
    skills: ["HTML", "CSS", "JavaScript"],
    reflection: {
      whatIDid: "ทดลองเพิ่มผลงานเข้า Portfolio",
      whatILearned: "เรียนรู้การแสดงข้อมูลจาก Profile",
      challenge: "ตรวจสอบว่าผลงานผูกกับโปรไฟล์ที่เลือก",
      nextStep: "ทดสอบเพิ่มผลงานในโปรไฟล์อื่น"
    },
    evidence: ["https://example.com"]
  };

  currentProfile.items.push(testItem);
  saveProfiles();
  $("item-errors").textContent = "";
  $("item-success").textContent = "เพิ่มผลงานทดสอบสำเร็จ!";
  renderItemList();
  console.log("เพิ่มผลงานทดสอบ:", testItem);
});

renderProfileList();
