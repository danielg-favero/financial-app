"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { Skeleton } from "@/shared/components/ui/skeleton";

import { GetMeService } from "@/modules/auth/api/services/get-me.service";
import { UpdateProfileService } from "@/modules/auth/api/services/update-profile.service";
import { useGetMe } from "@/modules/auth/api/queries/useGetMe";
import { useProfileModel } from "@/modules/auth/features/profile/profile.model";
import { ProfileView } from "@/modules/auth/features/profile/profile.view";
import type { IUser } from "@/modules/auth/types/user";

const httpClient = new HttpClient();
const getMeService = new GetMeService(httpClient);
const updateProfileService = new UpdateProfileService(httpClient);

function ProfileForm({ user }: Readonly<{ user: IUser }>) {
  const model = useProfileModel({ user, updateProfileService });

  return <ProfileView {...model} />;
}

export function ProfileContainer() {
  const { data: user } = useGetMe({ getMeService });

  if (!user) {
    return <Skeleton className="h-80 w-full" />;
  }

  return <ProfileForm key={user.id} user={user} />;
}
