import { Router } from "express";
import { connectionPool } from "../utils/db.js";

const postRouter = Router();

postRouter.get("/", async (req, res) => {
  const status = req.query.status;
  const keywords = req.query.keywords;
  const page = req.query.page;
  try {
    const result = await connectionPool.query("select * from posts");
    return res.json({
      data: result.rows[0],
    });
  } catch (error) {
    return res.json({
      message: `Error ${error}`,
    });
  }
});

postRouter.get("/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const result = await connectionPool.query(
      "select * from posts where post_id=$1",
      [postId]
    );
    return res.json({
      data: result.rows[0],
    });
  } catch (error) {
    return res.json({
      message: `Error ${error}`,
    });
  }
});

postRouter.post("/", async (req, res) => {
  const hasPublished = req.body.status === "published";
  const newPost = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: hasPublished ? new Date() : null,
  };
  try {
    await connectionPool.query(
      `insert into posts (title,content,status,category,created_at,updated_at,published_at)
      values ($1,$2,$3,$4,$5,$6,$7)`
    ),
      [
        newPost.title,
        newPost.content,
        newPost.status,
        newPost.category,
        newPost.created_at,
        newPost.updated_at,
        newPost.published_at,
      ];
    return res.json({
      message: "Post has been created.",
    });
  } catch (error) {
    return res.json({
      message: `Error ${error}`,
    });
  }
});

postRouter.put("/:id", async (req, res) => {
  const hasPublished = req.body.status === "published";

  const updatedPost = {
    ...req.body,
    updated_at: new Date(),
    published_at: hasPublished ? new Date() : null,
  };
  const postId = req.params.id;

  try {
    await connectionPool.query(
      "update posts set title =$1,content =$2,status =$3,category=$4 where post_id=$5 returning *,update_at=$6,published_at=$7",
      [
        updatedPost.title,
        updatedPost.content,
        updatedPost.status,
        updatedPost.category,
        postId,
        updatedPost.updated_at,
        updatedPost.published_at,
      ]
    );
    return res.json({
      message: `Post ${postId} has been updated.`,
    });
  } catch (error) {
    return res.json({
      message: `Error ${error}`,
    });
  }
});

postRouter.delete("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    await connectionPool.query("delete form posts where post_id=$1"), [postId];
    return res.json({
      message: `Post ${postId} has been deleted.`,
    });
  } catch (error) {
    return res.json({
      message: `Error ${error}`,
    });
  }
});

export default postRouter;
