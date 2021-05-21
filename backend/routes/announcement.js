const express = require("express");
const router = express.Router();
const {
  isAuthenticated,
  canUpdateDeleteAnnouncement,
  isAuthorized,
} = require("../controllers/auth");
const { verifyAccessToken } = require("../helpers/token");
const {
  create,
  list,
  listAllAnnouncementsCategoriesTags,
  read,
  remove,
  update,
  photo,
  listRelated,
  listSearch,
  listByUser,
  gallery,
  galleryCount,
} = require("../controllers/announcement");

// router.post("/announcement", verifyAccessToken, isAuthenticated, create);
router.post("/announcement", verifyAccessToken, isAuthenticated, create);
router.get("/announcements", list);
router.post(
  "/announcements-categories-tags",
  listAllAnnouncementsCategoriesTags
);
router.get("/announcement/:slug", read);
router.delete(
  "/announcement/:slug",
  verifyAccessToken,
  isAuthenticated,
  isAuthorized(["admin", "moderator"]),
  remove
);
router.put(
  "/announcement/:slug",
  verifyAccessToken,
  isAuthenticated,
  isAuthorized(["admin", "moderator"]),
  update
);
router.get("/announcement/photo/:slug", photo);
router.get("/announcement/:slug/gallery", galleryCount);
router.get("/announcement/:slug/gallery/:index", gallery);
router.post("/announcements/related", listRelated);
router.get("/announcements/search", listSearch);

// auth user announcement crud
// router.post("/user/announcement", verifyAccessToken, isAuthenticated, create);
router.get("/:username/announcements", listByUser);
router.delete(
  "/user/announcement/:slug",
  verifyAccessToken,
  isAuthenticated,
  canUpdateDeleteAnnouncement,
  remove
);
router.put(
  "/user/announcement/:slug",
  verifyAccessToken,
  isAuthenticated,
  canUpdateDeleteAnnouncement,
  update
);

module.exports = router;
