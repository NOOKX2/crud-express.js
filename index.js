import express from "express";
import bodyParser from "body-parser"
import methodOverride from 'method-override'; 

const app = express();
const port = 3000;

let posts = [{
    id: 1,
    title: "My First Post",
    content: "You’ve always wanted to have your own blog and use it to promote your business or product. You know that a blog is crucial for SEO, thought leadership, and building authority among your target audience. But the task of actually sitting down and writing a blog post can seem overwhelming. Especially when you’re planning to write your first blog post. But like everything else, writing a blog gets easier the more you practice. It’s important to focus on churning out your first blogs and doing it right. Then, you can get into the rhythm of regularly creating blog content that is high quality and engaging. So let’s get down to the details and explore how to write your first blog post and what you need to do to get started.",
    author: "John Doe"

  },
  {
    id: 2,
    title: "Gpt 5",
    content: "GPT‑5 is our strongest coding model to date. It shows particular improvements in complex front‑end generation and debugging larger repositories. It can often create beautiful and responsive websites, apps, and games with an eye for aesthetic sensibility in just one prompt, intuitively and tastefully turning ideas into reality. Early testers also noted its design choices, with a much better understanding of things like spacing, typography, and white space. See here for full details on what GPT‑5 unlocks for developers.",
    author: "Jane Smith"
  }
];

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