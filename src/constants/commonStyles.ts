export const COMMON_STYLES = {
  fullHeightFlex: "h-full flex flex-col",
  centerContent: "flex items-center justify-center",
  flexBetween: "flex justify-between items-center",

  heights: {
    pageTitle: "h-20",
    tableColumnHeader: "h-12",
    logoContainer: "h-28",
    userBox: "h-16",
    tableFooter: "h-16",
  },

  tableCell: {
    base: "px-2 md:px-4 py-2 h-full flex items-center",
    text: {
      sm: "text-sm",
      xs: "text-xs md:text-sm",
    },
    colors: {
      primary: "font-medium text-gray-900",
      secondary: "text-gray-700",
      muted: "text-gray-600",
      link: "text-accent hover:text-blue-800 cursor-pointer",
    },
    responsive: {
      truncate: "truncate",
      breakWords: "break-words",
      breakAll: "break-all",
    },
  },

  pageContainer: "p-4 md:p-6",
  sectionSpacing: "pt-0",
} as const;
