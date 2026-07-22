import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { useUpdateProfile } from "@/modules/auth/api/mutations/useUpdateProfile";
import type { UpdateProfileService } from "@/modules/auth/api/services/update-profile.service";
import { profileMessages } from "@/modules/auth/features/profile/profile.messages";
import type { IUser } from "@/modules/auth/types/user";

const profileSchema = z.object({
  firstName: z.string().min(1, profileMessages.validation.firstName),
  lastName: z.string().min(1, profileMessages.validation.lastName),
  email: z.email(profileMessages.validation.email),
});

export type IProfileFormValues = z.infer<typeof profileSchema>;

export interface IProfileModel {
  form: UseFormReturn<IProfileFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

interface IProfileModelParams {
  user: IUser;
  updateProfileService: UpdateProfileService;
}

export function useProfileModel({
  user,
  updateProfileService,
}: IProfileModelParams): IProfileModel {
  const form = useForm<IProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
  const updateProfile = useUpdateProfile({
    updateProfileService,
    meta: { successMessage: profileMessages.success },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateProfile.mutate(values, {
      onSuccess: (updatedUser) => {
        form.reset({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
        });
      },
    });
  });

  return { form, onSubmit, isSubmitting: updateProfile.isPending };
}
