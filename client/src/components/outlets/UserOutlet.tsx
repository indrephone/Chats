import { Outlet } from "react-router-dom";
import styled from "styled-components";
import HeaderUser from "../UI/organisms/HeaderUser";



const StyledMain = styled.main`
 min-height: calc()(100vh - 100px);`;



const BaseOutlet = () => {
    return ( 
        <>
        <HeaderUser/>
          <StyledMain>
            <Outlet />
          </StyledMain>
        </> 
    );
}
 
export default BaseOutlet;