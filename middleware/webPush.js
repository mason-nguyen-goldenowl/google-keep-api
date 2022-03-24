const webpush = require("web-push");
module.exports = (req, res, next) => {
  const publicVapidKey =
    "BJwpBktvbChPKzU3JtsBl8rAwopyFOHy0UdFKtygJaudhwqi6p_qtWVvbN8YCuwIU-4ubJTuLSLKnt-mZrvpxAg";
  const privateVapidKey = "0cm0HSsh9Wu2rGkigLiO0qH0rbZMx003rPRe5Ag719c";

  webpush.setVapidDetails(
    "mailto:test@test.com",
    publicVapidKey,
    privateVapidKey
  );
  let sub = {
    endpoint:
      "https://fcm.googleapis.com/fcm/send/cxFxkX29pKs:APA91bEi5lQ1Gh4Ori3ty15VkdqIh3fFCQk45ht4-_qtfyd3VVSczS5mFn7OGaj09sb2sjA4xytJLJib7075QCGwJ5RVf2b50GY-dX9GUD026PTc9v-4BxX3oLI_wzWf6iA_cRmjFO3a",
    expirationTime: null,
    keys: {
      p256dh:
        "BNFSXZbKiziu4UC2PYh1Vj5ShjvqP_8d0jT2uiBpdXNswEUXrItnQMgb3vtM9I6_I6FRNqHdIKYA8-UCUhJhlXU",
      auth: "QL5X4ToMrl2RCLHGVuS0Ow",
    },
  };
  req.sendNoti = webpush;
  //   webpush.sendNotification(sub, "remind");
  // app.post("/subscribe", (req, res) => {
  //   const subcription = req.body;

  //   res.status(201).json({});

  //   const payload = JSON.stringify({ title: "TEST WEBPUSH" });

  //   webpush
  //     .sendNotification(subcription, payload)
  //     .catch((err) => console.log(err));
  // });

  next();
};
