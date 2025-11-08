// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC8UmPkL9-AgrlPRPERwkYJ5uzTYX1fmDY",
  authDomain: "test-yourself-6afaa.firebaseapp.com",
  databaseURL: "https://test-yourself-6afaa-default-rtdb.firebaseio.com",
  projectId: "test-yourself-6afaa",
  storageBucket: "test-yourself-6afaa.firebasestorage.app",
  messagingSenderId: "886218676173",
  appId: "1:886218676173:web:6000c95948433e89d1d684"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const postForm = document.getElementById("postForm");
const postsList = document.getElementById("postsList");
const statusMsg = document.getElementById("statusMsg");

// إضافة منشور
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    title: title.value.trim(),
    teacherId: teacherId.value.trim(),
    content: content.value.trim(),
    type: type.value,
    fileUrl: fileUrl.value.trim(),
    timestamp: Date.now()
  };

  const newPostRef = push(ref(db, "posts"));
  await set(newPostRef, data);

  statusMsg.textContent = "✅ تم إضافة المنشور";
  statusMsg.style.color = "lime";
  postForm.reset();
});

// عرض المنشورات في نفس الصفحة
onValue(ref(db, "posts"), snapshot => {
  postsList.innerHTML = "";
  const posts = snapshot.val();

  if (!posts) {
    postsList.innerHTML = "<p>لا توجد منشورات</p>";
    return;
  }

  Object.keys(posts).forEach(id => {
    const p = posts[id];

    const div = document.createElement("div");
    div.className = "post-item";

    div.innerHTML = `
      <h3>${p.title}</h3>
      <p><strong>المعلم:</strong> ${p.teacherId}</p>
      <p><strong>النوع:</strong> ${p.type}</p>
      <p><strong>النص:</strong> ${p.content || "لا يوجد"}</p>
      <p><strong>الرابط:</strong> ${p.fileUrl ? `<a href="${p.fileUrl}" target="_blank">عرض الملف</a>` : "لا يوجد"}</p>

      <button class="edit-btn">✏️ تعديل</button>
      <button class="delete-btn">🗑️ حذف</button>
    `;

    // زر الحذف
    div.querySelector(".delete-btn").onclick = () => {
      if (confirm("هل تريد حذف المنشور؟")) {
        remove(ref(db, "posts/" + id));
      }
    };

    // زر التعديل
    div.querySelector(".edit-btn").onclick = () => {
      const newTitle = prompt("عنوان جديد:", p.title);
      const newContent = prompt("نص جديد:", p.content);
      const newUrl = prompt("رابط جديد:", p.fileUrl);

      update(ref(db, "posts/" + id), {
        title: newTitle || p.title,
        content: newContent || p.content,
        fileUrl: newUrl || p.fileUrl
      });

      alert("✅ تم التعديل");
    };

    postsList.appendChild(div);
  });
});
