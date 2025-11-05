import { useQueryClient } from "@tanstack/react-query";

const useRefetch = () => {
  const queryClient = useQueryClient();

  const refetchMe = (data) => {
    queryClient.invalidateQueries({ queryKey: [`${data}`] });
  };
  return refetchMe;
};

export default useRefetch;
