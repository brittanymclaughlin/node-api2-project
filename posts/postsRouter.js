const express = require("express")
const router = express.Router()
const posts = require('../data/db')
const { findById } = require("../data/db")

//get posts
router.get("/api/posts", (req, res)=> {
    posts.find()
    .then((posts)=> {
        res.status(201).json(posts)
    })
    .catch((error)=> {
        console.log(error)
        res.status(500).json({error: "The posts information could not be retrieved."})
    })
})

//get posts by ID
router.get("/api/posts/:id", (req, res)=> {
    posts.findById(req.params.id)
    .then((post)=>{
        if(post){
            res.status(201).json(post)
        }else{
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }
    })
    .catch((error)=>{
        res.status(500).json({error: "The post information could not be retrieved."})
    })
})

//get comments by post id
router.get("/api/posts/:id/comments", (req,res)=>{
    posts.findPostComments(req.params.id)
    .then((comments)=> {
        if(comments){
            res.status(201).json(comments)
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch((error)=>{
        console.log(error)
        res.status(500).json({error: "The comments information could not be retrieved."})
    })
})


//post new post
router.post("/api/posts", (req,res)=>{
       posts.insert(req.body)
    .then((post) => {
        if(!req.body.title || !req.body.contents ){
            res.status(400).json({errorMessage: "Please provide title and contents for the post."})
        }else{
        res.status(201).json(post)
        }
    })
    .catch((error) => {
        console.log(error)
        res.status(500).json({error: "There was an error while saving the post to the database"})
    })
})

//post new comment
router.post("/api/posts/:id/comments", (req, res)=>{
    
  posts.findCommentById(req.params.id)
    .then((response) => {
      console.log(response);
      if (response.length === 0) {
        res.status(404).json({
          message: "The post with the specified ID does not exist.",
        });
      } else if (!req.body.text) {
        res.status(400).json({
          errorMessage: "Please provide text for the comment.",
        });
      } else {
        posts.insertComment({...req.body, post_id:req.params.id})
          .then((response) => {
            res.status(200).json(response);
          })
          .catch((err) => {
            console.log(err.message)
            res.status(500).json({
              error:
                "There was an error while saving the comment to the database",
            });
          });
      }
    })
    .catch(() => {
        res.status(500).then({
          error: "There was an error while saving the comment to the database",
        });
      });

});

//delete post

router.delete("/api/posts/:id", (req, res)=> {
    posts.remove(req.params.id)
        .then((count)=>{
            if(count > 0){
                res.status(200).json({message: "The post has been removed!"})
            }else{
                res.status(404).json({message: "The post with the specified ID does not exist."})
            }
        })
        .catch((error)=>{
            console.log(error)
            res.status(500).json({error: "The post could not be removed"})
        })
})

//update post

router.put("/api/posts/:id", (req, res)=>{
    posts.update(req.params.id, req.body)
    .then((post)=>{
        if(post === 0 ){
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }else if(!req.body.title || !req.body.contents){
            res.status(400).json({errorMessage: "Please provide title and contents for the post."})
        }else {
            res.status(200).json(req.body)
        }
    })
    .catch((error)=>{
        res.status(500).json({message: "The post information could not be modified."})
    })
})


module.exports = router