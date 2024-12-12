import { Skeleton } from "@mui/material";
import { Box } from "@mui/system";

const ChatSkeleton = () => {
  return (
    <Box display="flex" flexDirection="column" width="100%" mt="45px">
      <Box display="flex" gap="10px" width="100%">
        <Skeleton width="50px" sx={{ borderRadius: "50%" }} />
        <Skeleton width="30%" height="80px" />
      </Box>

      <Box display="flex" gap="10px" width="100%">
        <Skeleton width="50px" sx={{ borderRadius: "50%" }} />
        <Skeleton width="40%" height="80px" />
      </Box>

      <Box
        display="flex"
        gap="10px"
        alignSelf="end"
        flexDirection="row-reverse"
        width="100%"
      >
        <Skeleton width="50px" sx={{ borderRadius: "50%" }} />
        <Skeleton width="40%" height="80px" />
      </Box>

      <Box display="flex" gap="10px" width="100%">
        <Skeleton width="50px" sx={{ borderRadius: "50%" }} />
        <Skeleton width="40%" height="80px" />
      </Box>

      <Box
        display="flex"
        gap="10px"
        alignSelf="end"
        flexDirection="row-reverse"
        width="100%"
        alignItems="center"
      >
        <Skeleton width="50px" height="80px" sx={{ borderRadius: "50%" }} />
        <Skeleton width="50%" height="125px" />
      </Box>

      <Box display="flex" gap="10px" width="100%">
        <Skeleton width="50px" sx={{ borderRadius: "50%" }} />
        <Skeleton width="50%" height="80px" />
      </Box>
    </Box>
  );
};

export default ChatSkeleton;
