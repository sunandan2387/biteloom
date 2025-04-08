"use client";
import * as React from "react";

// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   navigationMenuTriggerStyle
// } from '@/components/ui/Navigation';

import Link from "next/link";

// import { MobileNav, NavProps } from '@/components/MobileNav';

export const Nav = ({ items }) => {
  return (
      <div className=" flex items-center justify-center h-[60px] gap-4 font-semibold w-full z-50">
        {items.map((item) => ( 
          <div key={item.title} className="mx-2">
            <Link href={item.link} legacyBehavior passHref>
              {item.title}
            </Link>
          </div>
        ))}
      {/* <MobileNav items={items} /> */}
      </div>
  );
};
