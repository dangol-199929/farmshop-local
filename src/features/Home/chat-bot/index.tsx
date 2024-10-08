import React from "react";
import { FacebookProvider, CustomChat } from "react-facebook";

const ChatBot = () => {
  return (
    <FacebookProvider appId="217414914618416" chatSupport>
      <CustomChat pageId="122101013198011669" minimized={true} />
    </FacebookProvider>
  );
};

export default ChatBot;
