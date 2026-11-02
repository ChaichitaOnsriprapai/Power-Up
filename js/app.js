const $ = (id) => document.getElementById(id);

const profiles = [];
const createProfile = $("create-profile-form");

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
  };

profiles.push(profileData);
  console.log("บันทึกสำเร็จ:", profileData);
  console.log("รายชื่อทั้งหมด:", profiles);
  createProfile.reset();

});