import React from "react";

export default function Footer() {
  return (
    <div className="bg-[#3567ff] shadow dark:bg-gray-800 mt-4">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-white sm:text-center dark:text-white">
          © 2023{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            Flowbite™
          </a>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0">
          <li>
            <a href="#" className="hover:underline me-4 md:me-6 text-white">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6 text-white">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6 text-white">
              Licensing
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline text-white">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
