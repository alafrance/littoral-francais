import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {useSidebar} from "../ui/sidebar.tsx";

export function ToggleSidebar() {
    const { toggleSidebar } = useSidebar()
    return (
      <button
        className={"absolute top-0 bg-white right-0 w-12 h-12 z-10 flex items-center justify-center rounded-bl-md cursor-pointer "}
        onClick={() => {
            toggleSidebar()
        }}
      >
          <FontAwesomeIcon icon={faBars} className={"w-8 h-8 text-black"}/>
      </button>
    )
}