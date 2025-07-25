"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchUserById } from "@/services/users.service";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { COMMON_STYLES } from "@/constants/commonStyles";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { InfoField } from "@/components/profile/InfoField";
import { QuickInfoItem } from "@/components/profile/QuickInfoItem";
import {
  FiMail as MailIcon,
  FiPhone as PhoneIcon,
  FiGlobe as GlobeIcon,
  FiMapPin as MapPinIcon,
  FiUser as UserIcon,
} from "react-icons/fi";
import { FaBuilding as BuildingIcon } from "react-icons/fa";
import { RiInfoCardLine } from "react-icons/ri";
import { useLogStore } from "@/stores/logStore";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.userDetail(userId),
    queryFn: () => fetchUserById(userId),
    enabled: !!userId,
  });

  const logProfileVisit = useLogStore((state) => state.logProfileVisit);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user && authUser) {
      logProfileVisit(authUser.username, user.name);
    }
  }, [user, authUser, logProfileVisit]);

  if (isLoading) return <LoadingState message="Loading user profile" />;
  if (error)
    return <ErrorState error={error} prefix="Error loading user profile" />;
  if (!user)
    return (
      <ErrorState error={new Error("User not found")} prefix="User not found" />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <ProfileHeader name={user.name} />

      <div className="relative">
        <div className={`${COMMON_STYLES.pageContainer} w-full py-8`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-10">
            <div className="lg:col-span-2 xl:col-span-3 space-y-8">
              <ProfileInfoCard
                title="Contact Information"
                icon={MailIcon}
                iconGradient="from-blue-500 to-blue-600"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <InfoField
                    label="Email Address"
                    value={user.email}
                    href={`mailto:${user.email}`}
                    icon={MailIcon}
                  />
                  <InfoField
                    label="Phone Number"
                    value={user.phone}
                    href={`tel:${user.phone}`}
                    icon={PhoneIcon}
                  />
                  <InfoField
                    label="Website"
                    value={user.website}
                    href={`http://${user.website}`}
                    icon={GlobeIcon}
                  />
                  <InfoField
                    label="Username"
                    value={user.username}
                    icon={UserIcon}
                  />
                </div>
              </ProfileInfoCard>

              <ProfileInfoCard
                title="Address & Location"
                icon={MapPinIcon}
                iconGradient="from-emerald-500 to-emerald-600"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <InfoField label="Street" value={user.address.street} />
                  <InfoField label="Suite" value={user.address.suite} />
                  <InfoField label="City" value={user.address.city} />
                  <InfoField label="Zipcode" value={user.address.zipcode} />
                </div>
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <InfoField
                    label="Coordinates"
                    value={`${user.address.geo.lat}, ${user.address.geo.lng}`}
                    href={`https://maps.google.com/?q=${user.address.geo.lat},${user.address.geo.lng}`}
                    icon={MapPinIcon}
                  />
                </div>
              </ProfileInfoCard>
            </div>

            <div className="lg:col-span-1 xl:col-span-2 space-y-8">
              <ProfileInfoCard
                title="Company"
                icon={BuildingIcon}
                iconGradient="from-purple-500 to-purple-600"
              >
                <div className="space-y-6">
                  <InfoField label="Company Name" value={user.company.name} />
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Catch Phrase
                    </label>
                    <blockquote className="text-sm font-medium text-slate-700 italic border-l-4 border-purple-400 pl-4 py-4 bg-purple-50/50 rounded-r-md">
                      &ldquo;{user.company.catchPhrase}&rdquo;
                    </blockquote>
                  </div>
                  <InfoField label="Business Focus" value={user.company.bs} />
                </div>
              </ProfileInfoCard>

              <ProfileInfoCard
                title="Quick Info"
                icon={RiInfoCardLine}
                iconGradient="from-slate-500 to-slate-600"
              >
                <div className="space-y-1">
                  <QuickInfoItem label="User ID" value={`#${user.id}`} />
                  <QuickInfoItem
                    label="Domain"
                    value={`.${user.website.split(".").pop()}`}
                  />
                  <QuickInfoItem
                    label="Location"
                    value={user.address.city}
                    isLast
                  />
                </div>
              </ProfileInfoCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
