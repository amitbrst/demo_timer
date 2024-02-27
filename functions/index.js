/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const firestore = admin.firestore();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started


// function startTimer() {
//     let seconds = 20;
  
//     const timer = setInterval(() => {
//       seconds--;
//       console.log(`Timer: ${seconds} seconds left.`);
  
//       if (seconds === 0) {
//         clearInterval(timer);
//         console.log('Timer finished.');
//         startTimer()
//       }
//     }, 1000); // Timer runs every 1 second
//   }

// exports.helloWorld = onRequest((request, response) => {
//     startTimer();
//   response.send("Hello from Firebase!");
// });


// exports.startTimer = functions.https.onRequest(async (req, res) => {
//     const collRef = firestore.collection("SpinnerTimerBools").doc("TeenPatti");

//     try {
//         await collRef.update({
//             BetAllowed: true,
//             timerstart: true
//         });

//         const timerDuration = 20;
//         for (let a = 0; a <= timerDuration; a++) {
//             console.log(`Waiting for ${timerDuration - a}`)
//             setTimeout(async () => {
//                 const timerValue = timerDuration - a;
//                 await collRef.update({ timer: timerValue });

//                 if (timerValue === 0) {
//                     await collRef.update({
//                         timerstart: false,
//                         show: true
//                     });
//                 }
//             }, 1000 * a);
//         }

//         res.status(200).send('Timer started successfully.');
//     } catch (error) {
//         console.error('Error starting timer:', error);
//         res.status(500).send('Error starting timer.');
//     }
// });

async function updateWaiting() {
    const docRef = firestore.collection('SpinnerTimerBools').doc('TeenPatti');
  
    const testData1 = {
      isWait: true,
      show: false
    };
    await docRef.update(testData1);
}

async function startTimer() {
    const docRef = firestore.collection('SpinnerTimerBools').doc('TeenPatti');
  
    const testData = {
      BetAllowed: true,
      timerstart: true,
      isWait: false
    };
  
    try {
        await docRef.update(testData);
        let timer = 20;
        for (let a = 0; a <= timer; a++) {
            setTimeout(() => {
                const testD = {
                    timer: timer - a
                };
                docRef.update(testD);

                if (timer - a === 10) {
                    const testData_10 = {
                        BetAllowed: false,
                    };
                    docRef.update(testData_10);
                }

                if (timer - a === 0) {
                    const testData_1 = {
                        timerstart: false,
                        show: true
                    };
                    docRef.update(testData_1);

                    setTimeout(updateWaiting, 3000);
                    // setTimeout(startTimer, 10000);

                }
            }, 1000 * a);
        }
    } catch (error) {
        console.error('Error updating Firestore:', error);
    }
  }
  
  exports.startTimer = functions.https.onRequest((request, response) => {
    startTimer()
    response.send('Timer started successfully.');
  });

