

const user=require("../models/userModel");

const blockCheckMiddleware = (req, res, next) => {
    if(req.session.user_id){
        user.findById(req.session.user_id).lean()
        .then((data)=>{
            if(!data.isBlocked){
                next();
            }
            else{
                req.session.destroy((err)=>{
                    if(err){
                        console.log(err);
                    }
                    res.render('login',{message:"user is blocked by admin"});
                });
            }
        })
        .catch((err) => {
            console.error("Error finding user:", err);
            res.redirect("/login");
        });
    }
    else{
        next();
    }
    
  };
  
module.exports={
    blockCheckMiddleware
}



 
  