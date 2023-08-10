// importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// const config = {
//   apiKey: "AIzaSyAP0IeVXonU6Z5LjfuCHU-V256A0IW13B0",
//   authDomain: "juchamsi-test.firebaseapp.com",
//   projectId: "juchamsi-test",
//   storageBucket: "juchamsi-test.appspot.com",
//   messagingSenderId: "201343183627",
//   appId: "1:201343183627:web:3859dafd9261a780df100e",
//   measurementId: "G-PDSL7LXQJG"
// };

// firebase.initializeApp(config);

// const messaging = firebase.messaging();

// //백그라운드 서비스워커 설정
// messaging.onBackgroundMessage(messaging, (payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
  
//   // Customize notification here
//   const notificationTitle = "Background Message Title";
//   const notificationOptions = {
//     body: payload
//   };
  
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

self.addEventListener('push', function (e) {
  // console.log('push: ', e.data.json())
  if (!e.data.json()) return

  const resultData = e.data.json().notification
  const notificationTitle = resultData.title
  const notificationOptions = {
    body: resultData.body,
    icon: resultData.image,
    tag: resultData.tag,
    ...resultData
  }
  console.log('push: ', { resultData, notificationTitle, notificationOptions })

  registration.showNotification(notificationTitle, notificationOptions)
})