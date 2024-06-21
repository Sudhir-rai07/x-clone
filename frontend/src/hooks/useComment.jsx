import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"

const useComment = () =>{
    const queryClient = useQueryClient()

    const {mutate:commentOnPost, isPending} = useMutation({
        mutationFn: async ({postId, text})=> {
            const response = await axios.post(`/api/posts/comment/${postId}`, {text})
            return response.data
        },
        onError: (error)=>{
            console.log(error)
            toast.error("error")
        },
        onSuccess: ()=>{
            toast.success("Comment posted")
            queryClient.invalidateQueries({queryKey:["posts"]})
            queryClient.invalidateQueries({queryKey:["singlePosts"]})
        }
    })

    return {commentOnPost, isPending}
}

export default useComment