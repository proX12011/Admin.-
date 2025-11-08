import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC8UmPkL9-AgrlPRPERwkYJ5uzTYX1fmDY",
  authDomain: "test-yourself-6afaa.firebaseapp.com",
  databaseURL: "https://test-yourself-6afaa-default-rtdb.firebaseio.com",
  projectId: "test-yourself-6afaa",
  storageBucket: "test-yourself-6afaa.firebasestorage.app",
  messagingSenderId: "886218676173",
  appId: "1:886218676173:web:6000c95948433e89d1d684",
  measurementId: "G-SXBVYN9R4R"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// عناصر الصفحة
const logoUrlInput = document.getElementById("logoUrl");
const saveLogoBtn = document.getElementById("saveLogo");

const siteNameInput = document.getElementById("siteName");
const siteLocationInput = document.getElementById("siteLocation");
const saveSiteInfoBtn = document.getElementById("saveSiteInfo");

const socialName = document.getElementById("socialName");
const socialImage = document.getElementById("socialImage");
const socialLink = document.getElementById("socialLink");
const addSocialBtn = document.getElementById("addSocial");
const socialList = document.getElementById("socialList");

const nameInput = document.getElementById("name");
const subjectInput = document.getElementById("subject");
const gradeInput = document.getElementById("grade");
const imageInput = document.getElementById("image");
const ratingInput = document.getElementById("rating");
const addTeacherBtn = document.getElementById("addTeacher");
const teachersDiv = document.getElementById("teachers");

const settingsRef = ref(db, "settings");
const socialsRef = ref(db, "socials");
const teachersRef = ref(db, "teachers");

/* 🌐 حفظ الشعار */
saveLogoBtn.addEventListener("click", async () => {
  const url = logoUrlInput.value.trim();
  if (!url) return alert("من فضلك أدخل رابط الشعار!");
  await set(ref(db, "settings/logo"), url);
  alert("✅ تم حفظ الشعار بنجاح!");
  logoUrlInput.value = "";
});

/* 🗺️ حفظ معلومات الموقع */
saveSiteInfoBtn.addEventListener("click", async () => {
  const name = siteNameInput.value.trim();
  const location = siteLocationInput.value.trim();
  if (!location) return alert("يرجى إدخال موقع جغرافي!");
  await set(ref(db, "settings/siteInfo"), { name, location });
  alert("✅ تم حفظ معلومات الموقع!");
  siteNameInput.value = siteLocationInput.value = "";
});

/* 🔗 إضافة روابط التواصل الاجتماعي */
addSocialBtn.addEventListener("click", async () => {
  const n = socialName.value.trim();
  const i = socialImage.value.trim();
  const l = socialLink.value.trim();
  if (!n || !l) return alert("يرجى إدخال الاسم والرابط!");
  await push(socialsRef, { name: n, image: i || "", link: l });
  alert("✅ تم إضافة الرابط!");
  socialName.value = socialImage.value = socialLink.value = "";
});

/* عرض روابط التواصل */
onValue(socialsRef, (snap) => {
  const data = snap.val();
  socialList.innerHTML = "";
  if (data) {
    Object.entries(data).forEach(([id, soc]) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <img src="${soc.image || 'https://via.placeholder.com/24'}" width="24" height="24" style="vertical-align:middle;border-radius:50%"> 
        <b>${soc.name}</b> - <a href="${soc.link}" target="_blank">${soc.link}</a>
        <button data-id="${id}" class="delete-social">🗑️</button>
      `;
      socialList.appendChild(div);
    });
    document.querySelectorAll(".delete-social").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (confirm("هل تريد حذف هذا الرابط؟")) {
          await remove(ref(db, "socials/" + btn.dataset.id));
        }
      });
    });
  } else {
    socialList.innerHTML = "<p>لا توجد روابط بعد.</p>";
  }
});

/* ➕ إضافة معلم */
addTeacherBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const subject = subjectInput.value.trim();
  const grade = gradeInput.value.trim();
  const image = imageInput.value.trim();
  const rating = ratingInput.value.trim();
  if (!name || !subject || !grade) return alert("يرجى ملء جميع الحقول المطلوبة.");
  await push(teachersRef, { name, subject, grade, image, rating: rating || "5" });
  alert("✅ تم إضافة المعلم بنجاح!");
  nameInput.value = subjectInput.value = gradeInput.value = imageInput.value = ratingInput.value = "";
});

/* 🎓 عرض المعلمين مع إظهار الـ ID وزر النسخ */
onValue(teachersRef, (snapshot) => {
  const data = snapshot.val();
  teachersDiv.innerHTML = "";
  if (data) {
    Object.entries(data).forEach(([id, teacher]) => {
      const div = document.createElement("div");
      div.classList.add("teacher-card");
      div.innerHTML = `
        <img src="${teacher.image || 'https://via.placeholder.com/200'}" alt="صورة المعلم">
        <h3>${teacher.name}</h3>
        <p>${teacher.subject} - ${teacher.grade}</p>
        <p>⭐ ${teacher.rating || '5'}</p>
        <div class="teacher-id-box">
          <span class="teacher-id">🆔 <b>${id}</b></span>
          <button class="copy-id" data-id="${id}">📋 نسخ ID</button>
        </div>
        <button class="delete-btn" data-id="${id}">🗑️ حذف</button>
      `;
      teachersDiv.appendChild(div);
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (confirm("هل تريد حذف هذا المعلم؟")) {
          await remove(ref(db, "teachers/" + btn.dataset.id));
        }
      });
    });

    document.querySelectorAll(".copy-id").forEach(btn => {
      btn.addEventListener("click", async () => {
        await navigator.clipboard.writeText(btn.dataset.id);
        alert("✅ تم نسخ الـ ID: " + btn.dataset.id);
      });
    });
  } else {
    teachersDiv.innerHTML = "<p>لا يوجد معلمون بعد.</p>";
  }
});

/* 🔁 الانتقال إلى صفحة المنشورات */
document.getElementById("goToPosts").addEventListener("click", () => {
  window.location.href = "posts.html";
});
