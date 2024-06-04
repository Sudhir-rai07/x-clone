import React from "react";

const FollowSuggestion = () => {
  return (
    <section className="hidden w-[30%] h-full px-2 py-1 border-l-2 border-gray-500 lg:flex">
      <div className="flex px-4 py-4 border border-gray-700 rounded-lg">
        <div className="flex-col">
        <span>rameshToFollow</span> <br />
        <span className="text-sm text-gray-500">@rameshToFollow</span>
        </div>
        <div>
          <button
            className={`relative ml-2 px-4 py-1 mx-auto mt-2 text-black bg-white disabled:bg-gray-500 disabled:cursor-not-allowed rounded-full`}
          >
            Follow
          </button>
        </div>
      </div>
    </section>
  );
};

export default FollowSuggestion;
