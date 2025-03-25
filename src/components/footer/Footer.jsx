"use client";

import Link from "next/link";
import { SocialIcons } from "../ui/icons";
import { Button } from "../ui/buttons";
import { useEffect, useState } from "react";

export function Footer() {
  const [loggedIn, setLoggedIn] = useState(false);
  const footer_nav = {
    about: {
      title: "About",
      routes: [
        {
          title: "Pricing",
          link: "/pricing",
        },
        {
          title: "FAQs",
          link: "/faq",
        },
      ],
    },
    resources: {
      title: "Resources",
      routes: [
        {
          title: "Blog",
          link: "/",
        },
        {
          title: "Docs",
          link: "/",
        },
      ],
    },
    legal: {
      title: "Legal",
      routes: [
        {
          title: "Privacy Policy",
          link: "/",
        },
        {
          title: "Terms and Conditions",
          link: "/",
        },
      ],
    },
  };
  useEffect(() => {
      if(localStorage.getItem("loggedIn")){
        setLoggedIn(true);
      }
    },[])
  return (
    <>
      {loggedIn == false ? (
        <footer className="bg-slate-800 z-[10000] pt-12 pb-6">
          <div className="mx-auto max-w-7xl px-6 pb-6 pt-16 lg:px-8 ">
            <div className="xl:grid xl:grid-cols-3 xl:gap-8">
              <div className="grid grid-cols-2 gap-8 xl:col-span-2">
                <div className="md:grid md:grid-cols-2 md:gap-8">
                  <div>
                    <h3 className="text-sm font-semibold leading-6 text-white">
                      {footer_nav.about.title}
                    </h3>
                    <ul role="list" className="mt-4 space-y-4">
                      {footer_nav.about.routes.map((item) => (
                        <li key={item.title}>
                          <Link
                            href={item.link}
                            className="text-sm leading-6 text-gray-300 hover:text-white"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-10 md:mt-0">
                    <h3 className="text-sm font-semibold leading-6 text-white">
                      {footer_nav.resources.title}
                    </h3>
                    <ul role="list" className="mt-4 space-y-4">
                      {footer_nav.resources.routes.map((item) => (
                        <li key={item.title}>
                          <Link
                            href={item.link}
                            className="text-sm leading-6 text-gray-300 hover:text-white"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="md:grid md:grid-cols-2 md:gap-8">
                  <div>
                    <h3 className="text-sm font-semibold leading-6 text-white">
                      {footer_nav.legal.title}
                    </h3>
                    <ul role="list" className="mt-4 space-y-4">
                      {footer_nav.legal.routes.map((item) => (
                        <li key={item.title}>
                          <Link
                            href={item.link}
                            className="text-sm leading-6 text-gray-300 hover:text-white"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-8 xl:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">
                  Subscribe to our newsletter
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                  The latest news, articles, and resources, sent to your inbox
                  weekly.
                </p>
                <div className="mt-6 sm:flex sm:max-w-md">
                  <input
                    type="email"
                    name="email-address"
                    autoComplete="email"
                    placeholder="Enter your email"
                    className="px-4 rounded-lg text-white"
                  />
                  <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                    <Button variant="secondary" type="submit">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 ">
              <p className="text-xs leading-5 text-slate-300 py-4 text-center md:text-left">
                &copy; 2025 DataSage, Inc. All rights reserved.
              </p>
              <div className="text-white py-4 justify-self-center">
                <div className="flex items-end">
                  <Link
                    href={`/twitter`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcons.Twitter className="mx-8" size={24} />
                  </Link>
                  <Link
                    href={`/github`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcons.Github className="mx-8" size={24} />
                  </Link>
                  <Link
                    href={`/linkedin`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcons.Linkedin className="mx-8" size={24} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      ) : (
        <> </>
      )}
    </>
  );
}
