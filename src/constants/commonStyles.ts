export const COMMON_STYLES = {
  fullHeightFlex: "h-full flex flex-col",
  centerContent: "flex items-center justify-center",
  flexBetween: "flex justify-between items-center",

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
      link: "text-blue-600 hover:text-blue-800",
    },
    responsive: {
      truncate: "truncate",
      breakWords: "break-words",
      breakAll: "break-all",
    },
  },

  pageContainer: "p-4 md:p-6",
  sectionSpacing: "pt-2 md:pt-4",
} as const;
