const { parentPort, workerData } = require("worker_threads");

(async () => {
  try {
    //workerData contains the email and selected date 
    const { email, date } = workerData;
    //Call the email-sending function
    await sendEmail(email, date);
    console.log("Automated email sent successfully.");
  } catch (error) {
    console.error("Error sending automated email:", error);
    process.exit(1);
  }
  // mark as completed 
  parentPort.postMessage("done");
  process.exit(0);
})();
