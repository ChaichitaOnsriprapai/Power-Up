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

renderProfileList();
