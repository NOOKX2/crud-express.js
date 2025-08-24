import express from "express";
import bodyParser from "body-parser"
import methodOverride from 'method-override'; 
import pg from 'pg'

const db = new pg.Client( {
  user: 'postgres',
  host: 'localhost',
  database: 'post',
  password: '123456',
  port: 5433
})

db.connect();

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

async function getPost(){
  const postQuery = await db.query('SELECT * FROM post');
  posts = postQuery.rows;
  console.log(posts)
  return posts;
}

app.get("/", async(req, res) => {
    const posts = await getPost();
    res.render("index.ejs", { posts });
});

app.get("/create", (req, res) => {
    res.render("create.ejs");
});

app.post("/post", async(req, res) => {
    console.log(req.body)
    const title = req.body.title;
    const content = req.body.content;
    const author = req.body.author;
    try{
        await db.query(`INSERT INTO post (title, content, author) VALUES ($1, $2, $3)`, [title, content, author]);
        res.redirect("/");
    }catch(error){
      console.error("Error creating post:", error);
      res.render("create.ejs", { error: "Data can't be null." });
    }
    
})

app.get("/edit/:id", async(req, res) => {
    const id = parseInt(req.params.id);
    const editPost = await db.query('SELECT * FROM post WHERE id = $1', [id]);
    console.log(editPost);
    res.render("edit.ejs", { post: editPost.rows[0] });
});

app.put("/edit/:id", async(req, res) => {
    const id = parseInt(req.params.id);
    const editPost =  await db.query('SELECT * FROM post WHERE id = $1', [id]);
    if(editPost){
      const title = req.body.title;
      const content = req.body.content;
      const author = req.body.author;
      await db.query('UPDATE post SET title = $1, content = $2, author = $3 WHERE id = $4', [title, content, author, id]);
      res.redirect("/");
    }else{
      console.log("post not found")
    }

})

app.delete("/delete/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.query('DELETE FROM post WHERE id = $1', [id]);
  console.log("Post deleted successfully");
  res.redirect("/");

});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});