import { Outlet } from "react-router-dom";
import styled from "styled-components";
import HeaderChat from "../UI/organisms/HeaderChat";


const StyledMain = styled.main`
 min-height: calc()(100vh - 100px);`;



const BaseOutlet = () => {
    return ( 
        <>
        <HeaderChat />
          <StyledMain>
            <Outlet />
          </StyledMain>
        </> 
    );
}
 
export default BaseOutlet;