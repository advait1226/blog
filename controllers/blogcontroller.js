const Blog = require('../models/blog');


const blog_index = (req, res)=>{
    Blog.find().sort({createdAt: -1})
    .then((result) =>{res.render('blogs/index', {title : 'All Blogs', blogs: result}); })
    .catch((err) =>{
        console.log(err);});
     
}

const blog_details = (req, res)=>{
    const id= req.params.id;
    Blog.findById(id)
    .then((result)=>{
        res.render('blogs/details', { blog: result, title: "BLog Details"});
    })
    .catch((err)=>{
res.status(404).render('404', { title: 'BLog not found'} );    });
}

const blog_create_get= (req, res) =>{
    res.render('blogs/create', {title : 'Create a new blog'});
 }

 const blog_edit_get= async (req,res)=>{
        const id = req.params.id;
        const blog = await Blog.findById(id);
        res.render('blogs/edit', {blog:blog, title:'EDIT', user:req.user});
    };

    const blog_edit_post= async (req,res)=>{
        
            const id = req.params.id;
            // var abc = req.body;
            var blog = await Blog.findByIdAndUpdate(id, {
                title: req.body.title,
                snippet: req.body.snippet,
                body: req.body.body
            });
            // console.log(blog);
            res.redirect('/blogs');
        };


 const blog_create_post = (req, res)=>{
    const blog= new Blog(req.body);

    blog.save()
        .then((result)=>{
            res.redirect('/blogs');
        })
        .catch((err)=>{
            console.log(err);
        });
}

const blog_delete = (req, res)=>{
    const id= req.params.id;

    Blog.findByIdAndDelete(id)
    .then((result)=>{
        // ajax request fetch so cannot redirect , need to send json to frontend browser
        // json data has redirect property url gonna be done from frontend
        res.json({redirect: '/blogs'})
    })
    .catch(err=>{
        console.log(err);
    });
}


module.exports = {
    blog_index,
    blog_details,
    blog_create_get,
    blog_create_post,
    blog_delete,
    blog_edit_get,
    blog_edit_post
}