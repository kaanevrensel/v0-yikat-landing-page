// Android closed test for "Yıkat Gitsin" (com.yikat.tech), November 2026.
// Google Play opens production for this personal developer account only after
// at least 12 real testers stay opted in to the closed test for 14 days in a row.
//
// groupUrl: the Google Group Emre creates from his own Google account. Its
// members form the closed-test tester list in Play Console. CHECK THIS URL LIVE
// (signed out, in a private window) BEFORE RELEASE. If the group gets another
// name, change only this value; the page, tests and card all read it from here.
// The printed counter card points to www.yikat.tech/android, never to the group,
// so a group rename never requires reprinting.
export const androidTest = {
  groupUrl: "https://groups.google.com/g/yikat-android-test",
  optInUrl: "https://play.google.com/apps/testing/com.yikat.tech",
  playUrl: "https://play.google.com/store/apps/details?id=com.yikat.tech",
  appStoreUrl: "https://apps.apple.com/tr/app/y%C4%B1kat-gitsin/id6806875753",
  pageUrl: "https://www.yikat.tech/android",
  // Main feedback channel on /android. Keep it identical to the "Feedback URL or
  // email address" set on the Alpha track (it is shown on the opt-in page too).
  // A person reads it; the shop WhatsApp line is answered by the AI assistant first.
  feedbackEmail: "emre@yikat.tech",
  pdf: "/downloads/yikat-android-test-karti.pdf",
  qr: "/images/android-test-qr.svg",
} as const
