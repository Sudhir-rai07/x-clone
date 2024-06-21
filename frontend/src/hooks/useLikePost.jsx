import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

const useLikePost = () =>{
    const queryClient = useQueryClient()

    const {mutate: likePost, isPending} = useMutation({
        mutationFn: async (postId)=>{
            const response = await axios.put(`/api/posts/like/${postId}`)
            return response.data
        }, 
        onError: (error)=>{
            console.log(error);
            toast.error("Error")
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["posts"]})
            queryClient.invalidateQueries({queryKey: ["singlePost"]})
        }
    })
     
    return {likePost, isPending}
}

export default useLikePost