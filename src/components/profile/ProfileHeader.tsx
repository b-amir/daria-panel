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
      <div className="space-y-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 px-0 py-1.5 text-xs cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Go back"
        >
          <BackIcon className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">{name}</h1>
      </div>
    </div>
  );
}
