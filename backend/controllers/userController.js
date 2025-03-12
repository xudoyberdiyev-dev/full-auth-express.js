export const getUserData =async(req,res)=>{
    try{
        const {userId} =req.body

        const user =await userModel.finById(userId)

        if(!user){
            return res.json({success:false,message:'iser not fount'})
        }

        res.json({success:true,userData:{
            name:user.name,
            isAccountVerified:user.isAccountVerified
        }})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}