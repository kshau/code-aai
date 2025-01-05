import React from "react";
import { Card } from "../ui/card";

export default function ProfileStatistics() {
  return (
    <div className="flex w-full h-1/4 gap-2">
      <Card className="flex-grow flex items-center justify-center ">
        Chart 1
      </Card>
      <Card className="flex-grow flex items-center justify-center ">
        Chart 2
      </Card>
    </div>
  );
}
