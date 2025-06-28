import * as React from "react";
import Image from "next/image";

export function RecentSales({ items }: Readonly<any>) {
  return (
    <div className="space-y-8">
      {items.map((item: any) => (
        <div key={item.id} className="flex items-start space-x-4">
          <div className="relative h-9 w-9 flex-shrink-0">
            <Image
              src={item.image}
              alt={`${item.name} image`}
              fill
              className="rounded-full object-cover"
              sizes="36px"
            />
          </div>

          <div className="flex-1 space-y-1">
            <p className="text-md font-medium leading-none">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.address}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
