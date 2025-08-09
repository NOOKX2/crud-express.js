import express from "express";
import bodyParser from "body-parser"
import methodOverride from 'method-override'; 

const app = express();
const port = 3000;

let posts = [{
    id: 1,
    title: "My First Post",
    content: "This is the content of my first post.",
    author: "John Doe"
}];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", { posts });
});

app.get("/create", (req, res) => {
    res.render("create.ejs");
});

app.post("/post", (req, res) => {
    console.log(req.body)
    const newPost = {
      id: posts.length + 1,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    }
    posts.push(newPost)

    console.log(posts.length)
    res.redirect("/")
})

app.get("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const editPost = posts.find(post => post.id === id);
    console.log(editPost);
    res.render("edit.ejs", { post: editPost });
});

app.put("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const editPost = posts.find(post => post.id === id);
    if(editPost){
      editPost.title = req.body.title;
      editPost.content = req.body.content;
      editPost.author = req.body.author;
      console.log("Post updated successfully");
      res.redirect("/");
    }
    else{
      console.log("Post not found");
    }

})

app.delete("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  posts = posts.filter(post => post.id != id);
  console.log("Post deleted successfully");
  res.redirect("/");

})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});