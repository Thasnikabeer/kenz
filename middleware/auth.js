
const User=require('../models/userModel')
const isLogged=async(req,res,next)=>{
    try {
        if(req.session.user_id){
            const user=await User.findById({_id:req.session.user_id})
            if(user.isBlocked ==true){
                req.session.destroy()
                res.redirect('/')
                
            }
        
        else{
            next()
        }
        }
        else{
            res.redirect('/')
        }
        
    } catch (error) {
        console.log(error.message);
    }
}



const isLogout = (req, res, next) => {
    try {
        if (req.session.user_id) {
            // If user is logged in, redirect to home
            return res.redirect('/home');
        } else {
            // If user is not logged in, allow request to proceed
            return next();
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal Server Error');
    }
};


module.exports ={
    isLogged,
    isLogout
}