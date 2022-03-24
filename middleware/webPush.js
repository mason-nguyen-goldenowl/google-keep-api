const webpush = require("web-push");
module.exports = (req, res, next) => {
  const publicVapidKey = process.env.PUBLIC_VAPIDKEY;
  const privateVapidKey = process.env.PRIVATE_VAPIDKEY;

  webpush.setVapidDetails(
    "mailto:test@test.com",
    publicVapidKey,
    privateVapidKey
  );

  req.sendNoti = webpush;

  next();
};
