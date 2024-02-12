import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export default function AddedBy({ user }: { user: string }) {
  const navigate = useNavigate();

  const handleLinkToUserProfile = (username: string) => {
    navigate(`/profile/${username}/speeds`);
  };

  return (
    <Typography color={"#bb54e7"} variant="subtitle1" mt={2}>
      Added by:&nbsp;
      <Link
        href="#"
        onClick={() => {
          handleLinkToUserProfile(user);
        }}
        underline="none"
      >
        {user}
      </Link>
    </Typography>
  );
}
