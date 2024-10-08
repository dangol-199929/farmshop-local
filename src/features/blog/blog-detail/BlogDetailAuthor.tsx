import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { CalendarDays } from "lucide-react";

interface BlogDetailAuthorProps {
  createdBy: string;
  createdAt: string;
}

const BlogDetailAuthor: React.FC<BlogDetailAuthorProps> = ({
  createdBy,
  createdAt,
}) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar>
        <AvatarImage
          src="/placeholder.svg?height=40&width=40"
          alt={createdBy}
        />
        <AvatarFallback>{createdBy[0]}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold">{createdBy}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4 mr-1" />
          {createdAt}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailAuthor;
