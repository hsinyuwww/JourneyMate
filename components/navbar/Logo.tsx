import Link from "next/link";
import { GiBarracksTent } from "react-icons/gi";
import { Button } from "../ui/button";

function Logo() {
  return (
    <Button size="icon" asChild>
      <Link href="/">
        <GiBarracksTent className="w-6 h-6" />
      </Link>
    </Button>
  );
}

export default Logo;
