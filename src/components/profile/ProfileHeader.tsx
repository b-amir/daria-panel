import { useRouter } from "next/navigation";
import { FiArrowLeft as BackIcon } from "react-icons/fi";
import { COMMON_STYLES } from "@/constants/commonStyles";

interface ProfileHeaderProps {
  name: string;
}

export function ProfileHeader({ name }: ProfileHeaderProps) {
  const router = useRouter();

  return (
    <div
      className={`${COMMON_STYLES.pageContainer} ${COMMON_STYLES.heights.logoContainer} flex items-center border-b border-gray-300 shadow-sm bg-gradient-to-t from-white via-gray-100 to-gray-100`}
    >
      <div className="space-y-1">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 px-0 py-2 text-sm cursor-pointer text-gray-600 hover:text-gray-900 group rounded-lg transition-all duration-200"
          aria-label="Go back"
        >
          <BackIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight ">
          {name}
        </h1>
      </div>
    </div>
  );
}
