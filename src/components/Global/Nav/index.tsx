import {
  NavContainer,
  NavContent,
  Logo,
  DetailsContainer,
  NavTextLink,
} from "./styles";
// Logo //
import logo from "../../../assets/logo.png";

const Nav = () => {
  return (
    <NavContainer>
      <NavContent>
        <Logo src={logo} alt="Logo" />
        <DetailsContainer>
          <NavTextLink>ReadMe</NavTextLink>
        </DetailsContainer>
      </NavContent>
    </NavContainer>
  );
};

export default Nav;
