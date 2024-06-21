import {useMutation, useQueryClient} from '@tanstack/react-query'
import axios from 'axios';

const useFollow = () =>{
    const queryClient = useQueryClient();

    const {mutate: follow, isPending} = useMutation({
        mutationFn: async(userId)=>{
            try {
                return await axios.post(`/api/users/follow/${userId}`)
            } catch (error) {
                throw new Error(error)
            }
        },
        onSuccess: ()=>{
            Promise.all[
                queryClient.invalidateQueries({queryKey: ["authUser"]}),
                // queryClient.invalidateQueries({queryKey: ["suggestedUsers"]}),
                queryClient.invalidateQueries({queryKey: ["user"]})
            ]
        }
    });

    return { follow, isPending}
}

export default useFollow