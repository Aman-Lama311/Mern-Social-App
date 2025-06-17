import { Outlet } from "react-router-dom";
import LeftBar from "./LeftBar";

const MainLayout = () => {
  return (
    <div>
      <LeftBar />
      <Outlet></Outlet>
    </div>
  );
};
export default MainLayout;
