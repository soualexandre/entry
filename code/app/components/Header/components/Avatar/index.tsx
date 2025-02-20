"use client";

import { cn } from "@/app/utils/user/user";
import * as React from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> { }

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-white font-bold",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Avatar.displayName = "Avatar";

export { Avatar };
