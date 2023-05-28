const router = require("express").Router();
const Post = require("../models/Post");

//レシピを投稿
router.post("/", async (req, res) => {
  const newRecipe = new Post(req.body);
  try {
    const recipe = await newRecipe.save();
    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//全てのレシピからいいね数が多い上位３位までを取得
router.get("/ranking", async (req, res) => {
  try {
    const recipes = await Post.find();
    const sortRecipe = recipes.sort(function (a, b) {
      return a.likes.length > b.likes.length ? -1 : 1;
    });
    const rankingRecipe = [];
    for (let i = 0; i < 3; i++) {
      rankingRecipe.push(sortRecipe[i]);
    }
    return res.status(200).json(rankingRecipe);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//レシピを全て取得
router.get("/allRecipe", async (req, res) => {
  try {
    const recipes = await Post.find();
    return res.status(200).json(recipes);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//レシピを取得
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Post.find({ _id: req.params.id });
    return res.status(200).json(recipe);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//レシピを削除
router.delete("/:id", async (req, res) => {
  const recipe = await Post.findById(req.params.id);
  const currentUserId = req.body.id;
  try {
    if (recipe.userId === currentUserId) {
      await Post.deleteOne({ _id: req.params.id });
      return res.status(200).json("レシピを削除しました");
    } else {
      return res
        .status(400)
        .json("自身の投稿したレシピではない為、削除出来ません");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//レシピを更新
router.put("/:id", async (req, res) => {
  const recipe = await Post.findById(req.params.id);
  const currentUserId = req.body.userId;
  try {
    if (recipe.userId === currentUserId) {
      const newRecipe = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      return res.status(200).json(newRecipe);
    } else {
      return res
        .status(400)
        .json("自身の投稿したレシピではない為、編集出来ません");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

//特定のユーザーの投稿のみ取得
router.get("/private/:id", async (req, res) => {
  try {
    const recipes = await Post.find({ userId: req.params.id });
    return res.status(200).json(recipes);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//投稿したレシピに良いね!
router.put("/:id/likes", async (req, res) => {
  try {
    const recipe = await Post.findById(req.params.id);
    const recipeLikes = recipe.likes;
    const currentUserId = req.body.userId;
    const isLike = recipeLikes.includes(currentUserId);
    if (!isLike) {
      recipeLikes.push(currentUserId);
      res.status(200).json(recipe);
    } else {
      const newLikes = recipeLikes.filter((userId) => userId !== currentUserId);
      recipe.likes = newLikes;
      res.status(200).json(recipe);
    }
    await recipe.save();
  } catch (error) {
    return res.status(500).json(error);
  }
});

//投稿したレシピお気に入り保存
router.put("/:id/favorites", async (req, res) => {
  try {
    const recipe = await Post.findById(req.params.id);
    const recipeFavorites = recipe.favorites;
    const currentUserId = req.body.userId;
    const isFavorite = recipeFavorites.includes(currentUserId);
    if (!isFavorite) {
      recipeFavorites.push(currentUserId);
      res.status(200).json(recipe);
    } else {
      const newFavorites = recipeFavorites.filter(
        (userId) => userId !== currentUserId
      );
      recipe.favorites = newFavorites;
      res.status(200).json();
    }
    await recipe.save(recipe);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
