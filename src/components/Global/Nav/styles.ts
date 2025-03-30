import styled from "styled-components";

export const NavContainer = styled.nav`
  background: #fff;
  height: 60px;
  display: flex;
  font-size: 1rem;
  top: 0;
  z-index: 10;
  @media screen and (max-width: 960px) {
    transition: 0.9s all ease;
  }
`;

export const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
  width: 100%;
  padding: 15px 30px;
  @media screen and (max-width: 960px) {
    padding: 15px 10px;
  }
`;

export const Logo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  @media screen and (max-width: 960px) {
    height: 40px;
  }
`;

export const DetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const NavTextLink = styled.span`
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  padding: 0 10px;
  color: #5c2e99;
  &:hover {
    color: #888;
    text-decoration: underline;
    text-decoration-color: #5c2e99;
    text-underline-offset: 5px;
  }
`;
