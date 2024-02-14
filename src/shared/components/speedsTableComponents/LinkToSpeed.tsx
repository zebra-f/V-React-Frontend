import { useNavigate } from "react-router-dom";

import LinkIcon from "@mui/icons-material/Link";
import Button from "@mui/material/Button";

export default function LinkToSpeed({ speedId }: any) {
  const navigate = useNavigate();

  const handleOnAuxClick = () => {
    window.open(`/data/speeds/${speedId}`, "_blank");
  };
  const handleLinkClick = (event: any) => {
    if (event.ctrlKey) {
      window.open(`/data/speeds/${speedId}`, "_blank");
    } else {
      navigate(`/data/speeds/${speedId}`);
    }
  };

  return (
    <Button
      onAuxClick={handleOnAuxClick}
      onClick={(event) => handleLinkClick(event)}
      sx={{ mx: 0, px: 0 }}
    >
      <LinkIcon />
    </Button>
  );
}
