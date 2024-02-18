import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";

interface tagChipProsp {
  tag: string;
}
export default function TagChip({ tag }: tagChipProsp) {
  const navigate = useNavigate();

  return (
    <Chip
      onClick={() => {
        navigate(`/data/speeds/?tags=${tag}`);
      }}
      label={tag}
      variant="outlined"
    />
  );
}
