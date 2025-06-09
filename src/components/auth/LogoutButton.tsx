// components/LogoutButton.tsx
import { Button } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface LogoutButtonProps {
  onClick: () => void;
  sx?: SxProps<Theme>;
}

const LogoutButton = ({ onClick, sx }: LogoutButtonProps) => {
  return (
    <Button variant="contained" color="error" onClick={onClick} sx={sx}>
      Logout
    </Button>
  );
};

export default LogoutButton;
