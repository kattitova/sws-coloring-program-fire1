import "./style.scss";

import LeftContainer from "./components/left-container/left-container";
import CenterContainer from "./components/center-container/center-container";
import RightContainer from "./components/right-container/right-container";
import Footer from "./components/footer/footer";
import funcInit from "./components/functions";
import getFormConstructor from "./components/form-constructor";
import getDealerList from "./components/dealer-list/dealer-list";

if (localStorage.getItem("color") !== null) localStorage.removeItem("color");
LeftContainer.init();
CenterContainer.init();
RightContainer.init();
Footer.init();
getFormConstructor();
funcInit();
getDealerList();
