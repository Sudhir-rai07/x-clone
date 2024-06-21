import toast from "react-hot-toast";

const sharePost = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch((err) => {
        toast.error("error");
        console.log("failed to copy link", err);
      });
  };

  export default sharePost