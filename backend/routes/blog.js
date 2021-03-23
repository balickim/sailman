const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  canUpdateDeleteBlog,
  isAuthorized,
} = require("../controllers/auth");
const { verifyToken } = require("../helpers/token");
const {
  create,
  list,
  listAllBlogsCategoriesTags,
  read,
  remove,
  update,
  photo,
  listRelated,
  listSearch,
  listByUser,
} = require("../controllers/blog");

router.post("/blog", verifyToken, authMiddleware, create);
router.get("/blogs", list);
router.post("/blogs-categories-tags", listAllBlogsCategoriesTags);
router.get("/blog/:slug", read);
router.delete(
  "/blog/:slug",
  verifyToken,
  isAuthorized(["admin", "moderator"]),
  remove
);
router.put(
  "/blog/:slug",
  verifyToken,
  isAuthorized(["admin", "moderator"]),
  update
);
router.get("/blog/photo/:slug", photo);
router.post("/blogs/related", listRelated);
router.get("/blogs/search", listSearch);

router.get(
  "/test",
  verifyToken,
  authMiddleware,
  isAuthorized(["admin", "moderator"]),
  list
);

// auth user blog crud
// router.post("/user/blog", verifyToken, authMiddleware, create);
router.get("/:username/blogs", listByUser);
router.delete(
  "/user/blog/:slug",
  verifyToken,
  authMiddleware,
  canUpdateDeleteBlog,
  remove
);
router.put(
  "/user/blog/:slug",
  verifyToken,
  authMiddleware,
  canUpdateDeleteBlog,
  update
);

module.exports = router;
