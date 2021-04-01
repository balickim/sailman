const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  canUpdateDeleteAnnouncement,
  isAuthorized,
} = require("../controllers/auth");
const { verifyToken } = require("../helpers/token");
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
} = require("../controllers/announcement");

router.post("/announcement", verifyToken, authMiddleware, create);
router.get("/announcements", list);
router.post(
  "/announcements-categories-tags",
  listAllAnnouncementsCategoriesTags
);
router.get("/announcement/:slug", read);
router.delete(
  "/announcement/:slug",
  verifyToken,
  isAuthorized(["admin", "moderator"]),
  remove
);
router.put(
  "/announcement/:slug",
  verifyToken,
  isAuthorized(["admin", "moderator"]),
  update
);
router.get("/announcement/photo/:slug", photo);
router.post("/announcements/related", listRelated);
router.get("/announcements/search", listSearch);

router.get(
  "/test",
  verifyToken,
  authMiddleware,
  isAuthorized(["admin", "moderator"]),
  list
);

// auth user announcement crud
// router.post("/user/announcement", verifyToken, authMiddleware, create);
router.get("/:username/announcements", listByUser);
router.delete(
  "/user/announcement/:slug",
  verifyToken,
  authMiddleware,
  canUpdateDeleteAnnouncement,
  remove
);
router.put(
  "/user/announcement/:slug",
  verifyToken,
  authMiddleware,
  canUpdateDeleteAnnouncement,
  update
);

module.exports = router;
