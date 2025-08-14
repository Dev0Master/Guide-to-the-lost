import type { Metadata } from "next";

export const appMetadata: Metadata = {
  title: {
    default: "دليل الضائعين | Guidance For Lost | راهنمای گمشدگان",
    template: "%s - دليل الضائعين"
  },
  description: "منصة لمساعدة الأشخاص المفقودين والباحثين عنهم - Platform to help missing persons and their searchers - پلتفرم کمک به افراد گمشده و جستجوگران آنها",
  keywords: ["missing persons", "الضائعين", "گمشدگان", "search", "guidance", "help"],
  authors: [{ name: "Guidance For Lost Team" }],
  creator: "Guidance For Lost",
  publisher: "Guidance For Lost",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};