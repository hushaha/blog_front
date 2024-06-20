import Link from "next/link";
import React from "react";

import { BASE_CONFIG } from "@/config";

const Header = () => {
  return (
    <nav className="bg-white px-6 py-4 shadow">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row md:items-center md:justify-between">
        <Link href="/" passHref>
          <a className="text-2xl font-bold">{BASE_CONFIG.title}</a>
        </Link>
        <div className="flex-shrink-0">
          <Link href="/blog">
            <a className="q-color-primary-hover mx-4 font-bold">博客</a>
          </Link>
          <Link href="/tags">
            <a className="q-color-primary-hover mx-4 font-bold">标签</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
