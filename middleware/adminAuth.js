// const isLogin = async(req,res,next)=>{
//     try{

//         if(req.session.admin_id){
        
//         next();
//         }
//         else{
//             res.redirect('/admin');
//         }


//     }catch(error){
//         console.log(error.message);
//     }
// }
const user= require("../models/userModel")


const isLogin = (req,res,next)=>{
    if(req.session.admin_id){
        user.findOne({is_admin:1})
        .then((data)=>{
            if(data){
                next()
            }
            else{
                res.redirect('/admin');
            }
        })
        .catch((error) => {
            console.error("Error in isAdmin middleware:", error);
            res.status(500).send("Internal Server Error");
        });
    }
    else{
        res.redirect('/admin');
    }
}





const isLogout = async (req,res,next)=>{
    try{

        if(req.session.admin_id){
            res.redirect('/admin/home');
        }else{
            next();
        }

    }catch(error){

        console.log(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout
};