import { Link } from "react-router-dom";

const Notification = ({ notification }) => {
  const renderMessage = () => {
    switch (notification?.type) {
      case "like":
        return (
          <div>
            <span className="font-bold cursor-pointer">
              <Link to={`/profile/${notification?.from?.username}`}>
                {notification?.from?.username}
              </Link>
            </span>{" "}
            liked your post{" "}
          </div>
        );
      case "comment":
        return (
          <div>
            <span className="font-bold cursor-pointer">
              <Link to={`/profile/${notification?.from?.username}`}>
                {notification?.from?.username}
              </Link>
            </span>{" "}
            commented your post{" "}
          </div>
        );
      case "follow":
        return (
          <div>
            <span className="font-bold cursor-pointer">
              <Link to={`/profile/${notification?.from?.username}`}>
                {notification?.from?.username}
              </Link>
            </span>{" "}
            started following you
          </div>
        );
      default:
        return "Unknown notification type.";
    }
  };
  return (
    <div className="flex items-center mb-4 notification">
      <div className="flex items-center w-full pb-2 mb-4 border-b border-white notification">
        <img
          src={notification?.from?.profileImg || "/avatar-placeholder.png"}
          className="w-8 h-8 mr-2 overflow-hidden rounded-full"
        />
        <div>
          {renderMessage()}{" "}
          {!notification?.read && (
            <span className="text-sm text-blue-400">new</span>
          )}
        </div>
      </div>
    </div>
  );
};
export default Notification;
