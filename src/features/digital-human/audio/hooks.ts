import { useQuery } from "@tanstack/react-query";
import { getCustomisedAudioPage } from "../../../api/aigc/customised-audios";
import type { CustomisedAudioQuery } from "../../../api/aigc/customised-audios/types";

export const customisedAudioQueryKeys = {
  all: () => ["customised-audios"] as const,
  lists: () => [...customisedAudioQueryKeys.all(), "list"] as const,
  list: (params?: CustomisedAudioQuery) => [...customisedAudioQueryKeys.lists(), params ?? {}] as const,
};

export function useCustomisedAudioPage(params?: CustomisedAudioQuery) {
  return useQuery({
    queryKey: customisedAudioQueryKeys.list(params),
    queryFn: () => getCustomisedAudioPage(params),
  });
}
