const Notification = ({ notification }) => {
    const renderMessage = () => {
      switch (notification?.type) {
        case 'like':
          return `${notification?.from?.username} liked your post.`;
        case 'comment':
          return `${notification?.from?.username} commented on your post.`;
        case 'follow':
          return `${notification?.from} started following you.`;
        default:
          return 'Unknown notification type.';
      }
    };
  
    return (
      <div className="flex items-center mb-4 notification">
        <div className="flex items-center w-full pb-2 mb-4 border-b border-white notification">
            <img src={notification?.from?.profileImg || "/avatar-placeholder.png"} className="w-8 h-8 mr-2 overflow-hidden rounded-full"/>
        <p>{renderMessage()}</p>
        </div>
      </div>
    );
  };
  export default Notification